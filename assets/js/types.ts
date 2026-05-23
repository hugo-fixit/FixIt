import type { FixItEventMap } from './core/event-bus'

/** Mask overlay handler */
export interface MaskOverlayHandler {
  isActive?: () => boolean
  onOpen?: () => void
  onClose?: () => void
}

/** FixIt theme configuration (typed version of window.config) */
export interface FixItConfig {
  version?: string
  themeMode?: string
  twemoji?: boolean
  search?: SearchConfig
  cse?: CSEConfig
  echarts?: EchartsConfig
  mapbox?: MapboxConfig
  typeit?: TypeItConfig
  comment?: CommentConfig
  cookieconsent?: object
  siteTime?: string
  enablePWA?: boolean
  watermark?: WatermarkConfig
  pangu?: PanguConfig
  mathjax?: MathJaxConfig
  mermaid?: MermaidConfig
  lightgallery?: boolean
  tooltip?: boolean
  autoBookmark?: boolean
  encryption?: EncryptionConfig
  print?: PrintConfig
}

export interface SearchConfig {
  type?: string
  maxResultLength?: number
  snippetLength?: number
  highlightTag?: string
  isCaseSensitive?: boolean
  minMatchCharLength?: number
  findAllMatches?: boolean
  location?: number
  threshold?: number
  distance?: number
  ignoreLocation?: boolean
  useExtendedSearch?: boolean
  ignoreFieldNorm?: boolean
  fuseIndexURL?: string
  algoliaAppID?: string
  algoliaSearchKey?: string
  algoliaIndex?: string
  noResultsFound?: string
  pagefind?: PagefindConfig
}

export interface PagefindConfig {
  bundlePath?: string
  baseURL?: string
  debounceTimeoutMs?: number
  useBuiltInFilters?: boolean
  sortBy?: string
  sortOrder?: string
}

export interface CSEConfig {
  engine?: string
  cx?: string
  resultsPage?: string
  searchIn?: string
  gotoResultsPage?: string
}

export interface EchartsConfig {
  lightTheme?: object
  darkTheme?: object
}

export interface MapboxConfig {
  accessToken?: string
  RTLTextPlugin?: string
}

export interface TypeItConfig {
  speed?: number
  cursorSpeed?: number
  cursorChar?: string
  loop?: boolean
  duration?: number
}

export interface CommentConfig {
  enable?: boolean
  expired?: boolean
  lightgallery?: boolean
  artalk?: Record<string, any>
  gitalk?: Record<string, any>
  valine?: Record<string, any>
  waline?: Record<string, any>
  utterances?: UtterancesConfig
  twikoo?: TwikooConfig
  giscus?: GiscusConfig
}

export interface UtterancesConfig {
  repo?: string
  issueTerm?: string
  label?: string
  lightTheme?: string
  darkTheme?: string
}

export interface TwikooConfig extends Record<string, any> {
  lightgallery?: boolean
  commentCount?: boolean
  envId?: string
  region?: string
}

export interface GiscusConfig {
  origin?: string
  lightTheme?: string
  darkTheme?: string
}

export interface WatermarkConfig {
  enable?: boolean
  [key: string]: any
}

export interface PanguConfig {
  enable?: boolean
  selector?: string
}

export interface MathJaxConfig {
  cdn?: string
  packages?: Record<string, any>
  macros?: Record<string, string>
  tex?: Record<string, any>
  loader?: Record<string, any>
  options?: Record<string, any>
}

export interface MermaidConfig {
  wrapper?: boolean
  cdn?: string
  zenuml?: string
  themes?: string[]
  securitylevel?: string
  look?: string
  fontfamily?: string
  layoutloaders?: string[]
  layout?: string
}

export interface MermaidRenderResult {
  svg?: string
  bindFunctions?: (element: Element) => void
}

export interface MermaidRuntimeModule {
  startOnLoad: boolean
  initialize: (config: Record<string, unknown>) => void
  render: (id: string, source: string) => Promise<MermaidRenderResult>
  registerExternalDiagrams?: (diagrams: unknown[]) => Promise<void>
  registerLayoutLoaders?: (loaders: unknown[]) => void
}

export interface MermaidRuntime {
  mermaid: MermaidRuntimeModule
  config: MermaidConfig
  zenuml?: unknown
  loaders: unknown[]
}

export interface PanzoomTransform {
  x: number
  y: number
  scale: number
}

export interface PanzoomInstance {
  getPan: () => { x: number, y: number }
  getScale: () => number
  pan: (x: number, y: number, options?: { animate?: boolean, force?: boolean }) => void
  zoom: (scale: number, options?: { animate?: boolean, force?: boolean }) => void
  zoomIn: (options?: { animate?: boolean }) => void
  zoomOut: (options?: { animate?: boolean }) => void
  zoomWithWheel: (event: WheelEvent) => void
  reset: (options?: { animate?: boolean }) => void
}

export interface EncryptionConfig {
  all?: boolean
  shortcode?: boolean
}

export interface PrintConfig {
  expandAdmonition?: boolean
  expandCode?: boolean
  expandDetails?: boolean
  expandFileTree?: boolean
}

export interface TabContainerChangedDetail {
  relatedTarget?: Element | null
}

export type TabContainerChangedEvent = CustomEvent<TabContainerChangedDetail> & {
  panel: Element | null
}

type FixItDocumentEventMap = {
  [K in keyof FixItEventMap]: CustomEvent<FixItEventMap[K]>
}

/** Public API exposed on window.fixit for backward compatibility. */
export interface FixItPublicAPI {
  readonly config: FixItConfig
  readonly themeMode: string
  readonly isDark: boolean
  [method: string]: any
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
