/**
 * Twemoji integration for FixIt.
 *
 * Responsibilities:
 * - Parse emoji shortcodes into Twemoji images when enabled.
 * - Re-run parsing when `fixit:content-decrypted` is emitted.
 */
import { eventBus } from '../core/event-bus'

function initTwemoji(target: Element | Document = document) {
  if (window.config.twemoji && window.twemoji)
    window.twemoji.parse(target)
}

document.addEventListener('DOMContentLoaded', () => {
  initTwemoji()
  eventBus.on('fixit:content-decrypted', ({ detail }) => {
    initTwemoji(detail.target)
  })
}, false)
