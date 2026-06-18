/* ===========================================================================
   ANIMAL ASSESSMENT FLOW (screenshot-matched) — loads LAST.
   Recreates the 4-screen flow the user provided:
     amDetail  → Animal Detail (Overview)
     amAnimal  → Assessment Analytics: Overview · Comparison · History
   Hardcoded to the supplied design (Assam Macaque). Reuses dashboard kit tokens.
   =========================================================================== */
injectCSS('css-am-flow', `
  /* ---- animal detail hero ---- */
  .fl-hero{position:relative;height:600px;background:#2b3a36;overflow:hidden;}
  .fl-hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
  .fl-hero .fl-fb{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:120px;}
  .fl-htop{position:absolute;top:46px;left:0;right:0;display:flex;align-items:center;gap:12px;padding:0 18px;z-index:3;}
  .fl-hicon{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.16);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;color:#fff;cursor:pointer;}
  .fl-hicon svg{width:18px;height:18px;}
  .fl-hcard{position:absolute;left:14px;right:14px;top:150px;background:rgba(15,28,26,.42);backdrop-filter:blur(10px);border-radius:20px;padding:20px 22px;color:#fff;z-index:2;}
  .fl-hcard .fh-n{font-size:30px;font-weight:800;letter-spacing:-.6px;line-height:1.05;}
  .fl-hcard .fh-sci{font-size:15px;font-style:italic;opacity:.92;margin-top:5px;}
  .fl-hcard .fh-l{font-size:15px;opacity:.92;margin-top:7px;}
  /* detail tabs */
  .fl-dtabs{display:flex;gap:0;border-bottom:1px solid var(--separator);overflow-x:auto;scrollbar-width:none;background:#fff;padding:0 6px;}
  .fl-dtabs::-webkit-scrollbar{display:none;}
  .fl-dtab{flex:0 0 auto;padding:16px 18px;font-size:16px;font-weight:700;color:var(--label-tertiary);cursor:pointer;position:relative;white-space:nowrap;}
  .fl-dtab.on{color:#1f8f4e;}
  .fl-dtab.on::after{content:"";position:absolute;left:18px;right:18px;bottom:-1px;height:3px;background:#2E9E5B;border-radius:3px;}
  /* detail overview card */
  .fl-card{background:#E9F2EE;border-radius:18px;margin:16px;padding:22px 22px 8px;position:relative;}
  .fl-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px 16px;}
  .fl-k{font-size:16px;color:var(--label-tertiary);font-weight:500;}
  .fl-v{font-size:19px;color:#16323a;font-weight:700;margin-top:3px;letter-spacing:-.2px;}
  .fl-edit{position:absolute;right:22px;color:#16323a;cursor:pointer;}.fl-edit svg{width:20px;height:20px;}
  .fl-expand{display:flex;align-items:center;justify-content:center;background:#dce8e2;border-radius:12px;height:34px;margin:18px 0 0;color:#16323a;cursor:pointer;}
  .fl-expand svg{width:18px;height:18px;}
  .fl-id-h{display:flex;align-items:center;gap:10px;font-size:21px;font-weight:800;color:#16323a;margin:6px 0 16px;}
  .fl-id-h svg{width:22px;height:22px;color:#16323a;}
  .fl-assess{display:flex;align-items:center;background:#fff;border-radius:16px;box-shadow:var(--shadow);margin:14px 16px;padding:20px 18px;cursor:pointer;}
  .fl-assess .fa-t{flex:1;font-size:21px;font-weight:800;color:#16323a;}
  .fl-assess svg{width:14px;height:18px;color:var(--label-tertiary);}
  /* ---- analytics compact hero ---- */
  .fl-chero{display:flex;align-items:center;gap:12px;padding:50px 16px 12px;}
  .fl-chero .fc-av{width:48px;height:48px;border-radius:14px;overflow:hidden;position:relative;background:linear-gradient(135deg,#dfeee8,#cfe6dd);flex:0 0 auto;display:flex;align-items:center;justify-content:center;font-size:24px;}
  .fl-chero .fc-av img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
  .fl-chero .fc-n{font-size:21px;font-weight:800;letter-spacing:-.4px;}
  .fl-chero .fc-s{font-size:12.5px;color:var(--label-secondary);font-weight:600;margin-top:2px;display:flex;align-items:center;gap:6px;}
  .fl-chero .fc-spi{width:18px;height:18px;border-radius:5px;background:#dfeee8;display:inline-flex;align-items:center;justify-content:center;font-size:11px;}
  .fl-back{width:36px;height:36px;border-radius:11px;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow);flex:0 0 auto;}
  .fl-back svg{width:11px;height:18px;color:var(--label);}
  /* snapshot */
  .fl-snap{display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:10px;margin:0 16px 14px;}
  .fl-sc{background:#fff;border-radius:15px;box-shadow:var(--shadow);padding:14px 13px;}
  .fl-sc-v{font-size:22px;font-weight:800;letter-spacing:-.5px;line-height:1.05;}
  .fl-sc-v.sm{font-size:16px;}
  .fl-sc-l{font-size:12px;color:var(--label-secondary);font-weight:600;margin-top:5px;line-height:1.25;}
  /* chips */
  .fl-chips{display:flex;flex-wrap:wrap;gap:9px;margin:0 16px 14px;}
  .fl-chip{font-size:14px;font-weight:600;color:#16323a;background:#E4EFEA;padding:9px 16px;border-radius:20px;}
  /* tabs (Overview/Comparison/History) */
  .fl-atabs{display:flex;gap:0;margin:0 0 0;border-bottom:1px solid var(--separator);background:#fff;}
  .fl-atab{flex:1;text-align:center;padding:14px 8px;font-size:16px;font-weight:700;color:var(--label-tertiary);cursor:pointer;position:relative;}
  .fl-atab.on{color:#1f8f4e;}
  .fl-atab.on::after{content:"";position:absolute;left:24%;right:24%;bottom:-1px;height:3px;background:#2E9E5B;border-radius:3px;}
  /* period filter */
  .fl-per{display:flex;gap:4px;background:#EFF3F1;border-radius:14px;padding:5px;margin:14px 16px;}
  .fl-per button{flex:1;border:0;background:transparent;font-family:var(--font);font-size:15px;font-weight:700;color:var(--label-secondary);padding:11px 6px;border-radius:11px;cursor:pointer;}
  .fl-per button.on{background:#fff;color:#16323a;box-shadow:0 1px 6px rgba(20,60,45,.12);}
  /* activity */
  .fl-leg{display:flex;gap:18px;margin-top:14px;}
  .fl-leg .lg{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--label-secondary);font-weight:600;}
  .fl-leg .lg i{width:13px;height:13px;border-radius:4px;}
  .fl-leg .lg.dash i{width:18px;height:0;border-top:2.5px dashed #8479F9;border-radius:0;}
  .fl-wpill{font-size:13px;font-weight:700;color:#1f8f4e;background:#E4EFEA;padding:6px 14px;border-radius:11px;}
  .fl-mini{display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:10px;margin-top:14px;}
  .fl-mini .m{background:var(--fill-tert);border-radius:13px;padding:13px 12px;}
  .fl-mini .mv{font-size:18px;font-weight:800;letter-spacing:-.4px;line-height:1.1;}
  .fl-mini .mv.sm{font-size:14px;}
  .fl-mini .ml{font-size:11.5px;color:var(--label-secondary);font-weight:600;margin-top:4px;}
  /* response analytics */
  .fl-badge{font-size:12px;font-weight:700;color:var(--label-secondary);background:var(--fill-tert);padding:5px 11px;border-radius:9px;}
  .fl-sec{font-size:19px;font-weight:800;color:#16323a;margin:20px 16px 12px;letter-spacing:-.3px;}
  /* comparison */
  .fl-cseg{display:flex;gap:4px;background:#EFF3F1;border-radius:14px;padding:5px;margin:0 16px 12px;}
  .fl-cseg button{flex:1;border:0;background:transparent;font-family:var(--font);font-size:15px;font-weight:700;color:var(--label-secondary);padding:12px 6px;border-radius:11px;cursor:pointer;}
  .fl-cseg button.on{background:#fff;color:#16323a;box-shadow:0 1px 6px rgba(20,60,45,.12);}
  .fl-cwhen{font-size:14.5px;font-weight:700;color:#16323a;margin:0 16px 14px;}
  .fl-cwhen .mut{color:var(--label-tertiary);font-weight:600;}
  .fl-ai{background:#E9F2EE;border-radius:18px;margin:0 16px 16px;padding:18px 20px;}
  .fl-ai-h{display:flex;align-items:center;gap:8px;font-size:18px;font-weight:800;color:#1f8f4e;}
  .fl-ai-b{font-size:15px;color:#274038;font-weight:500;margin-top:10px;line-height:1.5;}
  .fl-ai-b ul{margin:8px 0 0;padding-left:20px;}
  .fl-ai-b li{margin-bottom:11px;}
  .fl-crow{margin:0 16px 16px;}
  .fl-crow .cr-h{display:flex;align-items:center;gap:10px;}
  .fl-crow .cr-n{font-size:17px;font-weight:800;color:#16323a;}
  .fl-crow .cr-vals{display:flex;align-items:center;gap:12px;margin-top:12px;}
  .fl-crow .cr-a{font-size:22px;color:var(--label-tertiary);font-weight:700;}
  .fl-crow .cr-arr{color:var(--label-tertiary);}
  .fl-crow .cr-b{font-size:24px;font-weight:800;color:#16323a;letter-spacing:-.4px;}
  .fl-crow .cr-d{margin-left:auto;font-size:14px;font-weight:800;padding:7px 13px;border-radius:11px;}
  /* history */
  .fl-catchips{display:flex;gap:9px;margin:0 16px 14px;overflow-x:auto;scrollbar-width:none;}
  .fl-catchips::-webkit-scrollbar{display:none;}
  .fl-catchip{flex:0 0 auto;font-size:14px;font-weight:700;padding:10px 18px;border-radius:20px;background:#fff;color:var(--label-secondary);box-shadow:var(--shadow);cursor:pointer;}
  .fl-catchip.on{background:#2E9E5B;color:#fff;}
  .fl-hrec{display:flex;align-items:center;background:#E9F2EE;border-radius:16px;margin:0 16px 12px;padding:18px;cursor:pointer;}
  .fl-hrec .hr-b{flex:1;min-width:0;}
  .fl-hrec .hr-top{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
  .fl-hrec .hr-t{font-size:18px;font-weight:800;color:#16323a;}
  .fl-hrec .hr-m{font-size:14px;color:var(--label-secondary);font-weight:500;margin-top:7px;line-height:1.5;}
  .fl-hrec svg{width:13px;height:18px;color:var(--label-tertiary);flex:0 0 auto;}
  .fl-status{font-size:13px;font-weight:700;padding:4px 12px;border-radius:9px;}
`);

/* ------------------------------- flow data -------------------------------- */
const FLOW = {
  photo:'https://loremflickr.com/720/760/macaque,monkey/all?lock=7',
  name:'Assam Macaque', sci:'(Anodorhynchus Hyacinthinus)', enc:'C1 enclosure',
  line2:'Female • 19y 2m old • 24 Animals', aid:'AID: 123451234567890',
  lifeStage:'Juvenile', accession:'24 Jul 2024', org:'Exhibit', fromInst:'Mahima',
  collType:'Rehab', locality:'India', animalName:'Exhibit', dna:'12345565',
  total:34, last:'Today, 10:45 AM', types:6,
  chips:['Nutrition','Behaviour','Medical','Body Condition','Weight','Enrichment'],
  act:{ days:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], cur:[3.2,4.7,2.6,6.5,4.3,7,4.8], prev:[2.6,4.2,3.4,4.5,3.5,5.1,4.3] },
  weight8:[21.4,21.6,22.2,22,23,23.4,23,24],
  cmpCurrent:'19 Jun 2025', cmpPrev:'5 Jun 2025',
  cmpSummary:[
    'Weight increased from <b>22kg to 24kg</b>.',
    'Temperature decreased from <b>38.6°C to 38.5°C</b>.',
    'Body condition increased from <b>3 to 4</b>.',
    'Activity Level increased from <b>6 to 8</b>.',
    'Appetite improved from <b>Good to Excellent</b>.',
    'Observation notes were updated — latest entry notes <b>bright and active this morning</b>.',
  ],
  cmpRows:[
    {n:'Weight', badge:'Numeric Value', a:'22kg', b:'24kg', d:'+2kg', dir:'up'},
    {n:'Temperature', badge:'Numeric Value', a:'38.6°C', b:'38.5°C', d:'-0.1°C', dir:'dn'},
    {n:'Body Condition', badge:'Numeric Scale', a:'3', b:'4', d:'+1', dir:'up'},
    {n:'Activity Level', badge:'Numeric Scale', a:'6', b:'8', d:'+2', dir:'up'},
    {n:'Appetite', badge:'List', a:'Good', b:'Excellent', d:'Improved', dir:'up'},
  ],
  history:[
    {t:'Medical Observation', s:'Completed', d:'19 Jun 2025', tm:'10:45 AM', by:'Dr. R. Mehta', cat:'Medical'},
    {t:'Nutrition Assessment', s:'Completed', d:'5 Jun 2025', tm:'3:20 PM', by:'Dr. L. Owens', cat:'Nutrition'},
    {t:'Behaviour Assessment', s:'Completed', d:'22 May 2025', tm:'9:15 AM', by:'S. Park', cat:'Behaviour'},
    {t:'Weight Check', s:'Completed', d:'8 May 2025', tm:'11:30 AM', by:'J. Alvarez', cat:'Weight'},
    {t:'Body Condition Score', s:'Approved', d:'24 Apr 2025', tm:'2:40 PM', by:'Dr. R. Mehta', cat:'Body Condition'},
  ],
  histCats:['All','Nutrition','Behaviour','Medical','Weight'],
};
const FL_STATUS={Completed:{bg:'#37BD691f',c:'#2E9E5B'},Approved:{bg:'#00C2B31f',c:'#0A9E92'}};

/* ============================ SCREEN 1: DETAIL ============================ */
SCREENS.amDetail = (params={}) => {
  const f=FLOW;
  const dtabs=['Overview','Medical','Enclosures','Records','Diet'];
  return `<div class="screen active"><div class="scroll dash2" style="padding-bottom:26px">
    <div class="fl-hero">
      <span class="fl-fb">🐒</span><img src="${f.photo}" loading="lazy" onerror="this.remove()"/>
      <div class="fl-htop"><span class="fl-hicon" onclick="back()">${I.back}</span>
        <span style="margin-left:auto;display:flex;gap:12px">
          <span class="fl-hicon">${I.star||'☆'}</span>
          <span class="fl-hicon">▦</span>
          <span class="fl-hicon">⋮</span></span></div>
      <div class="fl-hcard"><div class="fh-n">${f.name}</div>
        <div class="fh-sci">${f.sci}</div>
        <div class="fh-l">Enc: ${f.enc}</div>
        <div class="fh-l">${f.line2}</div>
        <div class="fh-l">${f.aid}</div></div>
    </div>
    <div class="fl-dtabs">${dtabs.map((t,i)=>`<div class="fl-dtab ${i===0?'on':''}">${t}</div>`).join('')}</div>
    <div class="fl-card">
      <div class="fl-edit">${I.edit||'✎'}</div>
      <div class="fl-grid">
        <div><div class="fl-k">Life Stage</div><div class="fl-v">${f.lifeStage}</div></div>
        <div><div class="fl-k">Accession Date</div><div class="fl-v">${f.accession}</div></div>
        <div><div class="fl-k">Organization</div><div class="fl-v">${f.org}</div></div>
        <div><div class="fl-k">From Institution</div><div class="fl-v">${f.fromInst}</div></div>
        <div><div class="fl-k">Collection Type</div><div class="fl-v">${f.collType}</div></div>
        <div><div class="fl-k">Locality</div><div class="fl-v">${f.locality}</div></div>
      </div>
      <div class="fl-expand">${I.chevronDown||'⌄'}</div>
    </div>
    <div class="fl-card" style="padding-top:20px">
      <div class="fl-id-h">${I.home||'⌂'} Identifiers</div>
      <div class="fl-grid" style="grid-template-columns:1fr">
        <div><div class="fl-k">Animal Name</div><div class="fl-v">${f.animalName}</div></div>
        <div style="margin-top:6px"><div class="fl-k">DNA</div><div class="fl-v">${f.dna}</div></div>
      </div><div style="height:8px"></div>
    </div>
    <div class="adx">
      <div class="adx-h"><span class="adx-t">Assessments</span>
        <span class="adx-arrow" onclick="STATE.flPeriod=(STATE.flDetPeriod||'Week');go('amAnimal',{animalId:'macaque-1',from:'detail'})">${I.chevron}</span></div>
      <div class="adx-stats">
        <div><div class="adx-v">34</div><div class="adx-l">Total Records</div></div>
        <div><div class="adx-v sm">Today, 10:45 AM</div><div class="adx-l">Last Recorded On</div></div></div>
      <div class="adx-per">${['Week','Month','Year'].map(p=>`<button class="${(STATE.flDetPeriod||'Week')===p?'on':''}" onclick="setFilter('flDetPeriod','${p}')">${p}</button>`).join('')}</div>
      ${(typeof am2DetailTrend==='function')?am2DetailTrend(STATE.flDetPeriod||'Week'):''}
    </div>
    <div style="height:14px"></div>
  </div></div>`;
};

/* ===================== ANALYTICS: shared header ========================== */
function flHeader(tab){
  const tabs=['Overview','Comparison','History'];
  const per=['Week','Month','Year','Custom']; const pf=STATE.flPeriod||'Week';
  return `<div class="fl-chero"><span class="fl-back" onclick="back()">${I.back}</span>
      <span class="fc-av">🐒<img src="${FLOW.photo}" loading="lazy" onerror="this.remove()"/></span>
      <div><div class="fc-n">${FLOW.name}</div><div class="fc-s"><span class="fc-spi">🐵</span> Macaque · Primates</div></div></div>
    <div class="fl-snap">
      <div class="fl-sc"><div class="fl-sc-v">${FLOW.total}</div><div class="fl-sc-l">Total Records</div></div>
      <div class="fl-sc"><div class="fl-sc-v sm">${FLOW.last}</div><div class="fl-sc-l">Last Recorded On</div></div>
      <div class="fl-sc"><div class="fl-sc-v">${FLOW.types}</div><div class="fl-sc-l">Assessment Types</div></div>
    </div>
    <div class="fl-chips">${FLOW.chips.map(c=>`<span class="fl-chip">${c}</span>`).join('')}</div>
    <div class="fl-atabs">${tabs.map(t=>`<div class="fl-atab ${t.toLowerCase()===tab?'on':''}" onclick="setFilter('amTab','${t.toLowerCase()}')">${t}</div>`).join('')}</div>
    <div class="fl-per">${per.map(p=>`<button class="${p===pf?'on':''}" onclick="setFilter('flPeriod','${p}')">${p}</button>`).join('')}</div>`;
}

/* activity chart: bars (this period) + dashed prev line + axis */
function flActivityChart(){
  const a=FLOW.act, W=342,H=210,pl=26,pr=10,pt=14,pb=28, iw=W-pl-pr, ih=H-pt-pb, max=10;
  const X=i=>pl+(i+0.5)*(iw/a.days.length), Y=v=>pt+(1-v/max)*ih, bw=iw/a.days.length*0.5;
  let grid=''; [0,3,5,8,10].forEach(g=>{const y=Y(g); grid+=`<line x1="${pl}" y1="${y.toFixed(1)}" x2="${W-pr}" y2="${y.toFixed(1)}" stroke="var(--separator)" stroke-width="1"/><text x="${pl-7}" y="${(y+3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--label-tertiary)">${g}</text>`;});
  let bars=''; a.cur.forEach((v,i)=>{const x=X(i),y=Y(v),h=pt+ih-y; bars+=`<rect x="${(x-bw/2).toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="6" fill="#5BC47E" style="cursor:pointer" onmousemove="dashTip(event,'${a.days[i]}','${v} recs','')" onmouseleave="dashTipHide()"/>`;});
  let xl=''; a.days.forEach((d,i)=>{xl+=`<text x="${X(i).toFixed(1)}" y="${H-9}" text-anchor="middle" font-size="11" fill="var(--label-secondary)" font-weight="600">${d}</text>`;});
  const pts=a.prev.map((v,i)=>[X(i),Y(v)]);
  const line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  let dots=pts.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5" fill="#8479F9"/>`).join('');
  return `<div class="d2card"><div class="d2card-h"><div><div class="ttl" style="font-size:19px">Assessment Activity</div><div class="sub" style="font-size:13px">Assessment counts · records per day</div></div><span class="fl-wpill">Week</span></div>
    <svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;margin-top:6px">${grid}${bars}
      <path d="${line}" fill="none" stroke="#8479F9" stroke-width="2.4" stroke-dasharray="6 5" stroke-linecap="round"/>${dots}${xl}</svg>
    <div class="fl-leg"><span class="lg"><i style="background:#5BC47E"></i>This period</span><span class="lg dash"><i></i>Previous</span></div>
    <div class="fl-mini">
      <div class="m"><div class="mv">${FLOW.total}</div><div class="ml">Total Records</div></div>
      <div class="m"><div class="mv sm">${FLOW.last}</div><div class="ml">Last Recorded On</div></div>
      <div class="m"><div class="mv">${FLOW.types}</div><div class="ml">Assessment Types</div></div></div>
  </div>`;
}
/* simple line chart for a numeric trend */
function flLine(data,color){
  const W=342,H=150,pl=10,pr=10,pt=12,pb=14, iw=W-pl-pr, ih=H-pt-pb;
  const lo=Math.min(...data)-1, hi=Math.max(...data)+1, rng=(hi-lo)||1;
  const X=i=>pl+(i/(data.length-1))*iw, Y=v=>pt+(1-(v-lo)/rng)*ih;
  const pts=data.map((v,i)=>[X(i),Y(v)]);
  const line=(typeof smoothPath==='function')?smoothPath(pts):pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area=`M${pts[0][0]} ${pt+ih} `+pts.map(p=>'L'+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ')+` L${pts[pts.length-1][0]} ${pt+ih} Z`;
  const dots=pts.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4" fill="#fff" stroke="${color}" stroke-width="2.4"/>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;margin-top:10px"><defs><linearGradient id="flg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".18"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    <path d="${area}" fill="url(#flg)"/><path d="${line}" fill="none" stroke="${color}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>${dots}</svg>`;
}
function flRespCard(name,badge,sub,chart){
  return `<div class="d2card"><div class="d2card-h"><div><div class="ttl" style="font-size:19px">${name}</div><div class="sub" style="font-size:13px;margin-top:4px">${sub}</div></div><span class="fl-badge">${badge}</span></div>${chart}</div>`;
}

/* ===================== ANALYTICS SCREEN (3 tabs) ========================= */
SCREENS.amAnimal = (params={}) => {
  const tab = STATE.amTab || 'overview';
  let body='';
  if(tab==='overview'){
    body = `${flActivityChart()}
      <div class="fl-sec">Response Analytics</div>
      ${flRespCard('Weight','Numeric Value','Trend · last 8 records', flLine(FLOW.weight8,'#37BD69'))}
      ${flRespCard('Temperature','Numeric Value','Trend · last 8 records', flLine([38.7,38.5,38.6,38.4,38.6,38.5,38.6,38.5],'#FA6140'))}
      ${flRespCard('Body Condition','Numeric Scale','Progression · target band 4–5', flLine([3,3,3,4,4,4,4,4],'#8479F9'))}
      ${flRespCard('Appetite','List','Most recent · Excellent', `<div class="ldist" style="margin-top:12px;height:12px">
        <span style="width:50%;background:#37BD69"></span><span style="width:33%;background:#7BC96A"></span><span style="width:17%;background:#E4B819"></span></div>
        <div class="lleg" style="margin-top:10px"><span class="lg"><i style="background:#37BD69"></i>Excellent 3</span><span class="lg"><i style="background:#7BC96A"></i>Good 2</span><span class="lg"><i style="background:#E4B819"></i>Fair 1</span></div>`)}`;
  } else if(tab==='comparison'){
    const seg=STATE.amCmpMode||'prev';
    body = `<div class="fl-cseg"><button class="${seg==='prev'?'on':''}" onclick="setFilter('amCmpMode','prev')">Current vs Previous</button>
        <button class="${seg==='custom'?'on':''}" onclick="setFilter('amCmpMode','custom')">Custom</button></div>
      <div class="fl-cwhen">Current · ${FLOW.cmpCurrent} <span class="mut">vs</span> Previous · ${FLOW.cmpPrev}</div>
      <div class="fl-ai"><div class="fl-ai-h">✦ AI Comparison Summary</div>
        <div class="fl-ai-b">Compared to the previous assessment:<ul>${FLOW.cmpSummary.map(s=>`<li>${s}</li>`).join('')}</ul></div></div>
      ${FLOW.cmpRows.map(r=>{const up=r.dir==='up'; const c=up?'#2E9E5B':'#E0492B', bg=up?'#37BD691f':'#FA61401f';
        return `<div class="fl-crow"><div class="cr-h"><span class="cr-n">${r.n}</span><span class="fl-badge">${r.badge}</span></div>
          <div class="cr-vals"><span class="cr-a">${r.a}</span><span class="cr-arr">→</span><span class="cr-b">${r.b}</span>
            <span class="cr-d" style="background:${bg};color:${c}">${r.d}</span></div></div>`;}).join('')}`;
  } else {
    const cat=STATE.flCat||'All';
    const recs=FLOW.history.filter(h=>cat==='All'||h.cat===cat);
    body = `<div class="fl-catchips">${FLOW.histCats.map(c=>`<span class="fl-catchip ${c===cat?'on':''}" onclick="setFilter('flCat','${c}')">${c}</span>`).join('')}</div>
      ${recs.map(h=>{const st=FL_STATUS[h.s]||FL_STATUS.Completed;
        return `<div class="fl-hrec"><div class="hr-b"><div class="hr-top"><span class="hr-t">${h.t}</span><span class="fl-status" style="background:${st.bg};color:${st.c}">${h.s}</span></div>
          <div class="hr-m">${h.d} · ${h.tm}<br>Recorded by · ${h.by}</div></div>${I.chevron}</div>`;}).join('')}
      <div style="height:10px"></div>`;
  }
  return `<div class="screen active"><div class="scroll dash2" style="padding-bottom:26px">${flHeader(tab)}${body}</div></div>`;
};
