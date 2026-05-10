import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  ignores: [
    'node_modules/**',
    'assets/lib/**',
    'assets/js/lib/mermaid.js',
    'public/**',
    'layouts/**/*.json',
    'layouts/**/*.xml',
    'layouts/**/*.md',
    // 临时忽略
    'assets/js/**',
  ],
})
