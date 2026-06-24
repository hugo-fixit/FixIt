import type { FixItPublicAPI } from './tokens'
import { CodeModule } from '../modules/code'
import { ContentModule } from '../modules/content'
import { CoreModule } from '../modules/core'
import { EncryptionModule } from '../modules/encryption'
import { EventsModule } from '../modules/events'
import { MenuModule } from '../modules/menu'
import { MiscModule } from '../modules/misc'
import { PWAModule } from '../modules/pwa'
import { SearchModule } from '../modules/search'
import { ThemeModule } from '../modules/theme'
import { TocModule } from '../modules/toc'
import { eventBus } from './event-bus'

/**
 * Public API facade — typed interface exposed on `window.fixit`.
 *
 * Initializes and exposes all service modules in dependency order.
 */
export class PublicAPI implements FixItPublicAPI {
  readonly core
  readonly theme
  readonly code
  readonly toc
  readonly menu
  readonly search
  readonly enc
  readonly pwa
  readonly misc
  readonly content
  readonly events
  readonly eventBus = eventBus

  constructor() {
    // Initialize modules in dependency order
    this.core = new CoreModule()
    this.theme = new ThemeModule(this.core)
    this.code = new CodeModule()
    this.toc = new TocModule()
    this.menu = new MenuModule(this.core)
    this.search = new SearchModule(this.core)
    this.enc = new EncryptionModule(this.core)
    this.pwa = new PWAModule(this.core)
    this.misc = new MiscModule(this.core)
    this.content = new ContentModule(this.core, this.code)
    this.events = new EventsModule(this.core, this.toc, this.code)
  }

  get config() { return this.core.config }
  get version() { return this.core.version }
  get themeMode() { return this.core.themeMode }
  get isDark() { return this.core.isDark }

  setThemeMode(mode: string, persist?: boolean) {
    this.theme.setThemeMode(mode, persist)
  }
}
