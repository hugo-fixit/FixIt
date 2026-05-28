/**
 * Waline comment system integration for FixIt.
 *
 * Responsibilities:
 * - Initialize Waline with configured settings
 * - Handle pageview counting for expired comments
 */
import { eventBus } from '../core/event-bus'
import { getThemeMode } from '../utils'

document.addEventListener('DOMContentLoaded', () => {
  if (!window.config.comment?.waline || !window.Waline)
    return

  const DARK_MODE = 'html[data-theme-mode="dark"]'
  const walineConfig = window.config.comment.waline
  walineConfig.dark = getThemeMode() === 'auto' ? 'auto' : DARK_MODE

  // Count-only mode for expired comments
  if (window.config.comment?.expired) {
    if (walineConfig.pageview) {
      window.Waline.pageviewCount({
        serverURL: walineConfig.serverURL,
        path: window.location.pathname,
      })
    }
    return
  }

  const walineInstance = window.Waline.init(walineConfig)

  eventBus.on('fixit:switch-theme', ({ detail }) => {
    walineInstance.update({ dark: detail.mode === 'auto' ? 'auto' : DARK_MODE })
  })
}, false)
