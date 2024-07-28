import Util from './util';

class FixIt {
  constructor() {
    this.config = window.config;
    this.isDark = document.body.dataset.theme === 'dark';
    this.util = new Util();
    this.newScrollTop = this.util.getScrollTop();
    this.oldScrollTop = this.newScrollTop;
    this.scrollEventSet = new Set();
    this.resizeEventSet = new Set();
    this.switchThemeEventSet = new Set();
    this.clickMaskEventSet = new Set();
    this.beforeprintEventSet = new Set();
    this.disableScrollEvent = false;
    window.objectFitImages && objectFitImages();
  }

  initThemeColor() {
    const $meta = document.querySelector('[name="theme-color"]');
    if (!$meta) {
      return;
    }
    this._themeColorOnSwitchTheme = this._themeColorOnSwitchTheme || (() => {
      $meta.content = this.isDark ? $meta.dataset.dark : $meta.dataset.light;
    });
    this.switchThemeEventSet.add(this._themeColorOnSwitchTheme);
    this._themeColorOnSwitchTheme();
  }

  initSVGIcon() {
    this.util.forEach(document.querySelectorAll('[data-svg-src]'), ($icon) => {
      fetch($icon.dataset.svgSrc)
        .then((response) => response.text())
        .then((svg) => {
          const $temp = document.createElement('div');
          $temp.insertAdjacentHTML('afterbegin', svg);
          const $svg = $temp.firstChild;
          $svg.dataset.svgSrc = $icon.dataset.svgSrc
          $svg.classList.add('icon');
          const $titleElements = $svg.getElementsByTagName('title');
          $titleElements.length && $svg.removeChild($titleElements[0]);
          $icon.parentElement.replaceChild($svg, $icon);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }

  initTwemoji(target = document.body) {
    this.config.twemoji && twemoji.parse(target);
  }

  initMenu() {
    this.initMenuDesktop();
    this.initMenuMobile();
  }

  initMenuDesktop() {
    this.util.forEach(document.querySelectorAll('.has-children'), ($item) => {
      $item.querySelector('.sub-menu').style.minWidth = `${$item.offsetWidth - 8}px`;
    });
  }

  initMenuMobile() {
    const $menuToggleMobile = document.getElementById('menu-toggle-mobile');
    const $menuMobile = document.getElementById('menu-mobile');
    $menuToggleMobile.addEventListener('click', (event) => {
      document.body.classList.toggle('blur');
      $menuToggleMobile.classList.toggle('active');
      $menuMobile.classList.toggle('active');
      this.disableScrollEvent = document.body.classList.contains('blur');
    }, false);
    this._menuMobileOnClickMask = this._menuMobileOnClickMask || (() => {
      $menuToggleMobile.classList.remove('active');
      $menuMobile.classList.remove('active');
    });
    this.clickMaskEventSet.add(this._menuMobileOnClickMask);
    // add nested menu toggler
    this.util.forEach(document.querySelectorAll('.menu-item>.nested-item'), ($nestedItem) => {
      $nestedItem.addEventListener('click', function () {
        this.parentNode.querySelector('.sub-menu').classList.toggle('open');
        this.querySelector('.dropdown-icon').classList.toggle('open');
      });
    });
  }

  initSwitchTheme() {
    this.util.forEach(document.getElementsByClassName('theme-switch'), ($themeSwitch) => {
      $themeSwitch.addEventListener('click', () => {
        document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
        this.isDark = !this.isDark;
        window.localStorage?.setItem('theme', this.isDark ? 'dark' : 'light');
        for (let event of this.switchThemeEventSet) {
          event(this.isDark);
        }
      }, false);
    });
  }

  initSearch() {
    const searchConfig = this.config.search;
    const isMobile = this.util.isMobile();
    if (!searchConfig || (isMobile && this._searchMobileOnce) || (!isMobile && this._searchDesktopOnce)) {
      return;
    }
    // Initialize default search config
    const maxResultLength = searchConfig.maxResultLength ?? 10;
    const snippetLength = searchConfig.snippetLength ?? 50;
    const highlightTag = searchConfig.highlightTag ?? 'em';
    const isCaseSensitive = searchConfig.isCaseSensitive ?? false;
    const minMatchCharLength = searchConfig.minMatchCharLength ?? 1;
    const findAllMatches = searchConfig.findAllMatches ?? false;
    const location = searchConfig.location ?? 0;
    const threshold = searchConfig.threshold ?? 0.3;
    const distance = searchConfig.distance ?? 100;
    const ignoreLocation = searchConfig.ignoreLocation ?? false;
    const useExtendedSearch = searchConfig.useExtendedSearch ?? false;
    const ignoreFieldNorm = searchConfig.ignoreFieldNorm ?? false;
    const suffix = isMobile ? 'mobile' : 'desktop';
    const $header = document.getElementById(`header-${suffix}`);
    const $searchInput = document.getElementById(`search-input-${suffix}`);
    const $searchToggle = document.getElementById(`search-toggle-${suffix}`);
    const $searchLoading = document.getElementById(`search-loading-${suffix}`);
    const $searchClear = document.getElementById(`search-clear-${suffix}`);

    if (isMobile) {
      this._searchMobileOnce = true;
      $searchInput.addEventListener('focus', () => {
        this.disableScrollEvent = true;
        document.body.classList.add('blur');
        $header.classList.add('open');
      }, false);
      document.getElementById('search-cancel-mobile').addEventListener('click', () => {
        this.disableScrollEvent = false;
        $header.classList.remove('open');
        document.body.classList.remove('blur');
        document.getElementById('menu-toggle-mobile').classList.remove('active');
        document.getElementById('menu-mobile').classList.remove('active');
        $searchLoading.style.display = 'none';
        $searchClear.style.display = 'none';
        this._searchMobile && this._searchMobile.autocomplete.setVal('');
      }, false);
      $searchClear.addEventListener('click', () => {
        $searchClear.style.display = 'none';
        this._searchMobile && this._searchMobile.autocomplete.setVal('');
      }, false);
      this._searchMobileOnClickMask = this._searchMobileOnClickMask || (() => {
        $header.classList.remove('open');
        $searchLoading.style.display = 'none';
        $searchClear.style.display = 'none';
        this._searchMobile && this._searchMobile.autocomplete.setVal('');
      });
      this.clickMaskEventSet.add(this._searchMobileOnClickMask);
    } else {
      this._searchDesktopOnce = true;
      $searchToggle.addEventListener('click', () => {
        document.body.classList.add('blur');
        $header.classList.add('open');
        $searchInput.focus();
      }, false);
      $searchClear.addEventListener('click', () => {
        $searchClear.style.display = 'none';
        this._searchDesktop && this._searchDesktop.autocomplete.setVal('');
      }, false);
      this._searchDesktopOnClickMask = this._searchDesktopOnClickMask ||(() => {
          $header.classList.remove('open');
          $searchLoading.style.display = 'none';
          $searchClear.style.display = 'none';
          this._searchDesktop && this._searchDesktop.autocomplete.setVal('');
        });
      this.clickMaskEventSet.add(this._searchDesktopOnClickMask);
    }
    $searchInput.addEventListener('input', () => {
      if ($searchInput.value === '') $searchClear.style.display = 'none';
      else $searchClear.style.display = 'inline';
    }, false);

    const initAutosearch = () => {
      const autosearch = autocomplete(`#search-input-${suffix}`,
        {
          hint: false,
          autoselect: true,
          dropdownMenuContainer: `#search-dropdown-${suffix}`,
          clearOnSelected: true,
          cssClasses: { noPrefix: true },
          debug: true
        },
        {
          name: 'search',
          source: (query, callback) => {
            $searchLoading.style.display = 'inline';
            $searchClear.style.display = 'none';
            const finish = (results) => {
              $searchLoading.style.display = 'none';
              $searchClear.style.display = 'inline';
              callback(results);
            };
            if (searchConfig.type === 'algolia') {
              this._algoliaIndex =
                this._algoliaIndex || algoliasearch(searchConfig.algoliaAppID, searchConfig.algoliaSearchKey).initIndex(searchConfig.algoliaIndex);
              this._algoliaIndex
                .search(query, {
                  offset: 0,
                  length: maxResultLength * 8,
                  attributesToHighlight: ['title'],
                  attributesToSnippet: [`content:${snippetLength}`],
                  highlightPreTag: `<${highlightTag}>`,
                  highlightPostTag: `</${highlightTag}>`
                })
                .then(({ hits }) => {
                  const results = {};
                  hits.forEach(({ uri, date, _highlightResult: { title }, _snippetResult: { content } }) => {
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
                })
                .catch((err) => {
                  console.error(err);
                  finish([]);
                });
            } else if (searchConfig.type === 'fuse') {
              const search = () => {
                const results = {};
                window._index.search(query).forEach(({ item, refIndex, matches }) => {
                  let title = item.title;
                  let content = item.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                  matches.forEach(({ indices, value, key }) => {
                    if (key === 'content') {
                      let offset = 0;
                      for (let i = 0; i < indices.length; i++) {
                        const substr = content.substring(indices[i][0] + offset, indices[i][1] + 1 + offset);
                        const tag = `<${highlightTag}>` + substr + `</${highlightTag}>`;
                        content = content.substring(0, indices[i][0] + offset) + tag + content.substring(indices[i][1] + 1 + offset, content.length);
                        offset += highlightTag.length * 2 + 5;
                      }
                    } else if (key === 'title') {
                      let offset = 0;
                      for (let i = 0; i < indices.length; i++) {
                        const substr = title.substring(indices[i][0] + offset, indices[i][1] + 1 + offset);
                        const tag = `<${highlightTag}>` + substr + `</${highlightTag}>`;
                        title = title.substring(0, indices[i][0] + offset) + tag + title.substring(indices[i][1] + 1 + offset, content.length);
                        offset += highlightTag.length * 2 + 5;
                      }
                    }
                  });
                  results[item.uri] = {
                    uri: item.uri,
                    title: title,
                    date: item.date,
                    context: content
                  };
                });
                return Object.values(results).slice(0, maxResultLength);
              };
              if (!window._index) {
                fetch(searchConfig.fuseIndexURL)
                  .then((response) => response.json())
                  .then((data) => {
                    const options = {
                      isCaseSensitive: isCaseSensitive,
                      findAllMatches: findAllMatches,
                      minMatchCharLength: minMatchCharLength,
                      location: location,
                      threshold: threshold,
                      distance: distance,
                      ignoreLocation: ignoreLocation,
                      useExtendedSearch: useExtendedSearch,
                      ignoreFieldNorm: ignoreFieldNorm,
                      includeScore: false,
                      shouldSort: true,
                      includeMatches: true,
                      keys: ['content', 'title']
                    };
                    window._index = new Fuse(data, options);
                    finish(search());
                  })
                  .catch((err) => {
                    console.error(err);
                    finish([]);
                  });
              } else finish(search());
            }            
          },
          templates: {
            suggestion: ({ title, date, context }) =>
              `<div><span class="suggestion-title">${title}</span><span class="suggestion-date">${date}</span></div><div class="suggestion-context">${context}</div>`,
            empty: ({ query }) => `<div class="search-empty">${searchConfig.noResultsFound}: <span class="search-query">"${query}"</span></div>`,
            footer: ({}) => {
              const { searchType, icon, href } =
                searchConfig.type === 'algolia'
                  ? {
                      searchType: 'algolia',
                      icon: '<i class="fa-brands fa-algolia fa-fw" aria-hidden="true"></i>',
                      href: 'https://www.algolia.com/'
                    }
                  : {
                      searchType: 'Fuse.js',
                      icon: '',
                      href: 'https://fusejs.io/'
                    }
              return `<div class="search-footer">Search by <a href="${href}" rel="noopener noreferrer" target="_blank">${icon} ${searchType}</a></div>`;
            }
          }
        }
      );
      autosearch.on('autocomplete:selected', (_event, suggestion, _dataset, _context) => {
        window.location.assign(suggestion.uri);
      });
      if (isMobile) {
        this._searchMobile = autosearch;
      } else {
        this._searchDesktop = autosearch;
      }
    };
    initAutosearch();
  }

  initBreadcrumb() {
    const $breadcrumbContainer = document.querySelector('.breadcrumb-container.sticky')
    this.breadcrumbHeight = $breadcrumbContainer?.clientHeight ?? 0;
    if (this.breadcrumbHeight) {
      document.querySelector('main.container')?.style.setProperty('--fi-breadcrumb-height', `${this.breadcrumbHeight}px`);
    }
  }

  initDetails(target = document) {
    this.util.forEach(target.getElementsByClassName('details'), ($details) => {
      const $summary = $details.querySelector('.details-summary');
      $summary.addEventListener('click', () => {
        $details.classList.toggle('open');
      }, false);
    });
  }

  initLightGallery() {
    if (this.config.lightgallery) {
      this.lg && this.lg.destroy(true);
      this.lg = lightGallery(document.getElementById('content'), {
        plugins: [lgThumbnail, lgZoom],
        selector: '.lightgallery',
        speed: 400,
        hideBarsDelay: 2000,
        allowMediaOverlap: true,
        exThumbImage: 'data-thumbnail',
        toggleThumb: true,
        thumbWidth: 80,
        thumbHeight: '60px',
        actualSize: false,
        showZoomInOutIcons: true,
        licenseKey: 'none'
      });
    }
  }

  /**
   * init code wrapper
   */
  initCodeWrapper() {
    if (!this.config.code) {
      this.initCopyCode();
      return
    }
    // if markup.highlight.lineNumbersInTable set to false
    this.util.forEach(document.querySelectorAll('.highlight > pre.chroma'), ($preChroma) => {
      const $chroma = document.createElement('div');
      $chroma.className = $preChroma.className;
      const $table = document.createElement('table');
      $chroma.appendChild($table);
      const $tbody = document.createElement('tbody');
      $table.appendChild($tbody);
      const $tr = document.createElement('tr');
      $tbody.appendChild($tr);
      const $td = document.createElement('td');
      $tr.appendChild($td);
      $preChroma.parentElement.replaceChild($chroma, $preChroma);
      $td.appendChild($preChroma);
    });
    // render code header
    this.util.forEach(document.querySelectorAll('.highlight > .chroma:not([data-init])'), ($chroma) => {
      $chroma.dataset.init = 'true';
      if ($chroma.parentElement.classList.contains('no-header')) {
        this.initCopyCode($chroma);
        return;
      }
      const $codeElements = $chroma.querySelectorAll('pre.chroma > code');
      if ($codeElements.length) {
        const $code = $codeElements[$codeElements.length - 1];
        const $header = document.createElement('div');
        $header.className = 'code-header ' + $code.className.toLowerCase();
        // code title
        const $title = document.createElement('span');
        $title.classList.add('code-title');
        // insert code title inner
        $title.insertAdjacentHTML(
          'afterbegin',
          $chroma.parentNode.title
            ? `<i class="arrow fa-solid fa-chevron-right fa-fw" aria-hidden="true"></i><span class="title-inner">${$chroma.parentNode.title}</span>`
            : '<i class="arrow fa-solid fa-chevron-right fa-fw" aria-hidden="true"></i>'
        );
        $title.addEventListener('click', () => {
          $chroma.classList.toggle('open');
        }, false);
        $header.appendChild($title);
        // ellipses icon
        const $ellipses = document.createElement('span');
        $ellipses.insertAdjacentHTML('afterbegin', '<i class="fa-solid fa-ellipsis-h fa-fw" aria-hidden="true"></i>');
        $ellipses.classList.add('ellipses');
        $ellipses.addEventListener('click', () => {
          $chroma.classList.add('open');
        }, false);
        $header.appendChild($ellipses);
        // edit button
        if (this.config.code.editable) {
          const $edit = document.createElement('span');
          $edit.classList.add('edit');
          $edit.insertAdjacentHTML('afterbegin', `<i class="fa-solid fa-pen-to-square fa-fw" title="${this.config.code.editUnLockTitle}" aria-hidden="true"></i>`);
          $edit.addEventListener('click', () => {
            const $iconKey = $edit.querySelector('.fa-pen-to-square');
            const $iconLock = $edit.querySelector('.fa-lock');
            const $preChromas = $edit.parentElement.parentElement.querySelectorAll('pre.chroma');
            const $preChroma = $preChromas.length === 2 ? $preChromas[1] : $preChromas[0];
            if ($iconKey) {
              $iconKey.classList.add('fa-lock');
              $iconKey.classList.remove('fa-pen-to-square');
              $iconKey.title = this.config.code.editLockTitle;
              $preChroma.setAttribute('contenteditable', true);
              $preChroma.focus();
            } else {
              $iconLock.classList.add('fa-pen-to-square');
              $iconLock.classList.remove('fa-lock');
              $iconLock.title = this.config.code.editUnLockTitle;
              $preChroma.setAttribute('contenteditable', false);
              $preChroma.blur();
            }
          }, false);
          $header.appendChild($edit);
        }
        // copy button
        if (this.config.code.copyTitle) {
          const $copy = document.createElement('span');
          $copy.insertAdjacentHTML('afterbegin', '<i class="fa-regular fa-copy fa-fw" aria-hidden="true"></i>');
          $copy.classList.add('copy');
          // remove the leading and trailing whitespace of the code string
          let code = $code.innerText.trim();
          // in the details element, the code string cannot be gotten directly.
          if ($chroma.closest('details') !== null) {
            const _tempEl = document.createElement('div');
            _tempEl.appendChild($code.cloneNode(true));
            code = _tempEl.innerText.trim();
          }
          const forceOpen = $chroma.parentElement.dataset.open ? JSON.parse($chroma.parentElement.dataset.open) : void 0;
          if (forceOpen ?? (this.config.code.maxShownLines < 0 || code.split('\n').length < this.config.code.maxShownLines + 2)) {
            $chroma.classList.add('open');
          }
          $copy.title = this.config.code.copyTitle;
          $copy.addEventListener('click', () => {
            navigator.clipboard.writeText(code).then(() => {
              this.util.animateCSS($code, 'animate__flash');
            }, () => {
              console.error('Clipboard write failed!', 'Your browser does not support clipboard API!');
            });
          }, false);
          $header.appendChild($copy);
        }
        $chroma.insertBefore($header, $chroma.firstChild);
      }
    });
  }

  initTable(target = document) {
    this.util.forEach(target.querySelectorAll('.content table'), ($table) => {
      const $wrapper = document.createElement('div');
      $wrapper.className = 'table-wrapper';
      $table.parentElement.replaceChild($wrapper, $table);
      $wrapper.appendChild($table);
    });
  }

  /**
   * init simple copy code when there is no code header
   * https://github.com/github/clipboard-copy-element
   * @param {ELement} singleCode single code block
   */
  initCopyCode(singleCode) {
    // TODO
  }

  /**
   * init table of contents
   */
  initToc() {
    const $tocCore = document.getElementById('TableOfContents');
    if ($tocCore === null) {
      return;
    }
    if (document.getElementById('toc-static').dataset.kept === 'true' || this.util.isTocStatic()) {
      const $tocContentStatic = document.getElementById('toc-content-static');
      if ($tocCore.parentElement !== $tocContentStatic) {
        $tocCore.parentElement.removeChild($tocCore);
        $tocContentStatic.appendChild($tocCore);
      }
      this._tocOnScroll && this.scrollEventSet.delete(this._tocOnScroll);
    } else {
      const $tocContentAuto = document.getElementById('toc-content-auto');
      if ($tocCore.parentElement !== $tocContentAuto) {
        $tocCore.parentElement.removeChild($tocCore);
        $tocContentAuto.appendChild($tocCore);
      }
      const $toc = document.getElementById('toc-auto');
      $toc.style.visibility = 'visible';
      this.util.animateCSS($toc, ['animate__fadeIn', 'animate__faster'], true);
      const $postMeta = document.querySelector('.post-meta');
      $toc.style.marginTop = `${$postMeta.offsetTop + $postMeta.clientHeight}px`;
      const $tocLinkElements = $tocCore.querySelectorAll('a:first-child');
      const $tocLiElements = $tocCore.getElementsByTagName('li');
      const $headingElements = document.getElementsByClassName('heading-element');
      const headerHeight = document.getElementById('header-desktop').offsetHeight;
      document.querySelector('.container').addEventListener('resize', () => {
        $toc.style.marginBottom = `${document.querySelector('.container').clientHeight - document.querySelector('.post-footer').offsetTop}px`;
      });
      this._tocOnScroll = this._tocOnScroll || (() => {
        $toc.style.marginBottom = `${document.querySelector('.container').clientHeight - document.querySelector('.post-footer').offsetTop}px`;
        this.util.forEach($tocLinkElements, ($tocLink) => {
          $tocLink.classList.remove('active');
        });
        this.util.forEach($tocLiElements, ($tocLi) => {
          $tocLi.classList.remove('has-active');
        });
        const INDEX_SPACING = 20 + (document.body.dataset.headerDesktop !== 'normal' ? headerHeight : 0) + this.breadcrumbHeight;
        let activeTocIndex = $headingElements.length - 1;
        for (let i = 0; i < $headingElements.length - 1; i++) {
          const thisTop = $headingElements[i].getBoundingClientRect().top;
          const nextTop = $headingElements[i + 1].getBoundingClientRect().top;
          if ((i == 0 && thisTop > INDEX_SPACING) || (thisTop <= INDEX_SPACING && nextTop > INDEX_SPACING)) {
            activeTocIndex = i;
            break;
          }
        }
        if (activeTocIndex !== -1 && $tocLinkElements[activeTocIndex]) {
          $tocLinkElements[activeTocIndex].classList.add('active');
          let $parent = $tocLinkElements[activeTocIndex].parentElement;
          while ($parent !== $tocCore) {
            $parent.classList.add('has-active');
            $parent = $parent.parentElement.parentElement;
          }
        }
      });
      this._tocOnScroll();
      this.scrollEventSet.add(this._tocOnScroll);
    }
  }

  initTocListener() {
    const $toc = document.getElementById('toc-auto');
    const $tocContentAuto = document.getElementById('toc-content-auto');
    document.querySelector('#toc-auto>.toc-title')?.addEventListener('click', () => {
      const animation = ['animate__faster'];
      const tocHidden = $toc.classList.contains('toc-hidden');
      animation.push(tocHidden ? 'animate__fadeIn' : 'animate__fadeOut');
      $tocContentAuto.classList.remove(tocHidden ? 'animate__fadeOut' : 'animate__fadeIn');
      this.util.animateCSS($tocContentAuto, animation, true);
      $toc.classList.toggle('toc-hidden');
    }, false);
  }

  /**
   * It's a dirty hack to fix the bug of APlayer and smoothScroll. 
   * see https://github.com/hugo-fixit/FixIt/issues/292
   */
  fixTocScroll() {
    if (typeof APlayer === 'function') {
      // remove APlayer click event listener of the toc link
      let $tocCore = document.getElementById('TableOfContents');
      if ($tocCore) {
        const $newTocCore = $tocCore.cloneNode(true);
        $tocCore.parentElement.replaceChild($newTocCore, $tocCore);
        $tocCore = $newTocCore;
      }
      // remove APlayer click event listener of the heading mark
      this.util.forEach(document.querySelectorAll('.heading-mark'), ($headingMark) => {
        const $newHeadingMark = $headingMark.cloneNode(true);
        $headingMark.parentElement.replaceChild($newHeadingMark, $headingMark);
      });
    }
  }

  initMath(target = document.body) {
    if (this.config.math) {
      renderMathInElement(target, this.config.math);
    }
  }

  initMermaid() {
    if (!window.mermaid?.initialize) {
      return;
    }
    const _initializeAndRun = () => {
      const themes = window.mermaid.themes ?? ['default', 'dark'];
      window.mermaid.initialize({
        securityLevel: 'loose',
        startOnLoad: false,
        theme: this.isDark ? themes[1] : themes[0],
      });
      window.mermaid.run()
    }
    _initializeAndRun()
    this.switchThemeEventSet.add(() => {
      // Reinitialize and run mermaid when theme changes.
      this.util.forEach(document.querySelectorAll('.mermaid[data-processed]'), ($mermaid) => {
        $mermaid.dataset.processed = ''
        $mermaid.innerHTML = ''
        $mermaid.appendChild($mermaid.nextElementSibling.content.cloneNode(true))
      })
      _initializeAndRun()
    });
    this.beforeprintEventSet.add(() => { 
      // Set the theme to neutral when printing.
    });
  }

  initEcharts() {
    if (!this.config.echarts) {
      return;
    }
    echarts.registerTheme('light', this.config.echarts.lightTheme);
    echarts.registerTheme('dark', this.config.echarts.darkTheme);
    this._echartsOnSwitchTheme = this._echartsOnSwitchTheme || (() => {
      this._echartsArr = this._echartsArr || [];
      for (let i = 0; i < this._echartsArr.length; i++) {
        this._echartsArr[i].dispose();
      }
      this._echartsArr = [];
      const stagingDOM = this.util.getStagingDOM()
      this.util.forEach(document.getElementsByClassName('echarts'), ($echarts) => {
        if ($echarts.nextElementSibling.tagName === 'TEMPLATE') {
          const chart = echarts.init($echarts, this.isDark ? 'dark' : 'light', { renderer: 'svg' });
          stagingDOM.stage($echarts.nextElementSibling.content.cloneNode(true));
          chart.setOption(stagingDOM.contentAsJson());
          this._echartsArr.push(chart);
        }
      });
      stagingDOM.destroy();
    });
    this.switchThemeEventSet.add(this._echartsOnSwitchTheme);
    this._echartsOnSwitchTheme();
    this._echartsOnResize = this._echartsOnResize || (() => {
      for (let i = 0; i < this._echartsArr.length; i++) {
        this._echartsArr[i].resize();
      }
    });
    this.resizeEventSet.add(this._echartsOnResize);
  }

  initMapbox() {
    if (this.config.mapbox) {
      if (!mapboxgl.accessToken) {
        mapboxgl.accessToken = this.config.mapbox.accessToken;
        mapboxgl.setRTLTextPlugin(this.config.mapbox.RTLTextPlugin);
        this._mapboxArr = this._mapboxArr || [];
      }
      this.util.forEach(document.querySelectorAll('.mapbox:empty'), ($mapbox) => {
        const { lng, lat, zoom, lightStyle, darkStyle, marked, navigation, geolocate, scale, fullscreen } = JSON.parse($mapbox.dataset.options);
        const mapbox = new mapboxgl.Map({
          container: $mapbox,
          center: [lng, lat],
          zoom: zoom,
          minZoom: 0.2,
          style: this.isDark ? darkStyle : lightStyle,
          attributionControl: false
        });
        if (marked) {
          new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapbox);
        }
        if (navigation) {
          mapbox.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        }
        if (geolocate) {
          mapbox.addControl(
            new mapboxgl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true
              },
              showUserLocation: true,
              trackUserLocation: true
            }),
            'bottom-right'
          );
        }
        if (scale) {
          mapbox.addControl(new mapboxgl.ScaleControl());
        }
        if (fullscreen) {
          mapbox.addControl(new mapboxgl.FullscreenControl());
        }
        mapbox.addControl(new MapboxLanguage());
        this._mapboxArr.push(mapbox);
      });
      this._mapboxOnSwitchTheme = this._mapboxOnSwitchTheme || (() => {
        this.util.forEach(this._mapboxArr, (mapbox) => {
          const $mapbox = mapbox.getContainer();
          const { lightStyle, darkStyle } = JSON.parse($mapbox.dataset.options);
          mapbox.setStyle(this.isDark ? darkStyle : lightStyle);
          mapbox.addControl(new MapboxLanguage());
        });
      });
      this.switchThemeEventSet.add(this._mapboxOnSwitchTheme);
    }
  }

  initTypeit(target = document) {
    if (this.config.typeit) {
      const typeitConfig = this.config.typeit;
      const speed = typeitConfig.speed || 100;
      const cursorSpeed = typeitConfig.cursorSpeed || 1000;
      const cursorChar = typeitConfig.cursorChar || '|';
      const loop = typeitConfig.loop ?? false;
      // divide them into different groups according to the data-group attribute value of the element
      // results in an object like {group1: [ele1, ele2], group2: [ele3, ele4]}
      const typeitElements = target.querySelectorAll('.typeit')
      const groupMap = Array.from(typeitElements).reduce((acc, ele) => {
        const group = ele.dataset.group || ele.id || Math.random().toString(36).substring(2);
        acc[group] = acc[group] || [];
        acc[group].push(ele);
        return acc;
      }, {});
      const stagingDOM = this.util.getStagingDOM()

      Object.values(groupMap).forEach((group) => {
        const typeone = (i) => {
          const typeitElement = group[i];
          const singleLoop = typeitElement.dataset.loop;
          stagingDOM.stage(typeitElement.querySelector('template').content.cloneNode(true));
          // for shortcodes usage
          let targetEle = typeitElement.firstElementChild
          // for system elements usage
          if (typeitElement.firstElementChild.tagName === 'TEMPLATE') {
            typeitElement.innerHTML = '';
            targetEle = typeitElement
          }
          // create a new instance of TypeIt for each element
          const instance = new TypeIt(targetEle, {
            strings: stagingDOM.$el.querySelector('pre')?.innerHTML || stagingDOM.contentAsHtml(),
            speed: speed,
            lifeLike: true,
            cursorSpeed: cursorSpeed,
            cursorChar: cursorChar,
            waitUntilVisible: true,
            loop: singleLoop ? JSON.parse(singleLoop) : loop,
            afterComplete: () => {
              if (i === group.length - 1) {
                if (typeitConfig.duration >= 0) {
                  window.setTimeout(() => {
                    instance.destroy();
                  }, typeitConfig.duration);
                }
                return;
              }
              instance.destroy();
              typeone(i + 1);
            }
          }).go();
        };
        typeone(0);
      });
      stagingDOM.destroy();
    }
  }

  initCommentLightGallery(comments, images) {
    document.querySelectorAll(comments).forEach(($content) => {
      const $imgs = $content.querySelectorAll(images + ':not([lightgallery-loaded])');
      $imgs.forEach(($img) => {
        $img.setAttribute('lightgallery-loaded', '');
        const $link = document.createElement('a');
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

  initComment() {
    if (!this.config.comment?.enable) {
      return;
    }
    // whether to show the view comments button
    if (document.querySelector('#comments')) {
      const $viewCommentsBtn = document.querySelector('.view-comments');
      $viewCommentsBtn.classList.remove('d-none');
      // view comments button click event
      $viewCommentsBtn.addEventListener('click', () => {
        this.util.scrollIntoView('#comments');
      }, false);
    }
    this.config.comment.expired && document.querySelector('#comments').remove();
    if (this.config.comment.artalk) {
      if (this.config.comment.expired) {
        return Artalk.LoadCountWidget({
          server: this.config.comment.artalk.server,
          site: this.config.comment.artalk.site,
          pvEl: this.config.comment.artalk.pvEl,
          countEl: this.config.comment.artalk.countEl
        })
      }
      const artalk = Artalk.init(this.config.comment.artalk);
      artalk.setDarkMode(this.isDark);
      this.switchThemeEventSet.add(() => {
        artalk.setDarkMode(this.isDark);
      });
      artalk.on('comments-loaded', () => {
        this.config.comment.artalk.lightgallery && this.initCommentLightGallery('.atk-comment .atk-content', 'img:not([atk-emoticon])');
      });
      return artalk;
    }
    if (this.config.comment.gitalk) {
      this.config.comment.gitalk.body = decodeURI(window.location.href);
      const gitalk = new Gitalk(this.config.comment.gitalk);
      gitalk.render('gitalk');
      return gitalk;
    }
    if (this.config.comment.valine) {
      return new Valine(this.config.comment.valine);
    }
    if (this.config.comment.waline) {
      if (this.config.comment.expired) {
        this.config.comment.waline.pageview && Waline.pageviewCount({
          serverURL: this.config.comment.waline.serverURL,
          path: window.location.pathname
        });
        return;
      }
      return Waline.init(this.config.comment.waline);
    }
    if (this.config.comment.utterances) {
      const utterancesConfig = this.config.comment.utterances;
      const script = document.createElement('script');
      script.src = 'https://utteranc.es/client.js';
      script.setAttribute('repo', utterancesConfig.repo);
      script.setAttribute('issue-term', utterancesConfig.issueTerm);
      if (utterancesConfig.label) script.setAttribute('label', utterancesConfig.label);
      script.setAttribute('theme', this.isDark ? utterancesConfig.darkTheme : utterancesConfig.lightTheme);
      script.crossOrigin = 'anonymous';
      script.async = true;
      document.getElementById('utterances').appendChild(script);
      this._utterancesOnSwitchTheme = this._utterancesOnSwitchTheme || (() => {
        const message = {
          type: 'set-theme',
          theme: this.isDark ? utterancesConfig.darkTheme : utterancesConfig.lightTheme
        };
        document.querySelector('.utterances-frame')?.contentWindow.postMessage(message, 'https://utteranc.es');
      });
      this.switchThemeEventSet.add(this._utterancesOnSwitchTheme);
      return;
    }
    if (this.config.comment.twikoo) {
      const twikooConfig = this.config.comment.twikoo;
      if (twikooConfig.lightgallery) {
        twikooConfig.onCommentLoaded = () => {
          this.initCommentLightGallery('.tk-comments .tk-content', 'img:not(.tk-owo-emotion)');
        };
      }
      twikoo.init(twikooConfig);
      if (twikooConfig.commentCount) {
        // https://twikoo.js.org/api.html#get-comments-count
        twikoo
          .getCommentsCount({
            envId: twikooConfig.envId,
            region: twikooConfig.region,
            urls: [window.location.pathname],
            includeReply: false
          })
          .then(function (response) {
            const twikooCommentCount = document.getElementById('twikoo-comment-count');
            if (twikooCommentCount) twikooCommentCount.innerHTML = response[0].count;
          });
      }
      return;
    }
    if (this.config.comment.giscus) {
      const giscusConfig = this.config.comment.giscus;
      this._giscusOnSwitchTheme = this._giscusOnSwitchTheme || (() => {
        const message = { setConfig: { theme: this.isDark ? giscusConfig.darkTheme : giscusConfig.lightTheme }};
        document.querySelector('.giscus-frame')?.contentWindow.postMessage({ giscus: message }, giscusConfig.origin);
      });
      this.switchThemeEventSet.add(this._giscusOnSwitchTheme);
      this.giscus2parentMsg = window.addEventListener('message', (event) => {
        const $script = document.querySelector('#giscus>script');
        if ($script){
          this._giscusOnSwitchTheme();
          $script.parentElement.removeChild($script);
        }
      }, { once: true });
      return;
    }
  }

  initCookieconsent() {
    this.config.cookieconsent && window.cookieconsent?.initialise(this.config.cookieconsent);
  }

  getSiteTime = () => {
    let now = new Date();
    let run = new Date(this.config.siteTime);
    let $runTimes = document.querySelector('.run-times');
    if (!this.util.isValidDate(run) || !$runTimes) {
      clearInterval(this.siteTime);
      $runTimes && $runTimes.parentNode.remove();
      return;
    }
    let runTime = (now - run) / 1000,
      days = Math.floor(runTime / 60 / 60 / 24),
      hours = Math.floor(runTime / 60 / 60 - 24 * days),
      minutes = Math.floor(runTime / 60 - 24 * 60 * days - 60 * hours),
      seconds = Math.floor((now - run) / 1000 - 24 * 60 * 60 * days - 60 * 60 * hours - 60 * minutes);
    $runTimes.innerHTML = `${days}, ${String(hours).padStart(2, 0)}:${String(minutes).padStart(2, 0)}:${String(seconds).padStart(2, 0)}`;
    document.querySelector('.site-time .d-none')?.classList.remove('d-none');
  };

  initSiteTime() {
    if (this.config.siteTime) {
      this.siteTime = setInterval(this.getSiteTime, 500);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          return clearInterval(this.siteTime);
        }
        this.siteTime = setInterval(this.getSiteTime, 500);
      }, false);
    }
  }

  initServiceWorker() {
    if (this.config.enablePWA && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.min.js', { scope: '/' })
        .then(function (registration) {
          // console.log('Service Worker Registered');
        })
        .catch(function (error) {
          console.error('error: ', error);
        });
      navigator.serviceWorker
        .ready
        .then(function (registration) {
        // console.log('Service Worker Ready');
      });
    }
  }

  initWatermark() {
    this.config.watermark?.enable &&
      new Watermark({
        content: this.config.watermark.content || `${document.querySelector('footer .fixit-icon')?.outerHTML ?? ''} FixIt Theme`,
        appendTo: '.widgets',
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

  initPangu() {
    if (!this.config.pangu?.enable) {
      return;
    }
    const selector = this.config.pangu.selector;
    if (selector) {
      if (selector.startsWith('#')) {
        pangu.spacingElementById(selector.slice(1));
      } else if (selector.startsWith('.')) {
        pangu.spacingElementByClassName(selector.slice(1));
      } else {
        pangu.spacingElementByTagName(selector)
      }
      return;
    }
    pangu.autoSpacingPage();
  }

  initFixItDecryptor() {
    this.decryptor = new FixItDecryptor({
      decrypted: () => {
        this.initTwemoji();
        this.initDetails();
        this.initLightGallery();
        this.initCodeWrapper();
        this.initTable();
        this.initMath();
        this.initMermaid();
        this.initEcharts();
        this.initTypeit();
        this.initMapbox();
        this.initToc();
        this.initTocListener();
        this.initPangu();
        this.fixTocScroll();
        this.util.forEach(document.querySelectorAll('.encrypted-hidden'), ($element) => {
          $element.classList.replace('encrypted-hidden', 'decrypted-shown');
        });
      },
      partialDecrypted: ($content) => {
        this.initTwemoji($content);
        this.initDetails($content);
        this.initLightGallery();
        this.initCodeWrapper();
        this.initTable($content);
        this.initMath($content);
        this.initMermaid();
        this.initEcharts();
        this.initTypeit($content);
        this.initMapbox();
        this.initPangu();
        this.util.forEach($content.querySelectorAll('.encrypted-hidden'), ($element) => {
          $element.classList.replace('encrypted-hidden', 'decrypted-shown');
        });
      },
      reset: () => {
        this.util.forEach(document.querySelectorAll('.decrypted-shown'), ($element) => {
          $element.classList.replace('decrypted-shown', 'encrypted-hidden');
        });
      }
    });
    if (this.config.encryption?.shortcode) {
      this.decryptor.addEventListener('decrypted', () => {
        this.decryptor.initShortcodes();
      })
      this.decryptor.addEventListener('partial-decrypted', () => {
        this.decryptor.initShortcodes();
      })
      this.decryptor.initShortcodes();
    }
    this.config.encryption?.all && this.decryptor.init();
  }

  initMDevtools() {
    const type = this.config?.mDevtools;
    if (typeof window.orientation === 'undefined') {
      return;
    }
    if (type === 'vConsole') {
      const vConsole = new VConsole({
        target: '.widgets',
        theme: this.isDark ? 'dark' : 'light'
      });
      this._vConsoleOnSwitchTheme = this._vConsoleOnSwitchTheme || (() => {
        vConsole.setOption('theme', this.isDark ? 'dark' : 'light');
      });
      this.switchThemeEventSet.add(this._vConsoleOnSwitchTheme);
    }
    if(type === 'eruda') {
      eruda.init({
        defaults: { theme: this.isDark ? 'Dark' : 'Light' }
      });
      this._erudaOnSwitchTheme = this._erudaOnSwitchTheme || (() => {
        eruda.util.evalCss.setTheme(this.isDark ? 'Dark' : 'Light');
      });
      this.switchThemeEventSet.add(this._erudaOnSwitchTheme);
    }
  }

  initAutoMark() {
    if (!this.config.autoBookmark) {
      return;
    }
    window.addEventListener('beforeunload', () => {
      window.sessionStorage?.setItem(`fixit-bookmark/#${location.pathname}`, this.util.getScrollTop());
    });
    const scrollTop = Number(window.sessionStorage?.getItem(`fixit-bookmark/#${location.pathname}`));
    // If the page opens with a specific hash, just jump out
    if (scrollTop && location.hash === '') {
      window.scrollTo({ 
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }

  initReward() {
    const $rewards = document.querySelectorAll('.post-reward [data-mode="fixed"]');
    if (!$rewards.length) {
      return;
    }
    // `fixed` mode only supports desktop
    if (this.util.isMobile()) {
      this.util.forEach($rewards, ($reward) => {
        $reward.removeAttribute('data-mode');
      });
      return;
    }
    // Close post reward images exclude special id
    const _closeRewardExclude = (id) => {
      this.util.forEach($rewards, ($reward) => {
        const $rewardInput = $reward.parentElement.querySelector('.reward-input');
        if ($rewardInput.id !== id) {
          $rewardInput.checked = false;
        }
      });
    };
    // Add additional click event to reward buttons
    this.util.forEach($rewards, ($reward) => {
      $reward.previousElementSibling.addEventListener('click', function () {
        _closeRewardExclude(this.getAttribute('for'));
      }, false)
    });
    this.scrollEventSet.add(_closeRewardExclude);
  }

  onScroll() {
    const $headers = [];
    const ACCURACY = 20;
    const $fixedButtons = document.querySelector('.fixed-buttons');
    const $backToTop = document.querySelector('.back-to-top');
    const $readingProgressBar = document.querySelector('.reading-progress-bar');
    if (document.body.dataset.headerDesktop === 'auto') {
      $headers.push(document.getElementById('header-desktop'));
    }
    if (document.body.dataset.headerMobile === 'auto') {
      $headers.push(document.getElementById('header-mobile'));
    }
    // b2t button click event
    $backToTop?.addEventListener('click', () => {
      this.util.scrollIntoView('body');
    });
    window.addEventListener('scroll', (event) => {
      if (this.disableScrollEvent) {
        event.preventDefault();
        return;
      }
      const $mask = document.getElementById('mask');
      this.newScrollTop = this.util.getScrollTop();
      const scroll = this.newScrollTop - this.oldScrollTop;
      // header animation
      this.util.forEach($headers, ($header) => {
        if (scroll > ACCURACY) {
          $header.classList.remove('animate__fadeInDown');
          this.util.animateCSS($header, ['animate__fadeOutUp'], true);
          $mask.click();
        } else if (scroll < -ACCURACY) {
          $header.classList.remove('animate__fadeOutUp');
          this.util.animateCSS($header, ['animate__fadeInDown'], true);
          $mask.click();
        }
      });
      const contentHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = Math.max(Math.min(100 * Math.max(this.newScrollTop, 0) / contentHeight, 100), 0);
      if ($readingProgressBar) {
        $readingProgressBar.style.setProperty('--progress', `${scrollPercent.toFixed(2)}%`);
      }
      // whether to show fixed buttons
      if ($fixedButtons) {
        if (scrollPercent > 1) {
          $fixedButtons.classList.remove('d-none', 'animate__fadeOut');
          this.util.animateCSS($fixedButtons, ['animate__fadeIn'], true);
        } else {
          $fixedButtons.classList.remove('animate__fadeIn');
          this.util.animateCSS($fixedButtons, ['animate__fadeOut'], true, () => {
            $fixedButtons.classList.contains('animate__fadeOut') && $fixedButtons.classList.add('d-none');
          });
        }
        if ($backToTop) {
          $backToTop.querySelector('span').innerText = `${Math.round(scrollPercent)}%`;
        }
      }
      for (let event of this.scrollEventSet) {
        event();
      }
      this.oldScrollTop = this.newScrollTop;
    }, false);
  }

  onResize() {
    let resizeBefore = this.util.isMobile();
    window.addEventListener('resize', () => {
      if (!this._resizeTimeout) {
        this._resizeTimeout = window.setTimeout(() => {
          this._resizeTimeout = null;
          for (let event of this.resizeEventSet) {
            event();
          }
          this.initToc();
          this.initSearch();

          const isMobile = this.util.isMobile()
          if (isMobile !== resizeBefore) {
            document.getElementById('mask').click();
            resizeBefore = isMobile;
          }
        }, 100);
      }
    }, false);
  }

  onClickMask() {
    document.getElementById('mask').addEventListener('click', () => {
      if (!document.body.classList.contains('blur')) {
        return;
      }
      for (let event of this.clickMaskEventSet) {
        event();
      }
      this.disableScrollEvent = false;
      document.body.classList.remove('blur');
    }, false);
  }

  beforeprint() {
    window.addEventListener('beforeprint', () => {
      this.util.forEach(document.querySelectorAll('.chroma'), ($el) => {
        $el.classList.toggle('open', true)
      });
      for (let event of this.beforeprintEventSet) {
        event();
      }
    }, false);
  }

  init() {
    try {
      if (this.config.encryption) {
        this.initFixItDecryptor();
      }
      if (!this.config.encryption?.all) {
        this.initTwemoji();
        this.initDetails();
        this.initLightGallery();
        this.initCodeWrapper();
        this.initTable();
        this.initMath();
        this.initMermaid();
        this.initEcharts();
        this.initTypeit();
        this.initMapbox();
        this.initPangu();
      }
      this.initThemeColor();
      this.initSVGIcon();
      this.initMenu();
      this.initSwitchTheme();
      this.initSearch();
      this.initBreadcrumb();
      this.initCookieconsent();
      this.initSiteTime();
      this.initServiceWorker();
      this.initWatermark();
      this.initMDevtools();
      this.initAutoMark();
      this.initReward();

      window.setTimeout(() => {
        this.initComment();
        if (!this.config.encryption?.all) {
          this.initToc();
          this.initTocListener();
          this.fixTocScroll();
        }
        this.onScroll();
        this.onResize();
        this.onClickMask();
        this.beforeprint();
      }, 100);
    } catch (err) {
      console.error(err);
    }
  }
}

const themeInit = () => {
  window.fixit = new FixIt();
  window.fixit.init();
};

if (document.readyState !== 'loading') {
  themeInit();
} else {
  document.addEventListener('DOMContentLoaded', themeInit, false);
}
