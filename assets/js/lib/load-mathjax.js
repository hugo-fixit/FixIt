import * as params from '@params'

/**
 * Load MathJax script dynamically
 */
function loadMathJax() {
  const script = document.createElement('script')
  script.src = params.cdn || 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
  script.async = true
  document.head.appendChild(script)
}

/**
 * Configuring MathJax
 * https://docs.mathjax.org/en/latest/options/index.html
 */
window.MathJax = {
  tex: {
    displayMath: [['\\[', '\\]'], ['$$', '$$']],
    inlineMath: [['\\(', '\\)'], ['$', '$']],
    packages: {
      ...params.packages,
    },
    // custom macros
    macros: {
      // make \KaTeX command work in MathJax
      KaTeX: '{K\\kern-.325em\\raise.21em{\\scriptstyle{A}}\\kern-.17em\\TeX}',
      ...params.macros,
    },
    ...params.tex,
  },
  loader: {
    ...params.loader,
    failed: function (error) {
      console.error(`MathJax(${error.package || '?'}): ${error.message}`);
    },
  },
  options: {
    ignoreHtmlClass: 'comment',
    processHtmlClass: 'content',
    ...params.options,
  }
}

loadMathJax()
