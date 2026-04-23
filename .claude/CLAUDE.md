# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Directives

### Coding and Testing specs

- When unclear ALWAYS ask clarifying questions and DON'T make assumptions.
- Always check the `features/<feature>` folder for coding and testing specs for new features before implementation.
  - Coding specs is in file `CODING-SPEC-<feature>.md` file
  - Testing specs is in file `TESTING-SPEC-<feature>.md` file
- Before any implementation, always create a `features/CODING-SPEC-<feature>.md` file for coding specs and a `features/TESTING-SPEC-<feature>.md` file for testing specs for any new features.

## Project Overview

This is the **KotaiTeam** website (https://kotai.team), a static site built with [Bridgetown](https://www.bridgetownrb.com/) (Ruby SSG) using Liquid templating, esbuild for asset bundling, and PostCSS for CSS processing. It is deployed via GitHub Pages.

## Common Commands

### Development

```bash
bin/bridgetown start       # Start dev server at localhost:4000 (watches for changes)
```

### Building

```bash
rake deploy                # Production build: clean → frontend:build → Bridgetown build
rake frontend:build        # Build frontend assets only (esbuild, minified)
rake frontend:dev          # Watch mode for frontend assets only
rake clean                 # Clean the output/ directory
```

### Testing

```bash
rake test                  # Build site in test environment
```

### Console

```bash
bin/bridgetown console     # IRB console with full site context
```

## Architecture

### Stack

- **Framework:** Bridgetown 1.3.4 (Ruby-based SSG)
- **Templates:** Liquid
- **JS/CSS Bundler:** esbuild (configured in `esbuild.config.js` and `config/esbuild.defaults.js`)
- **CSS:** PostCSS with autoprefixer (`postcss.config.js`)
- **Web server:** Puma (`config/puma.rb`)
- **Hosting:** GitHub Pages

### Key Directories

| Path                   | Purpose                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `src/_components/`     | Reusable Liquid components (hero, navbar, footer, card, services, etc.) |
| `src/_layouts/`        | Page layout templates (default, home, page, post)                       |
| `src/_data/`           | YAML data files (`site_metadata.yml`, `services.yml`)                   |
| `src/_posts/`          | Blog/article content (Markdown)                                         |
| `src/*.md`             | Top-level pages (index, about, posts)                                   |
| `frontend/styles/`     | CSS source files (index.css, hero.css, fonts.css)                       |
| `frontend/javascript/` | JS entry point (`index.js`)                                             |
| `frontend/fonts/`      | Font assets                                                             |
| `output/`              | Built site (git-ignored, do not edit)                                   |
| `plugins/`             | Bridgetown plugins and site builders                                    |
| `server/routes/`       | Optional dynamic routes (Roda framework)                                |

### Data Flow

- Page content lives in `src/*.md` with YAML front matter selecting a layout
- Layouts in `src/_layouts/` compose components from `src/_components/`
- Site-wide data (nav, metadata, services list) is in `src/_data/` YAML files
- `frontend/javascript/index.js` and `frontend/styles/index.css` are the esbuild entry points; output goes to `output/_bridgetown/static/`

### JS Path Aliases (jsconfig.json)

- `$styles` → `frontend/styles/`
- `$javascript` → `frontend/javascript/`
- `$components` → `src/_components/`
