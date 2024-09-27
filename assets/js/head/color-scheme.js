import params from '@params';

/**
 * Check theme isDark before body rendering
 */
(function () {
  const localStorage = window.localStorage;
  if (!localStorage) {
    return;
  }
  let isDark = false;
  const themeUsed = localStorage.getItem('theme');
  if (themeUsed) {
    isDark = themeUsed === 'dark';
  } else {
    isDark = params.defaultTheme === 'auto' ?
      window.matchMedia('(prefers-color-scheme: dark)').matches :
      params.defaultTheme === 'dark';
  }
  isDark && (document.documentElement.dataset.theme = 'dark');
})();
