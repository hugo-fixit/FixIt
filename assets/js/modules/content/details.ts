/**
 * Attach toggle behaviour to `.details` elements.
 * @param target - The root element to search within.
 */
export function initDetails(target: Element | Document = document) {
  target.querySelectorAll<HTMLElement>('.details:not(.disabled)').forEach(($details) => {
    const $summary = $details.querySelector<HTMLElement>('.details-summary')!
    $summary?.addEventListener('click', () => {
      $details.classList.toggle('open')
    }, false)
  })
}
