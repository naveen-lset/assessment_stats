/* ===========================================================================
   Antz Welfare — Index 2 · Assessment Highlights
   Loaded AFTER app2-analytics.js. Apple-Health-inspired: content-first, plain
   language, meaning BEFORE charts. Read-only insight — no scores, no status,
   no ownership. Returns one .wcard fragment for the Analytics Overview top.
   =========================================================================== */
function assessmentHighlights() {
  if (typeof HISTORY === 'undefined' || HISTORY.length < 2) return '';
  const cur = HISTORY[0], prev = HISTORY[1];
  const get = (rec, q) => rec.items.find(it => it.q === q);
  const rows = [];

  /* numeric: Weight, Temperature */
  [['Weight', 'kg'], ['Temperature', '°C']].forEach(([q, unit]) => {
    const a = get(cur, q), b = get(prev, q); if (!a || !b) return;
    const d = +(a.value - b.value).toFixed(1);
    if (Math.abs(d) < 0.15) rows.push(['stable', `${q} remained stable`]);
    else rows.push([d > 0 ? 'up' : 'down', `${q} ${d > 0 ? 'increased' : 'decreased'} by ${Math.abs(d)} ${unit}`]);
  });

  /* scale: Body Condition, Activity Level */
  [['Body Condition', 'Body condition'], ['Activity Level', 'Activity level']].forEach(([q, label]) => {
    const a = get(cur, q), b = get(prev, q); if (!a || !b) return;
    const d = a.value - b.value;
    if (d === 0) rows.push(['stable', `${label} held steady`]);
    else rows.push([d > 0 ? 'up' : 'down', `${label} ${d > 0 ? 'improved' : 'declined'}`]);
  });

  /* list: Appetite (ordered) */
  const ap = get(cur, 'Appetite'), bp = get(prev, 'Appetite');
  if (ap && bp && ap.value !== bp.value) {
    const better = ap.options.indexOf(ap.value) > ap.options.indexOf(bp.value);
    rows.push([better ? 'up' : 'down', `Appetite ${better ? 'improved' : 'changed'} from ${bp.value} to ${ap.value}`]);
  }

  /* footer — assessments completed in the latest record's month */
  const month = cur.date.split(' ').slice(1).join(' ');
  const monthCount = HISTORY.filter(r => r.date.split(' ').slice(1).join(' ') === month).length;

  const arrow = { up: '↑', down: '↓', stable: '→' };
  const list = rows.map(([tone, text]) =>
    `<div class="ah-row"><span class="ah-ic ah-${tone}">${arrow[tone]}</span><span class="ah-text">${text}</span></div>`).join('');

  return `<div class="wcard ah-card">
    <div class="wc-title">Assessment Highlights</div>
    <div class="ah-list">${list}</div>
    <div class="ah-foot">${monthCount} assessment${monthCount === 1 ? '' : 's'} completed this month</div>
  </div>`;
}
