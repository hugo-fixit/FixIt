/** Miscellaneous module — cookie consent, site time, PWA, watermark, MathJax, bookmarks, and rewards. */
import type { FixItContext } from '../types'
import { forEach, getScrollTop, isMobile, isValidDate } from '../utils'

const cookieconsent = window.cookieconsent
const pangu = window.pangu
const Watermark = window.Watermark

/**
 * Create miscellaneous feature handlers (cookie consent, site time, PWA, watermark, etc.).
 * @param ctx - The shared FixIt context object.
 * @returns Miscellaneous feature initialization methods.
 */
export function createMisc(ctx: FixItContext) {
  let siteTime: ReturnType<typeof setInterval> | undefined

  /** Initialize cookie consent banner if configured. */
  function initCookieconsent() {
    ctx.config.cookieconsent && cookieconsent?.initialise(ctx.config.cookieconsent)
  }

  /** Calculate and display the elapsed time since site launch. */
  function getSiteTime() {
    const now = new Date()
    const run = new Date(ctx.config.siteTime!)
    const $runTimes = document.querySelector<HTMLElement>('.run-times')
    if (!isValidDate(run) || !$runTimes) {
      clearInterval(siteTime)
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
  function initSiteTime() {
    if (ctx.config.siteTime) {
      siteTime = setInterval(getSiteTime, 500)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          return clearInterval(siteTime)
        }
        siteTime = setInterval(getSiteTime, 500)
      }, false)
    }
  }

  /** Register the service worker for PWA support. */
  function initServiceWorker() {
    if (ctx.config.enablePWA && 'serviceWorker' in navigator) {
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
  function initWatermark() {
    if (!ctx.config.watermark?.enable)
      return
    void new Watermark(ctx.config.watermark)
  }

  /** Initialize Pangu.js for automatic CJK spacing. */
  function initPangu() {
    if (!ctx.config.pangu?.enable)
      return
    pangu.ignoredTags = /^(script|code|pre|textarea|sup|sub)$/i
    const selector = ctx.config.pangu.selector
    if (selector) {
      document.querySelectorAll(selector).forEach(el => pangu.spacingNode(el))
      return
    }
    pangu.autoSpacingPage()
  }

  /** Trigger MathJax re-typesetting if MathJax is loaded. */
  function initMathJax() {
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise().then(() => {
        // Do something else after typesetting is complete
      }).catch((err: Error) => console.warn(err.message))
    }
  }

  /** Save and restore scroll position as an automatic bookmark. */
  function initAutoMark() {
    if (!ctx.config.autoBookmark)
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
  function initReward() {
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
  function initPostChatUser() {
    if (!window.postChatUser || !window.postChatConfig || window.postChatConfig.userMode === 'magic')
      return
    window.postChat_theme = ctx.isDark ? 'dark' : 'light'
    document.addEventListener('fixit:switch-theme', () => {
      const targetFrame = document.getElementById('postChat_iframeContainer')
      if (targetFrame) {
        window.postChatUser.setPostChatTheme(ctx.isDark ? 'dark' : 'light')
      }
      else {
        window.postChat_theme = ctx.isDark ? 'dark' : 'light'
      }
    })
  }

  return {
    initCookieconsent,
    getSiteTime,
    initSiteTime,
    initServiceWorker,
    initWatermark,
    initPangu,
    initMathJax,
    initAutoMark,
    initReward,
    initPostChatUser,
  }
}
