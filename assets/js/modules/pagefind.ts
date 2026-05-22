/** Pagefind search engine integration with lazy loading, filters, and debounced search. */

/** Matches absolute URLs (e.g. "https://..." or "//...") */
const ABSOLUTE_URL_RE = /^(?:[a-z]+:)?\/\//i

/**
 * Normalize a Pagefind bundle path to a full URL.
 * Relative paths are resolved against the given baseURL or document.baseURI.
 * @param path - The raw bundle path from config.
 * @param baseURL - Optional base URL for resolving relative paths.
 * @returns The fully resolved bundle URL.
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

/**
 * Safely cast a value to a plain object; returns `{}` for non-objects.
 * @param value - The value to cast.
 * @returns A plain object, or `{}` if the value is not an object.
 */
const toObject = (value: unknown): Record<string, unknown> => (value && typeof value === 'object' ? value as Record<string, unknown> : {})

/**
 * Normalize sort order to 'asc' or 'desc', defaulting to 'desc'.
 * @param value - The raw sort order value.
 * @returns `'asc'` or `'desc'`.
 */
function normalizeSortOrder(value: unknown): 'asc' | 'desc' {
  return String(value).toLowerCase() === 'asc'
    ? 'asc'
    : 'desc'
}

/**
 * Replace `<mark>` tags in Pagefind excerpts with the configured highlight tag.
 * @param excerpt - The excerpt string from Pagefind.
 * @param highlightTag - The target HTML tag name.
 * @returns The excerpt with replaced highlight tags.
 */
function replaceExcerptHighlightTag(excerpt: string, highlightTag: string): string {
  if (!excerpt || !highlightTag || highlightTag === 'mark') {
    return excerpt || ''
  }
  return excerpt
    .replaceAll('<mark>', `<${highlightTag}>`)
    .replaceAll('</mark>', `</${highlightTag}>`)
}

/**
 * Create a Pagefind search instance with lazy-loading and built-in filters.
 *
 * @param searchConfig - The search configuration object from FixIt theme config.
 *   Expects `searchConfig.pagefind` to contain Pagefind-specific options:
 *   - `bundlePath` - Path to the Pagefind bundle directory (default: 'pagefind/')
 *   - `baseURL` - Base URL for resolving relative bundle paths
 *   - `debounceTimeoutMs` - Debounce timeout in ms for search queries (default: 300)
 *   - `useBuiltInFilters` - Whether to apply built-in filters for hidden/encrypted pages (default: true)
 *   - `sortBy` - Field name to sort results by
 *   - `sortOrder` - Sort direction: 'asc' or 'desc' (default: 'desc')
 * @returns An object with `preload()` and `search(query, maxResultLength?)` methods.
 */
export function createPagefindSearch(searchConfig: Record<string, any>) {
  const pagefindConfig = toObject(searchConfig.pagefind)
  const bundlePath = normalizeBundlePath(pagefindConfig.bundlePath as string, pagefindConfig.baseURL as string)
  const rawDebounceTimeout = Number(pagefindConfig.debounceTimeoutMs ?? 300)
  const debounceTimeout = Number.isFinite(rawDebounceTimeout) ? Math.max(0, rawDebounceTimeout) : 300
  const builtInFiltersEnabled = pagefindConfig.useBuiltInFilters !== false
  const sortBy = typeof pagefindConfig.sortBy === 'string' ? (pagefindConfig.sortBy as string).trim() : ''
  const sortOrder = normalizeSortOrder(pagefindConfig.sortOrder)
  const highlightTag = searchConfig.highlightTag ?? 'em'
  const excerptLength = Number(searchConfig.snippetLength ?? 30)

  /** Internal state for lazy-loading the Pagefind library. */
  const state: {
    loading: Promise<any> | null
    initialized: boolean
    availableFilters: Record<string, any> | null
  } = {
    loading: null,
    initialized: false,
    availableFilters: null,
  }

  /**
   * Lazy-load and initialize the Pagefind library.
   * The module is imported on first call; subsequent calls return the cached promise.
   */
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

  /**
   * Retrieve available Pagefind filters (e.g. "hidden", "encrypted").
   * Results are cached after the first successful fetch.
   */
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
    /** Preload the Pagefind library so the first search is faster. */
    preload() {
      return ensurePagefind()
    },

    /**
     * Search for a query string using Pagefind.
     *
     * @param query - The search query.
     * @param maxResultLength - Maximum number of results to return (default: 10).
     * @returns A list of search results with `uri`, `title`, `date`, and `context` fields,
     *   or `null` if the search was aborted by Pagefind (e.g. superseded by a newer query).
     */
    async search(query: string, maxResultLength?: number) {
      if (!query || !query.trim())
        return []

      const pagefind = await ensurePagefind()
      const searchOptions: Record<string, any> = {}

      // Apply built-in filters to exclude hidden and encrypted pages
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

      const resultLimit = Number.isFinite(maxResultLength)
        ? Math.max(0, Math.floor(maxResultLength!))
        : 10

      // Use debounced search when available to avoid rapid-fire queries
      const searched = debounceTimeout > 0 && typeof pagefind.debouncedSearch === 'function'
        ? await pagefind.debouncedSearch(query, searchOptions, debounceTimeout)
        : await pagefind.search(query, searchOptions)

      if (searched === null)
        return null

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
