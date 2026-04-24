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
  const panel = node.closest('.tab-panel')
  if (panel) {
    const style = getComputedStyle(panel)
    if (style.display === 'none' || style.visibility === 'hidden' || panel.hidden) {
      return false
    }
    // hidden panels in tab container are often measured as auto sizing placeholders
    if (style.height === 'auto' && style.width === 'auto') {
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
        document.getElementById(svgId)?.parentElement?.toggleAttribute('data-processing', false)
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
}

window.FixItMermaid = {
  config: mermaidConfig,
  load: loadMermaid,
  init: initMermaid,
}
window.mermaid = mermaid
