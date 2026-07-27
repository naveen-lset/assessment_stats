# INDEX 2 — UI Component Reference

Single source of truth for building **new feature UIs** in the INDEX 2 prototype
(`index2.html` · `app2.js` · `app2-analytics.js` · `app2-schedule.js` · `styles2.css` · `app2-schedule.css`).
Reuse these components/classes instead of inventing new ones — everything here is already
matched 1:1 with the Figma push (page "👁️ Assessments", frames near x≈92,000).

---

## 1 · Design tokens (MD3_Antz — `styles2.css :root`)

### Colors
| Token | Value | Use |
|---|---|---|
| `--bg` | `#EFF5F2` | Page/mint background (analytics, sheets lower) |
| `--surface` | `#FFFFFF` | Cards, headers, tab bars |
| `--display-primary` | `#E8F4F2` | Tinted info boxes, chips, icon circles |
| `--display-secondary` | `#DDEBE9` | Expand footers |
| `--on-secondary-cont` | `#1F415B` | Navy — field values, group labels |
| `--on-primary-cont` | `#1F515B` | Deep teal — active chip bg, buttons, pill text |
| `--on-surface-green` | `#006D35` | Active tab text, CTAs, legend/timeline dots |
| `--on-surface-variant` | `#44544A` | Body text, sheet titles, labels |
| `--surface-variant` | `#414941` | Inactive tab label |
| `--neutral-secondary` | `#7A8684` | Secondary/meta text, placeholders |
| `--neutral-primary` | `#171A1C` | Titles, hero values |
| `--neutral-05` | `rgba(0,0,0,.05)` | Search/segment/nav-button backgrounds, hairlines |
| `--chart-green` | `#4FD4AF` | Home spark line |
| accents | `#37BD69` green · `#E93353` red · `#00ABAB` teal link · `#00AFD6` cyan | deltas ↑/↓, See-More link, current-step chip |

### Category colors (fixed — used for dots, chips, chart hues)
`Physical Health #FA6140 · Behaviour #8479F9 · Environment #00AFD6 · Mental Domain #E4A11B · Nutrition #37BD69`
Per-metric chart hues come from `VIZ_PALETTE` (those 5 + `#EC4899 #3B82F6 #F97316 #14B8A6 #A855F7 #84CC16 #E11D48`), assigned round-robin in `TYPE_INDEX` so neighbouring cards never share a colour.

### Radii & shadows
| Token | Value |
|---|---|
| `--r-sm / --r-md / --r-lg` | `8 / 10 / 12 px` (cards 8–16, pills 100/999) |
| `--shadow-card` | `0 2px 12px rgba(0,0,0,.05)` — default card |
| `--shadow-seg` | `0 2px 7px rgba(20,61,46,.12)` — active segment/toggle |
| `--shadow-stat` | `0 2px 7px rgba(20,61,46,.08)` — stat tiles |
| `--shadow-elev` | `0 1px 3px rgba(20,61,46,.06), 0 8px 22px rgba(20,61,46,.08)` — white chart cards |
| v2 metric card | `0 1px 2px rgba(20,61,46,.05), 0 10px 26px rgba(20,61,46,.07)` (hero: `0 2px 4px /.06, 0 14px 32px /.11`) |

### Type ramp (Inter only — weights 400/500/600/700, italic for quotes/latin)
| Role | Spec |
|---|---|
| Sheet/major title | 20–24 · Medium/Semi Bold · `#44544A`/`#171A1C` |
| Card title | 15–16 · Medium/Semi Bold · `#171A1C` / `#000` |
| Hero value | 23–34 · Semi Bold/Bold · `#1A1D1F` (ls −.5 to −1.2) |
| Value unit | 13–16 · Medium · `#8A9499` |
| Delta/sub | 12–12.5 · Semi Bold · green `#34A853`/`#37BD69`, red `#E93353`, muted `#8A9499` |
| Body/meta | 12–14 · Regular/Medium · `#7A8684` / `#44544A` |
| Section label (caps) | 12 · Bold · `#7A8684` · ls .4 · UPPERCASE |
| Tab | 14 · Medium · active `#006D35` / inactive `#414941` |

---

## 2 · Icons — `I2` (app2.js:11)
Inline stroke SVGs, 24×24 viewBox, `currentColor` (never emojis):
`back star qr more pencil chevDown chevR home search spark cal photo`
Feature-specific extras: `ATC_PLUS` (⊕ add, app2-analytics.js), `HS_FILT_ICON` (filter), `MS_REPEAT_IC`, `MS_PLUS_IC`, `AE_CLOCK`, `AE_CHECK`, `SCH_PLUS/TICK/CLOCK/LAYERS/TRASH/CAL_BIG` (app2-schedule.js).
**Rule:** icons inherit colour via `currentColor`; size with CSS on the wrapper.

---

## 3 · Screen shells & navigation

| Component | Builder / classes | Notes |
|---|---|---|
| Screen | `SCREENS2.key = (p)=>html` + `render2/go2/back2` | `.screen.active > .scroll` (add `.prof-scroll` = white bg; `.assess-landing` = mint) |
| Hero header | `heroHeader(ANIMAL)` (app2.js:60) → `.hero` 306px photo + 20% scrim, `.appbar` (back 48 + 40px actions), `.animal-card` (rgba(0,0,0,.5), r12, p16: name 24/500, latin 12 italic, lines 12, AID 14 — all white) | Landing + Profile |
| Tabs bar | `tabsBar(tabs, activeKey, onSelect)` (app2.js:81) → `.tabsbar > .tabs > .tab` | h48, active = green + 3px `#37BD69` underline **edge-to-edge**; analytics variant `.aa-tabwrap .tab{flex:1}` = equal width |
| Page header | `pageHeader(title, sub)` → `.pg-head` (back 44 + title 18/600) | drill-down screens |
| AID bar | `aidTopbar()` → `.pg-head-plain > .pg-aid` (20/500 `#44544A`) | analytics screens |
| Sticky nav | `.aa-sticky` / `.aa-tabwrap .tabsbar{top:54px}` | tabs pin below status bar |
| Master flow | `SCREENS2.mstLanding` → `mstCategory` → `mstTypeDetail` (`app2-master.js`) | catalogue-admin: create/edit a type + assign its graph. Reach at `index2.html#master`. `.mst-fab` green ⊕ → New Type sheet. |

---

## 4 · Filters, chips & toggles

| Component | Classes / builder | Spec |
|---|---|---|
| Segmented control | `.segment > .seg` (+`.seg4`, `.ac-seg`, `.ms-flt`) | track `neutral-05` r11 p3; active seg white r9 + `--shadow-seg`, 14/500 |
| Category chips | `.tchip-row.v2-doms > .tchip` | white, 14/600 `#44544A`, p11/18 r12; active bg `#1F515B` white. Horizontally scrollable |
| Trend field chips | `.trend-chips > .tc` | 12/600, `neutral-05` bg r10; active `#1F515B` white |
| Cadence chips | `.ms-sched-chips > .msc-chip` | equal-width pill r999 border `#D6E2DC`; active `#006D35` white |
| Role toggle | `.sch-role-seg` | same pattern as segment; active text `#1F515B` |
| Range pill | `.range-pill` | mint pill w/ calendar icon (Custom range) |
| Journey stepper | `.jrny > .jr-step (+.cur) / .jr-arr` | steps `#EEF3F1` chips; current `#00AFD6` white; `→` arrows |

---

## 5 · Cards

| Card | Classes | Anatomy |
|---|---|---|
| **v2 metric card** (the workhorse) | `.v2-card` — builders `v2Card(m,opts)` / `v2HeroCard` (app2-analytics.js) | white r10 p16/18/18 minH138, 2-layer shadow. Head: name 15/600 + `⊕`(`.v2-add`, `{add:true}`) or chevron. Foot: left `.v2-lead` (value 23/600 + unit small, delta sub, date 11 `#44544A`) + right `.v2-viz` 132×48 chart. Variants: `.v2-hero` (34px value, 320×92 chart, Previous/Average/Min/Max tile row), `.v2-card-text` (italic note preview box `#F5F8F6`, "N entries") |
| Stat tile | `.aa-st` (grid `.aa-grid` 2×2 gap12) | white r8 p12, label 12 `#44544A`, value 20/700 (accent colours); welfare row `.ast-wf` = 77 + Good + ↑2% |
| White chart card | `.wcard` (+`.wc-title/.wc-sub/.wc-head`) | white r8/r12, p16, `--shadow-elev` |
| Sheet card | `.ms-card` (+`.ms-card-t` 16/500 `#000`) | white r8 p12/16, shadow-card — all cards inside `.ms-lower` |
| Comparison card | `.cmp-card` + `cmpRowFor/cmpTextCard` | head (q 15/600 + status pill `.cmp-status.ok/warn/risk` or delta), values `prev » cur`, numeric adds `idealTrack` + Low/Ideal/High scale, text adds Previous/Current boxes (`.cmp-tbox.prev/.cur`) |
| Feed card | `.feed-card` | white r14 p15/16: label 13 → value 20/700 (or yellow note box `.fc-note` `#FBF1CE`/`#7A6A22`) → meta 12; chevron right |
| Plan card | `.sch-plan` + `schPlanCard(it)` | white r16 p15/16: cat dot+name / date `#1F515B`, type chips `.sch-tchip` (`#E8F4F2` 12/500), foot layers-icon + count/repeat |
| Upcoming (overview) | `.ov-up-card` + `overviewUpcomingContainer()` | title 15/600; rows dot 9 + type 14/600 + meta 12, hairline dividers; `View Schedule ›` green button |
| Info/section card | `.card.card-pad` + `sectionCard(title, body)` / `field(l,v)` | sec-head icon 24 + title 16/500 `#1F415B`; 2-col `.info-grid`; expand strip `.info-expand` |
| Teal-band type card | `.atc-card` (`.atc-head` band `#BFE9E2`) | legacy Assessment-tab container — prefer v2 cards for new work |
| **Master category row** | `.mst-catrow` (`.mst-cat-dot` + `.mst-cat-name` + `.mst-cat-n` + `.mst-cat-chev`) | white r12 p16, v2-card shadow; brand-colour dot, count in green, chevron. Landing category list (`app2-master.js`) |
| **Master type row** | `.mst-typerow` (`.mst-type-graph` thumb + `.mst-type-body`>`.mst-type-name`/`.mst-type-meta`) | white r12 p13; left thumbnail = the type's **assigned graph** (real mini renderer on sample data via `mstThumb`), meta = `Response Type · Graph`. |
| **Master graph-view row** | `.mst-graph-view` (`.mst-gv-thumb` + `.mst-gv-txt`>`.mst-gv-name`/`.mst-gv-sub`) | type-detail Graph section: enlarged thumbnail + graph name + SRS §2.7 "what it shows" hint |

---

## 6 · Search inputs
| Variant | Classes | Spec |
|---|---|---|
| Page search | `.hist-search > .hs-box` (+ optional `.hs-filt` 48×48 button) | `neutral-05` r10 p13/14, icon 17, text 15 `#7A8684` |
| In-card list search | `listSearch(sel, ph)` → `.ls-search` | `neutral-05` r10 p10/13, icon 16, text 14 — filters items via `searchFilter(input, sel)` inside nearest `[data-searchbox]`; pair with `.ls-empty` |

---

## 7 · Charts & visualizations (all inline SVG — editable, no libs)
| Viz | Builder | Use |
|---|---|---|
| Numeric mini | `v2Area / v2Line / v2Col` (132×48) | v2 card foot — smooth path via `smoothPath2`, gradient fill, white-halo end dot (`endDot`) |
| Scale mini | `v2Bars / v2Lolli / v2Dots / v2Gauge` | latest accented in metric colour, rest `#E6EBED`/`#C5CFD4` |
| List mini | `v2Donut` or `.v2-dist` bars (track `#EEF1F3`) | distribution, current option coloured |
| Hero trend | `v2HeroChart` (320×92) | Weight hero card |
| Full line chart | `lineInteractive(id, values, color, {axes, avg, area, labels, valStrs})` | metric sheet + trends: Y grid + labelled axes, dashed avg line, pointer scrubber (`lcMove/lcLeave`) |
| Activity columns | `assessChartSVG(filter, cat)` + `mountAssessChart` | gradient green bars + dashed previous line + tap popover `.ac-tip` |
| Distribution rows | `.bd-row > .bd-top + .bd-bar > i` | option / count / % bar (track `neutral-05` h8 r100) |
| Ideal-band track | `idealTrack(cur, prev, ideal)` → `.cmp-track` | band `#C7F0D8`, tick `#B6C0BC`, dot 13px `#171A1C` |
| Spark | `sparkChart(data)` (home summary) | 326×92 mint area |

**Chart rules:** viewBox + explicit sizing; colours from the metric's `TYPE_INDEX` entry; dots/lines get white halos on fills; axis text 9.5–11px `#7A8684`.

---

## 8 · Bottom sheets (`app2-analytics.js` kit)
- **Kit:** `openSheet2(html)` / `closeSheet2()` — `.sheet2-scrim` (rgba(15,28,26,.42)) inside `.phone`, `.sheet2` slides up, `#EFF5F2`, top radius 22, max-height 90%.
- **Metric sheet** (`openMetric(q)` → `metricSheetHTML/metricSheetInner`): `.ms-head` white (title 20/500 + ✕) → `.ms-white` (W/M/6M/Y segment + `lineInteractive` chart, or `.ms-latest` quote box for text) → `.ms-lower` mint stack: **Your Schedule card** (`msScheduleCard` — cadence chips, `Schedule` button `#1F515B`, scheduled items or empty state) → **stats card** (`.ms-stats` 3 cols) → type extras (Scale Progression jrny / Distribution) → **History card** (search + `.ms-row` rows: right-aligned meta w96 + value pill `.ms-pill`, newest greenish `#E1F9ED`) or **All Observations** timeline (`.md-note` dots).
- **Add Entry sheet** (`openAddEntry(q)` → `addEntrySheet`): header + description, date/time fields `.ae-field`, response-type body (numeric input+unit select / textarea / option cards `.ae-opt` with check, selected `#93E5AC`), sticky footer Cancel / `Add Entry` (`#37BD69`). Commits via `aeSubmit` → `USER_ENTRIES`.
- **Day sheet** (`schOpenDay(ymd)`): same `.ms-head` pattern, per-day plan list.
- **New / Edit Assessment Type sheet** (`mstOpenNew(cat)` / `mstOpenEdit(q)` → `mstFormHTML`, `app2-master.js`): reuses the Add-Entry vocabulary — `.ae-head`/`.ae-body`/`.ae-foot`, `.ae-cancel`/`.ae-add`. Fields: `.mst-flabel` labels (`.mst-req` red `*`), category chips (`.tchip.v2-doms` + `.mst-cat-dot.xs`), name (`.ae-input.mst-input`), description (`.ae-textarea`), Active toggle (`.mst-active` + `.mst-active-box` check), Response Type option cards (`.ae-opt` selected `#93E5AC`), then the **graph picker**. Draft state = `MST_DRAFT`; `mstSetRt/mstSetViz/mstSetCat/mstSetActive` mutate it and re-render the sheet body in place (`mstRerender`) — so switching Response Type re-defaults the graph and clears an incompatible override (SRS §2.7 rule 2). `mstSubmit` commits into `CATALOGUE`, calls `buildTypeIndex()`, lands on the type detail.
  - **Graph picker** (`.mst-gopts > .mst-gopt`): one option card per graph in the response type's compatible set (`compatibleViz(rt)`), each showing a **live thumbnail** (`mstThumb(rt,viz,color)` — the real `v2Bars/v2Gauge/v2Donut/…` mini renderers on sample data) + label; the canonical default carries a `.mst-gopt-def` "Default" badge. Selected = same `#93E5AC`/green-check treatment as `.ae-opt`. Text response type hides the picker and shows `.mst-graph-none` (dashed box, "Notes timeline — no chart").

---

## 9 · Buttons & CTAs
| Button | Classes | Spec |
|---|---|---|
| Primary CTA | `.sch-cta` | full-width `#006D35`, white 15/600, r12 p14, +icon, shadow-seg |
| Sheet primary | `.ms-sched-btn` | full-width `#1F515B` r10 p12, 14/600 |
| Form pair | `.ae-cancel` / `.ae-add` | outline `#D6E2DC` / filled `#37BD69`, r12 p14 |
| Text link | `.see-more` (`#00ABAB` 16/500) · `.link-btn` / `.ov-up-all` (`#006D35` 14/600 + chevron) · `.ms-sched-link` (`#1F515B` 12.5/600) | |
| Icon buttons | `.v2-add` ⊕ 22 `#1b7a44` · `.hs-filt` 48 · `.sch-cal-nav` 32 r9 `neutral-05` · `.ms-x/.ae-x` ✕ | |

---

## 10 · Schedule components (`app2-schedule.js/css`)
- **Calendar card** `schCalCard()` → `.sch-cal-card`: title 16/700 + prev/next nav; `.sch-cal-dow` 7-col headers 11/600; `.sch-cal-grid` cells (`.sch-cell`, square r10, number 13, today = mint bg + green 700, ≤3 category dots 5px); legend `.sch-cal-legend` (border-top, 8px dots + 11.5/500).
- **Buckets/groups** `.sch-grp` — label 14/700 `#1F415B` + count badge `.sch-grp-n`; grouped by `schBucket` (Today/Tomorrow/This Week/Upcoming).
- **Helpers:** `SCH_CATS` derives from `CATALOGUE`; `schCatColor(cat)`; date utils `schFmt/schRel/schYmd`; `SCH_ROLE` editor/viewer gates editing.

---

## 11 · Data API (drive UIs from the catalogue — never hardcode)
```js
CATALOGUE                 // 5 categories → types {q, rt: numeric|scale|list|text, unit/max/options, viz?}
n(unit,base,dp,viz?)      // factory helpers — optional trailing `viz` PINS a non-default graph
s(max,viz?) · l(options,viz?) · t()   //   (omit viz → the rt's canonical default)
buildTypeIndex()          // (re)resolve every CATALOGUE type into TYPE_INDEX — call after add/edit
catType(q)                // {…type, cat, catColor, color, viz, hero}
GRAPHS                    // {numeric|scale|list|text: [{viz,label}]} — first entry = canonical default
compatibleViz(rt)         // [{viz,label}] the rt may use (text → [])
defaultViz(rt)            // canonical viz key ('area'/'bars'/'dist'); text → null
vizLabel(viz)             // 'bars' → 'Bars vs ceiling'
vizCompatible(rt,viz)     // is viz valid for rt? (used to clear an override when rt changes)
seriesFor(q) / catChron(q)// chronological values (synthetic, deterministic)
catNewest(q)              // newest-first values
catSessions(q)            // aligned {date,time,by} meta (user entries lead)
trendItem(q)              // type + latest value
CAT_DOMAINS               // ['All', …5 categories] for chip rows
CAT_COLOR                 // {category: hex}
USER_ENTRIES / aeSubmit   // user-added readings (prepended)
qLabel(q)                 // display label ('Body Condition Score' → 'Body Score')
```
Adding an assessment type = add it to `CATALOGUE` (optionally with a `viz`) and call `buildTypeIndex()`; every screen (cards, sheets, history, comparison, schedule form, master) follows automatically. **Graph assignment (SRS §2.7):** the chart is the type's stored `viz` or `defaultViz(rt)` — an explicit, per-type choice bounded by `compatibleViz(rt)`, no longer a round-robin. `catType(q).viz` drives `v2Viz` (mini card) and the metric sheet's scale/list chart.

---

## 12 · Rules & conventions (non-negotiable)
1. **NO status lifecycle on assessments** — never Pending/Overdue/Completed/approval. Planning indicators (next date, cadence) are OK.
2. **Antz teal/green identity** — use the tokens above; don't clone Apple Health styling.
3. **Inter only**; SVG icons only (no emojis) — Figma style is "Semi Bold" (with space).
4. Charts live on **white cards**, never on the mint page background.
5. Every list gets an **in-place search** (`listSearch`/`searchFilter` + `[data-searchbox]` + `.ls-empty`).
6. Re-render via `render2()`; for filter switches that must keep scroll, swap innerHTML in place (`#aaOvHost`, `#mdSheetBody` pattern) — never re-read filter state from params on render.
7. New analytics/feature work goes in **INDEX 2** (`app2-analytics.js` + `styles2.css`), not index 1.
