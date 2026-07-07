/**
 * LightGallery integration for FixIt.
 *
 * Responsibilities:
 * - Initialize lightGallery for page image zoom and thumbnails.
 * - Re-initialize when `fixit:content-decrypted` is emitted.
 */
import { eventBus } from '../core/event-bus'

let lg: { destroy: (removeSubModules?: boolean) => void } | undefined

function initLightGallery() {
  if (!window.config.lightgallery || !window.lightGallery)
    return

  lg?.destroy(true)
  const contentEl = document.getElementById('content')
  if (!contentEl)
    return

  lg = window.lightGallery(contentEl, {
    plugins: [window.lgThumbnail, window.lgZoom],
    selector: '.lightgallery',
    speed: 400,
    hideBarsDelay: 2000,
    allowMediaOverlap: true,
    exThumbImage: 'data-thumbnail',
    toggleThumb: true,
    thumbWidth: 80,
    thumbHeight: '60px',
    actualSize: false,
    showZoomInOutIcons: true,
    licenseKey: 'none',
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initLightGallery()
  eventBus.on('fixit:content-decrypted', initLightGallery)
}, false)
