#!/usr/bin/env node
import { Buffer } from 'node:buffer'
import { createCipheriv, pbkdf2Sync, randomBytes } from 'node:crypto'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import consola from 'consola'

const AES_CIPHER = 'aes-256-gcm'
const AES_MARKER = 'aes-256-gcm-v2'
const PBKDF2_ITERATIONS = 100_000
const SALT_LENGTH = 16
const IV_LENGTH = 12
const OPEN_TAG = '<template'
const CLOSE_TAG = '</template>'

interface CliOptions {
  input: string
  cwd: string
  dryRun: boolean
  verifyOnly: boolean
}

interface TemplateMatch {
  openStart: number
  openEnd: number
  closeStart: number
  closeEnd: number
  attrs: string
  content: string
}

function parseArgs(argv: string[]): CliOptions {
  // INIT_CWD is set by pnpm to the original working directory
  const options: CliOptions = {
    input: 'public',
    cwd: process.env.INIT_CWD || process.cwd(),
    dryRun: false,
    verifyOnly: false,
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--input') {
      options.input = argv[i + 1] || options.input
      i++
      continue
    }
    if (arg.startsWith('--input=')) {
      options.input = arg.slice('--input='.length)
      continue
    }
    if (arg === '--dry-run') {
      options.dryRun = true
      continue
    }
    if (arg === '--verify') {
      options.verifyOnly = true
      continue
    }
  }

  return options
}

function collectHtmlFiles(targetDir: string): string[] {
  const files: string[] = []

  function walk(dir: string) {
    for (const name of readdirSync(dir)) {
      const fullPath = path.join(dir, name)
      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        walk(fullPath)
        continue
      }
      if (stat.isFile() && fullPath.endsWith('.html')) {
        files.push(fullPath)
      }
    }
  }

  walk(targetDir)
  return files
}

/**
 * Find all matching `<template>...</template>` pairs with depth tracking.
 * Only returns pairs whose open tag has `data-password` (encryption templates).
 */
function findEncryptionTemplates(html: string): TemplateMatch[] {
  const allMatches: TemplateMatch[] = []
  const opens: number[] = []
  const closes: number[] = []

  let pos = 0
  while (pos < html.length) {
    const openIdx = html.indexOf(OPEN_TAG, pos)
    const closeIdx = html.indexOf(CLOSE_TAG, pos)

    if (openIdx === -1 && closeIdx === -1)
      break

    if (openIdx !== -1 && (closeIdx === -1 || openIdx < closeIdx)) {
      opens.push(openIdx)
      pos = openIdx + OPEN_TAG.length
    }
    else {
      closes.push(closeIdx)
      pos = closeIdx + CLOSE_TAG.length
    }
  }

  // Match open/close pairs using a stack
  const stack: number[] = []
  const pairs: Array<{ open: number, close: number }> = []

  let oi = 0
  let ci = 0
  while (oi < opens.length || ci < closes.length) {
    if (oi < opens.length && (ci >= closes.length || opens[oi] < closes[ci])) {
      stack.push(opens[oi])
      oi++
    }
    else {
      if (stack.length > 0) {
        pairs.push({ open: stack.pop()!, close: closes[ci] })
      }
      ci++
    }
  }

  // Extract match details, filtering to encryption templates only
  for (const { open, close } of pairs) {
    const openEnd = html.indexOf('>', open)
    if (openEnd === -1 || openEnd > close)
      continue

    const attrs = html.slice(open + OPEN_TAG.length, openEnd)
    // Skip non-encryption templates (those without data-password)
    if (!/\bdata-password\s*=/.test(attrs))
      continue

    const content = html.slice(openEnd + 1, close)
    const closeEnd = close + CLOSE_TAG.length
    allMatches.push({ openStart: open, openEnd: openEnd + 1, closeStart: close, closeEnd, attrs, content })
  }

  return allMatches
}

/**
 * Check if a match's content contains nested unencrypted encryption templates.
 * Already-encrypted nested blocks (with data-cipher) are ignored.
 */
function hasNestedUnencryptedTemplate(match: TemplateMatch): boolean {
  const regex = /<template\b(?=[^>]+\bdata-password\b)(?![^>]+\bdata-cipher\s*=)/
  return regex.test(match.content)
}

function deriveKey(passwordHash: string, salt: Buffer): Buffer {
  return pbkdf2Sync(passwordHash, salt, PBKDF2_ITERATIONS, 32, 'sha256')
}

/**
 * Derive a verification hash from the SHA-256 password hash using PBKDF2.
 * This replaces the raw SHA-256 hash stored in `data-password`, making brute-force attacks harder.
 */
function deriveVerificationHash(passwordHash: string): { hash: string, salt: Buffer } {
  const salt = randomBytes(SALT_LENGTH)
  const hash = pbkdf2Sync(passwordHash, salt, PBKDF2_ITERATIONS, 32, 'sha256').toString('hex')
  return { hash, salt }
}

function encryptPayload(plaintext: string, passwordHash: string): string {
  const salt = randomBytes(SALT_LENGTH)
  const iv = randomBytes(IV_LENGTH)
  const key = deriveKey(passwordHash, salt)
  const cipher = createCipheriv(AES_CIPHER, key, iv)
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()
  const encryptedWithTag = Buffer.concat([encrypted, tag])
  return `${salt.toString('base64')}.${iv.toString('base64')}.${encryptedWithTag.toString('base64')}`
}

function encryptTemplatesInHtml(html: string): { content: string, changed: boolean } {
  let changed = false
  let result = html

  // Process from innermost to outermost to avoid double-encryption
  while (true) {
    const matches = findEncryptionTemplates(result)
    const pending = matches.filter(m =>
      !hasNestedUnencryptedTemplate(m)
      && !String(m.attrs).includes('data-cipher="aes-256-gcm-v2"')
      && !String(m.attrs).includes('data-cipher="aes-256-gcm-v1"'),
    )

    if (pending.length === 0)
      break

    // Process in reverse order to preserve positions
    for (let i = pending.length - 1; i >= 0; i--) {
      const match = pending[i]
      const attrs = String(match.attrs)

      const passwordMatch = attrs.match(/\bdata-password\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/)
      if (!passwordMatch)
        continue

      const passwordHash = passwordMatch[1] || passwordMatch[2] || passwordMatch[3]
      if (!passwordHash)
        continue

      // Replace raw SHA-256 hash with PBKDF2 verification hash
      const { hash: verifyHash, salt: verifySalt } = deriveVerificationHash(passwordHash)
      const encryptedPayload = encryptPayload(match.content, passwordHash)
      const replacedAttrs = attrs.replace(/\bdata-password\s*=\s*(?:"[^"]+"|'[^']+'|[^\s>]+)/, `data-password="${verifyHash}"`)
      const newAttrs = `${replacedAttrs} data-verify-salt="${verifySalt.toString('base64')}" data-cipher="${AES_MARKER}"`
      const newBlock = `<template${newAttrs}>${encryptedPayload}</template>`

      result = result.slice(0, match.openStart) + newBlock + result.slice(match.closeEnd)
      changed = true
    }
  }

  return { content: result, changed }
}

function hasUnencryptedTemplate(matches: TemplateMatch[]): boolean {
  return matches.some((match) => {
    const attrs = String(match.attrs)
    const hasAesMarker = /\bdata-cipher\s*=\s*"aes-256-gcm-v[12]"/.test(attrs)
    return !hasAesMarker
  })
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const targetDir = path.isAbsolute(options.input)
    ? options.input
    : path.resolve(options.cwd, options.input)

  let htmlFiles: string[] = []
  try {
    htmlFiles = collectHtmlFiles(targetDir)
  }
  catch (error) {
    consola.error(`Failed to scan input directory: ${targetDir}`)
    consola.error(error)
    process.exit(1)
  }

  let changedFiles = 0
  let unencryptedFiles = 0
  let totalTemplates = 0
  for (const filePath of htmlFiles) {
    const originalContent = readFileSync(filePath, 'utf8')
    const matches = findEncryptionTemplates(originalContent)
    totalTemplates += matches.length

    if (hasUnencryptedTemplate(matches)) {
      unencryptedFiles++
      if (options.verifyOnly) {
        consola.warn(`Unencrypted template found in: ${path.relative(options.cwd, filePath)}`)
        continue
      }
    }

    if (options.verifyOnly)
      continue

    const { content, changed } = encryptTemplatesInHtml(originalContent)
    if (!changed)
      continue

    changedFiles++
    if (!options.dryRun) {
      writeFileSync(filePath, content, 'utf8')
    }
  }

  if (options.verifyOnly) {
    if (unencryptedFiles > 0) {
      consola.warn(`Verification failed: ${unencryptedFiles} HTML files still contain unencrypted templates`)
      process.exit(1)
    }
    if (totalTemplates === 0) {
      consola.info('No encryption templates found.')
    }
    else {
      consola.info(`Verification passed: all ${totalTemplates} encryption templates use ${AES_MARKER}`)
    }
    return
  }

  if (changedFiles === 0) {
    consola.info('No encryption templates found or all already encrypted.')
    return
  }

  if (options.dryRun) {
    consola.info(`Dry run complete: ${changedFiles} HTML files would be updated (${AES_MARKER})`)
    return
  }

  consola.info(`Post-build encryption completed: ${changedFiles} HTML files updated (${AES_MARKER})`)
}

main()
