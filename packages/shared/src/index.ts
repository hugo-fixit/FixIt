import path from 'node:path'

export * from './utils'

export const workspaceRoot = path.resolve(__dirname, '../../../')

export { default as consola } from 'consola'
