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
  private activeTocId: string | null = null

  /** Get all TOC content containers (auto, static, and drawer). */
  #getTocContainers(): HTMLElement[] {
    return TOC_CONTAINER_IDS
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]
  }

  /**
   * Determine which heading is currently active based on scroll position.
   * @returns The active heading element, or `null` if none found.
   */
  #getActiveTocHeading(): HTMLElement | null {
    const $headingElements = Array.from(document.querySelectorAll<HTMLElement>('.heading-element[id]'))
    if (!$headingElements.length)
      return null
    const headerOffset = (() => {
      const headerId = isMobile() ? 'header-mobile' : 'header-desktop'
      const $header = document.getElementById(headerId)
      const headerMode = document.body.getAttribute(`data-${headerId}`)
      if (!$header || window.getComputedStyle($header).display === 'none')
        return 0
      const shouldApplyOffset = headerMode === 'sticky' || (headerMode === 'auto' && !$header.classList.contains('header__fadeOutUp'))
      return shouldApplyOffset ? $header.offsetHeight : 0
    })()
    const breadcrumbOffset = document.querySelector<HTMLElement>('.breadcrumb-container')?.offsetHeight || 0
    const indexOffset = 20 + headerOffset + breadcrumbOffset

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
   * Highlight the active TOC item and its parent chain.
   * @param $tocRoot - The TOC root container element.
   * @param activeId - The id of the currently active heading.
   */
  #applyTocActiveState($tocRoot: HTMLElement, activeId: string) {
    if (!$tocRoot)
      return
    $tocRoot.querySelectorAll('a[href^="#"]').forEach(($tocLink: Element) => {
      $tocLink.classList.remove('active')
    })
    $tocRoot.querySelectorAll('li').forEach(($tocLi: Element) => {
      $tocLi.classList.remove('has-active')
    })
    const $activeLink = this.#getTocLinkById($tocRoot, activeId)
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
  #scrollActiveTocLinkIntoView($tocRoot: HTMLElement, activeId: string, $scrollContainer: HTMLElement = $tocRoot) {
    const $activeLink = this.#getTocLinkById($tocRoot, activeId)
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
  syncTocHeight() {
    const $toc = document.getElementById('toc-auto')
    const $tocContentAuto = document.getElementById('toc-content-auto')
    if ($toc && $tocContentAuto) {
      const maxHeight = Math.max(window.innerHeight - $tocContentAuto.getBoundingClientRect().top - 16)
      $tocContentAuto.style.setProperty('--fi-toc-content-max-height', `${Math.floor(maxHeight)}px`)
    }
  }

  /** Sync the active heading highlight across all TOC containers. */
  syncTocActiveState() {
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
    if (this.activeTocId !== activeId) {
      this.activeTocId = activeId
      if (!isTocStatic()) {
        const $autoTocRoot = document.querySelector<HTMLElement>('#toc-content-auto > nav')
        const $autoTocContainer = document.getElementById('toc-content-auto')
        if ($autoTocRoot && $autoTocContainer) {
          this.#scrollActiveTocLinkIntoView($autoTocRoot, activeId, $autoTocContainer)
        }
      }
      if ((document.getElementById('toc-dialog') as HTMLDialogElement)?.open) {
        const $dialogTocRoot = document.querySelector<HTMLElement>('#toc-content-drawer > nav')!
        this.#scrollActiveTocLinkIntoView($dialogTocRoot, activeId, $dialogTocRoot)
      }
    }
  }

  /** Sync TOC layout state: drawer button visibility, height, and active heading. */
  #syncTocLayout() {
    document.querySelector<HTMLElement>('#toc-drawer-button')?.classList.toggle('hidden', !isTocStatic())
    this.activeTocId = null
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
    const dialog = document.querySelector<HTMLDialogElement>('#toc-dialog')
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
    const dialog = document.querySelector<HTMLDialogElement>('#toc-dialog')
    const openButton = document.querySelector<HTMLElement>('#toc-drawer-button')
    if (!dialog || !openButton)
      return
    const closeButton = dialog.querySelector<HTMLElement>('.toc-close-btn')
    closeButton?.addEventListener('click', () => dialog.close())
    openButton.addEventListener('click', () => {
      dialog.showModal()
      openButton.setAttribute('aria-expanded', 'true')
      this.syncTocHeight()
      this.syncTocActiveState()
      const $dialogTocRoot = document.querySelector<HTMLElement>('#toc-content-drawer > nav')!
      this.#scrollActiveTocLinkIntoView($dialogTocRoot, this.activeTocId!, $dialogTocRoot)
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
