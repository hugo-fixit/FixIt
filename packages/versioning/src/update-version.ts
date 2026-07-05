import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import process from 'node:process'
import { consola, fromRoot, runCommand } from '@hugo-fixit/shared'

const VERSION_PATCH_RE = /(\d+)$/
const VERSION_RE = /v\d+\.\d+\.\d+(-[\w.-]+)?/

/**
 * Update the version of the FixIt
 * @param type version type
 */
export function updateVersion(type: 'dev' | 'prod') {
  const branch: string = runCommand('git rev-parse --abbrev-ref HEAD')
  const match: string[] = [
    'archetypes/',
    'assets/',
    'i18n/',
    'layouts/',
    'static/',
    'go.mod',
    'hugo.toml',
    'package.json',
    'package-lock.json',
    'pnpm-lock.yaml',
    'theme.toml',
  ]
  const stagedFiles: string[] = runCommand('git diff --cached --name-only')
    .split('\n')
    .map(file => file.trim())
    .filter(Boolean)

  // consola.info(
  //   'Node.js:',
  //   runCommand('which node'),
  //   process.version,
  // )

  if (type !== 'prod') {
    // Avoid conflicts when creating a Pull Request
    if (!['dev', 'main'].includes(branch)) {
      consola.info(`The current branch is ${branch}, no need to update the FixIt version.`)
      process.exit(0)
    }
    if (!match.some(item => item.endsWith('/')
      ? stagedFiles.some(file => file.startsWith(item))
      : stagedFiles.includes(item))) {
      consola.info('No need to update the FixIt version.')
      process.exit(0)
    }
  }
  const initHtmlPath: string = fromRoot('layouts/_partials/init/index.html')
  const packageJsonPath: string = fromRoot('package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const version: string = packageJson.version
  const timestamp: string = Date.now().toString(36)
  const nextVersion: string | undefined = packageJson.nextVersion
  // If `nextVersion` is set in package.json, use it as the base instead of auto-incrementing patch.
  const devBaseVersion: string = nextVersion ?? version.replace(VERSION_PATCH_RE, (_versionPatchMatch, part) => (Number.parseInt(part, 10) + 1).toString())
  // Development version syntax: v{major}.{minor}.{patch+1}-{timestamp(36)}
  // e.g. v0.3.21-mq7veaoa
  const devVersion: string = `${devBaseVersion}-${timestamp}`
  const initHtml: string = fs.readFileSync(initHtmlPath, 'utf8')
  const latestVersion: string = type === 'prod' ? version : devVersion
  const versionMatch = initHtml.match(VERSION_RE)
  if (!versionMatch) {
    throw new Error('Unable to find current version in layouts/_partials/init/index.html.')
  }
  const lastVersion: string = versionMatch[0].slice(1)
  const newInitHtml: string = initHtml.replace(VERSION_RE, `v${latestVersion}`)

  if (lastVersion === version && stagedFiles.includes('layouts/_partials/init/index.html')) {
    // After running `npm version` or manually modifying the version number, skip the update
    consola.info(`The FixIt version has been updated to v${lastVersion}.`)
    process.exit(0)
  }

  // Update the version number in layouts/_partials/init/index.html
  fs.writeFileSync(initHtmlPath, newInitHtml)
  // In prod mode, remove the `nextVersion` field from package.json if present
  if (type === 'prod' && nextVersion) {
    delete packageJson.nextVersion
    fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
    consola.info('Removed nextVersion field from package.json.')
  }
  // Add the updated files to the git stage
  const toStageFiles: string[] = [
    'layouts/_partials/init/index.html',
    'package.json',
    'pnpm-lock.yaml',
  ]
  toStageFiles.forEach((file) => {
    const stageFile = fromRoot(file)
    if (fs.existsSync(stageFile)) {
      execFileSync('git', ['add', stageFile])
    }
  })
  if (lastVersion !== latestVersion) {
    consola.info(`Update the FixIt version from v${lastVersion} to v${latestVersion}.`)
  }
}
