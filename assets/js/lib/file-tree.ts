/**
 * File tree behavior module for FixIt content blocks.
 *
 * Responsibilities:
 * - Initialize folder expand/collapse interactions for `.file-tree` blocks.
 * - Recalculate connector line heights when tree visibility/layout changes.
 * - Sync tree state across tab switches, print preparation, and `fixit:content-decrypted` updates.
 */
import type { TabContainerChangedEvent } from '../types'
import { eventBus } from '../core/event-bus'

/**
 * Initialize file tree toggle handlers under the given root.
 * @param target - The root element or document to search within.
 */

function initFileTree(target: Element | Document = document) {
  target.querySelectorAll<HTMLElement>('.file-tree-toggle:not([data-init])').forEach((label) => {
    label.addEventListener('click', (e) => {
      e.stopPropagation()
      const item = label.closest('.file-tree-folder')
      const isCollapsed = item!.classList.contains('is-collapsed')
      item && item.classList.toggle('is-collapsed', !isCollapsed)

      const wrapper = label.closest('.file-tree-wrapper')
      updateLineHeight(wrapper as Element)
    })
    label.dataset.init = 'true'
  })
  updateLineHeight(target)
}

/**
 * Recalculate and apply the vertical connector line height for nested file trees.
 * @param target - The root element or document to search within.
 */
function updateLineHeight(target: Element | Document = document) {
  const uls = target.querySelectorAll<HTMLElement>('.file-tree .file-tree')
  uls.forEach((ul) => {
    const parentItem = ul.closest('.file-tree-item.is-collapsed')
    if (parentItem) {
      ul.style.removeProperty('--fi-file-tree-line-height')
      return
    }
    const items = Array.from(ul.children).filter(el => el.classList?.contains('file-tree-item'))
    if (!items.length) {
      ul.style.removeProperty('--fi-file-tree-line-height')
      return
    }

    const firstLabel = items[0].querySelector('.file-tree-label')
    const lastLabel = items[items.length - 1].querySelector('.file-tree-label')
    if (!firstLabel || !lastLabel)
      return

    const firstRect = firstLabel.getBoundingClientRect()
    const lastRect = lastLabel.getBoundingClientRect()

    const firstCenterY = firstRect.top + firstRect.height / 2
    const lastCenterY = lastRect.top + lastRect.height / 2
    const offsetY = firstRect.height / 2 + 1 / 2 + 4
    const height = Math.max(0, lastCenterY - firstCenterY + offsetY)

    ul.style.setProperty('--fi-file-tree-line-height', `${height}px`)
  })
}

/**
 * Expand all collapsed file tree folders.
 * @param target - The root element or document to search within.
 */
function expandAll(target: Element | Document = document) {
  target.querySelectorAll('.file-tree-folder').forEach(folder => folder.classList.remove('is-collapsed'))
  updateLineHeight(target)
}

/** Bind global events for file tree self-management. */
function bindEvents() {
  document.addEventListener('tab-container-changed', (e: TabContainerChangedEvent) => {
    const panel = e.panel || e.detail?.relatedTarget
    if (panel)
      updateLineHeight(panel)
  }, false)

  window.addEventListener('beforeprint', () => {
    if (window.config.print?.expandFileTree) {
      expandAll(document.getElementById('content')!)
    }
  }, false)

  eventBus.on('fixit:content-decrypted', ({ detail }) => {
    initFileTree(detail.target)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initFileTree()
  bindEvents()
}, false)
