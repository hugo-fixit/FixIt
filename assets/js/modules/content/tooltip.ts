const CellTooltip = window.CellTooltip

/**
 * Initialize CellTooltip on content action buttons and title-based elements.
 * @param isRTL - Whether the site uses a right-to-left layout.
 */
export function initContentTooltips(isRTL: boolean) {
  if (!CellTooltip)
    return
  const inlineEnd = isRTL ? 'left' : 'right'
  CellTooltip.initAll('li[data-task] > span[title]', { placement: inlineEnd })
  CellTooltip.initAll('.action-btn[title]', { placement: 'bottom' })
  CellTooltip.initAll('.copy-icon-btn[title]', { placement: 'top' })
  CellTooltip.initAll('.fixit-encryptor-btn[title]')
  CellTooltip.initAll('.collection-sort-toggle[title]', { placement: 'bottom' })
  CellTooltip.initAll('.friend-links[data-scheme="mahjong"] > .friend-link[title]', { placement: 'bottom' })
}
