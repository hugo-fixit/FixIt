/** Initialize collection sort toggle buttons. */
export function initCollectionSort() {
  document.querySelectorAll<HTMLButtonElement>('.collection-sort-toggle').forEach(($btn) => {
    if ($btn.dataset.init)
      return
    $btn.dataset.init = 'true'

    const $details = $btn.closest('.collection-details')
    const $list = $details?.querySelector<HTMLUListElement>('.collection-list')
    const $nav = $details?.querySelector<HTMLElement>('.collection-nav-simple')
    if (!$list || !$nav)
      return

    let isAsc = true

    $btn.addEventListener('click', (e) => {
      e.stopPropagation()
      isAsc = !isAsc

      // Reverse list items
      Array.from($list.children).reverse().forEach(el => $list.appendChild(el))

      // Toggle icon
      const $icon = $btn.querySelector<HTMLElement>('i')
      if ($icon) {
        $icon.classList.toggle('fa-arrow-down-wide-short', !isAsc)
        $icon.classList.toggle('fa-arrow-up-short-wide', isAsc)
      }

      // Find active item and update nav from its siblings
      const $items = Array.from($list.children)
      const $active = $list.querySelector('.active')
      const activeIdx = $active
        ? $items.indexOf($active.closest('li')!)
        : -1

      // Update counter
      const $counter = $nav.querySelector<HTMLElement>('.text-secondary:not(.collection-nav-item)')
      if ($counter && activeIdx >= 0) {
        $counter.textContent = `${activeIdx + 1}/${$items.length}`
      }

      // Update prev link (left arrow)
      const $navItems = $nav.querySelectorAll<HTMLElement>('.collection-nav-item')
      const $prevItem = activeIdx > 0
        ? $items[activeIdx - 1].querySelector('a')
        : null
      if ($navItems[0]) {
        if ($prevItem) {
          const $link = document.createElement('a')
          $link.href = $prevItem.href
          $link.className = 'collection-nav-item'
          $link.rel = 'prev'
          $link.title = $prevItem.title || ''
          const $i = document.createElement('i')
          $i.className = 'fa-solid fa-angle-left'
          $link.appendChild($i)
          $navItems[0].replaceWith($link)
        }
        else {
          const $i = document.createElement('i')
          $i.className = 'fa-solid fa-angle-left collection-nav-item text-secondary'
          $navItems[0].replaceWith($i)
        }
      }

      // Update next link (right arrow)
      const $nextItem = activeIdx >= 0 && activeIdx < $items.length - 1
        ? $items[activeIdx + 1].querySelector('a')
        : null
      if ($navItems[1]) {
        if ($nextItem) {
          const $link = document.createElement('a')
          $link.href = $nextItem.href
          $link.className = 'collection-nav-item'
          $link.rel = 'next'
          $link.title = $nextItem.title || ''
          const $i = document.createElement('i')
          $i.className = 'fa-solid fa-angle-right'
          $link.appendChild($i)
          $navItems[1].replaceWith($link)
        }
        else {
          const $i = document.createElement('i')
          $i.className = 'fa-solid fa-angle-right collection-nav-item text-secondary'
          $navItems[1].replaceWith($i)
        }
      }
    }, false)
  })
}
