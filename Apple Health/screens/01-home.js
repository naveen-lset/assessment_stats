/* ===========================================================================
   Reference-style components + reworked Home (Inter, official palette, no tab bar)
   Loads after app.js + 00-runtime.js; overrides SCREENS.dashboard & tabHeader.
   =========================================================================== */

/* colour lerp for gauge ticks */
function hx(c){return [parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];}
function lerpCol(a,b,t){const A=hx(a),B=hx(b);return '#'+[0,1,2].map(i=>Math.round(A[i]+(B[i]-A[i])*t).toString(16).padStart(2,'0')).join('');}

/* neumorphic half-gauge with radial ticks + centre number */
function gaugeBlock(value,max,centreNum,centreLab,{from='#00D6C9',to='#37BD69',ticks=44}={}){
  const w=240,h=148,cx=120,cy=138,r=104,ir=88;
  const frac=Math.max(0,Math.min(1,value/max));
  let t='';
  for(let i=0;i<ticks;i++){
    const p=i/(ticks-1);
    const ang=Math.PI*(1+p);              // 180°→360° across the top
    const x1=cx+Math.cos(ang)*ir, y1=cy+Math.sin(ang)*ir;
    const x2=cx+Math.cos(ang)*r,  y2=cy+Math.sin(ang)*r;
    const on=p<=frac;
    const col=on?lerpCol(from,to,p):'#E2E9E5';
    t+=`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${col}" stroke-width="3.4" stroke-linecap="round"/>`;
  }
  return `<div class="gauge-wrap">
    <svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block">${t}</svg>
    <div class="gauge-center"><div class="gc-num">${centreNum}</div><div class="gc-lab">${centreLab}</div></div>
  </div>`;
}

/* concentric multi-ring (macros style) */
function multiRing(rings,{size=92}={}){
  const cx=size/2,cy=size/2,sw=8,gap=4; let s='';
  rings.forEach((rg,i)=>{
    const r=size/2-6-i*(sw+gap); const C=2*Math.PI*r; const off=C*(1-Math.max(0.02,Math.min(1,rg.frac)));
    s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${rg.color}22" stroke-width="${sw}"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${rg.color}" stroke-width="${sw}" stroke-linecap="round"
      stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>`;
  });
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="flex:0 0 auto">${s}</svg>`;
}

/* segmented meter rows (HIGH / MED / LOW) */
function segMeter(rows,{segs=18}={}){
  return `<div class="segm">${rows.map(r=>{
    const on=Math.round(r.pct/100*segs);
    let bars=''; for(let i=0;i<segs;i++) bars+=`<i style="${i<on?`background:${r.color}`:''}"></i>`;
    return `<div class="segm-row"><span class="sg-key">${r.key}</span>
      <span class="sg-bar">${bars}</span>
      <span class="sg-meta"><b>${r.pct}%</b> · ${r.meta}</span></div>`;
  }).join('')}</div>`;
}

/* light bar chart, last bar highlighted (sleep style) */
function homeBars(data,color,{w=320,h=64}={}){
  const max=Math.max(...data)||1,n=data.length,gap=w/n,bw=gap*0.5;
  let b=''; data.forEach((v,i)=>{const bh=Math.max(4,(v/max)*(h-6)),x=gap*i+(gap-bw)/2,y=h-bh;
    b+=`<rect x="${x.toFixed(1)}" y="${h}" width="${bw.toFixed(1)}" height="0" rx="${(bw/2.5).toFixed(1)}" fill="${color}" opacity="${i===n-1?1:.28}">
      <animate attributeName="height" values="0;${bh.toFixed(1)}" dur="0.5s" begin="${(i*0.035).toFixed(2)}s" fill="freeze" calcMode="spline" keySplines="0.33 0 0.2 1" keyTimes="0;1"/>
      <animate attributeName="y" values="${h};${y.toFixed(1)}" dur="0.5s" begin="${(i*0.035).toFixed(2)}s" fill="freeze" calcMode="spline" keySplines="0.33 0 0.2 1" keyTimes="0;1"/></rect>`;});
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block">${b}</svg>`;
}

/* gradient line (stress/score style) */
function gradLine(data,{w=320,h=92,from='#00D6C9',to='#37BD69',fill=true}={}){
  const pad=6,min=Math.min(...data),max=Math.max(...data),rng=(max-min)||1;
  const X=i=>pad+(i/(data.length-1))*(w-2*pad), Y=v=>pad+(1-(v-min)/rng)*(h-2*pad-6);
  const pts=data.map((v,i)=>[X(i),Y(v)]);
  const line=(typeof smoothPath==='function')?smoothPath(pts):pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const gid='gl'+Math.abs(hashStr(from+to+data.join()));
  const area=line+` L${X(data.length-1)} ${h-pad} L${X(0)} ${h-pad} Z`;
  const last=pts[pts.length-1];
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block">
    <defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>
      <linearGradient id="${gid}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${to}" stop-opacity=".18"/><stop offset="1" stop-color="${to}" stop-opacity="0"/></linearGradient>
    </defs>
    ${fill?`<path d="${area}" fill="url(#${gid}f)" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.6s" begin="0.25s" fill="freeze"/></path>`:''}
    <path d="${line}" fill="none" stroke="url(#${gid})" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1">${(typeof drawAnim==='function')?drawAnim('0.9s'):''}</path>
    <circle cx="${last[0]}" cy="${last[1]}" r="0" fill="${to}" stroke="#fff" stroke-width="2"><animate attributeName="r" values="0;4.5" dur="0.3s" begin="0.8s" fill="freeze"/></circle>
  </svg>`;
}

/* 2-col stat cards with delta chips */
function statGrid(items){
  return `<div class="scards">${items.map(it=>`
    <div class="scard" ${it.go?`onclick="${it.go}"`:''}>
      <div class="sc-lab">${it.lab}</div>
      <div class="sc-row"><span class="sc-val" ${it.color?`style="color:${it.color}"`:''}>${it.val}</span>
        ${it.unit?`<span class="sc-unit">${it.unit}</span>`:''}
        ${it.delta!=null?`<span class="sc-delta ${it.up?'delta-up':'delta-down'}">${it.up?I.arrowUp:I.arrowDn}${it.delta}</span>`:''}</div>
    </div>`).join('')}</div>`;
}

/* card shell with header + arrow */
function hcard(title, sub, goExpr, body){
  return `<div class="hcard">
    <div class="hcard-head"><div class="hc-t">${title}${sub?` <small>${sub}</small>`:''}</div>
      ${goExpr?`<div class="hc-arrow" onclick="${goExpr}">${I.chevron}</div>`:''}</div>
    ${body}</div>`;
}

/* nav menu sheet (replaces bottom tab bar) */
function openNavMenu(){
  const items=[
    {label:'Home', sub:'Welfare overview', act:"switchTab('dashboard')", c:'var(--primary)', ic:I.grid},
    {label:'Assessments', sub:'Assessment Master · analytics · records', act:"go('aaDash')", c:'var(--addblue)', ic:I.scale},
    {label:'Species', sub:'Browse & analytics', act:"switchTab('species')", c:'var(--secondary)', ic:I.paw},
    {label:'Modules', sub:'All assessment screens', act:"switchTab('modules')", c:'var(--purple)', ic:I.scale},
    {label:'Executive', sub:'Org KPIs · risk · sites', act:"go('exeOverview')", c:'var(--addblue)', ic:I.grid},
    {label:'Work Queue', sub:'Due & overdue', act:"go('capQueue')", c:'var(--tertiary)', ic:I.clock},
    {label:'Setup', sub:'Types & templates', act:"switchTab('setup')", c:'#000', ic:I.doc},
  ];
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div class="sh-title">Navigate</div><div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="pill-list navsheet">${items.map(it=>`
      <div class="pill-opt" onclick="closeSheet();${it.act}">
        <span class="ns-ico" style="background:${it.c}">${it.ic}</span>
        <div style="flex:1"><div style="font-weight:700">${it.label}</div><div class="sh-sub">${it.sub}</div></div>
        <span class="chev" style="color:var(--label-tertiary)">${I.chevron}</span></div>`).join('')}</div>`);
}

/* give tab-root headers a menu button so nav works without a bottom bar */
tabHeader = function(title, sub, {insights=false}={}){
  const t = insights ? `${title} <span class="muted2">Insights</span><span class="spark">✦</span>` : title;
  return `<div class="topbar" style="padding-bottom:2px">
      <div class="tb-when"><div class="tb-date" style="font-size:26px;font-weight:800;letter-spacing:-.5px">${title}</div>
        <div class="tb-sub" style="text-transform:none;font-size:13px;font-weight:500;color:var(--label-secondary)">${sub||''}</div></div>
      <div class="tb-menu" onclick="openNavMenu()">${I.grid}</div>
    </div>`;
};

/* ---------------------------- HOME (reworked) ----------------------------- */
SCREENS.dashboard = () => {
  const s = collectionStats();
  const logged7 = ACTIVITY_14.slice(7).reduce((x,y)=>x+y,0);
  // assessment activity for the selected range (Week / Month / Year)
  const act = activityFor(STATE.homeRange);
  const actDelta = act.total - act.prev;
  const idx = s.avg;
  // risk buckets
  const high=s.dist.Watch, med=s.dist.Fair, low=s.dist.Good+s.dist.Excellent, tot=s.count;
  // ALL five welfare domains for the rings
  const ringDoms=[...DOMAIN_ORDER];

  return `<div class="screen active"><div class="scroll ref">
    <div class="topbar">
      <div class="tb-cal">${I.cal}</div>
      <div class="tb-when"><div class="tb-date">Today, 9 Jun</div><div class="tb-sub">Welfare Overview</div></div>
      <div class="tb-streak">${I.bolt}${logged7}</div>
      <button class="tb-add" onclick="go('capQueue')">${I.plus}</button>
      <div class="tb-menu" onclick="openNavMenu()">${I.grid}</div>
    </div>
    <div class="home-greet"><div class="hg-title">Welfare Index</div>
      <div class="hg-sub">${s.count} animals · ${Object.keys(SPECIES).length} species</div></div>

    ${hcard('Welfare Index','/ 100', "go('exeOverview')", `
      ${gaugeBlock(idx,100,idx,`${welfareLabel(idx)} · welfare index`)}
      <div class="hc-legend">
        <span class="lg"><i style="background:var(--primary)"></i>Assessed ${logged7}</span>
        <span class="lg"><i style="background:var(--label-tertiary)"></i>Pending ${s.attention.length}</span>
      </div>`)}

    <div class="asmt-entry" onclick="go('aaDash')">
      <span class="ae-ico">${I.scale}</span>
      <div class="ae-body"><div class="ae-t">Assessments</div>
        <div class="ae-s">Assessment Master · ${(typeof aaOrg==='function'?aaOrg().total:387).toLocaleString()} records</div></div>
      <span class="ae-chev">${I.chevron}</span>
    </div>

    ${hcard('Welfare Domains','all five domains', "go('speciesAnalytics',{sp:'lion'})", `
      <div class="dom5">${ringDoms.map(d=>{const c=CATS[d],v=s.domAvg[d];return `
        <div class="dom5-row">
          <span class="d5-ico" style="background:${c.raw}1f;color:${c.raw}">${c.icon}</span>
          <span class="d5-name">${c.name}</span>
          <span class="d5-track"><span class="d5-fill" style="width:${v}%;background:${c.raw}"></span></span>
          <span class="d5-val" style="color:${c.raw}">${v}</span>
        </div>`;}).join('')}</div>`)}

    ${hcard('Risk Counter', `${s.count} animals assessed`, "go('cmpRisk')", `
      <div class="risk-count">
        <div class="rc-cell"><div class="rc-n" style="color:#FA6140">${high}</div><div class="rc-l">High risk</div></div>
        <div class="rc-cell"><div class="rc-n" style="color:#E4B819">${med}</div><div class="rc-l">Medium</div></div>
        <div class="rc-cell"><div class="rc-n" style="color:#37BD69">${low}</div><div class="rc-l">Low risk</div></div>
      </div>
      ${segMeter([
        {key:'HIGH', pct:Math.round(high/tot*100), color:'#FA6140', meta:`${high}/${tot}`},
        {key:'MED',  pct:Math.round(med/tot*100),  color:'#E4B819', meta:`${med}/${tot}`},
        {key:'LOW',  pct:Math.round(low/tot*100),  color:'#37BD69', meta:`${low}/${tot}`},
      ])}`)}

    <div class="hcard">
      <div class="hcard-head"><div class="hc-t">Assessments Done <small>${act.unit}</small></div>
        <div class="hc-arrow" onclick="go('exeOverview')">${I.chevron}</div></div>
      ${segMini('homeRange',[{v:'W',lab:'Week'},{v:'M',lab:'Month'},{v:'Y',lab:'Year'}],STATE.homeRange)}
      <div style="display:flex;align-items:baseline;gap:8px;margin:4px 0 8px">
        <span style="font-size:26px;font-weight:800;letter-spacing:-.5px">${act.total.toLocaleString()}</span>
        <span class="sc-delta ${actDelta>=0?'delta-up':'delta-down'}" style="font-size:13px">${actDelta>=0?I.arrowUp:I.arrowDn}${Math.abs(actDelta)} vs prev</span></div>
      ${homeBars(act.data,'#37BD69')}</div>

    ${hcard('Welfare Score','30-day trend', "go('exeOverview')", `
      <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:6px">
        <span style="font-size:26px;font-weight:800;letter-spacing:-.5px;color:${welfareColor(idx)}">${idx}</span>
        <span style="font-size:13px;color:var(--label-secondary);font-weight:600">${welfareLabel(idx)}</span></div>
      ${gradLine([72,74,73,76,75,78,80,idx], {from:'#00D6C9', to:'#37BD69'})}`)}

    ${statGrid([
      {lab:'Animals', val:s.count, unit:`in ${Object.keys(SPECIES).length} species`, go:"switchTab('species')"},
      {lab:'Needs Attention', val:s.attention.length, color:'#FA6140', delta:'action', up:false, go:"go('cmpRisk')"},
      {lab:'Avg Welfare', val:idx, unit:welfareLabel(idx), color:welfareColor(idx), delta:'2%', up:true},
      {lab:'Logged · 7d', val:logged7, delta:'7d', up:true, go:"go('capQueue')"},
    ])}

  </div></div>`;
};
