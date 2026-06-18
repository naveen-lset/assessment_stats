/* Executive — Phase 3 flagship for senior management.
   Screens: exeOverview (org KPIs · league · risk heatmap · trend · findings · workforce)
   and exeSite (per-site overview). Prefix `exe`.
   Reuses: tabHeader, appHeader, page-hero, tile-grid/stile, sparkline, sparkBars,
   lineChart, feed-row, idx-pill, tchip, acard, photoBox, welfareColor/Index/Label,
   SITES, ASSESSORS, RECORDS, QUEUE, speciesGroups, CATS, DOMAIN_ORDER, monthLabels. */

injectCSS('css-exe', `
  /* ---- site league table ---- */
  .exe-league{margin:0 16px 16px;background:var(--bg-elevated);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
  .exe-site{display:flex;align-items:center;gap:12px;padding:13px 15px;cursor:pointer;position:relative}
  .exe-site + .exe-site::before{content:"";position:absolute;top:0;left:48px;right:0;height:1px;background:var(--separator)}
  .exe-site .s-rank{width:20px;text-align:center;font-size:13px;font-weight:800;color:var(--label-tertiary);flex:0 0 auto}
  .exe-site .s-body{flex:1;min-width:0}
  .exe-site .s-name{font-size:15.5px;font-weight:700;letter-spacing:-.2px}
  .exe-site .s-meta{font-size:12px;color:var(--label-secondary);margin-top:2px;display:flex;gap:10px}
  .exe-site .s-spark{flex:0 0 auto;display:flex;align-items:center;opacity:.9}
  .exe-site .idx-pill{flex:0 0 auto}
  .exe-site .chev{color:var(--label-tertiary);width:8px;flex:0 0 auto}
  .exe-site .chev svg{width:8px;height:13px}

  /* ---- risk heatmap (site x five-domain) ---- */
  .exe-heatcard{margin:0 16px 16px;background:var(--bg-elevated);border-radius:var(--radius);box-shadow:var(--shadow);padding:14px 14px 12px;overflow-x:auto}
  .exe-heat{display:grid;grid-template-columns:78px repeat(5,1fr);gap:6px;min-width:330px}
  .exe-heat .h-corner{font-size:11px;color:var(--label-tertiary);font-weight:700;display:flex;align-items:flex-end;padding-bottom:4px}
  .exe-heat .h-col{font-size:10.5px;font-weight:700;text-align:center;padding-bottom:4px;line-height:1.15}
  .exe-heat .h-site{font-size:12.5px;font-weight:700;color:var(--label-2);display:flex;align-items:center;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .exe-heat .h-cell{border-radius:9px;height:34px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;cursor:pointer}
  .exe-heatlegend{display:flex;align-items:center;gap:14px;margin:12px 16px 16px;padding:0 4px;font-size:11.5px;color:var(--label-secondary);font-weight:600}
  .exe-heatlegend .lg{display:flex;align-items:center;gap:5px}
  .exe-heatlegend .lg i{width:12px;height:12px;border-radius:4px;display:inline-block}

  /* ---- failing-assessments bars ---- */
  .exe-fail{display:flex;align-items:center;gap:11px;padding:10px 0}
  .exe-fail .f-name{width:118px;font-size:13.5px;color:var(--label-2);flex:0 0 auto;font-weight:600}
  .exe-fail .f-track{flex:1;height:9px;border-radius:5px;background:var(--fill-tert);overflow:hidden}
  .exe-fail .f-bar{height:100%;border-radius:5px}
  .exe-fail .f-val{width:42px;text-align:right;font-size:13px;font-weight:800;flex:0 0 auto}

  /* ---- workforce rows ---- */
  .exe-staff{display:flex;align-items:center;gap:12px;padding:12px 0;position:relative}
  .exe-staff + .exe-staff::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;background:var(--separator)}
  .exe-staff .w-av{width:38px;height:38px;border-radius:12px;background:var(--mint-tint);color:var(--antz);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex:0 0 auto}
  .exe-staff .w-body{flex:1;min-width:0}
  .exe-staff .w-name{font-size:15px;font-weight:700}
  .exe-staff .w-role{font-size:12px;color:var(--label-secondary);margin-top:1px}
  .exe-staff .w-stat{text-align:center;flex:0 0 auto;min-width:46px}
  .exe-staff .w-num{font-size:15px;font-weight:800;line-height:1}
  .exe-staff .w-lab{font-size:10px;color:var(--label-tertiary);margin-top:3px;font-weight:600;text-transform:uppercase;letter-spacing:.3px}

  /* ---- compact queue rows ---- */
  .exe-q{display:flex;align-items:center;gap:11px;padding:11px 16px;position:relative;cursor:pointer}
  .exe-q + .exe-q::before{content:"";position:absolute;top:0;left:50px;right:0;height:1px;background:var(--separator)}
  .exe-q .q-ico{width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;flex:0 0 auto}
  .exe-q .q-ico svg{width:14px;height:14px}
  .exe-q .q-body{flex:1;min-width:0}
  .exe-q .q-sub{font-size:14px;font-weight:600}
  .exe-q .q-animal{font-size:12px;color:var(--label-secondary);margin-top:1px}
  .exe-q .q-due{font-size:12px;font-weight:700;flex:0 0 auto}
`);

/* per-site, per-domain synthetic-but-stable score derived from site welfare + domain seed */
function exeCellScore(site, domain){
  const seed = Math.abs(hashStr(site.id + domain));
  const off = (seed % 17) - 8;            // -8..+8 spread around site baseline
  return Math.max(38, Math.min(98, site.welfare + off));
}

/* org population-weighted welfare index */
function exeOrgWelfare(){
  const tot = SITES.reduce((s,x)=>s+x.animals,0);
  return Math.round(SITES.reduce((s,x)=>s+x.welfare*x.animals,0)/tot);
}

/* species avg welfare index across its individuals */
function exeSpeciesIdx(inds){
  const d={}; DOMAIN_ORDER.forEach(k=>d[k]=inds.reduce((s,a)=>s+a.welfare[k],0)/inds.length);
  return welfareIndex(d);
}

SCREENS.exeOverview = (params={}) => {
  const months = monthLabels(8);
  const totalAnimals = SITES.reduce((s,x)=>s+x.animals,0);
  const orgIdx = exeOrgWelfare();
  const avgCompletion = Math.round(SITES.reduce((s,x)=>s+x.completion,0)/SITES.length);
  const atRisk = SITES.filter(s=>s.welfare<78).length;
  const assessTotal = 4820;
  const assessSpark = [612,648,590,701,684,732,710,758];           // assessments / period
  const orgTrend = months.map((_,i)=> Math.round(orgIdx-7 + i + ((i*5)%3)));

  // sites ranked by welfare (desc)
  const ranked = [...SITES].sort((a,b)=>b.welfare-a.welfare);

  // critical findings feed
  const findings = RECORDS.filter(r=>r.finding);

  // most-failing assessment sub-types
  const failing = [
    { name:'Body Condition', cat:'physical',  rate:22 },
    { name:'Activity Level', cat:'behaviour',  rate:18 },
    { name:'Dental Check',   cat:'physical',   rate:14 },
    { name:'Enrichment',     cat:'behaviour',  rate:11 },
    { name:'Diet Adherence', cat:'nutrition',  rate:9  },
  ];
  const failMax = Math.max(...failing.map(f=>f.rate));

  // highest-risk species (lowest welfare index), top 3
  const groups = speciesGroups();
  const riskSpecies = Object.entries(groups)
    .map(([sp,inds])=>({sp, idx:exeSpeciesIdx(inds), n:inds.length}))
    .sort((a,b)=>a.idx-b.idx).slice(0,3);

  const initials = n => n.replace(/Dr\.\s*/,'').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();

  return `<div class="screen active"><div class="scroll">
    ${tabHeader('Executive', 'Organization · all sites', {insights:true})}

    <!-- KPI strip -->
    <div class="tile-grid">
      <div class="stile">
        <div class="st-spark">${sparkBars(assessSpark,'var(--antz)')}</div>
        <div class="st-num">${assessTotal.toLocaleString()}</div>
        <div class="st-lab">${I.doc} assessments</div></div>
      <div class="stile">
        <div class="st-ico" style="background:rgba(47,174,115,.14);color:var(--environment)">${I.check}</div>
        <div class="st-num">${avgCompletion}<small>%</small></div>
        <div class="st-lab"><span class="tchip trend-up">${I.arrowUp}3</span> completion</div></div>
    </div>
    <div class="tile-grid">
      <div class="stile">
        <div class="st-ico" style="background:${welfareColor(orgIdx)}22;color:${welfareColor(orgIdx)}">${I.heart}</div>
        <div class="st-num" style="color:${welfareColor(orgIdx)}">${orgIdx}</div>
        <div class="st-lab">welfare · ${welfareLabel(orgIdx)}</div></div>
      <div class="stile">
        <div class="st-ico" style="background:rgba(199,107,74,.14);color:#C76B4A">${I.alert}</div>
        <div class="st-num" style="color:#C76B4A">${atRisk}</div>
        <div class="st-lab">sites need attention</div></div>
      <div class="stile">
        <div class="st-ico" style="background:rgba(23,161,134,.12);color:var(--antz)">${I.paw}</div>
        <div class="st-num">${totalAnimals.toLocaleString()}</div>
        <div class="st-lab">animals in scope</div></div>
    </div>

    <!-- Sites league table -->
    <div class="section-head"><h2>Sites</h2><span class="muted" style="font-size:14px">ranked by welfare</span></div>
    <div class="exe-league">
      ${ranked.map((s,i)=>`
        <div class="exe-site" onclick="go('exeSite',{siteId:'${s.id}'})">
          <span class="s-rank">${i+1}</span>
          <div class="s-body">
            <div class="s-name">${s.name}</div>
            <div class="s-meta"><span>${s.animals} animals</span><span>${s.completion}% complete</span><span>${s.compliance}% compliant</span></div>
          </div>
          <span class="s-spark">${sparkline(s.trend, welfareColor(s.welfare), {w:62,h:26})}</span>
          <span class="idx-pill" style="background:${welfareColor(s.welfare)}">${s.welfare}</span>
          <span class="chev">${I.chevron}</span>
        </div>`).join('')}
    </div>

    <!-- Risk heatmap -->
    <div class="section-head"><h2>Risk Heatmap</h2><span class="muted" style="font-size:14px">site × domain</span></div>
    <div class="exe-heatcard">
      <div class="exe-heat">
        <div class="h-corner">SITE</div>
        ${DOMAIN_ORDER.map(d=>`<div class="h-col" style="color:${CATS[d].raw}">${CATS[d].name.slice(0,3).toUpperCase()}</div>`).join('')}
        ${ranked.map(s=>`
          <div class="h-site" onclick="go('exeSite',{siteId:'${s.id}'})">${s.name.split(' ')[0]}</div>
          ${DOMAIN_ORDER.map(d=>{const v=exeCellScore(s,d);return `<div class="h-cell" onclick="go('exeSite',{siteId:'${s.id}'})" style="background:${welfareColor(v)};opacity:.92">${v}</div>`;}).join('')}
        `).join('')}
      </div>
    </div>
    <div class="exe-heatlegend">
      <div class="lg"><i style="background:#C76B4A"></i>At-risk</div>
      <div class="lg"><i style="background:#C9A227"></i>Watch</div>
      <div class="lg"><i style="background:#17A186"></i>Good</div>
      <div class="lg"><i style="background:#2FAE73"></i>Excellent</div>
    </div>

    <!-- Org welfare trend -->
    <div class="section-head"><h2>Org Welfare Trend</h2><span class="muted" style="font-size:14px">8 months</span></div>
    <div class="chart-wrap">${lineChart(orgTrend, 'var(--antz)', {unit:'', labels:months})}</div>

    <!-- Critical findings -->
    <div class="section-head"><h2>Critical Findings</h2><span class="muted" style="font-size:14px">${findings.length} open</span></div>
    <div class="card">
      ${findings.map(r=>{const c=CATS[r.type];const a=getAnimal(r.animalId);return `
        <div class="feed-row" onclick="go('recDetail',{id:'${r.id}'})">
          <span class="f-ico" style="background:${c.raw}">${c.icon}</span>
          <div class="f-main"><b>${r.finding}</b> · ${a.name} <span style="color:var(--label-secondary)">(${r.sub})</span></div>
          <span class="f-time">${r.id}</span>
        </div>`;}).join('')}
    </div>

    <!-- Most failing assessments -->
    <div class="section-head"><h2>Most Failing Assessments</h2><span class="muted" style="font-size:14px">fail rate</span></div>
    <div class="card card-pad">
      ${failing.map(f=>{const c=CATS[f.cat];return `
        <div class="exe-fail">
          <span class="f-name">${f.name}</span>
          <span class="f-track"><span class="f-bar" style="width:${Math.round(f.rate/failMax*100)}%;background:${c.raw}"></span></span>
          <span class="f-val" style="color:${c.raw}">${f.rate}%</span></div>`;}).join('')}
    </div>

    <!-- Highest-risk species -->
    <div class="section-head"><h2>Highest-Risk Species</h2><span class="muted" style="font-size:14px">lowest welfare</span></div>
    ${riskSpecies.map(o=>{const v=SPECIES[o.sp];return `
      <div class="acard" onclick="go('speciesAnalytics',{sp:'${o.sp}'})">
        ${photoBox(v.name,{size:44,radius:12})}
        <div class="ac-body"><div class="ac-name">${v.name}</div>
          <div class="ac-sub">${o.n} animal${o.n>1?'s':''} · ${welfareLabel(o.idx)}</div></div>
        <span class="idx-pill" style="background:${welfareColor(o.idx)}">${o.idx}</span>
        <span class="chev" style="color:var(--label-tertiary);margin-left:8px">${I.chevron}</span>
      </div>`;}).join('')}

    <!-- Workforce -->
    <div class="section-head"><h2>Workforce</h2><span class="muted" style="font-size:14px">${ASSESSORS.length} assessors</span></div>
    <div class="card card-pad">
      ${ASSESSORS.map(a=>`
        <div class="exe-staff">
          <span class="w-av">${initials(a.name)}</span>
          <div class="w-body"><div class="w-name">${a.name}</div><div class="w-role">${a.role}</div></div>
          <div class="w-stat"><div class="w-num">${a.throughput}</div><div class="w-lab">done</div></div>
          <div class="w-stat"><div class="w-num"><span class="tchip ${a.onTime>=90?'trend-up':'trend-down'}">${a.onTime>=90?I.arrowUp:I.arrowDn}</span>${a.onTime}%</div><div class="w-lab">on-time</div></div>
          <div class="w-stat"><div class="w-num" style="color:${a.rework>=10?'#C76B4A':'var(--label)'}">${a.rework}%</div><div class="w-lab">rework</div></div>
        </div>`).join('')}
    </div>

    <div style="height:8px"></div>
  </div></div>`;
};

SCREENS.exeSite = ({siteId}={}) => {
  const s = SITES.find(x=>x.id===siteId) || SITES[0];
  const months = monthLabels(8);

  // synthesized sections for this site
  const sections = [
    { name:'Physical Health', cat:'physical',  score: exeCellScore(s,'physical') },
    { name:'Behaviour',       cat:'behaviour',  score: exeCellScore(s,'behaviour') },
    { name:'Environment',     cat:'environment',score: exeCellScore(s,'environment') },
  ];

  // a couple of assessors notionally assigned to this site
  const seed = Math.abs(hashStr(s.id));
  const roster = ASSESSORS.slice(seed%2, (seed%2)+3);
  const initials = n => n.replace(/Dr\.\s*/,'').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();

  // overdue / due queue (short)
  const overdue = QUEUE.filter(q=>q.state!=='pending').slice(0,4);

  return `<div class="screen active"><div class="scroll">
    ${appHeader('', {back:true})}
    <div class="page-hero">
      <div class="ph-title" style="font-size:26px">${s.name}</div>
      <div class="ph-sub">Site Overview · ${s.animals} animals</div>
    </div>

    <div class="tile-grid">
      <div class="stile">
        <div class="st-ico" style="background:${welfareColor(s.welfare)}22;color:${welfareColor(s.welfare)}">${I.heart}</div>
        <div class="st-num" style="color:${welfareColor(s.welfare)}">${s.welfare}</div>
        <div class="st-lab">welfare · ${welfareLabel(s.welfare)}</div></div>
      <div class="stile">
        <div class="st-ico" style="background:rgba(47,174,115,.14);color:var(--environment)">${I.check}</div>
        <div class="st-num">${s.completion}<small>%</small></div>
        <div class="st-lab">completion</div></div>
      <div class="stile">
        <div class="st-ico" style="background:rgba(23,161,134,.12);color:var(--antz)">${I.doc}</div>
        <div class="st-num">${s.compliance}<small>%</small></div>
        <div class="st-lab">compliance</div></div>
    </div>
    <div class="tile-grid">
      <div class="stile">
        <div class="st-ico" style="background:rgba(90,98,201,.14);color:var(--behaviour)">${I.clock}</div>
        <div class="st-num">${s.onTime}<small>%</small></div>
        <div class="st-lab">on-time</div></div>
      <div class="stile">
        <div class="st-ico" style="background:rgba(199,107,74,.14);color:#C76B4A">${I.alert}</div>
        <div class="st-num" style="color:#C76B4A">${s.risk}<small>%</small></div>
        <div class="st-lab">at-risk</div></div>
      <div class="stile">
        <div class="st-spark">${sparkline(s.trend, welfareColor(s.welfare), {w:84,h:30})}</div>
        <div class="st-num">${s.trend[s.trend.length-1]-s.trend[0]>=0?'+':''}${s.trend[s.trend.length-1]-s.trend[0]}</div>
        <div class="st-lab">welfare trend</div></div>
    </div>

    <div class="section-head"><h2>Welfare Trend</h2><span class="muted" style="font-size:14px">8 months</span></div>
    <div class="chart-wrap">${lineChart(s.trend.concat(months.slice(s.trend.length).map(()=>s.welfare)).slice(0,8), welfareColor(s.welfare), {unit:'', labels:months})}</div>

    <div class="section-head"><h2>Sections</h2></div>
    <div class="card card-pad">
      ${sections.map(sec=>{const c=CATS[sec.cat];return `
        <div class="exe-fail">
          <span class="f-name" style="display:flex;align-items:center;gap:7px"><span style="width:9px;height:9px;border-radius:3px;background:${c.raw};flex:0 0 auto"></span>${sec.name}</span>
          <span class="f-track"><span class="f-bar" style="width:${sec.score}%;background:${welfareColor(sec.score)}"></span></span>
          <span class="f-val" style="color:${welfareColor(sec.score)}">${sec.score}</span></div>`;}).join('')}
    </div>

    <div class="section-head"><h2>Assessor Workload</h2><span class="muted" style="font-size:14px">${roster.length} assigned</span></div>
    <div class="card card-pad">
      ${roster.map(a=>`
        <div class="exe-staff">
          <span class="w-av">${initials(a.name)}</span>
          <div class="w-body"><div class="w-name">${a.name}</div><div class="w-role">${a.role}</div></div>
          <div class="w-stat"><div class="w-num">${a.throughput}</div><div class="w-lab">done</div></div>
          <div class="w-stat"><div class="w-num"><span class="tchip ${a.onTime>=90?'trend-up':'trend-down'}">${a.onTime>=90?I.arrowUp:I.arrowDn}</span>${a.onTime}%</div><div class="w-lab">on-time</div></div>
        </div>`).join('')}
    </div>

    <div class="section-head"><h2>Overdue Queue</h2><span class="muted" style="font-size:14px">${overdue.length} items</span></div>
    <div class="card">
      ${overdue.map(q=>{const c=CATS[q.type];const a=getAnimal(q.animalId);const od=q.state==='overdue';return `
        <div class="exe-q" onclick="go('speciesAnalytics',{sp:'${a.sp}'})">
          <span class="q-ico" style="background:${c.raw}">${c.icon}</span>
          <div class="q-body"><div class="q-sub">${q.sub}</div><div class="q-animal">${a.name} · ${a.species}</div></div>
          <span class="q-due" style="color:${od?'#C76B4A':'var(--label-secondary)'}">${q.due}</span>
        </div>`;}).join('')}
    </div>

    <div style="height:8px"></div>
  </div></div>`;
};

registerModule({key:'exeOverview', label:'Executive Overview', sub:'Org KPIs · sites · risk · workforce', group:'Executive', color:'var(--antz)', icon:I.grid});
registerModule({key:'exeSite', label:'Site Overview', sub:'Per-site KPIs & workload', group:'Executive', color:'var(--environment)', icon:I.leaf, param:{siteId:'s-riverside'}});
