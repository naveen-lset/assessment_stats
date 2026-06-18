/* ===========================================================================
   Antz Welfare — Index 2 · Assessment Planning (Schedule tab)
   Loaded AFTER app2-analytics.js. Reuses its kit (I2, go2/back2, render2,
   openSheet2/closeSheet2) so Schedule looks like a native part of the module.

   Layout (plan-first, NOT a calendar / task app):
     1. Access toggle (demo) — Edit vs View-only permission
     2. Assessment Calendar — lightweight month grid w/ category indicator dots;
        tapping a date opens a BOTTOM SHEET of that day's assessments
     3. "Schedule Assessment" CTA → create BOTTOM SHEET (editors only)
     4. Upcoming Assessments — plan cards grouped Today/Tomorrow/This Week/Upcoming

   A plan = ONE Assessment Category + one-or-MORE Assessment Types on a
   date/time. Category + Types are chosen with DROPDOWNS (not chips).

   Planning only. NO assigned user / owner / approval workflow, NO task-style
   status pills. Assessment RECORDS keep no status lifecycle. Permission here
   is a simple capability gate (can-edit vs view-only), not ownership.
   =========================================================================== */

/* fixed demo "now" so relative labels (Today / Tomorrow) stay deterministic */
const SCH_TODAY = new Date(2026, 5, 18);              // Thu 18 Jun 2026
const SCH_MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SCH_MON_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SCH_DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SCH_DOW_FULL = { Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday' };

/* Five-Domains assessment catalogue: Category → its Assessment Types.
   Colours drawn from the existing module palette for visual consistency. */
const SCH_CATS = [
  { cat: 'Physical Health', color: '#FA6140', types: ['Eye Condition', 'Posture', 'Body Condition', 'Weight', 'Temperature'] },
  { cat: 'Behaviour',       color: '#8479F9', types: ['Activity Level', 'Social Behaviour', 'Enrichment Response'] },
  { cat: 'Environment',     color: '#00AFD6', types: ['Enclosure Condition', 'Habitat Monitoring', 'Temperature Monitoring'] },
  { cat: 'Nutrition',       color: '#37BD69', types: ['Diet Review', 'Food Intake', 'Hydration', 'Body Weight Trend'] },
  { cat: 'Mental Domain',   color: '#E4A11B', types: ['Enrichment Response', 'Stress Indicators', 'Cognitive Engagement'] },
];
function schCat(name) { return SCH_CATS.find(c => c.cat === name); }
function schCatColor(name) { const c = schCat(name); return c ? c.color : '#7A8684'; }

/* Response Type is an intrinsic property of each Assessment Type (same
   vocabulary as the Analytics module: numeric / scale / list / text). It is
   AUTO-MAPPED from the chosen type and NEVER shown during scheduling — the
   user only picks the assessment type; how it is answered is predetermined. */
const SCH_TYPE_RT = {
  'Eye Condition': 'list',        'Posture': 'list',          'Body Condition': 'scale',
  'Weight': 'numeric',            'Temperature': 'numeric',   'Activity Level': 'scale',
  'Social Behaviour': 'list',     'Enrichment Response': 'scale',
  'Enclosure Condition': 'list',  'Habitat Monitoring': 'list', 'Temperature Monitoring': 'numeric',
  'Diet Review': 'text',          'Food Intake': 'numeric',   'Hydration': 'scale', 'Body Weight Trend': 'numeric',
  'Stress Indicators': 'scale',   'Cognitive Engagement': 'scale',
};
function schTypeRT(t) { return SCH_TYPE_RT[t] || 'text'; }
/* { typeName: responseType } for a set of selected types — stored on the plan */
function schMapResponses(types) {
  const m = {}; types.forEach(t => { m[t] = schTypeRT(t); }); return m;
}

const SCH_REPEATS = ['One Time', 'Weekly', 'Monthly', 'Custom'];

/* ---- permission (demo capability gate) ----------------------------------- */
let SCH_ROLE = 'editor';                              // 'editor' | 'viewer'
function schCanEdit() { return SCH_ROLE === 'editor'; }
function setSchRole(r) { SCH_ROLE = r; render2(); }

/* ---- date helpers -------------------------------------------------------- */
function schD(y, m, d) { return new Date(y, m, d); }
function schYmd(d) { return d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate(); }
function ymdToDate(ymd) { return new Date(Math.floor(ymd / 10000), Math.floor(ymd / 100) % 100, ymd % 100); }
function schDaysBetween(a, b) {
  const ms = schD(b.getFullYear(), b.getMonth(), b.getDate()) - schD(a.getFullYear(), a.getMonth(), a.getDate());
  return Math.round(ms / 86400000);
}
function schFmt(d) { return `${d.getDate()} ${SCH_MON[d.getMonth()]} ${d.getFullYear()}`; }
function schRel(d) {
  const diff = schDaysBetween(SCH_TODAY, d);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return schFmt(d);
}
function schTimeMin(t) {
  const m = /(\d+):(\d+)\s*(AM|PM)/i.exec(t || ''); if (!m) return 0;
  let h = +m[1] % 12; if (/PM/i.test(m[3])) h += 12;
  return h * 60 + +m[2];
}
function schIso(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function schIsoNext() { return schIso(new Date(2026, 5, 19)); }    // default new-plan date = tomorrow
function sch12h(t) {
  const [hh, mm] = (t || '09:00').split(':').map(Number);
  const ap = hh >= 12 ? 'PM' : 'AM', h = ((hh + 11) % 12) + 1;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')} ${ap}`;
}
function sch24h(t) {
  const m = /(\d+):(\d+)\s*(AM|PM)/i.exec(t || ''); if (!m) return '09:00';
  let h = +m[1] % 12; if (/PM/i.test(m[3])) h += 12;
  return `${String(h).padStart(2, '0')}:${m[2]}`;
}

/* ---- planned assessment PLANS (mutable; the form edits this) -------------- */
let SCH_SEQ = 100;
const SCHEDULE = [
  { id: 'SP-1', cat: 'Physical Health', types: ['Eye Condition', 'Posture', 'Weight'],        date: schD(2026, 5, 18), time: '10:00 AM', repeat: 'Weekly',  notes: 'Routine welfare check before enrichment session.' },
  { id: 'SP-2', cat: 'Behaviour',       types: ['Activity Level', 'Social Behaviour'],        date: schD(2026, 5, 18), time: '02:30 PM', repeat: 'One Time', notes: '' },
  { id: 'SP-3', cat: 'Nutrition',       types: ['Diet Review'],                                date: schD(2026, 5, 19), time: '08:00 AM', repeat: 'Monthly', notes: '' },
  { id: 'SP-4', cat: 'Environment',     types: ['Enclosure Condition', 'Habitat Monitoring'],  date: schD(2026, 5, 22), time: '11:00 AM', repeat: 'Weekly',  notes: '' },
  { id: 'SP-5', cat: 'Physical Health', types: ['Body Condition', 'Temperature'],              date: schD(2026, 5, 25), time: '09:00 AM', repeat: 'Monthly', notes: '' },
  { id: 'SP-6', cat: 'Behaviour',       types: ['Activity Level', 'Social Behaviour'],         date: schD(2026, 5, 28), time: '09:00 AM', repeat: 'Weekly',  notes: '' },
  { id: 'SP-7', cat: 'Mental Domain',   types: ['Enrichment Response'],                        date: schD(2026, 5, 30), time: '03:00 PM', repeat: 'One Time', notes: '' },
  { id: 'SP-8', cat: 'Behaviour',       types: ['Activity Level', 'Enrichment Response'],      date: schD(2026, 6, 4),  time: '09:00 AM', repeat: 'Weekly',  notes: '' },
];
/* auto-map each plan's response types (hidden — for downstream record creation) */
SCHEDULE.forEach(p => { p.responseTypes = schMapResponses(p.types); });

function schSorted() {
  return SCHEDULE.slice().sort((p, q) => schYmd(p.date) - schYmd(q.date) || schTimeMin(p.time) - schTimeMin(q.time));
}
const SCH_BUCKETS = ['Today', 'Tomorrow', 'This Week', 'Upcoming'];
function schBucket(it) {
  const diff = schDaysBetween(SCH_TODAY, it.date);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff <= 7) return 'This Week';
  return 'Upcoming';
}
function schRepeatLabel(it) {
  if (it.repeat === 'Custom' && it.everyDays) return `Every ${it.everyDays} days`;
  if (it.repeat === 'Weekly') return `Every ${SCH_DOW_FULL[SCH_DOW[it.date.getDay()]]}`;
  return it.repeat;
}

/* ===========================================================================
   SCHEDULE TAB BODY
   =========================================================================== */
function aaSchedule() {
  const canEdit = schCanEdit();
  const role = `<div class="sch-role">
    <span class="sch-role-l">Your access</span>
    <div class="sch-role-seg">
      <button class="${SCH_ROLE === 'editor' ? 'active' : ''}" onclick="setSchRole('editor')">Can Edit</button>
      <button class="${SCH_ROLE === 'viewer' ? 'active' : ''}" onclick="setSchRole('viewer')">View Only</button>
    </div>
  </div>`;
  const cta = canEdit
    ? `<button class="sch-cta" onclick="schOpenForm()">${SCH_PLUS}<span>Schedule Assessment</span></button>` : '';
  return `${role}${schCalCard()}${cta}${schUpcomingSection()}`;
}

/* ---- Assessment Calendar (lightweight month grid) ------------------------ */
let SCH_CAL = { y: 2026, m: 5 };                      // visible month (Jun 2026)
function schPrevMonth() { SCH_CAL.m--; if (SCH_CAL.m < 0) { SCH_CAL.m = 11; SCH_CAL.y--; } render2(); }
function schNextMonth() { SCH_CAL.m++; if (SCH_CAL.m > 11) { SCH_CAL.m = 0; SCH_CAL.y++; } render2(); }

function schCalCard() {
  const { y, m } = SCH_CAL;
  const startDow = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
  const byDay = {};
  SCHEDULE.forEach(it => {
    if (it.date.getFullYear() === y && it.date.getMonth() === m)
      (byDay[it.date.getDate()] = byDay[it.date.getDate()] || []).push(it);
  });

  let cells = '';
  for (let i = 0; i < startDow; i++) cells += `<div class="sch-cell empty"></div>`;
  for (let d = 1; d <= days; d++) {
    const ymd = y * 10000 + m * 100 + d;
    const isToday = ymd === schYmd(SCH_TODAY);
    const items = byDay[d] || [];
    const cats = [...new Set(items.map(it => it.cat))].slice(0, 3);
    const dots = cats.map(c => `<i style="background:${schCatColor(c)}"></i>`).join('');
    cells += `<button class="sch-cell ${isToday ? 'today' : ''} ${items.length ? 'has' : ''}" onclick="schOpenDay(${ymd})">
      <span class="sch-cell-n">${d}</span><span class="sch-cell-dots">${dots}</span></button>`;
  }
  const legend = SCH_CATS.map(c => `<span class="sch-lg"><i style="background:${c.color}"></i>${c.cat}</span>`).join('');

  return `<div class="sch-cal-card">
    <div class="sch-cal-head">
      <div class="sch-cal-title">${SCH_MON_FULL[m]} ${y}</div>
      <div class="sch-cal-nav-wrap">
        <button class="sch-cal-nav" onclick="schPrevMonth()" aria-label="Previous month">${I2.back}</button>
        <button class="sch-cal-nav flip" onclick="schNextMonth()" aria-label="Next month">${I2.back}</button>
      </div>
    </div>
    <div class="sch-cal-dow">${SCH_DOW.map(d => `<span>${d[0]}</span>`).join('')}</div>
    <div class="sch-cal-grid">${cells}</div>
    <div class="sch-cal-legend">${legend}</div>
  </div>`;
}

/* ---- Upcoming Assessments (plan cards, grouped by time bucket) ----------- */
function schPlanCard(it) {
  const chips = it.types.map(t => `<span class="sch-tchip">${t}</span>`).join('');
  const rep = it.repeat && it.repeat !== 'One Time' ? ` · ${schRepeatLabel(it)}` : '';
  const n = it.types.length;
  return `<button class="sch-plan" style="--cat:${schCatColor(it.cat)}" onclick="schOpenDay(${schYmd(it.date)})">
    <div class="sch-plan-head">
      <span class="sch-plan-cat"><span class="sch-cat-dot"></span>${it.cat}</span>
      <span class="sch-plan-date">${schFmt(it.date)} • ${it.time}</span>
    </div>
    <div class="sch-plan-types">${chips}</div>
    <div class="sch-plan-foot">${SCH_LAYERS}<span>${n} Assessment ${n === 1 ? 'Type' : 'Types'}${rep}</span></div>
  </button>`;
}
function schUpcomingSection() {
  const items = schSorted();
  const intro = `<div class="sch-intro" id="schUpcoming">
    <div class="sch-intro-t">Upcoming Assessments</div>
    <div class="sch-intro-s">${items.length} assessment ${items.length === 1 ? 'plan' : 'plans'} scheduled for this animal</div>
  </div>`;
  const groups = SCH_BUCKETS
    .map(b => ({ b, items: items.filter(it => schBucket(it) === b) }))
    .filter(g => g.items.length);
  const list = groups.length ? groups.map(g => `
    <div class="sch-grp">
      <div class="sch-grp-head"><span class="sch-grp-label">${g.b}</span><span class="sch-grp-n">${g.items.length}</span></div>
      <div class="sch-grp-items">${g.items.map(schPlanCard).join('')}</div>
    </div>`).join('')
    : `<div class="sch-empty">${SCH_CAL_BIG}
        <div class="sch-empty-t">No assessments planned</div>
        <div class="sch-empty-s">Plan future welfare assessments for this animal to see them here.</div></div>`;
  return `${intro}${list}`;
}

/* ===========================================================================
   CALENDAR-DATE BOTTOM SHEET — assessments scheduled for one day
   Editors: Edit / Delete per plan + Add Assessment.  Viewers: read-only.
   =========================================================================== */
let SCH_SHEET_DAY = null;
function schOpenDay(ymd) { SCH_SHEET_DAY = ymd; openSheet2(schDaySheetHTML(ymd)); }
function schRefreshDaySheet() { const h = document.getElementById('schDayBody'); if (h) h.innerHTML = schDayInner(SCH_SHEET_DAY); }
function schDaySheetHTML(ymd) {
  return `<div class="ms-head"><div class="ms-title">${schFmt(ymdToDate(ymd))}</div><button class="ms-x" onclick="closeSheet2()">✕</button></div>
    <div class="sch-day" id="schDayBody">${schDayInner(ymd)}</div>`;
}
function schDayInner(ymd) {
  const date = ymdToDate(ymd), canEdit = schCanEdit();
  const plans = SCHEDULE.filter(p => schYmd(p.date) === ymd).sort((a, b) => schTimeMin(a.time) - schTimeMin(b.time));
  const rel = schRel(date);
  const sub = `<div class="sch-day-sub">${rel !== schFmt(date) ? rel + ' · ' : ''}${plans.length} ${plans.length === 1 ? 'assessment plan' : 'assessment plans'}</div>`;

  if (!plans.length) {
    return `${sub}
      <div class="sch-day-empty">${SCH_CAL_BIG}
        <div class="sch-empty-t">No assessments scheduled</div>
        <div class="sch-empty-s">${canEdit ? 'Plan an assessment for this day.' : 'Nothing planned for this day.'}</div></div>
      ${canEdit ? `<button class="sch-cta sch-day-add" onclick="schAddOnDay(${ymd})">${SCH_PLUS}<span>Add Assessment</span></button>` : ''}`;
  }

  const blocks = plans.map(p => {
    const chips = p.types.map(t => `<span class="sch-tchip">${t}</span>`).join('');
    const rep = p.repeat && p.repeat !== 'One Time' ? ` · ${schRepeatLabel(p)}` : '';
    const actions = canEdit ? `<div class="sch-dp-actions">
        <button class="sch-ghost" onclick="schEditPlan('${p.id}')">${I2.pencil}<span>Edit</span></button>
        <button class="sch-ghost danger" onclick="schDeletePlan('${p.id}')">${SCH_TRASH}<span>Delete</span></button></div>` : '';
    return `<div class="sch-day-plan" style="--cat:${schCatColor(p.cat)}">
      <div class="sch-dp-head">
        <span class="sch-dp-cat"><span class="sch-cat-dot"></span>${p.cat}</span>
        <span class="sch-dp-time">${SCH_CLOCK}${p.time}</span>
      </div>
      <div class="sch-plan-types">${chips}</div>
      <div class="sch-dp-foot">${p.types.length} Assessment ${p.types.length === 1 ? 'Type' : 'Types'}${rep}</div>
      ${actions}</div>`;
  }).join('');

  const add = canEdit ? `<button class="sch-cta sch-day-add" onclick="schAddOnDay(${ymd})">${SCH_PLUS}<span>Add Assessment</span></button>` : '';
  return `${sub}<div class="sch-day-list">${blocks}</div>${add}`;
}
function schAddOnDay(ymd) { schOpenForm({ date: schIso(ymdToDate(ymd)) }); }
function schDeletePlan(id) {
  const i = SCHEDULE.findIndex(x => x.id === id);
  if (i >= 0) SCHEDULE.splice(i, 1);
  render2();
  schRefreshDaySheet();
}
function schEditPlan(id) {
  const it = SCHEDULE.find(x => x.id === id); if (!it) return;
  schOpenForm({ editId: id, cat: it.cat, types: it.types, date: schIso(it.date),
    time: sch24h(it.time), repeat: it.repeat, everyDays: it.everyDays, notes: it.notes });
}

/* ===========================================================================
   CREATE / EDIT BOTTOM SHEET — single scrollable form
   Category (dropdown) → Types (multi-select dropdown) → Date → Time
   → Repeat (optional) → Notes (optional) → Save
   =========================================================================== */
let SCH_FORM = null;
function schOpenForm(prefill) {
  prefill = prefill || {};
  SCH_FORM = {
    editId: prefill.editId || null,
    cat: prefill.cat || null,
    types: prefill.types ? prefill.types.slice() : [],
    typesOpen: false,
    date: prefill.date || schIsoNext(),
    time: prefill.time || '09:00',
    repeat: prefill.repeat || 'One Time',
    everyDays: prefill.everyDays || 7,
    notes: prefill.notes || '',
  };
  openSheet2(schFormHTML());
}
function schFormHTML() {
  const title = SCH_FORM.editId ? 'Edit Schedule' : 'Schedule Assessment';
  return `<div class="ms-head"><div class="ms-title">${title}</div><button class="ms-x" onclick="closeSheet2()">✕</button></div>
    <div class="sch-form" id="schFormBody">${schFormInner()}</div>`;
}
function schRefreshForm() { const h = document.getElementById('schFormBody'); if (h) h.innerHTML = schFormInner(); }

/* ---- form state mutators ------------------------------------------------- */
function schSetCat(v) { if (SCH_FORM.cat !== v) SCH_FORM.types = []; SCH_FORM.cat = v; SCH_FORM.typesOpen = !!v; schRefreshForm(); }
function schToggleTypesDD() { if (SCH_FORM.cat) { SCH_FORM.typesOpen = !SCH_FORM.typesOpen; schRefreshForm(); } }
function schToggleType(t) {
  const i = SCH_FORM.types.indexOf(t);
  if (i >= 0) SCH_FORM.types.splice(i, 1); else SCH_FORM.types.push(t);
  schRefreshForm();
}
function schSetRepeat(r) { SCH_FORM.repeat = r; schRefreshForm(); }
function schField(k, v) { SCH_FORM[k] = v; }

/* ---- dropdowns ----------------------------------------------------------- */
function schCatDD() {
  const f = SCH_FORM;
  const opts = SCH_CATS.map(c => `<option value="${c.cat}" ${f.cat === c.cat ? 'selected' : ''}>${c.cat}</option>`).join('');
  return `<div class="sch-select-wrap">
    <select class="sch-select ${f.cat ? '' : 'ph'}" onchange="schSetCat(this.value)">
      <option value="" ${f.cat ? '' : 'selected'} disabled>Select assessment category</option>
      ${opts}
    </select><span class="sch-select-chev">${I2.chevDown}</span></div>`;
}
function schTypesDD() {
  const f = SCH_FORM, c = schCat(f.cat);
  if (!c) return `<div class="sch-dd"><div class="sch-dd-btn disabled"><span class="sch-dd-val">Select a category first</span><span class="sch-dd-chev">${I2.chevDown}</span></div></div>`;
  const sel = f.types;
  const summary = sel.length === 0 ? 'Select assessment types'
    : (sel.length <= 2 ? sel.join(', ') : `${sel.length} types selected`);
  const panel = f.typesOpen ? `<div class="sch-dd-panel">${c.types.map(t => {
    const on = sel.includes(t);
    return `<button class="sch-dd-opt ${on ? 'on' : ''}" style="--cat:${c.color}" onclick="schToggleType('${t}')">
      <span class="sch-dd-box">${on ? SCH_TICK : ''}</span><span>${t}</span></button>`;
  }).join('')}</div>` : '';
  const tags = sel.length ? `<div class="sch-dd-tags">${sel.map(t => `<span class="sch-tchip">${t}</span>`).join('')}</div>` : '';
  return `<div class="sch-dd ${f.typesOpen ? 'open' : ''}">
    <button class="sch-dd-btn ${sel.length ? '' : 'ph'}" onclick="schToggleTypesDD()">
      <span class="sch-dd-val">${summary}</span><span class="sch-dd-chev">${I2.chevDown}</span></button>
    ${panel}</div>${tags}`;
}

/* ---- form body ----------------------------------------------------------- */
function schFormInner() {
  const f = SCH_FORM;
  const repeatChips = SCH_REPEATS.map(r =>
    `<button class="sch-chip ${r === f.repeat ? 'active' : ''}" onclick="schSetRepeat('${r}')">${r}</button>`).join('');
  const custom = f.repeat === 'Custom'
    ? `<div class="sch-fld"><label class="sch-lbl">Every (days)</label>
        <input class="sch-input" type="number" min="1" value="${f.everyDays}" oninput="schField('everyDays', +this.value)"></div>`
    : '';
  const canSave = !!f.cat && f.types.length > 0;
  return `
    <div class="sch-fld"><label class="sch-lbl">Assessment Category</label>${schCatDD()}</div>
    <div class="sch-fld"><label class="sch-lbl">Assessment Types</label>${schTypesDD()}</div>
    <div class="sch-row2">
      <div class="sch-fld"><label class="sch-lbl">Date</label>
        <input class="sch-input" type="date" value="${f.date}" onchange="schField('date', this.value)"></div>
      <div class="sch-fld"><label class="sch-lbl">Time</label>
        <input class="sch-input" type="time" value="${f.time}" onchange="schField('time', this.value)"></div>
    </div>
    <div class="sch-fld"><label class="sch-lbl">Repeat Rule <span class="sch-opt">(optional)</span></label>
      <div class="sch-chips">${repeatChips}</div></div>
    ${custom}
    <div class="sch-fld"><label class="sch-lbl">Notes <span class="sch-opt">(optional)</span></label>
      <textarea class="sch-input sch-area" rows="3" placeholder="Add a note for this plan" oninput="schField('notes', this.value)">${f.notes}</textarea></div>
    <button class="sch-cta sch-save ${canSave ? '' : 'disabled'}"${canSave ? '' : ' disabled'} onclick="${canSave ? 'schSave()' : ''}">
      ${SCH_TICK}<span>Save Schedule</span></button>`;
}

function schSave() {
  const f = SCH_FORM;
  if (!f.cat || !f.types.length) return;
  const [y, m, d] = f.date.split('-').map(Number);
  const data = { cat: f.cat, types: f.types.slice(), responseTypes: schMapResponses(f.types),
    date: new Date(y, m - 1, d), time: sch12h(f.time), repeat: f.repeat, everyDays: f.everyDays, notes: f.notes };
  if (f.editId) { const it = SCHEDULE.find(x => x.id === f.editId); if (it) Object.assign(it, data); }
  else { SCHEDULE.push({ id: 'SP-' + (++SCH_SEQ), ...data }); }
  const ymd = schYmd(data.date);
  SCH_CAL = { y: data.date.getFullYear(), m: data.date.getMonth() };   // surface the saved month
  closeSheet2();
  render2();
  schOpenDay(ymd);                                                     // show the day in context
}

/* ===========================================================================
   OVERVIEW-TAB CONTAINER  (called from amOverview in app2.js)
   =========================================================================== */
function overviewUpcomingContainer() {
  const items = schSorted().slice(0, 3);
  const rows = items.map(it => {
    const n = it.types.length;
    return `<div class="ov-up-row" onclick="openScheduleTab()">
      <span class="sch-cat-dot" style="--cat:${schCatColor(it.cat)}"></span>
      <div class="ov-up-body"><div class="ov-up-type">${it.cat}</div>
        <div class="ov-up-meta">${schRel(it.date)} · ${it.time} · ${n} ${n === 1 ? 'type' : 'types'}</div></div>
      <span class="ov-up-chev">${I2.chevR}</span>
    </div>`;
  }).join('');
  return `
    <div class="card card-pad ov-up-card">
      <div class="ov-up-head"><div class="ov-up-title">Upcoming Assessments</div></div>
      <div class="ov-up-list">${rows || '<div class="muted" style="padding:8px 0">Nothing planned.</div>'}</div>
      <button class="ov-up-all" onclick="openScheduleTab()">View Schedule ${I2.chevR}</button>
    </div>`;
}
function openScheduleTab() {
  AA_TAB = 'schedule';
  go2('assessAnalytics', { animalId: 'mk001', filter: (typeof AA_FILTER !== 'undefined' ? AA_FILTER : 'Week') });
  // land on the Schedule tab and auto-scroll past the calendar to Upcoming Assessments
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const el = document.getElementById('schUpcoming');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

/* ---- icons (match I2 stroke style) -------------------------------------- */
const SCH_PLUS    = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const SCH_TICK    = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SCH_CLOCK   = '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.5V12l3 1.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SCH_LAYERS  = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5l8.5 4.5-8.5 4.5L3.5 8 12 3.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M5 12l7 3.7 7-3.7M5 15.8l7 3.7 7-3.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SCH_TRASH   = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M10 7V5h4v2M6.5 7l.8 12.2a1 1 0 001 .8h7.4a1 1 0 001-.8L18.5 7M10 11v5M14 11v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SCH_CAL_BIG = '<svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5" width="17" height="15" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
