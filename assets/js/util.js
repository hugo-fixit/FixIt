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

  /**
   * get a hidden element for temporary use
   * @returns {Object} { $el: Element, destroy: Function }
   */
  getStagingDOM() {
    const stagingElement = document.createElement('div')
    stagingElement.style.display = 'none';
    stagingElement.dataset.stagingId = Math.random().toString(36).slice(2);
    document.body.appendChild(stagingElement);

    return {
      $el: stagingElement,
      stage(dom) {
        stagingElement.innerHTML = '';
        stagingElement.appendChild(dom);
      },
      contentAsHtml() {
        return stagingElement.innerHTML;
      },
      contentAsText() {
        return stagingElement.innerText;
      },
      contentAsJson() {
        return JSON.parse(stagingElement.innerHTML);
      },
      destroy() {
        document.body.removeChild(stagingElement);
      }
    }
  }

  /**
   * copy text to clipboard
   * @param {String} text text to copy
   * @returns {Promise} promise
   */
  copyText(text) {
    if (navigator.clipboard) {
      this.copyText = (text) => navigator.clipboard.writeText(text);
      return this.copyText(text);
    }
    this.copyText = (text) => new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      if (document.execCommand('copy')) {
        document.body.removeChild(input);
        resolve();
      } else {
        reject();
      }
    });
    return this.copyText(text);
  }

  /**
   * check if a string is a JS object string
   * @example isObjectString("{a:1,b:2}") // true
   * @param {String} str 
   * @returns 
   */
  isObjectString(str) {
    if (typeof str !== 'string') {
      return false;
    }
    str = str.replace(/\s+/g, ' ').trim();
    if (str.startsWith('{') && str.endsWith('}')) {
      return true;
    }
    return false;
  }
}
