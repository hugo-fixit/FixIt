/** Menu module — desktop dropdown and mobile drawer navigation. */
import type { FixItContext } from '../types'
import { forEach } from '../utils'

/**
 * Create desktop dropdown and mobile drawer menu handlers.
 * @param ctx - The shared FixIt context object.
 * @returns Menu initialization methods.
 */
export function createMenu(ctx: FixItContext) {
  /** Initialize both desktop and mobile menus. */
  function initMenu() {
    initMenuDesktop()
    initMenuMobile()
  }

  /** Set min-width on desktop sub-menus to match parent item width. */
  function initMenuDesktop() {
    forEach(document.querySelectorAll<HTMLElement>('.has-children'), ($item) => {
      $item.querySelector<HTMLElement>('.sub-menu')!.style.minWidth = `${$item.offsetWidth - 8}px`
    })
  }

  /** Initialize mobile drawer menu with mask overlay and nested toggles. */
  function initMenuMobile() {
    const $menuToggleMobile = document.getElementById('menu-toggle-mobile')
    const $menuMobile = document.getElementById('menu-mobile')
    if (!$menuToggleMobile || !$menuMobile)
      return
    ctx.registerMaskOverlay('menu-mobile', {
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
      ctx.toggleMaskOverlay('menu-mobile')
    }, false)
    // add nested menu toggler
    forEach(document.querySelectorAll<HTMLElement>('.menu-item>.nested-item'), ($nestedItem) => {
      $nestedItem.addEventListener('click', function (this: HTMLElement) {
        (this.parentNode as HTMLElement).querySelector('.sub-menu')!.classList.toggle('open')
        this.querySelector('.dropdown-icon')!.classList.toggle('open')
      })
    })
  }

  return { initMenu, initMenuDesktop, initMenuMobile }
}
