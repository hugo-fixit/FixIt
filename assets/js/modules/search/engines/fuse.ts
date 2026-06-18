import type { SearchConfig, SearchEngine, SearchResult } from '../types'
import { applyHighlightToText } from '../../../utils'

/**
 * Create a Fuse.js search engine instance.
 *
 * Lazily fetches and indexes the search JSON on first search.
 * @param searchConfig - The search configuration containing Fuse.js options.
 * @returns A SearchEngine instance for Fuse.js.
 */
export function createFuseEngine(searchConfig: SearchConfig): SearchEngine {
  return {
    async search(query: string, maxResultLength: number): Promise<SearchResult[]> {
      const highlightTag = searchConfig.highlightTag ?? 'em'

      function doSearch(): SearchResult[] {
        const results: Record<string, SearchResult> = {}
        window._fuseIndex!.search(query).forEach(({ item, matches }: any) => {
          let title = item.title
          let content = item.content
          matches.forEach(({ indices, key }: any) => {
            if (key === 'content') {
              content = applyHighlightToText(content, indices, highlightTag)
            }
            else if (key === 'title') {
              title = applyHighlightToText(title, indices, highlightTag)
            }
          })
          results[item.uri] = {
            uri: item.uri,
            title,
            date: item.date,
            context: content,
          }
        })
        return Object.values(results).slice(0, maxResultLength)
      }

      if (!window._fuseIndex) {
        try {
          const response = await fetch(searchConfig.fuseIndexURL!)
          const data = await response.json()
          window._fuseIndex = new window.Fuse!(data, {
            isCaseSensitive: searchConfig.isCaseSensitive ?? false,
            findAllMatches: searchConfig.findAllMatches ?? false,
            minMatchCharLength: searchConfig.minMatchCharLength ?? 1,
            location: searchConfig.location ?? 0,
            threshold: searchConfig.threshold ?? 0.3,
            distance: searchConfig.distance ?? 100,
            ignoreLocation: searchConfig.ignoreLocation ?? false,
            useExtendedSearch: searchConfig.useExtendedSearch ?? false,
            ignoreFieldNorm: searchConfig.ignoreFieldNorm ?? false,
            includeScore: false,
            shouldSort: true,
            includeMatches: true,
            keys: ['content', 'title'],
          })
          return doSearch()
        }
        catch (err) {
          console.error(err)
          return []
        }
      }
      return doSearch()
    },
  }
}
