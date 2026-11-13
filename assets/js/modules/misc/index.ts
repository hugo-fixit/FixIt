import type { CoreService, MiscService } from '../../core/tokens'
import { eventBus } from '../../core/event-bus'
import { getScrollTop, isMobile, scrollIntoView } from '../../utils'
import { initSiteTimeCounter } from './site-time'

/**
 * Miscellaneous module — site time, PWA, bookmarks, rewards, comments, and PostChat.
 *
 * Responsibilities:
 * - Display the site running time as a localized day count.
 * - Register service worker for PWA support.
 * - Auto-bookmark scroll position for page restoration.
 * - Initialize reward QR codes and PostChat AI user info.
 * - Initialize comment section UI and scroll-into-view.
 */
export class MiscModule implements MiscService {
  #core: CoreService

  constructor(core: CoreService) {
    this.#core = core
  }

  /** Initialize the site-time counter. */
  initSiteTime() {
    if (this.#core.config.siteTime)
      initSiteTimeCounter(this.#core.config.siteTime)
  }

  /** Save and restore scroll position as an automatic bookmark. */
  initAutoMark() {
    if (!this.#core.config.autoBookmark)
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
      $reward.previousElementSibling?.addEventListener('click', function (this: HTMLElement) {
        _closeRewardExclude(this.getAttribute('for'))
      }, false)
    })
    eventBus.on('fixit:scroll', () => _closeRewardExclude())
  }

  /** Initialize the comment section UI. */
  initComment() {
    if (!this.#core.config.comment?.enable)
      return

    const $comments = document.querySelector<HTMLElement>('#comments')
    if ($comments) {
      const $viewCommentsBtn = document.querySelector<HTMLElement>('.view-comments')
      if ($viewCommentsBtn) {
        $viewCommentsBtn.classList.remove('hidden')
        $viewCommentsBtn.addEventListener('click', () => {
          scrollIntoView('#comments')
        }, false)
      }
    }

    if (this.#core.config.comment.expired)
      $comments?.remove()
  }

  /**
   * Initialize PostChat and postSummary for HongMoAI
   */
  initPostChat() {
    const initThemeCompatibility = () => {
      if (this.#core.config.postChat) {
        document.body.classList.toggle('dark', this.#core.isDark)
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
      window.postChat_theme = this.#core.isDark ? 'dark' : 'light'
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
