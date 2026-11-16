import { t } from '../../i18n'

const CellTooltip = window.CellTooltip

/** Footnote refs that already have touch preview handlers. */
const touchPreviewRefs = new WeakSet<HTMLElement>()

/** The footnote details element currently attached to the document. */
let activeFootnoteDetails: HTMLDetailsElement | undefined

/**
 * Build a static preview of a footnote for its tooltip.
 *
 * Code block controls only work in the initialized footnote list, and cloned
 * nodes do not carry their listeners, so strip that chrome and keep a
 * read-only rendering. Full interactions remain available by clicking the
 * reference to jump to the footnote.
 * @param footnote - The footnote item element.
 * @returns Preview HTML and its plain-text fallback.
 */
function createFootnotePreview(footnote: HTMLElement): { html: string, text: string } {
  const $preview = footnote.cloneNode(true) as HTMLElement
  $preview.querySelectorAll('.footnote-backref').forEach($backref => $backref.remove())

  // Code block chrome is inert in a cloned tooltip, so drop it.
  $preview.querySelectorAll('.code-header, .code-expand-btn, .copy-icon-btn').forEach($el => $el.remove())
  // Line numbers are CSS counters; hide them in the compact preview.
  $preview.querySelectorAll('.code-block').forEach($el => $el.classList.add('line-nos-hidden'))

  // Line-number tables do not fit the narrow tooltip; keep only the code cell.
  $preview.querySelectorAll('table.lntable').forEach(($table) => {
    const $pre = $table.querySelector('td:last-child pre')
    if ($pre)
      $table.replaceWith($pre)
    else
      $table.remove()
  })

  // A tooltip cannot switch tabs; keep the active code block only.
  $preview.querySelectorAll('.code-tabs').forEach(($tabs) => {
    const $code = $tabs.querySelector('.code-block.active') || $tabs.querySelector('.code-block')
    if ($code)
      $tabs.replaceWith($code)
    else
      $tabs.remove()
  })

  // Drop runtime state copied from the initialized footnote and IDs that
  // would duplicate anchors in the document.
  $preview.querySelectorAll('[data-init], [data-tab-init]').forEach(($el) => {
    $el.removeAttribute('data-init')
    $el.removeAttribute('data-tab-init')
  })
  $preview.querySelectorAll('[id]').forEach($el => $el.removeAttribute('id'))

  return {
    // The `single` class on the tooltip lets `.single .content` styles apply.
    html: `<div class="content">${$preview.innerHTML.trim()}</div>`,
    text: $preview.textContent!.trim(),
  }
}

/**
 * Preview footnote content on touch devices before following the link.
 *
 * The hover trigger shows the tooltip on `touchstart`, but the anchor click
 * still navigates immediately. Keep the first tap on the preview and let a
 * second tap follow the reference to the footnote.
 * @param ref - The footnote reference element.
 */
function initFootnoteTouchPreview(ref: HTMLElement) {
  if (!CellTooltip || !navigator.maxTouchPoints || touchPreviewRefs.has(ref))
    return
  touchPreviewRefs.add(ref)
  let pointerType = ''
  let tooltipWasOpen = false
  ref.addEventListener('pointerdown', (event) => {
    pointerType = event.pointerType
    tooltipWasOpen = CellTooltip.getInstance(ref)?.tip?.classList.contains('show') ?? false
  }, { passive: true })
  ref.addEventListener('click', (event) => {
    const type = pointerType
    pointerType = ''
    // Mouse clicks and keyboard activation keep the default navigation.
    if (event.detail === 0 || (type !== 'touch' && type !== 'pen'))
      return
    const tooltip = CellTooltip.getInstance(ref)
    tooltip?.clearTimer()
    if (tooltipWasOpen) {
      tooltip?.hide()
      return
    }
    event.preventDefault()
    tooltip?.show()
  })
}

/**
 * Add a collapse/expand toggle to the footnote section.
 *
 * The section starts expanded and collapses to its summary. Following a
 * footnote reference or opening a `#fn:` hash expands it automatically.
 */
export function initFootnoteSection() {
  const $footnotes = document.querySelector<HTMLElement>('.footnotes[role="doc-endnotes"]')
  const $list = $footnotes?.querySelector<HTMLOListElement>('ol')
  if (!$footnotes || !$list)
    return

  const updateCount = ($details: HTMLElement) => {
    const count = $list.children.length
    const $summary = $details.querySelector<HTMLElement>('.footnotes-summary')
    const $count = $details.querySelector<HTMLElement>('.footnotes-count')
    if ($count)
      $count.textContent = String(count)
    $summary?.setAttribute('aria-label', `${t('footnotes')} (${count})`)
  }

  const $existingDetails = $footnotes.querySelector<HTMLDetailsElement>('.footnotes-details')
  if ($existingDetails) {
    // Re-initialization (e.g. after decryption) may add footnotes.
    updateCount($existingDetails)
    activeFootnoteDetails = $existingDetails
    return
  }

  // Collapsed by default; footnote references and `#fn:` hashes expand it.
  const $details = document.createElement('details')
  $details.className = 'footnotes-details'

  const $summary = document.createElement('summary')
  $summary.className = 'footnotes-summary'
  $summary.setAttribute('aria-label', `${t('footnotes')} (${$list.children.length})`)
  const $icon = document.createElement('i')
  $icon.className = 'fa-solid fa-list-ol footnotes-icon'
  $icon.setAttribute('aria-hidden', 'true')
  const $title = document.createElement('span')
  $title.className = 'footnotes-title'
  $title.textContent = t('footnotes')
  const $count = document.createElement('sup')
  $count.className = 'footnotes-count'
  $count.textContent = String($list.children.length)
  const $chevron = document.createElement('i')
  $chevron.className = 'fa-solid fa-angle-right footnotes-chevron'
  $chevron.setAttribute('aria-hidden', 'true')
  $summary.append($icon, $title, $count, $chevron)
  $details.append($summary, $list)

  const $hr = $footnotes.querySelector('hr')
  if ($hr)
    $hr.replaceWith($details)
  else
    $footnotes.prepend($details)
  activeFootnoteDetails = $details

  const openForTarget = () => {
    if (activeFootnoteDetails !== $details || !$details.isConnected || !location.hash.startsWith('#fn:'))
      return
    $details.open = true
    requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView())
  }
  window.addEventListener('hashchange', openForTarget)
  openForTarget()

  // Expand before following a reference so the browser can scroll to it.
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || activeFootnoteDetails !== $details || !$details.isConnected)
      return
    if (event.target instanceof Element && event.target.closest('sup[id^="fnref"] a'))
      $details.open = true
  }, { passive: true })

  window.addEventListener('beforeprint', () => {
    if (activeFootnoteDetails === $details && $details.isConnected)
      $details.open = true
  })
}

/** Convert footnote refs into tooltip-enabled elements. */
export function initFootnoteTooltips() {
  const $footnoteRefs = document.querySelectorAll<HTMLElement>('#content sup[id^="fnref"]')
  const $footnotes = document.querySelector<HTMLElement>('.footnotes[role="doc-endnotes"]')
  if (!$footnoteRefs.length || !$footnotes)
    return
  const footnoteMap = new Map<HTMLElement, { html: string, text: string }>()
  $footnoteRefs.forEach(($ref) => {
    // Extra references to the same footnote use `fnref1:1`, `fnref2:1`, etc.
    const id = $ref.id.replace(/^fnref\d*:/, '')
    const $footnoteContent = $footnotes.querySelector<HTMLElement>(`[id="fn:${id}"]`)
    if (!$footnoteContent)
      return
    footnoteMap.set($ref, createFootnotePreview($footnoteContent))
  })
  footnoteMap.forEach(({ html, text }, $ref) => {
    if (CellTooltip) {
      // Keep the footnote markup and reuse page content styles in the tooltip.
      const tooltip = CellTooltip.getOrCreateInstance($ref, {
        title: html,
        html: true,
        interactive: true,
        customClass: 'cell-tooltip-footnote single',
      })
      // Refresh the preview when re-initializing an existing reference.
      tooltip.setTitle?.(html)
      initFootnoteTouchPreview($ref)
      return
    }
    if (!$ref.hasAttribute('title'))
      $ref.setAttribute('title', text)
  })
}

/**
 * Initialize the footnote section toggle and, when enabled, footnote tooltips.
 * @param withTooltips - Whether footnote tooltips are enabled.
 */
export function initFootnotes(withTooltips = true) {
  initFootnoteSection()
  if (withTooltips)
    initFootnoteTooltips()
}
