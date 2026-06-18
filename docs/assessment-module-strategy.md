# Antz — Assessment Management Module · Product Strategy

Enterprise assessment intelligence for the Antz Animal Care Management System.
Companion framing: [assessment-module-framing.md](assessment-module-framing.md) (decisions D1–D9).

Scale targets: **200k+ species · 2.2M+ animals · multi-org / multi-site · billions of historical assessment rows over time.**

---

## 0. North Star & Design Principles

> **A decision surface, not a data display.** Every view answers a specific decision (D1–D9) for a specific role at a specific altitude.

| Principle | Consequence |
|---|---|
| **Decision-first** | No tile ships unless it maps to a decision in the framing doc. |
| **Aggregate-first, drill-on-demand** | You can never render 2.2M animals. Default = org/site/species rollups; individuals only at the leaf. |
| **Role-based altitude** | Exec sees org; Curator sees collection; Vet sees animal. Same data, different default elevation. |
| **Trust through traceability** | Every aggregate number drills to its underlying records in ≤3 clicks. |
| **Configurable by taxon** | Species drive *what* is assessed; the platform is a rules engine, not hardcoded forms. |
| **Five Domains backbone** | Nutrition · Environment · Physical Health · Behaviour · Mental — the common welfare currency across all species. |
| **Action attached to insight** | Every flagged item carries the next action (assign, schedule, escalate, treat). |

---

## 1. Configurable Assessment Model *(foundation — Decision D9)*

> **Detailed in [assessment-data-model.md](assessment-data-model.md)** — the Type→Sub-Type catalog,
> the 4 response types (Text · Numeric Value · List · Numeric Scale), and how each one feeds
> scoring, charts, and comparison. **Key rule:** response type determines whether data is
> *Scored* (Numeric Scale, mapped List), *Monitored* (Numeric Value vs range), or *Descriptive*
> (Text, context Lists) — and which chart renders.

The entire module rests on a **template/rules engine**, because species requirements differ.

```
Assessment Type            (domain-aligned: Physical Health, Behaviour, Nutrition, Environment, Mental)
  └─ Assessment Sub-Type   (e.g. Body Condition, Dental, Lameness, Stereotypy, Enrichment Response)
       └─ Item / Question  (response type: numeric · scale(1–5/1–9) · categorical · boolean · photo · free-text)
            └─ Scoring rule (item → score; weights; pass/fail threshold; domain mapping)
```

**Configuration objects**
- **Template** = a versioned bundle of sub-types + items + scoring + schedule, **scoped to a taxon** (species / genus / family / class) and optionally **life stage, sex, housing type**.
- **Applicability rules** — "Reticulated Python requires X; Lion requires Y." Resolved by taxon + context, so a species inherits sensible defaults and overrides only what differs. *This is how you manage 200k species without 200k hand-built forms.*
- **Schedule rules** — frequency / cadence per sub-type per taxon (e.g. weight weekly, dental annually), generating the **due → pending → overdue** lifecycle.
- **Scoring model** — item scores → sub-type score → domain score → **Welfare Index (0–100)**; configurable thresholds define **Pass/Fail** and risk bands. (Assumption A1–A3.)
- **Versioning** — templates are immutable once published; new versions don't mutate historical records (audit integrity).

**Admin surface:** Template Builder, Applicability matrix (taxon × sub-type), Schedule editor, Scoring/threshold editor, Publish/version control, Role permissions.

---

## 2. Information Architecture & Navigation

### Global shell (persistent)
- **Context bar:** Org switcher → Site filter → Time range → (taxon/life-stage filters). Context cascades down every screen and is shown as a breadcrumb.
- **Omni-search / command bar:** typeahead across species, animals (by ID/name/enclosure), records, sites, assessors. Faceted. The primary way to reach any of 2.2M animals.
- **Alerts / inbox:** critical findings, overdue spikes, threshold breaches (subscribable).

### Primary navigation
| Nav item | Serves | Altitude |
|---|---|---|
| **Overview** (role-based landing) | D1/D3/D5/D6 | role-dependent |
| **Assessments** (records + work queue) | D1, D3 | record / queue |
| **Species** | D4 | species |
| **Animals** (reached via search / drill) | D1, D2 | animal |
| **Comparisons** | D2, D4, D5 | any |
| **Insights / Reports** | D5–D8 | org / site |
| **Admin / Configuration** | D9 | platform |

### Dashboard hierarchy (altitude ladder)
```
Executive (Org)  →  Site  →  Species  →  Animal  →  Assessment Record
     D5,D6,D7        D3,D5     D4          D1,D2        D2, audit
        ↑___________________ drill down / breadcrumb up ___________________↑
```

### Role-based default landing (same system, different door)
| Role | Lands on | Because (decision) |
|---|---|---|
| Senior Management | **Executive Overview** (org KPIs, site league, risk & compliance) | D5, D6, D7 |
| Zoo Manager | **Site Overview** | D3, D5 |
| Curator | **Attention Queue** (their collection, risk-ranked) | D1, D3 |
| Veterinarian | **Clinical Queue** (animals declining / flagged) | D1, D2 |
| Biologist | **Species Analytics** | D4 |
| Assessor / Keeper | **My Work** (due/overdue assessments) | D3 |
| Compliance / QA | **Compliance Scorecard** | D6 |

---

## 3. Dashboard Hierarchy

### 3A. Executive / Overall Assessment Dashboard *(covers requested §1 + §6)*

Audience: Senior Management, Directors. Answers **D5, D6, D7**. Everything is org-level, drillable to site.

**Row 1 — Posture KPIs (the "are we OK?" strip)**
| KPI | Definition |
|---|---|
| Total Assessments Conducted | count in period (Δ vs prior period) |
| Completion Rate | completed ÷ scheduled |
| On-Time Rate | completed by due ÷ completed |
| Pending / Overdue | open & not-yet-due / past-due counts + rate |
| Coverage | animals with current required assessments ÷ animals requiring them |
| Welfare Index (org) | population-weighted mean Five-Domain index |
| Risk Index | share of population in Watch/At-Risk bands |
| Compliance Score | adherence to required program (per standard) |

**Row 2 — Where to look**
- **Site league table / map** — sites ranked by composite (welfare · completion · risk · compliance), with sparkline trend. → *Top performing & sites needing attention (§6).*
- **Risk heatmap** — Site × Five Domain (or Species-class × Domain) colored by risk. The single most powerful "where's the problem" object.

**Row 3 — Trends & emerging risk**
- Org Welfare Index & Completion trend (line + moving average, period selector D/W/M/Q/Y).
- **Emerging risk (D7)** — cohorts trending toward threshold (forecast band); flagged before crisis.

**Row 4 — Findings & accountability**
- **Recent Critical Findings** feed — severity-ranked, each linking to the animal & record.
- **Most frequently failing assessments** (§6) — by sub-type, with fail-rate trend.
- **Species with highest risk** (§6) — ranked, drill to species analytics.
- **Workforce performance** (§6, D8) — throughput, on-time %, rejection/rework rate by site/team.

Every Row-2/3/4 object is a **drill-down entry point** to site → species → animal → record.

### 3B. Site Dashboard
Same structure scoped to one site; adds **section/enclosure breakdown**, **assessor roster & workload**, **this-site overdue queue**. Answers D3, D5.

### 3C. Species Assessment Analytics *(covers requested §2)*

Reached from search, risk lists, or species nav. Answers **D4**. Aggregates across all individuals of the species (within current org/site context).

| Block | Content | Best viz (see §7) |
|---|---|---|
| Header | Species, taxon, population in scope, current avg Welfare Index, risk band | ring + tier bar |
| **Assessment Distribution** | which types/sub-types are performed, volume & mix | stacked bar / treemap |
| **Assessment History** | volume & scores over time | line/area + sparklines |
| **Pass/Fail Trends** | pass-rate per sub-type over time | 100% stacked area / line |
| **Average Scores** | per Five Domain + overall, vs prior period | radar + bullet vs baseline |
| **Risk Trends** | share of population in each risk band over time | stacked area |
| **Species Health Indicators** | key sub-type scores (BCS, etc.) with normal ranges | bullet / control band |
| **Comparison with Similar Species** | this species vs cohort (same family/diet/housing) | radar overlay / dot plot |
| **Assessment Frequency Analysis** | scheduled vs actual cadence, overdue hotspots | calendar heatmap |

### 3D. Animal Assessment Analytics *(covers requested §3)*

The clinical leaf. Answers **D1, D2**. (This continues the existing prototype's animal page.)

| Block | Content | Best viz |
|---|---|---|
| Header | Animal ID, species, life stage, enclosure, status, current Welfare Index | photo + ring |
| **Assessment Timeline** | chronological assessments, color by result | event timeline / calendar heatmap |
| **Latest Assessment Results** | most recent per sub-type, pass/fail, finding flags | result cards |
| **Historical Trends** | each metric over D/W/M/6M/Y | line/area + range |
| **Average Scores** | per domain, vs own baseline & species norm | radar (animal vs species) |
| **Improvement / Decline Analysis** | direction & rate of change, significance | delta + trend arrows / slope |
| **Health & Welfare Trends** | Five-Domain index over time | stacked/line + welfare dial |
| **Assessment History Comparison** | this vs previous assessment(s) side-by-side | diff table + overlay |
| **Upcoming Scheduled Assessments** | what's due/overdue for this animal | schedule list + due chips |

---

## 4. Assessment Record Management *(covers requested §4)*

Each assessment is an **immutable, auditable record** with a review lifecycle.

**Record schema (key fields)**
`Assessment ID` · `Type` · `Sub-Type` · `Template version` · `Animal / cohort` · `Assessor` + `Role` ·
`Date & time` (+ timezone, capture method) · `Items & responses` · `Computed scores` (item→sub-type→domain) ·
`Pass/Fail` · `Findings` (severity) · `Approval status` · `Reviewer(s)` · `Review history` · `Attachments` (photos, lab, video) ·
`Notes` · `Audit trail`.

**Lifecycle / approval workflow**
```
Draft → Submitted → Under Review → (Approved | Rejected→Returned) → Locked
                                        ↳ clinical sub-types may require vet e-signature
```
- **Audit trail** — append-only, who/what/when for every state change & field edit; tamper-evident; never overwritten.
- **Review history** — reviewer, decision, comments, timestamps.
- **Versioning** — corrections create a new version linked to the original; history preserved (compliance).
- **Attachments** — typed, virus-scanned, thumbnailed; stored in object storage, referenced by record.
- **Bulk & queue actions** — assign, batch-approve (non-clinical), reassign overdue.

---

## 5. Assessment Comparison Module *(covers requested §5)*

A first-class workspace (not buried in a chart). Pick entities → pick metrics → compare.

| Comparison | Entity pickers | Normalization note |
|---|---|---|
| Animal vs Animal | 2–N animals | same sub-types only; align by age/life-stage where relevant |
| Species vs Species | 2–N species | compare on Five-Domain index & shared sub-types; population-weighted |
| Site vs Site | 2–N sites | normalize by population & species mix (avoid composition bias) |
| Current vs Previous | one entity, two assessments | item-level diff |
| Period vs Period | one entity, M/Q/Y | trend overlay |

**Outputs:** Score differences (delta table, color-coded) · Trend graphs (overlaid lines) · Improvement % · Risk changes (band movement) · Performance indicators · **statistical caveat** (sample size / significance) so comparisons aren't misread. Save & share comparison sets; export.

---

## 6. Analytics & KPI Framework

Precise, shared definitions (so every screen and role means the same thing).

**Coverage & Compliance**
- **Coverage %** = animals with all *required* assessments current ÷ animals requiring them.
- **Completion Rate** = completed ÷ scheduled (period).
- **On-Time Rate** = completed by due ÷ completed.
- **Overdue Rate** = overdue ÷ (due in period).
- **Compliance Score** = weighted adherence to the required program per standard (AZA/EAZA/WAZA/national — *confirm U3*).

**Welfare & Risk**
- **Domain Score (0–100)** per Five Domain; **Welfare Index** = weighted mean of domains.
- **Pass Rate** = passed ÷ assessed, per sub-type (threshold-based, A3).
- **Risk Index / Band** = f(welfare level, decline rate, low-domain count, overdue, critical-finding severity) → Excellent / Good / Watch / At-Risk. Drives D1, D5, D7.

**Workforce (D8)**
- Throughput (assessments/assessor/period) · On-time submission % · Rejection/rework rate · Finding rate · **Inter-rater reliability** (consistency vs peers on same sub-type).

**Aggregation grain:** all KPIs computed at **animal → species → site → org**, each × **day/week/month/quarter/year**, and sliceable by taxon (class/order/family), life stage, assessment type/sub-type, assessor.

---

## 7. Graphs & Visualizations *(covers requested §7)*

Mapped need → recommended chart → why.

| Need | Primary chart | Why / when |
|---|---|---|
| **Trend analysis** | Line / area + moving average + confidence band | direction over time; band shows volatility. Use **sparklines** in tables for many series at once. |
| **Score distribution** | Histogram; **box / violin** for spread; **radar** for the 5 domains | see shape & outliers, not just the mean. |
| **Species comparison** | **Radar overlay** (5 domains) · grouped bar · **bullet chart vs baseline** · dot plot | radar = welfare shape; bullet = "vs target/norm" at a glance. |
| **Assessment completion** | Stacked bar (status mix) · progress / gauge · **funnel** (draft→approved) · **calendar heatmap** (cadence) | funnel exposes where assessments stall; calendar shows rhythm & gaps. |
| **Risk monitoring** | **Heatmap** (site×domain / species×domain) · **treemap** (population by risk) · **bubble** (risk vs population vs trend) | heatmap = where; treemap = how much; bubble = priority triage. |
| **Historical performance** | Line + event annotations · **control chart (SPC)** with UCL/LCL | SPC separates real signal from normal variation — critical at scale. |
| **Predictive insights (D7)** | Forecast line + **prediction interval** · anomaly markers · risk gauge | always show uncertainty band; never a bare predicted number. |
| **Composition / where to drill** | **Treemap / icicle** of org→site→species by population or risk | navigate 2.2M animals visually without listing them. |

**Charting rules:** consistent domain colors everywhere; always show *n* and time window; every chart is drillable & exportable; avoid pie charts beyond 2–3 slices; lazy-render off-screen charts.

---

## 8. Scalability & UX *(covers requested §8)*

### Data & aggregation architecture (handling 2.2M+ animals, billions of rows)
- **CQRS split:** OLTP for assessment capture (append-only, partitioned by **tenant + date**); a separate **analytics/columnar read store** (e.g. ClickHouse / BigQuery / Druid) for all dashboards.
- **Pre-aggregation (the core scaling move):** nightly + streaming **rollup cubes** at every grain (org/site/species/animal × day/week/month) with measures (counts, scores, pass, overdue, risk). **Dashboards read rollups, never scan raw rows.**
- **Materialized views / summary tables** refreshed incrementally on write (event-driven), not recomputed.
- **Search index** (OpenSearch/Elasticsearch) for entities & records → instant faceted search/typeahead across millions.
- **Caching:** rollup + query cache with write-through invalidation; CDN for assets.
- **Async for heavy work:** large comparisons, exports, org-wide reports → background job → notify when ready.
- **Partitioning / tiering:** shard by tenant; partition history by time; **hot/warm/cold** storage (recent fast, deep history cheaper).
- **Multi-tenancy & security:** strict org isolation, **RBAC + row-level security**, site-scoping; every query tenant-bounded.

### Performance for the UI
- **Cursor pagination + server-side filter/sort**; **list virtualization**; bounded result sets (top-N + "refine").
- **Aggregate-first rendering**: load the rollup (small) instantly; fetch detail only on drill.
- Skeleton/loading states; optimistic UI for capture; prefetch likely drill paths.

### Filters, Search, Drill-down
- **Persistent cascading filter context** (Org → Site → Taxon → Life stage → Time), shown as breadcrumb chips, carried across screens.
- **Faceted search** with saved segments ("All at-risk reptiles, Site B").
- **Drill-down is universal:** any aggregate → next altitude down; breadcrumb up; deep-linkable URLs.
- **Saved views, alerts/subscriptions, scheduled report exports** (PDF/CSV) per role.

### UX system
- Continue the **Antz Welfare premium design language** (Five-Domain rings, light premium cards, lollipop/area charts, photo placeholders) from the existing prototype — extended with the enterprise patterns above (league tables, heatmaps, comparison workspace, queues).
- Density modes (comfortable / compact) for power users; full keyboard nav; accessibility (contrast, ARIA, color-blind-safe risk palette).

---

## 9. Delivery Roadmap (phased — descriptive → diagnostic → predictive)

| Phase | Theme | Ships |
|---|---|---|
| **P1 — Foundation** | Configurable model + records | Template/rules engine, record lifecycle + audit, capture, schedule→pending/overdue |
| **P2 — Descriptive** | See the data | Animal & Species analytics, Site dashboard, completion/coverage KPIs |
| **P3 — Diagnostic** | Compare & explain | Executive overview, risk heatmaps, Comparison module, workforce metrics, compliance scorecard |
| **P4 — Predictive (D7)** | See it coming | Decline detection, forecast bands, SPC alerts (*confirm U4*) |

---

## 10. Traceability — your 8 requested areas → where delivered

| Requested area | Delivered in | Decision |
|---|---|---|
| §1 Overall Assessment Dashboard | §3A | D5, D6, D7 |
| §2 Species Assessment Analytics | §3C | D4 |
| §3 Animal Assessment Analytics | §3D | D1, D2 |
| §4 Assessment Record Management | §4 | D2, audit |
| §5 Assessment Comparison Module | §5 | D2, D4, D5 |
| §6 Executive Insights | §3A (Rows 2 & 4) | D5, D8 |
| §7 Graphs & Visualizations | §7 | all |
| §8 Scalability & UX | §8 | all |
| (foundation, implied) | §1 config model | D9 |

---

## 11. Open items to confirm before engineering commitment (from framing U1–U3)
1. **Tech/data platform** available (OLAP store, search) → finalizes §8 specifics. *(U1)*
2. **Scoring rubric & pass/fail thresholds** per sub-type → finalizes §1, §6. *(U2)*
3. **Compliance standard(s)** in force → finalizes Compliance Score & audit exports. *(U3)*
4. **Predictive scope** for v1 vs Phase 4. *(U4)*  ·  5. **Offline field capture** need. *(U5)*
