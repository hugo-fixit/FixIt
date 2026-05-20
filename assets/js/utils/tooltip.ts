/**
 * Flash a temporary tooltip message on an element.
 * @param el - The target element to show the tooltip on.
 * @param message - The tooltip message text.
 * @param duration - How long to display the tooltip in milliseconds.
 */
export function flashTooltip(el: HTMLElement, message: string, duration = 3000) {
  const CellTooltip = window.CellTooltip
  const originalTitle = el.dataset.ctTitle
  el.dataset.ctTitle = message
  const instance = CellTooltip.getOrCreateInstance(el)
  instance.refresh()
  instance.show()
  setTimeout(() => {
    el.dataset.ctTitle = originalTitle ?? ''
    instance.hide()
  }, duration)
}

/**
 * Flash a "copied" tooltip on a button, resetting after a delay.
 * @param btn - The button element to show the tooltip on.
 * @param duration - How long to display the tooltip in milliseconds.
 */
export function flashCopiedTooltip(btn: HTMLElement, duration = 2000) {
  btn.toggleAttribute('data-copied', true)
  flashTooltip(btn, btn.dataset.copiedText ?? '', duration)
  setTimeout(() => btn.toggleAttribute('data-copied', false), duration)
}
