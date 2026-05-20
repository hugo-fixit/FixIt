/** Table of Contents module — TOC scroll tracking, active state sync, and dialog. */
import type { FixItContext } from '../types'
import { animateCSS, forEach, isTocStatic } from '../utils'

/**
 * Create TOC management handlers.
 * @param ctx - The shared FixIt context object.
 * @returns TOC management methods.
 */
export function createToc(ctx: FixItContext): any {
  let methods: ReturnType<typeof createToc>

  /** Get the pixel height of the currently visible sticky header. */
  function getVisibleHeaderOffset(): number {
    const $desktopHeader = document.getElementById('header-desktop')
    const $mobileHeader = document.getElementById('header-mobile')
    const $header = [$desktopHeader, $mobileHeader].find($el => $el && window.getComputedStyle($el).display !== 'none')
    if (!$header)
      return 0
    const isDesktop = $header.id === 'header-desktop'
    const headerMode = isDesktop ? document.body.dataset.headerDesktop : document.body.dataset.headerMobile
    if (!['sticky', 'auto'].includes(headerMode!))
      return 0
    if (headerMode === 'auto' && $header.classList.contains('header__fadeOutUp'))
      return 0
    return $header.offsetHeight
  }

  /** Get the pixel height of the breadcrumb container. */
  function getBreadcrumbHeight(): number {
    return document.querySelector<HTMLElement>('.breadcrumb-container')?.offsetHeight || 0
  }

  /** Get the combined vertical offset used to determine the active TOC heading. */
  function getTocIndexOffset(): number {
    return 20 + getVisibleHeaderOffset() + getBreadcrumbHeight()
  }

  /** Get all heading elements that have an `id` attribute. */
  function getTocHeadingElements(): HTMLElement[] {
    return Array.from(document.querySelectorAll<HTMLElement>('.heading-element[id]'))
  }

  /**
   * Determine which heading is currently active based on scroll position.
   * @param $headingElements - Array of heading elements with `id` attributes.
   * @param indexOffset - Vertical offset from the top for the active threshold.
   * @returns The active heading element, or `null` if none found.
   */
  function getActiveTocHeading($headingElements: HTMLElement[], indexOffset = getTocIndexOffset()): HTMLElement | null {
    if (!$headingElements.length)
      return null
    const threshold = window.scrollY + indexOffset + 1
    let $activeHeading = $headingElements[0]
    for (const $heading of $headingElements) {
      const headingTop = window.scrollY + $heading.getBoundingClientRect().top
      if (headingTop <= threshold) {
        $activeHeading = $heading
      }
      else {
        break
      }
    }
    return $activeHeading
  }

  /** Get all TOC root containers (static, auto, and drawer). */
  function getTocRoots(): HTMLElement[] {
    return [
      document.getElementById('TableOfContents'),
      document.querySelector<HTMLElement>('#toc-content-static > nav'),
      document.querySelector<HTMLElement>('#toc-content-drawer > nav'),
    ].filter(Boolean) as HTMLElement[]
  }

  /**
   * Find the TOC link that points to the given heading id.
   * @param $tocRoot - The TOC root container element.
   * @param id - The heading id (without `#`).
   * @returns The matching anchor element, or `null`.
   */
  function getTocLinkById($tocRoot: HTMLElement, id: string): HTMLAnchorElement | null {
    if (!$tocRoot || !id)
      return null
    const targetHash = `#${id}`
    return Array.from($tocRoot.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')).find($link => $link.getAttribute('href') === targetHash) || null
  }

  /**
   * Highlight the active TOC item and its parent chain.
   * @param $tocRoot - The TOC root container element.
   * @param activeId - The id of the currently active heading.
   */
  function applyTocActiveState($tocRoot: HTMLElement, activeId: string) {
    if (!$tocRoot)
      return
    forEach($tocRoot.querySelectorAll('a[href^="#"]'), ($tocLink: Element) => {
      $tocLink.classList.remove('active')
    })
    forEach($tocRoot.querySelectorAll('li'), ($tocLi: Element) => {
      $tocLi.classList.remove('has-active')
    })
    const $activeLink = getTocLinkById($tocRoot, activeId)
    if (!$activeLink)
      return
    $activeLink.classList.add('active')
    let $parent = $activeLink.closest('li')
    while ($parent) {
      $parent.classList.add('has-active')
      $parent = $parent.parentElement?.closest('li') || null
    }
  }

  /**
   * Scroll the active TOC link into the visible area of its container.
   * @param $tocRoot - The TOC root container element.
   * @param activeId - The id of the currently active heading.
   * @param $scrollContainer - The scrollable container (defaults to `$tocRoot`).
   */
  function scrollActiveTocLinkIntoView($tocRoot: HTMLElement, activeId: string, $scrollContainer: HTMLElement = $tocRoot) {
    const $activeLink = getTocLinkById($tocRoot, activeId)
    if (!$activeLink || !$scrollContainer)
      return
    const containerRect = $scrollContainer.getBoundingClientRect()
    const linkRect = $activeLink.getBoundingClientRect()
    const offsetTop = linkRect.top - containerRect.top
    const offsetBottom = linkRect.bottom - containerRect.bottom
    if (offsetTop < 0) {
      $scrollContainer.scrollTop += offsetTop
    }
    else if (offsetBottom > 0) {
      $scrollContainer.scrollTop += offsetBottom
    }
  }

  /** Update the TOC container's max-height CSS variable to fit the viewport. */
  function syncTocHeight() {
    const $toc = document.getElementById('toc-auto')
    const $tocContentAuto = document.getElementById('toc-content-auto')
    if ($toc && $tocContentAuto) {
      const maxHeight = Math.max(window.innerHeight - $tocContentAuto.getBoundingClientRect().top - 16)
      $tocContentAuto.style.setProperty('--fi-toc-content-max-height', `${Math.floor(maxHeight)}px`)
    }
  }

  /** Sync the active heading highlight across all TOC containers. */
  function syncTocActiveState() {
    const $headingElements = getTocHeadingElements()
    const $activeHeading = getActiveTocHeading($headingElements)
    if (!$activeHeading?.id)
      return
    const activeId = $activeHeading.id
    const $tocRoots = getTocRoots()
    forEach($tocRoots, ($tocRoot) => {
      applyTocActiveState($tocRoot, activeId)
    })
    if (ctx.activeTocId !== activeId) {
      ctx.activeTocId = activeId
      if (!isTocStatic()) {
        const $autoTocRoot = document.getElementById('TableOfContents')
        const $autoTocContainer = document.getElementById('toc-content-auto')
        if ($autoTocRoot && $autoTocContainer) {
          scrollActiveTocLinkIntoView($autoTocRoot, activeId, $autoTocContainer)
        }
      }
      if ((document.getElementById('toc-dialog') as HTMLDialogElement)?.open) {
        const $dialogTocRoot = document.querySelector<HTMLElement>('#toc-content-drawer > nav')!
        scrollActiveTocLinkIntoView($dialogTocRoot, activeId, $dialogTocRoot)
      }
    }
  }

  /** Initialize TOC layout: move the TOC node to the correct container and sync state. */
  function initToc() {
    const $tocCore = document.getElementById('TableOfContents')
    if ($tocCore === null)
      return
    // TOC Drawer Button Visibility
    const openButton = document.querySelector<HTMLElement>('#toc-drawer-button')
    if (openButton) {
      openButton.classList.toggle('d-none', !isTocStatic())
    }
    ctx.activeTocId = null
    // TOC Static and TOC Dialog
    if (isTocStatic()) {
      const $tocContentStatic = document.getElementById('toc-content-static')!
      if ($tocCore.parentElement !== $tocContentStatic) {
        $tocCore.parentElement!.removeChild($tocCore)
        $tocContentStatic.appendChild($tocCore)
      }
      methods.syncTocHeight()
      methods.syncTocActiveState()
      return
    }

    // TOC Auto
    const $tocContentAuto = document.getElementById('toc-content-auto')!
    if ($tocCore.parentElement !== $tocContentAuto) {
      $tocCore.parentElement!.removeChild($tocCore)
      $tocContentAuto.appendChild($tocCore)
    }
    const $toc = document.getElementById('toc-auto')!
    $toc.style.visibility = 'visible'
    animateCSS($toc, ['animate__fadeIn', 'animate__faster'], true)
    methods.syncTocHeight()
    methods.syncTocActiveState()
  }

  /** Bind the TOC title click handler for show/hide toggle. */
  function initTocListener() {
    const $toc = document.getElementById('toc-auto')!
    const $tocContentAuto = document.getElementById('toc-content-auto')!
    document.querySelector<HTMLElement>('#toc-auto>.toc-title')?.addEventListener('click', () => {
      const animation = ['animate__faster']
      const tocHidden = $toc.classList.contains('toc-hidden')
      animation.push(tocHidden ? 'animate__fadeIn' : 'animate__fadeOut')
      if (tocHidden) {
        $tocContentAuto.classList.remove('d-none', 'animate__fadeOut')
      }
      else {
        $tocContentAuto.classList.remove('animate__fadeIn')
      }
      animateCSS($tocContentAuto, animation, true, () => {
        $tocContentAuto.classList.contains('animate__fadeOut') && $tocContentAuto.classList.add('d-none')
      })
      $toc.classList.toggle('toc-hidden')
    }, false)
  }

  /** Initialize the mobile TOC drawer dialog and its open/close handlers. */
  function initTocDialog() {
    const dialog = document.querySelector<HTMLDialogElement>('#toc-dialog')
    const openButton = document.querySelector<HTMLElement>('#toc-drawer-button')
    if (!dialog || !openButton)
      return
    const closeButton = dialog.querySelector<HTMLElement>('.toc-close-btn')
    closeButton?.addEventListener('click', () => dialog.close())
    openButton.addEventListener('click', () => {
      dialog.showModal()
      openButton.setAttribute('aria-expanded', 'true')
      methods.syncTocHeight()
      methods.syncTocActiveState()
      const $dialogTocRoot = document.querySelector<HTMLElement>('#toc-content-drawer > nav')!
      methods.scrollActiveTocLinkIntoView($dialogTocRoot, ctx.activeTocId!, $dialogTocRoot)
      ;(document.activeElement as HTMLElement)?.blur()
    })
    forEach(document.querySelectorAll<HTMLAnchorElement>('#toc-content-drawer a[href^="#"]'), ($link) => {
      $link.addEventListener('click', () => dialog.close())
    })
    dialog.addEventListener('close', () => {
      openButton.setAttribute('aria-expanded', 'false')
    })
  }

  /** Clone TOC and heading-mark nodes to detach APlayer event listeners. */
  function fixTocScroll() {
    if (typeof window.APlayer === 'function') {
      let $tocCore = document.getElementById('TableOfContents')
      if ($tocCore) {
        const $newTocCore = $tocCore.cloneNode(true) as HTMLElement
        $tocCore.parentElement!.replaceChild($newTocCore, $tocCore)
        $tocCore = $newTocCore
      }
      forEach(document.querySelectorAll('.heading-mark'), ($headingMark: Element) => {
        const $newHeadingMark = $headingMark.cloneNode(true)
        $headingMark.parentElement!.replaceChild($newHeadingMark, $headingMark)
      })
    }
  }

  methods = {
    getVisibleHeaderOffset,
    getBreadcrumbHeight,
    getTocIndexOffset,
    getTocHeadingElements,
    getActiveTocHeading,
    getTocRoots,
    getTocLinkById,
    applyTocActiveState,
    scrollActiveTocLinkIntoView,
    syncTocHeight,
    syncTocActiveState,
    initToc,
    initTocListener,
    initTocDialog,
    fixTocScroll,
  }
  return methods
}
