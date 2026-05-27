export interface MermaidConfig {
  wrapper?: boolean
  cdn?: string
  zenuml?: string
  themes?: string[]
  securitylevel?: string
  look?: string
  fontfamily?: string
  layoutloaders?: string[]
  layout?: string
}

export interface MermaidRenderResult {
  svg?: string
  bindFunctions?: (element: Element) => void
}

export interface MermaidRuntimeModule {
  startOnLoad: boolean
  initialize: (config: Record<string, unknown>) => void
  render: (id: string, source: string) => Promise<MermaidRenderResult>
  registerExternalDiagrams?: (diagrams: unknown[]) => Promise<void>
  registerLayoutLoaders?: (loaders: unknown[]) => void
}

export interface MermaidRuntime {
  mermaid: MermaidRuntimeModule
  config: MermaidConfig
  zenuml?: unknown
  loaders: unknown[]
}

export interface PanzoomTransform {
  x: number
  y: number
  scale: number
}

export interface PanzoomInstance {
  getPan: () => { x: number, y: number }
  getScale: () => number
  pan: (x: number, y: number, options?: { animate?: boolean, force?: boolean }) => void
  zoom: (scale: number, options?: { animate?: boolean, force?: boolean }) => void
  zoomIn: (options?: { animate?: boolean }) => void
  zoomOut: (options?: { animate?: boolean }) => void
  zoomWithWheel: (event: WheelEvent) => void
  reset: (options?: { animate?: boolean }) => void
}
