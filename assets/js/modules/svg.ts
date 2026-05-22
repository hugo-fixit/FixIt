/** SVG module — inline SVG icon loading from data-svg-src attributes. */
import type { SvgService } from '../core/tokens'
import { forEach } from '../utils'

export class SvgModule implements SvgService {
  /** Fetch and inline SVG icons referenced by `data-svg-src` attributes. */
  initSVGIcon() {
    forEach(document.querySelectorAll<HTMLElement>('[data-svg-src]'), ($icon) => {
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
}
