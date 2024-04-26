/**
 * FixIt decryptor for encrypted pages and fixit-encryptor shortcode
 * @param {Object} options
 * @param {Function} [options.decrypted] [Lifecycle Hooks] handler after decrypting
 * @param {Function} [options.reset] [Lifecycle Hooks] handler after encrypting again
 * @param {Number} [options.duration=86400] number of seconds to cache decryption statistics. unit: s
 * @author @Lruihao https://lruihao.cn
 * @since v0.2.15
 */
FixItDecryptor = function (options = {}) {
  var _proto = FixItDecryptor.prototype;
  this.options = options || {};
  this.options.duration = this.options.duration || 24 * 60 * 60; // default cache one day
  this.decryptedEventSet = new Set();
  this.partialDecryptedEventSet = new Set();
  this.resetEventSet = new Set();
  this.$el = document.querySelector('.fixit-decryptor-container');

  /**
   * decrypt content
   * @param {Element} $content content element
   * @param {String} salt salt string
   * @param {Boolean} [isAll=true] whether to decrypt all content
   */
  var _decryptContent = ($content, salt, isAll=true) => {
    try {
      if (isAll) {
        // decrypt all content
        this.$el.querySelector('.fixit-decryptor-loading').classList.add('d-none');
        this.$el.querySelector('.fixit-decryptor-input').classList.add('d-none');
        this.$el.querySelector('.fixit-decryptor-btn').classList.add('d-none');
        this.$el.querySelector('.fixit-encryptor-btn').classList.remove('d-none');
      } else {
        // decrypt shortcode content
        $content.parentElement.classList.add('decrypted');
      }
      $content.insertAdjacentHTML(
        'afterbegin',
        CryptoJS.enc.Base64
          .parse($content.getAttribute('data-content').replace(salt, ''))
          .toString(CryptoJS.enc.Utf8)
      );
    } catch (err) {
      return console.error(err);
    }
    // decrypted hook
    const eventSet = isAll ? this.decryptedEventSet : this.partialDecryptedEventSet;
    for (const event of eventSet) {
      event($content);
    }
  };

  /**
   * validate password
   * @param {Element} $decryptor decryptor element
   * @param {Element} $content content element
   * @param {Function} callback callback function after password validation
   * @returns 
   */
  var _validatePassword = ($decryptor, $content, callback) => {
    const password = $content.getAttribute('data-password');
    const inputEl = $decryptor.querySelector('.fixit-decryptor-input');
    const input = inputEl.value.trim();
    const inputMd5 = CryptoJS.MD5(input).toString();
    const inputSha256 = CryptoJS.SHA256(input).toString();
    const saltLen = input.length % 2 ? input.length : input.length + 1;

    inputEl.value = '';
    inputEl.blur();
    if (!input) {
      alert('Please enter the correct password!');
      return console.warn('Please enter the correct password!');
    }
    if (inputMd5 !== password) {
      alert(`Password error: ${input} not the correct password!`);
      return console.warn(`Password error: ${input} not the correct password!`);
    }
    callback(inputMd5, inputSha256.slice(saltLen));
  }

  /**
   * initialize FixIt decryptor
   */
  _proto.init = () => {
    this.addEventListener('decrypted', this.options?.decrypted);
    this.addEventListener('partial-decrypted', this.options?.partialDecrypted);
    this.addEventListener('reset', this.options?.reset);
    this.validateCache();

    const decryptorHandler = () => {
      const $content = document.querySelector('#content');
      _validatePassword(this.$el, $content, (passwordMD5, salt) => {
        // cache decryption statistics
        window.localStorage?.setItem(
          `fixit-decryptor/#${location.pathname}`,
          JSON.stringify({
            expiration: Math.ceil(Date.now() / 1000) + this.options.duration,
            password: passwordMD5,
            salt,
          })
        );
        _decryptContent($content, salt);
      });
    };

    // bind decryptor input enter keydown event
    this.$el.querySelector('#fixit-decryptor-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        decryptorHandler();
      }
    });
    
    // bind decryptor button click event
    this.$el.querySelector('.fixit-decryptor-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      decryptorHandler();
    });

    // bind encryptor button click event
    this.$el.querySelector('.fixit-encryptor-btn')?.addEventListener('click',  (e) => {
      e.preventDefault();
      e.target.classList.add('d-none')
      this.$el.querySelector('.fixit-decryptor-input').classList.remove('d-none');
      this.$el.querySelector('.fixit-decryptor-btn').classList.remove('d-none');
      document.querySelector('#content').innerHTML = '';
      document.querySelector('#content').insertAdjacentElement(
        'afterbegin',
        this.$el
      );
      window.localStorage?.removeItem(`fixit-decryptor/#${location.pathname}`);
      // reset hook
      for (const event of this.resetEventSet) {
        event();
      }
    });
  };

  /**
   * initialize fixit-encryptor shortcodes
   */
  _proto.initShortcodes = () => {
    customElements.get('fixit-encryptor') || customElements.define('fixit-encryptor', class extends HTMLElement {});
    const $shortcodes = document.querySelectorAll('fixit-encryptor:not(:has(.decrypted))');

    $shortcodes.forEach($shortcode => {
      const decryptorHandler = () => {
        const $decryptor = $shortcode.querySelector('.fixit-decryptor-container');
        const $content = $shortcode.querySelector('[data-password][data-content]');
        _validatePassword($decryptor, $content, (passwordMD5, salt) => {
          _decryptContent($content, salt, false);
        });
      };

      // bind decryptor input enter keydown event
      $shortcode.querySelector('.fixit-decryptor-input')?.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          decryptorHandler();
        }
      });

      // bind decryptor button click event
      $shortcode.querySelector('.fixit-decryptor-btn')?.addEventListener('click', function (e) {
        e.preventDefault();
        decryptorHandler();
      });
    });
  };

  /**
   * validate the cached decryption statistics in localStorage
   * @returns {FixItDecryptor}
   */
  _proto.validateCache = () => {
    const $content = document.querySelector('#content');
    const password = $content.getAttribute('data-password');
    const cachedStat = JSON.parse(window.localStorage?.getItem(`fixit-decryptor/#${location.pathname}`));

    if (!cachedStat) {
      this.$el.querySelector('.fixit-decryptor-loading').classList.add('d-none');
      this.$el.querySelector('.fixit-decryptor-input').classList.remove('d-none');
      this.$el.querySelector('.fixit-decryptor-btn').classList.remove('d-none');
      return this;
    }
    if (cachedStat?.password !== password || Number(cachedStat?.expiration) < Math.ceil(Date.now() / 1000)) {
      this.$el.querySelector('.fixit-decryptor-loading').classList.add('d-none');
      this.$el.querySelector('.fixit-decryptor-input').classList.remove('d-none');
      window.localStorage?.removeItem(`fixit-decryptor/#${location.pathname}`);
      console.warn('The password has expired, please re-enter!');
      return this;
    }
    _decryptContent($content, cachedStat.salt);
    return this;
  };

  /**
   * add event listener for FixIt Decryptor
   * @param {String} event event name
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
      case 'partial-decrypted':
        this.partialDecryptedEventSet.add(listener);
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
   * @param {String} event event name
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
      case 'partial-decrypted':
        this.partialDecryptedEventSet.delete(listener);
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
