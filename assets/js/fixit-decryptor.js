/**
 * FixIt decryptor for encrypted pages
 * @param {Object} options
 * @param {Function} [options.decrypted] handler after decrypting
 * @param {Function} [options.reset] handler after encrypting again
 * @param {Number} [options.duration=86400] number of seconds to cache decryption statistics. unit: s
 * @author @Lruihao https://lruihao.cn
 * @since v0.2.15
 */
FixItDecryptor = function (options = {}) {
  var _proto = FixItDecryptor.prototype;
  this.options = options || {};
  this.options.duration = this.options.duration || 24 * 60 * 60; // default cache one day
  this.decryptedEventSet = new Set();
  this.resetEventSet = new Set();
  this.$el = document.querySelector('.fixit-decryptor-container');

  /**
   * decrypt content
   * @param {String} base64EncodeContent encrypted content
   */
  var _decryptContent = (base64EncodeContent) => {
    try {
      this.$el.querySelector('#fixit-decryptor-input').classList.add('d-none');
      this.$el.querySelector('.fixit-encryptor-btn').classList.remove('d-none');
      document.querySelector('#content').insertAdjacentHTML(
        'afterbegin',
        CryptoJS.enc.Base64.parse(base64EncodeContent).toString(CryptoJS.enc.Utf8)
      );
    } catch (err) {
      return console.error(err);
    }
    // decrypted hook
    for (const event of this.decryptedEventSet) {
      event();
    }
  };

  /**
   * initialize FixIt decryptor
   */
  _proto.init = () => {
    this.addEventListener('decrypted', this.options?.decrypted);
    this.addEventListener('reset', this.options?.reset);
    this.validateCache();
    
    const _decryptor = this;
    this.$el.querySelector('#fixit-decryptor-input')?.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const $content = document.querySelector('#content');
        const password = $content.getAttribute('data-password');
        const input = this.value.trim();
        const saltLen = input.length % 2 ? input.length : input.length + 1;
        const inputMd5 = CryptoJS.MD5(input).toString();
        const inputSha256 = CryptoJS.SHA256(input).toString();

        this.value = '';
        if (!input) {
          alert('Please enter the correct password!');
          return console.warn('Please enter the correct password!');
        }
        if (inputMd5 !== password) {
          alert(`Password error: ${input} not the correct password!`);
          return console.warn(`Password error: ${input} not the correct password!`);
        }
        // cache decryption statistics
        window.localStorage.setItem(
          `fixit-decryptor/#${location.pathname}`,
          JSON.stringify({
            expiration: Math.ceil(Date.now() / 1000) + _decryptor.options.duration,
            md5: inputMd5,
            sha256: inputSha256.slice(saltLen)
          })
        );
        _decryptContent($content.getAttribute('data-content').replace(inputSha256.slice(saltLen), ''));
      }
    });

    this.$el.querySelector('.fixit-encryptor-btn')?.addEventListener('click', function (e) {
      e.preventDefault();
      this.classList.add('d-none')
      _decryptor.$el.querySelector('#fixit-decryptor-input').classList.remove('d-none');
      document.querySelector('#content').innerHTML = '';
      document.querySelector('#content').insertAdjacentElement(
        'afterbegin',
        _decryptor.$el
      );
      window.localStorage.removeItem(`fixit-decryptor/#${location.pathname}`);
      // reset hook
      for (const event of _decryptor.resetEventSet) {
        event();
      }
    });
  };

  /**
   * validate the cached decryption statistics in localStorage
   */
  _proto.validateCache = () => {
    const $content = document.querySelector('#content');
    const password = $content.getAttribute('data-password');
    const cachedStat = JSON.parse(window.localStorage.getItem(`fixit-decryptor/#${location.pathname}`));

    if (!cachedStat) {
      return this.$el.querySelector('#fixit-decryptor-input').classList.remove('d-none');
    }
    if (cachedStat?.md5 !== password || Number(cachedStat?.expiration) < Math.ceil(Date.now() / 1000)) {
      this.$el.querySelector('#fixit-decryptor-input').classList.remove('d-none');
      window.localStorage.removeItem(`fixit-decryptor/#${location.pathname}`);
      return console.warn('The password has expired, please re-enter!');
    }
    _decryptContent($content.getAttribute('data-content').replace(cachedStat.sha256, ''));
  };

  /**
   * add event listener for FixIt Decryptor
   * @param {String} event
   * @param {Function} listener event handler
   * @returns {FixItDecryptor}
   */
  _proto.addEventListener = (event, listener) => {
    if (typeof listener !== 'function') {
      return this;
    }
    switch (event) {
      case 'decrypted':
        this.decryptedEventSet.add(listener);
        break;
      case 'reset':
        this.resetEventSet.add(listener);
        break;
      default:
        console.warn(`Event ${event} not found in FixIt Decryptor!`);
        break;
    }
    return this;
  };

  /**
   * remove event listener for FixIt Decryptor
   * @param {String} event
   * @param {Function} listener event handler
   * @returns {FixItDecryptor}
   */
  _proto.removeEventListener = (event, listener) => {
    if (typeof listener !== 'function') {
      return this;
    }
    switch (event) {
      case 'decrypted':
        this.decryptedEventSet.delete(listener);
        break;
      case 'reset':
        this.resetEventSet.delete(listener);
        break;
      default:
        console.warn(`Event ${event} not found in FixIt Decryptor!`);
        break;
    }
    return this;
  };
};
