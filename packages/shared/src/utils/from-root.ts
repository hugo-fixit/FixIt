import path from 'node:path'
import { workspaceRoot } from '../index'

export function fromRoot(...segments: string[]): string {
  return path.join(workspaceRoot, ...segments)
}
