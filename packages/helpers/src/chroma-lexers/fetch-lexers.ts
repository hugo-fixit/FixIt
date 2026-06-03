import { Buffer } from 'node:buffer'
import { execSync } from 'node:child_process'
import process from 'node:process'
import consola from 'consola'
import ora from 'ora'

export interface LexerEntry {
  name: string
  aliases: string[]
}

interface GitHubContentEntry {
  name: string
  type: string
  sha: string
}

interface GitHubBlobResponse {
  content: string
  encoding: string
}

const CONCURRENCY = 10

async function getLatestChromaRef(): Promise<string> {
  if (process.env.CHROMA_REF) {
    return process.env.CHROMA_REF
  }
  try {
    const res = await fetch('https://api.github.com/repos/alecthomas/chroma/releases/latest', {
      headers: getHeaders(),
    })
    if (res.ok) {
      const data = await res.json() as { tag_name: string }
      return data.tag_name
    }
  }
  catch {}
  return 'v2.24.1'
}

function getGitHubToken(): string | undefined {
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN
  }
  try {
    return execSync('gh auth token', { encoding: 'utf-8' }).trim()
  }
  catch {
    return undefined
  }
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': '@hugo-fixit/helpers',
  }
  const token = getGitHubToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

async function fetchBlobContent(sha: string): Promise<string> {
  const url = `https://api.github.com/repos/alecthomas/chroma/git/blobs/${sha}`
  const res = await fetch(url, { headers: getHeaders() })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for blob ${sha}`)
  }
  const data: GitHubBlobResponse = await res.json() as GitHubBlobResponse
  if (data.encoding === 'base64') {
    return Buffer.from(data.content, 'base64').toString('utf-8')
  }
  return data.content
}

async function fetchDirectoryListing(dir: string, ref: string): Promise<Array<{ name: string, sha: string }>> {
  const url = `https://api.github.com/repos/alecthomas/chroma/contents/${dir}?ref=${ref}&per_page=300`
  const res = await fetch(url, { headers: getHeaders() })
  if (!res.ok) {
    throw new Error(`Failed to fetch directory listing for ${dir}: HTTP ${res.status}`)
  }
  const entries: GitHubContentEntry[] = await res.json() as GitHubContentEntry[]
  return entries
    .filter(e => e.type === 'file')
    .map(e => ({ name: e.name, sha: e.sha }))
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#39;/g, '\'')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
}

function parseLexerXml(xml: string): LexerEntry[] {
  const nameMatch = xml.match(/<name>(.*?)<\/name>/)
  if (!nameMatch)
    return []

  const name = decodeHtmlEntities(nameMatch[1])
  const aliases: string[] = []
  const aliasRegex = /<alias>(.*?)<\/alias>/g
  for (let match = aliasRegex.exec(xml); match !== null; match = aliasRegex.exec(xml)) {
    aliases.push(match[1])
  }

  return [{ name, aliases }]
}

function parseLexerGo(content: string): LexerEntry[] {
  const results: LexerEntry[] = []
  // Split by MustNewLexer to handle each lexer definition separately
  const blocks = content.split('MustNewLexer(')

  for (const block of blocks) {
    const nameMatch = block.match(/Name:\s*"([^"]+)"/)
    if (!nameMatch)
      continue

    const name = nameMatch[1]
    const aliasesMatch = block.match(/Aliases:\s*\[\]string\{([^}]*)\}/)
    const aliases = aliasesMatch
      ? aliasesMatch[1]
          .split(',')
          .map(s => s.trim().replace(/^"|"$/g, ''))
          .filter(s => s.length > 0)
      : []

    results.push({ name, aliases })
  }

  return results
}

async function processBatch(
  files: Array<{ name: string, sha: string }>,
  parser: (content: string) => LexerEntry[],
): Promise<LexerEntry[]> {
  const results: LexerEntry[] = []
  const failed: string[] = []

  await Promise.all(
    files.map(async ({ name, sha }) => {
      try {
        const content = await fetchBlobContent(sha)
        const entries = parser(content)
        results.push(...entries)
      }
      catch {
        failed.push(name)
      }
    }),
  )

  if (failed.length > 0) {
    consola.warn(`Warning: failed to fetch ${failed.length} file(s): ${failed.join(', ')}`)
  }

  return results
}

export async function fetchLexers(): Promise<LexerEntry[]> {
  const ref = await getLatestChromaRef()
  consola.info(`Loading lexer definitions from chroma@${ref}`)
  const spinner = ora('Fetching lexers...').start()

  // Fetch XML-defined lexers from embedded/ directory
  const xmlFiles = (await fetchDirectoryListing('lexers/embedded', ref))
    .filter(f => f.name.endsWith('.xml'))

  // Fetch Go-implemented lexers from lexers/ directory
  const goFiles = (await fetchDirectoryListing('lexers', ref))
    .filter(f => f.name.endsWith('.go') && !f.name.endsWith('_test.go') && f.name !== 'lexers.go')

  const total = xmlFiles.length + goFiles.length
  const results: LexerEntry[] = []
  let fetched = 0

  for (let i = 0; i < xmlFiles.length; i += CONCURRENCY) {
    const batch = xmlFiles.slice(i, i + CONCURRENCY)
    results.push(...await processBatch(batch, parseLexerXml))
    fetched += batch.length
    spinner.text = `Fetching lexers... (${fetched}/${total})`
  }

  for (let i = 0; i < goFiles.length; i += CONCURRENCY) {
    const batch = goFiles.slice(i, i + CONCURRENCY)
    results.push(...await processBatch(batch, parseLexerGo))
    fetched += batch.length
    spinner.text = `Fetching lexers... (${fetched}/${total})`
  }

  results.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
  spinner.succeed(`Fetched ${results.length} lexers from ${xmlFiles.length} XML + ${goFiles.length} Go files.`)
  return results
}
