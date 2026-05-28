/**
 * Valine comment system integration for FixIt.
 *
 * Responsibilities:
 * - Initialize Valine with configured settings
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.config.comment?.valine || !window.Valine)
    return

  void new window.Valine(window.config.comment.valine)
}, false)
