import type { CodeService, ContentService, CoreService } from '../../core/tokens'
import { eventBus } from '../../core/event-bus'
import { initCollectionSort } from './collection-sort'
import { initDetails } from './details'
import { initFootnotes } from './footnote'
import { LinkGuard } from './link-guard'
import { initSVGIcon } from './svg-icon'
import { initContentTooltips } from './tooltip'

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
    initSVGIcon()
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
    initDetails(target)
  }

  /** Initialize collection sort toggle buttons. */
  initCollectionSort() {
    initCollectionSort()
  }

  /** Initialize CellTooltip on action buttons, copy buttons, and footnotes. */
  initTooltip() {
    if (!this.#core.config.tooltip)
      return
    initContentTooltips(this.#core.isRTL)
    initFootnotes()
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
