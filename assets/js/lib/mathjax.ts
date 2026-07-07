/**
 * MathJax integration for FixIt.
 *
 * Responsibilities:
 * - Build MathJax global configuration from theme runtime options.
 * - Register default delimiters/macros and allow user-level overrides.
 * - Load the MathJax runtime script dynamically from configured CDN.
 */
import { eventBus } from '../core/event-bus'

/**
 * Bootstrap MathJax by setting up the global configuration and loading the script.
 * @see https://docs.mathjax.org/en/latest/options/index.html
 */
function bootstrapMathJax() {
  const params = window.config.mathjax || {}

  const loadMathJax = () => {
    const script = document.createElement('script')
    script.src = params.cdn || 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
    script.async = true
    document.head.appendChild(script)
  }

  const configureMathJax = () => {
    window.MathJax = {
      tex: {
        displayMath: [['\\[', '\\]'], ['$$', '$$']],
        inlineMath: [['\\(', '\\)'], ['$', '$']],
        packages: {
          ...params.packages,
        },
        macros: {
          // make \KaTeX command work in MathJax
          KaTeX: '{K\\kern-.325em\\raise.21em{\\scriptstyle{A}}\\kern-.17em\\TeX}',
          ...params.macros,
        },
        ...params.tex,
      },
      loader: {
        ...params.loader,
        failed(error: { package?: string, message: string }) {
          console.error(`MathJax(${error.package || '?'}): ${error.message}`)
        },
      },
      options: {
        processHtmlClass: 'content',
        ...params.options,
      },
    }
  }

  loadMathJax()
  configureMathJax()
}

/**
 * Trigger MathJax re-typesetting if MathJax is loaded.
 */
function initMathJax(el?: Element) {
  const elements = el ? [el] : undefined
  if (window.MathJax?.typesetPromise) {
    window.MathJax.typesetPromise(elements).then(() => {
      // Do something else after typesetting is complete
    }).catch((err: Error) => console.warn(err.message))
  }
}

document.addEventListener('DOMContentLoaded', () => {
  bootstrapMathJax()
  eventBus.on('fixit:content-decrypted', ({ detail }) => {
    initMathJax(detail.target)
  })
})
