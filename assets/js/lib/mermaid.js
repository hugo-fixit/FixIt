{{- /* Page level params is not supported */ -}}
{{- $mermaid := .Site.Params.mermaid -}}
{{- $mermaidCDN := $mermaid.cdn | default "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs" -}}
{{- $wrapped := $mermaid.wrapper | default true -}}

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
const config = {{ $mermaid | jsonify }}
let tabContainerEventBound = false
let mermaidThemeRerenderBound = false
let mermaidContainerObserver = null
let mermaidRenderLock = Promise.resolve()
let mermaidConfigKey = ''
let mermaidIdSeq = 0
{{- if $wrapped }}
let panzoomInstances = null
let panzoomWheelHosts = null
let panzoomEventBound = false
let mermaidThemeSyncBound = false
let mermaidPanzoomGroups = null
{{- end }}

/**
 * Waits for the next animation frame.
 * @returns {Promise<void>}
 */
function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve))
}

{{- if $wrapped }}
/**
 * Gets (and initializes) the panzoom shared state for a Mermaid diagram container.
 *
 * The group is used to keep zoom/pan transform in sync across theme layers
 * (e.g. `.mermaid` vs `.mermaid-dark`) within the same `.diagram-container`.
 *
 * @param {SVGElement} svg
 * @returns {Object}
 */
function getMermaidPanzoomGroup(svg) {
  if (!svg?.closest?.('.diagram-view')) return null
  const container = svg?.closest?.('.diagram-container')
  if (!container) return null
  if (!mermaidPanzoomGroups) mermaidPanzoomGroups = new WeakMap()
  let group = mermaidPanzoomGroups.get(container)
  if (!group) {
    group = { container, transform: null, svgs: new Set(), lastSvg: null }
    mermaidPanzoomGroups.set(container, group)
  }
  const svgs = container.querySelectorAll('.mermaid svg, .mermaid-dark svg')
  svgs.forEach((s) => group.svgs.add(s))
  return group
}

/**
 * Compares two pan/zoom transforms with a small tolerance.
 * Used to avoid redundant sync work (e.g. repeated theme switches / re-renders).
 *
 * @param {Object} a - PanzoomTransform object.
 * @param {Object} b - PanzoomTransform object.
 * @returns {boolean}
 */
function isSamePanzoomTransform(a, b) {
  if (!a || !b) return false
  const eps = 1e-3
  return (
    Math.abs(a.x - b.x) <= eps &&
    Math.abs(a.y - b.y) <= eps &&
    Math.abs(a.scale - b.scale) <= eps
  )
}

/**
 * Applies a pan/zoom transform to a Panzoom instance.
 *
 * Reads the current state via `getPan()` and `getScale()` and skips if it is already
 * effectively equal to `transform` (see `isSamePanzoomTransform`).
 *
 * Note: the pan step is deferred to the next macrotask so the zoom can be applied first.
 *
 * @param {Object} instance - Panzoom instance with zoom/pan/getPan/getScale methods.
 * @param {PanzoomTransform} transform
 * @returns {void}
 */
function applyPanzoomTransform(instance, transform) {
  if (!instance || !transform) return
  const currentTransform = {
    scale: instance.getScale(),
    ...instance.getPan(),
  }
  if (isSamePanzoomTransform(currentTransform, transform)) return
  instance.zoom(transform.scale, { animate: false, force: true })
  setTimeout(() => instance.pan(transform.x, transform.y, { animate: false, force: true }))
}
{{- end }}

/**
 * Schedule task at idle time to avoid blocking critical rendering.
 * @param {Function} task
 * @param {number} [timeout=0] - Timeout in milliseconds for the task to run.
 */
function runWhenIdle(task, timeout = 0) {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(task, { timeout })
    return
  }
  window.setTimeout(task, 80)
}

/**
 * Checks whether an element is in the viewport (vertically).
 * @param {Element} node
 * @returns {boolean}
 */
function isNodeInViewport(node) {
  const rect = node.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}

/**
 * Checks whether a node is currently visible and should be rendered first.
 * @param {Element} node
 * @returns {boolean}
 */
function isNodeVisuallyActive(node) {
  if (!isRenderContextActive(node)) return false
  const nodeStyle = getComputedStyle(node)
  if (nodeStyle.display === 'none' || nodeStyle.visibility === 'hidden') return false
  const rect = node.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0
}

/**
 * Checks whether an element is inside an active renderable context.
 *
 * This is stricter than "is in the DOM": it excludes content hidden by
 * tab panels, diagram/code toggles, or common hidden containers.
 *
 * @param {Element} el
 * @returns {boolean}
 */
function isRenderContextActive(el) {
  if (!el?.isConnected) return false
  if (el.closest?.('[hidden], .d-none, [aria-hidden="true"]')) return false
  const diagramView = el.closest?.('.diagram-view')
  if (diagramView?.closest?.('.diagram-tabs') && !diagramView.classList.contains('active')) return false
  const panel = el.closest?.('.tab-panel')
  if (panel?.hidden) return false
  return true
}

/**
 * Check whether the current effective theme is dark.
 * In auto mode, this follows the system color scheme preference.
 * @returns {boolean} Whether dark mode is currently active.
 */
function isDarkMode() {
  const themeMode = document.documentElement.dataset.themeMode || 'auto';
  return themeMode === 'auto'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : themeMode === 'dark';
}

/**
 * Gets Mermaid theme name for the current effective color scheme.
 * `.mermaid` uses themes[0] (default), `.mermaid-dark` uses themes[1] (dark).
 * @returns {string}
 */
function getTheme() {
  return isDarkMode() ? config.themes[1] : config.themes[0]
}

/**
 * Mermaid uses global runtime config; `initialize()` changes subsequent `render()` behavior.
 * This helper serializes all render work to avoid concurrent initialize/render cross-talk.
 * @param {Function} task
 * @returns {Promise<any>}
 */
function withMermaidLock(task) {
  mermaidRenderLock = mermaidRenderLock.then(task, task)
  return mermaidRenderLock
}

/**
 * Initializes Mermaid only when (theme, darkMode) changes to reduce work and keep it stable.
 * @param {string} theme
 * @param {boolean} darkMode
 */
function ensureMermaidInitialized(theme, darkMode) {
  const key = `${String(theme)}|${darkMode ? '1' : '0'}`
  if (key === mermaidConfigKey) return
  mermaidConfigKey = key
  mermaid.initialize({
    startOnLoad: false,
    darkMode,
    theme,
    securityLevel: config.securitylevel,
    look: config.look,
    layout: config.layout,
    fontFamily: config.fontfamily,
    altFontFamily: config.fontfamily
  })
}

/**
 * Renders a single Mermaid host element (`.mermaid`, `.mermaid-dark`, `.mermaid-neutral`).
 *
 * Notes:
 * - Source uses `textContent` to avoid HTML entities (e.g. `&gt;`) breaking Mermaid parsing.
 * - Uses `data-processing` / `data-processed` as state flags.
 * - Emits `fixit:mermaid-rendered` to hook Panzoom and other post-render behaviors.
 *
 * @param {Element} el
 * @param {Object} options
 * @param {string} options.theme
 * @param {boolean} options.darkMode
 */
async function renderMermaidElement(el, { theme, darkMode } = {}) {
  if (!el || el.hasAttribute('data-processed') || el.hasAttribute('data-processing')) return
  if (!isRenderContextActive(el)) return
  const source = el.textContent.trim()
  if (!source) {
    el.setAttribute('data-processed', '')
    return
  }

  await withMermaidLock(async () => {
    if (!el || el.hasAttribute('data-processed') || !isRenderContextActive(el)) return
    if (!el.hasAttribute('data-processing')) el.setAttribute('data-processing', '')
    ensureMermaidInitialized(theme, darkMode)
    const id = `fixit-mermaid-${++mermaidIdSeq}`
    try {
      const result = await mermaid.render(id, source)
      const svg = result?.svg || ''
      el.innerHTML = svg
      if (typeof result?.bindFunctions === 'function') {
        try { result.bindFunctions(el) } catch {}
      }
      const svgEl = el.querySelector('svg')
      if (svgEl && !svgEl.id) svgEl.id = id
      el.removeAttribute('data-processing')
      el.setAttribute('data-processed', '')
      const svgId = svgEl?.id || id
      if (svgId) {
        document.dispatchEvent(new CustomEvent('fixit:mermaid-rendered', { detail: { svgId } }))
      }
    } catch (e) {
      const errDiv = document.getElementById(`d${id}`)
      if (errDiv) {
        el.innerHTML = errDiv.innerHTML
        errDiv.remove()
      }
      el.removeAttribute('data-processing')
      el.setAttribute('data-processed', '')
      console.warn('FixIt Mermaid render failed:', e)
    }
  })
}

function collectMermaidContainers(root = document) {
  return Array.from(root.querySelectorAll('.diagram-container'))
    .filter((container) => container && container.querySelector('.mermaid, .mermaid-dark, .mermaid-neutral'))
}

/**
 * Core rule: render only when the active layer is visible and not rendered yet.
 * - "Active layer" means `.mermaid` in light mode or `.mermaid-dark` in dark mode.
 * - We treat presence of a rendered `<svg>` as "already rendered" even if flags are missing.
 */
async function renderActiveLayerInContainer(container) {
  if (!container) return
  const el = container.querySelector(isDarkMode() ? '.mermaid-dark' : '.mermaid')
  if (!el) return
  if (el.hasAttribute('data-processed') || el.querySelector('svg')) return
  if (!isNodeVisuallyActive(el)) return
  const darkMode = isDarkMode()
  await renderMermaidElement(el, { theme: getTheme(), darkMode })
}

/**
 * Neutral theme is not part of the live light/dark switching UI.
 * Render it in idle time for print / fallback scenarios.
 */
function scheduleNeutralRender() {
  if (window.matchMedia('only screen and (max-width: 960px)').matches) return
  runWhenIdle(() => {
    const neutralNodes = Array.from(document.querySelectorAll('.mermaid-neutral'))
      .filter((el) => el && !el.hasAttribute('data-processed'))
      .filter(isRenderContextActive)
    neutralNodes.forEach((el) => {
      renderMermaidElement(el, { theme: 'neutral', darkMode: false })
    })
  })
}

/**
 * Lazy rendering via IntersectionObserver.
 * When a `.diagram-container` gets close to viewport, attempt to render its active layer.
 */
function bindMermaidIntersectionObserver() {
  if (mermaidContainerObserver) return
  mermaidContainerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      const container = entry.target
      if (!container || !isRenderContextActive(container)) return
      renderActiveLayerInContainer(container)
    })
  }, {
    root: null,
    // 200px margin to allow partial visibility
    rootMargin: '200px 0px',
    threshold: 0.01,
  })
}

/**
 * Registers all Mermaid containers under root into the observer.
 * Idempotent via `data-mermaid-observed`.
 */
function observeMermaidContainers(root = document, refresh = false) {
  bindMermaidIntersectionObserver()
  const containers = collectMermaidContainers(root)
  containers.forEach((container) => {
    if (!container || container.hasAttribute('data-mermaid-observed')) return
    container.setAttribute('data-mermaid-observed', '')
    mermaidContainerObserver.observe(container)
  })
  if (!refresh) return
  containers.forEach((container) => {
    if (!container) return
    mermaidContainerObserver.unobserve(container)
    mermaidContainerObserver.observe(container)
  })
}

{{- if $wrapped }}
/**
 * Gets the currently visible SVG for a diagram block that contains multiple Mermaid layers.
 * @param {Element} root
 * @returns {SVGElement|null}
 */
function getActiveMermaidSvg(root) {
  const nodes = root?.querySelectorAll?.('.mermaid, .mermaid-dark, .mermaid-neutral')
  if (!nodes?.length) return null
  const visible = Array.from(nodes).find((el) => {
    const style = getComputedStyle(el)
    if (style.display === 'none' || style.visibility === 'hidden') return false
    const rect = el.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  })
  return visible?.querySelector?.('svg') || null
}

/**
 * Enables pan/zoom for a Mermaid SVG inside `.diagram-view`.
 * Requires `window.Panzoom`.
 *
 * @param {SVGElement} svg
 * @returns {void}
 */
function bindMermaidPanzoom(svg) {
  if (!svg) return
  if (!svg.closest?.('.diagram-view')) return
  if (!svg.closest?.('.mermaid, .mermaid-dark')) return
  if (!panzoomInstances) panzoomInstances = new WeakMap()
  if (!panzoomWheelHosts) panzoomWheelHosts = new WeakSet()
  if (panzoomInstances.has(svg)) return
  if (typeof window.Panzoom !== 'function') return

  const group = getMermaidPanzoomGroup(svg)

  const panzoom = window.Panzoom(svg, {
    maxScale: 6,
    minScale: 0.2,
    step: 0.1,
  })
  panzoomInstances.set(svg, panzoom)

  if (group?.transform) {
    applyPanzoomTransform(panzoom, group.transform)
  }

  const host = svg.closest('.mermaid, .mermaid-dark')
  if (!host) return
  if (panzoomWheelHosts.has(host)) return
  panzoomWheelHosts.add(host)

  host.addEventListener('pointerdown', () => {
    const currentSvg = host.querySelector('svg')
    if (group && currentSvg) group.lastSvg = currentSvg
  })

  host.addEventListener('wheel', (event) => {
    if (!event.ctrlKey) return
    const currentSvg = host.querySelector('svg')
    const instance = currentSvg && panzoomInstances.get(currentSvg)
    if (!instance) return
    if (group && currentSvg) group.lastSvg = currentSvg
    event.preventDefault()
    instance.zoomWithWheel(event)
  }, { passive: false })
}

/**
 * Initializes diagram tabs (`.diagram-tabs[data-diagram="mermaid"]`) controls:
 * - Diagram/Code tab switching
 * - Zoom/reset/download buttons wiring
 * - Ensures Mermaid renders when the diagram tab is active
 */
function initDiagramControls() {
  document.querySelectorAll('.diagram-tabs[data-diagram="mermaid"]:not([data-diagram-init])').forEach((tabs) => {
    const actions = tabs.querySelector('.tabs-actions')
    const diagramTabBtn = tabs.querySelector('.tab-item[data-tab="diagram"]')
    const codeTabBtn = tabs.querySelector('.tab-item[data-tab="code"]')
    const diagramBlock = tabs.querySelector('.diagram-view')
    const codeBlock = Array.from(tabs.querySelectorAll('.tabs-content > .code-block'))
      .find((block) => !block.classList.contains('diagram-view'))
    if (!actions || !diagramTabBtn || !codeTabBtn || !diagramBlock || !codeBlock) return

    const zoomInBtn = tabs.querySelector('.diagram-zoom-in-btn')
    const zoomOutBtn = tabs.querySelector('.diagram-zoom-out-btn')
    const resetBtn = tabs.querySelector('.diagram-reset-btn')
    const downloadBtn = tabs.querySelector('.diagram-download-btn')
    tabs.dataset.diagramInit = 'true'

    const diagramActionButtons = [zoomOutBtn, zoomInBtn, resetBtn, downloadBtn].filter(Boolean)

    const movedActionRestore = new WeakMap()
    let codeActionCache = []

    const moveToActions = (elements) => {
      elements.forEach((el) => {
        if (!el || el.parentElement === actions) return
        movedActionRestore.set(el, { parent: el.parentElement, next: el.nextSibling })
        if (pinnedFullscreenBtn && pinnedFullscreenBtn.parentElement === actions) {
          actions.insertBefore(el, pinnedFullscreenBtn)
        } else {
          actions.appendChild(el)
        }
      })
    }

    const restoreMoved = (elements) => {
      elements.forEach((el) => {
        const restore = movedActionRestore.get(el)
        if (!restore?.parent) return
        if (restore.next && restore.next.parentNode === restore.parent) {
          restore.parent.insertBefore(el, restore.next)
        } else {
          restore.parent.appendChild(el)
        }
        movedActionRestore.delete(el)
      })
    }

    const pinnedFullscreenBtn = codeBlock.querySelector('.code-header .fullscreen-btn')
    if (pinnedFullscreenBtn && pinnedFullscreenBtn.parentElement !== actions) {
      actions.appendChild(pinnedFullscreenBtn)
    }

    const collectCodeActions = () => {
      const codeHeader = codeBlock.querySelector('.code-header')
      if (codeHeader) {
        return Array.from(codeHeader.querySelectorAll('.action-btn'))
          .filter((btn) => btn !== pinnedFullscreenBtn)
      }
      return Array.from(codeBlock.querySelectorAll('.code-copy-btn'))
    }

    const getCodeActions = () => {
      if (codeActionCache.length && codeActionCache.some((el) => el.isConnected)) return codeActionCache
      codeActionCache = collectCodeActions()
      return codeActionCache
    }

    const setDiagramActionsVisible = (visible) => {
      diagramActionButtons.forEach((btn) => {
        btn.style.display = visible ? '' : 'none'
      })
    }

    const switchTo = (target) => {
      const showDiagram = target === 'diagram'
      diagramTabBtn.classList.toggle('active', showDiagram)
      codeTabBtn.classList.toggle('active', !showDiagram)
      diagramBlock.classList.toggle('active', showDiagram)
      codeBlock.classList.toggle('active', !showDiagram)
      const codeActions = getCodeActions()
      if (showDiagram) {
        setDiagramActionsVisible(true)
        restoreMoved(codeActions)
        // observeMermaidContainers(tabs, true)
      } else {
        setDiagramActionsVisible(false)
        moveToActions(codeActions)
      }
    }

    const resolvePanzoom = () => {
      const svg = getActiveMermaidSvg(diagramBlock)
      return svg && panzoomInstances ? panzoomInstances.get(svg) : null
    }

    diagramTabBtn.addEventListener('click', () => switchTo('diagram'))
    codeTabBtn.addEventListener('click', () => switchTo('code'))

    zoomInBtn?.addEventListener('click', () => {
      const panzoom = resolvePanzoom()
      if (!panzoom?.zoomIn) return
      try { panzoom.zoomIn({ animate: true }) } catch { panzoom.zoomIn() }
    })
    zoomOutBtn?.addEventListener('click', () => {
      const panzoom = resolvePanzoom()
      if (!panzoom?.zoomOut) return
      try { panzoom.zoomOut({ animate: true }) } catch { panzoom.zoomOut() }
    })
    resetBtn?.addEventListener('click', () => {
      const panzoom = resolvePanzoom()
      if (!panzoom?.reset) return
      try { panzoom.reset({ animate: true }) } catch { panzoom.reset() }
    })
    downloadBtn?.addEventListener('click', () => {
      const svg = getActiveMermaidSvg(diagramBlock)
      if (!svg) return
      const clonedSvg = svg.cloneNode(true)
      // remove style attribute (transform etc.) that may interfere with proper rendering in external viewers
      clonedSvg.removeAttribute('style')
      const xml = new XMLSerializer().serializeToString(clonedSvg)
      const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${diagramBlock.dataset.filename.split('.')[0]}.svg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    })
  })
}

/**
 * Binds a listener to attach Panzoom after Mermaid renders an SVG.
 * @returns {void}
 */
function bindRenderedPanzoom() {
  if (panzoomEventBound) return
  panzoomEventBound = true
  document.addEventListener('fixit:mermaid-rendered', (event) => {
    const svgId = event?.detail?.svgId
    if (!svgId) return
    bindMermaidPanzoom(document.getElementById(svgId))
  })
}
{{- end }}

/**
 * Binds a listener so Mermaid diagrams inside a tab panel render after tab switches.
 * @returns {void}
 */
function bindTabContainerChanged() {
  if (tabContainerEventBound) return
  tabContainerEventBound = true
  document.addEventListener('tab-container-changed', async (event) => {
    const panel = event?.panel || event?.detail?.relatedTarget
    if (!panel) return
    // Wait for layout/visibility to settle after tab switch before measuring visibility.
    await nextFrame()
    await nextFrame()
    observeMermaidContainers(panel, true)
  })
}

{{- if $wrapped }}
/**
 * Binds theme switch synchronization for Panzoom transforms across Mermaid layers.
 * @returns {void}
 */
function bindThemeSync() {
  if (mermaidThemeSyncBound) return
  mermaidThemeSyncBound = true
  let lastEffectiveDark = isDarkMode()

  const getActivePanzoomSvg = (container) => {
    const nodes = container?.querySelectorAll?.('.mermaid, .mermaid-dark')
    if (!nodes?.length) return null
    const visible = Array.from(nodes).find((el) => {
      const style = getComputedStyle(el)
      if (style.display === 'none' || style.visibility === 'hidden') return false
      const rect = el.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    })
    return visible?.querySelector?.('svg') || null
  }

  const safeGetTransformFromSvg = (svg) => {
    const instance = svg && panzoomInstances?.get?.(svg)
    if (instance?.getPan && instance?.getScale) {
      try {
        const pan = instance.getPan()
        const scale = instance.getScale()
        if (pan && typeof scale === 'number') return { x: pan.x, y: pan.y, scale }
      } catch {}
    }
    return null
  }

  const sync = (nowDark) => {
    if (!mermaidPanzoomGroups) return
    document.querySelectorAll('.diagram-view .diagram-container').forEach((container) => {
      const currentActive = getActivePanzoomSvg(container)
      const fallbackSource = nowDark
        ? container.querySelector('.mermaid svg')
        : container.querySelector('.mermaid-dark svg')

      const groupSeed = currentActive || fallbackSource
      if (!groupSeed) return
      const group = getMermaidPanzoomGroup(groupSeed)
      if (!group) return

      const last = group?.lastSvg
      const sourceSvg = last?.isConnected ? last : (fallbackSource || currentActive)
      const sourceTransform = safeGetTransformFromSvg(sourceSvg)
      if (sourceTransform) group.transform = sourceTransform

      if (!group.transform) return

      if (currentActive) {
        const instance = panzoomInstances?.get?.(currentActive)
        applyPanzoomTransform(instance, group.transform)
      }
    })
  }

  if (window.fixit?.switchThemeEventSet?.add) {
    window.fixit.switchThemeEventSet.add(async (isDark) => {
      if (isDark === lastEffectiveDark) return
      lastEffectiveDark = isDark
      await nextFrame()
      await nextFrame()
      sync(isDark)
    })
  }
}
{{- end }}

/**
 * Initializes Mermaid rendering, events, lazy loading and diagram controls.
 * @returns {Promise<void>}
 */
async function init() {
  const mermaidElements = document.querySelectorAll('.mermaid, .mermaid-dark, .mermaid-neutral')
  if (!mermaidElements.length) return
  console.log(
    `%c💫 FixIt Mermaid`,
    'color: #FF3670; font-weight: bold; font-size: 16px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);',
  )

{{- if $wrapped }}
  initDiagramControls()
  bindRenderedPanzoom()
  bindThemeSync()
{{- end }}
  bindTabContainerChanged()

  // Core: observe containers and render only when they become visible.
  observeMermaidContainers()
  // Neutral is non-critical, defer to idle time.
  scheduleNeutralRender()

  if (!mermaidThemeRerenderBound && window.fixit?.switchThemeEventSet?.add) {
    mermaidThemeRerenderBound = true
    window.fixit.switchThemeEventSet.add(async () => {
      await nextFrame()
      await nextFrame()
      // Theme switch doesn't change container intersection, so refresh IO to trigger callbacks.
      observeMermaidContainers(document, true)
    })
  }
}

window.FixItMermaid = {
  config,
  init,
}
window.mermaid = mermaid
