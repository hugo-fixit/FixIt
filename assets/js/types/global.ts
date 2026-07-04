import type { FixItDocumentEventMap } from '../core/event-bus'
import type { FixItPublicAPI } from '../core/tokens'
import type { FixItConfig } from './config'
import type { MermaidRuntimeModule, PanzoomInstance } from './third-party'

export interface TabContainerChangedDetail {
  relatedTarget?: Element | null
}

export interface FixItDecryptorOptions {
  /** Cache duration in seconds for decrypted content (default: 24 hours) */
  duration?: number
}

export interface FixItDecryptorInstance {
  /**
   * Initialize page-level and/or shortcode-level decryption based on flags.
   * @param options - `{ all?, shortcode? }` controlling which modes to activate.
   */
  init: (options: { all?: boolean, shortcode?: boolean }) => void
  /** Restore decrypted content from localStorage cache if the password has not expired. */
  validateCache: () => this
}

export type FixItDecryptorConstructor = new (options?: FixItDecryptorOptions) => FixItDecryptorInstance

export type TabContainerChangedEvent = CustomEvent<TabContainerChangedDetail> & {
  panel: Element | null
}

declare global {
  interface DocumentEventMap extends FixItDocumentEventMap {
    'tab-container-changed': TabContainerChangedEvent
  }

  interface Window {
    // Third-party libraries
    '@algolia/autocomplete-js'?: { autocomplete: (...args: any[]) => any }
    'algoliasearch/lite'?: { liteClient: (...args: any[]) => any }
    'Artalk'?: any
    'APlayer'?: any
    'CellTooltip'?: any
    'cookieconsent'?: any
    'echarts'?: any
    'Fuse'?: any
    'Gitalk'?: any
    'JsonViewerElement'?: any
    'lgThumbnail'?: any
    'lgZoom'?: any
    'lightGallery'?: any
    'mapboxgl'?: any
    'MapboxLanguage'?: any
    'MathJax'?: any
    'objectFitImages'?: () => void
    'pangu'?: any
    'postChatUser'?: any
    'postChatConfig'?: any
    'postChat_theme'?: string
    'twemoji'?: any
    'twikoo'?: any
    'TypeIt'?: any
    'Valine'?: any
    'Waline'?: any
    'Watermark'?: any
    'Panzoom'?: (element: SVGElement, options?: Record<string, unknown>) => PanzoomInstance

    // FixIt theme
    'fixit': FixItPublicAPI
    'config': FixItConfig
    'mermaid'?: MermaidRuntimeModule
    '_fuseIndex'?: any
    'FixItDecryptor'?: FixItDecryptorConstructor
  }
}
