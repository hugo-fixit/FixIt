/** Service interfaces for all FixIt modules. */
import type { FixItConfig, MaskOverlayHandler } from '../types'

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
  setThemeMode: (mode: string, persist?: boolean) => void
  initThemeColor: () => void
  initSwitchTheme: () => void
}

// ─── MenuService ───
export interface MenuService {
  initMenu: () => void
}

// ─── SearchService ───
export interface SearchService {
  initSearch: () => void
}

// ─── CodeService ───
export interface CodeService {
  initCodeWrapper: () => void
  initCodeTabs: () => void
  initDiagramCopyBtn: () => void
}

// ─── TocService ───
export interface TocService {
  syncTocHeight: () => void
  syncTocActiveState: () => void
  initToc: () => void
  setup: () => void
}

// ─── EncryptionService ───
export interface EncryptionService {
  initFixItDecryptor: () => void
}

// ─── ContentService ───
export interface ContentService {
  initSVGIcon: () => void
  initLinkGuardDialog: (target?: Element | Document) => void
  initContent: (target?: Element | Document) => void
  setup: () => void
}

// ─── MiscService ───
export interface MiscService {
  initSiteTime: () => void
  initServiceWorker: () => void
  initAutoMark: () => void
  initReward: () => void
  initPostChatUser: () => void
  initComment: () => void
}

// ─── EventsService ───
export interface EventsService {
  onScroll: () => void
  onResize: () => void
  onClickMask: () => void
  initPrint: () => void
}
