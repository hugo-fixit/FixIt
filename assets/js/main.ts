/** FixIt theme entry point — assembles all modules and bootstraps initialization. */
import type { FixItContext } from './types'
import { createCharts } from './modules/charts'
import { createCode } from './modules/code'
import { createComment } from './modules/comment'
import { createContent } from './modules/content'
import { createCore } from './modules/core'
import { createEncryption } from './modules/encryption'
import { createEvents } from './modules/events'
import { createLinkGuard } from './modules/link-guard'
import { createMenu } from './modules/menu'
import { createMisc } from './modules/misc'
import { createSearch } from './modules/search'
import { createSvg } from './modules/svg'
import { createTheme } from './modules/theme'
import { createToc } from './modules/toc'

function createFixIt(): FixItContext {
  const ctx = {} as FixItContext

  return Object.assign(
    ctx,
    createCore(ctx),
    createTheme(ctx),
    createSvg(),
    createMenu(ctx),
    createSearch(ctx),
    createCode(),
    createToc(ctx),
    createCharts(ctx),
    createComment(ctx),
    createEncryption(ctx),
    createContent(ctx),
    createMisc(ctx),
    createLinkGuard(),
    createEvents(ctx),
  )
}

const fixit = createFixIt()

function init() {
  try {
    fixit.initContent()
    fixit.initFixItDecryptor()
    fixit.initThemeColor()
    fixit.initSVGIcon()
    fixit.initMenu()
    fixit.initSwitchTheme()
    fixit.initSearch()
    fixit.initCookieconsent()
    fixit.initSiteTime()
    fixit.initServiceWorker()
    fixit.initWatermark()
    fixit.initAutoMark()
    fixit.initReward()
    fixit.initPostChatUser()

    window.setTimeout(() => {
      fixit.initComment()
      fixit.onScroll()
      fixit.onResize()
      fixit.onClickMask()
      fixit.initPrint()
    }, 100)
  }
  catch (err) {
    console.error(err)
  }
  // eslint-disable-next-line no-console
  console.log(
    `%c FixIt ${fixit.config.version} %c https://github.com/hugo-fixit %c`,
    `background: #FF735A;border:1px solid #FF735A; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
    `border:1px solid #FF735A; padding: 1px; border-radius: 0 2px 2px 0; color: #FF735A;`,
    'background:transparent;',
  )
}

window.fixit = fixit

document.addEventListener('DOMContentLoaded', init, false)
