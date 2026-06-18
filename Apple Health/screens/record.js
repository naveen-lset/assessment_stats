/* Assessment Record + Review/Approve — Phase 2 "Animals & Capture".
   Reuses: appHeader, page-hero, photoBox, welfareColor, openSheet/closeSheet,
   .field/.f-row, .insight, .badge, .acard, .sheet-* , I icons, RECORDS, recordById, getAnimal.
   Custom CSS (prefix rec): vertical audit timeline only. */

injectCSS('css-rec', `
  .rec-audit{position:relative;padding:6px 0 2px 0}
  .rec-step{position:relative;padding:0 0 22px 34px}
  .rec-step:last-child{padding-bottom:2px}
  .rec-step::before{content:"";position:absolute;left:8px;top:18px;bottom:-4px;width:2px;background:var(--separator)}
  .rec-step:last-child::before{display:none}
  .rec-dot{position:absolute;left:2px;top:3px;width:14px;height:14px;border-radius:50%;
    border:3px solid var(--bg-elevated);box-shadow:0 0 0 1.5px var(--separator)}
  .rec-step.done .rec-dot{box-shadow:0 0 0 1.5px transparent}
  .rec-st-title{font-size:15px;font-weight:700;color:var(--label)}
  .rec-st-meta{font-size:12.5px;color:var(--label-secondary);margin-top:2px}
  .rec-st-time{font-size:12px;color:var(--label-tertiary);margin-top:2px}
  .rec-thumbs{display:flex;gap:10px;margin:0 16px 14px}
  .rec-thumb{text-align:center}
  .rec-thumb .rec-cap{font-size:11.5px;color:var(--label-secondary);margin-top:5px}
  .rec-pill{display:inline-block;font-size:12px;font-weight:800;padding:3px 9px;border-radius:20px;color:#fff;vertical-align:middle}
  .rec-rev{display:flex;gap:12px;align-items:flex-start;background:var(--bg-elevated);
    border-radius:var(--radius);box-shadow:var(--shadow);margin:0 16px 11px;padding:13px 15px}
  .rec-rev .rv-ico{width:36px;height:36px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex:0 0 auto}
  .rec-rev .rv-ico svg{width:18px;height:18px}
  .rec-rev .rv-name{font-size:15px;font-weight:700}
  .rec-rev .rv-dec{font-size:13px;margin-top:1px;font-weight:600}
  .rec-rev .rv-cmt{font-size:13px;color:var(--label-secondary);margin-top:3px;line-height:1.4}
  .rec-rev .rv-time{font-size:12px;color:var(--label-tertiary);margin-top:4px}
  .rec-chip{font-size:12px;font-weight:700;padding:4px 10px;border-radius:20px;flex:0 0 auto}
  .rec-esign{font-size:12.5px;color:var(--label-secondary);text-align:center;padding:10px 18px 2px;line-height:1.45}
`);

/* records the review queue treats as pending, plus a couple extra for volume */
function recPending(){
  const ids = RECORDS.filter(r=>r.status==='Under Review').concat(RECORDS.filter(r=>r.status!=='Under Review').slice(0,2));
  return ids;
}

/* build + open the review sheet for a record */
function recReviewSheet(id){
  const r = recordById(id);
  const a = getAnimal(r.animalId);
  const c = CATS[r.type];
  const col = r.pass ? welfareColor(r.score) : '#C76B4A';
  const clinical = r.type==='physical';
  openSheet(`
    <div class="sheet-grab"></div>
    <div class="sheet-head">
      <div><div class="sh-title">Review · ${r.sub}</div><div class="sh-sub">${a.name} · ${r.id}</div></div>
      <div class="sh-x" onclick="closeSheet()">${I.x}</div>
    </div>
    <div class="field" style="margin:0 16px 12px">
      <div class="f-row"><span class="f-k">Type</span><span class="f-v" style="color:${c.color};font-weight:600">${c.name}</span></div>
      <div class="f-row"><span class="f-k">Sub-Type</span><span class="f-v">${r.sub}</span></div>
      <div class="f-row"><span class="f-k">Value</span><span class="f-v">${r.value}</span></div>
      <div class="f-row"><span class="f-k">Score</span><span class="f-v">${r.score} <span class="rec-pill" style="background:${col}">${r.pass?'Pass':'Fail'}</span></span></div>
      <div class="f-row"><span class="f-k">Assessor</span><span class="f-v">${r.assessor} · ${r.role}</span></div>
      <div class="f-row"><span class="f-k">Captured</span><span class="f-v">${r.when}</span></div>
    </div>
    ${r.finding?`<div class="insight" style="background:rgba(199,107,74,.1);margin:0 16px 12px">
      <span style="color:#C76B4A;width:18px;height:18px;flex:0 0 auto">${I.alert}</span>
      <span class="i-txt" style="color:#C76B4A">${r.finding}</span></div>`:''}
    ${clinical?`<div class="rec-esign">${I.alert} Clinical sub-types require e-signature to approve.</div>`:''}
    <div class="sheet-actions">
      <button class="cancel" onclick="closeSheet()">Reject</button>
      <button class="confirm" onclick="closeSheet()">${clinical?'Sign & Approve':'Approve'}</button>
    </div>
    <div class="rec-esign" style="padding-top:12px"><span onclick="closeSheet();go('recDetail',{id:'${r.id}'})" style="color:var(--antz);font-weight:600;cursor:pointer">View full record</span></div>
  `);
}

/* =========================================================== recDetail === */
SCREENS.recDetail = (params={}) => {
  const r = params.id ? recordById(params.id) : RECORDS[0];
  const a = getAnimal(r.animalId);
  const c = CATS[r.type];
  const approved = r.status==='Approved';
  const scoreCol = r.pass ? welfareColor(r.score) : '#C76B4A';

  // audit trail — derived, stable per-record
  const audit = [
    { t:'Created',           who:`${r.assessor} · ${r.role}`, time:r.when, col:c.raw },
    { t:'Submitted',         who:`${r.assessor}`,             time:r.when, col:'var(--antz)' },
    { t:'Under Review',      who:'Dr. R. Mehta · Reviewer',   time:approved?'8 Jun 2026 · 6:05 PM':'Awaiting reviewer', col:'#C9A227' },
    { t:approved?'Approved & Locked':'Pending Approval', who:approved?'Dr. R. Mehta · Reviewer':'—', time:approved?'8 Jun 2026 · 6:18 PM':'—', col:approved?'#2FAE73':'var(--label-tertiary)' },
  ];
  const lastDone = approved ? 3 : 1;

  return `<div class="screen active"><div class="scroll">
    ${appHeader('', {back:true, action:`<span class="hdr-ico">${I.pencil}</span>`})}
    <div class="page-hero">
      <div class="ph-title">${r.sub}</div>
      <div class="ph-sub" style="display:flex;align-items:center;gap:10px;margin-top:6px">
        <span style="font-weight:700;letter-spacing:.3px;color:var(--label-2)">${r.id}</span>
        <span class="badge${approved?' active':''}">${r.status}</span>
      </div>
    </div>

    <div class="section-head"><h2>Details</h2></div>
    <div class="field">
      <div class="f-row"><span class="f-k">Type</span><span class="f-v" style="color:${c.color};font-weight:600">${c.name}</span></div>
      <div class="f-row"><span class="f-k">Sub-Type</span><span class="f-v">${r.sub}</span></div>
      <div class="f-row"><span class="f-k">Response</span><span class="f-v">${r.response}</span></div>
      <div class="f-row"><span class="f-k">Value</span><span class="f-v">${r.value}</span></div>
      <div class="f-row"><span class="f-k">Score</span><span class="f-v">${r.score} <span class="rec-pill" style="background:${scoreCol}">${r.pass?'Pass':'Fail'}</span></span></div>
      <div class="f-row"><span class="f-k">Assessor</span><span class="f-v">${r.assessor}</span></div>
      <div class="f-row"><span class="f-k">Role</span><span class="f-v">${r.role}</span></div>
      <div class="f-row"><span class="f-k">Date &amp; Time</span><span class="f-v">${r.when}</span></div>
    </div>

    ${r.finding?`<div class="insight" style="background:rgba(199,107,74,.1);margin:2px 16px 14px">
      <span style="color:#C76B4A;width:18px;height:18px;flex:0 0 auto">${I.alert}</span>
      <span class="i-txt" style="color:#C76B4A"><b>Finding flagged.</b> ${r.finding}</span></div>`:''}

    <div class="section-head"><h2>Attachments</h2><span class="muted" style="font-size:14px">3 files</span></div>
    <div class="rec-thumbs">
      <div class="rec-thumb">${photoBox(a.name+'-photo',{size:64,radius:14})}<div class="rec-cap">Photo</div></div>
      <div class="rec-thumb">${photoBox(r.sub+'-scan',{size:64,radius:14})}<div class="rec-cap">Lab report</div></div>
      <div class="rec-thumb">${photoBox(r.id+'-chart',{size:64,radius:14})}<div class="rec-cap">Chart</div></div>
    </div>

    <div class="section-head"><h2>Notes</h2></div>
    <div class="card card-pad" style="font-size:14.5px;color:var(--label-2);line-height:1.5">
      ${r.sub} captured during routine assessment for ${a.name} (${a.species}). ${r.finding?`Reviewer flagged: ${r.finding.toLowerCase()}. Recommend follow-up within 7 days.`:'Reading within expected range; no action required. Next check per schedule.'}
    </div>

    <div class="section-head"><h2>Audit Trail</h2><span class="muted" style="font-size:14px">tamper-evident</span></div>
    <div class="card card-pad">
      <div class="rec-audit">
        ${audit.map((s,i)=>{const done=i<=lastDone;return `<div class="rec-step ${done?'done':''}">
          <span class="rec-dot" style="background:${done?s.col:'var(--fill-tert)'}"></span>
          <div class="rec-st-title">${s.t}</div>
          <div class="rec-st-meta">${s.who}</div>
          <div class="rec-st-time">${s.time}</div>
        </div>`;}).join('')}
      </div>
    </div>

    <div class="section-head"><h2>Review History</h2></div>
    <div class="rec-rev">
      <div class="rv-ico" style="background:rgba(47,174,115,.14);color:var(--environment)">${I.eye}</div>
      <div style="flex:1;min-width:0">
        <div class="rv-name">Dr. R. Mehta</div>
        <div class="rv-dec" style="color:${approved?'#2FAE73':'#C9A227'}">${approved?'Approved':'Requested clarification'}</div>
        <div class="rv-cmt">${approved?'Value verified against capture sheet and prior trend. Cleared for record lock.':'Awaiting reviewer sign-off. Score below threshold pending confirmation.'}</div>
        <div class="rv-time">${approved?'8 Jun 2026 · 6:18 PM':'8 Jun 2026 · 4:30 PM'}</div>
      </div>
    </div>
    ${r.finding?`<div class="rec-rev">
      <div class="rv-ico" style="background:rgba(199,107,74,.12);color:#C76B4A">${I.alert}</div>
      <div style="flex:1;min-width:0">
        <div class="rv-name">${r.assessor}</div>
        <div class="rv-dec" style="color:#C76B4A">Finding raised</div>
        <div class="rv-cmt">${r.finding}.</div>
        <div class="rv-time">${r.when}</div>
      </div>
    </div>`:''}

    <div style="height:8px"></div>
  </div></div>`;
};

/* =========================================================== recReview === */
SCREENS.recReview = () => {
  const list = recPending();
  return `<div class="screen active"><div class="scroll">
    ${tabHeader('Review Queue','Awaiting approval')}
    <div class="section-head"><h2>Pending</h2><span class="muted" style="font-size:15px">${list.length}</span></div>
    ${list.map(r=>{
      const a = getAnimal(r.animalId);
      const c = CATS[r.type];
      const pending = r.status==='Under Review';
      const chipCol = pending ? '#C9A227' : (r.pass?'#2FAE73':'#C76B4A');
      const chipBg  = pending ? 'rgba(201,162,39,.16)' : (r.pass?'rgba(47,174,115,.16)':'rgba(199,107,74,.16)');
      const chipTxt = pending ? 'Under Review' : (r.pass?'Pass · '+r.score:'Fail · '+r.score);
      return `<div class="acard" onclick="recReviewSheet('${r.id}')">
        ${photoBox(a.name,{size:44,radius:12})}
        <div class="ac-body">
          <div class="ac-name">${a.name} · ${r.sub}</div>
          <div class="ac-sub"><span style="color:${c.color};font-weight:600">${c.name}</span> · ${r.assessor}</div>
        </div>
        <span class="rec-chip" style="background:${chipBg};color:${chipCol}">${chipTxt}</span>
        <span class="chev" style="color:var(--label-tertiary);margin-left:8px">${I.chevron}</span>
      </div>`;
    }).join('')}
    <div class="rec-esign">Tap a record to review. Clinical sub-types require e-signature.</div>
    <div style="height:8px"></div>
  </div></div>`;
};

registerModule({key:'recDetail', label:'Assessment Record', sub:'Detail · attachments · audit trail', group:'Animals & Capture', color:'var(--physical)', icon:I.doc, param:{id:'AS-100482'}});
registerModule({key:'recReview', label:'Review & Approve', sub:'Approval workflow · e-sign', group:'Animals & Capture', color:'var(--mental)', icon:I.check});
