# Implementation Plan: Case Studies Feature

## Feature Branch
`case-studies`

## Prerequisites
- Branch `case-studies` checked out from `main`
- `CODING-SPEC-casestudies.md` reviewed and approved

---

## Phase 0 — Setup

### Step 0.1 — Create directory structure

```
src/_data/casestudies/         ← per-slug YAML content files
src/_casestudies/              ← markdown stubs for individual pages
src/images/casestudies/        ← case study images (copied from .tmp)
features/casestudies/          ← spec docs (already done)
```

### Step 0.2 — Copy images

Copy all images from `.tmp/kotai-casestudies/<slug>/` into `src/images/casestudies/<slug>/` for all 8 case studies. Preserve filenames and extensions (some are `.jpg`, some `.png`).

---

## Phase 1 — Data Layer

### Step 1.1 — Create `src/_data/casestudies/index.yml`

Defines the list of all case studies for the index page and navbar. Fields per entry:
- `slug`, `title`, `industry`, `tagline`, `image_ext`
- `tags[]` (display tags for the card)
- `stats[]` with `value` and `label` (3 hero stats)

Entries (8 total):
1. `ablefinder` — AbleFinder — Disability Services / NDIS
2. `buildchain` — BuildChain — Construction Technology
3. `elfi` — ElFi — (to be confirmed from HTML)
4. `faastaa` — Faastaa — Home Services Marketplace
5. `fundpro` — FundPro — (to be confirmed from HTML)
6. `rocket` — Rocket — (to be confirmed from HTML)
7. `tribe2home` — Tribe2Home — (to be confirmed from HTML)
8. `tummily` — Tummily — (to be confirmed from HTML)

### Step 1.2 — Create individual YAML files

Create one file per case study: `src/_data/casestudies/<slug>.yml`

Each file contains the full page content as structured YAML (see CODING-SPEC for schema). Extract all content from the corresponding `.tmp/kotai-casestudies/<slug>.html` file.

Files to create:
- `src/_data/casestudies/ablefinder.yml`
- `src/_data/casestudies/buildchain.yml`
- `src/_data/casestudies/elfi.yml`
- `src/_data/casestudies/faastaa.yml`
- `src/_data/casestudies/fundpro.yml`
- `src/_data/casestudies/rocket.yml`
- `src/_data/casestudies/tribe2home.yml`
- `src/_data/casestudies/tummily.yml`

**Note on data access in Bridgetown**: Files nested under `src/_data/casestudies/` are accessible as `site.data.casestudies.<slug>` (Bridgetown auto-nests by folder). The index file at `src/_data/casestudies/index.yml` is accessible as `site.data.casestudies.index`.

---

## Phase 2 — CSS

### Step 2.1 — Create `frontend/styles/casestudies.css`

Define all layout and visual classes for case study pages:

- Section wrappers: `.cs-section-white`, `.cs-section-tint`
- Grid layouts: `.cs-two-col`, `.cs-two-col-12-5`, `.cs-two-col-7-5`
- Phase grid: `.cs-phases-grid`
- Results grids: `.cs-quant-grid`, `.cs-qual-grid`, `.cs-ai-grid`
- Hero: `.cs-hero`, `.cs-hero-stats`
- Typography: `.cs-h1`, `.cs-h2`, `.cs-h3`, `.cs-stat-val`, `.cs-quant-val`, `.cs-body`, `.cs-sm`
- Pill tags: `.cs-tag-pill`, `.cs-tag-pill--primary`, `.cs-tag-pill--secondary`
- Tech tags: `.cs-tech-tag`
- Cards: `.cs-phase-card`, `.cs-dark-card`
- Qualitative dot: `.cs-qual-dot`
- Responsive: ≤1024px collapses two-col to single, ≤640px further simplifications

All values use `--kotai-*` CSS variables. No hardcoded hex values in this file.

### Step 2.2 — Import in `frontend/styles/index.css`

Add:
```css
@import "casestudies.css";
```

---

## Phase 3 — Layouts

### Step 3.1 — Create `src/_layouts/casestudies_index.liquid`

```liquid
---
layout: default
---
{% render "page_hero",
   heading: "Case Studies",
   subheading: "Real-world digital products we've built — from concept to launch." %}
{% render "casestudies_grid", casestudies: site.data.casestudies.index %}
{% render "cta_section",
   title: "Ready to Build Your Next Product?",
   body: "Let's talk about your vision.",
   button_text: "Get Started",
   button_href: "/contact/" %}
```

### Step 3.2 — Create `src/_layouts/casestudy.liquid`

```liquid
---
layout: default
---
{% assign cs = site.data.casestudies[page.data.slug] %}
{% render "casestudy_hero", cs: cs %}
{% render "casestudy_overview", cs: cs %}
{% render "casestudy_context", cs: cs %}
{% render "casestudy_objectives", cs: cs %}
{% render "casestudy_ai_impact", cs: cs %}
{% render "casestudy_solution", cs: cs %}
{% render "casestudy_customizations", cs: cs %}
{% render "casestudy_implementation", cs: cs %}
{% render "casestudy_execution", cs: cs %}
{% render "casestudy_results", cs: cs %}
{% render "cta_section",
   title: "Need to Accelerate Your Next Digital Product?",
   body: "From concept to launch, we help teams build scalable digital products with clarity, speed, and long-term impact.",
   button_text: "Contact Us",
   button_href: "/contact/",
   highlight: "Your Next Digital Product?" %}
```

---

## Phase 4 — Components

Build one component at a time, verifying each renders correctly before proceeding.

### Step 4.1 — `src/_components/casestudies_grid.liquid`

Index page grid. Renders a card for each item in `casestudies` (from `index.yml`).

Card structure:
- Top: hero image thumbnail (`/images/casestudies/<slug>/hero.<ext>`)
- Industry badge (top-right overlay)
- Body: Title, tagline, 3 stat pills
- Footer: "View Case Study →" link to `/case-studies/<slug>/`

CSS classes: `.cs-index-grid`, `.cs-index-card`, `.cs-index-card-image`, `.cs-index-card-body`

### Step 4.2 — `src/_components/casestudy_hero.liquid`

Renders:
- Gradient hero background (`cs-hero`)
- Left: h1 title, tag pills, 3 stat cards (`cs-hero-stats`)
- Right: hero image

Tag pills: `cs-tag-pill--primary` for the highlighted (peach) tag, `cs-tag-pill--secondary` for outline tags.

### Step 4.3 — `src/_components/casestudy_overview.liquid`

Centered section (white bg) with:
- h2 "Project Overview"
- Paragraph (`cs.overview`)

### Step 4.4 — `src/_components/casestudy_context.liquid`

Tinted section bg. Two-column (12:5 ratio, image left, text right):
- Left: context image
- Right: h3 "Specific Business Problems" + bullet list (`cs.business_problems`)

### Step 4.5 — `src/_components/casestudy_objectives.liquid`

White bg. Two-column (7:5, text left, image right):
- Left: h2 "Objectives", intro para, h3 "Specific Goals & KPIs", bullet list
- Right: objectives image (on mobile, image appears first via CSS order)

### Step 4.6 — `src/_components/casestudy_ai_impact.liquid`

Tinted bg. Two-column equal grid:
- Left card (white): "AI Functionality" list
- Right card (charcoal/dark): "Impact of Challenges" list (white text, peach bullet markers)

### Step 4.7 — `src/_components/casestudy_solution.liquid`

White bg. Two-column:
- Left: h2 "Proposed Solution", bullet list, tech tag pills
- Right: solution image

### Step 4.8 — `src/_components/casestudy_customizations.liquid`

Tinted bg. Two-column:
- Left: features image
- Right: h2 "Customizations", bullet list

### Step 4.9 — `src/_components/casestudy_implementation.liquid`

White bg. Centered h2 "Implementation", sub-heading "Process Overview", 4-column phase grid:
- Each phase: phase label (e.g. "Phase 1") + white card with description text
- Responsive: 2 columns at ≤1024px, 1 column at ≤640px

### Step 4.10 — `src/_components/casestudy_execution.liquid`

Tinted bg. Centered:
- h2 "Execution"
- Intro paragraph
- `agile-execution` image (full width, max-height 480px, object-fit contain)

### Step 4.11 — `src/_components/casestudy_results.liquid`

White bg:
- h2 "Results"
- Quantitative grid (3-col): large stat value + description (slate text)
- Qualitative dark card (charcoal bg): h3 "Qualitative Results" + 3-col grid of items with peach dot bullet

---

## Phase 5 — Pages

### Step 5.1 — Create Case Studies Index Page

`src/case-studies.md`:

```yaml
---
layout: casestudies_index
title: Case Studies
page_id: casestudies
permalink: /case-studies/
---
```

### Step 5.2 — Create Individual Case Study Pages

Eight pages under `src/case-studies/`:

```
src/case-studies/ablefinder.md
src/case-studies/buildchain.md
src/case-studies/elfi.md
src/case-studies/faastaa.md
src/case-studies/fundpro.md
src/case-studies/rocket.md
src/case-studies/tribe2home.md
src/case-studies/tummily.md
```

Each file:
```yaml
---
layout: casestudy
title: AbleFinder          # varies per slug
slug: ablefinder           # varies per slug
page_id: casestudies
permalink: /case-studies/ablefinder/
---
```

---

## Phase 6 — Navbar

### Step 6.1 — Update `src/_components/navbar.liquid`

**Desktop nav** — add after the Services link:
```liquid
<a href="{{ '/case-studies/' | relative_url }}" class="nav-link{% if page_id == 'casestudies' %} active{% endif %}">
  Case Studies<span class="nav-underline"></span>
</a>
```

**Mobile nav** — add after the Services link:
```liquid
<a href="{{ '/case-studies/' | relative_url }}" class="mobile-nav-link{% if page_id == 'casestudies' %} active{% endif %}">Case Studies</a>
```

---

## Phase 7 — Verification

### Step 7.1 — Dev server smoke test

```bash
bin/bridgetown start
```

Check:
- [ ] Navbar shows "Case Studies" between "Services" and "About Us" on desktop
- [ ] Navbar shows "Case Studies" in mobile menu
- [ ] `/case-studies/` renders index with 8 cards
- [ ] Each card links correctly to its detail page
- [ ] All 8 detail pages render without Liquid errors
- [ ] Hero gradient matches site hero gradient
- [ ] Hero stats display in peach color
- [ ] Alternating section backgrounds (white / slate-tint) render correctly
- [ ] Dark card (charcoal) with white text renders in AI Impact and Qualitative Results sections
- [ ] Phase grid shows 4 columns on desktop, 2 on tablet, 1 on mobile
- [ ] Images load from `/images/casestudies/<slug>/` paths
- [ ] Tech tags render in each solution section
- [ ] "Back to Case Studies" link works on detail pages
- [ ] `page_id: casestudies` highlights "Case Studies" nav link as active on all case study pages
- [ ] CTA section at bottom matches existing site CTA section style
- [ ] Mobile layout: single column sections, readable typography

### Step 7.2 — Production build test

```bash
rake deploy
```

Verify no build errors and output files exist at expected paths.

---

## File Inventory (New Files)

```
features/casestudies/CODING-SPEC-casestudies.md           ✓ done
features/casestudies/IMPLEMENTATION-PLAN-casestudies.md   ✓ done

src/_data/casestudies/index.yml
src/_data/casestudies/ablefinder.yml
src/_data/casestudies/buildchain.yml
src/_data/casestudies/elfi.yml
src/_data/casestudies/faastaa.yml
src/_data/casestudies/fundpro.yml
src/_data/casestudies/rocket.yml
src/_data/casestudies/tribe2home.yml
src/_data/casestudies/tummily.yml

src/_layouts/casestudies_index.liquid
src/_layouts/casestudy.liquid

src/_components/casestudies_grid.liquid
src/_components/casestudy_hero.liquid
src/_components/casestudy_overview.liquid
src/_components/casestudy_context.liquid
src/_components/casestudy_objectives.liquid
src/_components/casestudy_ai_impact.liquid
src/_components/casestudy_solution.liquid
src/_components/casestudy_customizations.liquid
src/_components/casestudy_implementation.liquid
src/_components/casestudy_execution.liquid
src/_components/casestudy_results.liquid

frontend/styles/casestudies.css

src/case-studies.md
src/case-studies/ablefinder.md
src/case-studies/buildchain.md
src/case-studies/elfi.md
src/case-studies/faastaa.md
src/case-studies/fundpro.md
src/case-studies/rocket.md
src/case-studies/tribe2home.md
src/case-studies/tummily.md

src/images/casestudies/ablefinder/  (7 images)
src/images/casestudies/buildchain/  (7 images)
src/images/casestudies/elfi/        (7 images)
src/images/casestudies/faastaa/     (7 images)
src/images/casestudies/fundpro/     (7 images)
src/images/casestudies/rocket/      (7 images)
src/images/casestudies/tribe2home/  (7 images)
src/images/casestudies/tummily/     (7 images)
```

## Files Modified

```
src/_components/navbar.liquid         → add Case Studies links (desktop + mobile)
frontend/styles/index.css             → import casestudies.css
```

---

## Decisions

1. **Bridgetown data nesting**: First attempt will use the nested path `site.data.casestudies.ablefinder` (files at `src/_data/casestudies/ablefinder.yml`). If Bridgetown does not support nested data folder access, fall back to flat files with a prefix: `src/_data/casestudies_ablefinder.yml` accessed as `site.data.casestudies_ablefinder`.

2. **CTA form**: Use the existing `cta_section` component with a "Contact Us" button linking to `/contact/`. No inline form is added to case study pages.

3. **Index image for cards**: Use the `hero` image as the card thumbnail on the index page. ✓ Confirmed appropriate for all 8 case studies.

4. **Results images**: Omit the `results` image. The results section renders stat numbers (quantitative grid) and qualitative text only — no image.
