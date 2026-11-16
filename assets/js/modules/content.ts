import type { CodeService, ContentService, CoreService } from '../core/tokens'
import { eventBus } from '../core/event-bus'
import { createCopyText, flashCopiedTooltip } from '../utils'

const CellTooltip = window.CellTooltip
const copyText = createCopyText()

/**
 * Content module — details toggle, tooltips, footnotes, SVG icons, and link guard.
 *
 * Responsibilities:
 * - Attach toggle behaviour to `.details` elements.
 * - Initialize CellTooltip on action buttons, copy buttons, and footnotes.
 * - Fetch and inline SVG icons from `data-svg-src` attributes.
 * - Set up link guard dialog for external link confirmation.
 * - Re-initialize components after encrypted content is decrypted.
 */
export class ContentModule implements ContentService {
  #core: CoreService
  #code: CodeService

  constructor(core: CoreService, code: CodeService) {
    this.#core = core
    this.#code = code
  }

  /** Fetch and inline SVG icons referenced by `data-svg-src` attributes. */
  initSVGIcon() {
    document.querySelectorAll<HTMLElement>('[data-svg-src]').forEach(($icon) => {
      fetch($icon.dataset.svgSrc!)
        .then(response => response.text())
        .then((svg) => {
          const $temp = document.createElement('div')
          $temp.insertAdjacentHTML('afterbegin', svg)
          const $svg = $temp.firstChild as SVGElement
          $svg.dataset.svgSrc = $icon.dataset.svgSrc
          $svg.classList.add('icon')
          const $titleElements = $svg.getElementsByTagName('title')
          $titleElements.length && $svg.removeChild($titleElements[0])
          $icon.parentElement!.replaceChild($svg, $icon)
        })
        .catch((err) => {
          console.error(err)
        })
    })
  }

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

  /**
   * Attach toggle behaviour to `.details` elements.
   * @param target - The root element to search within.
   */
  initDetails(target: Element | Document = document) {
    target.querySelectorAll<HTMLElement>('.details:not(.disabled)').forEach(($details) => {
      const $summary = $details.querySelector<HTMLElement>('.details-summary')!
      $summary?.addEventListener('click', () => {
        $details.classList.toggle('open')
      }, false)
    })
  }

  /** Initialize collection sort toggle buttons. */
  initCollectionSort() {
    document.querySelectorAll<HTMLButtonElement>('.collection-sort-toggle').forEach(($btn) => {
      if ($btn.dataset.init)
        return
      $btn.dataset.init = 'true'

      const $details = $btn.closest('.collection-details')
      const $list = $details?.querySelector<HTMLUListElement>('.collection-list')
      const $nav = $details?.querySelector<HTMLElement>('.collection-nav-simple')
      if (!$list || !$nav)
        return

      let isAsc = true

      $btn.addEventListener('click', (e) => {
        e.stopPropagation()
        isAsc = !isAsc

        // Reverse list items
        Array.from($list.children).reverse().forEach(el => $list.appendChild(el))

        // Toggle icon
        const $icon = $btn.querySelector<HTMLElement>('i')
        if ($icon) {
          $icon.classList.toggle('fa-arrow-down-wide-short', !isAsc)
          $icon.classList.toggle('fa-arrow-up-short-wide', isAsc)
        }

        // Find active item and update nav from its siblings
        const $items = Array.from($list.children)
        const $active = $list.querySelector('.active')
        const activeIdx = $active
          ? $items.indexOf($active.closest('li')!)
          : -1

        // Update counter
        const $counter = $nav.querySelector<HTMLElement>('.text-secondary:not(.collection-nav-item)')
        if ($counter && activeIdx >= 0) {
          $counter.textContent = `${activeIdx + 1}/${$items.length}`
        }

        // Update prev link (left arrow)
        const $navItems = $nav.querySelectorAll<HTMLElement>('.collection-nav-item')
        const $prevItem = activeIdx > 0
          ? $items[activeIdx - 1].querySelector('a')
          : null
        if ($navItems[0]) {
          if ($prevItem) {
            const $link = document.createElement('a')
            $link.href = $prevItem.href
            $link.className = 'collection-nav-item'
            $link.rel = 'prev'
            $link.title = $prevItem.title || ''
            const $i = document.createElement('i')
            $i.className = 'fa-solid fa-angle-left'
            $link.appendChild($i)
            $navItems[0].replaceWith($link)
          }
          else {
            const $i = document.createElement('i')
            $i.className = 'fa-solid fa-angle-left collection-nav-item text-secondary'
            $navItems[0].replaceWith($i)
          }
        }

        // Update next link (right arrow)
        const $nextItem = activeIdx >= 0 && activeIdx < $items.length - 1
          ? $items[activeIdx + 1].querySelector('a')
          : null
        if ($navItems[1]) {
          if ($nextItem) {
            const $link = document.createElement('a')
            $link.href = $nextItem.href
            $link.className = 'collection-nav-item'
            $link.rel = 'next'
            $link.title = $nextItem.title || ''
            const $i = document.createElement('i')
            $i.className = 'fa-solid fa-angle-right'
            $link.appendChild($i)
            $navItems[1].replaceWith($link)
          }
          else {
            const $i = document.createElement('i')
            $i.className = 'fa-solid fa-angle-right collection-nav-item text-secondary'
            $navItems[1].replaceWith($i)
          }
        }
      }, false)
    })
  }

  /**
   * Build a static preview of a footnote for its tooltip.
   *
   * Code block controls only work in the initialized footnote list, and cloned
   * nodes do not carry their listeners, so strip that chrome and keep a
   * read-only rendering. Full interactions remain available by clicking the
   * reference to jump to the footnote.
   * @param footnote - The footnote item element.
   * @returns Preview HTML and its plain-text fallback.
   */
  #createFootnotePreview(footnote: HTMLElement): { html: string, text: string } {
    const $preview = footnote.cloneNode(true) as HTMLElement
    $preview.querySelectorAll('.footnote-backref').forEach($backref => $backref.remove())

    // Code block chrome is inert in a cloned tooltip, so drop it.
    $preview.querySelectorAll('.code-header, .code-expand-btn, .copy-icon-btn').forEach($el => $el.remove())

    // Line-number tables do not fit the narrow tooltip; keep only the code cell.
    $preview.querySelectorAll('table.lntable').forEach(($table) => {
      const $pre = $table.querySelector('td:last-child pre')
      if ($pre)
        $table.replaceWith($pre)
      else
        $table.remove()
    })

    // A tooltip cannot switch tabs; keep the active code block only.
    $preview.querySelectorAll('.code-tabs').forEach(($tabs) => {
      const $code = $tabs.querySelector('.code-block.active') || $tabs.querySelector('.code-block')
      if ($code)
        $tabs.replaceWith($code)
      else
        $tabs.remove()
    })

    // Drop runtime state copied from the initialized footnote and IDs that
    // would duplicate anchors in the document.
    $preview.querySelectorAll('[data-init], [data-tab-init]').forEach(($el) => {
      $el.removeAttribute('data-init')
      $el.removeAttribute('data-tab-init')
    })
    $preview.querySelectorAll('[id]').forEach($el => $el.removeAttribute('id'))

    return {
      // The `single` class on the tooltip lets `.single .content` styles apply.
      html: `<div class="content">${$preview.innerHTML.trim()}</div>`,
      text: $preview.textContent!.trim(),
    }
  }

  /** Convert footnote refs into tooltip-enabled elements. */
  #initFootnotes() {
    const $footnoteRefs = document.querySelectorAll<HTMLElement>('#content sup[id^="fnref"]')
    const $footnotes = document.querySelector<HTMLElement>('.footnotes[role="doc-endnotes"]')
    if (!$footnoteRefs.length || !$footnotes)
      return
    const footnoteMap = new Map<HTMLElement, { html: string, text: string }>()
    $footnoteRefs.forEach(($ref) => {
      // Extra references to the same footnote use `fnref1:1`, `fnref2:1`, etc.
      const id = $ref.id.replace(/^fnref\d*:/, '')
      const $footnoteContent = $footnotes.querySelector<HTMLElement>(`[id="fn:${id}"]`)
      if (!$footnoteContent)
        return
      footnoteMap.set($ref, this.#createFootnotePreview($footnoteContent))
    })
    footnoteMap.forEach(({ html, text }, $ref) => {
      if (this.#core.config.tooltip && CellTooltip) {
        // Keep the footnote markup and reuse page content styles in the tooltip.
        CellTooltip.getOrCreateInstance($ref, {
          title: html,
          html: true,
          interactive: true,
          customClass: 'cell-tooltip-footnote single',
        })
        return
      }
      if (!$ref.hasAttribute('title'))
        $ref.setAttribute('title', text)
    })
  }

  /** Initialize CellTooltip on action buttons, copy buttons, and footnotes. */
  initTooltip() {
    if (!this.#core.config.tooltip || !CellTooltip)
      return
    const inlineEnd = this.#core.isRTL ? 'left' : 'right'
    CellTooltip.initAll('li[data-task] > span[title]', { placement: inlineEnd })
    CellTooltip.initAll('.action-btn[title]', { placement: 'bottom' })
    CellTooltip.initAll('.copy-icon-btn[title]', { placement: 'top' })
    CellTooltip.initAll('.fixit-encryptor-btn[title]')
    CellTooltip.initAll('.collection-sort-toggle[title]', { placement: 'bottom' })
    CellTooltip.initAll('.friend-links[data-scheme="mahjong"] > .friend-link[title]', { placement: 'bottom' })
    this.#initFootnotes()
  }

  /**
   * Re-initialize content components within a target element.
   * Useful after AJAX/pjax loads or dynamic content injection.
   * @param target - The root element to initialize components within.
   */
  initContent(target: Element | Document = document) {
    this.initDetails(target)
    this.initCollectionSort()
    this.#code.initCodeWrapper()
    this.#code.initCodeTabs()
    this.#code.initDiagramCopyBtn()
    this.initTooltip()
    this.initLinkGuardDialog(target)
  }

  setup() {
    this.initContent()
    this.initSVGIcon()
    eventBus.on('fixit:content-decrypted', ({ detail }) => {
      this.initContent(detail.target)
    })
  }
}
