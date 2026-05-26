/**
 * Giscus comment system integration for FixIt.
 *
 * Responsibilities:
 * - Setup theme synchronization via postMessage
 * - Handle giscus initialization messages
 */
import { TypedEventBus } from '../core/event-bus'
import { isDarkMode } from '../utils'

const eventBus = new TypedEventBus()

document.addEventListener('DOMContentLoaded', () => {
  if (!window.config.comment?.giscus)
    return

  const giscusConfig = window.config.comment.giscus

  const applyGiscusTheme = (isDark: boolean) => {
    const message = { setConfig: { theme: isDark ? giscusConfig.darkTheme : giscusConfig.lightTheme } }
    document.querySelector<HTMLIFrameElement>('.giscus-frame')?.contentWindow?.postMessage({ giscus: message }, giscusConfig.origin!)
  }

  eventBus.on('fixit:switch-theme', ({ detail }) => {
    if (!detail.isChanged)
      return
    applyGiscusTheme(detail.isDark)
  })

  const messageListener = (event: MessageEvent) => {
    if (event.origin !== giscusConfig.origin)
      return
    const $script = document.querySelector('#giscus>script')
    if ($script) {
      $script.remove()
    }
    applyGiscusTheme(isDarkMode())
    window.removeEventListener('message', messageListener, false)
  }
  window.addEventListener('message', messageListener, false)
}, false)
