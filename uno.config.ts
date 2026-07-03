import { defineConfig, presetIcons, presetWind3 } from 'unocss'

export default defineConfig({
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
  ],
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
  // Always generate order utilities (used dynamically in templates)
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
  // Scan Hugo templates for class usage
  content: {
    filesystem: [
      'layouts/**/*.html',
      'assets/js/**/*.ts',
    ],
    pipeline: {
      exclude: ['node_modules', 'dist'],
    },
  },
  // CLI entry for unocss / unocss:watch
  cli: {
    entry: [
      {
        patterns: ['layouts/**/*.html', 'assets/js/**/*.ts'],
        outFile: 'assets/css/unocss.css',
      },
    ],
  },
})
