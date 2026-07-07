/**
 * Encrypted content decryptor for FixIt pages and shortcodes.
 *
 * Responsibilities:
 * - Validate password input and decrypt AES-256-GCM payloads.
 * - Support both full-page and shortcode-scoped encrypted blocks.
 * - Persist and validate page-level decrypt cache with expiration.
 * - Emit FixIt events for content/TOC rendering and re-encrypt flows.
 *
 * Encrypted payloads are stored in `<template data-password="..." data-cipher="...">` elements.
 * Using `<template>` prevents the browser from rendering inner content (mermaid, echarts, etc.).
 *
 * Payload formats:
 * - v2 (current): PBKDF2(SHA-256(password), 100k iterations) → base64(salt).base64(iv).base64(ciphertext+tag)
 * - Password verification: data-password stores PBKDF2(SHA-256(password), data-verify-salt) when post-encrypted
 */
import { eventBus } from '../core/event-bus'
import { flashTooltip } from '../utils'

interface DecryptorOptions {
  duration?: number
}

interface CachedStat {
  expiration: number
  password: string
  /** SHA-256 hash of the password, used for AES key derivation */
  sha256: string
}

const PBKDF2_ITERATIONS = 100_000

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
  }

  /** Toggle encrypted/decrypted visibility helper classes in the given scope. */
  #toggleClass(container: Element | Document, show: boolean): void {
    const fromClass = show ? 'encrypted-hidden' : 'decrypted-shown'
    const toClass = show ? 'decrypted-shown' : 'encrypted-hidden'
    container.querySelectorAll(`.${fromClass}`).forEach(($element: Element) => {
      $element.classList.replace(fromClass, toClass)
    })
  }

  /** Copy TOC HTML to all TOC containers. */
  #renderToc(html: string): void {
    const $template = document.createElement('template')
    $template.innerHTML = html
    const $tocCore = $template.content.querySelector('#TableOfContents')
    if (!$tocCore)
      return
    for (const id of ['toc-content-static', 'toc-content-auto', 'toc-content-drawer']) {
      const $container = document.getElementById(id)
      if (!$container)
        continue
      $container.textContent = ''
      const $clone = $tocCore.cloneNode(true) as HTMLElement
      $clone.removeAttribute('id')
      $container.appendChild($clone)
    }
  }

  /**
   * Decrypt a v2 payload using PBKDF2 key derivation.
   * Format: base64(salt).base64(iv).base64(ciphertext+tag)
   */
  async #decryptV2(payload: string, passwordHash: string): Promise<string> {
    const [saltBase64, ivBase64, encryptedBase64] = payload.split('.', 3)
    if (!saltBase64 || !ivBase64 || !encryptedBase64) {
      throw new Error('Invalid v2 payload format: expected 3 segments')
    }

    const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0))
    const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0))
    const encrypted = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0))

    const passwordBytes = new TextEncoder().encode(passwordHash)
    const baseKey = await crypto.subtle.importKey('raw', passwordBytes, 'PBKDF2', false, ['deriveKey'])
    const aesKey = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt'],
    )

    const plainBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, tagLength: 128 },
      aesKey,
      encrypted,
    )

    return new TextDecoder().decode(plainBuffer)
  }

  /**
   * Compute SHA-256 hex digest for user input.
   * @param input - Raw password input.
   * @returns Lowercase hex SHA-256 digest.
   */
  async #sha256Hex(input: string): Promise<string> {
    const bytes = new TextEncoder().encode(input)
    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes)
    return Array.from(new Uint8Array(hashBuffer))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
  }

  /**
   * Derive a verification hash using PBKDF2 from a SHA-256 password hash.
   */
  async #deriveVerifyHash(passwordHash: string, salt: ArrayBuffer): Promise<string> {
    const passwordBytes = new TextEncoder().encode(passwordHash)
    const baseKey = await crypto.subtle.importKey('raw', passwordBytes, 'PBKDF2', false, ['deriveBits'])
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
      baseKey,
      256,
    )
    return Array.from(new Uint8Array(bits))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
  }

  /**
   * Decrypt TOC template content and refill TOC containers directly.
   * The template itself stays encrypted so re-encrypt can restore the initial state.
   * @param passwordHash - SHA-256 hash for AES key derivation.
   */
  async #decryptToc(passwordHash: string): Promise<void> {
    const $tocTemplate = document.querySelector<HTMLTemplateElement>('template[data-toc]')
    if (!$tocTemplate)
      return
    try {
      const cipher = $tocTemplate.dataset.cipher
      const payload = $tocTemplate.innerHTML

      let html: string
      if (!cipher) {
        // Dev mode: no post-build encryption, TOC is plaintext
        html = payload
      }
      else if (cipher === 'aes-256-gcm-v2') {
        html = await this.#decryptV2(payload, passwordHash)
      }
      else {
        throw new Error(`Unsupported cipher: ${cipher}`)
      }

      this.#renderToc(html)
      eventBus.emit('fixit:toc-decrypted', { html })
    }
    catch (err) {
      console.error('[FixItDecryptor] Failed to restore TOC:', err)
    }
  }

  /**
   * Decrypt template payload and write plaintext into the target container.
   * @param $template - Encrypted content template element.
   * @param $target - Target container that should receive decrypted content.
   * @param passwordHash - SHA-256 hash for AES key derivation.
   */
  async #decryptContent($template: HTMLTemplateElement, $target: HTMLElement, passwordHash: string): Promise<void> {
    try {
      const cipher = $template.dataset.cipher
      const payload = $template.innerHTML

      let html: string
      if (!cipher) {
        // Dev mode: no post-build encryption, content is plaintext
        html = payload
      }
      else if (cipher === 'aes-256-gcm-v2') {
        html = await this.#decryptV2(payload, passwordHash)
      }
      else {
        throw new Error(`Unsupported cipher: ${cipher}`)
      }

      $target.innerHTML = html
      $template.parentElement!.classList.add('decrypted')
      const isPage = $target.id === 'content'
      this.#toggleClass(isPage ? document : $target, true)
      eventBus.emit('fixit:content-decrypted', { target: $target, isPage })
    }
    catch (err) {
      const $encryptor = $template.parentElement!
      const $input = $encryptor.querySelector<HTMLInputElement>('.fixit-decryptor-input')
      if ($input) {
        flashTooltip($input, err instanceof Error ? err.message : 'Decryption failed')
      }
      return console.error(err)
    }
  }

  /**
   * Validate user input against the stored password hash; invoke callback on success.
   * Supports both PBKDF2-verified (post-build) and plain SHA-256 (dev mode) passwords.
   * @param $encryptor - The `<fixit-encryptor>` element containing the input field.
   * @param callback - Invoked with `(template, sha256Hash)` on success.
   */
  async #validatePassword($encryptor: Element, callback: ($template: HTMLTemplateElement, passwordHash: string, verifyHash?: string) => Promise<void>): Promise<void> {
    const $template = $encryptor.querySelector<HTMLTemplateElement>('template[data-password]')!
    const storedHash = $template.dataset.password!
    const verifySalt = $template.dataset.verifySalt
    const inputEl = $encryptor.querySelector<HTMLInputElement>('.fixit-decryptor-input')!
    const input = inputEl.value.trim()
    const inputSha256 = await this.#sha256Hex(input)

    inputEl.value = ''
    inputEl.blur()
    if (!input) {
      flashTooltip(inputEl, 'Please enter the correct password!')
      return console.warn('Please enter the correct password!')
    }

    let matches: boolean
    let verifyHash: string
    if (verifySalt) {
      // Post-build: stored hash is PBKDF2(SHA-256(password), verifySalt)
      const salt = Uint8Array.from(atob(verifySalt), c => c.charCodeAt(0)).buffer as ArrayBuffer
      verifyHash = await this.#deriveVerifyHash(inputSha256, salt)
      matches = verifyHash === storedHash
    }
    else {
      // Dev mode: stored hash is SHA-256(password)
      verifyHash = inputSha256
      matches = inputSha256 === storedHash
    }

    if (!matches) {
      flashTooltip(inputEl, `Password error: ${input} not the correct password!`)
      return console.warn(`Password error: ${input} not the correct password!`)
    }
    // Store verifyHash for cache validation, inputSha256 for AES key derivation
    await callback($template, inputSha256, verifyHash)
  }

  /**
   * Initialize page-level and/or shortcode-level decryption based on flags.
   * @param options - `{ all?, shortcode? }` controlling which modes to activate.
   * @param options.all - Enable whole-page decryption.
   * @param options.shortcode - Enable shortcode-level decryption.
   */
  init({ all, shortcode }: { all?: boolean, shortcode?: boolean }): void {
    if (shortcode) {
      eventBus.on('fixit:content-decrypted', ({ detail }) => {
        this.initShortcodes(detail.target)
      })
    }
    if (all) {
      this.initPage()
    }
    else if (shortcode) {
      this.initShortcodes(document.querySelector<HTMLElement>('#content')!)
    }
  }

  /** Initialize whole-page decryption with cache validation and input handlers. */
  initPage(): void {
    this.validateCache()
    const $encryptor = document.querySelector<HTMLElement>('article > fixit-encryptor')!
    const $content = document.querySelector<HTMLElement>('#content')!

    const decryptorHandler = () => {
      void this.#validatePassword($encryptor, async ($template, passwordHash, verifyHash) => {
        window.localStorage?.setItem(
          `fixit-decryptor/#${location.pathname}`,
          JSON.stringify({
            expiration: Math.ceil(Date.now() / 1000) + this.options.duration,
            password: verifyHash ?? passwordHash,
            sha256: passwordHash,
          }),
        )
        await this.#decryptToc(passwordHash)
        await this.#decryptContent($template, $content, passwordHash)
      }).catch(console.error)
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

    // Re-encrypt button only orchestrates state/cache reset; modules handle DOM cleanup.
    const $reEncryptBtn = $encryptor.querySelector<HTMLElement>('.fixit-encryptor-btn')
    $reEncryptBtn?.addEventListener('click', (e) => {
      e.preventDefault()
      window.CellTooltip?.getOrCreateInstance($reEncryptBtn).dispose()
      for (const id of ['toc-content-static', 'toc-content-auto', 'toc-content-drawer']) {
        const $el = document.getElementById(id)
        if ($el) {
          $el.textContent = ''
        }
      }
      $content.animate(
        [
          { opacity: 1, transform: 'scaleY(1)', transformOrigin: 'top' },
          { opacity: 0, transform: 'scaleY(0)', transformOrigin: 'top' },
        ],
        { duration: 200, easing: 'ease-out' },
      ).finished.then(() => {
        $content.textContent = ''
        $content.style.opacity = ''
        $content.style.transform = ''
      })
      $encryptor.classList.remove('decrypted')
      this.#toggleClass(document, false)
      window.localStorage?.removeItem(`fixit-decryptor/#${location.pathname}`)
      eventBus.emit('fixit:re-encrypt')
    })

    $encryptor.classList.add('initialized')
  }

  /**
   * Initialize decryption for all unprocessed `fixit-encryptor` shortcodes under a parent.
   * @param $parent - The parent element to search for shortcodes.
   */
  initShortcodes($parent: Element): void {
    const $shortcodes = $parent.querySelectorAll<HTMLElement>('fixit-encryptor:not(.initialized)')

    $shortcodes.forEach(($shortcode) => {
      const decryptorHandler = () => {
        const $content = $shortcode.querySelector<HTMLElement>('.decryptor-content')!
        void this.#validatePassword($shortcode, async ($template, passwordHash) => {
          await this.#decryptContent($template, $content, passwordHash)
        }).catch(console.error)
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
  validateCache(): this {
    const $content = document.querySelector<HTMLElement>('#content')!
    const $encryptor = document.querySelector<HTMLElement>('article > fixit-encryptor')!
    const $template = $encryptor.querySelector<HTMLTemplateElement>('template[data-password]')!
    const password = $template.dataset.password
    const cachedStat: CachedStat | null = JSON.parse(window.localStorage?.getItem(`fixit-decryptor/#${location.pathname}`) || 'null')

    if (!cachedStat || cachedStat.password !== password || cachedStat.expiration < Math.ceil(Date.now() / 1000)) {
      if (cachedStat) {
        window.localStorage?.removeItem(`fixit-decryptor/#${location.pathname}`)
        console.warn('The password has expired, please re-enter!')
      }
      return this
    }
    // Use sha256 hash for AES key derivation (not the verification hash)
    void this.#decryptToc(cachedStat.sha256)
      .then(() => this.#decryptContent($template, $content, cachedStat.sha256))
    return this
  }
}

window.FixItDecryptor = FixItDecryptor
