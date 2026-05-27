/**
 * Core module — shared state initialization and mask overlay management.
 *
 * Responsibilities:
 * - Load and expose page/site configuration from `window.config`.
 * - Track theme mode (light/dark) and provide `isDark` / `themeMode` accessors.
 * - Manage mask overlay visibility for search and menu drawers.
 */
import type { CoreService } from '../core/tokens'
import type { FixItConfig, MaskOverlayHandler } from '../types'
import { getScrollTop, getThemeMode, isDarkMode } from '../utils'

export class CoreModule implements CoreService {
  readonly config: FixItConfig
  themeMode: string
  isDark: boolean
  newScrollTop: number
  oldScrollTop: number
  disableScrollEvent: boolean

  private activeMaskOverlay: string | null = null
  private readonly maskOverlays = new Map<string, MaskOverlayHandler>()

  constructor() {
    this.config = window.config
    this.themeMode = getThemeMode()
    this.isDark = isDarkMode()
    this.newScrollTop = getScrollTop()
    this.oldScrollTop = this.newScrollTop
    this.disableScrollEvent = false

    window.objectFitImages?.()
  }

  /** Register a named mask overlay with open/close/isActive handlers. */
  registerMaskOverlay(name: string, handlers: MaskOverlayHandler) {
    this.maskOverlays.set(name, handlers)
  }

  /** Toggle the mask element's blur class based on active overlay state. */
  syncMaskState() {
    document.getElementById('mask')?.classList.toggle('blur', Boolean(this.activeMaskOverlay))
  }

  /** Open a named mask overlay, closing any previously active one. */
  openMaskOverlay(name: string) {
    this.disableScrollEvent = true
    const overlay = this.maskOverlays.get(name)
    if (!overlay)
      return
    if (this.activeMaskOverlay && this.activeMaskOverlay !== name) {
      this.closeMaskOverlay(this.activeMaskOverlay, true)
    }
    overlay.onOpen?.()
    this.activeMaskOverlay = name
    this.syncMaskState()
  }

  /** Close a named mask overlay and optionally skip mask state sync. */
  closeMaskOverlay(name: string, skipSync = false) {
    this.disableScrollEvent = false
    const overlay = this.maskOverlays.get(name)
    if (!overlay)
      return
    overlay.onClose?.()
    if (this.activeMaskOverlay === name) {
      this.activeMaskOverlay = null
    }
    !skipSync && this.syncMaskState()
  }

  /** Toggle a named mask overlay open/closed. */
  toggleMaskOverlay(name: string) {
    const overlay = this.maskOverlays.get(name)
    if (!overlay)
      return
    const isActive = overlay.isActive?.() ?? this.activeMaskOverlay === name
    if (this.activeMaskOverlay === name && isActive) {
      this.closeMaskOverlay(name)
      return
    }
    this.openMaskOverlay(name)
  }

  /** Close whichever mask overlay is currently active. */
  closeActiveMaskOverlay() {
    if (!this.activeMaskOverlay) {
      this.syncMaskState()
      return
    }
    this.closeMaskOverlay(this.activeMaskOverlay)
  }
}
