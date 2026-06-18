/* ===========================================================================
   Assessment Analytics Module — shared kit (components + mock + CSS)
   Loads after app.js + 00-runtime + 01-home. Section screens & agents build on this.
   Navigation: Assessments ▸ Dashboard · Species · Animals · Records · Compare · Reports · Audit
   =========================================================================== */

injectCSS('css-aa', `
  /* module header + section tabs */
  .aahead{padding:54px 16px 0;background:var(--bg);position:relative;}
  .aahead-top{display:flex;align-items:center;gap:12px;}
  .aah-title{font-size:26px;font-weight:800;letter-spacing:-.5px;}
  .aah-sub{font-size:13px;color:var(--label-secondary);margin-top:1px;}
  .aah-actions{margin-left:auto;display:flex;gap:8px;}
  .aah-ico{width:40px;height:40px;border-radius:13px;background:var(--bg-elevated);border:1px solid var(--hairline);
    display:flex;align-items:center;justify-content:center;color:var(--label);cursor:pointer;}
  .aah-ico svg{width:18px;height:18px;}
  .aatabs{display:flex;gap:8px;overflow-x:auto;padding:14px 0 4px;margin:0 -2px;}
  .aatabs::-webkit-scrollbar{height:0;}
  .aatab{flex:0 0 auto;font-size:14px;font-weight:600;color:var(--label-secondary);padding:8px 14px;border-radius:20px;
    background:var(--bg-elevated);border:1px solid var(--hairline);cursor:pointer;white-space:nowrap;}
  .aatab.on{background:#000;color:#fff;border-color:#000;}

  /* filter bar */
  .aafilter{padding:10px 16px 6px;}
  .aafilter-chips{display:flex;gap:8px;overflow-x:auto;margin-top:10px;}
  .aafilter-chips::-webkit-scrollbar{height:0;}
  .aachip{flex:0 0 auto;font-size:13px;font-weight:600;color:var(--label-2);background:var(--bg-elevated);
    border:1px solid var(--hairline);border-radius:18px;padding:7px 13px;cursor:pointer;white-space:nowrap;}
  .aa-search{margin:10px 16px 2px;background:var(--bg-elevated);border:1px solid var(--hairline);border-radius:14px;
    display:flex;align-items:center;gap:9px;padding:11px 14px;color:var(--label-secondary);font-size:15px;}
  .aa-search svg{width:16px;height:16px;}

  /* KPI grid */
  .aakpis{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin:6px 16px 14px;}
  .aakpi{background:var(--bg-elevated);border:1px solid var(--hairline);border-radius:var(--radius);box-shadow:var(--shadow);padding:13px 14px;cursor:pointer;}
  .aakpi .ak-lab{font-size:12px;color:var(--label-secondary);font-weight:600;line-height:1.25;min-height:30px;}
  .aakpi .ak-val{font-size:25px;font-weight:800;letter-spacing:-.6px;margin-top:2px;}
  .aakpi .ak-val small{font-size:12px;font-weight:600;color:var(--label-secondary);margin-left:2px;}
  .aakpi .ak-delta{font-size:12px;font-weight:800;display:flex;align-items:center;gap:2px;margin-top:4px;}
  .aakpi .ak-delta svg{width:11px;height:11px;}
  .aakpi .ak-sub{font-size:11.5px;color:var(--label-tertiary);font-weight:600;margin-top:4px;}

  /* ranking list */
  .aarank .rankrow{display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer;}
  .aarank .rk-n{width:18px;font-size:12px;font-weight:800;color:var(--label-tertiary);flex:0 0 auto;text-align:center;}
  .aarank .rk-name{width:104px;font-size:13px;font-weight:600;color:var(--label);flex:0 0 auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .aarank .rk-track{flex:1;height:8px;border-radius:5px;background:var(--fill-tert);overflow:hidden;}
  .aarank .rk-fill{height:100%;border-radius:5px;}
  .aarank .rk-val{width:42px;text-align:right;font-size:13px;font-weight:800;flex:0 0 auto;}

  /* donut + legend */
  .aadonut{display:flex;align-items:center;gap:16px;}
  .aadonut .dl{flex:1;display:flex;flex-direction:column;gap:7px;}
  .aadonut .dl .lg{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--label-2);font-weight:600;}
  .aadonut .dl .lg i{width:9px;height:9px;border-radius:3px;flex:0 0 auto;}
  .aadonut .dl .lg b{margin-left:auto;color:var(--label);}

  /* comparison / labelled bars */
  .aabars2 .b2{display:flex;align-items:center;gap:10px;padding:7px 0;}
  .aabars2 .b2 .b2-name{width:90px;font-size:13px;color:var(--label-2);font-weight:600;flex:0 0 auto;}
  .aabars2 .b2 .b2-track{flex:1;height:8px;border-radius:5px;background:var(--fill-tert);overflow:hidden;}
  .aabars2 .b2 .b2-fill{height:100%;border-radius:5px;}
  .aabars2 .b2 .b2-val{width:46px;text-align:right;font-size:13px;font-weight:800;flex:0 0 auto;}

  /* big value row inside a card */
  .aabig{display:flex;align-items:baseline;gap:9px;margin-bottom:8px;}
  .aabig .v{font-size:27px;font-weight:800;letter-spacing:-.6px;}
  .aabig .s{font-size:13px;color:var(--label-secondary);font-weight:600;}

  /* records table */
  .aatable{font-size:13px;}
  .aatrow{display:flex;align-items:center;gap:10px;padding:12px 4px;border-top:1px solid var(--separator);cursor:pointer;}
  .aatrow:first-child{border-top:0;}
  .aatrow .tr-main{flex:1;min-width:0;}
  .aatrow .tr-id{font-size:11px;color:var(--label-tertiary);font-weight:700;}
  .aatrow .tr-name{font-size:14px;font-weight:700;}
  .aatrow .tr-sub{font-size:12px;color:var(--label-secondary);margin-top:1px;}
  .aatrow .tr-score{font-size:15px;font-weight:800;flex:0 0 auto;}
  .aastatus{font-size:11px;font-weight:800;padding:3px 9px;border-radius:8px;flex:0 0 auto;}
`);

/* ----------------------------- analytics mock ----------------------------- */
const AA_TYPES = [   // assessment-type performance (score 0–100, count, pass%)
  { name:'Body Condition', cat:'physical',   avg:78, count:842, pass:84 },
  { name:'Weight',         cat:'physical',   avg:88, count:1240,pass:96 },
  { name:'Eye Condition',  cat:'physical',   avg:91, count:610, pass:93 },
  { name:'Dental',         cat:'physical',   avg:64, count:188, pass:71 },
  { name:'Activity Level', cat:'behaviour',  avg:72, count:520, pass:78 },
  { name:'Stereotypy',     cat:'behaviour',  avg:59, count:206, pass:64 },
  { name:'Enrichment',     cat:'behaviour',  avg:81, count:470, pass:86 },
  { name:'Diet Adherence', cat:'nutrition',  avg:83, count:560, pass:88 },
  { name:'Food Intake',    cat:'nutrition',  avg:86, count:910, pass:92 },
  { name:'Stress',         cat:'mental',     avg:61, count:240, pass:66 },
  { name:'Enclosure Hygiene',cat:'environment',avg:80,count:430, pass:85 },
];
const AA_TREND = {
  welfare:    [72,73,74,76,75,77,79,77],
  completion: [82,84,83,88,86,90,89,90],
  compliance: [88,87,90,89,91,92,93,92],
  activity:   ACTIVITY_14,
};
function aaMonths(){ return monthLabels(8); }

/* org-level numbers from the existing collection */
function aaOrg(){
  const s = collectionStats();
  return {
    welfare:s.avg, coverage:88, compliance:92, total:4820,
    attention:s.attention.length, critical:COLLECTION.filter(a=>welfareIndex(a.welfare)<55).length,
    overdue:QUEUE.filter(q=>q.state==='overdue').length, active:RECORDS.length+312,
    dist:s.dist, domAvg:s.domAvg, count:s.count,
  };
}

/* ------------------------------ components -------------------------------- */
function aaGo(key,p){ go(key, p||{}, true); }   // tab switch replaces (back exits module)

const AA_SECTIONS = [['aaDash','Dashboard'],['aaSpecies','Species'],['aaAnimal','Animals'],
  ['aaRecords','Records'],['aaCompare','Compare'],['aaReports','Reports'],['aaAudit','Audit']];
function aaSecTabs(active){
  return `<div class="aatabs">${AA_SECTIONS.map(([k,l])=>`<div class="aatab ${k===active?'on':''}" onclick="aaGo('${k}')">${l}</div>`).join('')}</div>`;
}
function aaHeader(active,{title='Assessments',sub='',back=false}={}){
  return `<div class="aahead"><div class="aahead-top">
      ${back?`<div class="aah-ico" onclick="back()" style="margin-right:2px">${I.back}</div>`:''}
      <div style="flex:1;min-width:0"><div class="aah-title">${title}</div>${sub?`<div class="aah-sub">${sub}</div>`:''}</div>
      <div class="aah-actions">${back?'':`<div class="aah-ico" onclick="openNavMenu()">${I.grid}</div>`}</div>
    </div></div>`;
}
function aaPeriod(active='30d'){
  const ps=[['today','Today'],['7d','7D'],['30d','30D'],['month','Month'],['quarter','Qtr'],['year','Year']];
  return `<div class="range-seg" style="margin:0 16px">${ps.map(([k,l])=>`<button class="${k===active?'on':''}" onclick="event.stopPropagation()">${l}</button>`).join('')}</div>`;
}
function aaFilter(){
  return `<div class="aafilter">${aaPeriod()}
    <div class="aafilter-chips">
      <span class="aachip">All Sites ▾</span><span class="aachip">All Species ▾</span>
      <span class="aachip">All Types ▾</span><span class="aachip">All Status ▾</span></div></div>`;
}
function aaSearchSheet(){
  const fields=['Animal name','Animal ID','Species','Assessment ID','RFID / Microchip','Assessor'];
  return `<div class="sheet-grab"></div>
    <div class="sheet-head"><div class="sh-title">Search</div><div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="aa-search" style="margin:0 16px 12px">${I.search}<span>Search assessments, animals, species…</span></div>
    <div class="pill-list">${fields.map(f=>`<div class="pill-opt"><span style="color:var(--label-secondary)">${f}</span></div>`).join('')}</div>`;
}
function aaKpis(items){
  return `<div class="aakpis">${items.map(k=>`
    <div class="aakpi" ${k.go?`onclick="${k.go}"`:''}>
      <div class="ak-lab">${k.lab}</div>
      <div class="ak-val" ${k.color?`style="color:${k.color}"`:''}>${k.val}${k.unit?`<small>${k.unit}</small>`:''}</div>
      ${k.delta!=null?`<div class="ak-delta ${k.up?'delta-up':'delta-down'}">${k.up?I.arrowUp:I.arrowDn}${k.delta}</div>`
        : k.sub?`<div class="ak-sub">${k.sub}</div>`:''}
    </div>`).join('')}</div>`;
}
function aaRank(title, rows, {goExpr='', sub=''}={}){
  const max=Math.max(...rows.map(r=>r.val))||1;
  return hcard(title, sub, goExpr, `<div class="aarank">${rows.map((r,i)=>`
    <div class="rankrow" ${r.go?`onclick="${r.go}"`:''}>
      <span class="rk-n">${i+1}</span><span class="rk-name">${r.name}</span>
      <span class="rk-track"><span class="rk-fill" style="width:${Math.round(r.val/max*100)}%;background:${r.color||'var(--primary)'}"></span></span>
      <span class="rk-val" ${r.color?`style="color:${r.color}"`:''}>${r.disp!=null?r.disp:r.val}</span>
    </div>`).join('')}</div>`);
}
function aaDonut(segs,{size=104,sw=17}={}){
  const total=segs.reduce((s,x)=>s+x.val,0)||1, r=(size-sw)/2, C=2*Math.PI*r; let off=0, arcs='';
  segs.forEach(s=>{ const len=C*(s.val/total);
    arcs+=`<circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${sw}" stroke-linecap="butt"
      stroke-dasharray="${len.toFixed(1)} ${(C-len).toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}" transform="rotate(-90 ${size/2} ${size/2})"/>`;
    off+=len; });
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="flex:0 0 auto">${arcs}</svg>`;
}
function aaDistCard(title, segs, {goExpr=''}={}){
  const total=segs.reduce((s,x)=>s+x.val,0)||1;
  return hcard(title,'', goExpr, `<div class="aadonut">${aaDonut(segs)}
    <div class="dl">${segs.map(s=>`<div class="lg"><i style="background:${s.color}"></i>${s.label}<b>${Math.round(s.val/total*100)}%</b></div>`).join('')}</div></div>`);
}
function aaBars2(title, rows, {goExpr=''}={}){
  const max=Math.max(...rows.map(r=>r.val))||1;
  return hcard(title,'', goExpr, `<div class="aabars2">${rows.map(r=>`
    <div class="b2"><span class="b2-name">${r.name}</span>
      <span class="b2-track"><span class="b2-fill" style="width:${Math.round(r.val/max*100)}%;background:${r.color||'var(--primary)'}"></span></span>
      <span class="b2-val" ${r.color?`style="color:${r.color}"`:''}>${r.disp!=null?r.disp:r.val}</span></div>`).join('')}</div>`);
}
function aaTrendCard(title, sub, value, valColor, data, {from='#00D6C9', to='#37BD69', goExpr=''}={}){
  return hcard(title, sub, goExpr, `
    <div class="aabig"><span class="v" ${valColor?`style="color:${valColor}"`:''}>${value}</span></div>
    ${gradLine(data,{from,to})}`);
}
function aaFeed(title, items, {goExpr=''}={}){
  return hcard(title,'', goExpr, items.map(f=>`
    <div class="feed-row" style="padding-left:0;padding-right:0" ${f.go?`onclick="${f.go}"`:''}>
      <span class="f-ico" style="background:${f.color||'var(--primary)'}">${f.icon||I.doc}</span>
      <div class="f-main"><b>${f.title}</b>${f.sub?`<div style="font-size:12px;color:var(--label-secondary)">${f.sub}</div>`:''}</div>
      <span class="f-time">${f.time}</span></div>`).join(''));
}
function aaStatusColor(st){ return st==='Approved'?'#37BD69': st==='Under Review'?'#E4B819': st==='Rejected'?'#E93353':'#7A8684'; }
function aaStatusBg(st){ const c=aaStatusColor(st); return c+'22'; }
