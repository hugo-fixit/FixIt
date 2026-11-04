import { isValidDate, padNumber } from '../../utils'

const DAY_MS = 86_400_000
const DAY_SECONDS = 86_400

/**
 * Start the footer site running-time counter.
 *
 * Writes the localized day count at most once per day, and keeps the sub-day
 * duration in a CellTooltip refreshed on demand.
 * @param launch - The site launch date string.
 */
export function initSiteTimeCounter(launch: string): void {
  const $siteTime = document.querySelector<HTMLElement>('.site-time')
  const $value = $siteTime?.querySelector<HTMLElement>('.run-times')
  const launchDate = new Date(launch)
  if (!isValidDate(launchDate) || !$siteTime || !$value) {
    $siteTime?.closest('.footer-line.statistics')?.remove()
    return
  }

  const launchTime = launchDate.getTime()
  const locale = document.documentElement.lang || 'en'
  const dayFormat = new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: 'day',
    unitDisplay: 'long',
  })
  const DurationFormat = Intl.DurationFormat
  const durationFormat = typeof DurationFormat === 'function'
    ? new DurationFormat(locale, { style: 'short' })
    : undefined
  let timer: ReturnType<typeof setTimeout> | undefined

  const elapsed = () => Math.max(0, Math.floor((Date.now() - launchTime) / 1000))

  const tick = () => {
    const days = Math.floor(elapsed() / DAY_SECONDS)
    const text = dayFormat.format(days)
    if ($value.textContent !== text)
      $value.textContent = text
    clearTimeout(timer)
    const delay = Math.min(Math.max(launchTime + (days + 1) * DAY_MS - Date.now(), 1000), DAY_MS)
    timer = setTimeout(tick, delay)
  }

  const formatTitle = () => {
    const remainder = elapsed() % DAY_SECONDS
    const hours = Math.floor(remainder / 3600)
    const minutes = Math.floor((remainder % 3600) / 60)
    const seconds = remainder % 60
    return durationFormat
      ? durationFormat.format({ hours, minutes, seconds })
      : `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`
  }

  $siteTime.querySelector('.site-time-pre')?.classList.remove('hidden')
  window.CellTooltip?.getOrCreateInstance($siteTime, { title: formatTitle })
  document.addEventListener('visibilitychange', () => {
    if (document.hidden)
      clearTimeout(timer)
    else
      tick()
  })
  tick()
}
