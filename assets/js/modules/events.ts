/** Events module — scroll, resize, mask click, and print event handling. */
import type { TypedEventBus } from '../core/event-bus'
import type { CodeService, CoreService, EventsService, SearchService, TocService } from '../core/tokens'
import { animateCSS, getScrollTop, isMobile, scrollIntoView } from '../utils'

export class EventsModule implements EventsService {
  #resizeTimeout: number | null = null

  constructor(
    private readonly core: CoreService,
    private readonly toc: TocService,
    private readonly search: SearchService,
    private readonly code: CodeService,
    private readonly bus: TypedEventBus,
  ) {}

  /** Bind scroll listener: auto-hide headers, reading progress, back-to-top, and TOC sync. */
  onScroll() {
    const ACCURACY = 20
    const $autoHeaders: HTMLElement[] = []
    const $backToTop = document.querySelector<HTMLElement>('.back-to-top')
    const $readingProgressBar = document.querySelector<HTMLElement>('.reading-progress-bar')
    if (document.body.dataset.headerDesktop === 'auto') {
      $autoHeaders.push(document.getElementById('header-desktop')!)
    }
    if (document.body.dataset.headerMobile === 'auto') {
      $autoHeaders.push(document.getElementById('header-mobile')!)
    }
    $backToTop?.addEventListener('click', () => {
      scrollIntoView('body')
    })
    window.addEventListener('scroll', (event) => {
      if (this.core.disableScrollEvent) {
        event.preventDefault()
        return
      }
      this.core.newScrollTop = getScrollTop()
      const scroll = this.core.newScrollTop - this.core.oldScrollTop
      if (Math.abs(scroll) > ACCURACY) {
        this.core.closeActiveMaskOverlay()
        const isScrollingDown = scroll > 0
        $autoHeaders.forEach(($header) => {
          if (isScrollingDown) {
            $header.classList.remove('header__fadeInDown')
            animateCSS($header, ['header__fadeOutUp'], true)
          }
          else {
            $header.classList.remove('header__fadeOutUp')
            animateCSS($header, ['header__fadeInDown'], true)
          }
        })
      }
      else if (this.core.newScrollTop <= 0) {
        $autoHeaders.forEach(($header) => {
          $header.classList.remove('header__fadeOutUp')
          animateCSS($header, ['header__fadeInDown'], true)
        })
      }
      const contentHeight = document.body.scrollHeight - window.innerHeight
      const scrollPercent = Math.max(Math.min(100 * Math.max(this.core.newScrollTop, 0) / contentHeight, 100), 0)
      if ($readingProgressBar) {
        $readingProgressBar.style.setProperty('--fi-progress', `${scrollPercent.toFixed(2)}%`)
      }
      if ($backToTop) {
        if (scrollPercent > 1) {
          $backToTop.classList.remove('d-none', 'animate__fadeOut')
          animateCSS($backToTop, ['animate__fadeIn'], true)
        }
        else {
          $backToTop.classList.remove('animate__fadeIn')
          animateCSS($backToTop, ['animate__fadeOut'], true, () => {
            $backToTop.classList.contains('animate__fadeOut') && $backToTop.classList.add('d-none')
          })
        }
        $backToTop.style.setProperty('--fi-b2t-progress', scrollPercent.toFixed(2))
        if (navigator.userAgent.toLowerCase().includes('firefox')) {
          const dashoffset = 2 * Math.PI * 50 * (1 - scrollPercent / 100)
          $backToTop.querySelector<SVGCircleElement>('circle.progress')!.style.strokeDashoffset = String(dashoffset.toFixed(2))
        }
      }
      this.bus.emit('fixit:scroll')
      this.toc.syncTocHeight()
      this.toc.syncTocActiveState()
      this.core.oldScrollTop = this.core.newScrollTop
    }, false)
  }

  /** Bind resize listener with debounce: re-init TOC, search, and sync state. */
  onResize() {
    let resizeBefore = isMobile()
    window.addEventListener('resize', () => {
      if (!this.#resizeTimeout) {
        this.#resizeTimeout = window.setTimeout(() => {
          this.#resizeTimeout = null
          this.bus.emit('fixit:resize')
          this.toc.initToc()
          this.search.initSearch()
          this.toc.syncTocHeight()
          this.toc.syncTocActiveState()

          const _isMobile = isMobile()
          if (_isMobile !== resizeBefore) {
            this.core.closeActiveMaskOverlay()
            resizeBefore = _isMobile
          }
        }, 100)
      }
    }, false)
  }

  /** Bind mask click to close the active overlay. */
  onClickMask() {
    document.getElementById('mask')!.addEventListener('click', (e) => {
      if (!(e.target as HTMLElement).classList.contains('blur'))
        return
      this.core.closeActiveMaskOverlay()
    }, false)
  }

  /** Bind beforeprint/afterprint to expand admonitions, code blocks, details, and file trees. */
  initPrint() {
    window.addEventListener('beforeprint', () => {
      const $content = document.getElementById('content')!
      const printConfig = this.core.config.print || {}

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
      this.bus.emit('fixit:before-print')
    }, false)

    window.addEventListener('afterprint', () => {
      this.code.initCodeTabs()
      this.bus.emit('fixit:after-print')
    }, false)
  }
}
