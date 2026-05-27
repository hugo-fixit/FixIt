/**
 * Utterances comment system integration for FixIt.
 *
 * Responsibilities:
 * - Dynamically inject Utterances script
 * - Handle theme synchronization via postMessage
 */
import { eventBus } from '../core/event-bus'
import { isDarkMode } from '../utils'

document.addEventListener('DOMContentLoaded', () => {
  if (!window.config.comment?.utterances)
    return

  const utterancesConfig = window.config.comment.utterances

  const script = document.createElement('script')
  script.src = 'https://utteranc.es/client.js'
  script.setAttribute('repo', utterancesConfig.repo!)
  script.setAttribute('issue-term', utterancesConfig.issueTerm!)
  if (utterancesConfig.label)
    script.setAttribute('label', utterancesConfig.label)
  script.setAttribute('theme', isDarkMode() ? utterancesConfig.darkTheme! : utterancesConfig.lightTheme!)
  script.crossOrigin = 'anonymous'
  script.async = true
  document.getElementById('utterances')!.appendChild(script)

  const applyUtterancesTheme = (isDark: boolean) => {
    const message = {
      type: 'set-theme',
      theme: isDark ? utterancesConfig.darkTheme : utterancesConfig.lightTheme,
    }
    document.querySelector<HTMLIFrameElement>('.utterances-frame')?.contentWindow?.postMessage(message, 'https://utteranc.es')
  }

  eventBus.on('fixit:switch-theme', ({ detail }) => {
    if (!detail.isChanged)
      return
    applyUtterancesTheme(detail.isDark)
  })
}, false)
