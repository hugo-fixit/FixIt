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
   * 3. Content enhancement — content (details, tooltips), contribution (year switching), enc (decryption)
   * 4. Global features — misc (PWA, comments), events (scroll, resize)
   */
  function init() {
    const modules: Array<[string, () => void]> = [
      [
        'menu',
        () => window.fixit.menu.setup(),
      ],
      [
        'theme',
        () => window.fixit.theme.setup(),
      ],
      [
        'toc',
        () => window.fixit.toc.setup(),
      ],
      [
        'search',
        () => window.fixit.search.setup(),
      ],
      [
        'content',
        () => window.fixit.content.setup(),
      ],
      [
        'contribution',
        () => window.fixit.contribution.setup(),
      ],
      [
        'enc',
        () => window.fixit.enc.setup(),
      ],
      [
        'pwa',
        () => window.fixit.pwa.setup(),
      ],
      [
        'misc',
        () => window.fixit.misc.setup(),
      ],
      [
        'events',
        () => window.fixit.events.setup(),
      ],
    ]
    // Isolate failures: one broken module (e.g. a missing third-party script)
    // must not prevent the remaining modules from initializing.
    modules.forEach(([name, setup]) => {
      try {
        setup()
      }
      catch (err) {
        console.error(`[FixIt] Failed to initialize the "${name}" module`, err)
      }
    })
    printBanner(window.fixit.version)
  }

  document.addEventListener('DOMContentLoaded', init, false)
}

bootstrap()
