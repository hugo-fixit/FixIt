/** Charts module — ECharts, Mapbox GL, and TypeIt integrations. */
import type { TypedEventBus } from '../core/event-bus'
import type { ChartsService, CoreService } from '../core/tokens'
import { forEach, getStagingDOM, isObjectLiteral } from '../utils'

const echarts = window.echarts
const mapboxgl = window.mapboxgl
const MapboxLanguage = window.MapboxLanguage
const TypeIt = window.TypeIt

export class ChartsModule implements ChartsService {
  private _echartsOnSwitchTheme: (() => void) | undefined
  private _echartsArr: any[] = []
  private _echartsOnResize: (() => void) | undefined
  private readonly _mapboxArr: any[] = []
  private _mapboxOnSwitchTheme: (() => void) | undefined

  constructor(
    private readonly core: CoreService,
    private readonly bus: TypedEventBus,
  ) {}

  /** Initialize ECharts instances from shortcode markup with theme sync. */
  initEcharts() {
    if (!this.core.config.echarts)
      return
    echarts.registerTheme('light', this.core.config.echarts.lightTheme!)
    echarts.registerTheme('dark', this.core.config.echarts.darkTheme!)
    this._echartsOnSwitchTheme = this._echartsOnSwitchTheme || (() => {
      for (let i = 0; i < this._echartsArr.length; i++) {
        this._echartsArr[i].dispose()
      }
      this._echartsArr = []
      const stagingDOM = getStagingDOM()
      forEach(document.getElementsByClassName('echarts'), ($echarts: Element) => {
        const $dataEl = $echarts.nextElementSibling as HTMLElement
        if ($dataEl.tagName !== 'TEMPLATE')
          return
        const chart = echarts.init($echarts as HTMLElement, this.core.isDark ? 'dark' : 'light', { renderer: 'svg' })
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
          this._echartsArr.push(chart)
        }
        // support JS object literal or JS code
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
        // support JSON
        _setOption(stagingDOM.contentAsJson())
      })
      stagingDOM.destroy()
    })
    this.bus.on('fixit:switch-theme', this._echartsOnSwitchTheme)
    this._echartsOnSwitchTheme()
    this._echartsOnResize = this._echartsOnResize || (() => {
      for (let i = 0; i < this._echartsArr.length; i++) {
        this._echartsArr[i].resize()
      }
    })
    this.bus.on('fixit:resize', this._echartsOnResize)
  }

  /** Initialize Mapbox GL maps with controls and theme sync. */
  initMapbox() {
    if (this.core.config.mapbox) {
      if (!mapboxgl.accessToken) {
        mapboxgl.accessToken = this.core.config.mapbox.accessToken!
        mapboxgl.setRTLTextPlugin(this.core.config.mapbox.RTLTextPlugin!)
      }
      forEach(document.querySelectorAll<HTMLElement>('.mapbox:empty'), ($mapbox) => {
        const { lng, lat, zoom, lightStyle, darkStyle, marked, markers, navigation, geolocate, scale, fullscreen } = JSON.parse($mapbox.dataset.options!)
        const mapbox = new mapboxgl.Map({
          container: $mapbox,
          center: [lng, lat],
          zoom,
          minZoom: 0.2,
          style: this.core.isDark ? darkStyle : lightStyle,
          attributionControl: false,
        })
        if (marked) {
          new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapbox)
        }
        const markerArray = typeof markers === 'string' ? JSON.parse(markers) : markers
        if (Array.isArray(markerArray) && markerArray.length > 0) {
          markerArray.forEach((marker: any) => {
            const { lng: markerLng, lat: markerLat, description } = marker
            const popup = new mapboxgl.Popup({ offset: 25 }).setText(description)
            new mapboxgl.Marker()
              .setLngLat([markerLng, markerLat])
              .setPopup(popup)
              .addTo(mapbox)
          })
        }
        if (navigation) {
          mapbox.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
        }
        if (geolocate) {
          mapbox.addControl(
            new mapboxgl.GeolocateControl({
              positionOptions: { enableHighAccuracy: true },
              showUserLocation: true,
              trackUserLocation: true,
            }),
            'bottom-right',
          )
        }
        if (scale) {
          mapbox.addControl(new mapboxgl.ScaleControl())
        }
        if (fullscreen) {
          mapbox.addControl(new mapboxgl.FullscreenControl())
        }
        mapbox.addControl(new MapboxLanguage())
        this._mapboxArr.push(mapbox)
      })
      this._mapboxOnSwitchTheme = this._mapboxOnSwitchTheme || (() => {
        forEach(this._mapboxArr, (mapbox: any) => {
          const $mapbox = mapbox.getContainer()
          const { lightStyle, darkStyle } = JSON.parse($mapbox.dataset.options)
          mapbox.setStyle(this.core.isDark ? darkStyle : lightStyle)
          mapbox.addControl(new MapboxLanguage())
        })
      })
      this.bus.on('fixit:switch-theme', this._mapboxOnSwitchTheme)
    }
  }

  /**
   * Initialize TypeIt typewriter instances, grouped and chained by data attributes.
   * @param target - The root element to search for `.typeit` elements.
   */
  initTypeit(target: Element | Document = document) {
    if (this.core.config.typeit) {
      const typeitConfig = this.core.config.typeit
      const speed = typeitConfig.speed || 100
      const cursorSpeed = typeitConfig.cursorSpeed || 1000
      const cursorChar = typeitConfig.cursorChar || '|'
      const loop = typeitConfig.loop ?? false
      const typeitElements = target.querySelectorAll<HTMLElement>('.typeit')
      const groupMap = Array.from(typeitElements).reduce<Record<string, HTMLElement[]>>((acc, ele) => {
        const group = ele.dataset.group || ele.id || Math.random().toString(36).substring(2)
        acc[group] = acc[group] || []
        acc[group].push(ele)
        return acc
      }, {})
      const stagingDOM = getStagingDOM()

      Object.values(groupMap).forEach((group) => {
        const typeone = (i: number) => {
          const typeitElement = group[i]
          const singleData = typeitElement.dataset
          stagingDOM.stage((typeitElement.querySelector('template') as HTMLTemplateElement).content.cloneNode(true))
          let targetEle = typeitElement.firstElementChild as HTMLElement
          if (typeitElement.firstElementChild!.tagName === 'TEMPLATE') {
            typeitElement.innerHTML = ''
            targetEle = typeitElement
          }
          const instance = new TypeIt(targetEle, {
            strings: stagingDOM.$el.querySelector('pre')?.innerHTML || stagingDOM.contentAsHtml(),
            speed: Number(singleData.speed) >= 0 ? Number(singleData.speed) : speed,
            lifeLike: true,
            cursorSpeed: Number(singleData.cursorSpeed) >= 0 ? Number(singleData.cursorSpeed) : cursorSpeed,
            cursorChar: singleData.cursorChar || cursorChar,
            waitUntilVisible: true,
            loop: singleData.loop ? singleData.loop === 'true' : loop,
            afterComplete: () => {
              const duration = Number(singleData.duration ?? typeitConfig.duration)
              if (i === group.length - 1) {
                if (duration >= 0) {
                  window.setTimeout(() => {
                    instance.destroy()
                  }, duration)
                }
                return
              }
              instance.destroy()
              typeone(i + 1)
            },
          }).go()
        }
        typeone(0)
      })
      stagingDOM.destroy()
    }
  }
}
