/** Miscellaneous module — cookie consent, site time, PWA, watermark, MathJax, bookmarks, and rewards. */
import type { TypedEventBus } from '../core/event-bus'
import type { CoreService, MiscService } from '../core/tokens'
import { forEach, getScrollTop, isMobile, isValidDate } from '../utils'

const cookieconsent = window.cookieconsent
const pangu = window.pangu
const Watermark = window.Watermark

export class MiscModule implements MiscService {
  private siteTime: ReturnType<typeof setInterval> | undefined

  constructor(
    private readonly core: CoreService,
    private readonly bus: TypedEventBus,
  ) {}

  /** Initialize cookie consent banner if configured. */
  initCookieconsent() {
    this.core.config.cookieconsent && cookieconsent?.initialise(this.core.config.cookieconsent)
  }

  /** Calculate and display the elapsed time since site launch. */
  getSiteTime() {
    const now = new Date()
    const run = new Date(this.core.config.siteTime!)
    const $runTimes = document.querySelector<HTMLElement>('.run-times')
    if (!isValidDate(run) || !$runTimes) {
      clearInterval(this.siteTime)
      $runTimes && $runTimes.parentNode!.removeChild($runTimes)
      return
    }
    const totalSeconds = Math.floor((now.getTime() - run.getTime()) / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    $runTimes.innerHTML = `${days}, ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    document.querySelector('.site-time .d-none')?.classList.remove('d-none')
  }

  /** Start the site-time counter with visibility-change pausing. */
  initSiteTime() {
    if (this.core.config.siteTime) {
      this.siteTime = setInterval(() => this.getSiteTime(), 500)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          return clearInterval(this.siteTime)
        }
        this.siteTime = setInterval(() => this.getSiteTime(), 500)
      }, false)
    }
  }

  /** Register the service worker for PWA support. */
  initServiceWorker() {
    if (this.core.config.enablePWA && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.min.js', { scope: '/' })
        .then((_registration) => {
          // console.log('Service Worker Registered');
        })
        .catch((error) => {
          console.error('error: ', error)
        })
      navigator.serviceWorker
        .ready
        .then((_registration) => {
          // console.log('Service Worker Ready');
        })
    }
  }

  /** Initialize the watermark overlay if enabled. */
  initWatermark() {
    if (!this.core.config.watermark?.enable)
      return
    void new Watermark(this.core.config.watermark)
  }

  /** Initialize Pangu.js for automatic CJK spacing. */
  initPangu() {
    if (!this.core.config.pangu?.enable)
      return
    pangu.ignoredTags = /^(script|code|pre|textarea|sup|sub)$/i
    const selector = this.core.config.pangu.selector
    if (selector) {
      document.querySelectorAll(selector).forEach(el => pangu.spacingNode(el))
      return
    }
    pangu.autoSpacingPage()
  }

  /** Trigger MathJax re-typesetting if MathJax is loaded. */
  initMathJax() {
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise().then(() => {
        // Do something else after typesetting is complete
      }).catch((err: Error) => console.warn(err.message))
    }
  }

  /** Save and restore scroll position as an automatic bookmark. */
  initAutoMark() {
    if (!this.core.config.autoBookmark)
      return
    window.addEventListener('beforeunload', () => {
      window.sessionStorage?.setItem(`fixit-bookmark/#${location.pathname}`, String(getScrollTop()))
    })
    const scrollTop = Number(window.sessionStorage?.getItem(`fixit-bookmark/#${location.pathname}`))
    if (scrollTop && location.hash === '') {
      window.scrollTo({ top: scrollTop, behavior: 'smooth' })
    }
  }

  /** Initialize reward/donation button exclusive-toggle behaviour. */
  initReward() {
    const $rewards = document.querySelectorAll<HTMLElement>('.post-reward [data-mode="fixed"]')
    if (!$rewards.length)
      return
    if (isMobile()) {
      forEach($rewards, $reward => $reward.removeAttribute('data-mode'))
      return
    }
    const _closeRewardExclude = (_id?: any) => {
      forEach($rewards, ($reward) => {
        const $rewardInput = $reward.parentElement!.querySelector<HTMLInputElement>('.reward-input')
        if ($rewardInput && $rewardInput.id !== _id) {
          $rewardInput.checked = false
        }
      })
    }
    forEach($rewards, ($reward) => {
      $reward.previousElementSibling!.addEventListener('click', function (this: HTMLElement) {
        _closeRewardExclude(this.getAttribute('for'))
      }, false)
    })
    document.addEventListener('fixit:scroll', _closeRewardExclude)
  }

  /** Initialize PostChat theme sync if configured. */
  initPostChatUser() {
    if (!window.postChatUser || !window.postChatConfig || window.postChatConfig.userMode === 'magic')
      return
    window.postChat_theme = this.core.isDark ? 'dark' : 'light'
    this.bus.on('fixit:switch-theme', () => {
      const targetFrame = document.getElementById('postChat_iframeContainer')
      if (targetFrame) {
        window.postChatUser.setPostChatTheme(this.core.isDark ? 'dark' : 'light')
      }
      else {
        window.postChat_theme = this.core.isDark ? 'dark' : 'light'
      }
    })
  }
}
