import type { PagefindConfig, SearchConfig, SearchEngine, SearchResult } from '../types'

/** Replace `<mark>` tags in Pagefind excerpts with the configured highlight tag. */
function replaceExcerptHighlightTag(excerpt: string, highlightTag: string): string {
  if (!excerpt || !highlightTag || highlightTag === 'mark') {
    return excerpt || ''
  }
  return excerpt
    .replaceAll('<mark>', `<${highlightTag}>`)
    .replaceAll('</mark>', `</${highlightTag}>`)
}

/**
 * Create a Pagefind search engine with lazy-loading and built-in filters.
 *
 * Wraps the Pagefind library to conform to the `SearchEngine` interface.
 * @param searchConfig - The search configuration.
 * @param pagefindConfig - The Pagefind engine configuration.
 * @returns A SearchEngine instance for Pagefind.
 */
export function createPagefindEngine(searchConfig: SearchConfig, pagefindConfig: PagefindConfig): SearchEngine {
  const bundlePath = pagefindConfig.bundlePath || 'pagefind/'
  const rawDebounceTimeout = Number(pagefindConfig.debounceTimeoutMs ?? 300)
  const debounceTimeout = Number.isFinite(rawDebounceTimeout) ? Math.max(0, rawDebounceTimeout) : 300
  const builtInFiltersEnabled = pagefindConfig.useBuiltInFilters !== false
  const sortBy = pagefindConfig.sortBy
  const sortOrder = pagefindConfig.sortOrder ?? 'desc'
  const highlightTag = searchConfig.highlightTag ?? 'em'
  const excerptLength = Number(searchConfig.snippetLength ?? 30)

  const state: {
    loading: Promise<any> | null
    initialized: boolean
    availableFilters: Record<string, any> | null
  } = {
    loading: null,
    initialized: false,
    availableFilters: null,
  }

  const ensurePagefind = async () => {
    if (!state.loading) {
      state.loading = import(`${bundlePath}pagefind.js`)
        .then(async (mod: any) => {
          if (!state.initialized) {
            const options: Record<string, any> = {}
            if (Number.isFinite(excerptLength) && excerptLength >= 0) {
              options.excerptLength = excerptLength
            }
            if (Object.keys(options).length && typeof mod.options === 'function') {
              await mod.options(options)
            }
            await mod.init()
            state.initialized = true
          }
          return mod
        })
        .catch((error: Error) => {
          state.loading = null
          throw error
        })
    }
    return state.loading
  }

  const getAvailableFilters = async () => {
    if (state.availableFilters)
      return state.availableFilters
    const pagefind = await ensurePagefind()
    if (typeof pagefind.filters !== 'function') {
      state.availableFilters = {}
      return state.availableFilters
    }
    try {
      state.availableFilters = (await pagefind.filters()) as Record<string, any> ?? {}
    }
    catch (error) {
      console.warn('[FixIt] failed to read Pagefind filters:', error)
      state.availableFilters = {}
    }
    return state.availableFilters
  }

  return {
    preload() {
      return ensurePagefind()
    },

    async search(query: string, maxResultLength: number): Promise<SearchResult[]> {
      if (!query || !query.trim())
        return []

      const pagefind = await ensurePagefind()
      const searchOptions: Record<string, any> = {}

      if (builtInFiltersEnabled) {
        const availableFilters = await getAvailableFilters()
        const filters: Record<string, string> = {}
        if (Object.hasOwn(availableFilters, 'hidden')) {
          filters.hidden = 'false'
        }
        if (Object.hasOwn(availableFilters, 'encrypted')) {
          filters.encrypted = 'false'
        }
        if (Object.keys(filters).length) {
          searchOptions.filters = filters
        }
      }

      if (sortBy) {
        searchOptions.sort = { [sortBy]: sortOrder }
      }

      const resultLimit = Math.max(0, Math.floor(maxResultLength))

      const searched = debounceTimeout > 0 && typeof pagefind.debouncedSearch === 'function'
        ? await pagefind.debouncedSearch(query, searchOptions, debounceTimeout)
        : await pagefind.search(query, searchOptions)

      if (searched === null)
        return []

      const records = await Promise.all(
        (searched.results || []).slice(0, resultLimit).map((entry: any) => entry.data()),
      )

      return records.map((item: any) => {
        const url = item.url || '#'
        const hashIndex = url.indexOf('#')
        let heading: string | undefined
        if (hashIndex > 0 && item.sub_results?.length) {
          const subResult = item.sub_results.find((sr: any) => sr.url === url)
          heading = subResult?.title || undefined
        }
        return {
          uri: url,
          title: item.meta?.title || item.url || '',
          date: item.meta?.date || '',
          context: replaceExcerptHighlightTag(item.excerpt || '', highlightTag),
          heading,
          tags: item.meta?.tags ? item.meta.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : undefined,
          categories: item.meta?.categories ? item.meta.categories.split(',').map((t: string) => t.trim()).filter(Boolean) : undefined,
          collections: item.meta?.collections ? item.meta.collections.split(',').map((t: string) => t.trim()).filter(Boolean) : undefined,
        }
      })
    },
  }
}
