/**
 * Watermark integration for FixIt.
 *
 * Responsibilities:
 * - Initialize watermark overlay when configured.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.config.watermark?.enable && window.Watermark)
    void new window.Watermark!(window.config.watermark)
}, false)
