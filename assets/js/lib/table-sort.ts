/**
 * Table sort module for FixIt content blocks.
 *
 * Responsibilities:
 * - Initialize sortable tables (marked with `data-sortable` attribute).
 * - Add click handlers to `<th>` elements for ascending/descending/no-sort toggle.
 * - Support numeric, date, and string sorting.
 * - Re-initialize after content decryption events.
 */
import { eventBus } from '../core/event-bus'

type SortDirection = 'asc' | 'desc' | null

function detectValueType(value: string): 'number' | 'date' | 'string' {
  const stripped = value.replace(/[\s,%$€£¥]/g, '')
  if (stripped !== '' && !Number.isNaN(Number(stripped)))
    return 'number'
  if (/\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(value) && !Number.isNaN(Date.parse(value)))
    return 'date'
  return 'string'
}

function compareValues(a: string, b: string, direction: SortDirection): number {
  if (!direction)
    return 0
  const type = detectValueType(a)
  let result = 0

  switch (type) {
    case 'number':
      result = Number(a.replace(/[\s,%$€£¥]/g, '')) - Number(b.replace(/[\s,%$€£¥]/g, ''))
      break
    case 'date':
      result = new Date(a).getTime() - new Date(b).getTime()
      break
    default:
      result = a.localeCompare(b)
  }

  return direction === 'asc' ? result : -result
}

function nextDirection(current: SortDirection): SortDirection {
  if (current === null)
    return 'asc'
  if (current === 'asc')
    return 'desc'
  return null
}

function sortTable(table: HTMLTableElement, colIndex: number, direction: SortDirection) {
  const tbody = table.querySelector('tbody')
  if (!tbody)
    return

  const rows = Array.from(tbody.querySelectorAll('tr'))

  if (!direction) {
    rows.sort((a, b) => {
      const orderA = parseInt(a.dataset.order || '0', 10)
      const orderB = parseInt(b.dataset.order || '0', 10)
      return orderA - orderB
    })
  }
  else {
    rows.sort((a, b) => {
      const cellA = a.children[colIndex]?.textContent?.trim() || ''
      const cellB = b.children[colIndex]?.textContent?.trim() || ''
      return compareValues(cellA, cellB, direction)
    })
  }

  rows.forEach(row => tbody.appendChild(row))
}

function updateSortIndicators(table: HTMLTableElement, colIndex: number, direction: SortDirection) {
  table.querySelectorAll('th').forEach((th, i) => {
    th.classList.remove('sort-asc', 'sort-desc')
    if (i === colIndex && direction) {
      th.classList.add(direction === 'asc' ? 'sort-asc' : 'sort-desc')
    }
  })
}

function initSortableTable(table: HTMLTableElement) {
  if (table.dataset.sortInit)
    return
  table.dataset.sortInit = 'true'

  const tbody = table.querySelector('tbody')
  if (tbody) {
    Array.from(tbody.querySelectorAll('tr')).forEach((row, i) => {
      row.dataset.order = String(i)
    })
  }

  table.classList.add('is-sortable')

  const headers = table.querySelectorAll('thead th')
  headers.forEach((th, index) => {
    th.classList.add('sort-header')
    th.setAttribute('role', 'button')
    th.setAttribute('tabindex', '0')
    th.setAttribute('aria-sort', 'none')

    const handleClick = () => {
      const currentDir = (table.dataset.sortDir === 'asc' && table.dataset.sortCol === String(index))
        ? 'asc'
        : (table.dataset.sortDir === 'desc' && table.dataset.sortCol === String(index))
            ? 'desc'
            : null

      const newDir = nextDirection(currentDir)

      if (newDir) {
        table.dataset.sortCol = String(index)
        table.dataset.sortDir = newDir
        th.setAttribute('aria-sort', newDir === 'asc' ? 'ascending' : 'descending')
      }
      else {
        delete table.dataset.sortCol
        delete table.dataset.sortDir
        th.setAttribute('aria-sort', 'none')
      }

      sortTable(table, index, newDir)
      updateSortIndicators(table, index, newDir)
    }

    th.addEventListener('click', handleClick, false)
    th.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
        e.preventDefault()
        handleClick()
      }
    }, false)
  })
}

function initTableSort(target: Element | Document = document) {
  target.querySelectorAll<HTMLTableElement>('table[data-sortable]:not([data-sort-init])')
    .forEach(initSortableTable)
}

function bindEvents() {
  eventBus.on('fixit:content-decrypted', ({ detail }) => {
    initTableSort(detail.target)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initTableSort()
  bindEvents()
}, false)
