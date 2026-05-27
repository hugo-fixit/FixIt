import type { FixItEventMap, TypedEventBus } from '../core/event-bus'
import type { FixItConfig, MaskOverlayHandler } from './config'
import type { MermaidRuntimeModule, PanzoomInstance } from './third-party'

export interface TabContainerChangedDetail {
  relatedTarget?: Element | null
}

export type TabContainerChangedEvent = CustomEvent<TabContainerChangedDetail> & {
  panel: Element | null
}

type FixItDocumentEventMap = {
  [K in keyof FixItEventMap]: CustomEvent<FixItEventMap[K]>
}

/** Public API exposed on window.fixit. */
export interface FixItPublicAPI {
  readonly config: FixItConfig
  readonly themeMode: string
  readonly isDark: boolean
  readonly newScrollTop: number
  readonly oldScrollTop: number
  setThemeMode: (mode: string, persist?: boolean) => void
  registerMaskOverlay: (name: string, handlers: MaskOverlayHandler) => void
  toggleMaskOverlay: (name: string) => void
  closeMaskOverlay: (name: string, skipSync?: boolean) => void
  initContent: (target?: Element | Document) => void
  eventBus: TypedEventBus
}

declare global {
  interface DocumentEventMap extends FixItDocumentEventMap {
    'tab-container-changed': TabContainerChangedEvent
  }

  interface Window {
    // Third-party libraries
    autocomplete?: any
    algoliasearch?: any
    Artalk?: any
    APlayer?: any
    CellTooltip?: any
    cookieconsent?: any
    CryptoJS?: any
    echarts?: any
    Fuse?: any
    Gitalk?: any
    JsonViewerElement?: any
    lgThumbnail?: any
    lgZoom?: any
    lightGallery?: any
    mapboxgl?: any
    MapboxLanguage?: any
    MathJax?: any
    objectFitImages?: () => void
    pangu?: any
    postChatUser?: any
    postChatConfig?: any
    postChat_theme?: string
    twemoji?: any
    twikoo?: any
    TypeIt?: any
    Valine?: any
    Waline?: any
    Watermark?: any
    xxhash?: any
    Panzoom?: (element: SVGElement, options?: Record<string, unknown>) => PanzoomInstance

    // FixIt theme
    fixit: FixItPublicAPI
    config: FixItConfig
    mermaid?: MermaidRuntimeModule
    _fuseIndex?: any
    _searchMobile?: any
    _searchDesktop?: any
    FixItDecryptor?: any
  }
}
