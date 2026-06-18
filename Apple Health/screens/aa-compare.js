/* ===========================================================================
   Assessment Analytics — COMPARE v2 (premium kit, Plus Jakarta, comparison
   CARDS not tables). Side-by-side benchmarking across Animal · Species · Site.
   Builds on the v2 kit (12-aa-kit2.js): cmpCard pattern via .k2-cmp-two /
   .k2-cmp-e / .k2-cmp-row, plus ringMini, gradLine, aaDonut, heroKpi.
   Reuses: aaHeader, aaDonut, photoBox, ringMini, gradLine, monthLabels,
   welfareIndex/Label/Color, DOMAIN_ORDER, CATS, SPECIES, ANIMALS, SITES,
   openSheet/closeSheet, range-seg, idx-pill, pill-list/pill-opt, I.
   New CSS via injectCSS('css-cmpA2', …), tokens only.
   =========================================================================== */

injectCSS('css-cmpA2', `
  /* entity header cards (the two things being compared) */
  .cmpA2-e{position:relative;display:flex;flex-direction:column;align-items:center;gap:9px;
    background:var(--bg-elevated);border:1px solid var(--hairline);border-radius:18px;box-shadow:var(--shadow);
    padding:18px 12px 14px;text-align:center;cursor:pointer;}
  .cmpA2-e .tag{position:absolute;top:11px;left:12px;width:22px;height:22px;border-radius:8px;color:#fff;
    display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;}
  .cmpA2-e .nm{font-size:16px;font-weight:700;letter-spacing:-.2px;line-height:1.15;}
  .cmpA2-e .mt{font-size:12px;color:var(--label-secondary);font-weight:600;margin-top:-2px;}
  .cmpA2-e .pill{font-size:12px;font-weight:700;padding:4px 12px;border-radius:10px;color:#fff;}
  .cmpA2-e .chg{font-size:12.5px;font-weight:700;color:var(--label-secondary);display:inline-flex;align-items:center;gap:4px;}
  .cmpA2-e .chg svg{width:9px;height:9px;}

  /* metric comparison rows: A value | label | B value (winner highlighted) */
  .cmpA2-mrow{display:flex;align-items:center;gap:8px;padding:13px 0;border-top:1px solid var(--separator);}
  .cmpA2-mrow:first-child{border-top:0;}
  .cmpA2-mrow .v{width:62px;flex:0 0 auto;text-align:center;font-size:19px;font-weight:700;letter-spacing:-.4px;
    color:var(--label-secondary);}
  .cmpA2-mrow .v.win{color:var(--environment);}
  .cmpA2-mrow .v small{font-size:12px;font-weight:600;}
  .cmpA2-mrow .lab{flex:1;text-align:center;}
  .cmpA2-mrow .lab .lt{font-size:13.5px;font-weight:700;color:var(--label);}
  .cmpA2-mrow .lab .ls{font-size:11px;color:var(--label-tertiary);font-weight:600;margin-top:1px;}
  .cmpA2-vhead{display:flex;align-items:center;gap:8px;padding-bottom:4px;}
  .cmpA2-vhead .h{width:62px;flex:0 0 auto;text-align:center;font-size:11px;font-weight:700;
    text-transform:uppercase;letter-spacing:.4px;color:var(--label-tertiary);display:inline-flex;
    align-items:center;justify-content:center;gap:5px;}
  .cmpA2-vhead .h i{width:14px;height:14px;border-radius:5px;color:#fff;display:inline-flex;
    align-items:center;justify-content:center;font-size:9px;font-weight:700;}
  .cmpA2-vhead .sp{flex:1;}

  /* twin donut / twin trend wells */
  .cmpA2-twin{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .cmpA2-w{background:var(--fill-quat);border-radius:14px;padding:13px 10px 10px;}
  .cmpA2-w .wl{font-size:12.5px;font-weight:700;display:flex;align-items:center;gap:6px;padding:0 2px 6px;}
  .cmpA2-w .wl i{width:16px;height:16px;border-radius:6px;color:#fff;display:inline-flex;
    align-items:center;justify-content:center;font-size:10px;font-weight:700;flex:0 0 auto;}
  .cmpA2-w .donutwrap{display:flex;justify-content:center;padding:4px 0 2px;}
  .cmpA2-w .leg{display:flex;flex-direction:column;gap:5px;margin-top:8px;}
  .cmpA2-w .leg .lg{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--label-2);font-weight:600;}
  .cmpA2-w .leg .lg i{width:8px;height:8px;border-radius:3px;flex:0 0 auto;}
  .cmpA2-w .leg .lg b{margin-left:auto;color:var(--label);}
  .cmpA2-w .end{font-size:11px;color:var(--label-tertiary);font-weight:600;padding:2px 2px 0;}

  /* improvement summary */
  .cmpA2-imp{display:flex;align-items:center;gap:14px;}
  .cmpA2-imp .big{font-size:32px;font-weight:700;letter-spacing:-.8px;line-height:1;}
  .cmpA2-imp .cap{font-size:12px;color:var(--label-secondary);font-weight:600;margin-top:4px;}
  .cmpA2-imp .who{flex:1;display:flex;align-items:center;gap:11px;background:var(--fill-quat);border-radius:14px;padding:11px 13px;}
  .cmpA2-imp .who .wn{font-size:14.5px;font-weight:700;}
  .cmpA2-imp .who .ws{font-size:11.5px;color:var(--label-secondary);font-weight:600;margin-top:1px;}
  .cmpA2-note{font-size:13px;color:var(--label-2);line-height:1.5;margin-top:13px;}
  .cmpA2-note b{color:var(--label);}
`);

/* ---- module-level selection (live mode switch; setters re-render) -------- */
let cmpA2Mode = 'Species';
let cmpA2SpA  = 'lion',        cmpA2SpB = 'gorilla';   /* Lion vs Western Gorilla */
let cmpA2AnA  = 'lion-1',      cmpA2AnB = 'gorilla-1';
let cmpA2SiA  = 's-summit',    cmpA2SiB = 's-savanna';

function cmpA2SetMode(m){ cmpA2Mode = m; closeSheet(); render(); }
function cmpA2SetSpA(v){ cmpA2SpA = v; closeSheet(); render(); }
function cmpA2SetSpB(v){ cmpA2SpB = v; closeSheet(); render(); }
function cmpA2SetAnA(v){ cmpA2AnA = v; closeSheet(); render(); }
function cmpA2SetAnB(v){ cmpA2AnB = v; closeSheet(); render(); }
function cmpA2SetSiA(v){ cmpA2SiA = v; closeSheet(); render(); }
function cmpA2SetSiB(v){ cmpA2SiB = v; closeSheet(); render(); }

/* ---- derived helpers ----------------------------------------------------- */
function cmpA2DomAvg(sp){
  const inds = Object.values(ANIMALS).filter(a=>a.sp===sp);
  const d={}; DOMAIN_ORDER.forEach(k=>d[k]= inds.length ? Math.round(inds.reduce((s,a)=>s+a.welfare[k],0)/inds.length) : 0);
  return {dom:d, n:inds.length};
}
/* stable synthetic 8-month welfare trend ending near `end` */
function cmpA2Trend(seed, end){
  const h=Math.abs(hashStr(seed));
  return monthLabels(8).map((_,i)=> Math.max(35, Math.min(100, Math.round(end - (7-i)*1.3 + (((h+i*29)%9)-4)))));
}
/* stable synthetic integer in [lo,hi] keyed to a string */
function cmpA2Synth(key, lo, hi){ return lo + (Math.abs(hashStr(key)) % (hi-lo+1)); }
/* risk distribution (Excellent/Good/Fair/Watch) for a list of welfare indices */
function cmpA2DistFrom(indices){
  const d={Excellent:0,Good:0,Fair:0,Watch:0};
  indices.forEach(v=>d[welfareLabel(v)]++);
  return d;
}
const CMPA2_DIST_C = {Excellent:'#37BD69', Good:'#00D6C9', Fair:'#E4B819', Watch:'#FA6140'};

/* ---- pick sheets --------------------------------------------------------- */
function cmpA2ModeSheet(){
  const modes=['Animal','Species','Site'];
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div><div class="sh-title">Comparison Type</div><div class="sh-sub">What to benchmark</div></div>
      <div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="pill-list">${modes.map(m=>`<div class="pill-opt ${m===cmpA2Mode?'sel':''}" onclick="cmpA2SetMode('${m}')">
      <span style="flex:1">${m}</span><span class="chk">${I.check}</span></div>`).join('')}</div>`);
}
function cmpA2PickSheet(slot){
  let title='', sub=`Entity ${slot}`, cur, setter, opts;
  if(cmpA2Mode==='Species'){
    title='Choose Species'; cur = slot==='A'?cmpA2SpA:cmpA2SpB; setter = slot==='A'?'cmpA2SetSpA':'cmpA2SetSpB';
    opts = Object.entries(SPECIES).map(([k,v])=>{ const idx=welfareIndex(cmpA2DomAvg(k).dom);
      return {k, name:v.name, idx, col:welfareColor(idx)};});
  } else if(cmpA2Mode==='Animal'){
    title='Choose Animal'; cur = slot==='A'?cmpA2AnA:cmpA2AnB; setter = slot==='A'?'cmpA2SetAnA':'cmpA2SetAnB';
    opts = Object.values(ANIMALS).map(a=>{ const idx=welfareIndex(a.welfare);
      return {k:a.id, name:`${a.name} · ${a.species}`, idx, col:welfareColor(idx)};});
  } else {
    title='Choose Site'; cur = slot==='A'?cmpA2SiA:cmpA2SiB; setter = slot==='A'?'cmpA2SetSiA':'cmpA2SetSiB';
    opts = SITES.map(s=>({k:s.id, name:s.name, idx:s.welfare, col:welfareColor(s.welfare)}));
  }
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div><div class="sh-title">${title}</div><div class="sh-sub">${sub}</div></div>
      <div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="pill-list">${opts.map(o=>`<div class="pill-opt ${o.k===cur?'sel':''}" onclick="${setter}('${o.k}')">
      <span class="dot" style="background:${o.col}"></span>
      <span style="flex:1">${o.name}</span>
      <span class="idx-pill" style="background:${o.col}">${o.idx}</span>
      <span class="chk">${I.check}</span></div>`).join('')}</div>`);
}

/* ---- per-mode model: returns {A,B} entity descriptors + metric rows ------- */
/* entity = {name, meta, idx, color, label, photo, dist, trend, trendSub}
   metric = {lab, sub, a, b, unit, higherBetter (default true)} */
function cmpA2Model(){
  if(cmpA2Mode==='Species'){
    const A=SPECIES[cmpA2SpA], B=SPECIES[cmpA2SpB];
    const da=cmpA2DomAvg(cmpA2SpA), db=cmpA2DomAvg(cmpA2SpB);
    const ia=welfareIndex(da.dom), ib=welfareIndex(db.dom);
    const indsA=Object.values(ANIMALS).filter(a=>a.sp===cmpA2SpA).map(a=>welfareIndex(a.welfare));
    const indsB=Object.values(ANIMALS).filter(a=>a.sp===cmpA2SpB).map(a=>welfareIndex(a.welfare));
    const metrics=[
      {lab:'Assessment Score', sub:'avg quality',    a:cmpA2Synth('asc'+cmpA2SpA,62,92), b:cmpA2Synth('asc'+cmpA2SpB,62,92)},
      {lab:'Assessment Frequency', sub:'per animal / yr', a:cmpA2Synth('frq'+cmpA2SpA,6,16), b:cmpA2Synth('frq'+cmpA2SpB,6,16)},
      {lab:'Assessment Coverage', sub:'% with current', a:cmpA2Synth('cov'+cmpA2SpA,72,99), b:cmpA2Synth('cov'+cmpA2SpB,72,99), unit:'%'},
      {lab:'Assessment Compliance', sub:'% on-time',  a:cmpA2Synth('cmp'+cmpA2SpA,70,98), b:cmpA2Synth('cmp'+cmpA2SpB,70,98), unit:'%'},
    ];
    return {
      metrics,
      A:{name:A.name, meta:`${da.n} animals · ${A.taxon.Class}`, idx:ia, color:welfareColor(ia), label:welfareLabel(ia),
         photo:A.name, dist:cmpA2DistFrom(indsA), trend:cmpA2Trend(cmpA2SpA, ia), trendSub:A.taxon.Class},
      B:{name:B.name, meta:`${db.n} animals · ${B.taxon.Class}`, idx:ib, color:welfareColor(ib), label:welfareLabel(ib),
         photo:B.name, dist:cmpA2DistFrom(indsB), trend:cmpA2Trend(cmpA2SpB, ib), trendSub:B.taxon.Class},
    };
  }
  if(cmpA2Mode==='Animal'){
    const A=getAnimal(cmpA2AnA), B=getAnimal(cmpA2AnB);
    const ia=welfareIndex(A.welfare), ib=welfareIndex(B.welfare);
    const metrics=[
      {lab:'Assessment Score', sub:'avg quality',    a:cmpA2Synth('asc'+A.id,60,94), b:cmpA2Synth('asc'+B.id,60,94)},
      {lab:'Assessment Frequency', sub:'per year',   a:cmpA2Synth('frq'+A.id,8,20),  b:cmpA2Synth('frq'+B.id,8,20)},
      {lab:'Assessment Coverage', sub:'% domains current', a:cmpA2Synth('cov'+A.id,70,100), b:cmpA2Synth('cov'+B.id,70,100), unit:'%'},
      {lab:'Assessment Compliance', sub:'% on-time', a:cmpA2Synth('cmp'+A.id,66,99),  b:cmpA2Synth('cmp'+B.id,66,99), unit:'%'},
    ];
    const distA=cmpA2DistFrom(DOMAIN_ORDER.map(d=>A.welfare[d]));
    const distB=cmpA2DistFrom(DOMAIN_ORDER.map(d=>B.welfare[d]));
    return {
      metrics,
      A:{name:A.name, meta:`${A.species} · ${A.sex}`, idx:ia, color:welfareColor(ia), label:welfareLabel(ia),
         photo:A.species, dist:distA, trend:cmpA2Trend(A.id, ia), trendSub:A.encl},
      B:{name:B.name, meta:`${B.species} · ${B.sex}`, idx:ib, color:welfareColor(ib), label:welfareLabel(ib),
         photo:B.species, dist:distB, trend:cmpA2Trend(B.id, ib), trendSub:B.encl},
    };
  }
  /* Site */
  const A=SITES.find(s=>s.id===cmpA2SiA)||SITES[0], B=SITES.find(s=>s.id===cmpA2SiB)||SITES[1];
  const metrics=[
    {lab:'Assessment Score', sub:'site index',     a:A.welfare,    b:B.welfare},
    {lab:'Assessment Frequency', sub:'% on-time',  a:A.onTime,     b:B.onTime, unit:'%'},
    {lab:'Assessment Coverage', sub:'% completion', a:A.completion, b:B.completion, unit:'%'},
    {lab:'Assessment Compliance', sub:'% compliant', a:A.compliance, b:B.compliance, unit:'%'},
  ];
  const mk=(s)=>{ const exc=Math.round(s.animals*(s.welfare/100)*0.55), good=Math.round(s.animals*0.30),
      watch=Math.round(s.animals*(s.risk/100)), fair=Math.max(0,s.animals-exc-good-watch);
    return {Excellent:exc, Good:good, Fair:fair, Watch:watch};};
  return {
    metrics,
    A:{name:A.name, meta:`${A.animals} animals`, idx:A.welfare, color:welfareColor(A.welfare), label:welfareLabel(A.welfare),
       photo:A.name, dist:mk(A), trend:[...A.trend, A.welfare].slice(-8), trendSub:`${A.compliance}% compliant`},
    B:{name:B.name, meta:`${B.animals} animals`, idx:B.welfare, color:welfareColor(B.welfare), label:welfareLabel(B.welfare),
       photo:B.name, dist:mk(B), trend:[...B.trend, B.welfare].slice(-8), trendSub:`${B.compliance}% compliant`},
  };
}

/* ============================================================== SCREEN ===== */
SCREENS.aaCompare = (params={}) => {
  const modes=['Animal','Species','Site'];
  const M=cmpA2Model();
  const A=M.A, B=M.B;
  const months=monthLabels(8);
  const diff = B.idx - A.idx;
  const pct  = A.idx ? Math.round((B.idx-A.idx)/A.idx*1000)/10 : 0;
  const winner = diff>=0 ? B : A;
  const loser  = diff>=0 ? A : B;

  /* entity header card = photoBox + name + ringMini of index + welfare pill + Change affordance */
  const entCard=(slot, e)=>`<div class="cmpA2-e" onclick="cmpA2PickSheet('${slot}')">
    <span class="tag" style="background:${e.color}">${slot}</span>
    ${photoBox(e.photo,{size:52,radius:15})}
    <div><div class="nm">${e.name}</div><div class="mt">${e.meta}</div></div>
    ${ringMini(e.idx/100, e.color, {size:82, label:String(e.idx), fs:22})}
    <span class="pill" style="background:${e.color}">${e.label}</span>
    <span class="chg">Change ${I.chevron}</span>
  </div>`;

  /* one metric comparison ROW: A value | label | B value, winner side green */
  const metricRow=(m)=>{
    const hb = m.higherBetter!==false;
    const aWin = hb ? m.a>m.b : m.a<m.b;
    const bWin = hb ? m.b>m.a : m.b<m.a;
    const u = m.unit||'';
    return `<div class="cmpA2-mrow">
      <span class="v ${aWin?'win':''}">${m.a}${u?`<small>${u}</small>`:''}</span>
      <span class="lab"><div class="lt">${m.lab}</div><div class="ls">${m.sub||''}</div></span>
      <span class="v ${bWin?'win':''}">${m.b}${u?`<small>${u}</small>`:''}</span>
    </div>`;
  };

  const distLegend=(e)=>{ const total=Object.values(e.dist).reduce((s,v)=>s+v,0)||1;
    return Object.entries(e.dist).map(([k,v])=>`<div class="lg"><i style="background:${CMPA2_DIST_C[k]}"></i>${k}<b>${Math.round(v/total*100)}%</b></div>`).join('');};
  const distSegs=(e)=>Object.entries(e.dist).map(([k,v])=>({label:k, color:CMPA2_DIST_C[k], val:v}));

  return `<div class="screen active"><div class="scroll">
    ${aaHeader('aaCompare', {sub:'Benchmarking'})}

    <!-- comparison TYPE segmented -->
    <div class="range-seg" style="margin:10px 24px 2px">
      ${modes.map(m=>`<button class="${m===cmpA2Mode?'on':''}" onclick="cmpA2SetMode('${m}')">${m}</button>`).join('')}
    </div>

    <!-- two entity cards side by side -->
    <div class="k2-sec" style="margin-top:14px">
      <div class="k2-cmp-two" style="margin-bottom:0">
        ${entCard('A', A)}
        ${entCard('B', B)}
      </div>
    </div>

    <!-- METRIC COMPARISON as comparison-card rows -->
    <div class="k2-sec"><div class="k2-h">Metric Comparison <span class="more">A vs B</span></div>
      <div class="k2-card">
        <div class="cmpA2-vhead">
          <span class="h"><i style="background:${A.color}">A</i></span>
          <span class="sp"></span>
          <span class="h"><i style="background:${B.color}">B</i></span>
        </div>
        ${M.metrics.map(metricRow).join('')}
      </div></div>

    <!-- RISK DISTRIBUTION: two donuts side by side -->
    <div class="k2-sec"><div class="k2-h">Risk Distribution <span class="more">A vs B</span></div>
      <div class="cmpA2-twin">
        <div class="cmpA2-w">
          <div class="wl"><i style="background:${A.color}">A</i>${A.name}</div>
          <div class="donutwrap">${aaDonut(distSegs(A),{size:104,sw:17})}</div>
          <div class="leg">${distLegend(A)}</div>
        </div>
        <div class="cmpA2-w">
          <div class="wl"><i style="background:${B.color}">B</i>${B.name}</div>
          <div class="donutwrap">${aaDonut(distSegs(B),{size:104,sw:17})}</div>
          <div class="leg">${distLegend(B)}</div>
        </div>
      </div></div>

    <!-- TREND: two gradLine mini charts over 8 months -->
    <div class="k2-sec"><div class="k2-h">Welfare Trend <span class="more">8 months</span></div>
      <div class="cmpA2-twin">
        <div class="cmpA2-w">
          <div class="wl"><i style="background:${A.color}">A</i>${A.name}</div>
          ${gradLine(A.trend, {from:A.color, to:A.color, fill:true})}
          <div class="end">${months[0]} → ${months[months.length-1]} · ends ${A.idx}</div>
        </div>
        <div class="cmpA2-w">
          <div class="wl"><i style="background:${B.color}">B</i>${B.name}</div>
          ${gradLine(B.trend, {from:B.color, to:B.color, fill:true})}
          <div class="end">${months[0]} → ${months[months.length-1]} · ends ${B.idx}</div>
        </div>
      </div></div>

    <!-- IMPROVEMENT SUMMARY -->
    <div class="k2-sec"><div class="k2-h">Improvement Summary</div>
      <div class="k2-card">
        <div class="cmpA2-imp">
          <div>
            <div class="big" style="color:${pct>=0?'var(--environment)':'#FA6140'}">${pct>=0?'+':''}${pct}%</div>
            <div class="cap">welfare gap (B vs A)</div>
          </div>
          <div class="who">
            ${ringMini(winner.idx/100, winner.color, {size:48, label:String(winner.idx), fs:15})}
            <div><div class="wn">${winner.name}</div><div class="ws">Trending up · leads by ${Math.abs(diff)} pts</div></div>
          </div>
        </div>
        <div class="cmpA2-note">Over the last 8 months <b>${winner.name}</b> holds the stronger trajectory and now leads <b>${loser.name}</b> by <b>${Math.abs(diff)} points</b> on welfare index. ${loser.name} is the priority for assessment review and intervention.</div>
      </div></div>

    <div style="height:18px"></div>
  </div></div>`;
};

registerModule({key:'aaCompare', label:'Compare', sub:'Benchmarking · animal · species · site', group:'Executive', color:'var(--behaviour)', icon:I.scale});
