/* TODO migrate to theme.js */

/**
 * Content decryption for the hugo theme FixIt
 * @author @Lruihao https://lruihao.cn
 */
const Decryption = new (function () {
  /**
   * Content decryption event listener
   */
  this.addDecryptEvent = () => {
    document.querySelector('#fixit-decrypt-gate')?.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const $content = document.querySelector('#content');
        const password = $content.getAttribute('data-password');
        const base64EncodeContent = $content.getAttribute('data-content');
        // TODO 密码正则验证，只允许数字和字母 (maybe)
        const input = this.value.trim()
        const saltLen = input.length % 2 ? input.length : input.length + 1;
        const inputMd5 = CryptoJS.MD5(input).toString();
        const inputSha256 = CryptoJS.SHA256(input).toString();
        if (inputMd5 !== password) {
          return console.log('password error: ', input, inputMd5);
        }
        console.log('password passed')
        const base64DecodeContent = atob(base64EncodeContent.replace(inputSha256.slice(saltLen), ''));
        // TODO 记住解密状态
        this.parentNode.classList.add('d-none')
        const $decryptedContent = document.createElement('div');
        $decryptedContent.innerHTML = base64DecodeContent;
        $decryptedContent.className = 'decrypted-ontent';
        $content.insertAdjacentElement('afterbegin', $decryptedContent);
      }
    });
  };
  /**
   * Initialize
   * @returns {Decryption}
   */
  this.init = () => {
    this.addDecryptEvent()
    return this;
  };
})();

(() => {
  document.addEventListener('DOMContentLoaded', () => {
    Decryption.init();
  });
})();
