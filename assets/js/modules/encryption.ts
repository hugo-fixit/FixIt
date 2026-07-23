import type { CoreService, EncryptionService } from '../core/tokens'

/**
 * Encryption module — bootstrap page/shortcode decryption via FixItDecryptor.
 *
 * Responsibilities:
 * - Initialize FixItDecryptor for full-page and shortcode-scoped decryption.
 */
export class EncryptionModule implements EncryptionService {
  #core: CoreService

  constructor(core: CoreService) {
    this.#core = core
  }

  /** Initialize FixItDecryptor with encryption config. */
  setup() {
    if (!this.#core.config.encryption || !window.FixItDecryptor)
      return
    const decryptor = new window.FixItDecryptor()

    decryptor.init(this.#core.config.encryption)
  }
}
