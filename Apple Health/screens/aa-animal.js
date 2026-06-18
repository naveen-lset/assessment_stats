/* ===========================================================================
   Assessment Analytics — ANIMALS section (individual assessment profiles).
   List of animals → drill into one animal's full assessment analytics profile:
   KPIs · latest result · welfare-by-domain · timeline · history/progression ·
   comparative analytics (vs species / site / enclosure / historical).
   Reuses the analytics kit (aaHeader/aaFilter/aaKpis/aaTrendCard/aaBars2/hcard …),
   welfareDial, gradLine, photoBox, getAnimal, seriesFor/metricFor.
   Custom CSS prefixed `anA` (timeline + compare table + latest-result card).
   =========================================================================== */

injectCSS('css-anA', `
  /* animal list rows */
  .anA-row{display:flex;align-items:center;gap:13px;background:var(--bg-elevated);border:1px solid var(--hairline);
    border-radius:var(--radius);box-shadow:var(--shadow);margin:0 16px 11px;padding:12px 14px;cursor:pointer;}
  .anA-row .anA-body{flex:1;min-width:0;}
  .anA-row .anA-name{font-size:16px;font-weight:700;}
  .anA-row .anA-sub{font-size:13px;color:var(--label-secondary);margin-top:1px;}
  .anA-pill{display:inline-block;font-size:12px;font-weight:800;padding:4px 10px;border-radius:9px;color:#fff;flex:0 0 auto;}

  /* latest assessment result card */
  .anA-latest{display:flex;align-items:center;gap:14px;}
  .anA-latest .anA-lring{flex:0 0 auto;}
  .anA-latest .anA-lmain{flex:1;min-width:0;}
  .anA-latest .anA-ltype{font-size:13px;font-weight:700;}
  .anA-latest .anA-lval{font-size:26px;font-weight:800;letter-spacing:-.6px;margin-top:2px;}
  .anA-latest .anA-lmeta{font-size:12px;color:var(--label-secondary);margin-top:3px;}
  .anA-verdict{font-size:12px;font-weight:800;padding:4px 11px;border-radius:9px;flex:0 0 auto;}

  /* vertical assessment timeline */
  .anA-tl{position:relative;padding:4px 0 0 0;}
  .anA-step{position:relative;padding:0 0 20px 32px;}
  .anA-step:last-child{padding-bottom:2px;}
  .anA-step::before{content:"";position:absolute;left:7px;top:16px;bottom:-4px;width:2px;background:var(--separator);}
  .anA-step:last-child::before{display:none;}
  .anA-dot{position:absolute;left:2px;top:2px;width:12px;height:12px;border-radius:50%;
    border:3px solid var(--bg-elevated);box-shadow:0 0 0 1.5px var(--separator);}
  .anA-st-top{display:flex;align-items:baseline;gap:8px;}
  .anA-st-title{font-size:14.5px;font-weight:700;color:var(--label);}
  .anA-st-date{font-size:12px;color:var(--label-tertiary);margin-left:auto;flex:0 0 auto;}
  .anA-st-meta{font-size:12.5px;color:var(--label-secondary);margin-top:2px;}
  .anA-st-score{font-size:12.5px;font-weight:800;}

  /* comparison table */
  .anA-cmp .anA-crow{display:flex;align-items:center;gap:10px;padding:9px 0;border-top:1px solid var(--separator);}
  .anA-cmp .anA-crow:first-child{border-top:0;}
  .anA-cmp .anA-cname{flex:1;font-size:13.5px;color:var(--label-2);font-weight:600;}
  .anA-cmp .anA-cavg{font-size:13px;color:var(--label-tertiary);font-weight:600;width:64px;text-align:right;flex:0 0 auto;}
  .anA-cmp .anA-cdelta{font-size:13px;font-weight:800;width:58px;text-align:right;flex:0 0 auto;display:flex;align-items:center;justify-content:flex-end;gap:2px;}
  .anA-cmp .anA-cdelta svg{width:11px;height:11px;}
`);

/* ---- helpers ------------------------------------------------------------- */
/* this animal's welfare index */
function anAIdx(a){ return welfareIndex(a.welfare); }

/* species-average welfare index (animals of same species) */
function anASpeciesAvg(a){
  const peers = Object.values(ANIMALS).filter(x=>x.sp===a.sp);
  return Math.round(peers.reduce((s,x)=>s+welfareIndex(x.welfare),0)/peers.length);
}
/* plausible, stable site & enclosure averages derived from the org / encl hash */
function anASiteAvg(a){
  const sites = SITES; const s = sites[Math.abs(hashStr(a.sp))%sites.length];
  return s.welfare;
}
function anAEnclAvg(a){
  const idx = anAIdx(a);
  return Math.max(48, Math.min(95, idx - 3 + (Math.abs(hashStr(a.encl||a.id))%9) - 4));
}

/* a stable 8-month welfare progression for one animal (anchored to current idx) */
function anAWelfareSeries(a){
  const idx = anAIdx(a);
  const seed = Math.abs(hashStr(a.id+'welfare'));
  const months = monthLabels(8);
  const data = months.map((_,i)=>{
    const t = i/(months.length-1);
    const drift = (idx-12) + Math.round(12*t);          // gentle rise toward current
    const wob = ((seed+i*29)%7)-3;
    return Math.max(40, Math.min(99, drift + wob));
  });
  data[data.length-1] = idx;                            // anchor "now"
  return {data, months};
}

/* derive a list of recent assessments for this animal from its favourite metrics */
function anARecent(a){
  const keys = (a.favorites && a.favorites.length ? a.favorites : a.metrics).slice(0,5);
  const dayBase = a.seen || 1;
  return keys.map((k,i)=>{
    const m = metricFor(a.id, k);
    const ser = seriesFor(a.id, k, 'M');
    let val, score, pass;
    if(m.type==='cat'){
      const v = ser.data[ser.data.length-1];
      val = v; score = v==='Good'?100:v==='Fair'?60:20; pass = v!=='Poor';
    } else {
      const v = ser.data[ser.data.length-1];
      val = `${v}${m.unit||''}`;
      const lo = Math.min(...ser.data), hi = Math.max(...ser.data), rng=(hi-lo)||1;
      score = m.max ? Math.round(v/m.max*100) : Math.round(((v-lo)/rng)*40+58);
      score = Math.max(20, Math.min(100, score));
      pass = score>=60;
    }
    const daysAgo = dayBase + i*6;
    return {key:k, type:m.cat, name:m.name, val, score, pass,
      daysAgo, when: daysAgo<=1?'Today': daysAgo<=2?'Yesterday': `${daysAgo}d ago`};
  });
}

/* ============================================================ aaAnimal ===== */
SCREENS.aaAnimal = (params={}) => {

  /* ---------- LIST MODE ---------------------------------------------------- */
  if(!params.animalId){
    const list = Object.values(ANIMALS)
      .sort((a,b)=>anAIdx(a)-anAIdx(b))
      .map(a=>{ const idx=anAIdx(a); const col=welfareColor(idx);
        return `<div class="anA-row" onclick="go('aaAnimal',{animalId:'${a.id}'})">
          ${photoBox(a.name,{size:46,radius:13})}
          <div class="anA-body">
            <div class="anA-name">${a.name}</div>
            <div class="anA-sub">${a.species} · ${a.sex} · ${a.encl}</div>
          </div>
          <span class="anA-pill" style="background:${col}">${idx} · ${welfareLabel(idx)}</span>
          <span class="chev" style="color:var(--label-tertiary);margin-left:6px">${I.chevron}</span>
        </div>`;
      }).join('');

    return `<div class="screen active"><div class="scroll">
      ${aaHeader('aaAnimal', {sub:'Individual assessment profiles'})}
      ${aaFilter()}
      <div class="section-head"><h2>Animals</h2><span class="muted" style="font-size:14px">${Object.keys(ANIMALS).length}</span></div>
      ${list}
      <div style="height:10px"></div>
    </div></div>`;
  }

  /* ---------- PROFILE MODE ------------------------------------------------- */
  const a = getAnimal(params.animalId);
  const idx = anAIdx(a);
  const idxCol = welfareColor(idx);
  const recent = anARecent(a);
  const latest = recent[0];
  const scores = recent.map(r=>r.score);
  const hi = Math.max(...scores), lo = Math.min(...scores);
  const avgScore = Math.round(scores.reduce((s,v)=>s+v,0)/scores.length);

  /* welfare progression */
  const {data:wseries, months} = anAWelfareSeries(a);
  const improvement = wseries[wseries.length-1] - wseries[0];
  const declineMax = (()=>{ let worst=0; for(let i=1;i<wseries.length;i++){ const d=wseries[i]-wseries[i-1]; if(d<worst) worst=d; } return worst; })();
  const trendUp = improvement>=0;

  /* a key-metric progression (first favourite, numeric if possible) */
  const keyKey = (a.favorites||a.metrics)[0];
  const keyMetric = metricFor(a.id, keyKey);
  const keySer = seriesFor(a.id, keyKey, 'M');
  const keyImprove = keyMetric.type==='cat' ? null
    : Math.round((keySer.data[keySer.data.length-1]-keySer.data[0]) / (Math.abs(keySer.data[0])||1) * 100);

  /* comparative analytics */
  const spAvg = anASpeciesAvg(a), siteAvg = anASiteAvg(a), enclAvg = anAEnclAvg(a);
  const histAvg = Math.round(wseries.slice(0,4).reduce((s,v)=>s+v,0)/4);   // first-half historical
  const cmpRows = [
    {name:`Species avg · ${a.species}`, avg:spAvg},
    {name:'Site avg', avg:siteAvg},
    {name:`Enclosure avg · ${a.encl}`, avg:enclAvg},
    {name:'Historical (this animal)', avg:histAvg},
  ].map(r=>({...r, delta: idx-r.avg}));

  /* welfare-by-domain legend (welfare-lite mirror) */
  const legend = DOMAIN_ORDER.map(d=>{const c=CATS[d];return `<div class="wl-row">
    <span class="wl-dot" style="background:${c.raw}"></span><span class="wl-name">${c.name}</span>
    <span class="wl-score" style="color:${c.raw}">${a.welfare[d]}</span></div>`;}).join('');
  const lowest = DOMAIN_ORDER.reduce((x,y)=>a.welfare[x]<=a.welfare[y]?x:y);

  /* timeline rows */
  const tl = recent.map(r=>{
    const col = r.pass ? welfareColor(r.score) : '#C76B4A';
    const c = CATS[r.type];
    return `<div class="anA-step">
      <span class="anA-dot" style="background:${col}"></span>
      <div class="anA-st-top">
        <span class="anA-st-title">${r.name}</span>
        <span class="anA-st-date">${r.when}</span>
      </div>
      <div class="anA-st-meta"><span style="color:${c.color};font-weight:600">${c.name}</span> · ${r.val}
        · <span class="anA-st-score" style="color:${col}">${r.score} · ${r.pass?'Pass':'Fail'}</span></div>
    </div>`;
  }).join('');

  const latestCol = latest.pass ? welfareColor(latest.score) : '#C76B4A';

  return `<div class="screen active"><div class="scroll">
    ${aaHeader('aaAnimal')}

    <div class="page-hero" style="display:flex;align-items:center;gap:14px">
      ${photoBox(a.name,{size:60,radius:16})}
      <div style="flex:1;min-width:0">
        <div class="ph-title" style="font-size:26px">${a.name}</div>
        <div class="ph-sub">${a.species} · ${a.sex} · ${a.encl}</div>
        <div class="ph-sub" style="margin-top:5px"><span style="color:var(--antz);font-weight:600;cursor:pointer" onclick="aaGo('aaAnimal')">‹ All animals</span></div>
      </div>
    </div>

    <!-- 1 · ASSESSMENT OVERVIEW -->
    <div class="section-head"><h2>Assessment Overview</h2></div>
    ${aaKpis([
      {lab:'Welfare Status', val:welfareLabel(idx), color:idxCol},
      {lab:'Welfare Score', val:idx, color:idxCol, sub:'five-domain index'},
      {lab:'Risk Level', val: idx>=70?'Low': idx>=55?'Moderate':'High',
        color: idx>=70?'#2FAE73': idx>=55?'#E4B819':'#FA6140'},
      {lab:'Last Assessment', val:latest.when, sub:latest.name},
      {lab:'Assessment Frequency', val:'Weekly', sub:`${recent.length} active types`},
      {lab:'Assessment Recency', val:`${a.seen||1}d`, sub: (a.seen||1)>14?'overdue':'on schedule',
        color:(a.seen||1)>14?'#FA6140':null},
      {lab:'Assessment Consistency', val: 92-((a.seen||1)>14?14:0), unit:'%', sub:'on-time rate'},
      {lab:'Open Records', val: recent.length, sub:'tracked metrics'},
    ])}

    <!-- 2 · LATEST RESULT -->
    <div class="section-head"><h2>Latest Assessment Result</h2></div>
    ${hcard(latest.name, latest.when, `go('aaRecords')`, `<div class="anA-latest">
      <div class="anA-lring">${ringMini(latest.score/100, latestCol, {size:64, label:String(latest.score)})}</div>
      <div class="anA-lmain">
        <div class="anA-ltype" style="color:${CATS[latest.type].color}">${CATS[latest.type].name}</div>
        <div class="anA-lval">${latest.val}</div>
        <div class="anA-lmeta">Score ${latest.score} of 100 · ${latest.name}</div>
      </div>
      <span class="anA-verdict" style="background:${latestCol}1f;color:${latestCol}">${latest.pass?'Pass':'Fail'}</span>
    </div>`)}
    ${aaKpis([
      {lab:'Highest Assessment Score', val:hi, color:welfareColor(hi)},
      {lab:'Lowest Assessment Score', val:lo, color:welfareColor(lo)},
      {lab:'Average Assessment Score', val:avgScore, color:welfareColor(avgScore)},
      {lab:'Pass Rate', val:Math.round(recent.filter(r=>r.pass).length/recent.length*100), unit:'%',
        color:welfareColor(Math.round(recent.filter(r=>r.pass).length/recent.length*100))},
    ])}

    <!-- 3 · WELFARE BY DOMAIN -->
    <div class="section-head"><h2>Welfare by Domain</h2></div>
    <div class="welfare-lite">
      <div class="welfare-top"><span class="w-title">Welfare · Five Domains</span><span class="w-when">current</span></div>
      <div class="welfare-body">${welfareDial(a.welfare,{light:true})}<div class="welfare-legend">${legend}</div></div>
      <div class="welfare-foot"><span class="wf-dot"></span><span><b>${CATS[lowest].name}</b> is the weakest domain (${a.welfare[lowest]}) for ${a.name}.</span></div>
    </div>

    <!-- 4 · ASSESSMENT TIMELINE -->
    <div class="section-head"><h2>Assessment Timeline</h2><span class="muted" style="font-size:14px">recent</span></div>
    <div class="card card-pad"><div class="anA-tl">${tl}</div></div>

    <!-- 5 · HISTORY & PROGRESSION -->
    <div class="section-head"><h2>Assessment History &amp; Progression</h2></div>
    ${aaTrendCard('Welfare Score Progression', '8 months', idx, idxCol, wseries,
      {from: trendUp?'#00D6C9':'#E4B819', to: trendUp?'#37BD69':'#C76B4A', goExpr:`go('aaCompare')`})}
    ${aaKpis([
      {lab:'Improvement Trend', val:(improvement>=0?'+':'')+improvement, unit:'pts',
        delta:Math.abs(improvement), up:improvement>=0, color: improvement>=0?'#2FAE73':'#FA6140'},
      {lab:'Decline (worst month)', val: declineMax<0?declineMax+' pts':'None',
        color: declineMax<0?'#FA6140':'#2FAE73', sub: declineMax<0?'largest single drop':'no regression'},
    ])}
    ${hcard(`${keyMetric.name} Progression`, keyMetric.type==='cat'?'condition over 8 months':(keyImprove>=0?`+${keyImprove}% vs start`:`${keyImprove}% vs start`), `go('aaRecords')`,
      keyMetric.type==='cat'
        ? `${homeBars(seriesFor(a.id,keyKey,'M').data.map(v=>v==='Good'?3:v==='Fair'?2:1), CATS[keyMetric.cat].raw, {h:64})}`
        : `${gradLine(keySer.data, {from:CATS[keyMetric.cat].raw, to:CATS[keyMetric.cat].raw})}`)}

    <!-- 6 · COMPARATIVE ANALYTICS -->
    <div class="section-head"><h2>Comparative Analytics</h2><span class="muted" style="font-size:14px">${a.name} vs</span></div>
    ${aaBars2('Welfare Score vs Averages', [
      {name:a.name, val:idx, disp:idx, color:idxCol},
      {name:'Species', val:spAvg, disp:spAvg, color:welfareColor(spAvg)},
      {name:'Site', val:siteAvg, disp:siteAvg, color:welfareColor(siteAvg)},
      {name:'Enclosure', val:enclAvg, disp:enclAvg, color:welfareColor(enclAvg)},
    ], {goExpr:`go('aaCompare')`})}
    ${hcard('Performance vs Peers', 'welfare index delta', `go('aaCompare')`, `<div class="anA-cmp">${cmpRows.map(r=>{
      const up = r.delta>=0;
      return `<div class="anA-crow">
        <span class="anA-cname">${r.name}</span>
        <span class="anA-cavg">avg ${r.avg}</span>
        <span class="anA-cdelta" style="color:${up?'#2FAE73':'#FA6140'}">${up?I.arrowUp:I.arrowDn}${Math.abs(r.delta)}</span>
      </div>`;
    }).join('')}</div>`)}
    ${aaTrendCard('Historical Performance', `now ${idx} · was ${histAvg}`, (idx-histAvg>=0?'+':'')+(idx-histAvg)+' pts',
      welfareColor(idx), wseries, {from:'#00AFD6', to:'#37BD69', goExpr:`go('aaCompare')`})}

    <div style="height:10px"></div>
  </div></div>`;
};

registerModule({key:'aaAnimal', label:'Animal Analytics', sub:'Individual assessment profiles', group:'Animals & Capture', color:'var(--behaviour)', icon:I.paw});
