# @hugo-fixit/shared

Internal utilities shared across all `@hugo-fixit` workspace packages.

## Exports

- `workspaceRoot` — resolved path to the monorepo root
- `fromRoot(...segments)` — sugar over `path.join(workspaceRoot, ...)`
- `runCommand(cmd)` — runs a shell command and returns trimmed stdout
- `capitalize(str)` — capitalizes the first character of a string
- `consola` — re-exported logger (declared as dependency here, consumed by other packages)
