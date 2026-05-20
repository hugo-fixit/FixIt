/** Comment module — Artalk, Gitalk, Twikoo, Giscus, Utterances, Valine, and Waline integrations. */
import type { FixItContext } from '../types'
import { scrollIntoView } from '../utils'

const Artalk = window.Artalk
const Gitalk = window.Gitalk
const lightGallery = window.lightGallery
const twikoo = window.twikoo
const Valine = window.Valine
const Waline = window.Waline

/**
 * Create comment system integration handlers (Artalk, Gitalk, Twikoo, etc.).
 * @param ctx - The shared FixIt context object.
 * @returns Comment initialization methods.
 */
export function createComment(ctx: FixItContext) {
  let _utterancesOnSwitchTheme: (() => void) | undefined
  let _giscusOnSwitchTheme: (() => void) | undefined
  let _messageListener: ((event: MessageEvent) => void) | undefined

  /**
   * Enable lightGallery on images inside comment containers.
   * @param comments - CSS selector for comment content containers.
   * @param images - CSS selector for images within those containers.
   */
  function initCommentLightGallery(comments: string, images: string) {
    document.querySelectorAll<HTMLElement>(comments).forEach(($content) => {
      const $imgs = $content.querySelectorAll<HTMLImageElement>(`${images}:not([lightgallery-loaded])`)
      $imgs.forEach(($img) => {
        $img.setAttribute('lightgallery-loaded', '')
        const $link = document.createElement('a')
        $link.setAttribute('class', 'comment-lightgallery')
        $link.setAttribute('href', $img.src)
        $link.append($img.cloneNode())
        $img.replaceWith($link)
      })
      if ($imgs.length) {
        lightGallery($content, {
          selector: '.comment-lightgallery',
          actualSize: false,
          hideBarsDelay: 2000,
          speed: 400,
        })
      }
    })
  }

  /** Initialize the configured comment system and its theme sync. */
  function initComment() {
    if (!ctx.config.comment?.enable)
      return
    if (document.querySelector('#comments')) {
      const $viewCommentsBtn = document.querySelector<HTMLElement>('.view-comments')!
      $viewCommentsBtn.classList.remove('d-none')
      $viewCommentsBtn.addEventListener('click', () => {
        scrollIntoView('#comments')
      }, false)
    }
    ctx.config.comment.expired && document.querySelector('#comments')!.remove()
    if (ctx.config.comment.artalk) {
      if (ctx.config.comment.expired) {
        return Artalk.LoadCountWidget({
          server: ctx.config.comment.artalk.server,
          site: ctx.config.comment.artalk.site,
          pvEl: ctx.config.comment.artalk.pvEl,
          countEl: ctx.config.comment.artalk.countEl,
        })
      }
      const artalk = Artalk.init(ctx.config.comment.artalk)
      artalk.setDarkMode(ctx.isDark)
      document.addEventListener('fixit:switch-theme', () => {
        artalk.setDarkMode(ctx.isDark)
      })
      artalk.on('comments-loaded', () => {
        ctx.config.comment?.artalk?.lightgallery && initCommentLightGallery('.atk-comment .atk-content', 'img:not([atk-emoticon])')
      })
      return artalk
    }
    if (ctx.config.comment.gitalk) {
      ctx.config.comment.gitalk.body = decodeURI(window.location.href)
      const gitalk = new Gitalk(ctx.config.comment.gitalk)
      gitalk.render('gitalk')
      return gitalk
    }
    if (ctx.config.comment.valine) {
      return new Valine(ctx.config.comment.valine)
    }
    if (ctx.config.comment.waline) {
      if (ctx.config.comment.expired) {
        ctx.config.comment.waline.pageview && Waline.pageviewCount({
          serverURL: ctx.config.comment.waline.serverURL,
          path: window.location.pathname,
        })
        return
      }
      return Waline.init(ctx.config.comment.waline)
    }
    if (ctx.config.comment.utterances) {
      const utterancesConfig = ctx.config.comment.utterances
      const script = document.createElement('script')
      script.src = 'https://utteranc.es/client.js'
      script.setAttribute('repo', utterancesConfig.repo!)
      script.setAttribute('issue-term', utterancesConfig.issueTerm!)
      if (utterancesConfig.label)
        script.setAttribute('label', utterancesConfig.label)
      script.setAttribute('theme', ctx.isDark ? utterancesConfig.darkTheme! : utterancesConfig.lightTheme!)
      script.crossOrigin = 'anonymous'
      script.async = true
      document.getElementById('utterances')!.appendChild(script)
      _utterancesOnSwitchTheme = _utterancesOnSwitchTheme || (() => {
        const message = {
          type: 'set-theme',
          theme: ctx.isDark ? utterancesConfig.darkTheme : utterancesConfig.lightTheme,
        }
        document.querySelector<HTMLIFrameElement>('.utterances-frame')?.contentWindow?.postMessage(message, 'https://utteranc.es')
      })
      document.addEventListener('fixit:switch-theme', _utterancesOnSwitchTheme)
      return
    }
    if (ctx.config.comment.twikoo) {
      const twikooConfig = ctx.config.comment.twikoo
      if (twikooConfig.lightgallery) {
        twikooConfig.onCommentLoaded = () => {
          initCommentLightGallery('.tk-comments .tk-content', 'img:not(.tk-owo-emotion)')
        }
      }
      twikoo.init(twikooConfig)
      if (twikooConfig.commentCount) {
        twikoo
          .getCommentsCount({
            envId: twikooConfig.envId,
            region: twikooConfig.region,
            urls: [window.location.pathname],
            includeReply: false,
          })
          .then((response: Array<{ count: number }>) => {
            const twikooCommentCount = document.getElementById('twikoo-comment-count')
            if (twikooCommentCount)
              twikooCommentCount.innerHTML = String(response[0].count)
          })
      }
      return
    }
    if (ctx.config.comment.giscus) {
      const giscusConfig = ctx.config.comment.giscus
      _giscusOnSwitchTheme = _giscusOnSwitchTheme || (() => {
        const message = { setConfig: { theme: ctx.isDark ? giscusConfig.darkTheme : giscusConfig.lightTheme } }
        document.querySelector<HTMLIFrameElement>('.giscus-frame')?.contentWindow?.postMessage({ giscus: message }, giscusConfig.origin!)
      })
      document.addEventListener('fixit:switch-theme', _giscusOnSwitchTheme)
      _messageListener = (event: MessageEvent) => {
        if (event.origin !== giscusConfig.origin)
          return
        const $script = document.querySelector('#giscus>script')
        if ($script) {
          $script.parentElement!.removeChild($script)
        }
        _giscusOnSwitchTheme!()
        window.removeEventListener('message', _messageListener!, false)
      }
      window.addEventListener('message', _messageListener, false)
    }
  }

  return { initCommentLightGallery, initComment }
}
