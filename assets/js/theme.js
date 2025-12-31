// TODO use ESLint to check the code style
import Util from './util';

class FixIt {
  constructor() {
    this.config = window.config;
    this.isDark = document.documentElement.dataset.theme === 'dark';
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
    if (!$meta) return;
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

  initTwemoji(target = document) {
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
        document.documentElement.dataset.theme = this.isDark ? 'light' : 'dark';
        document.documentElement.style.setProperty('color-scheme', this.isDark ? 'light' : 'dark');
        this.isDark = !this.isDark;
        window.localStorage?.setItem('theme', this.isDark ? 'dark' : 'light');
        for (let event of this.switchThemeEventSet) {
          event(this.isDark);
        }
      }, false);
    });
  }

  /**
   * Helper method to apply highlight tags to text based on match indices
   * @param {String} text - The text to highlight
   * @param {Array} indices - Array of match indices
   * @param {String} highlightTag - The HTML tag to use for highlighting
   * @returns {String} The highlighted text
   */
  _applyHighlightToText(text, indices, highlightTag) {
    let offset = 0;
    for (let i = 0; i < indices.length; i++) {
      const substr = text.substring(indices[i][0] + offset, indices[i][1] + 1 + offset);
      const tag = `<${highlightTag}>` + substr + `</${highlightTag}>`;
      text = text.substring(0, indices[i][0] + offset) + tag + text.substring(indices[i][1] + 1 + offset, text.length);
      offset += highlightTag.length * 2 + 5;
    }
    return text;
  }

  /**
   * Helper method to reset search UI elements
   * @param {Element} $header - The header element
   * @param {Element} $searchLoading - The loading indicator element
   * @param {Element} $searchClear - The clear button element
   * @param {Object} searchInstance - The search autocomplete instance
   */
  _resetSearchUI($header, $searchLoading, $searchClear, searchInstance) {
    $header.classList.remove('open');
    $searchLoading.style.display = 'none';
    $searchClear.style.display = 'none';
    searchInstance && searchInstance.autocomplete.setVal('');
  }

  initSearch() {
    const searchConfig = this.config.search;
    const isMobile = this.util.isMobile();
    if (
      !searchConfig ||
      (isMobile && this._searchMobileOnce) ||
      (!isMobile && this._searchDesktopOnce)
    )
      return;
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
    const $searchCancel = document.getElementById('search-cancel-mobile');

    // goto the PostChat panel rather than search results
    if (searchConfig.type === 'post-chat' && window.postChatUser) {
      if (isMobile) {
        $searchInput.addEventListener('focus', () => {
          window.postChatUser.setSearchInput('');
        }, false);
      } else {
        $searchToggle.addEventListener('click', () => {
          window.postChatUser.setSearchInput('');
        }, false);
      }
      return;
    }

    if (isMobile) {
      this._searchMobileOnce = true;
      $searchInput.addEventListener('focus', () => {
        this.disableScrollEvent = true;
        document.body.classList.add('blur');
        $header.classList.add('open');
      }, false);
      $searchCancel.addEventListener('click', () => {
        this.disableScrollEvent = false;
        document.body.classList.remove('blur');
        document.getElementById('menu-toggle-mobile').classList.remove('active');
        document.getElementById('menu-mobile').classList.remove('active');
        this._resetSearchUI($header, $searchLoading, $searchClear, this._searchMobile);
      }, false);
      $searchClear.addEventListener('click', () => {
        $searchClear.style.display = 'none';
        this._searchMobile && this._searchMobile.autocomplete.setVal('');
      }, false);
      this._searchMobileOnClickMask = this._searchMobileOnClickMask || (() => {
        this._resetSearchUI($header, $searchLoading, $searchClear, this._searchMobile);
      });
      this.clickMaskEventSet.add(this._searchMobileOnClickMask);
    } else {
      this._searchDesktopOnce = true;
      $searchToggle.addEventListener('click', () => {
        document.body.classList.add('blur');
        $header.classList.add('open');
        $searchInput.focus();
        this.disableScrollEvent = true;
      }, false);
      $searchClear.addEventListener('click', () => {
        this.disableScrollEvent = false;
        $searchClear.style.display = 'none';
        this._searchDesktop && this._searchDesktop.autocomplete.setVal('');
      }, false);
      this._searchDesktopOnClickMask = this._searchDesktopOnClickMask || (() => {
        this._resetSearchUI($header, $searchLoading, $searchClear, this._searchDesktop);
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
                this._algoliaIndex ||
                algoliasearch(
                  searchConfig.algoliaAppID,
                  searchConfig.algoliaSearchKey
                ).initIndex(searchConfig.algoliaIndex);
              this._algoliaIndex
                .search(query, {
                  offset: 0,
                  length: maxResultLength * 8,
                  attributesToHighlight: ['title'],
                  attributesToRetrieve: ['*'],
                  attributesToSnippet: [`content:${snippetLength}`],
                  highlightPreTag: `<${highlightTag}>`,
                  highlightPostTag: `</${highlightTag}>`
                })
                .then(({ hits }) => {
                  const results = {};
                  hits.forEach(({ uri, date, _highlightResult: { title }, _snippetResult: { content } }) => {
                    if (results[uri] && results[uri].context.length > content.value) return;
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
                      content = this._applyHighlightToText(content, indices, highlightTag);
                    } else if (key === 'title') {
                      title = this._applyHighlightToText(title, indices, highlightTag);
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
            } else if (searchConfig.type === 'cse') {
              const cseConfig = this.config.cse;
              if (cseConfig.engine === 'google' && cseConfig.cx) {
                finish([{
                  uri: `${cseConfig.resultsPage}#gsc.tab=0&gsc.q=${encodeURIComponent(query)}`,
                  title: cseConfig.searchIn,
                  date: '<i class="fa-brands fa-searchengin fa-xl" aria-hidden="true"></i>',
                  context: cseConfig.gotoResultsPage
                }]);
              }
            } else {
              finish([]);
            }
          },
          templates: {
            suggestion: ({ title, uri, date, context }) =>
              `<div><a href="${uri}"><span class="suggestion-title">${title}</span></a><span class="suggestion-date">${date}</span></div><div class="suggestion-context">${context}</div>`,
            empty: ({ query }) => `<div class="search-empty">${searchConfig.noResultsFound}: <span class="search-query">"${query}"</span></div>`,
            footer: ({ }) => {
              let searchType, icon, href;
              switch (searchConfig.type) {
                case 'algolia':
                  searchType = 'algolia';
                  icon = '<i class="fa-brands fa-algolia fa-fw" aria-hidden="true"></i>';
                  href = 'https://www.algolia.com/';
                  break;
                case 'fuse':
                  searchType = 'Fuse.js';
                  icon = '';
                  href = 'https://fusejs.io/';
                  break;
                case 'cse':
                  if (this.config.cse.engine === 'google') {
                    searchType = 'Google CSE';
                    icon = '<i class="fa-brands fa-google fa-fw" aria-hidden="true"></i>';
                    href = 'https://programmablesearchengine.google.com/';
                  }
                  break;
                default:
                  searchType = '';
                  icon = '';
                  href = '';
              }
              return `<div class="search-footer">Search by <a href="${href}" rel="noopener noreferrer" target="_blank">${icon} ${searchType}</a></div>`;
            }
          }
        }
      );
      autosearch.on('autocomplete:selected', (_event, suggestion, _dataset, _context) => {
        document.getElementById('mask')?.click();
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
      document.querySelector('main.fi-container')?.style.setProperty('--fi-breadcrumb-height', `${this.breadcrumbHeight}px`);
    }
  }

  initDetails(target = document) {
    this.util.forEach(target.querySelectorAll('.details:not(.disabled)'), ($details) => {
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
   * init copy code button for code blocks in all modes (classic and non-classic)
   * @param {HTMLElement} codeBlock code block wrapper element
   * @param {HTMLElement} codePreEl single code block pre element
   */
  initCopyCode(codeBlock, codePreEl) {
    const copyBtn = codeBlock.dataset.mode === 'classic'
      ? codeBlock.querySelector('.code-header .copy-btn')
      : codeBlock.querySelector('.code-copy-btn');
    if (codeBlock.dataset.copyable !== 'true' || !copyBtn) return;
    copyBtn.addEventListener('click', () => {
      const iswWrap = codeBlock.classList.contains('line-wrapping');
      const highlightLines = codeBlock.querySelectorAll('.hl');
      iswWrap && codeBlock.classList.toggle('line-wrapping');
      this.util.forEach(highlightLines, $hl => $hl.classList.toggle('hl'));
      this.util.copyText(codePreEl.innerText.trim()).then(() => {
        this.util.animateCSS(codePreEl, 'animate__flash');
        iswWrap && codeBlock.classList.toggle('line-wrapping');
        this.util.forEach(highlightLines, $hl => $hl.classList.toggle('hl'));
        copyBtn.toggleAttribute('data-copied', true);
        setTimeout(() => {
          copyBtn.toggleAttribute('data-copied', false);
        }, 2000);
      }, () => {
        console.error('Clipboard write failed!', 'Your browser does not support clipboard API!');
      });
    }, false);
  }

  initCodeExpandBtn(codeBlock) {
    codeBlock.querySelector('.code-expand-btn')?.addEventListener('click', () => {
      codeBlock.classList.toggle('is-expanded');
    }, false);
  }

  /**
   * init code wrapper
   */
  initCodeWrapper() {
    const $codeBlocks = document.querySelectorAll('.code-block.highlight:not([data-init])');
    this.util.forEach($codeBlocks, ($codeBlock) => {
      const $preElements = $codeBlock.querySelectorAll('pre.chroma');
      if (!$preElements.length) return;
      const $codePreEl = $preElements[$preElements.length - 1];
      $codeBlock.dataset.init = 'true';

      this.initCopyCode($codeBlock, $codePreEl);
      this.initCodeExpandBtn($codeBlock);

      // classic mode code block interactions
      if ($codeBlock.dataset.mode === 'classic') {
        const $codeHeader = $codeBlock.querySelector('.code-header');
        if (!$codeHeader) return;
        // code title
        $codeHeader.querySelector('.code-title').addEventListener('click', () => {
          $codeBlock.classList.toggle('is-collapsed');
        }, false);
        // ellipses icon
        $codeHeader.querySelector('.ellipses-btn').addEventListener('click', () => {
          $codeBlock.classList.remove('is-collapsed');
        }, false);
        // line numbers toggle button
        $codeHeader.querySelector('.line-nos-btn')?.addEventListener('click', () => {
          $codeBlock.classList.toggle('line-nos-hidden');
        }, false);
        // line wrapping toggle button
        $codeHeader.querySelector('.line-wrap-btn')?.addEventListener('click', () => {
          $codeBlock.classList.toggle('line-wrapping');
        }, false);
        // edit button toggle button
        if ($codeBlock.dataset.editable === 'true') {
          $codeHeader.querySelector('.edit-btn')?.addEventListener('click', () => {
            const isEditable = $codePreEl.getAttribute('contenteditable') === 'true'
            if (isEditable) {
              $codePreEl.setAttribute('contenteditable', false);
              $codePreEl.blur();
            } else {
              this.util.forEach($codeBlock.querySelectorAll('.hl'), ($hl) => {
                $hl.classList.remove('hl');
              });
              $codeBlock.classList.add('is-expanded');
              $codePreEl.setAttribute('contenteditable', true);
              $codePreEl.focus();
            }
          }, false);
        }
      }
    });
  }

  /**
   * init diagram copy button
   */
  initDiagramCopyBtn() {
    const stagingDOM = this.util.getStagingDOM()
    this.util.forEach(document.querySelectorAll('.diagram-copy-btn'), ($btn) => {
      $btn.addEventListener('click', () => {
        stagingDOM.stage($btn.parentElement.querySelector('template').content.cloneNode(true))
        let code = stagingDOM.contentAsText();
        try {
          code = JSON.stringify(JSON.parse(code), null, 2);
        } catch { }
        this.util.copyText(code).then(() => {
          $btn.toggleAttribute('data-copied', true);
          setTimeout(() => {
            $btn.toggleAttribute('data-copied', false);
          }, 2000);
        }, () => {
          console.error('Clipboard write failed!', 'Your browser does not support clipboard API!');
        });
      }, false);
    });
    stagingDOM.destroy();
  }

  /**
   * Helper method to update TOC active state based on scroll position
   * @param {HTMLElement} $tocContainer - TOC container element for parent traversal
   * @param {HTMLCollection} $headingElements - Heading elements to track
   * @param {number} indexOffset - Offset for active state calculation
   */
  _updateTocActiveState($tocContainer, $headingElements, indexOffset) {
    const $tocLinkElements = $tocContainer.querySelectorAll('a:first-child');
    const $tocLiElements = $tocContainer.getElementsByTagName('li');

    // Remove all active classes
    this.util.forEach($tocLinkElements, ($tocLink) => {
      $tocLink.classList.remove('active');
    });
    this.util.forEach($tocLiElements, ($tocLi) => {
      $tocLi.classList.remove('has-active');
    });

    // Calculate active TOC index
    let activeTocIndex = $headingElements.length - 1;
    for (let i = 0; i < $headingElements.length - 1; i++) {
      const thisTop = $headingElements[i].getBoundingClientRect().top;
      const nextTop = $headingElements[i + 1].getBoundingClientRect().top;
      if ((i == 0 && thisTop > indexOffset) || (thisTop <= indexOffset && nextTop > indexOffset)) {
        activeTocIndex = i;
        break;
      }
    }

    // Add active classes
    if (activeTocIndex !== -1 && $tocLinkElements[activeTocIndex]) {
      $tocLinkElements[activeTocIndex].classList.add('active');
      let $parent = $tocLinkElements[activeTocIndex].parentElement;
      while ($parent !== $tocContainer) {
        $parent.classList.add('has-active');
        $parent = $parent.parentElement.parentElement;
      }
    }
  }

  /**
   * init table of contents
   */
  initToc() {
    const $tocCore = document.getElementById('TableOfContents');
    if ($tocCore === null) return;
    const $headingElements = document.getElementsByClassName('heading-element');
    const INDEX_OFFSET = 20 + this.breadcrumbHeight + (
      document.body.dataset.headerDesktop !== 'normal' ? document.getElementById('header-desktop').offsetHeight : 0
    );
    // TOC Drawer Button Visibility
    const openButton = document.querySelector("#toc-drawer-button");
    if (openButton) {
      openButton.classList.toggle('d-none', !this.util.isTocStatic());
    }
    // TOC Static and TOC Dialog
    if (this.util.isTocStatic()) {
      const $tocContentStatic = document.getElementById('toc-content-static');
      if ($tocCore.parentElement !== $tocContentStatic) {
        $tocCore.parentElement.removeChild($tocCore);
        $tocContentStatic.appendChild($tocCore);
      }
      this._tocDialogOnScroll = this._tocDialogOnScroll || (() => {
        this._updateTocActiveState(
          document.querySelector('#toc-content-drawer>nav'),
          $headingElements,
          INDEX_OFFSET
        );
      });
      this._tocDialogOnScroll();
      this.scrollEventSet.add(this._tocDialogOnScroll);
      this._tocOnScroll && this.scrollEventSet.delete(this._tocOnScroll);
      return;
    }

    // TOC Auto
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

    document.querySelector('.fi-container').addEventListener('resize', () => {
      $toc.style.marginBottom = `${document.querySelector('.fi-container').clientHeight - document.querySelector('.post-footer').offsetTop}px`;
    });
    this._tocOnScroll = this._tocOnScroll || (() => {
      $toc.style.marginBottom = `${document.querySelector('.fi-container').clientHeight - document.querySelector('.post-footer').offsetTop}px`;
      this._updateTocActiveState($tocCore, $headingElements, INDEX_OFFSET);
    });
    this._tocOnScroll();
    this.scrollEventSet.add(this._tocOnScroll);
    this._tocDialogOnScroll && this.scrollEventSet.delete(this._tocDialogOnScroll);
  }

  // TODO refactor use allow-discrete display property
  initTocListener() {
    const $toc = document.getElementById('toc-auto');
    const $tocContentAuto = document.getElementById('toc-content-auto');
    document.querySelector('#toc-auto>.toc-title')?.addEventListener('click', () => {
      const animation = ['animate__faster'];
      const tocHidden = $toc.classList.contains('toc-hidden');
      animation.push(tocHidden ? 'animate__fadeIn' : 'animate__fadeOut');
      if (tocHidden) {
        $tocContentAuto.classList.remove('d-none', 'animate__fadeOut');
      } else {
        $tocContentAuto.classList.remove('animate__fadeIn');
      }
      this.util.animateCSS($tocContentAuto, animation, true, () => {
        $tocContentAuto.classList.contains('animate__fadeOut') && $tocContentAuto.classList.add('d-none');
      });
      $toc.classList.toggle('toc-hidden');
    }, false);
  }

  initTocDialog() {
    // HTMLDialogElement
    const dialog = document.querySelector("#toc-dialog");
    const openButton = document.querySelector("#toc-drawer-button");
    if (!dialog || !openButton) return;
    openButton.addEventListener("click", () => {
      dialog.showModal();
      document.activeElement?.blur();
    });
    dialog.addEventListener("click", (e) => {
      dialog.close();
    });
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

  initEcharts() {
    if (!this.config.echarts) return;
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
        const $dataEl = $echarts.nextElementSibling;
        if ($dataEl.tagName !== 'TEMPLATE') return;
        const chart = echarts.init($echarts, this.isDark ? 'dark' : 'light', { renderer: 'svg' });
        chart.showLoading();
        stagingDOM.stage($dataEl.content.cloneNode(true));
        const _setOption = (option) => {
          if (!option) {
            chart.hideLoading();
            console.warn('ECharts option is missing or invalid. Chart disposed.', {
              element: $echarts,
              option: $dataEl,
            });
            chart.dispose();
            $echarts.removeAttribute('style');
            return;
          }
          chart.hideLoading();
          chart.setOption(option);
          this._echartsArr.push(chart);
        };
        // support JS object literal or JS code
        if ($dataEl.dataset.fmt === 'js') {
          try {
            const jsCodes = stagingDOM.contentAsText();
            /**
             * Get ECharts option
             * @param {Object} fixit FixIt instance
             * @param {Object} chart ECharts instance
             * @returns {Object|Promise} ECharts option or Promise
             */
            const _getOption = new Function('fixit', 'chart',
              this.util.isObjectLiteral(jsCodes) ? `return ${jsCodes}` : jsCodes
            );
            if ($dataEl.dataset.async === 'true') {
              return Promise.resolve(_getOption(this, chart)).then(option => {
                _setOption(option);
              });
            }
            return _setOption(_getOption(this, chart));
          } catch (err) {
            return console.error(err);
          }
        }
        // support JSON
        _setOption(stagingDOM.contentAsJson());
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
        const { lng, lat, zoom, lightStyle, darkStyle, marked, markers, navigation, geolocate, scale, fullscreen } = JSON.parse($mapbox.dataset.options);
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
        const markerArray = typeof markers === 'string' ? JSON.parse(markers) : markers;
        if (Array.isArray(markerArray) && markerArray.length > 0) {
          markerArray.forEach(marker => {
            const { lng: markerLng, lat: markerLat, description } = marker;
            const popup = new mapboxgl.Popup({ offset: 25 }).setText(description);
            new mapboxgl.Marker()
              .setLngLat([markerLng, markerLat])
              .setPopup(popup)
              .addTo(mapbox);
          });
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
          const singleData = typeitElement.dataset;
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
            speed: Number(singleData.speed) >= 0 ? Number(singleData.speed) : speed,
            lifeLike: true,
            cursorSpeed: Number(singleData.cursorSpeed) >= 0 ? Number(singleData.cursorSpeed) : cursorSpeed,
            cursorChar: singleData.cursorChar || cursorChar,
            waitUntilVisible: true,
            loop: singleData.loop ? singleData.loop === 'true' : loop,
            afterComplete: () => {
              const duration = Number(singleData.duration ?? typeitConfig.duration);
              if (i === group.length - 1) {
                if (duration >= 0) {
                  window.setTimeout(() => {
                    instance.destroy();
                  }, duration);
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
    if (!this.config.comment?.enable) return;
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
        const message = { setConfig: { theme: this.isDark ? giscusConfig.darkTheme : giscusConfig.lightTheme } };
        document.querySelector('.giscus-frame')?.contentWindow.postMessage({ giscus: message }, giscusConfig.origin);
      });
      this.switchThemeEventSet.add(this._giscusOnSwitchTheme);
      // gicuss to parent message
      this._messageListener = (event) => {
        if (event.origin !== giscusConfig.origin) return;
        const $script = document.querySelector('#giscus>script');
        if ($script) {
          $script.parentElement.removeChild($script);
        }
        this._giscusOnSwitchTheme()
        window.removeEventListener('message', this._messageListener, false);
      };
      window.addEventListener('message', this._messageListener, false);
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
    if (!this.config.watermark?.enable) return;
    new Watermark(this.config.watermark);
  }

  initPangu() {
    if (!this.config.pangu?.enable) return;
    const selector = this.config.pangu.selector;
    if (selector) {
      // to avoid extra spaces for extended Markdown syntax fraction in Chinese
      pangu.ignoredTags = /^(script|code|pre|textarea|sup|sub)$/i;
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

  initMathJax() {
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise().then(() => {
        // Do something else after typesetting is complete
      }).catch((err) => console.log(err.message));
    }
  }

  initJsonViewer() {
    if (!window.JsonViewerElement) return;
    this._jsonViewerOnSwitchTheme = this._jsonViewerOnSwitchTheme || (() => {
      this.util.forEach(document.getElementsByTagName('json-viewer'), ($el) => {
        $el.setAttribute('theme', this.isDark ? 'dark' : 'light');
      });
    });
    this.switchThemeEventSet.add(this._jsonViewerOnSwitchTheme);
    this._jsonViewerOnSwitchTheme();
  }

  initTabEvents(target = document) {
    target.addEventListener('tab-container-changed', () => {
      window.FixItMermaid?.init?.();
    }, false);
  }

  /**
   * Helper method to initialize content components
   * @param {Element} target - The target element (optional, defaults to document)
   * @param {Boolean} includeToc - Whether to initialize TOC-related components
   */
  _initContentComponents(target = document, includeToc = false) {
    this.initTwemoji(target);
    this.initDetails(target);
    this.initLightGallery();
    this.initCodeWrapper();
    this.initDiagramCopyBtn();
    this.initEcharts();
    this.initTypeit(target);
    this.initMapbox();
    if (includeToc) {
      this.fixTocScroll();
      this.initToc();
      this.initTocListener();
      this.initTocDialog();
    }
    this.initPangu();
    this.initMathJax();
    this.initJsonViewer();
    this.initTabEvents(target);
    window.FixItMermaid?.init?.();
    window.FixItAPlayer?.init?.();
  }

  /**
   * Helper method to toggle encrypted content visibility
   * @param {Element} container - The container element
   * @param {Boolean} show - true to show decrypted content, false to hide
   */
  _toggleEncryptedClass(container, show) {
    const fromClass = show ? 'encrypted-hidden' : 'decrypted-shown';
    const toClass = show ? 'decrypted-shown' : 'encrypted-hidden';
    this.util.forEach(container.querySelectorAll(`.${fromClass}`), ($element) => {
      $element.classList.replace(fromClass, toClass);
    });
  }

  initFixItDecryptor() {
    this.decryptor = new FixItDecryptor({
      decrypted: () => {
        this._initContentComponents(document, true);
        this._toggleEncryptedClass(document, true);
      },
      partialDecrypted: ($content) => {
        this._initContentComponents($content, false);
        this._toggleEncryptedClass($content, true);
      },
      reset: () => {
        this._toggleEncryptedClass(document, false);
      }
    });
    this.decryptor.init(this.config.encryption);
  }

  initAutoMark() {
    if (!this.config.autoBookmark) return;
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
    if (!$rewards.length) return;
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

  initPostChatUser() {
    if (!window.postChatUser || !postChatConfig || postChatConfig.userMode === 'magic') return;
    postChat_theme = this.isDark ? 'dark' : 'light';
    this.switchThemeEventSet.add((isDark) => {
      const targetFrame = document.getElementById("postChat_iframeContainer")
      if (targetFrame) {
        window.postChatUser.setPostChatTheme(isDark ? 'dark' : 'light');
      } else {
        postChat_theme = isDark ? 'dark' : 'light';
      }
    });
  }

  onScroll() {
    const $headers = [];
    const ACCURACY = 20;
    const $backToTop = document.querySelector('.back-to-top');
    const $readingProgressBar = document.querySelector('.reading-progress-bar');
    if (document.body.dataset.headerDesktop === 'auto') {
      $headers.push(document.getElementById('header-desktop'));
    }
    if (document.body.dataset.headerMobile === 'auto') {
      $headers.push(document.getElementById('header-mobile'));
    }
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
      // whether to show back to top button
      if ($backToTop) {
        if (scrollPercent > 1) {
          $backToTop.classList.remove('d-none', 'animate__fadeOut');
          this.util.animateCSS($backToTop, ['animate__fadeIn'], true);
        } else {
          $backToTop.classList.remove('animate__fadeIn');
          this.util.animateCSS($backToTop, ['animate__fadeOut'], true, () => {
            $backToTop.classList.contains('animate__fadeOut') && $backToTop.classList.add('d-none');
          });
        }
        // Set progress as 0-100 value for CSS calculation
        $backToTop.style.setProperty('--fi-b2t-progress', scrollPercent.toFixed(2));
        // Calculate stroke-dashoffset for Firefox compatibility
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
          const dashoffset = 2 * Math.PI * 50 * (1 - scrollPercent / 100);
          $backToTop.querySelector('circle.progress').style.strokeDashoffset = dashoffset.toFixed(2);
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
      if (!document.body.classList.contains('blur')) return;
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
        this._initContentComponents(document, false);
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
      this.initAutoMark();
      this.initReward();
      this.initPostChatUser();

      // [todo] refactor async init toc
      window.setTimeout(() => {
        this.initComment();
        if (!this.config.encryption?.all) {
          this.fixTocScroll();
          this.initToc();
          this.initTocListener();
          this.initTocDialog();
        }
        this.onScroll();
        this.onResize();
        this.onClickMask();
        this.beforeprint();
      }, 100);
    } catch (err) {
      console.error(err);
    }
    console.log(
      `%c FixIt ${this.config.version} %c https://github.com/hugo-fixit %c`,
      `background: #FF735A;border:1px solid #FF735A; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
      `border:1px solid #FF735A; padding: 1px; border-radius: 0 2px 2px 0; color: #FF735A;`,
      'background:transparent;'
    );
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
