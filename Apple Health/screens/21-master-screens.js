/* ===========================================================================
   MASTER screens — Dashboard · Species Insights · Animal Insights
   Built in the "Species Master" reference structure. Loads LAST (overrides).
   Flow: Dashboard → (tap species) → Species Insights → (tap animal) → Animal Insights
   =========================================================================== */
/* -------------------------------- DASHBOARD ------------------------------- */
SCREENS.aaDash = () => {
  const o = aaOrg();
  const sg = speciesGroups();
  const typeRows = DOMAIN_ORDER.map(d=>({ icon:CATS[d].icon, color:CATS[d].raw, label:CATS[d].name,
    value:AA_TYPES.filter(t=>t.cat===d).reduce((s,t)=>s+t.count,0), go:"go('aaSpecies')" }));
  const recent = RECORDS.map(r=>({ name:getAnimal(r.animalId).name, sub:`${r.sub} · ${r.when.split('·')[0].trim()}`,
    tag:r.value, tagColor:r.pass?'#37BD69':'#FA6140', go:`go('aaAnimal',{animalId:'${r.animalId}'})` }));
  const speciesItems = Object.entries(sg).map(([sp,inds])=>{
    const idx=Math.round(inds.reduce((s,a)=>s+welfareIndex(a.welfare),0)/inds.length);
    return { name:SPECIES[sp].name, sub:SPECIES[sp].latin+' · '+inds.length+' animal'+(inds.length>1?'s':''),
      tag:welfareLabel(idx)+' · '+idx, tagColor:welfareColor(idx), go:`go('aaSpecies',{sp:'${sp}'})` };
  });

  return `<div class="screen active"><div class="scroll">
    ${mBack('Assessment Master', null, {back:true})}
    ${mSearch('Search assessments, animals, species')}
    ${mTabs([{count:o.total.toLocaleString(),label:'Assessments',key:'a',on:true},
             {count:Object.keys(SPECIES).length,label:'Species',key:'s'}], 'a')}

    ${mCard('Assessments by Type','Type wise count', mView(), typeRows.map(mRow).join(''))}

    ${mDonutCard('Assessment Outcomes','Latest result per type',
      [{label:'Pass',color:'#37BD69',val:148},{label:'Borderline',color:'#E4B819',val:38},{label:'Fail',color:'#E93353',val:14}],
      'Total','200', mInfoIco())}

    ${mCard('Recently Assessed','Last 30 days', mView("go('aaSpecies')"), mThumbList(recent))}

    ${mCard('Species','Welfare wise', mView("go('aaSpecies')"), mThumbList(speciesItems))}

    ${mCard('Assessment Trend','Total assessments · past 6 months', mArrow(),
      mTrend([320,360,300,420,390,460], ['Jan','Feb','Mar','Apr','May','Jun']))}

    <div style="height:18px"></div>
  </div></div>`;
};

/* ----------------------------- SPECIES INSIGHTS --------------------------- */
SCREENS.aaSpecies = (params={}) => {
  if(!params.sp){
    const sg=speciesGroups();
    const items=Object.entries(sg).map(([sp,inds])=>{const idx=Math.round(inds.reduce((s,a)=>s+welfareIndex(a.welfare),0)/inds.length);
      return {name:SPECIES[sp].name, sub:SPECIES[sp].latin+' · '+inds.length+' animals', tag:welfareLabel(idx)+' · '+idx, tagColor:welfareColor(idx), go:`go('aaSpecies',{sp:'${sp}'})`};});
    return `<div class="screen active"><div class="scroll">${mBack('Species',null,{back:true})}${mSearch('Search species')}
      ${mCard('All Species', Object.keys(SPECIES).length+' species', '', mThumbList(items))}<div style="height:16px"></div></div></div>`;
  }
  const sp=params.sp, s=SPECIES[sp], inds=Object.values(ANIMALS).filter(a=>a.sp===sp);
  const dom={}; DOMAIN_ORDER.forEach(d=>dom[d]=Math.round(inds.reduce((x,a)=>x+a.welfare[d],0)/inds.length));
  const idx=welfareIndex(dom);
  const dist={Excellent:0,Good:0,Fair:0,Watch:0}; inds.forEach(a=>dist[welfareLabel(welfareIndex(a.welfare))]++);
  const distSeg=[{label:'Excellent',color:'#37BD69',val:dist.Excellent},{label:'Good',color:'#00D6C9',val:dist.Good},
    {label:'Fair',color:'#E4B819',val:dist.Fair},{label:'Watch',color:'#FA6140',val:dist.Watch}];
  const catRows=[['Health','physical'],['Nutrition','nutrition'],['Behaviour','behaviour'],['Enrichment','environment'],['Mental','mental']]
    .map(([lab,d])=>({icon:CATS[d].icon, color:CATS[d].raw, label:lab, value:dom[d], vcolor:welfareColor(dom[d]), go:''}));
  const animals=[...inds].sort((a,b)=>welfareIndex(b.welfare)-welfareIndex(a.welfare))
    .map(a=>({name:a.name, sub:a.sex+' · '+a.stage+' · '+a.encl, tag:welfareLabel(welfareIndex(a.welfare))+' · '+welfareIndex(a.welfare), tagColor:welfareColor(welfareIndex(a.welfare)), go:`go('aaAnimal',{animalId:'${a.id}'})`}));

  return `<div class="screen active"><div class="scroll">
    ${mBack(s.name, s.latin+' · '+inds.length+' animals', {back:true})}
    ${mTabs([{count:inds.length,label:'Animals',key:'a',on:true},{count:Math.round(idx*0.9)+'%',label:'Coverage',key:'c'},{count:idx,label:'Welfare',key:'w'}],'a')}

    ${mCard('Welfare Status','Distribution', '', mDistBars(distSeg.filter(x=>x.val>0))+mLegend(distSeg))}

    ${mCard('Assessment Categories','Average score per category', mInfoIco(), catRows.map(mRow).join(''))}

    ${mMini3([{icon:I.clock,color:'var(--secondary)',n:'Weekly',label:'Frequency'},
              {icon:I.check,color:'var(--primary)',n:Math.round(idx*1.05)+'%',label:'Compliance'},
              {icon:I.doc,color:'var(--addblue)',n:inds.length*18,label:'Assessments'}])}

    ${mCard('Animals','Tap to view assessment history', mView(), mThumbList(animals))}

    ${mCard('Average Score Trend','Past 6 months', mArrow(),
      mTrend([idx-6,idx-4,idx-5,idx-2,idx-1,idx], ['Jan','Feb','Mar','Apr','May','Jun']))}

    <div style="height:18px"></div>
  </div></div>`;
};

/* ----------------------------- ANIMAL INSIGHTS ---------------------------- */
SCREENS.aaAnimal = (params={}) => {
  if(!params.animalId){
    const list=Object.values(ANIMALS).sort((a,b)=>welfareIndex(a.welfare)-welfareIndex(b.welfare))
      .map(a=>({name:a.name, sub:a.species+' · '+a.encl, tag:welfareLabel(welfareIndex(a.welfare))+' · '+welfareIndex(a.welfare), tagColor:welfareColor(welfareIndex(a.welfare)), go:`go('aaAnimal',{animalId:'${a.id}'})`}));
    return `<div class="screen active"><div class="scroll">${mBack('Animals',null,{back:true})}${mSearch('Search animals')}
      ${mCard('All Animals', list.length+' animals','',mThumbList(list))}<div style="height:16px"></div></div></div>`;
  }
  const a=getAnimal(params.animalId);
  const P=aaAnimPayload(AA_ATYPE);
  const tname=AA_ANIM_TYPES.find(t=>t.key===AA_ATYPE).name;
  const recRows = P.recs.map(r=>`<div class="m-row">
    <span class="m-lab">${r.when}<span class="m-sub"> · ${r.time}</span></span>
    ${r.status?`<span class="m-val" style="color:${r.statusColor||'var(--label)'};font-size:15px">${r.status}</span>`
      :`<span class="m-val">${r.value}<span style="font-size:12px;color:var(--label-secondary);font-weight:600"> ${r.unit||''}</span></span>`}
    ${r.change!=null?`<span style="font-size:13px;font-weight:700;color:${r.up?'#37BD69':'#FA6140'};margin-left:10px">${r.up?'+':''}${r.change}</span>`:''}
  </div>`).join('');

  return `<div class="screen active"><div class="scroll">
    ${mBack(a.name, a.species+' · '+a.sex+' · '+a.encl, {back:true})}

    ${mMini3([{icon:I.doc,color:'var(--primary)',n:'18',label:'Assessments'},
              {icon:I.cal,color:'var(--secondary)',n:'Today',label:'Latest'},
              {icon:I.check,color:'var(--addblue)',n:Math.round(welfareIndex(a.welfare)*1.05)+'%',label:'Coverage'}])}

    ${mCard('Assessment Trend', tname,'',
      typeTabs(AA_ANIM_TYPES, AA_ATYPE, 'aaAType') + '<div style="margin-top:14px">'+dynamicGraph(P.gtype, P.payload)+'</div>')}

    ${mCard('Snapshot', tname+' · latest vs previous','', `<div class="k2-snap">
      <div class="cell"><div class="l">Latest</div><div class="v">${P.snap.latest}</div></div>
      <div class="cell"><div class="l">Previous</div><div class="v" style="color:var(--label-secondary)">${P.snap.previous}</div></div>
      <div class="cell"><div class="l">Change</div><div class="v" style="color:${P.snap.up?'#37BD69':'#FA6140'}">${P.snap.up?'+':''}${P.snap.change}</div></div>
      <div class="cell"><div class="l">Updated</div><div class="v" style="font-size:18px">${P.snap.updated}</div></div></div>`)}

    ${mCard(tname+' History', P.recs.length+' records', mView(), recRows)}

    <div class="k2-sticky"><button class="k2-addbtn" onclick="openLogAssessment('${a.id}')">+ Add ${tname}</button></div>
  </div></div>`;
};
