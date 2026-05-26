# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FixIt is a modern, responsive theme for the Hugo static site generator. Built with Hugo templates, SCSS, and TypeScript.

## Development Commands

### Prerequisites

- Node.js >= 20
- Hugo Extended >= 0.158.0 (Dart Sass required)
- pnpm

### Development

```bash
pnpm install           # Install dependencies
pnpm dev:demo          # Start demo site dev server
pnpm dev:test          # Start test site dev server
pnpm dev:docs          # Start docs dev server (requires fixit-docs as sibling directory)
```

### Build

```bash
pnpm build:demo        # Build demo site
pnpm build:test        # Build test site
pnpm build             # Build all sites (demo + test, merged into public/)
pnpm preview           # Preview built site (requires build first)
```

### Code Quality

```bash
pnpm lint              # Run ESLint
pnpm typecheck         # Run TypeScript type checking
```

There are no unit tests. Verify changes by building `pnpm build:demo` or `pnpm build:test` and inspecting the output.

## Architecture

### Monorepo Structure

Root `package.json` is `@hugo-fixit/core`. pnpm workspaces include `apps/*` and `packages/*`:

- `apps/demo/` — Demo site (deployed to `demo.fixit.lruihao.cn`)
- `apps/test/` — Test site for exercising theme features
- `packages/shared` — Shared utilities (exports `workspaceRoot`)
- `packages/versioning` — Version management (auto-updates version in `layouts/_partials/init/index.html` during pre-commit)
- `packages/integration` — Post-build: merges demo/test output into `public/`

### JavaScript Module System (`assets/js/`)

Service-class architecture with dependency injection:

- **`main.ts`** — Entry point. Bootstraps `ServiceContainer` and `TypedEventBus`, registers all services, resolves them, and builds a `window.fixit` backward-compatibility facade via `publicAPI()`. Runs the init sequence on `DOMContentLoaded`.
- **`types.ts`** — TypeScript interfaces for `FixItConfig`, `FixItPublicAPI`, and all config sub-types. Declares global `window` augmentations for third-party libs.
- **`core/`** — Infrastructure layer:
  - `container.ts` — Lightweight DI container with `Symbol`-based tokens, lazy resolution, and circular-dependency detection.
  - `event-bus.ts` — Typed wrapper around DOM `CustomEvents` with `on`/`off`/`emit` methods and a `FixItEventMap` payload type map.
  - `tokens.ts` — Service interfaces (`CoreService`, `ThemeService`, `CodeService`, etc.) and a `TOKENS` constant mapping each to a typed `ServiceToken`.
- **`modules/`** — Feature modules. Each is a class implementing its service interface. Dependencies are constructor-injected via the container. Private state uses ES6 `#` fields. Modules: charts, code, comment, content, core, encryption, events, link-guard, menu, misc, search, svg, theme, toc. `pagefind.ts` is a standalone factory consumed by `SearchModule`.
- **`utils/`** — Pure utility functions (no side effects, no DOM state). Re-exported from `utils/index.ts`.
- **`lib/`** — Third-party library wrappers (aplayer, echarts, file-tree, fixit-decryptor, lightgallery, mapbox, mathjax, mermaid, etc.).
- **`head/`** — `color-scheme.ts` runs synchronously in `<head>` before body render to prevent flash of wrong theme.
- **`pages/`** — Page-specific scripts (e.g. `link.ts` for the link guard redirection page).

Cross-module communication uses `TypedEventBus`, not direct module imports. The `window.fixit` global API is only for backward compatibility in third-party library callbacks and user custom scripts.

### Hugo Templates (`layouts/`)

- **`_partials/`** — Reusable template components (organized into `init/`, `base/`, `function/`, `plugin/`, `single/`, `store/`)
- **`_shortcodes/`** — 31 custom shortcodes (admonition, aplayer, echarts, file-tree, mermaid, tabs, timeline, etc.)
- **`_markup/`** — 15 render hooks (code blocks, headings, images, links, tables, blockquote alerts, passthrough for math)

### Asset Pipeline

Hugo Pipes processes all assets. The key orchestration is in `_partials/base/assets.html`:

- **CSS**: `scss/config.template.scss` generates runtime CSS custom properties from Hugo config. `scss/main.scss` is the entry point importing `core/`, `pages/`, `widgets/`, `custom`.
- **JS**: `_partials/function/js-build.html` wraps `js.Build` with minify-in-production defaults. Hugo's `@params` injection passes config values into TypeScript at build time.
- **Third-party libraries**: Stored in `assets/lib/` (vendored, not npm-managed). Tracked by `librarybot.yml` and updated weekly by the `hugo-fixit/librarybot` GitHub Action. Can be overridden via CDN config in `assets/data/cdn/jsdelivr.yml` or `unpkg.yml`.

### Theme Configuration

- **`hugo.toml`** — Default theme configuration (1700+ lines). Uses `_merge = "shallow"` to let user configs override without deep merging.
- **`theme.toml`** — Theme metadata

## Coding Standards

### SCSS (`assets/scss/`)

- CSS classes: BEM or semantic naming (`header-desktop`, `menu-item`)
- SCSS variables: hyphen-separated, semantic (`$global-font-family`)
- CSS custom properties: prefixed with `fi-` / `--fi-`
- Use CSS variables for theme switching; SCSS variables for colors (no hardcoded values)
- Prefer relative units (rem, em, %) over absolute units
- Keep selector nesting shallow

### TypeScript

- Use ES6 `#` private fields — not TypeScript `private` with `_` prefix
- One module per file, one service interface per module
- Constructor injection for all dependencies — no global state access
- Pure functions only in `utils/` — no side effects, no DOM state

### Hugo Templates

- Variable naming: camelCase (`$footerConfig`, `$fingerprint`)
- Translation: use `T` function (`{{ T "header.switchTheme" }}`)
- Whitespace: use `{{- -}}` trim markers
- Use `partialCached` for expensive partials that don't change per page
- Use `.Site.Store` for shared computed values (e.g. fingerprint)
- Check `hugo.IsProduction` before adding analytics or minification

## Commit Convention

Follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
```

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `perf`, `style`, `test`, `ci`, `build`

Scopes: `workflow`, `archetypes`, `assets`, `i18n`, `layouts`, `config`, or specific directories.

## Pre-commit Hooks

Pre-commit runs: versioning (dev mode), typecheck, lint-staged (eslint --fix on staged files).

## ESLint

Uses `@antfu/eslint-config` with TypeScript support. Config at `eslint.config.js`.
