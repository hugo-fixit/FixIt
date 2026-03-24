export function forEach(elements, handler) {
  elements = elements || [];
  const promises = [];
  for (let i = 0; i < elements.length; i++) {
    const result = handler(elements[i], i);
    if (result instanceof Promise) {
      promises.push(result);
    }
  }
  return Promise.all(promises);
}

export function getScrollTop() {
  return (document.documentElement ?? document.body).scrollTop;
}

export function isMobile() {
  return window.matchMedia('only screen and (max-width: 680px)').matches;
}

export function isTocStatic() {
  return document.getElementById('toc-static').dataset.kept === 'true' || window.matchMedia('only screen and (max-width: 960px)').matches;
}

/**
 * add animate to element
 * @param {Element} element animate element
 * @param {String|Array<String>} animation animation name
 * @param {Boolean} reserved reserved animation
 * @param {Function} callback remove callback
 */
export function animateCSS(element, animation, reserved, callback) {
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
export function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * scroll some element into view
 * @param {String} selector element to scroll
 */
export function scrollIntoView(selector) {
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
export function getStagingDOM() {
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
 * create a copy text function with fallback
 * @returns {Function} copy text function
 */
export function createCopyText() {
  if (navigator.clipboard) {
    return (text) => navigator.clipboard.writeText(text);
  }
  return (text) => new Promise((resolve, reject) => {
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
}

/**
 * check if a string is a JS object string
 * @example isObjectLiteral("{a:1,b:2}") // true
 * @param {String} str string to check
 * @returns {Boolean} whether the string is a JS object string
 */
export function isObjectLiteral(str) {
  if (typeof str !== 'string') {
    return false;
  }
  str = str.replace(/\s+/g, ' ').trim().replace(/;$/, '')
  if (str.startsWith('{') && str.endsWith('}')) {
    return true;
  }
  return false;
}

export function HTMLEscape(str) {
  return str.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}
