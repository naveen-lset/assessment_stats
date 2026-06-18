/* ===========================================================================
   ASSESSMENT MODULE — Animal Assessment Stats  [SCREENS.amStats]
   Reached from the animal page header Stats icon (33-am-animal.js).
   "All assessments based on the animal" — a lifetime, glanceable readout.

   Design system: reuses dashboard kit (welfareDial, dashSpark, lollipopChart,
   donutChart, d2card, ostat/ocell, drow, am-list/timeline) + Antz palette.

   NO STATUS LIFECYCLE. Stats = counts / scores / coverage / trends only.
   Mode-aware sub-types (the key domain rule): a sub-type's response type sets
   how it reads —  Scored (numeric scale / mapped list) · Monitored (value vs
   target range) · Descriptive (text / category, never scored).
   =========================================================================== */
injectCSS('css-am-stats', `
  .st-id{display:flex;align-items:center;gap:13px;background:#fff;border-radius:18px;box-shadow:var(--shadow);margin:0 16px 14px;padding:15px;}
  .st-id .si-b{flex:1;min-width:0;}
  .st-id .si-n{font-size:19px;font-weight:800;letter-spacing:-.3px;}
  .st-id .si-s{font-size:12px;color:var(--label-secondary);font-weight:600;margin-top:2px;}
  .st-id .si-tags{display:flex;align-items:center;gap:6px;margin-top:8px;flex-wrap:wrap;}

  .st-dial{display:flex;flex-direction:column;align-items:center;gap:12px;}
  .st-leg{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;width:100%;margin-top:2px;}
  .st-leg .lr{display:flex;align-items:center;gap:8px;}
  .st-leg .lr i{width:9px;height:9px;border-radius:3px;flex:0 0 auto;}
  .st-leg .lr .ln{flex:1;font-size:12.5px;color:var(--label-secondary);font-weight:600;}
  .st-leg .lr .lv{font-size:13.5px;font-weight:800;}

  /* mode-aware sub-type rows */
  .st-row{display:flex;align-items:center;gap:11px;padding:12px 0;border-top:1px solid var(--separator);}
  .st-row:first-child{border-top:0;}
  .st-row .sr-ic{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;}
  .st-row .sr-ic svg{width:16px;height:16px;}
  .st-row .sr-b{flex:1;min-width:0;}
  .st-row .sr-n{font-size:14px;font-weight:700;}
  .st-row .sr-m{font-size:11px;color:var(--label-tertiary);font-weight:700;margin-top:1px;text-transform:uppercase;letter-spacing:.3px;}
  .st-row .sr-r{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex:0 0 auto;}
  .st-row .sr-val{font-size:20px;font-weight:800;letter-spacing:-.4px;min-width:22px;text-align:right;}
  .st-row .sr-tr{font-size:11.5px;font-weight:800;display:flex;align-items:center;gap:2px;}
  .st-row .sr-tr svg{width:10px;height:10px;}
  .st-chip{font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:8px;white-space:nowrap;}
  .st-readings{font-size:11.5px;color:var(--label-tertiary);font-weight:700;}

  .st-split{display:flex;align-items:center;gap:16px;}
  .st-split .sp-leg{flex:1;}
  .st-act-h{display:flex;align-items:baseline;justify-content:space-between;margin-top:2px;}
  .st-act-h .v{font-size:24px;font-weight:800;letter-spacing:-.5px;}
  .st-act-h .l{font-size:11.5px;color:var(--label-secondary);font-weight:600;}
`);

/* response-type / scoring mode per sub-type (drives the readout shape) */
const STAT_SUBTYPE_MODE = {
  'Weight':'monitored', 'Food Intake':'monitored',
  'Body Condition':'scored', 'Activity Level':'scored', 'Enrichment Response':'scored',
  'Diet Quality':'scored', 'Enclosure Hygiene':'scored',
  'Eye Condition':'descriptive', 'Stress Indicators':'descriptive',
};
/* descriptive sub-types read out a category, never a score */
const STAT_DESC_LABEL = {
  'Eye Condition':     s => s>=70?'Good': s>=55?'Fair':'Poor',
  'Stress Indicators': s => s>=70?'Low' : s>=55?'Moderate':'Elevated',
};
function statModeOf(type){ return STAT_SUBTYPE_MODE[type] || 'scored'; }
/* short deterministic series ending at the latest score (for mini sparklines) */
function statMicroSeries(seed, end){
  const s=Math.abs(hashStr(seed)), arr=[];
  for(let i=5;i>=0;i--) arr.push(Math.max(30, Math.min(98, end - i*2 + ((s+i*13)%7) - 3)));
  arr[arr.length-1]=end; return arr;
}
/* monitored sub-types: value read against a target band */
function statRangePill(score){
  const m = score>=70 ? {t:'In range', c:'#37BD69'} : score>=55 ? {t:'Monitor', c:'#E4B819'} : {t:'Below band', c:'#FA6140'};
  return `<span class="st-chip" style="background:${m.c}1f;color:${m.c}">${m.t}</span>`;
}
/* per-animal monthly assessment activity (lifetime feel, deterministic) */
function statActivity(a){
  const s=Math.abs(hashStr(a.id)), data=[];
  for(let i=0;i<6;i++) data.push(2 + ((s + i*5) % 6));
  return { data, labels:['Jan','Feb','Mar','Apr','May','Jun'], total:data.reduce((x,y)=>x+y,0) };
}

SCREENS.amStats = (params={}) => {
  const a   = getAnimal(params.animalId);
  const idx = welfareIndex(a.welfare);
  const recs = amRecords({animalId:a.id});                 // lifetime, newest first
  const doms = DASH_DOMS.map(d => { const ser=amDomSeries(a.id,d.key);
    return {...d, cur:a.welfare[d.key], prev:ser[ser.length-2]}; });
  const covered = DASH_DOMS.filter(d => recs.some(r=>r.domain===d.key)).length;
  const last = recs[0];
  const risk = amRiskOf(a);

  /* ---- header + animal identity ---- */
  const head = `<div class="d2-top" style="padding-top:54px">
      <span class="am-back" onclick="back()">${I.back}</span>
      <div><div class="d2-t">Assessment Stats</div><div class="d2-sub">All assessments · lifetime</div></div>
      <div style="margin-left:auto" class="d2-menu" onclick="openNavMenu()">${I.grid}</div></div>
    <div class="st-id">${imgBox(a.sp,56,15)}
      <div class="si-b"><div class="si-n">${a.name}</div>
        <div class="si-s">${a.species} · ${a.sex} · ${a.encl}</div>
        <div class="si-tags">${scorePill(idx)}${riskPill(a)}<span class="st-readings">Last ${a.seen}d ago</span></div></div></div>`;

  /* ---- welfare dial + five-domain legend ---- */
  const legend = doms.map(d=>`<div class="lr"><i style="background:${d.color}"></i>
      <span class="ln">${d.short}</span><span class="lv" style="color:${welfareColor(d.cur)}">${d.cur}</span></div>`).join('');
  const dialCard = `<div class="d2card">
      <div class="d2card-h"><div><div class="ttl">Welfare Index</div><div class="sub">Five-domain balance · ${welfareLabel(idx)}</div></div></div>
      <div class="st-dial">${welfareDial(a.welfare,{size:168,light:true})}
        <div class="st-leg">${legend}</div></div></div>`;

  /* ---- KPI grid (counts / coverage / score — NO status) ---- */
  const kpis = [
    {lab:'Total Assessments', val:recs.length, color:'#00AFD6', ic:I.doc,  sub:'lifetime', go:`go('amList',{animalId:'${a.id}',title:'${a.name} · Assessments'})`},
    {lab:'Domains',           val:`${covered}/5`, color:'#37BD69', ic:I.grid, sub:'covered of five'},
    {lab:'Avg Welfare Score', val:idx, color:welfareColor(idx), ic:I.heart, sub:welfareLabel(idx)},
    {lab:'Last Assessed',     val:`${a.seen}d`, color:risk.color, ic:I.clock, sub:last?last.type:'—', go:last?`openAssessment('${last.id}')`:''},
  ];
  const kpiGrid = `<div class="ostat">${kpis.map(c=>`
    <div class="ocell" ${c.go?`style="cursor:pointer" onclick="${c.go}"`:''}>
      <div class="oc-top"><span class="oc-ic" style="background:${c.color}1f;color:${c.color}">${c.ic}</span><span class="oc-lab">${c.lab}</span></div>
      <div class="oc-val">${c.val}</div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span class="oc-d" style="color:var(--label-tertiary)">${c.sub}</span>
        ${c.go?`<span style="color:var(--label-tertiary);display:flex">${I.chevron}</span>`:''}</div>
    </div>`).join('')}</div>`;

  /* ---- domain breakdown rows → domain history ---- */
  const domRows = doms.map(d=>{ const tp=Math.round((d.cur-d.prev)/d.prev*1000)/10, up=tp>=0;
    return `<div class="drow" style="cursor:pointer" onclick="go('amDomainHistory',{animalId:'${a.id}',domain:'${d.key}'})">
      <span class="di" style="background:${d.color}1f;color:${d.color}">${CATS[d.key].icon}</span>
      <div class="dn-n">${d.name}<div class="dn-prev">prev ${d.prev}</div></div>
      <span class="dn-cur" style="color:${welfareColor(d.cur)}">${d.cur}</span>
      <span class="dn-tr ${up?'up':'dn'}">${up?I.arrowUp:I.arrowDn}${Math.abs(tp)}%</span></div>`;}).join('');
  const domCard = `<div class="d2card"><div class="d2card-h"><div><div class="ttl">Domain Breakdown</div><div class="sub">Tap a domain for history</div></div></div><div style="margin-top:4px">${domRows}</div></div>`;

  /* ---- mode-aware sub-type readings (the key rule) ---- */
  const subRows = recs.map(r=>{
    const c=CATS[r.domain], mode=statModeOf(r.type);
    let right='';
    if(mode==='descriptive'){
      const lab=(STAT_DESC_LABEL[r.type]||(s=>s))(r.score);
      const labCol=welfareColor(r.score), n=2+(Math.abs(hashStr(a.id+r.type))%6);
      right=`<span class="st-chip" style="background:${labCol}1f;color:${labCol}">${lab}</span><span class="st-readings">${n} readings</span>`;
    } else if(mode==='monitored'){
      right=`${statRangePill(r.score)}<span class="sr-val" style="color:${welfareColor(r.score)}">${r.score}</span>`;
    } else { // scored — value + trend vs previous reading
      const ser=statMicroSeries(a.id+r.type, r.score), prev=ser[ser.length-2];
      const tp=Math.round((r.score-prev)/prev*1000)/10, up=tp>=0;
      right=`<span class="sr-tr ${up?'up':'dn'}">${up?I.arrowUp:I.arrowDn}${Math.abs(tp)}%</span><span class="sr-val" style="color:${welfareColor(r.score)}">${r.score}</span>`;
    }
    return `<div class="st-row">
      <span class="sr-ic" style="background:${c.raw}1f;color:${c.raw}">${c.icon}</span>
      <div class="sr-b"><div class="sr-n">${r.type}</div><div class="sr-m">${c.name} · ${mode}</div></div>
      <div class="sr-r">${right}</div></div>`;
  }).join('');
  const subCard = `<div class="d2card"><div class="d2card-h"><div><div class="ttl">Sub-Type Readings</div><div class="sub">Each reads by its response type</div></div></div>
    <div style="margin-top:2px">${subRows||'<div style="padding:18px 0;text-align:center;color:var(--label-secondary);font-size:13px">No readings recorded.</div>'}</div></div>`;

  /* ---- assessment activity (lollipop) ---- */
  const act = statActivity(a);
  const actCard = `<div class="d2card"><div class="d2card-h"><div><div class="ttl">Assessment Activity</div><div class="sub">Records logged · last 6 months</div></div></div>
    <div class="st-act-h"><span class="v">${act.total}</span><span class="l">assessments recorded</span></div>
    ${lollipopChart(act.data,{labels:act.labels,baseColor:'#37BD69',h:150,colorFn:(v)=>v>=6?'#37BD69':v>=4?'#00D6C9':'#E4B819'})}</div>`;

  /* ---- records by domain (donut) ---- */
  const byDom = DASH_DOMS.map(d=>({key:d.key,label:d.short,color:d.color,val:recs.filter(r=>r.domain===d.key).length}))
    .filter(s=>s.val>0);
  const dTotal = byDom.reduce((s,x)=>s+x.val,0)||1;
  byDom.forEach(s=>s.pct=Math.round(s.val/dTotal*100));
  const donutCard = `<div class="d2card"><div class="d2card-h"><div><div class="ttl">Records by Domain</div><div class="sub">${recs.length} total</div></div></div>
    <div class="st-split" style="margin-top:6px">${donutChart(byDom,{size:128,sw:20})}
      <div class="sp-leg">${byDom.map(s=>`<div class="lr" style="display:flex;align-items:center;gap:8px;padding:5px 0">
        <i style="width:9px;height:9px;border-radius:3px;background:${s.color};flex:0 0 auto"></i>
        <span style="flex:1;font-size:12.5px;color:var(--label-secondary);font-weight:600">${s.label}</span>
        <span style="font-size:13px;font-weight:800">${s.val}</span></div>`).join('')}</div></div></div>`;

  /* ---- history timeline ---- */
  const tlItems = recs.map(r=>({date:r.date, title:r.type, score:r.score, color:CATS[r.domain].raw, icon:CATS[r.domain].icon, recId:r.id}));
  const histCard = `<div class="d2card-h" style="margin:2px 16px 10px"><div><div class="ttl">Assessment History</div><div class="sub">${recs.length} records · newest first</div></div></div>
    ${recs.length?timeline(tlItems):'<div class="am-list"><div style="padding:22px;text-align:center;color:var(--label-secondary);font-size:13px">No assessment history.</div></div>'}`;

  return `<div class="screen active"><div class="scroll dash2">
    ${head}${dialCard}${kpiGrid}${domCard}${subCard}${actCard}${donutCard}${histCard}
    <div style="height:14px"></div>
  </div></div>`;
};
