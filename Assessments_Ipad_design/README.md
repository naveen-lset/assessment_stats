# Assessments — iPad design

Assessments screens for the hospital app on iPad (tablet surface, 810 × 1080, iPad 9th gen).
All work for this project goes in this folder. The design library it builds on is the repo root (`../`).

## Folder layout
```
Assessments_Ipad_design/
  README.md            this brief
  1-iterations/v1/     one folder per pass (v1, v2 …); each has its own index.html
  review/              Figma crops for anything new that needs a Needs Review entry
```
Start a new pass by copying the latest `vN/` folder to `vN+1/`. Don't edit an older pass.

## Link the library (from `1-iterations/vN/index.html`)
```html
<link rel="stylesheet" href="../../../app/tokens.css">         <!-- colours, spacing --sp-2 … --sp-64 -->
<link rel="stylesheet" href="../../../app/type.css">           <!-- .t-* text styles (Inter) -->
<link rel="stylesheet" href="../../../app/components.css">     <!-- global components, incl. TABLET section -->
<link rel="stylesheet" href="../../../app/modules/hospital.css"><!-- hospital-only pieces, after components.css -->
<link rel="stylesheet" href="../../../app/icons/icons.css">    <!-- .i-<slug> icon classes -->
```
The app uses `app/tokens.css`, **not** `shared/colors.css` (that one's for web).
Open over a local server from the repo root: `python3 -m http.server 8788`, then go to http://localhost:8788/Assessments_Ipad_design/1-iterations/v1/

## Library rules that apply here
- **Colours:** only `var(--token)` from `app/tokens.css`. No hex in previews. Opacity steps are `--<token>-a5 … -a90`.
- **Text:** only the `.t-*` classes from `app/type.css`. No `font-size` / `font-weight` in previews. `.t-medium-title` (Bold) is rejected, so use `.t-medium-medium` or `.t-minor-title` instead. Scientific names use `.t-body-reg-italic`.
- **Spacing:** the `--sp-*` scale and the `.p-N .gap-N …` utilities, not typed pixel values.
- **Icons:** only from `app/icons/` (for colour, use `app-icon app-icon--tint i-<slug>` plus `style="color:var(--…)"`). If a glyph is missing, add it to `app/icons/new/` + `new/index.json` and get Swathi's approval. Don't draw or download icons.
- **Anything new** (component, pattern, colour, text style) goes into `app/needs-review.json` with a `plain` wording and a `preview`. Put the crop in `review/`. Set Scope to *Hospital module* if it only makes sense in assessments.
- Every value carries a `/* src: <Figma node> */` comment. If you can't cite a source, don't add the value.

## Tablet pieces already approved (use these first)
From `app/components.css` › TABLET and `app/modules/hospital.css`:
| Need | Class |
|---|---|
| Header with logo, title, sub line | `.hdr`, `.hdr__row`, `.hdr__title`, `.hdr__sub` |
| Search + date + icon box | `.hdr__tools`, `.tab-search`, `.tab-date`, `.tab-iconbox` |
| Pill tabs | `.tab-primary-tabs`, `.tab-primary`, `.tab-primary--active` |
| Segmented filter + dropdown + filter box | `.section`, `.tab-seg`, `.tab-seg__item`, `.tab-dd`, `.tab-iconbox--40` |
| Row card (expandable) | `.cards`, `.pcard`, `.pcard__row`, `.pcard__content`, `.pcard__meta`, `.expand-btn`, `.pcard__note` |
| 40-high buttons | `.btn`, `.btn--admit`, `.btn--reject`, `.btn--revert` |
| Case type tags | `.case-tag--checkup / emergency / planned / opd / followup` |

Still page-level (not approved yet): Under Care card extras + Stable / Critical chips, document chip + QR box, floating Add Patient, tablet navigation bar.

## What earlier hospital passes already proposed for assessments
There are 47 items in `app/needs-review.json` that touch assessments (from hospital app/tab passes v18–v64). 2 are approved and the rest are still open. The ones to know before designing:

**Approved**
- Tab strip with placeholder content for unbuilt sections (v23)
- Monitoring header with count, add and Schedule buttons (v24)

**Clinical Assessment tab (open)**
- Assessment card tinted by prognosis outcome (v27); tentative cards get an outline instead of a fill (v41)
- Pending / Tentative assessments hide the prognosis fields (v34); "Assess now" replaces the blank stage label (v41)
- Search row with Add New button (v27), the same layout as Notes and Monitoring
- A third segmented filter chip style in the module (v27). Chip styles are multiplying, so reuse one.
- Mark as Resolved → bulk-select mode (v27)
- Swipe to resolve / reactivate (v27), full drag with haptics (v32), cancels safely mid-gesture (v41), two visual states (v49)
- Saved confirmation: green ring, tick chip, undo toast (v32); compact tablet toast (v32)
- Trend graph for assessment history (v45 / v47)

**Add Assessment sheet (open)**
- Full height sheet, taller than the standard sheet (v33, v42)
- Parameter chips, one styled differently (v33); Previous / Save / Next-parameter footer (v33)
- Reading log of past parameter entries (v33)
- Sheet form fields use a different corner radius than the admit / add-patient forms (v33)
- Off-palette inactive tab grey and Save button shadow (v33); swap these for library tokens
- Four toolbar tweaks (v45 / v47); keep Notes visible when scrolling (v45 / v47); the sheet lifts fully above the keyboard (v54); the keyboard is styled as its own sheet (v55)
- Native iPad date and time pickers vs the library's custom picker sheet (v39)

Run `node review.mjs pending` from the repo root for the full list. Those hospital passes live outside this repo.

## Open questions for this project
- Is Assessments its own module (`app/modules/assessments.css`) or part of hospital (`hospital.css`)? This decides the Scope on new review items.
- The Figma frames are drawn at phone width (390), but this project is iPad (810). Adapt them, or build at 390 first?

## Passes
- **v1** (2026-09-29): first iPad adaptation of the phone designs, as one clickable prototype with 4 screens. Open a screen directly with `#masters`, `#new`, `#user` or `#sheet`, and add `:<assessment>` to pick one, e.g. `#sheet:Eye Condition`. The page-level styles in its `<style>` block (split view, type tiles, slider, graph, record rows, form sheet) are not in the library yet and are candidates for Needs Review. *Superseded by v2.*
- **v2** (2026-09-29): a working iPad app in the hospital tablet layout language, with a status bar, the header, the search / date row and pill tabs, list and detail cards, full-width bottom sheets, popovers, a floating add button and the bottom nav. Two sections, **Animals** (the vet records and reviews) and **Assessment Masters** (the admin creates, edits, duplicates, deactivates or deletes types). Data saves in the browser (localStorage); to start over, use *Reset demo data* in the Masters ⋮ menu. Files: `index.html` (shell), `app.css` (page-level styles, tokens only), `app.js` (data and views). Deep links: `#animals`, `#masters`, `#new`, `#new:list`, `#detail:Weight`, `#sheet:Eye Condition`.
- **v3** (2026-09-29): cleaner components and **three UX versions of the vet flow**, compared from `v3/index.html`. They share `shared/core.css` and `shared/core.js`: the data, inputs, graph, history view, entry sheet and Assessment Masters. They also share one saved dataset, so an entry made in one version shows in the others.
  - **A · Inline** (`v3/a/`): animals on the left and assessment rows on the right. Tap a row to record in place; Save moves to the next assessment that's due; history slides in from the side. Deep links: `#row:Weight`, `#history:Weight`.
  - **B · Workspace** (`v3/b/`): a grid of animal cards, then a per-animal workspace with the assessment list on the left and its graph and records on the right. Add Entry opens a compact bottom sheet. Deep links: `#animal:Weight`, `#sheet:Eye Condition`.
  - **C · Rounds** (`v3/c/`): today's due list, then a guided round (one assessment per step, Save & Next / Skip / Previous), then a summary with Next animal. Deep links: `#round:a1`, `#summary`.
  - *Not taken forward, kept for reference.*
  - Clean-up over v2: one field style, rows with dividers instead of boxed tiles, the library segmented control everywhere, status as small dots, and one button scale. Renamed a page class that clashed with the library's `.section`.

## Figma source
File `fAOcpkMwZPWEkHO3kMvNoy` (Assessment):
- Master, section `1485:8667`: create and view assessment types (Text, Numeric Value, List, Numeric Scale, Numeric Slider, Reference images)
- User, section `1485:10626`: an animal's assessment tabs, history, graph, and the Add Entry sheet for each type
- Components, section `1485:16978`: graphs (7 variants), assessment cards, input cards, entry cards, animal cards
- **v4** (2026-09-29, current): **the v2 flow built as a tablet product.** Same screens (animals list │ assessments → history → Add Entry, plus Masters) on the v3 clean components, with a tablet interaction layer:
  - `touch.js` + `touch.css`: press feedback, 44pt+ targets, no tap delay · swipe a row left (assessment: Add · History, full swipe adds; record: Edit · Delete, with Undo) · press and hold for a context menu (incl. one-tap "Record same as last") · swipe from the detail pane's left edge to go back · push / pop slide transitions · pull the animal list to refresh · drag across a graph to read values · segmented controls with a sliding indicator · shake on invalid input.
  - Entry sheet: grabber, medium / large heights, drag down to dismiss or up to expand, **in-sheet number pad** (the iPad keyboard never covers Save), "Same as last", edit an existing record.
  - Collapsible animal list (the list icon, top right); portrait 810 × 1080 and landscape 1080 × 810 (review bar on the left; a real iPad follows the device).
  - Hardware keyboard: ⌘1 / ⌘2 sections · ⌘F or / search · ↑ ↓ animal · N add entry · ← back · ⌘\ list · digits on the number pad · Esc closes. Hold ⌘ to see them.
  - Files: `index.html`, `core.css`, `core.js` (from v3 shared, extended), `touch.css`, `touch.js`, `app.js`. Deep links: `#history:Weight`, `#sheet:Weight`, `#collapsed`, `#land`, `#masters`, `#new`.

## Live link
https://antz-assessments-ipad.antz-design.workers.dev (v4; Cloudflare Worker `antz-assessments-ipad`, static assets). Only v4 and the library files it links to are published.
- **v5** (2026-09-29, mockup): the Assessments tab **inside the Species page**, based on the reference app (species-management `ipad-3`): dark hero, sticky icon tabs, ☰ All Tabs drawer, sub-tabs by category plus Alerts, type chips, a KPI strip, charts and an animal table. Mixed with our Figma flows: tap an animal to open its history side panel, then the Add Entry sheet with number pad; ⚙ opens Assessment settings (Masters) and "New type" (with a schedule that drives Alerts). 8 static portrait screens on one board: `v5/index.html`. Live: /Assessments_Ipad_design/1-iterations/v5/
- **v4 updated** (2026-09-29): **the v5 mockup is now built into v4** as the working prototype. Species › Assessments with the hero, sticky icon tabs, the All Tabs drawer, and sub-tabs Population · Physical Health · Behaviour · Environment · Alerts. Type chips with due dots; KPIs (tap one to filter the table); distribution and trend charts with top and bottom movers; a sortable, searchable animal table with a site filter; Alerts computed from 8 rules. Tap an animal to open its panel (Figma "User": chips per type, graph with finger scrub, stats, swipeable records, Same as last, Add Entry → number-pad sheet). ⚙ opens Assessment settings (Masters, now with a **schedule** per type: due every N days, alert after M more). Data: 16 Indian Leopards. The previous animals-list v4 is kept in `v4-interactions/`. Files added: `species.css`; `app.js` rewritten; `core.js` extended (schedule, species data, settings back navigation).
