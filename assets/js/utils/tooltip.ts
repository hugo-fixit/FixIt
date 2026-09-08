/**
 * Flash a temporary tooltip message on an element.
 * @param el - The target element to show the tooltip on.
 * @param message - The tooltip message text.
 * @param duration - How long to display the tooltip in milliseconds.
 * @param clearPending - Whether to clear CellTooltip's internal pending hide timer (e.g. from focusout).
 */
export function flashTooltip(el: HTMLElement, message: string, duration = 3000, clearPending = false) {
  const CellTooltip = window.CellTooltip
  clearTimeout(Number(el.dataset.flashTimer))
  const instance = CellTooltip.getOrCreateInstance(el)
  if (!instance.flashOriginalTitle) {
    instance.flashOriginalTitle = instance.config.title ?? ''
  }
  instance.config.title = message
  instance.refresh()
  if (clearPending) {
    instance.enter()
  }
  instance.show()
  el.dataset.flashTimer = String(setTimeout(() => {
    instance.config.title = instance.flashOriginalTitle
    instance.flashOriginalTitle = null
    instance.hide()
    delete el.dataset.flashTimer
  }, duration))
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
