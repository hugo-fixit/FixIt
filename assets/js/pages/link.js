/**
 * for link redirection page
 */

import { createCopyText } from '../utils/common';

const copyText = createCopyText();

function initLinkGuard() {
  const params = new URLSearchParams(window.location.search);
  const target = params.get('target');
  const targetElement = document.querySelector('.target');
  const copyBtn = document.querySelector('.copy-btn');
  const confirmBtn = document.querySelector('.confirm-btn');

  if (target) {
    targetElement.textContent = target;
    copyBtn.disabled = false;
    confirmBtn.disabled = false;

    copyBtn.addEventListener('click', () =>{
      copyText(target).then(() => {
        copyBtn.toggleAttribute('data-copied', true);
        setTimeout(() => {
          copyBtn.toggleAttribute('data-copied', false);
        }, 2000);
      }, () => {
        console.error('Clipboard write failed!', 'Your browser does not support clipboard API!');
      });
    });

    confirmBtn.addEventListener('click', () => {
      window.location.href = target;
    });
  } else {
    targetElement.textContent = 'Invalid target URL';
  }
}

if (document.readyState !== 'loading') {
  initLinkGuard();
} else {
  document.addEventListener('DOMContentLoaded', initLinkGuard, false);
}
