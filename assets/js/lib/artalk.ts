/**
 * Artalk comment system integration for FixIt.
 *
 * Responsibilities:
 * - Initialize Artalk with configured settings
 * - Sync dark mode based on theme preference
 * - Handle theme switching
 * - Setup lightGallery for comment images when enabled
 */
import { TypedEventBus } from '../core/event-bus'
import { isDarkMode } from '../utils'
import { initCommentLightGallery } from '../utils/comment'

const eventBus = new TypedEventBus()

document.addEventListener('DOMContentLoaded', () => {
  if (!window.config.comment?.artalk || !window.Artalk)
    return

  const artalkConfig = window.config.comment.artalk

  // Count-only mode for expired comments
  if (window.config.comment?.expired) {
    window.Artalk.LoadCountWidget({
      server: artalkConfig.server,
      site: artalkConfig.site,
      pvEl: artalkConfig.pvEl,
      countEl: artalkConfig.countEl,
    })
    return
  }

  const artalk = window.Artalk.init(artalkConfig)
  artalk.setDarkMode(isDarkMode())

  eventBus.on('fixit:switch-theme', ({ detail }) => {
    if (!detail.isChanged)
      return
    artalk.setDarkMode(detail.isDark)
  })

  // Init lightGallery for comment images when enabled
  artalk.on('comments-loaded', () => {
    if (window.config.comment?.artalk?.lightgallery)
      initCommentLightGallery('.atk-comment .atk-content', 'img:not([atk-emoticon])')
  })
}, false)
