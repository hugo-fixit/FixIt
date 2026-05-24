/**
 * ECharts integration for FixIt shortcode blocks.
 *
 * Responsibilities:
 * - Initialize ECharts instances with light/dark theme support.
 * - Re-render all charts on theme switch.
 * - Resize charts on window resize events.
 * - Re-run initialization after decrypted content is revealed.
 */
import { TypedEventBus } from '../core/event-bus'
import { getStagingDOM, isDarkMode, isObjectLiteral } from '../utils'

const eventBus = new TypedEventBus()

let echartsArr: any[] = []

function initEchartsInTarget(target: Element | Document = document) {
  const echarts = window.echarts
  const config = window.config.echarts
  if (!echarts || !config)
    return
  const isDark = isDarkMode()
  const stagingDOM = getStagingDOM()
  target.querySelectorAll('.echarts').forEach(($echarts: Element) => {
    const $dataEl = $echarts.nextElementSibling as HTMLElement
    if ($dataEl.tagName !== 'TEMPLATE')
      return
    const chart = echarts.init($echarts as HTMLElement, isDark ? 'dark' : 'light', { renderer: 'svg' })
    chart.showLoading()
    stagingDOM.stage(($dataEl as HTMLTemplateElement).content.cloneNode(true))
    const _setOption = (option: any) => {
      if (!option) {
        chart.hideLoading()
        console.warn('ECharts option is missing or invalid. Chart disposed.', {
          element: $echarts,
          option: $dataEl,
        })
        chart.dispose()
        ;($echarts as HTMLElement).removeAttribute('style')
        return
      }
      chart.hideLoading()
      chart.setOption(option)
      echartsArr.push(chart)
    }
    if ($dataEl.dataset.fmt === 'js') {
      try {
        const jsCodes = stagingDOM.contentAsText()
        // eslint-disable-next-line no-new-func
        const _getOption = new Function('fixit', 'chart', isObjectLiteral(jsCodes) ? `return ${jsCodes}` : jsCodes)
        if ($dataEl.dataset.async === 'true') {
          return Promise.resolve(_getOption(window.fixit, chart)).then((option: any) => {
            _setOption(option)
          })
        }
        return _setOption(_getOption(window.fixit, chart))
      }
      catch (err) {
        return console.error(err)
      }
    }
    _setOption(stagingDOM.contentAsJson())
  })
  stagingDOM.destroy()
}

function applyEchartsTheme() {
  const echarts = window.echarts
  const config = window.config.echarts
  if (!echarts || !config)
    return
  echarts.registerTheme('light', config.lightTheme!)
  echarts.registerTheme('dark', config.darkTheme!)
  echartsArr.forEach(chart => chart.dispose())
  echartsArr = []
  initEchartsInTarget()
}

document.addEventListener('DOMContentLoaded', () => {
  applyEchartsTheme()
  eventBus.on('fixit:switch-theme', ({ detail }) => {
    if (!detail.isChanged)
      return
    applyEchartsTheme()
  })
  eventBus.on('fixit:resize', () => {
    echartsArr.forEach(chart => chart.resize())
  })
  eventBus.on('fixit:decrypted', applyEchartsTheme)
  eventBus.on('fixit:partial-decrypted', ({ detail }) => initEchartsInTarget(detail.target))
}, false)
