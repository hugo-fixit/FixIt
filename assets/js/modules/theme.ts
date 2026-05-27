/**
 * Theme module — color scheme switching and theme-color meta tag management.
 *
 * Responsibilities:
 * - Toggle between light, dark, and auto color schemes.
 * - Update `<meta name="theme-color">` based on current scheme.
 * - Persist user preference to localStorage.
 */

import type { TypedEventBus } from '../core/event-bus'
import type { CoreService, ThemeService } from '../core/tokens'

export class ThemeModule implements ThemeService {
  constructor(
    private readonly core: CoreService,
    private readonly bus: TypedEventBus,
  ) {}

  /** Sync the `<meta name="theme-color">` tag with the current color scheme. */
  initThemeColor() {
    const $meta = document.querySelector<HTMLMetaElement>('[name="theme-color"]')
    if (!$meta)
      return
    const applyThemeColor = (isDark: boolean) => {
      $meta.content = isDark ? $meta.dataset.dark! : $meta.dataset.light!
    }
    this.bus.on('fixit:switch-theme', ({ detail }) => {
      if (!detail.isChanged)
        return
      applyThemeColor(detail.isDark)
    })
    applyThemeColor(this.core.isDark)
  }

  /** Initialize the theme switch button cycle and system preference listener. */
  initSwitchTheme() {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const modes = ['auto', 'light', 'dark'] as const
    const applyThemeMode = (mode: string, persist = true) => {
      const prevIsDark = this.core.isDark
      this.core.themeMode = mode
      document.documentElement.dataset.themeMode = mode
      this.core.isDark = mode === 'auto' ? mql.matches : mode === 'dark'

      if (persist) {
        window.localStorage?.setItem('theme-mode', mode)
      }

      this.bus.emit('fixit:switch-theme', {
        isDark: this.core.isDark,
        mode,
        isChanged: prevIsDark !== this.core.isDark,
      })
    }

    document.querySelectorAll('.theme-switch').forEach(($themeSwitch: Element) => {
      $themeSwitch.addEventListener('click', () => {
        const currentIndex = modes.indexOf(this.core.themeMode as typeof modes[number])
        const nextMode = modes[(currentIndex + 1) % modes.length]
        applyThemeMode(nextMode)
      }, false)
    })

    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      if (this.core.themeMode !== 'auto')
        return
      const prevIsDark = this.core.isDark
      this.core.isDark = e.matches
      this.bus.emit('fixit:switch-theme', {
        isDark: this.core.isDark,
        mode: 'auto',
        isChanged: prevIsDark !== this.core.isDark,
      })
    })
  }
}
