# Assessment Analytics — Redesign Framing (ARCHITECT)

Scope: the per-animal **Assessment Analytics page** (`SCREENS.amAnimal`, `screens/33-am-animal.js`),
currently tabs Overview · Assessments · Analytics · History. Deliverable: the clickable HTML
prototype (`Apple Health/`). Complexity: **High** (multi-section, several decisions, scales to
real templates). ARCHITECT engaged.

---

## 1. Problem Definition
Users open an animal's analytics to **understand the animal and what changed**, but the page
makes them *analyze* instead of *understand*. It is organized around **domains and charts**
(radar, domain breakdown, three trend charts) rather than around the questions a keeper/vet/
manager actually asks. It also generates structure **per field/domain**, so it visibly works
with 5 sample domains but collapses into endless scrolling once a real template carries dozens
of questions across four response types.

## 2. Problem vs Symptom (+ root-cause hypothesis)
- **Symptom:** "too chart-heavy / card-heavy," "too much scrolling."
- **Problem:** the page answers "show me every metric" instead of "tell me what's going on."
- **Root cause:** the information architecture is keyed to **data shape (per-field/per-domain)**
  instead of **user intent (insight → change → context)**. Cards are generated bottom-up from
  the data model, so card count grows linearly with template size. Fix the *organizing
  principle* (group by **response type**, lead with **insight & change**), not the styling.

## 3. Stakeholder Map
| Role | Relationship | What they need from this page |
|---|---|---|
| **Keeper / Field assessor** (actor) | records assessments, checks daily | "What changed since last time? Anything to act on now?" — fast, scannable |
| **Vet / Welfare lead** (decision-maker) | interprets, decides intervention | change deltas, observations, trend context — not raw chart hunting |
| **Curator / Manager** (consumer) | oversight, reporting | snapshot + confidence that the animal is monitored |
| (System: assessment templates) | supplies fields & response types | analytics must adapt to *any* template, unknown field count |

## 4. Decision Architecture
Organized around the 5 user questions (decisions), not features/charts.

| Decision | Class | Owner | Frequency | Question | Insight (signal) | Action | Confidence | Stakes |
|---|---|---|---|---|---|---|---|---|
| Is this animal OK right now? | Attention | Keeper/Vet | daily | "What is happening with this animal?" | **Assessment Snapshot** + welfare index + risk pill | reassure / escalate | high | High |
| Did anything change? | Change | Vet | per visit | "What changed since the previous assessment?" | **Comparison: Current vs Previous + Change Highlights + AI summary** | investigate the delta | med | **Highest** |
| What's the trajectory? | Forecast | Vet/Manager | weekly | "What changed recently / is trending?" | **Historical Trends** (grouped, not per-field) | adjust care plan | med | Med |
| What was observed/noted? | Context | Keeper | per visit | "What observations have been recorded?" | **Recent Observations** (text timeline + keywords) | follow up qualitatively | high | Med |
| What's been done & how active? | Change | Manager | weekly | "What assessments were recently completed?" | **Assessment Activity** + **Latest Assessments** + Quick Insights | confirm coverage / gaps | high | Med |

**Architectural keystone:** analytics are grouped by **response type** (Numeric Value ·
Numeric Scale · List · Text), each a single consolidated section that absorbs N fields —
so the page's section count is **constant (4)** regardless of template size. This is the
scalability fix and the main structural change from today's domain-keyed layout.

## 5. Success Criteria
1. A user understands the animal's state + what changed **without switching tabs** (Overview is self-sufficient) and **without reading every card**.
2. Section count is **constant** as template fields grow (group-by-response-type holds at 4 analytics sections, not 1-per-field).
3. **Comparison is the hero**: "what changed" is reachable in ≤1 tap and readable in <10s (Change Highlights + AI summary).
4. History is **scannable** — record type identifiable by icon/colour without reading the title.
5. Zero new visual language — reuses dashboard kit (`d2card`, charts, tabs, tooltips, filters).
6. Activity chart gives inline tooltip on tap (no bottom sheet, no auto-nav).

## 6. Scope Boundaries (what we are NOT solving)
- Not redesigning the Dashboard, Species, or Capture flows (only the per-animal analytics page + its History/Comparison; reuse their components).
- Not building a real AI/ML backend — the "AI Comparison Summary" is a **deterministic templated narrative** generated from the deltas (clearly a prototype stand-in).
- Not adding any status lifecycle (no Pending/Overdue/Completed) — see [[antz-no-status-lifecycle]].
- Not changing the five-domains welfare model; domains still exist but are demoted below insight/change.
- Not real search infra — Text "search" is a prototype affordance over mock entries.

## 7. Unknowns & Assumptions
**Known:** current page = `amAnimal` (33-am-animal.js); data via `amRecords`/`ANIMALS` in `31-am-kit.js`; records carry `domain`, `type`, `score`, `date`, `daysAgo`; response types defined in capture.js (Text · Numeric Value · List · Numeric Scale). Dashboard kit charts (`radarChart`, `trendChart`, `dashSpark`, `multiLine`, `timeline`, `dashTip`) are reusable.
**Unknown:** whether the mock record/field model carries **per-field response-type values** (the page today stores one `score` per record, not field-level Numeric/List/Text values). Response-type-grouped analytics needs field-level mock data.
**Assumptions:**
- I will **extend the mock data layer** so each assessment type maps to fields with a response type + value history (Weight→Numeric, Body Condition→Scale, Appetite→List, Keeper Notes→Text). This is the enabling change; without it response-type grouping has nothing to render.
- "Recent Observations" sources from Text-response fields + a medical-observation record kind.
- Comparison "previous" = the immediately prior record of the same assessment type (fallback: prior overall assessment).

## 8. Readiness Verdict — **YELLOW** (proceed with named risk)
| # | Criterion | Status |
|---|---|---|
| 1 | Problem vs symptom + root cause | ✅ |
| 2 | ≥3 stakeholder roles | ✅ (keeper, vet, manager) |
| 3 | ≥1 full Decision→Question→Insight→Action | ✅ |
| 4 | Success criteria | ✅ |
| 5 | Scope boundary | ✅ |
| 6 | Decision coverage (major decisions mapped) | ✅ (5 questions mapped) |

**Named risk (the YELLOW):** criteria are met, but execution depends on the **Unknown in §7** —
the mock data model does not yet carry field-level, response-typed values. **Risk of proceeding:**
if I build response-type sections against today's single-`score`-per-record data, the analytics
would be faked at the section level and wouldn't actually demonstrate scalability. **Mitigation
(committed):** first extend the AM mock data layer to a field/response-type schema, then build the
UI on top. This is an additive change isolated to the kit's data layer; it does not touch other screens.

## 9. Recommended Next Step
```
Recommended Next Doctrine : JARVIS (execution)
Recommended Next Skill    : deep-dive  (multi-section page rebuild against a data-model change)
Reason                    : architecture + decision order understood; needs (a) data-layer extension
                            to field/response-type schema, then (b) IA rebuild of amAnimal into
                            Insight→Change→Context→Analytics→Raw order with response-type grouping
                            and a hero Comparison tab.
Expected Output           : extended AM data layer; redesigned amAnimal (Overview restructured,
                            Comparison hero, History scannable); response-type analytics components;
                            inline activity tooltips — all reusing the dashboard kit.
```
