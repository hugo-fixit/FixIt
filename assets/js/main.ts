/** FixIt theme entry point — bootstraps service container and initializes all modules. */
import { ServiceContainer } from './core/container'
import { TypedEventBus } from './core/event-bus'
import { TOKENS } from './core/tokens'
import { ChartsModule } from './modules/charts'
import { CodeModule } from './modules/code'
import { CommentModule } from './modules/comment'
import { ContentModule } from './modules/content'
import { CoreModule } from './modules/core'
import { EncryptionModule } from './modules/encryption'
import { EventsModule } from './modules/events'
import { LinkGuardModule } from './modules/link-guard'
import { MenuModule } from './modules/menu'
import { MiscModule } from './modules/misc'
import { SearchModule } from './modules/search'
import { SvgModule } from './modules/svg'
import { ThemeModule } from './modules/theme'
import { TocModule } from './modules/toc'

/** Extract public methods from a service instance (excluding constructor). */
function publicAPI(service: Record<string, any>): Record<string, any> {
  const api: Record<string, any> = {}
  for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(service))) {
    if (key !== 'constructor' && typeof service[key] === 'function') {
      api[key] = service[key].bind(service)
    }
  }
  return api
}

function bootstrap(): void {
  const bus = new TypedEventBus()
  const container = new ServiceContainer()

  // Register all services (order does not matter — container resolves lazily)
  container
    .register(TOKENS.EventBus, () => bus)
    .register(TOKENS.Core, () => new CoreModule())
    .register(TOKENS.Theme, c => new ThemeModule(c.resolve(TOKENS.Core), bus))
    .register(TOKENS.Svg, () => new SvgModule())
    .register(TOKENS.Menu, c => new MenuModule(c.resolve(TOKENS.Core)))
    .register(TOKENS.Search, c => new SearchModule(c.resolve(TOKENS.Core)))
    .register(TOKENS.Code, () => new CodeModule())
    .register(TOKENS.Toc, () => new TocModule())
    .register(TOKENS.Charts, c => new ChartsModule(c.resolve(TOKENS.Core), bus))
    .register(TOKENS.Comment, c => new CommentModule(c.resolve(TOKENS.Core), bus))
    .register(TOKENS.Encryption, c => new EncryptionModule(c.resolve(TOKENS.Core)))
    .register(TOKENS.Misc, c => new MiscModule(c.resolve(TOKENS.Core), bus))
    .register(TOKENS.LinkGuard, () => new LinkGuardModule())
    .register(TOKENS.Content, c => new ContentModule(
      c.resolve(TOKENS.Core),
      c.resolve(TOKENS.Code),
      c.resolve(TOKENS.Charts),
      c.resolve(TOKENS.Toc),
      c.resolve(TOKENS.Misc),
      c.resolve(TOKENS.LinkGuard),
      bus,
    ))
    .register(TOKENS.Events, c => new EventsModule(
      c.resolve(TOKENS.Core),
      c.resolve(TOKENS.Toc),
      c.resolve(TOKENS.Search),
      c.resolve(TOKENS.Code),
      bus,
    ))

  // Resolve all services
  const core = container.resolve(TOKENS.Core)
  const theme = container.resolve(TOKENS.Theme)
  const svg = container.resolve(TOKENS.Svg)
  const menu = container.resolve(TOKENS.Menu)
  const search = container.resolve(TOKENS.Search)
  const code = container.resolve(TOKENS.Code)
  const toc = container.resolve(TOKENS.Toc)
  const charts = container.resolve(TOKENS.Charts)
  const comment = container.resolve(TOKENS.Comment)
  const enc = container.resolve(TOKENS.Encryption)
  const content = container.resolve(TOKENS.Content)
  const misc = container.resolve(TOKENS.Misc)
  const linkGuard = container.resolve(TOKENS.LinkGuard)
  const events = container.resolve(TOKENS.Events)

  // Build window.fixit backward-compatibility facade
  window.fixit = {
    get config() { return core.config },
    get themeMode() { return core.themeMode },
    get isDark() { return core.isDark },
    ...publicAPI(theme),
    ...publicAPI(svg),
    ...publicAPI(menu),
    ...publicAPI(search),
    ...publicAPI(code),
    ...publicAPI(toc),
    ...publicAPI(charts),
    ...publicAPI(comment),
    ...publicAPI(enc),
    ...publicAPI(content),
    ...publicAPI(misc),
    ...publicAPI(linkGuard),
    ...publicAPI(events),
  }

  function init() {
    try {
      content.initContent()
      enc.initFixItDecryptor()
      theme.initThemeColor()
      svg.initSVGIcon()
      menu.initMenu()
      theme.initSwitchTheme()
      search.initSearch()
      misc.initCookieconsent()
      misc.initSiteTime()
      misc.initServiceWorker()
      misc.initWatermark()
      misc.initAutoMark()
      misc.initReward()
      misc.initPostChatUser()
      comment.initComment()
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
