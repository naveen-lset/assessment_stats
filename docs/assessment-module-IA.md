# Assessment Module — Information Architecture & Build Plan

Enterprise Wildlife Welfare Analytics. The **Assessment Dashboard** (screens/30-dash-analytics.js)
is the canonical design system; every page below reuses its header, cards, filters, tabs,
charts, tooltips, spacing, and elevation. Single unified design language.

**CRITICAL — NO STATUS LIFECYCLE.** There is NO Pending / Overdue / Completed / In-Progress /
approval / reject. An assessment is simply a *done record*. KPIs are counts/scores/coverage/risk,
never workflow stages. (User correction, enforced; see memory antz-no-status-lifecycle.)

---

## 1. Information Architecture

```
Assessment Module
├── Dashboard (analytics overview)            [SCREENS.dashboard]
│   ├── Overall Statistics (4 KPI cards, clickable)
│   ├── Assessment Trend (interactive, filter-driven)
│   ├── Domain Comparison (radar)
│   ├── Welfare Domains (rows + perf chart, domain filter)
│   ├── Risk Analytics (donut + count/%)
│   └── Assessment Analytics (6 metric cards)
├── Assessment List              [amList]   ?period / ?animal / ?sp / ?domain  (NO status)
│   └── Assessment Detail        [bottom sheet — openAssessment(id)]
│       └── Domain card → Animal Domain History
├── Animals Assessed             [amAnimals]
│   └── Animal Profile           [amAnimal] tabs: Overview·Assessments·Analytics·History
│       ├── Assessment → Detail sheet
│       └── Domain → Domain History
├── Species List                 [amSpeciesList]
│   └── Species Analytics        [amSpecies]
├── Welfare Analytics            [amWelfare]
│   └── Domain Analytics         [amDomain]  (per domain)
│       └── Domain History       [amDomainHistory]  (animal × domain)
└── Risk Animal List             [amRisk]   ?level=high|medium|low
        └── Animal Profile
```

## 2. Navigation Flow (every click → destination, every page → back path)

| From | Element | → Destination |
|------|---------|---------------|
| Dashboard | Total Assessments card | amList (current filter) |
| Dashboard | Animals Assessed | amAnimals |
| Dashboard | Species Covered | amSpeciesList |
| Dashboard | Avg Welfare | amWelfare |
| Dashboard | Welfare Domain row | amDomain(key) |
| Dashboard | Risk level row | amRisk(level) |
| amList | list item | Assessment Detail bottom sheet |
| Detail sheet | domain card | amDomainHistory(animal, domain) |
| amAnimals | animal | amAnimal (Overview) |
| amAnimal/Assessments | assessment | Detail bottom sheet |
| amAnimal/History | timeline item | Detail bottom sheet |
| amSpeciesList | species | amSpecies |
| amSpecies | animal | amAnimal |
| amWelfare | domain | amDomain |
| amDomain | affected animal | amAnimal |
| amRisk | animal | amAnimal |

Back path: every page renders `amHeader(..., {back:true})` → `back()` (router stack in app.js).

## 3. Screen Hierarchy (drill levels)

L1 Dashboard → L2 List / Animals / Species / Welfare → L3 Detail sheet / Animal Profile / Species Analytics / Domain Analytics → L4 Domain History → L5 deeper analytics.

## 4. Component Inventory (shared, reused everywhere)

Design-system primitives (from dashboard kit, screens/30 + app.js):
- `amHeader(title, sub, {back, actions})` — Title / Subtitle / Actions (matches d2-top)
- `globalFilter(filter, ctx)` — Today·Week·Month·Year·Custom (persists via STATE.dashF)
- `amTabs(items, activeKey, stateKey)` — Overview | Assessments | Analytics | History
- `d2card`, `d2card-h (.ttl/.sub)`, `d2-seg` — cards + in-card segmented controls
- KPI card `ocell` (clickable), `ostat` grid
- Charts: `trendChart`, `radarChart`, `multiLine`, `donutChart`, `dashSpark`, `ringPct` (+ tooltips dashTip)
- Lists: `amAssessmentItem`, `amAnimalItem`, `amSpeciesItem`, `amDomainItem`
- Pills: `statusPill`, `riskPill`, `scorePill`
- `imgBox(sp, size, radius)` — REAL image (loremflickr by species) + emoji fallback
- `openAssessment(id)` — Detail bottom sheet (reuses app.js openSheet)
- `timeline(items)` — History tab
- `domainCard(...)` — domain breakdown card

Data layer (screens/31 kit):
- `AM_RECORDS` — assessment records {id, animalId, sp, type, domain, date, time, score, status, assessor, location, notes, domains{5}}
- `amRecordsFor(filter|animal|status)` — filtered queries
- `amDomainHistorySeries(animal, domain)` — trend over time
- `SP_IMG` — species→real image URL map

## 5. User Journey Map

1. **Curator opens Dashboard** (filter=Week) → scans Total/Completed/Pending/Overdue, trend, radar, risk.
2. Sees 12 Overdue → taps **Overdue card** → amList(status=overdue, Week) → list of overdue assessments w/ animal images.
3. Taps a record → **Detail sheet**: animal+species image, status, risk, score, 5 domain cards.
4. Taps **Nutrition** domain → **Domain History** for that animal → trend, declines/improvements.
5. Back → taps animal name → **Animal Profile** → Overview → switches to **Analytics** tab → trends.
6. From Dashboard later, taps **Avg Welfare** → **Welfare Analytics** → taps **Mental Domain** → **Domain Analytics** → lowest-performing animals → taps animal → Profile.
7. Filter changed to **Month** anywhere → all stats/charts/lists/trends update; context persists on navigation.

## 6. Build Order
kit+data → dashboard drill-downs → list+detail → animals+profile+domain-history → species/welfare/domain analytics → risk lists → wire + verify.
