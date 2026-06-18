/* ===========================================================================
   Assessment Analytics — REPORTS + AUDIT  ·  PREMIUM v2
   • SCREENS.aaReports — Report Library (generate & export) + Recent Reports
   • SCREENS.aaAudit   — Immutable activity log (tamper-evident audit trail)
   Prefix: repA2.  Built on the v2 kit (12-aa-kit2.js): expandCard · timeline ·
   k2-card · k2-sec · k2-h.  Plus Jakarta type, 24px gutters, airy spacing.
   =========================================================================== */

injectCSS('css-repA2', `
  /* ---- report library: clean 2-col grid ---- */
  .repA2-rgrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:0 24px;}
  .repA2-rcard{background:var(--bg-elevated);border:1px solid var(--hairline);border-radius:18px;
    box-shadow:var(--shadow);padding:18px;display:flex;flex-direction:column;gap:11px;cursor:pointer;
    transition:transform .12s ease;}
  .repA2-rcard:active{transform:scale(.98);}
  .repA2-tile{width:42px;height:42px;border-radius:13px;display:flex;align-items:center;justify-content:center;color:#fff;}
  .repA2-tile svg{width:21px;height:21px;}
  .repA2-rtitle{font-size:16px;font-weight:600;letter-spacing:-.2px;line-height:1.25;}
  .repA2-rdesc{font-size:12px;color:var(--label-secondary);font-weight:500;line-height:1.4;flex:1;}
  .repA2-chiprow{display:flex;gap:6px;margin-top:2px;}
  .repA2-fchip{font-size:10.5px;font-weight:700;letter-spacing:.4px;padding:4px 9px;border-radius:8px;
    background:var(--fill-tert);color:var(--label-2);}

  /* ---- recent report rows ---- */
  .repA2-recent{padding:0 24px;}
  .repA2-rec{display:flex;align-items:center;gap:14px;background:var(--bg-elevated);border:1px solid var(--hairline);
    border-radius:14px;box-shadow:var(--shadow);padding:14px 16px;margin-bottom:12px;cursor:pointer;}
  .repA2-rec .ico{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;
    color:#fff;flex:0 0 auto;}
  .repA2-rec .ico svg{width:19px;height:19px;}
  .repA2-rec .main{flex:1;min-width:0;}
  .repA2-rec .nm{font-size:15px;font-weight:600;letter-spacing:-.1px;}
  .repA2-rec .mt{font-size:12px;color:var(--label-secondary);margin-top:2px;}
  .repA2-rec .dl{width:34px;height:34px;border-radius:11px;background:var(--fill-tert);display:flex;
    align-items:center;justify-content:center;color:var(--primary);flex:0 0 auto;}
  .repA2-rec .dl svg{width:13px;height:13px;}

  /* ---- configure-report sheet ---- */
  .repA2-sheet-tile{display:flex;align-items:center;gap:13px;margin:0 20px 18px;}
  .repA2-sheet-tile .repA2-tile{width:46px;height:46px;border-radius:14px;}
  .repA2-sheet-tile b{font-size:18px;font-weight:700;letter-spacing:-.3px;}
  .repA2-sheet-tile span{font-size:13px;color:var(--label-secondary);font-weight:500;display:block;margin-top:2px;}
  .repA2-flabel{font-size:12px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;
    color:var(--label-tertiary);margin:0 20px 10px;}
  .repA2-segwrap{margin:0 20px 20px;}
  .repA2-scopechips{display:flex;flex-wrap:wrap;gap:9px;margin:0 20px 22px;}
  .repA2-scopechips .repA2-sc{font-size:13px;font-weight:600;color:var(--label-2);background:var(--bg-elevated);
    border:1px solid var(--hairline);border-radius:20px;padding:9px 15px;cursor:pointer;}
  .repA2-scopechips .repA2-sc.on{background:var(--primary);color:#fff;border-color:var(--primary);}
  .repA2-exprow{display:flex;gap:12px;padding:2px 20px 6px;}
  .repA2-exprow button{flex:1;padding:16px;border-radius:15px;border:0;font-family:var(--font);font-size:16px;
    font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;}
  .repA2-exprow button svg{width:18px;height:18px;}
  .repA2-pdf{background:var(--primary);color:#fff;box-shadow:0 6px 18px rgba(55,189,105,.32);}
  .repA2-csv{background:var(--fill-tert);color:var(--label);}

  /* ---- audit: tamper-evident banner ---- */
  .repA2-tamper{display:flex;align-items:center;gap:13px;margin:0 24px;padding:16px 18px;
    background:var(--mint-tint);border:1px solid var(--hairline);border-radius:18px;}
  .repA2-tamper .tico{width:40px;height:40px;border-radius:13px;background:var(--primary);color:#fff;
    display:flex;align-items:center;justify-content:center;flex:0 0 auto;}
  .repA2-tamper .tico svg{width:20px;height:20px;}
  .repA2-tamper b{font-size:14px;font-weight:700;letter-spacing:-.1px;}
  .repA2-tamper span{font-size:12px;color:var(--label-secondary);font-weight:500;display:block;margin-top:2px;line-height:1.4;}

  /* ---- audit log: day-grouped timeline ---- */
  .repA2-dayhdr{font-size:12px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;
    color:var(--label-tertiary);margin:0 0 14px;}
  .repA2-log{position:relative;padding-left:26px;}
  .repA2-log::before{content:"";position:absolute;left:7px;top:8px;bottom:8px;width:2px;background:var(--separator);}
  .repA2-le{position:relative;padding:0 0 22px;}
  .repA2-le:last-child{padding-bottom:0;}
  .repA2-dot{position:absolute;left:-26px;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;border:3px solid var(--primary);}
  .repA2-ltop{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
  .repA2-actor{font-size:14px;font-weight:600;letter-spacing:-.1px;}
  .repA2-role{font-size:10.5px;font-weight:600;color:var(--label-secondary);background:var(--fill-tert);
    padding:2px 8px;border-radius:7px;}
  .repA2-tag{font-size:10.5px;font-weight:700;letter-spacing:.3px;padding:3px 9px;border-radius:8px;}
  .repA2-ltarget{font-size:13px;color:var(--label);font-weight:500;margin-top:5px;line-height:1.4;}
  .repA2-ltarget b{font-weight:700;}
  .repA2-lmeta{display:flex;align-items:center;gap:10px;margin-top:6px;}
  .repA2-lid{font-size:10.5px;font-weight:600;color:var(--label-tertiary);
    font-family:ui-monospace,SFMono-Regular,Menlo,monospace;}
  .repA2-ltime{font-size:11px;color:var(--label-tertiary);font-weight:600;margin-left:auto;}
`);

/* ---- action verb → colour (audit tags + report accents) ----------------- */
function repA2ActionColor(verb){
  return ({
    Created:'#00AFD6', Submitted:'#37BD69', Approved:'#138C8C', Reviewed:'#8479F9',
    Rejected:'#E93353', Modified:'#E4B819', Exported:'#7A8684', Locked:'#00AFD6',
  })[verb] || '#7A8684';
}

/* =====================  1 · REPORTS  ===================================== */

/* the seven report types in the library */
function repA2ReportTypes(){
  return [
    { key:'animal',  title:'Animal Assessment',     desc:'Full welfare & assessment history for one animal.',  cat:'physical',   icon:I.paw,   scope:'Animal' },
    { key:'species', title:'Species Assessment',    desc:'Aggregate welfare across a species group.',          cat:'nutrition',  icon:I.leaf,  scope:'Species' },
    { key:'welfare', title:'Welfare Report',        desc:'Five-Domain welfare index, trend & distribution.',   cat:'mental',     icon:I.heart, scope:'Org' },
    { key:'comp',    title:'Compliance Report',     desc:'Coverage, overdue & on-time assessment compliance.', cat:'environment',icon:I.check, scope:'Org' },
    { key:'site',    title:'Site Report',           desc:'Per-site welfare, completion & risk summary.',       cat:'behaviour',  icon:I.grid,  scope:'Site' },
    { key:'perf',    title:'Assessment Performance',desc:'Assessor throughput, pass-rate & rework quality.',   cat:'physical',   icon:I.scale, scope:'Assessor' },
    { key:'compare', title:'Comparative Report',    desc:'Benchmark sites, species or periods side by side.',  cat:'behaviour',  icon:I.bolt,  scope:'Custom' },
  ];
}

function repA2ReportCard(r){
  return `<div class="repA2-rcard" onclick='openSheet(repA2ConfigSheet(${JSON.stringify(r.key)}))'>
    <div class="repA2-tile" style="background:${CATS[r.cat].raw}">${r.icon}</div>
    <div class="repA2-rtitle">${r.title}</div>
    <div class="repA2-rdesc">${r.desc}</div>
    <div class="repA2-chiprow"><span class="repA2-fchip">PDF</span><span class="repA2-fchip">CSV</span></div>
  </div>`;
}

/* configure-report bottom sheet (date range + scope chips + export buttons) */
function repA2ConfigSheet(key){
  const r = repA2ReportTypes().find(x=>x.key===key) || repA2ReportTypes()[0];
  const ranges=[['7d','7D'],['30d','30D'],['quarter','Qtr'],['year','Year'],['ytd','YTD'],['all','All']];
  const scopes = ({
    Animal:['All Animals','Attention only','Critical only'],
    Species:Object.keys(SPECIES).slice(0,4).map(s=>SPECIES[s].name),
    Site:SITES.map(s=>s.name.split(' ')[0]),
    Assessor:ASSESSORS.map(a=>a.name),
    Org:['All Sites','All Species','By Domain'],
    Custom:['Sites','Species','Periods'],
  })[r.scope] || ['All'];
  return `<div class="sheet-grab"></div>
    <div class="sheet-head"><div class="sh-title">Configure report</div>
      <div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="repA2-sheet-tile">
      <div class="repA2-tile" style="background:${CATS[r.cat].raw}">${r.icon}</div>
      <div><b>${r.title}</b><span>Scope · ${r.scope}</span></div>
    </div>
    <div class="repA2-flabel">Date range</div>
    <div class="repA2-segwrap"><div class="range-seg">${ranges.map(([k,l],i)=>
      `<button class="${i===1?'on':''}" onclick="repA2SegPick(this)">${l}</button>`).join('')}</div></div>
    <div class="repA2-flabel">${r.scope} scope</div>
    <div class="repA2-scopechips">${scopes.map((s,i)=>
      `<span class="repA2-sc ${i===0?'on':''}" onclick="this.classList.toggle('on')">${s}</span>`).join('')}</div>
    <div class="repA2-exprow">
      <button class="repA2-pdf" onclick="repA2Export('${r.title}','PDF')">${I.doc} Export PDF</button>
      <button class="repA2-csv" onclick="repA2Export('${r.title}','CSV')">${I.scale} Export CSV</button>
    </div>`;
}
function repA2SegPick(btn){ [...btn.parentNode.children].forEach(b=>b.classList.remove('on')); btn.classList.add('on'); }
function repA2Export(title, fmt){ closeSheet(); const m=`${title} Report · ${fmt} ready`; if(typeof toast==='function') toast(m); else alert(m); }

/* recent reports (download rows) */
function repA2Recent(){
  return [
    { name:'June Welfare Report',            when:'8 Jun 2026 · 9:12 AM',  by:'Dr. R. Mehta', color:CATS.mental.raw,      icon:I.heart },
    { name:'Q2 Compliance Report',           when:'1 Jun 2026 · 4:40 PM',  by:'M. Chen',      color:CATS.environment.raw, icon:I.check },
    { name:'Coastal Aquarium · Site Report', when:'29 May 2026 · 2:05 PM', by:'S. Park',      color:CATS.behaviour.raw,   icon:I.grid  },
    { name:'Kaa · Animal Assessment',        when:'27 May 2026 · 11:30 AM',by:'Dr. L. Owens', color:CATS.physical.raw,    icon:I.paw   },
  ];
}

SCREENS.aaReports = (params={}) => {
  const types  = repA2ReportTypes();
  const recent = repA2Recent();
  return `<div class="screen active"><div class="scroll">
    ${aaHeader('aaReports', {sub:'Generate & export'})}

    <!-- 1 · Report Library -->
    <div class="k2-sec"><div class="k2-h">Report Library <span class="more">${types.length} types</span></div></div>
    <div class="repA2-rgrid">${types.map(repA2ReportCard).join('')}</div>

    <!-- 2 · Recent Reports -->
    <div class="k2-sec"><div class="k2-h">Recent Reports <span class="more">All</span></div></div>
    <div class="repA2-recent">${recent.map(r=>`
      <div class="repA2-rec" onclick="repA2Export('${r.name.replace(/'/g,'')}','PDF')">
        <span class="ico" style="background:${r.color}">${r.icon}</span>
        <div class="main"><div class="nm">${r.name}</div><div class="mt">${r.when} · ${r.by}</div></div>
        <span class="dl">${I.chevron}</span>
      </div>`).join('')}</div>

    <div style="height:18px"></div>
  </div></div>`;
};

/* =====================  2 · AUDIT LOG  =================================== */

/* build a coherent chronological log from ASSESSORS + RECORDS/ANIMALS */
function repA2AuditEntries(){
  const A = ASSESSORS;
  const an = id => getAnimal(id);
  const E = (actor, verb, target, id, time, day) => ({
    actor:actor.name, role:actor.role, verb, target, id, time, day,
  });
  return [
    /* ---- TODAY ---- */
    E(A[0],'Approved', `<b>Weight</b> assessment · ${an('lion-1').name}`,                          'AS-100482','5:21 PM','Today'),
    E(A[3],'Submitted',`<b>Activity Level</b> · ${an('redpanda-1').name}`,                         'AS-100483','4:02 PM','Today'),
    E(A[1],'Reviewed', `<b>Activity Level</b> returned for re-check · ${an('redpanda-1').name}`,    'AS-100483','4:00 PM','Today'),
    E(A[4],'Exported', `<b>June Welfare Report</b> · PDF`,                                          'RPT-0612','9:12 AM','Today'),
    E(A[0],'Created',  `New assessment scheduled · ${an('macaw-1').name}`,                          'AS-100490','8:48 AM','Today'),
    /* ---- YESTERDAY ---- */
    E(A[1],'Approved', `<b>Body Condition</b> · ${an('python-1').name}`,                            'AS-100481','11:14 AM','Yesterday'),
    E(A[1],'Modified', `Finding updated · ${an('python-1').name}`,                                  'AS-100481','11:02 AM','Yesterday'),
    E(A[0],'Approved', `<b>Eye Condition</b> · ${an('gorilla-1').name}`,                            'AS-100480','9:40 AM','Yesterday'),
    E(A[2],'Rejected', `<b>Stereotypy</b> · insufficient evidence · ${an('redpanda-1').name}`,      'AS-100479','9:05 AM','Yesterday'),
    /* ---- EARLIER ---- */
    E(A[4],'Locked',   `<b>Q2 Compliance Report</b> finalised`,                                    'RPT-0601','1 Jun · 4:40 PM','Earlier'),
    E(A[2],'Submitted',`<b>Diet Adherence</b> · ${an('penguin-1').name}`,                          'AS-100471','1 Jun · 10:18 AM','Earlier'),
    E(A[3],'Created',  `New assessor profile · ${A[4].name}`,                                       'USR-0044','31 May · 3:22 PM','Earlier'),
  ];
}

function repA2LogEntry(e){
  const c = repA2ActionColor(e.verb);
  return `<div class="repA2-le">
    <span class="repA2-dot" style="border-color:${c}"></span>
    <div class="repA2-ltop">
      <span class="repA2-actor">${e.actor}</span>
      <span class="repA2-role">${e.role}</span>
      <span class="repA2-tag" style="color:${c};background:${c}1f">${e.verb}</span>
    </div>
    <div class="repA2-ltarget">${e.target}</div>
    <div class="repA2-lmeta"><span class="repA2-lid">${e.id}</span><span class="repA2-ltime">${e.time}</span></div>
  </div>`;
}

SCREENS.aaAudit = (params={}) => {
  const entries = repA2AuditEntries();
  const days = ['Today','Yesterday','Earlier'];
  const chips = ['All Actions ▾','All Users ▾','All Entities ▾','Date Range ▾'];
  return `<div class="screen active"><div class="scroll">
    ${aaHeader('aaAudit', {sub:'Immutable activity log'})}

    <div class="aa-search">${I.search}<span>Search actors, actions, records…</span></div>
    <div class="aafilter"><div class="aafilter-chips">
      ${chips.map(c=>`<span class="aachip">${c}</span>`).join('')}</div></div>

    <div class="k2-sec" style="margin-top:14px"><div class="repA2-tamper">
      <div class="tico">${I.check}</div>
      <div><b>Tamper-evident · ${entries.length} events</b>
        <span>Append-only ledger · hash-chained · entries cannot be edited or deleted</span></div>
    </div></div>

    ${days.map(d=>{
      const grp = entries.filter(e=>e.day===d);
      if(!grp.length) return '';
      return `<div class="k2-sec"><div class="repA2-dayhdr">${d}</div>
        <div class="repA2-log">${grp.map(repA2LogEntry).join('')}</div></div>`;
    }).join('')}

    <div style="height:18px"></div>
  </div></div>`;
};

registerModule({key:'aaReports', label:'Reports', sub:'Generate & export reports', group:'Executive', color:'var(--antz)', icon:I.doc});
registerModule({key:'aaAudit',   label:'Audit Logs', sub:'Immutable activity log', group:'Executive', color:'var(--label)', icon:I.eye});
