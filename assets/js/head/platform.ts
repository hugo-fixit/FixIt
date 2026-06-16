/**
 * Platform detection — runs synchronously in `<head>` before body rendering.
 *
 * Responsibilities:
 * - Detect macOS platform from user agent.
 * - Set `data-platform` on `<html>` to enable platform-specific CSS styling.
 */
(function () {
  if (/mac/i.test(navigator.platform)) {
    document.documentElement.dataset.platform = 'mac'
  }
})()
