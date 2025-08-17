{{- $mermaid := .Param "mermaid" -}}
{{- $mermaidCDN := $mermaid.cdn | default "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs" -}}

import mermaid from "{{ $mermaidCDN }}"
{{- with $mermaid.zenuml }}
import zenuml from "{{ . }}"
await mermaid.registerExternalDiagrams([zenuml])
{{- end }}
mermaid.startOnLoad = false;
const mermaidConfig = {{ $mermaid | jsonify }}
let processing = false
let delayTask = null

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
  const nodes = document.querySelectorAll(querySelector)

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
    securityLevel: mermaidConfig.securityLevel,
    look: mermaidConfig.look,
    fontFamily: mermaidConfig.fontFamily,
    altFontFamily: mermaidConfig.fontFamily
  })
  // skip data-processed elements in Mermaid run function, so this won't re-render
  await mermaid.run({
    nodes,
    suppressErrors: true,
    postRenderCallback: (svgId) => {
      document.getElementById(svgId).parentElement.toggleAttribute('data-processing', false)
    },
  })
  processing = false
  console.timeEnd(`Loaded [${currentTheme}]`)

  if (delayTask && typeof delayTask === 'function') {
    delayTask();
    delayTask = null;
    // console.log('Delayed task executed');
  }
}

async function initMermaid() {
  const contentEl = document.getElementById('content');
  if (!contentEl || !contentEl.innerHTML) return  
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

console.log(
  `%c💫 FixIt Mermaid`,
  'color: #FF3670; font-weight: bold; font-size: 16px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);',
)

if (document.readyState !== 'loading') {
  initMermaid()
} else {
  document.addEventListener('DOMContentLoaded', initMermaid, false)
}
