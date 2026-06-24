/** Service interfaces for all FixIt modules. */
import type { FixItConfig, MaskOverlayHandler } from '../types'
import type { TypedEventBus } from './event-bus'

// ─── CoreService ───
export interface CoreService {
  readonly config: FixItConfig
  readonly version: string
  isDark: boolean
  themeMode: string
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
  setup: () => void
}

// ─── MenuService ───
export interface MenuService {
  initDesktop: () => void
  initMobile: () => void
  setup: () => void
}

// ─── SearchService ───
export interface SearchService {
  setup: () => void
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
  setup: () => void
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
  initAutoMark: () => void
  initReward: () => void
  initPostChatUser: () => void
  initComment: () => void
  setup: () => void
}

// ─── PWAService ───
export interface PWAService {
  setup: () => void
}

// ─── EventsService ───
export interface EventsService {
  onScroll: () => void
  onResize: () => void
  onClickMask: () => void
  initPrint: () => void
  setup: () => void
}

// ─── FixItPublicAPI ───
export interface FixItPublicAPI {
  readonly config: FixItConfig
  readonly version: string
  readonly themeMode: string
  readonly isDark: boolean
  // Modules
  readonly core: CoreService
  readonly theme: ThemeService
  readonly code: CodeService
  readonly toc: TocService
  readonly menu: MenuService
  readonly search: SearchService
  readonly enc: EncryptionService
  readonly pwa: PWAService
  readonly misc: MiscService
  readonly content: ContentService
  readonly events: EventsService
  readonly eventBus: TypedEventBus
  // Methods
  setThemeMode: (mode: string, persist?: boolean) => void
}
