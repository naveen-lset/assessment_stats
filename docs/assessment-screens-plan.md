# Antz — Assessment Module · Screen-Wise Plan & Approach

How we build it, screen by screen. Sits on top of:
[strategy](assessment-module-strategy.md) · [data model](assessment-data-model.md) · [framing](assessment-module-framing.md).

Every screen traces to a decision (D1–D9) and a role. Legend: 🟢 exists in prototype · 🟡 extend existing · 🔵 new.

---

## 1. Sitemap (the altitude ladder + cross-cutting modules)

```
ROLE-BASED HOME ROUTER
        │  (each role lands on its decision surface)
        ▼
┌───────────────────────── GLOBAL SHELL ─────────────────────────┐
│  Context bar (Org ▸ Site ▸ Time)  ·  Omni-search  ·  Alerts  ·  Me │
└────────────────────────────────────────────────────────────────┘
        │
   ┌────┴───────────────┬───────────────┬──────────────┬───────────────┐
   ▼                    ▼               ▼              ▼               ▼
EXECUTIVE (Org)       SITE           SPECIES         ANIMAL         CROSS-CUTTING
 X1 Overview        S1 Overview     P1 Browse 🟢     A1 List 🟡     L1 Work Queue
 X2 Compliance                      P2 Analytics     A2 Analytics🟢  L2 Conduct 🟡
 X3 Risk Center                                      A3 Metric 🟢    L3 Record + Audit
 X4 Reports                                                          L4 Review/Approve
                                                                     L5 Finding
                                                                     C1 Compare
                                                                     ADMIN: M1–M4
         └────────── drill down ▼ ▼ ▼   /   breadcrumb up ▲ ▲ ▲ ──────────┘
```
Org → Site → Species → Animal → Record is the spine. Queue, Compare, and Admin cut across all levels.

---

## 2. Full screen inventory

### Global / shell
| ID | Screen | Role | Decision | Key blocks | Status |
|---|---|---|---|---|---|
| G0 | **Home Router** | all | — | sends each role to its landing | 🔵 |
| G1 | **App Shell** | all | — | context bar (org/site/time), omni-search, alerts, profile, nav | 🔵 |
| G2 | **Omni-Search & Results** | all | — | typeahead + faceted results across species/animals/records/sites | 🔵 |
| G3 | **Alerts Inbox** | all | D1,D7 | critical findings, overdue spikes, threshold breaches; subscribe | 🔵 |

### Executive / Org
| ID | Screen | Role | Decision | Key blocks | Status |
|---|---|---|---|---|---|
| X1 | **Executive Overview** | Mgmt, Mgr | D5,D6,D7 | KPI strip · site league/map · risk heatmap · org trend · emerging risk · critical findings · failing assessments · riskiest species · workforce | 🔵 |
| X2 | **Compliance Scorecard** | Mgmt, QA | D6 | per-standard adherence, evidence links, audit-ready export | 🔵 |
| X3 | **Risk Center** | Mgmt, Curator | D7 | org risk heatmap + treemap, emerging cohorts, drill | 🔵 |
| X4 | **Reports & Exports** | Mgmt, QA | D5–D8 | report builder, scheduled PDF/CSV | 🔵 |

### Site
| ID | Screen | Role | Decision | Key blocks | Status |
|---|---|---|---|---|---|
| S1 | **Site Overview** | Mgr, Curator | D3,D5 | scoped KPIs, sections/enclosures, assessor roster & workload, site overdue queue, trend | 🔵 (extends collection dashboard 🟢) |

### Species
| ID | Screen | Role | Decision | Key blocks | Status |
|---|---|---|---|---|---|
| P1 | **Species Browse** | Biologist, Curator | D4 | rich cards: photo, welfare ring, tier bar, attention flag | 🟢 |
| P2 | **Species Analytics** | Biologist, Curator | D4 | distribution · history · pass/fail trends · avg scores (radar) · risk trends · health indicators · **similar-species comparison** · frequency analysis | 🟡 (detail exists, analytics new) |

### Animal
| ID | Screen | Role | Decision | Key blocks | Status |
|---|---|---|---|---|---|
| A1 | **Animal List** | Vet, Curator | D1 | within species / search results; welfare pills | 🟡 |
| A2 | **Animal Assessment Analytics** | Vet, Keeper, Curator | D1,D2 | timeline · latest results · trends · avg vs baseline · improvement/decline · welfare trend · history comparison · upcoming scheduled | 🟢 (extend) |
| A3 | **Sub-Type / Metric Detail** | Vet, Keeper | D2 | D/W/M/6M/Y chart, stats, recent entries (chart auto-picked by response type) | 🟢 |

### Assessment lifecycle
| ID | Screen | Role | Decision | Key blocks | Status |
|---|---|---|---|---|---|
| L1 | **My Work / Assessment Queue** | Assessor, Vet, Curator | D3 | due · pending · overdue · assigned-to-me; filters; bulk assign/reschedule | 🔵 |
| L2 | **Conduct Assessment** (capture) | Assessor, Vet | D3 | dynamic form rendered per **response type** (text/numeric/list/scale), photo attach, notes | 🟡 (add-entry sheet exists) |
| L3 | **Assessment Record Detail** | all | D2, audit | ID, type/sub-type, assessor+role, datetime, scores, pass/fail, status, **review history, attachments, notes, audit trail** | 🔵 |
| L4 | **Review & Approval** | Vet, Curator | D2 | reviewer queue, approve/reject/return, e-signature for clinical | 🔵 |
| L5 | **Finding Detail** | Vet, Curator | D1 | critical finding → linked animal & record, severity, action | 🔵 |

### Comparison
| ID | Screen | Role | Decision | Key blocks | Status |
|---|---|---|---|---|---|
| C1 | **Comparison Workspace** | Vet, Biologist, Mgr | D2,D4,D5 | entity pickers (animal/species/site/period) → metrics → deltas, trend overlays, radar, improvement %, risk changes | 🔵 |

### Admin / Configuration
| ID | Screen | Role | Decision | Key blocks | Status |
|---|---|---|---|---|---|
| M1 | **Type & Sub-Type Catalog** | Admin, Vet lead | D9 | 5 Types → manage sub-types | 🟡 (Setup exists) |
| M2 | **Template Builder** | Admin | D9 | sub-type → items → **response type** → scoring; versioned | 🟡 (Templates exist) |
| M3 | **Applicability + Schedule** | Admin | D9 | taxon × sub-type matrix, cadence/frequency rules | 🔵 |
| M4 | **Scoring & Threshold Editor** | Admin, Vet lead | D9 | option→score maps, scale direction/**target-band**, weights, pass thresholds, normal ranges | 🔵 |

**~24 screens.** 5 already exist in the prototype; the rest extend or are new.

---

## 3. Primary flows (how screens connect)

```
1. TRIAGE (Curator/Vet · D1)
   Home/Queue → Risk list → A2 Animal Analytics → A3 Metric Detail → L2 Conduct  ↘ or L5 escalate

2. CAPTURE (Assessor · D3)
   L1 My Work → L2 Conduct Assessment → submit → L4 Review → L3 Record (locked)

3. REVIEW/APPROVE (Vet · D2)
   L4 Review queue → L3 Record detail → approve/reject (e-sign) → audit trail

4. EXEC REVIEW (Mgmt · D5/D6)
   X1 Overview → risk heatmap / site league → S1 Site → P2 Species → A2 Animal
   X2 Compliance → export

5. CONFIG (Admin · D9)   ← the true foundation
   M1 Catalog → M2 Template Builder → M3 Applicability+Schedule → M4 Scoring → Publish

6. COMPARE (any)
   any entity → "Compare" → C1 Workspace
```
Cross-cutting: **omni-search (G2)** jumps to any entity; **Compare** and **Alerts** reachable everywhere.

---

## 4. Approach — recommended build sequence

Build **bottom-up for correctness, demo top-down for buy-in.** Two tracks:

| Phase | Goal | Screens | Why |
|---|---|---|---|
| **P1 Foundation** | Config + capture make data *mean* something | M1–M4, L1, L2, L3 | Without the rules engine & scored records, every analytic is fiction |
| **P2 Descriptive** | See an individual & a species | A2, A3, P2, S1 | Turns records into trends/insight per animal & species |
| **P3 Diagnostic** | Roll up, compare, govern | X1, X2, X3, C1, L4, L5, workforce | The executive & comparison layer |
| **P4 Predictive** | See risk early | emerging-risk on X1/X3, forecasts | After enough history (confirm scope) |

**For the clickable prototype (fastest path to alignment):** build a **vertical slice of the spine** in the existing premium UI —
`X1 Executive Overview → S1 Site → P2 Species Analytics → A2 Animal → L3 Record` (read path) + `L1 Queue → L2 Conduct` (write path) + `M2 Template Builder` (config) +
`C1 Compare`. That single thread demonstrates every altitude and both the capture and analytics sides without building all 24 screens.

---

## 5. What we reuse from the current prototype
- 🟢 Species Browse (rich cards), Animal page, Metric detail, Welfare dial, lollipop/area/radar charts, premium design system, photo placeholders → directly reused.
- 🟡 Setup/Templates → grows into M1/M2; add-entry sheet → grows into L2 Conduct; collection dashboard → informs S1/X1.
- 🔵 Net-new: Executive Overview, Risk Center, Compliance, Queue, Record+Audit, Review, Comparison workspace, Applicability/Scoring editors, omni-search, alerts.

---

## 6. Recommended next step
Pick the slice to prototype first:
- **A — Executive Overview (X1):** the "wow", top-down; shows the enterprise dashboard leadership wants.
- **B — Config + Capture (M2 → L2 → L3):** the foundation; proves the Type→Sub-Type→Response→Score→Record chain end-to-end.
- **C — Animal/Species Analytics (A2/P2):** richest data storytelling, builds on what's already prototyped.

Recommendation: **B first** (it's the load-bearing wall — everything else renders fictional data until config + scored records exist), then **A** for the demo.
