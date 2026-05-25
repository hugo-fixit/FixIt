/** Encryption module — page decryption via FixItDecryptor and encrypted content toggling. */
import type { TypedEventBus } from '../core/event-bus'
import type { CoreService, EncryptionService } from '../core/tokens'

export class EncryptionModule implements EncryptionService {
  constructor(
    private readonly core: CoreService,
    private readonly bus: TypedEventBus,
  ) {}

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

  /** Initialize the FixItDecryptor and wire up decryption/reset events. */
  initFixItDecryptor() {
    if (!this.core.config.encryption)
      return
    const decryptor = new window.FixItDecryptor()

    this.bus.on('fixit:decrypted', () => {
      this.#toggleEncryptedClass(document, true)
    })
    this.bus.on('fixit:partial-decrypted', ({ detail }) => {
      this.#toggleEncryptedClass(detail.target, true)
    })
    this.bus.on('fixit:reset', () => {
      this.#toggleEncryptedClass(document, false)
    })

    decryptor.init(this.core.config.encryption)
  }
}
