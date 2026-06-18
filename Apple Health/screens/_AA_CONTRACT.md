# Assessment Analytics — section-builder addendum

Read `_CONTRACT.md` first (base design system). This adds the **analytics kit** your section
must use so it matches the flagship Dashboard. Reference screen to mirror exactly:
`screens/11-aa-dashboard.js`. Kit + mock: `screens/10-analytics-kit.js` (read it).

## Every section landing screen starts with the module chrome
```js
SCREENS.aaSpecies = (params={}) => `<div class="screen active"><div class="scroll">
  ${aaHeader('aaSpecies', {sub:'…'})}   // renders the 7 section tabs + search/menu, highlights this one
  ${aaFilter()}                          // period segmented + filter chips (optional but encouraged)
  ...sections...
</div></div>`;
```
- The 7 section keys (for tabs + go()): **aaDash · aaSpecies · aaAnimal · aaRecords · aaCompare · aaReports · aaAudit**.
- A **drill-down detail** screen (e.g. record detail, one specific animal opened from a list) uses
  `appHeader('',{back:true})` + a `.page-hero` instead of aaHeader (it's below the section, reached by back()).

## Kit components (use these — they ARE the look)
- `aaKpis([{lab,val,unit,delta,up,color,sub,go}])` — KPI tile grid (2-col).
- `aaTrendCard(title, sub, value, valColor, dataArray, {from,to,goExpr})` — big value + gradient line.
- `aaRank(title, [{name,val,disp,color,go}], {sub,goExpr})` — ranked list with bars (auto-scaled).
- `aaBars2(title, [{name,val,disp,color}], {goExpr})` — labelled horizontal bars.
- `aaDistCard(title, [{label,val,color}], {goExpr})` — donut + % legend.
- `aaDonut(segs,{size,sw})` — raw donut svg.
- `aaFeed(title, [{title,sub,time,color,icon,go}], {goExpr})` — activity feed.
- `hcard(title, sub, goExpr, bodyHTML)` — white card shell w/ header + arrow (use for anything custom).
- Also reuse: `gradLine(data,{from,to})`, `homeBars(data,color,{h})`, `lollipopChart`, `welfareDial(obj,{light:true})`,
  `ringMini(frac,color,{size,label})`, `multiRing`, `segMeter(rows)`, `statGrid(items)`, `photoBox(name,{size,radius})`,
  `distBar(dist,total)`.
- Tables (records): use `.aatable` + `.aatrow`(`.tr-id .tr-name .tr-sub .tr-score`) + `.aastatus` (status pill;
  colour via `aaStatusColor(st)` / bg `aaStatusBg(st)`). Search field: `.aa-search`.

## Data (read 10-analytics-kit.js + 00-runtime.js)
`AA_TYPES` (assessment types: name,cat,avg,count,pass) · `AA_TREND` (welfare/completion/compliance/activity arrays) ·
`aaMonths()` · `aaOrg()` (org KPIs) · `SITES` · `ASSESSORS` · `RECORDS`+`recordById` · `QUEUE` ·
`SPECIES` · `ANIMALS`+`getAnimal` · `speciesGroups()` · `COLLECTION` · `CATS` · `DOMAIN_ORDER` ·
`welfareIndex/welfareColor/welfareLabel` · `metricFor/seriesFor` · `collectionStats()`.

## Rules
- Write ONLY your file. Prefix helpers/CSS ids with your section prefix (e.g. `spA`, `anA`, `recA`, `cmpA`, `repA`).
- New CSS only via `injectCSS('css-<prefix>', \`…\`)` using design tokens. No raw hex except `CATS[k].raw`/`welfareColor`.
- Photo placeholders (`photoBox`) for animals/species — never emoji.
- Drill flow: Org → Species → Animal → Record. Wire `go('aaAnimal',{animalId})`, `go('aaRecordDetail',{id})`, etc.
- `node --check` your file before finishing.
- Match the flagship Dashboard's spacing, section-head headings, card style, Inter type, official palette.
