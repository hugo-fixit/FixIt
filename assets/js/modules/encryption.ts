/** Encryption module — page decryption via FixItDecryptor and encrypted content toggling. */
import type { FixItContext } from '../types'
import { forEach } from '../utils'

/**
 * Create page decryption and encrypted-content toggle handlers.
 * @param ctx - The shared FixIt context object.
 * @returns Decryption initialization methods.
 */
export function createEncryption(ctx: FixItContext) {
  /**
   * Toggle between encrypted-hidden and decrypted-shown classes.
   * @param container - The root element containing encrypted elements.
   * @param show - `true` to show decrypted content, `false` to hide.
   */
  function _toggleEncryptedClass(container: Element | Document, show: boolean) {
    const fromClass = show ? 'encrypted-hidden' : 'decrypted-shown'
    const toClass = show ? 'decrypted-shown' : 'encrypted-hidden'
    forEach(container.querySelectorAll(`.${fromClass}`), ($element: Element) => {
      $element.classList.replace(fromClass, toClass)
    })
  }

  /** Initialize the FixItDecryptor and wire up decryption/reset events. */
  function initFixItDecryptor() {
    if (!ctx.config.encryption)
      return
    const decryptor = new window.FixItDecryptor()

    document.addEventListener('fixit:decrypted', () => {
      _toggleEncryptedClass(document, true)
    })
    document.addEventListener('fixit:partial-decrypted', (e: Event) => {
      const $content = (e as CustomEvent).detail.target as Element
      _toggleEncryptedClass($content, true)
    })
    document.addEventListener('fixit:reset', () => {
      _toggleEncryptedClass(document, false)
    })

    decryptor.init(ctx.config.encryption)
  }

  return { initFixItDecryptor }
}
