import type { CoreService, MenuService } from '../core/tokens'

/**
 * Menu module — desktop dropdown and mobile drawer navigation.
 *
 * Responsibilities:
 * - Desktop header dropdown menu interactions.
 * - Mobile header drawer menu open/close/toggle.
 * - Sync menu state with mask overlay.
 */
export class MenuModule implements MenuService {
  #core: CoreService

  constructor(core: CoreService) {
    this.#core = core
  }

  /** Set min-width on desktop sub-menus to match parent item width. */
  initDesktop() {
    document.querySelectorAll<HTMLElement>('.has-children').forEach(($item) => {
      $item.querySelector<HTMLElement>('.sub-menu')!.style.minWidth = `${$item.offsetWidth - 8}px`
    })
  }

  /** Initialize mobile drawer menu with mask overlay and nested toggles. */
  initMobile() {
    const $menuToggleMobile = document.getElementById('menu-toggle-mobile')
    const $menuMobile = document.getElementById('menu-mobile')
    if (!$menuToggleMobile || !$menuMobile)
      return
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
    // add nested menu toggler
    document.querySelectorAll<HTMLElement>('.menu-item>.nested-item').forEach(($nestedItem) => {
      $nestedItem.addEventListener('click', function (this: HTMLElement) {
        (this.parentNode as HTMLElement).querySelector('.sub-menu')!.classList.toggle('open')
        this.querySelector('.dropdown-icon')!.classList.toggle('open')
      })
    })
  }

  /** Initialize both desktop and mobile menus. */
  setup() {
    this.initDesktop()
    this.initMobile()
  }
}
