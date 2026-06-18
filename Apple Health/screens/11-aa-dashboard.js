/* ===========================================================================
   Assessment Analytics — DASHBOARD (flagship, org-wide).
   Answers: overall performance · species needing attention · animals needing
   attention · overdue · welfare trend · site performance · major concerns.
   =========================================================================== */
SCREENS.aaDash = () => {
  const o = aaOrg();
  const M = aaMonths();

  /* derived rankings */
  const sg = speciesGroups();
  const spRank = Object.entries(sg).map(([sp,inds])=>({sp, name:SPECIES[sp].name,
    idx:Math.round(inds.reduce((s,a)=>s+welfareIndex(a.welfare),0)/inds.length)}));
  const topSp  = [...spRank].sort((a,b)=>b.idx-a.idx).slice(0,5)
    .map(x=>({name:x.name, val:x.idx, disp:x.idx, color:welfareColor(x.idx), go:`go('aaSpecies',{sp:'${x.sp}'})`}));
  const riskSp = [...spRank].sort((a,b)=>a.idx-b.idx).slice(0,4)
    .map(x=>({name:x.name, val:100-x.idx, disp:x.idx, color:welfareColor(x.idx), go:`go('aaSpecies',{sp:'${x.sp}'})`}));
  const siteRank = [...SITES].sort((a,b)=>b.welfare-a.welfare)
    .map(s=>({name:s.name.split(' ')[0], val:s.welfare, disp:s.welfare, color:welfareColor(s.welfare), go:`go('aaReports')`}));

  /* assessment distributions */
  const byType = DOMAIN_ORDER.map(d=>({label:CATS[d].name, color:CATS[d].raw,
    val:AA_TYPES.filter(t=>t.cat===d).reduce((s,t)=>s+t.count,0)}));
  const statusDist = [
    {label:'Approved', color:'#37BD69', val:3120}, {label:'Under Review', color:'#E4B819', val:540},
    {label:'Draft', color:'#7A8684', val:210}, {label:'Rejected', color:'#E93353', val:88},
  ];
  const freq = [{name:'Weekly',val:1240,color:'var(--secondary)'},{name:'Monthly',val:1980,color:'var(--primary)'},
    {name:'Quarterly',val:980,color:'var(--purple)'},{name:'Yearly',val:420,color:'var(--gold)'},{name:'On-demand',val:200,color:'var(--tertiary)'}];

  /* quality */
  const byScoreHi = [...AA_TYPES].sort((a,b)=>b.avg-a.avg).slice(0,4)
    .map(t=>({name:t.name, val:t.avg, disp:t.avg, color:welfareColor(t.avg)}));
  const byScoreLo = [...AA_TYPES].sort((a,b)=>a.avg-b.avg).slice(0,4)
    .map(t=>({name:t.name, val:t.avg, disp:t.avg, color:welfareColor(t.avg)}));
  const byCountHi = [...AA_TYPES].sort((a,b)=>b.count-a.count).slice(0,4)
    .map(t=>({name:t.name, val:t.count, disp:t.count, color:CATS[t.cat].raw}));
  const avgScore = Math.round(AA_TYPES.reduce((s,t)=>s+t.avg*t.count,0)/AA_TYPES.reduce((s,t)=>s+t.count,0));

  /* compliance */
  const siteCompliance = [...SITES].sort((a,b)=>b.compliance-a.compliance)
    .map(s=>({name:s.name.split(' ')[0], val:s.compliance, disp:s.compliance+'%', color:welfareColor(s.compliance)}));
  const spCompliance = spRank.slice(0,5).map(x=>{const v=60+((Math.abs(hashStr(x.sp))%38));
    return {name:x.name, val:v, disp:v+'%', color:welfareColor(v)};});

  /* activity feeds */
  const recent = RECORDS.map(r=>({title:`${getAnimal(r.animalId).name} · ${r.sub}`, sub:`${r.value} · ${r.assessor}`,
    time:r.when.split('·')[1]||'today', color:CATS[r.type].raw, icon:CATS[r.type].icon, go:`go('aaRecordDetail',{id:'${r.id}'})`}));

  return `<div class="screen active"><div class="scroll">
    ${aaHeader('aaDash', {sub:`${o.count} animals · ${Object.keys(SPECIES).length} species · ${SITES.length} sites`})}
    ${aaFilter()}

    <!-- 1 · ASSESSMENT & WELFARE SUMMARY -->
    <div class="section-head"><h2>Welfare & Assessment Summary</h2></div>
    ${aaKpis([
      {lab:'Animal Welfare Index', val:o.welfare, color:welfareColor(o.welfare), delta:'2%', up:true, go:"go('aaSpecies')"},
      {lab:'Assessment Coverage', val:o.coverage, unit:'%', delta:'3%', up:true},
      {lab:'Assessment Compliance', val:o.compliance, unit:'%', delta:'1%', up:true},
      {lab:'Total Assessments', val:o.total.toLocaleString(), sub:'this period'},
      {lab:'Animals Requiring Attention', val:o.attention, color:'#FA6140', delta:'2', up:false, go:"go('aaCompare')"},
      {lab:'Critical Animals', val:o.critical, color:'#E93353', sub:'welfare < 55'},
      {lab:'Overdue Assessments', val:o.overdue, color:'#E4B819', delta:'4', up:false, go:"go('aaRecords')"},
      {lab:'Active Assessment Records', val:o.active.toLocaleString(), sub:'open / in review'},
    ])}

    <!-- 2 · WELFARE ANALYTICS -->
    <div class="section-head"><h2>Welfare Analytics</h2></div>
    ${aaTrendCard('Welfare Score Trend','8 months', o.welfare, welfareColor(o.welfare), AA_TREND.welfare, {goExpr:"go('aaCompare')"})}
    ${aaDistCard('Welfare Distribution', [
      {label:'Excellent',color:'#37BD69',val:o.dist.Excellent},{label:'Good',color:'#00D6C9',val:o.dist.Good},
      {label:'Fair',color:'#E4B819',val:o.dist.Fair},{label:'Watch',color:'#FA6140',val:o.dist.Watch}])}
    ${aaRank('Species Welfare Ranking', topSp, {sub:'top', goExpr:"go('aaSpecies')"})}
    ${aaRank('Site Welfare Ranking', siteRank)}
    ${aaRank('High-Risk Species', riskSp, {sub:'lowest welfare', goExpr:"go('aaSpecies')"})}
    ${aaRank('High-Risk Enclosures', [
      {name:'R-118 · Python', val:50, disp:50, color:'#FA6140'},{name:'M-22 · Red Panda', val:54, disp:54, color:'#FA6140'},
      {name:'R-204 · Reptile', val:64, disp:64, color:'#E4B819'},{name:'AV-04 · Aviary', val:72, disp:72, color:'#E4B819'}])}

    <!-- 3 · ASSESSMENT ANALYTICS -->
    <div class="section-head"><h2>Assessment Analytics</h2></div>
    ${aaTrendCard('Assessment Completion Trend','% completed', AA_TREND.completion[AA_TREND.completion.length-1]+'%', null, AA_TREND.completion, {from:'#00AFD6',to:'#37BD69'})}
    ${hcard('Assessment Activity','last 14 days', '', `${homeBars(AA_TREND.activity,'#00D6C9',{h:70})}`)}
    ${aaDistCard('Distribution by Type', byType, {goExpr:"go('aaRecords')"})}
    ${aaBars2('Frequency Analysis', freq)}
    ${aaDistCard('Status Distribution', statusDist, {goExpr:"go('aaRecords')"})}

    <!-- 4 · ASSESSMENT QUALITY -->
    <div class="section-head"><h2>Assessment Quality</h2></div>
    ${aaKpis([
      {lab:'Average Assessment Score', val:avgScore, color:welfareColor(avgScore), delta:'1', up:true},
      {lab:'Assessment Pass Rate', val:84, unit:'%', delta:'2%', up:true},
    ])}
    ${aaRank('Highest-Scoring Types', byScoreHi)}
    ${aaRank('Lowest-Scoring Types', byScoreLo, {sub:'need review'})}
    ${aaRank('Most Performed', byCountHi)}
    ${aaTrendCard('Success / Failure Trend','pass-rate %', '84%', '#37BD69', [76,78,77,80,82,81,83,84], {})}

    <!-- 5 · COMPLIANCE ANALYTICS -->
    <div class="section-head"><h2>Compliance Analytics</h2></div>
    ${aaKpis([
      {lab:'Coverage', val:o.coverage, unit:'%', sub:'animals with current assessments'},
      {lab:'Assessment Gaps', val:148, color:'#E4B819', sub:'missing required'},
    ])}
    ${aaTrendCard('Compliance Trend','8 months', AA_TREND.compliance[AA_TREND.compliance.length-1]+'%', null, AA_TREND.compliance, {from:'#37BD69',to:'#00D6C9'})}
    ${aaBars2('Site Compliance Comparison', siteCompliance, {goExpr:"go('aaCompare')"})}
    ${aaBars2('Species Compliance Comparison', spCompliance, {goExpr:"go('aaCompare')"})}
    ${aaRank('Overdue by Site', [
      {name:'Savanna Park', val:34, disp:34, color:'#FA6140'},{name:'Highland', val:22, disp:22, color:'#E4B819'},
      {name:'Coastal', val:14, disp:14, color:'#E4B819'},{name:'Riverside', val:8, disp:8, color:'#37BD69'}])}

    <!-- 6 · ACTIVITY ANALYTICS -->
    <div class="section-head"><h2>Recent Activity</h2><span class="show-all" onclick="go('aaRecords')">All</span></div>
    ${aaFeed('Recent Assessments', recent, {goExpr:"go('aaRecords')"})}
    ${aaFeed('Recent Reviews', [
      {title:'Kaa · Body Condition', sub:'Approved by Dr. L. Owens', time:'2h', color:'#37BD69', icon:I.check},
      {title:'Maple · Activity Level', sub:'Returned for re-check', time:'5h', color:'#E4B819', icon:I.pencil}])}

    <div style="height:10px"></div>
  </div></div>`;
};
