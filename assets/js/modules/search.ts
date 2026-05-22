/** Search module — Algolia, Fuse.js, CSE, and Pagefind search engine integration. */
import type { CoreService, SearchService } from '../core/tokens'
import { applyHighlightToText, HTMLEscape, isMobile } from '../utils'
import { createPagefindSearch } from './pagefind'

const SEARCH_META: Record<string, { label: string, icon: string, href: string }> = {
  algolia: { label: 'algolia', icon: '<i class="fa-brands fa-algolia" aria-hidden="true"></i>', href: 'https://www.algolia.com/' },
  fuse: { label: 'Fuse.js', icon: '', href: 'https://fusejs.io/' },
  cse: { label: 'Google CSE', icon: '<i class="fa-brands fa-google" aria-hidden="true"></i>', href: 'https://programmablesearchengine.google.com/' },
  pagefind: { label: 'Pagefind', icon: '', href: 'https://pagefind.app/' },
}

export class SearchModule implements SearchService {
  private _searchMobileOnce: boolean | undefined
  private _searchDesktopOnce: boolean | undefined
  private _searchMobile: any
  private _searchDesktop: any
  private _algoliaIndex: any
  private _pagefindSearch: ReturnType<typeof createPagefindSearch> | undefined

  constructor(private readonly core: CoreService) {}

  /**
   * Reset search UI: close header, hide loading/clear, clear input value.
   * @param $header - The header element containing the search.
   * @param $searchLoading - The loading indicator element.
   * @param $searchClear - The clear button element.
   * @param searchInstance - The autocomplete instance to clear.
   */
  _resetSearchUI($header: HTMLElement, $searchLoading: HTMLElement, $searchClear: HTMLElement, searchInstance: any) {
    $header.classList.remove('open')
    $searchLoading.style.display = 'none'
    $searchClear.style.display = 'none'
    searchInstance && searchInstance.autocomplete.setVal('')
    document.getElementById(`search-toggle-${$header.id.replace('header-', '')}`)?.setAttribute('aria-expanded', 'false')
  }

  /** Initialize the search overlay, autocomplete, and engine-specific logic. */
  initSearch() {
    const searchConfig = this.core.config.search
    const _isMobile = isMobile()
    if (
      !searchConfig
      || (_isMobile && this._searchMobileOnce)
      || (!_isMobile && this._searchDesktopOnce)
    ) {
      return
    }
    const {
      maxResultLength = 10,
      snippetLength = 50,
      highlightTag = 'em',
      fuseIndexURL,
    } = searchConfig
    const suffix = _isMobile ? 'mobile' : 'desktop'
    const $header = document.getElementById(`header-${suffix}`)!
    const $searchInput = document.getElementById(`search-input-${suffix}`) as HTMLInputElement
    const $searchToggle = document.getElementById(`search-toggle-${suffix}`)
    const $searchLoading = document.getElementById(`search-loading-${suffix}`) as HTMLElement
    const $searchClear = document.getElementById(`search-clear-${suffix}`) as HTMLElement
    const $searchCancel = document.getElementById('search-cancel-mobile')
    const $menuToggleMobile = document.getElementById('menu-toggle-mobile')
    const $menuMobile = document.getElementById('menu-mobile')
    if (!$header || !$searchInput || !$searchToggle || !$searchLoading || !$searchClear)
      return
    const setSearchExpanded = (expanded: boolean) => {
      $searchToggle?.setAttribute('aria-expanded', expanded ? 'true' : 'false')
    }
    const overlayName = `search-${suffix}`
    const openSearch = () => {
      if (_isMobile && $menuToggleMobile && $menuMobile) {
        this.core.disableScrollEvent = true
        $menuToggleMobile.classList.add('active')
        $menuMobile.classList.add('active')
        $menuToggleMobile.setAttribute('aria-expanded', 'true')
      }
      $header.classList.add('open')
      setSearchExpanded(true)
      !_isMobile && $searchInput.focus()
    }
    const closeSearch = () => {
      if (_isMobile && $menuToggleMobile && $menuMobile) {
        this.core.disableScrollEvent = false
        $menuToggleMobile.classList.remove('active')
        $menuMobile.classList.remove('active')
        $menuToggleMobile.setAttribute('aria-expanded', 'false')
      }
      this._resetSearchUI($header, $searchLoading, $searchClear, _isMobile ? this._searchMobile : this._searchDesktop)
    }

    // goto the PostChat panel rather than search results
    if (searchConfig.type === 'post-chat' && window.postChatUser) {
      if (_isMobile) {
        $searchInput.addEventListener('focus', () => {
          window.postChatUser.setSearchInput('')
        }, false)
      }
      else {
        $searchToggle.addEventListener('click', () => {
          window.postChatUser.setSearchInput('')
        }, false)
      }
      return
    }

    if (_isMobile) {
      this._searchMobileOnce = true
      this.core.registerMaskOverlay(overlayName, {
        isActive: () => $header.classList.contains('open'),
        onOpen: openSearch,
        onClose: closeSearch,
      })
      $searchInput.addEventListener('focus', () => {
        this.core.openMaskOverlay(overlayName)
      }, false)
      $searchCancel?.addEventListener('click', () => {
        this.core.closeMaskOverlay(overlayName)
      }, false)
      $searchClear.addEventListener('click', () => {
        this.core.disableScrollEvent = false
        $searchClear.style.display = 'none'
        this._searchMobile && this._searchMobile.autocomplete.setVal('')
      }, false)
    }
    else {
      this._searchDesktopOnce = true
      this.core.registerMaskOverlay(overlayName, {
        isActive: () => $header.classList.contains('open'),
        onOpen: openSearch,
        onClose: closeSearch,
      })
      $searchToggle.addEventListener('click', () => {
        this.core.toggleMaskOverlay(overlayName)
      }, false)
      $searchClear.addEventListener('click', () => {
        $searchClear.style.display = 'none'
        this._searchDesktop && this._searchDesktop.autocomplete.setVal('')
      }, false)
    }
    $searchInput.addEventListener('input', () => {
      if ($searchInput.value === '')
        $searchClear.style.display = 'none'
      else $searchClear.style.display = 'inline'
    }, false)
    if (searchConfig.type === 'pagefind') {
      this._pagefindSearch = this._pagefindSearch || createPagefindSearch(searchConfig)
      $searchInput.addEventListener('focus', () => {
        this._pagefindSearch!.preload().catch((error: Error) => {
          console.error(error)
        })
      }, { once: true })
    }

    const initAutosearch = () => {
      const autosearch = window.autocomplete!(`#search-input-${suffix}`, {
        hint: false,
        autoselect: true,
        dropdownMenuContainer: `#search-dropdown-${suffix}`,
        clearOnSelected: true,
        cssClasses: { noPrefix: true },
        debug: false,
      }, {
        name: 'search',
        source: (query: string, callback: (results: any[]) => void) => {
          $searchLoading.style.display = 'inline'
          $searchClear.style.display = 'none'
          const finish = (results: any[]) => {
            $searchLoading.style.display = 'none'
            $searchClear.style.display = 'inline'
            callback(results)
          }
          if (searchConfig.type === 'algolia') {
            this._algoliaIndex
              = this._algoliaIndex
                || window.algoliasearch!(
                  searchConfig.algoliaAppID,
                  searchConfig.algoliaSearchKey,
                ).initIndex(searchConfig.algoliaIndex)
            this._algoliaIndex
              .search(query, {
                offset: 0,
                length: maxResultLength * 8,
                attributesToHighlight: ['title'],
                attributesToRetrieve: ['*'],
                attributesToSnippet: [`content:${snippetLength}`],
                highlightPreTag: `<${highlightTag}>`,
                highlightPostTag: `</${highlightTag}>`,
              })
              .then(({ hits }: { hits: any[] }) => {
                const results: Record<string, any> = {}
                hits.forEach(({ uri, date, _highlightResult: { title }, _snippetResult: { content } }: any) => {
                  if (results[uri] && results[uri].context.length > content.value)
                    return
                  results[uri] = {
                    uri,
                    title: title.value,
                    date,
                    context: content.value,
                  }
                })
                finish(Object.values(results).slice(0, maxResultLength))
              })
              .catch((err: Error) => {
                console.error(err)
                finish([])
              })
          }
          else if (searchConfig.type === 'fuse') {
            const search = () => {
              const results: Record<string, any> = {}
              window._fuseIndex.search(query).forEach(({ item, matches }: any) => {
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
              fetch(fuseIndexURL!)
                .then(response => response.json())
                .then((data) => {
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
                  finish(search())
                })
                .catch((err: Error) => {
                  console.error(err)
                  finish([])
                })
            }
            else {
              finish(search())
            }
          }
          else if (searchConfig.type === 'cse') {
            const cseConfig = this.core.config.cse
            if (cseConfig?.engine === 'google' && cseConfig.cx) {
              finish([{
                uri: `${cseConfig.resultsPage}#gsc.tab=0&gsc.q=${encodeURIComponent(query)}`,
                title: cseConfig.searchIn,
                date: '<i class="fa-brands fa-searchengin fa-xl" aria-hidden="true"></i>',
                context: cseConfig.gotoResultsPage,
              }])
            }
          }
          else if (searchConfig.type === 'pagefind') {
            this._pagefindSearch!
              .search(query, maxResultLength)
              .then((results: any[] | null) => {
                finish(results || [])
              })
              .catch((err: Error) => {
                console.error(err)
                finish([])
              })
          }
          else {
            finish([])
          }
        },
        templates: {
          suggestion: ({ title, uri, date, context }: any) =>
            `<div><a href="${uri}"><span class="suggestion-title">${title}</span></a><span class="suggestion-date">${date}</span></div><div class="suggestion-context">${context}</div>`,
          empty: ({ query }: any) => `<div class="search-empty">${searchConfig.noResultsFound}: <span class="search-query">"${HTMLEscape(query)}"</span></div>`,
          footer: () => {
            const meta = SEARCH_META[searchConfig.type!]
            if (!meta)
              return ''
            return `<div class="search-footer">Search by <a href="${meta.href}" rel="noopener noreferrer" target="_blank">${meta.icon} ${meta.label}</a></div>`
          },
        },
      })
      autosearch.on('autocomplete:selected', (_event: any, suggestion: any, _dataset: any, _context: any) => {
        this.core.closeMaskOverlay(overlayName)
        window.location.assign(suggestion.uri)
      })
      if (_isMobile) {
        this._searchMobile = autosearch
      }
      else {
        this._searchDesktop = autosearch
      }
    }
    initAutosearch()
  }
}
