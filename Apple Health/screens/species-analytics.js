/* Species Analytics — reference screen (Phase 1). Pattern other screens mirror.
   Reuses: appHeader, page-hero, welfareDial, domBars, lineChart, lollipopChart,
   tile-grid/stile, section-head, list, ringMini, photoBox, welfareColor. */

injectCSS('css-spa', `
  .spa-bar{display:flex;align-items:center;gap:10px;padding:9px 0}
  .spa-bar .b-name{width:120px;font-size:13px;color:var(--label-2);flex:0 0 auto}
  .spa-bar .b-track{flex:1;height:9px;border-radius:5px;background:var(--fill-tert);overflow:hidden}
  .spa-bar .b-fill{height:100%;border-radius:5px}
  .spa-bar .b-val{width:34px;text-align:right;font-size:13px;font-weight:700;flex:0 0 auto}
`);

function spaDomAvg(inds){ const d={}; DOMAIN_ORDER.forEach(k=>d[k]=Math.round(inds.reduce((s,a)=>s+a.welfare[k],0)/inds.length)); return d; }

SCREENS.speciesAnalytics = ({sp}={}) => {
  sp = sp || Object.keys(SPECIES)[0];
  const s = SPECIES[sp];
  const inds = Object.values(ANIMALS).filter(a=>a.sp===sp);
  const dom = spaDomAvg(inds);
  const idx = welfareIndex(dom);
  const months = monthLabels(8);

  // synthetic but stable trends
  const seed = Math.abs(hashStr(sp));
  const passTrend = months.map((_,i)=> 70 + ((seed+i*13)%18) + i);             // pass-rate %
  const riskTrend = months.map((_,i)=> Math.max(2, 22 - i - ((seed+i*7)%6)));   // at-risk %
  const freq      = months.map((_,i)=> 8 + ((seed+i*11)%14));                   // assessments/mo
  const passRate  = passTrend[passTrend.length-1];

  // assessment distribution by domain (volume share)
  const dist = DOMAIN_ORDER.map(d=>({d, n: 6 + ((seed+DOMAIN_ORDER.indexOf(d)*17)%20)}));
  const distMax = Math.max(...dist.map(x=>x.n));

  // similar species = same Class, excluding self
  const similar = Object.entries(SPECIES).filter(([k,v])=>v.taxon.Class===s.taxon.Class && k!==sp)
    .map(([k])=>{ const gi=Object.values(ANIMALS).filter(a=>a.sp===k); return gi.length?{k, idx:welfareIndex(spaDomAvg(gi))}:null; })
    .filter(Boolean).slice(0,3);

  const legend = DOMAIN_ORDER.map(d=>{const c=CATS[d];return `<div class="wl-row">
    <span class="wl-dot" style="background:${c.raw}"></span><span class="wl-name">${c.name}</span>
    <span class="wl-score" style="color:${c.raw}">${dom[d]}</span></div>`;}).join('');
  const lowest=DOMAIN_ORDER.reduce((a,b)=>dom[a]<=dom[b]?a:b);

  return `<div class="screen active"><div class="scroll">
    ${appHeader('', {back:true})}
    <div class="page-hero" style="display:flex;align-items:center;gap:14px">
      ${photoBox(s.name,{size:60,radius:16})}
      <div style="flex:1"><div class="ph-title" style="font-size:26px">${s.name}</div>
        <div class="ph-sub">Species Analytics · ${inds.length} animals · ${s.taxon.Class}</div></div>
    </div>

    <div class="welfare-lite">
      <div class="welfare-top"><span class="w-title">Welfare · Five Domains</span><span class="w-when">avg of ${inds.length}</span></div>
      <div class="welfare-body">${welfareDial(dom,{light:true})}<div class="welfare-legend">${legend}</div></div>
      <div class="welfare-foot"><span class="wf-dot"></span><span><b>${CATS[lowest].name}</b> is the weakest domain (${dom[lowest]}) for this species.</span></div>
    </div>

    <div class="tile-grid">
      <div class="stile"><div class="st-ico" style="background:rgba(23,161,134,.12);color:var(--antz)">${I.paw}</div>
        <div class="st-num">${inds.length}</div><div class="st-lab">animals</div></div>
      <div class="stile"><div class="st-ico" style="background:${welfareColor(idx)}22;color:${welfareColor(idx)}">${I.heart}</div>
        <div class="st-num" style="color:${welfareColor(idx)}">${idx}</div><div class="st-lab">${welfareLabel(idx)}</div></div>
      <div class="stile"><div class="st-ico" style="background:rgba(47,174,115,.14);color:var(--environment)">${I.check}</div>
        <div class="st-num">${passRate}<small>%</small></div><div class="st-lab">pass rate</div></div>
    </div>

    <div class="section-head"><h2>Welfare by Domain</h2></div>
    <div class="card card-pad">${domBars(dom).rows}</div>

    <div class="section-head"><h2>Pass / Fail Trend</h2><span class="muted" style="font-size:14px">8 months</span></div>
    <div class="chart-wrap">${lineChart(passTrend, CATS.environment.raw, {unit:'%', labels:months})}</div>

    <div class="section-head"><h2>Risk Trend</h2><span class="muted" style="font-size:14px">% at-risk</span></div>
    <div class="chart-wrap">${lineChart(riskTrend, '#C76B4A', {unit:'%', labels:months})}</div>

    <div class="section-head"><h2>Assessment Distribution</h2><span class="muted" style="font-size:14px">by domain</span></div>
    <div class="card card-pad">
      ${dist.map(x=>{const c=CATS[x.d];return `<div class="spa-bar">
        <span class="b-name">${c.name}</span>
        <span class="b-track"><span class="b-fill" style="width:${Math.round(x.n/distMax*100)}%;background:${c.raw}"></span></span>
        <span class="b-val" style="color:${c.raw}">${x.n}</span></div>`;}).join('')}
    </div>

    <div class="section-head"><h2>Assessment Frequency</h2><span class="muted" style="font-size:14px">per month</span></div>
    <div class="chart-wrap" style="padding:16px 12px 10px">${lollipopChart(freq,{labels:months,baseColor:'#17A186'})}</div>

    <div class="section-head"><h2>Similar Species</h2><span class="muted" style="font-size:14px">${s.taxon.Class}</span></div>
    ${similar.length ? similar.map(o=>{const v=SPECIES[o.k];const d=o.idx-idx;return `
      <div class="acard" onclick="go('speciesAnalytics',{sp:'${o.k}'})">
        ${photoBox(v.name,{size:44,radius:12})}
        <div class="ac-body"><div class="ac-name">${v.name}</div>
          <div class="ac-sub"><span class="tchip ${d>=0?'trend-up':'trend-down'}">${d>=0?I.arrowUp:I.arrowDn}${Math.abs(d)}</span> vs ${s.name}</div></div>
        <span class="idx-pill" style="background:${welfareColor(o.idx)}">${o.idx}</span>
        <span class="chev" style="color:var(--label-tertiary);margin-left:8px">${I.chevron}</span>
      </div>`;}).join('') : `<div class="card card-pad muted" style="text-align:center">No similar species in scope</div>`}

    <div style="height:8px"></div>
  </div></div>`;
};
registerModule({key:'speciesAnalytics', label:'Species Analytics', sub:'Domains · trends · comparison', group:'Species', color:'var(--environment)', icon:I.leaf, param:{sp:'lion'}});
