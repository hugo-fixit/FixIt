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

### Code Generation

```bash
pnpm gen:lexers        # Regenerate assets/scss/core/maps/_chroma-lexers.scss from Chroma source
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
- `packages/shared` — Shared utilities (exports `workspaceRoot`, `fromRoot`, `runCommand`, `capitalize`, `consola`)
- `packages/versioning` — Version management (auto-updates version in `layouts/_partials/init/index.html` during pre-commit)
- `packages/integration` — Post-build: merges demo/test output into `public/`
- `packages/chroma-lexers` — Generates Chroma lexer SCSS map from GitHub

### JavaScript Module System (`assets/js/`)

Service-class architecture with direct constructor calls:

- **`main.ts`** — Entry point. Instantiates all modules with direct constructor calls, builds the typed `window.fixit` public API facade, and runs the init sequence on `DOMContentLoaded`.
- **`types/`** — TypeScript type definitions:
  - `config.ts` — `FixItConfig` and all config sub-types.
  - `ui.ts` — `FixItPublicAPI`, global `window` augmentation for third-party libs.
  - `third-party.ts` — Types for vendored libraries.
- **`core/`** — Infrastructure layer:
  - `event-bus.ts` — Typed event bus singleton wrapping DOM `CustomEvents`. Exports `eventBus` (module-level singleton) and `FixItEventMap` type.
  - `tokens.ts` — Service interfaces (`CoreService`, `ThemeService`, `CodeService`, etc.) used for module constructor typing.
- **`modules/`** — Feature modules. Each is a class implementing its service interface. Dependencies are constructor-injected. Private state uses ES6 `#` fields. Modules: charts, code, content, core, encryption, events, menu, misc, search, theme, toc. `pagefind.ts` is a standalone factory consumed by `SearchModule`.
- **`utils/`** — Pure utility functions (no side effects, no DOM state). Re-exported from `utils/index.ts`.
- **`lib/`** — Third-party library wrappers (aplayer, echarts, file-tree, fixit-decryptor, lightgallery, mapbox, mathjax, mermaid, etc.). All import the shared `eventBus` singleton.
- **`head/`** — `color-scheme.ts` runs synchronously in `<head>` before body render to prevent flash of wrong theme.
- **`pages/`** — Page-specific scripts (e.g. `link.ts` for the link guard redirection page).

Cross-module communication uses the shared `eventBus` singleton, not direct module imports. The `window.fixit` facade exposes a typed public API for user custom scripts (`custom.ts`): theme control, scroll state, mask overlay management, content re-initialization, and the event bus.

### Hugo Templates (`layouts/`)

- **`_partials/`** — Reusable template components (organized into `init/`, `base/`, `function/`, `plugin/`, `single/`, `store/`)
- **`_shortcodes/`** — 31 custom shortcodes (admonition, aplayer, echarts, file-tree, mermaid, tabs, timeline, etc.)
- **`_markup/`** — 15 render hooks (code blocks, headings, images, links, tables, blockquote alerts, passthrough for math)

### Asset Pipeline

Hugo Pipes processes all assets. The key orchestration is in `_partials/base/assets.html`:

- **CSS**: `scss/main.scss` is the entry point importing `core/`, `pages/`, `widgets/`, `custom`. SCSS variables are configured via `hugo:vars` (user-configurable from `[params.appearance]`) and `hugo:vars/internal` (theme system config).
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
- Constructor injection for dependencies — no global state access
- Import the shared `eventBus` singleton from `core/event-bus` — do not create new instances
- Pure functions only in `utils/` — no side effects, no DOM state
- Comment style: follow [TSDoc](https://tsdoc.org/) conventions

### Hugo Templates

- Variable naming: camelCase (`$footerConfig`, `$fingerprint`)
- Translation: use `T` function (`{{ T "header.switchTheme" }}`)
- Whitespace: use `{{- -}}` trim markers
- Use `partialCached` for expensive partials that don't change per page
- Use `.Site.Store` for shared computed values (e.g. fingerprint)
- Check `hugo.IsProduction` before adding analytics or minification
- Minimize `id` attribute usage — prefer class selectors for styling and JS queries. Reserve `id` for: `<label for>`, `aria-controls`/`aria-labelledby`, fragment anchors, or third-party library requirements

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

Uses `@antfu/eslint-config` with TypeScript support. Config at `eslint.config.ts`.
