/**
 * Gitalk comment system integration for FixIt.
 *
 * Responsibilities:
 * - Initialize Gitalk with configured settings
 * - Render Gitalk container
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.config.comment?.gitalk || !window.Gitalk)
    return

  const gitalkConfig = window.config.comment.gitalk
  gitalkConfig.body = decodeURI(window.location.href)
  const gitalk = new window.Gitalk(gitalkConfig)
  gitalk.render('gitalk')
}, false)
