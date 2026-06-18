# Antz — Assessment Module · 3-Phase Delivery Plan

Consolidates the [screens plan](assessment-screens-plan.md), [strategy](assessment-module-strategy.md)
and [data model](assessment-data-model.md) into three shippable phases.

**Sequencing principle:** *build bottom-up for correctness, demo top-down for buy-in.* Each phase
is independently usable, lights up specific roles, and is a precondition for the next.

```
PHASE 1 — FOUNDATION & CAPTURE     →  data becomes real & auditable
PHASE 2 — ANALYTICS & INSIGHT      →  the data tells a story (animal · species · site · compare)
PHASE 3 — EXECUTIVE & INTELLIGENCE →  roll-up, compliance, risk & prediction for leadership
```

| Phase | Theme | Roles activated | Decisions | Outcome |
|---|---|---|---|---|
| **1** | Configure → Capture → Record | Admin, Assessor/Keeper, Vet | D9, D3, D2 | Species-specific assessments captured, scored, reviewed, audit-logged |
| **2** | Analyse → Compare | Vet, Biologist, Curator | D1, D2, D4 | Trends, welfare scores & comparisons per animal/species/site |
| **3** | Aggregate → Govern → Predict | Management, QA, Director | D5, D6, D7, D8 | Org dashboards, compliance, risk & predictive intelligence at scale |

---

## PHASE 1 — Foundation & Capture
> *The load-bearing wall. Until assessments are configured and scored records exist, every chart above is fiction.*

**Goal / definition of done:** an org can define what each species is assessed on, field staff can
capture it, the system scores it, and a reviewer can approve it — with a full audit trail.

| | |
|---|---|
| **Decisions** | D9 (what to assess), D3 (is it being done), D2 (record/review) |
| **Screens** | M1 Type & Sub-Type Catalog · M2 Template Builder · M3 Applicability + Schedule · M4 Scoring & Threshold editor · L1 Work Queue · L2 Conduct Assessment (dynamic by response type) · L3 Record + Audit · L4 Review/Approve |
| **Data model** | Type→Sub-Type→Response (Text/Numeric/List/Scale); scoring modes (Scored/Monitored/Descriptive); option→score maps; scale direction & target-band; thresholds; schedule rules; immutable records + versioning |
| **Scale work** | Append-only record store partitioned by tenant+date; RBAC + row-level security; attachments in object storage; search index seeded |
| **Capabilities unlocked** | Coverage, Completion, On-Time, Overdue, Pass/Fail, Welfare Index per record |
| **Exit criteria** | A species template can be published; an assessment of each response type can be captured → scored → reviewed → locked; audit trail immutable; due→pending→overdue lifecycle works |

---

## PHASE 2 — Analytics & Insight
> *Turn records into understanding — for the people closest to the animals.*

**Goal / definition of done:** a vet/biologist/curator can see how an individual and a species are
trending, judge improvement vs decline, and compare like-for-like.

| | |
|---|---|
| **Decisions** | D1 (where to intervene), D2 (improving/declining), D4 (species normal?) |
| **Screens** | A2 Animal Assessment Analytics (timeline · latest · trends · avg vs baseline · improvement/decline · welfare trend · upcoming) · A3 Metric/Sub-Type detail (D/W/M/6M/Y) · P2 Species Analytics (distribution · pass/fail · risk trends · indicators · similar-species comparison · frequency) · S1 Site Overview · C1 Comparison Workspace |
| **Data model** | Normalize all scored sub-types to 0–100; baselines & normal ranges; cohort/“similar species” grouping; per-response-type chart selection |
| **Scale work** | **Pre-aggregated rollups** (animal→species→site × day/week/month); cached read models; drill-down deep-links |
| **Capabilities unlocked** | Welfare/Risk trends, pass-rate trends, baseline deviation, cohort comparison, drill-down trust |
| **Exit criteria** | Any aggregate drills to records in ≤3 clicks; animal & species analytics render from rollups (not raw scans); comparison workspace produces normalized deltas + caveats |

---

## PHASE 3 — Executive & Intelligence
> *Roll everything up for leadership; govern compliance; see risk before it's a crisis.*

**Goal / definition of done:** management can see org/site posture at a glance, prove compliance,
find the riskiest sites/species, and act on emerging risk — at full 2.2M-animal scale.

| | |
|---|---|
| **Decisions** | D5 (which sites), D6 (compliant?), D7 (emerging risk), D8 (workforce) |
| **Screens** | X1 Executive Overview (KPIs · site league · risk heatmap · trends · critical findings · failing assessments · riskiest species · workforce) · X2 Compliance Scorecard · X3 Risk Center · X4 Reports & Exports · L5 Finding detail · G2 Omni-search · G3 Alerts |
| **Analytics** | Compliance scoring per standard; workforce metrics (throughput, on-time, rework, inter-rater); risk heatmaps/treemaps; **predictive** decline detection + forecast bands + SPC alerts |
| **Scale work** | Full rollup cubes (org grain); columnar/OLAP read store; async report generation; alerting pipeline; hot/warm/cold history tiering |
| **Capabilities unlocked** | Site league, compliance posture & audit export, emerging-risk alerts, executive KPIs |
| **Exit criteria** | Executive Overview renders org-wide from pre-aggregates in <2s; compliance export passes an audit dry-run; risk alerts fire on threshold/forecast breach |

*(If predictive (D7) needs more historical data than v1 has, ship Phase 3 descriptive/diagnostic first and turn on forecasting as a Phase 3.5 toggle.)*

---

## Dependencies & sequencing rationale
```
P1 config + scored records ──▶ P2 analytics (needs scored data + rollups) ──▶ P3 exec roll-up (needs P2 aggregates)
```
- **P1 before P2:** analytics on unconfigured/unscored data is meaningless.
- **P2 before P3:** executive roll-ups are aggregates *of* the species/site analytics; build the grain first.
- **Scale compounds:** rollups introduced in P2 are extended to org grain in P3 — same machinery, higher level.

## Prototype-first thread (cuts across all 3 phases)
To validate the whole arc fast in the existing premium UI, prototype one vertical slice:
**M2 Template Builder → L2 Conduct → L3 Record (P1) · A2 Animal + P2 Species (P2) · X1 Executive Overview (P3) · C1 Compare.**
One thread, every altitude, both capture & analytics — before committing to all 24 screens.

## Roles by phase (who gets value when)
| Phase | Primary users who go live |
|---|---|
| 1 | Admin / Vet-lead (configure), Keeper/Assessor (capture), Vet (review) |
| 2 | Vet, Biologist, Curator (analyse & compare) |
| 3 | Zoo Manager, Director, Senior Management, Compliance/QA |
