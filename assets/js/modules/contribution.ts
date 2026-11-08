import type { ContributionService, CoreService } from '../core/tokens'

/**
 * Contribution module — year switching and cell tooltips for contribution graphs.
 *
 * Responsibilities:
 * - Toggle the active year summary and panel from a custom year dropdown.
 * - Initialize CellTooltip on the visible year's contribution cells.
 */
export class ContributionModule implements ContributionService {
  #core: CoreService

  constructor(core: CoreService) {
    this.#core = core
  }

  /** Initialize CellTooltip on the visible year's contribution cells. */
  #initTooltips($graph: HTMLElement, year: string): void {
    if (!this.#core.config.tooltip)
      return
    const $panel = $graph.querySelector<HTMLElement>(`.contribution-year[data-year="${CSS.escape(year)}"]`)
    if (!$panel)
      return
    $panel.querySelectorAll<HTMLElement>('.contribution-cell[title]').forEach(($cell) => {
      window.CellTooltip?.getOrCreateInstance($cell, {
        placement: 'top',
        customClass: 'contribution-cell-tooltip',
        html: true,
        interactive: true,
      })
    })
  }

  /** Initialize year switching for one contribution graph. */
  #initGraph($graph: HTMLElement): void {
    const $picker = $graph.querySelector<HTMLElement>('.contribution-year-picker')
    const $trigger = $picker?.querySelector<HTMLButtonElement>('.contribution-year-trigger')
    const $menu = $picker?.querySelector<HTMLElement>('.contribution-year-menu')
    if (!$picker || !$trigger || !$menu)
      return

    const $summaries = $graph.querySelectorAll<HTMLElement>('.contribution-summary')
    const $years = $graph.querySelectorAll<HTMLElement>('.contribution-year')
    const $options = [
      ...$menu.querySelectorAll<HTMLElement>('.contribution-year-option'),
    ]
    const $value = $trigger.querySelector<HTMLElement>('.contribution-year-value')
    if (!$options.length)
      return

    const setYear = (year: string): void => {
      $summaries.forEach(($summary) => {
        $summary.classList.toggle('is-active', $summary.dataset.year === year)
      })
      $years.forEach(($year) => {
        $year.classList.toggle('is-active', $year.dataset.year === year)
      })
      $options.forEach(($option) => {
        const selected = $option.dataset.year === year
        $option.classList.toggle('is-selected', selected)
        $option.setAttribute('aria-selected', String(selected))
      })
      if ($value)
        $value.textContent = year
      this.#initTooltips($graph, year)
    }

    const selectedOption = (): HTMLElement | undefined =>
      $options.find($option => $option.classList.contains('is-selected'))

    const open = (): void => {
      $picker.classList.add('is-open')
      $trigger.setAttribute('aria-expanded', 'true')
      ;(selectedOption() ?? $options[0]).focus()
    }

    const close = (returnFocus = false): void => {
      if (!$picker.classList.contains('is-open'))
        return
      $picker.classList.remove('is-open')
      $trigger.setAttribute('aria-expanded', 'false')
      if (returnFocus)
        $trigger.focus()
    }

    const choose = ($option: HTMLElement): void => {
      const year = $option.dataset.year
      if (!year)
        return
      setYear(year)
      close(true)
    }

    $trigger.addEventListener('click', () => {
      if ($picker.classList.contains('is-open'))
        close()
      else
        open()
    }, false)

    $trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        open()
      }
    }, false)

    $options.forEach(($option, index) => {
      $option.addEventListener('click', () => choose($option), false)
      $option.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          choose($option)
        }
        else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault()
          let delta = -1
          if (e.key === 'ArrowDown')
            delta = 1
          const next = $options[(index + delta + $options.length) % $options.length]
          next?.focus()
        }
        else if (e.key === 'Home' || e.key === 'End') {
          e.preventDefault()
          let targetIndex = $options.length - 1
          if (e.key === 'Home')
            targetIndex = 0
          $options[targetIndex]?.focus()
        }
        else if (e.key === 'Escape') {
          e.preventDefault()
          close(true)
        }
        else if (e.key === 'Tab') {
          close()
        }
      }, false)
    })

    document.addEventListener('click', (e) => {
      if (!$picker.contains(e.target as Node))
        close()
    }, false)

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape')
        close(true)
    }, false)

    setYear($value?.textContent?.trim() || $options[0].dataset.year || '')
  }

  setup(): void {
    document.querySelectorAll<HTMLElement>('.contribution-graph').forEach(($graph) => {
      this.#initGraph($graph)
    })
  }
}
