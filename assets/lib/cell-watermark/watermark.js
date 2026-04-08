/* global Watermark */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], () => factory());
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root['Watermark'] = factory();
  }
})(this, function () {
  var _parentEle;
  var _wmContainer;
  var _wmObserver;
  var _wmParentObserver;
  var _resizeHandler;
  var _windowsWidth = window.outerWidth;
  var _windowsHeight = window.outerHeight;

  /**
   * Create DOM of watermark's container
   * @param {Watermark} watermark
   */
  var _createContainer = function (watermark) {
    watermark._container = document.createElement('div');
    watermark._container.classList.add('cell-watermark-container');
    watermark._container.style.cssText = 'display: block; pointer-events: none;';
    watermark._container.setAttribute('aria-hidden', true);
    _parentEle = document.querySelector(watermark.options.appendTo) || document.body;
    _parentEle.appendChild(watermark._container);
  };

  /**
   * Create watermark's DOM
   * @param {Watermark} watermark
   * @param {Object} options
   */
  var _createWatermark = function (watermark, options) {
    options.rowSpacing = options.rowSpacing || 60;
    options.colSpacing = options.colSpacing || 30;
    options.width = options.width || 150;
    options.height = options.height || 20;
    let rows = parseInt(_windowsHeight / (options.height + options.rowSpacing));
    let cols = parseInt(_windowsWidth / (options.width + options.colSpacing));
    let offsetLeft = (_windowsWidth - options.width * cols - options.colSpacing * (cols - 1)) / 2;
    let offsetTop = (_windowsHeight - options.height * rows - options.rowSpacing * (rows - 1)) / 2;
    let watermarkBase = document.createElement('div');
    watermarkBase.classList.add('cell-watermark');
    watermarkBase.style.cssText =
      'transform: rotate(15deg); opacity: 0.1; font-size: 0.85rem; text-align: center;' +
      'position: fixed; user-select: none; word-break: break-all; overflow: hidden; z-index: 999999;';
    for (let row = 0; row < rows; row++) {
      let top = offsetTop + (options.rowSpacing + options.height) * row;
      let tempCols = cols;
      row % 2 !== 0 && tempCols++;
      for (let col = 0; col < tempCols; col++) {
        let left = offsetLeft + (options.colSpacing + options.width) * col;
        tempCols !== cols && (left -= (options.colSpacing + options.width) / 2);
        let watermarkEle = watermarkBase.cloneNode();
        watermarkEle.style.cssText += `left: ${left}px; top: ${top}px; width: ${options.width}px; height: ${options.height}px`;
        watermarkEle.style.transform = `rotate(${options.rotate}deg)`;
        watermarkEle.style.opacity = options.opacity;
        watermarkEle.style.fontSize = `${options.fontSize}rem`;
        watermarkEle.style.fontFamily = options.fontFamily;
        watermarkEle.innerHTML = options.content;
        watermark._container.appendChild(watermarkEle);
      }
    }
    // Backup for recover the watermark's container when the its DOM is removed
    _wmContainer = watermark._container;
  };

  /**
   * Rerender watermark
   * @param {Watermark} watermark
   * @param {Object} options
   */
  var _render = function (watermark, options) {
    _wmObserver.disconnect();
    watermark._container.innerHTML = '';
    _createWatermark(watermark, options);
    _wmObserver.observe(watermark._container, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });
  };

  /**
   * Observe watermark and watermark's parentNode mutations
   * @param {Watermark} watermark
   */
  var _addObserve = function (watermark) {
    // Observe watermark element and its child element
    _wmObserver = new MutationObserver(function (mutations, observer) {
      _render(watermark, watermark.options);
    });
    _wmObserver.observe(watermark._container, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });
    // Observe parent element, recreate if the element is deleted
    _wmParentObserver = new MutationObserver(function (mutations) {
      for (let m of mutations) {
        if (
          m.type === 'childList' &&
          m.removedNodes.length > 0 &&
          document.querySelectorAll('.cell-watermark-container').length === 0
        ) {
          _parentEle.appendChild(_wmContainer);
        }
      }
    });
    _wmParentObserver.observe(watermark._container.parentNode, {
      childList: true,
      subtree: true
    });
  };

  /**
   * Window's resize listener
   * @param {Watermark} watermark
   */
  var _addResizeListener = function (watermark) {
    _resizeHandler = function () {
      if (window.outerHeight !== _windowsHeight || window.outerWidth !== _windowsWidth) {
        _windowsHeight = window.outerHeight;
        _windowsWidth = window.outerWidth;
        _render(watermark, watermark.options);
      }
    };
    window.addEventListener('resize', _resizeHandler);
  };

  /**
   * Constructor of Watermark
   * @class Watermark
   * @classdesc Create watermark for webpage and automatic adjust when windows resize.
   * @param {Object} options
   * @param {String} [options.content] watermark's text
   * @param {String} [options.appendTo='body'] parent of watermark's container
   * @param {Number} [options.width=150] watermark's width. unit: px
   * @param {Number} [options.height=20] watermark's height. unit: px
   * @param {Number} [options.rowSpacing=60] row spacing of watermarks. unit: px
   * @param {Number} [options.colSpacing=30] col spacing of watermarks. unit: px
   * @param {Number} [options.rotate=15] watermark's tangent angle. unit: deg
   * @param {Number} [options.opacity=0.1] watermark's transparency
   * @param {Number} [options.fontSize=0.85] watermark's fontSize. unit: rem
   * @param {Number} [options.fontFamily='inherit'] watermark's fontFamily.
   * @version 1.0.4
   * @author Lruihao
   */
  function Watermark(options = {}) {
    var _proto = Watermark.prototype;
    this.options = options;
    _createContainer(this);
    _createWatermark(this, this.options);
    _addObserve(this);
    _addResizeListener(this);

    /**
     * Upload watermark's text content
     * @param {String} content watermark's text
     * @name Watermark#upload
     * @function
     * @since 1.0.0
     */
    _proto.upload = function (content) {
      if (!content) {
        return;
      }
      _wmParentObserver.disconnect();
      _wmObserver.disconnect();
      this.options.content = content;
      for (const watermark of this._container.querySelectorAll('.cell-watermark')) {
        watermark.innerHTML = content;
      }
      _wmParentObserver.observe(this._container.parentNode, {
        childList: true,
        subtree: true
      });
      _wmObserver.observe(this._container, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });
    };

    /**
     * Rerender watermark
     * @param {Object} options see {@link Watermark|Constructor}
     * @name Watermark#render
     * @function
     * @since 1.0.0
     */
    _proto.render = function (options = {}) {
      _render(this, Object.assign(this.options, options));
    };

    /**
     * Force destroy watermark
     * @name Watermark#destroy
     * @function
     * @since 1.0.0
     */
    _proto.destroy = function () {
      _wmObserver.disconnect();
      _wmParentObserver.disconnect();
      window.removeEventListener('resize', _resizeHandler);
      this._container.parentNode.removeChild(this._container);
    };
  }
  return Watermark;
});
