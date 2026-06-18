/* ===========================================================================
   ASSESSMENT MODULE — list pages: Assessment List · Animals Assessed ·
   Species List · Risk Animal List. All reuse the kit + dashboard design system.
   =========================================================================== */
function amPeriodDays(f){ return ({Today:1, Week:7, Month:31, Year:365, Custom:31}[f]) || 7; }
function amPeriodLabel(f){ return ({Today:'Today', Week:'This week', Month:'This month', Year:'This year', Custom:'1–30 Jun'}[f]) || f; }

/* ----------------------------- Assessment List --------------------------- */
SCREENS.amList = (p={}) => {
  const f = STATE.dashF || 'Week', maxD = amPeriodDays(f);
  let recs = amRecords({animalId:p.animalId, sp:p.sp, domain:p.domain}).filter(r=>r.daysAgo<=maxD);
  const title = p.title || (p.domain ? CATS[p.domain].name+' Assessments'
              : p.sp ? SPECIES[p.sp].name+' Assessments'
              : p.animalId ? getAnimal(p.animalId).name+' · Assessments' : 'Assessment List');
  return `<div class="screen active"><div class="scroll dash2">
    ${amHeader(title, `${recs.length} assessments · ${amPeriodLabel(f)}`)}
    ${amFilter()}
    <div class="am-list">${recs.length
      ? recs.map(amAssessmentItem).join('')
      : '<div style="padding:26px;text-align:center;color:var(--label-secondary);font-size:13px">No assessments recorded in this period.</div>'}</div>
    <div style="height:10px"></div>
  </div></div>`;
};

/* ----------------------------- Animals Assessed -------------------------- */
SCREENS.amAnimals = () => {
  const list = Object.values(ANIMALS).slice().sort((a,b)=>welfareIndex(a.welfare)-welfareIndex(b.welfare));
  const f = STATE.dashF || 'Week';
  return `<div class="screen active"><div class="scroll dash2">
    ${amHeader('Animals Assessed', `${list.length} animals · ${amPeriodLabel(f)}`)}
    ${amFilter()}
    <div class="am-list">${list.map(amAnimalItem).join('')}</div>
    <div style="height:10px"></div>
  </div></div>`;
};

/* ------------------------------ Species List ----------------------------- */
SCREENS.amSpeciesList = () => {
  const sg = speciesGroups();
  const entries = Object.entries(sg).sort((a,b)=>amRecords({sp:b[0]}).length - amRecords({sp:a[0]}).length);
  return `<div class="screen active"><div class="scroll dash2">
    ${amHeader('Species Covered', `${entries.length} species · ${Object.keys(ANIMALS).length} animals`)}
    ${amFilter()}
    <div class="am-list">${entries.map(([sp,inds])=>amSpeciesItem(sp,inds)).join('')}</div>
    <div style="height:10px"></div>
  </div></div>`;
};

/* --------------------------- Risk Animal List ---------------------------- */
SCREENS.amRisk = (p={}) => {
  const level = p.level || 'high';
  const meta = {high:['High Risk','#FA6140'], medium:['Medium Risk','#E4B819'], low:['Low Risk','#37BD69']}[level];
  const list = Object.values(ANIMALS).filter(a=>amRiskOf(a).level===level).sort((a,b)=>welfareIndex(a.welfare)-welfareIndex(b.welfare));
  return `<div class="screen active"><div class="scroll dash2">
    ${amHeader(meta[0]+' Animals', `${list.length} animals flagged ${meta[0].toLowerCase()}`)}
    ${amFilter()}
    <div class="am-list">${list.length
      ? list.map(amAnimalItem).join('')
      : `<div style="padding:26px;text-align:center;color:var(--label-secondary);font-size:13px">No animals at ${meta[0].toLowerCase()}.</div>`}</div>
    <div style="height:10px"></div>
  </div></div>`;
};
