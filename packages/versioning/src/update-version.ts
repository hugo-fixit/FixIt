/* eslint-disable no-console */
import { execSync, execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { workspaceRoot } from '@hugo-fixit/shared'

/**
 * Update the version of the FixIt
 * @param type version type
 */
export function updateVersion(type: 'dev' | 'prod') {
  const branch: string = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
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
  const gitDiff: string = execSync('git diff --cached --name-only').toString().trim()

  if (type !== 'prod') {
    // Avoid conflicts when creating a Pull Request
    if (!['dev', 'main'].includes(branch)) {
      console.log(`The current branch is ${branch}, no need to update the FixIt version.`)
      process.exit(0)
    }
    if (!match.some(item => gitDiff.includes(item))) {
      console.log('No need to update the FixIt version.')
      process.exit(0)
    }
  }
  const initHtmlPath: string = join(workspaceRoot, 'layouts/_partials/init/index.html')
  const packageJsonPath: string = join(workspaceRoot, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const version: string = packageJson.version
  // Get the short hash of the last commit (can not get this commit hash at pre-commit hook)
  const shortHash: string = execSync('git rev-parse --short HEAD').toString().trim()
  // Build the development version v{major}.{minor}.{patch+1}-{timestamp}-{shortHash}
  // e.g. v0.3.21-20250702061540-abcdefg
  const timestamp: string = new Date().toISOString().replace(/[-:TZ]/g, '').slice(0, -4)
  const devVersion: string = `${version.replace(/(\d+)$/, (match, part) => (Number.parseInt(part) + 1).toString())}-${timestamp}-${shortHash}`
  const initHtml: string = fs.readFileSync(initHtmlPath, 'utf8')
  const latestVersion: string = type === 'prod' ? version : devVersion
  const versionRegex: RegExp = /v\d+\.\d+\.\d+(-[\w.\-]+)?/
  const lastVersion: string = initHtml.match(versionRegex)![0].slice(1)
  const newInitHtml: string = initHtml.replace(versionRegex, `v${latestVersion}`)

  if (lastVersion === version && gitDiff.includes('layouts/_partials/init/index.html')) {
    // After running `npm version` or manually modifying the version number, skip the update
    console.log(`The FixIt version has been updated to v${lastVersion}.`)
    process.exit(0)
  }

  // Update the version number in layouts/_partials/init/index.html
  fs.writeFileSync(initHtmlPath, newInitHtml)
  // Add the updated files to the git stage
  const toStageFiles: string[] = [
    'layouts/_partials/init/index.html',
    'package.json',
    'package-lock.json',
    'pnpm-lock.yaml',
  ]
  toStageFiles.forEach((file) => {
    const stageFile = join(workspaceRoot, file)
    if (fs.existsSync(stageFile)) {
      execFileSync('git', ['add', stageFile])
    }
  })
  console.log(`Update the FixIt version from v${lastVersion} to v${latestVersion}.`)
}
