import type { CoreService, MenuService } from '../core/tokens'
import { eventBus } from '../core/event-bus'

const HOVER_OPEN_DELAY = 120
const HOVER_CLOSE_DELAY = 250

interface HoverTimer {
  id: number
  item: HTMLElement
}

/**
 * Menu module — desktop dropdown and mobile drawer navigation.
 *
 * Responsibilities:
 * - Desktop submenu disclosure: click, keyboard, and mouse-only hover intent.
 * - Mobile header drawer and nested submenu toggles.
 * - Sync menu state with the mask overlay and global dismiss events.
 */
export class MenuModule implements MenuService {
  #core: CoreService
  #desktopHeader: HTMLElement | null = null
  #desktopNav: HTMLElement | null = null
  #desktopItems: HTMLElement[] = []
  #openItem: HTMLElement | null = null
  #openViaHover = false
  #hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
  #openTimer: HoverTimer | null = null
  #closeTimer: HoverTimer | null = null
  #navScrollX: number | null = null
  #navScrollFrame: number | null = null
  #autoId = 0
  #desktopBound = false
  #mobileBound = false

  constructor(core: CoreService) {
    this.#core = core
  }

  /** Initialize desktop submenu disclosure interactions. */
  initDesktop() {
    if (this.#desktopBound)
      return

    const $header = document.getElementById('header-desktop')
    if (!$header || !$header.querySelector('.menu'))
      return

    this.#desktopHeader = $header
    this.#desktopBound = true
    this.#desktopItems = Array.from($header.querySelectorAll<HTMLElement>('.menu > .menu-item')).filter($child =>
      Boolean(this.#getToggle($child) && $child.querySelector(':scope > .sub-menu')),
    )

    this.#desktopItems.forEach($item => this.#bindDesktopItem($item))
    this.#syncDesktopMetrics()

    const $nav = $header.querySelector<HTMLElement>('nav.nav-main')
    if ($nav) {
      this.#desktopNav = $nav
      $nav.addEventListener('scroll', this.#handleNavScroll, { passive: true })
      this.#syncNavScroll()
    }

    document.addEventListener('pointerdown', this.#handleDocumentPointerDown, true)
    document.addEventListener('keydown', this.#handleDocumentKeyDown, true)
    eventBus.on('fixit:resize', this.#handleResize)
    eventBus.on('fixit:scroll', this.#handleScroll)
  }

  /** Initialize mobile drawer menu with mask overlay and nested toggles. */
  initMobile() {
    if (this.#mobileBound)
      return

    const $menuToggleMobile = document.getElementById('menu-toggle-mobile')
    const $menuMobile = document.getElementById('menu-mobile')
    if (!$menuToggleMobile || !$menuMobile)
      return

    this.#mobileBound = true
    this.#core.registerMaskOverlay('menu-mobile', {
      isActive: () => $menuMobile.classList.contains('active'),
      onOpen: () => {
        $menuToggleMobile.classList.add('active')
        $menuMobile.classList.add('active')
        $menuToggleMobile.setAttribute('aria-expanded', 'true')
      },
      onClose: () => {
        $menuToggleMobile.classList.remove('active')
        $menuMobile.classList.remove('active')
        $menuToggleMobile.setAttribute('aria-expanded', 'false')
      },
    })
    $menuToggleMobile.addEventListener('click', () => {
      this.#core.toggleMaskOverlay('menu-mobile')
    }, false)

    // Use the split toggle when present; keep the old row toggle for template overrides.
    $menuMobile.querySelectorAll<HTMLElement>('[data-submenu-toggle]')
      .forEach($toggle => this.#bindMobileItem($toggle))
    $menuMobile.querySelectorAll<HTMLElement>('.menu-item > .nested-item')
      .forEach($nestedItem => this.#bindLegacyMobileItem($nestedItem))
  }

  /** Bind a mobile split toggle and its nested submenu. */
  #bindMobileItem($toggle: HTMLElement) {
    const $item = $toggle.closest<HTMLElement>('.menu-item')
    const $submenu = $item?.querySelector<HTMLElement>(':scope > .sub-menu')
    if (!$item || !$submenu)
      return

    this.#ensureSubmenuId($toggle, $submenu)
    $toggle.setAttribute('aria-expanded', 'false')
    $toggle.addEventListener('click', () => {
      this.#applyState($item, !$item.classList.contains('open'))
    })
    $item.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !$item.classList.contains('open'))
        return
      event.preventDefault()
      event.stopPropagation()
      this.#applyState($item, false)
      $toggle.focus()
    })
  }

  /** Bind the legacy mobile row toggle used by old template overrides. */
  #bindLegacyMobileItem($nestedItem: HTMLElement) {
    const $item = $nestedItem.parentElement
    if (!$item || $nestedItem.querySelector('[data-submenu-toggle]'))
      return

    const $submenu = $item.querySelector<HTMLElement>(':scope > .sub-menu')
    if (!$submenu)
      return

    $nestedItem.addEventListener('click', () => {
      $submenu.classList.toggle('open')
      $nestedItem.querySelector('.dropdown-icon')?.classList.toggle('open')
    })
  }

  /** Initialize both desktop and mobile menus. */
  setup() {
    this.initDesktop()
    this.initMobile()
  }

  /** Resolve the submenu toggle for a desktop or mobile menu item. */
  #getToggle($item: HTMLElement): HTMLElement | null {
    return $item.querySelector<HTMLElement>(':scope > [data-submenu-toggle], :scope > .nested-item > [data-submenu-toggle]')
  }

  /** Bind one desktop menu item with a direct toggle and submenu. */
  #bindDesktopItem($item: HTMLElement) {
    const $toggle = this.#getToggle($item)
    const $submenu = $item.querySelector<HTMLElement>(':scope > .sub-menu')
    if (!$toggle || !$submenu)
      return

    this.#ensureSubmenuId($toggle, $submenu)
    $toggle.setAttribute('aria-expanded', 'false')

    $toggle.addEventListener('click', () => {
      this.#clearHoverTimers()
      this.#setOpen($item, this.#openItem !== $item)
    })

    $submenu.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('a'))
        this.#setOpen($item, false)
    })

    $item.addEventListener('pointerenter', (event) => {
      if (this.#isHoverIntent(event))
        this.#scheduleOpen($item)
    })

    $item.addEventListener('pointerleave', (event) => {
      if (event.pointerType === 'mouse')
        this.#scheduleClose($item)
    })

    $item.addEventListener('focusin', () => {
      this.#cancelClose($item)
    })

    $item.addEventListener('focusout', (event) => {
      if (event.relatedTarget instanceof Node && !$item.contains(event.relatedTarget))
        this.#setOpen($item, false)
    })

    // Keep the CSS hover/focus fallback active if binding stops before this point.
    $item.classList.add('menu-enhanced')
  }

  /** Ensure the submenu has an id and the toggle points at it. */
  #ensureSubmenuId($toggle: HTMLElement, $submenu: HTMLElement): void {
    if (!$submenu.id)
      $submenu.id = `fi-submenu-auto-${++this.#autoId}`
    $toggle.setAttribute('aria-controls', $submenu.id)
  }

  /** Open or close a desktop item and keep ARIA state in sync. */
  #setOpen($item: HTMLElement, open: boolean, viaHover = false) {
    this.#clearCloseTimer()

    if (open) {
      this.#syncNavScroll()
      if (this.#openItem && this.#openItem !== $item)
        this.#applyState(this.#openItem, false)
      this.#openItem = $item
      this.#openViaHover = viaHover
    }
    else if (this.#openItem === $item) {
      this.#openItem = null
      this.#openViaHover = false
    }
    this.#applyState($item, open)
  }

  /** Apply the open state to the item, submenu, and toggle. */
  #applyState($item: HTMLElement, open: boolean) {
    $item.classList.toggle('open', open)
    const $submenu = $item.querySelector<HTMLElement>(':scope > .sub-menu')
    const $toggle = this.#getToggle($item)
    $submenu?.classList.toggle('open', open)
    $toggle?.setAttribute('aria-expanded', String(open))
  }

  /** Close the open desktop item and clear hover timers. */
  #closeAll() {
    this.#clearHoverTimers()
    if (this.#openItem)
      this.#applyState(this.#openItem, false)
    this.#openItem = null
    this.#openViaHover = false
  }

  /** Whether focus is held by a different open item. */
  #focusHeldByOtherItem($item: HTMLElement): boolean {
    return Boolean(this.#openItem && this.#openItem !== $item && this.#openItem.contains(document.activeElement))
  }

  /** Schedule a delayed hover open. */
  #scheduleOpen($item: HTMLElement) {
    this.#clearOpenTimer()
    this.#cancelClose($item)
    if ($item.classList.contains('open'))
      return

    const id = window.setTimeout(() => {
      this.#openTimer = null
      if (this.#focusHeldByOtherItem($item))
        return
      this.#setOpen($item, true, true)
    }, HOVER_OPEN_DELAY)
    this.#openTimer = { id, item: $item }
  }

  /** Schedule a delayed hover close for hover-opened items. */
  #scheduleClose($item: HTMLElement) {
    if (this.#openTimer?.item === $item)
      this.#clearOpenTimer()

    if (this.#openItem !== $item || !this.#openViaHover)
      return
    if ($item.contains(document.activeElement))
      return

    this.#clearCloseTimer()
    const id = window.setTimeout(() => {
      this.#closeTimer = null
      if (this.#openItem === $item && this.#openViaHover)
        this.#setOpen($item, false)
    }, HOVER_CLOSE_DELAY)
    this.#closeTimer = { id, item: $item }
  }

  /** Clear the pending hover-open timer. */
  #clearOpenTimer() {
    if (this.#openTimer !== null) {
      window.clearTimeout(this.#openTimer.id)
      this.#openTimer = null
    }
  }

  /** Cancel the pending hover-close timer for one item. */
  #cancelClose($item: HTMLElement) {
    if (this.#closeTimer?.item === $item)
      this.#clearCloseTimer()
  }

  /** Clear the pending hover-close timer. */
  #clearCloseTimer() {
    if (this.#closeTimer !== null) {
      window.clearTimeout(this.#closeTimer.id)
      this.#closeTimer = null
    }
  }

  /** Clear all hover timers. */
  #clearHoverTimers() {
    this.#clearOpenTimer()
    this.#clearCloseTimer()
  }

  /** Hover enhancement is only for a real mouse on a hover-capable pointer. */
  #isHoverIntent(event: PointerEvent): boolean {
    return event.pointerType === 'mouse' && this.#hoverQuery.matches
  }

  /** Match submenu min-width to the parent item after layout changes. */
  #syncDesktopMetrics() {
    if (!this.#desktopHeader || this.#desktopHeader.offsetWidth === 0)
      return

    this.#desktopItems.forEach(($item) => {
      const $submenu = $item.querySelector<HTMLElement>(':scope > .sub-menu')
      const width = $item.offsetWidth
      if (!$submenu || width === 0)
        return
      $submenu.style.minWidth = `${width - 8}px`
    })
  }

  /** Close the open desktop item when a pointer goes down outside it. */
  #handleDocumentPointerDown = (event: PointerEvent): void => {
    if (!this.#openItem)
      return
    if (event.target instanceof Node && this.#openItem.contains(event.target))
      return
    this.#closeAll()
  }

  /** Close the open desktop item with Escape and restore focus when appropriate. */
  #handleDocumentKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !this.#openItem)
      return
    if (document.querySelector('dialog[open]'))
      return

    const $item = this.#openItem
    const $toggle = this.#getToggle($item)
    const $active = document.activeElement
    this.#closeAll()
    if ($item.contains($active))
      $toggle?.focus()
  }

  /** Sync the nav scroll offset used by submenu positioning. */
  #syncNavScroll() {
    if (!this.#desktopNav)
      return
    const scrollLeft = this.#desktopNav.scrollLeft
    if (scrollLeft === this.#navScrollX)
      return
    this.#navScrollX = scrollLeft
    this.#desktopNav.style.setProperty('--fi-nav-scroll-x', `${scrollLeft}px`)
  }

  /** Coalesce nav scroll updates while a submenu is open. */
  #handleNavScroll = (): void => {
    if (!this.#openItem || this.#navScrollFrame !== null)
      return
    this.#navScrollFrame = window.requestAnimationFrame(() => {
      this.#navScrollFrame = null
      if (this.#openItem)
        this.#syncNavScroll()
    })
  }

  /** Re-measure submenus or close them when the desktop header is hidden. */
  #handleResize = (): void => {
    if (!this.#desktopHeader)
      return
    if (this.#desktopHeader.offsetWidth === 0) {
      this.#closeAll()
      return
    }
    this.#syncDesktopMetrics()
    this.#syncNavScroll()
  }

  /** Close the open item when the header auto-hides on scroll. */
  #handleScroll = (): void => {
    if (!this.#openItem || !this.#desktopHeader)
      return
    if (this.#desktopHeader.classList.contains('header__fadeOutUp'))
      this.#closeAll()
  }
}
