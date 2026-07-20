import fs from 'node:fs'
import { fromRoot } from '@hugo-fixit/shared'
import toml from 'toml'

interface ParamDoc {
  name: string
  type: string
  defaultValue: string
  description: string
  children: ParamDoc[]
  isTable: boolean
  isArray: boolean
  rawValue: unknown
}

function isSeparatorComment(text: string): boolean {
  return /^[-=+]{3,}$/.test(text.trim())
    || /^[-=]{20,}\s*$/.test(text.trim())
    || /^\+{20,}\s*$/.test(text.trim())
    || /\s+#$/.test(text.trim())
}

function isHardSeparator(text: string): boolean {
  return /^[-=]{20,}\s*$/.test(text.trim())
    || /^\+{20,}\s*$/.test(text.trim())
}

function extractComments(content: string): { commentMap: Map<string, string[]>, pageLevelStartKey: string, pageLevelEndKey: string } {
  const commentMap = new Map<string, string[]>()
  const lines = content.split('\n')
  const pendingComments: string[] = []
  const sectionStack: string[] = []

  let inParams = false
  let sectionCommentCount = 0
  let afterHardSeparator = false
  let pageLevelStartKey = ''
  let pageLevelEndKey = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    const sectionMatch = trimmed.match(/^\[([^\]]+)\]$/)
    if (sectionMatch) {
      const key = sectionMatch[1]
      if (key === 'params') {
        inParams = true
        sectionStack.length = 0
        sectionStack.push('params')
        pendingComments.length = 0
        sectionCommentCount = 0
        continue
      }
      if (inParams && key.startsWith('params.')) {
        if (afterHardSeparator && !pageLevelEndKey && pageLevelStartKey) {
          pageLevelEndKey = key.split('.')[1]
          afterHardSeparator = false
        }
        let splitIdx = pendingComments.length
        let foundSplitPoint = false
        for (let j = i - 1; j >= 0; j--) {
          const prevLine = lines[j].trim()
          if (prevLine === '') {
            foundSplitPoint = true
            break
          }
          if (prevLine.startsWith('#')) {
            splitIdx--
            continue
          }
          foundSplitPoint = true
          break
        }
        if (foundSplitPoint && splitIdx > 0 && sectionStack.length > 1) {
          const sectionKey = sectionStack.slice(1).join('.')
          commentMap.set(sectionKey, pendingComments.slice(0, splitIdx))
        }
        const trailing = pendingComments.slice(splitIdx)
        pendingComments.length = 0
        pendingComments.push(...trailing)
        sectionCommentCount = trailing.length
        const parts = key.split('.')
        sectionStack.length = 0
        sectionStack.push(...parts)
        continue
      }
      if (inParams) {
        const rootKey = key.split('.')[0]
        const nonParamsSections = ['menus', 'markup', 'outputs', 'taxonomies', 'related', 'frontmatter', 'imaging', 'module', 'sitemap', 'minify', 'caches', 'security']
        if (nonParamsSections.includes(rootKey)) {
          inParams = false
          sectionStack.length = 0
          pendingComments.length = 0
          continue
        }
        let splitIdx = pendingComments.length
        for (let j = i - 1; j >= 0; j--) {
          const prevLine = lines[j].trim()
          if (prevLine === '')
            break
          if (prevLine.startsWith('#')) {
            splitIdx--
            continue
          }
          break
        }
        if (splitIdx > 0 && sectionStack.length > 1) {
          const sectionKey = sectionStack.slice(1).join('.')
          commentMap.set(sectionKey, pendingComments.slice(0, splitIdx))
        }
        const trailing = pendingComments.slice(splitIdx)
        pendingComments.length = 0
        pendingComments.push(...trailing)
        sectionStack.length = Math.min(sectionStack.length, 1)
        sectionStack.push(key)
        continue
      }
      continue
    }

    if (!inParams)
      continue

    if (trimmed.startsWith('#')) {
      const commentText = trimmed.replace(/^#\s?/, '')
      if (isSeparatorComment(commentText)) {
        if (isHardSeparator(commentText)) {
          pendingComments.length = 0
          afterHardSeparator = true
        }
        continue
      }
      pendingComments.push(commentText)
      continue
    }

    if (trimmed === '') {
      continue
    }

    const kvMatch = trimmed.match(/^(\w+)\s*=/)
    if (kvMatch && sectionStack.length > 0) {
      const keyName = kvMatch[1]
      const fullPath = [...sectionStack.slice(1), keyName].join('.')
      if (afterHardSeparator && !pageLevelStartKey && sectionStack.length === 1) {
        pageLevelStartKey = keyName
        afterHardSeparator = false
      }
      if (sectionStack.length > 1 && pendingComments.length > 0) {
        const sectionKey = sectionStack.slice(1).join('.')
        if (!commentMap.has(sectionKey) && sectionCommentCount > 0) {
          commentMap.set(sectionKey, pendingComments.slice(0, sectionCommentCount))
          pendingComments.splice(0, sectionCommentCount)
        }
        sectionCommentCount = 0
      }
      if (pendingComments.length > 0) {
        commentMap.set(fullPath, [...pendingComments])
        pendingComments.length = 0
      }
    }

    const arrayMatch = trimmed.match(/^\[\[(\w+(?:\.\w+)*)\]\]$/)
    if (arrayMatch && inParams) {
      const keyPath = arrayMatch[1]
      const fullPath = [...sectionStack.slice(1), keyPath].join('.')
      if (pendingComments.length > 0) {
        commentMap.set(fullPath, [...pendingComments])
        pendingComments.length = 0
      }
    }
  }

  return { commentMap, pageLevelStartKey, pageLevelEndKey }
}

function detectType(value: unknown): string {
  if (value === null || value === undefined)
    return 'string'
  if (typeof value === 'boolean')
    return 'bool'
  if (typeof value === 'number')
    return Number.isInteger(value) ? 'int' : 'float'
  if (typeof value === 'string')
    return 'string'
  if (Array.isArray(value)) {
    if (value.length === 0)
      return 'string array'
    return `${detectType(value[0])} array`
  }
  if (typeof value === 'object')
    return 'map'
  return 'string'
}

function formatDefault(value: unknown): string {
  if (value === null || value === undefined)
    return ''
  if (typeof value === 'string')
    return value === '' ? '`""`' : `\`${JSON.stringify(value)}\``
  if (typeof value === 'boolean')
    return `\`${value}\``
  if (typeof value === 'number')
    return `\`${value}\``
  if (Array.isArray(value)) {
    if (value.length === 0)
      return '`[]`'
    return `\`${JSON.stringify(value)}\``
  }
  return ''
}

function formatTomlValue(value: unknown): string {
  if (value === null || value === undefined)
    return '""'
  if (typeof value === 'string')
    return JSON.stringify(value)
  if (typeof value === 'boolean')
    return String(value)
  if (typeof value === 'number')
    return String(value)
  if (Array.isArray(value)) {
    if (value.length === 0)
      return '[]'
    return JSON.stringify(value)
  }
  return '""'
}

function isExampleLine(line: string): boolean {
  return /^\s*(?:"[^"]*"|'[^']*'|[\w.-]+)\s*=\s*.+/.test(line)
}

function joinComments(comments: string[]): string {
  if (comments.length === 0)
    return ''
  const filtered = comments.filter(c => c.trim() !== '')
  if (filtered.length === 0)
    return ''
  const sentences = filtered.map((line) => {
    const trimmed = line.trim()
    if (isExampleLine(trimmed)) {
      return `Example: \`${trimmed}\`.`
    }
    let s = trimmed
    if (!s.startsWith('http://') && !s.startsWith('https://')) {
      s = s.charAt(0).toUpperCase() + s.slice(1)
    }
    if (!s.endsWith('.') && !s.endsWith('!') && !s.endsWith('?'))
      s += '.'
    return s
  })
  return sentences.join(' ')
}

function documentSection(
  obj: Record<string, unknown>,
  commentMap: Map<string, string[]>,
  parentPath: string,
): ParamDoc[] {
  const docs: ParamDoc[] = []

  for (const [key, value] of Object.entries(obj)) {
    const fullPath = parentPath ? `${parentPath}.${key}` : key
    const comments = commentMap.get(fullPath) || []
    const type = detectType(value)
    const isTable = typeof value === 'object' && !Array.isArray(value) && value !== null
    const isArray = Array.isArray(value)

    const doc: ParamDoc = {
      name: key,
      type,
      defaultValue: formatDefault(value),
      description: joinComments(comments),
      children: [],
      isTable,
      isArray,
      rawValue: value,
    }

    if (isTable && !isArray) {
      doc.children = documentSection(
        value as Record<string, unknown>,
        commentMap,
        fullPath,
      )
    }

    docs.push(doc)
  }

  return docs
}

function rawDefault(doc: ParamDoc): string {
  const val = doc.defaultValue.replace(/`/g, '')
  return val || '""'
}

function renderTomlBlock(doc: ParamDoc, lines: string[], sectionPath: string): void {
  lines.push(`[params.${sectionPath}]`)

  for (const child of doc.children) {
    if (child.isTable) {
      lines.push('')
      lines.push(`[params.${sectionPath}.${child.name}]`)
      for (const grandchild of child.children) {
        if (grandchild.isTable) {
          lines.push('')
          lines.push(`[params.${sectionPath}.${child.name}.${grandchild.name}]`)
          for (const gg of grandchild.children) {
            lines.push(`${gg.name} = ${rawDefault(gg)}`)
          }
        }
        else {
          lines.push(`${grandchild.name} = ${rawDefault(grandchild)}`)
        }
      }
    }
    else if (child.isArray && Array.isArray(child.rawValue) && child.rawValue.length > 0 && typeof child.rawValue[0] === 'object') {
      for (const item of child.rawValue) {
        lines.push('')
        lines.push(`[[params.${sectionPath}.${child.name}]]`)
        for (const [k, v] of Object.entries(item as Record<string, unknown>)) {
          lines.push(`${k} = ${formatTomlValue(v)}`)
        }
      }
    }
    else {
      lines.push(`${child.name} = ${rawDefault(child)}`)
    }
  }
}

function renderChildren(children: ParamDoc[], lines: string[]): void {
  for (const child of children) {
    let meta = `\`${child.type}\``
    const desc = child.description.replace(/\.$/, '')
    if (child.defaultValue && child.type !== 'map') {
      meta += desc ? ` ${desc}. Default is ${child.defaultValue}.` : ` Default is ${child.defaultValue}.`
    }
    else if (desc) {
      meta += ` ${desc}.`
    }

    lines.push(child.name)
    lines.push(`: ${meta}`)
    lines.push('')

    if (child.children.length > 0) {
      for (const grandchild of child.children) {
        let gcMeta = `\`${grandchild.type}\``
        const gcDesc = grandchild.description.replace(/\.$/, '')
        if (grandchild.defaultValue && grandchild.type !== 'map') {
          gcMeta += gcDesc ? ` ${gcDesc}. Default is ${grandchild.defaultValue}.` : ` Default is ${grandchild.defaultValue}.`
        }
        else if (gcDesc) {
          gcMeta += ` ${gcDesc}.`
        }
        lines.push(`- ${grandchild.name}: ${gcMeta}`)
      }
      lines.push('')
    }
  }
}

function renderParam(doc: ParamDoc): string {
  const lines: string[] = []

  let meta = `\`${doc.type}\``
  const desc = doc.description.replace(/\.$/, '')
  if (doc.defaultValue && doc.type !== 'map') {
    meta += desc ? ` ${desc}. Default is ${doc.defaultValue}.` : ` Default is ${doc.defaultValue}.`
  }
  else if (desc) {
    meta += ` ${desc}.`
  }

  lines.push(`### ${doc.name}`)
  lines.push('')
  lines.push(meta)

  if (doc.children.length > 0) {
    lines.push('')

    const hasContent = (children: ParamDoc[]): boolean =>
      children.some(child => !child.isTable || (child.children.length > 0 && hasContent(child.children)))
    const codeBlock = hasContent(doc.children) ? '```toggle' : '```toml'

    lines.push(codeBlock)
    lines.push('[params]')
    lines.push('')
    renderTomlBlock(doc, lines, doc.name)
    lines.push('```')
    lines.push('')

    renderChildren(doc.children, lines)
  }

  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop()
  }
  return lines.map(line => line.trimEnd()).join('\n')
}

/**
 * Generate theme configuration documentation from TOML content string.
 * @param content TOML content string
 * @returns Markdown documentation body (no frontmatter)
 */
export function generateDocs(content: string): string {
  const parsed = toml.parse(content)

  if (!parsed.params) {
    throw new Error('No [params] section found in hugo.toml.')
  }

  const { commentMap, pageLevelStartKey, pageLevelEndKey } = extractComments(content)
  const params = parsed.params as Record<string, unknown>
  const docs = documentSection(params, commentMap, '')

  const siteLevel: ParamDoc[] = []
  const pageLevel: ParamDoc[] = []
  let isPageLevel = false

  for (const doc of docs) {
    if (pageLevelStartKey && doc.name === pageLevelStartKey) {
      isPageLevel = true
    }
    if (pageLevelEndKey && doc.name === pageLevelEndKey) {
      isPageLevel = false
    }
    if (isPageLevel) {
      pageLevel.push(doc)
    }
    else {
      siteLevel.push(doc)
    }
  }

  const output: string[] = []

  if (siteLevel.length > 0) {
    output.push('## Site Level')
    output.push('These apply to the entire site and cannot be overridden on a per-page basis.')
    for (const doc of siteLevel) {
      output.push(renderParam(doc))
    }
  }

  if (pageLevel.length > 0) {
    output.push('## Page Level')
    output.push('These can be overridden on a per-page basis via front matter.')
    for (const doc of pageLevel) {
      output.push(renderParam(doc))
    }
  }

  return output.join('\n\n').split('\n').map(line => line.trimEnd()).join('\n')
}

/**
 * Convenience: read hugo.toml from the FixIt repo root and generate docs.
 */
export function parseConfig(): string {
  const content = fs.readFileSync(fromRoot('hugo.toml'), 'utf-8')
  return generateDocs(content)
}

/**
 * Apply generated docs into a template file between markers.
 * Replaces content between `<!-- HUGO_FIXIT_PARAMS:START -->` and `<!-- HUGO_FIXIT_PARAMS:END -->`.
 * @param tomlContent TOML content string
 * @param templatePath Path to the template file
 * @param outputPath Optional output path (defaults to overwriting the template file)
 * @param command The CLI command that was used to generate the docs
 */
export function applyTemplate(tomlContent: string, templatePath: string, outputPath?: string, command?: string): void {
  const template = fs.readFileSync(templatePath, 'utf-8')
  const docs = generateDocs(tomlContent)

  const startMarker = '<!-- HUGO_FIXIT_PARAMS:START -->'
  const endMarker = '<!-- HUGO_FIXIT_PARAMS:END -->'

  const startIdx = template.indexOf(startMarker)
  const endIdx = template.indexOf(endMarker)

  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`Markers not found in template file. Expected both "${startMarker}" and "${endMarker}".`)
  }

  if (startIdx > endIdx) {
    throw new Error('START marker appears after END marker in template file.')
  }

  const before = template.slice(0, startIdx + startMarker.length)
  const after = template.slice(endIdx)
  const comment = command
    ? `<!--\nAutomatically generated by the \`${command}\` command.\nDo not modify it manually!\n-->\n\n`
    : ''
  const result = `${before}\n${comment}${docs}\n${after}`

  const dest = outputPath || templatePath
  fs.writeFileSync(dest, result, 'utf-8')
}
