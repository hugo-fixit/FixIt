import { isObjectLiteral, HTMLEscape } from '../utils/common';

function normalizeExternalLinkGuardConfig(rawConfig) {
  const config = isObjectLiteral(rawConfig) ? rawConfig : {};
  const labels = isObjectLiteral(config.labels) ? config.labels : {};
  const scope = (config.scope || 'content').toLowerCase();
  const mode = (config.mode || 'modal').toLowerCase();
  const newTabPolicy = (
    config.newTabPolicy
    ?? config.new_tab_policy
    ?? config.newtabpolicy
    ?? 'follow'
  ).toLowerCase();
  const allowDomainsRaw = config.allowDomains ?? config.allow_domains ?? config.allowdomains;
  const blockSchemesRaw = config.blockSchemes ?? config.block_schemes ?? config.blockschemes;
  const allowDomains = Array.isArray(allowDomainsRaw)
    ? allowDomainsRaw.map((item) => String(item || '').trim().toLowerCase()).filter(Boolean)
    : [];
  const blockSchemes = Array.isArray(blockSchemesRaw)
    ? blockSchemesRaw.map((item) => String(item || '').trim().toLowerCase()).filter(Boolean)
    : ['javascript', 'data', 'file'];
  const showFullURL = config.showFullURL ?? config.showFullUrl ?? config.show_full_url ?? config.showfullurl;
  const redirectURL = config.redirectURL ?? config.redirectUrl ?? config.redirect_url ?? config.redirecturl;
  const labelTitle = labels.title || labels.Title;
  const labelMessage = labels.message || labels.Message;
  const labelTarget = labels.targetLabel || labels.target_label || labels.targetlabel;
  const labelConfirm = labels.confirm || labels.Confirm;
  const labelCancel = labels.cancel || labels.Cancel;
  const labelCopy = labels.copy || labels.copyToClipboard || labels.copytoClipboard;
  const labelCopied = labels.copied || labels.copiedText || labels.copiedtext;
  return {
    enable: config.enable === true,
    scope: scope === 'site' ? 'site' : 'content',
    mode: mode === 'redirect' ? 'redirect' : 'modal',
    allowDomains,
    blockSchemes,
    newTabPolicy: ['newtab', 'self', 'follow'].includes(newTabPolicy) ? newTabPolicy : 'follow',
    showFullURL: showFullURL !== false,
    message: typeof config.message === 'string' ? config.message.trim() : '',
    redirectURL: typeof redirectURL === 'string' ? redirectURL.trim() : '',
    labels: {
      title: labelTitle || 'Leaving this site',
      message: labelMessage || 'You are about to visit an external website. Please confirm whether to continue.',
      targetLabel: labelTarget || 'Target address:',
      confirm: labelConfirm || 'Continue',
      cancel: labelCancel || 'Cancel',
      copy: labelCopy || 'Copy to clipboard',
      copied: labelCopied || 'Copied',
    },
  };
}

function isExternalLinkGuardScopeMatched($anchor, scope) {
  if (scope === 'site') return true;
  return Boolean($anchor.closest('#content, fixit-encryptor, .decryptor-content'));
}

function isExternalLinkGuardAllowedHost(hostname, allowDomains) {
  const host = (hostname || '').toLowerCase();
  if (!host || !allowDomains.length) return false;
  return allowDomains.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

function openExternalLinkTarget(href, $anchor, newTabPolicy, forceNewTab = false) {
  const openInNewTab = forceNewTab
    || newTabPolicy === 'newtab'
    || (newTabPolicy === 'follow' && $anchor?.target === '_blank');
  if (openInNewTab) {
    window.open(href, '_blank', 'noopener,noreferrer');
    return;
  }
  window.location.href = href;
}

function buildExternalLinkRedirectHTML(guard, targetHref) {
  const title = guard.labels.title || 'Leaving this site';
  const message = guard.message || guard.labels.message || 'You are about to visit an external website. Please confirm whether to continue.';
  const targetLabel = guard.labels.targetLabel || 'Target address:';
  const confirmText = guard.labels.confirm || 'Continue';
  const cancelText = guard.labels.cancel || 'Cancel';
  const copyText = guard.labels.copy || 'Copy to clipboard';
  const copiedText = guard.labels.copied || 'Copied';
  const state = JSON.stringify({
    title,
    message,
    targetLabel,
    confirmText,
    cancelText,
    copyText,
    copiedText,
    targetHref,
  });
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${HTMLEscape(title)}</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #f5f7fb;
      --card-bg: #ffffff;
      --text: #1f2937;
      --muted: #4b5563;
      --subtle: #6b7280;
      --border: #e5e7eb;
      --target-bg: #f8fafc;
      --btn-bg: #f8fafc;
      --btn-border: #d1d5db;
      --btn-primary-bg: #dbeafe;
      --btn-primary-border: #93c5fd;
      --btn-primary-text: #1e3a8a;
      --shadow: 0 18px 44px rgba(15, 23, 42, 0.18);
    }
    :root[data-theme='dark'] {
      --bg: #14171f;
      --card-bg: #1d2230;
      --text: #e5e7eb;
      --muted: #9ca3af;
      --subtle: #9ca3af;
      --border: #303644;
      --target-bg: #171b25;
      --btn-bg: #2a313f;
      --btn-border: #3d4557;
      --btn-primary-bg: #1d4ed8;
      --btn-primary-border: #3b82f6;
      --btn-primary-text: #eff6ff;
      --shadow: 0 18px 44px rgba(0, 0, 0, 0.35);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 1rem;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    }
    .card {
      width: min(680px, 100%);
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--card-bg);
      box-shadow: var(--shadow);
      padding: 1.25rem;
    }
    h1 {
      margin: 0 0 .7rem;
      font-size: 1.2rem;
      line-height: 1.35;
    }
    p {
      margin: 0 0 .8rem;
      color: var(--muted);
      line-height: 1.6;
    }
    .target-label {
      margin: 0 0 .3rem;
      font-size: .86rem;
      color: var(--subtle);
    }
    .target-row {
      margin: 0 0 1rem;
      display: flex;
      align-items: center;
      gap: .5rem;
      width: 100%;
    }
    .target {
      margin: 0;
      flex: 1 1 auto;
      min-width: 0;
      padding: .6rem .7rem;
      border-radius: 9px;
      border: 1px solid var(--border);
      background: var(--target-bg);
      word-break: break-all;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: .88rem;
    }
    .copy-btn {
      width: 2.1rem;
      height: 2.1rem;
      flex-shrink: 0;
      border-radius: 8px;
      border: 1px solid var(--btn-border);
      background: var(--btn-bg);
      color: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform .2s ease, color .2s ease, border-color .2s ease;
    }
    .copy-btn:hover { transform: translateY(-1px); }
    .copy-btn[data-copied='true'] {
      color: var(--btn-primary-text);
      border-color: var(--btn-primary-border);
      background: var(--btn-primary-bg);
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: .5rem;
    }
    button {
      height: 2.1rem;
      border-radius: 8px;
      border: 1px solid var(--btn-border);
      background: var(--btn-bg);
      color: inherit;
      padding: 0 .8rem;
      cursor: pointer;
    }
    button.primary {
      border-color: var(--btn-primary-border);
      background: var(--btn-primary-bg);
      color: var(--btn-primary-text);
    }
  </style>
</head>
<body>
  <main class="card">
    <h1 id="title">${HTMLEscape(title)}</h1>
    <p id="message">${HTMLEscape(message)}</p>
    <p class="target-label" id="target-label">${HTMLEscape(targetLabel)}</p>
    <div class="target-row">
      <p class="target" id="target">${HTMLEscape(targetHref)}</p>
      <button type="button" class="copy-btn" id="copy" aria-label="${HTMLEscape(copyText)}" title="${HTMLEscape(copyText)}">⧉</button>
    </div>
    <div class="actions">
      <button type="button" id="cancel">${HTMLEscape(cancelText)}</button>
      <button type="button" class="primary" id="confirm">${HTMLEscape(confirmText)}</button>
    </div>
  </main>
  <script>
    (function () {
      var themeMode = 'auto';
      try {
        themeMode = window.localStorage?.getItem('theme-mode') || 'auto';
      } catch {}
      var isDark = themeMode === 'dark' || (themeMode === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.dataset.theme = isDark ? 'dark' : 'light';

      const state = ${state};
      const $title = document.getElementById('title');
      const $message = document.getElementById('message');
      const $targetLabel = document.getElementById('target-label');
      const $target = document.getElementById('target');
      const $copy = document.getElementById('copy');
      const $confirm = document.getElementById('confirm');
      const $cancel = document.getElementById('cancel');
      if ($title) $title.textContent = state.title;
      if ($message) $message.textContent = state.message;
      if ($targetLabel) $targetLabel.textContent = state.targetLabel;
      if ($target) $target.textContent = state.targetHref;
      if ($copy) {
        $copy.setAttribute('aria-label', state.copyText);
        $copy.title = state.copyText;
        $copy.addEventListener('click', async () => {
          try {
            if (navigator.clipboard?.writeText) {
              await navigator.clipboard.writeText(state.targetHref);
            } else {
              const input = document.createElement('input');
              input.value = state.targetHref;
              document.body.appendChild(input);
              input.select();
              document.execCommand('copy');
              document.body.removeChild(input);
            }
            $copy.dataset.copied = 'true';
            $copy.textContent = '✓';
            $copy.setAttribute('aria-label', state.copiedText);
            $copy.title = state.copiedText;
            window.setTimeout(() => {
              $copy.dataset.copied = 'false';
              $copy.textContent = '⧉';
              $copy.setAttribute('aria-label', state.copyText);
              $copy.title = state.copyText;
            }, 1200);
          } catch {}
        });
      }
      if ($confirm) {
        $confirm.textContent = state.confirmText;
        $confirm.addEventListener('click', () => {
          window.location.href = state.targetHref;
        });
      }
      if ($cancel) {
        $cancel.textContent = state.cancelText;
        $cancel.addEventListener('click', () => {
          if (window.history.length > 1) {
            window.history.back();
            return;
          }
          window.close();
        });
      }
    })();
  </script>
</body>
</html>`;
}

export function bindExternalLinkGuard(instance, copyText) {
  if (instance._externalLinkGuardBound) return;
  const guard = normalizeExternalLinkGuardConfig(instance.config.externalLinkGuard);
  if (!guard.enable) return;

  instance._externalLinkGuardBound = true;
  const $dialog = document.getElementById('external-link-dialog');
  const $title = document.getElementById('external-link-dialog-title');
  const $message = document.getElementById('external-link-dialog-message');
  const $targetLabel = $dialog?.querySelector('.elg-target-label');
  const $target = document.getElementById('external-link-dialog-target');
  const $copy = document.getElementById('external-link-dialog-copy');
  const $confirm = document.getElementById('external-link-dialog-confirm');
  const $cancel = document.getElementById('external-link-dialog-cancel');
  let pendingTarget = null;

  if ($title) $title.textContent = guard.labels.title;
  if ($targetLabel) $targetLabel.textContent = guard.labels.targetLabel;
  if ($confirm) $confirm.textContent = guard.labels.confirm;
  if ($cancel) $cancel.textContent = guard.labels.cancel;

  const closeDialog = () => {
    if ($dialog?.open) $dialog.close();
  };

  const openTarget = () => {
    if (!pendingTarget) return;
    openExternalLinkTarget(
      pendingTarget.href,
      pendingTarget.anchor,
      guard.newTabPolicy,
      pendingTarget.forceNewTab === true,
    );
    pendingTarget = null;
    closeDialog();
  };

  if ($confirm && !$confirm.dataset.bound) {
    $confirm.dataset.bound = 'true';
    $confirm.addEventListener('click', openTarget);
  }

  if ($cancel && !$cancel.dataset.bound) {
    $cancel.dataset.bound = 'true';
    $cancel.addEventListener('click', () => {
      pendingTarget = null;
      closeDialog();
    });
  }

  if ($copy && !$copy.dataset.bound) {
    $copy.dataset.bound = 'true';
    $copy.addEventListener('click', () => {
      const copyLabel = $copy.dataset.copyLabel || 'Copy to clipboard';
      const copiedLabel = $copy.dataset.copiedLabel || copyLabel;
      const $icon = $copy.querySelector('i');
      const textToCopy = pendingTarget?.href || $target?.textContent || '';
      if (!textToCopy) return;
      copyText(textToCopy).then(() => {
        $copy.toggleAttribute('data-copied', true);
        $copy.title = copiedLabel;
        $copy.setAttribute('aria-label', copiedLabel);
        if ($icon) {
          $icon.classList.remove('fa-regular', 'fa-clone');
          $icon.classList.add('fa-solid', 'fa-check');
        }
        window.setTimeout(() => {
          $copy.toggleAttribute('data-copied', false);
          $copy.title = copyLabel;
          $copy.setAttribute('aria-label', copyLabel);
          if ($icon) {
            $icon.classList.remove('fa-solid', 'fa-check');
            $icon.classList.add('fa-regular', 'fa-clone');
          }
        }, 1200);
      }, () => {
        console.error('Clipboard write failed!', 'Your browser does not support clipboard API!');
      });
    });
  }

  if ($dialog && !$dialog.dataset.bound) {
    $dialog.dataset.bound = 'true';
    $dialog.addEventListener('click', (event) => {
      if (event.target === $dialog) {
        pendingTarget = null;
        closeDialog();
      }
    });
  }

  document.addEventListener('click', (event) => {
    const $anchor = event.target.closest('a[href]');
    if (!$anchor) return;
    if (!$anchor.href) return;
    if ($anchor.dataset.externalLinkGuard === 'off') return;
    if (!isExternalLinkGuardScopeMatched($anchor, guard.scope)) return;
    if (event.defaultPrevented || event.button !== 0) return;
    if ($anchor.hasAttribute('download')) return;

    const rawHref = ($anchor.getAttribute('href') || '').trim();
    if (!rawHref || rawHref.startsWith('#')) return;
    const lowerHref = rawHref.toLowerCase();
    if (lowerHref.startsWith('mailto:') || lowerHref.startsWith('tel:')) return;

    let url;
    try {
      url = new URL($anchor.href, window.location.href);
    } catch {
      return;
    }

    const scheme = url.protocol.replace(':', '').toLowerCase();
    if (guard.blockSchemes.includes(scheme)) {
      event.preventDefault();
      return;
    }
    if (!['http', 'https'].includes(scheme)) return;
    if (url.origin === window.location.origin) return;
    if (isExternalLinkGuardAllowedHost(url.hostname, guard.allowDomains)) return;

    event.preventDefault();

    const forceNewTab = event.metaKey || event.ctrlKey || event.shiftKey;

    if (guard.mode === 'redirect' && guard.redirectURL) {
      let redirectTarget;
      try {
        redirectTarget = new URL(guard.redirectURL, window.location.origin);
        redirectTarget.searchParams.set('target', url.href);
      } catch {
        redirectTarget = null;
      }
      if (redirectTarget) {
        openExternalLinkTarget(redirectTarget.toString(), $anchor, guard.newTabPolicy, forceNewTab);
        return;
      }
    }

    if (guard.mode === 'redirect') {
      if (typeof Blob === 'function' && window.URL?.createObjectURL) {
        const html = buildExternalLinkRedirectHTML(guard, url.href);
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const blobURL = window.URL.createObjectURL(blob);
        openExternalLinkTarget(blobURL, $anchor, guard.newTabPolicy, forceNewTab);
        window.setTimeout(() => {
          window.URL.revokeObjectURL(blobURL);
        }, 60000);
        return;
      }
      const fallbackText = guard.message || guard.labels.message;
      if (window.confirm(fallbackText)) {
        openExternalLinkTarget(url.href, $anchor, guard.newTabPolicy, forceNewTab);
      }
      return;
    }

    pendingTarget = { href: url.href, anchor: $anchor, forceNewTab };
    if (!$dialog || guard.mode !== 'modal') {
      const fallbackText = guard.message || guard.labels.message;
      if (window.confirm(fallbackText)) {
        openTarget();
      } else {
        pendingTarget = null;
      }
      return;
    }

    const displayTarget = guard.showFullURL ? url.href : url.host;
    if ($message) {
      $message.textContent = guard.message || guard.labels.message;
    }
    if ($target) {
      $target.textContent = displayTarget;
    }
    if ($copy) {
      const copyLabel = $copy.dataset.copyLabel || 'Copy to clipboard';
      const $icon = $copy.querySelector('i');
      $copy.toggleAttribute('data-copied', false);
      $copy.title = copyLabel;
      $copy.setAttribute('aria-label', copyLabel);
      if ($icon) {
        $icon.classList.remove('fa-solid', 'fa-check');
        $icon.classList.add('fa-regular', 'fa-clone');
      }
    }
    $dialog.showModal();
    document.activeElement?.blur();
  }, true);
}
