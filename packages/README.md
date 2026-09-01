# Packages

This directory contains the internal packages for the [FixIt](https://fixit.lruihao.cn) Hugo theme monorepo. All packages are scoped under `@hugo-fixit`.

## Overview

| Package                          | Description                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------ |
| [shared](./shared)               | Internal utilities shared across `@hugo-fixit` packages (`workspaceRoot`, `fromRoot` etc.)       |
| [versioning](./versioning)       | Auto-updates theme version in `layouts/_partials/init/index.html` during pre-commit              |
| [integration](./integration)     | Post-build integration — merges demo/test site output into `public/`                             |
| [chroma-lexers](./chroma-lexers) | Generates Chroma lexer SCSS map (`assets/scss/core/maps/_chroma-lexers.scss`) from Chroma source |
| [unocss-preset](./unocss-preset) | UnoCSS preset providing theme colors, shortcuts, and utilities for FixIt                         |
| [encrypt](./encrypt)             | Post-build AES-256-GCM encryption tool for FixIt encrypted content                               |
| [gen-docs](./gen-docs)           | Generates API reference documentation from FixIt source files                                    |

## Development

All packages are managed via pnpm workspaces. From the repository root:

```bash
pnpm install           # Install all dependencies (including packages)
pnpm build             # Build all sites (triggers integration)
```

Individual packages can be built or tested via their own scripts — see each package's `README.md` and `package.json` for details.
