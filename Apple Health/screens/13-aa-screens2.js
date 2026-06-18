/* ===========================================================================
   v2 reworks (override v1): Dashboard (focused 5 sections) + Animal Analytics
   (dynamic graph per assessment type). Loads LAST so these win.
   =========================================================================== */

/* ------------------------------- DASHBOARD -------------------------------- */
let AA_DCOL = -1;
function aaDSel(i){ AA_DCOL=i; render(); }
function aaRecentItems(){
  const items = RECORDS.map(r=>{
    const nm = getAnimal(r.animalId).name;
    return { title: nm+' · '+r.sub, sub: r.value+' · '+r.assessor,
      time: (r.when.split('·')[1]||'today').trim(), color: CATS[r.type].raw };
  });
  items.push({ title:'Koba · Eye Condition reviewed', sub:'Approved by Dr. R. Mehta', time:'2h ago', color:'#37BD69' });
  return items;
}

SCREENS.aaDash = () => {
  const o = aaOrg(), M = aaMonths();
  const vol = [320,360,300,420,390,460,440,520];          // monthly assessment volume
  const sg = speciesGroups();
  const spCount = Object.entries(sg).map(([sp,inds])=>({sp, name:SPECIES[sp].name,
    n: inds.length*40 + (Math.abs(hashStr(sp))%120)}));
  const most = [...spCount].sort((a,b)=>b.n-a.n).slice(0,4)
    .map(x=>({name:x.name, sub:'assessments', val:x.n, go:`go('aaSpecies',{sp:'${x.sp}'})`}));
  const least = [...spCount].sort((a,b)=>a.n-b.n).slice(0,3)
    .map(x=>({name:x.name, sub:'assessments', val:x.n, color:'#FA6140', go:`go('aaSpecies',{sp:'${x.sp}'})`}));

  return `<div class="screen active"><div class="scroll">
    ${aaHeader('aaDash', {sub:`${o.count} animals · ${Object.keys(SPECIES).length} species`})}

    <!-- Overview -->
    <div class="k2-sec"><div class="k2-h">Assessment Overview</div></div>
    ${heroKpi([
      {lab:'Total Assessments', val:o.total.toLocaleString(), icon:I.doc, color:'var(--primary)', foot:'+8% vs last period', up:true},
      {lab:'Coverage', val:o.coverage, unit:'%', icon:I.check, color:'var(--secondary)', foot:'+3%', up:true},
      {lab:'Compliance', val:o.compliance, unit:'%', icon:I.check, color:'var(--addblue)', foot:'+1%', up:true},
      {lab:'Overdue', val:o.overdue, icon:I.alert, color:'var(--tertiary)', foot:'needs action', up:null},
    ])}

    <!-- Activity -->
    <div class="k2-sec"><div class="k2-h">Assessment Activity <span class="more">8 months</span></div>
      <div class="k2-card">
        <div class="k2-col-val"><span class="k2-col-big">${vol[AA_DCOL<0?vol.length-1:AA_DCOL]} <small style="font-size:13px;color:var(--label-secondary);font-weight:600">assessments</small></span>
          <span class="aastatus" style="background:rgba(55,189,105,.14);color:#37BD69">90% completed</span></div>
        ${colChart(vol, M, {color:'#37BD69', sel:AA_DCOL, onSel:'aaDSel'})}
      </div></div>

    <!-- Species (the drill path) -->
    <div class="k2-sec"><div class="k2-h">Species <span class="more">${Object.keys(SPECIES).length}</span></div>
      ${aaSpeciesCards()}</div>

    <!-- Recent -->
    <div class="k2-sec"><div class="k2-h">Recent Activity</div>
      <div class="k2-card">${timeline(aaRecentItems())}</div></div>

    <div style="height:18px"></div>
  </div></div>`;
};

/* species cards (Dashboard → Species drill) */
function aaSpeciesCards(){
  const sg=speciesGroups();
  return Object.entries(sg).map(([sp,inds])=>{
    const idx=Math.round(inds.reduce((s,a)=>s+welfareIndex(a.welfare),0)/inds.length);
    const cnt = inds.length*40 + (Math.abs(hashStr(sp))%120);
    return `<div class="k2-rec" style="cursor:pointer" onclick="go('aaSpecies',{sp:'${sp}'})">
      <div style="flex:0 0 auto">${photoBox(SPECIES[sp].name,{size:44,radius:12})}</div>
      <div style="flex:1;min-width:0"><div style="font-weight:700;font-size:15px">${SPECIES[sp].name}</div>
        <div style="font-size:12px;color:var(--label-secondary)">${inds.length} animal${inds.length>1?'s':''} · ${cnt} assessments</div></div>
      <span class="idx-pill" style="background:${welfareColor(idx)}">${idx}</span>
      <span class="chev" style="color:var(--label-tertiary)">${I.chevron}</span></div>`;
  }).join('');
}

/* ----------------------- SPECIES INSIGHTS (reduced + Animals) ------------- */
SCREENS.aaSpecies = (params={}) => {
  if(!params.sp){
    return `<div class="screen active"><div class="scroll">
      ${aaHeader('aaSpecies',{title:'Species', sub:`${Object.keys(SPECIES).length} species`})}
      <div class="k2-sec"><div class="k2-h">All Species</div>${aaSpeciesCards()}</div>
      <div style="height:16px"></div></div></div>`;
  }
  const sp=params.sp, s=SPECIES[sp], inds=Object.values(ANIMALS).filter(a=>a.sp===sp);
  const dom={}; DOMAIN_ORDER.forEach(d=>dom[d]=Math.round(inds.reduce((x,a)=>x+a.welfare[d],0)/inds.length));
  const idx=welfareIndex(dom);
  const cats=[['Health',dom.physical],['Nutrition',dom.nutrition],['Behavior',dom.behaviour],['Enrichment',dom.environment],['Specific',Math.round((dom.mental+dom.physical)/2)]];
  const ranked=[...inds].sort((a,b)=>welfareIndex(b.welfare)-welfareIndex(a.welfare));

  return `<div class="screen active"><div class="scroll">
    ${aaHeader('aaSpecies',{title:s.name, sub:`${s.latin} · ${inds.length} animals`, back:true})}

    <div class="k2-sec"><div class="k2-h">Species Summary</div>
      <div class="k2-snap">
        <div class="cell"><div class="l">Total Animals</div><div class="v">${inds.length}</div></div>
        <div class="cell"><div class="l">Avg Welfare</div><div class="v" style="color:${welfareColor(idx)}">${idx}</div></div>
        <div class="cell"><div class="l">Coverage</div><div class="v">${Math.round(idx*0.9)}<small>%</small></div></div>
        <div class="cell"><div class="l">Compliance</div><div class="v">${Math.round(idx*1.05)}<small>%</small></div></div>
      </div></div>

    <div class="k2-sec"><div class="k2-h">Assessment Categories</div>
      <div class="k2-card">${radarChart(cats.map(c=>c[1]), cats.map(c=>c[0]), {color:'#37BD69'})}
        <div style="margin-top:8px">${cats.map((c,i)=>progressRow(c[0], c[1], CATS[DOMAIN_ORDER[i]].raw)).join('')}</div></div></div>

    <div class="k2-sec"><div class="k2-h">Average Score Trend <span class="more">8 months</span></div>
      <div class="k2-card"><div class="aabig"><span class="v" style="color:${welfareColor(idx)}">${idx}</span><span class="s"> avg score</span></div>
        ${gradLine([idx-7,idx-5,idx-6,idx-3,idx-2,idx-1,idx,idx],{from:'#00D6C9',to:'#37BD69'})}</div></div>

    <div class="k2-sec"><div class="k2-h">Animals <span class="more">${inds.length}</span></div>
      ${ranked.map(a=>{const ai=welfareIndex(a.welfare);return `
        <div class="k2-rec" style="cursor:pointer" onclick="go('aaAnimal',{animalId:'${a.id}'})">
          <div style="flex:0 0 auto">${photoBox(a.name,{size:44,radius:12})}</div>
          <div style="flex:1;min-width:0"><div style="font-weight:700;font-size:15px">${a.name}</div>
            <div style="font-size:12px;color:var(--label-secondary)">${a.sex} · ${a.stage} · ${a.encl}</div></div>
          <span class="idx-pill" style="background:${welfareColor(ai)}">${ai}</span>
          <span class="chev" style="color:var(--label-tertiary)">${I.chevron}</span></div>`;}).join('')}</div>

    <div style="height:16px"></div>
  </div></div>`;
};

/* --------------------------- ANIMAL ANALYTICS ----------------------------- */
let AA_ATYPE = 'weight';
function aaAType(t){ AA_ATYPE=t; render(); }
const AA_ANIM_TYPES = [{key:'weight',name:'Weight'},{key:'bodyscore',name:'Body Score'},{key:'eye',name:'Eye Condition'},{key:'activity',name:'Activity'}];

function aaAnimPayload(type){
  if(type==='weight') return { gtype:'weight',
    payload:{ data:[300,303,305,308,312,315,318], snap:{latest:'318 kg', change:'+3%', up:true} },
    snap:{latest:'318 kg', previous:'312 kg', change:'3%', up:true, updated:'Today'},
    recs:[{when:'Just now',time:'12:34 AM',value:'318',unit:'kg',change:'3%',up:true},
          {when:'1mo ago',time:'12:34 AM',value:'312',unit:'kg',change:'1%',up:true,note:true},
          {when:'2mo ago',time:'12:34 AM',value:'308',unit:'kg',change:'1%',up:true},
          {when:'3mo ago',time:'12:34 AM',value:'305',unit:'kg',change:'-1%',up:false},
          {when:'4mo ago',time:'12:34 AM',value:'300',unit:'kg',change:'0%',up:true}] };
  if(type==='bodyscore') return { gtype:'bodyscore',
    payload:{ data:[2,3,3,4,5], labels:['','','','',''] },
    snap:{latest:'5 · Overweight', previous:'4 · Ideal', change:'1', up:true, updated:'Today'},
    recs:[{when:'Just now',time:'12:34 AM',status:'5 · Overweight',statusColor:'#E4B819'},
          {when:'1mo ago',time:'12:34 AM',status:'4 · Ideal',statusColor:'#37BD69',note:true},
          {when:'2mo ago',time:'12:34 AM',status:'3 · Ideal',statusColor:'#37BD69'},
          {when:'3mo ago',time:'12:34 AM',status:'3 · Thin',statusColor:'#00D6C9'},
          {when:'4mo ago',time:'12:34 AM',status:'2 · Very Thin',statusColor:'#FA6140'}] };
  if(type==='eye') return { gtype:'status',
    payload:{ rows:[{label:'Normal',val:70,color:'#37BD69'},{label:'Cloudy',val:20,color:'#E4B819'},{label:'Abnormal',val:10,color:'#FA6140'}] },
    snap:{latest:'Normal', previous:'Cloudy', change:'Improved', up:true, updated:'Today'},
    recs:[{when:'Just now',time:'12:34 AM',status:'Normal',statusColor:'#37BD69'},
          {when:'1mo ago',time:'12:34 AM',status:'Cloudy',statusColor:'#E4B819',note:true},
          {when:'2mo ago',time:'12:34 AM',status:'Normal',statusColor:'#37BD69'},
          {when:'3mo ago',time:'12:34 AM',status:'Abnormal',statusColor:'#FA6140'},
          {when:'4mo ago',time:'12:34 AM',status:'Normal',statusColor:'#37BD69'}] };
  return { gtype:'category',
    payload:{ rows:[{label:'High activity',val:48,color:'#37BD69'},{label:'Moderate',val:34,color:'#00D6C9'},{label:'Low activity',val:18,color:'#E4B819'}] },
    snap:{latest:'High', previous:'Moderate', change:'Improved', up:true, updated:'Today'},
    recs:[{when:'Just now',time:'12:34 AM',status:'High activity',statusColor:'#37BD69'},
          {when:'1mo ago',time:'12:34 AM',status:'Moderate',statusColor:'#00D6C9'},
          {when:'2mo ago',time:'12:34 AM',status:'Low activity',statusColor:'#E4B819',note:true}] };
}

SCREENS.aaAnimal = (params={}) => {
  if(!params.animalId){
    const list=Object.values(ANIMALS).sort((a,b)=>welfareIndex(a.welfare)-welfareIndex(b.welfare));
    return `<div class="screen active"><div class="scroll">
      ${aaHeader('aaAnimal',{sub:'Individual assessment profiles'})}
      <div class="k2-sec"><div class="k2-h">Animals <span class="more">${list.length}</span></div>
      ${list.map(a=>`<div class="k2-rec" style="cursor:pointer" onclick="go('aaAnimal',{animalId:'${a.id}'})">
        <div style="flex:0 0 auto">${photoBox(a.name,{size:42,radius:12})}</div>
        <div style="flex:1"><div style="font-weight:700">${a.name}</div><div style="font-size:12px;color:var(--label-secondary)">${a.species} · ${a.encl}</div></div>
        <span class="idx-pill" style="background:${welfareColor(welfareIndex(a.welfare))}">${welfareIndex(a.welfare)}</span></div>`).join('')}</div>
      <div style="height:16px"></div></div></div>`;
  }
  const a=getAnimal(params.animalId);
  const P=aaAnimPayload(AA_ATYPE);

  return `<div class="screen active"><div class="scroll">
    ${appHeader('', {back:true, action:`<span class="hdr-ico" onclick="openSheet(aaAnimalSheet('${a.id}'))">${I.grid}</span>`})}

    <!-- Animal summary card -->
    <div class="k2" style="margin-top:6px">
      <div class="k2-card" style="display:flex;gap:14px;align-items:center">
        ${photoBox(a.name,{size:56,radius:16})}
        <div style="flex:1"><div style="font-size:20px;font-weight:700;letter-spacing:-.3px">${a.name}</div>
          <div style="font-size:13px;color:var(--label-secondary);margin-top:2px">${a.species} · ${a.sex} · ${a.age}</div>
          <div style="font-size:12px;color:var(--label-tertiary);margin-top:2px">${a.encl} · ${a.stage}</div></div>
        <span class="idx-pill" style="background:${welfareColor(welfareIndex(a.welfare))};font-size:14px;padding:6px 12px">${welfareIndex(a.welfare)}</span>
      </div>
    </div>

    <!-- Assessment Analytics Summary -->
    <div class="k2-sec"><div class="k2-h">Assessment Summary</div>
      <div class="k2-snap">
        <div class="cell"><div class="l">Total Assessments</div><div class="v">18</div></div>
        <div class="cell"><div class="l">Latest Assessment</div><div class="v" style="font-size:18px">Today</div></div>
        <div class="cell"><div class="l">Most Frequent</div><div class="v" style="font-size:18px">Weight</div></div>
        <div class="cell"><div class="l">Coverage</div><div class="v">${Math.round(welfareIndex(a.welfare)*1.05)}<small>%</small></div></div>
      </div></div>

    <!-- Dynamic graph by assessment type -->
    <div class="k2-sec" style="padding:0"><div class="k2-h" style="padding:0 24px">Assessment Trend</div>
      ${typeTabs(AA_ANIM_TYPES, AA_ATYPE, 'aaAType')}
      <div class="k2" style="margin-top:14px"><div class="k2-card">${dynamicGraph(P.gtype, P.payload)}</div></div>
    </div>

    <!-- Snapshot -->
    <div class="k2-sec"><div class="k2-h">Snapshot</div>${'<div class="k2">'.replace('<div class="k2">','')}
      <div class="k2-card" style="padding:0;border:0;box-shadow:none;background:transparent">${snapshot(P.snap)}</div></div>

    <!-- Assessment History (improved) -->
    <div class="k2-sec"><div class="k2-h">${AA_ANIM_TYPES.find(t=>t.key===AA_ATYPE).name} History <span class="more">18 records</span></div>
      ${recordList(P.recs)}</div>

    <div class="k2-sticky"><button class="k2-addbtn" onclick="openLogAssessment('${a.id}')">+ Add ${AA_ANIM_TYPES.find(t=>t.key===AA_ATYPE).name}</button></div>
  </div></div>`;
};

function aaAnimalSheet(id){
  const a=getAnimal(id);
  return `<div class="sheet-grab"></div>
    <div class="sheet-head"><div><div class="sh-title">${a.name}</div><div class="sh-sub">${a.species} · ${a.encl}</div></div>
      <div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="k2-snap" style="padding:0 16px 8px">
      <div class="cell"><div class="l">Welfare</div><div class="v" style="color:${welfareColor(welfareIndex(a.welfare))}">${welfareIndex(a.welfare)}</div></div>
      <div class="cell"><div class="l">Assessments</div><div class="v">18</div></div></div>
    <div class="pill-list"><div class="pill-opt" onclick="closeSheet();go('aaAnimal',{animalId:'${id}'})"><span style="font-weight:700">Open full analytics</span><span class="chev">${I.chevron}</span></div></div>`;
}
