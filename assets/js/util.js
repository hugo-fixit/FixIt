export default class Util {
  forEach(elements, handler) {
    elements = elements || [];
    for (let i = 0; i < elements.length; i++) {
      handler(elements[i]);
    }
  }

  getScrollTop() {
    return (document.documentElement ?? document.body).scrollTop;
  }

  isMobile() {
    return window.matchMedia('only screen and (max-width: 680px)').matches;
  }

  isTocStatic() {
    return window.matchMedia('only screen and (max-width: 960px)').matches;
  }

  /**
   * add animate to element
   * @param {Element} element animate element
   * @param {String|Array<String>} animation animation name
   * @param {Boolean} reserved reserved animation
   * @param {Function} callback remove callback
   */
  animateCSS(element, animation, reserved, callback) {
    !Array.isArray(animation) && (animation = [animation]);
    element.classList.add('animate__animated', ...animation);
    element.addEventListener('animationend', () => {
      !reserved && element.classList.remove('animate__animated', ...animation);
      typeof callback === 'function' && callback();
    }, { once: true });
  }

  /**
   * date validator
   * @param {*} date may be date or not
   * @returns {Boolean}
   */
  isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
  }
  
  /**
   * scroll some element into view
   * @param {String} selector element to scroll
   */
  scrollIntoView(selector) {
    const element = selector.startsWith('#')
      ? document.getElementById(selector.slice(1))
      : document.querySelector(selector);
    element?.scrollIntoView({
      behavior: 'smooth'
    });
  }
}
