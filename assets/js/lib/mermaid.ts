/**
 * Mermaid runtime integration for FixIt.
 *
 * This module is responsible for rendering and maintaining Mermaid diagrams after
 * bootstrapMermaid() loads Mermaid and optional extensions dynamically.
 *
 * Main responsibilities:
 * - Lazy render Mermaid blocks via IntersectionObserver to reduce initial cost.
 * - Render only the currently active diagram layer (light/dark), plus idle-time
 *   neutral rendering for fallback/print scenarios.
 * - Keep Mermaid global initialize() calls serialized to avoid concurrent
 *   initialize/render cross-talk.
 * - Bind pan/zoom behavior and synchronize transforms across light/dark layers
 *   during theme switches.
 * - Wire diagram tab controls (diagram/code switch, zoom/reset/download actions).
 * - React to FixIt events (theme switch, decrypted content, partial decrypted content)
 *   and re-observe/re-render affected containers when context changes.
 *
 * Public entrypoints:
 * - initMermaidRuntime(runtime): register loaded runtime dependencies and bind listeners.
 * - bootstrapMermaid(options): dynamic-import bootstrap entry used by template script.
 */
import type {
  MermaidConfig,
  MermaidRuntime,
  MermaidRuntimeModule,
  PanzoomInstance,
  PanzoomTransform,
  TabContainerChangedEvent,
} from '../types'
import { eventBus } from '../core/event-bus'
import { isDarkMode } from '../utils'

interface MermaidPanzoomGroup {
  container: Element
  transform: PanzoomTransform | null
  svgs: Set<SVGElement>
  lastSvg: SVGElement | null
}

interface RenderOptions {
  theme: string
  darkMode: boolean
}

interface MermaidBootstrapOptions {
  mermaidSource: string
  zenumlSource?: string
  layoutLoaderSources?: string[]
  config: MermaidConfig
}

let mermaid: MermaidRuntimeModule | null = null
let config: MermaidConfig = {}
let hasBoundGlobalEvents = false
let mermaidContainerObserver: IntersectionObserver | null = null
let mermaidRenderLock: Promise<void> = Promise.resolve()
let mermaidConfigKey = ''
let mermaidIdSeq = 0

let panzoomInstances: WeakMap<SVGElement, PanzoomInstance> | null = null
let panzoomWheelHosts: WeakSet<Element> | null = null
let mermaidPanzoomGroups: WeakMap<Element, MermaidPanzoomGroup> | null = null

/**
 * Gets (and initializes) the pan/zoom shared state for a Mermaid diagram container.
 * The group keeps transforms in sync across `.mermaid` and `.mermaid-dark` layers.
 * @param svg Mermaid SVG element inside a diagram container.
 * @returns Shared pan/zoom group state, or null when element is out of supported context.
 */
function getMermaidPanzoomGroup(svg: SVGElement): MermaidPanzoomGroup | null {
  if (!svg.closest('.diagram-view'))
    return null
  const container = svg.closest('.diagram-container')
  if (!container)
    return null

  if (!mermaidPanzoomGroups)
    mermaidPanzoomGroups = new WeakMap()

  let group = mermaidPanzoomGroups.get(container)
  if (!group) {
    group = { container, transform: null, svgs: new Set(), lastSvg: null }
    mermaidPanzoomGroups.set(container, group)
  }

  const svgs = container.querySelectorAll<SVGElement>('.mermaid svg, .mermaid-dark svg')
  svgs.forEach((item) => {
    group?.svgs.add(item)
  })

  return group
}

/**
 * Compares pan/zoom transforms with a small tolerance.
 * Used to avoid redundant sync work during repeated theme switches / re-renders.
 * @param a Source transform.
 * @param b Target transform.
 * @returns Whether two transforms are effectively the same.
 */
function isSamePanzoomTransform(a: PanzoomTransform | null, b: PanzoomTransform | null): boolean {
  if (!a || !b)
    return false

  const eps = 1e-3
  return (
    Math.abs(a.x - b.x) <= eps
    && Math.abs(a.y - b.y) <= eps
    && Math.abs(a.scale - b.scale) <= eps
  )
}

/**
 * Applies a pan/zoom transform to an instance.
 * The pan step is deferred to the next macrotask so zoom can settle first.
 * @param instance Panzoom instance.
 * @param transform Target transform.
 */
function applyPanzoomTransform(instance: PanzoomInstance | null | undefined, transform: PanzoomTransform | null): void {
  if (!instance || !transform)
    return

  const currentTransform: PanzoomTransform = {
    scale: instance.getScale(),
    ...instance.getPan(),
  }
  if (isSamePanzoomTransform(currentTransform, transform))
    return

  instance.zoom(transform.scale, { animate: false, force: true })
  setTimeout(() => instance.pan(transform.x, transform.y, { animate: false, force: true }))
}

/**
 * Schedule low-priority work without blocking critical rendering.
 * @param task Deferred task callback.
 * @param timeout Timeout in milliseconds when browser supports requestIdleCallback.
 */
function runWhenIdle(task: () => void, timeout = 0): void {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(task, { timeout })
    return
  }
  window.setTimeout(task, 80)
}

/**
 * Checks whether a node is currently visible and should be rendered first.
 * @param node Candidate Mermaid host element.
 * @returns Whether node is currently visible and renderable.
 */
function isNodeVisuallyActive(node: Element): boolean {
  if (!isRenderContextActive(node))
    return false

  const nodeStyle = getComputedStyle(node)
  if (nodeStyle.display === 'none' || nodeStyle.visibility === 'hidden')
    return false

  const rect = node.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0
}

/**
 * Checks whether an element is inside an active renderable context.
 * This excludes hidden tab panels / diagram layers and common hidden containers.
 * @param el Candidate element.
 * @returns Whether element is active in current render context.
 */
function isRenderContextActive(el: Element): boolean {
  if (!el.isConnected)
    return false
  if (el.closest('[hidden], .d-none, [aria-hidden="true"]'))
    return false

  const diagramView = el.closest('.diagram-view')
  if (diagramView?.closest('.diagram-tabs') && !diagramView.classList.contains('active'))
    return false

  const panel = el.closest('.tab-panel')
  if (panel instanceof HTMLElement && panel.hidden)
    return false

  return true
}

/**
 * Gets Mermaid theme name for the current effective color scheme.
 * @returns Current Mermaid theme.
 */
function getTheme(): string {
  const themes = config.themes ?? ['default', 'dark']
  const lightTheme = themes[0] ?? 'default'
  const darkTheme = themes[1] ?? lightTheme
  return isDarkMode() ? darkTheme : lightTheme
}

/**
 * Mermaid uses global runtime config; initialize() affects subsequent render().
 * This lock serializes all render work to avoid concurrent initialize/render cross-talk.
 * @param task Async render task.
 * @returns Task result.
 */
function withMermaidLock<T>(task: () => Promise<T>): Promise<T> {
  const run = mermaidRenderLock.then(task, task)
  // Keep the chain alive even after errors so subsequent renders are not blocked.
  mermaidRenderLock = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

/**
 * Initializes Mermaid only when (theme, darkMode) changes.
 * @param theme Mermaid theme name.
 * @param darkMode Whether dark mode is currently active.
 */
function ensureMermaidInitialized(theme: string, darkMode: boolean): void {
  if (!mermaid)
    return

  const key = `${String(theme)}|${darkMode ? '1' : '0'}`
  if (key === mermaidConfigKey)
    return

  // Mermaid initialize() mutates global runtime behavior for following render() calls.
  mermaidConfigKey = key
  mermaid.initialize({
    startOnLoad: false,
    darkMode,
    theme,
    securityLevel: config.securitylevel,
    look: config.look,
    layout: config.layout,
    fontFamily: config.fontfamily,
    altFontFamily: config.fontfamily,
  })
}

/**
 * Renders a single Mermaid host element (`.mermaid`, `.mermaid-dark`, `.mermaid-neutral`).
 * Source uses textContent to avoid HTML entities breaking Mermaid parsing.
 * @param el Mermaid host element.
 * @param options Render options with theme and dark mode.
 */
async function renderMermaidElement(el: Element | null, options: RenderOptions): Promise<void> {
  if (!el || !mermaid || el.hasAttribute('data-processed') || el.hasAttribute('data-processing'))
    return
  if (!isRenderContextActive(el))
    return

  const source = el.textContent?.trim() ?? ''
  if (!source) {
    el.setAttribute('data-processed', '')
    return
  }

  await withMermaidLock(async () => {
    if (!el || !mermaid || el.hasAttribute('data-processed') || !isRenderContextActive(el))
      return

    // Mark processing to prevent duplicate renders from intersect/theme/tab events.
    if (!el.hasAttribute('data-processing'))
      el.setAttribute('data-processing', '')

    ensureMermaidInitialized(options.theme, options.darkMode)

    const id = `fixit-mermaid-${++mermaidIdSeq}`
    try {
      const result = await mermaid.render(id, source)
      const svg = result?.svg ?? ''
      el.innerHTML = svg
      if (typeof result?.bindFunctions === 'function') {
        try {
          result.bindFunctions(el)
        }
        catch {
          // Ignore bind errors from third-party diagrams.
        }
      }

      const svgEl = el.querySelector<SVGElement>('svg')
      if (svgEl && !svgEl.id)
        svgEl.id = id

      el.removeAttribute('data-processing')
      el.setAttribute('data-processed', '')

      const svgId = svgEl?.id ?? id
      if (svgId) {
        const renderedSvg = document.getElementById(svgId)
        if (renderedSvg instanceof SVGElement)
          bindMermaidPanzoom(renderedSvg)
      }
    }
    catch (error) {
      const errDiv = document.getElementById(`d${id}`)
      if (errDiv) {
        el.innerHTML = errDiv.innerHTML
        errDiv.remove()
      }
      el.removeAttribute('data-processing')
      el.setAttribute('data-processed', '')
      console.warn('FixIt Mermaid render failed:', error)
    }
  })
}

/**
 * Collect all diagram containers that contain Mermaid elements.
 * @param root Search root.
 * @returns Diagram containers that contain Mermaid blocks.
 */
function collectMermaidContainers(root: ParentNode = document): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('.diagram-container'))
    .filter(container => container.querySelector('.mermaid, .mermaid-dark, .mermaid-neutral'))
}

/**
 * Core rule: render only when the active layer is visible and not rendered yet.
 * Active layer is `.mermaid` in light mode or `.mermaid-dark` in dark mode.
 * @param container Diagram container.
 */
async function renderActiveLayerInContainer(container: Element | null): Promise<void> {
  if (!container)
    return

  const darkMode = isDarkMode()
  const el = container.querySelector(darkMode ? '.mermaid-dark' : '.mermaid')
  if (!el)
    return
  if (el.hasAttribute('data-processed') || el.querySelector('svg'))
    return
  if (!isNodeVisuallyActive(el))
    return

  await renderMermaidElement(el, { theme: getTheme(), darkMode })
}

/**
 * Neutral theme is not part of live light/dark switching UI.
 * Render it in idle time for print / fallback scenarios.
 */
function scheduleNeutralRender(): void {
  if (window.matchMedia('only screen and (max-width: 960px)').matches)
    return

  runWhenIdle(() => {
    const neutralNodes = Array.from(document.querySelectorAll<Element>('.mermaid-neutral'))
      .filter(el => !el.hasAttribute('data-processed'))
      .filter(isRenderContextActive)

    neutralNodes.forEach((el) => {
      void renderMermaidElement(el, { theme: 'neutral', darkMode: false })
    })
  })
}

/** Lazy rendering via IntersectionObserver. */
function bindMermaidIntersectionObserver(): void {
  if (mermaidContainerObserver)
    return

  mermaidContainerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting)
        return
      const container = entry.target
      if (!container || !isRenderContextActive(container))
        return
      void renderActiveLayerInContainer(container)
    })
  }, {
    root: null,
    // 200px preloading margin lets diagrams render slightly before entering viewport.
    rootMargin: '200px 0px',
    threshold: 0.01,
  })
}

/**
 * Registers Mermaid containers under root into the observer.
 * @param root Search root.
 * @param refresh Whether to re-observe matched containers.
 */
function observeMermaidContainers(root: ParentNode = document, refresh = false): void {
  bindMermaidIntersectionObserver()
  if (!mermaidContainerObserver)
    return

  const containers = collectMermaidContainers(root)
  containers.forEach((container) => {
    if (container.hasAttribute('data-mermaid-observed'))
      return
    container.setAttribute('data-mermaid-observed', '')
    mermaidContainerObserver?.observe(container)
  })

  if (!refresh)
    return

  // Force observer callback refresh after context switches (tab/theme/decrypt events).
  containers.forEach((container) => {
    mermaidContainerObserver?.unobserve(container)
    mermaidContainerObserver?.observe(container)
  })
}

/**
 * Gets the currently visible SVG for a diagram block with multiple Mermaid layers.
 * @param root Diagram block root element.
 * @returns Visible Mermaid SVG, or null.
 */
function getActiveMermaidSvg(root: Element | null): SVGElement | null {
  const nodes = root?.querySelectorAll('.mermaid, .mermaid-dark, .mermaid-neutral')
  if (!nodes?.length)
    return null

  const visible = Array.from(nodes).find((el) => {
    const style = getComputedStyle(el)
    if (style.display === 'none' || style.visibility === 'hidden')
      return false
    const rect = el.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  })

  return visible?.querySelector<SVGElement>('svg') ?? null
}

/**
 * Enables pan/zoom for a Mermaid SVG inside `.diagram-view`.
 * @param svg Mermaid SVG element.
 */
function bindMermaidPanzoom(svg: SVGElement): void {
  if (!svg.closest('.diagram-view'))
    return
  if (!svg.closest('.mermaid, .mermaid-dark'))
    return

  if (!panzoomInstances)
    panzoomInstances = new WeakMap()
  if (!panzoomWheelHosts)
    panzoomWheelHosts = new WeakSet()

  if (panzoomInstances.has(svg))
    return
  if (typeof window.Panzoom !== 'function')
    return

  const group = getMermaidPanzoomGroup(svg)
  const panzoom = window.Panzoom(svg, {
    maxScale: 6,
    minScale: 0.2,
    step: 0.1,
  })
  panzoomInstances.set(svg, panzoom)

  if (group?.transform)
    applyPanzoomTransform(panzoom, group.transform)

  const host = svg.closest<HTMLElement>('.mermaid, .mermaid-dark')
  if (!host)
    return
  if (panzoomWheelHosts.has(host))
    return

  panzoomWheelHosts.add(host)

  host.addEventListener('pointerdown', () => {
    const currentSvg = host.querySelector<SVGElement>('svg')
    if (group && currentSvg)
      group.lastSvg = currentSvg
  }, false)

  host.addEventListener('wheel', (event: WheelEvent) => {
    if (!event.ctrlKey)
      return

    const currentSvg = host.querySelector<SVGElement>('svg')
    const instance = currentSvg ? panzoomInstances?.get(currentSvg) : null
    if (!instance)
      return

    if (group && currentSvg)
      group.lastSvg = currentSvg

    event.preventDefault()
    instance.zoomWithWheel(event)
  }, { passive: false })
}

/**
 * Initializes diagram tabs controls:
 * - Diagram/Code tab switching
 * - Zoom/reset/download buttons wiring
 * @param tabs Diagram tabs root element.
 */
async function initSingleDiagramTabs(tabs: HTMLElement): Promise<void> {
  const actions = tabs.querySelector<HTMLElement>('.tabs-actions')
  const diagramTabBtn = tabs.querySelector<HTMLElement>('.tab-item[data-tab="diagram"]')
  const codeTabBtn = tabs.querySelector<HTMLElement>('.tab-item[data-tab="code"]')
  const diagramBlock = tabs.querySelector<HTMLElement>('.diagram-view')
  const codeBlock = Array.from(tabs.querySelectorAll<HTMLElement>('.tabs-content > .code-block'))
    .find(block => !block.classList.contains('diagram-view'))

  if (!actions || !diagramTabBtn || !codeTabBtn || !diagramBlock || !codeBlock)
    return

  const zoomInBtn = tabs.querySelector<HTMLElement>('.diagram-zoom-in-btn')
  const zoomOutBtn = tabs.querySelector<HTMLElement>('.diagram-zoom-out-btn')
  const resetBtn = tabs.querySelector<HTMLElement>('.diagram-reset-btn')
  const downloadBtn = tabs.querySelector<HTMLElement>('.diagram-download-btn')
  tabs.dataset.diagramInit = 'true'

  const diagramActionButtons = [zoomOutBtn, zoomInBtn, resetBtn, downloadBtn].filter(Boolean) as HTMLElement[]
  const movedActionRestore = new WeakMap<HTMLElement, { parent: HTMLElement, next: ChildNode | null }>()
  let codeActionCache: HTMLElement[] = []

  const pinnedFullscreenBtn = codeBlock.querySelector<HTMLElement>('.code-header .fullscreen-btn')
  if (pinnedFullscreenBtn && pinnedFullscreenBtn.parentElement !== actions) {
    actions.appendChild(pinnedFullscreenBtn)
  }

  const collectCodeActions = (): HTMLElement[] => {
    const codeHeader = codeBlock.querySelector<HTMLElement>('.code-header')
    if (codeHeader) {
      return Array.from(codeHeader.querySelectorAll<HTMLElement>('.action-btn'))
        .filter(btn => btn !== pinnedFullscreenBtn)
    }
    return Array.from(codeBlock.querySelectorAll<HTMLElement>('.copy-icon-btn'))
  }

  const getCodeActions = (): HTMLElement[] => {
    if (codeActionCache.length && codeActionCache.some(el => el.isConnected))
      return codeActionCache

    codeActionCache = collectCodeActions()
    return codeActionCache
  }

  const setDiagramActionsVisible = (visible: boolean): void => {
    diagramActionButtons.forEach((btn) => {
      btn.style.display = visible ? '' : 'none'
    })
  }

  const moveToActions = (elements: HTMLElement[]): void => {
    elements.forEach((el) => {
      if (!el || el.parentElement === actions)
        return

      movedActionRestore.set(el, { parent: el.parentElement as HTMLElement, next: el.nextSibling })
      if (pinnedFullscreenBtn && pinnedFullscreenBtn.parentElement === actions) {
        actions.insertBefore(el, pinnedFullscreenBtn)
      }
      else {
        actions.appendChild(el)
      }
    })
  }

  const restoreMoved = (elements: HTMLElement[]): void => {
    elements.forEach((el) => {
      const restore = movedActionRestore.get(el)
      if (!restore?.parent)
        return

      if (restore.next && restore.next.parentNode === restore.parent) {
        restore.parent.insertBefore(el, restore.next)
      }
      else {
        restore.parent.appendChild(el)
      }
      movedActionRestore.delete(el)
    })
  }

  const switchTo = (target: 'diagram' | 'code'): void => {
    const showDiagram = target === 'diagram'
    diagramTabBtn.classList.toggle('active', showDiagram)
    codeTabBtn.classList.toggle('active', !showDiagram)
    diagramBlock.classList.toggle('active', showDiagram)
    codeBlock.classList.toggle('active', !showDiagram)

    const codeActions = getCodeActions()
    if (showDiagram) {
      setDiagramActionsVisible(true)
      // Restore code actions back to code header in diagram mode.
      restoreMoved(codeActions)
    }
    else {
      setDiagramActionsVisible(false)
      // Move code actions into tab action area while code tab is active.
      moveToActions(codeActions)
    }
  }

  const resolvePanzoom = (): PanzoomInstance | null => {
    const svg = getActiveMermaidSvg(diagramBlock)
    return svg && panzoomInstances ? (panzoomInstances.get(svg) ?? null) : null
  }

  diagramTabBtn.addEventListener('click', () => switchTo('diagram'), false)
  codeTabBtn.addEventListener('click', () => switchTo('code'), false)

  zoomInBtn?.addEventListener('click', () => {
    const panzoom = resolvePanzoom()
    if (!panzoom?.zoomIn)
      return
    try {
      panzoom.zoomIn({ animate: true })
    }
    catch {
      panzoom.zoomIn()
    }
  }, false)

  zoomOutBtn?.addEventListener('click', () => {
    const panzoom = resolvePanzoom()
    if (!panzoom?.zoomOut)
      return
    try {
      panzoom.zoomOut({ animate: true })
    }
    catch {
      panzoom.zoomOut()
    }
  }, false)

  resetBtn?.addEventListener('click', () => {
    const panzoom = resolvePanzoom()
    if (!panzoom?.reset)
      return
    try {
      panzoom.reset({ animate: true })
    }
    catch {
      panzoom.reset()
    }
  }, false)

  downloadBtn?.addEventListener('click', () => {
    const svg = getActiveMermaidSvg(diagramBlock)
    if (!svg)
      return

    const clonedSvg = svg.cloneNode(true)
    if (!(clonedSvg instanceof SVGElement))
      return

    // Remove style attribute (transform etc.) that may interfere with proper rendering in external viewers
    clonedSvg.removeAttribute('style')
    const xml = new XMLSerializer().serializeToString(clonedSvg)
    const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const filename = diagramBlock.dataset.filename ?? 'mermaid.mmd'

    link.href = url
    link.download = `${filename.split('.')[0]}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, false)
}

/** Initializes Mermaid diagram tab controls for newly discovered blocks. */
function initDiagramControls(): void {
  const tabsList = document.querySelectorAll<HTMLElement>('.diagram-tabs[data-diagram="mermaid"]:not([data-diagram-init])')
  tabsList.forEach((tabs) => {
    void initSingleDiagramTabs(tabs)
  })
}

/** Binds tab switch listener so Mermaid in tab panels renders after tab changes. */
function bindTabContainerChanged(): void {
  document.addEventListener('tab-container-changed', (event: TabContainerChangedEvent) => {
    const panel = event.panel ?? event.detail?.relatedTarget
    if (!panel)
      return
    observeMermaidContainers(panel, true)
  }, false)
}

/** Binds theme switch sync for pan/zoom transforms across Mermaid layers. */
function bindThemeSync(): void {
  const getActivePanzoomSvg = (container: Element): SVGElement | null => {
    const nodes = container.querySelectorAll('.mermaid, .mermaid-dark')
    if (!nodes.length)
      return null

    const visible = Array.from(nodes).find((el) => {
      const style = getComputedStyle(el)
      if (style.display === 'none' || style.visibility === 'hidden')
        return false
      const rect = el.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    })

    return visible?.querySelector<SVGElement>('svg') ?? null
  }

  const safeGetTransformFromSvg = (svg: SVGElement | null): PanzoomTransform | null => {
    const instance = svg ? panzoomInstances?.get(svg) : null
    if (!instance?.getPan || !instance?.getScale)
      return null

    try {
      const pan = instance.getPan()
      const scale = instance.getScale()
      if (pan && typeof scale === 'number')
        return { x: pan.x, y: pan.y, scale }
    }
    catch {
      return null
    }

    return null
  }

  const sync = (nowDark: boolean): void => {
    if (!mermaidPanzoomGroups)
      return

    document.querySelectorAll('.diagram-view .diagram-container').forEach((container) => {
      const currentActive = getActivePanzoomSvg(container)
      // Read transform from the layer that was visible before theme flip.
      const fallbackSource = nowDark
        ? container.querySelector<SVGElement>('.mermaid svg')
        : container.querySelector<SVGElement>('.mermaid-dark svg')

      const groupSeed = currentActive ?? fallbackSource
      if (!groupSeed)
        return

      const group = getMermaidPanzoomGroup(groupSeed)
      if (!group)
        return

      const last = group.lastSvg
      const sourceSvg = last?.isConnected ? last : (fallbackSource ?? currentActive)
      const sourceTransform = safeGetTransformFromSvg(sourceSvg)
      if (sourceTransform)
        group.transform = sourceTransform

      if (!group.transform)
        return

      if (currentActive) {
        const instance = panzoomInstances?.get(currentActive)
        applyPanzoomTransform(instance, group.transform)
      }
    })
  }

  eventBus.on('fixit:switch-theme', ({ detail }) => {
    if (!detail?.isChanged)
      return

    sync(detail.isDark)
    observeMermaidContainers(document, true)
  })
}

/** Initializes Mermaid rendering, events, lazy loading and diagram controls. */
function initMermaid(): void {
  const mermaidElements = document.querySelectorAll('.mermaid, .mermaid-dark, .mermaid-neutral')
  if (!mermaidElements.length)
    return

  initDiagramControls()
  observeMermaidContainers()
  scheduleNeutralRender()
}

/** Binds Mermaid global listeners once per page lifecycle. */
function bindGlobalEventsOnce(): void {
  if (hasBoundGlobalEvents)
    return

  hasBoundGlobalEvents = true
  // eslint-disable-next-line no-console
  console.log(
    '%c💫 FixIt Mermaid',
    'color: #FF3670; font-weight: bold; font-size: 16px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);',
  )
  bindThemeSync()
  bindTabContainerChanged()

  initMermaid()
  eventBus.on('fixit:decrypted', initMermaid)
  eventBus.on('fixit:partial-decrypted', initMermaid)
}

/**
 * Initializes Mermaid runtime with externally loaded dependencies.
 * Accepts the core Mermaid module + optional zenuml/layout loaders.
 * @param runtime Runtime object with Mermaid module, config and optional extensions.
 */
export async function initMermaidRuntime(runtime: MermaidRuntime): Promise<void> {
  mermaid = runtime.mermaid
  config = runtime.config

  const externalDiagrams: unknown[] = []
  if (runtime.zenuml)
    externalDiagrams.push(runtime.zenuml)

  if (externalDiagrams.length && typeof mermaid.registerExternalDiagrams === 'function') {
    try {
      await mermaid.registerExternalDiagrams(externalDiagrams)
    }
    catch (error) {
      console.warn('FixIt Mermaid registerExternalDiagrams failed:', error)
    }
  }

  const loaders: unknown[] = []
  runtime.loaders.forEach((item) => {
    if (Array.isArray(item))
      loaders.push(...item)
    else
      loaders.push(item)
  })

  if (loaders.length && typeof mermaid.registerLayoutLoaders === 'function') {
    try {
      mermaid.registerLayoutLoaders(loaders)
    }
    catch (error) {
      console.warn('FixIt Mermaid registerLayoutLoaders failed:', error)
    }
  }

  mermaid.startOnLoad = false
  window.mermaid = mermaid

  document.addEventListener('DOMContentLoaded', bindGlobalEventsOnce, { once: true })
  if (document.readyState !== 'loading')
    bindGlobalEventsOnce()
}

/**
 * Unwraps ESM default export shape used by third-party CDN modules.
 * @param mod Imported module object.
 * @returns Default export when present, otherwise module itself.
 */
function unwrapModule<T>(mod: { default?: T } | T): T {
  if (mod && typeof mod === 'object' && 'default' in mod) {
    return (mod as { default?: T }).default as T
  }
  return mod as T
}

/**
 * Bootstrap entry used by template-injected script.
 * Loads Mermaid and optional extensions via dynamic import and hands runtime to initMermaidRuntime.
 * @param options Bootstrap options provided by template-injected script.
 */
export async function bootstrapMermaid(options: MermaidBootstrapOptions): Promise<void> {
  const { mermaidSource, zenumlSource = '', layoutLoaderSources = [], config } = options

  try {
    // Mermaid core module is required; optional modules degrade gracefully.
    const mermaidMod = await import(mermaidSource)
    const mermaid = unwrapModule<MermaidRuntimeModule>(mermaidMod)

    let zenuml: unknown
    if (zenumlSource) {
      try {
        const zenumlMod = await import(zenumlSource)
        zenuml = unwrapModule(zenumlMod)
      }
      catch (error) {
        console.warn('FixIt Mermaid zenuml load failed:', error)
      }
    }

    const loaded = await Promise.all(layoutLoaderSources.map(async (source) => {
      try {
        const loaderMod = await import(source)
        return unwrapModule(loaderMod)
      }
      catch (error) {
        console.warn('FixIt Mermaid layout loader load failed:', source, error)
        return null
      }
    }))

    const runtime: MermaidRuntime = {
      mermaid,
      config,
      zenuml,
      // Keep only successfully loaded optional loaders.
      loaders: loaded.filter(item => item !== null),
    }
    await initMermaidRuntime(runtime)
  }
  catch (error) {
    console.warn('FixIt Mermaid bootstrap failed:', error)
  }
}
