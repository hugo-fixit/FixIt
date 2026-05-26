/** Comment module — Orchestrates comment section display. */
import type { CommentService, CoreService } from '../core/tokens'
import { scrollIntoView } from '../utils'

export class CommentModule implements CommentService {
  constructor(private readonly core: CoreService) {}

  /** Initialize the comment section UI. */
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

    if (this.core.config.comment.expired)
      document.querySelector('#comments')!.remove()
  }
}
