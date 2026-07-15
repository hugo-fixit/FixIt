import type { CoreService, MiscService } from '../core/tokens'
import { eventBus } from '../core/event-bus'
import { getScrollTop, isMobile, isValidDate, scrollIntoView } from '../utils'

/**
 * Miscellaneous module — site time, PWA, bookmarks, rewards, comments, and PostChat.
 *
 * Responsibilities:
 * - Display site running time with animated counters.
 * - Register service worker for PWA support.
 * - Auto-bookmark scroll position for page restoration.
 * - Initialize reward QR codes and PostChat AI user info.
 * - Initialize comment section UI and scroll-into-view.
 */
export class MiscModule implements MiscService {
  private siteTime: ReturnType<typeof setInterval> | undefined

  constructor(private readonly core: CoreService) {}

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
    document.querySelector('.site-time .hidden')?.classList.remove('hidden')
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
    const _closeRewardExclude = (id?: string | null) => {
      $rewards.forEach(($reward) => {
        const $rewardInput = $reward.parentElement!.querySelector<HTMLInputElement>('.reward-input')
        if ($rewardInput && $rewardInput.id !== id) {
          $rewardInput.checked = false
        }
      })
    }
    $rewards.forEach(($reward) => {
      $reward.previousElementSibling!.addEventListener('click', function (this: HTMLElement) {
        _closeRewardExclude(this.getAttribute('for'))
      }, false)
    })
    eventBus.on('fixit:scroll', () => _closeRewardExclude())
  }

  /** Initialize the comment section UI. */
  initComment() {
    if (!this.core.config.comment?.enable)
      return

    if (document.querySelector('#comments')) {
      const $viewCommentsBtn = document.querySelector<HTMLElement>('.view-comments')!
      $viewCommentsBtn.classList.remove('hidden')
      $viewCommentsBtn.addEventListener('click', () => {
        scrollIntoView('#comments')
      }, false)
    }

    if (this.core.config.comment.expired)
      document.querySelector('#comments')!.remove()
  }

  /**
   * Initialize PostChat and postSummary for HongMoAI
   */
  initPostChat() {
    const initThemeCompatibility = () => {
      if (this.core.config.postChat) {
        document.body.classList.toggle('dark', this.core.isDark)
        eventBus.on('fixit:switch-theme', ({ detail }) => {
          if (!detail.isChanged)
            return
          document.body.classList.toggle('dark', detail.isDark)
        })
      }
    }
    /** Initialize PostChat theme sync if configured. */
    const initPostChatUser = () => {
      if (!window.postChatUser || !window.postChatConfig || window.postChatConfig.userMode === 'magic')
        return
      window.postChat_theme = this.core.isDark ? 'dark' : 'light'
      eventBus.on('fixit:switch-theme', ({ detail }) => {
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
    initThemeCompatibility()
    initPostChatUser()
  }

  /** Initialize all miscellaneous features. */
  setup() {
    this.initSiteTime()
    this.initAutoMark()
    this.initReward()
    this.initComment()
    this.initPostChat()
  }
}
