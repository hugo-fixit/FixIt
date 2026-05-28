/**
 * Twemoji integration for FixIt.
 *
 * Responsibilities:
 * - Parse emoji shortcodes into Twemoji images when enabled.
 * - Re-run parsing after decrypted or partially decrypted content is revealed.
 */
import { eventBus } from '../core/event-bus'

function initTwemoji(target: Element | Document = document) {
  if (window.config.twemoji && window.twemoji)
    window.twemoji.parse(target)
}

document.addEventListener('DOMContentLoaded', () => {
  initTwemoji()
  eventBus.on('fixit:decrypted', () => {
    initTwemoji()
  })
  eventBus.on('fixit:partial-decrypted', ({ detail }) => {
    initTwemoji(detail.target)
  })
}, false)
