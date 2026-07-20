# @hugo-fixit/gen-docs

Generate API reference documentation for the FixIt Hugo theme from source code.

Parses Hugo TOML config to produce Markdown reference docs.

## Usage

```bash
# Generate Config docs (inject into docs params page)
pnpm gen:docs

# Config subcommand
pnpm gen:docs config
pnpm gen:docs config hugo.toml -o /path/to/config.md
pnpm gen:docs config latest
pnpm gen:docs config https://example.com/hugo.toml

# Template injection mode (inject between markers in a template file)
pnpm gen:docs config hugo.toml -t template.md
pnpm gen:docs config latest -t template.md -o output.md
```

## Subcommands

### `config`

Generates configuration reference from `hugo.toml`. Supports:

- **Local file**: `pnpm gen:docs config path/to/hugo.toml`
- **URL**: `pnpm gen:docs config https://example.com/hugo.toml`
- **Latest release**: `pnpm gen:docs config latest` (downloads from GitHub)
- **Template injection**: `-t template.md` injects docs between `<!-- HUGO_FIXIT_PARAMS:START -->` and `<!-- HUGO_FIXIT_PARAMS:END -->` markers

## Default Output

When run without a subcommand, injects config docs into `fixit-docs/content/en/documentation/getting-started/configuration/params/index.md` (template mode).

## Architecture

```text
src/
  index.ts                  # CLI entry point (commander)
  parsers/
    config-parser.ts        # TOML parser for hugo.toml
  renderers/
    config.ts               # -> config.md
```
