/* ===========================================================================
   MASTER override — Records · Record Detail · Compare
   Loads LAST so SCREENS.aaRecords / aaRecordDetail / aaCompare win.
   Built ONLY with the Master kit (20-master-kit.js): mBack, mSearch, mTabs,
   mCard, mRow, mPillRow, mDistBars, mLegend, mDonutCard, mView, mArrow, mInfoIco,
   plus aaDonut / photoBox / ringMini. New CSS via injectCSS('css-mrA', tokens).
   Helpers prefixed mrA.
   =========================================================================== */

injectCSS('css-mrA', `
  /* info row — same rhythm as .m-row but no chevron (read-only meta) */
  .mrA-irow{display:flex;align-items:center;gap:12px;padding:13px 0;border-top:1px solid var(--separator);}
  .mrA-irow:first-child{border-top:0;}
  .mrA-irow .ic{width:28px;height:28px;border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;flex:0 0 auto;}
  .mrA-irow .ic svg{width:16px;height:16px;}
  .mrA-irow .dot{width:12px;height:12px;border-radius:50%;flex:0 0 auto;}
  .mrA-irow .lab{flex:1;font-size:15px;font-weight:500;color:var(--label);}
  .mrA-irow .val{font-size:15px;font-weight:700;flex:0 0 auto;text-align:right;}
  .mrA-irow .val small{display:block;font-size:11px;font-weight:600;color:var(--label-secondary);margin-top:1px;}

  /* audit timeline row */
  .mrA-tl{position:relative;padding-left:30px;}
  .mrA-tl::before{content:"";position:absolute;left:13px;top:8px;bottom:8px;width:2px;background:var(--separator);}
  .mrA-tlrow{position:relative;padding:0 0 18px;}
  .mrA-tlrow:last-child{padding-bottom:0;}
  .mrA-tlrow .badge{position:absolute;left:0;top:1px;width:28px;height:28px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;}
  .mrA-tlrow .t{font-size:14px;font-weight:600;color:var(--label);}
  .mrA-tlrow .s{font-size:12px;color:var(--label-secondary);margin-top:2px;}
  .mrA-tlrow .h{font-size:11px;color:var(--label-tertiary);font-family:ui-monospace,Menlo,monospace;margin-top:3px;}

  /* attachment thumbs */
  .mrA-thumbs{display:flex;gap:12px;flex-wrap:wrap;}
  .mrA-th{display:flex;flex-direction:column;align-items:center;gap:6px;}
  .mrA-th .cap{font-size:11px;color:var(--label-secondary);}

  /* two entity summary cards */
  .mrA-two{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:0 16px 16px;}
  .mrA-ent{background:var(--bg-elevated);border:1px solid var(--hairline);border-radius:16px;box-shadow:var(--shadow);
    padding:18px 14px;text-align:center;}
  .mrA-ent .ph{display:flex;justify-content:center;margin-bottom:10px;}
  .mrA-ent .ring{display:flex;justify-content:center;margin:6px 0 10px;}
  .mrA-ent .nm{font-size:16px;font-weight:700;letter-spacing:-.2px;}
  .mrA-ent .sub{font-size:11.5px;color:var(--label-secondary);margin-top:2px;font-style:italic;}
  .mrA-ent .pill{display:inline-block;font-size:11px;font-weight:800;padding:4px 10px;border-radius:9px;margin-top:10px;}

  /* comparison row — A value | label | B value, winner highlighted */
  .mrA-cmp{display:flex;align-items:center;gap:10px;padding:13px 0;border-top:1px solid var(--separator);}
  .mrA-cmp:first-child{border-top:0;}
  .mrA-cmp .a,.mrA-cmp .b{flex:0 0 auto;width:62px;font-size:18px;font-weight:800;letter-spacing:-.3px;color:var(--label);}
  .mrA-cmp .a{text-align:left;} .mrA-cmp .b{text-align:right;}
  .mrA-cmp .a.win,.mrA-cmp .b.win{color:#37BD69;}
  .mrA-cmp .lab{flex:1;text-align:center;font-size:13px;font-weight:600;color:var(--label-secondary);}

  /* two donuts side by side */
  .mrA-dd{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .mrA-dcell{text-align:center;}
  .mrA-dcell .dn{position:relative;width:120px;height:120px;margin:0 auto 8px;}
  .mrA-dcell .dn .ctr{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
  .mrA-dcell .dn .ctr .dv{font-size:22px;font-weight:800;letter-spacing:-.4px;}
  .mrA-dcell .nm{font-size:13px;font-weight:700;}
`);

/* status palette (mirrors 21-master-screens M_TAGC) */
const MRA_TAGC = {Approved:'#37BD69','Under Review':'#E4B819',Rejected:'#E93353',Draft:'#7A8684'};
function mrAStatusFor(i){ return ['Approved','Approved','Under Review','Approved','Draft','Approved','Rejected','Approved','Under Review','Approved','Approved','Under Review'][i%12]; }
function mrASiteFor(animalId){
  const a=getAnimal(animalId), e=(a.encl||'')[0];
  return ({A:'Riverside Zoo',P:'Summit Conservancy',M:'Highland Wildlife',R:'Savanna Park',V:'Coastal Aquarium'})[e]
    || SITES[Math.abs(hashStr(animalId))%SITES.length].name;
}

/* the full register: base RECORDS + synthesized rows from AA_TYPES × ANIMALS */
function mrAAll(){
  const out = RECORDS.map(r=>({ id:r.id, animalId:r.animalId, sub:r.sub, type:r.type,
    value:r.value, score:r.score, pass:r.pass, status:r.status,
    assessor:r.assessor, role:r.role, when:r.when, finding:r.finding }));
  const animals=Object.values(ANIMALS); let n=100479;
  AA_TYPES.forEach((t,ti)=>{
    const a=animals[(ti*3+1)%animals.length], as=ASSESSORS[ti%ASSESSORS.length];
    const score=Math.max(28,Math.min(99,t.avg+(((ti*53)%17)-8)));
    out.push({ id:'AS-'+(n--), animalId:a.id, sub:t.name, type:t.cat,
      value: t.name==='Body Condition'?'5 / 9':(t.cat==='nutrition'?(80+ti)+' g/kg':(score>=70?'Good':'Fair')),
      score, pass:score>=60, status:mrAStatusFor(ti+RECORDS.length),
      assessor:as.name, role:as.role,
      when:['8 Jun 2026 · 3:1','7 Jun 2026 · 2:0','6 Jun 2026 · 11:','5 Jun 2026 · 9:4'][ti%4]+(ti%6)+(ti%2?' PM':' AM'),
      finding: score<60 ? (t.name+' below threshold') : null });
  });
  return out;
}
function mrADate(when){ return (when||'').split('·')[0].trim(); }

/* filter sheet (mock — Apply just closes) */
function mrAFilterSheet(){
  const grp=(lab,opts)=>`<div style="padding:4px 16px 6px">
    <div style="font-size:12px;font-weight:700;color:var(--label-secondary);letter-spacing:.2px;margin:14px 0 9px;text-transform:uppercase">${lab}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">${opts.map((o,i)=>
      `<span class="recA2-fchip ${i===0?'on':''}">${o}</span>`).join('')}</div></div>`;
  return `<div class="sheet-grab"></div>
    <div class="sheet-head"><div><div class="sh-title">Filters</div>
      <div class="sh-sub">Refine the assessment register</div></div>
      <div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    ${grp('Date Range',['30 Days','7 Days','Quarter','Year','All Time'])}
    ${grp('Site',['All Sites',...SITES.map(s=>s.name)])}
    ${grp('Species',['All Species',...Object.values(SPECIES).map(s=>s.name)])}
    ${grp('Type',['All Types',...DOMAIN_ORDER.map(d=>CATS[d].name)])}
    ${grp('Status',['All Status','Approved','Under Review','Draft','Rejected'])}
    <div class="sheet-actions"><button class="confirm" onclick="closeSheet()">Apply Filters</button></div>`;
}

/* ------------------------------- RECORDS LIST ----------------------------- */
SCREENS.aaRecords = (params={}) => {
  const all = mrAAll();
  const total = 317;

  // status distribution (top card)
  const dist = {Approved:0,'Under Review':0,Draft:0,Rejected:0};
  all.forEach(r=>{ dist[r.status]=(dist[r.status]||0)+1; });
  const distSeg = [
    {label:'Approved',color:MRA_TAGC.Approved,val:dist.Approved},
    {label:'Under Review',color:MRA_TAGC['Under Review'],val:dist['Under Review']},
    {label:'Draft',color:MRA_TAGC.Draft,val:dist.Draft},
    {label:'Rejected',color:MRA_TAGC.Rejected,val:dist.Rejected},
  ];

  // record list — Master thumb rows (photoBox, not emoji)
  const rows = all.slice(0,12).map(r=>{
    const a=getAnimal(r.animalId), c=aaStatusColor(r.status);
    return `<div class="m-thumb" onclick="go('aaRecordDetail',{id:'${r.id}'})">
      ${photoBox(a.name,{size:46,radius:12})}
      <div class="tb-body"><div class="tb-name">${a.name}</div>
        <div class="tb-sub">${a.species} · ${CATS[r.type].name} · ${r.sub} · ${mrADate(r.when)}</div>
        <span class="tb-tag" style="background:${c}22;color:${c}">${r.status}</span></div>
      <span class="m-chev">${I.chevron}</span></div>`;
  }).join('');

  return `<div class="screen active"><div class="scroll">
    ${mBack('Assessment Records', null, {back:true})}
    ${mSearch('Search ID, animal, species, assessor')}

    ${mPillRow('5', 'Date · Site · Species · Type · Status filters', "openSheet(mrAFilterSheet())")}
    <div style="height:14px"></div>

    ${mCard('Status','Distribution', '', mDistBars(distSeg.filter(s=>s.val>0)) + mLegend(distSeg))}

    ${mCard('Records', total+' total', mView(), rows)}

    <div style="height:18px"></div>
  </div></div>`;
};

/* ------------------------------ RECORD DETAIL ----------------------------- */
function mrAInfoRow(o){
  const ic = o.icon ? `<span class="ic" style="background:${o.color}">${o.icon}</span>`
    : `<span class="dot" style="background:${o.color||'var(--label-tertiary)'}"></span>`;
  return `<div class="mrA-irow">${ic}<span class="lab">${o.label}</span>
    <span class="val" ${o.vcolor?`style="color:${o.vcolor}"`:''}>${o.value}${o.sub?`<small>${o.sub}</small>`:''}</span></div>`;
}
function mrAAuditRow(o){
  return `<div class="mrA-tlrow"><span class="badge" style="background:${o.color}">${o.letter}</span>
    <div class="t">${o.title}</div><div class="s">${o.sub}</div><div class="h">${o.hash}</div></div>`;
}

SCREENS.aaRecordDetail = ({id}={}) => {
  const r = id ? recordById(id) : RECORDS[0];
  const a = getAnimal(r.animalId), c = aaStatusColor(r.status), cat = CATS[r.type];
  const site = mrASiteFor(r.animalId);
  const passColor = r.pass ? '#37BD69' : '#E93353';

  // summary meta rows
  const summary = [
    mrAInfoRow({icon:cat.icon, color:cat.raw, label:'Type', value:cat.name}),
    mrAInfoRow({icon:I.doc, color:'var(--label-tertiary)', label:'Sub-Type', value:r.sub}),
    mrAInfoRow({icon:I.paw, color:'var(--primary)', label:'Animal', value:a.name, sub:a.species}),
    mrAInfoRow({icon:I.check, color:'var(--secondary)', label:'Assessor', value:r.assessor, sub:r.role}),
    mrAInfoRow({icon:I.leaf, color:'#00D6C9', label:'Site', value:site}),
    mrAInfoRow({icon:I.cal, color:'var(--addblue)', label:'Date', value:mrADate(r.when)}),
    mrAInfoRow({icon:I.star, color:cat.raw, label:'Score', value:r.score, vcolor:passColor, sub:r.pass?'Pass':'Fail'}),
  ].join('');

  // item responses (synthesized but plausible)
  const responses = [
    mrAInfoRow({dot:true, color:'#37BD69', label:'Body Condition', value:'5 / 9'}),
    mrAInfoRow({dot:true, color:'#37BD69', label:'Coat / Plumage', value:'Good'}),
    mrAInfoRow({dot:true, color:r.pass?'#37BD69':'#E4B819', label:'Hydration', value:r.pass?'Normal':'Low'}),
    mrAInfoRow({dot:true, color:'#37BD69', label:'Mobility', value:'Unrestricted'}),
    mrAInfoRow({dot:true, color:r.pass?'#37BD69':'#FA6140', label:r.sub, value:r.value, vcolor:passColor}),
  ].join('');

  // attachments
  const thumbs = `<div class="mrA-thumbs">
    ${['Photo','Photo','Form'].map((cap,i)=>`<div class="mrA-th">${photoBox(a.name+i,{size:64,radius:12})}<span class="cap">${cap}</span></div>`).join('')}
  </div>`;

  // audit trail
  const audit = `<div class="mrA-tl">
    ${mrAAuditRow({letter:'C', color:'#7A8684', title:'Created', sub:'J. Alvarez · Keeper', hash:'#a1f0…3c9'})}
    ${mrAAuditRow({letter:'S', color:'var(--addblue)', title:'Submitted', sub:r.assessor+' · '+mrADate(r.when), hash:'#b7e2…81d'})}
    ${mrAAuditRow({letter:'R', color:'#E4B819', title:'Reviewed', sub:'Dr. L. Owens · Veterinarian', hash:'#c3a9…6f4'})}
    ${mrAAuditRow({letter:'A', color:'#37BD69', title:r.status==='Rejected'?'Rejected':'Approved', sub:'Dr. R. Mehta · '+mrADate(r.when), hash:'#d0fb…2ae'})}
  </div>`;

  return `<div class="screen active"><div class="scroll">
    ${mBack(r.sub, r.id, {back:true})}

    ${mCard('Summary', cat.name+' · '+mrADate(r.when), `<span class="recA2-hpill" style="background:${c}22;color:${c}">${r.status}</span>`, summary)}

    ${mCard('Responses','Item results', '', responses)}

    ${mCard('Attachments','3 files', '', thumbs)}

    ${mCard('Audit Trail','Tamper-evident', mInfoIco(), audit)}

    <div style="height:18px"></div>
  </div></div>`;
};

/* --------------------------------- COMPARE -------------------------------- */
let mrAMode = 'species';
function mrASetMode(m){ mrAMode = m; render(); }

/* avg domain scores for a set of animals */
function mrAAvgDom(inds){ const d={}; DOMAIN_ORDER.forEach(x=>d[x]=Math.round(inds.reduce((s,a)=>s+a.welfare[x],0)/inds.length)); return d; }

/* resolve the two entities being compared for the active mode */
function mrAEntities(){
  if(mrAMode==='site'){
    const A=SITES[0], B=SITES[3];
    return [
      {name:A.name, sub:A.animals+' animals', idx:A.welfare, dom:null,
       metrics:{welfare:A.welfare, assess:A.completion, coverage:A.completion, compliance:A.compliance, freq:A.onTime},
       risk:[{label:'Low',color:'#37BD69',val:100-A.risk-12},{label:'Watch',color:'#E4B819',val:12},{label:'High',color:'#E93353',val:A.risk}]},
      {name:B.name, sub:B.animals+' animals', idx:B.welfare, dom:null,
       metrics:{welfare:B.welfare, assess:B.completion, coverage:B.completion, compliance:B.compliance, freq:B.onTime},
       risk:[{label:'Low',color:'#37BD69',val:100-B.risk-20},{label:'Watch',color:'#E4B819',val:20},{label:'High',color:'#E93353',val:B.risk}]},
    ];
  }
  if(mrAMode==='animal'){
    const A=getAnimal('gorilla-1'), B=getAnimal('redpanda-1');
    const ent=a=>{ const idx=welfareIndex(a.welfare);
      return {name:a.name, sub:a.species, idx, dom:a.welfare,
        metrics:{welfare:idx, assess:Math.round(idx*0.96), coverage:Math.round(idx*1.05>100?98:idx*1.05), compliance:Math.round(idx*1.02>100?99:idx*1.02), freq:Math.round(idx*0.9)},
        risk:[{label:'Low',color:'#37BD69',val:Math.max(0,idx-10)},{label:'Watch',color:'#E4B819',val:Math.round((100-idx)*0.6)},{label:'High',color:'#E93353',val:Math.round((100-idx)*0.4)}]}; };
    return [ent(A), ent(B)];
  }
  // species (default) — Lion vs Western Gorilla
  const mk=sp=>{ const inds=Object.values(ANIMALS).filter(a=>a.sp===sp); const dom=mrAAvgDom(inds); const idx=welfareIndex(dom);
    return {name:SPECIES[sp].name, sub:SPECIES[sp].latin+' · '+inds.length+' animals', idx, dom,
      metrics:{welfare:idx, assess:Math.round(idx*0.95), coverage:Math.round(idx*0.92), compliance:Math.round(idx*1.04>100?99:idx*1.04), freq:Math.round(idx*0.88)},
      risk:[{label:'Low',color:'#37BD69',val:Math.max(0,idx-8)},{label:'Watch',color:'#E4B819',val:Math.round((100-idx)*0.6)},{label:'High',color:'#E93353',val:Math.round((100-idx)*0.4)}]}; };
  return [mk('lion'), mk('gorilla')];
}

function mrAEntCard(e){
  const col=welfareColor(e.idx);
  return `<div class="mrA-ent">
    <div class="ph">${photoBox(e.name,{size:54,radius:14})}</div>
    <div class="ring">${ringMini(e.idx/100, col, {size:58, label:String(e.idx), fs:17})}</div>
    <div class="nm">${e.name}</div><div class="sub">${e.sub}</div>
    <span class="pill" style="background:${col}22;color:${col}">${welfareLabel(e.idx)}</span></div>`;
}
function mrACmpRow(label, av, bv, unit){
  const aw=av>=bv, bw=bv>=av;
  return `<div class="mrA-cmp"><span class="a ${aw?'win':''}">${av}${unit||''}</span>
    <span class="lab">${label}</span><span class="b ${bw?'win':''}">${bv}${unit||''}</span></div>`;
}
function mrADonutCell(e){
  return `<div class="mrA-dcell"><div class="dn">${aaDonut(e.risk,{size:120,sw:15})}
      <div class="ctr"><div class="dv" style="color:${welfareColor(e.idx)}">${e.idx}</div></div></div>
    <div class="nm">${e.name}</div></div>`;
}

SCREENS.aaCompare = (params={}) => {
  const [A,B] = mrAEntities();
  const seg = [['species','Species'],['site','Site'],['animal','Animal']];
  const m = A.metrics, n = B.metrics;

  return `<div class="screen active"><div class="scroll">
    ${mBack('Comparisons','Benchmarking', {back:true})}

    <div class="range-seg">${seg.map(([k,l])=>`<button class="${k===mrAMode?'on':''}" onclick="mrASetMode('${k}')">${l}</button>`).join('')}</div>

    <div class="mrA-two">${mrAEntCard(A)}${mrAEntCard(B)}</div>

    ${mCard('Metric Comparison', A.name+' vs '+B.name, '', `
      ${mrACmpRow('Welfare Score', m.welfare, n.welfare)}
      ${mrACmpRow('Assessment Score', m.assess, n.assess)}
      ${mrACmpRow('Coverage', m.coverage, n.coverage, '%')}
      ${mrACmpRow('Compliance', m.compliance, n.compliance, '%')}
      ${mrACmpRow('Frequency', m.freq, n.freq, '%')}`)}

    ${mCard('Risk Distribution','A vs B', mInfoIco(), `<div class="mrA-dd">${mrADonutCell(A)}${mrADonutCell(B)}</div>
      ${mLegend([{label:'Low',color:'#37BD69'},{label:'Watch',color:'#E4B819'},{label:'High',color:'#E93353'}])}`)}

    <div style="height:18px"></div>
  </div></div>`;
};
