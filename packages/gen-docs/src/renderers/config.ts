function now(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T00:00:00+08:00`
}

export function renderConfig(body: string): string {
  const lines: string[] = []

  lines.push('---')
  lines.push('title: Configuration Reference')
  lines.push('shortTitle: Configuration')
  lines.push(`date: ${now()}`)
  lines.push('description: Hugo configuration reference for the FixIt Hugo theme.')
  lines.push('collections:')
  lines.push('  - References')
  lines.push('---')
  lines.push('')
  lines.push('This page is auto-generated from `hugo.toml`. Do not edit manually.')
  lines.push('')
  lines.push('<!--more-->')
  lines.push('')
  lines.push(body)

  return lines.join('\n')
}

/**
 * Render standalone config docs with frontmatter (for CLI -o output).
 */
export function renderConfigStandalone(body: string): string {
  const lines: string[] = []

  lines.push('---')
  lines.push('title: FixIt Theme Configuration')
  lines.push(`date: ${now()}`)
  lines.push('---')
  lines.push('')
  lines.push(body)

  return lines.join('\n')
}
