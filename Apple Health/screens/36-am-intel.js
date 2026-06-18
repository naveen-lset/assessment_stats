/* ===========================================================================
   ASSESSMENT ANALYTICS — "Animal Assessment Intelligence Center" (loads LAST).
   Overrides SCREENS.amAnimal. Re-keys the page from data-shape (per-domain charts)
   to user-intent: Insights → Changes → Context → Analytics → Raw Data.
   Analytics are grouped by RESPONSE TYPE (Numeric Value · Numeric Scale · List ·
   Text) so the page stays a constant size as templates grow. Reuses the dashboard
   kit (d2card, dashTip, dashSpark, radarChart, trendChart, donutChart, hbars).
   See docs/assessment-analytics-redesign-framing.md.
   =========================================================================== */
injectCSS('css-am-intel', `
  /* snapshot */
  .ai-snap{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px;margin:0 16px 14px;}
  .ai-snap .sc{background:#fff;border-radius:14px;box-shadow:var(--shadow);padding:12px 12px 11px;}
  .ai-snap .sc-l{font-size:10.5px;color:var(--label-tertiary);font-weight:700;text-transform:uppercase;letter-spacing:.3px;line-height:1.25;}
  .ai-snap .sc-v{font-size:20px;font-weight:800;letter-spacing:-.5px;margin-top:7px;line-height:1.05;}
  .ai-snap .sc-s{font-size:10.5px;color:var(--label-secondary);font-weight:600;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  /* quick insights */
  .qi-row{display:flex;align-items:center;gap:11px;padding:11px 0;border-top:1px solid var(--separator);}
  .qi-row:first-child{border-top:0;}
  .qi-ic{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;font-size:16px;}
  .qi-b{flex:1;min-width:0;}
  .qi-l{font-size:12px;color:var(--label-secondary);font-weight:600;}
  .qi-v{font-size:14.5px;font-weight:800;letter-spacing:-.2px;margin-top:1px;}
  /* response-type analytics */
  .rt-seg{display:flex;gap:3px;background:var(--fill-tert);border-radius:11px;padding:3px;margin:0 16px 12px;}
  .rt-seg button{flex:1;border:0;background:transparent;font-family:var(--font);font-size:12px;font-weight:700;color:var(--label-secondary);padding:8px 4px;border-radius:8px;cursor:pointer;transition:all .15s;}
  .rt-seg button.on{background:#fff;color:var(--primary);box-shadow:0 1px 5px rgba(20,60,45,.12);}
  .rt-seg button .rt-n{display:block;font-size:10px;color:var(--label-tertiary);font-weight:700;margin-top:1px;}
  .rt-seg button.on .rt-n{color:var(--primary);opacity:.8;}
  .frow{padding:13px 0;border-top:1px solid var(--separator);}
  .frow:first-child{border-top:0;}
  .frow-h{display:flex;align-items:center;gap:9px;}
  .frow-n{flex:1;font-size:14px;font-weight:700;}
  .frow-v{font-size:17px;font-weight:800;letter-spacing:-.3px;}
  .frow-v small{font-size:11px;font-weight:700;color:var(--label-secondary);}
  .frow-tr{font-size:11px;font-weight:800;display:flex;align-items:center;gap:2px;}
  .frow-tr svg{width:10px;height:10px;}
  .nstat{display:flex;gap:14px;margin-top:8px;}
  .nstat .ns{font-size:11px;color:var(--label-tertiary);font-weight:700;}
  .nstat .ns b{display:block;font-size:13.5px;color:var(--label);font-weight:800;margin-top:2px;letter-spacing:-.2px;}
  /* scale progression */
  .scbar{height:8px;border-radius:5px;background:var(--fill-tert);position:relative;margin-top:10px;overflow:hidden;}
  .scbar .scfill{position:absolute;top:0;bottom:0;left:0;border-radius:5px;}
  .scbar.band .scideal{position:absolute;top:0;bottom:0;background:rgba(55,189,105,.18);border-left:1.5px dashed #37BD69;border-right:1.5px dashed #37BD69;}
  .scmeta{display:flex;justify-content:space-between;font-size:10.5px;color:var(--label-tertiary);font-weight:700;margin-top:5px;}
  /* list distribution */
  .ldist{display:flex;height:10px;border-radius:6px;overflow:hidden;margin-top:10px;background:var(--fill-tert);}
  .ldist span{height:100%;}
  .lleg{display:flex;flex-wrap:wrap;gap:6px 12px;margin-top:9px;}
  .lleg .lg{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--label-secondary);font-weight:600;}
  .lleg .lg i{width:8px;height:8px;border-radius:2px;}
  /* text entries */
  .txe{padding:11px 0;border-top:1px solid var(--separator);}
  .txe:first-child{border-top:0;}
  .txe-m{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--label-tertiary);font-weight:700;margin-bottom:4px;}
  .txe-q{font-size:13.5px;line-height:1.45;color:var(--label);font-weight:500;}
  .kw{display:flex;flex-wrap:wrap;gap:7px;margin-top:4px;}
  .kw span{font-size:11.5px;font-weight:700;color:var(--label-secondary);background:var(--fill-tert);padding:5px 10px;border-radius:9px;}
  .txsearch{display:flex;align-items:center;gap:8px;background:var(--fill-tert);border-radius:11px;padding:9px 12px;margin-top:12px;color:var(--label-tertiary);font-size:12.5px;font-weight:600;}
  /* activity */
  .actwrap{position:relative;}
  .acthint{font-size:10.5px;color:var(--label-tertiary);font-weight:700;text-align:center;margin-top:8px;}
  #amacttip{position:fixed;z-index:9999;transform:translate(-50%,-100%);background:#15282C;color:#fff;padding:10px 12px;border-radius:11px;
    font-family:var(--font);display:none;box-shadow:0 8px 22px rgba(0,0,0,.28);min-width:150px;}
  #amacttip .at-d{font-size:12px;font-weight:800;}
  #amacttip .at-t{font-size:11px;opacity:.8;font-weight:600;margin:1px 0 6px;}
  #amacttip .at-r{display:flex;align-items:center;justify-content:space-between;gap:14px;font-size:11.5px;font-weight:600;margin-top:3px;}
  #amacttip .at-r i{width:7px;height:7px;border-radius:2px;display:inline-block;margin-right:5px;}
  #amacttip .at-link{margin-top:8px;font-size:11.5px;font-weight:800;color:#5fe39a;cursor:pointer;}
  /* change highlights */
  .chl{display:flex;align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--separator);}
  .chl:first-child{border-top:0;}
  .chl-ic{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;font-size:17px;}
  .chl-b{flex:1;min-width:0;}
  .chl-n{font-size:14px;font-weight:700;}
  .chl-s{font-size:11.5px;color:var(--label-secondary);font-weight:600;margin-top:1px;}
  .chl-d{font-size:14px;font-weight:800;display:flex;align-items:center;gap:3px;}
  .chl-d svg{width:11px;height:11px;}
  /* AI summary */
  .aisum{background:linear-gradient(135deg,#0f2f29,#15433b);border-radius:18px;box-shadow:var(--shadow);margin:0 16px 14px;padding:16px;color:#fff;}
  .aisum-h{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:800;letter-spacing:-.1px;}
  .aisum-h .sp{font-size:9.5px;font-weight:800;background:rgba(255,255,255,.16);padding:3px 7px;border-radius:7px;letter-spacing:.3px;}
  .aisum-b{font-size:13.5px;line-height:1.55;color:rgba(255,255,255,.92);font-weight:500;margin-top:9px;}
  .aisum-b b{color:#7df0b6;font-weight:800;}
  /* comparison picker + side-by-side */
  .cmp-pick{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;margin:0 16px 14px;}
  .cmp-sel{background:#fff;border-radius:13px;box-shadow:var(--shadow);padding:10px 12px;cursor:pointer;}
  .cmp-sel .cs-l{font-size:10px;color:var(--label-tertiary);font-weight:700;text-transform:uppercase;letter-spacing:.3px;}
  .cmp-sel .cs-v{font-size:13px;font-weight:800;margin-top:2px;}
  .cmp-vs{font-size:11px;font-weight:800;color:var(--label-tertiary);}
  .cmp-tbl{margin-top:4px;}
  .cmp-tr{display:grid;grid-template-columns:1fr auto auto auto;gap:8px;align-items:center;padding:10px 0;border-top:1px solid var(--separator);}
  .cmp-tr:first-child{border-top:0;}
  .cmp-tr .ct-n{font-size:13px;font-weight:600;}
  .cmp-tr .ct-a,.cmp-tr .ct-b{font-size:13px;font-weight:700;width:54px;text-align:right;}
  .cmp-tr .ct-a{color:var(--label-tertiary);}
  .cmp-tr .ct-d{width:26px;text-align:center;}
  .cmp-head{display:grid;grid-template-columns:1fr auto auto auto;gap:8px;font-size:10px;color:var(--label-tertiary);font-weight:800;text-transform:uppercase;letter-spacing:.3px;padding-bottom:4px;}
  .cmp-head span:not(:first-child){width:54px;text-align:right;}
  .cmp-head .h-d{width:26px;text-align:center;}
  /* history scannable */
  .hgrp{font-size:11.5px;color:var(--label-tertiary);font-weight:800;text-transform:uppercase;letter-spacing:.4px;margin:6px 16px 8px;}
  .hrec{display:flex;align-items:center;gap:12px;background:#fff;border-radius:14px;box-shadow:var(--shadow);margin:0 16px 9px;padding:12px 13px;cursor:pointer;position:relative;overflow:hidden;}
  .hrec .hr-bar{position:absolute;left:0;top:0;bottom:0;width:4px;}
  .hrec .hr-ic{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;font-size:19px;}
  .hrec .hr-b{flex:1;min-width:0;}
  .hrec .hr-t{font-size:14.5px;font-weight:700;}
  .hrec .hr-m{font-size:11.5px;color:var(--label-secondary);font-weight:600;margin-top:2px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
  .hrec .hr-cat{font-size:10px;font-weight:800;padding:2px 7px;border-radius:6px;}
  .hrec .hr-tr{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex:0 0 auto;}
  .hstat{font-size:9.5px;font-weight:800;padding:2px 7px;border-radius:6px;}
  /* section heading used between cards */
  .ai-sec{font-size:13px;font-weight:800;color:var(--label-secondary);letter-spacing:.2px;margin:18px 16px 9px;text-transform:uppercase;}
`);

/* ============================== DATA LAYER ================================= */
/* Response-typed field catalog. Each field belongs to an assessment type +
   welfare domain and has a response type that drives which analytics render. */
const AM_LIST_OPTS = {
  Appetite:['Excellent','Good','Fair','Reduced','Poor'],
  'Eye Condition':['Clear','Mild','Cloudy'],
  'Stress Indicators':['None','Mild','Elevated'],
};
function amListColor(opts, i){ // green -> red across options
  const stops=['#37BD69','#7BC96A','#E4B819','#FA8A52','#FA6140'];
  if(opts.length<=1) return stops[0];
  const t=i/(opts.length-1); return stops[Math.round(t*(stops.length-1))];
}
const AM_FIELDS = [
  // Numeric Value
  {key:'weight', label:'Weight',         resp:'Numeric Value', domain:'physical',   assess:'Weight Check',          unit:'kg', base:188, vary:9,  dec:1, dir:'band'},
  {key:'temp',   label:'Temperature',    resp:'Numeric Value', domain:'physical',   assess:'Vitals Check',          unit:'°C', base:38.3,vary:.5, dec:1, dir:'band'},
  {key:'food',   label:'Food Intake',    resp:'Numeric Value', domain:'nutrition',  assess:'Nutrition Assessment',  unit:'kg', base:7.4, vary:1.3,dec:1, dir:'high'},
  {key:'water',  label:'Water Intake',   resp:'Numeric Value', domain:'nutrition',  assess:'Nutrition Assessment',  unit:'L',  base:9.1, vary:1.8,dec:1, dir:'high'},
  // Numeric Scale
  {key:'bcs',    label:'Body Condition', resp:'Numeric Scale', domain:'physical',   assess:'Body Condition',        scale:9,  ideal:[4,5]},
  {key:'activity',label:'Activity Level',resp:'Numeric Scale', domain:'behaviour',  assess:'Behaviour Assessment',  scale:10, higher:true},
  {key:'hygiene',label:'Enclosure Hygiene',resp:'Numeric Scale',domain:'environment',assess:'Environment Check',    scale:5,  higher:true},
  // List
  {key:'appetite',label:'Appetite',      resp:'List',          domain:'nutrition',  assess:'Nutrition Assessment',  opts:AM_LIST_OPTS.Appetite},
  {key:'eye',    label:'Eye Condition',  resp:'List',          domain:'physical',   assess:'Medical Observation',   opts:AM_LIST_OPTS['Eye Condition']},
  {key:'stress', label:'Stress Indicators',resp:'List',        domain:'mental',     assess:'Behaviour Assessment',  opts:AM_LIST_OPTS['Stress Indicators']},
  // Text
  {key:'keeper', label:'Keeper Notes',   resp:'Text',          domain:'behaviour',  assess:'Keeper Notes'},
  {key:'medical',label:'Medical Observation',resp:'Text',      domain:'physical',   assess:'Medical Observation'},
];
const AM_RESP_ORDER = ['Numeric Value','Numeric Scale','List','Text'];
const AM_RESP_SHORT = {'Numeric Value':'Numeric','Numeric Scale':'Scale','List':'List','Text':'Text'};
/* assessment-type identity for scannability (emoji + category) */
const AM_ASSESS_META = {
  'Weight Check':        {emoji:'⚖️', domain:'physical'},
  'Vitals Check':        {emoji:'🌡️', domain:'physical'},
  'Body Condition':      {emoji:'📏', domain:'physical'},
  'Nutrition Assessment':{emoji:'🍽️', domain:'nutrition'},
  'Behaviour Assessment':{emoji:'🐾', domain:'behaviour'},
  'Environment Check':   {emoji:'🧹', domain:'environment'},
  'Medical Observation': {emoji:'🩺', domain:'physical'},
  'Keeper Notes':        {emoji:'📝', domain:'behaviour'},
};
function amAssessMeta(name){ const m=AM_ASSESS_META[name]||{emoji:'📋',domain:'physical'}; return {...m, color:CATS[m.domain].raw, cat:CATS[m.domain].name}; }

const AM_TEXT_POOL = {
  keeper:[
    'Alert and responsive at morning check. Engaged well with new browse enrichment.',
    'Spent most of the afternoon resting in shade; normal for current weather.',
    'Strong social interaction with enclosure-mates, no signs of tension.',
    'Slightly slower to approach feed today — monitoring appetite over next cycle.',
    'Very active during enrichment session, used full height of climbing structure.',
  ],
  medical:[
    'Coat condition good, no lesions or swelling on physical inspection.',
    'Mild ocular discharge on left eye — cleaned, recheck scheduled next visit.',
    'Gait normal, full range of motion in all limbs. No lameness observed.',
    'Body palpation unremarkable; weight tracking within expected band.',
    'Respiration steady at rest; no nasal discharge or coughing noted.',
  ],
};
const AM_KEYWORDS = ['enrichment','appetite','resting','social','active','alert','browse','recheck'];
const AM_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun'];

/* deterministic per-animal field history (most-recent-first within each field) */
const AM_INTEL = {};
function amBuildIntel(animalId){
  if(AM_INTEL[animalId]) return AM_INTEL[animalId];
  const a = getAnimal(animalId); const seed0 = Math.abs(hashStr(animalId));
  const fields = {}; const readings = [];
  AM_FIELDS.forEach((f, fi) => {
    const n = 5 + ((seed0 + fi*3) % 3);                 // 5–7 readings
    const arr = [];
    for(let i=0;i<n;i++){
      const seed = Math.abs(hashStr(animalId + f.key + i));
      const daysAgo = 2 + i*11 + (seed % 5);             // spread over ~70 days
      const d = new Date(AM_BASE); d.setDate(d.getDate()-daysAgo);
      const trend = (n-1-i);                              // older = lower index
      let value, display, raw, optIdx=null;
      if(f.resp==='Numeric Value'){
        const drift = (f.dir==='high'? trend*0.08 : 0);
        raw = +(f.base + (((seed%200)/100)-1)*f.vary + drift*f.vary).toFixed(f.dec);
        value = raw; display = raw.toFixed(f.dec)+' '+f.unit;
      } else if(f.resp==='Numeric Scale'){
        if(f.ideal){ raw = f.ideal[0] + (seed % (f.ideal[1]-f.ideal[0]+1)) - (i===0?0:(seed%2)); raw=Math.max(2,Math.min(f.scale,raw)); }
        else { raw = Math.max(2, Math.min(f.scale, Math.round(f.scale*0.6) + (seed%3) + (i===0?1:0))); }
        value = raw; display = raw+'/'+f.scale;
      } else if(f.resp==='List'){
        optIdx = (seed + (i===0?0:1)) % f.opts.length;
        if(i===0 && optIdx>1) optIdx = optIdx-1;          // most recent skews better
        raw = f.opts[optIdx]; value = raw; display = raw;
      } else { // Text
        const pool = AM_TEXT_POOL[f.key] || AM_TEXT_POOL.keeper;
        raw = pool[seed % pool.length]; value = raw; display = raw;
      }
      const rec = {
        id:'AR-'+animalId+'-'+f.key+'-'+i, animalId, fieldKey:f.key, field:f.label,
        resp:f.resp, domain:f.domain, assess:f.assess, unit:f.unit||'',
        daysAgo, date:amDateStr(daysAgo), time:amTimeStr(seed),
        value, display, raw, optIdx, monthIdx:d.getMonth(),
        assessor:AM_ASSESSORS[seed % AM_ASSESSORS.length],
      };
      arr.push(rec); readings.push(rec);
    }
    arr.sort((x,y)=>x.daysAgo-y.daysAgo);
    fields[f.key]=arr;
  });
  readings.sort((x,y)=>x.daysAgo-y.daysAgo);
  AM_INTEL[animalId] = {fields, readings};
  return AM_INTEL[animalId];
}
function amField(animalId,key){ return amBuildIntel(animalId).fields[key]||[]; }
function amFieldsByResp(animalId){
  const out={}; AM_RESP_ORDER.forEach(r=>out[r]=[]);
  AM_FIELDS.forEach(f=>{ const recs=amField(animalId,f.key); if(recs.length) out[f.resp].push({def:f, recs}); });
  return out;
}
/* snapshot */
function amSnapshot(animalId){
  const {readings}=amBuildIntel(animalId);
  const types=[...new Set(readings.map(r=>r.assess))];
  const obs=readings.filter(r=>r.resp==='Text').length;
  const counts={}; readings.forEach(r=>counts[r.assess]=(counts[r.assess]||0)+1);
  const mostUsed=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
  const last=readings[0];
  return {
    total:readings.length, lastOn:last?last.date:'—', lastAgo:last?last.daysAgo:0,
    types:types.length, obs,
    mostUsed:mostUsed?mostUsed[0]:'—', mostRecent:last?last.assess:'—',
  };
}
/* quick insights */
function amQuick(animalId){
  const {readings}=amBuildIntel(animalId);
  const byType={}, byAssessor={}, byMonth={}, byCat={}, listVals={};
  readings.forEach(r=>{ byType[r.assess]=(byType[r.assess]||0)+1; byAssessor[r.assessor]=(byAssessor[r.assessor]||0)+1;
    byMonth[r.monthIdx]=(byMonth[r.monthIdx]||0)+1; byCat[CATS[r.domain].name]=(byCat[CATS[r.domain].name]||0)+1;
    if(r.resp==='List') listVals[r.raw]=(listVals[r.raw]||0)+1; });
  const top=o=>Object.entries(o).sort((a,b)=>b[1]-a[1])[0];
  const last=readings[0];
  const mMonth=top(byMonth);
  return {
    mostUsed: top(byType)[0],
    lastAgo: last?last.daysAgo:0,
    activeMonth: mMonth?AM_MONTHS[(+mMonth[0])-0]||new Date(2026,+mMonth[0],1).toLocaleString('en-US',{month:'long'}):'—',
    commonResp: Object.keys(listVals).length?top(listVals)[0]:'—',
    topAssessor: top(byAssessor)[0],
    topCat: top(byCat)[0],
  };
}
/* 7-day activity with per-day assessment-type breakdown */
const AM_ACT_CACHE={};
function amActivity(animalId){
  if(AM_ACT_CACHE[animalId]) return AM_ACT_CACHE[animalId];
  const {readings}=amBuildIntel(animalId);
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const seed=Math.abs(hashStr(animalId+'act'));
  const out=days.map((d,i)=>{
    const total=(seed>>i & 3)+ ((seed+i*5)%4) + (i===3||i===4?2:0);
    const types=[...new Set(readings.map(r=>r.assess))];
    const parts=[]; let rem=total, ti=(seed+i)%types.length;
    while(rem>0 && parts.length<3){ const c=Math.min(rem, 1+((seed+ti+parts.length)%3)); const t=types[ti%types.length];
      parts.push({label:t, count:c, color:amAssessMeta(t).color}); rem-=c; ti++; }
    return {day:d, total, parts};
  });
  AM_ACT_CACHE[animalId]=out; return out;
}
/* comparison: list recent assessment "sessions" (by date) and diff two of them */
function amSessions(animalId){
  const {readings}=amBuildIntel(animalId);
  const byDate={}; readings.forEach(r=>{ (byDate[r.date]=byDate[r.date]||[]).push(r); });
  return Object.entries(byDate).map(([date,recs])=>({date, daysAgo:recs[0].daysAgo, recs}))
    .sort((a,b)=>a.daysAgo-b.daysAgo);
}
function amLatestFieldValue(animalId,key,beforeDaysAgo){
  const recs=amField(animalId,key).filter(r=>beforeDaysAgo==null||r.daysAgo>=beforeDaysAgo);
  return recs[0]||amField(animalId,key)[0];
}
function amChangeHighlights(animalId){
  const out=[];
  AM_FIELDS.filter(f=>f.resp!=='Text').forEach(f=>{
    const recs=amField(animalId,f.key); if(recs.length<2) return;
    const cur=recs[0], prev=recs[1];
    if(f.resp==='List'){
      const d=prev.optIdx-cur.optIdx;          // lower index = better
      const dir = d>0?'up':d<0?'dn':'flat';
      out.push({field:f.label, domain:f.domain, dir, curTxt:cur.raw, prevTxt:prev.raw,
        delta: dir==='flat'?'Stable':(dir==='up'?'Improved':'Declined'), assess:f.assess, weight:Math.abs(d)});
    } else {
      const d=+(cur.value-prev.value).toFixed(f.dec||0);
      const dir = Math.abs(d) < (f.resp==='Numeric Scale'?0.5:(f.vary?f.vary*0.06:0.05)) ? 'flat' : (d>0?'up':'dn');
      const unit=f.resp==='Numeric Scale'?('/'+f.scale):(' '+(f.unit||''));
      out.push({field:f.label, domain:f.domain, dir, curTxt:cur.display, prevTxt:prev.display,
        delta:(d>0?'+':'')+d+unit, assess:f.assess, weight:Math.abs(d/(f.vary||1))});
    }
  });
  return out.sort((a,b)=>b.weight-a.weight);
}
function amAISummary(animalId){
  const a=getAnimal(animalId), idx=welfareIndex(a.welfare), hi=amChangeHighlights(animalId);
  const imp=hi.filter(h=>h.dir==='up'), dec=hi.filter(h=>h.dir==='dn');
  const head = idx>=75?'is in good overall condition':idx>=60?'is stable with areas to watch':'needs attention';
  let s=`<b>${a.name}</b> ${head} (welfare index <b>${idx}</b>). `;
  if(imp.length) s+=`Improvements in <b>${imp.slice(0,2).map(h=>h.field).join('</b> and <b>')}</b> since the previous assessment. `;
  if(dec.length) s+=`Watch <b>${dec.slice(0,2).map(h=>h.field).join('</b> and <b>')}</b>, which moved in the wrong direction. `;
  if(!imp.length && !dec.length) s+='Readings are largely unchanged versus the last assessment. ';
  const flat=hi.filter(h=>h.dir==='flat').length;
  s+=`${flat} of ${hi.length} tracked measures held steady.`;
  return s;
}

/* ============================ UI COMPONENTS =============================== */
function amSnapCard(label,val,sub){ return `<div class="sc"><div class="sc-l">${label}</div><div class="sc-v">${val}</div><div class="sc-s">${sub||''}</div></div>`; }
function amSnapshotGrid(s){
  return `<div class="ai-snap">
    ${amSnapCard('Total Records', s.total, 'all assessments')}
    ${amSnapCard('Last Recorded', s.lastAgo+'d', 'ago · '+s.lastOn)}
    ${amSnapCard('Assessment Types', s.types, 'distinct')}
    ${amSnapCard('Observations', s.obs, 'text entries')}
    ${amSnapCard('Most Used', amAssessMeta(s.mostUsed).emoji, s.mostUsed)}
    ${amSnapCard('Most Recent', amAssessMeta(s.mostRecent).emoji, s.mostRecent)}
  </div>`;
}
function amQuickInsights(q){
  const rows=[
    {ic:'🏆',l:'Most Used Assessment',v:q.mostUsed,c:'#37BD69'},
    {ic:'🕒',l:'Last Assessment',v:q.lastAgo===0?'Today':q.lastAgo+' Days Ago',c:'#00AFD6'},
    {ic:'📅',l:'Most Active Month',v:q.activeMonth,c:'#8479F9'},
    {ic:'💬',l:'Most Common Response',v:q.commonResp,c:'#E4B819'},
    {ic:'🧑‍⚕️',l:'Most Frequent Assessor',v:q.topAssessor,c:'#00D6C9'},
    {ic:'📂',l:'Most Updated Category',v:q.topCat,c:'#FA6140'},
  ];
  return `<div class="d2card"><div class="d2card-h"><div><div class="ttl">Quick Insights</div><div class="sub">Signals before the charts</div></div></div>
    <div style="margin-top:4px">${rows.map(r=>`<div class="qi-row">
      <span class="qi-ic" style="background:${r.c}1f">${r.ic}</span>
      <div class="qi-b"><div class="qi-l">${r.l}</div><div class="qi-v">${r.v}</div></div></div>`).join('')}</div></div>`;
}
/* activity bar chart with tap tooltips */
function amActivityChart(animalId){
  const data=amActivity(animalId); const max=Math.max(4,...data.map(d=>d.total));
  const W=342,H=150,pl=8,pr=8,pb=24,pt=8, iw=W-pl-pr, ih=H-pt-pb, bw=iw/data.length*0.56;
  let bars='';
  data.forEach((d,i)=>{ const x=pl+(i+0.5)*(iw/data.length), h=(d.total/max)*ih, y=pt+ih-h;
    bars+=`<rect x="${(x-bw/2).toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(2,h).toFixed(1)}" rx="5"
      fill="${d.total?'#37BD69':'var(--separator)'}" style="cursor:pointer" onclick="amActTip(event,'${animalId}',${i})"/>`;
    bars+=`<text x="${x.toFixed(1)}" y="${H-8}" text-anchor="middle" font-size="10" fill="var(--label-secondary)" font-weight="700">${d.day}</text>`;
    if(d.total) bars+=`<text x="${x.toFixed(1)}" y="${(y-5).toFixed(1)}" text-anchor="middle" font-size="9.5" fill="var(--label-tertiary)" font-weight="800">${d.total}</text>`;
  });
  return `<div class="d2card"><div class="d2card-h"><div><div class="ttl">Assessment Activity</div><div class="sub">Records per day · tap a bar</div></div></div>
    <div class="actwrap"><svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block">${bars}</svg></div>
    <div class="acthint">Tap any bar to see the day's breakdown</div></div>`;
}
function amActTip(e,animalId,i){
  const d=amActivity(animalId)[i]; let t=document.getElementById('amacttip');
  if(!t){ t=document.createElement('div'); t.id='amacttip'; document.body.appendChild(t); }
  if(!d.total){ t.style.display='none'; return; }
  t.innerHTML=`<div class="at-d">${({Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday',Sun:'Sunday'})[d.day]}</div>
    <div class="at-t">${d.total} Records</div>
    ${d.parts.map(p=>`<div class="at-r"><span><i style="background:${p.color}"></i>${p.label}</span><b>${p.count}</b></div>`).join('')}
    <div class="at-link" onclick="amViewActivity('${animalId}')">View Details →</div>`;
  t.style.display='block'; t.style.left=e.clientX+'px'; t.style.top=(e.clientY-12)+'px';
  e.stopPropagation();
}
function amViewActivity(animalId){ const t=document.getElementById('amacttip'); if(t)t.style.display='none'; setFilter('amTab','history'); }
document.addEventListener('click',function(ev){ const t=document.getElementById('amacttip'); if(t&&t.style.display==='block'&&!ev.target.closest('#amacttip')&&ev.target.tagName!=='rect') t.style.display='none'; });

/* ---- response-type analytics sections ---- */
function amTrend(svgData,color){ return dashSpark(svgData,color,{w:96,h:30}); }
function amNumericSection(fields){
  if(!fields.length) return '';
  const rows=fields.map(({def,recs})=>{
    const series=[...recs].reverse().map(r=>r.value);
    const cur=recs[0].value, prev=recs[1]?recs[1].value:cur;
    const min=Math.min(...series), max=Math.max(...series), avg=+(series.reduce((s,x)=>s+x,0)/series.length).toFixed(def.dec);
    const d=+(cur-prev).toFixed(def.dec), up=d>=0;
    return `<div class="frow"><div class="frow-h">
        <span class="qi-ic" style="background:${CATS[def.domain].raw}1f;color:${CATS[def.domain].raw};font-size:13px">${amAssessMeta(def.assess).emoji}</span>
        <span class="frow-n">${def.label}</span>
        <span class="frow-v">${cur.toFixed(def.dec)}<small> ${def.unit}</small></span>
        <span class="frow-tr ${up?'up':'dn'}">${up?I.arrowUp:I.arrowDn}${Math.abs(d)}</span></div>
      <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:12px">
        <div class="nstat"><span class="ns">Latest<b>${cur.toFixed(def.dec)}</b></span><span class="ns">Min<b>${min.toFixed(def.dec)}</b></span><span class="ns">Max<b>${max.toFixed(def.dec)}</b></span><span class="ns">Avg<b>${avg}</b></span></div>
        <div>${amTrend(series, CATS[def.domain].raw)}</div></div></div>`;
  }).join('');
  return `<div class="d2card"><div class="d2card-h"><div><div class="ttl">Numeric Values</div><div class="sub">${fields.length} measures · trend · latest / min / max / avg</div></div></div>
    <div style="margin-top:2px">${rows}</div></div>`;
}
function amScaleSection(fields){
  if(!fields.length) return '';
  const rows=fields.map(({def,recs})=>{
    const cur=recs[0].value, prev=recs[1]?recs[1].value:cur, d=cur-prev, up=d>=0;
    const pct=cur/def.scale*100;
    const color = def.ideal ? (cur>=def.ideal[0]&&cur<=def.ideal[1]?'#37BD69':'#E4B819') : welfareColor(pct);
    const ideal = def.ideal ? `<div class="scideal" style="left:${def.ideal[0]/def.scale*100}%;right:${(1-def.ideal[1]/def.scale)*100}%"></div>` : '';
    // distribution across scale buckets
    return `<div class="frow"><div class="frow-h">
        <span class="qi-ic" style="background:${CATS[def.domain].raw}1f;color:${CATS[def.domain].raw};font-size:13px">${amAssessMeta(def.assess).emoji}</span>
        <span class="frow-n">${def.label}</span>
        <span class="frow-v" style="color:${color}">${cur}<small>/${def.scale}</small></span>
        <span class="frow-tr ${up?'up':'dn'}">${up?I.arrowUp:I.arrowDn}${Math.abs(d)}</span></div>
      <div class="scbar ${def.ideal?'band':''}">${ideal}<div class="scfill" style="width:${pct}%;background:${color}"></div></div>
      <div class="scmeta"><span>1</span>${def.ideal?'<span>ideal '+def.ideal[0]+'–'+def.ideal[1]+'</span>':'<span>'+(def.higher?'higher is better':'')+'</span>'}<span>${def.scale}</span></div></div>`;
  }).join('');
  return `<div class="d2card"><div class="d2card-h"><div><div class="ttl">Numeric Scale</div><div class="sub">${fields.length} scales · current position · target band</div></div></div>
    <div style="margin-top:2px">${rows}</div></div>`;
}
function amListSection(fields){
  if(!fields.length) return '';
  const rows=fields.map(({def,recs})=>{
    const counts={}; def.opts.forEach(o=>counts[o]=0); recs.forEach(r=>counts[r.raw]++);
    const tot=recs.length;
    const seg=def.opts.map((o,i)=>{ const c=counts[o]; if(!c)return''; return `<span style="width:${c/tot*100}%;background:${amListColor(def.opts,i)}"></span>`; }).join('');
    const leg=def.opts.filter(o=>counts[o]).map((o,i)=>`<span class="lg"><i style="background:${amListColor(def.opts,def.opts.indexOf(o))}"></i>${o} ${counts[o]}</span>`).join('');
    const common=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0];
    return `<div class="frow"><div class="frow-h">
        <span class="qi-ic" style="background:${CATS[def.domain].raw}1f;color:${CATS[def.domain].raw};font-size:13px">${amAssessMeta(def.assess).emoji}</span>
        <span class="frow-n">${def.label}</span>
        <span class="frow-v" style="font-size:13px;color:${amListColor(def.opts,def.opts.indexOf(recs[0].raw))}">${recs[0].raw}</span></div>
      <div class="ldist">${seg}</div>
      <div class="lleg">${leg}<span class="lg" style="margin-left:auto;color:var(--label-tertiary)">most common: ${common}</span></div></div>`;
  }).join('');
  return `<div class="d2card"><div class="d2card-h"><div><div class="ttl">List Responses</div><div class="sub">${fields.length} fields · frequency · distribution</div></div></div>
    <div style="margin-top:2px">${rows}</div></div>`;
}
function amTextSection(fields, animalId){
  if(!fields.length) return '';
  const all=[]; fields.forEach(({def,recs})=>recs.forEach(r=>all.push({...r,fieldLabel:def.label})));
  all.sort((a,b)=>a.daysAgo-b.daysAgo);
  const recent=all.slice(0,3);
  const kws=AM_KEYWORDS.slice(0, 6+(Math.abs(hashStr(animalId))%2));
  return `<div class="d2card"><div class="d2card-h"><div><div class="ttl">Text Responses</div><div class="sub">${all.length} entries · ${fields.length} fields</div></div></div>
    <div class="txsearch">${I.search||'🔍'} Search observations & notes…</div>
    <div style="margin-top:6px">${recent.map(r=>`<div class="txe">
      <div class="txe-m">${amAssessMeta(r.assess).emoji} ${r.fieldLabel} · ${r.date} · ${r.assessor}</div>
      <div class="txe-q">"${r.value}"</div></div>`).join('')}</div>
    <div style="font-size:11px;color:var(--label-tertiary);font-weight:800;text-transform:uppercase;letter-spacing:.3px;margin:14px 0 7px">Common Keywords</div>
    <div class="kw">${kws.map(k=>`<span>${k}</span>`).join('')}</div></div>`;
}

/* ---- comparison ---- */
function amChangeCard(animalId){
  const hi=amChangeHighlights(animalId).slice(0,6);
  const icon=d=>d==='up'?I.arrowUp:d==='dn'?I.arrowDn:'→';
  const col=d=>d==='up'?'#37BD69':d==='dn'?'#FA6140':'#8E9AA0';
  return `<div class="d2card"><div class="d2card-h"><div><div class="ttl">Change Highlights</div><div class="sub">What moved since the previous assessment</div></div></div>
    <div style="margin-top:2px">${hi.map(h=>`<div class="chl">
      <span class="chl-ic" style="background:${col(h.dir)}1f">${amAssessMeta(h.assess).emoji}</span>
      <div class="chl-b"><div class="chl-n">${h.field}</div><div class="chl-s">${h.prevTxt} → ${h.curTxt}</div></div>
      <span class="chl-d" style="color:${col(h.dir)}">${h.dir==='flat'?'→':icon(h.dir)} ${h.delta}</span></div>`).join('')}</div></div>`;
}
function amAICard(animalId){
  return `<div class="aisum"><div class="aisum-h">✦ AI Comparison Summary <span class="sp">BETA</span></div>
    <div class="aisum-b">${amAISummary(animalId)}</div></div>`;
}
function amComparisonTab(animalId){
  const sessions=amSessions(animalId);
  const mode=STATE.amCmpMode||'prev';
  let aIdx, bIdx;
  if(mode==='custom'){ aIdx=STATE.amCmpA!=null?+STATE.amCmpA:1; bIdx=STATE.amCmpB!=null?+STATE.amCmpB:0; }
  else { bIdx=0; aIdx=1; }
  const A=sessions[aIdx]||sessions[sessions.length-1], B=sessions[bIdx]||sessions[0];
  // build field-level diff. default 'prev' = per-field previous vs latest READING
  // (always meaningful); 'custom' = nearest reading to each chosen session date.
  const fieldRow=(f)=>{
    let av,bv;
    if(mode==='custom'){ av=amNearestReading(animalId,f.key,A.daysAgo); bv=amNearestReading(animalId,f.key,B.daysAgo); }
    else { const recs=amField(animalId,f.key); av=recs[1]||recs[0]; bv=recs[0]; }
    if(!av||!bv||f.resp==='Text') return '';
    let dtxt,dcol;
    if(f.resp==='List'){ const d=av.optIdx-bv.optIdx; dcol=d>0?'#37BD69':d<0?'#FA6140':'#8E9AA0'; dtxt=d>0?'▲':d<0?'▼':'→'; }
    else { const d=+(bv.value-av.value).toFixed(f.dec||0); dcol=Math.abs(d)<0.01?'#8E9AA0':d>0?'#37BD69':'#FA6140'; dtxt=(d>0?'+':'')+d; }
    return `<div class="cmp-tr"><span class="ct-n">${f.label}</span><span class="ct-a">${av.display}</span><span class="ct-b">${bv.display}</span><span class="ct-d" style="color:${dcol};font-weight:800">${dtxt}</span></div>`;
  };
  const rows=AM_FIELDS.map(fieldRow).filter(Boolean).join('');
  const colA = mode==='custom' ? A.date.split(' ').slice(0,2).join(' ') : 'Previous';
  const colB = mode==='custom' ? B.date.split(' ').slice(0,2).join(' ') : 'Latest';
  const seg=`<div class="rt-seg" style="margin-bottom:14px">
    <button class="${mode==='prev'?'on':''}" onclick="setFilter('amCmpMode','prev')">Current vs Previous</button>
    <button class="${mode==='custom'?'on':''}" onclick="setFilter('amCmpMode','custom')">Custom</button></div>`;
  const picker = mode==='custom' ? `<div class="cmp-pick">
      <div class="cmp-sel" onclick="amCyclePick('${animalId}','amCmpA',${sessions.length})"><div class="cs-l">Assessment A</div><div class="cs-v">${A.date}</div></div>
      <span class="cmp-vs">vs</span>
      <div class="cmp-sel" onclick="amCyclePick('${animalId}','amCmpB',${sessions.length})"><div class="cs-l">Assessment B</div><div class="cs-v">${B.date}</div></div></div>`
    : `<div class="gf-range" style="margin-top:-4px">Comparing each measure's <b>latest</b> reading with its <b>previous</b> one</div>`;
  return `${seg}${picker}
    ${amAICard(animalId)}
    ${amChangeCard(animalId)}
    <div class="d2card"><div class="d2card-h"><div><div class="ttl">Side-by-Side</div><div class="sub">Every tracked measure</div></div></div>
      <div class="cmp-head"><span>Measure</span><span>${colA}</span><span>${colB}</span><span class="h-d">Δ</span></div>
      <div class="cmp-tbl">${rows}</div></div>`;
}
function amNearestReading(animalId,key,daysAgo){
  const recs=amField(animalId,key); if(!recs.length) return null;
  return recs.reduce((best,r)=>Math.abs(r.daysAgo-daysAgo)<Math.abs(best.daysAgo-daysAgo)?r:best, recs[0]);
}
function amCyclePick(animalId,key,n){ const cur=STATE[key]!=null?+STATE[key]:(key==='amCmpA'?1:0); setFilter(key, String((cur+1)%n)); }

/* ---- history (scannable) ---- */
function amHistoryTab(animalId){
  const {readings}=amBuildIntel(animalId);
  // group by relative period
  const grp={};
  readings.forEach(r=>{ const k=r.daysAgo<=7?'This Week':r.daysAgo<=31?'This Month':'Earlier'; (grp[k]=grp[k]||[]).push(r); });
  const order=['This Week','This Month','Earlier'];
  const stat=r=>{ if(r.resp==='Text') return {t:'Logged',c:'#8E9AA0'};
    if(r.resp==='List'){ const c=amListColor(AM_FIELDS.find(f=>f.key===r.fieldKey).opts, r.optIdx); return {t:r.raw,c}; }
    const sc=r.resp==='Numeric Scale'? r.value/AM_FIELDS.find(f=>f.key===r.fieldKey).scale*100 : 70;
    return {t:sc>=70?'Healthy':sc>=50?'Monitor':'Attention', c:welfareColor(sc)}; };
  let html='';
  order.forEach(k=>{ if(!grp[k]) return;
    html+=`<div class="hgrp">${k} · ${grp[k].length}</div>`;
    grp[k].forEach(r=>{ const m=amAssessMeta(r.assess), s=stat(r);
      html+=`<div class="hrec" onclick="amOpenReading('${r.id}')">
        <span class="hr-bar" style="background:${m.color}"></span>
        <span class="hr-ic" style="background:${m.color}1f">${m.emoji}</span>
        <div class="hr-b"><div class="hr-t">${r.field}</div>
          <div class="hr-m"><span class="hr-cat" style="background:${m.color}1f;color:${m.color}">${m.cat}</span> ${r.date} · ${r.assessor}</div></div>
        <div class="hr-tr"><span class="hstat" style="background:${s.c}1f;color:${s.c}">${s.t}</span>
          <span style="font-size:11px;color:var(--label-tertiary);font-weight:700">${r.resp!=='Text'?r.display:''}</span></div></div>`;
    });
  });
  return `<div class="d2card-h" style="margin:0 16px 12px"><div><div class="ttl">Assessment History</div><div class="sub">${readings.length} records · grouped · newest first</div></div></div>${html}<div style="height:8px"></div>`;
}
function amOpenReading(id){
  let rec=null; for(const aid in AM_INTEL){ const r=AM_INTEL[aid].readings.find(x=>x.id===id); if(r){rec=r;break;} }
  if(!rec) return; const m=amAssessMeta(rec.assess);
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div class="sh-title">${rec.field}</div><div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div style="padding:0 4px 10px">
      <div class="as-hero"><span class="hr-ic" style="background:${m.color}1f;width:52px;height:52px;border-radius:14px;font-size:26px">${m.emoji}</span>
        <div class="ah-id"><div class="ah-n">${rec.field}</div><div class="ah-s">${m.cat} · ${rec.resp}</div></div>
        ${rec.resp!=='Text'?`<div style="font-size:24px;font-weight:800;color:${m.color}">${rec.display}</div>`:''}</div>
      <div class="as-meta">
        <div><div class="mk">Date</div><div class="mv">${rec.date}</div></div>
        <div><div class="mk">Time</div><div class="mv">${rec.time}</div></div>
        <div><div class="mk">Assessor</div><div class="mv">${rec.assessor}</div></div>
        <div><div class="mk">Assessment</div><div class="mv">${rec.assess}</div></div>
        ${rec.resp==='Text'?`<div style="grid-column:1/3"><div class="mk">Entry</div><div class="mv" style="font-weight:500;color:var(--label-secondary)">"${rec.value}"</div></div>`:''}
      </div></div>`);
}

/* ============================ SCREEN OVERRIDE ============================= */
SCREENS.amAnimal = (params={}) => {
  const a = getAnimal(params.animalId); amBuildIntel(a.id);
  const tab = STATE.amTab || 'overview';
  const idx = welfareIndex(a.welfare);
  const hero = `<div class="d2-top" style="padding-top:54px">
      <span class="am-back" onclick="back()">${I.back}</span>
      <div style="margin-left:auto;display:flex;gap:8px">
        <span class="d2-menu" title="Assessment Stats" onclick="go('amStats',{animalId:'${a.id}'})">${I.stats}</span>
        <span class="d2-menu" onclick="openNavMenu()">${I.grid}</span></div></div>
    <div class="am-hero">${imgBox(a.sp,64,16)}
      <div class="amh-id"><div class="amh-n">${a.name}</div>
        <div class="amh-s">${a.species} · ${a.sex} · ${a.encl}</div>
        <div class="amh-tags">${scorePill(idx)}${riskPill(a)}<span class="amh-last">Last ${a.seen}d ago</span></div></div></div>`;
  const tabs = amTabs([{key:'overview',label:'Overview'},{key:'comparison',label:'Comparison'},{key:'history',label:'History'}], tab, 'amTab');

  let body='';
  if(tab==='overview'){
    const snap=amSnapshot(a.id), quick=amQuick(a.id), byResp=amFieldsByResp(a.id);
    const doms=amDomsFor(a);
    const latest=amBuildIntel(a.id).readings.slice(0,4);
    const obs=byResp['Text'];
    body = `
      ${amSnapshotGrid(snap)}
      ${amActivityChart(a.id)}
      ${amQuickInsights(quick)}
      <div class="ai-sec">Response Analytics</div>
      ${amNumericSection(byResp['Numeric Value'])}
      ${amScaleSection(byResp['Numeric Scale'])}
      ${amListSection(byResp['List'])}
      ${amTextSection(obs, a.id)}
      <div class="ai-sec">Latest Assessments</div>
      <div class="am-list">${latest.map(r=>`<div class="am-item" onclick="amOpenReading('${r.id}')">
        <span class="hr-ic" style="background:${amAssessMeta(r.assess).color}1f;font-size:18px;width:44px;height:44px;border-radius:12px">${amAssessMeta(r.assess).emoji}</span>
        <div class="ai-body"><div class="ai-top"><span class="ai-name">${r.field}</span></div>
          <div class="ai-meta">${r.assess} · ${r.date} · ${r.assessor}</div></div>
        <div class="ai-trail">${r.resp!=='Text'?`<span class="spill" style="background:${amAssessMeta(r.assess).color}1f;color:${amAssessMeta(r.assess).color}">${r.display}</span>`:''}</div><span class="am-chev">${I.chevron}</span></div>`).join('')}</div>
      <div class="ai-sec">Recent Observations</div>
      ${amTextObservations(obs)}
      <div class="ai-sec">Historical Trends</div>
      <div class="d2card"><div class="d2card-h"><div><div class="ttl">Welfare Index</div><div class="sub">6-month trajectory</div></div><span class="spill" style="background:${welfareColor(idx)}1f;color:${welfareColor(idx)}">${idx}</span></div>${trendLineAxis([idx-7,idx-5,idx-6,idx-3,idx-1,idx],AM_MONTHS,'#00AFD6')}</div>
      <div class="d2card"><div class="d2card-h"><div><div class="ttl">Five-Domain Welfare</div><div class="sub">Current vs previous</div></div></div>${radarChart(doms)}
        <div class="d2-legend"><span class="lg"><i style="background:#37BD69"></i>Current</span><span class="lg dash"><i style="background:#B8C0BD"></i>Previous</span></div></div>`;
  } else if(tab==='comparison'){
    body = amComparisonTab(a.id);
  } else {
    body = amHistoryTab(a.id);
  }
  return `<div class="screen active"><div class="scroll dash2">${hero}${tabs}${body}<div style="height:10px"></div></div></div>`;
};

/* recent observations block (timeline-style, reused on overview) */
function amTextObservations(fields){
  if(!fields || !fields.length) return '';
  const all=[]; fields.forEach(({def,recs})=>recs.forEach(r=>all.push({...r,fieldLabel:def.label})));
  all.sort((a,b)=>a.daysAgo-b.daysAgo);
  const items=all.slice(0,4);
  return `<div class="am-list">${items.map(r=>`<div class="am-item" style="align-items:flex-start" onclick="amOpenReading('${r.id}')">
    <span class="hr-ic" style="background:${amAssessMeta(r.assess).color}1f;font-size:16px;width:38px;height:38px;border-radius:11px;flex:0 0 auto">${amAssessMeta(r.assess).emoji}</span>
    <div class="ai-body"><div class="ai-meta" style="margin:0 0 3px">${r.fieldLabel} · ${r.date} · ${r.assessor}</div>
      <div style="font-size:13px;line-height:1.45;color:var(--label);font-weight:500">"${r.value}"</div></div></div>`).join('')}</div>`;
}
