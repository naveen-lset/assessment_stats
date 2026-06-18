/* Home + Species browse + Species detail in the Master structure (override). Loads last. */

/* ---------------------------------- HOME ---------------------------------- */
SCREENS.dashboard = () => {
  const s = collectionStats();
  const bands = [
    {label:'Excellent', color:'#37BD69', val:s.dist.Excellent, go:"switchTab('species')"},
    {label:'Good',      color:'#00D6C9', val:s.dist.Good,      go:"switchTab('species')"},
    {label:'Fair',      color:'#E4B819', val:s.dist.Fair,      go:"switchTab('species')"},
    {label:'Watch',     color:'#FA6140', val:s.dist.Watch,     go:"switchTab('species')"},
  ];
  const attention = s.attention.map(a=>({ name:a.name, sub:a.species+' · '+a.encl,
    tag:welfareLabel(welfareIndex(a.welfare))+' · '+welfareIndex(a.welfare), tagColor:welfareColor(welfareIndex(a.welfare)),
    go:`go('aaAnimal',{animalId:'${a.id}'})` }));
  const sg = speciesGroups();
  const species = Object.entries(sg).map(([sp,inds])=>{ const idx=Math.round(inds.reduce((x,a)=>x+welfareIndex(a.welfare),0)/inds.length);
    return { name:SPECIES[sp].name, sub:SPECIES[sp].latin+' · '+inds.length+' animal'+(inds.length>1?'s':''),
      tag:welfareLabel(idx)+' · '+idx, tagColor:welfareColor(idx), go:`go('aaSpecies',{sp:'${sp}'})` }; });

  return `<div class="screen active"><div class="scroll">
    ${mBack('Antz Welfare', 'Animal welfare overview', {back:false})}
    ${mTabs([{count:s.count,label:'Animals',key:'a',on:true},{count:Object.keys(SPECIES).length,label:'Species',key:'s'}],'a')}

    ${mDonutCard('Collection Welfare','Five-Domain index', bands, 'Index', s.avg, mInfoIco())}

    ${mCard('Needs Attention', s.attention.length+' animals', mView("go('aaDash')"), mThumbList(attention))}

    ${mCard('Species','Welfare wise', mView("switchTab('species')"), mThumbList(species))}

    ${mCard('Welfare Trend','Past 6 months', mArrow("go('aaDash')"),
      mTrend([s.avg-6,s.avg-4,s.avg-5,s.avg-2,s.avg-1,s.avg], ['Jan','Feb','Mar','Apr','May','Jun']))}

    <div style="height:18px"></div>
  </div></div>`;
};

/* ------------------------------ SPECIES BROWSE ---------------------------- */
SCREENS.species = () => {
  const sg = speciesGroups();
  const items = Object.entries(sg)
    .map(([sp,inds])=>({sp, inds, idx:Math.round(inds.reduce((x,a)=>x+welfareIndex(a.welfare),0)/inds.length),
      need:inds.filter(isAttention).length}))
    .sort((a,b)=>(b.need-a.need)||(a.idx-b.idx))
    .map(o=>({ name:SPECIES[o.sp].name, sub:SPECIES[o.sp].latin+' · '+o.inds.length+' animal'+(o.inds.length>1?'s':'')+(o.need?' · '+o.need+' need attention':''),
      tag:welfareLabel(o.idx)+' · '+o.idx, tagColor:welfareColor(o.idx), go:`go('aaSpecies',{sp:'${o.sp}'})` }));
  return `<div class="screen active"><div class="scroll">
    ${mBack('Species', Object.keys(SPECIES).length+' species · '+Object.keys(ANIMALS).length+' animals', {back:false})}
    ${mSearch('Search species, animals, enclosures')}
    ${mCard('All Species','Tap for assessment insights', '', mThumbList(items))}
    <div style="height:18px"></div>
  </div></div>`;
};

/* species detail → unify with the Master species insights */
SCREENS.speciesDetail = (p={}) => SCREENS.aaSpecies(p);
