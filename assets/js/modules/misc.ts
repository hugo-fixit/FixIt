/** Miscellaneous module — site time, PWA, MathJax, bookmarks, rewards, and PostChat. */
import type { TypedEventBus } from '../core/event-bus'
import type { CoreService, MiscService } from '../core/tokens'
import { getScrollTop, isMobile, isValidDate } from '../utils'

export class MiscModule implements MiscService {
  private siteTime: ReturnType<typeof setInterval> | undefined

  constructor(
    private readonly core: CoreService,
    private readonly bus: TypedEventBus,
  ) {}

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
      $rewards.forEach($reward => $reward.removeAttribute('data-mode'))
      return
    }
    const _closeRewardExclude = (_id?: any) => {
      $rewards.forEach(($reward) => {
        const $rewardInput = $reward.parentElement!.querySelector<HTMLInputElement>('.reward-input')
        if ($rewardInput && $rewardInput.id !== _id) {
          $rewardInput.checked = false
        }
      })
    }
    $rewards.forEach(($reward) => {
      $reward.previousElementSibling!.addEventListener('click', function (this: HTMLElement) {
        _closeRewardExclude(this.getAttribute('for'))
      }, false)
    })
    this.bus.on('fixit:scroll', () => _closeRewardExclude())
  }

  /** Initialize PostChat theme sync if configured. */
  initPostChatUser() {
    if (!window.postChatUser || !window.postChatConfig || window.postChatConfig.userMode === 'magic')
      return
    window.postChat_theme = this.core.isDark ? 'dark' : 'light'
    this.bus.on('fixit:switch-theme', ({ detail }) => {
      if (!detail.isChanged)
        return
      const targetFrame = document.getElementById('postChat_iframeContainer')
      if (targetFrame) {
        window.postChatUser.setPostChatTheme(detail.isDark ? 'dark' : 'light')
      }
      else {
        window.postChat_theme = detail.isDark ? 'dark' : 'light'
      }
    })
  }
}
