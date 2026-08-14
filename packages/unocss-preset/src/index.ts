import type { UserConfig } from 'unocss'
import { definePreset, presetIcons, presetWind3 } from 'unocss'

/**
 * FixIt UnoCSS preset — theme tokens, shortcuts, blocklist, and safelist.
 */
export const presetFixIt = definePreset<object>(() => ({
  name: 'preset-fixit',
  theme: {
    // FixIt responsive breakpoints (min-width, mobile-first)
    // xs (< 680px) use max-sm: prefix in UnoCSS
    breakpoints: {
      sm: '680px',
      md: '960px',
      lg: '1200px',
      xl: '1440px',
    },
    colors: {
      primary: 'var(--fi-primary)',
      secondary: 'var(--fi-secondary)',
      success: 'var(--fi-success)',
      info: 'var(--fi-info)',
      warning: 'var(--fi-warning)',
      danger: 'var(--fi-danger)',
    },
  },
  // No preflight/reset — FixIt has its own in core/_reboot.scss
  preflights: [],
  // Semantic z-index shortcuts (mirrors core/mixins/_z-index.scss)
  shortcuts: {
    'z-hide': 'z--1',
    'z-auto': 'z-auto',
    'z-base': 'z-1',
    'z-loading': 'z-10',
    'z-sticky': 'z-100',
    'z-fixed': 'z-200',
  },
  // Block unused or false-positive utilities
  blocklist: [
    'container',
    /^h[1-6]$/,
    // Block legacy Font Awesome icons (FA uses CSS font, not SVG)
    /^fa-/,
  ],
  // Always generate these utilities (used dynamically in templates)
  safelist: [
    'text-success',
    'text-error',
    'text-warning',
    'text-info',
    'text-primary',
    'bg-success',
    'bg-error',
    'bg-warning',
    'bg-info',
    'bg-primary',
    // For footer lines order, optional values: ["first", 0-5, "last"]
    'order-first',
    'order-last',
    'order-0',
    'order-1',
    'order-2',
    'order-3',
    'order-4',
    'order-5',
    // Responsive visibility
    'sm:hidden',
    'max-sm:hidden',
    'print:hidden',
    // Print page breaks
    'break-before-page',
    'break-after-page',
  ],
}))

export interface FixItConfigOptions {
  /**
   * Additional UnoCSS presets to include alongside FixIt defaults.
   */
  presets?: UserConfig['presets']
  /**
   * Override or extend the FixIt config.
   */
  overrides?: Partial<UserConfig>
}

/**
 * Create a complete UnoCSS config for FixIt.
 * Includes presetWind3, presetFixIt, and presetFixItIcons by default.
 */
export function createFixItConfig(options: FixItConfigOptions = {}): UserConfig {
  const { presets = [], overrides = {} } = options
  return {
    presets: [
      presetIcons({
        prefix: '',
        collections: {
          lucide: () => import('@iconify/json/json/lucide.json').then(i => i.default),
          octicon: () => import('@iconify/json/json/octicon.json').then(i => i.default),
        },
        extraProperties: {
          'display': 'inline-block',
          'vertical-align': 'text-bottom',
        },
      }),
      presetWind3(),
      presetFixIt(),
      ...presets,
    ],
    ...overrides,
  }
}
