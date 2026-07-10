# Coding Spec: Case Studies Feature

## Feature Branch
`case-studies`

## Overview

Add a **Case Studies** section to the KotaiTeam website. This introduces:
1. A new "Case Studies" menu item in the navbar (desktop and mobile), positioned between "Services" and "About Us".
2. A **Case Studies index page** (`/case-studies/`) listing all case studies as cards.
3. **Individual case study detail pages** (e.g. `/case-studies/ablefinder/`) — one per case study.
4. All content stored as YAML data files under `src/_data/casestudies/`.
5. A new `casestudy` Liquid layout and reusable components following the existing Kotai design system.

---

## Source Material

Eight case studies are sourced from `.tmp/kotai-casestudies/`:

| Slug | Title |
|------|-------|
| `ablefinder` | AbleFinder |
| `buildchain` | BuildChain |
| `elfi` | ElFi |
| `faastaa` | Faastaa |
| `fundpro` | FundPro |
| `rocket` | Rocket |
| `tribe2home` | Tribe2Home |
| `tummily` | Tummily |

Each case study has a corresponding image folder (e.g. `.tmp/kotai-casestudies/ablefinder/`) with: `hero`, `context`, `objectives`, `features`, `solution`, `results`, `agile-execution`.

---

## Color Theme

The case study pages use the existing Kotai design system colors — no new colors are introduced:

| Variable | Value | Usage |
|----------|-------|-------|
| `--kotai-charcoal` | `#333333` | Body text, dark cards |
| `--kotai-slate` | `#767FA6` | Muted text, borders, accents |
| `--kotai-peach` | `#FFCBB5` | Stat highlights, bullet markers, CTA accents |
| `--kotai-peach-dark` | `#FFB89F` | Gradient end, hover states |
| `--kotai-off-white` | `#FAFAFA` | Alternate section backgrounds |
| `--kotai-white` | `#ffffff` | Primary section backgrounds |
| `--kotai-border` | `rgba(51,51,51,0.1)` | Card and section borders |
| Slate bg tint | `rgba(118,127,166,0.06)` | Alternating section backgrounds |

Hero gradient: `linear-gradient(135deg, #767FA6 0%, #8A94B8 50%, #767FA6 100%)` — matches existing site hero pattern.

---

## Data Architecture

### `src/_data/casestudies/index.yml`

Top-level index listing all case studies for the index page and navbar dropdown.

```yaml
- slug: ablefinder
  title: AbleFinder
  industry: Disability Services / NDIS
  tagline: AI-powered NDIS support matching platform
  image_ext: jpg   # hero image extension
  tags:
    - NDIS Support Matching
    - AI Smart Provider Discovery
    - Community Trust & Reviews
  stats:
    - value: "60%"
      label: Faster provider discovery
    - value: "45%"
      label: Improved trust in provider selection
    - value: "35%"
      label: Reduced manual coordination effort
# ... one entry per case study
```

### `src/_data/casestudies/<slug>.yml`

One YAML file per case study containing the full page content.

```yaml
title: AbleFinder
slug: ablefinder
image_ext: jpg
industry: Disability Services / NDIS
tagline: AI-powered NDIS support matching platform

tags:
  - label: "NDIS Support Matching"
    style: secondary   # secondary = white/outline pill
  - label: "AI Smart Provider Discovery"
    style: primary     # primary = peach pill
  - label: "Community Trust & Reviews"
    style: secondary

hero_stats:
  - value: "60%"
    label: Faster provider discovery.
  - value: "45%"
    label: Improved trust in provider selection.
  - value: "35%"
    label: Reduced manual coordination effort.

overview: >-
  AbleFinder is an NDIS support connection platform ...

business_problems:
  - Participants often struggle to find trusted NDIS providers ...
  - Support discovery can be fragmented, manual ...
  # ...

objectives_intro: >-
  Creating a trusted, participant-led NDIS support network ...

objectives:
  - Improve speed and accuracy of provider matching.
  # ...

ai_functionality:
  - AI smart matching connects participant requests ...
  # ...

impact_of_challenges:
  - Turns informal word-of-mouth referrals into a structured digital trust network.
  # ...

solution_intro: ""   # optional additional text above list
solution_items:
  - Developed a participant-led request and provider response platform.
  # ...

tech_tags:
  - NDIS Platform
  - AI Matching
  - Secure Chat
  - Trust Score

customizations:
  - Values-based filters for LGBTQIA+ inclusivity ...
  # ...

implementation_phases:
  - label: Phase 1
    description: NDIS community research, participant needs mapping, and request flow design.
  - label: Phase 2
    description: Provider onboarding, profile setup, service categorization ...
  - label: Phase 3
    description: AI smart matching, values-based filters, trust score ...
  - label: Phase 4
    description: NSW launch, waiting list expansion ...

execution_intro: >-
  The platform was designed around community trust ...

quantitative_results:
  - value: "60%"
    label: Faster discovery of suitable NDIS support providers.
  - value: "45%"
    label: Improved confidence through trust scores, reviews, and endorsements.
  - value: "35%"
    label: Reduced coordination effort through request-based matching and secure chat.

qualitative_results:
  - Participants can search for support based on real personal needs.
  - Providers gain visibility through reputation, quality badges, and community endorsements.
  # ...
```

---

## Pages

### Case Studies Index: `src/case-studies.md`

```yaml
---
layout: casestudies_index
title: Case Studies
page_id: casestudies
permalink: /case-studies/
---
```

The layout renders a page hero and a grid of case study cards, linking to each individual page.

### Individual Case Study Pages

Generated from `src/_casestudies/<slug>.md` (Bridgetown collection), or alternatively one markdown file per case study:

```
src/_casestudies/ablefinder.md
src/_casestudies/buildchain.md
...
```

Each with front matter:

```yaml
---
layout: casestudy
title: AbleFinder
slug: ablefinder
page_id: casestudies
permalink: /case-studies/ablefinder/
---
```

The `casestudy` layout loads the corresponding `site.data.casestudies.<slug>` YAML and renders all sections.

> **Alternative**: If Bridgetown collections add complexity, use a simpler pattern — individual `src/case-studies/ablefinder.md` pages with layout `casestudy`.

---

## Layouts

### `src/_layouts/casestudies_index.liquid`

```
layout: default
---
{% render "page_hero", ... %}
{% render "casestudies_grid", casestudies: site.data.casestudies_index %}
{% render "cta_section", ... %}
```

### `src/_layouts/casestudy.liquid`

```
layout: default
---
{% assign cs = site.data.casestudies[page.slug] %}
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
{% render "cta_section", ... %}
```

---

## Components

All new components live in `src/_components/` and follow Liquid + existing CSS conventions.

| Component | Purpose |
|-----------|---------|
| `casestudies_grid.liquid` | Index page — grid of case study cards |
| `casestudy_hero.liquid` | Hero section with gradient bg, title, tags, stats, hero image |
| `casestudy_overview.liquid` | Centered project overview paragraph |
| `casestudy_context.liquid` | Business context: image + problem list (alternating bg) |
| `casestudy_objectives.liquid` | Objectives: text + image |
| `casestudy_ai_impact.liquid` | AI Functionality card + Impact of Challenges dark card |
| `casestudy_solution.liquid` | Proposed solution: text + image + tech tags |
| `casestudy_customizations.liquid` | Customizations: image + bullet list |
| `casestudy_implementation.liquid` | 4-phase implementation grid |
| `casestudy_execution.liquid` | Execution paragraph + agile-execution image |
| `casestudy_results.liquid` | Quantitative stats grid + Qualitative results dark card |

---

## CSS

A new file `frontend/styles/casestudies.css` is created and imported in `frontend/styles/index.css`.

This file defines:
- `.cs-hero` — hero gradient section
- `.cs-two-col`, `.cs-two-col-12-5`, `.cs-two-col-7-5` — responsive grid variants
- `.cs-phases-grid` — 4-column phase grid
- `.cs-quant-grid`, `.cs-qual-grid`, `.cs-ai-grid` — results grids
- `.cs-stat-val`, `.cs-quant-val` — stat value typography (Sora bold)
- `.cs-tag-pill` — hero tag pills
- `.cs-tech-tag` — tech stack tags
- `.cs-phase-card` — phase implementation card
- `.cs-qual-dot` — qualitative result bullet dot (peach)
- Responsive breakpoints: collapse to single column at ≤1024px, further simplify at ≤640px
- All values reference `--kotai-*` CSS variables from `kotai.css`

No inline styles are used in Liquid templates — all styling moves to the CSS file.

---

## Images

Images are copied from `.tmp/kotai-casestudies/<slug>/` to `src/images/casestudies/<slug>/`:

```
src/images/casestudies/
  ablefinder/hero.jpg
  ablefinder/context.jpg
  ablefinder/objectives.jpg
  ablefinder/features.jpg
  ablefinder/solution.jpg
  ablefinder/results.jpg
  ablefinder/agile-execution.png
  buildchain/... (same pattern, .png)
  ...
```

Image paths in YAML are referenced as `/images/casestudies/<slug>/<filename>`.

---

## Navbar Changes

`src/_components/navbar.liquid` — add "Case Studies" link between "Services" and "About Us" in both desktop and mobile nav:

```liquid
<a href="{{ '/case-studies/' | relative_url }}" class="nav-link{% if page_id == 'casestudies' %} active{% endif %}">
  Case Studies<span class="nav-underline"></span>
</a>
```

Same pattern for `mobile-nav-link`.

---

## Permalink Structure

```
/case-studies/              → index listing all case studies
/case-studies/ablefinder/   → AbleFinder detail page
/case-studies/buildchain/   → BuildChain detail page
/case-studies/elfi/         → ElFi detail page
/case-studies/faastaa/      → Faastaa detail page
/case-studies/fundpro/      → FundPro detail page
/case-studies/rocket/       → Rocket detail page
/case-studies/tribe2home/   → Tribe2Home detail page
/case-studies/tummily/      → Tummily detail page
```

---

## Constraints

- No Tailwind, no external CSS frameworks beyond what already exists (Bulma + Kotai custom CSS).
- No JavaScript beyond what the existing site already uses.
- All fonts (`Sora`, `DM Sans`) are already loaded by the site — no new font imports.
- The CTA section at the bottom of each case study reuses the existing `cta_section` component.
- The contact form on each case study uses the existing `contact_form` component or the site's Formspree endpoint.
