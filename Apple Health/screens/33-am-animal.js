/* ===========================================================================
   ASSESSMENT MODULE — Animal Profile (Overview·Assessments·Analytics·History)
   + Animal Domain History. Reuses kit + dashboard charts.
   =========================================================================== */
injectCSS('css-am-animal', `
  .am-hero{display:flex;align-items:center;gap:14px;background:#fff;border-radius:18px;box-shadow:var(--shadow);margin:0 16px 14px;padding:16px;}
  .am-hero .amh-id{flex:1;min-width:0;}
  .am-hero .amh-n{font-size:21px;font-weight:800;letter-spacing:-.4px;}
  .am-hero .amh-s{font-size:12.5px;color:var(--label-secondary);font-weight:600;margin-top:2px;}
  .am-hero .amh-tags{display:flex;align-items:center;gap:6px;margin-top:9px;flex-wrap:wrap;}
  .am-hero .amh-last{font-size:11px;color:var(--label-tertiary);font-weight:700;}
`);

function amDomsFor(a){
  return DASH_DOMS.map(d=>{ const ser=amDomSeries(a.id,d.key);
    return {...d, cur:a.welfare[d.key], prev:ser[ser.length-2]}; });
}
function amAnimalTrend(a){            // 6-month assessment-count trend for this animal
  const seed=Math.abs(hashStr(a.id)); const vals=[], prev=[];
  for(let i=0;i<6;i++){ vals.push(3+((seed+i*5)%6)); prev.push(2+((seed+i*7)%5)); }
  return {labels:['Jan','Feb','Mar','Apr','May','Jun'], values:vals, prev};
}

SCREENS.amAnimal = (params={}) => {
  const a = getAnimal(params.animalId);
  const tab = STATE.amTab || 'overview';
  const idx = welfareIndex(a.welfare), doms = amDomsFor(a), recs = amRecords({animalId:a.id});
  const hero = `<div class="d2-top" style="padding-top:54px">
      <span class="am-back" onclick="back()">${I.back}</span>
      <div style="margin-left:auto;display:flex;gap:8px">
        <span class="d2-menu" title="Assessment Stats" onclick="go('amStats',{animalId:'${a.id}'})">${I.stats}</span>
        <span class="d2-menu" onclick="openNavMenu()">${I.grid}</span></div></div>
    <div class="am-hero">${imgBox(a.sp,64,16)}
      <div class="amh-id"><div class="amh-n">${a.name}</div>
        <div class="amh-s">${a.species} · ${a.sex} · ${a.encl}</div>
        <div class="amh-tags">${scorePill(idx)}${riskPill(a)}<span class="amh-last">Last ${a.seen}d ago</span></div></div></div>`;
  const tabs = amTabs([{key:'overview',label:'Overview'},{key:'assessments',label:'Assessments'},{key:'analytics',label:'Analytics'},{key:'history',label:'History'}], tab, 'amTab');

  let body='';
  if(tab==='overview'){
    const domRows = doms.map(d=>{const tp=Math.round((d.cur-d.prev)/d.prev*1000)/10,up=tp>=0;return `
      <div class="drow" style="cursor:pointer" onclick="go('amDomainHistory',{animalId:'${a.id}',domain:'${d.key}'})">
        <span class="di" style="background:${d.color}1f;color:${d.color}">${CATS[d.key].icon}</span>
        <div class="dn-n">${d.name}<div class="dn-prev">prev ${d.prev}</div></div>
        <span class="dn-cur" style="color:${d.color}">${d.cur}</span>
        <span class="dn-tr ${up?'up':'dn'}">${up?I.arrowUp:I.arrowDn}${Math.abs(tp)}%</span></div>`;}).join('');
    const last=recs[0];
    body = `
      <div class="d2card"><div class="d2card-h"><div><div class="ttl">Current Welfare</div><div class="sub">Five-domain comparison</div></div></div>${radarChart(doms)}
        <div class="d2-legend"><span class="lg"><i style="background:#37BD69"></i>Current</span><span class="lg dash"><i style="background:#B8C0BD"></i>Previous</span></div></div>
      <div class="d2card"><div class="d2card-h"><div><div class="ttl">Domain Breakdown</div><div class="sub">Tap a domain for history</div></div></div><div style="margin-top:4px">${domRows}</div></div>
      <div class="d2card"><div class="d2card-h"><div class="ttl">Assessment Summary</div></div>
        <div class="agrid" style="margin-top:8px">
          <div class="acell"><div class="a-lab">Total Assessments</div><div class="a-val">${recs.length}</div><div class="a-sub">all-time</div></div>
          <div class="acell"><div class="a-lab">Welfare Index</div><div class="a-val" style="color:${welfareColor(idx)}">${idx}<small>${welfareLabel(idx)}</small></div></div>
          <div class="acell"><div class="a-lab">Risk Status</div><div class="a-val" style="color:${amRiskOf(a).color}">${amRiskOf(a).label.split(' ')[0]}</div><div class="a-sub">${amRiskOf(a).label.split(' ')[1]||'risk'}</div></div>
          <div class="acell"><div class="a-lab">Last Assessment</div><div class="a-val" style="font-size:16px">${last?last.date:'—'}</div><div class="a-sub">${last?last.type:''}</div></div>
        </div></div>
      ${last?`<div class="d2card-h" style="margin:2px 16px 8px"><div class="ttl">Last Assessment</div></div><div class="am-list">${amAssessmentItem(last)}</div>`:''}`;
  } else if(tab==='assessments'){
    const f=STATE.dashF||'Week', maxD=amPeriodDays(f);
    const list=recs.filter(r=>r.daysAgo<=maxD);
    body = `${amFilter()}<div class="am-list">${list.length?list.map(amAssessmentItem).join(''):'<div style="padding:24px;text-align:center;color:var(--label-secondary);font-size:13px">No assessments in this period.</div>'}</div>`;
  } else if(tab==='analytics'){
    const tr=amAnimalTrend(a);
    body = `
      <div class="d2card"><div class="d2card-h"><div><div class="ttl">Assessment Trend</div><div class="sub">Records per month · vs previous</div></div></div>${trendChart(tr)}
        <div class="d2-legend"><span class="lg"><i style="background:#37BD69"></i>This period</span><span class="lg dash"><i style="background:#8479F9"></i>Previous</span></div></div>
      <div class="d2card"><div class="d2card-h"><div><div class="ttl">Welfare Trend</div><div class="sub">Index over 6 months</div></div></div>${dashSpark([idx-7,idx-5,idx-6,idx-3,idx-1,idx],'#00AFD6',{h:60})}</div>
      <div class="d2card"><div class="d2card-h"><div><div class="ttl">Domain Trends</div><div class="sub">All five domains over time</div></div></div>${multiLine()}
        <div class="d2-legend">${DASH_DOMS.map(d=>`<span class="lg"><i style="background:${d.color}"></i>${d.short}</span>`).join('')}</div></div>`;
  } else { // history
    const items=recs.map(r=>({date:r.date, title:r.type, score:r.score, color:CATS[r.domain].raw, icon:CATS[r.domain].icon, recId:r.id}));
    body = `<div class="d2card-h" style="margin:0 16px 10px"><div><div class="ttl">Assessment History</div><div class="sub">${recs.length} records · newest first</div></div></div>${timeline(items)}<div style="height:12px"></div>`;
  }

  return `<div class="screen active"><div class="scroll dash2">${hero}${tabs}${body}<div style="height:10px"></div></div></div>`;
};

/* --------------------------- Animal Domain History ------------------------ */
SCREENS.amDomainHistory = (params={}) => {
  const a=getAnimal(params.animalId), d=params.domain||'physical', c=CATS[d];
  const ser=amDomSeries(a.id,d), cur=ser[ser.length-1], first=ser[0], change=cur-first;
  const recs=amRecords({animalId:a.id,domain:d});
  const labels=['Jan','Feb','Mar','Apr','May','Jun'];
  return `<div class="screen active"><div class="scroll dash2">
    ${amHeader(c.name+' History', a.name+' · '+a.species)}
    ${amFilter()}
    <div class="d2card"><div class="d2card-h"><div><div class="ttl">${c.name} Trend</div><div class="sub">Score over time · ${change>=0?'+':''}${change} since Jan</div></div>
      <span class="spill" style="background:${welfareColor(cur)}1f;color:${welfareColor(cur)}">${cur}</span></div>
      ${trendLineAxis(ser,labels,c.raw)}</div>
    <div class="d2card"><div class="d2card-h"><div class="ttl">Change Summary</div></div>
      <div class="agrid" style="margin-top:8px">
        <div class="acell"><div class="a-lab">Current</div><div class="a-val" style="color:${welfareColor(cur)}">${cur}</div></div>
        <div class="acell"><div class="a-lab">6-mo Change</div><div class="a-val ${change>=0?'up':'dn'}">${change>=0?'+':''}${change}</div></div>
        <div class="acell"><div class="a-lab">Peak</div><div class="a-val">${Math.max(...ser)}</div></div>
        <div class="acell"><div class="a-lab">Low</div><div class="a-val">${Math.min(...ser)}</div></div>
      </div></div>
    <div class="d2card-h" style="margin:2px 16px 8px"><div class="ttl">${c.name} Records</div></div>
    <div class="am-list">${recs.length?recs.map(amAssessmentItem).join(''):'<div style="padding:22px;text-align:center;color:var(--label-secondary);font-size:13px">No '+c.name.toLowerCase()+' records.</div>'}</div>
    <div style="height:10px"></div>
  </div></div>`;
};

/* axis line chart (visible X + Y) reused by domain history */
function trendLineAxis(data, labels, color){
  const w=342,h=190,pl=28,pr=10,pt=12,pb=26, iw=w-pl-pr, ih=h-pt-pb, lo=Math.max(0,Math.min(...data)-10), hi=Math.min(100,Math.max(...data)+8), rng=(hi-lo)||1;
  const X=i=>pl+(i/(data.length-1))*iw, Y=v=>pt+(1-(v-lo)/rng)*ih;
  const pts=data.map((v,i)=>[X(i),Y(v)]);
  const line=(typeof smoothPath==='function')?smoothPath(pts):pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  let grid=''; for(let g=0;g<=3;g++){const val=lo+rng*g/3,y=pt+(1-g/3)*ih;
    grid+=`<line x1="${pl}" y1="${y.toFixed(1)}" x2="${w-pr}" y2="${y.toFixed(1)}" stroke="var(--separator)" stroke-width="1"/><text x="${pl-5}" y="${(y+3).toFixed(1)}" text-anchor="end" font-size="9" fill="var(--label-tertiary)">${Math.round(val)}</text>`;}
  let xl=''; labels.forEach((l,i)=>{xl+=`<text x="${X(i).toFixed(1)}" y="${h-8}" text-anchor="middle" font-size="9.5" fill="var(--label-secondary)" font-weight="600">${l}</text>`;});
  let dots=''; pts.forEach((p,i)=>{dots+=`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4" fill="#fff" stroke="${color}" stroke-width="2.4" style="cursor:pointer" onmousemove="dashTip(event,'${labels[i]}','${data[i]}','')" onmouseleave="dashTipHide()"/>`;});
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block">${grid}
    <path d="${line}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>${dots}${xl}</svg>`;
}
