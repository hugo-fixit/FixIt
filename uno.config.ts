import { createFixItConfig } from '@hugo-fixit/unocss-preset'

export default createFixItConfig({
  overrides: {
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
  },
})
