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

/** Metadata for each search engine, used in the footer template. */
export const SEARCH_META: Record<string, { label: string, icon: string, href: string }> = {
  algolia: { label: 'algolia', icon: '<i class="fa-brands fa-algolia" aria-hidden="true"></i>', href: 'https://www.algolia.com/' },
  fuse: { label: 'Fuse.js', icon: '', href: 'https://fusejs.io/' },
  cse: { label: 'Google CSE', icon: '<i class="fa-brands fa-google" aria-hidden="true"></i>', href: 'https://programmablesearchengine.google.com/' },
  pagefind: { label: 'Pagefind', icon: '', href: 'https://pagefind.app/' },
}
