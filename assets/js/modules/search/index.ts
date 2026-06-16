import type { CoreService, SearchService } from '../../core/tokens'
import type { SearchEngine, SearchResult } from './types'

import { isMobile } from '../../utils'
import { createAlgoliaEngine } from './engines/algolia'
import { createCSEEngine } from './engines/cse'
import { createFuseEngine } from './engines/fuse'
import { createPagefindEngine } from './engines/pagefind'

/** Module-level close function for dialog. */
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

    searchConfig.placeholder = searchConfig.placeholder || 'Search...'
    searchConfig.clearText = searchConfig.clearText || 'Clear'

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
      container: '.search-modal-header',
      panelContainer: panelContainer || undefined,
      placeholder: searchConfig.placeholder,
      openOnFocus: true,
      defaultActiveItemId: 0,
      detachedMediaQuery: 'none',
      shouldPanelOpen({ state }: { state: { query: string } }) {
        return state.query.trim().length > 0
      },
      translations: {
        clearButtonTitle: searchConfig.clearText,
      },
      classNames: {
        root: 'search-autocomplete',
        form: 'search-form',
        input: 'search-input',
        inputWrapper: 'search-input-wrapper',
        inputWrapperPrefix: 'search-input-prefix',
        inputWrapperSuffix: 'search-input-suffix',
        submitButton: 'search-submit-btn',
        clearButton: 'search-clear-btn',
        loadingIndicator: 'search-loading',
        label: 'search-label',
        list: 'search-list',
        item: 'search-item',
        panel: 'search-panel',
        panelLayout: 'search-panel-layout',
        source: 'search-source',
        sourceFooter: 'search-source-footer',
        sourceHeader: 'search-source-header',
        sourceNoResults: 'search-source-no-results',
      },
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
              return h`<div class="search-item-wrapper"><div><a href="${item.uri}">${title}</a>${icon}${date}</div>${context}</div>`
            },
            noResults({ html: h }: { html: any }) {
              return h`<div class="search-empty"><i class="fa-solid fa-magnifying-glass search-empty-icon" aria-hidden="true"></i><p>${searchConfig.noResultsFound}: <span class="search-query">"${query}"</span></p></div>`
            },
          },
          onSelect({ item }: { item: SearchResult }) {
            if (item.uri) {
              globalCloseDialog?.()
              window.location.assign(item.uri)
            }
          },
        }]
      },
      onSubmit({ state }: { state: { activeItemId: number | null, collections: Array<{ items: SearchResult[] }> } }) {
        const { activeItemId, collections } = state
        if (activeItemId === null || !collections.length)
          return

        const items = collections[0].items
        const item = items[activeItemId]
        if (item?.uri) {
          globalCloseDialog?.()
          window.location.assign(item.uri)
        }
      },
      onStateChange({ state }: { state: { query: string, collections: Array<{ items: SearchResult[] }> } }) {
        const submitBtn = document.querySelector('.search-submit-btn') as HTMLButtonElement | null
        if (!submitBtn)
          return

        const hasResults = state.collections.some(collection => collection.items.length > 0)
        submitBtn.disabled = !state.query.trim() || !hasResults
      },
    })

    // Replace clear button SVG with text
    const clearBtn = document.querySelector('.search-autocomplete .search-clear-btn')
    if (clearBtn) {
      clearBtn.textContent = searchConfig.clearText
    }

    // Prevent blur when clicking inside modal but outside form
    panelContainer?.addEventListener('mousedown', (e) => {
      if (!(e.target as HTMLElement).closest('.search-form'))
        e.stopPropagation()
    })

    // Close button
    document.querySelector('.search-close-btn')?.addEventListener('click', () => globalCloseDialog?.())

    // Preload pagefind on first focus
    if (searchConfig.type === 'pagefind' && this.#engine.preload) {
      const container = document.querySelector('.search-autocomplete')
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

    // Expose close function for use in autocomplete callbacks
    globalCloseDialog = close

    document.querySelector('.search-trigger.desktop')?.addEventListener('click', open)
    document.querySelector('.search-trigger.mobile')?.addEventListener('click', () => {
      this.core.closeMaskOverlay('menu-mobile')
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
}
