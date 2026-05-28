/**
 * Twikoo comment system integration for FixIt.
 *
 * Responsibilities:
 * - Initialize Twikoo with configured settings
 * - Fetch and display comment counts
 * - Setup lightGallery for comment images when enabled
 */
import { initCommentLightGallery } from '../utils/comment'

document.addEventListener('DOMContentLoaded', () => {
  if (!window.config.comment?.twikoo || !window.twikoo)
    return

  const twikooConfig = window.config.comment.twikoo as any

  if (twikooConfig.lightgallery) {
    twikooConfig.onCommentLoaded = () => {
      initCommentLightGallery('.tk-comments .tk-content', 'img:not(.tk-owo-emotion)')
    }
  }

  window.twikoo.init(twikooConfig)

  if (twikooConfig.commentCount) {
    window.twikoo
      .getCommentsCount({
        envId: twikooConfig.envId,
        region: twikooConfig.region,
        urls: [window.location.pathname],
        includeReply: false,
      })
      .then((response: Array<{ count: number }>) => {
        const twikooCommentCount = document.getElementById('twikoo-comment-count')
        if (twikooCommentCount)
          twikooCommentCount.innerHTML = String(response[0].count)
      })
  }
}, false)
