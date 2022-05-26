/**
 * FixIt decryptor for encrypted pages
 * @param {Object} options
 * @param {Function} [options.decrypted] handler after decrypting
 * @param {Number} [options.duration] number of seconds to cache decryption statistics. unit: s
 * @author @Lruihao https://lruihao.cn
 * @since v0.2.15
 */
FixItDecryptor = function (options = {}) {
  var _proto = FixItDecryptor.prototype;
  this.options = options || {};
  this.options.duration = this.options.duration || 7 * 24 * 60 * 60; // Default cache 7 days
  this.decryptedEventSet = new Set();

  /**
   * initialize FixIt decryptor
   */
  _proto.init = () => {
    const _decryptor = this;
    this.options.decrypted && this.addEventListener('decrypted', this.options.decrypted);

    this.validateCache();

    document.querySelector('#fixit-decryptor')?.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const $content = document.querySelector('#content');
        const password = $content.getAttribute('data-password');
        const input = this.value.trim();
        const saltLen = input.length % 2 ? input.length : input.length + 1;
        const inputMd5 = CryptoJS.MD5(input).toString();
        const inputSha256 = CryptoJS.SHA256(input).toString();

        if (inputMd5 !== password) {
          alert(`Password error: ${input} not the correct password!`);
          this.value = '';
          return console.warn(`Password error: ${input} not the correct password!`);
        }

        try {
          document.querySelector('.fixit-decryptor-container').classList.add('d-none');
          $content.insertAdjacentHTML(
            'afterbegin',
            CryptoJS.enc.Base64.parse($content.getAttribute('data-content').replace(inputSha256.slice(saltLen), '')).toString(CryptoJS.enc.Utf8)
          );
          // cache decryption statistics
          window.localStorage.setItem(
            `fixit-decryptor/#${location.pathname}`,
            JSON.stringify({
              expiration: Math.ceil(Date.now() / 1000) + _decryptor.options.duration,
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
   * validate the cached decryption statistics in localStorage
   * // TODO 简化代码
   */
  _proto.validateCache = () => {
    const $content = document.querySelector('#content');
    const password = $content.getAttribute('data-password');
    const cachedStat = JSON.parse(window.localStorage.getItem(`fixit-decryptor/#${location.pathname}`));

    if (cachedStat?.md5 && cachedStat?.sha256 && cachedStat?.expiration) {
      if (cachedStat.md5 !== password || cachedStat.expiration < Math.ceil(Date.now() / 1000)) {
        document.querySelector('.fixit-decryptor-container').classList.remove('d-none');
        window.localStorage.removeItem(`fixit-decryptor/#${location.pathname}`);
        return console.warn('The password has expired, please re-enter!');
      }

      try {
        document.querySelector('.fixit-decryptor-container').classList.add('d-none');
        $content.insertAdjacentHTML(
          'afterbegin',
          CryptoJS.enc.Base64.parse($content.getAttribute('data-content').replace(cachedStat.sha256, '')).toString(CryptoJS.enc.Utf8)
        );
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
