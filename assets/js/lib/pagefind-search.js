const ABSOLUTE_URL_RE = /^(?:[a-z]+:)?\/\//i;

const normalizeBundlePath = (path, baseURL) => {
  let bundlePath = typeof path === 'string' && path.length > 0 ? path : 'pagefind/';
  if (!bundlePath.endsWith('/')) {
    bundlePath = `${bundlePath}/`;
  }
  if (ABSOLUTE_URL_RE.test(bundlePath)) {
    return bundlePath;
  }
  return new URL(bundlePath, baseURL || document.baseURI).toString();
};

const toObject = (value) => (value && typeof value === 'object' ? value : {});

const normalizeSortOrder = (value) => (
  String(value).toLowerCase() === 'asc'
    ? 'asc'
    : 'desc'
);

const replaceExcerptHighlightTag = (excerpt, highlightTag) => {
  if (!excerpt || !highlightTag || highlightTag === 'mark') {
    return excerpt || '';
  }

  return excerpt
    .replaceAll('<mark>', `<${highlightTag}>`)
    .replaceAll('</mark>', `</${highlightTag}>`);
};

export function createPagefindSearch(searchConfig) {
  const pagefindConfig = toObject(searchConfig.pagefind);
  const bundlePath = normalizeBundlePath(pagefindConfig.bundlePath, pagefindConfig.baseURL);
  const rawDebounceTimeout = Number(pagefindConfig.debounceTimeoutMs ?? 300);
  const debounceTimeout = Number.isFinite(rawDebounceTimeout) ? Math.max(0, rawDebounceTimeout) : 300;
  const builtInFiltersEnabled = pagefindConfig.useBuiltInFilters !== false;
  const sortBy = typeof pagefindConfig.sortBy === 'string' ? pagefindConfig.sortBy.trim() : '';
  const sortOrder = normalizeSortOrder(pagefindConfig.sortOrder);
  const highlightTag = searchConfig.highlightTag ?? 'em';
  const excerptLength = Number(searchConfig.snippetLength ?? 30);

  const state = {
    loading: null,
    initialized: false,
    availableFilters: null,
  };

  const ensurePagefind = async () => {
    if (!state.loading) {
      state.loading = import(`${bundlePath}pagefind.js`)
        .then(async (mod) => {
          if (!state.initialized) {
            const options = {};
            if (Number.isFinite(excerptLength) && excerptLength >= 0) {
              options.excerptLength = excerptLength;
            }
            if (Object.keys(options).length && typeof mod.options === 'function') {
              await mod.options(options);
            }
            await mod.init();
            state.initialized = true;
          }
          return mod;
        })
        .catch((error) => {
          state.loading = null;
          throw error;
        });
    }
    return state.loading;
  };

  const getAvailableFilters = async () => {
    if (state.availableFilters) return state.availableFilters;

    const pagefind = await ensurePagefind();
    if (typeof pagefind.filters !== 'function') {
      state.availableFilters = {};
      return state.availableFilters;
    }

    try {
      state.availableFilters = toObject(await pagefind.filters());
    } catch (error) {
      console.warn('[FixIt] failed to read Pagefind filters:', error);
      state.availableFilters = {};
    }
    return state.availableFilters;
  };

  return {
    preload() {
      return ensurePagefind();
    },
    async search(query, maxResultLength) {
      if (!query || !query.trim()) return [];

      const pagefind = await ensurePagefind();
      const searchOptions = {};

      if (builtInFiltersEnabled) {
        const availableFilters = await getAvailableFilters();
        const filters = {};
        if (Object.prototype.hasOwnProperty.call(availableFilters, 'hidden')) {
          filters.hidden = 'false';
        }
        if (Object.prototype.hasOwnProperty.call(availableFilters, 'encrypted')) {
          filters.encrypted = 'false';
        }
        if (Object.keys(filters).length) {
          searchOptions.filters = filters;
        }
      }

      if (sortBy) {
        searchOptions.sort = { [sortBy]: sortOrder };
      }

      const resultLimit = Number.isFinite(maxResultLength)
        ? Math.max(0, Math.floor(maxResultLength))
        : 10;

      const searched = debounceTimeout > 0 && typeof pagefind.debouncedSearch === 'function'
        ? await pagefind.debouncedSearch(query, searchOptions, debounceTimeout)
        : await pagefind.search(query, searchOptions);

      if (searched === null) return null;

      const records = await Promise.all(
        (searched.results || []).slice(0, resultLimit).map((entry) => entry.data()),
      );

      return records.map((item) => ({
        uri: item.url || '#',
        title: item.meta?.title || item.url || '',
        date: item.meta?.date || '',
        context: replaceExcerptHighlightTag(item.excerpt || '', highlightTag),
      }));
    },
  };
}
