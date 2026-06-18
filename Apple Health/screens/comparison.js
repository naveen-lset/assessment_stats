/* Comparison — Phase 3 "Executive" group. Three screens:
   cmpWorkspace (side-by-side analysis) · cmpCompliance (audit scorecard) · cmpRisk (risk center).
   Reuses: tabHeader, welfareDial, ringMini, lineChart, photoBox, idx-pill, distbar, tchip,
   section-head, list, openSheet/closeSheet, welfareIndex/Label/Color, DOMAIN_ORDER, CATS,
   SITES, ANIMALS, SPECIES, monthLabels. New CSS via injectCSS('css-cmp', …), tokens only. */

injectCSS('css-cmp', `
  .cmp-two{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0 16px 16px}
  .cmp-ent{background:var(--bg-elevated);border-radius:var(--radius);box-shadow:var(--shadow);padding:16px 14px;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;cursor:pointer}
  .cmp-ent .ce-name{font-size:16px;font-weight:700;line-height:1.15}
  .cmp-ent .ce-meta{font-size:12px;color:var(--label-secondary);margin-top:-4px}
  .cmp-ent .ce-change{font-size:12px;font-weight:700;color:var(--antz);display:inline-flex;align-items:center;gap:3px}
  .cmp-ent .ce-change svg{width:8px;height:8px}
  .cmp-row{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--separator)}
  .cmp-row:last-child{border-bottom:none}
  .cmp-row .cr-name{flex:1;font-size:14px;color:var(--label-2)}
  .cmp-row .cr-dot{width:9px;height:9px;border-radius:50%;flex:0 0 auto;margin-right:-4px}
  .cmp-row .cr-a,.cmp-row .cr-b{width:30px;text-align:right;font-size:14px;font-weight:700;flex:0 0 auto}
  .cmp-row .cr-delta{width:52px;text-align:right;flex:0 0 auto}
  .cmp-colhead{display:flex;align-items:center;gap:12px;padding:2px 0 8px;font-size:11px;font-weight:700;color:var(--label-tertiary);letter-spacing:.3px;text-transform:uppercase}
  .cmp-colhead .ch-name{flex:1}
  .cmp-colhead .ch-a,.cmp-colhead .ch-b{width:30px;text-align:right;flex:0 0 auto}
  .cmp-colhead .ch-d{width:52px;text-align:right;flex:0 0 auto}
  .cmp-overall{display:flex;align-items:center;justify-content:space-between;background:var(--mint-tint);border-radius:var(--radius);margin:0 16px 16px;padding:14px 16px}
  .cmp-overall .co-lab{font-size:14px;color:var(--label-2)}
  .cmp-overall .co-lab b{color:var(--label)}
  .cmp-mini{margin:0 16px 16px;display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .cmp-mini .cmw{background:var(--bg-elevated);border-radius:var(--radius);box-shadow:var(--shadow);padding:10px 8px 4px}
  .cmp-mini .cmw-lab{font-size:12px;font-weight:700;padding:2px 6px 6px;display:flex;align-items:center;gap:6px}
  .cmp-mini .cmw-lab .cmw-tag{width:18px;height:18px;border-radius:6px;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex:0 0 auto}
  .cmp-gauges{display:flex;gap:10px;margin:0 16px 16px;background:var(--bg-elevated);border-radius:var(--radius);box-shadow:var(--shadow);padding:18px 12px}
  .cmp-gauge{flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center}
  .cmp-gauge .cg-lab{font-size:12px;font-weight:600;color:var(--label-secondary);line-height:1.2}
  .cmp-heat{margin:0 16px 16px;background:var(--bg-elevated);border-radius:var(--radius);box-shadow:var(--shadow);padding:14px 12px;overflow-x:auto}
  .cmp-heat table{border-collapse:separate;border-spacing:4px;width:100%}
  .cmp-heat th{font-size:10px;font-weight:700;color:var(--label-tertiary);text-transform:uppercase;letter-spacing:.2px;padding:2px;text-align:center}
  .cmp-heat th.rowlab{text-align:left;width:58px}
  .cmp-heat td.rowlab{font-size:13px;font-weight:700;color:var(--label-2);text-align:left;padding-right:6px;white-space:nowrap}
  .cmp-heat .hc{border-radius:9px;color:#fff;font-size:13px;font-weight:800;text-align:center;padding:11px 0;min-width:40px}
  .cmp-dist{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin:0 16px 16px}
  .cmp-dist .cd-tile{background:var(--bg-elevated);border-radius:var(--radius);box-shadow:var(--shadow);padding:14px 8px;text-align:center}
  .cmp-dist .cd-num{font-size:26px;font-weight:800;line-height:1}
  .cmp-dist .cd-lab{font-size:11px;font-weight:600;color:var(--label-secondary);margin-top:4px}
  .cmp-std{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--separator)}
  .cmp-std:last-child{border-bottom:none}
  .cmp-std .cs-chk{width:24px;height:24px;border-radius:50%;background:rgba(47,174,115,.16);color:var(--environment);display:flex;align-items:center;justify-content:center;flex:0 0 auto}
  .cmp-std .cs-chk svg{width:14px;height:14px}
  .cmp-std .cs-body{flex:1;min-width:0}
  .cmp-std .cs-name{font-size:15px;font-weight:600}
  .cmp-std .cs-sub{font-size:12px;color:var(--label-secondary);margin-top:1px}
  .cmp-evidence{font-size:12px;color:var(--label-tertiary);display:flex;align-items:center;gap:7px;margin-top:12px;line-height:1.35}
  .cmp-evidence svg{width:15px;height:15px;flex:0 0 auto;color:var(--antz)}
`);

/* ---- module-level picks for the workspace (setters re-render) ------------- */
let cmpA = 'lion';
let cmpB = 'gorilla';
function cmpSetA(sp){ cmpA = sp; closeSheet(); render(); }
function cmpSetB(sp){ cmpB = sp; closeSheet(); render(); }

/* avg domain scores for a species (mirrors reference spaDomAvg) */
function cmpDomAvg(sp){
  const inds = Object.values(ANIMALS).filter(a=>a.sp===sp);
  const d={}; DOMAIN_ORDER.forEach(k=>d[k]= inds.length ? Math.round(inds.reduce((s,a)=>s+a.welfare[k],0)/inds.length) : 0);
  return {dom:d, n:inds.length};
}
/* stable synthetic 8-month trend ending at the species index */
function cmpTrend(sp, end){
  const seed=Math.abs(hashStr(sp)); const months=monthLabels(8);
  return months.map((_,i)=> Math.max(40, Math.min(100, Math.round(end - (7-i)*1.4 + (((seed+i*29)%9)-4)))) );
}

/* species picker sheet */
function cmpPickSheet(slot){
  const cur = slot==='A'?cmpA:cmpB;
  const setter = slot==='A'?'cmpSetA':'cmpSetB';
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div><div class="sh-title">Choose Species</div><div class="sh-sub">Entity ${slot}</div></div>
      <div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="pill-list">${Object.entries(SPECIES).map(([k,v])=>{
      const idx=welfareIndex(cmpDomAvg(k).dom);
      return `<div class="pill-opt ${k===cur?'sel':''}" onclick="${setter}('${k}')">
        <span class="dot" style="background:${welfareColor(idx)}"></span>
        <span style="flex:1">${v.name}</span>
        <span class="idx-pill" style="background:${welfareColor(idx)}">${idx}</span>
        <span class="chk">${I.check}</span></div>`;}).join('')}</div>`);
}

/* ============================================================ 1) WORKSPACE = */
SCREENS.cmpWorkspace = () => {
  const A=SPECIES[cmpA], B=SPECIES[cmpB];
  const da=cmpDomAvg(cmpA), db=cmpDomAvg(cmpB);
  const ia=welfareIndex(da.dom), ib=welfareIndex(db.dom);
  const months=monthLabels(8);
  const tA=cmpTrend(cmpA, ia), tB=cmpTrend(cmpB, ib);
  const diff=ib-ia;
  const pct = ia ? Math.round((ib-ia)/ia*1000)/10 : 0;

  const modes=['Animal','Species','Site','Period'];

  const entCard=(slot,s,dom,idx,n)=>`<div class="cmp-ent" onclick="cmpPickSheet('${slot}')">
    ${photoBox(s.name,{size:54,radius:15})}
    <div><div class="ce-name">${s.name}</div><div class="ce-meta">${n} animals · ${s.taxon.Class}</div></div>
    ${ringMini(idx/100, welfareColor(idx), {size:78, label:String(idx), fs:20})}
    <span class="idx-pill" style="background:${welfareColor(idx)}">${welfareLabel(idx)}</span>
    <span class="ce-change">Change ${I.chevron}</span>
  </div>`;

  const rows=DOMAIN_ORDER.map(d=>{
    const c=CATS[d]; const va=da.dom[d], vb=db.dom[d]; const dl=vb-va;
    return `<div class="cmp-row">
      <span class="cr-dot" style="background:${c.raw}"></span>
      <span class="cr-name">${c.name}</span>
      <span class="cr-a" style="color:${welfareColor(va)}">${va}</span>
      <span class="cr-b" style="color:${welfareColor(vb)}">${vb}</span>
      <span class="cr-delta"><span class="tchip ${dl>=0?'trend-up':'trend-down'}">${dl>=0?I.arrowUp:I.arrowDn}${Math.abs(dl)}</span></span>
    </div>`;}).join('');

  return `<div class="screen active"><div class="scroll">
    ${tabHeader('Compare','Side-by-side analysis')}

    <div class="range-seg" style="margin-bottom:14px">
      ${modes.map(m=>`<button class="${m==='Species'?'on':''}">${m}</button>`).join('')}
    </div>

    <div class="cmp-two">
      ${entCard('A',A,da.dom,ia,da.n)}
      ${entCard('B',B,db.dom,ib,db.n)}
    </div>

    <div class="cmp-overall">
      <div class="co-lab"><b>${B.name}</b> vs <b>${A.name}</b> · overall welfare</div>
      <span class="tchip ${pct>=0?'trend-up':'trend-down'}" style="font-size:16px">${pct>=0?I.arrowUp:I.arrowDn}${Math.abs(pct)}%</span>
    </div>

    <div class="section-head"><h2>Domain Comparison</h2><span class="muted" style="font-size:14px">Δ B − A</span></div>
    <div class="card card-pad">
      <div class="cmp-colhead"><span class="ch-name">Domain</span><span class="ch-a">A</span><span class="ch-b">B</span><span class="ch-d">Δ</span></div>
      ${rows}
    </div>

    <div class="section-head"><h2>Trend Overlay</h2><span class="muted" style="font-size:14px">8 months</span></div>
    <div class="cmp-mini">
      <div class="cmw"><div class="cmw-lab"><span class="cmw-tag" style="background:${welfareColor(ia)}">A</span>${A.name}</div>
        ${lineChart(tA, welfareColor(ia), {w:175,h:120,unit:'',labels:months})}</div>
      <div class="cmw"><div class="cmw-lab"><span class="cmw-tag" style="background:${welfareColor(ib)}">B</span>${B.name}</div>
        ${lineChart(tB, welfareColor(ib), {w:175,h:120,unit:'',labels:months})}</div>
    </div>
    <div class="note" style="padding:0 24px 14px">Charts share a 40–100 welfare-index scale. ${diff>=0?B.name:A.name} holds the stronger trajectory over the period.</div>

    <div style="height:8px"></div>
  </div></div>`;
};
registerModule({key:'cmpWorkspace', label:'Comparison Workspace', sub:'Animal · species · site · period', group:'Executive', color:'var(--behaviour)', icon:I.scale});

/* ========================================================== 2) COMPLIANCE = */
SCREENS.cmpCompliance = () => {
  const gauges=[
    {lab:'Welfare Program', v:94},
    {lab:'Record Completeness', v:88},
    {lab:'Audit Readiness', v:96},
  ];
  const standards=[
    {name:'Animal Welfare Act', sub:'Five Domains coverage · all sites'},
    {name:'AZA-style accreditation', sub:'Husbandry & care standards met'},
    {name:'Record retention policy', sub:'7-year immutable audit trail'},
    {name:'Veterinary oversight', sub:'Sign-off on all flagged findings'},
  ];

  return `<div class="screen active"><div class="scroll">
    ${tabHeader('Compliance','Audit readiness')}

    <div class="cmp-gauges">
      ${gauges.map(g=>`<div class="cmp-gauge">
        ${ringMini(g.v/100, welfareColor(g.v), {size:84, label:g.v+'%', fs:18})}
        <div class="cg-lab">${g.lab}</div></div>`).join('')}
    </div>

    <div class="section-head"><h2>By Site</h2><span class="muted" style="font-size:14px">${SITES.length} sites</span></div>
    <div class="list">
      ${SITES.slice().sort((a,b)=>b.compliance-a.compliance).map(s=>`
        <div class="row no-indent">
          <div class="r-icon" style="background:${welfareColor(s.compliance)}">${I.check}</div>
          <div class="r-body"><div class="r-title">${s.name}</div>
            <div class="r-sub">${s.animals} animals · ${s.onTime}% on-time</div></div>
          <div class="r-trail" style="display:flex;align-items:center;gap:8px">
            ${sparkline(s.trend, welfareColor(s.compliance))}
            <span class="idx-pill" style="background:${welfareColor(s.compliance)}">${s.compliance}%</span>
          </div>
        </div>`).join('')}
    </div>

    <div class="section-head"><h2>Standards</h2></div>
    <div class="card card-pad">
      ${standards.map(st=>`<div class="cmp-std">
        <span class="cs-chk">${I.check}</span>
        <div class="cs-body"><div class="cs-name">${st.name}</div><div class="cs-sub">${st.sub}</div></div>
        <span class="idx-pill" style="background:${welfareColor(95)}">Pass</span>
      </div>`).join('')}
    </div>

    <div class="section-head"><h2>Evidence & Export</h2></div>
    <div class="card card-pad">
      <div style="font-size:15px;font-weight:600;margin-bottom:3px">Audit-ready report</div>
      <div style="font-size:13px;color:var(--label-secondary);margin-bottom:14px">Generates a signed PDF with every assessment, finding, and approval across the reporting period.</div>
      <button class="btn-fill" onclick="openSheet('<div class=\\'sheet-grab\\'></div><div class=\\'sheet-head\\'><div class=\\'sh-title\\'>Export started</div><div class=\\'sh-x\\' onclick=\\'closeSheet()\\'>${I.x}</div></div><div class=\\'pill-list\\'><div class=\\'pill-opt\\'>Audit report queued — you\\'ll be notified when the PDF is ready.</div></div>')">${I.doc}<span style="margin-left:6px">Export audit report (PDF)</span></button>
      <div class="cmp-evidence">${I.check}<span>Every record is write-once. The immutable audit trail preserves assessor, timestamp, and any revisions for full traceability.</span></div>
    </div>

    <div style="height:8px"></div>
  </div></div>`;
};
registerModule({key:'cmpCompliance', label:'Compliance Scorecard', sub:'Audit readiness · export', group:'Executive', color:'var(--environment)', icon:I.check});

/* ============================================================== 3) RISK === */
SCREENS.cmpRisk = () => {
  const all=Object.values(ANIMALS);
  const dist={Excellent:0,Good:0,Fair:0,Watch:0};
  all.forEach(a=>dist[welfareLabel(welfareIndex(a.welfare))]++);
  const DIST_C={Excellent:'#2FAE73',Good:'#17A186',Fair:'#C9A227',Watch:'#C76B4A'};

  // taxon Classes present, mapped to representative species for heat values
  const classes=[...new Set(Object.values(SPECIES).map(s=>s.taxon.Class))];
  function classDom(cls){
    const sps=Object.keys(SPECIES).filter(k=>SPECIES[k].taxon.Class===cls);
    const inds=all.filter(a=>sps.includes(a.sp));
    const d={}; DOMAIN_ORDER.forEach(k=>d[k]= inds.length?Math.round(inds.reduce((s,a)=>s+a.welfare[k],0)/inds.length):0);
    return d;
  }

  const heatBody=classes.map(cls=>{
    const d=classDom(cls);
    const cells=DOMAIN_ORDER.map(dm=>`<td><div class="hc" style="background:${welfareColor(d[dm])}">${d[dm]}</div></td>`).join('');
    return `<tr><td class="rowlab">${cls}</td>${cells}</tr>`;
  }).join('');

  const emerging=[
    {id:'redpanda-1', name:'Red Panda cohort', reason:'Behaviour ↓ 12 pts over 60 days', fc:'Forecast: Watch band within 3 weeks', d:-12},
    {id:'python-1',   name:'Reticulated Python', reason:'Physical health ↓ · assessments overdue', fc:'Forecast: vet review recommended', d:-9},
    {id:'alligator-1',name:'American Alligator', reason:'Behaviour & mental trending down', fc:'Forecast: enrichment plan needed', d:-7},
  ];

  return `<div class="screen active"><div class="scroll">
    ${tabHeader('Risk Center','Where risk is emerging')}

    <div class="section-head"><h2>Risk Distribution</h2><span class="muted" style="font-size:14px">${all.length} animals</span></div>
    <div class="cmp-dist">
      ${Object.entries(dist).map(([k,v])=>`<div class="cd-tile">
        <div class="cd-num" style="color:${DIST_C[k]}">${v}</div>
        <div class="cd-lab">${k}</div></div>`).join('')}
    </div>
    <div class="card card-pad" style="padding:14px 16px 6px">
      ${distBar(dist, all.length)}
    </div>

    <div class="section-head"><h2>Risk Heatmap</h2><span class="muted" style="font-size:14px">class × domain</span></div>
    <div class="cmp-heat">
      <table>
        <thead><tr><th class="rowlab">Class</th>${DOMAIN_ORDER.map(d=>`<th>${CATS[d].name.slice(0,3).toUpperCase()}</th>`).join('')}</tr></thead>
        <tbody>${heatBody}</tbody>
      </table>
    </div>

    <div class="section-head"><h2>Emerging Risk</h2><span class="muted" style="font-size:14px">trending down</span></div>
    <div class="list">
      ${emerging.map(e=>{const a=getAnimal(e.id);const col=welfareColor(welfareIndex(a.welfare));return `
        <div class="acard" onclick="openAnimal('${e.id}')">
          ${photoBox(a.species,{size:44,radius:12})}
          <div class="ac-body"><div class="ac-name">${e.name}</div>
            <div class="ac-sub"><span class="tchip trend-down">${I.arrowDn}${Math.abs(e.d)}</span> ${e.reason}</div>
            <div class="ac-sub" style="color:${col};margin-top:3px">${e.fc}</div></div>
          <span class="chev" style="color:var(--label-tertiary);margin-left:6px">${I.chevron}</span>
        </div>`;}).join('')}
    </div>

    <div style="height:8px"></div>
  </div></div>`;
};
registerModule({key:'cmpRisk', label:'Risk Center', sub:'Heatmap · emerging risk', group:'Executive', color:'var(--physical)', icon:I.alert});
