import params from '@params';

/**
 * Initialize theme mode before body rendering.
 * Modes: auto | light | dark
 */
(function () {
  const localStorage = window.localStorage;
  const storedMode = localStorage?.getItem('theme-mode');
  const themeMode = storedMode ||
    (params.defaultTheme === 'light' || params.defaultTheme === 'dark'
      ? params.defaultTheme
      : 'auto');

  document.documentElement.dataset.themeMode = themeMode;
})();
