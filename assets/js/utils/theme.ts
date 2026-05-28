/**
 * Get the current theme mode from the root element.
 * @returns The theme mode string: `'auto'`, `'light'`, or `'dark'`.
 */
export function getThemeMode(): string {
  return document.documentElement.dataset.themeMode || 'auto'
}

/**
 * Check whether the current effective theme is dark.
 * In auto mode, this follows the system color scheme preference.
 * @returns `true` if dark mode is active.
 */
export function isDarkMode(): boolean {
  const themeMode = getThemeMode()
  return themeMode === 'auto'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : themeMode === 'dark'
}
