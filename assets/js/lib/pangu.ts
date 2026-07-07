/**
 * Pangu.js integration for FixIt.
 *
 * Responsibilities:
 * - Automatically add spacing between CJK (Chinese, Japanese, Korean) and ASCII characters.
 * - Support both full-page spacing and selector-based spacing.
 * - Re-run spacing when `fixit:content-decrypted` is emitted.
 */
import { eventBus } from '../core/event-bus'

function initPangu(target?: Element) {
  if (!window.config.pangu?.enable || !window.pangu)
    return

  window.pangu.ignoredTags = /^(script|code|pre|textarea|sup|sub)$/i

  if (target) {
    window.pangu.spacingNode(target)
    return
  }

  if (window.config.pangu.selector) {
    document.querySelectorAll(window.config.pangu.selector).forEach((el) => {
      window.pangu.spacingNode(el)
    })
    return
  }
  window.pangu.autoSpacingPage()
}

document.addEventListener('DOMContentLoaded', () => {
  initPangu()
  eventBus.on('fixit:content-decrypted', ({ detail }) => {
    initPangu(detail.target)
  })
}, false)
