/**
 * Mapbox GL integration for FixIt shortcode blocks.
 *
 * Responsibilities:
 * - Initialize Mapbox GL maps with controls and optional markers.
 * - Apply light/dark style on theme switch.
 * - Re-run initialization after decrypted content is revealed.
 */
import { TypedEventBus } from '../core/event-bus'
import { isDarkMode } from '../utils'

const eventBus = new TypedEventBus()

const mapboxArr: any[] = []

function initMapbox(target: Element | Document = document) {
  const mapboxgl = window.mapboxgl
  const MapboxLanguage = window.MapboxLanguage
  const config = window.config.mapbox
  if (!mapboxgl || !config)
    return
  if (!mapboxgl.accessToken) {
    mapboxgl.accessToken = config.accessToken!
    mapboxgl.setRTLTextPlugin(config.RTLTextPlugin!)
  }
  const isDark = isDarkMode()
  target.querySelectorAll<HTMLElement>('.mapbox:empty').forEach(($mapbox) => {
    const { lng, lat, zoom, lightStyle, darkStyle, marked, markers, navigation, geolocate, scale, fullscreen } = JSON.parse($mapbox.dataset.options!)
    const mapbox = new mapboxgl.Map({
      container: $mapbox,
      center: [lng, lat],
      zoom,
      minZoom: 0.2,
      style: isDark ? darkStyle : lightStyle,
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
    mapboxArr.push(mapbox)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initMapbox()
  eventBus.on('fixit:switch-theme', ({ detail }) => {
    if (!detail.isChanged)
      return
    const isDark = detail.isDark
    mapboxArr.forEach((mapbox: any) => {
      const $mapbox = mapbox.getContainer()
      const { lightStyle, darkStyle } = JSON.parse($mapbox.dataset.options)
      mapbox.setStyle(isDark ? darkStyle : lightStyle)
      mapbox.addControl(new window.MapboxLanguage())
    })
  })
  eventBus.on('fixit:decrypted', () => initMapbox())
  eventBus.on('fixit:partial-decrypted', ({ detail }) => initMapbox(detail.target))
}, false)
