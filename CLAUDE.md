# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FixIt is a modern, responsive theme for Hugo static site generator. Built with Hugo templates, SCSS, and TypeScript/JavaScript.

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

The JS follows a factory-function pattern with a shared context object:

- **`main.ts`** - Entry point. Creates `FixItContext` via `createFixIt()`, then runs initialization sequence on DOMContentLoaded.
- **`types.ts`** - TypeScript interfaces for `FixItContext`, `FixItConfig`, and all config sub-types. Declares global `window` augmentations for third-party libs.
- **`modules/`** - Feature modules (charts, code, comment, content, core, encryption, events, link-guard, menu, misc, search, svg, theme, toc). Each exports a `createX(ctx)` factory that returns methods merged into the context.
- **`utils/`** - Pure utility functions (animation, array, clipboard, dom, file, media, string, theme, tooltip, validate). Re-exported from `utils/index.ts`.
- **`lib/`** - Third-party library wrappers (aplayer, file-tree, fixit-decryptor, mathjax, mermaid).

Module pattern:

```typescript
export function createModule(ctx: FixItContext) {
  // Initialize state on ctx
  // Return { methodName, ... } merged into ctx
}
```

### Hugo Templates (`layouts/`)

- **`_partials/`** - Reusable template components
- **`_shortcodes/`** - Custom Hugo shortcodes
- **`_markup/`** - Hugo render hooks

### Theme Configuration

- **`hugo.toml`** - Default theme configuration (47K+ lines)
- **`theme.toml`** - Theme metadata

### Packages (`packages/`)

Monorepo packages managed by pnpm workspaces:

- `integration` - Integration testing
- `shared` - Shared utilities
- `versioning` - Version management tooling

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
