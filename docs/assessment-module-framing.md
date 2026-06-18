# Antz Assessment Management Module — ARCHITECT Framing

> Pre-execution problem-framing & decision architecture. This document frames *what
> decisions the system exists to serve* before any screen is designed. Companion:
> [assessment-module-strategy.md](assessment-module-strategy.md).

Complexity: **Strategic** (new enterprise module, system-level, multi-role, 2.2M+ animals) → ARCHITECT **required**.

---

## 1. Problem Definition

Antz must let a zoological organization **make timely, evidence-based care, welfare,
compliance, and resource decisions** across a population too large for any human to
inspect directly (200k+ species, 2.2M+ animals, many sites/orgs), where assessment
requirements legitimately differ by species, life stage, and site.

## 2. Problem vs Symptom (+ root-cause hypothesis)

| Symptom (what's asked for) | Underlying problem |
|---|---|
| "Build a big dashboard with these 11 tiles" | Decision-makers can't see *where to look* in a 2.2M-animal population |
| "Show trends, scores, risk" | No shared, comparable welfare/health signal across species & sites |
| "Pending / overdue / completion" | No assurance that the required assessments are actually happening (compliance & coverage gap) |
| "Comparisons, executive insights" | Leadership decisions (budget, staffing, intervention, compliance sign-off) are made without aggregated evidence |

**Root-cause hypothesis:** *Assessment data exists (or will) but is not organized around
the decisions each role must make — so at scale it produces dashboards nobody can act on.*
The win condition is **decision support at the right altitude per role**, not more charts.

## 3. Stakeholder Map (who decides · acts · consumes)

| Role | Altitude | Primary mode |
|---|---|---|
| **Senior Management / Exec** | Org / multi-site | **Decides** — budget, compliance posture, intervention mandates |
| **Zoo Manager / Director** | Site | **Decides + consumes** — site performance, staffing, escalations |
| **Curator** | Section / collection (species & animals) | **Decides + acts** — prioritize attention, schedule, escalate to vet |
| **Veterinarian / Doctor** | Animal (clinical) | **Acts** — diagnose, treat, judge improvement/decline, refer |
| **Biologist** | Species / behaviour & welfare | **Acts** — husbandry/enrichment changes, research flags |
| **Assessor / Keeper (field)** | Animal (data capture) | **Acts** — perform & submit assessments, raise findings |
| **Compliance / QA** | Org | **Consumes + decides** — audit, accreditation evidence (AZA/EAZA/WAZA-style) |

## 4. Decision Architecture *(the core — decisions, not features)*

| # | Decision (verb-framed) | Class | Owner | Frequency | Question it answers | Insight that answers it | Action it triggers | Confidence | Stakes |
|---|---|---|---|---|---|---|---|---|---|
| D1 | **Where do I intervene first today?** | Attention/Risk | Curator, Vet | Daily | Which animals/species are declining, overdue, or flagged critical? | Ranked risk queue (welfare drop + overdue + critical finding) | Visit / treat / escalate | High | High |
| D2 | **Is this animal improving or deteriorating?** | Change | Vet | Per-case | What is the trend vs its own baseline & species norm? | Animal timeline + delta vs baseline/cohort | Adjust treatment / discharge / refer | High | High |
| D3 | **Are required assessments actually being done?** | Risk/Compliance | Curator, Manager, QA | Weekly | Coverage & on-time completion by site/species/team | Completion %, overdue count, coverage gaps | Reassign, remind, re-staff | High | High |
| D4 | **Is this species' welfare pattern normal?** | Change/Opportunity | Biologist, Curator | Weekly | How does this species track vs baseline & similar species? | Species analytics + cohort comparison | Husbandry/enrichment change, research | Medium | Medium |
| D5 | **Which sites need attention / are best practice?** | Risk/Opportunity | Exec, Manager | Monthly | Site-vs-site performance on welfare, risk, completion, compliance | Site league table + drill-down | Reallocate budget/staff, share practice | Medium | High |
| D6 | **Are we compliant & audit-ready?** | Risk | Exec, QA | Quarterly/Audit | Compliance score + evidence trail per standard | Compliance scorecard + immutable audit trail | Sign-off, remediation plan | High | High |
| D7 | **Where is risk emerging before it's a crisis?** | Forecast | Exec, Curator, Vet | Continuous | Which cohorts trend toward threshold breach? | Predictive decline / out-of-range detection | Pre-emptive review | Low–Med | High |
| D8 | **Is our assessment workforce effective?** | Opportunity | Manager | Monthly | Throughput, timeliness, finding quality by assessor/team | Workforce performance metrics | Training, rebalancing | Medium | Medium |
| D9 | **What does this species/animal even require?** (config) | — | Admin, Vet lead, Biologist | On change | Which assessment types/sub-types/schedules apply to this taxon? | Template & schedule rules engine | Publish assessment program | High | High (foundational) |

> Every screen in the strategy doc traces back to one of D1–D9. If a proposed view doesn't
> serve a decision, it doesn't ship.

## 5. Success Criteria

1. Each role lands on a view that answers their primary decision in **< 5 seconds, ≤ 1 scroll**.
2. **Time-to-first-action** (open app → reach the animal/site that needs them) drops sharply vs. browsing.
3. Any aggregate number is **drillable to the underlying records** in ≤ 3 clicks (trust).
4. Assessment **coverage and on-time completion are measurable and improvable** per site/species/team.
5. **Audit-ready**: every record has an immutable trail; compliance evidence exportable.
6. Performance holds at scale: aggregate views render fast on 2.2M animals via pre-computation, not live scans.

## 6. Scope Boundaries (what we are NOT solving here)

- **Not** the assessment *data-capture form runtime* beyond its lifecycle/record model (the existing app handles entry).
- **Not** the underlying clinical EMR, husbandry scheduling engine internals, or studbook/breeding — we *integrate*, not rebuild.
- **Not** choosing the ML algorithm for D7 — we define where prediction plugs in and how it's surfaced/communicated, not the model.
- **Not** final visual skin — design language continues the existing Antz Welfare prototype (Five Domains, premium light UI).
- **Not** org/RBAC/auth implementation — assumed to exist; we define the access *model* requirements.

## 7. Unknowns & Assumptions

**Known:** Five Domains welfare model is the scoring backbone; multi-site/org; configurable types/sub-types by species; the 7 roles; the existing prototype's Dashboard→Species→Animal→Metric flow.

**Unknown (named risks):**
- U1 — **Tech stack & data platform** (DB, search, analytics/OLAP availability). Drives the scalability design's concreteness.
- U2 — **Scoring rubric**: exact rules to turn raw assessment items into scores, pass/fail thresholds, and a welfare/risk index. ("Pass/Fail" implies criteria not yet defined.)
- U3 — **Compliance standard(s)** in force (AZA / EAZA / WAZA / national) → defines compliance scorecard structure.
- U4 — Whether **predictive insights (D7)** are in scope for v1 or a later phase.
- U5 — **Offline field capture** needs (connectivity at point of assessment).

**Assumptions (documented, used to proceed):**
- A1 — Assessments roll up cleanly to a 0–100 welfare/health index per Five Domain (per existing prototype).
- A2 — A read/analytics layer separate from transactional capture is acceptable (CQRS-style).
- A3 — "Pass/Fail" = a configurable threshold per assessment sub-type, not a universal rule.
- A4 — Predictive (D7) is **Phase 3**; v1–2 deliver descriptive + diagnostic analytics.

## 8. Readiness Verdict — **YELLOW (proceed with named risk)**

| # | Criterion | Met? | Note |
|---|---|---|---|
| 1 | Problem ≠ symptom (+ root cause) | ✅ | Decision-fragmentation at scale |
| 2 | ≥3 stakeholder roles (decide/act/consume) | ✅ | 7 roles mapped |
| 3 | ≥1 full Decision→Question→Insight→Action | ✅ | D1–D9 |
| 4 | Success criteria stated | ✅ | §5 |
| 5 | Scope boundary stated | ✅ | §6 |
| 6 | Decision coverage (major decisions, not one) | ✅ | 9 decisions across all roles |

All 6 structurally met — but **demoted to YELLOW**, not GREEN, because the **named risks U1–U3
(tech platform, scoring rubric, compliance standard) materially shape the concrete design**.
Risk of proceeding: the strategy must specify the scoring/compliance/scale layers on
**stated assumptions (A1–A4)**; these need owner confirmation before build. Proceeding is
safe for *strategy & IA*; confirm U1–U3 before *engineering commitment*.

## 9. Recommended Next Step

```
Recommended Next Doctrine : JARVIS (execution design)
Recommended Next Skill    : deep-dive  (enterprise multi-surface module; too broad for one-shot)
Reason                    : Decision architecture is framed; the work is now product strategy,
                            information architecture, analytics framework, KPIs & UX design.
Expected Output           : Product strategy + IA + dashboard hierarchy (per role/altitude) +
                            analytics & KPI framework + chart recommendations + scalability &
                            UX patterns — organized around decisions D1–D9.
```

→ Delivered in [assessment-module-strategy.md](assessment-module-strategy.md).
