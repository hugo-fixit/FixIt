/** Content module — orchestrates rendering of page content components (gallery, tooltips, diagrams, etc.). */
import type { FixItContext } from '../types'
import { forEach } from '../utils'

const CellTooltip = window.CellTooltip
const lgThumbnail = window.lgThumbnail
const lgZoom = window.lgZoom
const lightGallery = window.lightGallery

/**
 * Create content rendering orchestrators for galleries, tooltips, diagrams, etc.
 * @param ctx - The shared FixIt context object.
 * @returns Content component initialization methods.
 */
export function createContent(ctx: FixItContext) {
  let lg: { destroy: (removeSubModules?: boolean) => void } | undefined
  let _jsonViewerOnSwitchTheme: (() => void) | undefined

  /**
   * Attach toggle behaviour to `<details>` elements.
   * @param target - The root element to search within.
   */
  function initDetails(target: Element | Document = document) {
    forEach(target.querySelectorAll<HTMLElement>('.details:not(.disabled)'), ($details) => {
      const $summary = $details.querySelector<HTMLElement>('.details-summary')!
      $summary.addEventListener('click', () => {
        $details.classList.toggle('open')
      }, false)
    })
  }

  /** Initialize lightGallery for image zoom and thumbnails. */
  function initLightGallery() {
    if (ctx.config.lightgallery) {
      lg?.destroy(true)
      lg = lightGallery(document.getElementById('content')!, {
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
  function initJsonViewer() {
    if (!window.JsonViewerElement)
      return
    _jsonViewerOnSwitchTheme = _jsonViewerOnSwitchTheme || (() => {
      forEach(document.getElementsByTagName('json-viewer'), ($el: Element) => {
        $el.setAttribute('theme', ctx.isDark ? 'dark' : 'light')
      })
    })
    document.addEventListener('fixit:switch-theme', _jsonViewerOnSwitchTheme)
    _jsonViewerOnSwitchTheme()
  }

  /** Convert footnote refs into tooltip-enabled elements. */
  function initFootnotes() {
    const $footnoteRefs = document.querySelectorAll<HTMLElement>('#content sup[id^="fnref:"]')
    const $footnotes = document.querySelector<HTMLElement>('.footnotes[role="doc-endnotes"]')
    if (!$footnoteRefs.length || !$footnotes)
      return
    const footnoteMap = new Map<HTMLElement, HTMLElement>()
    $footnoteRefs.forEach(($ref) => {
      if (ctx.config.tooltip) {
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
      if (ctx.config.tooltip) {
        CellTooltip.getOrCreateInstance($ref)
      }
    })
  }

  /** Initialize CellTooltip on action buttons, copy buttons, and footnotes. */
  function initTooltip() {
    if (!ctx.config.tooltip)
      return
    CellTooltip.initAll('li[data-task] > span[title]', { placement: 'right' })
    CellTooltip.initAll('.action-btn[title]', { placement: 'bottom' })
    CellTooltip.initAll('.copy-icon-btn[title]', { placement: 'top' })
    initFootnotes()
  }

  /**
   * Orchestrate all content component initializations on a target element.
   * @param target - The root element to initialize components within.
   * @param includeToc - Whether to also initialize TOC-related components.
   */
  function _initContentComponents(target: Element | Document = document, includeToc = true) {
    initTwemoji(target)
    initDetails(target)
    initLightGallery()
    ctx.initCodeWrapper()
    ctx.initCodeTabs()
    ctx.initDiagramCopyBtn()
    ctx.initEcharts()
    ctx.initTypeit(target)
    ctx.initMapbox()
    initTooltip()
    ctx.initPangu()
    ctx.initMathJax()
    initJsonViewer()
    ctx.initLinkGuardDialog(target)

    if (includeToc) {
      window.setTimeout(() => {
        ctx.fixTocScroll()
        ctx.initToc()
        ctx.initTocListener()
        ctx.initTocDialog()
      }, 100)
    }
  }

  function initContent() {
    if (!ctx.config.encryption?.all) {
      _initContentComponents()
    }
    document.addEventListener('fixit:decrypted', () => {
      _initContentComponents()
    })
    document.addEventListener('fixit:partial-decrypted', (e: Event) => {
      const $content = (e as CustomEvent).detail.target as Element
      _initContentComponents($content, false)
    })
  }

  /**
   * Parse emoji shortcodes into Twemoji images.
   * @param target - The root element to parse for emoji.
   */
  function initTwemoji(target: Element | Document = document) {
    ctx.config.twemoji && window.twemoji?.parse(target as Element)
  }

  return {
    initDetails,
    initLightGallery,
    initJsonViewer,
    initFootnotes,
    initTooltip,
    initTwemoji,
    initContent,
  }
}
