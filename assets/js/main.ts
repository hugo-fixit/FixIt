import { eventBus } from './core/event-bus'
import { CodeModule } from './modules/code'
import { ContentModule } from './modules/content'
import { CoreModule } from './modules/core'
import { EncryptionModule } from './modules/encryption'
import { EventsModule } from './modules/events'
import { MenuModule } from './modules/menu'
import { MiscModule } from './modules/misc'
import { SearchModule } from './modules/search'
import { ThemeModule } from './modules/theme'
import { TocModule } from './modules/toc'

/**
 * FixIt theme entry point — initializes all modules and the window.fixit facade.
 *
 * Responsibilities:
 * - Instantiate all service modules with direct constructor calls.
 * - Build the `window.fixit` facade.
 * - Run the init sequence on `DOMContentLoaded` (content, theme, menu, search, etc.).
 */
function bootstrap(): void {
  const core = new CoreModule()
  const theme = new ThemeModule(core)
  const code = new CodeModule()
  const toc = new TocModule()
  const menu = new MenuModule(core)
  const search = new SearchModule(core)
  const enc = new EncryptionModule(core)
  const misc = new MiscModule(core)
  const content = new ContentModule(core, code)
  const events = new EventsModule(core, toc, search, code)

  // Build window.fixit facade
  window.fixit = {
    get config() { return core.config },
    get themeMode() { return core.themeMode },
    get isDark() { return core.isDark },
    get newScrollTop() { return core.newScrollTop },
    get oldScrollTop() { return core.oldScrollTop },
    setThemeMode: (mode, persist) => theme.setThemeMode(mode, persist),
    registerMaskOverlay: (name, handlers) => core.registerMaskOverlay(name, handlers),
    toggleMaskOverlay: name => core.toggleMaskOverlay(name),
    closeMaskOverlay: (name, skipSync) => core.closeMaskOverlay(name, skipSync),
    initContent: target => content.initContent(target),
    eventBus,
  }

  function init() {
    try {
      toc.setup()
      content.setup()
      enc.initFixItDecryptor()
      theme.initThemeColor()
      content.initSVGIcon()
      menu.initMenu()
      theme.initSwitchTheme()
      search.initSearch()
      misc.initSiteTime()
      misc.initServiceWorker()
      misc.initAutoMark()
      misc.initReward()
      misc.initPostChatUser()
      misc.initComment()
      events.onScroll()
      events.onResize()
      events.onClickMask()
      events.initPrint()
    }
    catch (err) {
      console.error(err)
    }
    const fixitColor = '#FF735A'
    // eslint-disable-next-line no-console
    console.log(
      `%c FixIt ${core.config.version} %c https://github.com/hugo-fixit %c`,
      `background: ${fixitColor};border:1px solid ${fixitColor}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
      `border:1px solid ${fixitColor}; padding: 1px; border-radius: 0 2px 2px 0; color: ${fixitColor};`,
      'background:transparent;',
    )
  }

  document.addEventListener('DOMContentLoaded', init, false)
}

bootstrap()
