import type { PartialDoc, PartialGroup } from '../parsers/partial-parser'

/**
 * Escape HTML tags in text to prevent them from being rendered as actual HTML.
 * Skips content inside backtick code spans.
 */
function escapeHtml(text: string): string {
  return text.replace(/`[^`]*`|<[^>]+>/g, (match) => {
    if (match.startsWith('`'))
      return match
    return match.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  })
}

function renderParamTable(params: PartialDoc['params']): string {
  if (params.length === 0)
    return ''

  const lines: string[] = []
  lines.push('**Parameters:**')
  lines.push('')
  lines.push('| Name | Type | Description |')
  lines.push('|------|------|-------------|')

  for (const param of params) {
    const name = `\`${param.name}\``
    const type = param.type ? `\`${param.type}\`` : ''
    const desc = escapeHtml(param.description || '')
    lines.push(`| ${name} | ${type} | ${desc} |`)

    for (const child of param.children) {
      const childFullName = param.name === '.' ? `.${child.name}` : `${param.name}.${child.name}`
      const childName = `\`${childFullName}\``
      const childType = child.type ? `\`${child.type}\`` : ''
      const childDesc = escapeHtml(child.description || '')
      lines.push(`| ${childName} | ${childType} | ${childDesc} |`)
    }
  }

  return lines.join('\n')
}

function renderPartial(doc: PartialDoc): string {
  const lines: string[] = []

  lines.push(`### ${doc.name}`)
  lines.push('')

  if (!doc.description && doc.params.length === 0 && !doc.returns && doc.examples.length === 0) {
    lines.push('_No documentation._')
    return lines.join('\n')
  }

  if (doc.description) {
    lines.push(escapeHtml(doc.description))
    lines.push('')
  }

  const paramTable = renderParamTable(doc.params)
  if (paramTable) {
    lines.push(paramTable)
    lines.push('')
  }

  if (doc.returns) {
    lines.push(`**Returns:** ${escapeHtml(doc.returns)}`)
    lines.push('')
  }

  if (doc.examples.length > 0) {
    lines.push('**Example:**')
    lines.push('')
    for (const example of doc.examples) {
      lines.push('```go-template')
      lines.push((example))
      lines.push('```')
      lines.push('')
    }
  }

  // Trim trailing blank lines
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop()
  }

  return lines.join('\n')
}

function renderGroup(group: PartialGroup): string {
  const lines: string[] = []

  const count = group.partials.length
  const header = group.name === '(root)' ? '(root)' : `${group.name}/`
  lines.push(`## ${header}`)
  lines.push('')

  if (group.description) {
    lines.push(`> ${group.description}`)
    lines.push('')
  }

  lines.push(`> ${count} partial${count !== 1 ? 's' : ''}`)
  lines.push('')

  for (const partial of group.partials) {
    lines.push(renderPartial(partial))
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Generate Hugo partials documentation from parsed groups.
 * @param groups Parsed partial groups
 * @returns Markdown documentation body (no frontmatter)
 */
export function generatePartialsDocs(groups: PartialGroup[]): string {
  const lines: string[] = []

  // Summary
  const totalCount = groups.reduce((sum, g) => sum + g.partials.length, 0)
  lines.push(`The FixIt theme provides **${totalCount}** Hugo partials across **${groups.length}** groups.`)
  lines.push('')

  // TOC
  lines.push('## Groups')
  lines.push('')
  for (const group of groups) {
    const header = group.name === '(root)' ? '(root)' : `${group.name}/`
    const count = group.partials.length
    lines.push(`- [${header}](#${group.name.replace(/[()/]/g, '').toLowerCase()}) — ${count} partial${count !== 1 ? 's' : ''}`)
  }
  lines.push('')

  // Groups
  for (const group of groups) {
    lines.push(renderGroup(group))
  }

  return lines.join('\n')
}
