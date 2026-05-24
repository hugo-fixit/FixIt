/** Service interfaces and tokens for all FixIt modules. */
import type { FixItConfig, MaskOverlayHandler } from '../types'
import type { TypedEventBus } from './event-bus'
import { token } from './container'

// ─── CoreService ───
export interface CoreService {
  readonly config: FixItConfig
  isDark: boolean
  themeMode: string
  disableScrollEvent: boolean
  newScrollTop: number
  oldScrollTop: number
  registerMaskOverlay: (name: string, handlers: MaskOverlayHandler) => void
  openMaskOverlay: (name: string) => void
  closeMaskOverlay: (name: string, skipSync?: boolean) => void
  toggleMaskOverlay: (name: string) => void
  closeActiveMaskOverlay: () => void
  syncMaskState: () => void
}

// ─── ThemeService ───
export interface ThemeService {
  initThemeColor: () => void
  initSwitchTheme: () => void
}

// ─── SvgService ───
export interface SvgService {
  initSVGIcon: () => void
}

// ─── MenuService ───
export interface MenuService {
  initMenu: () => void
  initMenuDesktop: () => void
  initMenuMobile: () => void
}

// ─── SearchService ───
export interface SearchService {
  initSearch: () => void
}

// ─── CodeService ───
export interface CodeService {
  initCopyCode: (codeBlock: HTMLElement, codePreEl: HTMLElement) => void
  initCodeExpandBtn: (codeBlock: HTMLElement) => void
  initDownloadCode: (codeBlock: HTMLElement, codePreEl: HTMLElement) => void
  closeCodeFullscreen: () => void
  initFullscreenCode: (codeBlock: HTMLElement) => void
  initCodeWrapper: () => void
  initCodeTabs: () => void
  initDiagramCopyBtn: () => void
}

// ─── TocService ───
export interface TocService {
  getVisibleHeaderOffset: () => number
  getBreadcrumbHeight: () => number
  getTocIndexOffset: () => number
  getTocHeadingElements: () => HTMLElement[]
  getActiveTocHeading: ($headingElements: HTMLElement[], indexOffset?: number) => HTMLElement | null
  getTocRoots: () => HTMLElement[]
  getTocLinkById: ($tocRoot: HTMLElement, id: string) => HTMLAnchorElement | null
  applyTocActiveState: ($tocRoot: HTMLElement, activeId: string) => void
  scrollActiveTocLinkIntoView: ($tocRoot: HTMLElement, activeId: string, $scrollContainer?: HTMLElement) => void
  syncTocHeight: () => void
  syncTocActiveState: () => void
  initToc: () => void
  initTocListener: () => void
  initTocDialog: () => void
  fixTocScroll: () => void
}

// ─── CommentService ───
export interface CommentService {
  initCommentLightGallery: (comments: string, images: string) => void
  initComment: () => void
}

// ─── EncryptionService ───
export interface EncryptionService {
  initFixItDecryptor: () => void
}

// ─── ContentService ───
export interface ContentService {
  initDetails: (target?: Element | Document) => void
  initLightGallery: () => void
  initJsonViewer: () => void
  initFootnotes: () => void
  initTooltip: () => void
  initTwemoji: (target?: Element | Document) => void
  initContent: () => void
}

// ─── MiscService ───
export interface MiscService {
  initCookieconsent: () => void
  getSiteTime: () => void
  initSiteTime: () => void
  initServiceWorker: () => void
  initWatermark: () => void
  initPangu: () => void
  initMathJax: () => void
  initAutoMark: () => void
  initReward: () => void
  initPostChatUser: () => void
}

// ─── LinkGuardService ───
export interface LinkGuardService {
  initLinkGuardDialog: (target?: Element | Document) => void
}

// ─── EventsService ───
export interface EventsService {
  onScroll: () => void
  onResize: () => void
  onClickMask: () => void
  initPrint: () => void
}

// ─── Service Tokens ───
export const TOKENS = {
  EventBus: token<TypedEventBus>('EventBus'),
  Core: token<CoreService>('Core'),
  Theme: token<ThemeService>('Theme'),
  Svg: token<SvgService>('Svg'),
  Menu: token<MenuService>('Menu'),
  Search: token<SearchService>('Search'),
  Code: token<CodeService>('Code'),
  Toc: token<TocService>('Toc'),
  Comment: token<CommentService>('Comment'),
  Encryption: token<EncryptionService>('Encryption'),
  Content: token<ContentService>('Content'),
  Misc: token<MiscService>('Misc'),
  LinkGuard: token<LinkGuardService>('LinkGuard'),
  Events: token<EventsService>('Events'),
} as const
