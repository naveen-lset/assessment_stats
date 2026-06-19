# Antz Welfare — Design System

A portable spec of the design language used in the **Index 2** prototype (`Apple Health/index2.html` + `styles2.css`). Drop this into a new project and follow it to get the same look & feel. It is derived 1:1 from the Figma "Antz Workfile ORIGINAL" (MD3_Antz palette + Inter type ramp).

> **Aesthetic in one line:** Apple-Health-grade information design, re-skinned in Antz's teal/green nature theme. White cards float on a soft mint page; one green is the only accent; data visualisations are first-class citizens.

---

## 1. Design Principles

1. **Mint page, white cards.** The page background is always the soft mint `#EFF5F2`. Content lives on white cards that "pop" off it with a very soft shadow — never card-on-same-color.
2. **One accent, used sparingly.** Antz green `#006D35` is the single brand accent (active tabs, primary buttons, key values). Don't introduce competing accents; use the data-viz palette only inside charts.
3. **Teal navy for text hierarchy.** Body/heading text trends toward deep teal-navy (`#1F415B` / `#44544A`), not pure black. Pure black is reserved for a few card titles.
4. **Data is the hero.** Every metric gets a bespoke visualization (area, bars, lollipop, gauge, donut, distribution, chips). Generous whitespace, value bottom-left, viz bottom-right.
5. **No record lifecycle.** This is an observation/analytics surface — **never** add Pending / Overdue / Completed / approval states to assessment records. (Planning indicators on the Schedule tab are fine.)
6. **Soft, not flat, not heavy.** Rounded corners (8–14px), shadows are low-opacity teal-tinted, motion is short and eased. No hard borders except 1px hairlines at `rgba(0,0,0,0.05)`.
7. **Mobile-first.** Designed inside a 390×844 phone frame. Sticky headers/tabs, horizontal-scroll chip rows, bottom-sheet modals.

---

## 2. Design Tokens

Paste this `:root` block into your stylesheet. These are the canonical variables.

```css
:root {
  /* ---- Surfaces ---- */
  --bg:                 #EFF5F2;   /* page background (soft mint) */
  --surface:            #FFFFFF;   /* cards */
  --display-primary:    #E8F4F2;   /* tinted info card / sub-tile fill */
  --display-secondary:  #DDEBE9;   /* expand footers, secondary tint */

  /* ---- Text ---- */
  --neutral-primary:    #171A1C;   /* card titles (near-black) */
  --on-secondary-cont:  #1F415B;   /* navy — primary values / headings */
  --on-primary-cont:    #1F515B;   /* deep teal — active segment text */
  --on-surface-variant: #44544A;   /* body text */
  --surface-variant:    #414941;   /* inactive tab label */
  --neutral-secondary:  #7A8684;   /* field labels, captions, muted */
  --stat-text:          #2B362F;   /* stat box numbers/labels */

  /* ---- Brand accent ---- */
  --on-surface-green:   #006D35;   /* THE accent: active tab, primary btn, key value */

  /* ---- Lines / fills ---- */
  --neutral-05:         rgba(0,0,0,0.05);  /* hairlines, track fills, chip bg */

  /* ---- Type ---- */
  --font: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* ---- Radii ---- */
  --r-sm: 8px;
  --r-md: 10px;
  --r-lg: 12px;
  /* (14px and 16px also used for stat tiles / plan cards) */

  /* ---- Shadows (all teal-tinted, low opacity) ---- */
  --shadow-card: 0px 2px 12px 0px rgba(0,0,0,0.05);     /* default card */
  --shadow-seg:  0px 2px 7px 0px rgba(20,61,46,0.12);   /* active segment / pressed */
  --shadow-stat: 0px 2px 7px 0px rgba(20,61,46,0.08);   /* small stat tiles */
  --shadow-elev: 0 1px 3px rgba(20,61,46,.06), 0 8px 22px rgba(20,61,46,.08); /* floating chart card */
}
```

### Semantic / state colors

| Purpose            | Color      | Notes |
|--------------------|------------|-------|
| Positive / up      | `#37BD69`  | also `#34A853` in some deltas; bg tint `#E1F9ED` |
| Negative / down    | `#E93353`  | also `#FA6140` (warm); bg tint `#FDE4E1` |
| Change / neutral   | `#00B894`  | teal; bg tint `rgba(0,184,148,.12)` |
| Status: OK         | text `#06794A` on `#E1F9ED` |
| Status: Warn       | text `#9A6700` on `#FEF3D6` |
| Status: Risk       | text `#C0392B` on `#FDE4E1` |
| Note / highlight   | text `#7A6A22` on `#FBF1CE` (soft yellow) |
| Chart mint (spark) | `#4FD4AF`  | |
| Cyan link / "See More" | `#00ABAB` | |

### Data-visualization category palette

Use these (in order) to color-code categories/series inside charts, dots, and legends:

```
#37BD69  green   (e.g. Nutrition)
#8479F9  violet  (e.g. Behaviour)
#00AFD6  cyan    (e.g. Medical)
#FA6140  coral   (e.g. Physical)
#E4A11B  amber   (overflow)
```

---

## 3. Typography

**Font:** Inter (with system fallbacks). Headings use tight negative letter-spacing; the bigger the number, the tighter (`-.2px` → `-1.2px`).

| Role | Size | Weight | Color | Notes |
|------|------|--------|-------|-------|
| Hero value (big stat) | 34px | 700 | `#1A1D1F` | `letter-spacing:-1.2px` |
| Page / sheet title | 24px | 600 | `--neutral-primary` | `letter-spacing:-.4px` |
| Trend value | 24–28px | 600–700 | `#44544A` | |
| Section value / stat number | 20px | 700 | `--neutral-primary` | |
| Card title | 16px | 500–600 | `#000` / `--on-secondary-cont` | |
| Tab label | 14px | 500 | inactive `--surface-variant`, active `--on-surface-green` |
| Body text | 13–14px | 400–500 | `--on-surface-variant` | `line-height:1.45` |
| Field label / caption | 12px | 400–600 | `--neutral-secondary` | |
| Uppercase sub-label | 12–13px | 700 | `--neutral-secondary` | `text-transform:uppercase; letter-spacing:.4px` |
| Micro / legend | 10.5–11.5px | 600 | `--neutral-secondary` | |

**Rule of thumb:** labels are `--neutral-secondary` 12px; the value they describe is bold and dark/green right below.

---

## 4. Core Layout

```
page  ── background: var(--bg)  (mint)
 └─ sticky header (white, bottom hairline, shadow-card)
 └─ sticky tabs   (white, MD3 underline indicator)
 └─ scroll body   (padding:16px, vertical gap:12px between cards)
     └─ white cards / tinted cards
 └─ bottom-sheet modals (slide up, mint, 22px top radius)
```

- **Body container:** `display:flex; flex-direction:column; gap:12px; padding:16px;`
- **Sticky header:** white bg, `padding:54px 16px 14px` (54px clears the status bar/notch), `border-bottom:1px solid rgba(0,0,0,0.05)`, `position:sticky; top:0; z-index:20`.
- **Sticky tabs** pin below the header (`top:54px` when header scrolls away).

---

## 5. Component Patterns

### Card (default white)
```css
.card {
  background: #fff;
  border-radius: var(--r-lg);          /* 12px */
  padding: 16px;
  box-shadow: var(--shadow-card);
}
```
Variants: tinted card → `background: var(--display-primary)`; floating chart card → `box-shadow: var(--shadow-elev)`.

### Tabs (MD3 underline)
```css
.tab { height:48px; padding:0 16px; font:500 14px/1 var(--font);
       color:var(--surface-variant); }
.tab.active { color:var(--on-surface-green); }
.tab.active::after {            /* 3px green underline, full-width edge-to-edge */
  content:""; position:absolute; bottom:0; left:0; right:0;
  height:3px; background:#37BD69;
}
```
Tab rows scroll horizontally and hide their scrollbar (`scrollbar-width:none`).

### Segmented control (Week / Month / Year)
```css
.segment { display:flex; gap:4px; padding:3px;
           background:var(--neutral-05); border-radius:11px; }
.seg { flex:1; padding:7px 0; border-radius:9px; background:transparent;
       font:500 14px var(--font); color:var(--neutral-secondary); }
.seg.active { background:#fff; color:var(--on-primary-cont);
              box-shadow:var(--shadow-seg); }
```

### Chips
- **Filter chip (pill):** `background:var(--display-primary); color:var(--on-secondary-cont); padding:6px 12px; border-radius:100px; font:500 12px;`
- **Selectable chip:** white with `1px solid rgba(0,0,0,0.08)`; **active** → `background:var(--on-surface-green); color:#fff`.
- **Trend chip (tab-like):** `background:rgba(0,0,0,0.05)`; **active** → `background:#1F515B; color:#fff; border-radius:10px`.

### Primary button / CTA
```css
.cta {
  width:100%; padding:14px 0; border:0; border-radius:var(--r-lg);
  background:var(--on-surface-green); color:#fff;
  font:600 15px var(--font); box-shadow:var(--shadow-seg);
}
.cta.disabled { background:#B7C7C1; box-shadow:none; }
```
Secondary/navy button: `background:#1F515B; color:#fff`. Ghost button: white + `1.5px solid var(--neutral-05)`; danger ghost adds `color:#E93353`.

### Stat tile (small metric box)
```css
.stat { flex:1; background:#fff; border-radius:13px; padding:12px 0;
        display:flex; flex-direction:column; align-items:center; gap:5px;
        box-shadow:var(--shadow-stat); }
```
On a **white** card, tint the inner tiles instead: `background:var(--display-primary); box-shadow:none`.

### Delta badge
```css
.delta { font:700 12px; padding:4px 10px; border-radius:100px; }
.delta.up  { color:#1b7a44; background:#37BD691f; }
.delta.dn  { color:#c2410c; background:#FA61401f; }
.delta.eq  { color:var(--neutral-secondary); background:rgba(0,0,0,0.05); }
```

### List row
Flex row, `gap:12px`, `padding:13px 0`, hairline divider `1px solid rgba(0,0,0,0.05)` (none on `:last-child`); optional leading color dot (`10px` circle) + trailing chevron in `--neutral-secondary`.

### Search field
```css
.search { display:flex; align-items:center; gap:9px;
          background:rgba(0,0,0,0.05); border-radius:10px; padding:11px 13px;
          color:#7A8684; font:400 14px var(--font); }
```
(On white pages use `background:#fff; box-shadow:var(--shadow-card)` instead.)

### Bottom sheet (modal)
```css
.sheet-scrim { position:absolute; inset:0; z-index:80;
  display:flex; align-items:flex-end; background:rgba(15,28,26,.42); }
.sheet { width:100%; max-height:90%; overflow-y:auto;
  background:#EFF5F2; border-radius:22px 22px 0 0;
  animation:sheetup .3s cubic-bezier(.2,.8,.2,1); }
@keyframes sheetup { from{transform:translateY(100%);} to{transform:translateY(0);} }
```
Add a grab handle: `38×5px`, `border-radius:3px`, `background:#C8D2CE`, centered. Sheet header is white & sticky; body is mint with white cards.

### Status pill (OK / Warn / Risk)
```css
.status { font:700 11px; padding:4px 9px; border-radius:100px; }
.status.ok   { background:#E1F9ED; color:#06794A; }
.status.warn { background:#FEF3D6; color:#9A6700; }
.status.risk { background:#FDE4E1; color:#C0392B; }
```

---

## 6. Data Visualization

Charts are hand-built inline SVG (no chart library). Conventions:

- **Per-response-type viz**: numeric → area/line; scale → bars / lollipop / dot-track / gauge ring; list → donut / distribution bars; text → quote chips or note preview. (See `.v2-viz` family.)
- **Line/area:** stroke uses the category color; area fill is the same color at low opacity. Current point marked with a dot.
- **Bars:** `linear-gradient(180deg,#3FD07E,#41C074)` for the green series; previous/comparison series in muted grey `#C2CEC8`.
- **Average / reference line:** dashed, `#8479F9` (violet) or green `#37BD69`.
- **Scrub tooltip:** dark teal bubble `#16433b`, white text, `border-radius:8px`, follows touch/hover.
- **Axis labels:** x `10.5px/600` (`#7A8684`, current emphasised dark/700); y `9.5px/500` `#9AA6A2`.

### Entrance animations (short, eased, respect reduced-motion)
```css
@keyframes draw   { from{stroke-dashoffset:380;} to{stroke-dashoffset:0;} } /* line draw */
@keyframes fade   { from{opacity:0;} to{opacity:1;} }
@keyframes barGrow{ from{transform:scaleY(0);} to{transform:scaleY(1);} }   /* origin bottom */
@keyframes distGrow{from{transform:scaleX(0);} to{transform:scaleX(1);} }   /* origin left */
```
- Lines draw in ~0.8s `cubic-bezier(.33,0,.2,1)`; bars grow ~0.5s `cubic-bezier(.2,.8,.2,1)`; staggered children +0.08s each.
- Always wrap in `@media (prefers-reduced-motion: reduce) { animation:none; }`.
- Press feedback on cards: `:active { transform: scale(.992); }`.

---

## 7. Spacing & Shape Quick Reference

| Token | Value | Used for |
|-------|-------|----------|
| Page padding | 16px | body gutters |
| Card gap | 12px | between cards |
| Card padding | 16px | (12–18px range) |
| Radius sm | 8px | tinted cards, small tiles |
| Radius md | 10px | inputs, chips-as-boxes |
| Radius lg | 12px | default cards, CTAs |
| Radius xl | 14–16px | stat tiles, plan cards |
| Pill | 100px | chips, badges, dots-as-pills |
| Hairline | `1px solid rgba(0,0,0,0.05)` | dividers, card borders |
| Status-bar clearance | 54px top padding | sticky headers |

---

## 8. Do / Don't

**Do**
- Float white cards on the mint `--bg`.
- Use one green accent; reach for the category palette only inside charts.
- Pair a `--neutral-secondary` label with a bold dark/green value.
- Keep shadows soft and teal-tinted; keep corners rounded.
- Give every metric a tailored visualization.

**Don't**
- ❌ Clone iOS/Apple chrome literally — borrow the *information design*, wear the Antz theme.
- ❌ Add Pending / Overdue / Completed / approval status to assessment records.
- ❌ Use pure black for body text (reserve near-black for a few titles).
- ❌ Put white cards on a white background, or hard 1px black borders.
- ❌ Pull in a heavy chart library — these are inline SVG.

---

*Source of truth: `Apple Health/styles2.css`, `app2-schedule.css`, `app2.js`. Theme: MD3_Antz palette, Inter type ramp.*
