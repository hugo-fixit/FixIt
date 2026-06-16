import type { SearchConfig } from '../../../types/config'
import type { SearchEngine, SearchResult } from '../types'

/**
 * Create an Algolia search engine instance.
 *
 * Lazily initializes the Algolia v5 lite client on first search.
 */
export function createAlgoliaEngine(searchConfig: SearchConfig): SearchEngine {
  if (!searchConfig.algoliaAppID || !searchConfig.algoliaSearchKey || !searchConfig.algoliaIndex) {
    console.warn('[FixIt] Algolia is not configured. Please set `search.algolia.appID`, `search.algolia.searchKey`, and `search.algolia.index` in your site config.')
    return {
      async search() {
        return [{
          uri: '',
          title: 'Algolia is not configured',
          date: '',
          context: 'Please set <code>search.algolia.appID</code>, <code>search.algolia.searchKey</code>, and <code>search.algolia.index</code> in your site config.',
        }]
      },
    }
  }

  let algoliaIndex: {
    search: (query: string, params: Record<string, any>) => Promise<{ hits: any[] }>
  } | null = null

  function ensureClient() {
    if (algoliaIndex)
      return true
    const liteClient = (window as any)['algoliasearch/lite']?.liteClient
    if (!liteClient) {
      console.error('Algolia client is not available on window')
      return false
    }
    const client = liteClient(searchConfig.algoliaAppID, searchConfig.algoliaSearchKey)
    algoliaIndex = {
      search: (queryText: string, params: Record<string, any> = {}) => {
        const { offset, length, ...rest } = params
        const request: Record<string, any> = {
          indexName: searchConfig.algoliaIndex,
          query: queryText,
          ...rest,
        }
        if (typeof length === 'number')
          request.hitsPerPage = length
        if (typeof offset === 'number' && typeof length === 'number' && length > 0)
          request.page = Math.floor(offset / length)
        return client
          .search({ requests: [request] })
          .then((response: any) => ({ hits: response.results?.[0]?.hits ?? [] }))
      },
    }
    return true
  }

  return {
    async search(query: string, maxResultLength: number): Promise<SearchResult[]> {
      if (!ensureClient())
        return []
      const snippetLength = searchConfig.snippetLength ?? 50
      const highlightTag = searchConfig.highlightTag ?? 'em'
      try {
        const { hits } = await algoliaIndex!.search(query, {
          offset: 0,
          length: maxResultLength * 8,
          attributesToHighlight: ['title'],
          attributesToRetrieve: ['*'],
          attributesToSnippet: [`content:${snippetLength}`],
          highlightPreTag: `<${highlightTag}>`,
          highlightPostTag: `</${highlightTag}>`,
        })
        const results: Record<string, SearchResult> = {}
        hits.forEach(({ uri, date, _highlightResult: { title }, _snippetResult: { content } }: any) => {
          if (results[uri] && results[uri].context.length > content.value.length)
            return
          results[uri] = { uri, title: title.value, date, context: content.value }
        })
        return Object.values(results).slice(0, maxResultLength)
      }
      catch (err) {
        console.error(err)
        return []
      }
    },
  }
}
