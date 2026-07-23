import type { CoreService, ThemeService } from '../core/tokens'
import { eventBus } from '../core/event-bus'

/**
 * Theme module — color scheme switching and theme-color meta tag management.
 *
 * Responsibilities:
 * - Toggle between light, dark, and auto color schemes.
 * - Update `<meta name="theme-color">` based on current scheme.
 * - Persist user preference to localStorage.
 */
export class ThemeModule implements ThemeService {
  #mql = window.matchMedia('(prefers-color-scheme: dark)')
  #core: CoreService

  constructor(core: CoreService) {
    this.#core = core
  }

  /**
   * Apply a theme mode and emit the `fixit:switch-theme` event.
   * @param mode - `'auto'`, `'light'`, or `'dark'`.
   * @param persist - Whether to save the choice to localStorage (default: `true`).
   */
  setThemeMode(mode: string, persist = true) {
    const prevIsDark = this.#core.isDark
    this.#core.themeMode = mode
    document.documentElement.dataset.themeMode = mode
    this.#core.isDark = mode === 'auto' ? this.#mql.matches : mode === 'dark'

    if (persist) {
      window.localStorage?.setItem('theme-mode', mode)
    }

    eventBus.emit('fixit:switch-theme', {
      isDark: this.#core.isDark,
      mode,
      isChanged: prevIsDark !== this.#core.isDark,
    })
  }

  /** Sync the `<meta name="theme-color">` tag with the current color scheme. */
  initThemeColor() {
    const $meta = document.querySelector<HTMLMetaElement>('[name="theme-color"]')
    if (!$meta)
      return
    const applyThemeColor = (isDark: boolean) => {
      $meta.content = isDark ? $meta.dataset.dark! : $meta.dataset.light!
    }
    eventBus.on('fixit:switch-theme', ({ detail }) => {
      if (!detail.isChanged)
        return
      applyThemeColor(detail.isDark)
    })
    applyThemeColor(this.#core.isDark)
  }

  /** Initialize the theme switch button cycle and system preference listener. */
  initSwitchTheme() {
    const modes = ['auto', 'light', 'dark'] as const

    document.querySelectorAll('.theme-switch').forEach(($themeSwitch: Element) => {
      $themeSwitch.addEventListener('click', () => {
        const currentIndex = modes.indexOf(this.#core.themeMode as typeof modes[number])
        const nextMode = modes[(currentIndex + 1) % modes.length]
        this.setThemeMode(nextMode)
      }, false)
    })

    this.#mql.addEventListener('change', (e: MediaQueryListEvent) => {
      if (this.#core.themeMode !== 'auto')
        return
      const prevIsDark = this.#core.isDark
      this.#core.isDark = e.matches
      eventBus.emit('fixit:switch-theme', {
        isDark: this.#core.isDark,
        mode: 'auto',
        isChanged: prevIsDark !== this.#core.isDark,
      })
    })
  }

  /** Initialize theme color and switch handler. */
  setup() {
    this.initThemeColor()
    this.initSwitchTheme()
  }
}
