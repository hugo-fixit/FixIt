/** Shared types and constants for the search module. */

/** A single search result returned by any engine. */
export interface SearchResult {
  uri: string
  title: string
  date: string
  context: string
  icon?: string
}

/** Common interface for all search engine backends. */
export interface SearchEngine {
  search: (query: string, maxResultLength: number) => Promise<SearchResult[]>
  preload?: () => Promise<void>
  destroy?: () => void
}
