# Antz — Assessment Module · UI Build (3 Phases)

How we **design & prototype the screens** in the existing premium UI — phased by altitude,
matching the earlier direction (Species → Animals → Executive). Engineering phasing lives in
[assessment-3-phase-plan.md](assessment-3-phase-plan.md); this one is **screens & components only.**

```
UI PHASE 1 — SPECIES layer        (browse · analytics · configure)
UI PHASE 2 — ANIMAL layer         (analytics · capture · record)
UI PHASE 3 — EXECUTIVE layer      (org dashboards · compare · compliance)
```

Status legend: 🟢 built · 🟡 extend · 🔵 new.

---

## UI PHASE 1 — Species Layer
> Browse species, see how a species is doing, and configure what each species is assessed on.

| Screen | Status | Key UI components to build |
|---|---|---|
| Species Browse (rich cards) | 🟢 | photo placeholder, welfare ring, tier bar, attention flag |
| **Species Analytics** | 🔵 | **radar** (5 domains), pass/fail stacked-area, risk-trend area, distribution bars, similar-species **radar overlay**, frequency calendar-heatmap |
| Species Detail (individuals) | 🟢 | animal cards list |
| **Type & Sub-Type Catalog** | 🟡 | the 5 Types → sub-type list, add/edit |
| **Template Builder** | 🟡 | Sub-Type → Item → **Response-Type picker** (Text · Numeric · List · Scale) |
| **Scoring & Threshold editor** | 🔵 | option→score mapping rows, scale **direction / target-band** control, threshold sliders, domain-weight inputs |

**Phase deliverable (clickable):** browse → species analytics → open the config and build a
Type → Sub-Type → Response Type → scoring rule. New chart components: radar, stacked-area,
calendar-heatmap, distribution bars.

---

## UI PHASE 2 — Animal Layer
> Open an animal, read its full assessment story, log a new assessment, view the record.

| Screen | Status | Key UI components to build |
|---|---|---|
| Animal Assessment Analytics | 🟢→🟡 | add **assessment timeline**, improvement/decline delta, **upcoming scheduled** list, history-comparison overlay |
| Metric / Sub-Type detail | 🟢 | D/W/M/6M/Y chart (auto-picked by response type), stats |
| **Work Queue** ("My Work") | 🔵 | due / pending / **overdue** status chips, filters, assign/reschedule |
| **Conduct Assessment** (capture) | 🟡 | **dynamic form per response type**: text box · numeric+unit · list/segmented · 1–9 scale stepper; photo attach; notes |
| **Assessment Record detail** | 🔵 | header (ID, type, assessor+role, datetime, status), scores, **review history**, attachments, **audit trail** timeline |
| Review / Approve | 🔵 | approve/reject/return, e-signature affordance |

**Phase deliverable (clickable):** queue → open animal → analytics → log an assessment of each
response type → see the scored record + audit trail. New components: timeline, four response-type
input controls, record/audit layout, status chips.

---

## UI PHASE 3 — Executive Layer
> Roll everything up for leadership, compare, and prove compliance.

| Screen | Status | Key UI components to build |
|---|---|---|
| **Executive Overview** | 🔵 | KPI strip, **site league table**, **risk heatmap** (site × domain), org trend, critical-findings feed, failing-assessments list, riskiest-species list, workforce row |
| Site Overview | 🟡 | scoped KPIs, sections, assessor workload, site overdue queue |
| **Compliance Scorecard** | 🔵 | per-standard adherence gauges, evidence links, export button |
| **Risk Center** | 🔵 | heatmap + **treemap** (population by risk), emerging-risk forecast band |
| **Comparison Workspace** | 🔵 | entity pickers (animal/species/site/period), **overlaid trend lines**, **radar overlay**, delta table, improvement % |
| Reports / Alerts / Omni-search | 🔵 | report cards, alerts feed, faceted search results |

**Phase deliverable (clickable):** executive dashboard → drill to site → species → animal; open the
comparison workspace; view compliance. New components: league table, heatmap, treemap, comparison
workspace, KPI tiles.

---

## New chart/components introduced, by phase
| Phase | New visual building blocks |
|---|---|
| 1 | radar, stacked-area, distribution bars, calendar-heatmap, config forms, response-type picker, score-mapping editor |
| 2 | assessment timeline, 4 response-type input controls, record + audit layout, status chips, queue list |
| 3 | KPI strip, league table, **risk heatmap**, treemap, comparison workspace, compliance gauges, alerts/search |

## Reuse (already in the prototype)
Premium design system, welfare dial, mini rings, area/line/bar/lollipop charts, photo placeholders,
species cards, animal page, metric detail, setup/templates, add-entry sheet, day selector.

## Suggested build order within Phase 1
1. Species Analytics (richest reuse of existing charts + new radar) — visible win.
2. Type/Sub-Type Catalog + Template Builder (extends existing Setup).
3. Scoring & Threshold editor (the response-type → score mapping UI).
