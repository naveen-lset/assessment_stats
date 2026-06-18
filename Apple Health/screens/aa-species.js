/* ===========================================================================
   Assessment Analytics — SPECIES (v2 premium redesign).
   No params  → species intelligence list (photoBox + welfare pill rows).
   {sp}       → species analytics card + 4 focused sections:
                Summary · Assessment Categories (radar) · Trends · Animal Rankings.
   Built on the v2 kit (12-aa-kit2.js): k2-sec spacing, k2-card, k2-snap,
   radarChart · progressRow · colChart · gradLine · leaderboard. Plus Jakarta.
   =========================================================================== */

injectCSS('css-spA2', `
  .spA2-list .k2-rec{cursor:pointer;}
  .spA2-card{display:flex;gap:14px;align-items:center;}
  .spA2-card .nm{font-size:22px;font-weight:700;letter-spacing:-.4px;line-height:1.05;}
  .spA2-card .latin{font-size:13px;color:var(--label-secondary);font-style:italic;margin-top:2px;}
  .spA2-back{display:inline-block;margin:10px 24px 0;font-size:13px;font-weight:600;color:var(--primary);cursor:pointer;}
  .spA2-pill{font-size:14px;font-weight:700;color:#fff;padding:6px 12px;border-radius:10px;flex:0 0 auto;}
  .spA2-2col{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  .spA2-radarcap{text-align:center;font-size:13px;color:var(--label-secondary);font-weight:600;margin-top:6px;}
  .spA2-rule{height:1px;background:var(--separator);margin:16px 0 4px;}
`);

/* species domain averages from its individuals */
function spA2Dom(inds){
  const d={}; DOMAIN_ORDER.forEach(k=>d[k]=Math.round(inds.reduce((s,a)=>s+a.welfare[k],0)/inds.length)); return d;
}

/* map the 5 welfare domains → the 5 assessment categories (synth Species-Specific) */
function spA2Cats(dom, seed){
  const specific = Math.max(40, Math.min(98, Math.round((dom.mental*0.6 + dom.physical*0.4) + ((seed%11)-5))));
  return [
    { key:'health',     name:'Health',           val:dom.physical,    color:CATS.physical.raw },
    { key:'nutrition',  name:'Nutrition',        val:dom.nutrition,   color:CATS.nutrition.raw },
    { key:'behavior',   name:'Behavior',         val:dom.behaviour,   color:CATS.behaviour.raw },
    { key:'enrichment', name:'Enrichment',       val:dom.environment, color:CATS.environment.raw },
    { key:'specific',   name:'Species-Specific', val:specific,        color:CATS.mental.raw },
  ];
}

SCREENS.aaSpecies = (params={}) => {
  const sp = params.sp;
  const sg = speciesGroups();

  /* ---------------------------- NO PARAMS: species intelligence list ------- */
  if(!sp){
    const rank = Object.entries(sg).map(([k,inds])=>{
      const idx = welfareIndex(spA2Dom(inds));
      return { k, name:SPECIES[k].name, latin:SPECIES[k].latin, n:inds.length, idx };
    }).sort((a,b)=>b.idx-a.idx);

    const rows = rank.map(x=>`
      <div class="k2-rec" onclick="go('aaSpecies',{sp:'${x.k}'})">
        <div style="flex:0 0 auto">${photoBox(x.name,{size:42,radius:12})}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:15px;font-weight:700">${x.name}</div>
          <div style="font-size:12px;color:var(--label-secondary);font-style:italic">${x.latin} · ${x.n} animal${x.n>1?'s':''}</div></div>
        <span class="spA2-pill" style="background:${welfareColor(x.idx)}">${x.idx}</span>
        <span style="color:var(--label-tertiary);flex:0 0 auto">${I.chevron}</span>
      </div>`).join('');

    return `<div class="screen active"><div class="scroll">
      ${aaHeader('aaSpecies', {sub:'Species intelligence'})}
      <div class="k2-sec spA2-list"><div class="k2-h">All Species <span class="more">${rank.length}</span></div>
        ${rows}
      </div>
      <div style="height:24px"></div>
    </div></div>`;
  }

  /* ------------------------------- {sp}: species analytics ----------------- */
  const key = SPECIES[sp] ? sp : Object.keys(SPECIES)[0];
  const s = SPECIES[key];
  const inds = Object.values(ANIMALS).filter(a=>a.sp===key);
  const dom = spA2Dom(inds);
  const idx = welfareIndex(dom);
  const seed = Math.abs(hashStr(key));
  const n = inds.length;
  const months = aaMonths();

  /* summary numbers */
  const assessed   = Math.max(1, n - ((seed%2===0 && n>1)?1:0));
  const coverage   = Math.round(assessed/n*100);
  const compliance = 78 + (seed%19);
  const cats       = spA2Cats(dom, seed);
  const avgScore   = Math.round(cats.reduce((a,c)=>a+c.val,0)/cats.length);

  /* trends: frequency per month (bars) + avg score trend (gradient line) */
  const freq  = months.map((_,i)=> 4 + ((seed + i*17) % 11) + Math.round(i*0.6));
  const scoreTrend = months.map((_,i)=> Math.max(45, Math.min(100,
    avgScore - (months.length-1-i)*1.3 + ((seed + i*9) % 6) - 2)).toFixed(0)).map(Number);

  /* animal rankings — real individuals */
  const scored = inds.map(a=>({ a, v:welfareIndex(a.welfare) })).sort((x,y)=>y.v-x.v);
  const high = scored.slice(0, Math.min(5, scored.length)).map((x,i)=>({
    name:x.a.name, sub:`${x.a.sex} · ${x.a.encl}`, val:x.v, color:welfareColor(x.v),
    go:`go('aaAnimal',{animalId:'${x.a.id}'})` }));
  const low = [...scored].reverse().slice(0, Math.min(5, scored.length)).map(x=>({
    name:x.a.name, sub:`${x.a.sex} · ${x.a.encl}`, val:x.v, color:welfareColor(x.v),
    go:`go('aaAnimal',{animalId:'${x.a.id}'})` }));

  return `<div class="screen active"><div class="scroll">
    ${aaHeader('aaSpecies')}

    <!-- species summary card -->
    <div class="k2" style="margin-top:6px">
      <div class="k2-card spA2-card">
        ${photoBox(s.name,{size:56,radius:16})}
        <div style="flex:1;min-width:0">
          <div class="nm">${s.name}</div>
          <div class="latin">${s.latin}</div>
        </div>
        <span class="spA2-pill" style="background:${welfareColor(idx)}">${idx}</span>
      </div>
    </div>
    <div class="spA2-back" onclick="aaGo('aaSpecies')">‹ All species</div>

    <!-- 1 · SPECIES SUMMARY -->
    <div class="k2-sec"><div class="k2-h">Species Summary</div>
      <div class="k2-snap">
        <div class="cell"><div class="l">Total Animals</div><div class="v">${n}</div></div>
        <div class="cell"><div class="l">Assessment Coverage</div><div class="v">${coverage}<small>%</small></div></div>
        <div class="cell"><div class="l">Assessment Compliance</div><div class="v" style="color:${welfareColor(compliance)}">${compliance}<small>%</small></div></div>
        <div class="cell"><div class="l">Avg Assessment Score</div><div class="v" style="color:${welfareColor(avgScore)}">${avgScore}</div></div>
      </div>
    </div>

    <!-- 2 · ASSESSMENT CATEGORIES (radar + rows) -->
    <div class="k2-sec"><div class="k2-h">Assessment Categories</div>
      <div class="k2-card">
        ${radarChart(cats.map(c=>c.val), cats.map(c=>c.name), {color:welfareColor(avgScore), size:220, max:100})}
        <div class="spA2-radarcap">5-axis assessment profile · avg ${avgScore}</div>
        <div class="spA2-rule"></div>
        ${cats.map(c=>progressRow(c.name, c.val, c.color)).join('')}
      </div>
    </div>

    <!-- 3 · ASSESSMENT TRENDS (frequency bars + avg score line) -->
    <div class="k2-sec"><div class="k2-h">Assessment Trends</div>
      <div class="k2-card">
        <div class="k2-col-val"><span class="k2-col-big">${freq[freq.length-1]} <small style="font-size:13px;color:var(--label-secondary);font-weight:600">this month</small></span>
          <span class="aastatus" style="background:rgba(0,214,201,.14);color:#00D6C9">Frequency</span></div>
        ${colChart(freq, months, {color:'#00D6C9'})}
      </div>
      <div class="k2-card">
        <div class="k2-col-val"><span class="k2-col-big" style="color:${welfareColor(scoreTrend[scoreTrend.length-1])}">${scoreTrend[scoreTrend.length-1]}</span>
          <span class="aastatus" style="background:rgba(55,189,105,.14);color:#37BD69">Avg Score Trend</span></div>
        ${gradLine(scoreTrend, {from:'#00D6C9', to:'#37BD69'})}
      </div>
    </div>

    <!-- 4 · ANIMAL RANKINGS (two leaderboards) -->
    <div class="k2-sec"><div class="k2-h">Highest Assessment Scores</div>
      <div class="k2-card">${leaderboard(high)}</div>
    </div>
    <div class="k2-sec"><div class="k2-h">Lowest Assessment Scores</div>
      <div class="k2-card">${leaderboard(low)}</div>
    </div>

    <div style="height:24px"></div>
  </div></div>`;
};
