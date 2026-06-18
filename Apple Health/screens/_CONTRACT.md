# Screen-builder CONTRACT — read fully before writing code

You are building **one screen file** for the Antz Assessment prototype. It must look and feel
**identical in spacing, type, and colour** to the existing premium UI. The way you guarantee
that is: **reuse the existing components and design tokens below. Do not invent new colours or
spacing values.** Hardcoded hex (except via the tokens/category colours listed) = wrong.

## Hard rules
1. Write ONLY your assigned file `screens/<name>.js`. **Never edit** `app.js`, `styles.css`,
   `index.html`, `screens/00-runtime.js`, or another agent's file.
2. All screens, helpers, and CSS ids you add must be **uniquely prefixed** with your module
   prefix (e.g. `cfgX`, `capX`, `recX`, `exeX`, `cmpX`) to avoid global collisions.
3. Reference existing globals directly (classic scripts share global scope — app.js & 00-runtime
   load first). Do NOT redefine them.
4. End your file by **registering each screen** so the launcher links it:
   `registerModule({key:'<SCREENS key>', label:'…', sub:'…', group:'<Species|Animals & Capture|Executive>', color:'var(--…)', icon:I.<name>});`
5. Any new CSS goes through `injectCSS('css-<prefix>', \`…\`)` called once at file load, and may
   use **only design tokens** (CSS vars) — see Tokens. No raw hex except category `raw` values.
6. Before finishing, run `node --check screens/<name>.js` and confirm it passes.

## Screen skeleton (match this structure exactly)
```js
SCREENS.exeOverview = (params={}) => {
  return `<div class="screen active"><div class="scroll">
    ${appHeader('', {back:true, action:''})}            // OR tabHeader('Title','sub') for a top-level page
    <div class="page-hero"><div class="ph-title">Title</div><div class="ph-sub">subtitle</div></div>
    ...sections built from existing components...
  </div></div>`;
};
registerModule({key:'exeOverview', label:'Executive Overview', sub:'Org KPIs · risk · sites', group:'Executive', color:'var(--antz)', icon:I.grid});
```
- Navigate with `go('key', {param})` (push) and `back()` (pop). Open modals with `openSheet(html)` / `closeSheet()`.
- A screen is `<div class="screen active"><div class="scroll"> … </div></div>`. The `.scroll` already pads for the tab bar.

## Design tokens (CSS vars — use these, never raw values)
Colour: `--antz`(brand teal #17A186) · `--label` · `--label-2` · `--label-secondary` · `--label-tertiary`
· `--bg` · `--bg-elevated`(card white) · `--separator` · `--fill-tert` · `--mint-tint`
Five-Domain / category colours (also available as `CATS[key].raw` hex for SVG): `--physical`(#138C8C)
· `--behaviour`(#5A62C9) · `--environment`(#2FAE73) · `--mental`(#9B8BD0) · `--nutrition`(#8FBF52)
Risk colours via `welfareColor(score)` → returns #2FAE73 / #17A186 / #C9A227 / #C76B4A.
Shape: `--radius`(18px) · `--radius-lg`(24px) · `--shadow`. Spacing: cards use `margin:0 16px 14px; padding:16px`.

## Existing components you MUST reuse (don't rebuild)
**Icons:** `I.chevron I.back I.search I.plus I.x I.cal I.clock I.check I.arrowUp I.arrowDn I.pencil I.star I.heart I.paw I.grid I.doc I.scale I.eye I.bolt I.leaf I.brain I.ruler I.drop I.alert I.photo`
**Headers:** `tabHeader(title, sub, {insights})` (light premium top-level header) · `appHeader(title,{sub,back,action})` (compact back bar). After appHeader use a `.page-hero` div with `.ph-title`/`.ph-sub` for the big title.
**Charts (return SVG strings):**
- `lineChart(data, color, {unit, labels})` — area+line+avg
- `barChart(data, color, {max, labels})` — rounded bars
- `catChart(data, scale, {labels})` — categorical timeline (scale = {Good:'#..',Fair,Poor})
- `lollipopChart(data, {labels, colorFn, baseColor})` — stems + circle caps
- `sparkline(data,color)` · `sparkBars(data,color)` — inline minis
- `welfareDial(scoresObj, {light:true})` — the 5-domain ring (scoresObj keyed nutrition/environment/physical/behaviour/mental)
- `ringMini(frac, color, {size, label, fs})` — progress ring with centre label
**Cards / lists / chrome (CSS classes — see styles.css):**
`.card .card-pad` · `.list` + `.row`(`.r-icon .r-body .r-title .r-sub .r-trail .chev`) · `.stile` in `.tile-grid`(3-col stat tiles: `.st-ico .st-num .st-lab`) · `.section-head`(`h2` + `.show-all`) · `.chips`+`.chip`(`.on`) · `.search` · `.btn-fill` `.btn-tint` · `.range-seg`(white-pill segmented) · `.idx-pill`(welfare badge) · `.badge`(`.active`) · `.tchip`(`.trend-up/.trend-down`) · `.empty`(`.e-emoji .e-title .e-sub`) · `.form-group .form-label .field .f-row .f-k .f-v` · `.toggle` · `.welfare-lite` (light hero card) · `.mcard`(metric card w/ ring) · `.spcard`(species card) · `.acard`(animal row card) · `.feed-row`(`.f-ico .f-main .f-time`) · `.attn-row`(`.a-bar .a-emoji .a-body .a-name .a-reason`) · `.insight`(`.i-dot .i-txt`) · sheet: `.sheet-grab .sheet-head(.sh-title .sh-sub .sh-x) .pill-list .pill-opt .entry-field .entry-2 .sheet-actions(.cancel .confirm)`.
**Data you can use:** `SPECIES`(map) · `ANIMALS`(map, enriched: id,name,species,latin,sex,stage,age,encl,status,welfare{5},metrics,favorites) · `getAnimal(id)` · `speciesGroups()` · `METRICS`(weight,bodyscore,eye,activity,enrich,food,temp) · `metricFor(animalId,key)` · `seriesFor(animalId,key,range)` · `DOMAIN_ORDER` · `CATS` · `welfareIndex(w)` `welfareLabel(v)` `welfareColor(v)` · `collectionStats()` · `photoBox(name,{size,radius})` (rounded photo placeholder). Enterprise mock in 00-runtime: `SITES` · `ASSESSORS` · `RECORDS`+`recordById(id)` · `QUEUE`.
**Response types** (drive capture + charts): Text · Numeric Value · List · Numeric Scale. List options map to scores (Good=100/Fair=60/Poor=20). Numeric Scale has direction (higher-better / lower-better / target-band e.g. Body Condition 4–5 ideal). Text is descriptive (never scored).

## Quality bar
Generous whitespace, clear hierarchy (section-head → cards), consistent 16px side gutters, rounded
cards with `--shadow`, brand teal for primary/links, category colours for domains, `welfareColor`
for risk. Photo placeholders (not emoji) for animals/species. Every screen scrolls cleanly and has
a clear back path. Build it to look like the existing Dashboard / Species / Animal screens.
