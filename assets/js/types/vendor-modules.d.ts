/**
 * Third-party module declarations used by vendored libraries.
 *
 * Add future per-library declarations here when importing files that do not
 * ship TypeScript types (for example, local .mjs/.js vendor files).
 */

declare module '../../lib/fuse/fuse.mjs' {
  export interface FuseSearchResult<T> {
    item: T
    refIndex: number
    score?: number
    matches?: Array<Record<string, any>>
  }

  export interface FuseSearchOptions {
    limit?: number
  }

  export default class Fuse<T> {
    constructor(list: readonly T[], options?: Record<string, any>, index?: unknown)
    search(pattern: string, options?: FuseSearchOptions): FuseSearchResult<T>[]
    setCollection(docs: readonly T[], index?: unknown): void
  }
}

// Generic fallback for vendored ESM modules without declarations.
declare module '*.mjs' {
  const mod: any
  export default mod
}
