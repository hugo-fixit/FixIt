import fs from 'node:fs'
import path from 'node:path'
import { fromRoot } from '@hugo-fixit/shared'

export interface PartialParam {
  name: string
  type: string
  description: string
  children: PartialParam[]
}

export interface PartialDoc {
  name: string
  path: string
  description: string
  params: PartialParam[]
  returns: string
  examples: string[]
}

export interface PartialGroup {
  name: string
  description: string
  partials: PartialDoc[]
}

const GROUP_DESCRIPTIONS: Record<string, string> = {
  _debug: 'Debug utilities for development.',
  base: 'Core layout partials (header, footer, breadcrumb, paginator, comment, widgets, assets).',
  feed: 'RSS feed generation.',
  function: 'Reusable utility and helper function partials.',
  gen: 'Generated or config output partials.',
  home: 'Homepage-specific partials.',
  init: 'Theme initialization partials (version, environment detection, compatibility, global setup).',
  plugin: 'Third-party plugin integration partials.',
  section: 'Section-level partials.',
  single: 'Single-post page partials.',
  store: 'Asset accumulation store partials.',
}

/**
 * Extract the leading Hugo comment block from file content.
 */
function extractComment(content: string): string | null {
  const match = content.match(/^\{\{-?\s*\/\*[\s\S]*?\*\/\s*-?\}\}/)
  if (!match)
    return null
  // Strip the delimiters: {{- /* at start, */ -}} at end
  const inner = match[0]
    .replace(/^\{\{-?\s*\/\*\s*/, '')
    .replace(/\s*\*\/\s*-?\}\}$/, '')
  return inner.trim()
}

/**
 * Split a comment block into sections by @tags.
 * Returns an array of {key, lines} pairs, preserving order and duplicates.
 */
function splitByTags(block: string): { key: string, lines: string[] }[] {
  const sections: { key: string, lines: string[] }[] = []
  const lines = block.split('\n')
  let currentKey = '_desc'
  let current: string[] = []

  function flush() {
    if (current.length > 0) {
      sections.push({ key: currentKey, lines: [...current] })
      current = []
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()
    const tagMatch = trimmed.match(/^@(param|return|example)\b/)
    if (tagMatch) {
      flush()
      currentKey = tagMatch[1]
      current.push(line)
    }
    else {
      current.push(line)
    }
  }
  flush()

  return sections
}

/**
 * Parse `@param {Type} .Name - description` lines from param sections.
 */
function parseParams(paramLines: string[]): PartialParam[] {
  const params: PartialParam[] = []
  let current: PartialParam | null = null

  for (const line of paramLines) {
    const trimmed = line.trim()
    if (!trimmed)
      continue

    const paramMatch = trimmed.match(/^@param \{([^}]+)\} (\S+)(?:\s*- (.+))?$/)
    if (paramMatch) {
      current = {
        name: paramMatch[2],
        type: paramMatch[1],
        description: paramMatch[3] || '',
        children: [],
      }
      params.push(current)
      continue
    }

    const childMatch = trimmed.match(/^-\s+(\w+): (.*)$/)
    if (childMatch && current) {
      current.children.push({
        name: childMatch[1],
        type: '',
        description: childMatch[2].trim(),
        children: [],
      })
      continue
    }

    if (current && !trimmed.startsWith('@')) {
      current.description += (current.description ? ' ' : '') + trimmed
    }
  }

  return params
}

/**
 * Parse `@return {Type} description` from return sections.
 */
function parseReturn(returnLines: string[]): string {
  for (const line of returnLines) {
    const match = line.trim().match(/@return\s+\{([^}]+)\}\s*(.*)/)
    if (match)
      return `\`${match[1]}\`${match[2] ? ` - ${match[2].trim()}` : ''}`
  }
  return ''
}

/**
 * Parse `@example` blocks from example sections.
 */
/**
 * Strip common leading whitespace from an array of lines.
 */
function dedent(lines: string[]): string[] {
  const nonEmpty = lines.filter(l => l.trim() !== '')
  if (nonEmpty.length === 0)
    return lines
  const minIndent = Math.min(...nonEmpty.map(l => l.match(/^(\s*)/)![1].length))
  return lines.map(l => l.slice(minIndent))
}

function parseExamples(exampleLines: string[]): string[] {
  const examples: string[] = []
  const current: string[] = []
  let firstLine = true

  for (const line of exampleLines) {
    const trimmed = line.trim()
    if (firstLine) {
      firstLine = false
      const inline = trimmed.replace(/^@example\s*/, '')
      if (inline) {
        examples.push(inline)
        continue
      }
      continue
    }
    current.push(line)
  }

  if (current.length > 0) {
    examples.push(dedent(current).join('\n').trim())
  }

  return examples.filter(Boolean)
}

/**
 * Extract description text from the pre-tag section.
 * Preserves bullet lists (lines starting with `- `) and paragraph breaks.
 */
function parseDescription(descLines: string[]): string {
  const lines = descLines
    .map(l => l.trim())
    .filter(l => l !== '---' && !l.startsWith('- .'))

  const result: string[] = []
  let paragraph: string[] = []

  function flushParagraph() {
    if (paragraph.length > 0) {
      let text = paragraph.join(' ')
      if (text && !/^https?:\/\//i.test(text))
        text = text.charAt(0).toUpperCase() + text.slice(1)
      if (text && !/[.!?:]$/.test(text))
        text += '.'
      result.push(text)
      paragraph = []
    }
  }

  for (const line of lines) {
    if (line === '') {
      flushParagraph()
    }
    else if (line.startsWith('- ')) {
      flushParagraph()
      const text = line.slice(2)
      const capitalized = /^https?:\/\//i.test(text) ? text : `${text.charAt(0).toUpperCase()}${text.slice(1)}`
      result.push(`- ${capitalized}`)
    }
    else {
      paragraph.push(line)
    }
  }
  flushParagraph()

  // Join with double newlines, but consecutive list items use single newlines
  let output = ''
  for (let i = 0; i < result.length; i++) {
    if (i > 0) {
      const prevIsList = result[i - 1].startsWith('- ')
      const currIsList = result[i].startsWith('- ')
      output += (prevIsList && currIsList) ? '\n' : '\n\n'
    }
    output += result[i]
  }

  return output.trim()
}

/**
 * Parse a single partial HTML file into a PartialDoc.
 */
function parsePartialFile(filePath: string, relativePath: string): PartialDoc {
  const content = fs.readFileSync(filePath, 'utf-8')
  const comment = extractComment(content)

  const doc: PartialDoc = {
    name: relativePath,
    path: relativePath,
    description: '',
    params: [],
    returns: '',
    examples: [],
  }

  if (!comment)
    return doc

  const sections = splitByTags(comment)
  const descLines = sections.filter(s => s.key === '_desc').flatMap(s => s.lines)
  const paramLines = sections.filter(s => s.key === 'param').flatMap(s => s.lines)
  const returnLines = sections.filter(s => s.key === 'return').flatMap(s => s.lines)
  const exampleSections = sections.filter(s => s.key === 'example')

  doc.description = parseDescription(descLines)
  doc.params = parseParams(paramLines)
  doc.returns = parseReturn(returnLines)
  doc.examples = exampleSections.flatMap(s => parseExamples(s.lines))

  return doc
}

/**
 * Recursively collect all .html files from a directory.
 */
function collectHtmlFiles(dir: string, baseDir: string): { filePath: string, relativePath: string }[] {
  const results: { filePath: string, relativePath: string }[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.relative(baseDir, fullPath)

    if (entry.isDirectory()) {
      results.push(...collectHtmlFiles(fullPath, baseDir))
    }
    else if (entry.name.endsWith('.html')) {
      results.push({ filePath: fullPath, relativePath })
    }
  }

  return results
}

/**
 * Parse all Hugo partials from layouts/_partials/ and group by directory.
 */
export function parsePartials(partialsDir?: string): PartialGroup[] {
  const dir = partialsDir || fromRoot('layouts/_partials')

  if (!fs.existsSync(dir)) {
    throw new Error(`Partials directory not found: ${dir}`)
  }

  const files = collectHtmlFiles(dir, dir)
  const groupMap = new Map<string, PartialDoc[]>()

  for (const { filePath, relativePath } of files) {
    const doc = parsePartialFile(filePath, relativePath)
    const dirName = path.dirname(relativePath)
    const group = dirName === '.' ? '(root)' : dirName

    if (!groupMap.has(group)) {
      groupMap.set(group, [])
    }
    groupMap.get(group)!.push(doc)
  }

  // Sort groups by name, with (root) last
  const groups: PartialGroup[] = []
  const sortedKeys = [...groupMap.keys()].sort((a, b) => {
    if (a === '(root)')
      return 1
    if (b === '(root)')
      return -1
    return a.localeCompare(b)
  })

  for (const key of sortedKeys) {
    const partials = groupMap.get(key)!.sort((a, b) => a.name.localeCompare(b.name))
    groups.push({
      name: key,
      description: GROUP_DESCRIPTIONS[key] || '',
      partials,
    })
  }

  return groups
}
