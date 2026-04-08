/**
 * Iterate over an array-like collection.
 * If any handler call returns a Promise, all Promises are collected and returned.
 * @param {ArrayLike<*>|Array<*>} elements collection to iterate
 * @param {Function} handler callback for each item
 * @returns {Promise<Array<*>>} resolved results for async handlers
 */
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

/**
 * Get the current vertical scroll position.
 * @returns {number} current scroll top
 */
export function getScrollTop() {
  return (document.documentElement ?? document.body).scrollTop;
}

/**
 * Check whether the current viewport matches the mobile breakpoint.
 * @returns {Boolean} whether the viewport is mobile-sized
 */
export function isMobile() {
  return window.matchMedia('only screen and (max-width: 680px)').matches;
}

/**
 * Check whether the table of contents should use the static layout.
 * @returns {Boolean} whether the TOC should be rendered as static
 */
export function isTocStatic() {
  return document.getElementById('toc-static').dataset.kept === 'true' || window.matchMedia('only screen and (max-width: 960px)').matches;
}

/**
 * Get the current theme mode from the root element.
 * @returns {String} one of auto, light, or dark
 */
export function getThemeMode() {
  return document.documentElement.dataset.themeMode || 'auto';
}

/**
 * Check whether the current effective theme is dark.
 * In auto mode, this follows the system color scheme preference.
 * @returns {Boolean} whether dark mode is currently active
 */
export function isDarkMode() {
  const themeMode = getThemeMode();
  return themeMode === 'auto'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : themeMode === 'dark';
}

/**
 * Add one or more Animate.css classes to an element.
 * @param {Element} element target element
 * @param {String|Array<String>} animation animation name or names
 * @param {Boolean} reserved whether to keep animation classes after completion
 * @param {Function} callback callback invoked after animation ends
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
 * Validate whether a value is a valid Date instance.
 * @param {*} date value to validate
 * @returns {Boolean} whether the value is a valid date
 */
export function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Scroll an element into view smoothly.
 * @param {String} selector selector or id reference beginning with #
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
 * Create a hidden staging element for temporary DOM operations.
 * @returns {Object} staging helpers and the staging element itself
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
 * Create a text-copy helper with clipboard API fallback.
 * @returns {Function} function that copies text and returns a Promise
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
 * Check whether a value is a plain object, or a string that looks like
 * a JavaScript object literal.
 * @example isObjectLiteral({ a: 1 }) // true
 * @example isObjectLiteral("{a:1,b:2}") // true
 * @param {*} value value to check
 * @returns {Boolean} whether the value is object-like
 */
export function isObjectLiteral(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return true;
  }
  if (typeof value !== 'string') {
    return false;
  }
  const normalized = value.replace(/\s+/g, ' ').trim().replace(/;$/, '');
  return normalized.startsWith('{') && normalized.endsWith('}');
}

/**
 * Escape a string for safe HTML text output.
 * @param {String} str string to escape
 * @returns {String} escaped HTML string
 */
export function HTMLEscape(str) {
  return str.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}
