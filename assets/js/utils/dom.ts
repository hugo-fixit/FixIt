/**
 * Get the current vertical scroll position.
 * @returns The scroll offset in pixels.
 */
export function getScrollTop(): number {
  return (document.documentElement ?? document.body).scrollTop
}

/**
 * Scroll an element into view smoothly.
 * @param selector - A CSS selector or `#id` string targeting the element.
 */
export function scrollIntoView(selector: string) {
  const element = selector.startsWith('#')
    ? document.getElementById(selector.slice(1))
    : document.querySelector(selector)
  element?.scrollIntoView({
    behavior: 'smooth',
  })
}

/**
 * Create a hidden staging element for temporary DOM operations.
 * @returns A staging object with `stage`, `contentAsHtml`, `contentAsText`, `contentAsJson`, and `destroy` methods.
 */
export function getStagingDOM() {
  const stagingElement = document.createElement('div')
  stagingElement.style.display = 'none'
  stagingElement.dataset.stagingId = Math.random().toString(36).slice(2)
  document.body.appendChild(stagingElement)

  return {
    $el: stagingElement,
    stage(dom: Node) {
      stagingElement.innerHTML = ''
      stagingElement.appendChild(dom)
    },
    contentAsHtml(): string {
      return stagingElement.innerHTML
    },
    contentAsText(): string {
      return stagingElement.textContent ?? ''
    },
    contentAsJson(): any {
      return JSON.parse(stagingElement.innerHTML)
    },
    destroy() {
      document.body.removeChild(stagingElement)
    },
  }
}
