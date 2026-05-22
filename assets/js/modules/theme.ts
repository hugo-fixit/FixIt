/** Theme module — color scheme switching and theme-color meta tag management. */

import type { TypedEventBus } from '../core/event-bus'
import type { CoreService, ThemeService } from '../core/tokens'
import { forEach } from '../utils'

export class ThemeModule implements ThemeService {
  #themeColorOnSwitchTheme: (() => void) | undefined

  constructor(
    private readonly core: CoreService,
    private readonly bus: TypedEventBus,
  ) {}

  /** Sync the `<meta name="theme-color">` tag with the current color scheme. */
  initThemeColor() {
    const $meta = document.querySelector<HTMLMetaElement>('[name="theme-color"]')
    if (!$meta)
      return
    this.#themeColorOnSwitchTheme = this.#themeColorOnSwitchTheme || (() => {
      $meta.content = this.core.isDark ? $meta.dataset.dark! : $meta.dataset.light!
    })
    this.bus.on('fixit:switch-theme', this.#themeColorOnSwitchTheme)
    this.#themeColorOnSwitchTheme()
  }

  /** Initialize the theme switch button cycle and system preference listener. */
  initSwitchTheme() {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const modes = ['auto', 'light', 'dark'] as const
    const applyThemeMode = (mode: string, persist = true) => {
      this.core.themeMode = mode
      document.documentElement.dataset.themeMode = mode
      this.core.isDark = mode === 'auto' ? mql.matches : mode === 'dark'

      if (persist) {
        window.localStorage?.setItem('theme-mode', mode)
      }

      this.bus.emit('fixit:switch-theme', { isDark: this.core.isDark })
    }

    forEach(document.getElementsByClassName('theme-switch'), ($themeSwitch: Element) => {
      $themeSwitch.addEventListener('click', () => {
        const currentIndex = modes.indexOf(this.core.themeMode as typeof modes[number])
        const nextMode = modes[(currentIndex + 1) % modes.length]
        applyThemeMode(nextMode)
      }, false)
    })

    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      if (this.core.themeMode !== 'auto')
        return
      this.core.isDark = e.matches
      this.bus.emit('fixit:switch-theme', { isDark: this.core.isDark })
    })
  }
}
