/* ===========================================================================
   Assessment Analytics — PREMIUM KIT v2 (Plus Jakarta Sans, varied viz, airy)
   Spacing: 24px screen pad · 20px card pad · 16px radius · generous gaps.
   Components: heroKpi · colChart · donut · leaderboard · timeline · radarChart
   · progressRow · cmpCard · segProgress · scoreProg · freqBreak · dynamicGraph
   · snapshot · expandCard · typeTabs · recordList
   =========================================================================== */

injectCSS('css-k2', `
  .k2{padding:0 24px;}                         /* 24px screen gutter */
  .k2-sec{padding:0 24px;margin-top:28px;}     /* section gap 28 */
  .k2-h{font-size:20px;font-weight:600;letter-spacing:-.2px;margin:0 0 14px;display:flex;align-items:center;justify-content:space-between;}
  .k2-h .more{font-size:13px;font-weight:600;color:var(--label-secondary);}
  .k2-pagetitle{font-size:28px;font-weight:700;letter-spacing:-.5px;}
  .k2-sub{font-size:13px;color:var(--label-secondary);margin-top:3px;}

  /* hero KPI carousel */
  .k2-hero{display:flex;gap:14px;overflow-x:auto;padding:2px 24px 6px;scroll-snap-type:x mandatory;}
  .k2-hero::-webkit-scrollbar{height:0;}
  .k2-herocard{flex:0 0 76%;scroll-snap-align:start;background:var(--bg-elevated);border:1px solid var(--hairline);
    border-radius:20px;box-shadow:var(--shadow);padding:20px;}
  .k2-herocard.sm{flex:0 0 46%;}
  .k2-hc-top{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
  .k2-hc-ico{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;}
  .k2-hc-ico svg{width:20px;height:20px;}
  .k2-hc-lab{font-size:13px;font-weight:600;color:var(--label-secondary);}
  .k2-hc-val{font-size:34px;font-weight:700;letter-spacing:-1px;line-height:1;}
  .k2-hc-val small{font-size:15px;color:var(--label-secondary);font-weight:600;}
  .k2-hc-foot{display:flex;align-items:center;gap:6px;margin-top:12px;font-size:13px;font-weight:600;}
  .k2-hc-foot svg{width:12px;height:12px;}

  /* generic premium card */
  .k2-card{background:var(--bg-elevated);border:1px solid var(--hairline);border-radius:16px;box-shadow:var(--shadow);padding:20px;}
  .k2-card + .k2-card{margin-top:16px;}

  /* column chart */
  .k2-col-val{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px;}
  .k2-col-big{font-size:24px;font-weight:700;letter-spacing:-.5px;}

  /* leaderboard */
  .k2-lb-row{display:flex;align-items:center;gap:14px;padding:12px 0;border-top:1px solid var(--separator);}
  .k2-lb-row:first-child{border-top:0;}
  .k2-lb-rank{width:26px;height:26px;border-radius:9px;background:var(--fill-tert);display:flex;align-items:center;justify-content:center;
    font-size:13px;font-weight:700;color:var(--label-2);flex:0 0 auto;}
  .k2-lb-rank.top{background:#37BD69;color:#fff;}
  .k2-lb-main{flex:1;min-width:0;}
  .k2-lb-name{font-size:15px;font-weight:600;}
  .k2-lb-sub{font-size:12px;color:var(--label-secondary);margin-top:1px;}
  .k2-lb-val{font-size:17px;font-weight:700;flex:0 0 auto;}

  /* timeline */
  .k2-tl{position:relative;padding-left:26px;}
  .k2-tl::before{content:"";position:absolute;left:7px;top:6px;bottom:6px;width:2px;background:var(--separator);}
  .k2-tl-item{position:relative;padding:0 0 20px;}
  .k2-tl-item:last-child{padding-bottom:0;}
  .k2-tl-dot{position:absolute;left:-26px;top:2px;width:16px;height:16px;border-radius:50%;background:#fff;border:3px solid var(--primary);}
  .k2-tl-t{font-size:14px;font-weight:600;}
  .k2-tl-s{font-size:12px;color:var(--label-secondary);margin-top:2px;}
  .k2-tl-time{font-size:11px;color:var(--label-tertiary);font-weight:600;margin-top:3px;}

  /* progress row */
  .k2-pr{margin:14px 0;}
  .k2-pr-top{display:flex;justify-content:space-between;font-size:13px;margin-bottom:7px;}
  .k2-pr-top b{font-weight:700;}
  .k2-pr-track{height:10px;border-radius:6px;background:var(--fill-tert);overflow:hidden;}
  .k2-pr-fill{height:100%;border-radius:6px;}

  /* segmented progress (status) */
  .k2-seg{display:flex;height:14px;border-radius:7px;overflow:hidden;gap:2px;margin:6px 0 14px;}
  .k2-seg span{height:100%;}
  .k2-seglg{display:flex;flex-direction:column;gap:9px;}
  .k2-seglg .r{display:flex;align-items:center;gap:9px;font-size:14px;font-weight:600;color:var(--label-2);}
  .k2-seglg .r i{width:10px;height:10px;border-radius:3px;}
  .k2-seglg .r b{margin-left:auto;color:var(--label);}

  /* comparison card */
  .k2-cmp-two{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;}
  .k2-cmp-e{background:var(--fill-quat);border-radius:14px;padding:16px;text-align:center;}
  .k2-cmp-e .nm{font-size:15px;font-weight:700;margin-top:8px;}
  .k2-cmp-e .mt{font-size:12px;color:var(--label-secondary);}
  .k2-cmp-row{display:flex;align-items:center;gap:10px;padding:11px 0;border-top:1px solid var(--separator);font-size:14px;}
  .k2-cmp-row .lab{flex:1;color:var(--label-2);font-weight:600;}
  .k2-cmp-row .a,.k2-cmp-row .b{width:54px;text-align:center;font-weight:700;}

  /* snapshot */
  .k2-snap{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .k2-snap .cell{background:var(--fill-quat);border-radius:14px;padding:16px;}
  .k2-snap .cell .l{font-size:12px;color:var(--label-secondary);font-weight:600;}
  .k2-snap .cell .v{font-size:22px;font-weight:700;letter-spacing:-.4px;margin-top:5px;}
  .k2-snap .cell .v small{font-size:13px;color:var(--label-secondary);font-weight:600;}

  /* expandable */
  .k2-exp{background:var(--bg-elevated);border:1px solid var(--hairline);border-radius:16px;box-shadow:var(--shadow);
    margin-bottom:14px;overflow:hidden;}
  .k2-exp-head{display:flex;align-items:center;gap:12px;padding:18px 20px;cursor:pointer;}
  .k2-exp-head .ico{width:36px;height:36px;border-radius:11px;display:flex;align-items:center;justify-content:center;color:#fff;flex:0 0 auto;}
  .k2-exp-head .ico svg{width:18px;height:18px;}
  .k2-exp-head .t{flex:1;}
  .k2-exp-head .t .tt{font-size:16px;font-weight:600;}
  .k2-exp-head .t .ts{font-size:12px;color:var(--label-secondary);margin-top:1px;}
  .k2-exp-head .chev{color:var(--label-tertiary);transition:transform .2s;}
  .k2-exp.open .k2-exp-head .chev{transform:rotate(90deg);}
  .k2-exp-body{padding:0 20px 18px;display:none;}
  .k2-exp.open .k2-exp-body{display:block;}

  /* assessment type tabs (horizontal) */
  .k2-ttabs{display:flex;gap:8px;overflow-x:auto;padding:4px 24px 2px;}
  .k2-ttabs::-webkit-scrollbar{height:0;}
  .k2-ttab{flex:0 0 auto;font-size:14px;font-weight:600;color:var(--label-secondary);padding:9px 16px;border-radius:22px;
    background:var(--bg-elevated);border:1px solid var(--hairline);cursor:pointer;white-space:nowrap;}
  .k2-ttab.on{background:var(--primary);color:#fff;border-color:var(--primary);}

  /* record list (improved history) */
  .k2-rec{display:flex;align-items:center;gap:14px;background:var(--bg-elevated);border:1px solid var(--hairline);
    border-radius:14px;padding:14px 16px;margin-bottom:10px;}
  .k2-rec .when{width:64px;flex:0 0 auto;}
  .k2-rec .when .w1{font-size:13px;font-weight:700;}
  .k2-rec .when .w2{font-size:11px;color:var(--label-tertiary);margin-top:1px;}
  .k2-rec .val{flex:1;display:flex;align-items:baseline;gap:6px;}
  .k2-rec .val .vv{font-size:20px;font-weight:700;letter-spacing:-.3px;}
  .k2-rec .val .vu{font-size:12px;color:var(--label-secondary);font-weight:600;}
  .k2-rec .val .vs{font-size:15px;font-weight:600;}
  .k2-rec .chg{font-size:13px;font-weight:700;flex:0 0 auto;}
  .k2-rec .note{width:18px;height:18px;color:var(--gold);flex:0 0 auto;}

  /* sticky add button */
  .k2-sticky{position:sticky;bottom:0;padding:14px 24px calc(14px + env(safe-area-inset-bottom));
    background:linear-gradient(180deg,transparent,var(--bg) 40%);}
  .k2-addbtn{width:100%;background:var(--primary);color:#fff;border:0;font-family:var(--font);font-size:16px;font-weight:700;
    padding:16px;border-radius:16px;cursor:pointer;box-shadow:0 6px 18px rgba(55,189,105,.35);}
`);

/* ---------------------------------------------- components ----------------- */
function heroKpi(items){
  return `<div class="k2-hero">${items.map((k,i)=>`
    <div class="k2-herocard ${items.length>2&&i>0?'':''}" ${k.go?`onclick="${k.go}"`:''}>
      <div class="k2-hc-top"><span class="k2-hc-ico" style="background:${k.color||'var(--primary)'}">${k.icon||I.doc}</span>
        <span class="k2-hc-lab">${k.lab}</span></div>
      <div class="k2-hc-val" ${k.vcolor?`style="color:${k.vcolor}"`:''}>${k.val}${k.unit?`<small> ${k.unit}</small>`:''}</div>
      ${k.foot?`<div class="k2-hc-foot ${k.up===false?'delta-down':k.up?'delta-up':''}" ${k.up==null?`style="color:var(--label-secondary)"`:''}>
        ${k.up==null?'':(k.up?I.arrowUp:I.arrowDn)}${k.foot}</div>`:''}
    </div>`).join('')}</div>`;
}

/* interactive column chart with value labels + selectable bar */
function colChart(data, labels, {color='#37BD69', sel=-1, onSel=''}={}){
  const w=320,h=150,pad={l:6,r:6,t:22,b:22}; const max=Math.max(...data)||1;
  const iw=w-pad.l-pad.r, ih=h-pad.t-pad.b, gap=iw/data.length, bw=gap*0.5;
  const si = sel<0? data.length-1 : sel;
  const base=pad.t+ih;
  let bars='';
  data.forEach((v,i)=>{ const bh=Math.max(4,(v/max)*ih), x=pad.l+gap*i+(gap-bw)/2, y=base-bh, on=i===si;
    bars+=`<rect x="${x.toFixed(1)}" y="${base.toFixed(1)}" width="${bw.toFixed(1)}" height="0" rx="5"
      fill="${color}" opacity="${on?1:.22}" ${onSel?`onclick="${onSel}(${i})" style="cursor:pointer"`:''}>
      <animate attributeName="height" values="0;${bh.toFixed(1)}" dur="0.5s" begin="${(i*0.04).toFixed(2)}s" fill="freeze" calcMode="spline" keySplines="0.33 0 0.2 1" keyTimes="0;1"/>
      <animate attributeName="y" values="${base.toFixed(1)};${y.toFixed(1)}" dur="0.5s" begin="${(i*0.04).toFixed(2)}s" fill="freeze" calcMode="spline" keySplines="0.33 0 0.2 1" keyTimes="0;1"/></rect>
      ${on?`<text x="${(x+bw/2).toFixed(1)}" y="${(y-7).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="${color}" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.3s" begin="0.5s" fill="freeze"/>${v}</text>`:''}`;
    const lx=pad.l+gap*i+gap/2;
    bars+=`<text x="${lx.toFixed(1)}" y="${h-6}" text-anchor="middle" font-size="10" fill="${on?'var(--label)':'#9aa8a4'}" ${on?'font-weight="700"':''}>${labels[i]}</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block">${bars}</svg>`;
}

function leaderboard(rows){
  return `<div>${rows.map((r,i)=>`
    <div class="k2-lb-row" ${r.go?`onclick="${r.go}"`:''}>
      <span class="k2-lb-rank ${i===0?'top':''}">${i+1}</span>
      <div class="k2-lb-main"><div class="k2-lb-name">${r.name}</div><div class="k2-lb-sub">${r.sub||''}</div></div>
      <span class="k2-lb-val" ${r.color?`style="color:${r.color}"`:''}>${r.val}</span>
    </div>`).join('')}</div>`;
}

function timeline(items){
  return `<div class="k2-tl">${items.map(it=>`
    <div class="k2-tl-item"><span class="k2-tl-dot" style="border-color:${it.color||'var(--primary)'}"></span>
      <div class="k2-tl-t">${it.title}</div>${it.sub?`<div class="k2-tl-s">${it.sub}</div>`:''}
      <div class="k2-tl-time">${it.time}</div></div>`).join('')}</div>`;
}

function radarChart(values, labels, {color='#37BD69', size=200, max=100}={}){
  const cx=size/2, cy=size/2, R=size/2-30, n=values.length;
  const pt=(i,r)=>{ const a=-Math.PI/2 + i*2*Math.PI/n; return [cx+Math.cos(a)*r, cy+Math.sin(a)*r]; };
  let grid='';
  [0.25,0.5,0.75,1].forEach(g=>{ const p=values.map((_,i)=>pt(i,R*g)); grid+=`<polygon points="${p.map(q=>q.join(',')).join(' ')}" fill="none" stroke="var(--separator)" stroke-width="1"/>`; });
  let axes='', labs='';
  values.forEach((_,i)=>{ const e=pt(i,R); axes+=`<line x1="${cx}" y1="${cy}" x2="${e[0]}" y2="${e[1]}" stroke="var(--separator)" stroke-width="1"/>`;
    const l=pt(i,R+16); labs+=`<text x="${l[0].toFixed(1)}" y="${l[1].toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="10" font-weight="600" fill="var(--label-secondary)">${labels[i]}</text>`; });
  const poly=values.map((v,i)=>pt(i,R*Math.max(0.05,Math.min(1,v/max))));
  return `<svg viewBox="0 0 ${size} ${size}" width="100%" style="display:block;max-width:300px;margin:0 auto">
    ${grid}${axes}
    <polygon points="${poly.map(q=>q.map(n=>n.toFixed(1)).join(',')).join(' ')}" fill="${color}33" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>
    ${poly.map(q=>`<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="3.5" fill="${color}"/>`).join('')}
    ${labs}</svg>`;
}

function progressRow(label, pct, color){
  return `<div class="k2-pr"><div class="k2-pr-top"><span>${label}</span><b style="color:${color}">${pct}%</b></div>
    <div class="k2-pr-track"><div class="k2-pr-fill" style="width:${pct}%;background:${color}"></div></div></div>`;
}

function segProgress(rows){
  const total=rows.reduce((s,r)=>s+r.val,0)||1;
  return `<div class="k2-seg">${rows.map(r=>`<span style="width:${(r.val/total*100).toFixed(1)}%;background:${r.color}"></span>`).join('')}</div>
    <div class="k2-seglg">${rows.map(r=>`<div class="r"><i style="background:${r.color}"></i>${r.label}<b>${Math.round(r.val/total*100)}%</b></div>`).join('')}</div>`;
}

function scoreProg(data, labels, {color='#37BD69', max=9}={}){
  const dir = data[data.length-1]-data[0];
  const tag = dir>0?{t:'Improving',c:'#37BD69'}:dir<0?{t:'Declining',c:'#FA6140'}:{t:'Stable',c:'#7A8684'};
  const w=320,h=120,pad=16; const X=i=>pad+(i/(data.length-1))*(w-2*pad), Y=v=>h-pad-(v/max)*(h-2*pad);
  const pts=data.map((v,i)=>[X(i),Y(v)]); const line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <span class="aabig" style="margin:0"><span class="v">${data[data.length-1]}</span><span class="s"> / ${max}</span></span>
      <span class="aastatus" style="background:${tag.c}22;color:${tag.c}">${tag.t}</span></div>
    <svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block">
      <path d="${line}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${pts.map((p,i)=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i===pts.length-1?5:4}" fill="${color}"/>
        <text x="${p[0].toFixed(1)}" y="${(p[1]-10).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="${color}">${data[i]}</text>`).join('')}</svg>`;
}

function freqBreak(rows){
  const max=Math.max(...rows.map(r=>r.val))||1;
  return `<div>${rows.map(r=>`<div class="k2-pr"><div class="k2-pr-top"><span>${r.label}</span><b>${r.val}</b></div>
    <div class="k2-pr-track"><div class="k2-pr-fill" style="width:${Math.round(r.val/max*100)}%;background:${r.color||'var(--secondary)'}"></div></div></div>`).join('')}</div>`;
}

/* picks the right viz for an assessment type */
function dynamicGraph(type, payload){
  if(type==='weight') return `${snapshotInline(payload.snap)}${gradLine(payload.data,{from:'#00D6C9',to:'#37BD69'})}`;
  if(type==='bodyscore') return scoreProg(payload.data, payload.labels, {max:9});
  if(type==='status') return segProgress(payload.rows);
  if(type==='category') return freqBreak(payload.rows);
  return gradLine(payload.data||[1,2,3],{});
}
function snapshotInline(s){
  return `<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:10px">
    <span style="font-size:28px;font-weight:700;letter-spacing:-.6px">${s.latest}</span>
    <span style="font-size:13px;font-weight:700;color:${s.up?'#37BD69':'#FA6140'}">${s.up?'▲':'▼'} ${s.change}</span></div>`;
}

function snapshot(s){
  return `<div class="k2-snap">
    <div class="cell"><div class="l">Latest</div><div class="v">${s.latest}</div></div>
    <div class="cell"><div class="l">Previous</div><div class="v" style="color:var(--label-secondary)">${s.previous}</div></div>
    <div class="cell"><div class="l">Change</div><div class="v" style="color:${s.up?'#37BD69':'#FA6140'}">${s.up?'+':''}${s.change}</div></div>
    <div class="cell"><div class="l">Updated</div><div class="v" style="font-size:18px">${s.updated}</div></div>
  </div>`;
}

function expandCard(id, ico, color, title, sub, body, open=false){
  return `<div class="k2-exp ${open?'open':''}" id="exp-${id}">
    <div class="k2-exp-head" onclick="this.parentNode.classList.toggle('open')">
      <span class="ico" style="background:${color}">${ico}</span>
      <span class="t"><span class="tt">${title}</span><span class="ts">${sub}</span></span>
      <span class="chev">${I.chevron}</span></div>
    <div class="k2-exp-body">${body}</div></div>`;
}

function typeTabs(types, active, onclick){
  return `<div class="k2-ttabs">${types.map(t=>`<div class="k2-ttab ${t.key===active?'on':''}" onclick="${onclick}('${t.key}')">${t.name}</div>`).join('')}</div>`;
}

function recordList(records){
  return records.map(r=>`<div class="k2-rec">
    <div class="when"><div class="w1">${r.when}</div><div class="w2">${r.time}</div></div>
    <div class="val">${r.status
      ? `<span class="vs" style="color:${r.statusColor||'var(--label)'}">${r.status}</span>`
      : `<span class="vv">${r.value}</span>${r.unit?`<span class="vu">${r.unit}</span>`:''}`}</div>
    ${r.change!=null?`<span class="chg" style="color:${r.up?'#37BD69':'#FA6140'}">${r.up?'+':''}${r.change}</span>`:''}
    ${r.note?`<span class="note">${I.doc}</span>`:''}
  </div>`).join('');
}
