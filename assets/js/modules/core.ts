/** Core module — shared state initialization and mask overlay management. */
import type { FixItContext, MaskOverlayHandler } from '../types'
import { getScrollTop, getThemeMode, isDarkMode } from '../utils'

/**
 * Create core shared state and mask overlay management.
 * @param ctx - The shared FixIt context object.
 * @returns Core mask overlay management methods.
 */
export function createCore(ctx: FixItContext) {
  ctx.config = window.config
  ctx.themeMode = getThemeMode()
  ctx.isDark = isDarkMode()
  ctx.newScrollTop = getScrollTop()
  ctx.oldScrollTop = ctx.newScrollTop
  ctx.maskOverlays = new Map<string, MaskOverlayHandler>()
  ctx.activeMaskOverlay = null
  ctx.activeTocId = null
  ctx.disableScrollEvent = false

  window.objectFitImages?.()

  /**
   * Register a named mask overlay with open/close/isActive handlers.
   * @param name - Unique identifier for the overlay.
   * @param handlers - Handler object with `onOpen`, `onClose`, and `isActive` callbacks.
   */
  function registerMaskOverlay(name: string, handlers: MaskOverlayHandler) {
    ctx.maskOverlays.set(name, handlers)
  }

  /** Toggle the mask element's blur class based on active overlay state. */
  function syncMaskState() {
    document.getElementById('mask')?.classList.toggle('blur', Boolean(ctx.activeMaskOverlay))
  }

  /**
   * Open a named mask overlay, closing any previously active one.
   * @param name - The overlay identifier to open.
   */
  function openMaskOverlay(name: string) {
    ctx.disableScrollEvent = true
    const overlay = ctx.maskOverlays.get(name)
    if (!overlay)
      return
    if (ctx.activeMaskOverlay && ctx.activeMaskOverlay !== name) {
      closeMaskOverlay(ctx.activeMaskOverlay, true)
    }
    overlay.onOpen?.()
    ctx.activeMaskOverlay = name
    syncMaskState()
  }

  /**
   * Close a named mask overlay and optionally skip mask state sync.
   * @param name - The overlay identifier to close.
   * @param skipSync - If `true`, skip updating the mask blur state.
   */
  function closeMaskOverlay(name: string, skipSync = false) {
    ctx.disableScrollEvent = false
    const overlay = ctx.maskOverlays.get(name)
    if (!overlay)
      return
    overlay.onClose?.()
    if (ctx.activeMaskOverlay === name) {
      ctx.activeMaskOverlay = null
    }
    !skipSync && syncMaskState()
  }

  /**
   * Toggle a named mask overlay open/closed.
   * @param name - The overlay identifier to toggle.
   */
  function toggleMaskOverlay(name: string) {
    const overlay = ctx.maskOverlays.get(name)
    if (!overlay)
      return
    const isActive = overlay.isActive?.() ?? ctx.activeMaskOverlay === name
    if (ctx.activeMaskOverlay === name && isActive) {
      closeMaskOverlay(name)
      return
    }
    openMaskOverlay(name)
  }

  /** Close whichever mask overlay is currently active. */
  function closeActiveMaskOverlay() {
    if (!ctx.activeMaskOverlay) {
      syncMaskState()
      return
    }
    closeMaskOverlay(ctx.activeMaskOverlay)
  }

  return {
    registerMaskOverlay,
    syncMaskState,
    openMaskOverlay,
    closeMaskOverlay,
    toggleMaskOverlay,
    closeActiveMaskOverlay,
  }
}
