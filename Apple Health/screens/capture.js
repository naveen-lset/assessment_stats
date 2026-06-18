/* Animals & Capture — Phase 2.
   capQueue   : Work Queue / "My Work" — assessments due / overdue / upcoming.
   capConduct : Conduct Assessment — the dynamic capture form whose input area
                swaps by Response type (Text · Numeric · List · Scale).
   Reuses: tabHeader, appHeader, page-hero, photoBox, getAnimal, QUEUE, CATS,
   tile-grid/stile, chips, acard, range-seg, entry-field/entry-2, pill-list/pill-opt,
   idx-pill, btn-fill, welfareColor, I.*  — new CSS via injectCSS('css-cap', …). */

injectCSS('css-cap', `
  .cap-scale{display:flex;gap:8px;margin:0 16px 12px;flex-wrap:wrap}
  .cap-scale .cs-chip{width:38px;height:38px;border-radius:50%;flex:0 0 auto;
    display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;
    background:var(--bg-elevated);box-shadow:var(--shadow);color:var(--label-2);cursor:pointer;
    border:1.5px solid transparent;transition:transform .12s ease}
  .cap-scale .cs-chip.sel{background:var(--antz);color:#fff;border-color:var(--antz)}
  .cap-scale .cs-chip:active{transform:scale(.92)}
  .cap-note{margin:-4px 16px 12px;font-size:13px;color:var(--label-secondary);display:flex;gap:6px;align-items:center}
  .cap-note b{color:var(--label)}
  .cap-due{display:inline-block;font-size:11px;font-weight:800;padding:4px 9px;border-radius:8px;color:#fff;flex:0 0 auto}
  .cap-domchip{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;
    padding:5px 11px;border-radius:999px;color:#fff}
  .cap-domchip svg{width:13px;height:13px}
  .cap-mapped{margin:-2px 16px 12px;font-size:13px;color:var(--label-secondary)}
  .cap-mapped b{color:var(--antz);font-weight:800}
`);

/* ---- dynamic-form state (module-level → setters re-render the screen) ----- */
let capResp  = 'Numeric Scale';   // Text · Numeric Value · List · Numeric Scale
let capList  = 'Good';            // selected List option
let capScale = 5;                 // selected Scale chip (1..9)
function capSetResp(r){ capResp = r; render(); }
function capSetList(v){ capList = v; render(); }
function capSetScale(n){ capScale = n; render(); }

/* List option → score mapping (per CONTRACT: Good=100 / Fair=60 / Poor=20) */
const CAP_LIST_SCORE = { Good:100, Fair:60, Poor:20 };

/* state → colour for due chips (overdue red · due amber · pending grey) */
function capStateColor(state){
  return state==='overdue' ? '#C76B4A' : state==='due' ? '#C9A227' : 'var(--label-tertiary)';
}

/* ============================================================= WORK QUEUE === */
SCREENS.capQueue = () => {
  const overdue  = QUEUE.filter(q=>q.state==='overdue');
  const due      = QUEUE.filter(q=>q.state==='due');
  const upcoming = QUEUE.filter(q=>q.state==='pending');

  const tiles = [
    { n:overdue.length,  lab:'Overdue',  raw:'#C76B4A',       icon:I.alert },
    { n:due.length,      lab:'Due today', raw:'#C9A227',      icon:I.clock },
    { n:upcoming.length, lab:'Upcoming', raw:'var(--antz)',   icon:I.cal },
  ].map(t=>`<div class="stile">
      <div class="st-ico" style="background:${t.raw}1f;color:${t.raw}">${t.icon}</div>
      <div class="st-num" style="color:${t.raw}">${t.n}</div>
      <div class="st-lab">${t.lab}</div>
    </div>`).join('');

  const chips = ['All','Overdue','Due','Upcoming']
    .map((c,i)=>`<span class="chip ${i===0?'on':''}">${c}</span>`).join('');

  const rows = QUEUE.map(q=>{
    const a = getAnimal(q.animalId); const col = capStateColor(q.state);
    return `<div class="acard" onclick="go('capConduct',{animalId:'${q.animalId}',sub:'${q.sub}',type:'${q.type}'})">
      ${photoBox(a.name,{size:46,radius:12})}
      <div class="ac-body">
        <div class="ac-name">${a.name} <span class="ac-sub" style="margin-left:4px">${a.species}</span></div>
        <div class="ac-sub">${q.sub} · ${CATS[q.type].name}</div>
      </div>
      <span class="cap-due" style="background:${col}">${q.due}</span>
      <span class="chev" style="color:var(--label-tertiary);margin-left:8px">${I.chevron}</span>
    </div>`;
  }).join('');

  return `<div class="screen active"><div class="scroll">
    ${tabHeader('My Work', 'Assessments due & overdue')}
    <div class="tile-grid">${tiles}</div>
    <div class="chips">${chips}</div>
    <div class="section-head"><h2>Queue</h2><span class="muted" style="font-size:14px">${QUEUE.length} items</span></div>
    ${rows}
    <div style="height:8px"></div>
  </div></div>`;
};

/* ====================================================== CONDUCT ASSESSMENT == */
SCREENS.capConduct = ({animalId='lion-1', sub='Body Score', type='physical'}={}) => {
  const a = getAnimal(animalId);
  const c = CATS[type] || CATS.physical;

  // segmented control — Text · Numeric · List · Scale (drives capResp)
  const segs = [
    { label:'Text',    val:'Text' },
    { label:'Numeric', val:'Numeric Value' },
    { label:'List',    val:'List' },
    { label:'Scale',   val:'Numeric Scale' },
  ].map(s=>`<button class="${capResp===s.val?'on':''}" onclick="capSetResp('${s.val}')">${s.label}</button>`).join('');

  // dynamic input area, swapped by capResp
  let input = '';
  if(capResp==='Text'){
    input = `<div class="entry-field" style="min-height:80px;align-items:flex-start">Enter observation…</div>`;
  } else if(capResp==='Numeric Value'){
    input = `<div class="entry-2">
      <div class="entry-field" style="color:var(--label)"><b style="font-weight:700">198</b></div>
      <div class="entry-field">kg</div>
    </div>`;
  } else if(capResp==='List'){
    const opts = ['Good','Fair','Poor'].map(o=>`
      <div class="pill-opt ${capList===o?'sel':''}" onclick="capSetList('${o}')">
        <span class="dot" style="background:${o==='Good'?'#2FAE73':o==='Fair'?'#C9A227':'#C76B4A'}"></span>
        <span style="font-weight:600">${o}</span><span class="chk">${I.check}</span>
      </div>`).join('');
    input = `<div class="pill-list">${opts}</div>
      <div class="cap-mapped"><b>${capList} = ${CAP_LIST_SCORE[capList]}</b> · mapped welfare score</div>`;
  } else { // Numeric Scale
    const chips = Array.from({length:9},(_,i)=>i+1)
      .map(n=>`<span class="cs-chip ${capScale===n?'sel':''}" onclick="capSetScale(${n})">${n}</span>`).join('');
    input = `<div class="cap-scale">${chips}</div>
      <div class="cap-note"><span>Selected: <b>${capScale}</b> / 9 · target band <b>4–5</b> ideal (Body Condition)</span></div>`;
  }

  return `<div class="screen active"><div class="scroll">
    ${appHeader('', {back:true, action:`<span class="hdr-act" style="color:var(--antz)" onclick="back()">${I.check}</span>`})}

    <div class="page-hero" style="display:flex;align-items:center;gap:14px;padding-bottom:8px">
      ${photoBox(a.name,{size:58,radius:16})}
      <div style="flex:1">
        <div class="ph-title" style="font-size:24px">${a.name}</div>
        <div class="ph-sub">${a.species} · ${sub}</div>
      </div>
      <span class="cap-domchip" style="background:${c.raw}">${c.icon}${c.name}</span>
    </div>

    <div class="section-head"><h2>${sub}</h2></div>
    <div class="entry-2">
      <div class="entry-field">${I.cal}<span>8 Jun 2026</span></div>
      <div class="entry-field">${I.clock}<span>5:30 PM</span></div>
    </div>

    <div class="section-head"><h2>Response type</h2></div>
    <div class="range-seg">${segs}</div>

    ${input}

    <div class="section-head"><h2>Notes</h2></div>
    <div class="entry-field" style="min-height:56px;align-items:flex-start">Add notes if any…</div>

    <button class="btn-fill" onclick="back()">${I.check}<span style="margin-left:6px">Save Assessment</span></button>
    <div style="height:8px"></div>
  </div></div>`;
};

registerModule({key:'capQueue', label:'Work Queue', sub:'Due · pending · overdue', group:'Animals & Capture', color:'var(--behaviour)', icon:I.clock});
registerModule({key:'capConduct', label:'Conduct Assessment', sub:'Dynamic form by response type', group:'Animals & Capture', color:'var(--antz)', icon:I.plus, param:{animalId:'lion-1', sub:'Body Score', type:'physical'}});
