/* ===========================================================================
   ASSESSMENT DASHBOARD — analytics rework (loads LAST, overrides SCREENS.dashboard)
   Global filter (Today/Week/Month/Year/Custom) · axis-labelled interactive charts
   with hover tooltips · radar (replaces gauge) · risk analytics · analytics cards.
   Apple-Health / SaaS-analytics inspired, data-first.
   =========================================================================== */
injectCSS('css-dash2', `
  .dash2{padding-bottom:26px;}
  .d2-top{display:flex;align-items:center;gap:10px;padding:54px 16px 10px;}
  .d2-top .d2-t{font-size:24px;font-weight:800;letter-spacing:-.5px;}
  .d2-top .d2-sub{font-size:12.5px;color:var(--label-secondary);font-weight:500;margin-top:2px;}
  .d2-top .d2-menu{margin-left:auto;width:38px;height:38px;border-radius:11px;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow);}
  .d2-top .d2-menu svg{width:19px;height:19px;color:var(--label);}

  /* global filter */
  .gfilter{display:flex;gap:6px;padding:2px 16px 14px;overflow-x:auto;-ms-overflow-style:none;scrollbar-width:none;}
  .gfilter::-webkit-scrollbar{display:none;}
  .gfilter .gf{flex:0 0 auto;padding:8px 15px;border-radius:11px;background:#fff;border:1px solid var(--hairline);
    font-size:13px;font-weight:700;color:var(--label-secondary);cursor:pointer;transition:all .15s;}
  .gfilter .gf.on{background:#15282C;color:#fff;border-color:#15282C;}
  .gf-range{font-size:11px;color:var(--label-secondary);font-weight:600;padding:0 16px 12px;margin-top:-6px;}

  /* card */
  .d2card{background:#fff;border-radius:18px;box-shadow:var(--shadow);margin:0 16px 14px;padding:18px;}
  .d2card-h{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:4px;}
  .d2card-h .ttl{font-size:16px;font-weight:800;letter-spacing:-.2px;}
  .d2card-h .sub{font-size:12px;color:var(--label-secondary);margin-top:2px;}
  .d2-seg{display:flex;gap:3px;background:var(--fill-tert);border-radius:10px;padding:3px;}
  .d2-seg button{border:0;background:transparent;font-family:var(--font);font-size:11.5px;font-weight:700;color:var(--label-secondary);padding:6px 10px;border-radius:8px;cursor:pointer;}
  .d2-seg button.on{background:#fff;color:var(--primary);box-shadow:0 1px 5px rgba(20,60,45,.12);}

  /* overall stats 2x2 */
  .ostat{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin:0 16px 14px;}
  .ocell{background:#fff;border-radius:16px;box-shadow:var(--shadow);padding:15px 15px 14px;position:relative;overflow:hidden;}
  .ocell .oc-top{display:flex;align-items:center;gap:8px;}
  .ocell .oc-ic{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;}
  .ocell .oc-ic svg{width:16px;height:16px;}
  .ocell .oc-lab{font-size:12px;color:var(--label-secondary);font-weight:600;}
  .ocell .oc-val{font-size:27px;font-weight:800;letter-spacing:-.6px;margin-top:9px;line-height:1;}
  .ocell .oc-d{font-size:11.5px;font-weight:700;margin-top:6px;display:flex;align-items:center;gap:3px;}
  .ocell .oc-d svg{width:11px;height:11px;}
  .up{color:var(--primary);} .dn{color:var(--tertiary);}

  /* legend / rows */
  .d2-legend{display:flex;flex-wrap:wrap;gap:8px 14px;margin-top:14px;}
  .d2-legend .lg{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--label-secondary);font-weight:600;}
  .d2-legend .lg i{width:9px;height:9px;border-radius:3px;}
  .d2-legend .lg.dash i{border-radius:2px;height:3px;width:14px;}

  /* domain rows */
  .drow{display:flex;align-items:center;gap:11px;padding:11px 0;border-top:1px solid var(--separator);}
  .drow:first-child{border-top:0;}
  .drow .di{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;}
  .drow .di svg{width:16px;height:16px;}
  .drow .dn-n{flex:1;font-size:14px;font-weight:600;}
  .drow .dn-prev{font-size:11px;color:var(--label-tertiary);font-weight:600;}
  .drow .dn-cur{font-size:20px;font-weight:800;letter-spacing:-.4px;width:38px;text-align:right;}
  .drow .dn-tr{font-size:11.5px;font-weight:800;width:52px;text-align:right;display:flex;align-items:center;justify-content:flex-end;gap:2px;}
  .drow .dn-tr svg{width:10px;height:10px;}

  /* risk */
  .risk-toggle{display:flex;gap:3px;background:var(--fill-tert);border-radius:10px;padding:3px;}
  .risk-toggle button{border:0;background:transparent;font-family:var(--font);font-size:11.5px;font-weight:700;color:var(--label-secondary);padding:6px 11px;border-radius:8px;cursor:pointer;}
  .risk-toggle button.on{background:#fff;color:var(--primary);box-shadow:0 1px 5px rgba(20,60,45,.12);}
  .risk-body{display:flex;align-items:center;gap:8px;margin-top:6px;}
  .risk-rows{flex:1;}
  .rrow{display:flex;align-items:center;gap:10px;padding:9px 0;border-top:1px solid var(--separator);}
  .rrow:first-child{border-top:0;}
  .rrow .rdot{width:11px;height:11px;border-radius:50%;flex:0 0 auto;}
  .rrow .rname{flex:1;font-size:13px;font-weight:600;}
  .rrow .rval{font-size:16px;font-weight:800;}
  .rrow .rtr{font-size:11px;font-weight:800;width:40px;text-align:right;}

  /* analytics grid */
  .agrid{display:grid;grid-template-columns:1fr 1fr;gap:11px;}
  .acell{background:var(--fill-quat,#F3F7F5);border-radius:14px;padding:13px;}
  .acell .a-lab{font-size:11.5px;color:var(--label-secondary);font-weight:600;}
  .acell .a-val{font-size:21px;font-weight:800;letter-spacing:-.4px;margin-top:6px;display:flex;align-items:baseline;gap:5px;}
  .acell .a-val small{font-size:12px;font-weight:700;color:var(--label-secondary);}
  .acell .a-sub{font-size:11px;color:var(--label-tertiary);font-weight:600;margin-top:3px;}
  .acell .a-spark{margin-top:8px;}

  /* tooltip */
  .dashtip{position:fixed;z-index:9999;transform:translate(-50%,-100%);background:#15282C;color:#fff;
    padding:7px 10px;border-radius:9px;font-family:var(--font);pointer-events:none;display:none;
    box-shadow:0 6px 18px rgba(0,0,0,.25);text-align:center;min-width:54px;}
  .dashtip .dt-v{font-size:15px;font-weight:800;letter-spacing:-.2px;}
  .dashtip .dt-l{font-size:10.5px;opacity:.75;font-weight:600;margin-top:1px;}
  .dashtip .dt-d{font-size:10px;font-weight:800;margin-top:3px;}
  .dashtip .dt-d.up{color:#5fe39a;} .dashtip .dt-d.dn{color:#ff8e72;}
  .dash2 svg rect[onmousemove],.dash2 svg circle[onmousemove],.dash2 svg path[onmousemove]{transition:opacity .12s;}
  .dash2 svg circle[onmousemove]:hover{opacity:.75;}
`);

/* -------------------------------- tooltip --------------------------------- */
function dashTip(e, label, value, delta){
  let t = document.getElementById('dashtip');
  if(!t){ t = document.createElement('div'); t.id='dashtip'; t.className='dashtip'; document.body.appendChild(t); }
  t.innerHTML = `<div class="dt-v">${value}</div><div class="dt-l">${label}</div>`
    + (delta!=null && delta!=='' ? `<div class="dt-d ${String(delta).trim().startsWith('-')?'dn':'up'}">${delta} vs prev</div>` : '');
  t.style.display='block';
  t.style.left = e.clientX + 'px';
  t.style.top  = (e.clientY - 16) + 'px';
}
function dashTipHide(){ const t=document.getElementById('dashtip'); if(t) t.style.display='none'; }

/* -------------------------------- data ------------------------------------ */
const DASH_DOMS = [
  {key:'nutrition',  name:'Nutrition',       short:'Nutrition', color:'#37BD69'},
  {key:'environment',name:'Environment',     short:'Environ.',  color:'#00D6C9'},
  {key:'physical',   name:'Physical Health', short:'Physical',  color:'#FA6140'},
  {key:'behaviour',  name:'Behaviour',       short:'Behaviour', color:'#8479F9'},
  {key:'mental',     name:'Mental Domain',   short:'Mental',    color:'#00AFD6'},
];
const DASH_STATS = {
  Today: {total:34,  animals:9,  species:6, avg:77, dT:'+12%'},
  Week:  {total:187, animals:12, species:8, avg:77, dT:'+8%'},
  Month: {total:812, animals:12, species:8, avg:78, dT:'+15%'},
  Year:  {total:9840,animals:12, species:8, avg:79, dT:'+22%'},
  Custom:{total:540, animals:12, species:8, avg:77, dT:'+9%'},
};
const DASH_TREND = {
  Today: {labels:['6 AM','9 AM','12 PM','3 PM','6 PM','9 PM'], values:[3,8,12,9,14,6],  prev:[2,6,10,8,11,5]},
  Week:  {labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],  values:[24,31,19,28,35,22,28], prev:[20,28,18,25,30,19,24]},
  Month: {labels:['Week 1','Week 2','Week 3','Week 4','Week 5'], values:[170,210,160,230,180], prev:[150,190,150,210,165]},
  Year:  {labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], values:[640,720,580,810,690,760,700,880,740,860,910,930], prev:[560,650,540,720,640,690,650,790,690,780,820,860]},
};
DASH_TREND.Custom = DASH_TREND.Month;
const DASH_DOMAINS = {
  Week:  {nutrition:[80,77],environment:[78,80],physical:[76,74],behaviour:[77,75],mental:[73,76]},
  Month: {nutrition:[82,78],environment:[79,78],physical:[75,77],behaviour:[80,74],mental:[74,72]},
  Year:  {nutrition:[81,72],environment:[80,74],physical:[78,70],behaviour:[79,71],mental:[76,68]},
};
DASH_DOMAINS.Custom = DASH_DOMAINS.Month;
const DASH_DOM_SERIES = {  // 6-point performance-over-time per domain
  nutrition:[72,74,73,76,78,80], environment:[74,76,75,77,79,78], physical:[70,72,71,74,75,76],
  behaviour:[71,73,74,75,76,77], mental:[68,70,69,72,71,73],
};
const DASH_SERIES_LABELS = ['Jan','Feb','Mar','Apr','May','Jun'];
const DASH_RISK = {
  Today: {high:1,med:2,low:9, p:[2,3,7]},
  Week:  {high:1,med:3,low:8, p:[2,4,6]},
  Month: {high:2,med:3,low:7, p:[3,3,6]},
  Year:  {high:1,med:2,low:9, p:[3,4,5]},
};
DASH_RISK.Custom = DASH_RISK.Week;
function dashF(){ return STATE.dashF || 'Week'; }
function domF(){ return STATE.domF || 'Week'; }

/* ---------------------------- chart: trend -------------------------------- */
function trendChart(info){
  const {labels,values,prev}=info;
  const w=342,h=200,pl=30,pr=10,pt=14,pb=30, iw=w-pl-pr, ih=h-pt-pb;
  const max=Math.max(...values,...prev,1);
  const niceTop=Math.max(5,Math.ceil(max*1.12/5)*5);
  const n=values.length, slot=iw/n, bw=Math.min(26, slot*0.52);
  const X=i=>pl+slot*i+slot/2, Y=v=>pt+(1-v/niceTop)*ih;
  let grid='';
  for(let g=0;g<=4;g++){ const val=niceTop*g/4, y=pt+(1-g/4)*ih;
    grid+=`<line x1="${pl}" y1="${y.toFixed(1)}" x2="${w-pr}" y2="${y.toFixed(1)}" stroke="var(--separator)" stroke-width="1"/>`
        + `<text x="${pl-6}" y="${(y+3).toFixed(1)}" text-anchor="end" font-size="9" fill="var(--label-tertiary)">${Math.round(val)}</text>`; }
  let bars='';
  values.forEach((v,i)=>{ const bh=(v/niceTop)*ih, x=X(i)-bw/2, y=pt+ih-bh;
    bars+=`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="5" fill="#37BD69">`
      +`<animate attributeName="height" values="0;${bh.toFixed(1)}" dur="0.5s" begin="${(i*0.04).toFixed(2)}s" fill="freeze" calcMode="spline" keySplines="0.33 0 0.2 1" keyTimes="0;1"/>`
      +`<animate attributeName="y" values="${(pt+ih).toFixed(1)};${y.toFixed(1)}" dur="0.5s" begin="${(i*0.04).toFixed(2)}s" fill="freeze" calcMode="spline" keySplines="0.33 0 0.2 1" keyTimes="0;1"/></rect>`; });
  const pls=prev.map((v,i)=>[X(i),Y(v)]);
  const pline=(typeof smoothPath==='function')?smoothPath(pls):pls.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const prevPath=`<path d="${pline}" fill="none" stroke="#8479F9" stroke-width="2" stroke-dasharray="4 4" opacity=".85"/>`
    + pls.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.4" fill="#8479F9"/>`).join('');
  let xl='';
  labels.forEach((l,i)=>{ xl+=`<text x="${X(i).toFixed(1)}" y="${h-9}" text-anchor="middle" font-size="9.5" fill="var(--label-secondary)" font-weight="600">${l}</text>`; });
  let hit='';
  values.forEach((v,i)=>{ const d=v-prev[i], ds=(d>=0?'+':'')+d, x=X(i)-slot/2;
    hit+=`<rect x="${x.toFixed(1)}" y="${pt}" width="${slot.toFixed(1)}" height="${ih}" fill="transparent" style="cursor:pointer" onmousemove="dashTip(event,'${labels[i]}','${v}','${ds}')" onmouseleave="dashTipHide()"/>`; });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block">${grid}${bars}${prevPath}${xl}${hit}</svg>`;
}

/* ---------------------------- chart: radar -------------------------------- */
function radarChart(doms){
  const w=300,h=250,cx=150,cy=125,R=86,n=doms.length;
  const ang=i=>(-90+i*360/n)*Math.PI/180;
  const P=(i,fr)=>[cx+Math.cos(ang(i))*R*fr, cy+Math.sin(ang(i))*R*fr];
  let rings='';
  [0.25,0.5,0.75,1].forEach(fr=>{ const ps=doms.map((d,i)=>P(i,fr));
    rings+=`<polygon points="${ps.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}" fill="none" stroke="var(--separator)" stroke-width="1"/>`; });
  let spokes='',labs='';
  doms.forEach((d,i)=>{ const e=P(i,1); spokes+=`<line x1="${cx}" y1="${cy}" x2="${e[0].toFixed(1)}" y2="${e[1].toFixed(1)}" stroke="var(--separator)" stroke-width="1"/>`;
    const lp=P(i,1.2); labs+=`<text x="${lp[0].toFixed(1)}" y="${lp[1].toFixed(1)}" text-anchor="middle" font-size="9.5" font-weight="800" fill="${d.color}">${d.short}</text>`
      +`<text x="${lp[0].toFixed(1)}" y="${(lp[1]+11).toFixed(1)}" text-anchor="middle" font-size="9" fill="var(--label-secondary)" font-weight="700">${d.cur}</text>`; });
  const prevPts=doms.map((d,i)=>P(i,d.prev/100)), curPts=doms.map((d,i)=>P(i,d.cur/100));
  const prevPoly=`<polygon points="${prevPts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}" fill="none" stroke="#B8C0BD" stroke-width="1.6" stroke-dasharray="4 3"/>`;
  const curPoly=`<polygon points="${curPts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}" fill="rgba(55,189,105,.18)" stroke="#37BD69" stroke-width="2.4"/>`;
  let dots='';
  curPts.forEach((p,i)=>{ const d=doms[i].cur-doms[i].prev, ds=(d>=0?'+':'')+d;
    dots+=`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4.5" fill="#fff" stroke="${doms[i].color}" stroke-width="2.4" style="cursor:pointer" onmousemove="dashTip(event,'${doms[i].name}','${doms[i].cur}','${ds}')" onmouseleave="dashTipHide()"/>`; });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block">${rings}${spokes}${prevPoly}${curPoly}${dots}${labs}</svg>`;
}

/* ------------------------ chart: multi-line (domains) --------------------- */
function multiLine(){
  const w=342,h=168,pl=26,pr=10,pt=12,pb=24, iw=w-pl-pr, ih=h-pt-pb, lo=40,hi=100,rng=hi-lo;
  const labels=DASH_SERIES_LABELS, n=labels.length;
  const X=i=>pl+(i/(n-1))*iw, Y=v=>pt+(1-(v-lo)/rng)*ih;
  let grid='';
  for(let g=0;g<=3;g++){ const val=lo+rng*g/3, y=pt+(1-g/3)*ih;
    grid+=`<line x1="${pl}" y1="${y.toFixed(1)}" x2="${w-pr}" y2="${y.toFixed(1)}" stroke="var(--separator)" stroke-width="1"/>`
        +`<text x="${pl-5}" y="${(y+3).toFixed(1)}" text-anchor="end" font-size="8.5" fill="var(--label-tertiary)">${Math.round(val)}</text>`; }
  let lines='';
  DASH_DOMS.forEach(d=>{ const data=DASH_DOM_SERIES[d.key]; const pts=data.map((v,i)=>[X(i),Y(v)]);
    const path=(typeof smoothPath==='function')?smoothPath(pts):pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
    lines+=`<path d="${path}" fill="none" stroke="${d.color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity=".95"/>`;
    const last=pts[pts.length-1]; lines+=`<circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3" fill="${d.color}" style="cursor:pointer" onmousemove="dashTip(event,'${d.name} · ${labels[n-1]}','${data[n-1]}','')" onmouseleave="dashTipHide()"/>`; });
  let xl=''; labels.forEach((l,i)=>{ xl+=`<text x="${X(i).toFixed(1)}" y="${h-8}" text-anchor="middle" font-size="9" fill="var(--label-secondary)" font-weight="600">${l}</text>`; });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block">${grid}${lines}${xl}</svg>`;
}

/* ------------------------------ chart: donut ------------------------------ */
function donutChart(segs,{size=140,sw=22}={}){
  const r=(size-sw)/2, cx=size/2, cy=size/2, C=2*Math.PI*r, total=segs.reduce((s,x)=>s+x.val,0)||1;
  let off=0, arcs='';
  segs.forEach(s=>{ const len=s.val/total*C;
    arcs+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${sw}" stroke-linecap="butt" stroke-dasharray="${(len-2).toFixed(1)} ${(C-len+2).toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})" style="cursor:pointer" onmousemove="dashTip(event,'${s.label}','${s.val}','${s.pct}%')" onmouseleave="dashTipHide()"/>`;
    off+=len; });
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="display:block;flex:0 0 auto">${arcs}</svg>`;
}

/* ----------------------------- chart: sparkline --------------------------- */
function dashSpark(data,color,{w=120,h=34}={}){
  const min=Math.min(...data),max=Math.max(...data),rng=(max-min)||1;
  const pts=data.map((v,i)=>[(i/(data.length-1))*w, h-3-((v-min)/rng)*(h-6)]);
  const line=(typeof smoothPath==='function')?smoothPath(pts):pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const last=pts[pts.length-1];
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block">
    <path d="${line} L${w} ${h} L0 ${h} Z" fill="${color}" opacity=".10"/>
    <path d="${line}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3" fill="${color}"/></svg>`;
}
function ringPct(pct,color,{size=46}={}){
  const r=size/2-4, c=2*Math.PI*r, off=c*(1-pct/100);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="flex:0 0 auto">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}22" stroke-width="5"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 ${size/2} ${size/2})"/>
    <text x="${size/2}" y="${size/2+4}" text-anchor="middle" font-size="13" font-weight="800" fill="${color}">${pct}%</text></svg>`;
}

/* ------------------------------- sections --------------------------------- */
function d2arrow(delta){ const up=!String(delta).startsWith('-'); return `<span class="oc-d ${up?'up':'dn'}">${up?I.arrowUp:I.arrowDn}${delta}</span>`; }

function overallStats(s){
  const cells=[
    {lab:'Total Assessments', val:s.total.toLocaleString(), color:'#00AFD6', ic:I.doc,  d:s.dT, go:"go('amList')"},
    {lab:'Animals Assessed',  val:s.animals, color:'#37BD69', ic:I.paw,  sub:'of 12 animals', go:"go('amAnimals')"},
    {lab:'Species Covered',   val:s.species, color:'#00D6C9', ic:I.leaf, sub:'of 8 species', go:"go('amSpeciesList')"},
    {lab:'Avg Welfare Score', val:s.avg, color:welfareColor(s.avg), ic:I.heart, sub:welfareLabel(s.avg), go:"go('amWelfare')"},
  ];
  return `<div class="ostat">${cells.map(c=>`
    <div class="ocell" style="cursor:pointer" ${c.go?`onclick="${c.go}"`:''}>
      <div class="oc-top"><span class="oc-ic" style="background:${c.color}1f;color:${c.color}">${c.ic}</span><span class="oc-lab">${c.lab}</span></div>
      <div class="oc-val">${c.val}</div>
      <div style="display:flex;align-items:center;justify-content:space-between">${c.d?d2arrow(c.d):`<span class="oc-d" style="color:var(--label-tertiary)">${c.sub}</span>`}<span style="color:var(--label-tertiary);display:flex">${I.chevron}</span></div>
    </div>`).join('')}</div>`;
}

function globalFilter(f){
  const opts=['Today','Week','Month','Year','Custom'];
  return `<div class="gfilter">${opts.map(o=>`<div class="gf ${o===f?'on':''}" onclick="setFilter('dashF','${o}')">${o==='Custom'?'Custom Range':o}</div>`).join('')}</div>
    ${f==='Custom'?`<div class="gf-range">📅 Showing 1 Jun – 30 Jun 2026 · tap a range to change</div>`:''}`;
}

SCREENS.dashboard = () => {
  const f=dashF();
  const s=DASH_STATS[f]||DASH_STATS.Week;
  const tr=DASH_TREND[f]||DASH_TREND.Week;
  const df=domF();
  const dm=DASH_DOMAINS[df]||DASH_DOMAINS.Week;
  const doms=DASH_DOMS.map(d=>({...d, cur:dm[d.key][0], prev:dm[d.key][1]}));
  const rk=DASH_RISK[f]||DASH_RISK.Week;
  const rTot=rk.high+rk.med+rk.low, pTot=rk.p[0]+rk.p[1]+rk.p[2];
  const pct=v=>Math.round(v/rTot*100);
  const view=STATE.riskView||'count';
  const riskSegs=[{label:'High Risk',color:'#FA6140',val:rk.high,pct:pct(rk.high)},{label:'Medium Risk',color:'#E4B819',val:rk.med,pct:pct(rk.med)},{label:'Low Risk',color:'#37BD69',val:rk.low,pct:pct(rk.low)}];
  // analytics
  const coverage=Math.round(s.animals/12*100);
  const avg=Math.round(doms.reduce((a,d)=>a+d.cur,0)/doms.length);
  const hi=[...doms].sort((a,b)=>b.cur-a.cur)[0], lo=[...doms].sort((a,b)=>a.cur-b.cur)[0];

  return `<div class="screen active"><div class="scroll dash2">
    <div class="d2-top"><div><div class="d2-t">Assessment Dashboard</div><div class="d2-sub">Analytics overview · ${s.total.toLocaleString()} assessments</div></div>
      <div class="d2-menu" onclick="openNavMenu()">${I.grid}</div></div>

    ${globalFilter(f)}

    <div class="d2card-h" style="margin:0 16px 8px"><div class="ttl">Overall Assessment Statistics</div></div>
    ${overallStats(s)}

    <div class="d2card">
      <div class="d2card-h"><div><div class="ttl">Assessment Trend</div><div class="sub">${f==='Today'?'Hourly':f==='Week'?'Mon–Sun':f==='Year'?'Jan–Dec':'Weekly'} · vs previous period</div></div></div>
      ${trendChart(tr)}
      <div class="d2-legend"><span class="lg"><i style="background:#37BD69"></i>This period</span><span class="lg dash"><i style="background:#8479F9"></i>Previous</span></div>
    </div>

    <div class="d2card">
      <div class="d2card-h"><div><div class="ttl">Domain Comparison</div><div class="sub">Current vs previous · all five domains</div></div></div>
      ${radarChart(doms)}
      <div class="d2-legend"><span class="lg"><i style="background:#37BD69"></i>Current</span><span class="lg dash"><i style="background:#B8C0BD"></i>Previous</span></div>
    </div>

    <div class="d2card">
      <div class="d2card-h"><div><div class="ttl">Welfare Domains</div><div class="sub">Score · trend vs previous</div></div>
        <div class="d2-seg">${['Week','Month','Year','Custom'].map(o=>`<button class="${o===df?'on':''}" onclick="setFilter('domF','${o}')">${o==='Custom'?'Range':o}</button>`).join('')}</div></div>
      <div style="margin-top:6px">${doms.map(d=>{const tp=Math.round((d.cur-d.prev)/d.prev*1000)/10; const up=tp>=0; return `
        <div class="drow" style="cursor:pointer" onclick="go('amDomain',{domain:'${d.key}'})">
          <span class="di" style="background:${d.color}1f;color:${d.color}">${CATS[d.key].icon}</span>
          <div class="dn-n">${d.name}<div class="dn-prev">prev ${d.prev}</div></div>
          <span class="dn-cur" style="color:${d.color}">${d.cur}</span>
          <span class="dn-tr ${up?'up':'dn'}">${up?I.arrowUp:I.arrowDn}${Math.abs(tp)}%</span>
          <span style="color:var(--label-tertiary);display:flex;margin-left:6px">${I.chevron}</span>
        </div>`;}).join('')}</div>
      <div style="margin-top:12px;border-top:1px solid var(--separator);padding-top:10px">
        <div class="sub" style="margin-bottom:4px;font-weight:700;color:var(--label)">Performance over time</div>
        ${multiLine()}
        <div class="d2-legend">${DASH_DOMS.map(d=>`<span class="lg"><i style="background:${d.color}"></i>${d.short}</span>`).join('')}</div>
      </div>
    </div>

    <div class="d2card">
      <div class="d2card-h"><div><div class="ttl">Risk Analytics</div><div class="sub">${rTot} animals · distribution</div></div>
        <div class="risk-toggle"><button class="${view==='count'?'on':''}" onclick="setFilter('riskView','count')">Count</button><button class="${view==='pct'?'on':''}" onclick="setFilter('riskView','pct')">%</button></div></div>
      <div class="risk-body">
        ${donutChart(riskSegs)}
        <div class="risk-rows">${riskSegs.map((r,i)=>{const prev=rk.p[i];const d=r.val-prev;const up=d>=0;const lvl=['high','medium','low'][i];return `
          <div class="rrow" style="cursor:pointer" onclick="go('amRisk',{level:'${lvl}'})"><span class="rdot" style="background:${r.color}"></span><span class="rname">${r.label}</span>
            <span class="rval" style="color:${r.color}">${view==='count'?r.val:r.pct+'%'}</span>
            <span class="rtr ${up?'dn':'up'}">${up?'+':''}${d}</span>
            <span style="color:var(--label-tertiary);display:flex;margin-left:8px">${I.chevron}</span></div>`;}).join('')}</div>
      </div>
    </div>

    <div class="d2card-h" style="margin:2px 16px 8px"><div class="ttl">Assessment Analytics</div></div>
    <div class="d2card" style="padding:16px">
      <div class="agrid">
        <div class="acell"><div class="a-lab">Assessment Coverage</div><div style="display:flex;align-items:center;gap:10px;margin-top:6px">${ringPct(coverage,'#37BD69')}<div><div class="a-val" style="margin:0">${s.animals}<small>/ 12</small></div><div class="a-sub">animals assessed</div></div></div></div>
        <div class="acell"><div class="a-lab">Average Welfare Score</div><div class="a-val">${avg}<small>/ 100 · ${welfareLabel(avg)}</small></div><div class="a-spark">${dashSpark([72,74,73,76,75,avg],'#00AFD6')}</div></div>
        <div class="acell"><div class="a-lab">Highest Scoring Domain</div><div class="a-val" style="color:${hi.color}">${hi.cur}</div><div class="a-sub">${hi.name}</div></div>
        <div class="acell"><div class="a-lab">Lowest Scoring Domain</div><div class="a-val" style="color:${lo.color}">${lo.cur}</div><div class="a-sub">${lo.name}</div></div>
        <div class="acell"><div class="a-lab">Species Needing Attention</div><div class="a-val" style="color:#FA6140">3</div><div class="a-sub">of 8 species</div></div>
        <div class="acell"><div class="a-lab">Assessment Growth</div><div class="a-val up">${s.dT}</div><div class="a-spark">${dashSpark([60,64,62,70,76,82],'#37BD69')}</div></div>
      </div>
    </div>
  </div></div>`;
};
