import type { CoreService, SearchService } from '../../core/tokens'
import type { SearchEngine, SearchResult } from './types'

import { HTMLEscape, isMobile } from '../../utils'
import { createAlgoliaEngine } from './engines/algolia'
import { createCSEEngine } from './engines/cse'
import { createFuseEngine } from './engines/fuse'
import { createPagefindEngine } from './engines/pagefind'
import { SEARCH_META } from './types'

/** Module-level close function for navigator callback. */
let globalCloseDialog: (() => void) | undefined

/**
 * Search module — orchestrates search engines, autocomplete, and UI lifecycle.
 *
 * Responsibilities:
 * - Select and initialize the configured search engine backend.
 * - Manage search dialog open/close and keyboard shortcuts.
 * - Handle autocomplete, result rendering, and UI state reset.
 */
export class SearchModule implements SearchService {
  #engine: SearchEngine | undefined
  #autocompleteInstance: any
  #initialized = false

  constructor(private readonly core: CoreService) {}

  /** Initialize the search overlay, autocomplete, and engine-specific logic. */
  initSearch() {
    const searchConfig = this.core.config.search
    if (!searchConfig)
      return

    // Initialize engine once
    if (!this.#engine) {
      this.#engine = this.#createEngine(searchConfig.type!, searchConfig)
    }

    // Initialize dialog and autocomplete once
    if (!this.#initialized) {
      this.#initialized = true
      this.#initAutosearch()
      this.#initDialog()
      this.#initKeyboardShortcuts()
      this.#initPlatformHint()
    }
  }

  /** Create the appropriate search engine based on type. */
  #createEngine(type: string, searchConfig: Record<string, any>): SearchEngine {
    switch (type) {
      case 'algolia':
        return createAlgoliaEngine(searchConfig)
      case 'fuse':
        return createFuseEngine(searchConfig)
      case 'cse':
        return createCSEEngine(this.core.config.cse)
      case 'pagefind':
        return createPagefindEngine(searchConfig)
      default:
        return {
          async search() {
            return []
          },
        }
    }
  }

  /** Initialize @algolia/autocomplete-js instance. */
  #initAutosearch() {
    const searchConfig = this.core.config.search
    if (!searchConfig || !this.#engine)
      return

    const autocompleteLib = (window as any)['@algolia/autocomplete-js']
    if (!autocompleteLib?.autocomplete) {
      console.error('[FixIt] @algolia/autocomplete-js is not available on window')
      return
    }
    const { autocomplete } = autocompleteLib

    const { maxResultLength = 10 } = searchConfig
    const engine = this.#engine

    // Render the panel inside .search-modal (sibling of .search-modal-header)
    // so it stays within the <dialog> and benefits from the flex layout.
    const panelContainer = document.querySelector('#search-dialog .search-modal')

    this.#autocompleteInstance = autocomplete({
      container: '#search-modal-autocomplete',
      panelContainer: panelContainer || undefined,
      placeholder: searchConfig.placeholder || '',
      openOnFocus: true,
      defaultActiveItemId: 0,
      detachedMediaQuery: 'none',
      classNames: { noPrefix: true },
      getSources({ query }: { query: string }) {
        if (!query.trim())
          return []
        return [{
          sourceId: 'search',
          async getItems(): Promise<SearchResult[]> {
            return engine.search(query, maxResultLength)
          },
          getItemUrl({ item }: { item: SearchResult }) {
            return item.uri
          },
          templates: {
            item({ item, html: h }: { item: SearchResult, html: any }) {
              const title = h`<span class="suggestion-title" dangerouslySetInnerHTML=${{ __html: item.title }}></span>`
              const icon = item.icon ? h`<span class="suggestion-icon" dangerouslySetInnerHTML=${{ __html: item.icon }}></span>` : ''
              const date = item.date ? h`<span class="suggestion-date">${item.date}</span>` : ''
              const context = h`<div class="suggestion-context" dangerouslySetInnerHTML=${{ __html: item.context }}></div>`
              return h`<div class="aa-ItemWrapper"><div><a href="${item.uri}">${title}</a>${icon}${date}</div>${context}</div>`
            },
            noResults({ html: h }: { html: any }) {
              const query_ = h`<span class="search-query">"${HTMLEscape(query)}"</span>`
              return h`<div class="search-empty">${searchConfig.noResultsFound}: ${query_}</div>`
            },
            footer({ html: h }: { html: any }) {
              const meta = SEARCH_META[searchConfig.type!]
              if (!meta)
                return ''
              const icon = meta.icon ? h`<span dangerouslySetInnerHTML=${{ __html: meta.icon }}></span> ` : ''
              return h`<div class="search-footer">Search by <a href="${meta.href}" rel="noopener noreferrer" target="_blank">${icon}${meta.label}</a></div>`
            },
          },
        }]
      },
      navigator: {
        navigate({ itemUrl }: { itemUrl: string }) {
          closeDialog()
          window.location.assign(itemUrl)
        },
      },
    })

    // Preload pagefind on first focus
    if (searchConfig.type === 'pagefind' && this.#engine.preload) {
      const container = document.getElementById('search-modal-autocomplete')
      container?.addEventListener('focusin', () => {
        this.#engine!.preload!().catch((error: Error) => {
          console.error(error)
        })
      }, { once: true })
    }
  }

  /** Initialize the search dialog open/close lifecycle using native <dialog>. */
  #initDialog() {
    const dialog = document.getElementById('search-dialog') as HTMLDialogElement | null
    if (!dialog)
      return

    const focusInput = () => {
      requestAnimationFrame(() => {
        const input = dialog.querySelector('input') as HTMLInputElement | null
        input?.focus()
      })
    }

    const open = () => {
      dialog.showModal()
      focusInput()
    }

    const close = () => {
      if (dialog.open)
        dialog.close()
    }

    const resetAutocomplete = () => {
      if (this.#autocompleteInstance) {
        this.#autocompleteInstance.setQuery('')
        this.#autocompleteInstance.setIsOpen(false)
      }
    }

    // Expose close for navigator callback
    globalCloseDialog = close

    document.getElementById('search-trigger-desktop')?.addEventListener('click', open)
    document.getElementById('search-trigger-mobile')?.addEventListener('click', () => {
      const $menuToggle = document.getElementById('menu-toggle-mobile')
      const $menuMobile = document.getElementById('menu-mobile')
      if ($menuToggle?.classList.contains('active')) {
        $menuToggle.classList.remove('active')
        $menuMobile?.classList.remove('active')
        $menuToggle.setAttribute('aria-expanded', 'false')
      }
      open()
    })

    // Reset autocomplete state when dialog closes (Escape, backdrop click, etc.)
    dialog.addEventListener('close', resetAutocomplete)

    // @algolia/autocomplete-js calls preventDefault() on Escape,
    // which prevents the native <dialog> close. Close manually.
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dialog.open) {
        e.preventDefault()
        close()
      }
    })
  }

  /** Initialize keyboard shortcuts. */
  #initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        if (isMobile())
          return
        e.preventDefault()
        const dialog = document.getElementById('search-dialog') as HTMLDialogElement | null
        if (!dialog)
          return
        if (dialog.open) {
          globalCloseDialog?.()
        }
        else {
          dialog.showModal()
          requestAnimationFrame(() => {
            const input = dialog.querySelector('input') as HTMLInputElement | null
            input?.focus()
          })
        }
      }
    })
  }

  /** Update shortcut hint text based on platform. */
  #initPlatformHint() {
    const isMac = /mac/i.test(navigator.platform)
    document.querySelectorAll<HTMLElement>('.search-trigger kbd').forEach((el) => {
      el.textContent = isMac ? '⌘ K' : 'Ctrl K'
    })
  }
}

function closeDialog() {
  globalCloseDialog?.()
}
