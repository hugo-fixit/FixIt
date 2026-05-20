/** Theme module — color scheme switching and theme-color meta tag management. */
import type { FixItContext } from '../types'
import { forEach } from '../utils'

/**
 * Create theme color and color-scheme switching handlers.
 * @param ctx - The shared FixIt context object.
 * @returns Theme management methods.
 */
export function createTheme(ctx: FixItContext) {
  let _themeColorOnSwitchTheme: (() => void) | undefined

  /** Sync the `<meta name="theme-color">` tag with the current color scheme. */
  function initThemeColor() {
    const $meta = document.querySelector<HTMLMetaElement>('[name="theme-color"]')
    if (!$meta)
      return
    _themeColorOnSwitchTheme = _themeColorOnSwitchTheme || (() => {
      $meta.content = ctx.isDark ? $meta.dataset.dark! : $meta.dataset.light!
    })
    document.addEventListener('fixit:switch-theme', _themeColorOnSwitchTheme)
    _themeColorOnSwitchTheme()
  }

  /** Initialize the theme switch button cycle and system preference listener. */
  function initSwitchTheme() {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const modes = ['auto', 'light', 'dark'] as const
    const applyThemeMode = (mode: string, persist = true) => {
      ctx.themeMode = mode
      document.documentElement.dataset.themeMode = mode
      ctx.isDark = mode === 'auto' ? mql.matches : mode === 'dark'

      if (persist) {
        window.localStorage?.setItem('theme-mode', mode)
      }

      document.dispatchEvent(new CustomEvent('fixit:switch-theme', { detail: { isDark: ctx.isDark } }))
    }

    forEach(document.getElementsByClassName('theme-switch'), ($themeSwitch: Element) => {
      $themeSwitch.addEventListener('click', () => {
        const currentIndex = modes.indexOf(ctx.themeMode as typeof modes[number])
        const nextMode = modes[(currentIndex + 1) % modes.length]
        applyThemeMode(nextMode)
      }, false)
    })

    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      if (ctx.themeMode !== 'auto')
        return
      ctx.isDark = e.matches
      document.dispatchEvent(new CustomEvent('fixit:switch-theme', { detail: { isDark: ctx.isDark } }))
    })
  }

  return { initThemeColor, initSwitchTheme }
}
