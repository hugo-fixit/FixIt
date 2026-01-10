/**
 * FileTree class to handle file tree interactions
 */
export default class FileTree {
  init(target = document) {
    target.querySelectorAll('.file-tree-toggle:not([data-init])').forEach((label) => {
      label.addEventListener('click', (e) => {
        e.stopPropagation()
        const item = label.closest('.file-tree-folder')
        const isCollapsed = item.classList.contains('is-collapsed')
        item && item.classList.toggle('is-collapsed', !isCollapsed)

        const wrapper = label.closest('.file-tree-wrapper')
        this.updateLineHeight(wrapper)
      })
      label.dataset.init = 'true'
    })
    this.updateLineHeight(target)
  }

  updateLineHeight(target = document) {
    const uls = target.querySelectorAll('.file-tree .file-tree')
    uls.forEach((ul) => {
      const parentItem = ul.closest('.file-tree-item.is-collapsed')
      if (parentItem) {
        ul.style.removeProperty('--fi-file-tree-line-height')
        return
      }
      const items = Array.from(ul.children).filter((el) => el.classList?.contains('file-tree-item'))
      if (!items.length) {
        ul.style.removeProperty('--fi-file-tree-line-height')
        return
      }

      const firstLabel = items[0].querySelector('.file-tree-label')
      const lastLabel = items[items.length - 1].querySelector('.file-tree-label')
      if (!firstLabel || !lastLabel) return

      const firstRect = firstLabel.getBoundingClientRect()
      const lastRect = lastLabel.getBoundingClientRect()

      const firstCenterY = firstRect.top + firstRect.height / 2
      const lastCenterY = lastRect.top + lastRect.height / 2
      const offsetY = firstRect.height / 2 + 1/2 + 4 
      const height = Math.max(0, lastCenterY - firstCenterY + offsetY)

      ul.style.setProperty('--fi-file-tree-line-height', `${height}px`)
    })
  }
}
