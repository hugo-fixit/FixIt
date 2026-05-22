/** Code module — code block interactions: copy, download, fullscreen, tabs, and line numbers. */
import type { CodeService } from '../core/tokens'
import { animateCSS, createCopyText, downloadAsFile, flashCopiedTooltip, forEach, getStagingDOM } from '../utils'

const CellTooltip = window.CellTooltip
const copyText = createCopyText()

export class CodeModule implements CodeService {
  private readonly CODE_TAB_SYNC_EVENT = 'fixit:code-tab-sync'
  private _codeFullscreenOnEsc: ((event: KeyboardEvent) => void) | undefined

  /**
   * Attach copy-to-clipboard behaviour to a code block.
   * @param codeBlock - The `.code-block` container element.
   * @param codePreEl - The `<pre>` element containing the code text.
   */
  initCopyCode(codeBlock: HTMLElement, codePreEl: HTMLElement) {
    const copyBtn = codeBlock.dataset.mode === 'classic'
      ? codeBlock.querySelector<HTMLElement>('.code-header .copy-btn')
      : codeBlock.querySelector<HTMLElement>('.copy-icon-btn')
    if (codeBlock.dataset.copyable !== 'true' || !copyBtn)
      return
    copyBtn.addEventListener('click', () => {
      const iswWrap = codeBlock.classList.contains('line-wrapping')
      const highlightLines = codeBlock.querySelectorAll('.hl')
      iswWrap && codeBlock.classList.toggle('line-wrapping')
      forEach(highlightLines, ($hl) => {
        $hl.classList.toggle('hl')
      })
      copyText(codePreEl.textContent!.trim()).then(() => {
        animateCSS(codePreEl, 'animate__flash')
        iswWrap && codeBlock.classList.toggle('line-wrapping')
        forEach(highlightLines, ($hl) => {
          $hl.classList.toggle('hl')
        })
        flashCopiedTooltip(copyBtn)
      }, () => {
        console.error('Clipboard write failed!', 'Your browser does not support clipboard API!')
      })
    }, false)
  }

  /**
   * Attach toggle behaviour to the code expand/collapse button.
   * @param codeBlock - The `.code-block` container element.
   */
  initCodeExpandBtn(codeBlock: HTMLElement) {
    codeBlock.querySelector('.code-expand-btn')?.addEventListener('click', () => {
      codeBlock.classList.toggle('is-expanded')
    }, false)
  }

  /**
   * Attach download behaviour to a code block's download button.
   * @param codeBlock - The `.code-block` container element.
   * @param codePreEl - The `<pre>` element containing the code text.
   */
  initDownloadCode(codeBlock: HTMLElement, codePreEl: HTMLElement) {
    const downloadBtn = codeBlock.querySelector<HTMLElement>('.code-header .download-btn')
    if (!downloadBtn)
      return
    downloadBtn.addEventListener('click', () => {
      const $codeHeader = codeBlock.querySelector<HTMLElement>('.code-header')
      const name = codeBlock.dataset.name?.trim()
      const language = Array.from($codeHeader?.classList || []).find(className => className.startsWith('language-'))?.replace('language-', '')
      const ext = language && language !== 'fallback' ? language : 'txt'
      const fallbackName = name
        ? (name.includes('.') ? name : `${name}.${ext}`)
        : `code.${ext}`
      const fileName = codeBlock.getAttribute('filename')?.trim()
      downloadAsFile(codePreEl.textContent!, fileName || fallbackName)
      downloadBtn.toggleAttribute('data-downloaded', true)
      downloadBtn.classList.toggle('fa-spin', true)
      setTimeout(() => {
        downloadBtn.toggleAttribute('data-downloaded', false)
        downloadBtn.classList.toggle('fa-spin', false)
      }, 300)
    }, false)
  }

  /**
   * Get the fullscreen target element (parent `.code-tabs` or the block itself).
   * @param codeBlock - The `.code-block` element.
   * @returns The element to apply fullscreen to.
   */
  _getCodeFullscreenTarget(codeBlock: HTMLElement): HTMLElement {
    return (codeBlock.closest('.code-tabs') as HTMLElement) || codeBlock
  }

  /**
   * Toggle fullscreen state and update button tooltips.
   * @param codeBlock - The `.code-block` element.
   * @param show - `true` to enter fullscreen, `false` to exit.
   */
  _setCodeFullscreenState(codeBlock: HTMLElement, show: boolean) {
    const target = this._getCodeFullscreenTarget(codeBlock)
    const expandBtn = codeBlock.querySelector<HTMLElement>('.code-expand-btn')

    if (show && expandBtn) {
      codeBlock.dataset.fullscreenExpanded = codeBlock.classList.contains('is-expanded') ? 'true' : 'false'
      codeBlock.classList.add('is-expanded')
    }

    if (!show && target.classList.contains('is-fullscreen')) {
      target.classList.add('instant-height')
      window.requestAnimationFrame(() => target.classList.remove('instant-height'))

      if (expandBtn && codeBlock.dataset.fullscreenExpanded === 'false') {
        codeBlock.classList.remove('is-expanded')
      }
      delete codeBlock.dataset.fullscreenExpanded
    }

    // update button tooltip
    target.classList.toggle('is-fullscreen', show)
    const btn = target.querySelector<HTMLElement>('.tabs-actions .fullscreen-btn')
      || codeBlock.querySelector<HTMLElement>('.code-header .fullscreen-btn')
    if (!btn)
      return
    const exitTitle = btn.dataset.exitTitle || btn.getAttribute('data-exit-title') || btn.title
    const originalTitle = btn.dataset.ctOriginalTitle || btn.dataset.ctTitle || btn.title
    btn.dataset.ctOriginalTitle = originalTitle
    btn.dataset.ctTitle = show ? exitTitle : originalTitle
    const instance = CellTooltip.getOrCreateInstance(btn)
    instance.hide()
  }

  /** Exit fullscreen on the currently active code block. */
  closeCodeFullscreen() {
    const $activeTabs = document.querySelector<HTMLElement>('.code-tabs.is-fullscreen')
    if ($activeTabs) {
      const $activeBlock = $activeTabs.querySelector<HTMLElement>('.code-block.active') || $activeTabs.querySelector<HTMLElement>('.code-block')
      if ($activeBlock)
        this._setCodeFullscreenState($activeBlock, false)
      return
    }
    const $activeBlock = document.querySelector<HTMLElement>('.code-block.highlight.is-fullscreen')
    if ($activeBlock)
      this._setCodeFullscreenState($activeBlock, false)
  }

  /**
   * Attach fullscreen toggle and Escape-key handler to a code block.
   * @param codeBlock - The `.code-block` container element.
   */
  initFullscreenCode(codeBlock: HTMLElement) {
    const fullscreenBtn = codeBlock.querySelector<HTMLElement>('.code-header .fullscreen-btn')
    if (!fullscreenBtn)
      return
    fullscreenBtn.addEventListener('click', () => {
      const target = this._getCodeFullscreenTarget(codeBlock)
      const show = !target.classList.contains('is-fullscreen')
      if (show) {
        this.closeCodeFullscreen()
        codeBlock.classList.remove('is-collapsed')
      }
      this._setCodeFullscreenState(codeBlock, show)
    }, false)
    if (!this._codeFullscreenOnEsc) {
      this._codeFullscreenOnEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          this.closeCodeFullscreen()
        }
      }
      document.addEventListener('keydown', this._codeFullscreenOnEsc, false)
    }
  }

  /** Initialize all un-initialized code blocks on the page. */
  initCodeWrapper() {
    const $codeBlocks = document.querySelectorAll<HTMLElement>('.code-block.highlight:not([data-init])')
    forEach($codeBlocks, ($codeBlock) => {
      const $preElements = $codeBlock.querySelectorAll<HTMLPreElement>('pre.chroma')
      if (!$preElements.length)
        return
      const $codePreEl = $preElements[$preElements.length - 1]
      $codeBlock.dataset.init = 'true'

      this.initCopyCode($codeBlock, $codePreEl)
      this.initCodeExpandBtn($codeBlock)

      // classic mode code block interactions
      if ($codeBlock.dataset.mode === 'classic') {
        const $codeHeader = $codeBlock.querySelector<HTMLElement>('.code-header')
        if (!$codeHeader)
          return
        this.initDownloadCode($codeBlock, $codePreEl)
        this.initFullscreenCode($codeBlock)
        // code title
        $codeHeader.querySelector<HTMLElement>('.code-title')!.addEventListener('click', () => {
          if ($codeBlock.classList.contains('is-fullscreen'))
            return
          $codeBlock.classList.toggle('is-collapsed')
        }, false)
        // ellipses icon
        $codeHeader.querySelector<HTMLElement>('.ellipses-btn')!.addEventListener('click', () => {
          $codeBlock.classList.remove('is-collapsed')
        }, false)
        // line numbers toggle button
        $codeHeader.querySelector('.line-nos-btn')?.addEventListener('click', () => {
          $codeBlock.classList.toggle('line-nos-hidden')
        }, false)
        // line wrapping toggle button
        $codeHeader.querySelector('.line-wrap-btn')?.addEventListener('click', () => {
          if ($codeBlock.querySelector('[contenteditable="true"]'))
            return
          $codeBlock.classList.toggle('line-wrapping')
        }, false)
        // edit button toggle button
        if ($codeBlock.dataset.editable === 'true') {
          $codeHeader.querySelector('.edit-btn')?.addEventListener('click', () => {
            const isEditable = $codePreEl.getAttribute('contenteditable') === 'true'
            if (isEditable) {
              $codePreEl.setAttribute('contenteditable', 'false')
              $codePreEl.blur()
            }
            else {
              forEach($codeBlock.querySelectorAll('.hl'), ($hl: Element) => {
                $hl.classList.remove('hl')
              })
              $codeBlock.classList.add('is-expanded')
              $codeBlock.classList.remove('line-wrapping')
              $codePreEl.setAttribute('contenteditable', 'true')
              $codePreEl.focus()
            }
          }, false)
        }
      }
    })
  }

  /** Group consecutive code blocks into tabbed containers with language sync. */
  initCodeTabs() {
    const $codeBlocks = document.querySelectorAll<HTMLElement>('.code-block[group]:not([data-tab-init])')
    const processed = new Set<HTMLElement>()
    const normalizeTabTitle = (title = '') => title.toLowerCase()

    forEach($codeBlocks, ($block) => {
      if (processed.has($block))
        return

      const groupName = $block.getAttribute('group')!
      const $tabs: HTMLElement[] = []
      let $curr: HTMLElement | null = $block

      // collect consecutive blocks with same group
      while ($curr && $curr.classList?.contains('code-block') && $curr.getAttribute('group') === groupName) {
        $tabs.push($curr)
        processed.add($curr)
        $curr = $curr.nextElementSibling as HTMLElement
      }

      if ($tabs.length < 2)
        return

      // create DOM structure
      const $container = document.createElement('div')
      $container.className = 'code-tabs'

      const $header = document.createElement('div')
      $header.className = 'tabs-header'

      const $items = document.createElement('div')
      $items.className = 'tabs-items'

      const $actions = document.createElement('div')
      $actions.className = 'tabs-actions'

      $header.appendChild($items)
      $header.appendChild($actions)

      const $content = document.createElement('div')
      $content.className = 'tabs-content'

      // insert container before the first block
      const $firstBlock = $tabs[0]
      $firstBlock.parentNode!.insertBefore($container, $firstBlock)

      const activeTabIndex = $tabs.findIndex(tab => tab.classList.contains('active'))
      const langPref = window.localStorage.getItem('config_lang_perf')
      const hasCodeToggle = $tabs.some(tab => tab.dataset.codeToggle === 'true')
      const langPrefIndex = (langPref && hasCodeToggle) ? $tabs.findIndex(tab => tab.dataset.tabTitle!.toLowerCase() === langPref) : -1
      const resolvedIndex = langPrefIndex !== -1 ? langPrefIndex : activeTabIndex
      const beforeTabs = $tabs[0]?.getAttribute('before_tabs')
      if (beforeTabs) {
        const $before = document.createElement('span')
        $before.className = 'before-tabs'
        $before.textContent = beforeTabs
        $items.appendChild($before)
      }

      const tabButtons: HTMLElement[] = []
      const toggleLangToIndex = new Map<string, number>()

      const switchToTab = (index: number) => {
        const $nextTab = $tabs[index]
        const $nextBtn = tabButtons[index]
        if (!$nextTab || !$nextBtn)
          return

        // 1. restore buttons to the currently active tab
        const $activeTab = $tabs.find(t => t.classList.contains('active'))
        if ($activeTab) {
          const $activeHeader = $activeTab.querySelector<HTMLElement>('.code-header')
          if ($activeHeader) {
            Array.from($actions.children).forEach(btn => $activeHeader.appendChild(btn))
          }
        }

        // 2. switch active tab UI
        tabButtons.forEach(b => b.classList.remove('active'))
        $nextBtn.classList.add('active')

        // 3. switch content
        $tabs.forEach(b => b.classList.remove('active'))
        $nextTab.classList.add('active')

        // 4. sync shadow mode data attribute
        const shadowMode = $nextTab?.dataset.shadow
        if (shadowMode) {
          $container.dataset.shadow = shadowMode
        }
        else {
          delete $container.dataset.shadow
        }

        // 5. move new buttons to actions
        const $codeHeader = $nextTab.querySelector<HTMLElement>('.code-header')
        if ($codeHeader) {
          $codeHeader.querySelectorAll<HTMLElement>('.action-btn').forEach(btn => $actions.appendChild(btn))
        }
      }

      document.addEventListener(this.CODE_TAB_SYNC_EVENT, (event: Event) => {
        const { detail } = event as CustomEvent<{ lang: string, source: HTMLElement }>
        if (!detail.lang || detail.source === $container)
          return
        const index = toggleLangToIndex.get(detail.lang)
        index !== undefined && switchToTab(index)
      }, false)

      $tabs.forEach(($tab, index) => {
        const title = $tab.dataset.tabTitle || 'Code'
        const defaultActiveTab = resolvedIndex === -1 && index === 0

        // tab button
        const $btn = document.createElement('span')
        $btn.className = 'tab-item'
        if (defaultActiveTab)
          $btn.classList.add('active')
        $btn.textContent = title
        $btn.dataset.index = String(index)
        $btn.title = title
        tabButtons.push($btn)

        const normalizedTitle = normalizeTabTitle(title)
        if (!toggleLangToIndex.has(normalizedTitle)) {
          toggleLangToIndex.set(normalizedTitle, index)
        }

        $btn.addEventListener('click', () => {
          if ($tab.dataset.codeToggle === 'true') {
            window.localStorage.setItem('config_lang_perf', normalizedTitle)
            document.dispatchEvent(new CustomEvent(this.CODE_TAB_SYNC_EVENT, {
              detail: {
                lang: normalizedTitle,
                source: $container,
              },
            }))
          }
          switchToTab(index)
        })
        $items.appendChild($btn)

        // move block to content
        $tab.classList.toggle('active', resolvedIndex === index || defaultActiveTab)
        $tab.classList.remove('is-collapsed')
        $tab.classList.remove('d-none')
        $tab.dataset.tabInit = 'true'
        $content.appendChild($tab)
      })

      $container.appendChild($header)
      $container.appendChild($content)

      // initialize actions for the active tab
      if (resolvedIndex !== -1) {
        switchToTab(resolvedIndex)
      }
      else {
        switchToTab(0)
      }
    })
  }

  /** Attach copy behaviour to diagram container copy buttons. */
  initDiagramCopyBtn() {
    const stagingDOM = getStagingDOM()
    forEach(document.querySelectorAll<HTMLElement>('.diagram-container > .copy-icon-btn'), ($btn) => {
      $btn.addEventListener('click', () => {
        stagingDOM.stage($btn.parentElement!.querySelector('template')!.content.cloneNode(true))
        let code = stagingDOM.contentAsText()
        try {
          code = JSON.stringify(JSON.parse(code), null, 2)
        }
        catch { /* ignore */ }
        copyText(code).then(() => {
          flashCopiedTooltip($btn as HTMLElement)
        }, () => {
          console.error('Clipboard write failed!', 'Your browser does not support clipboard API!')
        })
      }, false)
    })
    stagingDOM.destroy()
  }
}
