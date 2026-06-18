/* ===========================================================================
   ANIMAL ASSESSMENT INTELLIGENCE SYSTEM (loads LAST, overrides SCREENS.amAnimal).
   Insights → Changes → Context → Analytics → Raw Data.
   Analytics keyed to RESPONSE TYPE (Numeric Value · Numeric Scale · List · Text),
   never to templates. Global Week/Month/Year/Custom filter drives every section.
   Reuses the dashboard kit + the flow design language (37-am-flow css).
   =========================================================================== */
injectCSS('css-am-system', `
  .s2-sec{font-size:13px;font-weight:800;color:#16323a;letter-spacing:.2px;margin:20px 16px 11px;text-transform:uppercase;}
  .s2-card{background:#fff;border-radius:18px;box-shadow:var(--shadow);margin:0 16px 14px;padding:18px;}
  .s2-h{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:4px;}
  .s2-h .t{font-size:18px;font-weight:800;color:#16323a;letter-spacing:-.2px;}
  .s2-h .s{font-size:12.5px;color:var(--label-secondary);font-weight:600;margin-top:2px;}
  .s2-badge{font-size:12px;font-weight:700;color:var(--label-secondary);background:var(--fill-tert);padding:5px 11px;border-radius:9px;white-space:nowrap;}
  /* compact snapshot dashboard */
  .s2-snap{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:var(--separator);border-radius:16px;overflow:hidden;margin:0 16px 14px;box-shadow:var(--shadow);}
  .s2-snap .c{background:#fff;padding:14px 13px;}
  .s2-snap .v{font-size:19px;font-weight:800;color:#16323a;letter-spacing:-.4px;line-height:1.1;}
  .s2-snap .v.sm{font-size:14px;}
  .s2-snap .l{font-size:11px;color:var(--label-secondary);font-weight:600;margin-top:4px;}
  /* progress story */
  .s2-story{background:linear-gradient(140deg,#0f2f29,#16433b);border-radius:20px;box-shadow:var(--shadow);margin:0 16px 14px;padding:20px;color:#fff;}
  .s2-story .sh{display:flex;align-items:center;justify-content:space-between;}
  .s2-story .sh .st{font-size:19px;font-weight:800;letter-spacing:-.3px;}
  .s2-story .sh .sp{font-size:12px;font-weight:700;background:rgba(255,255,255,.15);padding:5px 11px;border-radius:9px;}
  .s2-prow{display:flex;align-items:center;gap:12px;padding:11px 0;border-top:1px solid rgba(255,255,255,.10);}
  .s2-prow:first-of-type{border-top:0;margin-top:6px;}
  .s2-pic{width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;flex:0 0 auto;}
  .s2-ptx{flex:1;font-size:14.5px;font-weight:600;color:rgba(255,255,255,.95);}
  .s2-ptx b{font-weight:800;color:#fff;}
  .s2-pfoot{margin-top:12px;font-size:12.5px;font-weight:700;color:#7df0b6;}
  /* quick insights grid */
  .s2-qi{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin:0 16px 14px;}
  .s2-qic{background:#fff;border-radius:15px;box-shadow:var(--shadow);padding:14px;}
  .s2-qic .qil{font-size:11.5px;color:var(--label-secondary);font-weight:600;display:flex;align-items:center;gap:6px;}
  .s2-qic .qiv{font-size:16px;font-weight:800;color:#16323a;margin-top:6px;letter-spacing:-.2px;}
  /* health metric row */
  .hm{padding:15px 0;border-top:1px solid var(--separator);}
  .hm:first-child{border-top:0;}
  .hm-top{display:flex;align-items:flex-start;gap:10px;}
  .hm-ic{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex:0 0 auto;}
  .hm-n{flex:1;font-size:15px;font-weight:700;color:#16323a;}
  .hm-n .hm-sub{font-size:11.5px;color:var(--label-tertiary);font-weight:600;margin-top:2px;}
  .hm-cur{font-size:22px;font-weight:800;color:#16323a;letter-spacing:-.4px;text-align:right;}
  .hm-cur small{font-size:12px;font-weight:700;color:var(--label-secondary);}
  .hm-chg{font-size:12px;font-weight:800;margin-top:2px;text-align:right;}
  /* scale journey */
  .sj{padding:15px 0;border-top:1px solid var(--separator);}
  .sj:first-child{border-top:0;}
  .sj-top{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
  .sj-n{flex:1;font-size:15px;font-weight:700;color:#16323a;}
  .sj-cur{font-size:17px;font-weight:800;}
  .sj-imp{font-size:11.5px;font-weight:800;}
  .sj-track{position:relative;height:34px;}
  .sj-line{position:absolute;left:0;right:0;top:15px;height:4px;border-radius:3px;background:var(--fill-tert);}
  .sj-zone{position:absolute;top:11px;height:12px;border-radius:6px;background:rgba(55,189,105,.18);border:1px solid rgba(55,189,105,.5);}
  .sj-dot{position:absolute;top:9px;width:16px;height:16px;border-radius:50%;background:#fff;border:3px solid #C8D2CE;transform:translateX(-50%);}
  .sj-dot.cur{width:22px;height:22px;top:6px;border-width:4px;box-shadow:0 2px 8px rgba(0,0,0,.18);}
  .sj-scale{display:flex;justify-content:space-between;font-size:10.5px;color:var(--label-tertiary);font-weight:700;margin-top:4px;}
  /* list progression */
  .lj{padding:15px 0;border-top:1px solid var(--separator);}
  .lj:first-child{border-top:0;}
  .lj-top{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
  .lj-n{flex:1;font-size:15px;font-weight:700;color:#16323a;}
  .lj-steps{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
  .lj-step{font-size:12.5px;font-weight:700;padding:7px 12px;border-radius:10px;background:var(--fill-tert);color:var(--label-secondary);}
  .lj-step.cur{color:#fff;}
  .lj-arr{color:var(--label-tertiary);font-weight:800;}
  .lj-meta{font-size:11.5px;color:var(--label-tertiary);font-weight:600;margin-top:10px;}
  /* observation highlights */
  .oh-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;}
  .oh-chip{font-size:13px;font-weight:700;padding:8px 14px;border-radius:11px;background:#E7F3EC;color:#1f8f4e;display:flex;align-items:center;gap:6px;}
  .kw-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px;}
  .kw-chip{font-size:12px;font-weight:700;color:var(--label-secondary);background:var(--fill-tert);padding:6px 11px;border-radius:9px;}
  .note{padding:11px 0;border-top:1px solid var(--separator);}
  .note .nm{font-size:11px;color:var(--label-tertiary);font-weight:700;margin-bottom:3px;}
  .note .nq{font-size:13.5px;line-height:1.5;color:#274038;font-weight:500;}
  /* latest assessments */
  .la{display:flex;align-items:center;gap:12px;padding:13px 0;border-top:1px solid var(--separator);cursor:pointer;}
  .la:first-child{border-top:0;}
  .la-ic{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:19px;flex:0 0 auto;}
  .la-b{flex:1;min-width:0;}
  .la-t{font-size:14.5px;font-weight:700;color:#16323a;}
  .la-m{font-size:11.5px;color:var(--label-secondary);font-weight:600;margin-top:2px;}
  .la-st{font-size:11px;font-weight:700;padding:3px 9px;border-radius:8px;flex:0 0 auto;}
  .viewall{display:flex;align-items:center;justify-content:center;gap:6px;font-size:13px;font-weight:800;color:#1f8f4e;padding:14px 0 2px;cursor:pointer;}
  /* observation timeline */
  .otl{position:relative;padding-left:24px;margin:0 16px 14px;}
  .otl::before{content:"";position:absolute;left:6px;top:8px;bottom:8px;width:2px;background:var(--separator);}
  .otl-i{position:relative;padding:0 0 16px;}
  .otl-d{position:absolute;left:-24px;top:4px;width:13px;height:13px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 1.5px var(--separator);}
  .otl-meta{font-size:11.5px;color:var(--label-secondary);font-weight:700;}
  .otl-card{background:#fff;border-radius:13px;box-shadow:var(--shadow);padding:12px 13px;margin-top:5px;}
  .otl-q{font-size:13.5px;line-height:1.5;color:#274038;font-weight:500;}
  /* comparison detail */
  .cmp2{margin:0 16px 14px;background:#fff;border-radius:18px;box-shadow:var(--shadow);padding:6px 18px;}
  .cmp2-r{padding:14px 0;border-top:1px solid var(--separator);}
  .cmp2-r:first-child{border-top:0;}
  .cmp2-h{display:flex;align-items:center;gap:9px;margin-bottom:9px;}
  .cmp2-n{flex:1;font-size:15px;font-weight:700;color:#16323a;}
  .cmp2-vals{display:flex;align-items:center;gap:12px;}
  .cmp2-a{font-size:18px;font-weight:700;color:var(--label-tertiary);}
  .cmp2-b{font-size:20px;font-weight:800;color:#16323a;}
  .cmp2-d{margin-left:auto;font-size:13px;font-weight:800;padding:6px 12px;border-radius:10px;}
  .cmp2-text{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px;}
  .cmp2-tt{background:var(--fill-tert);border-radius:12px;padding:12px;}
  .cmp2-tl{font-size:10.5px;color:var(--label-tertiary);font-weight:800;text-transform:uppercase;letter-spacing:.3px;margin-bottom:5px;}
  .cmp2-tq{font-size:12.5px;line-height:1.5;color:#274038;font-weight:500;}
  .cmp2-tq .hl{background:#CFF0DC;border-radius:4px;padding:0 3px;font-weight:700;color:#15663b;}
`);

/* =============================== DATA ===================================== */
const AM2_PERIODS={Week:'Last 7 Days',Month:'Last 30 Days',Year:'Last 12 Months',Custom:'Selected Range'};
const AM2_SNAP={
  Week:{total:34,last:'Today, 10:45 AM',types:6,obs:14,used:'Nutrition',recent:'Medical Observation',done:6},
  Month:{total:142,last:'Today, 10:45 AM',types:8,obs:53,used:'Nutrition',recent:'Medical Observation',done:24},
  Year:{total:1680,last:'Today, 10:45 AM',types:9,obs:642,used:'Nutrition',recent:'Medical Observation',done:312},
};
AM2_SNAP.Custom={...AM2_SNAP.Month,total:96,obs:38,done:17};
const AM2_ACT={
  Week:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],cur:[3,5,2,6,4,7,5],prev:[2,4,3,5,3,5,4],
    parts:[ [['Nutrition Assessment',2,'#37BD69'],['Weight Check',1,'#FA6140']],
            [['Nutrition Assessment',2,'#37BD69'],['Behaviour Assessment',2,'#8479F9'],['Medical Observation',1,'#00AFD6']],
            [['Medical Observation',2,'#00AFD6']],
            [['Nutrition Assessment',2,'#37BD69'],['Medical Observation',3,'#00AFD6'],['Behaviour Assessment',1,'#8479F9']],
            [['Weight Check',2,'#FA6140'],['Nutrition Assessment',2,'#37BD69']],
            [['Nutrition Assessment',3,'#37BD69'],['Behaviour Assessment',2,'#8479F9'],['Medical Observation',2,'#00AFD6']],
            [['Medical Observation',3,'#00AFD6'],['Nutrition Assessment',2,'#37BD69']] ]},
  Month:{labels:['Week 1','Week 2','Week 3','Week 4','Week 5'],cur:[28,34,26,38,16],prev:[24,30,22,32,14],parts:null},
  Year:{labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],cur:[120,140,110,160,130,150,140,170,150,160,180,70],prev:[100,120,100,140,120,135,130,150,140,150,160,60],parts:null},
};
AM2_ACT.Custom=AM2_ACT.Month;
const AM2 = {
  numeric:[
    {key:'weight',label:'Weight',emoji:'⚖️',domain:'physical',unit:'kg',cur:24,prev:22,target:[22,25],series:[21,21.5,22,22,23,24]},
    {key:'temp',label:'Temperature',emoji:'🌡️',domain:'physical',unit:'°C',cur:38.5,prev:38.5,target:[38,39],series:[38.6,38.5,38.6,38.4,38.5,38.5]},
    {key:'food',label:'Food Intake',emoji:'🍽️',domain:'nutrition',unit:'kg',cur:7.0,prev:7.4,target:[6.5,8.5],series:[7.4,7.5,7.3,7.2,7.1,7.0]},
    {key:'water',label:'Water Intake',emoji:'💧',domain:'nutrition',unit:'L',cur:9.2,prev:9.0,target:[8,11],series:[8.8,9.0,9.1,8.9,9.0,9.2]},
  ],
  scale:[
    {key:'bcs',label:'Body Condition',emoji:'📏',domain:'physical',scale:9,cur:4,prev:3,target:[4,5],series:[3,3,3,3,4,4]},
    {key:'activity',label:'Activity Level',emoji:'🐾',domain:'behaviour',scale:10,cur:8,prev:6,target:[7,10],series:[6,6,7,7,8,8]},
    {key:'mobility',label:'Mobility',emoji:'🦿',domain:'physical',scale:5,cur:4,prev:4,target:[4,5],series:[4,4,4,4,4,4]},
  ],
  list:[
    {key:'appetite',label:'Appetite',emoji:'🍽️',domain:'nutrition',opts:['Poor','Reduced','Normal','Good','Excellent'],journey:['Good','Good','Good','Excellent'],cur:'Excellent',prev:'Good'},
    {key:'stress',label:'Stress Indicators',emoji:'🧠',domain:'mental',opts:['None','Mild','Elevated'],journey:['Mild','Mild','None','None'],cur:'None',prev:'Mild'},
  ],
  text:{highlights:['Active','Eating Well','Social','Playful','Alert'],keywords:['enrichment','appetite','social','browse','alert','grooming'],
    notes:[
      {by:'Dr. R. Mehta',when:'Today · 10:45 AM',q:'Bright and active this morning, strong engagement with enrichment. Coat condition good.'},
      {by:'J. Alvarez',when:'5 Jun · 3:20 PM',q:'Appetite noticeably improved — finished full ration. Social with enclosure-mates.'},
      {by:'S. Park',when:'22 May · 9:15 AM',q:'Used full height of climbing structure during session; very playful.'},
    ]},
  latest:[
    {t:'Medical Observation',emoji:'🩺',domain:'physical',date:'19 Jun 2025',time:'10:45 AM',by:'Dr. R. Mehta',status:'Completed'},
    {t:'Nutrition Assessment',emoji:'🍽️',domain:'nutrition',date:'5 Jun 2025',time:'3:20 PM',by:'Dr. L. Owens',status:'Completed'},
    {t:'Behaviour Assessment',emoji:'🐾',domain:'behaviour',date:'22 May 2025',time:'9:15 AM',by:'S. Park',status:'Completed'},
    {t:'Weight Check',emoji:'⚖️',domain:'physical',date:'8 May 2025',time:'11:30 AM',by:'J. Alvarez',status:'Completed'},
  ],
  history:[
    {t:'Medical Observation',emoji:'🩺',cat:'Medical',domain:'physical',date:'19 Jun 2025',time:'10:45 AM',by:'Dr. R. Mehta',status:'Completed'},
    {t:'Nutrition Assessment',emoji:'🍽️',cat:'Nutrition',domain:'nutrition',date:'5 Jun 2025',time:'3:20 PM',by:'Dr. L. Owens',status:'Completed'},
    {t:'Behaviour Assessment',emoji:'🐾',cat:'Behaviour',domain:'behaviour',date:'22 May 2025',time:'9:15 AM',by:'S. Park',status:'Completed'},
    {t:'Weight Check',emoji:'⚖️',cat:'Weight',domain:'physical',date:'8 May 2025',time:'11:30 AM',by:'J. Alvarez',status:'Completed'},
    {t:'Keeper Observation',emoji:'📝',cat:'Observation',domain:'behaviour',date:'2 May 2025',time:'8:50 AM',by:'S. Park',status:'Completed'},
    {t:'Body Condition Score',emoji:'📏',cat:'Medical',domain:'physical',date:'24 Apr 2025',time:'2:40 PM',by:'Dr. R. Mehta',status:'Approved'},
  ],
};
const DOMC={physical:'#FA6140',behaviour:'#8479F9',nutrition:'#37BD69',environment:'#00D6C9',mental:'#00AFD6'};
const STAT={Completed:['#E3F5EB','#2E9E5B'],Approved:['#DCF5F2','#0A9E92']};
function am2Story(){
  return [
    {dir:'up',t:'Weight increased by <b>2kg</b> (22 → 24kg)'},
    {dir:'up',t:'Appetite improved from <b>Good</b> to <b>Excellent</b>'},
    {dir:'up',t:'Activity level improved from <b>6</b> to <b>8</b>'},
    {dir:'up',t:'Body condition improved from <b>3</b> to <b>4</b>'},
    {dir:'flat',t:'Temperature remains <b>stable</b> at 38.5°C'},
    {dir:'down',t:'Food intake down <b>5%</b> — monitor next cycle'},
  ];
}
function am2Quick(){return [
  {ic:'🏆',l:'Most Used Assessment',v:'Nutrition'},
  {ic:'🧑‍⚕️',l:'Most Frequent Assessor',v:'Dr. Mehta'},
  {ic:'📅',l:'Most Active Month',v:'June'},
  {ic:'💬',l:'Most Common Response',v:'Good'},
  {ic:'📂',l:'Most Updated Category',v:'Behaviour'},
  {ic:'🩺',l:'Most Recorded',v:'Medical Obs.'},
];}

/* ============================ VISUALIZATIONS ============================== */
function am2Trend(series,target,color){ // line + target band + highlighted current
  const W=322,H=120,pl=8,pr=42,pt=12,pb=12,iw=W-pl-pr,ih=H-pt-pb;
  const lo=Math.min(...series,target[0])-1,hi=Math.max(...series,target[1])+1,rng=(hi-lo)||1;
  const X=i=>pl+(i/(series.length-1))*iw,Y=v=>pt+(1-(v-lo)/rng)*ih;
  const by=Y(target[1]),by2=Y(target[0]);
  const pts=series.map((v,i)=>[X(i),Y(v)]);
  const ln=(typeof smoothPath==='function')?smoothPath(pts):pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const last=pts[pts.length-1];
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;margin-top:6px">
    <rect x="${pl}" y="${by.toFixed(1)}" width="${iw}" height="${(by2-by).toFixed(1)}" fill="rgba(55,189,105,.12)"/>
    <line x1="${pl}" y1="${by.toFixed(1)}" x2="${pl+iw}" y2="${by.toFixed(1)}" stroke="rgba(55,189,105,.5)" stroke-width="1" stroke-dasharray="4 4"/>
    <line x1="${pl}" y1="${by2.toFixed(1)}" x2="${pl+iw}" y2="${by2.toFixed(1)}" stroke="rgba(55,189,105,.5)" stroke-width="1" stroke-dasharray="4 4"/>
    <text x="${pl+iw+6}" y="${by.toFixed(1)}" font-size="9" fill="#37BD69" font-weight="700" dominant-baseline="middle">${target[1]}</text>
    <text x="${pl+iw+6}" y="${by2.toFixed(1)}" font-size="9" fill="#37BD69" font-weight="700" dominant-baseline="middle">${target[0]}</text>
    <path d="${ln}" fill="none" stroke="${color}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    ${pts.slice(0,-1).map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="#fff" stroke="${color}" stroke-width="2"/>`).join('')}
    <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="6" fill="${color}" stroke="#fff" stroke-width="2.5"/></svg>`;
}
function am2ScaleTrack(f){
  const inZone=f.cur>=f.target[0]&&f.cur<=f.target[1];const col=inZone?'#37BD69':'#E4B819';
  const pct=v=>((v-1)/(f.scale-1))*100;
  const dots=f.series.map((v,i)=>{const cur=i===f.series.length-1;return `<span class="sj-dot ${cur?'cur':''}" style="left:${pct(v)}%;${cur?'border-color:'+col:''}"></span>`;}).join('');
  return `<div class="sj-track"><div class="sj-line"></div>
    <div class="sj-zone" style="left:${pct(f.target[0])}%;width:${pct(f.target[1])-pct(f.target[0])}%"></div>${dots}</div>
    <div class="sj-scale"><span>1</span><span style="color:#37BD69">target ${f.target[0]}–${f.target[1]}</span><span>${f.scale}</span></div>`;
}

/* ============================ SHARED HEADER ============================== */
function am2Header(a,tab){
  const per=STATE.flPeriod||'Week';
  const tabs=['Overview','Comparison','History'];
  return `<div class="fl-chero"><span class="fl-back" onclick="back()">${I.back}</span>
      <span class="fc-av">🐒<img src="${(typeof FLOW!=='undefined'&&FLOW.photo)||''}" loading="lazy" onerror="this.remove()"/></span>
      <div><div class="fc-n">${a.name}</div><div class="fc-s"><span class="fc-spi">🐵</span> ${a.species||'Macaque'} · Primates</div></div></div>
    <div class="fl-atabs">${tabs.map(t=>`<div class="fl-atab ${t.toLowerCase()===tab?'on':''}" onclick="setFilter('amTab','${t.toLowerCase()}')">${t}</div>`).join('')}</div>
    <div class="fl-per">${['Week','Month','Year','Custom'].map(p=>`<button class="${p===per?'on':''}" onclick="setFilter('flPeriod','${p}')">${p}</button>`).join('')}</div>`;
}

/* =============================== SECTIONS ================================ */
function am2Snapshot(){ const s=AM2_SNAP[STATE.flPeriod||'Week'];
  return `<div class="s2-snap">
    <div class="c"><div class="v">${s.total}</div><div class="l">Total Records</div></div>
    <div class="c"><div class="v sm">${s.last}</div><div class="l">Last Recorded</div></div>
    <div class="c"><div class="v">${s.types}</div><div class="l">Assessment Types</div></div>
    <div class="c"><div class="v">${s.obs}</div><div class="l">Observation Entries</div></div>
    <div class="c"><div class="v sm">${s.used}</div><div class="l">Most Used</div></div>
    <div class="c"><div class="v sm">${s.recent}</div><div class="l">Most Recent</div></div></div>`;
}
function am2ProgressStory(){ const s=AM2_SNAP[STATE.flPeriod||'Week'];
  const C={up:['#7df0b6','rgba(55,189,105,.22)','↑'],down:['#ffb38e','rgba(250,97,64,.22)','↓'],flat:['#cfe9e2','rgba(255,255,255,.14)','→']};
  return `<div class="s2-story"><div class="sh"><div class="st">Animal Progress</div><div class="sp">${AM2_PERIODS[STATE.flPeriod||'Week']}</div></div>
    ${am2Story().map(r=>{const c=C[r.dir];return `<div class="s2-prow"><span class="s2-pic" style="background:${c[1]};color:${c[0]}">${c[2]}</span><span class="s2-ptx">${r.t}</span></div>`;}).join('')}
    <div class="s2-pfoot">✓ ${s.done} assessments completed ${AM2_PERIODS[STATE.flPeriod||'Week'].toLowerCase()}</div></div>`;
}
function am2Activity(){ const A=AM2_ACT[STATE.flPeriod||'Week']; const n=A.labels.length;
  window.__am2act=A;
  const W=322,H=210,pl=24,pr=8,pt=14,pb=30,iw=W-pl-pr,ih=H-pt-pb,max=Math.max(...A.cur,...A.prev)+2;
  const X=i=>pl+(i+0.5)*(iw/n),Y=v=>pt+(1-v/max)*ih,bw=Math.min(26,iw/n*0.5);
  let g='';for(let k=0;k<=4;k++){const val=Math.round(max*k/4),y=pt+(1-k/4)*ih;g+=`<line x1="${pl}" y1="${y.toFixed(1)}" x2="${W-pr}" y2="${y.toFixed(1)}" stroke="#E2E8E5" stroke-width="1"/><text x="${pl-6}" y="${(y+3).toFixed(1)}" text-anchor="end" font-size="9" fill="#9AA6A2">${val}</text>`;}
  let bars='';A.cur.forEach((v,i)=>{const x=X(i),y=Y(v),h=pt+ih-y;bars+=`<rect x="${(x-bw/2).toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(2,h).toFixed(1)}" rx="5" fill="#5BC47E" style="cursor:pointer" onclick="am2Tip(event,${i})"/>`;});
  let xl='';A.labels.forEach((l,i)=>{xl+=`<text x="${X(i).toFixed(1)}" y="${H-9}" text-anchor="middle" font-size="${n>7?8.5:10.5}" fill="#7A8684" font-weight="600">${l}</text>`;});
  const pts=A.prev.map((v,i)=>[X(i),Y(v)]);const ln=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const dots=pts.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="#8479F9"/>`).join('');
  return `<div class="s2-card"><div class="s2-h"><div><div class="t">Assessment Activity</div><div class="s">Records per ${({Week:'day',Month:'week',Year:'month',Custom:'week'})[STATE.flPeriod||'Week']} · tap a bar</div></div></div>
    <svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block">${g}${bars}<path d="${ln}" fill="none" stroke="#8479F9" stroke-width="2.2" stroke-dasharray="6 5" stroke-linecap="round"/>${dots}${xl}</svg>
    <div class="fl-leg"><span class="lg"><i style="background:#5BC47E"></i>Current period</span><span class="lg dash"><i></i>Previous period</span></div></div>`;
}
function am2Tip(e,i){ const A=window.__am2act||AM2_ACT.Week; const d=A.parts?A.parts[i]:null; const tot=A.cur[i];
  let t=document.getElementById('amacttip'); if(!t){t=document.createElement('div');t.id='amacttip';document.body.appendChild(t);}
  const rows=d?d.map(p=>`<div class="at-r"><span><i style="background:${p[2]}"></i>${p[0]}</span><b>${p[1]}</b></div>`).join(''):'';
  t.innerHTML=`<div class="at-d">${A.labels[i]}</div><div class="at-t">${tot} Records</div>${rows}<div class="at-link" onclick="(function(){var x=document.getElementById('amacttip');if(x)x.style.display='none';setFilter('amTab','history');})()">View Details →</div>`;
  t.style.display='block'; t.style.left=e.clientX+'px'; t.style.top=(e.clientY-12)+'px'; e.stopPropagation();
}
document.addEventListener('click',function(ev){const t=document.getElementById('amacttip');if(t&&t.style.display==='block'&&!ev.target.closest('#amacttip')&&ev.target.tagName!=='rect')t.style.display='none';});
function am2Quickins(){ return `<div class="s2-qi">${am2Quick().map(q=>`<div class="s2-qic"><div class="qil">${q.ic} ${q.l}</div><div class="qiv">${q.v}</div></div>`).join('')}</div>`; }
function am2Health(){ return `<div class="s2-card"><div class="s2-h"><div><div class="t">Health Metrics</div><div class="s">Numeric values · current vs target range</div></div><span class="s2-badge">Numeric</span></div>
  ${AM2.numeric.map(f=>{const d=+(f.cur-f.prev).toFixed(1),up=d>=0,flat=Math.abs(d)<0.05;const col=DOMC[f.domain];const inT=f.cur>=f.target[0]&&f.cur<=f.target[1];
    return `<div class="hm tap" onclick="am2NumSheet('${f.key}','Week')"><div class="hm-top"><span class="hm-ic" style="background:${col}1f">${f.emoji}</span>
      <div class="hm-n">${f.label}<div class="hm-sub">Target ${f.target[0]}–${f.target[1]} ${f.unit} · ${inT?'<span style="color:#2E9E5B">within range</span>':'<span style="color:#E4B819">watch</span>'}</div></div>
      <div><div class="hm-cur">${f.cur}<small> ${f.unit}</small></div><div class="hm-chg" style="color:${flat?'#8E9AA0':up?'#2E9E5B':'#E0492B'}">${flat?'→ stable':(up?'↑ +':'↓ ')+(up?d:Math.abs(d))+' '+f.unit}</div></div></div>
      ${am2Trend(f.series,f.target,col)}</div>`;}).join('')}</div>`;
}
function am2Scale(){ return `<div class="s2-card"><div class="s2-h"><div><div class="t">Condition Scales</div><div class="s">Progress toward target zone</div></div><span class="s2-badge">Numeric Scale</span></div>
  ${AM2.scale.map(f=>{const d=f.cur-f.prev,flat=d===0;const col=DOMC[f.domain];
    return `<div class="sj tap" onclick="am2ScaleSheet('${f.key}','Week')"><div class="sj-top"><span class="hm-ic" style="background:${col}1f;width:30px;height:30px">${f.emoji}</span>
      <span class="sj-n">${f.label}</span><span class="sj-cur" style="color:${col}">${f.cur}/${f.scale}</span>
      <span class="sj-imp" style="color:${flat?'#8E9AA0':d>0?'#2E9E5B':'#E0492B'}">${flat?'→ stable':(d>0?'↑ +'+d:'↓ '+d)}</span></div>
      ${am2ScaleTrack(f)}</div>`;}).join('')}</div>`;
}
function am2List(){ return `<div class="s2-card"><div class="s2-h"><div><div class="t">Categorical Responses</div><div class="s">Direction of change over time</div></div><span class="s2-badge">List</span></div>
  ${AM2.list.map(f=>{const better=f.opts.indexOf(f.cur)>=f.opts.indexOf(f.prev);
    return `<div class="lj tap" onclick="am2ListSheet('${f.key}','Week')"><div class="lj-top"><span class="hm-ic" style="background:${DOMC[f.domain]}1f;width:30px;height:30px">${f.emoji}</span><span class="lj-n">${f.label}</span>
      <span class="sj-imp" style="color:${better?'#2E9E5B':'#E0492B'}">${better?'↑ improving':'↓ declining'}</span></div>
      <div class="lj-steps">${f.journey.map((s,i)=>{const cur=i===f.journey.length-1;const c=cur?DOMC[f.domain]:'';return (i?'<span class="lj-arr">→</span>':'')+`<span class="lj-step ${cur?'cur':''}" style="${cur?'background:'+c:''}">${s}</span>`;}).join('')}</div>
      <div class="lj-meta">Current <b style="color:#16323a">${f.cur}</b> · most frequent <b style="color:#16323a">Good</b></div></div>`;}).join('')}</div>`;
}
function am2Text(){ const t=AM2.text;
  return `<div class="s2-card"><div class="s2-h"><div><div class="t">Observation Insights</div><div class="s">From keeper & medical notes</div></div><span class="s2-badge">Text</span></div>
    <div style="font-size:12px;font-weight:800;color:var(--label-tertiary);text-transform:uppercase;letter-spacing:.3px;margin:6px 0 2px">Observation Highlights</div>
    <div class="oh-chips">${t.highlights.map(h=>`<span class="oh-chip">✦ ${h}</span>`).join('')}</div>
    <div style="font-size:12px;font-weight:800;color:var(--label-tertiary);text-transform:uppercase;letter-spacing:.3px;margin:16px 0 2px">Common Keywords</div>
    <div class="kw-chips">${t.keywords.map(k=>`<span class="kw-chip">${k}</span>`).join('')}</div>
    <div style="font-size:12px;font-weight:800;color:var(--label-tertiary);text-transform:uppercase;letter-spacing:.3px;margin:16px 0 0">Recent Notes</div>
    ${t.notes.slice(0,2).map(n=>`<div class="note"><div class="nm">${n.by} · ${n.when}</div><div class="nq">"${n.q}"</div></div>`).join('')}
    <div class="viewall" onclick="am2TextSheet('Week')">View All Observations →</div></div>`;
}
function am2Latest(){ return `<div class="s2-card" style="padding-top:14px"><div class="s2-h"><div class="t">Latest Assessments</div></div>
  ${AM2.latest.map(r=>{const st=STAT[r.status];return `<div class="la"><span class="la-ic" style="background:${DOMC[r.domain]}1f">${r.emoji}</span>
    <div class="la-b"><div class="la-t">${r.t}</div><div class="la-m">${r.date} · ${r.time} · ${r.by}</div></div>
    <span class="la-st" style="background:${st[0]};color:${st[1]}">${r.status}</span></div>`;}).join('')}
  <div class="viewall" onclick="setFilter('amTab','history')">View All →</div></div>`;
}
function am2Timeline(){ return `${AM2.text.notes.map(n=>`<div class="otl-i"><span class="otl-d" style="background:#37BD69"></span>
    <div class="otl-meta">${n.when} · ${n.by}</div><div class="otl-card"><div class="otl-q">"${n.q}"</div></div></div>`).join('')}`;
}

/* =============================== COMPARISON ============================== */
function am2Comparison(a){ const mode=STATE.amCmpMode||'prev';
  const seg=`<div class="fl-cseg"><button class="${mode==='prev'?'on':''}" onclick="setFilter('amCmpMode','prev')">Current vs Previous</button><button class="${mode==='custom'?'on':''}" onclick="setFilter('amCmpMode','custom')">Custom</button></div>`;
  const picker=mode==='custom'
    ? `<div class="cmp-pick"><div class="cmp-sel"><div class="cs-l">Assessment A</div><div class="cs-v">5 Jun 2025</div></div><span class="cmp-vs">vs</span><div class="cmp-sel"><div class="cs-l">Assessment B</div><div class="cs-v">19 Jun 2025</div></div></div>`
    : `<div class="fl-cwhen">Current · 19 Jun 2025 <span class="mut">vs</span> Previous · 5 Jun 2025</div>`;
  const ai=`<div class="fl-ai"><div class="fl-ai-h">✦ AI Comparison Summary</div><div class="fl-ai-b">Compared with the previous assessment:<ul>
    <li>Weight increased from <b>22kg to 24kg</b>.</li><li>Appetite improved from <b>Good to Excellent</b>.</li><li>Body condition increased from <b>3 to 4</b>.</li>
    <li>Activity level increased from <b>6 to 8</b>.</li><li>Temperature remains <b>stable</b>.</li><li>Observation notes indicate <b>improved activity levels</b>.</li></ul></div></div>`;
  const hi=[['up','⚖️','Weight','+2kg'],['up','🍽️','Appetite','Improved'],['up','🐾','Activity','+2'],['flat','🌡️','Temperature','Stable'],['down','🍖','Food Intake','-5%']];
  const chl=`<div class="s2-card" style="padding:6px 18px"><div class="s2-h" style="padding-top:12px"><div class="t">Change Highlights</div></div>
    ${hi.map(([d,e,n,v])=>{const c=d==='up'?'#2E9E5B':d==='down'?'#E0492B':'#8E9AA0',bg=d==='up'?'#E3F5EB':d==='down'?'#FDE7E1':'#EEF1F0';
      return `<div class="la" style="border-top:1px solid var(--separator)"><span class="la-ic" style="background:${bg};font-size:16px">${e}</span><div class="la-b"><div class="la-t">${n}</div></div><span class="la-st" style="background:${bg};color:${c};font-size:13px">${d==='up'?'↑':d==='down'?'↓':'→'} ${v}</span></div>`;}).join('')}</div>`;
  // detailed comparison (all response types)
  const det=`<div class="s2-sec">Detailed Comparison</div><div class="cmp2">
    ${AM2.numeric.slice(0,2).map(f=>{const d=+(f.cur-f.prev).toFixed(1),up=d>=0,flat=Math.abs(d)<0.05;const c=flat?'#8E9AA0':up?'#2E9E5B':'#E0492B';
      return `<div class="cmp2-r"><div class="cmp2-h"><span class="hm-ic" style="background:${DOMC[f.domain]}1f;width:28px;height:28px;font-size:13px">${f.emoji}</span><span class="cmp2-n">${f.label}</span><span class="s2-badge">Numeric</span></div>
        <div class="cmp2-vals"><span class="cmp2-a">${f.prev}${f.unit}</span><span style="color:#9AA6A2">→</span><span class="cmp2-b">${f.cur}${f.unit}</span><span class="cmp2-d" style="background:${c}1f;color:${c}">${flat?'stable':(up?'+':'')+d+f.unit}</span></div></div>`;}).join('')}
    ${AM2.scale.slice(0,1).map(f=>{const d=f.cur-f.prev,c=d>0?'#2E9E5B':d<0?'#E0492B':'#8E9AA0';
      return `<div class="cmp2-r"><div class="cmp2-h"><span class="hm-ic" style="background:${DOMC[f.domain]}1f;width:28px;height:28px;font-size:13px">${f.emoji}</span><span class="cmp2-n">${f.label}</span><span class="s2-badge">Scale</span></div>
        <div class="cmp2-vals"><span class="cmp2-a">${f.prev}/${f.scale}</span><span style="color:#9AA6A2">→</span><span class="cmp2-b">${f.cur}/${f.scale}</span><span class="cmp2-d" style="background:${c}1f;color:${c}">${d>0?'+'+d:d}</span></div></div>`;}).join('')}
    ${AM2.list.slice(0,1).map(f=>{const better=f.opts.indexOf(f.cur)>f.opts.indexOf(f.prev),c=better?'#2E9E5B':'#E0492B';
      return `<div class="cmp2-r"><div class="cmp2-h"><span class="hm-ic" style="background:${DOMC[f.domain]}1f;width:28px;height:28px;font-size:13px">${f.emoji}</span><span class="cmp2-n">${f.label}</span><span class="s2-badge">List</span></div>
        <div class="cmp2-vals"><span class="cmp2-a">${f.prev}</span><span style="color:#9AA6A2">→</span><span class="cmp2-b">${f.cur}</span><span class="cmp2-d" style="background:${c}1f;color:${c}">${better?'improved':'declined'}</span></div></div>`;}).join('')}
    <div class="cmp2-r"><div class="cmp2-h"><span class="hm-ic" style="background:#8479F91f;width:28px;height:28px;font-size:13px">📝</span><span class="cmp2-n">Observation</span><span class="s2-badge">Text</span></div>
      <div class="cmp2-text"><div class="cmp2-tt"><div class="cmp2-tl">Previous · 5 Jun</div><div class="cmp2-tq">Appetite <span class="hl">improving</span>, social with enclosure-mates.</div></div>
        <div class="cmp2-tt"><div class="cmp2-tl">Current · 19 Jun</div><div class="cmp2-tq">Bright and <span class="hl">active</span>, strong <span class="hl">enrichment</span> engagement.</div></div></div></div>
  </div>`;
  return `${seg}${picker}${ai}${chl}${det}<div style="height:8px"></div>`;
}

/* =============================== HISTORY ================================= */
function am2History(){ const cat=STATE.flCat||'All';
  const cats=['All','Nutrition','Behaviour','Medical','Weight','Observation'];
  const recs=AM2.history.filter(r=>cat==='All'||r.cat===cat);
  return `<div class="fl-catchips">${cats.map(c=>`<span class="fl-catchip ${c===cat?'on':''}" onclick="setFilter('flCat','${c}')">${c}</span>`).join('')}</div>
    ${recs.map(r=>{const st=STAT[r.status];return `<div class="s2-card" style="margin-bottom:11px;padding:16px;display:flex;align-items:center;gap:13px;position:relative;overflow:hidden">
      <span style="position:absolute;left:0;top:0;bottom:0;width:4px;background:${DOMC[r.domain]}"></span>
      <span class="la-ic" style="background:${DOMC[r.domain]}1f;width:42px;height:42px;font-size:20px">${r.emoji}</span>
      <div class="la-b"><div class="la-t" style="font-size:16px;display:flex;align-items:center;gap:9px">${r.t}<span class="la-st" style="background:${st[0]};color:${st[1]}">${r.status}</span></div>
        <div class="la-m" style="margin-top:5px">${r.date} · ${r.time}<br>Recorded by · ${r.by}</div></div>
      <span style="color:#9AA6A2;font-weight:800">›</span></div>`;}).join('')}<div style="height:8px"></div>`;
}

/* =============================== SCREEN ================================== */
SCREENS.amAnimal = (params={}) => {
  const a = (typeof getAnimal==='function' && getAnimal(params.animalId)) || {name:'Assam Macaque',species:'Macaque',sp:'macaque'};
  if(!a.name) a.name='Assam Macaque';
  const tab = STATE.amTab || 'overview';
  let body='';
  if(tab==='overview'){
    body = `${am2Snapshot()}
      <div class="s2-sec">Animal Progress Story</div>${am2ProgressStory()}
      <div class="s2-sec">Assessment Activity</div>${am2Activity()}
      <div class="s2-sec">Quick Insights</div>${am2Quickins()}
      <div class="s2-sec">Response Analytics</div>${am2Health()}${am2Scale()}${am2List()}${am2Text()}
      <div class="s2-sec">Latest Assessments</div>${am2Latest()}
      <div class="s2-sec">Observation Timeline</div><div class="otl">${am2Timeline()}</div>`;
  } else if(tab==='comparison'){
    body = am2Comparison(a);
  } else {
    body = am2History();
  }
  return `<div class="screen active"><div class="scroll dash2" style="padding-bottom:26px">${am2Header(a,tab)}${body}</div></div>`;
};

/* ===================== ENHANCEMENTS: detail trend · drill-down sheets · historical comparison ===================== */
injectCSS('css-am-sys2', `
  .adx{background:#fff;border-radius:18px;box-shadow:var(--shadow);margin:14px 16px;padding:18px;}
  .adx-h{display:flex;align-items:center;justify-content:space-between;}
  .adx-t{font-size:21px;font-weight:800;color:#16323a;}
  .adx-arrow{width:36px;height:36px;border-radius:11px;background:var(--fill-tert);display:flex;align-items:center;justify-content:center;cursor:pointer;}
  .adx-arrow svg{width:9px;height:15px;color:#16323a;}
  .adx-stats{display:flex;gap:28px;margin:14px 0 2px;}
  .adx-v{font-size:24px;font-weight:800;color:#16323a;letter-spacing:-.5px;}
  .adx-v.sm{font-size:15px;}
  .adx-l{font-size:12px;color:var(--label-secondary);font-weight:600;margin-top:3px;}
  .adx-per{display:flex;gap:4px;background:#EFF3F1;border-radius:11px;padding:4px;margin:12px 0 8px;width:fit-content;}
  .adx-per button{border:0;background:transparent;font-family:var(--font);font-size:12.5px;font-weight:700;color:var(--label-secondary);padding:6px 16px;border-radius:8px;cursor:pointer;}
  .adx-per button.on{background:#fff;color:#16323a;box-shadow:0 1px 5px rgba(20,60,45,.12);}
  .tap{cursor:pointer;} .tap:active{opacity:.55;}
  .sh-cur{font-size:12.5px;color:var(--label-secondary);font-weight:600;margin-top:2px;}
  .sh-flt{display:flex;gap:4px;background:#EFF3F1;border-radius:12px;padding:4px;margin:4px 0 14px;}
  .sh-flt button{flex:1;border:0;background:transparent;font-family:var(--font);font-size:13px;font-weight:700;color:var(--label-secondary);padding:9px 6px;border-radius:9px;cursor:pointer;}
  .sh-flt button.on{background:#fff;color:#16323a;box-shadow:0 1px 5px rgba(20,60,45,.12);}
  .sh-stats{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:9px;margin:8px 0 4px;}
  .sh-stat{background:var(--fill-tert);border-radius:12px;padding:11px 8px;text-align:center;}
  .sh-stat .sv{font-size:17px;font-weight:800;color:#16323a;letter-spacing:-.3px;}
  .sh-stat .sl{font-size:10.5px;color:var(--label-secondary);font-weight:700;margin-top:3px;}
  .sh-hist .hr{display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-top:1px solid var(--separator);}
  .sh-hist .hr:first-child{border-top:0;}
  .sh-hist .hv{font-size:15px;font-weight:800;color:#16323a;}
  .sh-hist .hd{font-size:12.5px;color:var(--label-secondary);font-weight:600;}
  .sh-sec{font-size:12px;font-weight:800;color:var(--label-tertiary);text-transform:uppercase;letter-spacing:.3px;margin:16px 0 8px;}
  .sh-srch{display:flex;align-items:center;gap:9px;background:var(--fill-tert);border-radius:12px;padding:11px 13px;color:var(--label-tertiary);font-size:13px;font-weight:600;margin-bottom:12px;}
  .sh-wrap{max-height:74vh;overflow-y:auto;-webkit-overflow-scrolling:touch;}
`);

function am2SheetChart(values,labels,color,target){
  const W=326,H=180,pl=28,pr=14,pt=16,pb=28,iw=W-pl-pr,ih=H-pt-pb;
  let lo=Math.min(...values), hi=Math.max(...values);
  if(target){ lo=Math.min(lo,target[0]); hi=Math.max(hi,target[1]); }
  const pad=(hi-lo||1)*0.12; lo-=pad; hi+=pad; const rng=(hi-lo)||1;
  const X=i=>pl+(i/(values.length-1))*iw, Y=v=>pt+(1-(v-lo)/rng)*ih;
  let grid=''; for(let k=0;k<=3;k++){const val=lo+rng*k/3,y=pt+(1-k/3)*ih;grid+=`<line x1="${pl}" y1="${y.toFixed(1)}" x2="${W-pr}" y2="${y.toFixed(1)}" stroke="#E2E8E5" stroke-width="1"/><text x="${pl-6}" y="${(y+3).toFixed(1)}" text-anchor="end" font-size="9" fill="#9AA6A2">${Math.round(val*10)/10}</text>`;}
  let band=''; if(target){const y1=Y(target[1]),y2=Y(target[0]);band=`<rect x="${pl}" y="${y1.toFixed(1)}" width="${iw}" height="${(y2-y1).toFixed(1)}" fill="rgba(55,189,105,.10)"/>`;}
  const pts=values.map((v,i)=>[X(i),Y(v)]);
  const ln=(typeof smoothPath==='function')?smoothPath(pts):pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area=`M${pts[0][0].toFixed(1)} ${pt+ih} `+pts.map(p=>'L'+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ')+` L${pts[pts.length-1][0].toFixed(1)} ${pt+ih} Z`;
  let xl=''; labels.forEach((l,i)=>{ if(labels.length<=8||i%2===0) xl+=`<text x="${X(i).toFixed(1)}" y="${H-9}" text-anchor="middle" font-size="9.5" fill="#7A8684" font-weight="600">${l}</text>`;});
  const dots=pts.map((p,i)=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i===pts.length-1?5:3.2}" fill="${i===pts.length-1?color:'#fff'}" stroke="${color}" stroke-width="2.2" style="cursor:pointer" onmousemove="dashTip(event,'${labels[i]}','${values[i]}','')" onmouseleave="dashTipHide()"/>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block"><defs><linearGradient id="shg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".16"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>${band}${grid}<path d="${area}" fill="url(#shg)"/><path d="${ln}" fill="none" stroke="${color}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>${dots}</svg>`;
}
function am2DetailTrend(period){
  const A=AM2_ACT[period]||AM2_ACT.Week, color='#37BD69';
  const W=326,H=120,pl=8,pr=8,pt=10,pb=22,iw=W-pl-pr,ih=H-pt-pb,max=Math.max(...A.cur)+1;
  const X=i=>pl+(i/(A.cur.length-1))*iw,Y=v=>pt+(1-v/max)*ih;
  const pts=A.cur.map((v,i)=>[X(i),Y(v)]);
  const ln=(typeof smoothPath==='function')?smoothPath(pts):pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area=`M${pts[0][0].toFixed(1)} ${pt+ih} `+pts.map(p=>'L'+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ')+` L${pts[pts.length-1][0].toFixed(1)} ${pt+ih} Z`;
  let xl=''; A.labels.forEach((l,i)=>{if(A.labels.length<=8||i%2===0)xl+=`<text x="${X(i).toFixed(1)}" y="${H-7}" text-anchor="middle" font-size="9" fill="#9AA6A2" font-weight="600">${l}</text>`;});
  const dots=pts.map((p,i)=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="#fff" stroke="${color}" stroke-width="2" style="cursor:pointer" onmousemove="dashTip(event,'${A.labels[i]}','${A.cur[i]} recs','')" onmouseleave="dashTipHide()"/>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block"><defs><linearGradient id="dtg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".16"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><path d="${area}" fill="url(#dtg)"/><path d="${ln}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>${xl}${dots}</svg>`;
}
const AM2_DATES=['19 Jun 2026','05 Jun 2026','22 May 2026','08 May 2026','24 Apr 2026','10 Apr 2026'];
function am2Hist(series){ return [...series].reverse().map((v,i)=>({v,d:AM2_DATES[i]||''})); }
function am2Gen(field,period){
  const seed=Math.abs(hashStr(field.key+period)), cur=field.cur, isScale=!!field.scale, amp=isScale?1:cur*0.05;
  if(period==='Week'){ const labels=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const vals=labels.map((_,i)=>+((field.series[Math.min(field.series.length-1,1+(i%5))])+(((seed+i*7)%5)-2)*0.1*amp).toFixed(isScale?0:1)); vals[6]=cur; return {labels,values:vals}; }
  if(period==='Year'){ const labels=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; const base=field.prev-(isScale?1:cur*0.06);
    const vals=labels.map((_,i)=>+(base+(cur-base)*(i/11)+(((seed+i*5)%5)-2)*0.04*amp).toFixed(isScale?0:1)); vals[11]=cur; return {labels,values:vals}; }
  const labels=['W1','W2','W3','W4','W5'];
  const vals=labels.map((_,i)=>+(field.prev+(cur-field.prev)*(i/4)+(((seed+i*9)%4)-1.5)*0.04*amp).toFixed(isScale?0:1)); vals[4]=cur; return {labels,values:vals};
}
function am2NumSheet(key,period){ period=period||'Week';
  const f=AM2.numeric.find(x=>x.key===key); if(!f)return;
  const g=am2Gen(f,period), vals=g.values, avg=+(vals.reduce((s,x)=>s+x,0)/vals.length).toFixed(1), min=Math.min(...vals), max=Math.max(...vals);
  const flt=['Week','Month','Year','Custom'].map(p=>`<button class="${p===period?'on':''}" onclick="am2NumSheet('${key}','${p}')">${p}</button>`).join('');
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div><div class="sh-title">${f.label}</div><div class="sh-cur">Current ${f.cur}${f.unit} · Target ${f.target[0]}–${f.target[1]}${f.unit}</div></div><div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="sh-wrap" style="padding:0 2px 10px">
      <div class="sh-flt">${flt}</div>${am2SheetChart(vals,g.labels,DOMC[f.domain],f.target)}
      <div class="sh-stats"><div class="sh-stat"><div class="sv">${avg}</div><div class="sl">Average</div></div><div class="sh-stat"><div class="sv">${min}</div><div class="sl">Minimum</div></div><div class="sh-stat"><div class="sv">${max}</div><div class="sl">Maximum</div></div><div class="sh-stat"><div class="sv">${f.cur}</div><div class="sl">Latest</div></div></div>
      <div class="sh-sec">Recent History</div><div class="sh-hist">${am2Hist(f.series).map(h=>`<div class="hr"><span class="hv">${h.v}${f.unit}</span><span class="hd">${h.d}</span></div>`).join('')}</div>
    </div>`);
}
function am2ScaleSheet(key,period){ period=period||'Week';
  const f=AM2.scale.find(x=>x.key===key); if(!f)return;
  const g=am2Gen(f,period), vals=g.values.map(v=>Math.round(v)), avg=(vals.reduce((s,x)=>s+x,0)/vals.length).toFixed(1), hi=Math.max(...vals), lo=Math.min(...vals), prog=f.series.slice(-4);
  const flt=['Week','Month','Year','Custom'].map(p=>`<button class="${p===period?'on':''}" onclick="am2ScaleSheet('${key}','${p}')">${p}</button>`).join('');
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div><div class="sh-title">${f.label}</div><div class="sh-cur">Current ${f.cur}/${f.scale} · Target ${f.target[0]}–${f.target[1]}</div></div><div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="sh-wrap" style="padding:0 2px 10px">
      <div class="sh-flt">${flt}</div>
      <div class="sh-sec">Scale Progression</div>
      <div class="lj-steps" style="margin-bottom:14px">${prog.map((s,i)=>{const cur=i===prog.length-1;return (i?'<span class="lj-arr">→</span>':'')+`<span class="lj-step ${cur?'cur':''}" style="${cur?'background:'+DOMC[f.domain]:''}">${s}</span>`;}).join('')}</div>
      ${am2SheetChart(vals,g.labels,DOMC[f.domain],f.target)}
      <div class="sh-stats"><div class="sh-stat"><div class="sv">${f.cur}</div><div class="sl">Current</div></div><div class="sh-stat"><div class="sv">${avg}</div><div class="sl">Average</div></div><div class="sh-stat"><div class="sv">${hi}</div><div class="sl">Highest</div></div><div class="sh-stat"><div class="sv">${lo}</div><div class="sl">Lowest</div></div></div>
    </div>`);
}
function am2ListSheet(key,period){ period=period||'Week';
  const f=AM2.list.find(x=>x.key===key); if(!f)return;
  const HIST = key==='appetite'?['Normal','Good','Good','Good','Excellent','Excellent']:['Mild','Mild','Mild','None','None','None'];
  const counts={}; f.opts.forEach(o=>counts[o]=0); HIST.forEach(o=>counts[o]=(counts[o]||0)+1);
  const maxc=Math.max(1,...Object.values(counts));
  const col=o=>{const st=['#FA6140','#FA8A52','#E4B819','#7BC96A','#37BD69'];return st[Math.round(f.opts.indexOf(o)/(f.opts.length-1)*4)];};
  const freq=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0];
  const flt=['Week','Month','Year','Custom'].map(p=>`<button class="${p===period?'on':''}" onclick="am2ListSheet('${key}','${p}')">${p}</button>`).join('');
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div><div class="sh-title">${f.label}</div><div class="sh-cur">Current ${f.cur} · Most frequent ${freq}</div></div><div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="sh-wrap" style="padding:0 2px 10px">
      <div class="sh-flt">${flt}</div>
      <div class="sh-sec">Distribution</div>
      ${f.opts.map(o=>`<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><span style="width:78px;font-size:12.5px;font-weight:700;color:#16323a">${o}</span><div style="flex:1;height:11px;border-radius:6px;background:var(--fill-tert);overflow:hidden"><div style="height:100%;width:${counts[o]/maxc*100}%;background:${col(o)}"></div></div><span style="width:18px;text-align:right;font-size:12px;font-weight:800;color:var(--label-secondary)">${counts[o]}</span></div>`).join('')}
      <div class="sh-sec">Historical Changes</div>
      <div class="lj-steps">${HIST.slice(-4).map((s,i)=>{const cur=i===3;return (i?'<span class="lj-arr">→</span>':'')+`<span class="lj-step ${cur?'cur':''}" style="${cur?'background:'+col(f.cur):''}">${s}</span>`;}).join('')}</div>
    </div>`);
}
function am2TextSheet(period){ period=period||'Week';
  const notes=AM2.text.notes.concat([{by:'Dr. R. Mehta',when:'8 May · 11:30 AM',q:'Weight on target, coat condition excellent.'},{by:'S. Park',when:'2 May · 8:50 AM',q:'Calm, fed well, normal social behaviour.'}]);
  const flt=['Week','Month','Year','Custom'].map(p=>`<button class="${p===period?'on':''}" onclick="am2TextSheet('${p}')">${p}</button>`).join('');
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div class="sh-title">Observations</div><div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="sh-wrap" style="padding:0 2px 10px">
      <div class="sh-srch">🔍 Search observations…</div>
      <div class="sh-flt">${flt}</div>
      <div class="sh-sec">Observation Highlights</div><div class="oh-chips">${AM2.text.highlights.map(h=>`<span class="oh-chip">✦ ${h}</span>`).join('')}</div>
      <div class="sh-sec">All Observations</div>${notes.map(n=>`<div class="note"><div class="nm">${n.by} · ${n.when}</div><div class="nq">"${n.q}"</div></div>`).join('')}
    </div>`);
}

/* ---- dynamic comparison (supports Current vs Previous AND vs any historical) ---- */
const AM2_CUR={date:'19 Jun 2025',weight:24,temp:38.5,bcs:4,activity:8,appetite:'Excellent',obs:'Bright and active, strong enrichment engagement.'};
const AM2_SESSIONS=[
  {date:'5 Jun 2025',weight:22,temp:38.5,bcs:3,activity:6,appetite:'Good',obs:'Appetite improving, social with enclosure-mates.'},
  {date:'22 May 2025',weight:22,temp:38.6,bcs:3,activity:6,appetite:'Good',obs:'Active during enrichment, used climbing structure.'},
  {date:'8 May 2025',weight:21.5,temp:38.4,bcs:3,activity:5,appetite:'Normal',obs:'Slightly subdued, normal intake.'},
  {date:'24 Apr 2025',weight:21,temp:38.5,bcs:3,activity:5,appetite:'Normal',obs:'Baseline assessment on intake.'},
];
const APP_ORD=['Poor','Reduced','Normal','Good','Excellent'];
function am2Comparison(a){
  const mode=STATE.amCmpMode||'prev';
  const idx=mode==='custom'?(STATE.amCmpSession!=null?+STATE.amCmpSession:0):0;
  const B=AM2_SESSIONS[idx]||AM2_SESSIONS[0], C=AM2_CUR;
  const seg=`<div class="fl-cseg"><button class="${mode==='prev'?'on':''}" onclick="setFilter('amCmpMode','prev')">Current vs Previous</button><button class="${mode==='custom'?'on':''}" onclick="setFilter('amCmpMode','custom')">Custom</button></div>`;
  const picker=mode==='custom'
    ? `<div class="cmp-pick"><div class="cmp-sel"><div class="cs-l">Current</div><div class="cs-v">${C.date}</div></div><span class="cmp-vs">vs</span><div class="cmp-sel" onclick="setFilter('amCmpSession',String((${idx}+1)%${AM2_SESSIONS.length}))"><div class="cs-l">Compare With ↻</div><div class="cs-v">${B.date}</div></div></div>`
    : `<div class="fl-cwhen">Current · ${C.date} <span class="mut">vs</span> Previous · ${B.date}</div>`;
  const dW=+(C.weight-B.weight).toFixed(1), dT=+(C.temp-B.temp).toFixed(1), dB=C.bcs-B.bcs, dAc=C.activity-B.activity, dAp=APP_ORD.indexOf(C.appetite)-APP_ORD.indexOf(B.appetite);
  const lines=[];
  if(Math.abs(dW)>=0.1)lines.push(`Weight ${dW>0?'increased':'decreased'} by <b>${Math.abs(dW)}kg</b> (${B.weight} → ${C.weight}kg).`);
  if(dB)lines.push(`Body Condition ${dB>0?'improved':'declined'} from <b>${B.bcs} to ${C.bcs}</b>.`);
  if(dAp)lines.push(`Appetite ${dAp>0?'improved':'declined'} from <b>${B.appetite} to ${C.appetite}</b>.`);
  if(dAc)lines.push(`Activity level ${dAc>0?'increased':'decreased'} from <b>${B.activity} to ${C.activity}</b>.`);
  lines.push(Math.abs(dT)<0.1?`Temperature remains <b>stable</b>.`:`Temperature ${dT>0?'rose':'fell'} by <b>${Math.abs(dT)}°C</b>.`);
  const ai=`<div class="fl-ai"><div class="fl-ai-h">✦ AI Comparison Summary</div><div class="fl-ai-b">Compared with the ${mode==='custom'?'selected':'previous'} assessment:<ul>${lines.map(l=>`<li>${l}</li>`).join('')}</ul></div></div>`;
  const hi=[['Weight','⚖️',dW,(dW>0?'+':'')+dW+'kg'],['Body Condition','📏',dB,(dB>0?'+':'')+(dB||0)],['Appetite','🍽️',dAp,dAp?(dAp>0?'Improved':'Declined'):'Same'],['Activity','🐾',dAc,(dAc>0?'+':'')+dAc],['Temperature','🌡️',dT,Math.abs(dT)<0.1?'Stable':(dT>0?'+':'')+dT+'°C']].sort((x,y)=>Math.abs(y[2])-Math.abs(x[2]));
  const chl=`<div class="s2-card" style="padding:6px 18px"><div class="s2-h" style="padding-top:12px"><div class="t">Change Highlights</div></div>
    ${hi.map(([n,e,d,v])=>{const dir=Math.abs(d)<0.05?'flat':d>0?'up':'dn',c=dir==='up'?'#2E9E5B':dir==='dn'?'#E0492B':'#8E9AA0',bg=dir==='up'?'#E3F5EB':dir==='dn'?'#FDE7E1':'#EEF1F0';
      return `<div class="la" style="border-top:1px solid var(--separator)"><span class="la-ic" style="background:${bg};font-size:16px">${e}</span><div class="la-b"><div class="la-t">${n}</div></div><span class="la-st" style="background:${bg};color:${c};font-size:13px">${dir==='up'?'↑':dir==='dn'?'↓':'→'} ${v}</span></div>`;}).join('')}</div>`;
  const numRow=(e,dom,label,unit,bv,cv)=>{const d=+(cv-bv).toFixed(1),flat=Math.abs(d)<0.05,c=flat?'#8E9AA0':d>0?'#2E9E5B':'#E0492B';return `<div class="cmp2-r"><div class="cmp2-h"><span class="hm-ic" style="background:${dom}1f;width:28px;height:28px;font-size:13px">${e}</span><span class="cmp2-n">${label}</span><span class="s2-badge">Numeric</span></div><div class="cmp2-vals"><span class="cmp2-a">${bv}${unit}</span><span style="color:#9AA6A2">→</span><span class="cmp2-b">${cv}${unit}</span><span class="cmp2-d" style="background:${c}1f;color:${c}">${flat?'stable':(d>0?'+':'')+d+unit}</span></div></div>`;};
  const det=`<div class="s2-sec">Detailed Comparison</div><div class="cmp2">
    ${numRow('⚖️',DOMC.physical,'Weight','kg',B.weight,C.weight)}
    ${numRow('🌡️',DOMC.physical,'Temperature','°C',B.temp,C.temp)}
    <div class="cmp2-r"><div class="cmp2-h"><span class="hm-ic" style="background:${DOMC.physical}1f;width:28px;height:28px;font-size:13px">📏</span><span class="cmp2-n">Body Condition</span><span class="s2-badge">Scale</span></div><div class="cmp2-vals"><span class="cmp2-a">${B.bcs}/9</span><span style="color:#9AA6A2">→</span><span class="cmp2-b">${C.bcs}/9</span><span class="cmp2-d" style="background:${dB>=0?'#2E9E5B':'#E0492B'}1f;color:${dB>=0?'#2E9E5B':'#E0492B'}">${dB?(dB>0?'+':'')+dB:'same'}</span></div></div>
    <div class="cmp2-r"><div class="cmp2-h"><span class="hm-ic" style="background:${DOMC.nutrition}1f;width:28px;height:28px;font-size:13px">🍽️</span><span class="cmp2-n">Appetite</span><span class="s2-badge">List</span></div><div class="cmp2-vals"><span class="cmp2-a">${B.appetite}</span><span style="color:#9AA6A2">→</span><span class="cmp2-b">${C.appetite}</span><span class="cmp2-d" style="background:${dAp>=0?'#2E9E5B':'#E0492B'}1f;color:${dAp>=0?'#2E9E5B':'#E0492B'}">${dAp?(dAp>0?'improved':'declined'):'same'}</span></div></div>
    <div class="cmp2-r"><div class="cmp2-h"><span class="hm-ic" style="background:#8479F91f;width:28px;height:28px;font-size:13px">📝</span><span class="cmp2-n">Observation</span><span class="s2-badge">Text</span></div>
      <div class="cmp2-text"><div class="cmp2-tt"><div class="cmp2-tl">${B.date}</div><div class="cmp2-tq">${B.obs}</div></div><div class="cmp2-tt"><div class="cmp2-tl">${C.date} · current</div><div class="cmp2-tq">${C.obs}</div></div></div></div>
  </div>`;
  return `${seg}${picker}${ai}${chl}${det}<div style="height:8px"></div>`;
}
