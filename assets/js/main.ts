import { printBanner } from './core/banner'
import { PublicAPI } from './core/public-api'

/**
 * FixIt theme entry point — initializes all modules and the window.fixit facade.
 *
 * Responsibilities:
 * - Create PublicAPI which initializes all service modules.
 * - Run the init sequence on `DOMContentLoaded`.
 */
function bootstrap(): void {
  // Build window.fixit facade with all modules
  window.fixit = new PublicAPI()

  function init() {
    try {
      window.fixit.toc.setup()
      window.fixit.content.setup()
      window.fixit.enc.initFixItDecryptor()
      window.fixit.theme.initThemeColor()
      window.fixit.content.initSVGIcon()
      window.fixit.menu.initMenu()
      window.fixit.theme.initSwitchTheme()
      window.fixit.search.initSearch()
      window.fixit.misc.initSiteTime()
      window.fixit.misc.initServiceWorker()
      window.fixit.misc.initAutoMark()
      window.fixit.misc.initReward()
      window.fixit.misc.initPostChatUser()
      window.fixit.misc.initComment()
      window.fixit.content.initContent()
      window.fixit.events.onScroll()
      window.fixit.events.onResize()
      window.fixit.events.onClickMask()
      window.fixit.events.initPrint()
    }
    catch (err) {
      console.error(err)
    }
    printBanner(window.fixit.version)
  }

  document.addEventListener('DOMContentLoaded', init, false)
}

bootstrap()
