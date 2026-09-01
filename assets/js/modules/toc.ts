import type { TocService } from '../core/tokens'
import { eventBus } from '../core/event-bus'
import { animateCSS, isMobile, isTocStatic } from '../utils'

const TOC_CONTAINER_IDS = ['toc-content-auto', 'toc-content-static', 'toc-content-drawer'] as const

/**
 * Table of Contents module — TOC scroll tracking, active state sync, and dialog.
 *
 * Responsibilities:
 * - Render TOC from template and sync layout state.
 * - Clear TOC containers on `fixit:re-encrypt`.
 * - Move TOC node to the correct container (static, auto, or drawer) on init.
 * - Track scroll position and highlight the active heading in all TOC containers.
 * - Initialize mobile TOC drawer dialog and its open/close handlers.
 * - Clone TOC nodes to detach APlayer event listeners.
 */
export class TocModule implements TocService {
  #activeTocId: string | null = null
  #previousActiveLinks = new Map<HTMLElement, HTMLAnchorElement | null>()
  #headingOffsets: Array<{ id: string, top: number }> = []
  #headingOffsetsDirty = true
  #rafId: number | null = null

  /** Get all TOC content containers (auto, static, and drawer). */
  #getTocContainers(): HTMLElement[] {
    return TOC_CONTAINER_IDS
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]
  }

  /** Compute the scroll offset for header + breadcrumb. */
  #getIndexOffset(): number {
    const headerId = isMobile() ? 'header-mobile' : 'header-desktop'
    const $header = document.getElementById(headerId)
    const headerMode = document.body.getAttribute(`data-${headerId}`)
    if (!$header || window.getComputedStyle($header).display === 'none')
      return 20
    const shouldApplyOffset = headerMode === 'sticky' || (headerMode === 'auto' && !$header.classList.contains('header__fadeOutUp'))
    const headerOffset = shouldApplyOffset ? $header.offsetHeight : 0
    const breadcrumbOffset = document.querySelector<HTMLElement>('.breadcrumb-container')?.offsetHeight || 0
    return 20 + headerOffset + breadcrumbOffset
  }

  /** Cache heading absolute offsets for binary search. Called on init/resize/content change. */
  #cacheHeadingOffsets() {
    const $headingElements = document.querySelectorAll<HTMLElement>('.heading-element[id]')
    this.#headingOffsets = Array.from($headingElements).map($h => ({
      id: $h.id,
      top: window.scrollY + $h.getBoundingClientRect().top,
    }))
    this.#headingOffsetsDirty = false
  }

  /**
   * Determine which heading is currently active based on scroll position.
   * Uses cached offsets with binary search for O(log n) performance.
   * @returns The active heading element, or `null` if none found.
   */
  #getActiveTocHeading(): HTMLElement | null {
    if (this.#headingOffsetsDirty || !this.#headingOffsets.length)
      this.#cacheHeadingOffsets()
    if (!this.#headingOffsets.length)
      return null

    const threshold = window.scrollY + this.#getIndexOffset() + 1
    let lo = 0
    let hi = this.#headingOffsets.length - 1
    let result = 0
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1
      if (this.#headingOffsets[mid].top <= threshold) {
        result = mid
        lo = mid + 1
      }
      else {
        hi = mid - 1
      }
    }
    return document.getElementById(this.#headingOffsets[result].id)
  }

  /**
   * Find the TOC link that points to the given heading id.
   * @param $tocRoot - The TOC root container element.
   * @param id - The heading id (without `#`).
   * @returns The matching anchor element, or `null`.
   */
  #getTocLinkById($tocRoot: HTMLElement, id: string): HTMLAnchorElement | null {
    if (!$tocRoot || !id)
      return null
    const targetHash = `#${id}`
    return Array.from($tocRoot.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')).find($link => $link.getAttribute('href') === targetHash) || null
  }

  /**
   * Get the ancestor `<li>` chain from a link up to the TOC root.
   * @param $link - The anchor element inside a `<li>`.
   * @returns An array of ancestor `<li>` elements (nearest first).
   */
  #getAncestorChain($link: Element): HTMLLIElement[] {
    const chain: HTMLLIElement[] = []
    let $parent = $link.closest('li')
    while ($parent) {
      chain.push($parent)
      $parent = $parent.parentElement?.closest('li') || null
    }
    return chain
  }

  /**
   * Highlight the active TOC item and its parent chain using diff-based updates.
   * Only removes/adds classes on the difference between old and new active chains,
   * avoiding a global clear that causes visual flash.
   * @param $tocRoot - The TOC root container element.
   * @param activeId - The id of the currently active heading.
   */
  #applyTocActiveState($tocRoot: HTMLElement, activeId: string) {
    if (!$tocRoot)
      return
    const $newActiveLink = this.#getTocLinkById($tocRoot, activeId)
    const $prevActiveLink = this.#previousActiveLinks.get($tocRoot) || null
    if ($newActiveLink === $prevActiveLink)
      return

    // Remove from old chain
    if ($prevActiveLink) {
      $prevActiveLink.classList.remove('active')
      for (const $li of this.#getAncestorChain($prevActiveLink)) {
        $li.classList.remove('has-active')
      }
    }

    // Add to new chain
    if ($newActiveLink) {
      $newActiveLink.classList.add('active')
      for (const $li of this.#getAncestorChain($newActiveLink)) {
        $li.classList.add('has-active')
      }
    }

    this.#previousActiveLinks.set($tocRoot, $newActiveLink)
  }

  /**
   * Scroll the active TOC link into the visible area of its container.
   * @param $tocRoot - The TOC root container element.
   * @param activeId - The id of the currently active heading.
   */
  #scrollActiveTocLinkIntoView($tocRoot: HTMLElement, activeId: string) {
    const $activeLink = this.#getTocLinkById($tocRoot, activeId)
    if (!$activeLink)
      return
    $activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  /** Update the TOC container's max-height CSS variable to fit the viewport. */
  syncTocHeight() {
    const $toc = document.getElementById('toc-auto')
    const $tocContentAuto = document.getElementById('toc-content-auto')
    if ($toc && $tocContentAuto) {
      const maxHeight = Math.max(window.innerHeight - $tocContentAuto.getBoundingClientRect().top - 16)
      $tocContentAuto.style.setProperty('--fi-toc-content-max-height', `${Math.floor(maxHeight)}px`)
    }
  }

  /** Sync the active heading highlight across all TOC containers. Throttled via rAF. */
  syncTocActiveState() {
    if (this.#rafId !== null)
      return
    this.#rafId = requestAnimationFrame(() => {
      this.#rafId = null
      const $activeHeading = this.#getActiveTocHeading()
      if (!$activeHeading?.id)
        return
      const activeId = $activeHeading.id
      const $tocRoots = this.#getTocContainers()
        .map($container => $container.querySelector<HTMLElement>('nav'))
        .filter(Boolean) as HTMLElement[]
      $tocRoots.forEach(($tocRoot) => {
        this.#applyTocActiveState($tocRoot, activeId)
      })
      if (this.#activeTocId !== activeId) {
        this.#activeTocId = activeId
        if (!isTocStatic()) {
          const $autoTocRoot = document.querySelector<HTMLElement>('#toc-content-auto > nav')
          if ($autoTocRoot) {
            this.#scrollActiveTocLinkIntoView($autoTocRoot, activeId)
          }
        }
        if ((document.getElementById('nav-dialog') as HTMLDialogElement)?.open) {
          const $dialogTocRoot = document.querySelector<HTMLElement>('#toc-content-drawer > nav')!
          this.#scrollActiveTocLinkIntoView($dialogTocRoot, activeId)
        }
      }
    })
  }

  /** Sync TOC layout state: drawer button visibility, height, and active heading. */
  #syncTocLayout() {
    document.querySelector<HTMLElement>('#nav-drawer-button')?.classList.toggle('hidden', !isTocStatic())
    this.#activeTocId = null
    this.#previousActiveLinks.clear()
    this.#headingOffsetsDirty = true
    this.syncTocHeight()
    this.syncTocActiveState()
  }

  /** Render TOC from `<template data-toc>` into static/auto/drawer containers. */
  renderToc() {
    const $tocTemplate = document.querySelector<HTMLTemplateElement>('template[data-toc]')
    if ($tocTemplate?.dataset.password)
      return
    const $tocCore = $tocTemplate?.content.querySelector('#TableOfContents')
    if (!$tocTemplate || !$tocCore)
      return
    for (const $container of this.#getTocContainers()) {
      $container.textContent = ''
      const $clone = $tocCore.cloneNode(true) as HTMLElement
      $clone.removeAttribute('id')
      $container.appendChild($clone)
    }
    this.#headingOffsetsDirty = true
  }

  /** Bind the `toc-auto` title click handler for show/hide toggle. */
  #initTocToggle() {
    const $toc = document.getElementById('toc-auto')!
    const $tocContentAuto = document.getElementById('toc-content-auto')!
    document.querySelector<HTMLElement>('#toc-auto>.toc-title')?.addEventListener('click', () => {
      const animation = ['animate__faster']
      const tocHidden = $toc.classList.contains('toc-hidden')
      animation.push(tocHidden ? 'animate__fadeIn' : 'animate__fadeOut')
      if (tocHidden) {
        $tocContentAuto.classList.remove('hidden', 'animate__fadeOut')
      }
      else {
        $tocContentAuto.classList.remove('animate__fadeIn')
      }
      animateCSS($tocContentAuto, animation, true, () => {
        $tocContentAuto.classList.contains('animate__fadeOut') && $tocContentAuto.classList.add('hidden')
      })
      $toc.classList.toggle('toc-hidden')
    }, false)
  }

  /** Initialize the mobile TOC drawer dialog and its open/close handlers. */
  #initTocDrawerLinkClose() {
    const dialog = document.querySelector<HTMLDialogElement>('#nav-dialog')
    if (!dialog)
      return
    document.querySelectorAll<HTMLAnchorElement>('#toc-content-drawer a[href^="#"]').forEach(($link) => {
      if ($link.dataset.tocDialogCloseBound === 'true')
        return
      $link.addEventListener('click', () => dialog.close())
      $link.dataset.tocDialogCloseBound = 'true'
    })
  }

  /** Initialize the mobile TOC drawer dialog and its open/close handlers. */
  #initTocDrawer() {
    const dialog = document.querySelector<HTMLDialogElement>('#nav-dialog')
    const openButton = document.querySelector<HTMLElement>('#nav-drawer-button')
    if (!dialog || !openButton)
      return
    const closeButton = dialog.querySelector<HTMLElement>('.nav-close-btn')
    closeButton?.addEventListener('click', () => dialog.close())
    openButton.addEventListener('click', () => {
      dialog.showModal()
      openButton.setAttribute('aria-expanded', 'true')
      this.syncTocHeight()
      this.syncTocActiveState()
      const $dialogTocRoot = document.querySelector<HTMLElement>('#toc-content-drawer > nav')!
      this.#scrollActiveTocLinkIntoView($dialogTocRoot, this.#activeTocId!)
      ;(document.activeElement as HTMLElement)?.blur()
    })
    dialog.addEventListener('close', () => {
      openButton.setAttribute('aria-expanded', 'false')
    })
  }

  /** Reset heading-mark nodes to fix the APlayer-caused anchor click issue. */
  #resetHeadingClicks() {
    if (typeof window.APlayer === 'function') {
      document.querySelectorAll('.heading-mark').forEach(($headingMark: Element) => {
        const $newHeadingMark = $headingMark.cloneNode(true)
        $headingMark.parentElement!.replaceChild($newHeadingMark, $headingMark)
      })
    }
  }

  /** Initialize all TOC components and register event listeners. */
  setup() {
    this.renderToc()
    this.#initTocToggle()
    this.#syncTocLayout()
    this.#initTocDrawer()
    this.#initTocDrawerLinkClose()
    this.#resetHeadingClicks()
    eventBus.on('fixit:resize', () => this.#syncTocLayout())
    eventBus.on('fixit:scroll', () => this.syncTocActiveState())
    eventBus.on('fixit:content-decrypted', ({ detail }) => {
      if (detail.isPage) {
        this.#syncTocLayout()
        this.#initTocDrawerLinkClose()
      }
    })
    eventBus.on('fixit:re-encrypt', () => {
      this.#syncTocLayout()
    })
  }
}
