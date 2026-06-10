# @hugo-fixit/chroma-lexers

Generates the Chroma lexer SCSS map (`assets/scss/core/maps/_chroma-lexers.scss`) by fetching lexer definitions from the [Chroma](https://github.com/alecthomas/chroma) repository on GitHub.

## Usage

```bash
pnpm gen:lexers
```

## How it works

1. Fetches lexer definitions (XML + Go) from the Chroma GitHub repo via the GitHub API
2. Extracts language names and aliases from each lexer
3. Generates a SCSS map (`$chroma-lexers`) mapping aliases to canonical names
4. Appends custom code types defined in `src/custom-types.ts`
