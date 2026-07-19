import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { performance } from 'node:perf_hooks'
import { fileURLToPath } from 'node:url'
import consola from 'consola'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BENCH_DIR = '/tmp/post-encrypt-bench'

const PASSWORD_HASH = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

function generateTemplate(size: string): string {
  const count = size === 'small' ? 5 : size === 'medium' ? 50 : 500
  const content = '<p>This is some encrypted content that needs to be protected.</p>'.repeat(count)
  return `<div><template data-password="${PASSWORD_HASH}">${content}</template></div>`
}

function generateFile(templatesPerFile: number, templateSize: string): string {
  const parts = ['<!DOCTYPE html><html><body>']
  for (let i = 0; i < templatesPerFile; i++) {
    parts.push(generateTemplate(templateSize))
  }
  parts.push('</body></html>')
  return parts.join('\n')
}

function setup(fileCount: number, templatesPerFile: number, templateSize: string): void {
  execSync(`rm -rf ${BENCH_DIR} && mkdir -p ${BENCH_DIR}`)
  const content = generateFile(templatesPerFile, templateSize)
  for (let i = 0; i < fileCount; i++) {
    writeFileSync(`${BENCH_DIR}/page-${i}.html`, content)
  }
}

function run(): number {
  const start = performance.now()
  execSync(`npx tsx ${__dirname}/../index.ts --input ${BENCH_DIR}`, {
    encoding: 'utf8',
    cwd: __dirname,
  })
  return performance.now() - start
}

function bench(files: number, templatesPerFile: number, templateSize: string): void {
  setup(files, templatesPerFile, templateSize)
  const elapsed = run()
  const total = files * templatesPerFile
  const ms = Math.round(elapsed)
  const msFile = (elapsed / files).toFixed(2)
  const msTpl = (elapsed / total).toFixed(3)
  consola.info(
    `${String(files).padStart(6)} files | ${String(total).padStart(6)} tpl | ${String(ms).padStart(7)}ms | ${msFile.padStart(7)} ms/file | ${msTpl.padStart(8)} ms/tpl`,
  )
}

consola.info('=== post-encrypt benchmark ===\n')

consola.info('--- Test 1: 1 small template/file, scaling file count ---')
for (const n of [10, 50, 100, 500, 1000]) {
  bench(n, 1, 'small')
}

consola.info('\n--- Test 2: 100 files, scaling templates per file ---')
for (const n of [1, 5, 10, 20, 50]) {
  bench(100, n, 'small')
}

consola.info('\n--- Test 3: 100 files x 5 templates, scaling content size ---')
for (const s of ['small', 'medium', 'large']) {
  bench(100, 5, s)
}

execSync(`rm -rf ${BENCH_DIR}`)
consola.info('\nDone.')
