/* ===========================================================================
   ASSESSMENT MODULE — Species Analytics · Welfare Analytics · Domain Analytics.
   Reuses kit + dashboard charts. Every chart has visible axes + tooltips.
   =========================================================================== */
function domAvgAll(domain){ const all=Object.values(ANIMALS); return Math.round(all.reduce((s,a)=>s+a.welfare[domain],0)/all.length); }
function domBySpecies(domain){ const sg=speciesGroups();
  return Object.entries(sg).map(([sp,inds])=>({sp, name:SPECIES[sp].name, val:Math.round(inds.reduce((s,a)=>s+a.welfare[domain],0)/inds.length)})).sort((a,b)=>b.val-a.val); }
function hbars(rows, color){
  const max=Math.max(...rows.map(r=>r.val),1);
  return `<div style="margin-top:6px">${rows.map(r=>`
    <div style="display:flex;align-items:center;gap:10px;padding:7px 0">
      <span style="width:104px;font-size:12.5px;font-weight:600;color:var(--label-2);flex:0 0 auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.name}</span>
      <span style="flex:1;height:9px;border-radius:5px;background:var(--fill-tert);overflow:hidden"><span style="display:block;height:100%;border-radius:5px;width:${Math.round(r.val/max*100)}%;background:${r.color||color}"></span></span>
      <span style="width:28px;text-align:right;font-size:14px;font-weight:800;color:${r.color||color}">${r.val}</span></div>`).join('')}</div>`;
}

/* ----------------------------- Species Analytics ------------------------- */
SCREENS.amSpecies = (params={}) => {
  const sp = params.sp || 'lion', s = SPECIES[sp];
  const inds = Object.values(ANIMALS).filter(a=>a.sp===sp);
  const idx = Math.round(inds.reduce((x,a)=>x+welfareIndex(a.welfare),0)/inds.length);
  const dom = {}; DOMAIN_ORDER.forEach(d=>dom[d]=Math.round(inds.reduce((x,a)=>x+a.welfare[d],0)/inds.length));
  const doms = DASH_DOMS.map(d=>({...d, cur:dom[d.key], prev:Math.max(40,dom[d.key]-3)}));
  const nrec = amRecords({sp}).length;
  return `<div class="screen active"><div class="scroll dash2">
    <div class="d2-top" style="padding-top:54px"><span class="am-back" onclick="back()">${I.back}</span>
      <div style="margin-left:auto" class="d2-menu" onclick="openNavMenu()">${I.grid}</div></div>
    <div class="am-hero">${imgBox(sp,64,16)}
      <div class="amh-id"><div class="amh-n">${s.name}</div><div class="amh-s">${s.latin} · ${s.taxon.Class}</div>
        <div class="amh-tags">${scorePill(idx)}<span class="amh-last">${inds.length} animals · ${nrec} assessments</span></div></div></div>
    ${amFilter()}
    <div class="d2card"><div class="d2card-h"><div><div class="ttl">Domain Comparison</div><div class="sub">Species average · five domains</div></div></div>${radarChart(doms)}</div>
    <div class="d2card"><div class="d2card-h"><div><div class="ttl">Domain Scores</div><div class="sub">Tap a domain for analytics</div></div></div>
      <div style="margin-top:4px">${DASH_DOMS.map(d=>`
        <div class="drow" style="cursor:pointer" onclick="go('amDomain',{domain:'${d.key}'})">
          <span class="di" style="background:${d.color}1f;color:${d.color}">${CATS[d.key].icon}</span>
          <div class="dn-n">${d.name}</div><span class="dn-cur" style="color:${d.color}">${dom[d.key]}</span>
          <span class="am-chev" style="color:var(--label-tertiary);display:flex">${I.chevron}</span></div>`).join('')}</div></div>
    <div class="d2card-h" style="margin:2px 16px 8px"><div><div class="ttl">Animals</div><div class="sub">${inds.length} in collection</div></div></div>
    <div class="am-list">${inds.sort((a,b)=>welfareIndex(a.welfare)-welfareIndex(b.welfare)).map(amAnimalItem).join('')}</div>
    <div style="height:10px"></div>
  </div></div>`;
};

/* ----------------------------- Welfare Analytics ------------------------- */
SCREENS.amWelfare = () => {
  const all=Object.values(ANIMALS);
  const dom={}; DOMAIN_ORDER.forEach(d=>dom[d]=domAvgAll(d));
  const doms=DASH_DOMS.map(d=>({...d, cur:dom[d.key], prev:Math.max(40,dom[d.key]-3)}));
  const avg=Math.round(DOMAIN_ORDER.reduce((s,d)=>s+dom[d],0)/5);
  const dist={Excellent:0,Good:0,Fair:0,Watch:0}; all.forEach(a=>dist[welfareLabel(welfareIndex(a.welfare))]++);
  const distSeg=[{label:'Excellent',color:'#37BD69',val:dist.Excellent},{label:'Good',color:'#00D6C9',val:dist.Good},{label:'Fair',color:'#E4B819',val:dist.Fair},{label:'Watch',color:'#FA6140',val:dist.Watch}].filter(x=>x.val>0);
  const tot=all.length; distSeg.forEach(s=>s.pct=Math.round(s.val/tot*100));
  return `<div class="screen active"><div class="scroll dash2">
    ${amHeader('Welfare Analytics', `Collection · avg ${avg} · ${welfareLabel(avg)}`)}
    ${amFilter()}
    <div class="d2card"><div class="d2card-h"><div><div class="ttl">Domain Comparison</div><div class="sub">Collection average</div></div></div>${radarChart(doms)}
      <div class="d2-legend"><span class="lg"><i style="background:#37BD69"></i>Current</span><span class="lg dash"><i style="background:#B8C0BD"></i>Previous</span></div></div>
    <div class="d2card"><div class="d2card-h"><div><div class="ttl">Domain Breakdown</div><div class="sub">Tap to drill into a domain</div></div></div>
      <div style="margin-top:4px">${DASH_DOMS.map(d=>{const tp=2+d.key.length%5;return `
        <div class="drow" style="cursor:pointer" onclick="go('amDomain',{domain:'${d.key}'})">
          <span class="di" style="background:${d.color}1f;color:${d.color}">${CATS[d.key].icon}</span>
          <div class="dn-n">${d.name}</div><span class="dn-cur" style="color:${d.color}">${dom[d.key]}</span>
          <span class="dn-tr up">${I.arrowUp}${tp}%</span></div>`;}).join('')}</div></div>
    <div class="d2card"><div class="d2card-h"><div><div class="ttl">Domain Trends</div><div class="sub">Performance over time</div></div></div>${multiLine()}
      <div class="d2-legend">${DASH_DOMS.map(d=>`<span class="lg"><i style="background:${d.color}"></i>${d.short}</span>`).join('')}</div></div>
    <div class="d2card"><div class="d2card-h"><div><div class="ttl">Welfare Distribution</div><div class="sub">${tot} animals by tier</div></div></div>
      <div class="risk-body">${donutChart(distSeg)}
        <div class="risk-rows">${distSeg.map(s=>`<div class="rrow"><span class="rdot" style="background:${s.color}"></span><span class="rname">${s.label}</span><span class="rval" style="color:${s.color}">${s.val}</span><span class="rtr" style="color:var(--label-secondary)">${s.pct}%</span></div>`).join('')}</div></div></div>
    <div style="height:10px"></div>
  </div></div>`;
};

/* ----------------------------- Domain Analytics -------------------------- */
SCREENS.amDomain = (params={}) => {
  const d=params.domain||'physical', c=CATS[d], col=c.raw;
  const all=Object.values(ANIMALS);
  const avg=domAvgAll(d);
  const bySp=domBySpecies(d).map(r=>({...r,color:col}));
  const ranked=all.slice().sort((a,b)=>b.welfare[d]-a.welfare[d]);
  const top=ranked.slice(0,3), low=ranked.slice(-3).reverse();
  const affected=all.filter(a=>a.welfare[d]<60).sort((a,b)=>a.welfare[d]-b.welfare[d]);
  const series=[avg-7,avg-5,avg-6,avg-3,avg-1,avg], labels=['Jan','Feb','Mar','Apr','May','Jun'];
  const nrec=amRecords({domain:d}).length;
  const rankItem=(a)=>`<div class="am-item" onclick="go('amAnimal',{animalId:'${a.id}'})">${imgBox(a.sp,42,11)}
    <div class="ai-body"><div class="ai-top"><span class="ai-name">${a.name}</span><span class="ai-sp">${a.species}</span></div>
    <div class="ai-meta">${c.name} score</div></div><div class="ai-trail">${scorePill(a.welfare[d])}</div><span class="am-chev">${I.chevron}</span></div>`;
  return `<div class="screen active"><div class="scroll dash2">
    ${amHeader(c.name+' Analytics', `Domain overview · ${nrec} assessments`, {actions:`<div class="d2-menu" style="background:${col}1f;color:${col}">${c.icon}</div>`})}
    ${amFilter()}
    <div class="ostat">
      <div class="ocell"><div class="oc-top"><span class="oc-ic" style="background:${col}1f;color:${col}">${c.icon}</span><span class="oc-lab">Average Score</span></div><div class="oc-val" style="color:${col}">${avg}</div><span class="oc-d up">${I.arrowUp}+4%</span></div>
      <div class="ocell"><div class="oc-top"><span class="oc-ic" style="background:#00AFD61f;color:#00AFD6">${I.doc}</span><span class="oc-lab">Assessments</span></div><div class="oc-val">${nrec}</div><span class="oc-d" style="color:var(--label-tertiary)">this domain</span></div>
      <div class="ocell"><div class="oc-top"><span class="oc-ic" style="background:#37BD691f;color:#37BD69">${I.check}</span><span class="oc-lab">Top Species</span></div><div class="oc-val" style="font-size:18px">${bySp[0].name}</div><span class="oc-d" style="color:var(--label-tertiary)">${bySp[0].val} avg</span></div>
      <div class="ocell"><div class="oc-top"><span class="oc-ic" style="background:#FA61401f;color:#FA6140">${I.alert}</span><span class="oc-lab">Needs Focus</span></div><div class="oc-val" style="font-size:18px">${bySp[bySp.length-1].name}</div><span class="oc-d" style="color:var(--label-tertiary)">${bySp[bySp.length-1].val} avg</span></div>
    </div>
    <div class="d2card"><div class="d2card-h"><div><div class="ttl">Performance Trend</div><div class="sub">${c.name} · 6 months</div></div></div>${trendLineAxis(series,labels,col)}</div>
    <div class="d2card"><div class="d2card-h"><div><div class="ttl">Performance by Species</div><div class="sub">Average ${c.name.toLowerCase()} score</div></div></div>${hbars(bySp,col)}</div>
    ${affected.length?`<div class="d2card-h" style="margin:2px 16px 8px"><div><div class="ttl">Risk Impact · Affected Animals</div><div class="sub">${affected.length} below target (60)</div></div></div><div class="am-list">${affected.map(rankItem).join('')}</div>`:''}
    <div class="d2card-h" style="margin:2px 16px 8px"><div class="ttl">Top Performing</div></div><div class="am-list">${top.map(rankItem).join('')}</div>
    <div class="d2card-h" style="margin:2px 16px 8px"><div class="ttl">Lowest Performing</div></div><div class="am-list">${low.map(rankItem).join('')}</div>
    <div style="height:10px"></div>
  </div></div>`;
};
