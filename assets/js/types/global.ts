import type { FixItDocumentEventMap } from '../core/event-bus'
import type { FixItPublicAPI } from '../core/tokens'
import type { FixItConfig } from './config'
import type { MermaidRuntimeModule, PanzoomInstance } from './third-party'

export interface TabContainerChangedDetail {
  relatedTarget?: Element | null
}

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
    'CryptoJS'?: any
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
    'xxhash'?: any
    'Panzoom'?: (element: SVGElement, options?: Record<string, unknown>) => PanzoomInstance

    // FixIt theme
    'fixit': FixItPublicAPI
    'config': FixItConfig
    'mermaid'?: MermaidRuntimeModule
    '_fuseIndex'?: any
    'FixItDecryptor'?: any
  }
}
