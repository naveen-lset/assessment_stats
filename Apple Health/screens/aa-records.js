/* ===========================================================================
   Assessment Analytics — RECORDS v2 (PREMIUM)
   List: airy, searchable register with a bottom-sheet filter (Date Range /
         Site / Species / Type / Status) + active-filter chip row.
   Detail: progressive-disclosure drill — expandCards for Summary, Responses,
         Results (score + domain bars), Attachments, Review Information, plus a
         tamper-evident Audit Trail timeline.
   v2 kit: aaHeader, .aa-search, expandCard, timeline, k2-card/k2-sec, photoBox.
   Helpers: RECORDS, recordById, getAnimal, ANIMALS, ASSESSORS, SITES, AA_TYPES,
            CATS, DOMAIN_ORDER, welfareColor, welfareLabel, aaStatusColor/aaStatusBg,
            openSheet/closeSheet, appHeader, page-hero, hashStr, I.
   Custom CSS (prefix recA2): premium list row + audit timeline + filter sheet.
   =========================================================================== */

injectCSS('css-recA2', `
  /* ---- list: search + filter affordance ---- */
  .recA2-tools{display:flex;gap:12px;align-items:stretch;padding:0 24px;margin-top:14px;}
  .recA2-tools .aa-search{flex:1;margin:0;border-radius:16px;padding:13px 15px;font-size:15px;cursor:pointer;}
  .recA2-filterbtn{flex:0 0 auto;display:flex;align-items:center;gap:7px;background:var(--bg-elevated);
    border:1px solid var(--hairline);border-radius:16px;padding:0 16px;font-size:14px;font-weight:600;
    color:var(--label);cursor:pointer;box-shadow:var(--shadow);}
  .recA2-filterbtn svg{width:15px;height:15px;}
  .recA2-filterbtn .badge-n{background:var(--primary);color:#fff;font-size:11px;font-weight:800;
    min-width:18px;height:18px;border-radius:9px;display:flex;align-items:center;justify-content:center;padding:0 4px;}

  /* ---- active filter chips ---- */
  .recA2-chips{display:flex;gap:8px;overflow-x:auto;padding:14px 24px 2px;}
  .recA2-chips::-webkit-scrollbar{height:0;}
  .recA2-chip{flex:0 0 auto;display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;
    color:#fff;background:var(--primary);border:0;border-radius:18px;padding:7px 12px;white-space:nowrap;cursor:pointer;}
  .recA2-chip svg{width:10px;height:10px;opacity:.85;}

  /* ---- count row ---- */
  .recA2-count{display:flex;align-items:baseline;justify-content:space-between;padding:0 24px;margin:22px 0 12px;}
  .recA2-count .ttl{font-size:20px;font-weight:700;letter-spacing:-.3px;}
  .recA2-count .n{font-size:13px;color:var(--label-secondary);font-weight:600;}

  /* ---- premium record row ---- */
  .recA2-list{padding:0 24px;}
  .recA2-row{display:flex;align-items:center;gap:14px;background:var(--bg-elevated);border:1px solid var(--hairline);
    border-radius:16px;box-shadow:var(--shadow);padding:16px 18px;margin-bottom:12px;cursor:pointer;
    transition:transform .12s ease,box-shadow .12s ease;}
  .recA2-row:active{transform:scale(.99);}
  .recA2-row .rw-main{flex:1;min-width:0;}
  .recA2-row .rw-id{font-size:11px;font-weight:700;color:var(--label-tertiary);letter-spacing:.4px;}
  .recA2-row .rw-name{font-size:17px;font-weight:700;letter-spacing:-.3px;margin-top:2px;}
  .recA2-row .rw-sub{font-size:12.5px;color:var(--label-secondary);margin-top:4px;line-height:1.45;}
  .recA2-row .rw-trail{display:flex;flex-direction:column;align-items:flex-end;gap:7px;flex:0 0 auto;}
  .recA2-row .rw-score{font-size:22px;font-weight:800;letter-spacing:-.6px;line-height:1;}
  .recA2-row .rw-pill{font-size:11px;font-weight:800;padding:4px 10px;border-radius:9px;white-space:nowrap;}

  /* ---- detail: hero record meta ---- */
  .recA2-hpill{font-size:12px;font-weight:800;padding:5px 11px;border-radius:10px;}
  .recA2-hid{font-weight:700;letter-spacing:.4px;color:var(--label-2);font-size:13px;}

  /* ---- responses (item -> value) ---- */
  .recA2-resp{display:flex;align-items:center;gap:13px;padding:12px 0;border-top:1px solid var(--separator);}
  .recA2-resp:first-child{border-top:0;}
  .recA2-resp .rp-ico{width:36px;height:36px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;}
  .recA2-resp .rp-ico svg{width:17px;height:17px;}
  .recA2-resp .rp-name{font-size:14.5px;font-weight:600;}
  .recA2-resp .rp-meta{font-size:12px;color:var(--label-secondary);margin-top:1px;}
  .recA2-resp .rp-val{margin-left:auto;font-size:15px;font-weight:800;flex:0 0 auto;}

  /* ---- results score + domain bars ---- */
  .recA2-score{display:flex;align-items:baseline;gap:10px;margin-bottom:14px;}
  .recA2-score .sc-v{font-size:38px;font-weight:800;letter-spacing:-1.2px;line-height:1;}
  .recA2-score .sc-x{font-size:13.5px;color:var(--label-secondary);font-weight:600;}
  .recA2-dom{display:flex;align-items:center;gap:11px;padding:8px 0;}
  .recA2-dom .dm-name{width:112px;font-size:13px;color:var(--label-2);font-weight:600;flex:0 0 auto;}
  .recA2-dom .dm-track{flex:1;height:9px;border-radius:6px;background:var(--fill-tert);overflow:hidden;}
  .recA2-dom .dm-fill{height:100%;border-radius:6px;}
  .recA2-dom .dm-val{width:36px;text-align:right;font-size:13px;font-weight:800;flex:0 0 auto;}

  /* ---- attachments ---- */
  .recA2-thumbs{display:flex;gap:12px;flex-wrap:wrap;}
  .recA2-thumb{text-align:center;}
  .recA2-thumb .rt-cap{font-size:11.5px;color:var(--label-secondary);margin-top:6px;}

  /* ---- review block ---- */
  .recA2-rev{display:flex;gap:13px;align-items:flex-start;}
  .recA2-rev .rv-ico{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;}
  .recA2-rev .rv-ico svg{width:19px;height:19px;}
  .recA2-rev .rv-name{font-size:15px;font-weight:700;}
  .recA2-rev .rv-dec{font-size:13px;margin-top:2px;font-weight:700;}
  .recA2-rev .rv-cmt{font-size:13px;color:var(--label-secondary);margin-top:4px;line-height:1.45;}
  .recA2-rev .rv-time{font-size:12px;color:var(--label-tertiary);margin-top:5px;}
  .recA2-rev + .recA2-rev{margin-top:16px;padding-top:16px;border-top:1px solid var(--separator);}

  /* ---- audit timeline (hashed, tamper-evident) ---- */
  .recA2-tl{position:relative;padding-left:28px;}
  .recA2-tl::before{content:"";position:absolute;left:8px;top:6px;bottom:8px;width:2px;background:var(--separator);}
  .recA2-tl-item{position:relative;padding:0 0 22px;}
  .recA2-tl-item:last-child{padding-bottom:2px;}
  .recA2-tl-dot{position:absolute;left:-28px;top:2px;width:18px;height:18px;border-radius:50%;
    background:var(--bg-elevated);border:3px solid var(--separator);}
  .recA2-tl-t{font-size:14.5px;font-weight:700;}
  .recA2-tl-s{font-size:12.5px;color:var(--label-secondary);margin-top:2px;}
  .recA2-tl-time{font-size:12px;color:var(--label-tertiary);margin-top:2px;}
  .recA2-tl-hash{font-size:11px;color:var(--label-tertiary);font-family:ui-monospace,Menlo,monospace;margin-top:4px;}

  .recA2-foot{font-size:12.5px;color:var(--label-secondary);text-align:center;padding:14px 24px 6px;line-height:1.5;}

  /* ---- filter sheet ---- */
  .recA2-fgrp{padding:4px 16px 6px;}
  .recA2-fgrp .fg-lab{font-size:12.5px;font-weight:700;color:var(--label-secondary);letter-spacing:.2px;margin:14px 0 9px;text-transform:uppercase;}
  .recA2-fchips{display:flex;gap:8px;flex-wrap:wrap;}
  .recA2-fchip{font-size:13.5px;font-weight:600;color:var(--label-2);background:var(--bg-elevated);
    border:1px solid var(--hairline);border-radius:20px;padding:8px 14px;cursor:pointer;white-space:nowrap;}
  .recA2-fchip.on{background:var(--primary);color:#fff;border-color:var(--primary);}
`);

/* ---- in-memory register: RECORDS + synthesized rows from AA_TYPES + ANIMALS ---- */
function recA2StatusFor(i){
  return ['Approved','Approved','Under Review','Approved','Draft','Approved','Rejected','Approved','Under Review','Approved'][i%10];
}
function recA2SiteFor(animalId){
  const a = getAnimal(animalId), e = (a.encl||'')[0];
  return ({A:'Riverside Zoo', P:'Summit Conservancy', M:'Highland Wildlife',
           R:'Savanna Park', V:'Coastal Aquarium'})[e]
    || SITES[Math.abs(hashStr(animalId))%SITES.length].name;
}
function recA2All(){
  const out = RECORDS.map(r=>({
    id:r.id, animalId:r.animalId, sub:r.sub, type:r.type, response:r.response,
    value:r.value, score:r.score, pass:r.pass, status:r.status,
    assessor:r.assessor, role:r.role, when:r.when, finding:r.finding,
  }));
  const animals = Object.values(ANIMALS);
  let n = 100479;                         // ids descend below the base RECORDS block
  AA_TYPES.forEach((t,ti)=>{
    const a  = animals[(ti*3+1) % animals.length];
    const as = ASSESSORS[ti % ASSESSORS.length];
    const score = Math.max(28, Math.min(99, t.avg + (((ti*53)%17)-8)));
    out.push({
      id:'AS-'+(n--), animalId:a.id, sub:t.name, type:t.cat,
      response: t.name==='Body Condition' ? 'Numeric Scale' : (t.cat==='nutrition'?'Numeric Value':'List'),
      value: t.name==='Body Condition' ? '5 / 9' : (t.cat==='nutrition'?(80+ti)+' g/kg':(score>=70?'Good':'Fair')),
      score, pass: score>=60,
      status: recA2StatusFor(ti+RECORDS.length),
      assessor: as.name, role: as.role,
      when: ['8 Jun 2026 · 3:1','7 Jun 2026 · 2:0','6 Jun 2026 · 11:','5 Jun 2026 · 9:4'][ti%4]
            + (ti%6) + (ti%2?' PM':' AM'),
      finding: score<60 ? (t.name+' below threshold') : null,
    });
  });
  return out;                             // ~15 rows (4 base + 11 synthesized)
}
function recA2Date(when){ return (when||'').split('·')[0].trim(); }

/* ---- active filter state (mock — drives chip row; Apply just closes) ---- */
const recA2Filters = { range:'30d', site:'All Sites', species:'All Species', type:'All Types', status:'All Status' };
function recA2SetFilter(key,val){
  recA2Filters[key] = val;
  openSheet(recA2FilterSheet());          // re-render sheet with new selection
}
function recA2ApplyFilters(){ closeSheet(); render(); }
function recA2ClearChip(key,reset){ recA2Filters[key] = reset; render(); }

function recA2ActiveChips(){
  const map = [
    ['range','range','30d'], ['site','site','All Sites'], ['species','species','All Species'],
    ['type','type','All Types'], ['status','status','All Status'],
  ];
  return map.filter(([k,_,def])=>recA2Filters[k]!==def)
    .map(([k,_,def])=>({key:k, label:recA2Filters[k], reset:def}));
}

/* ---- filter bottom sheet ---- */
function recA2FilterSheet(){
  const ranges = [['7d','7 Days'],['30d','30 Days'],['quarter','Quarter'],['year','Year'],['all','All Time']];
  const sites   = ['All Sites', ...SITES.map(s=>s.name)];
  const species = ['All Species','Lion','Western Gorilla','Red Panda','Reticulated Python','King Penguin','American Alligator'];
  const types   = ['All Types','Physical Health','Behaviour','Nutrition','Environment','Mental Domain'];
  const statuses= ['All Status','Approved','Under Review','Draft','Rejected'];

  const chipRow = (key, opts)=>`<div class="recA2-fchips">${opts.map(o=>
    `<span class="recA2-fchip ${recA2Filters[key]===o?'on':''}" onclick="recA2SetFilter('${key}','${o.replace(/'/g,"\\'")}')">${o}</span>`).join('')}</div>`;

  return `<div class="sheet-grab"></div>
    <div class="sheet-head"><div><div class="sh-title">Filters</div>
      <div class="sh-sub">Refine the assessment register</div></div>
      <div class="sh-x" onclick="closeSheet()">${I.x}</div></div>

    <div class="recA2-fgrp">
      <div class="fg-lab">Date Range</div>
      <div class="range-seg" style="margin:0">${ranges.map(([k,l])=>
        `<button class="${recA2Filters.range===k?'on':''}" onclick="recA2SetFilter('range','${k}')">${l}</button>`).join('')}</div>

      <div class="fg-lab">Site</div>${chipRow('site', sites)}
      <div class="fg-lab">Species</div>${chipRow('species', species)}
      <div class="fg-lab">Assessment Type</div>${chipRow('type', types)}
      <div class="fg-lab">Status</div>${chipRow('status', statuses)}
    </div>

    <div class="sheet-actions">
      <button class="cancel" onclick="recA2Filters.range='30d';recA2Filters.site='All Sites';recA2Filters.species='All Species';recA2Filters.type='All Types';recA2Filters.status='All Status';recA2ApplyFilters()">Reset</button>
      <button class="confirm" onclick="recA2ApplyFilters()">Apply Filters</button>
    </div>`;
}

/* ============================================================= aaRecords === */
SCREENS.aaRecords = (params={}) => {
  const rows   = recA2All();
  const active = recA2ActiveChips();
  const rangeLabel = ({'7d':'7 Days','30d':'30 Days',quarter:'Quarter',year:'Year',all:'All Time'})[recA2Filters.range] || recA2Filters.range;

  return `<div class="screen active"><div class="scroll">
    ${aaHeader('aaRecords', {sub:'All assessment records'})}

    <!-- search + filter affordance -->
    <div class="recA2-tools">
      <div class="aa-search" onclick="openSheet(aaSearchSheet())">
        ${I.search}<span>Search assessment ID, animal, species, assessor…</span></div>
      <button class="recA2-filterbtn" onclick="openSheet(recA2FilterSheet())">
        ${I.grid}Filters${active.length?`<span class="badge-n">${active.length}</span>`:''}</button>
    </div>

    <!-- active filter chips -->
    ${active.length?`<div class="recA2-chips">
      ${active.map(c=>`<span class="recA2-chip" onclick="recA2ClearChip('${c.key}','${c.reset.replace(/'/g,"\\'")}')">${c.key==='range'?rangeLabel:c.label} ${I.x}</span>`).join('')}
    </div>`:''}

    <!-- count + list -->
    <div class="recA2-count"><span class="ttl">Records</span><span class="n">${rows.length} of ${rows.length+302} shown</span></div>

    <div class="recA2-list">
      ${rows.map(r=>{
        const a = getAnimal(r.animalId);
        const c = CATS[r.type];
        const site = recA2SiteFor(r.animalId);
        const scoreCol = welfareColor(r.score);
        const stCol = aaStatusColor(r.status), stBg = aaStatusBg(r.status);
        const sub = `${a.species} · ${c.name} · ${r.sub} · ${r.assessor} · ${site} · ${recA2Date(r.when)}`;
        return `<div class="recA2-row" onclick="go('aaRecordDetail',{id:'${r.id}'})">
          <div class="rw-main">
            <div class="rw-id">${r.id}</div>
            <div class="rw-name">${a.name}</div>
            <div class="rw-sub">${sub}</div>
          </div>
          <div class="rw-trail">
            <span class="rw-score" style="color:${scoreCol}">${r.score}</span>
            <span class="rw-pill" style="color:${stCol};background:${stBg}">${r.status}</span>
          </div>
        </div>`;
      }).join('')}
    </div>

    <div class="recA2-foot">Showing ${rows.length} of ${rows.length+302} records · tap any record for the full drill.</div>
    <div style="height:14px"></div>
  </div></div>`;
};

/* ======================================================= aaRecordDetail === */
SCREENS.aaRecordDetail = ({id}={}) => {
  const r = id ? recordById(id) : RECORDS[0];
  const a = getAnimal(r.animalId);
  const c = CATS[r.type];
  const approved = r.status === 'Approved';
  const rejected = r.status === 'Rejected';
  const scoreCol = r.pass ? welfareColor(r.score) : '#C76B4A';
  const stCol = aaStatusColor(r.status), stBg = aaStatusBg(r.status);
  const site = recA2SiteFor(r.animalId);

  /* assessment responses (item -> value) */
  const responses = [
    { name:'Body Condition', cat:'physical',  val:'5 / 9',  col:welfareColor(72) },
    { name:'Coat / Plumage', cat:'physical',  val:'Good',   col:welfareColor(100) },
    { name:'Activity Level', cat:'behaviour', val:'4 / 10', col:welfareColor(40) },
    { name:'Food Intake',    cat:'nutrition', val:'Normal', col:welfareColor(86) },
    { name:'Demeanour',      cat:'mental',    val:'Alert',  col:welfareColor(88) },
  ];

  /* domain contribution to computed score */
  const contrib = DOMAIN_ORDER.map(d=>({ d, name:CATS[d].name, raw:CATS[d].raw, val:a.welfare[d] }));

  /* tamper-evident audit trail */
  const reviewer = 'Dr. R. Mehta · Reviewer';
  const audit = [
    { t:'Created',      who:`${r.assessor} · ${r.role}`, time:r.when, col:c.raw, hash:'a91f…07c' },
    { t:'Submitted',    who:`${r.assessor}`,             time:r.when, col:'var(--primary)', hash:'3d22…b14' },
    { t:'Under Review', who:reviewer,
      time: approved||rejected ? '8 Jun 2026 · 6:05 PM' : 'Awaiting reviewer', col:'#C9A227', hash:'77ae…9f0' },
    { t: approved?'Approved & Locked' : rejected?'Rejected' : 'Pending Approval',
      who: approved||rejected ? reviewer : '—',
      time: approved?'8 Jun 2026 · 6:18 PM' : rejected?'8 Jun 2026 · 6:20 PM' : '—',
      col: approved?'#2FAE73' : rejected?'#E93353' : 'var(--label-tertiary)',
      hash: approved||rejected ? 'e5b0…d31' : '' },
  ];
  const lastDone = (approved||rejected) ? 3 : 1;

  const decTxt = approved?'Approved' : rejected?'Rejected' : 'Requested clarification';
  const decCol = approved?'#2FAE73' : rejected?'#E93353' : '#C9A227';
  const revCmt = approved
      ? 'Value verified against the capture sheet and prior trend. Cleared for record lock.'
      : rejected
      ? 'Reading inconsistent with capture notes. Returned to assessor for re-capture.'
      : 'Awaiting reviewer sign-off. Score below threshold pending confirmation.';

  /* ---- expandCard bodies ---- */
  const summaryBody = `<div class="field" style="margin:0">
      <div class="f-row"><span class="f-k">Type</span><span class="f-v" style="color:${c.color};font-weight:600">${c.name}</span></div>
      <div class="f-row"><span class="f-k">Sub-Type</span><span class="f-v">${r.sub}</span></div>
      <div class="f-row"><span class="f-k">Animal</span><span class="f-v">${a.name} · ${a.species}</span></div>
      <div class="f-row"><span class="f-k">Animal ID</span><span class="f-v">${a.id} · ${a.encl}</span></div>
      <div class="f-row"><span class="f-k">Assessor</span><span class="f-v">${r.assessor} · ${r.role}</span></div>
      <div class="f-row"><span class="f-k">Site</span><span class="f-v">${site}</span></div>
      <div class="f-row"><span class="f-k">Date &amp; Time</span><span class="f-v">${r.when}</span></div>
    </div>
    ${r.finding?`<div class="insight" style="background:rgba(199,107,74,.1);margin:12px 0 0">
      <span style="color:#C76B4A;width:18px;height:18px;flex:0 0 auto">${I.alert}</span>
      <span class="i-txt" style="color:#C76B4A"><b>Finding flagged.</b> ${r.finding}.</span></div>`:''}`;

  const responsesBody = responses.map(rp=>{const cc=CATS[rp.cat];return `<div class="recA2-resp">
      <span class="rp-ico" style="background:${cc.raw}1f;color:${cc.raw}">${cc.icon}</span>
      <div style="min-width:0"><div class="rp-name">${rp.name}</div><div class="rp-meta">${cc.name}</div></div>
      <span class="rp-val" style="color:${rp.col}">${rp.val}</span></div>`;}).join('');

  const resultsBody = `<div class="recA2-score">
      <span class="sc-v" style="color:${scoreCol}">${r.score}</span>
      <span class="sc-x">/ 100 · ${r.pass?'Pass':'Fail'} · ${welfareLabel(r.score)}</span></div>
    <div style="font-size:12.5px;color:var(--label-secondary);font-weight:600;margin-bottom:4px">Domain contribution</div>
    ${(()=>{const max=Math.max(...contrib.map(x=>x.val))||1;
      return contrib.map(x=>`<div class="recA2-dom">
        <span class="dm-name">${x.name}</span>
        <span class="dm-track"><span class="dm-fill" style="width:${Math.round(x.val/max*100)}%;background:${x.raw}"></span></span>
        <span class="dm-val" style="color:${x.raw}">${x.val}</span></div>`).join('');})()}`;

  const attachBody = `<div class="recA2-thumbs">
      <div class="recA2-thumb">${photoBox(a.name+'-photo',{size:66,radius:14})}<div class="rt-cap">Photo</div></div>
      <div class="recA2-thumb">${photoBox(r.sub+'-scan',{size:66,radius:14})}<div class="rt-cap">Lab report</div></div>
      <div class="recA2-thumb">${photoBox(r.id+'-chart',{size:66,radius:14})}<div class="rt-cap">Trend chart</div></div>
    </div>`;

  const reviewBody = `<div class="recA2-rev">
      <div class="rv-ico" style="background:${decCol}22;color:${decCol}">${approved?I.check:rejected?I.x:I.eye}</div>
      <div style="flex:1;min-width:0">
        <div class="rv-name">${reviewer.split(' · ')[0]}</div>
        <div class="rv-dec" style="color:${decCol}">${decTxt}</div>
        <div class="rv-cmt">${revCmt}</div>
        <div class="rv-time">${(approved||rejected)?'8 Jun 2026 · 6:18 PM':'Pending'}</div>
      </div></div>
    ${r.finding?`<div class="recA2-rev">
      <div class="rv-ico" style="background:rgba(199,107,74,.12);color:#C76B4A">${I.alert}</div>
      <div style="flex:1;min-width:0">
        <div class="rv-name">${r.assessor}</div>
        <div class="rv-dec" style="color:#C76B4A">Finding raised</div>
        <div class="rv-cmt">${r.finding}.</div>
        <div class="rv-time">${r.when}</div>
      </div></div>`:''}`;

  /* audit trail rendered as a tamper-evident timeline */
  const auditBody = `<div class="recA2-tl">${audit.map((s,i)=>{const done=i<=lastDone;return `
      <div class="recA2-tl-item">
        <span class="recA2-tl-dot" style="${done?`background:${s.col};border-color:${s.col}`:''}"></span>
        <div class="recA2-tl-t">${s.t}</div>
        <div class="recA2-tl-s">${s.who}</div>
        <div class="recA2-tl-time">${s.time}</div>
        ${done&&s.hash?`<div class="recA2-tl-hash">sha256 ${s.hash}</div>`:''}
      </div>`;}).join('')}</div>
    <div class="recA2-foot" style="padding:14px 0 0">${approved?'Record locked. Any change creates a new versioned entry in the audit trail.':'Audit entries are append-only and cryptographically chained.'}</div>`;

  return `<div class="screen active"><div class="scroll">
    ${appHeader('', {back:true, action:`<span class="hdr-ico">${I.pencil}</span>`})}
    <div class="page-hero">
      <div class="ph-title">${r.sub}</div>
      <div class="ph-sub" style="display:flex;align-items:center;gap:10px;margin-top:6px">
        <span class="recA2-hid">${r.id}</span>
        <span class="recA2-hpill" style="color:${stCol};background:${stBg}">${r.status}</span>
      </div>
    </div>

    <div class="k2" style="margin-top:8px">
      ${expandCard('summary',  c.icon,        c.raw,            'Assessment Summary',   `${a.name} · ${r.sub}`,                   summaryBody, true)}
      ${expandCard('responses',I.doc,         'var(--primary)', 'Assessment Responses', `${responses.length} items`,              responsesBody)}
      ${expandCard('results',  I.check,       scoreCol,         'Assessment Results',   `Score ${r.score} / 100 · ${r.pass?'Pass':'Fail'}`, resultsBody, true)}
      ${expandCard('attach',   I.photo,       'var(--secondary)','Attachments',         '3 files',                                attachBody)}
      ${expandCard('review',   I.eye,         decCol,           'Review Information',   decTxt,                                   reviewBody)}
      ${expandCard('audit',    I.clock,       '#C9A227',        'Audit Trail',          'tamper-evident',                         auditBody, true)}
    </div>

    <div style="height:10px"></div>
  </div></div>`;
};

registerModule({key:'aaRecords', label:'Assessment Records', sub:'Repository · search · filter · drill', group:'Executive', color:'var(--antz)', icon:I.doc});
registerModule({key:'aaRecordDetail', label:'Record Detail', sub:'Summary · responses · audit trail', group:'Executive', color:'var(--physical)', icon:I.doc, param:{id:'AS-100482'}});
