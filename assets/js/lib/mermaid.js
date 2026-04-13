{{- /* Page level params is not supported */ -}}
{{- $mermaid := .Site.Params.mermaid -}}
{{- $mermaidCDN := $mermaid.cdn | default "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs" -}}

import mermaid from "{{ $mermaidCDN }}"
{{- with $mermaid.zenuml }}
import zenuml from "{{ . }}"
{{- end }}
{{- $loadersArr := slice }}
{{- range $i, $loaders := $mermaid.layoutloaders }}
import loaders{{ $i }} from "{{ $loaders }}"
{{- $loadersArr = $loadersArr | append (printf "loaders%d" $i) }}
{{- end }}
{{- if $mermaid.zenuml }}
await mermaid.registerExternalDiagrams([zenuml])
{{- end }}
const loaders = []
for(const item of {{ $loadersArr }}) {
	if(Array.isArray(item)) {
		loaders.push(...item)
	} else {
		loaders.push(item)
	}
}
mermaid.registerLayoutLoaders(loaders)
mermaid.startOnLoad = false;
const mermaidConfig = {{ $mermaid | jsonify }}
const mermaidZoomStateMap = new WeakMap()
const zoomConfig = normalizeZoomConfig(mermaidConfig.zoom)
let processing = false
let delayTask = null

function parseBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true
    if (['false', '0', 'no', 'off'].includes(normalized)) return false
  }
  return fallback
}

function parseNumber(value, fallback) {
  const result = Number(value)
  return Number.isFinite(result) ? result : fallback
}

function parseString(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function normalizeZoomConfig(raw) {
  const config = raw && typeof raw === 'object' ? raw : {}
  const wheelMode = parseString(config.wheelmode ?? config.wheelMode, 'ctrl').toLowerCase()
  const minScale = parseNumber(config.minscale ?? config.minScale, 0.5)
  const maxScale = parseNumber(config.maxscale ?? config.maxScale, 3)
  const step = parseNumber(config.step, 0.25)
  return {
    enable: parseBoolean(config.enable, true),
    minScale: clamp(minScale, 0.1, 10),
    maxScale: clamp(Math.max(maxScale, minScale + 0.1), 0.2, 20),
    step: clamp(step, 0.05, 2),
    wheel: parseBoolean(config.wheel, true),
    wheelMode: wheelMode === 'always' ? 'always' : 'ctrl',
    download: parseBoolean(config.download, false),
  }
}

function getZoomOptions(node) {
  const container = node.closest('.mermaid-diagram-container')
  const wheelMode = parseString(container?.dataset.mermaidZoomWheelMode, zoomConfig.wheelMode).toLowerCase()
  return {
    ...zoomConfig,
    enable: parseBoolean(container?.dataset.mermaidZoomEnable, zoomConfig.enable),
    download: parseBoolean(container?.dataset.mermaidZoomDownload, zoomConfig.download),
    wheelMode: wheelMode === 'always' ? 'always' : 'ctrl',
    labels: {
      zoomIn: container?.dataset.mermaidZoomInLabel || 'Zoom in',
      zoomOut: container?.dataset.mermaidZoomOutLabel || 'Zoom out',
      reset: container?.dataset.mermaidResetZoomLabel || 'Reset zoom',
      downloadSvg: container?.dataset.mermaidDownloadSvgLabel || 'Download Mermaid SVG',
    },
  }
}

function getZoomState(node) {
  let state = mermaidZoomStateMap.get(node)
  if (!state) {
    state = {
      scale: 1,
      baseWidth: 0,
      baseHeight: 0,
    }
    mermaidZoomStateMap.set(node, state)
  }
  return state
}

function getZoomControls(node) {
  const container = node.closest('.mermaid-diagram-container')
  return container?.querySelector(':scope > .mermaid-zoom-controls') || null
}

function resetBaseSize(node, state) {
  const svg = node.querySelector('svg')
  if (!svg) return
  const rect = svg.getBoundingClientRect()
  const width = rect.width || parseNumber(svg.getAttribute('width'), 0) || parseNumber(svg.viewBox?.baseVal?.width, 0)
  const height = rect.height || parseNumber(svg.getAttribute('height'), 0) || parseNumber(svg.viewBox?.baseVal?.height, 0)
  if (!width || !height) return
  state.baseWidth = width
  state.baseHeight = height
}

function applyZoom(node, state) {
  const svg = node.querySelector('svg')
  if (!svg) return
  if (!state.baseWidth || !state.baseHeight) {
    resetBaseSize(node, state)
  }
  if (!state.baseWidth || !state.baseHeight) return
  svg.style.maxWidth = 'none'
  svg.style.width = `${state.baseWidth * state.scale}px`
  svg.style.height = `${state.baseHeight * state.scale}px`
  node.dataset.zoomReady = 'true'
  node.dataset.zoomed = state.scale > 1 ? 'true' : 'false'
}

function updateZoomControls(node, state, options) {
  const controls = getZoomControls(node)
  if (!controls) return
  const zoomInBtn = controls.querySelector('[data-action="zoom-in"]')
  const zoomOutBtn = controls.querySelector('[data-action="zoom-out"]')
  const ratio = controls.querySelector('.mermaid-zoom-ratio')
  zoomInBtn?.toggleAttribute('disabled', state.scale >= options.maxScale - 0.001)
  zoomOutBtn?.toggleAttribute('disabled', state.scale <= options.minScale + 0.001)
  if (ratio) ratio.textContent = `${Math.round(state.scale * 100)}%`
}

function updateZoomLevel(node, state, options, nextScale, focusX, focusY) {
  const scale = clamp(nextScale, options.minScale, options.maxScale)
  if (Math.abs(scale - state.scale) < 0.001) return
  const previousScale = state.scale
  const rect = node.getBoundingClientRect()
  const x = focusX ?? rect.width / 2
  const y = focusY ?? rect.height / 2
  const contentX = (node.scrollLeft + x) / previousScale
  const contentY = (node.scrollTop + y) / previousScale

  state.scale = scale
  applyZoom(node, state)

  node.scrollLeft = clamp(contentX * scale - x, 0, Math.max(node.scrollWidth - node.clientWidth, 0))
  node.scrollTop = clamp(contentY * scale - y, 0, Math.max(node.scrollHeight - node.clientHeight, 0))
  updateZoomControls(node, state, options)
}

function downloadMermaidSvg(node) {
  const svg = node.querySelector('svg')
  if (!svg) return
  const clonedSvg = svg.cloneNode(true)
  clonedSvg.removeAttribute('style')
  clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  const source = new XMLSerializer().serializeToString(clonedSvg)
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `mermaid-${Date.now()}.svg`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

function createZoomButton({ action, title, icon }) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = `action-btn mermaid-zoom-btn mermaid-zoom-btn-${action}`
  button.dataset.action = action
  button.title = title
  button.setAttribute('aria-label', title)
  button.innerHTML = `<i class="${icon}" aria-hidden="true"></i>`
  return button
}

function resolveActiveMermaidNode(container, fallbackNode) {
  const isDark = document.documentElement.dataset.theme === 'dark'
  const preferredSelector = isDark ? '.mermaid-dark' : '.mermaid'
  const preferredNode = container.querySelector(preferredSelector)
  if (preferredNode?.querySelector('svg')) return preferredNode

  const fallbackSelector = '.mermaid[data-processed], .mermaid-dark[data-processed], .mermaid-neutral[data-processed], .mermaid, .mermaid-dark, .mermaid-neutral'
  const resolvedNode = container.querySelector(fallbackSelector)
  if (resolvedNode?.querySelector('svg')) return resolvedNode

  return fallbackNode
}

function ensureZoomControls(node, state, options) {
  const container = node.closest('.mermaid-diagram-container') || node.parentElement
  if (!container) return

  let controls = container.querySelector(':scope > .mermaid-zoom-controls')
  if (!controls) {
    controls = document.createElement('div')
    controls.className = 'mermaid-zoom-controls'
    controls.append(
      createZoomButton({ action: 'zoom-out', title: options.labels.zoomOut, icon: 'fa-solid fa-magnifying-glass-minus fa-width-auto' }),
      createZoomButton({ action: 'zoom-in', title: options.labels.zoomIn, icon: 'fa-solid fa-magnifying-glass-plus fa-width-auto' }),
    )
    const ratio = document.createElement('span')
    ratio.className = 'mermaid-zoom-ratio'
    controls.append(ratio)
    controls.append(createZoomButton({ action: 'reset', title: options.labels.reset, icon: 'fa-solid fa-rotate-left fa-width-auto' }))
    if (options.download) {
      controls.append(createZoomButton({ action: 'download', title: options.labels.downloadSvg, icon: 'fa-solid fa-download fa-width-auto' }))
    }
    container.prepend(controls)
  }

  controls.onclick = (event) => {
    const button = event.target.closest('button[data-action]')
    if (!button) return
    const action = button.dataset.action
    const targetNode = resolveActiveMermaidNode(container, node)
    const targetState = getZoomState(targetNode)
    const targetOptions = getZoomOptions(targetNode)

    if (action === 'zoom-in') {
      updateZoomLevel(targetNode, targetState, targetOptions, targetState.scale + targetOptions.step)
    } else if (action === 'zoom-out') {
      updateZoomLevel(targetNode, targetState, targetOptions, targetState.scale - targetOptions.step)
    } else if (action === 'reset') {
      targetState.scale = 1
      applyZoom(targetNode, targetState)
      targetNode.scrollLeft = 0
      targetNode.scrollTop = 0
      updateZoomControls(targetNode, targetState, targetOptions)
    } else if (action === 'download') {
      downloadMermaidSvg(targetNode)
    }
  }

  if (window.CellTooltip?.getOrCreateInstance) {
    controls.querySelectorAll('.action-btn[title]').forEach((button) => {
      window.CellTooltip.getOrCreateInstance(button)
    })
  }
}

function bindZoomEvents(node, state, options) {
  if (node.dataset.zoomBound === 'true') return
  node.dataset.zoomBound = 'true'

  let dragging = false
  let startX = 0
  let startY = 0
  let startLeft = 0
  let startTop = 0

  node.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || state.scale <= 1) return
    if (event.target.closest('.mermaid-zoom-controls')) return
    dragging = true
    startX = event.clientX
    startY = event.clientY
    startLeft = node.scrollLeft
    startTop = node.scrollTop
    node.dataset.panning = 'true'
  })

  node.addEventListener('pointermove', (event) => {
    if (!dragging) return
    node.scrollLeft = startLeft - (event.clientX - startX)
    node.scrollTop = startTop - (event.clientY - startY)
  })

  const stopPanning = () => {
    dragging = false
    node.dataset.panning = 'false'
  }
  node.addEventListener('pointerup', stopPanning)
  node.addEventListener('pointercancel', stopPanning)
  node.addEventListener('pointerleave', stopPanning)

  node.addEventListener('wheel', (event) => {
    if (!options.wheel) return
    const shouldZoomByWheel = options.wheelMode === 'always'
      ? true
      : (event.ctrlKey || event.metaKey)
    if (!shouldZoomByWheel) return
    event.preventDefault()
    const zoomDelta = event.deltaY < 0 ? options.step : -options.step
    updateZoomLevel(node, state, options, state.scale + zoomDelta, event.clientX - node.getBoundingClientRect().left, event.clientY - node.getBoundingClientRect().top)
  }, { passive: false })
}

function setupMermaidZoom(node) {
  const options = getZoomOptions(node)
  if (!options.enable) return
  if (!node.querySelector('svg')) return
  const state = getZoomState(node)
  resetBaseSize(node, state)
  bindZoomEvents(node, state, options)
  ensureZoomControls(node, state, options)
  applyZoom(node, state)
  updateZoomControls(node, state, options)
}

/**
 * Get current/next theme
 * @param {Boolean} [next] whether to get the next theme
 * @returns 
 */
function getTheme(next) {
  const darkMode = document.documentElement.dataset.theme === 'dark'
  return (next ? !darkMode : darkMode)
    ? mermaidConfig.themes[1]
    : mermaidConfig.themes[0]
}

/**
 * Initialize Mermaid by loading the specified theme
 * @param {String} [theme] specific theme to load
 * @param {Boolean} [darkMode] whether to use dark mode
 * @param {String} [selector] specific selector for the elements to process
 * @returns 
 */
async function loadMermaid({ theme, darkMode, selector }) {
  if (processing) {
    console.warn('Mermaid is still processing, delaying the reload.')
    delayTask = () => loadMermaid({ theme, darkMode, selector })
    return
  }
  const isDarkMode = darkMode ?? (document.documentElement.dataset.theme === 'dark')
  const currentTheme = theme ?? getTheme()
  const querySelector = selector ?? (isDarkMode ? '.mermaid-dark' : '.mermaid')
  const nodes = Array.from(document.querySelectorAll(querySelector))
    .filter((node) => {
      const p = node.closest('.tab-panel')
      if (!p) return true
      const style = getComputedStyle(p)
      return style.height !== 'auto' || style.width !== 'auto'
    })

  if (!nodes.length) return

  console.time(`Loaded [${currentTheme}]`)
  processing = true
  nodes.forEach((node) => {
    node.toggleAttribute('data-processing', true)
  })

  // https://mermaid.js.org/config/schema-docs/config.html
  mermaid.initialize({
    startOnLoad: false,
    darkMode: isDarkMode,
    theme: currentTheme,
    securityLevel: mermaidConfig.securitylevel,
    look: mermaidConfig.look,
    layout: mermaidConfig.layout,
    fontFamily: mermaidConfig.fontfamily,
    altFontFamily: mermaidConfig.fontfamily
  })
  // skip data-processed elements in Mermaid run function, so this won't re-render
  await mermaid.run({
    nodes,
    suppressErrors: true,
    postRenderCallback: (svgId) => {
      const svg = document.getElementById(svgId)
      const node = svg?.parentElement
      node?.toggleAttribute('data-processing', false)
      if (node) {
        setupMermaidZoom(node)
      }
    },
  })
  nodes.forEach((node) => setupMermaidZoom(node))
  processing = false
  console.timeEnd(`Loaded [${currentTheme}]`)

  if (delayTask && typeof delayTask === 'function') {
    delayTask();
    delayTask = null;
    // console.log('Delayed task executed');
  }
}

async function initMermaid() {
	const mermaidElements = document.querySelectorAll('.mermaid, .mermaid-dark, .mermaid-neutral')
  if (!mermaidElements.length) return
	console.log(
		`%c💫 FixIt Mermaid`,
		'color: #FF3670; font-weight: bold; font-size: 16px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);',
	)
  const currentTheme = getTheme()
  const nextTheme = getTheme(true)
  const darkMode = document.documentElement.dataset.theme === 'dark'
  await loadMermaid({ theme: currentTheme, darkMode })
  await loadMermaid({ theme: nextTheme, darkMode: !darkMode })
  await loadMermaid({ theme: 'neutral', darkMode: false, selector: '.mermaid-neutral' })
}

window.FixItMermaid = {
  config: mermaidConfig,
  load: loadMermaid,
  init: initMermaid,
}
window.mermaid = mermaid
