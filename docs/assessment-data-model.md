# Antz — Assessment Data Model & Response-Type Handling

The configurable foundation (Decision **D9**). Companion to
[strategy §1](assessment-module-strategy.md#1-configurable-assessment-model-foundation--decision-d9).
This is the layer everything else (scoring, charts, comparison, Welfare Index) is built on.

---

## 1. Structure: Type → Sub-Type → Response

```
Assessment TYPE (= Five Domain)        SUB-TYPE (configurable, per species)        RESPONSE TYPE
─────────────────────────────────────────────────────────────────────────────────────────────
1. Physical Health      →  Weight                              →  Numeric Value (kg/g)
                           Body Score                          →  Numeric Scale (1–9)
                           Eye Condition                       →  List (Good / Fair / Poor)
                           Posture                             →  List or Numeric Scale (1–5)
2. Behaviour            →  Barking                             →  List (None/Occasional/Frequent) or Scale
                           Cranky / Pranky / Hyperactive       →  List (present) or Numeric Scale (intensity)
                           Activity Level                      →  Numeric Scale (1–10)
3. Environment          →  Weather / Climate (Sunny, Rainy…)   →  List (context — see §6)
                           Enclosure Cleanliness               →  Numeric Scale (1–5)
                           Temperature / Humidity              →  Numeric Value (°C / %)
4. Mental Health        →  Stress / Stereotypy / Curiosity     →  Numeric Scale or List
5. Nutrition            →  Diet Adherence                      →  List (Full / Partial / Refused)
                           Food Quality                        →  Numeric Scale (1–5)
                           Food Intake                         →  Numeric Value (kg)
```

> The **5 Types are fixed** (Five Domains). **Sub-Types are configurable and species-scoped** —
> a Lion's behaviour set ≠ a Macaw's. Sub-types above are *examples*, not a fixed list.

---

## 2. The 4 Response Types — the master matrix

This single table drives scoring, charting, and comparison everywhere in the product.

| Response Type | Example | Data nature | Scoring treatment | Aggregation | Best chart | Comparison |
|---|---|---|---|---|---|---|
| **Numeric Value** | Weight 198 kg, Temp 38.5 °C | Continuous (needs **unit**) | Usually **Monitored** — judged vs **baseline / normal range**, not an absolute 0–100. Deviation → risk. | mean, min/max, latest, **Δ vs baseline**, rate of change | **line / area + normal-range band** | overlay lines, Δ %, vs species baseline |
| **Numeric Scale** | Body Score 1–9, Cleanliness 1–5 | Ordinal, bounded | **Scored** → normalized 0–100 via a **direction** (higher-better / lower-better / **target-band**) | distribution, mean, **pass/fail vs threshold** | **rounded bar / histogram / box** | grouped bar, radar |
| **List** | Eye: Good/Fair/Poor; Diet: Full/Partial/Refused | Categorical (often ordered) | **Scored only if each option is mapped** to a value/severity (e.g. Good=100, Fair=60, Poor=20). Else descriptive. | frequency, mode, **% good**, category timeline | **categorical timeline / 100% stacked / heatmap** | stacked %, frequency delta |
| **Text** | Notes, free observation | Qualitative | **Descriptive only — NOT scored.** Keyword/NLP can raise a **finding flag** that affects risk. | not aggregatable → count, **search**, flagged terms | none (feed / record + finding tags) | side-by-side text diff |

**The one rule to internalize:** *Text never produces a score. List only produces a score if its
options are mapped. Numeric Value is usually monitored against a range, not scored directly.
Numeric Scale is the cleanest to score.* This is why each sub-type needs an explicit
**scoring contribution** flag (next section).

---

## 3. Scoring contribution — every sub-type is one of three

| Mode | Meaning | Feeds Welfare Index? | Feeds Risk? | Typical response types |
|---|---|---|---|---|
| **Scored** | Produces a 0–100 domain contribution | ✅ | ✅ | Numeric Scale, mapped List |
| **Monitored** | Tracked vs baseline/normal range; no fixed score | ➖ (via deviation, optional) | ✅ (out-of-range) | Numeric Value |
| **Descriptive** | Context / qualitative record only | ❌ | ⚠️ (only if flagged) | Text, context Lists (weather) |

This is the switch that lets heterogeneous data coexist: a screen can show Weight (monitored)
next to Body Score (scored) next to Notes (descriptive) without pretending they're the same.

---

## 4. Normalization → Domain Score → Welfare Index

To roll many sub-types (on different scales) into one comparable number:

**Per scored sub-type → 0–100**
- **Scale, higher-better:** `score = (v − min) / (max − min) × 100`
- **Scale, lower-better:** `score = (max − v) / (max − min) × 100`
- **Scale, target-band** (e.g. Body Condition 1–9, ideal 4–5): `score = 100 − penalty(distance from optimal band)` — *both emaciated (1) and obese (9) score low.* Critical: many clinical scales are NOT "higher = better."
- **Mapped List:** `score = optionScore` (configured per option)

**Per monitored numeric → risk contribution**
- In normal range → 100; outside → graded penalty by % deviation from the band.

**Roll-up**
```
Sub-Type score (0–100)
   → weighted mean within a Type  = Domain Score (Nutrition, Behaviour, …)
   → weighted mean of 5 domains   = WELFARE INDEX (0–100)   [existing Five-Domain dial]
Pass/Fail = sub-type score ≥ its configured threshold
Risk Band = f(welfare level, decline rate, out-of-range monitors, flagged findings)
```
Weights and thresholds are **configurable per sub-type per species**.

---

## 5. Per-sub-type configuration (what Admin sets)

| Field | Applies to | Example |
|---|---|---|
| Response type | all | Numeric Scale |
| Unit | Numeric Value | kg, °C, % |
| Min / Max / Step | Numeric Value/Scale | 1–9, step 1 |
| List options (+ order) | List | Good, Fair, Poor |
| Option → score map | mapped List | Good=100, Fair=60, Poor=20 |
| Multi-select? | List | Behaviour signs (yes) vs Eye (no) |
| Direction / curve | Numeric Scale | higher-better · lower-better · target-band(opt range) |
| Scoring contribution | all | Scored / Monitored / Descriptive |
| Domain weight | scored | Body Score 30% of Physical |
| Pass/Fail threshold | scored | ≥ 60 |
| Normal range | monitored numeric | Weight 180–205 kg (species/individual) |
| Schedule / cadence | all | weekly / annual |
| Taxon + life-stage scope | all | Felidae, Adult |
| Required? | all | yes → counts toward Coverage |

---

## 6. Worked examples

| Sub-type | Type | Response | Config | Becomes |
|---|---|---|---|---|
| **Weight** | Physical | Numeric (kg) | Monitored, normal 180–205 | line + band; Δ vs baseline; out-of-range → risk |
| **Body Score** | Physical | Scale 1–9 | Scored, **target-band 4–5**, thr 60 | bar/histogram; pass/fail; feeds Physical score |
| **Eye Condition** | Physical | List | Scored, Good100/Fair60/Poor20 | categorical timeline; % Good; feeds score |
| **Posture** | Physical | Scale 1–5 | Scored, higher-better | bar; feeds score |
| **Barking / Hyperactive** | Behaviour | List multi-select | each sign mapped (neutral/negative) | frequency; negative signs lower Behaviour score |
| **Diet Adherence** | Nutrition | List | Full100/Partial50/Refused0 | 100% stacked; feeds Nutrition score |
| **Food Intake** | Nutrition | Numeric (kg) | Monitored vs normal | line + band |
| **Weather (Sunny/Rainy)** | Environment | List | **Descriptive (context)** | recorded for correlation, not scored |
| **Vet Notes** | any | Text | Descriptive; NLP flag terms | searchable; "lethargic" → finding flag → risk |

> Note on **Environment "Sunny/Rainy"**: that's *context*, not animal welfare — keep it
> **Descriptive** and use it to **correlate** (e.g. activity drops on rainy days), not to score
> welfare. Scored environment sub-types are things like Enclosure Cleanliness.

---

## 7. Why this matters downstream (ties to the strategy)

- **Charts (strategy §7):** the response type *picks the chart* — numeric→line, scale→bar/box, list→categorical timeline/stacked, text→feed. The UI renders the right viz automatically from config.
- **Comparison (§5):** only **like response types & shared sub-types** are comparable; scores are normalized to 0–100 so Body Score and Eye Condition can sit on the same radar.
- **Analytics (§6):** Coverage counts *required* sub-types; Completion/Pass use thresholds; Welfare Index uses scored + monitored contributions.
- **Scale (§8):** rollups pre-aggregate **normalized 0–100 scores** (uniform), so 2.2M animals' heterogeneous responses summarize cheaply.

---

## 8. Decisions to confirm (config policy)

1. **List scoring** — does *every* list get an option→score map, or do some stay descriptive? (Drives how much feeds the Welfare Index.)
2. **Scale direction per sub-type** — confirm which clinical scales are higher-better vs **target-band** (Body Condition is target-band — easy to get wrong).
3. **Numeric normal ranges** — species-level defaults, individual overrides, or both?
4. **Multi-select behaviour signs** — how multiple negative signs combine into one Behaviour score.
5. **Text → findings** — manual flagging only, or keyword/NLP auto-flagging in v1?
6. **Weights** — equal domain weights, or species-specific clinical weighting?
