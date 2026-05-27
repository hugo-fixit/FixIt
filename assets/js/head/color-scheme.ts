/**
 * Color scheme initialization — runs synchronously in `<head>` before body rendering.
 *
 * Responsibilities:
 * - Read stored theme mode from localStorage, falling back to site default.
 * - Set `data-theme-mode` on `<html>` to prevent flash of wrong theme.
 */

// @ts-expect-error — Hugo js.Build virtual module
import params from '@params';

(function () {
  const localStorage = window.localStorage
  const storedMode = localStorage?.getItem('theme-mode')
  const themeMode = storedMode || (
    params.defaultTheme === 'light' || params.defaultTheme === 'dark'
      ? params.defaultTheme
      : 'auto'
  )

  document.documentElement.dataset.themeMode = themeMode
})()
