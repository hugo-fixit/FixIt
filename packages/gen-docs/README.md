# @hugo-fixit/gen-docs

Generate API reference documentation for the FixIt Hugo theme from source code.

- **Config**: parses `hugo.toml` to produce Markdown configuration reference.
- **Partials**: parses `layouts/_partials/` to produce Markdown Hugo partials reference.

## Usage

```bash
# Generate all docs (config + partials)
pnpm gen:docs

# Config subcommand
pnpm gen:docs config
pnpm gen:docs config hugo.toml -o /path/to/config.md
pnpm gen:docs config latest
pnpm gen:docs config https://example.com/hugo.toml
pnpm gen:docs config hugo.toml -t template.md

# Partials subcommand
pnpm gen:docs partials
pnpm gen:docs partials -t template.md
pnpm gen:docs partials -o output.md
```

## Subcommands

### `config`

Generates configuration reference from `hugo.toml`. The input source can be:

- **Local file** (default): `pnpm gen:docs config [path]`
- **URL**: `pnpm gen:docs config https://example.com/hugo.toml`
- **Latest release**: `pnpm gen:docs config latest` (fetches from GitHub releases)

Options:

- `-o, --output <file>` — Write output to file (default: stdout)
- `-t, --template <file>` — Inject docs between `<!-- HUGO_FIXIT_PARAMS:START -->` and `<!-- HUGO_FIXIT_PARAMS:END -->` markers in the template file

### `partials`

Generates Hugo partials reference from `layouts/_partials/`.

Options:

- `-o, --output <file>` — Write output to file (default: stdout)
- `-t, --template <file>` — Inject docs between `<!-- HUGO_FIXIT_PARTIALS:START -->` and `<!-- HUGO_FIXIT_PARTIALS:END -->` markers in the template file

## Default Output

When run without a subcommand, generates both config and partials docs (injects into `en` docs templates).

## Architecture

```text
src/
  index.ts                  # CLI entry point (commander)
  parsers/
    config-parser.ts        # TOML parser for hugo.toml
    partial-parser.ts       # HTML comment parser for layouts/_partials/
  renderers/
    config.ts               # -> config.md
    partials.ts             # -> partials.md
```
