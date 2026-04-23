# SPEC: Incorporate New Design into Bridgetown Site

**Source:** `.tmp/kotai-html-website/`
**Target:** Bridgetown site at project root

---

## Overview

The new design (`kotai-html-website`) is a fully-realized static HTML/CSS/JS prototype with four pages (Home, Services, About, Contact) and a Digital/Fractional mode-switching concept. This spec maps every piece of that design to concrete Bridgetown artifacts, preserving all existing patterns (Liquid components, layouts, YAML data, esbuild/PostCSS pipeline).

**CSS strategy:** Bulma remains the primary styling framework. All structural layout, spacing, typography, form controls, and card primitives are expressed using Bulma classes directly in markup. A small custom CSS layer (`kotai.css`) sits after Bulma and only covers what Bulma cannot provide: CSS custom properties (brand colors/fonts), the glassmorphism header, the Digital/Fractional toggle pill, scroll progress bar, hero background pattern, feature card accents, scroll-in animations, mobile bottom bar, and color-modifier utility classes.

---

## 1. New Site Structure vs. Current

| New HTML page | Current Bridgetown page | Action |
|---|---|---|
| `index.html` | `src/index.md` (layout: home) | Update layout + components |
| `services.html` | _does not exist_ | Create `src/services.md` |
| `about.html` | `src/about.md` (layout: page) | Replace content; create new layout |
| `contact.html` | _does not exist_ | Create `src/contact.md` |

---

## 2. Dependencies

### 2.1 Remove
- **Font Awesome** — `<script src="https://kit.fontawesome.com/1008d6c090.js">` in `src/_components/head.liquid`. Remove; Lucide replaces all icon usage.
- **Material Icons** — `<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>` in `head.liquid`. Remove; not used in the new design.
- **TildaSans fonts** — Remove `@import "fonts.css"` from `index.css` (TildaSans is replaced by Sora + DM Sans). The font files in `frontend/fonts/` can remain on disk but are unused.

### 2.2 Keep
- **Bulma CSS** — `@import "https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css"` stays as the first import in `frontend/styles/index.css`. All structural markup uses Bulma classes.

### 2.3 Add
- **Google Fonts (Sora + DM Sans)** — Add preconnect and stylesheet `<link>` tags to `head.liquid`. Sora is used for headings; DM Sans for body text. Override Bulma's default `font-family` via CSS custom properties in `kotai.css`.
- **Lucide Icons** — Install via npm (`npm install lucide`) and import in `frontend/javascript/index.js` so it bundles through esbuild. Fallback: add `<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js">` CDN tag to `head.liquid` and keep the `if (typeof lucide !== 'undefined') lucide.createIcons()` guard in JS.
- **Simple Icons Font** — `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-icons-font@v14/font/simple-icons.min.css">` in `head.liquid`. Used for partner/tech SVG logos on the home page.

### 2.4 Logo assets
Copy `.tmp/kotai-html-website/assets/icons/Compressed_Logo.svg` and `Pale_blue_logo.svg` to `src/images/icons/`. Update `site_metadata.yml` `logo` field to `icons/Compressed_Logo.svg`.

---

## 3. CSS

### 3.1 Strategy

Use Bulma classes in markup for everything Bulma covers. Write custom CSS only for the gaps. This keeps the custom stylesheet small and maintainable.

**Use Bulma for:**
- Layout structure — `container`, `section`, `columns`, `column`
- Typography — `title`, `subtitle`, `content`
- Navbar — `navbar`, `navbar-brand`, `navbar-item`, `navbar-burger`, `navbar-menu`, `navbar-end`
- Buttons — `button`, `is-dark`, `is-light`, `is-outlined`, `is-white`
- Cards — `card`, `card-content`, `card-image`
- Forms — `field`, `control`, `label`, `input`, `textarea`, `select`
- Footer — `footer`
- Helpers — `has-text-centered`, `is-flex`, `is-align-items-center`, `is-justify-content-space-between`, `p-*`, `m-*`, `is-hidden-mobile`, `is-hidden-desktop`

**Write custom CSS for (in `kotai.css`):**
- CSS custom properties (brand colors, font families)
- Font-family overrides on `body` and `h1–h4`
- Fixed glassmorphism header (`backdrop-filter`, `position: fixed`)
- Digital/Fractional toggle pill (`.toggle-container`, `.toggle-btn`, `.toggle-btn.active`)
- Mobile bottom bar (`.mobile-bottom-bar`, `.bottom-toggle-btn`)
- Scroll progress bar (`.scroll-progress`)
- Hero background grid pattern (`::before` pseudo-element), badge (`.hero-badge`), feature card accents (`.card-accent-circle`, `.card-icon-wrapper`)
- Page-panel switching (`.page { display: none }`, `.page.active { display: block }`)
- Nav underline hover animation (`.nav-underline`)
- Color modifier utilities (`.peach-bg`, `.slate-bg`, `.peach-border`, `.slate-border`, `.check-dot.peach`, `.check-dot.slate`, `.highlight-peach`)
- Scroll-in animations (`.animate-in`, `.animate-in.visible`)
- Back-to-top button (`.back-to-top`)
- Stat icon wrappers (`.stat-icon-wrapper`, `.stat-count`, `.stat-label`)
- Footer decorative elements (`.footer-accent`, `.footer-pattern`)
- Partner logo hover effects
- Dashboard image overlay (`.dashboard-overlay`)

### 3.2 File plan

| File | Content |
|---|---|
| `frontend/styles/index.css` | Entry point — imports only |
| `frontend/styles/kotai.css` | All custom CSS listed in 3.1 above |
| `frontend/styles/hero.css` | Repurposed: hero-specific overrides only (background pattern, badge, feature card accents, CTA button colors inside hero) |

`frontend/styles/syntax-highlighting.css` is unchanged.

Updated `frontend/styles/index.css`:
```css
/* Base framework */
@import "https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css";

/* Kotai brand layer — overrides and additions */
@import "kotai.css";
@import "hero.css";
@import "syntax-highlighting.css";
```

Remove `@import "fonts.css"` (TildaSans no longer used).

### 3.3 `kotai.css` — key rules

```css
/* === CUSTOM PROPERTIES === */
:root {
  --kotai-charcoal: #333333;
  --kotai-slate: #767FA6;
  --kotai-peach: #FFCBB5;
  --kotai-peach-dark: #FFB89F;
  --kotai-off-white: #FAFAFA;
  --kotai-white: #ffffff;
  --kotai-border: rgba(51, 51, 51, 0.1);
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-serif: 'Sora', system-ui, sans-serif;
}

/* === FONT OVERRIDES (on top of Bulma defaults) === */
body { font-family: var(--font-sans); background: var(--kotai-off-white); }
h1, h2, h3, h4, .title, .subtitle { font-family: var(--font-serif); }

/* === FIXED GLASSMORPHISM HEADER === */
.navbar.is-fixed-top {
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--kotai-border);
}
/* Push body content below fixed navbar */
body { padding-top: 5rem; }

/* === SCROLL PROGRESS === */
.scroll-progress { position: fixed; top: 0; left: 0; height: 4px;
  background: var(--kotai-slate); z-index: 100; width: 0%;
  transition: width 0.05s linear; }

/* === PAGE PANEL SWITCHING === */
.page { display: none; }
.page.active { display: block; }

/* === TOGGLE PILL === */
/* (Bulma has no toggle component) */
.toggle-container { display: flex; background: var(--kotai-off-white);
  border-radius: 999px; padding: 4px; gap: 4px; }
.toggle-btn { border-radius: 999px; padding: 0.4rem 1rem; font-size: 0.875rem;
  font-family: var(--font-sans); transition: all 0.2s; }
.toggle-btn.active { background: var(--kotai-charcoal); color: var(--kotai-white); }

/* === MOBILE BOTTOM BAR === */
.mobile-bottom-bar { display: none; position: fixed; bottom: 0; left: 0; right: 0;
  background: var(--kotai-white); border-top: 1px solid var(--kotai-border);
  padding: 0.5rem 1rem; z-index: 40; justify-content: center; gap: 0.5rem; }
@media (max-width: 768px) { .mobile-bottom-bar { display: flex; } }

/* === COLOR MODIFIERS === */
.peach-bg { background: var(--kotai-peach); }
.slate-bg { background: var(--kotai-slate); }
.peach-border { border-left: 4px solid var(--kotai-peach); }
.slate-border { border-left: 4px solid var(--kotai-slate); }
.highlight-peach { color: var(--kotai-charcoal); }
.check-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.check-dot.peach { background: var(--kotai-peach-dark); }
.check-dot.slate { background: var(--kotai-slate); }

/* === NAV UNDERLINE ANIMATION === */
.nav-link { position: relative; }
.nav-underline { position: absolute; bottom: -2px; left: 0; width: 0; height: 2px;
  background: var(--kotai-charcoal); transition: width 0.3s; }
.nav-link:hover .nav-underline, .nav-link.active .nav-underline { width: 100%; }

/* === SCROLL ANIMATIONS === */
.animate-in { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
.animate-in.visible { opacity: 1; transform: none; }

/* === BACK TO TOP === */
.back-to-top { position: fixed; bottom: 2rem; right: 2rem; width: 44px; height: 44px;
  border-radius: 50%; background: var(--kotai-charcoal); color: var(--kotai-white);
  display: flex; align-items: center; justify-content: center; opacity: 0;
  pointer-events: none; transition: opacity 0.3s; z-index: 40; }
.back-to-top.visible { opacity: 1; pointer-events: auto; }

/* === STAT ITEMS (no Bulma equivalent) === */
.stat-icon-wrapper { display: flex; align-items: center; justify-content: center;
  width: 48px; height: 48px; border-radius: 50%; background: var(--kotai-off-white);
  margin-bottom: 0.5rem; }
.stat-count { font-family: var(--font-serif); font-size: 1.5rem; font-weight: 700; }
.stat-label { font-size: 0.875rem; color: var(--kotai-slate); }

/* === FOOTER DECORATIVE === */
.footer-accent { height: 4px; background: var(--kotai-slate); }
.footer-pattern { /* optional dot pattern */ }
```

---

## 4. Bulma Class Mapping

This table maps every significant structural element from the new design to its Bulma equivalent used in markup.

| New design element | Bulma markup |
|---|---|
| `.container` | `<div class="container">` |
| `.section` (any content section) | `<section class="section">` |
| `.columns` / `.split-grid` | `<div class="columns">` |
| `.column.is-half` | `<div class="column is-half">` |
| `.services-grid` (4 cols) | `<div class="columns is-multiline">` + `<div class="column is-half-tablet is-one-quarter-desktop">` |
| `.fractional-roles-list` | `<div class="columns is-multiline">` each role as `<div class="column is-full">` |
| `.role-columns` | `<div class="columns">` within role card |
| `.role-info-box` | `<div class="box">` |
| `.service-card` | `<div class="card">` with `<div class="card-content">` |
| `.project-card` | `<div class="card">` with `<div class="card-image">` + `<div class="card-content">` |
| `.vm-grid` (vision/mission) | `<div class="columns">` |
| `.vm-card` | `<div class="box">` |
| `.values-grid` | `<div class="columns is-multiline">` |
| `.value-card` | `<div class="column is-half-tablet is-one-fifth-desktop">` |
| `.team-grid` | `<div class="columns is-multiline">` |
| `.team-card` | `<div class="card">` |
| `.contact-grid` | `<div class="columns">` |
| `.contact-form-wrapper` | `<div class="column">` |
| `.contact-info` | `<div class="column is-one-third">` |
| Form `<input>` | `<div class="field"><div class="control"><input class="input"></div></div>` |
| Form `<textarea>` | `<div class="field"><div class="control"><textarea class="textarea">` |
| Form `<select>` | `<div class="field"><div class="control"><div class="select is-fullwidth"><select>` |
| `.btn.btn-primary-digital` | `<a class="button is-dark">` + custom bg color via `kotai.css` |
| `.btn.btn-secondary-digital` | `<a class="button is-light">` |
| `.btn.btn-cta` | `<a class="button is-white is-outlined">` |
| `.btn.btn-submit` | `<button class="button is-dark is-fullwidth">` |
| `.section-header` | `<div class="block has-text-centered">` with Bulma `title` / `subtitle` |
| `.hero-digital` / `.hero-fractional` | `<section class="hero is-large">` + `<div class="hero-body">` |
| `.page-hero` | `<section class="hero is-medium">` + `<div class="hero-body has-text-centered">` |
| `.cta-section` | `<section class="section has-background-dark has-text-centered">` + custom bg color override |
| `.footer-grid` | Bulma `footer` > `<div class="container">` > `<div class="columns">` |
| `.footer-col` | `<div class="column">` |
| `.site-header` / `.navbar` | `<nav class="navbar is-fixed-top">` |
| `.desktop-nav` | `<div class="navbar-menu"><div class="navbar-end">` |
| `.navbar-item` links | `<a class="navbar-item nav-link">` |
| `.cta-btn` (nav) | `<a class="navbar-item button is-dark">` |
| `.mobile-menu` | `<div class="navbar-menu">` (Bulma handles mobile toggle) |
| `mobile-menu-btn` | `<a role="button" class="navbar-burger">` |
| `.stats-section` | `<section class="section">` + `<div class="columns is-vcentered has-text-centered">` |
| `.stat-item` | `<div class="column">` with custom `.stat-icon-wrapper`, `.stat-count`, `.stat-label` |
| `.partners-section` | `<section class="section">` + `<div class="columns is-vcentered is-multiline is-mobile">` |
| `.partner-logo` | `<div class="column is-narrow has-text-centered">` |
| `.projects-grid` | `<div class="columns is-multiline">` |
| `.checklist-item` | `<div class="is-flex is-align-items-center" style="gap:0.75rem">` |
| `.about-verticals` | `<div class="columns">` |
| `.vertical-card` | `<div class="column box peach-border">` (Bulma `box` + custom border modifier) |
| `.dashboard-image-wrapper` | `<div class="block" style="position:relative">` |

---

## 5. JavaScript

**File:** `frontend/javascript/index.js`

Replace the current stub with the full logic from `.tmp/kotai-html-website/script.js`, adapted for the esbuild module system:

```js
import "$styles/index.css"

// Lucide (npm install lucide)
import { createIcons, icons } from 'lucide'

document.addEventListener('DOMContentLoaded', () => {
  createIcons({ icons })
  // … remainder of script.js logic verbatim …
})
```

**Navbar mobile toggle:** The new design uses a custom `#mobileMenuBtn` / `#mobileMenu` pattern. Because we now use Bulma's `navbar-burger`, replace the custom mobile toggle logic in `script.js` with Bulma's documented burger toggle:
```js
// Bulma navbar burger toggle
document.querySelectorAll('.navbar-burger').forEach(burger => {
  burger.addEventListener('click', () => {
    const target = document.getElementById(burger.dataset.target)
    burger.classList.toggle('is-active')
    target.classList.toggle('is-active')
  })
})
```
Remove the custom `mobileMenuBtn` / `menuIconOpen` / `menuIconClose` DOM references from the ported script — Bulma's `is-active` class on `.navbar-menu` handles show/hide.

Remove `import components from "$components/**/*.{js,jsx,js.rb,css}"` — no component JS files are used.

---

## 6. `src/_data/` Updates

### 6.1 `site_metadata.yml`
Add/update the following keys:

```yaml
title: KOTAI
tagline: Building Systems. Building Leaders. Building the Future.
url: https://kotai.team
email: hello@kotai.team
logo: icons/Compressed_Logo.svg
description: >-
  KOTAI is a dual-engine growth partner combining digital engineering excellence
  with strategic executive leadership.
bookings_link: /contact
linkedin_url: https://linkedin.com/company/kotai
```

### 6.2 `services.yml`
Replace with two top-level keys — `digital` and `fractional` — to drive both the Services page and the home page toggles:

```yaml
digital:
  title: Digital Services
  subtitle: Comprehensive technology solutions designed to accelerate your digital transformation journey.
  cta_title: "Let's Build Together"
  cta_text: Discover how our technology solutions can transform your business.
  services:
    - title: Digital Transformation
      icon: code-2
      points:
        - Legacy system modernization
        - ERP/CRM integrations
        - Process digitization
        - Enterprise data strategy
        - System architecture redesign
    - title: AI Adoption & Automation
      icon: brain
      points:
        - AI workflow automation
        - Robotic Process Automation (RPA)
        - AI-powered dashboards
        - Predictive analytics
        - Internal AI copilots
    - title: Cloud Transformation
      icon: cloud
      points:
        - AWS / Azure / GCP migration
        - Infrastructure as Code
        - DevOps pipelines
        - Cloud cost optimization
        - Multi-cloud architecture
    - title: Web & Mobile Development
      icon: smartphone
      points:
        - Custom web applications
        - SaaS platforms
        - Mobile apps (iOS / Android)
        - API architecture
        - UI/UX engineering

fractional:
  title: Fractional Leadership
  subtitle: Executive expertise on-demand, tailored to your specific business needs.
  cta_title: Ready to Bring On Executive Talent?
  cta_text: Connect with our fractional executives to discuss your leadership needs.
  roles:
    - title: Fractional CTO
      icon: code-2
      responsibilities:
        - Technology strategy & roadmap
        - Architecture decisions
        - Vendor oversight
        - Engineering team leadership
        - Technical due diligence
      ideal_for: Startups and growth-stage companies needing technical leadership
      engagement: 3-6 months minimum
      kpis: Tech stack optimization, team velocity, infrastructure cost reduction
    - title: Fractional CMO
      icon: trending-up
      responsibilities:
        - Growth strategy development
        - Digital marketing architecture
        - Demand generation systems
        - Brand positioning
        - Marketing team structure
      ideal_for: Companies seeking to scale marketing operations
      engagement: 4-12 months
      kpis: Lead generation growth, CAC reduction, brand awareness metrics
    - title: Fractional COO
      icon: cog
      responsibilities:
        - Operational efficiency
        - Process structuring
        - Execution discipline
        - Cross-functional alignment
        - Scalability planning
      ideal_for: Scaling companies experiencing operational challenges
      engagement: 6-12 months
      kpis: Process efficiency, cost per unit, operational margin improvement
    - title: Fractional CPO
      icon: package
      responsibilities:
        - Product vision & strategy
        - Roadmap definition
        - Customer-centric growth
        - Product-market fit optimization
        - Feature prioritization
      ideal_for: Product-led companies refining their offering
      engagement: 3-9 months
      kpis: User engagement, retention rates, feature adoption
```

### 6.3 `src/_data/about.yml` (new)
```yaml
vision: To become the most trusted transformation partner for modern enterprises.
mission: Deliver measurable business outcomes through intelligent systems and strategic leadership.
values:
  - title: Integrity
    icon: award
    description: We build trust through transparency, honesty, and ethical practice.
  - title: Innovation
    icon: award
    description: We embrace cutting-edge technology to solve complex business challenges.
  - title: Accountability
    icon: award
    description: We take ownership of outcomes and deliver on our commitments.
  - title: Strategic Thinking
    icon: award
    description: We align technology and leadership decisions with long-term business goals.
  - title: Long-Term Partnership
    icon: award
    description: We invest in lasting relationships that grow alongside your business.
team:
  - name: Sarah Chen
    title: Co-Founder & CEO
    image: https://images.unsplash.com/photo-1758518727888-ffa196002e59?w=400&q=80
  - name: Michael Torres
    title: Chief Technology Officer
    image: https://images.unsplash.com/photo-1543132220-7bc04a0e790a?w=400&q=80
  - name: Jessica Park
    title: Chief Operating Officer
    image: https://images.unsplash.com/photo-1762341116897-921e2a52f7ff?w=400&q=80
  - name: David Richardson
    title: Head of Digital Strategy
    image: https://images.unsplash.com/photo-1769636929261-e913ed023c83?w=400&q=80
```

### 6.4 `src/_data/featured_work.yml` (new)
```yaml
- title: Enterprise Cloud Migration
  category: Cloud Transformation
  description: Migrated legacy infrastructure to AWS, reducing costs by 40% and improving performance.
  image: https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80
- title: AI-Powered Analytics Platform
  category: AI & Machine Learning
  description: Built predictive analytics dashboard processing 10M+ daily events with real-time insights.
  image: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80
- title: Global E-Commerce Platform
  category: Web Development
  description: Scalable multi-region platform handling 100K+ concurrent users with 99.99% uptime.
  image: https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80
- title: Mobile Banking App
  category: Mobile Development
  description: Secure iOS & Android app with biometric authentication serving 500K+ active users.
  image: https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80
```

---

## 7. Components

All components live in `src/_components/`. Each is a Liquid partial rendered with `{% render "component_name", ... %}`. Markup uses Bulma classes; custom classes from `kotai.css` are applied only where Bulma has no equivalent.

### 7.1 Update existing

#### `head.liquid`
- Remove: Material Icons `<link>`, Font Awesome `<script>`.
- Add: Google Fonts preconnect tags + Sora/DM Sans `<link>`.
- Add: Simple Icons CDN `<link>`.
- Add: Lucide CDN `<script>` (if not bundled via npm).
- Keep: `{% asset_path css %}`, `{% asset_path js %}`, `{% live_reload_dev_js %}`.

#### `navbar.liquid`
Complete rewrite using Bulma's `navbar` structure. Accepts: `metadata`, `resource`.

```liquid
<nav class="navbar is-fixed-top" id="siteHeader" role="navigation" aria-label="main navigation">
  <div class="container">
    <div class="navbar-brand">
      <a class="navbar-item" href="{{ '/' | relative_url }}" id="logoLink">
        <img src="{{ '/images/' | append: metadata.logo | relative_url }}" alt="KOTAI">
      </a>
      <!-- Digital/Fractional toggle (mobile: hidden, shown in mobile-bottom-bar) -->
      <div class="navbar-item is-hidden-desktop">
        <!-- toggle pill rendered here for tablet, hidden on mobile via mobile-bottom-bar -->
      </div>
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="mainNavMenu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="mainNavMenu" class="navbar-menu">
      <!-- Toggle pill (desktop center) -->
      <div class="navbar-start is-flex is-align-items-center">
        <div class="navbar-item">
          <div class="toggle-container">
            <button id="toggleDigital" class="toggle-btn active" data-mode="digital">Kotai Digital</button>
            <button id="toggleFractional" class="toggle-btn" data-mode="fractional">Kotai Fractional</button>
          </div>
        </div>
      </div>
      <!-- Nav links -->
      <div class="navbar-end">
        {% assign current = data.page_id %}
        <a href="{{ '/' | relative_url }}" class="navbar-item nav-link{% if current == 'home' %} active{% endif %}" data-page="home">
          Home <span class="nav-underline"></span>
        </a>
        <a href="{{ '/services/' | relative_url }}" class="navbar-item nav-link{% if current == 'services' %} active{% endif %}" data-page="services">
          Services <span class="nav-underline"></span>
        </a>
        <a href="{{ '/about/' | relative_url }}" class="navbar-item nav-link{% if current == 'about' %} active{% endif %}" data-page="about">
          About Us <span class="nav-underline"></span>
        </a>
        <div class="navbar-item">
          <a href="{{ '/contact/' | relative_url }}" class="button is-dark{% if current == 'contact' %} is-active{% endif %}" data-page="contact">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  </div>
</nav>
```

#### `footer.liquid`
Complete rewrite using Bulma's `footer` + `columns`. Accepts: `metadata`.

```liquid
<footer class="footer">
  <div class="footer-accent"></div>
  <div class="container">
    <div class="columns">
      <div class="column is-one-third">
        <a href="{{ '/' | relative_url }}" id="footerLogoBtn">
          <img src="{{ '/images/' | append: metadata.logo | relative_url }}" alt="KOTAI" style="max-width:120px; margin-bottom:1rem;">
        </a>
        <p class="subtitle is-6">{{ metadata.tagline }}</p>
        <p><i data-lucide="mail" style="width:16px;vertical-align:middle;"></i> <a href="mailto:{{ metadata.email }}">{{ metadata.email }}</a></p>
        <p><i data-lucide="map-pin" style="width:16px;vertical-align:middle;"></i> Global Presence</p>
      </div>
      <div class="column">
        <p class="title is-6">Kotai Digital</p>
        <ul>
          <li><a href="{{ '/services/' | relative_url }}">Digital Transformation</a></li>
          <li><a href="{{ '/services/' | relative_url }}">AI Adoption</a></li>
          <li><a href="{{ '/services/' | relative_url }}">Cloud Solutions</a></li>
          <li><a href="{{ '/services/' | relative_url }}">Development</a></li>
        </ul>
      </div>
      <div class="column">
        <p class="title is-6">Kotai Fractional</p>
        <ul>
          <li><a href="{{ '/services/' | relative_url }}">Fractional CTO</a></li>
          <li><a href="{{ '/services/' | relative_url }}">Fractional CMO</a></li>
          <li><a href="{{ '/services/' | relative_url }}">Fractional COO</a></li>
          <li><a href="{{ '/services/' | relative_url }}">Executive Leadership</a></li>
        </ul>
      </div>
      <div class="column">
        <p class="title is-6">Company</p>
        <ul>
          <li><a href="{{ '/about/' | relative_url }}">About Us</a></li>
          <li><a href="{{ '/contact/' | relative_url }}">Contact</a></li>
          <li><a href="{{ metadata.linkedin_url }}" target="_blank" rel="noopener noreferrer"><i data-lucide="linkedin" style="width:16px;vertical-align:middle;"></i> LinkedIn</a></li>
        </ul>
      </div>
    </div>
    <hr>
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <p>&copy; 2026 KOTAI. All rights reserved.</p>
      <div class="is-flex" style="gap:1rem;">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>
```

#### `hero.liquid`
Complete rewrite using Bulma's `hero`. Accepts: `metadata`. Renders dual-panel home hero.

```liquid
<div id="page-home-digital" class="page active">
  <section class="hero is-large hero-digital">
    <div class="hero-grid-pattern"></div>
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="hero-badge mb-4">
          <i data-lucide="zap" class="badge-icon"></i>
          <span>AI &amp; Robotics Innovation</span>
        </div>
        <h1 class="title is-1 highlight-peach">Powering the Future with AI &amp; Robotics</h1>
        <p class="subtitle is-4 mt-4">We transform modern enterprises through intelligent autonomous systems...</p>
        <div class="buttons is-centered mt-6">
          <a href="{{ '/contact/' | relative_url }}" class="button is-dark is-medium">
            Start Your Project <i data-lucide="arrow-right" style="margin-left:0.5rem;"></i>
          </a>
          <a href="{{ '/services/' | relative_url }}" class="button is-light is-medium">
            <i data-lucide="workflow" style="margin-right:0.5rem;"></i> View Capabilities
          </a>
        </div>
      </div>
      <!-- Feature cards -->
      <div class="container mt-6">
        <div class="columns">
          <div class="column">
            <div class="card">
              <div class="card-content">
                <div class="card-accent-circle peach-accent"></div>
                <div class="card-icon-wrapper peach-bg mb-3"><i data-lucide="brain-circuit"></i></div>
                <p class="title is-5">Cognitive Systems</p>
                <p class="subtitle is-6">Advanced machine learning models that evolve and optimize operational workflows.</p>
              </div>
            </div>
          </div>
          <!-- … repeat for Autonomous Robotics, Edge Intelligence … -->
        </div>
      </div>
    </div>
  </section>
</div>

<div id="page-home-fractional" class="page">
  <section class="hero is-large hero-fractional">
    <div class="hero-body has-text-centered">
      <div class="container">
        <!-- Fractional hero content -->
      </div>
    </div>
  </section>
</div>
```

#### `services.liquid`
Complete rewrite. Accepts: `metadata`, `services`. Uses Bulma `columns is-multiline` + `card`.

```liquid
<!-- Digital Services -->
<section id="digitalServicesContent" class="section">
  <div class="container">
    <div class="columns is-multiline">
      {% for item in services.digital.services %}
        <div class="column is-half-tablet is-one-quarter-desktop">
          <div class="card">
            <div class="card-content">
              <div class="mb-3"><i data-lucide="{{ item.icon }}" style="width:32px;height:32px;"></i></div>
              <p class="title is-5">{{ item.title }}</p>
              <ul>
                {% for point in item.points %}
                  <li class="is-flex is-align-items-center" style="gap:0.5rem; margin-bottom:0.25rem;">
                    <span class="check-dot peach"></span>{{ point }}
                  </li>
                {% endfor %}
              </ul>
            </div>
          </div>
        </div>
      {% endfor %}
    </div>
  </div>
</section>

<!-- Fractional Services -->
<section id="fractionalServicesContent" class="section" style="display:none;">
  <div class="container">
    {% for role in services.fractional.roles %}
      <div class="box mb-5">
        <div class="columns">
          <div class="column is-narrow">
            <i data-lucide="{{ role.icon }}" style="width:40px;height:40px;"></i>
          </div>
          <div class="column">
            <p class="title is-4">{{ role.title }}</p>
            <div class="columns">
              <div class="column">
                <p class="title is-6">Responsibilities</p>
                <ul>
                  {% for r in role.responsibilities %}
                    <li class="is-flex is-align-items-center" style="gap:0.5rem; margin-bottom:0.25rem;">
                      <span class="check-dot slate"></span>{{ r }}
                    </li>
                  {% endfor %}
                </ul>
              </div>
              <div class="column">
                <div class="box">
                  <p class="title is-6">Ideal For</p><p>{{ role.ideal_for }}</p>
                  <p class="title is-6 mt-3">Typical Engagement</p><p>{{ role.engagement }}</p>
                  <p class="title is-6 mt-3">KPIs Delivered</p><p>{{ role.kpis }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {% endfor %}
  </div>
</section>
```

### 7.2 New components

#### `scroll_progress.liquid`
```liquid
<div id="scrollProgress" class="scroll-progress"></div>
```

#### `mobile_bottom_bar.liquid`
```liquid
<div class="mobile-bottom-bar" id="mobileBottomBar">
  <button id="bottomToggleDigital" class="toggle-btn active" data-mode="digital">Digital</button>
  <button id="bottomToggleFractional" class="toggle-btn" data-mode="fractional">Fractional</button>
</div>
```

#### `back_to_top.liquid`
```liquid
<button id="backToTop" class="back-to-top" aria-label="Back to top">
  <i data-lucide="arrow-up"></i>
</button>
```

#### `page_hero.liquid`
Accepts: `heading`, `subheading`. Uses Bulma `hero is-medium`.
```liquid
<section class="hero is-medium">
  <div class="hero-body has-text-centered">
    <div class="container">
      <h1 class="title is-2">{{ heading }}</h1>
      {% if subheading %}<p class="subtitle is-5">{{ subheading }}</p>{% endif %}
    </div>
  </div>
</section>
```

#### `cta_section.liquid`
Accepts: `title`, `body`, `button_text`, `button_href`. Uses Bulma `section has-background-dark`.
```liquid
<section class="section has-background-dark has-text-centered has-text-white">
  <div class="container">
    <h2 class="title has-text-white">{{ title }}</h2>
    <p class="subtitle has-text-white-ter">{{ body }}</p>
    <a href="{{ button_href }}" class="button is-white is-outlined is-medium mt-4">{{ button_text }}</a>
  </div>
</section>
```

#### `stats_bar.liquid`
Uses Bulma `columns is-vcentered has-text-centered`.
```liquid
<section class="section">
  <div class="container">
    <div class="columns is-vcentered has-text-centered">
      <div class="column">
        <div class="stat-icon-wrapper mx-auto"><i data-lucide="cloud-cog"></i></div>
        <p class="stat-count">200+ Projects</p>
        <p class="stat-label">Cloud Architecture</p>
      </div>
      <!-- … repeat for other stats … -->
    </div>
  </div>
</section>
```

#### `partners.liquid`
Uses Bulma `columns is-vcentered is-multiline is-mobile`.
```liquid
<section class="section">
  <div class="container">
    <div class="block has-text-centered mb-6">
      <h2 class="title is-3">Trusted by Industry Leaders</h2>
      <p class="subtitle is-5">Partnering with world-class organizations to deliver transformative digital solutions.</p>
    </div>
    <div class="columns is-vcentered is-multiline is-mobile is-centered">
      <div class="column is-narrow has-text-centered partner-logo">
        <!-- inline SVG for AWS -->
      </div>
      <!-- … repeat for other partners … -->
    </div>
  </div>
</section>
```

#### `featured_work.liquid`
Accepts: `featured_work`. Uses Bulma `columns is-multiline` + `card`.
```liquid
<section class="section">
  <div class="container">
    <div class="block mb-6">
      <h2 class="title is-3">Featured Work</h2>
      <p class="subtitle is-5">Transformative digital solutions that have driven measurable business impact.</p>
    </div>
    <div class="columns is-multiline">
      {% for project in featured_work %}
        <div class="column is-half-tablet is-one-quarter-desktop">
          <div class="card">
            <div class="card-image"><figure class="image is-16by9">
              <img src="{{ project.image }}" alt="{{ project.title }}">
            </figure></div>
            <div class="card-content">
              <p class="tag is-light mb-2">{{ project.category }}</p>
              <p class="title is-5">{{ project.title }}</p>
              <p class="subtitle is-6">{{ project.description }}</p>
            </div>
          </div>
        </div>
      {% endfor %}
    </div>
  </div>
</section>
```

#### `split_section.liquid`
Accepts: `badge`, `heading`, `body`, `checklist`, `image_url`, `image_alt`, `reverse`, `bg_class`, `dot_color`. Uses Bulma `columns`.
```liquid
<section class="section {{ bg_class }}">
  <div class="container">
    <div class="columns is-vcentered{% if reverse %} is-flex-direction-row-reverse{% endif %}">
      <div class="column is-half">
        {% if badge %}<span class="tag is-light mb-3">{{ badge }}</span>{% endif %}
        <h2 class="title is-3">{{ heading }}</h2>
        <p class="subtitle is-5 mb-4">{{ body }}</p>
        {% for item in checklist %}
          <div class="is-flex is-align-items-center mb-2" style="gap:0.75rem;">
            <span class="check-dot {{ dot_color }}"></span>
            <p>{{ item }}</p>
          </div>
        {% endfor %}
      </div>
      <div class="column is-half">
        <figure class="image"><img src="{{ image_url }}" alt="{{ image_alt }}" style="border-radius:8px;"></figure>
      </div>
    </div>
  </div>
</section>
```

#### `contact_form.liquid`
Accepts: `metadata`. Uses Bulma form classes throughout.
```liquid
<section class="section">
  <div class="container">
    <div class="columns">
      <!-- Contact Info -->
      <div class="column is-one-third">
        <h2 class="title is-3">Get in Touch</h2>
        <p class="subtitle is-6 mb-5">We're excited to learn about your business.</p>
        <div class="mb-4">
          <div class="is-flex is-align-items-center mb-3" style="gap:0.75rem;">
            <span class="contact-icon peach-bg p-2" style="border-radius:50%"><i data-lucide="mail"></i></span>
            <div><p class="title is-6 mb-0">Email</p><a href="mailto:{{ metadata.email }}">{{ metadata.email }}</a></div>
          </div>
          <!-- phone, address, linkedin items -->
        </div>
        <div class="box">
          <div class="is-flex is-align-items-center mb-3" style="gap:0.5rem;">
            <i data-lucide="calendar"></i><p class="title is-6 mb-0">Book a Meeting</p>
          </div>
          <p class="mb-3">Schedule a 30-minute consultation.</p>
          <a href="#" class="button is-dark is-fullwidth">View Calendar</a>
        </div>
      </div>
      <!-- Contact Form -->
      <div class="column">
        <form id="contactForm">
          <div class="columns">
            <div class="column">
              <div class="field"><label class="label">Name *</label>
                <div class="control"><input class="input" type="text" name="name" required placeholder="John Doe"></div></div>
            </div>
            <div class="column">
              <div class="field"><label class="label">Company *</label>
                <div class="control"><input class="input" type="text" name="company" required placeholder="Company Name"></div></div>
            </div>
          </div>
          <div class="field"><label class="label">Role *</label>
            <div class="control"><input class="input" type="text" name="role" required placeholder="CEO, CTO, etc."></div></div>
          <div class="columns">
            <div class="column">
              <div class="field"><label class="label">Email *</label>
                <div class="control"><input class="input" type="email" name="email" required placeholder="john@company.com"></div></div>
            </div>
            <div class="column">
              <div class="field"><label class="label">Phone</label>
                <div class="control"><input class="input" type="tel" name="phone" placeholder="+1 (555) 123-4567"></div></div>
            </div>
          </div>
          <div class="field"><label class="label">Service Interested In *</label>
            <div class="control"><div class="select is-fullwidth">
              <select name="service" required>
                <option value="">Select a service</option>
                <option value="digital">Kotai Digital</option>
                <option value="fractional">Kotai Fractional</option>
                <option value="both">Both</option>
              </select>
            </div></div></div>
          <div class="field"><label class="label">Project Budget Range</label>
            <div class="control"><div class="select is-fullwidth">
              <select name="budget">
                <option value="">Select budget range</option>
                <option value="50k-100k">$50K - $100K</option>
                <option value="100k-250k">$100K - $250K</option>
                <option value="250k-500k">$250K - $500K</option>
                <option value="500k+">$500K+</option>
              </select>
            </div></div></div>
          <div class="field"><label class="label">Message *</label>
            <div class="control"><textarea class="textarea" name="message" required rows="5" placeholder="Tell us about your project..."></textarea></div></div>
          <div class="field"><div class="control">
            <button type="submit" class="button is-dark is-fullwidth">Send Message</button>
          </div></div>
        </form>
      </div>
    </div>
  </div>
</section>
```

#### `about_sections.liquid`
Accepts: `about`. Uses Bulma `columns`, `box`, `card` throughout.
```liquid
<!-- Who We Are -->
<section class="section">
  <div class="container">
    <div class="columns is-vcentered">
      <div class="column is-half">
        <h2 class="title is-3">Who We Are</h2>
        <p class="mb-4">Kotai is a dual-engine growth partner...</p>
        <div class="columns">
          <div class="column"><div class="box peach-border"><h3 class="title is-5">Kotai Digital</h3><p>Technology transformation services...</p></div></div>
          <div class="column"><div class="box slate-border"><h3 class="title is-5">Kotai Fractional</h3><p>On-demand executive leadership...</p></div></div>
        </div>
      </div>
      <div class="column is-half">
        <figure class="image"><img src="https://images.unsplash.com/..." alt="Technology infrastructure" style="border-radius:8px;"></figure>
      </div>
    </div>
  </div>
</section>

<!-- Vision & Mission -->
<section class="section has-background-light">
  <div class="container">
    <div class="columns">
      <div class="column"><div class="box has-text-centered">
        <div class="peach-bg p-3 mb-3" style="border-radius:50%;width:48px;height:48px;margin:0 auto;"><i data-lucide="eye"></i></div>
        <h2 class="title is-4">Vision</h2>
        <p>{{ about.vision }}</p>
      </div></div>
      <div class="column"><div class="box has-text-centered">
        <div class="slate-bg p-3 mb-3" style="border-radius:50%;width:48px;height:48px;margin:0 auto;"><i data-lucide="target"></i></div>
        <h2 class="title is-4">Mission</h2>
        <p>{{ about.mission }}</p>
      </div></div>
    </div>
  </div>
</section>

<!-- Values -->
<section class="section">
  <div class="container">
    <div class="block has-text-centered mb-6"><h2 class="title is-3">Our Values</h2></div>
    <div class="columns is-multiline">
      {% for value in about.values %}
        <div class="column is-half-tablet is-one-fifth-desktop">
          <div class="box has-text-centered">
            <i data-lucide="{{ value.icon }}" style="width:32px;height:32px;" class="mb-3"></i>
            <p class="title is-5">{{ value.title }}</p>
            <p class="subtitle is-6">{{ value.description }}</p>
          </div>
        </div>
      {% endfor %}
    </div>
  </div>
</section>

<!-- Team -->
<section class="section">
  <div class="container">
    <div class="block has-text-centered mb-6">
      <h2 class="title is-3">Leadership Team</h2>
      <p class="subtitle is-5">Experienced executives driving transformation across industries.</p>
    </div>
    <div class="columns is-multiline is-centered">
      {% for member in about.team %}
        <div class="column is-half-tablet is-one-quarter-desktop">
          <div class="card">
            <div class="card-image"><figure class="image is-square">
              <img src="{{ member.image }}" alt="{{ member.name }}" style="object-fit:cover;">
            </figure></div>
            <div class="card-content has-text-centered">
              <p class="title is-5">{{ member.name }}</p>
              <p class="subtitle is-6">{{ member.title }}</p>
            </div>
          </div>
        </div>
      {% endfor %}
    </div>
  </div>
</section>
```

---

## 8. Layouts

### 8.1 `default.liquid` (updated)
```liquid
<!doctype html>
<html lang="{{ site.locale }}">
  <head>
    {% render "head", metadata: site.metadata, title: data.title %}
  </head>
  <body data-page="{{ data.page_id }}">
    {% render "scroll_progress" %}
    {% render "navbar", metadata: site.metadata, resource: resource %}
    {% render "mobile_bottom_bar" %}
    <main class="main-content">
      {{ content }}
    </main>
    {% render "back_to_top" %}
    {% render "footer", metadata: site.metadata %}
  </body>
</html>
```

### 8.2 `home.liquid` (updated)
```liquid
---
layout: default
page_id: home
---
{% render "hero", metadata: site.metadata %}
{% render "stats_bar" %}
{% render "partners" %}
{% render "featured_work", featured_work: site.data.featured_work %}
{% render "split_section", badge: "Infrastructure Excellence", heading: "Cloud-Native Architecture", image_url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80", image_alt: "Team collaboration", dot_color: "slate", checklist: "Multi-cloud architecture design,Kubernetes orchestration,Infrastructure as Code (Terraform)" %}
{% render "split_section", badge: "Artificial Intelligence", heading: "AI & Automation at Scale", reverse: true, dot_color: "peach", image_url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80", image_alt: "AI Dashboard" %}
{% render "services", metadata: site.metadata, services: site.data.services %}
{{ content }}
```

### 8.3 `page.liquid` (updated)
```liquid
---
layout: default
---
{% render "page_hero", heading: data.title %}
<section class="section">
  <div class="container content">
    {{ content }}
  </div>
</section>
```

### 8.4 `services.liquid` (new)
```liquid
---
layout: default
page_id: services
---
{% render "page_hero", heading: "Services" %}
{% render "services", metadata: site.metadata, services: site.data.services %}
{% render "cta_section", title: "Let's Build Together", body: "Discover how our technology solutions can transform your business.", button_text: "Get Started", button_href: "/contact/" %}
```

### 8.5 `about.liquid` (new)
```liquid
---
layout: default
page_id: about
---
{% render "page_hero", heading: "Building Systems. Building Leaders. Building the Future." %}
{% render "about_sections", about: site.data.about %}
{% render "cta_section", title: "Join Our Journey", body: "Partner with us to transform your digital future.", button_text: "Get in Touch", button_href: "/contact/" %}
```

### 8.6 `contact.liquid` (new)
```liquid
---
layout: default
page_id: contact
---
{% render "page_hero", heading: "Let's Start a Conversation", subheading: "Whether you need digital transformation or executive leadership, we're here to help." %}
{% render "contact_form", metadata: site.metadata %}
```

---

## 9. Pages (`src/*.md`)

### `src/index.md` (unchanged)
```yaml
---
layout: home
---
```

### `src/services.md` (new)
```yaml
---
layout: services
title: Services
page_id: services
permalink: /services/
---
```

### `src/about.md` (updated)
```yaml
---
layout: about
title: About Us
page_id: about
permalink: /about/
---
```

### `src/contact.md` (new)
```yaml
---
layout: contact
title: Contact Us
page_id: contact
permalink: /contact/
---
```

---

## 10. Active Nav Link Logic

`page_id` is set in each page's front matter and flows through its layout into `navbar.liquid` via `data.page_id`. The navbar uses a Liquid conditional to apply Bulma's `is-active` class (or the custom `active` class for animated underline):

```liquid
{% assign current = data.page_id %}
<a href="/" class="navbar-item nav-link{% if current == 'home' %} active{% endif %}">
  Home <span class="nav-underline"></span>
</a>
```

---

## 11. Implementation Order

1. **Assets** — copy SVG icons to `src/images/icons/`; update `site_metadata.yml`
2. **CSS** — create `frontend/styles/kotai.css` with custom rules; update `frontend/styles/index.css` (keep Bulma import, add `kotai.css`, update `hero.css` to hero-only overrides); remove `@import "fonts.css"`
3. **JS** — migrate `script.js` into `frontend/javascript/index.js`; replace custom mobile menu logic with Bulma burger toggle; install/import Lucide via npm
4. **Data** — update `services.yml`; create `about.yml`, `featured_work.yml`
5. **`head.liquid`** — remove FA/Material Icons; add Google Fonts, Simple Icons, Lucide (if CDN)
6. **`navbar.liquid`** — rewrite with Bulma `navbar` structure + toggle pill + active state
7. **`footer.liquid`** — rewrite with Bulma `footer` + `columns`
8. **`hero.liquid`** — rewrite with Bulma `hero is-large` + dual-panel structure
9. **New small components** — `scroll_progress`, `mobile_bottom_bar`, `back_to_top`, `page_hero`, `cta_section`
10. **`services.liquid`** — rewrite with Bulma `columns is-multiline` + `card` / `box`
11. **New content components** — `stats_bar`, `partners`, `featured_work`, `split_section`, `contact_form`, `about_sections`
12. **Layouts** — update `default.liquid`, `home.liquid`, `page.liquid`; create `services.liquid`, `about.liquid`, `contact.liquid`
13. **Pages** — add `services.md`, `contact.md`; update `about.md`
14. **Smoke test** — `bin/bridgetown start`, verify all four pages render correctly, toggle Digital/Fractional, Bulma navbar burger (mobile), contact form, scroll animations

---

## 12. Out of Scope

- The `src/_posts/` blog infrastructure and `posts.md` page are unchanged.
- The `src/404.html` and `src/500.html` pages are unchanged.
- No form backend — the contact form retains the `alert()`-based stub from `script.js`.
- Unsplash image URLs are placeholders; real photography is a separate task.
- The "Book a Meeting" calendar button links to `#` — wire to a real calendar service separately.
- Privacy Policy and Terms of Service pages are not created in this spec.
