import type { CodeService, CoreService, EventsService } from '../core/tokens'
import { eventBus } from '../core/event-bus'
import { animateCSS, getScrollTop, isMobile, scrollIntoView } from '../utils'

/**
 * Events module — scroll, resize, mask click, and print event handling.
 *
 * Responsibilities:
 * - Throttled scroll handler for back-to-top button, header show/hide, and TOC active state sync.
 * - Resize handler for TOC height and table wrapping recalculation.
 * - Mask click handler to close search and menu drawers.
 * - Print preparation handler.
 */
export class EventsModule implements EventsService {
  #resizeTimeout: number | null = null
  #newScrollTop = 0
  #oldScrollTop = 0
  #scrollFrame: number | null = null
  #scrollAccum = 0
  #progress = -1
  #backToTopVisible = false
  #isFirefox = navigator.userAgent.toLowerCase().includes('firefox')
  #core: CoreService
  #code: CodeService

  constructor(core: CoreService, code: CodeService) {
    this.#core = core
    this.#code = code
  }

  /** Toggle the auto-hiding headers without restarting an active animation. */
  #setHeadersHidden($headers: HTMLElement[], hidden: boolean) {
    $headers.forEach(($header) => {
      if (hidden) {
        if ($header.classList.contains('header__fadeOutUp'))
          return
        $header.classList.remove('header__fadeInDown')
        animateCSS($header, ['header__fadeOutUp'], true)
      }
      else {
        if (!$header.classList.contains('header__fadeOutUp'))
          return
        $header.classList.remove('header__fadeOutUp')
        animateCSS($header, ['header__fadeInDown'], true)
      }
    })
  }

  /** Update reading progress and back-to-top visibility from the current scroll position. */
  #updateScrollWidgets($backToTop: HTMLElement | null, $readingProgressBar: HTMLElement | null, $progressCircle: SVGCircleElement | null) {
    const contentHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = contentHeight > 0
      ? Math.max(0, Math.min(100 * Math.max(this.#newScrollTop, 0) / contentHeight, 100))
      : 0
    const progress = Math.round(scrollPercent * 100) / 100

    if (progress !== this.#progress) {
      this.#progress = progress
      $readingProgressBar?.style.setProperty('--fi-progress', `${progress}%`)
      if ($backToTop) {
        $backToTop.style.setProperty('--fi-b2t-progress', progress.toFixed(2))
        if ($progressCircle)
          $progressCircle.style.strokeDashoffset = (2 * Math.PI * 50 * (1 - progress / 100)).toFixed(2)
      }
    }

    if (!$backToTop)
      return

    const shouldShow = progress > 1
    if (shouldShow && !this.#backToTopVisible) {
      this.#backToTopVisible = true
      $backToTop.classList.remove('hidden', 'animate__fadeOut')
      animateCSS($backToTop, ['animate__fadeIn'], true)
    }
    else if (!shouldShow && this.#backToTopVisible) {
      this.#backToTopVisible = false
      $backToTop.classList.remove('animate__fadeIn')
      animateCSS($backToTop, ['animate__fadeOut'], true, () => {
        if (!this.#backToTopVisible)
          $backToTop.classList.add('hidden')
      })
    }
  }

  /** Apply one coalesced scroll frame: headers, reading progress, and back-to-top. */
  #handleScroll($autoHeaders: HTMLElement[], $backToTop: HTMLElement | null, $readingProgressBar: HTMLElement | null, $progressCircle: SVGCircleElement | null, accuracy: number) {
    this.#newScrollTop = getScrollTop()
    const scroll = this.#newScrollTop - this.#oldScrollTop
    if (Math.abs(scroll) > accuracy)
      this.#core.closeActiveMaskOverlay()

    // Upward scrolling reveals the header on any movement; downward scrolling
    // hides it only after accumulated movement, so slow upward scrolls recover.
    if (this.#newScrollTop <= 0) {
      this.#scrollAccum = 0
      this.#setHeadersHidden($autoHeaders, false)
    }
    else if (scroll > 0) {
      this.#scrollAccum += scroll
      if (this.#scrollAccum > accuracy) {
        this.#scrollAccum = 0
        this.#setHeadersHidden($autoHeaders, true)
      }
    }
    else if (scroll < 0) {
      this.#scrollAccum = 0
      this.#setHeadersHidden($autoHeaders, false)
    }

    this.#updateScrollWidgets($backToTop, $readingProgressBar, $progressCircle)
    eventBus.emit('fixit:scroll')
    this.#oldScrollTop = this.#newScrollTop
  }

  /** Bind scroll listener: auto-hide headers, reading progress, back-to-top, and TOC sync. */
  onScroll() {
    const ACCURACY = 50
    const $autoHeaders: HTMLElement[] = []
    const $backToTop = document.querySelector<HTMLElement>('.back-to-top')
    const $readingProgressBar = document.querySelector<HTMLElement>('.reading-progress-bar')
    const $progressCircle = this.#isFirefox
      ? $backToTop?.querySelector<SVGCircleElement>('circle.progress') ?? null
      : null
    if (document.body.dataset.headerDesktop === 'auto') {
      const $header = document.getElementById('header-desktop')
      if ($header)
        $autoHeaders.push($header)
    }
    if (document.body.dataset.headerMobile === 'auto') {
      const $header = document.getElementById('header-mobile')
      if ($header)
        $autoHeaders.push($header)
    }
    $backToTop?.addEventListener('click', () => {
      scrollIntoView('body')
    })
    window.addEventListener('scroll', () => {
      if (this.#scrollFrame !== null)
        return
      this.#scrollFrame = window.requestAnimationFrame(() => {
        this.#scrollFrame = null
        this.#handleScroll($autoHeaders, $backToTop, $readingProgressBar, $progressCircle, ACCURACY)
      })
    }, { passive: true })
  }

  /** Bind resize listener with debounce: re-init TOC, search, and sync state. */
  onResize() {
    let resizeBefore = isMobile()
    window.addEventListener('resize', () => {
      if (!this.#resizeTimeout) {
        this.#resizeTimeout = window.setTimeout(() => {
          this.#resizeTimeout = null
          eventBus.emit('fixit:resize')

          const _isMobile = isMobile()
          if (_isMobile !== resizeBefore) {
            this.#core.closeActiveMaskOverlay()
            resizeBefore = _isMobile
          }
        }, 100)
      }
    }, false)
  }

  /** Bind mask click to close the active overlay. */
  onClickMask() {
    document.getElementById('mask')?.addEventListener('click', (e) => {
      if (!(e.target as HTMLElement).classList.contains('is-blur'))
        return
      this.#core.closeActiveMaskOverlay()
    }, false)
  }

  /** Bind beforeprint/afterprint to expand admonitions, code blocks, details, and file trees. */
  initPrint() {
    window.addEventListener('beforeprint', () => {
      const $content = document.getElementById('content')
      if (!$content)
        return
      const printConfig = this.#core.config.print || {}

      if (printConfig.expandAdmonition) {
        $content.querySelectorAll('.admonition').forEach(($el: Element) => $el.classList.add('open'))
      }
      if (printConfig.expandCode) {
        $content.querySelectorAll<HTMLElement>('.code-tabs').forEach(($codeTabs) => {
          if ($codeTabs.dataset.diagram)
            return
          const $actions = $codeTabs.querySelector<HTMLElement>('.tabs-actions')
          const $activeBlock = $codeTabs.querySelector<HTMLElement>('.code-block.active')
          if ($actions && $activeBlock) {
            const $codeHeader = $activeBlock.querySelector<HTMLElement>('.code-header')
            if ($codeHeader) {
              Array.from($actions.children).forEach(btn => $codeHeader.appendChild(btn))
            }
          }
          const $codeBlocks = $codeTabs.querySelectorAll<HTMLElement>('.code-block')
          $codeBlocks.forEach(($codeBlock) => {
            delete $codeBlock.dataset.tabInit
            $codeTabs.parentElement!.insertBefore($codeBlock, $codeTabs)
          })
          $codeTabs.parentElement!.removeChild($codeTabs)
        })
        $content.querySelectorAll<HTMLElement>('.code-block').forEach(($el) => {
          $el.classList.add('line-wrapping')
          $el.classList.remove('is-collapsed')
          if ($el.querySelector('.code-expand-btn')) {
            $el.classList.add('is-expanded')
          }
        })
      }
      if (printConfig.expandDetails) {
        $content.querySelectorAll('details').forEach(($el: Element) => $el.setAttribute('open', ''))
      }
    }, false)

    window.addEventListener('afterprint', () => {
      this.#code.initCodeTabs()
    }, false)
  }

  /** Initialize all event listeners. */
  setup() {
    this.onScroll()
    this.onResize()
    this.onClickMask()
    this.initPrint()
  }
}
