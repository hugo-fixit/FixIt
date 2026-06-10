# @hugo-fixit/versioning

Updates the FixIt version string in `layouts/_partials/init/index.html`.

## Usage

```bash
pnpm -F versioning start dev   # Development version (pre-commit hook)
pnpm -F versioning start prod  # Production version (release)
```

## How it works

- **dev**: builds a version like `v0.3.21-mq7veaoa` (next patch + base36 timestamp), runs on pre-commit for `dev`/`main` branches only when theme files change
- **prod**: uses the version from `package.json`, also cleans up the `nextVersion` field if present
