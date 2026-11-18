import type { CodeService, ContentService, CoreService } from '../../core/tokens'
import { eventBus } from '../../core/event-bus'
import { initCollectionSort } from './collection-sort'
import { initFootnotes } from './footnote'
import { LinkGuard } from './link-guard'

const CellTooltip = window.CellTooltip

/**
 * Content module — orchestrates content enhancements.
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
  #linkGuard: LinkGuard | undefined
  #linkGuardDialog: HTMLDialogElement | null = null

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
    const dialog = document.getElementById('link-guard-dialog') as HTMLDialogElement | null
    if (!dialog)
      return
    if (!this.#linkGuard || this.#linkGuardDialog !== dialog) {
      this.#linkGuard = new LinkGuard(dialog)
      this.#linkGuardDialog = dialog
    }
    this.#linkGuard.init(target)
  }

  /**
   * Attach toggle behaviour to `.details` elements.
   * @param target - The root element to search within.
   */
  initDetails(target: Element | Document = document) {
    target.querySelectorAll<HTMLElement>('.details:not(.disabled)').forEach(($details) => {
      if ($details.dataset.init)
        return
      $details.dataset.init = 'true'
      const $summary = $details.querySelector<HTMLElement>('.details-summary')!
      $summary?.addEventListener('click', () => {
        $details.classList.toggle('open')
      }, false)
    })
  }

  /** Initialize collection sort toggle buttons. */
  initCollectionSort() {
    initCollectionSort()
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
  }

  /** Initialize the footnote section toggle and tooltips. */
  initFootnotes() {
    initFootnotes(this.#core.config.tooltip)
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
    this.initFootnotes()
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
