/**
 * Link guard module — external link confirmation dialog with copy support.
 *
 * Responsibilities:
 * - Intercept clicks on external links and show a confirmation dialog.
 * - Allow users to copy the target URL from the dialog.
 */
import type { LinkGuardService } from '../core/tokens'
import { createCopyText, flashCopiedTooltip } from '../utils'

const copyText = createCopyText()

export class LinkGuardModule implements LinkGuardService {
  /**
   * Initialize the link-guard dialog and bind click handlers on guarded links.
   * @param target - The root element to search for guarded links.
   */
  initLinkGuardDialog(target: Element | Document = document) {
    const dialog = document.getElementById('link-guard-dialog') as HTMLDialogElement
    if (!dialog)
      return

    const $target = dialog.querySelector<HTMLElement>('.target')
    const $copy = dialog.querySelector<HTMLElement>('.copy-icon-btn')
    const $confirm = dialog.querySelector<HTMLElement>('.confirm-btn')
    const $cancel = dialog.querySelector<HTMLElement>('.cancel-btn')

    const _closeDialog = () => {
      if (dialog.open)
        dialog.close()
      ;(dialog as any)._target = null
      if ($target) {
        $target.textContent = '-'
      }
    }

    if (!dialog.dataset.init) {
      dialog.dataset.init = 'true'

      $confirm!.addEventListener('click', () => {
        if ((dialog as any)._target) {
          window.open((dialog as any)._target, '_blank', 'noopener,noreferrer')
        }
        _closeDialog()
      })

      $cancel!.addEventListener('click', _closeDialog)

      $copy!.addEventListener('click', () => {
        const textToCopy = (dialog as any)._target || ''
        if (!textToCopy)
          return
        copyText(textToCopy).then(() => {
          flashCopiedTooltip($copy!)
        })
      })
    }

    target.querySelectorAll<HTMLAnchorElement>('a[target="_blank"][data-guard="modal"]:not([data-init])').forEach(($link) => {
      $link.dataset.init = 'true'
      $link.addEventListener('click', (e) => {
        e.preventDefault()
        let targetUrl = $link.href
        try {
          const guardUrl = new URL($link.href)
          targetUrl = guardUrl.searchParams.get('target') || targetUrl
        }
        catch {
          // Ignore malformed URLs and fall back to the original href.
        }

        ;(dialog as any)._target = targetUrl
        if ($target) {
          $target.textContent = targetUrl
        }
        dialog.showModal()
        ;(document.activeElement as HTMLElement)?.blur()
      }, false)
    })
  }
}
