"use strict";

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Util = /*#__PURE__*/function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, [{
    key: "forEach",
    value: function forEach(elements, handler) {
      elements = elements || [];

      for (var i = 0; i < elements.length; i++) {
        handler(elements[i]);
      }
    }
  }, {
    key: "getScrollTop",
    value: function getScrollTop() {
      return document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
    }
  }, {
    key: "isMobile",
    value: function isMobile() {
      return window.matchMedia('only screen and (max-width: 680px)').matches;
    }
  }, {
    key: "isTocStatic",
    value: function isTocStatic() {
      return window.matchMedia('only screen and (max-width: 960px)').matches;
    }
    /**
     * add animate to element
     * @param {Element} element animate element
     * @param {String|Array<String>} animation animation name
     * @param {Boolean} reserved reserved animation
     * @param {Function} callback remove callback
     */

  }, {
    key: "animateCSS",
    value: function animateCSS(element, animation, reserved, callback) {
      var _element$classList;

      !Array.isArray(animation) && (animation = [animation]);

      (_element$classList = element.classList).add.apply(_element$classList, ['animate__animated'].concat(_toConsumableArray(animation)));

      var handler = function handler() {
        var _element$classList2;

        (_element$classList2 = element.classList).remove.apply(_element$classList2, ['animate__animated'].concat(_toConsumableArray(animation)));

        element.removeEventListener('animationend', handler);
        typeof callback === 'function' && callback();
      };

      !reserved && element.addEventListener('animationend', handler, false);
    }
    /**
     * date validator
     * @param {*} date may be date or not
     * @returns {Boolean}
     */

  }, {
    key: "isValidDate",
    value: function isValidDate(date) {
      return date instanceof Date && !isNaN(date.getTime());
    }
  }]);

  return Util;
}();

var FixIt = /*#__PURE__*/function () {
  function FixIt() {
    var _this2 = this;

    _classCallCheck(this, FixIt);

    _defineProperty(this, "getSiteTime", function () {
      var now = new Date();
      var run = new Date(_this2.config.siteTime);
      var $runTimes = document.querySelector('.run-times');

      if (!_this2.util.isValidDate(run) || !$runTimes) {
        clearInterval(_this2.siteTime);
        $runTimes && $runTimes.parentNode.remove();
        return;
      }

      var runTime = (now - run) / 1000,
          days = Math.floor(runTime / 60 / 60 / 24),
          hours = Math.floor(runTime / 60 / 60 - 24 * days),
          minutes = Math.floor(runTime / 60 - 24 * 60 * days - 60 * hours),
          seconds = Math.floor((now - run) / 1000 - 24 * 60 * 60 * days - 60 * 60 * hours - 60 * minutes);
      $runTimes.innerHTML = "".concat(days, ", ").concat(String(hours).padStart(2, 0), ":").concat(String(minutes).padStart(2, 0), ":").concat(String(seconds).padStart(2, 0));
    });

    this.config = window.config;
    this.data = this.config.data;
    this.isDark = document.body.getAttribute('theme') === 'dark';
    this.util = new Util();
    this.newScrollTop = this.util.getScrollTop();
    this.oldScrollTop = this.newScrollTop;
    this.scrollEventSet = new Set();
    this.resizeEventSet = new Set();
    this.switchThemeEventSet = new Set();
    this.clickMaskEventSet = new Set();
    this.disableScrollEvent = false;
    window.objectFitImages && objectFitImages();
  }

  _createClass(FixIt, [{
    key: "initSVGIcon",
    value: function initSVGIcon() {
      this.util.forEach(document.querySelectorAll('[data-svg-src]'), function ($icon) {
        fetch($icon.getAttribute('data-svg-src')).then(function (response) {
          return response.text();
        }).then(function (svg) {
          var $temp = document.createElement('div');
          $temp.insertAdjacentHTML('afterbegin', svg);
          var $svg = $temp.firstChild;
          $svg.setAttribute('data-svg-src', $icon.getAttribute('data-svg-src'));
          $svg.classList.add('icon');
          var $titleElements = $svg.getElementsByTagName('title');
          $titleElements.length && $svg.removeChild($titleElements[0]);
          $icon.parentElement.replaceChild($svg, $icon);
        }).catch(function (err) {
          console.error(err);
        });
      });
    }
  }, {
    key: "initTwemoji",
    value: function initTwemoji() {
      this.config.twemoji && twemoji.parse(document.body);
    }
  }, {
    key: "initMenu",
    value: function initMenu() {
      this.initMenuDesktop();
      this.initMenuMobile();
    }
  }, {
    key: "initMenuDesktop",
    value: function initMenuDesktop() {
      // This is a dirty hack for fixing sub menu position error in desktop header
      this.util.forEach(document.querySelectorAll('[has-children], #header-desktop .language'), function ($item) {
        $item.addEventListener('mouseover', function () {
          this.querySelector('.sub-menu').style.left = "".concat(this.getBoundingClientRect().left, "px");
        });
        $item.querySelector('.sub-menu').style.minWidth = "".concat($item.offsetWidth - 8, "px");
      });
    }
  }, {
    key: "initMenuMobile",
    value: function initMenuMobile() {
      var _this3 = this;

      var $menuToggleMobile = document.getElementById('menu-toggle-mobile');
      var $menuMobile = document.getElementById('menu-mobile');
      $menuToggleMobile.addEventListener('click', function (event) {
        document.body.classList.toggle('blur');
        $menuToggleMobile.classList.toggle('active');
        $menuMobile.classList.toggle('active');
        _this3.disableScrollEvent = document.body.classList.contains('blur');
      }, false);

      this._menuMobileOnClickMask = this._menuMobileOnClickMask || function () {
        $menuToggleMobile.classList.remove('active');
        $menuMobile.classList.remove('active');
      };

      this.clickMaskEventSet.add(this._menuMobileOnClickMask); // add nested menu toggler

      this.util.forEach(document.querySelectorAll('.menu-item>.nested-item'), function ($nestedItem) {
        $nestedItem.addEventListener('click', function () {
          this.parentNode.querySelector('.sub-menu').classList.toggle('open');
          this.querySelector('.dropdown-icon').classList.toggle('open');
        });
      });
    }
  }, {
    key: "initSwitchTheme",
    value: function initSwitchTheme() {
      var _this4 = this;

      this.util.forEach(document.getElementsByClassName('theme-switch'), function ($themeSwitch) {
        $themeSwitch.addEventListener('click', function () {
          document.body.setAttribute('theme', document.body.getAttribute('theme') === 'dark' ? 'light' : 'dark');
          _this4.isDark = !_this4.isDark;
          window.localStorage && localStorage.setItem('theme', _this4.isDark ? 'dark' : 'light');

          var _iterator = _createForOfIteratorHelper(_this4.switchThemeEventSet),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var event = _step.value;
              event();
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }, false);
      });
    }
  }, {
    key: "initSearch",
    value: function initSearch() {
      var _this5 = this;

      var searchConfig = this.config.search;
      var isMobile = this.util.isMobile();

      if (!searchConfig || isMobile && this._searchMobileOnce || !isMobile && this._searchDesktopOnce) {
        return;
      }

      var maxResultLength = searchConfig.maxResultLength || 10;
      var snippetLength = searchConfig.snippetLength || 50;
      var highlightTag = searchConfig.highlightTag || 'em';
      var suffix = isMobile ? 'mobile' : 'desktop';
      var $header = document.getElementById("header-".concat(suffix));
      var $searchInput = document.getElementById("search-input-".concat(suffix));
      var $searchToggle = document.getElementById("search-toggle-".concat(suffix));
      var $searchLoading = document.getElementById("search-loading-".concat(suffix));
      var $searchClear = document.getElementById("search-clear-".concat(suffix));

      if (isMobile) {
        this._searchMobileOnce = true;
        $searchInput.addEventListener('focus', function () {
          _this5.disableScrollEvent = true;
          document.body.classList.add('blur');
          $header.classList.add('open');
        }, false);
        document.getElementById('search-cancel-mobile').addEventListener('click', function () {
          _this5.disableScrollEvent = false;
          $header.classList.remove('open');
          document.body.classList.remove('blur');
          document.getElementById('menu-toggle-mobile').classList.remove('active');
          document.getElementById('menu-mobile').classList.remove('active');
          $searchLoading.style.display = 'none';
          $searchClear.style.display = 'none';
          _this5._searchMobile && _this5._searchMobile.autocomplete.setVal('');
        }, false);
        $searchClear.addEventListener('click', function () {
          $searchClear.style.display = 'none';
          _this5._searchMobile && _this5._searchMobile.autocomplete.setVal('');
        }, false);

        this._searchMobileOnClickMask = this._searchMobileOnClickMask || function () {
          $header.classList.remove('open');
          $searchLoading.style.display = 'none';
          $searchClear.style.display = 'none';
          _this5._searchMobile && _this5._searchMobile.autocomplete.setVal('');
        };

        this.clickMaskEventSet.add(this._searchMobileOnClickMask);
      } else {
        this._searchDesktopOnce = true;
        $searchToggle.addEventListener('click', function () {
          document.body.classList.add('blur');
          $header.classList.add('open');
          $searchInput.focus();
        }, false);
        $searchClear.addEventListener('click', function () {
          $searchClear.style.display = 'none';
          _this5._searchDesktop && _this5._searchDesktop.autocomplete.setVal('');
        }, false);

        this._searchDesktopOnClickMask = this._searchDesktopOnClickMask || function () {
          $header.classList.remove('open');
          $searchLoading.style.display = 'none';
          $searchClear.style.display = 'none';
          _this5._searchDesktop && _this5._searchDesktop.autocomplete.setVal('');
        };

        this.clickMaskEventSet.add(this._searchDesktopOnClickMask);
      }

      $searchInput.addEventListener('input', function () {
        if ($searchInput.value === '') $searchClear.style.display = 'none';else $searchClear.style.display = 'inline';
      }, false);

      var initAutosearch = function initAutosearch() {
        var autosearch = autocomplete("#search-input-".concat(suffix), {
          hint: false,
          autoselect: true,
          dropdownMenuContainer: "#search-dropdown-".concat(suffix),
          clearOnSelected: true,
          cssClasses: {
            noPrefix: true
          },
          debug: true
        }, {
          name: 'search',
          source: function source(query, callback) {
            $searchLoading.style.display = 'inline';
            $searchClear.style.display = 'none';

            var finish = function finish(results) {
              $searchLoading.style.display = 'none';
              $searchClear.style.display = 'inline';
              callback(results);
            };

            if (searchConfig.type === 'lunr') {
              var search = function search() {
                if (lunr.queryHandler) {
                  query = lunr.queryHandler(query);
                }

                var results = {};

                _this5._index.search(query).forEach(function (_ref) {
                  var ref = _ref.ref,
                      metadata = _ref.matchData.metadata;
                  var matchData = _this5._indexData[ref];
                  var uri = matchData.uri,
                      title = matchData.title,
                      context = matchData.content;

                  if (results[uri]) {
                    return;
                  }

                  var position = 0;
                  Object.values(metadata).forEach(function (_ref2) {
                    var content = _ref2.content;

                    if (content) {
                      var matchPosition = content.position[0][0];

                      if (matchPosition < position || position === 0) {
                        position = matchPosition;
                      }
                    }
                  });
                  position -= snippetLength / 5;

                  if (position > 0) {
                    position += context.substr(position, 20).lastIndexOf(' ') + 1;
                    context = '...' + context.substr(position, snippetLength);
                  } else {
                    context = context.substr(0, snippetLength);
                  }

                  Object.keys(metadata).forEach(function (key) {
                    title = title.replace(new RegExp("(".concat(key, ")"), 'gi'), "<".concat(highlightTag, ">$1</").concat(highlightTag, ">"));
                    context = context.replace(new RegExp("(".concat(key, ")"), 'gi'), "<".concat(highlightTag, ">$1</").concat(highlightTag, ">"));
                  });
                  results[uri] = {
                    uri: uri,
                    title: title,
                    date: matchData.date,
                    context: context
                  };
                });

                return Object.values(results).slice(0, maxResultLength);
              };

              if (!_this5._index) {
                fetch(searchConfig.lunrIndexURL).then(function (response) {
                  return response.json();
                }).then(function (data) {
                  var indexData = {};
                  _this5._index = lunr(function () {
                    var _this6 = this;

                    if (searchConfig.lunrLanguageCode) this.use(lunr[searchConfig.lunrLanguageCode]);
                    this.ref('objectID');
                    this.field('title', {
                      boost: 50
                    });
                    this.field('tags', {
                      boost: 20
                    });
                    this.field('categories', {
                      boost: 20
                    });
                    this.field('content', {
                      boost: 10
                    });
                    this.metadataWhitelist = ['position'];
                    data.forEach(function (record) {
                      indexData[record.objectID] = record;

                      _this6.add(record);
                    });
                  });
                  _this5._indexData = indexData;
                  finish(search());
                }).catch(function (err) {
                  console.error(err);
                  finish([]);
                });
              } else finish(search());
            } else if (searchConfig.type === 'algolia') {
              _this5._algoliaIndex = _this5._algoliaIndex || algoliasearch(searchConfig.algoliaAppID, searchConfig.algoliaSearchKey).initIndex(searchConfig.algoliaIndex);

              _this5._algoliaIndex.search(query, {
                offset: 0,
                length: maxResultLength * 8,
                attributesToHighlight: ['title'],
                attributesToSnippet: ["content:".concat(snippetLength)],
                highlightPreTag: "<".concat(highlightTag, ">"),
                highlightPostTag: "</".concat(highlightTag, ">")
              }).then(function (_ref3) {
                var hits = _ref3.hits;
                var results = {};
                hits.forEach(function (_ref4) {
                  var uri = _ref4.uri,
                      date = _ref4.date,
                      title = _ref4._highlightResult.title,
                      content = _ref4._snippetResult.content;

                  if (results[uri] && results[uri].context.length > content.value) {
                    return;
                  }

                  results[uri] = {
                    uri: uri,
                    title: title.value,
                    date: date,
                    context: content.value
                  };
                });
                finish(Object.values(results).slice(0, maxResultLength));
              }).catch(function (err) {
                console.error(err);
                finish([]);
              });
            }
          },
          templates: {
            suggestion: function suggestion(_ref5) {
              var title = _ref5.title,
                  date = _ref5.date,
                  context = _ref5.context;
              return "<div><span class=\"suggestion-title\">".concat(title, "</span><span class=\"suggestion-date\">").concat(date, "</span></div><div class=\"suggestion-context\">").concat(context, "</div>");
            },
            empty: function empty(_ref6) {
              var query = _ref6.query;
              return "<div class=\"search-empty\">".concat(searchConfig.noResultsFound, ": <span class=\"search-query\">\"").concat(query, "\"</span></div>");
            },
            footer: function footer(_ref7) {
              _objectDestructuringEmpty(_ref7);

              var _ref8 = searchConfig.type === 'algolia' ? {
                searchType: 'algolia',
                icon: '<i class="fa-brands fa-algolia fa-fw"></i>',
                href: 'https://www.algolia.com/'
              } : {
                searchType: 'Lunr.js',
                icon: '',
                href: 'https://lunrjs.com/'
              },
                  searchType = _ref8.searchType,
                  icon = _ref8.icon,
                  href = _ref8.href;

              return "<div class=\"search-footer\">Search by <a href=\"".concat(href, "\" rel=\"noopener noreferrer\" target=\"_blank\">").concat(icon, " ").concat(searchType, "</a></div>");
            }
          }
        });
        autosearch.on('autocomplete:selected', function (_event, suggestion, _dataset, _context) {
          window.location.assign(suggestion.uri);
        });

        if (isMobile) {
          _this5._searchMobile = autosearch;
        } else {
          _this5._searchDesktop = autosearch;
        }
      };

      if (searchConfig.lunrSegmentitURL && !document.getElementById('lunr-segmentit')) {
        var script = document.createElement('script');
        script.id = 'lunr-segmentit';
        script.type = 'text/javascript';
        script.src = searchConfig.lunrSegmentitURL;
        script.async = true;

        if (script.readyState) {
          script.onreadystatechange = function () {
            if (script.readyState == 'loaded' || script.readyState == 'complete') {
              script.onreadystatechange = null;
              initAutosearch();
            }
          };
        } else {
          script.onload = function () {
            initAutosearch();
          };
        }

        document.body.appendChild(script);
      } else {
        initAutosearch();
      }
    }
  }, {
    key: "initDetails",
    value: function initDetails() {
      this.util.forEach(document.getElementsByClassName('details'), function ($details) {
        var $summary = $details.querySelector('.details-summary');
        $summary.addEventListener('click', function () {
          $details.classList.toggle('open');
        }, false);
      });
    }
  }, {
    key: "initLightGallery",
    value: function initLightGallery() {
      this.config.lightGallery && lightGallery(document.getElementById('content'), this.config.lightGallery);
    }
  }, {
    key: "initHighlight",
    value: function initHighlight() {
      var _this7 = this;

      this.util.forEach(document.querySelectorAll('.highlight > pre.chroma'), function ($preChroma) {
        var $chroma = document.createElement('div');
        $chroma.className = $preChroma.className;
        var $table = document.createElement('table');
        $chroma.appendChild($table);
        var $tbody = document.createElement('tbody');
        $table.appendChild($tbody);
        var $tr = document.createElement('tr');
        $tbody.appendChild($tr);
        var $td = document.createElement('td');
        $tr.appendChild($td);
        $preChroma.parentElement.replaceChild($chroma, $preChroma);
        $td.appendChild($preChroma);
      });
      this.util.forEach(document.querySelectorAll('.highlight > .chroma'), function ($chroma) {
        var $codeElements = $chroma.querySelectorAll('pre.chroma > code');

        if ($codeElements.length) {
          var $code = $codeElements[$codeElements.length - 1];
          var $header = document.createElement('div');
          $header.className = 'code-header ' + $code.className.toLowerCase(); // code title

          var $title = document.createElement('span');
          $title.classList.add('code-title');
          $title.insertAdjacentHTML('afterbegin', '<i class="arrow fa-solid fa-chevron-right fa-fw"></i>');
          $title.addEventListener('click', function () {
            $chroma.classList.toggle('open');
          }, false);
          $header.appendChild($title); // ellipses icon

          var $ellipses = document.createElement('span');
          $ellipses.insertAdjacentHTML('afterbegin', '<i class="fa-solid fa-ellipsis-h fa-fw"></i>');
          $ellipses.classList.add('ellipses');
          $ellipses.addEventListener('click', function () {
            $chroma.classList.add('open');
          }, false);
          $header.appendChild($ellipses); // edit button

          if (_this7.config.code.editable) {
            var $edit = document.createElement('span');
            $edit.classList.add('edit');
            $edit.insertAdjacentHTML('afterbegin', "<i class=\"fa-solid fa-key fa-fw\" title=\"".concat(_this7.config.code.editUnLockTitle, "\"></i>"));
            $edit.addEventListener('click', function () {
              var $iconKey = $edit.querySelector('.fa-key');
              var $iconLock = $edit.querySelector('.fa-lock');
              var $preChromas = $edit.parentElement.parentElement.querySelectorAll('pre.chroma');
              var $preChroma = $preChromas.length === 2 ? $preChromas[1] : $preChromas[0];

              if ($iconKey) {
                $iconKey.classList.add('fa-lock');
                $iconKey.classList.remove('fa-key');
                $iconKey.title = _this7.config.code.editLockTitle;
                $preChroma.setAttribute('contenteditable', true);
                $preChroma.focus();
              } else {
                $iconLock.classList.add('fa-key');
                $iconLock.classList.remove('fa-lock');
                $iconLock.title = _this7.config.code.editUnLockTitle;
                $preChroma.setAttribute('contenteditable', false);
                $preChroma.blur();
              }
            }, false);
            $header.appendChild($edit);
          } // copy button


          if (_this7.config.code.copyTitle) {
            var $copy = document.createElement('span');
            $copy.insertAdjacentHTML('afterbegin', '<i class="fa-regular fa-copy fa-fw"></i>');
            $copy.classList.add('copy');
            var code = $code.innerText;

            if (_this7.config.code.maxShownLines < 0 || code.split('\n').length < _this7.config.code.maxShownLines + 2) {
              $chroma.classList.add('open');
            }

            $copy.title = _this7.config.code.copyTitle;
            $copy.addEventListener('click', function () {
              navigator.clipboard.writeText(code).then(function () {
                _this7.util.animateCSS($code, 'animate__flash');
              }, function () {
                console.error('Clipboard write failed!', 'Your browser does not support clipboard API!');
              });
            }, false);
            $header.appendChild($copy);
          }

          $chroma.insertBefore($header, $chroma.firstChild);
        }
      });
    }
  }, {
    key: "initTable",
    value: function initTable() {
      this.util.forEach(document.querySelectorAll('.content table'), function ($table) {
        var $wrapper = document.createElement('div');
        $wrapper.className = 'table-wrapper';
        $table.parentElement.replaceChild($wrapper, $table);
        $wrapper.appendChild($table);
      });
    }
  }, {
    key: "initHeaderLink",
    value: function initHeaderLink() {
      for (var num = 1; num <= 6; num++) {
        this.util.forEach(document.querySelectorAll('.single .content > h' + num), function ($header) {
          $header.classList.add('header-link');
          $header.insertAdjacentHTML('afterbegin', "<a href=\"#".concat($header.id, "\" class=\"header-mark\"></a>"));
        });
      }
    }
    /**
     * init table of contents
     */

  }, {
    key: "initToc",
    value: function initToc() {
      var _this8 = this;

      var $tocCore = document.getElementById('TableOfContents');

      if ($tocCore === null) {
        return;
      }

      if (document.getElementById('toc-static').getAttribute('kept') === 'true' || this.util.isTocStatic()) {
        var $tocContentStatic = document.getElementById('toc-content-static');

        if ($tocCore.parentElement !== $tocContentStatic) {
          $tocCore.parentElement.removeChild($tocCore);
          $tocContentStatic.appendChild($tocCore);
        }

        this._tocOnScroll && this.scrollEventSet.delete(this._tocOnScroll);
      } else {
        var $tocContentAuto = document.getElementById('toc-content-auto');

        if ($tocCore.parentElement !== $tocContentAuto) {
          $tocCore.parentElement.removeChild($tocCore);
          $tocContentAuto.appendChild($tocCore);
        }

        var $toc = document.getElementById('toc-auto');
        $toc.style.visibility = 'visible';
        this.util.animateCSS($toc, ['animate__fadeIn', 'animate__faster'], true);
        $toc.style.marginTop = document.querySelector('.single-title').clientHeight + document.querySelector('.post-meta').clientHeight + 'px';
        $toc.style.marginBottom = document.getElementById('post-footer').clientHeight + 'px';
        var $tocLinkElements = $tocCore.querySelectorAll('a:first-child');
        var $tocLiElements = $tocCore.getElementsByTagName('li');
        var $headerLinkElements = document.getElementsByClassName('header-link');
        var headerIsFixed = document.body.getAttribute('header-desktop') !== 'normal';
        var headerHeight = document.getElementById('header-desktop').offsetHeight;

        this._tocOnScroll = this._tocOnScroll || function () {
          var $comments = document.getElementById('comments');

          if ($comments) {
            $toc.style.marginBottom = document.getElementById('post-footer').clientHeight + $comments.clientHeight + 'px';
          }

          _this8.util.forEach($tocLinkElements, function ($tocLink) {
            $tocLink.classList.remove('active');
          });

          _this8.util.forEach($tocLiElements, function ($tocLi) {
            $tocLi.classList.remove('has-active');
          });

          var INDEX_SPACING = 20 + (headerIsFixed ? headerHeight : 0);
          var activeTocIndex = $headerLinkElements.length - 1;

          for (var i = 0; i < $headerLinkElements.length - 1; i++) {
            var thisTop = $headerLinkElements[i].getBoundingClientRect().top;
            var nextTop = $headerLinkElements[i + 1].getBoundingClientRect().top;

            if (i == 0 && thisTop > INDEX_SPACING || thisTop <= INDEX_SPACING && nextTop > INDEX_SPACING) {
              activeTocIndex = i;
              break;
            }
          }

          if (activeTocIndex !== -1) {
            $tocLinkElements[activeTocIndex].classList.add('active');
            var $parent = $tocLinkElements[activeTocIndex].parentElement;

            while ($parent !== $tocCore) {
              $parent.classList.add('has-active');
              $parent = $parent.parentElement.parentElement;
            }
          }
        };

        this._tocOnScroll();

        this.scrollEventSet.add(this._tocOnScroll);
      }
    }
  }, {
    key: "initTocListener",
    value: function initTocListener() {
      var _document$querySelect,
          _this9 = this;

      var $toc = document.getElementById('toc-auto');
      var $tocContentAuto = document.getElementById('toc-content-auto');
      (_document$querySelect = document.querySelector('#toc-auto>.toc-title')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.addEventListener('click', function () {
        var animation = ['animate__faster'];
        var tocHidden = $toc.classList.contains('toc-hidden');
        animation.push(tocHidden ? 'animate__fadeIn' : 'animate__fadeOut');
        $tocContentAuto.classList.remove(tocHidden ? 'animate__fadeOut' : 'animate__fadeIn');

        _this9.util.animateCSS($tocContentAuto, animation, true);

        $toc.classList.toggle('toc-hidden');
      }, false);
    }
  }, {
    key: "initMath",
    value: function initMath() {
      if (this.config.math) {
        renderMathInElement(document.body, this.config.math);
      }
    }
  }, {
    key: "initMermaid",
    value: function initMermaid() {
      var _this10 = this;

      this._mermaidOnSwitchTheme = this._mermaidOnSwitchTheme || function () {
        var $mermaidElements = document.getElementsByClassName('mermaid');

        if ($mermaidElements.length) {
          var _this10$config$mermai;

          var themes = (_this10$config$mermai = _this10.config.mermaid.themes) !== null && _this10$config$mermai !== void 0 ? _this10$config$mermai : ['neutral', 'dark'];
          mermaid.initialize({
            startOnLoad: false,
            theme: _this10.isDark ? themes[1] : themes[0],
            securityLevel: 'loose'
          });

          _this10.util.forEach($mermaidElements, function ($mermaid) {
            mermaid.render('svg-' + $mermaid.id, _this10.data[$mermaid.id], function (svgCode) {
              $mermaid.innerHTML = svgCode;
            }, $mermaid);
          });
        }
      };

      this.switchThemeEventSet.add(this._mermaidOnSwitchTheme);

      this._mermaidOnSwitchTheme();
    }
  }, {
    key: "initEcharts",
    value: function initEcharts() {
      var _this11 = this;

      this._echartsOnSwitchTheme = this._echartsOnSwitchTheme || function () {
        _this11._echartsArr = _this11._echartsArr || [];

        for (var i = 0; i < _this11._echartsArr.length; i++) {
          _this11._echartsArr[i].dispose();
        }

        _this11._echartsArr = [];

        _this11.util.forEach(document.getElementsByClassName('echarts'), function ($echarts) {
          var chart = echarts.init($echarts, _this11.isDark ? 'dark' : 'macarons', {
            renderer: 'svg'
          });
          chart.setOption(JSON.parse(_this11.data[$echarts.id]));

          _this11._echartsArr.push(chart);
        });
      };

      this.switchThemeEventSet.add(this._echartsOnSwitchTheme);

      this._echartsOnSwitchTheme();

      this._echartsOnResize = this._echartsOnResize || function () {
        for (var i = 0; i < _this11._echartsArr.length; i++) {
          _this11._echartsArr[i].resize();
        }
      };

      this.resizeEventSet.add(this._echartsOnResize);
    }
  }, {
    key: "initMapbox",
    value: function initMapbox() {
      var _this12 = this;

      if (this.config.mapbox) {
        mapboxgl.accessToken = this.config.mapbox.accessToken;
        mapboxgl.setRTLTextPlugin(this.config.mapbox.RTLTextPlugin);
        this._mapboxArr = this._mapboxArr || [];
        this.util.forEach(document.getElementsByClassName('mapbox'), function ($mapbox) {
          var _this12$data$$mapbox$ = _this12.data[$mapbox.id],
              lng = _this12$data$$mapbox$.lng,
              lat = _this12$data$$mapbox$.lat,
              zoom = _this12$data$$mapbox$.zoom,
              lightStyle = _this12$data$$mapbox$.lightStyle,
              darkStyle = _this12$data$$mapbox$.darkStyle,
              marked = _this12$data$$mapbox$.marked,
              navigation = _this12$data$$mapbox$.navigation,
              geolocate = _this12$data$$mapbox$.geolocate,
              scale = _this12$data$$mapbox$.scale,
              fullscreen = _this12$data$$mapbox$.fullscreen;
          var mapbox = new mapboxgl.Map({
            container: $mapbox,
            center: [lng, lat],
            zoom: zoom,
            minZoom: 0.2,
            style: _this12.isDark ? darkStyle : lightStyle,
            attributionControl: false
          });

          if (marked) {
            new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapbox);
          }

          if (navigation) {
            mapbox.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
          }

          if (geolocate) {
            mapbox.addControl(new mapboxgl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true
              },
              showUserLocation: true,
              trackUserLocation: true
            }), 'bottom-right');
          }

          if (scale) {
            mapbox.addControl(new mapboxgl.ScaleControl());
          }

          if (fullscreen) {
            mapbox.addControl(new mapboxgl.FullscreenControl());
          }

          mapbox.addControl(new MapboxLanguage());

          _this12._mapboxArr.push(mapbox);
        });

        this._mapboxOnSwitchTheme = this._mapboxOnSwitchTheme || function () {
          _this12.util.forEach(_this12._mapboxArr, function (mapbox) {
            var $mapbox = mapbox.getContainer();
            var _this12$data$$mapbox$2 = _this12.data[$mapbox.id],
                lightStyle = _this12$data$$mapbox$2.lightStyle,
                darkStyle = _this12$data$$mapbox$2.darkStyle;
            mapbox.setStyle(_this12.isDark ? darkStyle : lightStyle);
            mapbox.addControl(new MapboxLanguage());
          });
        };

        this.switchThemeEventSet.add(this._mapboxOnSwitchTheme);
      }
    }
  }, {
    key: "initTypeit",
    value: function initTypeit() {
      var _this13 = this;

      if (this.config.typeit) {
        var typeitConfig = this.config.typeit;
        var speed = typeitConfig.speed || 100;
        var cursorSpeed = typeitConfig.cursorSpeed || 1000;
        var cursorChar = typeitConfig.cursorChar || '|';
        Object.values(typeitConfig.data).forEach(function (group) {
          var typeone = function typeone(i) {
            var id = group[i];
            var instance = new TypeIt("#".concat(id), {
              strings: _this13.data[id],
              speed: speed,
              lifeLike: true,
              cursorSpeed: cursorSpeed,
              cursorChar: cursorChar,
              waitUntilVisible: true,
              afterComplete: function afterComplete() {
                if (i === group.length - 1 && typeitConfig.duration >= 0) {
                  window.setTimeout(function () {
                    instance.destroy();
                  }, typeitConfig.duration);
                  return;
                }

                instance.destroy();
                typeone(i + 1);
              }
            }).go();
          };

          typeone(0);
        });
      }
    }
  }, {
    key: "initCommentLightGallery",
    value: function initCommentLightGallery(comments, images) {
      if (!this.config.lightGallery) {
        return;
      }

      document.querySelectorAll(comments).forEach(function ($content) {
        var $imgs = $content.querySelectorAll(images + ':not([lightgallery-loaded])');
        $imgs.forEach(function ($img) {
          $img.setAttribute('lightgallery-loaded', '');
          var $link = document.createElement('a');
          $link.setAttribute('class', 'comment-lightgallery');
          $link.setAttribute('href', $img.src);
          $link.append($img.cloneNode());
          $img.replaceWith($link);
        });

        if ($imgs.length) {
          lightGallery($content, {
            selector: '.comment-lightgallery',
            actualSize: false,
            hideBarsDelay: 2000,
            speed: 400
          });
        }
      });
    }
  }, {
    key: "initComment",
    value: function initComment() {
      var _this14 = this;

      if (!this.config.comment) {
        return;
      }

      if (this.config.comment.artalk) {
        var artalk = new Artalk(this.config.comment.artalk);
        artalk.setDarkMode(this.isDark);
        this.switchThemeEventSet.add(function () {
          artalk.setDarkMode(_this14.isDark);
        });
        artalk.on('comments-loaded', function () {
          _this14.config.comment.artalk.lightgallery && _this14.initCommentLightGallery('.atk-comment .atk-content', 'img:not([atk-emoticon])');
        });
        return artalk;
      }

      if (this.config.comment.gitalk) {
        this.config.comment.gitalk.body = decodeURI(window.location.href);
        var gitalk = new Gitalk(this.config.comment.gitalk);
        gitalk.render('gitalk');
        return gitalk;
      }

      if (this.config.comment.valine) {
        return new Valine(this.config.comment.valine);
      }

      if (this.config.comment.waline) {
        return Waline.init(this.config.comment.waline);
      }

      if (this.config.comment.utterances) {
        var utterancesConfig = this.config.comment.utterances;
        var script = document.createElement('script');
        script.src = 'https://utteranc.es/client.js';
        script.type = 'text/javascript';
        script.setAttribute('repo', utterancesConfig.repo);
        script.setAttribute('issue-term', utterancesConfig.issueTerm);
        if (utterancesConfig.label) script.setAttribute('label', utterancesConfig.label);
        script.setAttribute('theme', this.isDark ? utterancesConfig.darkTheme : utterancesConfig.lightTheme);
        script.crossOrigin = 'anonymous';
        script.async = true;
        document.getElementById('utterances').appendChild(script);

        this._utterancesOnSwitchTheme = this._utterancesOnSwitchTheme || function () {
          var _document$querySelect2;

          var message = {
            type: 'set-theme',
            theme: _this14.isDark ? utterancesConfig.darkTheme : utterancesConfig.lightTheme
          };
          (_document$querySelect2 = document.querySelector('.utterances-frame')) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.contentWindow.postMessage(message, 'https://utteranc.es');
        };

        this.switchThemeEventSet.add(this._utterancesOnSwitchTheme);
        return;
      }

      if (this.config.comment.twikoo) {
        var twikooConfig = this.config.comment.twikoo;

        if (twikooConfig.lightgallery) {
          twikooConfig.onCommentLoaded = function () {
            _this14.initCommentLightGallery('.tk-comments .tk-content', 'img:not(.tk-owo-emotion)');
          };
        }

        twikoo.init(twikooConfig);

        if (twikooConfig.commentCount) {
          // https://twikoo.js.org/api.html#get-comments-count
          twikoo.getCommentsCount({
            envId: twikooConfig.envId,
            region: twikooConfig.region,
            urls: [window.location.pathname],
            includeReply: false
          }).then(function (response) {
            var twikooCommentCount = document.getElementById('twikoo-comment-count');
            if (twikooCommentCount) twikooCommentCount.innerHTML = response[0].count;
          });
        }

        return;
      }

      if (this.config.comment.giscus) {
        var giscusConfig = this.config.comment.giscus;

        this._giscusOnSwitchTheme = this._giscusOnSwitchTheme || function () {
          var _document$querySelect3;

          var message = {
            setConfig: {
              theme: _this14.isDark ? giscusConfig.darkTheme : giscusConfig.lightTheme
            }
          };
          (_document$querySelect3 = document.querySelector('.giscus-frame')) === null || _document$querySelect3 === void 0 ? void 0 : _document$querySelect3.contentWindow.postMessage({
            giscus: message
          }, 'https://giscus.app');
        };

        this.switchThemeEventSet.add(this._giscusOnSwitchTheme);

        var _this = this;

        _this.giscus2parentMsg = window.addEventListener('message', function (event) {
          var $script = document.querySelector('#giscus>script');

          if ($script) {
            _this._giscusOnSwitchTheme();

            $script.parentElement.removeChild($script);
          }

          window.removeEventListener('message', _this.giscus2parentMsg);
        });
        return;
      }
    }
  }, {
    key: "initCookieconsent",
    value: function initCookieconsent() {
      this.config.cookieconsent && cookieconsent.initialise(this.config.cookieconsent);
    }
  }, {
    key: "initSiteTime",
    value: function initSiteTime() {
      var _this15 = this;

      if (this.config.siteTime) {
        this.siteTime = setInterval(this.getSiteTime, 500);
        document.addEventListener('visibilitychange', function () {
          if (document.hidden) {
            return clearInterval(_this15.siteTime);
          }

          _this15.siteTime = setInterval(_this15.getSiteTime, 500);
        }, false);
      }
    }
  }, {
    key: "initServiceWorker",
    value: function initServiceWorker() {
      if (this.config.enablePWA && 'serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.min.js', {
          scope: '/'
        }).then(function (registration) {// console.log('Service Worker Registered');
        }).catch(function (error) {
          console.error('error: ', error);
        });
        navigator.serviceWorker.ready.then(function (registration) {// console.log('Service Worker Ready');
        });
      }
    }
  }, {
    key: "initWatermark",
    value: function initWatermark() {
      var _this$config$watermar;

      ((_this$config$watermar = this.config.watermark) === null || _this$config$watermar === void 0 ? void 0 : _this$config$watermar.enable) && new Watermark({
        content: this.config.watermark.content || '<img class="fixit-icon" src="/images/fixit.svg" alt="FixIt logo" /> FixIt Theme',
        appendTo: this.config.watermark.appendto || '.wrapper>main',
        opacity: this.config.watermark.opacity,
        width: this.config.watermark.width,
        height: this.config.watermark.height,
        rowSpacing: this.config.watermark.rowspacing,
        colSpacing: this.config.watermark.colspacing,
        rotate: this.config.watermark.rotate,
        fontSize: this.config.watermark.fontsize,
        fontFamily: this.config.watermark.fontfamily
      });
    }
  }, {
    key: "initPangu",
    value: function initPangu() {
      // TODO 待优化：只渲染
      this.config.enablePangu && pangu.autoSpacingPage();
    }
  }, {
    key: "initFixItDecryptor",
    value: function initFixItDecryptor() {
      var _this16 = this,
          _this$config$encrypti,
          _this$config$encrypti2;

      var $tocNodes = document.querySelectorAll('#toc-auto>.d-none, #toc-static.d-none');
      this.decryptor = new FixItDecryptor({
        decrypted: function decrypted() {
          _this16.initTwemoji();

          _this16.initDetails();

          _this16.initLightGallery();

          _this16.initHighlight();

          _this16.initTable();

          _this16.initHeaderLink();

          _this16.initMath();

          _this16.initMermaid();

          _this16.initEcharts();

          _this16.initTypeit();

          _this16.initMapbox();

          _this16.util.forEach($tocNodes, function ($element) {
            $element.classList.remove('d-none');
          });

          _this16.initToc();

          _this16.initTocListener();

          _this16.initPangu();
        },
        reset: function reset() {
          _this16.util.forEach($tocNodes, function ($element) {
            $element.classList.add('d-none');
          });
        }
      });

      if ((_this$config$encrypti = this.config.encryption) !== null && _this$config$encrypti !== void 0 && _this$config$encrypti.shortcode) {
        this.decryptor.addEventListener('decrypted', function () {
          _this16.decryptor.initShortcodes();
        });
        this.decryptor.initShortcodes();
      }

      ((_this$config$encrypti2 = this.config.encryption) === null || _this$config$encrypti2 === void 0 ? void 0 : _this$config$encrypti2.all) && this.decryptor.init();
    }
  }, {
    key: "initMDevtools",
    value: function initMDevtools() {
      var _this$config,
          _this17 = this;

      var type = (_this$config = this.config) === null || _this$config === void 0 ? void 0 : _this$config.mDevtools;

      if (typeof window.orientation === 'undefined') {
        return;
      }

      if (type === 'vConsole') {
        var vConsole = new VConsole({
          target: '.widgets',
          theme: this.isDark ? 'dark' : 'light'
        });

        this._vConsoleOnSwitchTheme = this._vConsoleOnSwitchTheme || function () {
          vConsole.setOption('theme', _this17.isDark ? 'dark' : 'light');
        };

        this.switchThemeEventSet.add(this._vConsoleOnSwitchTheme);
      }

      if (type === 'eruda') {
        eruda.init({
          defaults: {
            theme: this.isDark ? 'Dark' : 'Light'
          }
        });

        this._erudaOnSwitchTheme = this._erudaOnSwitchTheme || function () {
          eruda.util.evalCss.setTheme(_this17.isDark ? 'Dark' : 'Light');
        };

        this.switchThemeEventSet.add(this._erudaOnSwitchTheme);
      }
    }
  }, {
    key: "onScroll",
    value: function onScroll() {
      var _this18 = this;

      var $headers = [];

      if (document.body.getAttribute('header-desktop') === 'auto') {
        $headers.push(document.getElementById('header-desktop'));
      }

      if (document.body.getAttribute('header-mobile') === 'auto') {
        $headers.push(document.getElementById('header-mobile'));
      }

      if (document.getElementById('comments')) {
        var $viewComments = document.getElementById('view-comments');
        $viewComments.href = "#comments";
        $viewComments.style.display = 'block';
      }

      var $fixedButtons = document.getElementById('fixed-buttons');
      var ACCURACY = 20,
          MINIMUM = 100;
      window.addEventListener('scroll', function (event) {
        if (_this18.disableScrollEvent) {
          event.preventDefault();
          return;
        }

        var $mask = document.getElementById('mask');
        _this18.newScrollTop = _this18.util.getScrollTop();
        var scroll = _this18.newScrollTop - _this18.oldScrollTop;

        var isMobile = _this18.util.isMobile();

        _this18.util.forEach($headers, function ($header) {
          if (scroll > ACCURACY) {
            $header.classList.remove('animate__fadeInDown');

            _this18.util.animateCSS($header, ['animate__fadeOutUp', 'animate__faster'], true);

            $mask.click();
          } else if (scroll < -ACCURACY) {
            $header.classList.remove('animate__fadeOutUp');

            _this18.util.animateCSS($header, ['animate__fadeInDown', 'animate__faster'], true);

            $mask.click();
          }
        }); // whether to show b2t button


        if (_this18.newScrollTop > MINIMUM) {
          if (isMobile && scroll > ACCURACY) {
            $fixedButtons.classList.remove('animate__fadeIn');

            _this18.util.animateCSS($fixedButtons, ['animate__fadeOut', 'animate__faster'], true);
          } else if (!isMobile || scroll < -ACCURACY) {
            $fixedButtons.style.display = 'block';
            $fixedButtons.classList.remove('animate__fadeOut');

            _this18.util.animateCSS($fixedButtons, ['animate__fadeIn', 'animate__faster'], true);
          }
        } else {
          if (!isMobile) {
            $fixedButtons.classList.remove('animate__fadeIn');

            _this18.util.animateCSS($fixedButtons, ['animate__fadeOut', 'animate__faster'], true);
          }

          $fixedButtons.style.display = 'none';
        }

        var _iterator2 = _createForOfIteratorHelper(_this18.scrollEventSet),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _event2 = _step2.value;

            _event2();
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        _this18.oldScrollTop = _this18.newScrollTop;
      }, false);
    }
  }, {
    key: "onResize",
    value: function onResize() {
      var _this19 = this;

      var resizeBefore = this.util.isMobile();
      window.addEventListener('resize', function () {
        if (!_this19._resizeTimeout) {
          _this19._resizeTimeout = window.setTimeout(function () {
            _this19._resizeTimeout = null;

            var _iterator3 = _createForOfIteratorHelper(_this19.resizeEventSet),
                _step3;

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var event = _step3.value;
                event();
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }

            _this19.initToc();

            _this19.initMermaid();

            _this19.initSearch();

            var isMobile = _this19.util.isMobile();

            if (isMobile !== resizeBefore) {
              document.getElementById('mask').click();
              resizeBefore = isMobile;
            }
          }, 100);
        }
      }, false);
    }
  }, {
    key: "onClickMask",
    value: function onClickMask() {
      var _this20 = this;

      document.getElementById('mask').addEventListener('click', function () {
        if (!document.body.classList.contains('blur')) {
          return;
        }

        var _iterator4 = _createForOfIteratorHelper(_this20.clickMaskEventSet),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var event = _step4.value;
            event();
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        _this20.disableScrollEvent = false;
        document.body.classList.remove('blur');
      }, false);
    }
  }, {
    key: "init",
    value: function init() {
      var _this21 = this;

      try {
        var _this$config$encrypti3;

        if (this.config.encryption) {
          this.initFixItDecryptor();
        } else if (!((_this$config$encrypti3 = this.config.encryption) !== null && _this$config$encrypti3 !== void 0 && _this$config$encrypti3.all)) {
          this.initTwemoji();
          this.initDetails();
          this.initLightGallery();
          this.initHighlight();
          this.initTable();
          this.initHeaderLink();
          this.initMath();
          this.initMermaid();
          this.initEcharts();
          this.initTypeit();
          this.initMapbox();
          this.initPangu();
        }

        this.initSVGIcon();
        this.initMenu();
        this.initSwitchTheme();
        this.initSearch();
        this.initCookieconsent();
        this.initSiteTime();
        this.initServiceWorker();
        this.initWatermark();
        this.initMDevtools();
        window.setTimeout(function () {
          var _this21$config$encryp;

          _this21.initComment();

          if (!((_this21$config$encryp = _this21.config.encryption) !== null && _this21$config$encryp !== void 0 && _this21$config$encryp.all)) {
            _this21.initToc();

            _this21.initTocListener();
          }

          _this21.onScroll();

          _this21.onResize();

          _this21.onClickMask();
        }, 100);
      } catch (err) {
        console.error(err);
      }
    }
  }]);

  return FixIt;
}();

var themeInit = function themeInit() {
  window.fixit = new FixIt();
  window.fixit.init();
};

if (document.readyState !== 'loading') {
  themeInit();
} else {
  document.addEventListener('DOMContentLoaded', themeInit, false);
}
