import { createFixItConfig } from '@hugo-fixit/unocss-preset'

export default createFixItConfig({
  overrides: {
    // Scan Hugo templates for class usage
    content: {
      filesystem: [
        'layouts/**/*.html',
        'assets/js/**/*.ts',
        // Translation files contain prose, not class names.
        '!assets/js/i18n/**',
      ],
      pipeline: {
        exclude: ['node_modules', 'dist'],
      },
    },
    // CLI entry for unocss / unocss:watch
    cli: {
      entry: [
        {
          // Translation files contain prose, not class names.
          patterns: ['layouts/**/*.html', 'assets/js/**/*.ts', '!assets/js/i18n/**'],
          outFile: 'assets/css/unocss.css',
        },
      ],
    },
  },
})
