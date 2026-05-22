/** Menu module — desktop dropdown and mobile drawer navigation. */
import type { CoreService, MenuService } from '../core/tokens'
import { forEach } from '../utils'

export class MenuModule implements MenuService {
  constructor(private readonly core: CoreService) {}

  /** Initialize both desktop and mobile menus. */
  initMenu() {
    this.initMenuDesktop()
    this.initMenuMobile()
  }

  /** Set min-width on desktop sub-menus to match parent item width. */
  initMenuDesktop() {
    forEach(document.querySelectorAll<HTMLElement>('.has-children'), ($item) => {
      $item.querySelector<HTMLElement>('.sub-menu')!.style.minWidth = `${$item.offsetWidth - 8}px`
    })
  }

  /** Initialize mobile drawer menu with mask overlay and nested toggles. */
  initMenuMobile() {
    const $menuToggleMobile = document.getElementById('menu-toggle-mobile')
    const $menuMobile = document.getElementById('menu-mobile')
    if (!$menuToggleMobile || !$menuMobile)
      return
    this.core.registerMaskOverlay('menu-mobile', {
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
      this.core.toggleMaskOverlay('menu-mobile')
    }, false)
    // add nested menu toggler
    forEach(document.querySelectorAll<HTMLElement>('.menu-item>.nested-item'), ($nestedItem) => {
      $nestedItem.addEventListener('click', function (this: HTMLElement) {
        (this.parentNode as HTMLElement).querySelector('.sub-menu')!.classList.toggle('open')
        this.querySelector('.dropdown-icon')!.classList.toggle('open')
      })
    })
  }
}
