/**
 * for link redirection page
 */

import { createCopyText } from '../utils'

const copyText = createCopyText()

function initLinkGuard() {
  const params = new URLSearchParams(window.location.search)
  const target = params.get('target')
  const $target = document.querySelector('.target')
  const $copy = document.querySelector('.copy-icon-btn')
  const $confirm = document.querySelector('.confirm-btn')

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
