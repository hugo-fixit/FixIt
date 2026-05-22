/** Comment module — Artalk, Gitalk, Twikoo, Giscus, Utterances, Valine, and Waline integrations. */
import type { TypedEventBus } from '../core/event-bus'
import type { CommentService, CoreService } from '../core/tokens'
import { scrollIntoView } from '../utils'

const Artalk = window.Artalk
const Gitalk = window.Gitalk
const lightGallery = window.lightGallery
const twikoo = window.twikoo
const Valine = window.Valine
const Waline = window.Waline

export class CommentModule implements CommentService {
  private _utterancesOnSwitchTheme: (() => void) | undefined
  private _giscusOnSwitchTheme: (() => void) | undefined
  private _messageListener: ((event: MessageEvent) => void) | undefined

  constructor(
    private readonly core: CoreService,
    private readonly bus: TypedEventBus,
  ) {}

  /**
   * Enable lightGallery on images inside comment containers.
   * @param comments - CSS selector for comment content containers.
   * @param images - CSS selector for images within those containers.
   */
  initCommentLightGallery(comments: string, images: string) {
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
  initComment() {
    if (!this.core.config.comment?.enable)
      return
    if (document.querySelector('#comments')) {
      const $viewCommentsBtn = document.querySelector<HTMLElement>('.view-comments')!
      $viewCommentsBtn.classList.remove('d-none')
      $viewCommentsBtn.addEventListener('click', () => {
        scrollIntoView('#comments')
      }, false)
    }
    this.core.config.comment.expired && document.querySelector('#comments')!.remove()
    if (this.core.config.comment.artalk) {
      if (this.core.config.comment.expired) {
        return Artalk.LoadCountWidget({
          server: this.core.config.comment.artalk.server,
          site: this.core.config.comment.artalk.site,
          pvEl: this.core.config.comment.artalk.pvEl,
          countEl: this.core.config.comment.artalk.countEl,
        })
      }
      const artalk = Artalk.init(this.core.config.comment.artalk)
      artalk.setDarkMode(this.core.isDark)
      this.bus.on('fixit:switch-theme', () => {
        artalk.setDarkMode(this.core.isDark)
      })
      artalk.on('comments-loaded', () => {
        this.core.config.comment?.artalk?.lightgallery && this.initCommentLightGallery('.atk-comment .atk-content', 'img:not([atk-emoticon])')
      })
      return artalk
    }
    if (this.core.config.comment.gitalk) {
      this.core.config.comment.gitalk.body = decodeURI(window.location.href)
      const gitalk = new Gitalk(this.core.config.comment.gitalk)
      gitalk.render('gitalk')
      return gitalk
    }
    if (this.core.config.comment.valine) {
      return new Valine(this.core.config.comment.valine)
    }
    if (this.core.config.comment.waline) {
      if (this.core.config.comment.expired) {
        this.core.config.comment.waline.pageview && Waline.pageviewCount({
          serverURL: this.core.config.comment.waline.serverURL,
          path: window.location.pathname,
        })
        return
      }
      return Waline.init(this.core.config.comment.waline)
    }
    if (this.core.config.comment.utterances) {
      const utterancesConfig = this.core.config.comment.utterances
      const script = document.createElement('script')
      script.src = 'https://utteranc.es/client.js'
      script.setAttribute('repo', utterancesConfig.repo!)
      script.setAttribute('issue-term', utterancesConfig.issueTerm!)
      if (utterancesConfig.label)
        script.setAttribute('label', utterancesConfig.label)
      script.setAttribute('theme', this.core.isDark ? utterancesConfig.darkTheme! : utterancesConfig.lightTheme!)
      script.crossOrigin = 'anonymous'
      script.async = true
      document.getElementById('utterances')!.appendChild(script)
      this._utterancesOnSwitchTheme = this._utterancesOnSwitchTheme || (() => {
        const message = {
          type: 'set-theme',
          theme: this.core.isDark ? utterancesConfig.darkTheme : utterancesConfig.lightTheme,
        }
        document.querySelector<HTMLIFrameElement>('.utterances-frame')?.contentWindow?.postMessage(message, 'https://utteranc.es')
      })
      this.bus.on('fixit:switch-theme', this._utterancesOnSwitchTheme)
      return
    }
    if (this.core.config.comment.twikoo) {
      const twikooConfig = this.core.config.comment.twikoo
      if (twikooConfig.lightgallery) {
        twikooConfig.onCommentLoaded = () => {
          this.initCommentLightGallery('.tk-comments .tk-content', 'img:not(.tk-owo-emotion)')
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
    if (this.core.config.comment.giscus) {
      const giscusConfig = this.core.config.comment.giscus
      this._giscusOnSwitchTheme = this._giscusOnSwitchTheme || (() => {
        const message = { setConfig: { theme: this.core.isDark ? giscusConfig.darkTheme : giscusConfig.lightTheme } }
        document.querySelector<HTMLIFrameElement>('.giscus-frame')?.contentWindow?.postMessage({ giscus: message }, giscusConfig.origin!)
      })
      this.bus.on('fixit:switch-theme', this._giscusOnSwitchTheme)
      this._messageListener = (event: MessageEvent) => {
        if (event.origin !== giscusConfig.origin)
          return
        const $script = document.querySelector('#giscus>script')
        if ($script) {
          $script.parentElement!.removeChild($script)
        }
        this._giscusOnSwitchTheme!()
        window.removeEventListener('message', this._messageListener!, false)
      }
      window.addEventListener('message', this._messageListener, false)
    }
  }
}
