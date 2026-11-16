/** Fetch and inline SVG icons referenced by `data-svg-src` attributes. */
export function initSVGIcon() {
  document.querySelectorAll<HTMLElement>('[data-svg-src]').forEach(($icon) => {
    fetch($icon.dataset.svgSrc!)
      .then(response => response.text())
      .then((svg) => {
        const $temp = document.createElement('div')
        $temp.insertAdjacentHTML('afterbegin', svg)
        const $svg = $temp.firstChild as SVGElement
        $svg.dataset.svgSrc = $icon.dataset.svgSrc
        $svg.classList.add('icon')
        const $titleElements = $svg.getElementsByTagName('title')
        $titleElements.length && $svg.removeChild($titleElements[0])
        $icon.parentElement!.replaceChild($svg, $icon)
      })
      .catch((err) => {
        console.error(err)
      })
  })
}
