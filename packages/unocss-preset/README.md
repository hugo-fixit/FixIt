# @hugo-fixit/unocss-preset

UnoCSS preset for the [FixIt](https://fixit.lruihao.cn) Hugo theme. Provides theme tokens, shortcuts, blocklist, safelist, and icon configuration.

## Exports

- `presetFixIt` — the main UnoCSS preset (theme breakpoints/colors, z-index shortcuts, blocklist, safelist)
- `createFixItConfig(options?)` — creates a complete UnoCSS config combining `presetWind3`, `presetIcons` (lucide + octicon), and `presetFixIt`

## Usage

```ts
// uno.config.ts
import { createFixItConfig } from '@hugo-fixit/unocss-preset'

export default createFixItConfig({
  overrides: {
    content: {
      filesystem: ['layouts/**/*.html'],
    },
  },
})
```

### Options

| Option      | Type                         | Description                             |
| ----------- | ---------------------------- | --------------------------------------- |
| `presets`   | `PresetOrFactoryAwaitable[]` | Additional UnoCSS presets to include    |
| `overrides` | `Partial<UserConfig>`        | Override or extend the generated config |

## Theme

### Breakpoints (min-width, mobile-first)

| Token | Value    |
| ----- | -------- |
| `sm`  | `680px`  |
| `md`  | `960px`  |
| `lg`  | `1200px` |
| `xl`  | `1440px` |

Use `max-sm:` prefix for xs (< 680px).

### Colors (CSS custom properties)

`primary`, `secondary`, `success`, `info`, `warning`, `danger` — mapped to `var(--fi-*)`.

## Shortcuts

Semantic z-index utilities mirroring `core/mixins/_z-index.scss`:

| Shortcut    | Utility  |
| ----------- | -------- |
| `z-hide`    | `z--1`   |
| `z-auto`    | `z-auto` |
| `z-base`    | `z-1`    |
| `z-loading` | `z-10`   |
| `z-sticky`  | `z-100`  |
| `z-fixed`   | `z-200`  |
