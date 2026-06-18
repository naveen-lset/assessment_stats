# Antz Welfare — Assessment Redesign

A clickable prototype that reimagines the Antz animal-assessment flows around
the **Five Domains Model** of animal welfare (the global standard behind
ZIMS/Species360). It borrows the *idea* behind Apple Health — turn logged
entries into glanceable insight — but uses Antz's own teal/green/indigo theme
and a welfare-science visualization, not Apple's look.

## The thesis
The five Antz categories already map 1:1 to the Five Domains:
Nutrition · Environment · Physical Health (Health) · Behaviour · Mental Domain
(Mental State). So the hero of the app is a **Five-Domain Welfare Dial** — one
ring, one segment per domain, filled to each domain's score, with an overall
welfare index in the center. Below it, each assessment type becomes a tracked
metric with the right chart for its data shape.

## Run it
Open **`index.html`** in any browser (Chrome/Safari). No build, no server,
no internet — charts are hand-built SVG, zero dependencies.

## Information architecture (Species → individuals)
- **Dashboard** (home) — the whole collection (12 animals across 8 species):
  KPIs, a **Needs Attention** triage list, welfare distribution, average **by
  domain** with an auto-insight, 14-day assessment activity, live feed.
- **Species** (tab) — list of species (avg welfare + "N need attention"); tap a
  species → **its individual animals** (Lion → Simba / Nala / Kovu) → tap one.
- **Animal page** — per-animal dashboard (Welfare Dial + favourite metrics +
  highlights). **Assessments are logged here** via the "Log Assessment" button
  → pick a type (grouped by domain) → enter a value.
- **Metric history** — D / W / M / 6M / Y selector swaps the real series
  (daily ↔ weekly ↔ monthly), axis labels, range and recent entries.
- **Setup** — the assessment-type library & templates (admin side).

## Visual identity
Uses the Antz dark-teal header band (from the original app), brand teal/green/
indigo palette, and brand-pill controls — deliberately NOT the Apple Health
white large-title + iOS segmented-control look. Final visual direction pending
client design references.

### Information hierarchy (why the dashboard is ordered this way)
1. *Is anything wrong?* → Needs Attention (act first)
2. *How's the collection?* → welfare distribution + avg index
3. *Are we keeping up?* → assessment activity / compliance
4. *Where are the systemic weak spots?* → average by domain
5. *Drill into one animal* → the per-animal page

### Deep links (for demoing / QA)
Append a hash to the URL:
`#dashboard` `#browse` `#setup` `#setup-templates` `#profile` `#newtemplate`
`#animal:lion` (or any id) `#metric:weight` `#metric:eye` `#category:behaviour`
`#add:weight` (entry sheet) `#taxon` (taxon picker)

## What maps to the original screens

| Original Antz screen | Redesigned as |
|---|---|
| Animal assessment home (94/36, categories) | **Setup** — stat cards + color-coded category list |
| Templates list / detail | **Setup ▸ Templates**, Template detail |
| New Assessment Type / Select Category | **New Type** form + Category picker sheet |
| Physical Health type list | **Category** screen |
| Assessment Type detail | **Type detail** |
| New Template (Info/Types/Species) | **Template builder** with the same 3 tabs |
| Choose Taxon (Class/Order/Family) | **Taxon picker** sheet |
| Animal profile — Lion (ID card) | **Profile** — dark hero card + Taxonomy |
| Assessment tab + empty states | **Summary dashboard** (the big change) |
| Add Weight / Posture entry modals | **Add Entry** bottom sheet |

## The core idea
The original app was all *input* and empty states ("Wake me up when there's
data"). This redesign closes the loop: every assessment type becomes a metric
with a **latest value, sparkline, trend, full chart, and stats**.

- **Line charts** (gradient fill + average line) — Weight, Food Intake, Temp
- **Bar charts** (rounded) — Body Condition, Activity Level
- **Categorical timeline** (color dots) — Eye Condition: Good / Fair / Poor
- **Highlights** — plain-language trend cards ("weight up +12 kg over 30 days")

## Color system — Antz brand (sampled from the original screens)
Not Apple's red/orange palette. The five domains live in the Antz
teal→green→indigo→violet family so they read as one brand:
- Physical Health · deep teal `#138C8C`
- Environment · green `#2FAE73`
- Nutrition · sage-lime `#8FBF52`
- Behaviour · indigo `#5A62C9`
- Mental Domain · soft violet `#9B8BD0`

Brand accent (tabs, buttons, links, FAB): teal-green `#17A186`. Deep header
gradient: slate-teal `#2C4F59`→`#15282C`. Soft tints: aqua `#BBECE9`.

## Files
- `index.html` — phone shell + status/tab bar
- `styles.css` — Apple Health design system
- `app.js` — mock data, SVG chart engine, screen router
