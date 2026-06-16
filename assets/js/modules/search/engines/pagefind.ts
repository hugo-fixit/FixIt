import type { SearchEngine, SearchResult } from '../types'

/** Matches absolute URLs (e.g. "https://..." or "//...") */
const ABSOLUTE_URL_RE = /^(?:[a-z]+:)?\/\//i

/**
 * Normalize a Pagefind bundle path to a full URL.
 * Relative paths are resolved against the given baseURL or document.baseURI.
 */
function normalizeBundlePath(path: string, baseURL?: string): string {
  let bundlePath = typeof path === 'string' && path.length > 0 ? path : 'pagefind/'
  if (!bundlePath.endsWith('/')) {
    bundlePath = `${bundlePath}/`
  }
  if (ABSOLUTE_URL_RE.test(bundlePath)) {
    return bundlePath
  }
  return new URL(bundlePath, baseURL || document.baseURI).toString()
}

/** Safely cast a value to a plain object; returns `{}` for non-objects. */
const toObject = (value: unknown): Record<string, unknown> => (value && typeof value === 'object' ? value as Record<string, unknown> : {})

/** Normalize sort order to 'asc' or 'desc', defaulting to 'desc'. */
function normalizeSortOrder(value: unknown): 'asc' | 'desc' {
  return String(value).toLowerCase() === 'asc' ? 'asc' : 'desc'
}

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
 */
export function createPagefindEngine(searchConfig: Record<string, any>): SearchEngine {
  const pagefindConfig = toObject(searchConfig.pagefind)
  const bundlePath = normalizeBundlePath(pagefindConfig.bundlePath as string, pagefindConfig.baseURL as string)
  const rawDebounceTimeout = Number(pagefindConfig.debounceTimeoutMs ?? 300)
  const debounceTimeout = Number.isFinite(rawDebounceTimeout) ? Math.max(0, rawDebounceTimeout) : 300
  const builtInFiltersEnabled = pagefindConfig.useBuiltInFilters !== false
  const sortBy = typeof pagefindConfig.sortBy === 'string' ? (pagefindConfig.sortBy as string).trim() : ''
  const sortOrder = normalizeSortOrder(pagefindConfig.sortOrder)
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
      state.loading = import(/* @vite-ignore */ `${bundlePath}pagefind.js`)
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
      state.availableFilters = toObject(await pagefind.filters())
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

      return records.map((item: any) => ({
        uri: item.url || '#',
        title: item.meta?.title || item.url || '',
        date: item.meta?.date || '',
        context: replaceExcerptHighlightTag(item.excerpt || '', highlightTag),
      }))
    },
  }
}
