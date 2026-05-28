import type { MermaidConfig } from './third-party'

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
  PWA?: PWAConfig
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

export interface PWAConfig {
  enable?: boolean
  serviceWorkerURL: string
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
