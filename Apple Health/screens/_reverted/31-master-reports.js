/* Reports + Audit Logs in the Master structure (override v2). Loads last. */

SCREENS.aaReports = () => {
  const reports = [
    {name:'Animal Assessment', sub:'Full history for one animal',     color:CATS.physical.raw,   icon:CATS.physical.icon},
    {name:'Species Assessment',sub:'Welfare across a species group',   color:CATS.environment.raw,icon:CATS.environment.icon},
    {name:'Welfare Report',     sub:'Five-Domain index, trend & spread',color:'#37BD69',          icon:I.heart},
    {name:'Compliance Report',  sub:'Coverage, overdue & on-time',     color:'#00AFD6',           icon:I.check},
    {name:'Site Report',        sub:'Per-site welfare & completion',    color:'#8479F9',           icon:I.grid},
    {name:'Performance Report', sub:'Assessor throughput & quality',    color:'#FA6140',           icon:I.bolt},
    {name:'Comparative Report', sub:'Benchmark sites / species',        color:'#E4B819',           icon:I.scale},
  ];
  const recent = [
    {name:'June Welfare Report', sub:'8 Jun 2026 · Dr. R. Mehta', tag:'PDF', tagColor:'#37BD69'},
    {name:'Q2 Compliance Report',sub:'1 Jun 2026 · M. Chen',      tag:'CSV', tagColor:'#00AFD6'},
    {name:'Coastal · Site Report',sub:'29 May 2026 · S. Park',    tag:'PDF', tagColor:'#8479F9'},
  ];
  return `<div class="screen active"><div class="scroll">
    ${mBack('Reports','Generate & export', {back:true})}
    ${mCard('Report Library','Tap a report to generate', '',
      reports.map(r=>mRow({icon:r.icon, color:r.color, label:r.name, sub:r.sub, value:'PDF'})).join(''))}
    ${mCard('Recent Reports','Last generated', mView(), mThumbList(recent))}
    <div style="height:18px"></div>
  </div></div>`;
};

SCREENS.aaAudit = () => {
  const aColor = {Approved:'#37BD69', Submitted:'#00D6C9', Reviewed:'#00AFD6', Modified:'#E4B819',
    Rejected:'#E93353', Created:'#8479F9', Exported:'#7A8684', Locked:'#1F515B'};
  const groups = [
    {d:'Today', items:[
      {act:'Approved', who:'Dr. R. Mehta', role:'Veterinarian', tgt:'Weight · Simba', time:'5:21 PM'},
      {act:'Submitted',who:'J. Alvarez',  role:'Keeper',       tgt:'Activity Level · Maple', time:'4:02 PM'},
      {act:'Reviewed', who:'Dr. L. Owens', role:'Veterinarian', tgt:'Activity returned · Maple', time:'4:00 PM'},
      {act:'Exported', who:'M. Chen',      role:'Curator',      tgt:'June Welfare Report', time:'9:12 AM'},
    ]},
    {d:'Yesterday', items:[
      {act:'Approved', who:'Dr. L. Owens', role:'Veterinarian', tgt:'Body Condition · Kaa', time:'11:14 AM'},
      {act:'Modified', who:'Dr. L. Owens', role:'Veterinarian', tgt:'Finding updated · Kaa', time:'11:02 AM'},
      {act:'Rejected', who:'S. Park',      role:'Biologist',    tgt:'Stereotypy · Maple', time:'9:05 AM'},
    ]},
    {d:'Earlier', items:[
      {act:'Locked',   who:'M. Chen',   role:'Curator',   tgt:'Q2 Compliance Report', time:'1 Jun'},
      {act:'Created',  who:'J. Alvarez',role:'Keeper',    tgt:'New assessor profile', time:'31 May'},
    ]},
  ];
  const rows = g => g.items.map(it=>`<div class="m-row">
      <span class="m-badge" style="background:${aColor[it.act]||'#7A8684'};font-size:9px">${it.act[0]}</span>
      <span class="m-lab">${it.tgt}<span class="m-sub"> · ${it.who} · ${it.role}</span></span>
      <span class="m-val" style="font-size:13px;font-weight:600;color:${aColor[it.act]}">${it.act}</span>
    </div>`).join('');
  return `<div class="screen active"><div class="scroll">
    ${mBack('Audit Logs','Immutable activity log', {back:true})}
    ${mCard('Tamper-evident', 'Append-only · hash-chained · entries cannot be edited or deleted',
      `<span class="mc-info" style="color:#37BD69">${I.check}</span>`, '')}
    ${groups.map(g=>`<div class="k2-sec" style="padding:0 16px;margin-top:8px"><div class="mc-s" style="margin:6px 2px">${g.d}</div></div>
      <div class="m-card">${rows(g)}</div>`).join('')}
    <div style="height:18px"></div>
  </div></div>`;
};
