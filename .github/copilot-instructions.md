# FixIt Coding Standards and Guidelines

This document defines the detailed coding standards for the FixIt theme project. For project overview, architecture, and development commands, see [CLAUDE.md](../../CLAUDE.md).

## SCSS Coding Standards

### Naming

- **CSS classes**: BEM or semantic naming (`header-desktop`, `menu-item`, `post-tag`)
- **SCSS variables**: hyphen-separated, semantic (`$global-font-family`, `$code-background-color`)
- **CSS custom properties**: prefixed with `fi-` / `--fi-`

### SCSS Guidelines

- Use 2-space indentation
- Use CSS variables for theme switching support
- Prefer relative units (rem, em, %) over absolute units
- Use SCSS variables for colors — no hardcoded values
- Keep selector nesting shallow

## UnoCSS Guidelines

- Use UnoCSS atomic classes for common utilities (`hidden`, `me-1`, `text-center`, etc.)
- Theme colors: `bg-primary`, `text-success`, `text-danger`, etc. (mapped via `@theme` in `uno.config.ts`)
- Responsive: `sm:` (>=681px), `md:` (>=961px), `lg:` (>=1201px), `xl:` (>=1441px). Use `max-sm:` for xs (<681px)
- Wrap SVG elements with `<!-- @unocss-skip-start -->` / `<!-- @unocss-skip-end -->` to avoid false positives from `d` attribute values
- Dynamically generated classes (e.g., `order-*`) must be added to `safelist` in `uno.config.ts`
- Run `pnpm css:build` after modifying `uno.config.ts` or templates that use UnoCSS classes

## TypeScript Coding Standards

### Architecture

Service-class architecture with direct constructor calls:

- **`TypedEventBus`** (`core/event-bus.ts`) — Module-level singleton (`eventBus`) wrapping DOM `CustomEvents` with typed event map.
- **Service interfaces** (`core/tokens.ts`) — Typed contracts for each module (`CoreService`, `ThemeService`, `CodeService`, etc.).
- **Module classes** (`modules/*.ts`) — Each module implements its service interface. Dependencies are constructor-injected.

### Module Pattern

```typescript
export class ExampleModule implements ExampleService {
  #privateState: any // ES6 # private fields, not _ prefix

  constructor(private readonly core: CoreService) {}

  publicMethod(): void { /* ... */ }
  #privateHelper(): void { /* ... */ }
}
```

### Key Rules

- Use ES6 `#` private fields — not TypeScript `private` with `_` prefix
- Keep modules focused: one module per file, one service interface per module
- Import the shared `eventBus` singleton from `core/event-bus` for cross-module communication
- Constructor injection for dependencies — no global state access
- `window.fixit` exposes a typed public API (`FixItPublicAPI`) for user custom scripts
- Comment style: follow [TSDoc](https://tsdoc.org/) conventions

### Utilities

- Pure functions only in `utils/` — no side effects, no DOM state
- Re-export everything through `utils/index.ts`

## Hugo Template Standards

### Conventions

- **Variable naming**: camelCase (`$footerConfig`, `$fingerprint`)
- **Comments**: Hugo syntax `{{- /* comment */ -}}`
- **Translation**: Use `T` function for i18n (`{{ T "header.switchTheme" }}`)
- **Whitespace**: Use `{{- -}}` trim markers to control whitespace output

### Hugo Template Guidelines

- Use `partialCached` for expensive partials that don't change per page
- Use `.Site.Store` for shared computed values (e.g. fingerprint)
- Check `hugo.IsProduction` before adding analytics or minification

## Git Workflow

### Commit Convention

Follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
```

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `perf`, `style`, `test`, `ci`, `build`

Scopes: `workflow`, `archetypes`, `assets`, `i18n`, `layouts`, `config`, or specific directories.

### Pre-commit Hooks

Pre-commit runs: versioning (dev mode), typecheck, lint-staged (eslint --fix on staged files).

## Browser Compatibility

- Target modern browsers
- Use progressive enhancement for advanced features
- Prefer feature detection over browser detection
