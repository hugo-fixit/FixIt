/**
 * Add one or more Animate.css classes to an element.
 * @param element - The DOM element to animate.
 * @param animation - One or more Animate.css class names.
 * @param reserved - If `true`, keep animation classes after completion.
 * @param callback - Optional callback invoked when the animation ends.
 */
export function animateCSS(element: Element, animation: string | string[], reserved?: boolean, callback?: () => void) {
  const animations = Array.isArray(animation)
    ? animation
    : [animation]
  // Re-adding an active animation does not restart it, so its animationend event
  // would never fire and the listener below would leak. Skip duplicate calls.
  if (element.classList.contains('animate__animated') && animations.every(name => element.classList.contains(name)))
    return
  element.classList.add('animate__animated', ...animations)
  element.addEventListener('animationend', () => {
    !reserved && element.classList.remove('animate__animated', ...animations)
    typeof callback === 'function' && callback()
  }, { once: true })
}
