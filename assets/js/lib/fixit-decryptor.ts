/**
 * Encrypted content decryptor for FixIt pages and shortcodes.
 *
 * Responsibilities:
 * - Validate password input and decrypt Base64 payloads into target containers.
 * - Support both full-page and shortcode-scoped encrypted blocks.
 * - Persist and validate page-level decrypt cache with expiration.
 * - Emit and react to FixIt events for decrypted/partial-decrypted/reset flows.
 */
import { TypedEventBus } from '../core/event-bus'
import { flashTooltip } from '../utils'

declare const CryptoJS: any

const eventBus = new TypedEventBus()

interface DecryptorOptions {
  duration?: number
}

interface CachedStat {
  expiration: number
  password: string
  salt: string
}

class FixItDecryptor {
  options: Required<DecryptorOptions>

  /**
   * Create a decryptor instance and register custom elements.
   * @param options - Configuration options.
   * @param options.duration - Cache duration in seconds for decrypted content (default: 24 hours).
   */
  constructor(options: DecryptorOptions = {}) {
    this.options = { duration: options.duration || 24 * 60 * 60 }
    customElements.get('fixit-encryptor') || customElements.define('fixit-encryptor', class extends HTMLElement {})
    customElements.get('cipher-text') || customElements.define('cipher-text', class extends HTMLElement {})
  }

  /**
   * Decode Base64 cipher text and inject the decrypted HTML into the target.
   * @param $cipherText - The `<cipher-text>` element containing the encrypted content.
   * @param $target - The DOM element to inject decrypted HTML into.
   * @param salt - The salt string derived from the password.
   */
  #decryptContent($cipherText: HTMLElement, $target: HTMLElement, salt: string) {
    try {
      $target.innerHTML = CryptoJS!.enc.Base64
        .parse($cipherText.textContent!.replace(salt, ''))
        .toString(CryptoJS!.enc.Utf8)
      $cipherText.parentElement!.classList.add('decrypted')
    }
    catch (err) {
      return console.error(err)
    }
    if ($target.id === 'content')
      eventBus.emit('fixit:decrypted')
    else
      eventBus.emit('fixit:partial-decrypted', { target: $target })
  }

  /**
   * Validate user input against the stored password hash; invoke callback on success.
   * @param $encryptor - The `<fixit-encryptor>` element containing the input field.
   * @param callback - Invoked with `(cipherText, passwordHash, salt)` on success.
   */
  async #validatePassword($encryptor: Element, callback: ($cipherText: HTMLElement, passwordHash: string, salt: string) => void) {
    const $cipherText = $encryptor.querySelector<HTMLElement>('cipher-text')!
    const password = $cipherText.dataset.password
    const inputEl = $encryptor.querySelector<HTMLInputElement>('.fixit-decryptor-input')!
    const input = inputEl.value.trim()
    const { h64ToString } = await window.xxhash!()
    const inputHash = h64ToString(input)
    const inputSha256 = CryptoJS!.SHA256(input).toString()
    const saltLen = input.length % 2 ? input.length : input.length + 1

    inputEl.value = ''
    inputEl.blur()
    if (!input) {
      flashTooltip(inputEl, 'Please enter the correct password!')
      return console.warn('Please enter the correct password!')
    }
    if (inputHash !== password) {
      flashTooltip(inputEl, `Password error: ${input} not the correct password!`)
      return console.warn(`Password error: ${input} not the correct password!`)
    }
    callback($cipherText, inputHash, inputSha256.slice(saltLen))
  }

  /**
   * Initialize page-level and/or shortcode-level decryption based on flags.
   * @param options - `{ all?, shortcode? }` controlling which modes to activate.
   * @param options.all - Enable whole-page decryption.
   * @param options.shortcode - Enable shortcode-level decryption.
   */
  init({ all, shortcode }: { all?: boolean, shortcode?: boolean }) {
    const $content = document.querySelector<HTMLElement>('#content')
    if (shortcode) {
      eventBus.on('fixit:decrypted', () => {
        this.initShortcodes($content!)
      })
      eventBus.on('fixit:partial-decrypted', (e) => {
        this.initShortcodes(e.detail.target)
      })
    }
    if (all) {
      this.initPage()
    }
    else if (shortcode) {
      this.initShortcodes($content!)
    }
  }

  /** Initialize whole-page decryption with cache validation and encrypt/re-encrypt buttons. */
  initPage() {
    this.validateCache()
    const $encryptor = document.querySelector<HTMLElement>('article > fixit-encryptor')!
    const $content = document.querySelector<HTMLElement>('#content')!

    const decryptorHandler = () => {
      this.#validatePassword($encryptor, ($cipherText, passwordHash, salt) => {
        window.localStorage?.setItem(
          `fixit-decryptor/#${location.pathname}`,
          JSON.stringify({
            expiration: Math.ceil(Date.now() / 1000) + this.options.duration,
            password: passwordHash,
            salt,
          }),
        )
        this.#decryptContent($cipherText, $content, salt)
      })
    }

    $encryptor.querySelector('.fixit-decryptor-input')?.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') {
        e.preventDefault()
        decryptorHandler()
      }
    })

    $encryptor.querySelector('.fixit-decryptor-btn')?.addEventListener('click', (e) => {
      e.preventDefault()
      decryptorHandler()
    })

    $encryptor.querySelector('.fixit-encryptor-btn')?.addEventListener('click', (e) => {
      e.preventDefault()
      $encryptor.classList.remove('decrypted')
      $content.innerHTML = ''
      window.localStorage?.removeItem(`fixit-decryptor/#${location.pathname}`)
      eventBus.emit('fixit:reset')
    })

    $encryptor.classList.add('initialized')
  }

  /**
   * Initialize decryption for all unprocessed `fixit-encryptor` shortcodes under a parent.
   * @param $parent - The parent element to search for shortcodes.
   */
  initShortcodes($parent: Element) {
    const $shortcodes = $parent.querySelectorAll<HTMLElement>('fixit-encryptor:not(.initialized)')

    $shortcodes.forEach(($shortcode) => {
      const decryptorHandler = () => {
        const $content = $shortcode.querySelector<HTMLElement>('.decryptor-content')!
        this.#validatePassword($shortcode, ($cipherText, passwordHash, salt) => {
          this.#decryptContent($cipherText, $content, salt)
        })
      }

      $shortcode.querySelector('.fixit-decryptor-input')?.addEventListener('keydown', (e) => {
        if ((e as KeyboardEvent).key === 'Enter') {
          e.preventDefault()
          decryptorHandler()
        }
      })

      $shortcode.querySelector('.fixit-decryptor-btn')?.addEventListener('click', (e) => {
        e.preventDefault()
        decryptorHandler()
      })

      $shortcode.classList.add('initialized')
    })
  }

  /** Restore decrypted content from localStorage cache if the password has not expired. */
  validateCache() {
    const $content = document.querySelector<HTMLElement>('#content')!
    const $encryptor = document.querySelector<HTMLElement>('article > fixit-encryptor')!
    const $cipherText = $encryptor.querySelector<HTMLElement>('cipher-text')!
    const password = $cipherText.dataset.password
    const cachedStat: CachedStat | null = JSON.parse(window.localStorage?.getItem(`fixit-decryptor/#${location.pathname}`) || 'null')

    if (!cachedStat || cachedStat.password !== password || cachedStat.expiration < Math.ceil(Date.now() / 1000)) {
      if (cachedStat) {
        window.localStorage?.removeItem(`fixit-decryptor/#${location.pathname}`)
        console.warn('The password has expired, please re-enter!')
      }
      return this
    }
    this.#decryptContent($cipherText, $content, cachedStat.salt)
    return this
  }
}

window.FixItDecryptor = FixItDecryptor
