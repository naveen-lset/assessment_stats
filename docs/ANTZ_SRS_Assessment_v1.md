# Software Requirements Specification (SRS)
## Assessment Module — Welfare Assessment Analytics

**Document:** ANTZ_SRS_Assessment_v1
**Status:** Draft
**Date:** 2026-06-25

---

## 1. Introduction

### 1.1 Purpose
This document defines the functional and non-functional requirements for the **Assessment Module** of the Antz Animal Care Management System. The module records welfare assessments against animals and turns them into analytics — scores, coverage, trends, comparisons, and risk — across the organisation hierarchy (org → site → species → animal). It does **not** redefine animal registration, which is owned by other modules.

### 1.2 Scope
The module covers: a configurable assessment **catalogue** (Type → Sub-Type → Response Type), capture of assessment **records**, and the analytics surfaces built on them — Dashboard, Assessment List & Detail, Animals, Species, Welfare/Domain analytics, Risk lists, Comparison, and Schedule (planning). It is built on the **Five Welfare Domains** as the common scoring currency.

**Out of scope:** the assessment module is **not** a workflow/ticketing system. There is **no status lifecycle** — no Pending / Overdue / Completed / In-Progress / approval / rejection states. An assessment is simply a *done record*. All KPIs are counts, scores, coverage, and risk — never workflow stages.

### 1.3 Definitions, Acronyms, and Glossary

| Term | Definition |
|---|---|
| Assessment | A completed welfare observation recorded against an animal at a point in time. |
| Assessment Record | The stored, dated assessment with its responses, computed scores, and assessor. |
| Type (Domain) | One of the five fixed Welfare Domains: Physical Health, Behaviour, Environment, Mental Health, Nutrition. |
| Sub-Type | A configurable, species-scoped measure within a Type (e.g. Weight, Body Score, Diet Adherence). |
| Response Type | The data nature of a sub-type: **Numeric Value**, **Numeric Scale**, **List**, or **Text**. |
| Catalogue | The Type → Sub-Type → Response Type configuration; the single source of truth driving capture, scoring, charts, comparison, and schedule. |
| Scoring Contribution | Whether a sub-type is **Scored**, **Monitored**, or **Descriptive**. |
| Domain Score | A 0–100 score for one Welfare Domain, rolled up from its scored sub-types. |
| Welfare Index | The weighted mean of the five Domain Scores (0–100). |
| Coverage | Animals with all *required* assessments current ÷ animals requiring them. |
| Risk Band | A classification (e.g. Low / Medium / High) derived from welfare level, decline, and findings. |
| Baseline / Normal Range | The expected range for a monitored numeric (species- or individual-scoped). |
| Schedule | Planned assessment cadence per sub-type (planning indicator only — never a record status). |

### 1.4 References
- `docs/assessment-module-strategy.md` — product strategy and decision framing.
- `docs/assessment-data-model.md` — Type/Sub-Type catalogue and response-type scoring.
- `docs/assessment-module-IA.md` — information architecture and navigation.
- `ANTZ_SRS_LIMS_v4.docx` — SRS structure reference (Lab Module).

---

## 2. System Overview

### 2.1 Capabilities
- A **configurable catalogue** (Type → Sub-Type → Response Type) scoped per species, driving everything downstream.
- **Capture** of assessment records with responses validated against the catalogue.
- **Scoring**: normalize each scored sub-type to 0–100 → Domain Score → Welfare Index; monitored numerics judged vs normal range; descriptive responses recorded but not scored.
- **Analytics surfaces**: Dashboard, Assessment List & Detail, Animals, Species, Welfare/Domain analytics, Risk lists, Comparison, Schedule.
- **Drill-down** from any aggregate to the underlying records (org → site → species → animal → record).
- **Filtering**: persistent time/species/domain context carried across screens.

### 2.2 Platforms and Responsibilities
- **This module** owns: catalogue config, assessment records, scoring, and all assessment analytics.
- **Other modules** own: animal/species registration, user/role management, and site/org structure. The Assessment Module consumes these as references.

### 2.3 Response Type Reference

| Response Type | Example | Scoring treatment | Best chart |
|---|---|---|---|
| **Numeric Value** | Weight 198 kg, Temp 38.5 °C | **Monitored** vs baseline/normal range (deviation → risk) | line/area + range band |
| **Numeric Scale** | Body Score 1–9, Cleanliness 1–5 | **Scored** → 0–100 via direction (higher-better / lower-better / target-band) | bar / histogram |
| **List** | Eye: Good/Fair/Poor | **Scored** only if options are mapped to values; else descriptive | categorical timeline / 100% stacked |
| **Text** | Notes | **Descriptive** — never scored; may raise a finding flag | feed / record |

**Rule:** Text is never scored. List is scored only if its options are mapped. Numeric Value is monitored against a range. Numeric Scale is scored directly.

The **Best chart** column above is the *default* graph for each response type. The graph is not fixed to that default — it is an explicit, per-type choice bounded by the response type; see **§2.7 Graph Assignment**.

### 2.4 Scoring Contribution Reference

| Mode | Meaning | Feeds Welfare Index? | Feeds Risk? |
|---|---|---|---|
| **Scored** | Produces a 0–100 domain contribution | Yes | Yes |
| **Monitored** | Tracked vs baseline/normal range; no fixed score | Via deviation (optional) | Yes (out-of-range) |
| **Descriptive** | Context / qualitative record only | No | Only if flagged |

### 2.5 Masters and Configuration
- **Catalogue** (Type → Sub-Type → Response Type), per species.
- Per sub-type config: unit, min/max/step, list options + score map, multi-select flag, direction/curve, scoring contribution, domain weight, pass/fail threshold, normal range, schedule cadence, taxon + life-stage scope, required flag, **graph** (the assigned visualization — see §2.7).
- **Species** reference and species→image map.
- **Risk band** thresholds.

### 2.6 Applicability
Sub-types are configured per species (and optionally life stage / sex / housing). A species inherits sensible defaults and overrides only what differs — so 200k+ species are managed via rules, not hand-built forms.

### 2.7 Graph Assignment

Every assessment type stores an explicit **graph** — the visualization its analytics render with. The graph is **auto-defaulted from the Response Type and overridable within that type's compatible set**. Response Type is the gate: it decides *which* graphs are offered; the creator picks one of them; the canonical chart (per §2.3) is pre-selected as the default. This supersedes the earlier "auto-derived, no per-type wiring" statement in `Antz-Assessment-Graph-Spec.pdf` — the four canonical defaults are unchanged, but the choice is now stored and overridable rather than implicit.

**Compatible-set table** (normative — a graph outside its Response Type's set is invalid):

| Response Type | Compatible graphs | Default | What the graph shows |
|---|---|---|---|
| **Numeric Value** | **Trend area** · Trend line · Recency columns | Trend area | Continuous number over time — how it moves, with an average reference and the latest reading emphasised. |
| **Numeric Scale** | **Bars vs ceiling** · Ring gauge · Lollipop · Dot strip | Bars vs ceiling | A bounded rating (1…max) against its ceiling — "how close to ideal" at a glance, latest emphasised. |
| **List** | **Distribution bars** · Donut | Distribution bars | How often each option occurred; options ordered worst → best. |
| **Text** | *(none — notes timeline)* | — | No chart. The latest note is featured; the rest form a searchable, dated timeline. No graph is assigned or offered. |

**Integrity rules:**
1. A type's graph must belong to its Response Type's compatible set; Text types have no graph.
2. **Changing a type's Response Type re-defaults the graph** to the new type's canonical chart and clears any now-incompatible override. (Main edge case — a Scale type set to "Ring gauge" that is switched to List cannot keep "Ring gauge"; it resets to "Distribution bars".)
3. The graph choice is presentation only — it does not affect scoring, the Welfare Index, comparison, or the time axis (always recorded sessions over W / M / 6M / Y; there is no per-day/sensor view).
4. Published catalogue versions do not mutate historical records (consistent with §4.2); a graph change re-renders existing data, it does not alter it.

---

## 3. Functional Requirements

### 3.1 Assessment Model (How It Is Managed)
- Each assessment is an immutable **done record** — no status, no approval workflow.
- A record references an animal, captures one or more sub-type responses, and stores the date/time and assessor.
- Responses are validated against the catalogue (response type, range, allowed options).
- Scores are computed at capture: sub-type → domain → Welfare Index.

### 3.2 Dashboard (Analytics Overview)
- **Overall Statistics**: KPI cards (Total Assessments, Animals Assessed, Species Covered, Avg Welfare) — each clickable, drilling to its list/analytics.
- **Assessment Trend**: interactive, filter-driven trend chart.
- **Domain Comparison**: radar across the five domains.
- **Welfare Domains**: per-domain rows + performance chart with domain filter.
- **Risk Analytics**: distribution (donut + count/%) drilling to risk lists.
- **Assessment Analytics**: per-response-type metric cards with "See More Data" detail sheets.

### 3.3 Assessment List & Detail
- **List** filterable by period / animal / species / domain (never by status).
- **Detail** bottom sheet: animal + species image, score, risk, and five domain cards.
- A domain card drills to that animal's **Domain History**.

### 3.4 Animals Assessed
- **Animal list** with images and key welfare indicators.
- **Animal Profile** with tabs: Overview · Assessments · Analytics · History.
- From a profile, drill to assessment Detail or Domain History.

### 3.5 Species Analytics
- **Species list** → **Species Analytics**: assessment distribution, history, average scores (radar), risk trends, and comparison with similar species.

### 3.6 Welfare & Domain Analytics
- **Welfare Analytics** overview → **Domain Analytics** (per domain) → **Domain History** (animal × domain trend over time, with declines/improvements).

### 3.7 Risk Analytics
- **Risk Animal List** filterable by level (high / medium / low), drilling to Animal Profile.

### 3.8 Comparison
- Compare like response types and shared sub-types: Animal vs Animal, Species vs Species, Current vs Previous, Period vs Period.
- Outputs: score deltas, overlaid trends, improvement %, risk-band movement; scores normalized to 0–100 so different sub-types share a radar.

### 3.9 Schedule (Planning)
- Planning view of assessment cadence per sub-type (due/cadence chips).
- **Planning indicators only** — schedule never introduces a record status; it answers "what is due to be planned," not "what is overdue."

### 3.10 Catalogue Configuration (Admin)
- Define and version the catalogue per species.
- Edit per-sub-type config (§2.5). Published catalogue versions do not mutate historical records.
- On the **New / Edit Assessment Type** master, selecting a Response Type presents its compatible **graph** options (§2.7) with the canonical default pre-selected; the creator confirms or overrides. Changing the Response Type re-defaults the graph per §2.7 integrity rule 2.

### 3.11 Filtering & Drill-down
- Persistent cascading context (time / species / domain) carried across screens.
- Every aggregate drills to the next altitude down; every page exposes a back path.

---

## 4. Data Model and Relationships

### 4.1 Structure
```
Species ─┬─ Catalogue (per species)
         │     └─ Type (Domain, fixed×5)
         │           └─ Sub-Type (configurable)
         │                 └─ Response Type config (unit, range, options, scoring)
         │
Animal ──┴─ Assessment Record
                └─ Sub-Type Response (value | scale | list | text)
                      └─ Computed score (sub-type → domain → Welfare Index)
```

### 4.2 Integrity Rules
- A response must conform to its sub-type's response type and config (range, options).
- Text responses and unmapped Lists carry no score.
- Domain Score is the weighted mean of its scored sub-types; Welfare Index is the weighted mean of the five Domain Scores.
- Records are immutable once captured; catalogue versioning never alters historical scores.
- Every assessment references exactly one animal; every animal belongs to one species.

---

## 5. Permissions Matrix

| Capability | Admin | Curator / Biologist | Assessor / Keeper | Viewer |
|---|---|---|---|---|
| Configure catalogue | ✓ | — | — | — |
| Capture assessment record | ✓ | ✓ | ✓ | — |
| View analytics & drill-down | ✓ | ✓ | ✓ | ✓ |
| Run comparisons / export | ✓ | ✓ | ✓ | ✓ (view) |
| Manage schedule (planning) | ✓ | ✓ | — | — |

*(Roles indicative; final RBAC to be confirmed.)*

---

## 6. Non-Functional Requirements
- **Scale:** designed for 200k+ species, 2.2M+ animals, billions of historical rows. Dashboards read pre-aggregated rollups, never scan raw records.
- **Performance:** aggregate-first rendering; lists virtualized and server-filtered; charts lazy-rendered.
- **Consistency:** one catalogue drives capture, scoring, charts, and comparison so every screen means the same thing.
- **Traceability:** every aggregate drills to its underlying records in ≤3 clicks.
- **Multi-tenancy & security:** strict org isolation, RBAC, site-scoping; queries tenant-bounded.
- **Usability:** single shared design language (Antz Welfare premium); persistent filters; accessible, colour-blind-safe risk palette.
- **No status lifecycle:** the absence of workflow states is a hard requirement, not an omission.

---

## 7. Deliverables
- Configurable catalogue + admin surface.
- Assessment capture with catalogue-driven validation and scoring.
- Analytics surfaces: Dashboard, List & Detail, Animals, Species, Welfare/Domain, Risk, Comparison, Schedule.
- Scoring engine (normalize → domain → Welfare Index; monitored ranges; risk bands).
- Shared component kit and data layer.

---

## 8. Acceptance Criteria
1. Catalogue can be configured per species across all four response types, and capture validates against it.
2. Scoring produces 0–100 sub-type scores, Domain Scores, and a Welfare Index per the rules in §2.3–§2.4.
3. Text is never scored; unmapped Lists are descriptive; monitored numerics are judged vs range.
4. Every dashboard KPI and chart drills to the underlying records.
5. No screen, KPI, or label introduces a Pending / Overdue / Completed / approval status.
6. Filters (time / species / domain) persist across navigation; every page has a back path.
7. Comparison only pairs like response types / shared sub-types and normalizes to 0–100.
8. Analytics surfaces render from rollups within performance targets at the stated scale.
```
