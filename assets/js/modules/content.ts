/** Content module — orchestrates rendering of page content components (gallery, tooltips, diagrams, etc.). */
import type { TypedEventBus } from '../core/event-bus'
import type { ChartsService, CodeService, ContentService, CoreService, LinkGuardService, MiscService, TocService } from '../core/tokens'
import { forEach } from '../utils'

const CellTooltip = window.CellTooltip
const lgThumbnail = window.lgThumbnail
const lgZoom = window.lgZoom
const lightGallery = window.lightGallery

export class ContentModule implements ContentService {
  private lg: { destroy: (removeSubModules?: boolean) => void } | undefined

  constructor(
    private readonly core: CoreService,
    private readonly code: CodeService,
    private readonly charts: ChartsService,
    private readonly toc: TocService,
    private readonly misc: MiscService,
    private readonly linkGuard: LinkGuardService,
    private readonly bus: TypedEventBus,
  ) {}

  /**
   * Attach toggle behaviour to `<details>` elements.
   * @param target - The root element to search within.
   */
  initDetails(target: Element | Document = document) {
    forEach(target.querySelectorAll<HTMLElement>('.details:not(.disabled)'), ($details) => {
      const $summary = $details.querySelector<HTMLElement>('.details-summary')!
      $summary.addEventListener('click', () => {
        $details.classList.toggle('open')
      }, false)
    })
  }

  /** Initialize lightGallery for image zoom and thumbnails. */
  initLightGallery() {
    if (this.core.config.lightgallery) {
      this.lg?.destroy(true)
      this.lg = lightGallery(document.getElementById('content')!, {
        plugins: [lgThumbnail, lgZoom],
        selector: '.lightgallery',
        speed: 400,
        hideBarsDelay: 2000,
        allowMediaOverlap: true,
        exThumbImage: 'data-thumbnail',
        toggleThumb: true,
        thumbWidth: 80,
        thumbHeight: '60px',
        actualSize: false,
        showZoomInOutIcons: true,
        licenseKey: 'none',
      })
    }
  }

  /** Initialize json-viewer elements and bind theme switch. */
  initJsonViewer() {
    if (!window.JsonViewerElement)
      return
    const applyJsonViewerTheme = (isDark: boolean) => {
      forEach(document.getElementsByTagName('json-viewer'), ($el: Element) => {
        $el.setAttribute('theme', isDark ? 'dark' : 'light')
      })
    }
    this.bus.on('fixit:switch-theme', ({ detail }) => {
      if (!detail.isChanged)
        return
      applyJsonViewerTheme(detail.isDark)
    })
    applyJsonViewerTheme(this.core.isDark)
  }

  /** Convert footnote refs into tooltip-enabled elements. */
  initFootnotes() {
    const $footnoteRefs = document.querySelectorAll<HTMLElement>('#content sup[id^="fnref:"]')
    const $footnotes = document.querySelector<HTMLElement>('.footnotes[role="doc-endnotes"]')
    if (!$footnoteRefs.length || !$footnotes)
      return
    const footnoteMap = new Map<HTMLElement, HTMLElement>()
    $footnoteRefs.forEach(($ref) => {
      if (this.core.config.tooltip) {
        const $link = $ref.querySelector<HTMLAnchorElement>('a.footnote-ref')
        if ($link) {
          $link.addEventListener('click', (e) => {
            e.preventDefault()
          }, false)
        }
      }
      const id = $ref.id.replace('fnref:', '')
      const $footnoteContent = $footnotes.querySelector<HTMLElement>(`[id="fn:${id}"]`)
      if ($footnoteContent) {
        const $clonedContent = $footnoteContent.cloneNode(true) as HTMLElement
        const $backref = $clonedContent.querySelector('.footnote-backref')
        if ($backref)
          $backref.remove()
        footnoteMap.set($ref, $clonedContent)
      }
    })
    footnoteMap.forEach(($content, $ref) => {
      if ($ref.hasAttribute('title'))
        return
      $ref.setAttribute('title', $content.textContent!.trim())
      if (this.core.config.tooltip) {
        CellTooltip.getOrCreateInstance($ref)
      }
    })
  }

  /** Initialize CellTooltip on action buttons, copy buttons, and footnotes. */
  initTooltip() {
    if (!this.core.config.tooltip)
      return
    CellTooltip.initAll('li[data-task] > span[title]', { placement: 'right' })
    CellTooltip.initAll('.action-btn[title]', { placement: 'bottom' })
    CellTooltip.initAll('.copy-icon-btn[title]', { placement: 'top' })
    this.initFootnotes()
  }

  /**
   * Orchestrate all content component initializations on a target element.
   * @param target - The root element to initialize components within.
   * @param includeToc - Whether to also initialize TOC-related components.
   */
  #initContentComponents(target: Element | Document = document, includeToc = true) {
    this.initTwemoji(target)
    this.initDetails(target)
    this.initLightGallery()
    this.code.initCodeWrapper()
    this.code.initCodeTabs()
    this.code.initDiagramCopyBtn()
    this.charts.initEcharts()
    this.charts.initTypeit(target)
    this.charts.initMapbox()
    this.initTooltip()
    this.misc.initPangu()
    this.misc.initMathJax()
    this.initJsonViewer()
    this.linkGuard.initLinkGuardDialog(target)

    if (includeToc) {
      this.toc.fixTocScroll()
      this.toc.initToc()
      this.toc.initTocListener()
      this.toc.initTocDialog()
    }
  }

  initContent() {
    if (!this.core.config.encryption?.all) {
      this.#initContentComponents()
    }
    this.bus.on('fixit:decrypted', () => {
      this.#initContentComponents()
    })
    this.bus.on('fixit:partial-decrypted', ({ detail }) => {
      this.#initContentComponents(detail.target, false)
    })
  }

  /**
   * Parse emoji shortcodes into Twemoji images.
   * @param target - The root element to parse for emoji.
   */
  initTwemoji(target: Element | Document = document) {
    this.core.config.twemoji && window.twemoji?.parse(target as Element)
  }
}
