/** Shared types and constants for the search module. */

/** A single search result returned by any engine. */
export interface SearchResult {
  uri: string
  title: string
  date: string
  context: string
  icon?: string
  heading?: string
  tags?: string[]
  categories?: string[]
  collections?: string[]
}

/** Common interface for all search engine backends. */
export interface SearchEngine {
  search: (query: string, maxResultLength: number) => Promise<SearchResult[]>
  preload?: () => Promise<void>
  destroy?: () => void
}

/** Search configuration */
export interface SearchConfig {
  type?: string
  placeholder?: string
  maxResultLength?: number
  snippetLength?: number
  highlightTag?: string
  isCaseSensitive?: boolean
  minMatchCharLength?: number
  findAllMatches?: boolean
  location?: number
  threshold?: number
  distance?: number
  ignoreLocation?: boolean
  useExtendedSearch?: boolean
  ignoreFieldNorm?: boolean
  fuseIndexURL?: string
  algoliaAppID?: string
  algoliaSearchKey?: string
  algoliaIndex?: string
  noResultsFound?: string
  clearText?: string
}

/** Pagefind engine configuration */
export interface PagefindConfig {
  bundlePath?: string
  debounceTimeoutMs?: number
  useBuiltInFilters?: boolean
  sortBy?: 'date' | 'title'
  sortOrder?: 'asc' | 'desc'
}

/** Google Custom Search Engine configuration */
export interface CSEConfig {
  engine?: string
  cx?: string
  resultsPage?: string
  searchIn?: string
  gotoResultsPage?: string
}
