/* ===========================================================================
   MASTER KIT — matches the "Species Master" reference structure.
   Titled cards · labeled stat rows (badge+value+chevron) · distribution bars +
   legend · stacked status bar · donut + centre total + legend · mini-3 ·
   thumbnail list · count tabs · search · trend line.
   =========================================================================== */
injectCSS('css-m', `
  .m-wrap{padding:0 16px;}
  .m-back{padding:54px 16px 8px;display:flex;align-items:center;gap:10px;}
  .m-back .bk{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--label);cursor:pointer;}
  .m-back .bk svg{width:11px;height:18px;}
  .m-back .ti{font-size:22px;font-weight:700;letter-spacing:-.3px;}
  .m-back .ti small{display:block;font-size:12px;font-weight:500;color:var(--label-secondary);letter-spacing:0;}
  .m-back .men{margin-left:auto;color:var(--label-secondary);cursor:pointer;}

  .m-search{margin:4px 16px 14px;background:var(--bg-elevated);border:1px solid var(--hairline);border-radius:14px;
    display:flex;align-items:center;gap:9px;padding:12px 14px;color:var(--label-secondary);font-size:14px;}
  .m-search svg{width:16px;height:16px;}

  .m-tabs{display:flex;gap:0;margin:0 16px 16px;border-bottom:1px solid var(--separator);}
  .m-tab{flex:1;text-align:center;padding:6px 0 12px;cursor:pointer;position:relative;}
  .m-tab .mt-n{font-size:18px;font-weight:700;color:var(--label-tertiary);}
  .m-tab .mt-l{font-size:13px;color:var(--label-tertiary);margin-top:2px;}
  .m-tab.on .mt-n{color:var(--primary);} .m-tab.on .mt-l{color:var(--label);font-weight:600;}
  .m-tab.on::after{content:"";position:absolute;left:18%;right:18%;bottom:-1px;height:2.5px;background:var(--primary);border-radius:2px;}

  .m-card{background:var(--bg-elevated);border:1px solid var(--hairline);border-radius:16px;box-shadow:var(--shadow);
    margin:0 16px 16px;padding:18px;}
  .m-card-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px;}
  .mc-t{font-size:17px;font-weight:700;letter-spacing:-.2px;}
  .mc-s{font-size:12px;color:var(--label-secondary);margin-top:2px;}
  .mc-view{font-size:13px;font-weight:600;color:var(--primary);cursor:pointer;display:flex;align-items:center;gap:3px;white-space:nowrap;}
  .mc-view svg{width:7px;height:12px;}
  .mc-info{color:var(--label-tertiary);}.mc-info svg{width:18px;height:18px;}

  .m-row{display:flex;align-items:center;gap:12px;padding:13px 0;border-top:1px solid var(--separator);cursor:pointer;}
  .m-row:first-child{border-top:0;}
  .m-row .m-badge{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    font-size:11px;font-weight:800;color:#fff;flex:0 0 auto;}
  .m-row .m-ico{width:28px;height:28px;border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;flex:0 0 auto;}
  .m-row .m-ico svg{width:16px;height:16px;}
  .m-row .m-dot{width:12px;height:12px;border-radius:50%;flex:0 0 auto;}
  .m-row .m-lab{flex:1;font-size:15px;font-weight:500;color:var(--label);}
  .m-row .m-lab .m-sub{font-size:12px;color:var(--label-secondary);font-weight:400;}
  .m-row .m-val{font-size:18px;font-weight:700;flex:0 0 auto;}
  .m-row .m-chev{color:var(--label-tertiary);display:flex;}.m-row .m-chev svg{width:8px;height:13px;}
  .m-pill-row{display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--fill-quat);border-radius:12px;margin-top:10px;cursor:pointer;}
  .m-pill-row .pv{font-size:16px;font-weight:700;}.m-pill-row .pl{flex:1;font-size:14px;color:var(--label-2);}
  .m-pill-row .pview{font-size:13px;font-weight:600;color:var(--primary);display:flex;align-items:center;gap:3px;}
  .m-pill-row .pview svg{width:7px;height:12px;}

  /* distribution bars */
  .m-dist{display:flex;align-items:center;gap:12px;padding:8px 0;cursor:pointer;}
  .m-dist .db{height:12px;border-radius:6px;flex:0 0 auto;}
  .m-dist .dv{margin-left:auto;font-size:16px;font-weight:700;}
  .m-dist .m-chev{color:var(--label-tertiary);display:flex;}.m-dist .m-chev svg{width:8px;height:13px;}
  .m-legend{display:flex;flex-wrap:wrap;gap:8px 16px;margin-top:14px;}
  .m-legend .lg{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--label-secondary);font-weight:500;}
  .m-legend .lg i{width:9px;height:9px;border-radius:50%;}

  /* stacked status bar */
  .m-stack{display:flex;height:12px;border-radius:6px;overflow:hidden;gap:2px;margin:4px 0 14px;}
  .m-stack span{height:100%;}

  /* donut + legend */
  .m-donutwrap{display:flex;flex-direction:column;align-items:center;margin:6px 0 14px;position:relative;}
  .m-donutc{position:relative;width:150px;height:150px;}
  .m-donut-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
  .m-donut-center .dl{font-size:12px;color:var(--label-secondary);}
  .m-donut-center .dv{font-size:28px;font-weight:800;letter-spacing:-.5px;}

  /* mini 3-up */
  .m-mini3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:0 16px 12px;}
  .m-mini{background:var(--bg-elevated);border:1px solid var(--hairline);border-radius:16px;box-shadow:var(--shadow);padding:16px 12px;}
  .m-mini .mm-ico{width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;color:#fff;}
  .m-mini .mm-ico svg{width:15px;height:15px;}
  .m-mini .mm-n{font-size:24px;font-weight:700;letter-spacing:-.5px;}
  .m-mini .mm-l{font-size:12px;color:var(--label-secondary);margin-top:2px;}

  /* thumbnail list */
  .m-thumb{display:flex;align-items:center;gap:12px;padding:11px 0;border-top:1px solid var(--separator);cursor:pointer;}
  .m-thumb:first-child{border-top:0;}
  .m-thumb .tb-body{flex:1;min-width:0;}
  .m-thumb .tb-name{font-size:15px;font-weight:600;}
  .m-thumb .tb-sub{font-size:12px;font-style:italic;color:var(--label-secondary);margin-top:1px;}
  .m-thumb .tb-tag{display:inline-block;font-size:11px;font-weight:700;padding:3px 8px;border-radius:7px;margin-top:5px;}
  .m-thumb .m-chev{color:var(--label-tertiary);}.m-thumb .m-chev svg{width:8px;height:13px;}
`);

function mInfoIco(){ return '<span class="mc-info"><svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8.5" stroke="currentColor" stroke-width="1.4"/><circle cx="10" cy="6.4" r="1" fill="currentColor"/><path d="M10 9v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span>'; }
function mView(go){ return `<span class="mc-view" ${go?`onclick="${go}"`:''}>View ${I.chevron}</span>`; }
function mArrow(go){ return `<span class="mc-view" ${go?`onclick="${go}"`:''} style="color:var(--label-tertiary)">${I.chevron}</span>`; }

function mBack(title, sub, {back=true}={}){
  return `<div class="m-back">${back?`<span class="bk" onclick="back()">${I.back}</span>`:''}
    <span class="ti">${title}${sub?`<small>${sub}</small>`:''}</span>
    <span class="men" onclick="openNavMenu()">${I.grid}</span></div>`;
}
function mSearch(ph){ return `<div class="m-search">${I.search}<span>${ph}</span></div>`; }
function mTabs(tabs, active){
  return `<div class="m-tabs">${tabs.map(t=>`<div class="m-tab ${t.key===active?'on':''}" ${t.go?`onclick="${t.go}"`:''}>
    <div class="mt-n">${t.count}</div><div class="mt-l">${t.label}</div></div>`).join('')}</div>`;
}
function mCard(title, sub, right, body){
  return `<div class="m-card"><div class="m-card-head"><div><div class="mc-t">${title}</div>${sub?`<div class="mc-s">${sub}</div>`:''}</div>${right||''}</div>${body}</div>`;
}
function mRow(o){
  const badge = o.letter!=null ? `<span class="m-badge" style="background:${o.color}">${o.letter}</span>`
    : o.icon ? `<span class="m-ico" style="background:color-mix(in srgb, ${o.color} 15%, #fff);color:${o.color}">${o.icon}</span>`
    : `<span class="m-dot" style="background:${o.color}"></span>`;
  return `<div class="m-row" ${o.go?`onclick="${o.go}"`:''}>${badge}
    <span class="m-lab">${o.label}${o.sub?`<span class="m-sub"> · ${o.sub}</span>`:''}</span>
    <span class="m-val" ${o.vcolor?`style="color:${o.vcolor}"`:''}>${o.value}</span>
    <span class="m-chev">${I.chevron}</span></div>`;
}
function mPillRow(value, label, go){
  return `<div class="m-pill-row" ${go?`onclick="${go}"`:''}><span class="pv">${value}</span><span class="pl">${label}</span>${go?`<span class="pview">View ${I.chevron}</span>`:''}</div>`;
}
function mDistBars(rows){
  const max=Math.max(...rows.map(r=>r.val))||1;
  return rows.map(r=>`<div class="m-dist" ${r.go?`onclick="${r.go}"`:''}>
    <span class="db" style="width:${Math.max(14,Math.round(r.val/max*55))}%;background:${r.color}"></span>
    <span class="dv">${r.val}</span><span class="m-chev">${I.chevron}</span></div>`).join('');
}
function mLegend(items){ return `<div class="m-legend">${items.map(i=>`<span class="lg"><i style="background:${i.color}"></i>${i.label}</span>`).join('')}</div>`; }
function mStacked(segs){ const t=segs.reduce((s,x)=>s+x.val,0)||1;
  return `<div class="m-stack">${segs.map(s=>`<span style="width:${(s.val/t*100).toFixed(1)}%;background:${s.color}"></span>`).join('')}</div>`; }
function mDonutCard(title, sub, segs, centerLab, centerVal, right){
  const total=segs.reduce((s,x)=>s+x.val,0)||1;
  return mCard(title, sub, right, `<div class="m-donutwrap"><div class="m-donutc">${aaDonut(segs,{size:150,sw:18})}
      <div class="m-donut-center"><div class="dl">${centerLab}</div><div class="dv">${centerVal}</div></div></div></div>
    <div>${segs.map(s=>`<div class="m-row" ${s.go?`onclick="${s.go}"`:''}><span class="m-dot" style="background:${s.color}"></span>
      <span class="m-lab">${s.label}</span><span class="m-val">${s.val}</span><span class="m-chev">${I.chevron}</span></div>`).join('')}</div>`);
}
function mMini3(items){
  return `<div class="m-mini3">${items.map(it=>`<div class="m-mini">
    <div class="mm-ico" style="background:${it.color||'var(--primary)'}">${it.icon||I.drop}</div>
    <div class="mm-n">${it.n}</div><div class="mm-l">${it.label}</div></div>`).join('')}</div>`;
}
function mThumbList(items){
  return items.map(it=>`<div class="m-thumb" ${it.go?`onclick="${it.go}"`:''}>
    ${photoBox(it.name,{size:46,radius:12})}
    <div class="tb-body"><div class="tb-name">${it.name}</div><div class="tb-sub">${it.sub}</div>
      ${it.tag?`<span class="tb-tag" style="background:${it.tagColor}22;color:${it.tagColor}">${it.tag}</span>`:''}</div>
    <span class="m-chev">${I.chevron}</span></div>`).join('');
}
/* trend line with axes + dots (Species Collection Trend style) */
function mTrend(data, labels, {color='#37BD69'}={}){
  const w=320,h=170,pl=30,pr=8,pt=14,pb=24; const min=Math.min(...data),max=Math.max(...data);
  const lo=Math.floor(min*0.7), hi=Math.ceil(max*1.05), rng=(hi-lo)||1;
  const X=i=>pl+(i/(data.length-1))*(w-pl-pr), Y=v=>pt+(1-(v-lo)/rng)*(h-pt-pb);
  const pts=data.map((v,i)=>[X(i),Y(v)]);
  const line=(typeof smoothPath==='function')?smoothPath(pts):pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const gid='mt'+Math.abs(hashStr(color+data.join()));
  const area=line+` L${X(data.length-1).toFixed(1)} ${(h-pb).toFixed(1)} L${pl} ${(h-pb).toFixed(1)} Z`;
  let grid=''; for(let g=0;g<=3;g++){ const yv=lo+rng*g/3, y=Y(yv);
    grid+=`<line x1="${pl}" y1="${y.toFixed(1)}" x2="${w-pr}" y2="${y.toFixed(1)}" stroke="var(--separator)" stroke-width="1"/>
      <text x="${pl-6}" y="${(y+3).toFixed(1)}" text-anchor="end" font-size="9" fill="var(--label-tertiary)">${Math.round(yv)}</text>`; }
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".2"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    ${grid}
    <path d="${area}" fill="url(#${gid})" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.6s" begin="0.25s" fill="freeze"/></path>
    <path d="${line}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1">${(typeof drawAnim==='function')?drawAnim('0.9s'):''}</path>
    ${pts.map((p,i)=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="0" fill="${color}" stroke="#fff" stroke-width="2"><animate attributeName="r" values="0;4" dur="0.25s" begin="${(0.5+i*0.05).toFixed(2)}s" fill="freeze"/></circle>`).join('')}
    ${labels.map((l,i)=>`<text x="${X(i).toFixed(1)}" y="${h-7}" text-anchor="middle" font-size="9" fill="var(--label-tertiary)">${l}</text>`).join('')}</svg>`;
}
