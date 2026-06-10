# @hugo-fixit/integration

Post-build script that merges `apps/demo` and `apps/test` build outputs into a unified `public/` directory.

## Usage

```bash
pnpm -F integration start
```

## How it works

1. Removes the existing `public/` directory
2. Copies `apps/demo/public/` into `public/`
3. Copies `apps/test/public/` into `public/test/`
