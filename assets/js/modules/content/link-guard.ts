import { createCopyText, flashCopiedTooltip } from '../../utils'

const copyText = createCopyText()

/**
 * Link guard dialog controller.
 *
 * Responsibilities:
 * - Bind confirm, cancel, and copy actions on the dialog.
 * - Open the dialog for guarded external links and track the pending URL.
 * - Reset the dialog state when it closes.
 */
export class LinkGuard {
  #dialog: HTMLDialogElement
  #target: HTMLElement | null
  #copy: HTMLElement | null
  #currentUrl: string | null = null

  constructor(dialog: HTMLDialogElement) {
    this.#dialog = dialog
    this.#target = dialog.querySelector<HTMLElement>('.target')
    this.#copy = dialog.querySelector<HTMLElement>('.copy-icon-btn')

    dialog.querySelector<HTMLElement>('.confirm-btn')?.addEventListener('click', () => {
      if (this.#currentUrl)
        window.open(this.#currentUrl, '_blank', 'noopener,noreferrer')
      this.close()
    })
    dialog.querySelector<HTMLElement>('.cancel-btn')?.addEventListener('click', () => this.close())
    this.#copy?.addEventListener('click', () => {
      if (!this.#currentUrl)
        return
      copyText(this.#currentUrl).then(() => {
        flashCopiedTooltip(this.#copy!)
      })
    })
  }

  /**
   * Bind guarded links within the target root.
   * @param target - The root element to search for guarded links.
   */
  init(target: Element | Document = document) {
    target.querySelectorAll<HTMLAnchorElement>('a[target="_blank"][data-guard="modal"]:not([data-init])').forEach(($link) => {
      $link.dataset.init = 'true'
      $link.addEventListener('click', (event) => {
        event.preventDefault()
        let url = $link.href
        try {
          url = new URL($link.href).searchParams.get('target') || url
        }
        catch {
          // Ignore malformed URLs and fall back to the original href.
        }

        this.#currentUrl = url
        if (this.#target)
          this.#target.textContent = url
        this.#dialog.showModal()
        ;(document.activeElement as HTMLElement)?.blur()
      }, false)
    })
  }

  /** Close the dialog and reset its state. */
  close() {
    if (this.#dialog.open)
      this.#dialog.close()
    this.#currentUrl = null
    if (this.#target)
      this.#target.textContent = '-'
  }
}
