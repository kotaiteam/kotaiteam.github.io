# STYLE-SPEC: CSS Visual Fidelity — New Design

**Source reference:** `.tmp/kotai-html-website/styles.css`
**Target files:** `frontend/styles/kotai.css`, `frontend/styles/hero.css`
**Scope:** CSS-only changes to close the visual gap between the implemented Bulma+kotai.css layer and the reference standalone design. HTML/component/layout/data layers are already implemented per `CODING-SPEC-new-design.md`.

---

## Context

The structural implementation (components, layouts, data, JS) is complete. The current `kotai.css` matches the spec's prescribed minimal layer. This spec addresses the **22 specific CSS rules** that were simplified relative to the reference `styles.css`, grouped by priority and risk.

---

## Group A — High Impact, Low Risk

Pure additions or enhancements. No existing rules need to change.

### A1. Add `--kotai-light-gray` variable

**File:** `frontend/styles/kotai.css` — `:root` block

```css
--kotai-light-gray: #F8F8F8;
```

### A2. Scroll progress glow

**File:** `frontend/styles/kotai.css` — `.scroll-progress`

```css
box-shadow: 0 0 10px rgba(118, 127, 166, 0.5);
```

### A3. Partner logo scale on hover

**File:** `frontend/styles/kotai.css` — `.partner-logo:hover`

```css
transform: scale(1.1);
```

### A4. Scroll animation — stronger offset and longer duration

**File:** `frontend/styles/kotai.css` — `.animate-in`

```css
/* change translateY(20px) → translateY(30px), 0.5s → 0.6s ease-out */
opacity: 0;
transform: translateY(30px);
transition: opacity 0.6s ease-out, transform 0.6s ease-out;
```

### A5. Footer accent gradient

**File:** `frontend/styles/kotai.css` — `.footer-accent`

```css
/* change: solid slate → peach-slate-peach gradient */
background: linear-gradient(to right, var(--kotai-peach), var(--kotai-slate), var(--kotai-peach));
```

### A6. Footer link slide + underline on hover

**File:** `frontend/styles/kotai.css` — add to footer section

```css
.footer a {
  display: inline-block;
  transition: all 0.3s;
}
.footer a:hover {
  color: var(--kotai-white) !important;
  transform: translateX(8px);
  text-decoration: none;
}
```

---

## Group B — Medium Impact, Low Risk

Visual property changes that update existing rules.

### B1. Hero Digital background — flat → gradient

**File:** `frontend/styles/kotai.css` — `.hero-digital`

```css
/* change: background: #1e2235 → */
background: linear-gradient(135deg, var(--kotai-slate), #8A94B8, var(--kotai-slate));
```

### B2. Hero Fractional background — flat → gradient

**File:** `frontend/styles/kotai.css` — `.hero-fractional`

```css
/* change: background: var(--kotai-charcoal) → */
background: linear-gradient(135deg, var(--kotai-charcoal), #4a4a4a, var(--kotai-charcoal));
```

### B3. Hero grid pattern — opacity and grid size

**File:** `frontend/styles/kotai.css` — `.hero-grid-pattern`

```css
/* change: opacity 0.03 → 0.05, background-size 40px → 60px */
background-size: 60px 60px;
background-image:
  linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
```

### B4. `highlight-peach` — text color only → background block highlight

**File:** `frontend/styles/kotai.css` — `.highlight-peach`

```css
/* change: just color → full background-highlight block */
background: var(--kotai-peach);
color: var(--kotai-charcoal);
padding: 0 0.75rem;
padding-top: 0.1em;
padding-bottom: 0.15em;
box-decoration-break: clone;
-webkit-box-decoration-break: clone;
line-height: 1.4;
```

> **Note:** The `.hero-digital .title .highlight-peach` and `.hero-fractional .title .highlight-peach` overrides in `kotai.css` set `color: var(--kotai-peach-dark) !important` which conflicts with the new background-highlight style. These must be removed first — see E1.

### B5. Nav underline — solid charcoal + width → gradient + scaleX

**File:** `frontend/styles/kotai.css` — `.nav-underline`

```css
/* replace width-based animation with scaleX + gradient */
background: linear-gradient(to right, var(--kotai-peach), var(--kotai-slate));
width: 100%;       /* always full width; scaleX controls visibility */
transform: scaleX(0);
transform-origin: left;
transition: transform 0.3s ease;
```

`.nav-link:hover .nav-underline, .nav-link.active .nav-underline`:
```css
/* change: width: 100% → */
transform: scaleX(1);
```

### B6. CTA section — flat charcoal → contextual gradient variants

**File:** `frontend/styles/kotai.css` — `.cta-section`

```css
.cta-section.cta-digital {
  background: linear-gradient(135deg, var(--kotai-slate), #8A94B8) !important;
}
.cta-section.cta-fractional {
  background: linear-gradient(135deg, var(--kotai-charcoal), #4a4a4a) !important;
}
```

> **Template change required:** Add `cta-digital` or `cta-fractional` class to the `{% render "cta_section" %}` calls in `src/_layouts/home.liquid` and `src/_layouts/services.liquid`.

---

## Group C — Component Upgrades

CSS-only changes; no markup changes needed unless noted.

### C1. Card accent circle — larger, hover-grows

**File:** `frontend/styles/kotai.css` — `.card-accent-circle`

```css
/* change: 80px → 128px; switch from opacity to alpha in bg color */
width: 128px;
height: 128px;
opacity: 1;
transition: transform 0.5s;
```

```css
.card-accent-circle.peach-accent { background: rgba(255, 203, 181, 0.2); }
.card-accent-circle.slate-accent { background: rgba(118, 127, 166, 0.1); }
```

Add grow-on-hover:
```css
.card:hover .card-accent-circle { transform: scale(1.5); }
```

### C2. Card icon wrapper — larger size

**File:** `frontend/styles/kotai.css` — `.card-icon-wrapper`

```css
/* change: 48px → 56px, 10px → 16px border-radius */
width: 56px;
height: 56px;
border-radius: 16px;
```

### C3. Stat icon wrapper — circle → rounded square with gradient bg

**File:** `frontend/styles/kotai.css` — `.stat-icon-wrapper`

```css
/* change: border-radius 50% → 12px; bg solid off-white → gradient */
border-radius: 12px;
background: linear-gradient(135deg, rgba(118, 127, 166, 0.1), rgba(255, 203, 181, 0.1));
border: none;
```

### C4. Back to top — circle → rounded square with gradient

**File:** `frontend/styles/kotai.css` — `.back-to-top`

```css
/* change: border-radius 50% → 12px; bg solid charcoal → gradient */
border-radius: 12px;
background: linear-gradient(135deg, var(--kotai-charcoal), #4a4a4a);
border: 1px solid rgba(255, 255, 255, 0.1);
```

Add hover:
```css
.back-to-top:hover { transform: scale(1.1); }
```

### C5. Contact icon — sizing and color variants

**File:** `frontend/styles/kotai.css` — `.contact-icon`

```css
/* change: 40px → 48px, 8px → 12px border-radius */
width: 48px;
height: 48px;
border-radius: 12px;
```

Add color variants:
```css
.contact-icon.peach { background: rgba(255, 203, 181, 0.2); }
.contact-icon.peach:hover { background: var(--kotai-peach); transform: scale(1.1); }
.contact-icon.slate { background: rgba(118, 127, 166, 0.1); }
.contact-icon.slate:hover { background: var(--kotai-slate); }
.contact-icon.slate:hover svg,
.contact-icon.slate:hover i { color: white; }
```

### C6. Mobile bottom bar — flat edge bar → floating pill

**File:** `frontend/styles/kotai.css` — `.mobile-bottom-bar`

```css
/* replace flat bottom bar with floating pill */
bottom: max(1.25rem, env(safe-area-inset-bottom));
left: 1rem;
right: 1rem;
background: rgba(255, 255, 255, 0.9);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
border-radius: 9999px;
border: 1px solid rgba(51, 51, 51, 0.1);
padding: 0.375rem;
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
max-width: 24rem;
margin: 0 auto;
```

Toggle buttons inside:
```css
.mobile-bottom-bar .toggle-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 9999px;
}
.mobile-bottom-bar .toggle-btn.active {
  background: linear-gradient(to right, var(--kotai-charcoal), #4a4a4a);
}
```

### C7. Toggle pill — simple bg → gradient with inset shadow

**File:** `frontend/styles/kotai.css` — `.toggle-container`

```css
background: linear-gradient(to right, var(--kotai-light-gray), var(--kotai-off-white));
box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
border: 1px solid rgba(51, 51, 51, 0.05);
```

`.toggle-btn.active`:
```css
background: linear-gradient(to right, var(--kotai-charcoal), #4a4a4a);
```

### C8. Dashboard overlay — gradient direction and strength

**File:** `frontend/styles/kotai.css` — `.dashboard-overlay::after`

```css
/* update gradient to match reference */
background: linear-gradient(to top, rgba(26, 26, 26, 0.8), transparent, transparent);
```

---

## Group D — `hero.css` Updates

### D1. Hero Digital button colors — align with new slate gradient background

**File:** `frontend/styles/hero.css`

The current dark button uses `#1e2235` (matched the old flat dark blue). With the new slate gradient hero, the primary button should be white:

```css
.hero-digital .button.is-dark {
  background-color: white;
  color: var(--kotai-slate);
  border-color: transparent;
}
.hero-digital .button.is-dark:hover {
  background-color: var(--kotai-peach);
  color: var(--kotai-charcoal);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transform: translateY(-2px);
}
.hero-digital .button.is-light {
  background-color: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
}
.hero-digital .button.is-light:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
```

---

## Group E — Cleanup

### E1. Remove conflicting hero title `highlight-peach` overrides

**File:** `frontend/styles/kotai.css`

Remove these rules before applying B4:

```css
/* REMOVE: */
.hero-digital .title .highlight-peach,
.hero-fractional .title .highlight-peach {
  color: var(--kotai-peach-dark) !important;
}
```

### E2. Footer pattern — implement grid overlay

**File:** `frontend/styles/kotai.css` — `.footer-pattern` (currently an empty comment)

```css
.footer-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image:
    linear-gradient(var(--kotai-peach) 1px, transparent 1px),
    linear-gradient(90deg, var(--kotai-peach) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}
```

Also add to `.footer`:
```css
position: relative;
overflow: hidden;
```

> **Template change required:** Add `<div class="footer-pattern"></div>` inside the `<footer>` element in `src/_components/footer.liquid`.

---

## Implementation Instructions

- Execute the implementation in the order specified in the Execution Order table below.
- After implementing every step, describe what was changed and how to test it.
- After implementing every step, ask the user to test and verify the changes.
- Ask for confirmation before proceeding to the next step.

---

## Execution Order

| Step | Group | Changes | Files | Risk |
|---|---|---|---|---|
| 1 | A1–A4 | Variable + glow + partner scale + animate-in | `kotai.css` | None |
| 2 | B1–B3 | Hero gradients + grid pattern | `kotai.css` | Low |
| 3 | E1 | Remove conflicting highlight-peach overrides | `kotai.css` | Low |
| 4 | B4 | `highlight-peach` background block | `kotai.css` | Medium — visual change |
| 5 | B5 | Nav underline gradient + scaleX | `kotai.css` | Low |
| 6 | C7 | Toggle pill gradient + inset shadow | `kotai.css` | Low |
| 7 | C6 | Mobile bottom bar floating pill | `kotai.css` | Medium |
| 8 | C1–C5, C8 | Card / stat / back-to-top / contact / dashboard | `kotai.css` | Low |
| 9 | A5–A6 | Footer accent gradient + link slide | `kotai.css` | Low |
| 10 | E2 | Footer pattern | `kotai.css` + `footer.liquid` | Low |
| 11 | B6 | CTA gradient variants | `kotai.css` + layouts | Low |
| 12 | D1 | Hero Digital button updates | `hero.css` | Low |
| 13 | — | Smoke test all 4 pages, toggle, mobile | — | — |

---

## Group F — Post-Implementation Fixes

Issues discovered during smoke testing that required additional fixes beyond the original 13-step plan.

### F1. Navbar background opacity — hero bleed-through

**File:** `frontend/styles/kotai.css` — `.navbar.is-fixed-top`

The new dark slate hero gradient bled through the frosted-glass navbar at 80% opacity, making the bar appear gray.

```css
/* change: rgba(255,255,255,0.8) → rgba(255,255,255,0.95) */
background: rgba(255, 255, 255, 0.95) !important;
```

### F2. Navbar height + Bulma shadow override

**File:** `frontend/styles/kotai.css` — `.navbar.is-fixed-top`

Bulma's fixed navbar added its own `box-shadow` creating a double-line at the bottom. Height was also not explicitly set to match the reference's 5rem desktop header.

```css
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
min-height: 5rem;

.navbar.is-fixed-top .navbar-brand,
.navbar.is-fixed-top .navbar-menu {
  min-height: 5rem;
}

.navbar.is-fixed-top .navbar-brand {
  align-items: center;
}
```

### F3. Responsive logo

**File:** `frontend/styles/kotai.css` — new `.navbar-logo` class
**File:** `src/_components/navbar.liquid` — replace inline `style` with class

The logo used a fixed `max-height: 36px` inline style. The reference scales the logo responsively: `1.5rem` mobile → `2rem` tablet+.

```css
.navbar-logo {
  height: 1.5rem;
  width: auto;
  transition: transform 0.3s ease;
}

@media (min-width: 640px) {
  .navbar-logo { height: 2rem; }
}

.navbar-item:hover .navbar-logo { transform: scale(1.05); }
```

In `navbar.liquid`, replace `style="max-height:36px;"` → `class="navbar-logo"` on the `<img>`.

### F4. Nav underline — wrong positioning anchor

**File:** `frontend/styles/kotai.css` — `.nav-link-inner`, `.nav-underline`
**File:** `src/_components/navbar.liquid` — wrap link text in `.nav-link-inner`

The `.nav-underline` was `position: absolute` relative to the full-height Bulma `.navbar-item` (5rem), placing the line at the bottom of the navbar bar instead of below the link text.

Fix: wrap each link's text in `<span class="nav-link-inner">` and make that span the positioning anchor.

```css
.nav-link-inner {
  position: relative;
  display: inline-block;
}

.nav-underline {
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  /* ... rest unchanged */
}
```

In `navbar.liquid`, change each nav link from:
```html
Home <span class="nav-underline"></span>
```
to:
```html
<span class="nav-link-inner">Home<span class="nav-underline"></span></span>
```

### F5. Remove Bulma navbar item hover background

**File:** `frontend/styles/kotai.css`

Bulma applies a dark background to `.navbar-item:hover` by default. Override it so only the gradient underline appears on hover.

```css
.navbar-item.nav-link:hover,
.navbar-item.nav-link:focus {
  background-color: transparent !important;
}
```

### F6. Hero Fractional primary button — match Digital hero style

**File:** `frontend/styles/hero.css` — `.hero-fractional .button.is-dark`

The Fractional hero primary button retained the old dark style. Updated to match the Digital hero: white background, charcoal text, peach hover with lift.

```css
.hero-fractional .button.is-dark {
  background-color: white;
  color: var(--kotai-charcoal);
  border-color: transparent;
}

.hero-fractional .button.is-dark:hover {
  background-color: var(--kotai-peach);
  color: var(--kotai-charcoal);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transform: translateY(-2px);
}
```

### F7. Contact Us nav button — peach gradient style

**Files:** `frontend/styles/kotai.css`, `src/_components/navbar.liquid`

The nav "Contact Us" button used Bulma's `.button.is-dark` (charcoal). The reference design uses a peach-gradient pill with charcoal text and a lift+shadow on hover.

In `navbar.liquid`, replace `class="button is-dark"` → `class="nav-cta-btn"`.

```css
.nav-cta-btn {
  display: inline-block;
  padding: 0.625rem 1.5rem;
  background: linear-gradient(to right, var(--kotai-peach), var(--kotai-peach-dark));
  color: var(--kotai-charcoal) !important;
  border-radius: 0.5rem;
  font-weight: 500;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.3s;
  border: none;
}

.nav-cta-btn:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  color: var(--kotai-charcoal) !important;
}
```

Also remove the old navbar dark button override:
```css
/* REMOVE: */
.navbar .button.is-dark,
.navbar a.button.is-dark { ... }
```

### F8. Hero feature cards — full structural overhaul

**Files:** `frontend/styles/kotai.css`, `src/_components/hero.liquid`

The original spec applied a dark glass style (`.hero-digital .card`) to hero cards. The reference design uses **white cards** on the dark hero background. This required a full restructure of the card markup and CSS.

#### Markup changes (`hero.liquid`)

- Replaced Bulma `columns`/`column`/`card`/`card-content` wrappers with a flat `hero-cards-grid` div containing `.hero-feature-card` divs directly
- Replaced Bulma `.title.is-6` / `.subtitle.is-7` with semantic `<h3 class="card-title">` / `<p class="card-desc">`
- Removed inline `style` attributes and Bulma spacing utilities from icon wrappers
- Applied same restructure to the Fractional hero cards

```html
<div class="hero-cards-grid">
  <div class="hero-feature-card">
    <div class="card-accent-circle peach-accent"></div>
    <div class="card-icon-wrapper peach-bg">
      <i data-lucide="brain-circuit"></i>
    </div>
    <h3 class="card-title">Cognitive Systems</h3>
    <p class="card-desc">Advanced machine learning models that evolve, adapt, and optimize complex operational workflows automatically.</p>
  </div>
  <!-- ... -->
</div>
```

#### CSS changes (`kotai.css`)

**`.hero-cards-grid`** — CSS Grid replacing Bulma columns:
```css
.hero-cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 4rem;
  max-width: 72rem;
  margin-left: auto;
  margin-right: auto;
}
@media (min-width: 640px) { .hero-cards-grid { margin-top: 5rem; } }
@media (min-width: 768px) { .hero-cards-grid { grid-template-columns: repeat(3, 1fr); gap: 2rem; } }
@media (min-width: 1024px) { .hero-cards-grid { margin-top: 6rem; } }
```

**`.hero-feature-card`** — white card, not dark glass:
```css
.hero-feature-card {
  background: white;
  border-radius: 1.5rem;
  padding: 1.5rem;        /* → 2rem on desktop */
  text-align: left;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s;
  height: 100%;
}
.hero-feature-card:hover { transform: translateY(-10px); }
```

**`.card-accent-circle`** — corner-quarter-circle positioning:
```css
.card-accent-circle {
  position: absolute;
  top: 0; right: 0;
  width: 8rem; height: 8rem;
  border-bottom-left-radius: 100%;
  margin-right: -4rem; margin-top: -4rem;
  transition: transform 0.5s;
}
.card-accent-circle.peach-accent { background: rgba(255, 203, 181, 0.2); }
.card-accent-circle.slate-accent { background: rgba(118, 127, 166, 0.1); }
.hero-feature-card:hover .card-accent-circle { transform: scale(1.5); }
```

**`.card-icon-wrapper`** — `display: flex` (block-level) so it left-aligns; `z-index: 10` to layer above accent circle:
```css
.card-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem; height: 3.5rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 10;
}
.card-icon-wrapper i, .card-icon-wrapper svg { width: 1.75rem; height: 1.75rem; }
```

**`.card-title` / `.card-desc`** — replacing Bulma title/subtitle:
```css
.card-title {
  font-family: var(--font-serif);
  font-size: 1.25rem;   /* → 1.5rem on desktop */
  font-weight: 700;
  color: var(--kotai-charcoal);
  margin-bottom: 0.75rem;
  position: relative; z-index: 10;
}
.card-desc {
  font-family: var(--font-sans);
  font-size: 0.875rem;  /* → 1rem on desktop */
  font-weight: 400;
  color: var(--kotai-slate);
  line-height: 1.625;
  position: relative; z-index: 10;
}
```

**`.peach-bg` / `.slate-bg`** — updated to softer alpha for white card context:
```css
.peach-bg { background: rgba(255, 203, 181, 0.3) !important; }
.slate-bg { background: rgba(118, 127, 166, 0.2) !important; }
```

Remove the old dark glass card overrides:
```css
/* REMOVE: */
.hero-digital .card, .hero-fractional .card { background: rgba(255,255,255,0.08); ... }
.hero-digital .card .title, .hero-fractional .card .title, ... { color: white !important; }
```

### F9. Fractional inline CTA — missing `cta-fractional` class

**File:** `src/_components/hero.liquid`

The inline CTA section at the bottom of the Fractional hero page was missing the `cta-fractional` variant class, so it rendered with the flat charcoal fallback instead of the gradient.

```html
<!-- change: class="section cta-section has-text-centered has-text-white" → -->
<section class="section cta-section cta-fractional has-text-centered has-text-white">
```

### F10. Hero and CTA button font sizes — Bulma `is-medium` override

**File:** `frontend/styles/hero.css`
**File:** `frontend/styles/kotai.css`

Bulma's `.button.is-medium` defaults to `font-size: 1.25rem`. The reference uses `1rem` for hero buttons (`.btn` base) and `1.125rem` for CTA section buttons (`.btn-cta`).

```css
/* hero.css — hero buttons */
.hero-digital .button,
.hero-fractional .button {
  font-size: 1rem;
}

/* kotai.css — CTA section buttons */
.cta-section .button {
  font-size: 1.125rem;
}
```

### F11. Home Digital — section ordering: split sections before dashboard

**File:** `src/_layouts/home.liquid`

The two split sections (Cloud-Native Architecture, AI & Automation) were rendered *after* the dashboard, but the reference places them *between* Featured Work and the Dashboard. Reordered:

```
featured_work → split_section (cloud) → split_section (AI) → dashboard → ...
```

### F12. Section header and split section typography — Bulma title/subtitle override

**Files:** `frontend/styles/kotai.css`, `src/_components/partners.liquid`, `src/_components/featured_work.liquid`, `src/_components/dashboard.liquid`, `src/_components/split_section.liquid`

All section headers used Bulma's `.title.is-3` (fixed 1.875rem) and `.subtitle.is-5` (fixed 1.25rem), overriding the reference's responsive scaling. The split section badge used Bulma's `.tag.is-light` instead of the custom `.split-badge` style.

#### CSS additions (`kotai.css`)

**`.section-header`** — responsive heading and body, centered and light variants:
```css
.section-header h2, .section-header .title {
  font-size: 1.5rem !important;   /* → 1.875rem → 2.25rem → 2.5rem */
  font-weight: 700 !important;
  color: var(--kotai-charcoal) !important;
  font-family: var(--font-serif) !important;
}
.section-header p, .section-header .subtitle {
  font-size: 0.875rem !important; /* → 1rem → 1.125rem */
  color: var(--kotai-slate) !important;
  font-family: var(--font-sans) !important;
  font-weight: 400 !important;
}
.section-header.light h2, .section-header.light .title { color: white !important; }
.section-header.light p, .section-header.light .subtitle { color: rgba(255,255,255,0.7) !important; }
```

**`.split-badge`** — peach-tinted pill replacing Bulma `tag is-light`:
```css
.split-badge {
  display: inline-flex;
  padding: 0.375rem 0.75rem;
  background: rgba(255, 203, 181, 0.2);
  color: var(--kotai-peach-dark);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

**`.split-content h2/p`** — same responsive scale as section-header:
```css
.split-content h2, .split-content .title {
  font-size: 1.5rem !important; /* → 1.875rem → 2.25rem → 2.5rem */
}
.split-content > p, .split-content > .subtitle {
  font-size: 1rem !important;   /* → 1.125rem at 768px+ */
}
```

#### Markup changes

- `partners.liquid` — `section-header center` + plain `h2`/`p` (removed `is-3`/`is-5`)
- `featured_work.liquid` — `section-header` + plain `h2`/`p`
- `dashboard.liquid` — `section-header center light` + plain `h2`/`p`
- `split_section.liquid` — `split-badge` class (removed `tag is-light`), plain `h2`/`p`

### F13. Home Digital — missing Tech Stack and How We Work sections

**Files:** `src/_components/tech_stack.liquid` (new), `src/_components/process_digital.liquid` (new), `frontend/styles/kotai.css`, `src/_layouts/home.liquid`

Two sections present in the reference after the Dashboard were not implemented: "Enterprise Technology Stack" and "How We Work". Created as new components and added to `home.liquid`.

#### New components

**`tech_stack.liquid`** — 2×2 bordered grid with brand SVG logos and hover tooltips:
- Frontend/UI: React, Vue.js, Tailwind CSS, Next.js
- Backend & API: Node.js, Python, Go, GraphQL
- Cloud & Data: AWS, Docker, PostgreSQL, MongoDB
- Tools & DevOps: CI/CD, TensorFlow, OpenAI, Kubernetes

**`process_digital.liquid`** — 4-step "How We Work" process (Discovery → Design → Build → Scale) with large slate-tinted step numbers.

#### CSS additions (`kotai.css`)

```css
/* Tech Stack */
.tech-grid-container { border-radius: 2rem; border: 1px solid #e5e7eb; max-width: 56rem; }
.tech-grid { display: grid; grid-template-columns: 1fr; }
@media (min-width: 768px) { .tech-grid { grid-template-columns: repeat(2, 1fr); } }
.tech-cell.border-right { border-right: 1px solid #e5e7eb; } /* at 768px+ */
.tech-cell.border-bottom { border-bottom: 1px solid #e5e7eb; }
.tech-logo-item:hover { transform: scale(1.1); }
.tech-logo-item::after { /* tooltip via attr(title) */ }

/* Process */
.process-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
@media (min-width: 640px) { .process-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .process-grid { grid-template-columns: repeat(4, 1fr); } }
.process-num { font-size: 2.25rem; color: rgba(118, 127, 166, 0.2); font-family: var(--font-serif); }
/* → 3rem at 640px, 3.75rem at 768px */
.process-step h3 { font-size: 1.25rem; } /* → 1.5rem at 640px */
.process-step p { font-size: 0.875rem; } /* → 1rem at 640px */
```

#### `home.liquid` render order (Digital)
```
dashboard → tech_stack → process_digital → cta_section (cta-digital)
```

### F14. Featured Work section — full project card system replacing Bulma cards

**Files:** `frontend/styles/kotai.css`, `src/_components/featured_work.liquid`

The component used Bulma's card structure (`columns`, `card-image`, `tag`, `title is-5`, `subtitle is-6`) with a 4-up grid. The reference uses a custom flat card system with `aspect-ratio: 4/3` images, responsive 2-column grid, hover lift + image zoom, and a "View Case Study" link that reveals on hover.

#### CSS additions (`kotai.css`)

```css
.featured-work-section { background: var(--kotai-white); }

.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
@media (min-width: 1024px) { .projects-grid { grid-template-columns: repeat(2, 1fr); gap: 3rem; } }

.project-card { cursor: pointer; transition: transform 0.3s; }
.project-card:hover { transform: translateY(-8px); }

.project-image {
  aspect-ratio: 4/3;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1rem;           /* → 1.5rem at 640px */
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
}
.project-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.project-card:hover .project-image img { transform: scale(1.05); }

.project-content { display: flex; flex-direction: column; gap: 0.5rem; } /* → 0.75rem at 640px */
.project-category { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; } /* → 0.875rem */
.project-title { font-size: 1.25rem; font-weight: 700; font-family: var(--font-serif); } /* → 1.5rem */
.project-card:hover .project-title { color: var(--kotai-slate); }
.project-desc { font-size: 0.875rem; line-height: 1.625; } /* → 1rem at 640px */

.project-link {
  display: flex; align-items: center; gap: 0.5rem;
  opacity: 0; transition: opacity 0.3s;   /* hidden until hover */
  font-size: 0.75rem; font-weight: 500;   /* → 0.875rem at 640px */
}
.project-card:hover .project-link { opacity: 1; }
.project-card:hover .project-link i { transform: translateX(4px); }
```

#### Markup changes (`featured_work.liquid`)

Replaced Bulma `columns`/`column is-half-tablet is-one-quarter-desktop`/`card`/`card-image`/`card-content`/`tag`/`title is-5`/`subtitle is-6` with:

```html
<section class="section featured-work-section">
  <div class="projects-grid">
    <div class="project-card">
      <div class="project-image"><img src="..." alt="..."></div>
      <div class="project-content">
        <div class="project-category">{{ project.category }}</div>
        <h3 class="project-title">{{ project.title }}</h3>
        <p class="project-desc">{{ project.description }}</p>
        <div class="project-link"><span>View Case Study</span><i data-lucide="arrow-right"></i></div>
      </div>
    </div>
  </div>
</section>
```

### F15. Stats bar — CSS Grid layout, responsive icon/count/label sizing

**Files:** `frontend/styles/kotai.css`, `src/_components/stats_bar.liquid`

The stats section used Bulma `columns is-vcentered has-text-centered` with fixed pixel icon sizes and non-responsive font scales. The reference uses a CSS Grid with 2-column mobile → 4-column at 768px, responsive icon sizes, and smaller starting font sizes.

#### CSS changes (`kotai.css`)

```css
/* Replaces old fixed stat-icon-wrapper / stat-count / stat-label */
.stats-section { background: var(--kotai-white); border-bottom: 1px solid var(--kotai-border); padding: 3rem 0; }
@media (min-width: 640px) { .stats-section { padding: 4rem 0; } }

.stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
@media (min-width: 768px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }

.stat-item { text-align: center; }

.stat-icon-wrapper { width: 3rem; height: 3rem; margin: 0 auto 0.75rem; border-radius: 0.75rem; }
/* → 3.5rem / 1rem radius at 640px; → 4rem at 768px */
.stat-icon-wrapper i, .stat-icon-wrapper svg { width: 1.5rem; height: 1.5rem; }
/* → 1.75rem at 640px; → 2rem at 768px */

.stat-count { font-size: 1.25rem; font-weight: 700; font-family: var(--font-serif); }
/* was 1.75rem fixed — → 1.5rem at 640px */
.stat-label { font-size: 0.75rem; }
/* was 0.875rem fixed — → 0.875rem at 640px */
```

#### Markup changes (`stats_bar.liquid`)

Replaced Bulma `columns`/`column` with `.stats-section` > `.container` > `.stats-grid` > `.stat-item`. Changed `<p>` tags to `<div>` for count/label. Removed `mx-auto` Bulma helper (centering via `margin: 0 auto` in CSS).

### F16. Split sections — CSS Grid layout, checklist structure, image aspect-ratio, background alternation

**Files:** `frontend/styles/kotai.css`, `src/_components/split_section.liquid`, `src/_layouts/home.liquid`

The split sections used Bulma `columns is-vcentered` with Bulma column wrappers, inline image styles (`max-height: 400px`), inline `gap` on checklist items, and no background alternation. The reference uses a custom CSS Grid with `aspect-ratio: 4/3` images, a proper `.checklist`/`.checklist-item` structure, and alternating section backgrounds.

#### CSS additions/changes (`kotai.css`)

```css
.bg-white  { background: var(--kotai-white); }
.bg-fafafa { background: var(--kotai-off-white); }

.split-section { padding: 4rem 1.5rem; } /* → 5rem → 6rem */

.split-grid {
  display: grid; grid-template-columns: 1fr; gap: 2.5rem; align-items: center;
}
@media (min-width: 1024px) { .split-grid { grid-template-columns: repeat(2, 1fr); gap: 4rem; } }
@media (min-width: 1280px) { .split-grid { gap: 6rem; } }
.split-grid.reverse .split-image { order: -1; }
@media (max-width: 1023px) { .split-grid.reverse .split-image { order: 0; } }

.split-image { aspect-ratio: 4/3; border-radius: 1rem; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
.split-image img { width: 100%; height: 100%; object-fit: cover; }

/* check-dot — was 8px inline dot; now 1.5rem circle with white inner via ::after */
.check-dot { width: 1.5rem; height: 1.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 0.125rem; }
.check-dot::after { content: ''; width: 0.5rem; height: 0.5rem; background: white; border-radius: 50%; }
.check-dot.peach { background: var(--kotai-peach); }
.check-dot.slate { background: var(--kotai-slate); }

.checklist { display: flex; flex-direction: column; gap: 1rem; }
.checklist-item { display: flex; align-items: flex-start; gap: 0.75rem; }
.checklist-item p { color: var(--kotai-charcoal); font-family: var(--font-sans); line-height: 1.5; }
```

#### Markup changes (`split_section.liquid`)

Replaced Bulma `columns`/`column is-half`/`figure.image` with `.split-grid`/`.split-content`/`.split-image`. Replaced inline `is-flex`+`style="gap"` checklist rows with `.checklist`/`.checklist-item`. Removed `section` base class; uses `split-section` directly.

#### `home.liquid` updates

- Added `bg_class: "bg-fafafa"` to Cloud-Native Architecture split
- Added `bg_class: "bg-white"` to AI & Automation split
- Updated body copy on both splits to match reference text exactly

### F17. CTA section — button, title, body, and padding overhaul

**Files:** `frontend/styles/kotai.css`, `src/_components/cta_section.liquid`

The CTA section used Bulma `button is-white is-outlined is-medium` for the call-to-action button, `title has-text-white` on the heading, and `subtitle has-text-white-ter mt-3 mb-5` on the body. The reference uses a custom `.btn-cta` button with white background, slate text, fixed padding, and a lift+shadow hover. Title and body are unstyled elements targeted by `.cta-content h2/p`.

#### Markup changes (`cta_section.liquid`)

- Removed `section` Bulma base class, `has-text-centered`, `has-text-white` from `<section>`
- `<h2 class="title has-text-white">` → `<h2>`
- `<p class="subtitle has-text-white-ter mt-3 mb-5">` → `<p>`
- `<a class="button is-white is-outlined is-medium">` → `<a class="btn btn-cta">`
- Icon wrapper: `<div class="mb-4">` with inline `style` → `<div class="cta-crown">` (no inline style)

Same changes applied to the inline Fractional CTA in `src/_components/hero.liquid` (line 114).

#### CSS additions (`kotai.css`)

```css
.cta-section { padding: 5rem 0; text-align: center; }
@media (min-width: 640px) { .cta-section { padding: 6rem 0; } }
@media (min-width: 1024px) { .cta-section { padding: 8rem 0; } }

.cta-content { max-width: 56rem; margin: 0 auto; padding: 0 1rem; }
@media (min-width: 640px) { .cta-content { padding: 0 1.5rem; } }
@media (min-width: 1024px) { .cta-content { padding: 0 3rem; } }

.cta-crown { margin-bottom: 1.5rem; }
.cta-crown i, .cta-crown svg { width: 3rem; height: 3rem; color: rgba(255,255,255,0.9); display: inline-block; }
@media (min-width: 768px) { .cta-crown i, .cta-crown svg { width: 4rem; height: 4rem; } }

.cta-content h2 { font-size: 1.875rem; font-weight: 700; font-family: var(--font-serif); margin-bottom: 1rem; color: white; }
@media (min-width: 640px) { .cta-content h2 { font-size: 2.25rem; margin-bottom: 1.5rem; } }
@media (min-width: 768px) { .cta-content h2 { font-size: 3rem; } }
@media (min-width: 1024px) { .cta-content h2 { font-size: 3.75rem; } }

.cta-content p { font-size: 1rem; margin-bottom: 2rem; color: rgba(255,255,255,0.9); font-family: var(--font-sans); font-weight: 400; }
@media (min-width: 768px) { .cta-content p { font-size: 1.125rem; } }
@media (min-width: 640px) { .cta-content p { margin-bottom: 2.5rem; } }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 500; border-radius: 0.75rem; transition: all 0.3s; font-size: 1rem; font-family: var(--font-sans); text-decoration: none; }

.btn-cta { padding: 1rem 2.5rem; background: white; color: var(--kotai-slate); font-size: 1.125rem; font-weight: 500; border: none; }
.btn-cta:hover { background: rgba(255,255,255,0.9); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); transform: translateY(-4px); color: var(--kotai-slate); }
@media (min-width: 640px) { .btn-cta { padding: 1.25rem 2.5rem; } }
```

### F18. Hero CTA buttons — replace Bulma button system with reference button classes

**Files:** `frontend/styles/hero.css`, `src/_components/hero.liquid`

The hero used Bulma `buttons is-centered mb-6` as the button group container and `button is-dark is-medium` / `button is-light is-medium` for primary/secondary buttons. These were overridden with hacky Bulma-specific rules in `hero.css`. The reference uses a `.hero-cta-group` flex container and dedicated `.btn-primary-digital` / `.btn-secondary-digital` / `.btn-primary-fractional` / `.btn-secondary-fractional` classes.

#### Markup changes (`hero.liquid`)

Digital hero:
- `<div class="buttons is-centered mb-6">` → `<div class="hero-cta-group">`
- `<a class="button is-dark is-medium">` → `<a class="btn btn-primary-digital">`
- `<a class="button is-light is-medium">` → `<a class="btn btn-secondary-digital">`

Fractional hero:
- `<div class="buttons is-centered mb-6">` → `<div class="hero-cta-group">`
- `<a class="button is-dark is-medium">` → `<a class="btn btn-primary-fractional">`
- `<a class="button is-light is-medium">` → `<a class="btn btn-secondary-fractional">`

Removed `&nbsp;` spacers and inline `style` from icon elements; replaced with `class="btn-icon"`.

#### CSS (`hero.css` — full rewrite)

Removed all Bulma override rules. Added:

```css
.hero-cta-group {
  display: flex; flex-direction: column; gap: 1rem;
  justify-content: center; align-items: center;
  width: 100%; max-width: 24rem; margin: 0 auto; padding: 0 1rem;
}
@media (min-width: 640px) { .hero-cta-group { flex-direction: row; flex-wrap: wrap; max-width: none; } }

.btn-primary-digital { width: 100%; height: 3.5rem; padding: 0 2rem; background: white; color: var(--kotai-slate); border: none; }
.btn-primary-digital:hover { background: var(--kotai-peach); color: var(--kotai-charcoal); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); transform: translateY(-2px); }

.btn-secondary-digital { width: 100%; height: 3.5rem; padding: 0 2rem; background: rgba(255,255,255,0.1); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.2); color: white; }
.btn-secondary-digital:hover { background: rgba(255,255,255,0.2); color: white; }

.btn-primary-fractional { width: 100%; height: 3.5rem; padding: 0 2rem; background: white; color: var(--kotai-charcoal); border: none; }
.btn-primary-fractional:hover { background: rgba(255,255,255,0.9); color: var(--kotai-charcoal); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); transform: translateY(-2px); }

.btn-secondary-fractional { width: 100%; height: 3.5rem; padding: 0 2rem; background: rgba(255,255,255,0.1); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.2); color: white; }
.btn-secondary-fractional:hover { background: rgba(255,255,255,0.2); color: white; }

@media (min-width: 640px) {
  .btn-primary-digital, .btn-secondary-digital,
  .btn-primary-fractional, .btn-secondary-fractional { width: auto; }
}
```

### F19. Footer — full markup and CSS overhaul

**Files:** `frontend/styles/kotai.css`, `src/_components/footer.liquid`

The footer used Bulma's `<footer class="footer">` with Bulma `columns`/`column is-one-third` for the grid, `<p class="title is-6">` for column headings, inline `style` on logo and icons, a `<hr>` divider, and Bulma `is-flex is-justify-content-space-between` for the bottom bar. The old `kotai.css` footer block targeted `.footer` (Bulma's class). The reference uses a fully custom layout under `.site-footer` with CSS Grid, semantic classes throughout, and a border-top divider.

#### Markup changes (`footer.liquid`)

- `<footer class="footer">` → `<footer class="site-footer">`
- `<div class="container">` → `<div class="footer-container">`
- Bulma `columns` / `column is-one-third` → `<div class="footer-grid">`
- Brand column: added `.footer-brand`, `.footer-logo-btn`, `.footer-logo` class (removed inline `style`), `.footer-tagline`, `.footer-contact-info` / `.footer-contact-item` / `.footer-icon` (removed inline styles)
- Column headings: `<p class="title is-6">` → `<h4>` (styled by `.footer-col h4`)
- LinkedIn link: added `class="footer-linkedin"`
- Removed `<hr>` and Bulma flex utilities; replaced with `<div class="footer-bottom">`
- Privacy/Terms links wrapped in `<div class="footer-links">`

#### CSS changes (`kotai.css`)

Replaced entire old `.footer` block (`.footer`, `.footer .title`, `.footer p/a/li`, `.footer ul`, `.footer hr`, `.footer-bottom`, `.footer-accent`) with the full reference footer system:

```css
.site-footer { position: relative; background: var(--kotai-charcoal); color: white; padding: 3rem 0; overflow: hidden; }
@media (min-width: 640px) { .site-footer { padding: 4rem 0; } }

.footer-accent { position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(to right, var(--kotai-peach), var(--kotai-slate), var(--kotai-peach)); }

.footer-pattern { position: absolute; inset: 0; opacity: 0.03; background-image: linear-gradient(var(--kotai-peach) 1px, transparent 1px), linear-gradient(90deg, var(--kotai-peach) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; }

.footer-container { max-width: 1280px; margin: 0 auto; padding: 0 1rem; position: relative; z-index: 10; }
@media (min-width: 640px) { .footer-container { padding: 0 1.5rem; } }
@media (min-width: 1024px) { .footer-container { padding: 0 3rem; } }

.footer-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; margin-bottom: 2.5rem; }
@media (min-width: 640px) { .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 2.5rem; margin-bottom: 3rem; } }
@media (min-width: 1024px) { .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; } }

/* .footer-brand spans 2 cols on tablet, 1 on desktop */
@media (min-width: 640px) { .footer-brand { grid-column: span 2; } }
@media (min-width: 1024px) { .footer-brand { grid-column: span 1; } }

.footer-logo { height: 1.5rem; width: auto; filter: brightness(0) invert(1); transition: transform 0.3s; }
@media (min-width: 640px) { .footer-logo { height: 2rem; } }

.footer-tagline { font-size: 0.875rem; color: #9ca3af; margin-bottom: 1rem; }
.footer-contact-info { display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem; color: #9ca3af; }
.footer-contact-item { display: flex; align-items: center; gap: 0.5rem; }
.footer-icon { width: 0.75rem; height: 0.75rem; color: var(--kotai-peach); flex-shrink: 0; }

.footer-col h4 { font-size: 0.875rem; color: var(--kotai-peach); font-weight: 500; font-family: var(--font-serif); margin-bottom: 0.75rem; }
.footer-col ul { display: flex; flex-direction: column; gap: 0.5rem; list-style: none; margin: 0; padding: 0; font-size: 0.875rem; color: #9ca3af; }
.footer-col a { color: #9ca3af; transition: all 0.3s; display: inline-block; text-decoration: none; }
.footer-col a:hover { color: white; transform: translateX(8px); }

.footer-linkedin { display: flex !important; align-items: center; gap: 0.5rem; }

.footer-bottom { padding-top: 1.5rem; border-top: 1px solid rgba(107,114,128,0.5); display: flex; flex-direction: column; align-items: center; gap: 0.75rem; font-size: 0.875rem; color: #9ca3af; }
@media (min-width: 768px) { .footer-bottom { flex-direction: row; justify-content: space-between; } }

.footer-links { display: flex; gap: 1rem; }
.footer-links a { color: #9ca3af; text-decoration: none; position: relative; transition: color 0.3s; }
.footer-links a:hover { color: white; }
.footer-links a::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: var(--kotai-peach); transition: width 0.3s; }
.footer-links a:hover::after { width: 100%; }
```

### F20. Partners section — real brand SVGs and reference layout

**Files:** `frontend/styles/kotai.css`, `src/_components/partners.liquid`

The partners section used Bulma `<section class="section">` with inline `style="background:var(--kotai-off-white);"`, Bulma `columns is-vcentered is-multiline is-mobile is-centered` for the logo row, and `column is-narrow has-text-centered partner-logo` with inline `style="padding:1rem 1.5rem;"` per logo. Logos were placeholder text SVGs (AWS, Microsoft, Google, Salesforce, Snowflake, Databricks). The reference uses a `.partners-section` container, a `.partners-logos` flex row, and real brand SVGs at 56px → 3rem/3.5rem responsive size.

#### Markup changes (`partners.liquid`)

- `<section class="section" style="background:...">` → `<section class="partners-section">`
- `<div class="columns is-vcentered is-multiline is-mobile is-centered">` → `<div class="partners-logos">`
- `<div class="column is-narrow has-text-centered partner-logo" style="padding:...">` → `<div class="partner-logo" title="...">`
- Replaced 6 text-only placeholder SVGs with 8 real brand SVGs: **AWS** (#FF9900), **Google Cloud** (#4285F4), **Microsoft Azure** (#0089D6), **MongoDB** (#47A248), **Docker** (#2496ED), **PostgreSQL** (#4169E1), **TensorFlow** (#FF6F00), **OpenAI** (#412991)

#### CSS changes (`kotai.css`)

Replaced minimal `.partner-logo { opacity: 0.5; transition: opacity 0.2s; }` with full reference block:

```css
.partners-section { padding: 2.5rem 0; background: var(--kotai-off-white); }
@media (min-width: 640px) { .partners-section { padding: 3rem 0; } }
@media (min-width: 1024px) { .partners-section { padding: 4rem 0; } }

.partners-logos { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 1.5rem; }
@media (min-width: 1024px) { .partners-logos { gap: 2.5rem; } }

.partner-logo { display: flex; align-items: center; justify-content: center; opacity: 0.6; transition: all 0.3s; cursor: pointer; }
.partner-logo:hover { opacity: 1; transform: scale(1.1); }
.partner-logo svg { width: 3rem; height: 3rem; }
@media (min-width: 640px) { .partner-logo svg { width: 3.5rem; height: 3.5rem; } }
```

---

## Out of Scope

- Removing Bulma — the spec explicitly retains it as the layout/component foundation.
- Profile cards floating animation (`float1/2/3` keyframes) — these require markup additions to the hero component that are beyond CSS-only changes.
- Custom scrollbar styling — browser-specific and low priority.
- `::selection` highlight — not in current `kotai.css` and low priority.
- TildaSans font files in `frontend/fonts/` — unused; can remain on disk.
