# FixIt Coding Standards and Guidelines

This document defines the detailed coding standards for the FixIt theme project. For project overview, architecture, and development commands, see [CLAUDE.md](../../CLAUDE.md).

## SCSS Coding Standards

### Naming

- **CSS classes**: BEM or semantic naming (`header-desktop`, `menu-item`, `post-tag`)
- **SCSS variables**: hyphen-separated, semantic (`$global-font-family`, `$code-background-color`)
- **CSS custom properties**: prefixed with `fi-` / `--fi-`

### Guidelines

- Use 2-space indentation
- Use CSS variables for theme switching support
- Prefer relative units (rem, em, %) over absolute units
- Use SCSS variables for colors — no hardcoded values
- Keep selector nesting shallow

## TypeScript Coding Standards

### Architecture

The JS follows a service-class architecture with dependency injection:

- **`ServiceContainer`** (`core/container.ts`) — Lightweight DI container with `Symbol`-based tokens and lazy resolution.
- **`TypedEventBus`** (`core/event-bus.ts`) — Typed event system wrapping DOM `CustomEvents`.
- **Service interfaces** (`core/tokens.ts`) — Typed contracts for each module (`CoreService`, `ThemeService`, `CodeService`, etc.).
- **Module classes** (`modules/*.ts`) — Each module implements its service interface. Dependencies are constructor-injected.

### Module Pattern

```typescript
export class ExampleModule implements ExampleService {
  #privateState: any // ES6 # private fields, not _ prefix

  constructor(
    private readonly core: CoreService,
    private readonly bus: TypedEventBus,
  ) {}

  publicMethod(): void { /* ... */ }
  #privateHelper(): void { /* ... */ }
}
```

### Key Rules

- Use ES6 `#` private fields — not TypeScript `private` with `_` prefix
- Keep modules focused: one module per file, one service interface per module
- Use the `TypedEventBus` for cross-module communication — do not import other modules directly
- Constructor injection for all dependencies — no global state access
- Use `window.fixit` only for backward compatibility in third-party lib callbacks

### Utilities

- Pure functions only in `utils/` — no side effects, no DOM state
- Re-export everything through `utils/index.ts`

## Hugo Template Standards

### Conventions

- **Variable naming**: camelCase (`$footerConfig`, `$fingerprint`)
- **Comments**: Hugo syntax `{{- /* comment */ -}}`
- **Translation**: Use `T` function for i18n (`{{ T "header.switchTheme" }}`)
- **Whitespace**: Use `{{- -}}` trim markers to control whitespace output

### Guidelines

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
