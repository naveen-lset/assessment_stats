/* ===========================================================================
   Assessment Module — shared runtime for the new enterprise screens.
   Loaded AFTER app.js, BEFORE the individual screen files.
   Provides: injectCSS, the MODULES registry + launcher, and shared enterprise
   mock data (sites, assessors, assessment records) so every screen is coherent.
   =========================================================================== */

/* one-time scoped CSS injection — agents pass token-based CSS only */
function injectCSS(id, css){
  if(document.getElementById(id)) return;
  const s=document.createElement('style'); s.id=id; s.textContent=css; document.head.appendChild(s);
}

/* registry the launcher reads; each screen file pushes its entry at load */
const MODULES = [];
function registerModule(m){ MODULES.push(m); }   // {key, label, sub, group, icon}

/* ---- shared enterprise mock data ----------------------------------------- */
const SITES = [
  { id:'s-riverside', name:'Riverside Zoo',     animals:412, welfare:84, completion:94, onTime:91, compliance:96, risk:6,  trend:[80,81,82,83,84,84,85] },
  { id:'s-highland',  name:'Highland Wildlife',  animals:286, welfare:79, completion:88, onTime:82, compliance:90, risk:11, trend:[82,81,80,79,79,78,79] },
  { id:'s-coastal',   name:'Coastal Aquarium',   animals:531, welfare:81, completion:90, onTime:86, compliance:92, risk:9,  trend:[78,79,80,80,81,81,81] },
  { id:'s-savanna',   name:'Savanna Park',       animals:198, welfare:72, completion:79, onTime:71, compliance:84, risk:18, trend:[76,75,74,73,72,72,72] },
  { id:'s-summit',    name:'Summit Conservancy',  animals:240, welfare:88, completion:97, onTime:95, compliance:98, risk:4,  trend:[85,86,86,87,88,88,88] },
];
const ASSESSORS = [
  { id:'a1', name:'Dr. R. Mehta',  role:'Veterinarian', throughput:142, onTime:96, rework:3,  findings:18 },
  { id:'a2', name:'Dr. L. Owens',  role:'Veterinarian', throughput:118, onTime:91, rework:6,  findings:12 },
  { id:'a3', name:'S. Park',       role:'Biologist',    throughput:97,  onTime:88, rework:9,  findings:7  },
  { id:'a4', name:'J. Alvarez',    role:'Keeper',       throughput:164, onTime:84, rework:12, findings:5  },
  { id:'a5', name:'M. Chen',       role:'Curator',      throughput:73,  onTime:93, rework:4,  findings:9  },
];
/* a few representative assessment records (for queue / record / review screens) */
const RECORDS = [
  { id:'AS-100482', animalId:'lion-1', sub:'Weight',        type:'physical',  response:'Numeric Value', value:'198 kg', score:88, pass:true,  status:'Approved',  assessor:'Dr. R. Mehta', role:'Veterinarian', when:'8 Jun 2026 · 5:21 PM', finding:null },
  { id:'AS-100483', animalId:'redpanda-1', sub:'Activity Level', type:'behaviour', response:'Numeric Scale', value:'4 / 10', score:40, pass:false, status:'Under Review', assessor:'J. Alvarez', role:'Keeper', when:'8 Jun 2026 · 4:02 PM', finding:'Activity below baseline' },
  { id:'AS-100481', animalId:'python-1', sub:'Body Condition', type:'physical', response:'Numeric Scale', value:'3 / 9', score:35, pass:false, status:'Approved', assessor:'Dr. L. Owens', role:'Veterinarian', when:'7 Jun 2026 · 11:14 AM', finding:'Underweight — target band 4–5' },
  { id:'AS-100480', animalId:'gorilla-1', sub:'Eye Condition', type:'physical', response:'List', value:'Good', score:100, pass:true, status:'Approved', assessor:'Dr. R. Mehta', role:'Veterinarian', when:'7 Jun 2026 · 9:40 AM', finding:null },
];
function recordById(id){ return RECORDS.find(r=>r.id===id) || RECORDS[0]; }

/* assessment lifecycle queue items (due / pending / overdue) */
const QUEUE = [
  { id:'q1', animalId:'python-1',   sub:'Body Condition', type:'physical', due:'Overdue · 21d', state:'overdue' },
  { id:'q2', animalId:'redpanda-1', sub:'Enrichment Response', type:'behaviour', due:'Overdue · 6d', state:'overdue' },
  { id:'q3', animalId:'lion-1',     sub:'Weight',         type:'physical',  due:'Due today',  state:'due' },
  { id:'q4', animalId:'macaw-1',    sub:'Food Intake',    type:'nutrition', due:'Due today',  state:'due' },
  { id:'q5', animalId:'gorilla-1',  sub:'Posture',        type:'physical',  due:'In 2 days',  state:'pending' },
  { id:'q6', animalId:'penguin-1',  sub:'Diet Adherence', type:'nutrition', due:'In 3 days',  state:'pending' },
];

/* ---- Module launcher screen (entry point to all new screens) ------------- */
SCREENS.modules = () => {
  const groups = {};
  MODULES.forEach(m=>{ (groups[m.group]=groups[m.group]||[]).push(m); });
  const order = ['Species','Animals & Capture','Executive'];
  let body='';
  order.filter(g=>groups[g]).forEach(g=>{
    body += `<div class="section-head"><h2>${g}</h2></div><div class="list">`;
    groups[g].forEach(m=>{
      body += `<div class="row" onclick="go('${m.key}'${m.param?","+JSON.stringify(m.param):''})">
        <div class="r-icon" style="background:${m.color||'var(--antz)'}">${m.icon||I.grid}</div>
        <div class="r-body"><div class="r-title">${m.label}</div><div class="r-sub">${m.sub||''}</div></div>
        <div class="r-trail"><span class="chev">${I.chevron}</span></div></div>`;
    });
    body += `</div>`;
  });
  return `<div class="screen active"><div class="scroll">
    ${tabHeader('Modules', 'Assessment management · all screens')}
    <div class="note" style="padding:4px 24px 10px">End-to-end enterprise flows. Tap any screen.</div>
    ${body || '<div class="empty"><div class="e-title">No modules registered</div></div>'}
  </div></div>`;
};
