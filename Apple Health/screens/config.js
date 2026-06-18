/* Admin Configuration — Phase 1 "Species" group.
   Three screens: cfgCatalog (Assessment Type & Sub-Type library),
   cfgTemplate (Template Builder), cfgScoring (Scoring & Threshold editor).
   Reuses: tabHeader, appHeader, page-hero, list/row, chip, range-seg, field/form,
   insight, btn-fill/btn-tint, openSheet/pill-opt, photoBox, CATS, I icons. */

injectCSS('css-cfg', `
  .cfg-chip{display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border-radius:8px;
    font-size:11px;font-weight:700;letter-spacing:.2px;background:var(--fill-tert);color:var(--label-2)}
  .cfg-chip .cd{width:7px;height:7px;border-radius:50%;flex:0 0 auto}
  .cfg-mode{font-size:11px;font-weight:700;padding:3px 8px;border-radius:7px}
  .cfg-mode.scored{background:rgba(47,174,115,.14);color:var(--environment)}
  .cfg-mode.monitored{background:rgba(201,162,39,.16);color:#C9A227}
  .cfg-mode.descriptive{background:var(--fill-tert);color:var(--label-secondary)}
  .cfg-sub-row{display:flex;align-items:center;gap:12px;padding:13px 16px;cursor:pointer}
  .cfg-sub-row + .cfg-sub-row{border-top:1px solid var(--separator)}
  .cfg-sub-row .sr-body{flex:1;min-width:0}
  .cfg-sub-row .sr-name{font-size:16px;font-weight:600;color:var(--label)}
  .cfg-sub-row .sr-meta{display:flex;align-items:center;gap:8px;margin-top:5px;flex-wrap:wrap}
  .cfg-grp-lab{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;
    padding:4px 4px 8px;letter-spacing:.2px}
  .cfg-grp-lab .gd{width:9px;height:9px;border-radius:50%;flex:0 0 auto}
  .cfg-map-row{display:flex;align-items:center;gap:12px;padding:13px 16px}
  .cfg-map-row + .cfg-map-row{border-top:1px solid var(--separator)}
  .cfg-map-row .mr-dot{width:11px;height:11px;border-radius:50%;flex:0 0 auto}
  .cfg-map-row .mr-name{flex:1;font-size:16px;color:var(--label)}
  .cfg-map-row .mr-arrow{color:var(--label-tertiary);font-size:14px}
  .cfg-map-row .mr-val{width:54px;text-align:right;font-size:17px;font-weight:800;color:var(--antz)}
  .cfg-mini-head{font-size:13px;font-weight:700;color:var(--label-2);padding:2px 4px 8px;letter-spacing:.2px}
  .cfg-band{display:flex;align-items:center;gap:10px;background:var(--bg-elevated);border-radius:12px;
    padding:14px 16px;box-shadow:var(--shadow);margin:0 16px 12px}
  .cfg-band .bd-k{color:var(--label-secondary);font-size:14px;flex:1}
  .cfg-band .bd-v{font-size:18px;font-weight:800;color:var(--antz)}
  .cfg-item-row{display:flex;align-items:center;gap:12px;padding:13px 16px}
  .cfg-item-row + .cfg-item-row{border-top:1px solid var(--separator)}
  .cfg-item-row .ir-icon{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;
    justify-content:center;color:#fff;flex:0 0 auto}
  .cfg-item-row .ir-icon svg{width:18px;height:18px}
  .cfg-item-row .ir-body{flex:1;min-width:0}
  .cfg-item-row .ir-name{font-size:16px;font-weight:600;color:var(--label)}
  .cfg-item-row .ir-sub{font-size:13px;color:var(--label-secondary);margin-top:3px}
  .cfg-item-row .ir-x{color:var(--label-tertiary);cursor:pointer;flex:0 0 auto}
  .cfg-item-row .ir-x svg{width:15px;height:15px}
  .cfg-seg-wrap{margin:0 16px 12px}
  .cfg-note{padding:0 20px 12px;font-size:13px;color:var(--label-secondary);line-height:1.45}
`);

/* ------- shared config mock: example sub-types grouped by Type ------------- */
const CFG_SUBTYPES = {
  physical: [
    { name:'Weight',        response:'Numeric Value', mode:'Monitored',   note:'180–205 kg' },
    { name:'Body Score',    response:'Numeric Scale',  mode:'Scored',      note:'1–9 · target 4–5' },
    { name:'Eye Condition', response:'List',           mode:'Scored',      note:'Good / Fair / Poor' },
    { name:'Posture',       response:'Numeric Scale',  mode:'Scored',      note:'1–5 · higher better' },
  ],
  behaviour: [
    { name:'Barking',               response:'List',          mode:'Scored',      note:'None / Occasional / Frequent' },
    { name:'Cranky / Hyperactive',  response:'List',          mode:'Scored',      note:'multi-select signs' },
    { name:'Activity Level',        response:'Numeric Scale', mode:'Scored',      note:'1–10' },
  ],
  environment: [
    { name:'Enclosure Cleanliness', response:'Numeric Scale', mode:'Scored',      note:'1–5' },
    { name:'Temperature',           response:'Numeric Value', mode:'Monitored',   note:'°C' },
    { name:'Weather / Climate',     response:'List',          mode:'Descriptive', note:'context only' },
  ],
  mental: [
    { name:'Stress / Stereotypy', response:'Numeric Scale', mode:'Scored',      note:'1–5 · lower better' },
    { name:'Curiosity',           response:'Numeric Scale', mode:'Scored',      note:'1–5' },
  ],
  nutrition: [
    { name:'Diet Adherence', response:'List',          mode:'Scored',    note:'Full / Partial / Refused' },
    { name:'Food Quality',   response:'Numeric Scale', mode:'Scored',    note:'1–5' },
    { name:'Food Intake',    response:'Numeric Value', mode:'Monitored', note:'kg' },
  ],
};
const CFG_RESPONSES = ['Text','Numeric Value','List','Numeric Scale'];

function cfgResponseChip(r){
  const map = {
    'Text':'var(--label-secondary)', 'Numeric Value':'var(--physical)',
    'List':'var(--behaviour)', 'Numeric Scale':'var(--nutrition)',
  };
  const short = r==='Numeric Value'?'Numeric':(r==='Numeric Scale'?'Scale':r);
  return `<span class="cfg-chip"><span class="cd" style="background:${map[r]}"></span>${short}</span>`;
}
function cfgModeChip(mode){ return `<span class="cfg-mode ${mode.toLowerCase()}">${mode}</span>`; }
function cfgCount(k){ return CFG_SUBTYPES[k] ? CFG_SUBTYPES[k].length : 0; }

/* ====================================================================== 1 == */
/* cfgCatalog — Assessment Type & Sub-Type catalog */
SCREENS.cfgCatalog = () => {
  const types = Object.keys(CATS);

  const typeRows = types.map(k=>{const c=CATS[k];return `
    <div class="row" onclick="go('cfgScoring',{type:'${k}'})">
      <div class="r-icon" style="background:${c.color}">${c.icon}</div>
      <div class="r-body"><div class="r-title">${c.name}</div>
        <div class="r-sub">${cfgCount(k)} sub-types configured</div></div>
      <div class="r-trail"><span class="chev">${I.chevron}</span></div>
    </div>`;}).join('');

  const subGroups = types.filter(k=>CFG_SUBTYPES[k]).map(k=>{
    const c=CATS[k];
    const rows = CFG_SUBTYPES[k].map(s=>`
      <div class="cfg-sub-row" onclick="go('cfgScoring',{type:'${k}',sub:'${s.name.replace(/'/g,"\\'")}',response:'${s.response}'})">
        <div class="sr-body">
          <div class="sr-name">${s.name}</div>
          <div class="sr-meta">${cfgResponseChip(s.response)}${cfgModeChip(s.mode)}
            <span style="font-size:12px;color:var(--label-tertiary)">${s.note}</span></div>
        </div>
        <span class="chev" style="color:var(--label-tertiary);flex:0 0 auto">${I.chevron}</span>
      </div>`).join('');
    return `<div class="cfg-grp-lab" style="color:${c.raw}"><span class="gd" style="background:${c.raw}"></span>${c.name}</div>
      <div class="card" style="margin:0 16px 14px;padding:2px 0">${rows}</div>`;
  }).join('');

  return `<div class="screen active"><div class="scroll">
    ${tabHeader('Assessment Types','Library · 5 domains')}

    <div class="section-head"><h2>Types</h2><span class="muted" style="font-size:14px">Five Domains</span></div>
    <div class="list">${typeRows}</div>

    <div class="section-head"><h2>Sub-Types</h2><span class="muted" style="font-size:14px">configurable · species-scoped</span></div>
    <div class="cfg-note">Sub-types are configured per species. Each carries a response type and a scoring contribution. Tap one to edit its scoring & thresholds.</div>
    ${subGroups}

    <div style="height:8px"></div>
  </div></div>`;
};

/* ====================================================================== 2 == */
/* cfgTemplate — Template Builder */
function cfgOpenItemPicker(){
  let body='';
  Object.keys(CFG_SUBTYPES).forEach(k=>{ const c=CATS[k];
    body += `<div class="form-label" style="padding:10px 4px 6px;color:${c.raw}">${c.name}</div>`;
    CFG_SUBTYPES[k].forEach(s=>{ body += `<div class="pill-opt" onclick="closeSheet()">
      <span class="dot" style="background:${c.raw}"></span>
      <div style="flex:1"><div style="font-weight:600">${s.name}</div>
        <div class="sh-sub">${s.response} · ${s.mode}</div></div>
      <span class="chev" style="color:var(--label-tertiary)">${I.chevron}</span></div>`; });
  });
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div><div class="sh-title">Add Assessment Item</div>
      <div class="sh-sub">Pick a sub-type by domain</div></div>
      <div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="pill-list">${body}</div>`);
}

SCREENS.cfgTemplate = () => {
  // 2–3 already-added items
  const added = [
    { type:'physical',  ...CFG_SUBTYPES.physical[1] },   // Body Score
    { type:'physical',  ...CFG_SUBTYPES.physical[0] },   // Weight
    { type:'behaviour', ...CFG_SUBTYPES.behaviour[2] },  // Activity Level
  ];

  const seg = (active)=>`<div class="range-seg">
    ${CFG_RESPONSES.map(r=>{const lab=r==='Numeric Value'?'Numeric':(r==='Numeric Scale'?'Scale':r);
      return `<button class="${r===active?'on':''}">${lab}</button>`;}).join('')}</div>`;

  const itemRows = added.map(it=>{const c=CATS[it.type];return `
    <div class="cfg-item-row">
      <div class="ir-icon" style="background:${c.color}">${c.icon}</div>
      <div class="ir-body">
        <div class="ir-name">${it.name}</div>
        <div class="ir-sub">${c.name} · ${it.mode}</div>
        <div class="cfg-seg-wrap" style="margin:8px 0 2px">${seg(it.response)}</div>
      </div>
      <span class="ir-x">${I.x}</span>
    </div>`;}).join('');

  return `<div class="screen active"><div class="scroll">
    ${appHeader('',{back:true})}
    <div class="page-hero"><div class="ph-title">New Template</div>
      <div class="ph-sub">Assign assessments to a species</div></div>

    <div class="form-group">
      <div class="form-label">Template name</div>
      <div class="field"><div class="f-row"><span class="f-v">Felidae · Adult Welfare Set</span></div></div>
    </div>

    <div class="form-group">
      <div class="form-label">Species / taxon scope</div>
      <div class="field">
        <div class="f-row" onclick="openSheet('')" style="cursor:default">
          <span class="f-k">Class</span><span class="f-v">Mammalia</span></div>
        <div class="f-row" style="cursor:default"><span class="f-k">Family</span><span class="f-v">Felidae · Lion</span></div>
        <div class="f-row" style="cursor:default"><span class="f-k">Life stage</span><span class="f-v">Adult</span></div>
      </div>
    </div>

    <div class="section-head"><h2>Assessment items</h2><span class="muted" style="font-size:14px">${added.length} added</span></div>
    <div class="card" style="margin:0 16px 12px;padding:4px 0">${itemRows}</div>
    <div style="padding:0 16px 8px">
      <button class="btn-tint" onclick="cfgOpenItemPicker()">${I.plus}<span style="margin-left:6px">Add assessment item</span></button>
    </div>

    <div class="cfg-note">Each item picks a Response Type (Text · Numeric · List · Scale). Scored items feed the Welfare Index; monitored items track against a normal range.</div>

    <div style="padding:0 16px">
      <button class="btn-fill" onclick="back()">Publish Template</button>
    </div>
    <div style="height:10px"></div>
  </div></div>`;
};

/* ====================================================================== 3 == */
/* cfgScoring — Scoring & Threshold editor for a sub-type */
SCREENS.cfgScoring = ({type='physical', sub='Body Score', response='Numeric Scale'}={}) => {
  const c = CATS[type] || CATS.physical;

  const seg = (active)=>`<div class="range-seg">
    ${CFG_RESPONSES.map(r=>{const lab=r==='Numeric Value'?'Numeric':(r==='Numeric Scale'?'Scale':r);
      return `<button class="${r===active?'on':''}">${lab}</button>`;}).join('')}</div>`;

  // LIST mapping rows
  const listMap = [
    { opt:'Good', score:100, col:'#2FAE73' },
    { opt:'Fair', score:60,  col:'#C9A227' },
    { opt:'Poor', score:20,  col:'#C76B4A' },
  ];
  const listSection = `
    <div class="section-head"><h2 style="font-size:18px">List · Option → Score</h2></div>
    <div class="cfg-mini-head" style="padding-left:20px">Mapped list — each option carries a value</div>
    <div class="card" style="margin:0 16px 10px;padding:2px 0">
      ${listMap.map(m=>`<div class="cfg-map-row">
        <span class="mr-dot" style="background:${m.col}"></span>
        <span class="mr-name">${m.opt}</span>
        <span class="mr-arrow">→</span>
        <span class="mr-val">${m.score}</span></div>`).join('')}
    </div>
    <div style="padding:0 16px 14px"><button class="btn-tint">${I.plus}<span style="margin-left:6px">Add option</span></button></div>`;

  // NUMERIC SCALE section
  const scaleSection = `
    <div class="section-head"><h2 style="font-size:18px">Numeric Scale · Direction</h2></div>
    <div class="cfg-seg-wrap">
      <div class="range-seg">
        <button>Higher better</button><button>Lower better</button><button class="on">Target band</button>
      </div>
    </div>
    <div class="entry-2">
      <div class="entry-field"><span>Min · 1</span></div>
      <div class="entry-field"><span>Max · 9</span></div>
    </div>
    <div class="cfg-band"><span class="bd-k">Pass threshold</span><span class="bd-v">≥ 60</span></div>
    <div class="form-group"><div class="insight">
      <span class="i-dot"></span>
      <span class="i-txt">Body Condition 4–5 is ideal — both extremes score low. Emaciated (1) and obese (9) both fail.</span>
    </div></div>`;

  // NUMERIC VALUE section
  const numericSection = `
    <div class="section-head"><h2 style="font-size:18px">Numeric Value · Normal Range</h2></div>
    <div class="entry-2">
      <div class="entry-field"><span>180</span></div>
      <div class="entry-field"><span>205 kg</span></div>
    </div>
    <div class="form-group"><div class="insight">
      <span class="i-dot"></span>
      <span class="i-txt">Monitored (not scored). Values outside 180–205 kg raise a deviation risk, not a 0–100 score.</span>
    </div></div>`;

  // TEXT section
  const textSection = `
    <div class="section-head"><h2 style="font-size:18px">Text · Descriptive</h2></div>
    <div class="form-group"><div class="insight">
      <span class="i-dot"></span>
      <span class="i-txt">Descriptive only — not scored. Keyword flags (e.g. "lethargic") can raise findings that affect risk.</span>
    </div></div>`;

  return `<div class="screen active"><div class="scroll">
    ${appHeader('',{back:true})}
    <div class="page-hero" style="display:flex;align-items:center;gap:12px">
      <div style="width:46px;height:46px;border-radius:14px;background:${c.color};color:#fff;
        display:flex;align-items:center;justify-content:center;flex:0 0 auto">
        <span style="width:24px;height:24px;display:inline-flex">${c.icon}</span></div>
      <div style="flex:1">
        <div class="ph-title" style="font-size:24px">${sub}</div>
        <div class="ph-sub" style="display:flex;align-items:center;gap:8px;margin-top:4px">
          ${c.name} ${cfgResponseChip(response)}</div>
      </div>
    </div>

    <div class="section-head"><h2 style="font-size:18px">Response type</h2></div>
    <div class="cfg-seg-wrap">${seg(response)}</div>

    ${listSection}
    ${scaleSection}
    ${numericSection}
    ${textSection}

    <div class="section-head"><h2 style="font-size:18px">Domain weight</h2></div>
    <div class="form-group">
      <div class="field">
        <div class="f-row" style="cursor:default"><span class="f-k">Weight</span>
          <span class="f-v">30% of ${c.name}</span></div>
        <div class="f-row" style="cursor:default"><span class="f-k">Required</span>
          <span class="f-v" style="flex:1"></span><span class="toggle"></span></div>
      </div>
    </div>

    <div class="section-head"><h2 style="font-size:18px">Scoring contribution</h2></div>
    <div class="cfg-seg-wrap">
      <div class="range-seg"><button class="on">Scored</button><button>Monitored</button><button>Descriptive</button></div>
    </div>
    <div class="cfg-note">Scored produces a 0–100 domain contribution. Monitored tracks vs a normal range. Descriptive is context only — never scored.</div>

    <div style="padding:0 16px">
      <button class="btn-fill" onclick="back()">Save Configuration</button>
    </div>
    <div style="height:10px"></div>
  </div></div>`;
};

/* --------------------------------------------------------------- register -- */
registerModule({key:'cfgCatalog', label:'Assessment Type Catalog', sub:'5 domains · sub-types', group:'Species', color:'var(--physical)', icon:I.doc});
registerModule({key:'cfgTemplate', label:'Template Builder', sub:'Assign assessments to a species', group:'Species', color:'var(--antz)', icon:I.grid});
registerModule({key:'cfgScoring', label:'Scoring & Thresholds', sub:'Response types → scores', group:'Species', color:'var(--behaviour)', icon:I.scale, param:{type:'physical', sub:'Body Score', response:'Numeric Scale'}});
