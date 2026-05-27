/**
 * Link guard redirection page — displays target URL with copy and confirm actions.
 *
 * Responsibilities:
 * - Parse the `target` query parameter and display the destination URL.
 * - Allow users to copy the target URL to clipboard.
 * - Confirm and navigate to the target URL on user action.
 */
import { createCopyText } from '../utils'

const copyText = createCopyText()

function initLinkGuard(): void {
  const params = new URLSearchParams(window.location.search)
  const target = params.get('target')
  const $target = document.querySelector<HTMLElement>('.target')!
  const $copy = document.querySelector<HTMLButtonElement>('.copy-icon-btn')!
  const $confirm = document.querySelector<HTMLButtonElement>('.confirm-btn')!

  if (!target) {
    $target.textContent = 'Invalid target URL'
    return
  }

  $target.textContent = target
  $copy.disabled = false
  $confirm.disabled = false

  $copy.addEventListener('click', () => {
    copyText(target).then(() => {
      $copy.toggleAttribute('data-copied', true)
      window.setTimeout(() => {
        $copy.toggleAttribute('data-copied', false)
      }, 2000)
    }, () => {
      console.error('Clipboard write failed!', 'Your browser does not support clipboard API!')
    })
  })

  $confirm.addEventListener('click', () => {
    window.location.href = target
  })
}

document.addEventListener('DOMContentLoaded', initLinkGuard, false)
