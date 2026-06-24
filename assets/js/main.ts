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

  /**
   * Initialize all modules in dependency order.
   *
   * 1. UI framework — menu (mask overlay), theme (color scheme)
   * 2. Interactive components — toc (sidebar), search (overlay)
   * 3. Content enhancement — content (details, tooltips), enc (decryption)
   * 4. Global features — misc (PWA, comments), events (scroll, resize)
   */
  function init() {
    try {
      window.fixit.menu.setup()
      window.fixit.theme.setup()
      window.fixit.toc.setup()
      window.fixit.search.setup()
      window.fixit.content.setup()
      window.fixit.enc.setup()
      window.fixit.pwa.setup()
      window.fixit.misc.setup()
      window.fixit.events.setup()
    }
    catch (err) {
      console.error(err)
    }
    printBanner(window.fixit.version)
  }

  document.addEventListener('DOMContentLoaded', init, false)
}

bootstrap()
