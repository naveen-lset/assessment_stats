/* ===========================================================================
   ASSESSMENT MODULE KIT — shared design-system components + data layer.
   Reuses the Dashboard (screens/30) design language. NO status lifecycle
   (no Pending/Overdue/Completed) — an assessment is simply a done record.
   =========================================================================== */
injectCSS('css-am', `
  .am-back{width:36px;height:36px;border-radius:11px;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow);flex:0 0 auto;}
  .am-back svg{width:11px;height:18px;color:var(--label);}

  /* unified underline tabs (Overview | Assessments | Analytics | History) */
  .am-tabs{display:flex;gap:0;margin:0 16px 14px;border-bottom:1px solid var(--separator);overflow-x:auto;scrollbar-width:none;}
  .am-tabs::-webkit-scrollbar{display:none;}
  .am-tab{flex:0 0 auto;padding:8px 14px 11px;font-size:13.5px;font-weight:700;color:var(--label-tertiary);cursor:pointer;position:relative;white-space:nowrap;}
  .am-tab.on{color:var(--label);}
  .am-tab.on::after{content:"";position:absolute;left:14px;right:14px;bottom:-1px;height:2.5px;background:var(--primary);border-radius:2px;}

  /* real-image box (with emoji fallback behind) */
  .imgbox{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;
    background:linear-gradient(135deg,#dfeee8,#cfe6dd);box-shadow:inset 0 0 0 1px rgba(0,0,0,.05);}
  .imgbox img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
  .imgbox .ib-fb{line-height:1;}

  /* list item (assessment / animal / species) */
  .am-list{background:#fff;border-radius:18px;box-shadow:var(--shadow);margin:0 16px 14px;padding:4px 16px;}
  .am-item{display:flex;align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--separator);cursor:pointer;}
  .am-item:first-child{border-top:0;}
  .am-item .ai-body{flex:1;min-width:0;}
  .am-item .ai-top{display:flex;align-items:baseline;gap:7px;}
  .am-item .ai-name{font-size:15px;font-weight:700;}
  .am-item .ai-sp{font-size:11.5px;color:var(--label-secondary);font-weight:600;}
  .am-item .ai-meta{font-size:12px;color:var(--label-secondary);margin-top:2px;}
  .am-item .ai-trail{display:flex;align-items:center;gap:6px;flex:0 0 auto;}
  .am-item .am-chev{color:var(--label-tertiary);display:flex;flex:0 0 auto;}.am-item .am-chev svg{width:8px;height:13px;}
  .spill{font-size:12px;font-weight:800;padding:3px 9px;border-radius:8px;}
  .rpill{font-size:10.5px;font-weight:800;padding:3px 8px;border-radius:8px;white-space:nowrap;}

  /* detail bottom sheet */
  .as-hero{display:flex;align-items:center;gap:13px;padding:2px 2px 14px;}
  .as-hero .ah-id{flex:1;min-width:0;}
  .as-hero .ah-n{font-size:19px;font-weight:800;letter-spacing:-.3px;}
  .as-hero .ah-s{font-size:12.5px;color:var(--label-secondary);font-weight:600;margin-top:1px;display:flex;align-items:center;gap:6px;}
  .as-meta{display:grid;grid-template-columns:1fr 1fr;gap:10px;background:var(--fill-tert);border-radius:13px;padding:13px;margin-bottom:14px;}
  .as-meta .mk{font-size:10.5px;color:var(--label-tertiary);font-weight:700;text-transform:uppercase;letter-spacing:.4px;}
  .as-meta .mv{font-size:13.5px;font-weight:700;margin-top:2px;}
  .as-dom{display:flex;align-items:center;gap:11px;padding:11px 0;border-top:1px solid var(--separator);cursor:pointer;}
  .as-dom:first-child{border-top:0;}
  .as-dom .ad-ic{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;}
  .as-dom .ad-ic svg{width:16px;height:16px;}
  .as-dom .ad-b{flex:1;}.as-dom .ad-n{font-size:14px;font-weight:600;}.as-dom .ad-r{font-size:11.5px;color:var(--label-secondary);margin-top:1px;}
  .as-dom .ad-sc{font-size:18px;font-weight:800;width:36px;text-align:right;}

  /* timeline (History) */
  .tl{position:relative;padding-left:22px;margin:0 16px;}
  .tl::before{content:"";position:absolute;left:5px;top:6px;bottom:6px;width:2px;background:var(--separator);}
  .tl-item{position:relative;padding:0 0 18px;cursor:pointer;}
  .tl-item .tl-dot{position:absolute;left:-22px;top:3px;width:12px;height:12px;border-radius:50%;border:2.5px solid #fff;box-shadow:0 0 0 1.5px var(--separator);}
  .tl-item .tl-date{font-size:11.5px;color:var(--label-secondary);font-weight:700;}
  .tl-item .tl-card{background:#fff;border-radius:13px;box-shadow:var(--shadow);padding:11px 13px;margin-top:5px;display:flex;align-items:center;gap:10px;}
  .tl-item .tl-t{flex:1;font-size:14px;font-weight:700;}
  .tl-item .tl-sc{font-size:15px;font-weight:800;}
`);

/* ------------------------------ real images ------------------------------- */
const SP_IMG = {
  lion:     'https://loremflickr.com/240/240/lion,wildlife/all?lock=21',
  gorilla:  'https://loremflickr.com/240/240/gorilla/all?lock=22',
  macaw:    'https://loremflickr.com/240/240/scarlet,macaw/all?lock=23',
  penguin:  'https://loremflickr.com/240/240/king,penguin/all?lock=24',
  flamingo: 'https://loremflickr.com/240/240/flamingo/all?lock=25',
  alligator:'https://loremflickr.com/240/240/alligator/all?lock=26',
  python:   'https://loremflickr.com/240/240/python,snake/all?lock=27',
  redpanda: 'https://loremflickr.com/240/240/red,panda/all?lock=28',
};
function imgBox(sp, size, radius=14){
  const s = SPECIES[sp] || {emoji:'🐾'};
  return `<div class="imgbox" style="width:${size}px;height:${size}px;border-radius:${radius}px">
    <span class="ib-fb" style="font-size:${Math.round(size*0.5)}px">${s.emoji}</span>
    <img src="${SP_IMG[sp]||''}" loading="lazy" alt="" onerror="this.remove()"/></div>`;
}

/* -------------------------------- data ------------------------------------ */
const AM_TYPES = [
  {type:'Weight',              domain:'physical',   unit:'kg'},
  {type:'Body Condition',      domain:'physical',   unit:'/9'},
  {type:'Eye Condition',       domain:'physical',   unit:''},
  {type:'Activity Level',      domain:'behaviour',  unit:'/10'},
  {type:'Enrichment Response', domain:'behaviour',  unit:'%'},
  {type:'Food Intake',         domain:'nutrition',  unit:'kg'},
  {type:'Diet Quality',        domain:'nutrition',  unit:'%'},
  {type:'Enclosure Hygiene',   domain:'environment',unit:'%'},
  {type:'Stress Indicators',   domain:'mental',     unit:''},
];
const AM_ASSESSORS = ['Dr. R. Mehta','J. Alvarez','Dr. L. Owens','S. Kapoor','M. Chen'];
const AM_BASE = new Date('2026-06-09T17:00:00');
function amDateStr(daysAgo){ const d=new Date(AM_BASE); d.setDate(d.getDate()-daysAgo); return d.toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'}); }
function amTimeStr(seed){ const h=8+(seed%9), m=(seed*13)%60, ap=h>=12?'PM':'AM', hh=h>12?h-12:h; return `${hh}:${String(m).padStart(2,'0')} ${ap}`; }

const AM_RECORDS = [];
(function(){
  let id = 100400;
  Object.values(ANIMALS).forEach((a, ai) => {
    const picks = AM_TYPES.filter((t,i)=>(ai+i)%3!==0).slice(0,6);
    picks.forEach((t, ti) => {
      const daysAgo = 1 + ((ai*3 + ti*4) % 24);
      const base = a.welfare[t.domain];
      const score = Math.max(28, Math.min(98, base + (((ai*7 + ti*11) % 13) - 6)));
      id++;
      AM_RECORDS.push({
        id:'AS-'+id, animalId:a.id, sp:a.sp, type:t.type, domain:t.domain, unit:t.unit,
        daysAgo, date:amDateStr(daysAgo), time:amTimeStr(ai*5+ti), score,
        assessor:AM_ASSESSORS[(ai+ti)%AM_ASSESSORS.length], location:a.encl,
        notes: score<55 ? 'Below target band — schedule husbandry & enrichment review.'
             : score<70 ? 'Within acceptable range — continue routine monitoring.'
             : 'Healthy reading — no action required this cycle.',
        domains: a.welfare,
      });
    });
  });
})();
AM_RECORDS.sort((x,y)=>x.daysAgo - y.daysAgo);   // most recent first

function amRecords({animalId, sp, domain, type}={}){
  return AM_RECORDS.filter(r =>
    (!animalId || r.animalId===animalId) && (!sp || r.sp===sp) &&
    (!domain || r.domain===domain) && (!type || r.type===type));
}
function amGetRec(id){ return AM_RECORDS.find(r=>r.id===id); }
function amDomSeries(animalId, domain){
  const end = getAnimal(animalId).welfare[domain]; const arr=[];
  for(let i=5;i>=0;i--) arr.push(Math.max(32, Math.min(98, end - i*2 + (((i*7)%5)-2))));
  arr[arr.length-1]=end; return arr;
}

/* ------------------------------- pills ------------------------------------ */
function amRiskOf(a){
  const idx=welfareIndex(a.welfare), low=DOMAIN_ORDER.some(d=>a.welfare[d]<55);
  if(idx<60||low||a.seen>14) return {level:'high',  color:'#FA6140', label:'High Risk'};
  if(idx<75)                 return {level:'medium',color:'#E4B819', label:'Medium Risk'};
  return                            {level:'low',   color:'#37BD69', label:'Low Risk'};
}
function scorePill(score){ if(score==null) return ''; const c=welfareColor(score); return `<span class="spill" style="background:${c}1f;color:${c}">${score}</span>`; }
function riskPill(a){ const r=amRiskOf(a); return `<span class="rpill" style="background:${r.color}1f;color:${r.color}">${r.label}</span>`; }

/* ------------------------------ components -------------------------------- */
function amHeader(title, sub, {back=true, actions=''}={}){
  return `<div class="d2-top" style="padding-top:54px">
    ${back?`<span class="am-back" onclick="back()">${I.back}</span>`:''}
    <div><div class="d2-t">${title}</div>${sub?`<div class="d2-sub">${sub}</div>`:''}</div>
    <div style="margin-left:auto">${actions||`<div class="d2-menu" onclick="openNavMenu()">${I.grid}</div>`}</div>
  </div>`;
}
function amTabs(items, activeKey, stateKey){
  return `<div class="am-tabs">${items.map(it=>`<div class="am-tab ${it.key===activeKey?'on':''}" onclick="setFilter('${stateKey}','${it.key}')">${it.label}</div>`).join('')}</div>`;
}
/* persistent global filter (writes STATE.dashF, shared across every page) */
function amFilter(){ return globalFilter(STATE.dashF||'Week'); }

function amAssessmentItem(r){
  const a=getAnimal(r.animalId);
  return `<div class="am-item" onclick="openAssessment('${r.id}')">
    ${imgBox(r.sp,46,12)}
    <div class="ai-body"><div class="ai-top"><span class="ai-name">${a.name}</span><span class="ai-sp">${a.species}</span></div>
      <div class="ai-meta">${r.type} · ${r.date}${r.time!=='—'?' · '+r.time:''}</div></div>
    <div class="ai-trail">${scorePill(r.score)}</div><span class="am-chev">${I.chevron}</span></div>`;
}
function amAnimalItem(a){
  return `<div class="am-item" onclick="go('amAnimal',{animalId:'${a.id}'})">
    ${imgBox(a.sp,46,12)}
    <div class="ai-body"><div class="ai-top"><span class="ai-name">${a.name}</span><span class="ai-sp">${a.species}</span></div>
      <div class="ai-meta">Last assessed ${a.seen}d ago · ${a.encl}</div></div>
    <div class="ai-trail">${scorePill(welfareIndex(a.welfare))}${riskPill(a)}</div><span class="am-chev">${I.chevron}</span></div>`;
}
function amSpeciesItem(sp, inds){
  const idx=Math.round(inds.reduce((s,a)=>s+welfareIndex(a.welfare),0)/inds.length);
  const nrec=amRecords({sp}).length;
  return `<div class="am-item" onclick="go('amSpecies',{sp:'${sp}'})">
    ${imgBox(sp,46,12)}
    <div class="ai-body"><div class="ai-top"><span class="ai-name">${SPECIES[sp].name}</span></div>
      <div class="ai-meta">${inds.length} animal${inds.length>1?'s':''} · ${nrec} assessments</div></div>
    <div class="ai-trail">${scorePill(idx)}</div><span class="am-chev">${I.chevron}</span></div>`;
}
function timeline(items){
  return `<div class="tl">${items.map(it=>`
    <div class="tl-item" ${it.recId?`onclick="openAssessment('${it.recId}')"`:''}>
      <span class="tl-dot" style="background:${it.color||'var(--primary)'}"></span>
      <div class="tl-date">${it.date}</div>
      <div class="tl-card"><span class="ad-ic" style="background:${it.color}1f;color:${it.color};width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center">${it.icon||I.doc}</span>
        <span class="tl-t">${it.title}</span>${it.score!=null?`<span class="tl-sc" style="color:${welfareColor(it.score)}">${it.score}</span>`:''}</div>
    </div>`).join('')}</div>`;
}

/* ---------------------- detail bottom sheet ------------------------------- */
function openAssessment(id){
  const r = amGetRec(id); if(!r) return;
  const a = getAnimal(r.animalId), risk = amRiskOf(a), idx = welfareIndex(a.welfare);
  const domCards = DOMAIN_ORDER.map(d=>{
    const sc=a.welfare[d], ser=amDomSeries(a.id,d), tr=sc-ser[ser.length-2], up=tr>=0;
    const rmk = sc<55?'Needs attention':sc<70?'Monitor':'Healthy';
    return `<div class="as-dom" onclick="closeSheet();go('amDomainHistory',{animalId:'${a.id}',domain:'${d}'})">
      <span class="ad-ic" style="background:${CATS[d].raw}1f;color:${CATS[d].raw}">${CATS[d].icon}</span>
      <div class="ad-b"><div class="ad-n">${CATS[d].name}</div><div class="ad-r">${rmk} · ${up?'▲':'▼'} ${Math.abs(tr)} vs prev</div></div>
      <span class="ad-sc" style="color:${welfareColor(sc)}">${sc}</span><span class="am-chev" style="color:var(--label-tertiary)">${I.chevron}</span></div>`;
  }).join('');
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div class="sh-title">${r.type}</div><div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div style="padding:0 4px 8px">
      <div class="as-hero">${imgBox(r.sp,58,15)}
        <div class="ah-id"><div class="ah-n">${a.name}</div>
          <div class="ah-s">${a.species} · ${a.sex}</div></div>
        <div style="text-align:right">${scorePill(idx)}<div style="margin-top:5px">${riskPill(a)}</div></div></div>
      <div class="as-meta">
        <div><div class="mk">Date</div><div class="mv">${r.date}</div></div>
        <div><div class="mk">Time</div><div class="mv">${r.time}</div></div>
        <div><div class="mk">Assessor</div><div class="mv">${r.assessor}</div></div>
        <div><div class="mk">Location</div><div class="mv">${r.location}</div></div>
        <div style="grid-column:1/3"><div class="mk">Notes</div><div class="mv" style="font-weight:500;color:var(--label-secondary)">${r.notes}</div></div>
      </div>
      <div class="d2card-h" style="margin:0 0 4px"><div class="ttl" style="font-size:15px">Assessment Domains</div></div>
      ${domCards}
    </div>`);
}
