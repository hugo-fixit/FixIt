/**
 * APlayer integration for FixIt shortcode blocks.
 *
 * Responsibilities:
 * - Discover `.shortcode-aplayer` nodes and initialize APlayer instances once.
 * - Re-run initialization when `fixit:content-decrypted` is emitted.
 * - Keep behavior idempotent through `data-processed` markers.
 */
import { eventBus } from '../core/event-bus'

function initAPlayer() {
  const aplayers = document.querySelectorAll<HTMLElement>('.shortcode-aplayer')
  aplayers.forEach((el) => {
    if (el.dataset.processed)
      return
    const audio = JSON.parse(el.dataset.audio!)
    const options = JSON.parse(el.dataset.options!)
    options.audio = audio
    options.container = el
    void new window.APlayer!(options)
    el.dataset.processed = 'true'
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initAPlayer()
  eventBus.on('fixit:content-decrypted', initAPlayer)
}, false)
