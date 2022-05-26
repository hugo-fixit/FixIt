/**
 * FixIt decryptor for encrypted pages
 * @param {Object} option
 * @param {Function} option.ondecrypted handler after decrypting
 * @author @Lruihao https://lruihao.cn
 * @since v0.2.15
 */
FixItDecryptor = function (option = {}) {
  var _proto = FixItDecryptor.prototype;
  this.option = option || {};
  this.decryptedEventSet = new Set();

  /**
   * initialize FixIt decryptor
   */
  _proto.init = () => {
    const _decryptor = this;
    this.option.ondecrypted && this.addEventListener('decrypted', this.option.ondecrypted);

    this.validateLocalStorage();

    document.querySelector('#fixit-decryptor')?.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const $content = document.querySelector('#content');
        const password = $content.getAttribute('data-password');
        const input = this.value.trim();
        const saltLen = input.length % 2 ? input.length : input.length + 1;
        const inputMd5 = CryptoJS.MD5(input).toString();
        const inputSha256 = CryptoJS.SHA256(input).toString();
        const base64EncodeContent = $content.getAttribute('data-content').replace(inputSha256.slice(saltLen), '');

        if (inputMd5 !== password) {
          alert(`Password error: ${input} not the correct password!`);
          this.value = '';
          return console.warn(`Password error: ${input} not the correct password!`);
        }

        try {
          document.querySelector('.fixit-decryptor-container').classList.add('d-none');
          $content.insertAdjacentHTML('afterbegin', CryptoJS.enc.Base64.parse(base64EncodeContent).toString(CryptoJS.enc.Utf8));
          // remember stat
          window.localStorage.setItem(
            `fixit-decryptor/#${location.pathname}`,
            JSON.stringify({
              md5: inputMd5,
              sha256: inputSha256.slice(saltLen)
            })
          );
          // decrypted hook
          for (let event of _decryptor.decryptedEventSet) {
            event();
          }
        } catch (err) {
          alert(err);
          return console.error(err);
        }
      }
    });
  };

  /**
   * validate remembered stat in localStorage
   * // TODO 简化代码
   */
  _proto.validateLocalStorage = () => {
    const $content = document.querySelector('#content');
    const password = $content.getAttribute('data-password');
    const rememberStat = JSON.parse(window.localStorage.getItem(`fixit-decryptor/#${location.pathname}`));

    if (rememberStat?.md5 && rememberStat?.sha256) {
      const base64EncodeContent = $content.getAttribute('data-content').replace(rememberStat.sha256, '');
      if (rememberStat.md5 !== password) {
        window.localStorage.removeItem(`fixit-decryptor/#${location.pathname}`);
        return console.warn('The password has expired, please re-enter!');
      }
      try {
        document.querySelector('.fixit-decryptor-container').classList.add('d-none');
        $content.insertAdjacentHTML('afterbegin', CryptoJS.enc.Base64.parse(base64EncodeContent).toString(CryptoJS.enc.Utf8));
        // decrypted hook
        for (let event of this.decryptedEventSet) {
          event();
        }
      } catch (err) {
        alert(err);
        return console.error(err);
      }
    } else {
      document.querySelector('.fixit-decryptor-container').classList.remove('d-none');
    }
  };

  /**
   * add event listener for FixIt Decryptor
   * @param {String} event
   * @param {Function} listener event handler
   */
  _proto.addEventListener = (event, listener) => {
    switch (event) {
      case 'decrypted':
        this.decryptedEventSet.add(listener);
        break;
      default:
        console.warn(`Event ${event} not found in FixIt Decryptor!`);
        break;
    }
  };

  /**
   * remove event listener for FixIt Decryptor
   * @param {String} event
   * @param {Function} listener event handler
   */
  _proto.removeEventListener = (event, listener) => {
    switch (event) {
      case 'decrypted':
        this.decryptedEventSet.delete(listener);
        break;
      default:
        console.warn(`Event ${event} not found in FixIt Decryptor!`);
        break;
    }
  };
};
