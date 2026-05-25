/**
 * JSON Viewer integration for FixIt.
 *
 * Responsibilities:
 * - Apply theme-aware styling to json-viewer custom elements.
 * - Sync theme when it changes.
 */
import { TypedEventBus } from '../core/event-bus'
import { isDarkMode } from '../utils'

const eventBus = new TypedEventBus()

function applyJsonViewerTheme(isDark: boolean) {
  document.querySelectorAll('json-viewer').forEach(($el: Element) => {
    $el.setAttribute('theme', isDark ? 'dark' : 'light')
  })
}

document.addEventListener('DOMContentLoaded', () => {
  if (!window.JsonViewerElement)
    return

  applyJsonViewerTheme(isDarkMode())

  eventBus.on('fixit:switch-theme', ({ detail }) => {
    if (!detail.isChanged)
      return
    applyJsonViewerTheme(detail.isDark)
  })
}, false)
