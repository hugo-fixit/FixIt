import type { CoreService, EncryptionService } from '../core/tokens'
import { eventBus } from '../core/event-bus'

/**
 * Encryption module — page decryption via FixItDecryptor and encrypted content toggling.
 *
 * Responsibilities:
 * - Initialize FixItDecryptor for full-page and shortcode-scoped decryption.
 * - Toggle visibility of encrypted content sections.
 */
export class EncryptionModule implements EncryptionService {
  constructor(private readonly core: CoreService) {}

  /**
   * Toggle between encrypted-hidden and decrypted-shown classes.
   * @param container - The root element containing encrypted elements.
   * @param show - `true` to show decrypted content, `false` to hide.
   */
  #toggleEncryptedClass(container: Element | Document, show: boolean) {
    const fromClass = show ? 'encrypted-hidden' : 'decrypted-shown'
    const toClass = show ? 'decrypted-shown' : 'encrypted-hidden'
    container.querySelectorAll(`.${fromClass}`).forEach(($element: Element) => {
      $element.classList.replace(fromClass, toClass)
    })
  }

  /** Initialize the FixItDecryptor and wire up decryption/re-encryption events. */
  setup() {
    if (!this.core.config.encryption)
      return
    const decryptor = new window.FixItDecryptor()

    eventBus.on('fixit:decrypted', () => {
      this.#toggleEncryptedClass(document, true)
    })
    eventBus.on('fixit:partial-decrypted', ({ detail }) => {
      this.#toggleEncryptedClass(detail.target, true)
    })
    eventBus.on('fixit:re-encrypt', () => {
      this.#toggleEncryptedClass(document, false)
    })

    decryptor.init(this.core.config.encryption)
  }
}
