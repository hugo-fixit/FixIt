# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FixIt is a modern, responsive theme for the Hugo static site generator. Built with Hugo templates, SCSS, and TypeScript.

## Development Commands

### Prerequisites

- Node.js >= 20
- Hugo Extended >= 0.158.0
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
pnpm build             # Build all sites
pnpm preview           # Preview built site (requires build first)
```

### Code Quality

```bash
pnpm lint              # Run ESLint
pnpm typecheck         # Run TypeScript type checking
```

## Architecture

### JavaScript Module System (`assets/js/`)

The JS follows a service-class architecture with dependency injection:

- **`main.ts`** — Entry point. Bootstraps `ServiceContainer` and `TypedEventBus`, registers all services, resolves them, and builds a `window.fixit` backward-compatibility facade via `publicAPI()`. Runs the init sequence on `DOMContentLoaded`.
- **`types.ts`** — TypeScript interfaces for `FixItConfig`, `FixItPublicAPI`, and all config sub-types. Declares global `window` augmentations for third-party libs.
- **`core/`** — Infrastructure layer:
  - `container.ts` — Lightweight DI container with `Symbol`-based tokens, lazy resolution, and circular-dependency detection.
  - `event-bus.ts` — Typed wrapper around DOM `CustomEvents` with `on`/`off`/`emit` methods and a `FixItEventMap` payload type map.
  - `tokens.ts` — Service interfaces (`CoreService`, `ThemeService`, `CodeService`, etc.) and a `TOKENS` constant mapping each to a typed `ServiceToken`.
- **`modules/`** — Feature modules. Each is a class implementing its service interface. Dependencies are constructor-injected via the container. Private state uses ES6 `#` fields. Modules: charts, code, comment, content, core, encryption, events, link-guard, menu, misc, search, svg, theme, toc. `pagefind.ts` is a standalone factory consumed by `SearchModule`.
- **`utils/`** — Pure utility functions (animation, array, clipboard, dom, file, media, string, theme, tooltip, validate). Re-exported from `utils/index.ts`.
- **`lib/`** — Third-party library wrappers (aplayer, file-tree, fixit-decryptor, mathjax, mermaid).
- **`pages/`** — Page-specific scripts (e.g. `link.ts` for the link guard redirection page).

Module pattern:

```typescript
export class ExampleModule implements ExampleService {
  #privateState: any // ES6 private field

  constructor(
    private readonly core: CoreService,
    private readonly bus: TypedEventBus,
  ) {}

  publicMethod(): void { /* ... */ }
  #privateHelper(): void { /* ... */ }
}
```

### Hugo Templates (`layouts/`)

- **`_partials/`** — Reusable template components
- **`_shortcodes/`** — Custom Hugo shortcodes
- **`_markup/`** — Hugo render hooks

### Theme Configuration

- **`hugo.toml`** — Default theme configuration (47K+ lines)
- **`theme.toml`** — Theme metadata

### Packages (`packages/`)

Monorepo packages managed by pnpm workspaces:

- `integration` — Integration testing
- `shared` — Shared utilities
- `versioning` — Version management tooling

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

Ignored paths: `node_modules/`, `assets/lib/`, `assets/js/lib/mermaid.js`, `public/`, `assets/js/service-worker.js`.
