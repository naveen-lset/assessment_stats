/* ===========================================================================
   APPROVALS — assessment review & approval workflow (Master theme).
   Lifecycle: Submitted → Under Review → Approved / Rejected / Returned.
   Reviewer + e-signature + note → written to the record's review history & audit.
   =========================================================================== */
injectCSS('css-apr', `
  .apr-row{display:flex;align-items:center;gap:12px;padding:14px 0;border-top:1px solid var(--separator);}
  .apr-row:first-child{border-top:0;}
  .apr-body{flex:1;min-width:0;cursor:pointer;}
  .apr-name{font-size:15px;font-weight:700;}
  .apr-name .sc{font-size:12px;font-weight:700;margin-left:6px;}
  .apr-sub{font-size:12px;color:var(--label-secondary);margin-top:2px;}
  .apr-tag{display:inline-block;font-size:11px;font-weight:700;padding:2px 8px;border-radius:7px;margin-top:5px;}
  .apr-acts{display:flex;gap:8px;flex:0 0 auto;}
  .apr-btn{width:36px;height:36px;border-radius:11px;display:flex;align-items:center;justify-content:center;cursor:pointer;
    border:1px solid var(--hairline);background:var(--bg-elevated);}
  .apr-btn.ok{background:#37BD69;color:#fff;border-color:#37BD69;}
  .apr-btn.no{color:#E93353;}
  .apr-btn svg{width:17px;height:17px;}
  .apr-sumrow{display:flex;justify-content:space-between;padding:11px 0;border-top:1px solid var(--separator);font-size:14px;}
  .apr-sumrow:first-child{border-top:0;}
  .apr-sumrow .k{color:var(--label-secondary);} .apr-sumrow .v{font-weight:700;}
  .apr-esign{display:flex;align-items:center;gap:12px;background:var(--fill-quat);border-radius:12px;padding:13px 14px;margin:12px 16px;}
  .apr-esign .chk{width:26px;height:26px;border-radius:8px;background:#37BD69;color:#fff;display:flex;align-items:center;justify-content:center;flex:0 0 auto;}
  .apr-esign .chk svg{width:15px;height:15px;}
  .apr-esign .sig{flex:1;font-size:13px;color:var(--label-2);} .apr-esign .sig b{color:var(--label);}
  .apr-3{display:flex;gap:10px;padding:4px 16px 0;}
  .apr-3 button{flex:1;padding:14px 0;border-radius:14px;border:0;font-family:var(--font);font-size:15px;font-weight:700;cursor:pointer;}
  .apr-3 .rej{background:#FDE7EC;color:#E93353;} .apr-3 .ret{background:var(--fill-tert);color:var(--label-2);}
  .apr-3 .app{background:#37BD69;color:#fff;}
`);

let AA_APPR = {};                  // recordId -> 'approved' | 'rejected' | 'returned'
const PENDING = [
  {id:'AS-100490', animalId:'lion-1',     sub:'Weight',         type:'physical', value:'198 kg', score:88, pass:true,  assessor:'J. Alvarez', role:'Keeper',      when:'Today · 5:21 PM', finding:null},
  {id:'AS-100483', animalId:'redpanda-1', sub:'Activity Level', type:'behaviour',value:'4 / 10', score:40, pass:false, assessor:'J. Alvarez', role:'Keeper',      when:'Today · 4:02 PM', finding:'Activity below baseline'},
  {id:'AS-100488', animalId:'gorilla-2',  sub:'Body Condition', type:'physical', value:'4 / 9',  score:78, pass:true,  assessor:'S. Park',    role:'Biologist',   when:'Today · 2:40 PM', finding:null},
  {id:'AS-100479', animalId:'macaw-2',    sub:'Enrichment',     type:'behaviour',value:'82%',    score:82, pass:true,  assessor:'S. Park',    role:'Biologist',   when:'1d ago · 9:30 AM', finding:null},
  {id:'AS-100471', animalId:'penguin-1',  sub:'Diet Adherence', type:'nutrition',value:'Good',   score:85, pass:true,  assessor:'M. Chen',    role:'Curator',     when:'1d ago · 10:18 AM', finding:null},
];
function aprPending(){ return PENDING.filter(p=>!AA_APPR[p.id]); }
function aprDecided(){ return PENDING.filter(p=>AA_APPR[p.id]); }
function aprCount(kind){ return Object.values(AA_APPR).filter(v=>v===kind).length; }
function aprPendingCount(){ return aprPending().length; }
function aprDecide(id, kind){ AA_APPR[id]=kind; closeSheet(); render(); }

function aprStatusColor(k){ return k==='approved'?'#37BD69': k==='rejected'?'#E93353': k==='returned'?'#E4B819':'#7A8684'; }
function aprStatusLabel(k){ return k==='approved'?'Approved': k==='rejected'?'Rejected': k==='returned'?'Returned':'Pending'; }

SCREENS.aaApprovals = () => {
  const pend=aprPending();
  const pendRows = pend.map(p=>{const a=getAnimal(p.animalId);const c=CATS[p.type];return `
    <div class="apr-row">
      ${photoBox(a.name,{size:44,radius:12})}
      <div class="apr-body" onclick="openApproveSheet('${p.id}')">
        <div class="apr-name">${a.name} <span class="sc" style="color:${welfareColor(p.score)}">${p.value}</span></div>
        <div class="apr-sub">${p.sub} · ${p.assessor} · ${p.when}</div>
        ${p.finding?`<span class="apr-tag" style="background:#FDE7EC;color:#E93353">${p.finding}</span>`:''}
      </div>
      <div class="apr-acts">
        <div class="apr-btn no" onclick="aprDecide('${p.id}','rejected')">${I.x}</div>
        <div class="apr-btn ok" onclick="aprDecide('${p.id}','approved')">${I.check}</div>
      </div></div>`;}).join('');

  const decided=aprDecided();
  const decidedRows = decided.map(p=>{const a=getAnimal(p.animalId);const k=AA_APPR[p.id];return `
    <div class="m-row"><span class="m-dot" style="background:${aprStatusColor(k)}"></span>
      <span class="m-lab">${a.name} · ${p.sub}<span class="m-sub"> · ${p.assessor}</span></span>
      <span class="m-val" style="font-size:13px;font-weight:700;color:${aprStatusColor(k)}">${aprStatusLabel(k)}</span></div>`;}).join('');

  return `<div class="screen active"><div class="scroll">
    ${mBack('Approvals','Assessment review queue', {back:true})}
    ${mTabs([{count:pend.length,label:'Pending',key:'p',on:true},
             {count:aprCount('approved')+312,label:'Approved',key:'a'},
             {count:aprCount('rejected')+9,label:'Rejected',key:'r'}],'p')}

    ${pend.length
      ? mCard('Pending Review', pend.length+' awaiting your decision', mView(), pendRows)
      : `<div class="m-card" style="text-align:center;padding:34px 20px">
           <div style="font-size:34px">✓</div><div style="font-weight:700;margin-top:8px">All caught up</div>
           <div class="mc-s" style="margin-top:4px">No assessments awaiting review.</div></div>`}

    ${decided.length ? mCard('Recently Decided','This session', '', decidedRows) : ''}

    <div style="height:18px"></div>
  </div></div>`;
};

function openApproveSheet(id){
  const p=PENDING.find(x=>x.id===id); const a=getAnimal(p.animalId); const c=CATS[p.type];
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div><div class="sh-title">${p.sub}</div><div class="sh-sub">${a.name} · ${a.species} · ${p.id}</div></div>
      <div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div style="padding:0 16px">
      <div class="apr-sumrow"><span class="k">Result</span><span class="v" style="color:${welfareColor(p.score)}">${p.value} · ${p.pass?'Pass':'Fail'}</span></div>
      <div class="apr-sumrow"><span class="k">Assessor</span><span class="v">${p.assessor} · ${p.role}</span></div>
      <div class="apr-sumrow"><span class="k">Submitted</span><span class="v">${p.when}</span></div>
      ${p.finding?`<div class="apr-sumrow"><span class="k">Finding</span><span class="v" style="color:#E93353">${p.finding}</span></div>`:''}
    </div>
    <div class="entry-field" style="margin:12px 16px;min-height:54px;align-items:flex-start">Add review note…</div>
    <div class="apr-esign"><span class="chk">${I.check}</span><span class="sig">E-signature · <b>Dr. R. Mehta</b>, Veterinarian — I confirm this review</span></div>
    <div class="apr-3">
      <button class="rej" onclick="aprDecide('${p.id}','rejected')">Reject</button>
      <button class="ret" onclick="aprDecide('${p.id}','returned')">Return</button>
      <button class="app" onclick="aprDecide('${p.id}','approved')">Approve</button>
    </div>
    <div style="height:30px"></div>`);
}
