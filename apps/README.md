# Apps

This directory contains the Hugo sites used for development, testing, and demonstration of the [FixIt](https://fixit.lruihao.cn) theme.

## Overview

| App            | Description                                           | Live                                                              |
| -------------- | ----------------------------------------------------- | ----------------------------------------------------------------- |
| [demo](./demo) | Demo site showcasing FixIt theme features             | [demo.fixit.lruihao.cn](https://demo.fixit.lruihao.cn)            |
| [test](./test) | Test site for exercising and verifying theme features | [demo.fixit.lruihao.cn/test](https://demo.fixit.lruihao.cn/test/) |

> [!NOTE]
> The documentation site (`fixit-docs`) lives in a separate repository: [hugo-fixit/fixit-docs](https://github.com/hugo-fixit/fixit-docs).

## Development

From the repository root:

```bash
pnpm dev:demo          # Start demo site dev server
pnpm dev:test          # Start test site dev server
pnpm build:demo        # Build demo site
pnpm build:test        # Build test site
pnpm build             # Build all sites (merged into public/)
```
