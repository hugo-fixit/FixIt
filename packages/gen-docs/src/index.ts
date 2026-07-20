import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { consola, fromRoot } from '@hugo-fixit/shared'
import { Command } from 'commander'
import c from 'picocolors'
import { applyTemplate, generateDocs } from './parsers/config-parser'
import { renderConfigStandalone } from './renderers/config'

function writeFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content, 'utf-8')
  consola.success(`Written ${c.cyan(filePath)}`)
}

// ─── Subcommands ───

async function configAction(
  file: string,
  options: { output?: string, template?: string },
): Promise<void> {
  let source = file
  let content: string

  if (source === 'latest') {
    consola.start('Resolving latest FixIt release version...')
    try {
      const res = await fetch('https://api.github.com/repos/hugo-fixit/FixIt/releases/latest', {
        headers: {
          'User-Agent': 'gen-docs',
          ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
        },
      })
      if (!res.ok)
        throw new Error(`HTTP ${res.status}`)
      const { tag_name: version } = await res.json() as { tag_name: string }
      source = `https://raw.githubusercontent.com/hugo-fixit/FixIt/refs/tags/${version}/hugo.toml`
      consola.success(`Resolved latest release: ${c.cyan(version)}`)
    }
    catch (error) {
      consola.error(`Failed to resolve latest release: ${(error as Error).message}`)
      process.exit(1)
    }
  }

  if (/^https?:\/\//i.test(source)) {
    consola.start(`Downloading from: ${c.cyan(source)}`)
    try {
      const res = await fetch(source)
      if (!res.ok)
        throw new Error(`HTTP ${res.status}`)
      content = await res.text()
      consola.success('Remote file downloaded.')
    }
    catch (error) {
      consola.error(`Failed to download: ${(error as Error).message}`)
      process.exit(1)
    }
  }
  else {
    const inputPath = source === 'hugo.toml' ? fromRoot('hugo.toml') : path.resolve(process.cwd(), source)
    if (!fs.existsSync(inputPath)) {
      consola.error(`File not found: ${inputPath}`)
      process.exit(1)
    }
    content = fs.readFileSync(inputPath, 'utf-8')
  }

  if (options.template) {
    const templatePath = path.resolve(process.cwd(), options.template)
    if (!fs.existsSync(templatePath)) {
      consola.error(`Template file not found: ${templatePath}`)
      process.exit(1)
    }
    const outputPath = options.output ? path.resolve(process.cwd(), options.output) : undefined
    let cmd = `gen-docs config ${file}`
    if (options.template)
      cmd += ` -t ${options.template}`
    if (options.output)
      cmd += ` -o ${options.output}`
    applyTemplate(content, templatePath, outputPath, cmd)
    const dest = outputPath || templatePath
    consola.success(`Documentation applied to template: ${c.cyan(dest)}`)
    return
  }

  const body = generateDocs(content)
  if (options.output) {
    const outPath = path.resolve(process.cwd(), options.output)
    writeFile(outPath, renderConfigStandalone(body))
  }
  else {
    process.stdout.write(`${body}\n`)
  }
}

function allAction(): void {
  // Config API — inject into docs params page
  consola.start('Parsing hugo.toml...')
  const tomlContent = fs.readFileSync(fromRoot('hugo.toml'), 'utf-8')
  const templatePath = fromRoot('../fixit-docs/content/en/documentation/getting-started/configuration/params/index.md')
  applyTemplate(tomlContent, templatePath, undefined, 'pnpm gen:docs')

  consola.success('Config docs generated!')
}

// ─── CLI ───

const program = new Command()

program
  .name('gen-docs')
  .description('Generate API reference documentation for the FixIt Hugo theme')

program
  .command('config')
  .description('Generate configuration reference from hugo.toml')
  .argument('[file]', 'Input hugo.toml path, URL, or "latest"', 'hugo.toml')
  .option('-o, --output <file>', 'Output file path (default: stdout)')
  .option('-t, --template <file>', 'Template file with HUGO_FIXIT_PARAMS markers to inject docs into')
  .action(configAction)

// Default action (no subcommand): inject config docs into docs params page
program
  .action(() => allAction())

program.parse()
