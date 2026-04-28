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
let processing = false
let queuedTasks = []
let mermaidObserver = null
const observedNodes = new Set()
const nodeRenderOptions = new WeakMap()
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve))
let panzoomInstances = null
let panzoomWheelHosts = null
let panzoomEventBound = false
let tabContainerEventBound = false
let mermaidThemeSyncBound = false
let mermaidPanzoomGroups = null

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

function applyPanzoomTransformToSvg(svg, transform) {
  if (!svg || !transform) return
  svg.style.transform = `scale(${transform.scale}) translate(${transform.x}px, ${transform.y}px)`
}

function applyPanzoomTransform(instance, transform) {
  if (!instance || !transform) return
  try { instance.zoom(transform.scale, { animate: false, force: true }) } catch {}
  try { instance.pan(transform.x, transform.y, { animate: false, force: true }) } catch {}
}

/**
 * Schedule task at idle time to avoid blocking critical rendering.
 * @param {Function} task
 */
function runWhenIdle(task) {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(task, { timeout: 800 })
    return
  }
  window.setTimeout(task, 80)
}

/**
 * Check whether node is in viewport.
 * @param {Element} node
 * @returns {Boolean}
 */
function isNodeInViewport(node) {
  const rect = node.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}

/**
 * Check whether node is currently visible and should be rendered first.
 * @param {Element} node
 * @returns {Boolean}
 */
function isNodeVisuallyActive(node) {
  const nodeStyle = getComputedStyle(node)
  if (nodeStyle.display === 'none' || nodeStyle.visibility === 'hidden') {
    return false
  }
  const panel = node.closest('.tab-panel')
  if (panel) {
    const style = getComputedStyle(panel)
    if (style.display === 'none' || style.visibility === 'hidden' || panel.hidden) {
      return false
    }
  }
  const rect = node.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0
}

/**
 * Observe Mermaid nodes and render them when entering viewport.
 * @param {Element[]} nodes
 * @param {Object} options
 */
function observeMermaidNodes(nodes, options) {
  if (!nodes.length) return
  if (!mermaidObserver) {
    mermaidObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const node = entry.target
        mermaidObserver.unobserve(node)
        observedNodes.delete(node)
        const renderOptions = nodeRenderOptions.get(node)
        if (!renderOptions || node.hasAttribute('data-processed')) return
        loadMermaid({ ...renderOptions, nodes: [node], watchViewport: false })
      })
    }, {
      root: null,
      // start loading before the node is fully in view to make it more likely to be ready when the user scrolls to it
      rootMargin: '500px 0px',
      threshold: 0.01,
    })
  }

  nodes.forEach((node) => {
    if (!node || node.hasAttribute('data-processed') || observedNodes.has(node)) return
    nodeRenderOptions.set(node, options)
    mermaidObserver.observe(node)
    observedNodes.add(node)
  })
}

/**
 * Collect candidate Mermaid nodes.
 * @param {String} querySelector
 * @param {Boolean} visibleOnly
 * @returns {Element[]}
 */
function collectMermaidNodes(querySelector, visibleOnly = false) {
  const nodes = Array.from(document.querySelectorAll(querySelector))
  return visibleOnly ? nodes.filter(isNodeVisuallyActive) : nodes
}

/**
 * Render Mermaid nodes in chunks to reduce long tasks.
 * @param {Element[]} nodes
 */
async function runMermaidInBatches(nodes) {
  const batchSize = Math.max(Number(mermaidConfig.batchsize) || 12, 1)
  for (let i = 0; i < nodes.length; i += batchSize) {
    const chunk = nodes.slice(i, i + batchSize)
    await mermaid.run({
      nodes: chunk,
      suppressErrors: true,
      postRenderCallback: (svgId) => {
         const svg = document.getElementById(svgId)
          svg?.parentElement?.toggleAttribute('data-processing', false)
          if (svg) {
            const group = getMermaidPanzoomGroup(svg)
            if (group?.transform) applyPanzoomTransformToSvg(svg, group.transform)
          }
          if (svg) {
            document.dispatchEvent(new CustomEvent('fixit:mermaid-rendered', { detail: { svgId } }))
          }
      },
    })
    if (i + batchSize < nodes.length) {
      await nextFrame()
    }
  }
}

/**
 * Check whether the current effective theme is dark.
 * In auto mode, this follows the system color scheme preference.
 * @returns {Boolean} whether dark mode is currently active
 */
function isDarkMode() {
  const themeMode = document.documentElement.dataset.themeMode || 'auto';
  return themeMode === 'auto'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : themeMode === 'dark';
}

/**
 * Get current/next theme
 * @param {Boolean} [next] whether to get the next theme
 * @returns {String} the current or next theme
 */
function getTheme(next) {
  const darkMode = isDarkMode()
  return (next ? !darkMode : darkMode)
    ? mermaidConfig.themes[1]
    : mermaidConfig.themes[0]
}

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
    step: 0.2,
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

function renderMermaidInRoot(root, { watchViewport = true } = {}) {
  if (!root) return
  const darkMode = isDarkMode()
  const currentTheme = getTheme()
  const nextTheme = getTheme(true)

  const lightNodes = Array.from(root.querySelectorAll('.mermaid')).filter((el) => !el.hasAttribute('data-processed'))
  const darkNodes = Array.from(root.querySelectorAll('.mermaid-dark')).filter((el) => !el.hasAttribute('data-processed'))

  const primaryNodes = darkMode ? darkNodes : lightNodes
  const secondaryNodes = darkMode ? lightNodes : darkNodes
  if (primaryNodes.length) loadMermaid({ theme: currentTheme, darkMode, nodes: primaryNodes, watchViewport })
  if (secondaryNodes.length) loadMermaid({ theme: nextTheme, darkMode: !darkMode, nodes: secondaryNodes, watchViewport })
}

function initMermaidDiagramControls() {
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

    const ensureRendered = () => {
      const neutralNodes = Array.from(tabs.querySelectorAll('.mermaid-neutral')).filter((el) => !el.hasAttribute('data-processed'))
      renderMermaidInRoot(tabs, { watchViewport: false })
      if (neutralNodes.length) loadMermaid({ theme: 'neutral', darkMode: false, nodes: neutralNodes, watchViewport: false })
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
        ensureRendered()
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
      const xml = new XMLSerializer().serializeToString(svg)
      const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = diagramBlock.dataset.filename.split('.')[0]
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    })

    if (!diagramBlock.classList.contains('active')) {
      switchTo('diagram')
    } else {
      setDiagramActionsVisible(true)
      restoreMoved(getCodeActions())
      ensureRendered()
    }
  })
}

/**
 * Render Mermaid diagrams for a target theme.
 *
 * Behavior:
 * - If another render task is running, this task is queued.
 * - If `nodes` is provided, it is used directly and bypasses selector-based collection.
 * - If `watchViewport` is enabled, off-screen nodes are observed and rendered only after entering viewport.
 *
 * @param {Object} options render options
 * @param {String} [options.theme] Mermaid theme name. Uses current theme when omitted.
 * @param {Boolean} [options.darkMode] Explicit dark mode flag. Uses `isDarkMode()` when omitted.
 * @param {String} [options.selector] CSS selector for target Mermaid containers.
 * @param {Boolean} [options.visibleOnly=false] Whether to collect only currently visible candidates.
 * @param {Boolean} [options.watchViewport=false] Whether to defer off-screen nodes via IntersectionObserver.
 * @param {Array<Element>} [options.nodes] Specific nodes to render.
 */
async function loadMermaid({ theme, darkMode, selector, visibleOnly = false, watchViewport = false, nodes }) {
  if (processing) {
    console.warn('Mermaid is still processing, delaying the reload.')
    queuedTasks.push(() => loadMermaid({ theme, darkMode, selector, visibleOnly, watchViewport, nodes }))
    return
  }
  const resolvedDarkMode = darkMode ?? isDarkMode()
  const currentTheme = theme ?? getTheme()
  const querySelector = selector ?? (resolvedDarkMode ? '.mermaid-dark' : '.mermaid')
  const candidateNodes = nodes ?? collectMermaidNodes(querySelector, visibleOnly)

  if (!candidateNodes.length) return

  let renderNodes = candidateNodes
  if (watchViewport) {
    const deferredNodes = candidateNodes.filter((node) => !isNodeInViewport(node))
    renderNodes = candidateNodes.filter(isNodeInViewport)
    observeMermaidNodes(deferredNodes, {
      theme: currentTheme,
      darkMode: resolvedDarkMode,
      selector,
      visibleOnly,
    })
  }

  const measurableNodes = renderNodes.filter((node) => {
    const rect = node.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  })
  const zeroSizeNodes = renderNodes.filter((node) => !measurableNodes.includes(node))
  if (zeroSizeNodes.length) {
    observeMermaidNodes(zeroSizeNodes, {
      theme: currentTheme,
      darkMode: resolvedDarkMode,
      selector,
      visibleOnly,
    })
  }
  renderNodes = measurableNodes

  if (!renderNodes.length) return

  console.time(`Loaded [${currentTheme}]`)
  processing = true
  renderNodes.forEach((node) => {
    node.toggleAttribute('data-processing', true)
  })

  // https://mermaid.js.org/config/schema-docs/config.html
  mermaid.initialize({
    startOnLoad: false,
    darkMode: resolvedDarkMode,
    theme: currentTheme,
    securityLevel: mermaidConfig.securitylevel,
    look: mermaidConfig.look,
    layout: mermaidConfig.layout,
    fontFamily: mermaidConfig.fontfamily,
    altFontFamily: mermaidConfig.fontfamily
  })
  // skip data-processed elements in Mermaid run function, so this won't re-render
  await runMermaidInBatches(renderNodes)
  processing = false
  console.timeEnd(`Loaded [${currentTheme}]`)

  const nextTask = queuedTasks.shift()
  if (typeof nextTask === 'function') {
    nextTask()
  }
}

async function initMermaid() {
	const mermaidElements = document.querySelectorAll('.mermaid, .mermaid-dark, .mermaid-neutral')
  if (!mermaidElements.length) return
	console.log(
		`%c💫 FixIt Mermaid`,
		'color: #FF3670; font-weight: bold; font-size: 16px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);',
	)
  initMermaidDiagramControls()
  if (!panzoomEventBound) {
    panzoomEventBound = true
    document.addEventListener('fixit:mermaid-rendered', (event) => {
      const svgId = event?.detail?.svgId
      if (!svgId) return
      bindMermaidPanzoom(document.getElementById(svgId))
    })
  }
  if (!tabContainerEventBound) {
    tabContainerEventBound = true
    document.addEventListener('tab-container-changed', async (event) => {
      const panel = event?.panel || event?.detail?.relatedTarget
      if (!panel) return
      await nextFrame()
      await nextFrame()
      renderMermaidInRoot(panel, { watchViewport: false })
    })
  }
  if (!mermaidThemeSyncBound) {
    mermaidThemeSyncBound = true
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

    const resolveSourceSvg = (container) => {
      const active = getActivePanzoomSvg(container)
      const nowDark = isDarkMode()
      const fallback = nowDark
        ? container.querySelector('.mermaid svg')
        : container.querySelector('.mermaid-dark svg')
      const group = active ? getMermaidPanzoomGroup(active) : null
      const last = group?.lastSvg
      if (last?.isConnected) return last
      return fallback || active
    }

    const sync = () => {
      if (!mermaidPanzoomGroups) return
      document.querySelectorAll('.diagram-view .diagram-container').forEach((container) => {
        const currentActive = getActivePanzoomSvg(container)
        if (!currentActive) return
        const group = getMermaidPanzoomGroup(currentActive)
        if (!group) return

        const sourceSvg = resolveSourceSvg(container)
        const sourceTransform = safeGetTransformFromSvg(sourceSvg)
        if (sourceTransform) group.transform = sourceTransform

        if (!group.transform) return

        const instance = panzoomInstances?.get?.(currentActive)
        if (instance) {
          applyPanzoomTransform(instance, group.transform)
        } else {
          applyPanzoomTransformToSvg(currentActive, group.transform)
        }
      })
    }
    if (window.fixit?.switchThemeEventSet?.add) {
      window.fixit.switchThemeEventSet.add(async () => {
        await nextFrame()
        await nextFrame()
        sync()
      })
    }
  }

  const currentTheme = getTheme()
  const nextTheme = getTheme(true)
  const darkMode = isDarkMode()
  // Render visible diagrams first to keep interaction smooth.
  await loadMermaid({ theme: currentTheme, darkMode, visibleOnly: true, watchViewport: true })

  // Defer non-critical rendering to idle time.
  runWhenIdle(() => {
    loadMermaid({ theme: currentTheme, darkMode, watchViewport: true })
  })
  runWhenIdle(() => {
    loadMermaid({ theme: nextTheme, darkMode: !darkMode, watchViewport: true })
  })
  runWhenIdle(() => {
    loadMermaid({ theme: 'neutral', darkMode: false, selector: '.mermaid-neutral', watchViewport: false })
  })

  document.querySelectorAll('.diagram-view .mermaid[data-processed] svg, .diagram-view .mermaid-dark[data-processed] svg').forEach(bindMermaidPanzoom)
}

window.FixItMermaid = {
  config: mermaidConfig,
  load: loadMermaid,
  init: initMermaid,
}
window.mermaid = mermaid
