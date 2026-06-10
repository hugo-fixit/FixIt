import { execSync } from 'node:child_process'

export function runCommand(cmd: string): string {
  return execSync(cmd, { encoding: 'utf-8' }).trim()
}
