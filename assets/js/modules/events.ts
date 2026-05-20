/** Events module — scroll, resize, mask click, and print event handling. */
import type { FixItContext } from '../types'
import { animateCSS, forEach, getScrollTop, isMobile, scrollIntoView } from '../utils'

/**
 * Create DOM event handlers for scroll, resize, mask click, and print.
 * @param ctx - The shared FixIt context object.
 * @returns Event binding methods.
 */
export function createEvents(ctx: FixItContext) {
  let _resizeTimeout: number | null = null

  /** Bind scroll listener: auto-hide headers, reading progress, back-to-top, and TOC sync. */
  function onScroll() {
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
      if (ctx.disableScrollEvent) {
        event.preventDefault()
        return
      }
      ctx.newScrollTop = getScrollTop()
      const scroll = ctx.newScrollTop - ctx.oldScrollTop
      if (Math.abs(scroll) > ACCURACY) {
        ctx.closeActiveMaskOverlay()
        const isScrollingDown = scroll > 0
        forEach($autoHeaders, ($header) => {
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
      else if (ctx.newScrollTop <= 0) {
        forEach($autoHeaders, ($header) => {
          $header.classList.remove('header__fadeOutUp')
          animateCSS($header, ['header__fadeInDown'], true)
        })
      }
      const contentHeight = document.body.scrollHeight - window.innerHeight
      const scrollPercent = Math.max(Math.min(100 * Math.max(ctx.newScrollTop, 0) / contentHeight, 100), 0)
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
      document.dispatchEvent(new CustomEvent('fixit:scroll'))
      ctx.syncTocHeight()
      ctx.syncTocActiveState()
      ctx.oldScrollTop = ctx.newScrollTop
    }, false)
  }

  /** Bind resize listener with debounce: re-init TOC, search, and sync state. */
  function onResize() {
    let resizeBefore = isMobile()
    window.addEventListener('resize', () => {
      if (!_resizeTimeout) {
        _resizeTimeout = window.setTimeout(() => {
          _resizeTimeout = null
          document.dispatchEvent(new CustomEvent('fixit:resize'))
          ctx.initToc()
          ctx.initSearch()
          ctx.syncTocHeight()
          ctx.syncTocActiveState()

          const _isMobile = isMobile()
          if (_isMobile !== resizeBefore) {
            ctx.closeActiveMaskOverlay()
            resizeBefore = _isMobile
          }
        }, 100)
      }
    }, false)
  }

  /** Bind mask click to close the active overlay. */
  function onClickMask() {
    document.getElementById('mask')!.addEventListener('click', (e) => {
      if (!(e.target as HTMLElement).classList.contains('blur'))
        return
      ctx.closeActiveMaskOverlay()
    }, false)
  }

  /** Bind beforeprint/afterprint to expand admonitions, code blocks, details, and file trees. */
  function initPrint() {
    window.addEventListener('beforeprint', () => {
      const $content = document.getElementById('content')!
      const printConfig = ctx.config.print || {}

      if (printConfig.expandAdmonition) {
        forEach($content.querySelectorAll('.admonition'), ($el: Element) => $el.classList.add('open'))
      }
      if (printConfig.expandCode) {
        forEach($content.querySelectorAll<HTMLElement>('.code-tabs'), ($codeTabs) => {
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
        forEach($content.querySelectorAll<HTMLElement>('.code-block'), ($el) => {
          $el.classList.add('line-wrapping')
          $el.classList.remove('is-collapsed')
          if ($el.querySelector('.code-expand-btn')) {
            $el.classList.add('is-expanded')
          }
        })
      }
      if (printConfig.expandDetails) {
        forEach($content.querySelectorAll('details'), ($el: Element) => $el.setAttribute('open', ''))
      }
      document.dispatchEvent(new CustomEvent('fixit:before-print'))
    }, false)

    window.addEventListener('afterprint', () => {
      ctx.initCodeTabs()
      document.dispatchEvent(new CustomEvent('fixit:after-print'))
    }, false)
  }

  return { onScroll, onResize, onClickMask, initPrint }
}
