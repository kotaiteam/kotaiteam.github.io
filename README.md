# kotaiteam README

Welcome to the new kotaiteam website! Update this README file to provide additional context and setup information for yourself or other contributors.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Install](#install)
- [Development](#development)
- [Commands](#commands)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Prerequisites

- [GCC](https://gcc.gnu.org/install/)
- [Make](https://www.gnu.org/software/make/)
- [Ruby](https://www.ruby-lang.org/en/downloads/)
  - `>= 2.7`
- [Bridgetown Gem](https://rubygems.org/gems/bridgetown)
  - `gem install bridgetown -N`
- [Node](https://nodejs.org)
  - `>= 12`
- [Yarn](https://yarnpkg.com)

## Install

```sh
cd bridgetown-site-folder
bundle install && yarn install
```

> Learn more: [Bridgetown Getting Started Documentation](https://www.bridgetownrb.com/docs/).

## Development

To start your site in development mode, run `bin/bridgetown start` and navigate to [localhost:4000](https://localhost:4000/)!

Use a [theme](https://github.com/topics/bridgetown-theme) or add some [plugins](https://www.bridgetownrb.com/plugins/) to get started quickly.

### Commands

```sh
# running locally
bin/bridgetown start

# build & deploy to production
bin/bridgetown deploy

# load the site up within a Ruby console (IRB)
bin/bridgetown console
```

> Learn more: [Bridgetown CLI Documentation](https://www.bridgetownrb.com/docs/command-line-usage)

## Deployment

You can deploy Bridgetown sites on hosts like Render or Vercel as well as traditional web servers by simply building and copying the output folder to your HTML root.

> Read the [Bridgetown Deployment Documentation](https://www.bridgetownrb.com/docs/deployment) for more information.

### Deployment Issue

**Problem**: Sometimes the website would just fail deployment, or sometimes it would display the README.md file and sometimes it will just work fine.

**Root Cause — Two Competing Deployments**

Every push triggers two separate workflows:

1. **Our workflow** (`gh-pages.yml`) — builds with Bridgetown → deploys the correct `output/` directory via `actions/deploy-pages`
2. **GitHub's automatic Jekyll workflow** (`pages-build-deployment`) — runs `actions/jekyll-build-pages` on the raw main branch → deploys that as the site

The Jekyll workflow builds directly from `main`, finds no `index.html` at root (the Bridgetown source lives in `src/`, and `output/` is git-ignored), and so renders `README.md` as the homepage.

**Why it worked before**

PRs #14 and #15 show the `pages-build-deployment` workflow failing. When Jekyll failed, only the Bridgetown deployment was live. PR #16 ("ignore-folders-for-jekyll") unintentionally fixed the Jekyll build — and since then, Jekyll's deployment has been racing against and overwriting the Bridgetown one.

**The Fix**

The GitHub Pages `build_type` is set to `legacy` (auto-Jekyll). It needs to be switched to `github_actions`, which disables the automatic Jekyll runner and leaves only our custom workflow.

This can be done via the API:

`gh api --method PUT repos/kotaiteam/kotaiteam.github.io/pages --field build_type=workflow`

Or in Settings → Pages → Build and deployment → Source → GitHub Actions.

---

## Contributing

If repo is on GitHub:

1. Fork it
2. Clone the fork using `git clone` to your local development machine.
3. Create your feature branch (`git checkout -b my-new-feature`)
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin my-new-feature`)
6. Create a new Pull Request
