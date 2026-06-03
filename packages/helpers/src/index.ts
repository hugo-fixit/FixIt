import process from 'node:process'
import consola from 'consola'

async function main() {
  const helper = process.argv[2]
  if (!helper) {
    consola.error('Usage: pnpm -F helpers start <helper-name>')
    process.exit(1)
  }

  const mod = await import(`./${helper}/index.ts`).catch(() => {
    consola.error(`Unknown helper: ${helper}`)
    process.exit(1)
  })

  if (typeof mod.default === 'function') {
    await mod.default()
  }
}

main()
