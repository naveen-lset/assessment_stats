/* ===========================================================================
   MASTER overrides for the MAIN APP screens — loads LAST so it wins.
   Re-skins SCREENS.summary (per-animal page), SCREENS.setup (Assessment
   Library) and SCREENS.category (types within a category) in the
   "Species Master" structure using the Master kit only (mBack, mSearch,
   mTabs, mCard, mRow, mMini3, mThumbList, mView, mInfoIco ...).
   =========================================================================== */
injectCSS('css-maA', `
  .maA-dial{display:flex;flex-direction:column;align-items:center;margin:4px 0 12px;}
  .maA-dial .dial{width:170px;height:170px;}
  .maA-act{margin:0 16px 14px;}
  .maA-act .maA-btn{width:100%;background:var(--primary);color:#fff;border:0;font-family:inherit;
    font-size:16px;font-weight:700;border-radius:14px;padding:15px 0;cursor:pointer;box-shadow:var(--shadow);}
  .maA-link{display:flex;align-items:center;justify-content:center;gap:4px;text-align:center;font-size:14px;font-weight:600;color:var(--primary);
    padding:4px 16px 18px;cursor:pointer;}
  .maA-link svg{width:8px;height:13px;flex:0 0 auto;}
`);

/* ----- domain ordering matched to the welfare dial (Five Domains) ---------- */
const MAA_DOMAINS = DOMAIN_ORDER;   // ['nutrition','environment','physical','behaviour','mental']

/* ---------------------------------- SUMMARY -------------------------------- */
/* Per-animal page (main app) — Master style. */
SCREENS.summary = () => {
  const a = getAnimal(STATE.animal);
  const w = WELFARE[a.id] || a.welfare;
  const idx = welfareIndex(w);
  const lowest = MAA_DOMAINS.reduce((x,y)=>w[x]<=w[y]?x:y);
  const risk = (idx<70 || MAA_DOMAINS.some(d=>w[d]<55) || a.seen>14) ? 'High' : idx<85 ? 'Watch' : 'Low';
  const riskColor = risk==='High' ? '#FA6140' : risk==='Watch' ? '#E4B819' : '#37BD69';
  const lastLab = a.seen<=1 ? 'Today' : a.seen<=2 ? 'Yesterday' : a.seen+'d ago';

  /* welfare dial + Five-Domain legend rows */
  const domRows = MAA_DOMAINS.map(d=>mRow({
    color:CATS[d].raw, label:CATS[d].name, value:w[d], vcolor:welfareColor(w[d]), go:"go('alldata')"
  })).join('');

  /* assessments by category — average per domain */
  const catRows = MAA_DOMAINS.map(d=>mRow({
    icon:CATS[d].icon, color:CATS[d].raw, label:CATS[d].name,
    value:w[d], vcolor:welfareColor(w[d]), go:`go('category',{cat:'${d}'})`
  })).join('');

  return `<div class="screen active"><div class="scroll">
    ${mBack(a.name, a.species+' · '+a.sex+' · '+a.encl, {back:true})}

    ${mMini3([
      {icon:I.heart,color:welfareColor(idx),n:idx,label:'Welfare'},
      {icon:I.alert,color:riskColor,n:risk,label:'Risk'},
      {icon:I.cal,color:'var(--secondary)',n:lastLab,label:'Last Assessment'},
    ])}

    ${mCard('Welfare · Five Domains', welfareLabel(idx)+' · updated today', mInfoIco(),
      `<div class="maA-dial">${welfareDial(w,{light:true,size:170})}</div>${domRows}`)}

    ${mCard('Assessments', 'By category', mView("go('aaAnimal',{animalId:'"+a.id+"'})"), catRows)}

    <div class="maA-act"><button class="maA-btn" onclick="openLogAssessment('${a.id}')">+ Log Assessment</button></div>
    <span class="maA-link" onclick="go('aaAnimal',{animalId:'${a.id}'})">View full analytics ${I.chevron}</span>

    <div style="height:8px"></div>
  </div></div>`;
};

/* ----------------------------- ASSESSMENT LIBRARY -------------------------- */
/* SCREENS.setup — Types & templates, Master style. */
SCREENS.setup = () => {
  const typeRows = DOMAIN_ORDER.map(d=>mRow({
    icon:CATS[d].icon, color:CATS[d].raw, label:CATS[d].name,
    value:CAT_TYPE_COUNTS[d], go:`go('category',{cat:'${d}'})`
  })).join('');

  const tplItems = TEMPLATES.map((t,i)=>({
    name:t.name, sub:t.types+' types · '+t.taxon+' taxa',
    tag:t.cats.length+' domains', tagColor:'#37BD69',
    go:`go('template',{i:${i}})`
  }));

  return `<div class="screen active"><div class="scroll">
    ${mBack('Assessment Library', 'Types & templates', {back:false})}
    ${mSearch('Search types or templates')}
    ${mTabs([
      {count:94, label:'Types', key:'types', go:"setSetupTab('types')"},
      {count:36, label:'Templates', key:'templates', go:"setSetupTab('templates')"},
    ], setupTab)}

    ${mCard('Assessment Types', 'By domain', mView("go('category',{cat:'physical'})"), typeRows)}

    ${mCard('Templates', 'Species-scoped', mView(), mThumbList(tplItems))}

    <div style="height:16px"></div>
  </div></div>`;
};

/* ------------------------ CATEGORY (types within a domain) ----------------- */
SCREENS.category = ({cat}) => {
  const c = CATS[cat];
  const rows = (SAMPLE_TYPES[cat]||[]).map(([n,t])=>mRow({
    color:c.raw, label:n, sub:'used in '+t+' templates', value:t,
    go:`go('typedetail',{name:'${n}',cat:'${cat}',templates:${t}})`
  })).join('');

  return `<div class="screen active"><div class="scroll">
    ${mBack(c.name, CAT_TYPE_COUNTS[cat]+' types', {back:true})}
    ${mCard('Types', '', '', rows)}
    <div style="height:16px"></div>
  </div></div>`;
};
