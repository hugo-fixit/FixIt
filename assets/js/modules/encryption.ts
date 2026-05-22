/** Encryption module — page decryption via FixItDecryptor and encrypted content toggling. */
import type { CoreService, EncryptionService } from '../core/tokens'
import { forEach } from '../utils'

export class EncryptionModule implements EncryptionService {
  constructor(private readonly core: CoreService) {}

  /**
   * Toggle between encrypted-hidden and decrypted-shown classes.
   * @param container - The root element containing encrypted elements.
   * @param show - `true` to show decrypted content, `false` to hide.
   */
  private _toggleEncryptedClass(container: Element | Document, show: boolean) {
    const fromClass = show ? 'encrypted-hidden' : 'decrypted-shown'
    const toClass = show ? 'decrypted-shown' : 'encrypted-hidden'
    forEach(container.querySelectorAll(`.${fromClass}`), ($element: Element) => {
      $element.classList.replace(fromClass, toClass)
    })
  }

  /** Initialize the FixItDecryptor and wire up decryption/reset events. */
  initFixItDecryptor() {
    if (!this.core.config.encryption)
      return
    const decryptor = new window.FixItDecryptor()

    document.addEventListener('fixit:decrypted', () => {
      this._toggleEncryptedClass(document, true)
    })
    document.addEventListener('fixit:partial-decrypted', (e: Event) => {
      const $content = (e as CustomEvent).detail.target as Element
      this._toggleEncryptedClass($content, true)
    })
    document.addEventListener('fixit:reset', () => {
      this._toggleEncryptedClass(document, false)
    })

    decryptor.init(this.core.config.encryption)
  }
}
