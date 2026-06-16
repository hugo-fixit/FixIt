/**
 * Check whether the current platform is macOS.
 * @returns `true` if the user agent indicates macOS.
 */
export function isMac(): boolean {
  return /mac/i.test(navigator.platform)
}

/**
 * Check whether the current viewport matches the mobile breakpoint.
 * @returns `true` if the viewport width is 680px or less.
 */
export function isMobile(): boolean {
  return window.matchMedia('only screen and (max-width: 680px)').matches
}

/**
 * Check whether the table of contents should use the static layout.
 * @returns `true` if TOC should be rendered statically.
 */
export function isTocStatic(): boolean {
  return (document.getElementById('toc-static') as HTMLElement)?.dataset?.kept === 'true' || window.matchMedia('only screen and (max-width: 960px)').matches
}
