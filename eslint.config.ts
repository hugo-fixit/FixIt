import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  ignores: [
    'node_modules/**',
    'assets/css/unocss.css',
    'assets/lib/**',
    'public/**',
    'layouts/**/*.json',
    'layouts/**/*.xml',
    'layouts/**/*.md',
    '**/*.template.*',
  ],
})
