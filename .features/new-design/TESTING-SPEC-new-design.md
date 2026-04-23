# KotaiTeam New Design — Visual Testing Spec

> Generated from design screenshots in `.tmp/kotai-website-screenshots/`.
> Each check maps to a concrete, observable element in the design.

---

## How to Run the Site

The project requires **Ruby 3.3.4** (managed via rvm). The default shell may default to an older Ruby version; always switch explicitly before starting.

```bash
rvm use 3.3.4
bin/bridgetown start
```

The dev server starts at `http://localhost:4000`. It watches for file changes and rebuilds automatically — edits to components, layouts, data files, CSS, and JS are picked up without a manual restart.

**Production build** (used before deploying to GitHub Pages):

```bash
rake deploy
```

### Pages under test

| URL | Layout | `page_id` |
|---|---|---|
| `http://localhost:4000/` | `home.liquid` | `home` |
| `http://localhost:4000/services/` | `services.liquid` | `services` |
| `http://localhost:4000/about/` | `about.liquid` | `about` |
| `http://localhost:4000/contact/` | `contact.liquid` | `contact` |

---

## How to Run the Automated Checks

The automated test pass uses `curl` to fetch rendered HTML and `grep` to assert element presence. Run the server first, then:

```bash
# Fetch all pages into temp files
curl -s http://localhost:4000/          > /tmp/page_home.html
curl -s http://localhost:4000/services/ > /tmp/page_services.html
curl -s http://localhost:4000/about/    > /tmp/page_about.html
curl -s http://localhost:4000/contact/  > /tmp/page_contact.html
```

Then assert individual checks, for example:

```bash
# N-6: active nav link on home page
grep "nav-link active" /tmp/page_home.html

# DH-10: digital stats bar values
grep -c "200+\|50+\|10PB+\|1M+" /tmp/page_home.html   # expect 4

# F-9: contact footer must NOT have link columns
grep -c "footer-col" /tmp/page_contact.html            # expect 0

# FS-18: services CTA must expose JS-addressable IDs
grep "servicesCTATitle\|servicesCTAText" /tmp/page_services.html
```

A full automated sweep of every section is recorded in `TESTING-REPORT-new-design.md`.

---

## How to Test the Digital / Fractional Toggle

The toggle is a client-side mode switch persisted in `localStorage` under the key `kotai-mode`. It affects:

- **Home page** — switches between `#page-home-digital` and `#page-home-fractional` panels (hero, stats bar, CTA)
- **Services page** — updates `#servicesTitle`, `#servicesSubtitle`, shows/hides `#digitalServicesContent` / `#fractionalServicesContent`, and updates `#servicesCTATitle` / `#servicesCTAText`

**To test in the browser:**

1. Open `http://localhost:4000/`
2. Click **Kotai Fractional** in the navbar pill — confirm the hero switches to the charcoal fractional panel and stats change to 20+/150%/98%/300+
3. Navigate to `/services/` without touching the toggle — confirm the page opens in fractional mode (Fractional Leadership title, role cards visible)
4. Click **Kotai Digital** — confirm it switches back to digital services
5. Hard-refresh — confirm the mode is restored from `localStorage`

**To reset the toggle state:**

```js
// In browser DevTools console:
localStorage.removeItem('kotai-mode')
location.reload()
```

**Note:** `curl`-fetched HTML always reflects the *digital* default (the static render). Toggle-dependent content can only be verified visually in the browser or by inspecting that the correct element IDs and JS wiring are present in the HTML.

---

## Component and File Map

Quick reference for locating the responsible file when a check fails.

| Area | File |
|---|---|
| `<head>` — fonts, icons, CDN scripts | `src/_components/head.liquid` |
| Navbar + toggle pill | `src/_components/navbar.liquid` |
| Footer (full + minimal contact variant) | `src/_components/footer.liquid` |
| Home hero (digital + fractional panels) | `src/_components/hero.liquid` |
| Stats bar (digital + fractional panels) | `src/_components/stats_bar.liquid` |
| Partner logo strip | `src/_components/partners.liquid` |
| Featured Work grid | `src/_components/featured_work.liquid` |
| Split content sections | `src/_components/split_section.liquid` |
| Page hero (light, non-home pages) | `src/_components/page_hero.liquid` |
| CTA banner (dark) | `src/_components/cta_section.liquid` |
| Digital + Fractional service cards | `src/_components/services.liquid` |
| About sections (Who We Are, Values, Team) | `src/_components/about_sections.liquid` |
| Contact form + info column | `src/_components/contact_form.liquid` |
| Scroll progress bar | `src/_components/scroll_progress.liquid` |
| Mobile bottom toggle bar | `src/_components/mobile_bottom_bar.liquid` |
| Back-to-top button | `src/_components/back_to_top.liquid` |
| Brand CSS custom properties + utilities | `frontend/styles/kotai.css` |
| Hero-specific button color overrides | `frontend/styles/hero.css` |
| Toggle/scroll/animation JS | `frontend/javascript/index.js` |
| Digital + Fractional service data | `src/_data/services.yml` |
| About page data (values, team) | `src/_data/about.yml` |
| Featured work data | `src/_data/featured_work.yml` |
| Site metadata (title, email, logo, tagline) | `src/_data/site_metadata.yml` |

---

## Known Gotchas Discovered During Testing

1. **`data.page_id` is not available inside `{% render %}` components.** Bridgetown's Liquid `{% render %}` tag scopes variables — `data` inside a component refers to the component's own front matter, not the calling page's. Always pass `page_id` (and any other page-level data) as an explicit parameter: `{% render "navbar", page_id: data.page_id %}`.

2. **`index.md` must declare `page_id: home` explicitly.** The `home.liquid` layout's own `page_id` front matter does not flow through to the page's data object; the page file itself must set it.

3. **Services CTA text is digital by default in static HTML.** The `#servicesCTATitle` and `#servicesCTAText` IDs are rendered with digital copy. JS updates them at runtime when fractional mode is active. This is correct — do not flag it as a failure in `curl`-based checks.

4. **The fractional home's interior sections (roles, splits, testimonial, engagement models) are not yet built.** This is intentional scope from the coding spec. See the ❌ items in `TESTING-REPORT-new-design.md` for the full list.

5. **rvm PATH warning is harmless.** Running `rvm use 3.3.4` may print a PATH warning in non-login shells. The server starts correctly regardless.

---

## How to Use This Spec

**Manual (visual) pass:**
1. `rvm use 3.3.4 && bin/bridgetown start` — open `http://localhost:4000`
2. Work through each section below in the browser
3. Mark each item ✅ pass / ❌ fail / ⚠️ partial
4. For fails: note the responsible file using the Component and File Map above

**Automated (HTML) pass:**
1. Start the server as above
2. Fetch pages with `curl` into `/tmp/page_*.html` (see "How to Run the Automated Checks" above)
3. Use `grep` assertions against the fetched HTML
4. Record results in `TESTING-REPORT-new-design.md`

**Toggle-dependent checks** (N-3/4, FH-7/8, FS-2/3/18/19) must be verified in the browser — `curl` always returns the static digital-default render.

---

## 1. Design System Tokens (Global)

These must be consistent across every page.

### 1.1 Color Palette
| Token | Expected value | Check |
|---|---|---|
| Primary accent (peach/coral) | ~`#F5A882` or similar warm salmon | Used on hero headings, icon backgrounds, CTA buttons |
| Icon tile background | Soft peach, ~`#FDE8D8` | Square rounded tile behind each service/value icon |
| Dark background | Charcoal ~`#2D2D2D`–`#3A3A3A` | Hero sections (Fractional home, Digital home), footer, CTA banners |
| Light background | Near-white or `#F5F5F5` | Hero sections (Services, About, Contact), stats bar |
| Body text | Near-black ~`#1A1A1A` | All body copy on light backgrounds |
| Muted text | Grey ~`#6B7280` | Subtitles, card descriptions |
| White text | `#FFFFFF` | All text on dark backgrounds |

### 1.2 Typography
| Element | Expected style | Check |
|---|---|---|
| H1 hero | Very large, bold, tight tracking | All page heroes |
| H1 accent span | Peach/coral color applied to key phrase only | Digital home: "AI & Robotics", Fractional home: full H1 |
| H2 section | Large, bold, centered or left-aligned | "Featured Work", "Our Values", "Leadership Team", etc. |
| Body | Regular weight, readable line-height | All paragraphs |
| Stats numbers | Bold, large (~3–4rem) | Stats bar on both homepages |
| Bullet lists | Small, muted, with dot marker | Service cards, role cards |

### 1.3 Buttons
| Variant | Expected appearance | Pages used |
|---|---|---|
| Primary dark | Dark fill, white text, rounded | "Send Message", "Start Your Project" |
| Primary coral | Coral/orange fill, white text, rounded | Navbar "Contact Us", hero CTAs |
| Outline dark | Dark border, dark text, rounded | "Get Started", "View Capabilities" |
| Outline white | White border, white text, rounded | CTA banners on dark backgrounds |

### 1.4 Cards
- Rounded corners (consistent radius ~12px)
- Subtle shadow or border on light cards
- No shadow on dark-background cards
- Image cards: image fills top, text below

### 1.5 Icons
- Each icon sits inside a soft-peach square tile with rounded corners
- Icon itself is dark stroke (not filled), ~24px
- Tile size consistent across services, values, roles

---

## 2. Navbar (All Pages)

**Reference:** All 6 screenshots — top bar

| # | Check |
|---|---|
| N-1 | KOTAI logo renders top-left (pixel/block graphic + wordmark) |
| N-2 | Center pill toggle present with two options: "Kotai Digital" and "Kotai Fractional" |
| N-3 | On Digital pages, "Kotai Digital" pill is dark-filled (active); "Kotai Fractional" is outline/light |
| N-4 | On Fractional pages, "Kotai Fractional" pill is dark-filled (active); "Kotai Digital" is outline/light |
| N-5 | Right nav links: Home, Services, About Us present as plain text links |
| N-6 | Active nav link has underline (e.g. "Services" underlined on services pages) |
| N-7 | "Contact Us" renders as a coral/orange rounded button, right-most |
| N-8 | Navbar background is white/light with no visible border or is transparent over hero |
| N-9 | Pill toggle and nav links are horizontally centered / right-aligned as per design |
| N-10 | Clicking "Kotai Digital" pill navigates to Digital home; "Kotai Fractional" to Fractional home |
| N-11 | "Contact Us" button navigates to the Contact page |

---

## 3. Footer (All Pages)

**Reference:** All 6 screenshots — bottom

| # | Check |
|---|---|
| F-1 | Footer background is dark charcoal |
| F-2 | Column 1: KOTAI logo (white/light), tagline "Building Systems. Building Leaders. Building the Future.", email `hello@kotai.com`, "Global Presence" with location pin icon |
| F-3 | Column 2: "Kotai Digital" heading + links: Digital Transformation, AI Adoption, Cloud Solutions, Development |
| F-4 | Column 3: "Kotai Fractional" heading + links: Fractional CTO, Fractional CMO, Fractional COO, Executive Leadership |
| F-5 | Column 4: "Company" heading + links: About Us, Contact, LinkedIn |
| F-6 | All footer text is white or light grey; links do not use accent color |
| F-7 | Bottom bar: "© 2026 KOTAI. All rights reserved." left-aligned; "Privacy Policy" and "Terms of Service" right-aligned |
| F-8 | Bottom bar separated by a subtle divider line |
| F-9 | Contact page footer: minimal (copyright + Privacy Policy + Terms only — no link columns) |

---

## 4. Kotai Digital — Homepage

**Reference:** `Kotai_digital_newdesign.pdf`

### 4.1 Hero Section
| # | Check |
|---|---|
| DH-1 | Full-width section with dark blue/purple-grey background |
| DH-2 | Badge pill "AI & Robotics Innovation" centered above headline |
| DH-3 | H1: "Powering the Future with AI & Robotics" — large, bold, white |
| DH-4 | "AI & Robotics" rendered in peach/coral accent color |
| DH-5 | Subtitle paragraph in muted/grey text, centered |
| DH-6 | Two CTA buttons side by side: "Start Your Project →" (dark fill) and "View Capabilities" (outline) |
| DH-7 | Three feature mini-cards below buttons: "Cognitive Systems", "Autonomous Robotics", "Edge Intelligence" |
| DH-8 | Each mini-card shows icon + title + short description |

### 4.2 Stats Bar
| # | Check |
|---|---|
| DH-9 | Light background strip with 4 stats in a row |
| DH-10 | Stats: "200+ Projects", "50+ Models", "10PB+ Data", "1M+ Tasks" |
| DH-11 | Each stat has a bold large number and a smaller label beneath |

### 4.3 Trusted By Section
| # | Check |
|---|---|
| DH-12 | H2: "Trusted by Industry Leaders" centered |
| DH-13 | Subtitle: "Partnering with world-class organizations..." |
| DH-14 | Row of partner/tech logos (cloud providers + others) displayed in greyscale or muted |

### 4.4 Featured Work Section
| # | Check |
|---|---|
| DH-15 | H2: "Featured Work" left-aligned or centered |
| DH-16 | 2×2 grid of project cards, each with: cover image, category label, title, description |
| DH-17 | Card 1: "Enterprise Cloud Migration" |
| DH-18 | Card 2: "AI-Powered Analytics Platform" |
| DH-19 | Card 3: "Global E-Commerce Platform" |
| DH-20 | Card 4: "Mobile Banking App" |
| DH-21 | Images are full-width within card, rounded corners on card |

### 4.5 Cloud-Native Architecture Section
| # | Check |
|---|---|
| DH-22 | Split layout: text left, image right |
| DH-23 | Small badge label above heading (e.g. "Scalable Infrastructure") |
| DH-24 | H3: "Cloud-Native Architecture" |
| DH-25 | Three bullet points with green/coral check icons: cloud architecture design, Kubernetes orchestration, Infrastructure as Code/Terraform |
| DH-26 | Image occupies roughly half the section width |

### 4.6 AI & Automation at Scale Section
| # | Check |
|---|---|
| DH-27 | Split layout: image left, text right |
| DH-28 | Small badge label above heading (e.g. "Artificial Intelligence") |
| DH-29 | H3: "AI & Automation at Scale" |
| DH-30 | Three bullet points: Custom ML model development, Real-time data pipelines, Production-grade Kubernetes |

### 4.7 Enterprise-Grade Dashboards Section
| # | Check |
|---|---|
| DH-31 | Full-width dark background section |
| DH-32 | H2: "Enterprise-Grade Dashboards" centered, white text |
| DH-33 | Subtitle: "Beautiful, functional interfaces..." centered, muted |
| DH-34 | Large dashboard screenshot / mockup image below |

### 4.8 Enterprise Technology Stack Section
| # | Check |
|---|---|
| DH-35 | H2: "Enterprise Technology Stack" centered |
| DH-36 | Rows of technology logos grouped by category: Frontend UI, Backend API, Cloud & Data, Team & DevOps |
| DH-37 | Category labels displayed above each logo row |

### 4.9 How We Work Section
| # | Check |
|---|---|
| DH-38 | H2: "How We Work" centered |
| DH-39 | 4 numbered steps in a row: 01 Discovery, 02 Design, 03 Build, 04 Scale |
| DH-40 | Each step has: large number (muted), icon, title, description |
| DH-41 | Steps laid out horizontally, equal column width |

### 4.10 CTA Banner
| # | Check |
|---|---|
| DH-42 | Full-width dark background |
| DH-43 | H2: "Ready to Build Something Great?" white, centered |
| DH-44 | Subtitle beneath, muted/light |
| DH-45 | "Start Your Project →" button (outline white or filled) |

---

## 5. Kotai Fractional — Homepage

**Reference:** `Kotai_fractional_newdesign.pdf`

### 5.1 Hero Section
| # | Check |
|---|---|
| FH-1 | Full-width dark charcoal background |
| FH-2 | Badge pill: "Executive Leadership On-Demand" centered |
| FH-3 | H1: "C-Suite Expertise Without the Full-Time Cost" — bold, white/peach |
| FH-4 | Subtitle in muted text, centered |
| FH-5 | Two CTA buttons: "Book Executive Consultation →" and "Explore Leadership Roles" |
| FH-6 | Three mini-cards beneath buttons showing example exec profiles/stats |

### 5.2 Stats Bar
| # | Check |
|---|---|
| FH-7 | Light background strip with 4 stats: "20+ Years Avg", "150% Average", "98%", "300+" |
| FH-8 | Each stat has bold large number + smaller label beneath |

### 5.3 Fractional Leadership Roles Section
| # | Check |
|---|---|
| FH-9 | H2: "Fractional Leadership Roles" + subtitle |
| FH-10 | 2×2 image grid: Fractional CTO, Fractional CMO, Fractional COO, Fractional CPO |
| FH-11 | Each card: full image, category label overlay (top-left), role title, brief description |
| FH-12 | Images have rounded corners |

### 5.4 Strategic Leadership Section
| # | Check |
|---|---|
| FH-13 | Split layout: text left, image right |
| FH-14 | Badge: "Flexible Engagement" |
| FH-15 | H3: "Strategic Leadership When You Need It" |
| FH-16 | Description paragraph |
| FH-17 | Three bullet points with check icons: Part-time or project-based, Immediate impact and execution, Cost-effective leadership solution |

### 5.5 Proven Track Record Section
| # | Check |
|---|---|
| FH-18 | Split layout: image left, text right |
| FH-19 | Badge: "Experienced Leaders" |
| FH-20 | H3: "Proven Track Record of Success" |
| FH-21 | Three bullets: Average 30+ years of leadership, Multi-industry expertise, Data-driven decision making |

### 5.6 Testimonial Card
| # | Check |
|---|---|
| FH-22 | Light grey / white card, centered or full-width |
| FH-23 | Avatar + company name "SaaS Company" + role "Grow & Startup" |
| FH-24 | Quote text present |
| FH-25 | Three inline stats: "10x", "60%", "6mo" with labels |

### 5.7 Flexible Engagement Models Section
| # | Check |
|---|---|
| FH-26 | H2: "Flexible Engagement Models" centered |
| FH-27 | Subtitle: "We adapt to your needs with various engagement structures." |
| FH-28 | Four columns: 01 Retainer, 02 Project-Based, 03 Advisory, 04 Interim |
| FH-29 | Each column: bold number, title, description bullets |

### 5.8 CTA Banner
| # | Check |
|---|---|
| FH-30 | Dark background, crown icon centered above heading |
| FH-31 | H2: "Ready for Executive Leadership?" white |
| FH-32 | Subtitle: "Let's discuss how a fractional executive can accelerate your growth trajectory." |
| FH-33 | "Book Consultation →" button (outline or filled) |

---

## 6. Digital Services Page

**Reference:** `Kotai_digital_services_newdesign.pdf`

### 6.1 Hero
| # | Check |
|---|---|
| DS-1 | Light background hero (no dark overlay) |
| DS-2 | H1: "Digital Services" — bold, large, centered |
| DS-3 | Subtitle: "Comprehensive technology solutions designed to accelerate your digital transformation journey." — centered, muted |

### 6.2 Services Grid
| # | Check |
|---|---|
| DS-4 | 2×2 card grid with consistent spacing |
| DS-5 | Each card: peach icon tile (top-left), H3 title, bullet list |
| DS-6 | Card 1 — "Digital Transformation" (`</>` icon): Legacy system modernization, ERP/CRM integrations, Process digitization, Enterprise data strategy, System architecture redesign |
| DS-7 | Card 2 — "AI Adoption & Automation" (brain icon): AI workflow automation, Robotic Process Automation (RPA), AI-powered dashboards, Predictive analytics, Internal AI copilots |
| DS-8 | Card 3 — "Cloud Transformation" (cloud icon): AWS/Azure/GCP migration, Infrastructure as Code, DevOps pipelines, Cloud cost optimization, Multi-cloud architecture |
| DS-9 | Card 4 — "Web & Mobile Development" (mobile icon): Custom web applications, SaaS platforms, Mobile apps (iOS/Android), API architecture, UI/UX engineering |
| DS-10 | Cards have visible card borders or shadow to distinguish them from the page background |

### 6.3 CTA Banner
| # | Check |
|---|---|
| DS-11 | Dark background |
| DS-12 | H2: "Let's Build Together" white, centered |
| DS-13 | Subtitle: "Discover how our technology solutions can transform your business." |
| DS-14 | "Get Started" button (outline white) |

---

## 7. Fractional Services Page

**Reference:** `Kotai_fractional_services_newdesign.pdf`

### 7.1 Hero
| # | Check |
|---|---|
| FS-1 | Light background |
| FS-2 | H1: "Fractional Leadership" — bold, large, centered |
| FS-3 | Subtitle: "Executive expertise on-demand, tailored to your specific business needs and growth stage." |

### 7.2 Role Detail Cards
Each role card is a two-column layout (responsibilities left, details right).

| # | Check |
|---|---|
| FS-4 | Fractional CTO card present with `</>` peach icon |
| FS-5 | CTO — Left: "RESPONSIBILITIES" label + 5 bullets (Tech strategy & roadmap, Architecture decisions, Vendor oversight, Engineering team leadership, Technical due diligence) |
| FS-6 | CTO — Right panel: "IDEAL FOR": Startups and growth-stage companies; "TYPICAL ENGAGEMENT": 3–6 months minimum; "KPIS DELIVERED": Tech stack optimization, team velocity, infrastructure cost reduction |
| FS-7 | Fractional CMO card present with trend/chart icon |
| FS-8 | CMO — Left: Growth strategy development, Digital marketing architecture, Demand generation systems, Brand positioning, Marketing team structure |
| FS-9 | CMO — Right: Ideal: Companies seeking to scale marketing operations; Engagement: 4–12 months; KPIs: Lead generation growth, CAC reduction, brand awareness metrics |
| FS-10 | Fractional COO card present with gear icon |
| FS-11 | COO — Left: Operational efficiency, Process structuring, Execution discipline, Cross-functional alignment, Scalability planning |
| FS-12 | COO — Right: Ideal: Scaling companies experiencing operational challenges; Engagement: 6–12 months; KPIs: Process efficiency, cost per unit, operational margin improvement |
| FS-13 | Fractional CPO card present with box/3D icon |
| FS-14 | CPO — Left: Product vision & strategy, Roadmap definition, Customer-centric growth, Product-market fit optimization, Feature prioritization |
| FS-15 | CPO — Right: Ideal: Product-led companies refining their offering; Engagement: 3–9 months; KPIs: User engagement, retention rates, feature adoption |
| FS-16 | "RESPONSIBILITIES", "IDEAL FOR", "TYPICAL ENGAGEMENT", "KPIS DELIVERED" are uppercase labels in muted/small type |
| FS-17 | Right panel has a visually distinct background (light grey or bordered box) |

### 7.3 CTA Banner
| # | Check |
|---|---|
| FS-18 | Dark background |
| FS-19 | H2: "Ready to Bring On Executive Talent?" white, centered |
| FS-20 | Subtitle: "Connect with our fractional executives to discuss your leadership needs." |
| FS-21 | "Get Started" button |

---

## 8. About Us Page

**Reference:** `Kotai_aboutus_newdesign.pdf`

### 8.1 Hero
| # | Check |
|---|---|
| AU-1 | Light background |
| AU-2 | H1: "Building Systems. Building Leaders. Building the Future." — bold, centered |

### 8.2 Who We Are Section
| # | Check |
|---|---|
| AU-3 | Split layout: text left, image right |
| AU-4 | H2: "Who We Are" left-aligned |
| AU-5 | Intro paragraph: "Kotai is a dual-engine growth partner combining digital engineering excellence with strategic executive leadership." |
| AU-6 | "We operate across two verticals:" subheading |
| AU-7 | "Kotai Digital" item with a coral/orange left vertical accent bar + description |
| AU-8 | "Kotai Fractional" item with a blue left vertical accent bar + description |
| AU-9 | Right side: tech/cables photo, rounded corners |

### 8.3 Vision & Mission Section
| # | Check |
|---|---|
| AU-10 | Light grey background section |
| AU-11 | Two cards side by side |
| AU-12 | Vision card: eye icon (peach tile), "Vision" title, description: "To become the most trusted transformation partner for modern enterprises." |
| AU-13 | Mission card: target/bullseye icon (peach tile), "Mission" title, description: "Deliver measurable business outcomes through intelligent systems and strategic leadership." |

### 8.4 Our Values Section
| # | Check |
|---|---|
| AU-14 | H2: "Our Values" centered |
| AU-15 | 5 value cards in a responsive grid (3 top + 2 bottom, or similar) |
| AU-16 | Each card: peach icon tile, bold title, short description |
| AU-17 | Value 1: "Integrity" — "We build trust through transparency, honesty, and ethical practice." |
| AU-18 | Value 2: "Innovation" — "We embrace cutting-edge technology to solve complex business challenges." |
| AU-19 | Value 3: "Accountability" — "We take ownership of outcomes and deliver on our commitments." |
| AU-20 | Value 4: "Strategic Thinking" — "We align technology and leadership decisions with long-term business goals." |
| AU-21 | Value 5: "Long-Term Partnership" — "We invest in lasting relationships that grow alongside your business." |

### 8.5 Leadership Team Section
| # | Check |
|---|---|
| AU-22 | H2: "Leadership Team" centered |
| AU-23 | Subtitle: "Experienced executives driving transformation across industries." |
| AU-24 | 4 team member cards in a row |
| AU-25 | Card 1: Sarah Chen photo, "Sarah Chen", "Co-Founder & CEO" |
| AU-26 | Card 2: Michael Torres photo, "Michael Torres", "Chief Technology Officer" |
| AU-27 | Card 3: Jessica Park photo, "Jessica Park", "Chief Operating Officer" |
| AU-28 | Card 4: David Richardson photo, "David Richardson", "Head of Digital Strategy" |
| AU-29 | Photos are square or rounded-square, consistent size |

### 8.6 CTA Banner
| # | Check |
|---|---|
| AU-30 | Dark background |
| AU-31 | H2: "Join Our Journey" white, centered |
| AU-32 | Subtitle: "Partner with us to transform your digital future and strengthen your leadership." |
| AU-33 | "Get In Touch" button (outline white) |

---

## 9. Contact Us Page

**Reference:** `Kotai_contactus_newdesign.pdf`

### 9.1 Hero
| # | Check |
|---|---|
| CU-1 | Light background |
| CU-2 | H1: "Let's Start a Conversation" — bold, large, centered |
| CU-3 | Subtitle: "Whether you need digital transformation or executive leadership, we're here to help." |

### 9.2 Main Content (Two-Column Layout)
| # | Check |
|---|---|
| CU-4 | Section splits into two columns: contact info left, form right |
| CU-5 | Left — H2: "Get in Touch" |
| CU-6 | Left — Paragraph: "We're excited to learn about your business and explore how we can partner together." |
| CU-7 | Left — Email row: envelope icon + "Email" label + `hello@kotai.com` |
| CU-8 | Left — Phone row: phone icon + "Phone" label + `+1 (555) 123-4567` |
| CU-9 | Left — Office row: pin icon + "Office" label + `123 Innovation Drive, San Francisco, CA 94105` |
| CU-10 | Left — LinkedIn row: LinkedIn icon + `linkedin.com/company/kotai` |
| CU-11 | Each contact row icon sits in a small light-grey rounded tile |

### 9.3 Contact Form
| # | Check |
|---|---|
| CU-12 | Form rendered inside a white card with subtle shadow/border |
| CU-13 | Row 1: "Name *" and "Company *" side by side (50/50), with placeholders "John Doe" and "Company Name" |
| CU-14 | Row 2: "Role *" full width, placeholder "CEO, CTO, etc." |
| CU-15 | Row 3: "Email *" and "Phone" side by side, placeholders "john@company.com" and "+1 (555) 123-4567" |
| CU-16 | Row 4: "Service Interested In *" — dropdown, default "Select a service" |
| CU-17 | Row 5: "Project Budget Range" — dropdown, default "Select budget range" |
| CU-18 | Row 6: "Message *" — textarea, placeholder "Tell us about your project or needs..." |
| CU-19 | Required fields marked with `*` in label |
| CU-20 | "Send Message" button — dark (near-black) fill, white text, full width of form, rounded |
| CU-21 | Form inputs have consistent border, border-radius, padding |

### 9.4 Footer (Contact Page Specific)
| # | Check |
|---|---|
| CU-22 | Minimal footer: no link columns |
| CU-23 | "© 2026 KOTAI. All rights reserved." left |
| CU-24 | "Privacy Policy" and "Terms of Service" right |

---

## 10. Responsive / Layout Checks

These should be tested at common breakpoints: 1440px (design), 1024px, 768px, 375px.

| # | Check |
|---|---|
| R-1 | Navbar collapses to hamburger or stacked layout on mobile |
| R-2 | Pill toggle remains usable on mobile |
| R-3 | 2×2 service/role grids collapse to single column on mobile |
| R-4 | Split sections (text + image) stack vertically on mobile |
| R-5 | Stats bar wraps to 2×2 grid or single column on mobile |
| R-6 | Leadership team cards wrap on tablet (2×2) and stack on mobile |
| R-7 | Contact form columns collapse to single column on mobile |
| R-8 | Footer columns stack on mobile |
| R-9 | Hero text size scales down appropriately on small screens |
| R-10 | CTA buttons remain full-width on mobile |

---

## 11. Cross-Page Consistency Checks

| # | Check |
|---|---|
| X-1 | Peach icon tile size is identical across services page, fractional services, about values, home feature cards |
| X-2 | H2 section heading size and weight matches across all pages |
| X-3 | Dark CTA banner section (dark bg + heading + button) looks identical on all pages that use it |
| X-4 | Footer is pixel-consistent across Digital home, Fractional home, Services, About pages |
| X-5 | Navbar height and spacing is identical across all pages |
| X-6 | "Contact Us" navbar button colour matches the peach/coral used in the design system |
| X-7 | Active nav pill state correctly reflects current brand context on every page |

---

## 12. Content Accuracy Checks

| # | Check |
|---|---|
| CA-1 | All bullet point copy matches design exactly (no placeholder lorem ipsum) |
| CA-2 | Stat numbers match design: 200+, 50+, 10PB+, 1M+ (Digital); 20+ Yrs, 150%, 98%, 300+ (Fractional) |
| CA-3 | Email: `hello@kotai.com` |
| CA-4 | Copyright year: 2026 |
| CA-5 | Team member names and titles are correct (Sarah Chen CEO, Michael Torres CTO, Jessica Park COO, David Richardson Head of Digital Strategy) |
| CA-6 | Fractional role engagement durations correct: CTO 3–6mo, CMO 4–12mo, COO 6–12mo, CPO 3–9mo |
| CA-7 | Footer tagline: "Building Systems. Building Leaders. Building the Future." |
