/**
 * Enable lightGallery on images inside comment containers.
 * @param comments - CSS selector for comment content containers.
 * @param images - CSS selector for images within those containers.
 */
export function initCommentLightGallery(comments: string, images: string) {
  if (!window.lightGallery)
    return

  document.querySelectorAll<HTMLElement>(comments).forEach(($content) => {
    const $imgs = $content.querySelectorAll<HTMLImageElement>(`${images}:not([lightgallery-loaded])`)
    $imgs.forEach(($img) => {
      $img.setAttribute('lightgallery-loaded', '')
      const $link = document.createElement('a')
      $link.setAttribute('class', 'comment-lightgallery')
      $link.setAttribute('href', $img.src)
      $link.append($img.cloneNode())
      $img.replaceWith($link)
    })
    if ($imgs.length) {
      window.lightGallery($content, {
        selector: '.comment-lightgallery',
        actualSize: false,
        hideBarsDelay: 2000,
        speed: 400,
      })
    }
  })
}
