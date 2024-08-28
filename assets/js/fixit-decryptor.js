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
  customElements.get('fixit-encryptor') || customElements.define('fixit-encryptor', class extends HTMLElement {});
  customElements.get('cipher-text') || customElements.define('cipher-text', class extends HTMLElement {});

  /**
   * decrypt content
   * @param {Element} $cipherText cipher text element
   * @param {Element} $target target content element
   * @param {String} salt salt string
   */
  var _decryptContent = ($cipherText, $target, salt) => {
    try {
      $target.innerHTML = CryptoJS.enc.Base64
          .parse($cipherText.innerText.replace(salt, ''))
          .toString(CryptoJS.enc.Utf8);
      $cipherText.parentElement.classList.add('decrypted');
    } catch (err) {
      return console.error(err);
    }
    // decrypted hook
    const eventSet = $target.id === 'content' ? this.decryptedEventSet : this.partialDecryptedEventSet;
    for (const event of eventSet) {
      event($target);
    }
  };

  /**
   * validate password
   * @param {Element} $encryptor fixit-encryptor element
   * @param {Function} callback callback function after password validation
   * @returns 
   */
  var _validatePassword = async ($encryptor, callback) => {
    const $cipherText = $encryptor.querySelector('cipher-text');
    const password = $cipherText.dataset.password;
    const inputEl = $encryptor.querySelector('.fixit-decryptor-input');
    const input = inputEl.value.trim();
    const { h64ToString } = await xxhash();
    const inputHash = h64ToString(input);
    const inputSha256 = CryptoJS.SHA256(input).toString();
    const saltLen = input.length % 2 ? input.length : input.length + 1;

    inputEl.value = '';
    inputEl.blur();
    if (!input) {
      alert('Please enter the correct password!');
      return console.warn('Please enter the correct password!');
    }
    if (inputHash !== password) {
      alert(`Password error: ${input} not the correct password!`);
      return console.warn(`Password error: ${input} not the correct password!`);
    }
    callback($cipherText, inputHash, inputSha256.slice(saltLen));
  }

  /**
   * initialize FixIt decryptor
   * @param {Object} options
   * @param {Boolean} options.all whether to decrypt all content
   * @param {String} options.shortcode whether to decrypt fixit-encryptor shortcode
   */
  _proto.init = ({ all, shortcode }) => {
    this.addEventListener('decrypted', this.options?.decrypted);
    this.addEventListener('partial-decrypted', this.options?.partialDecrypted);
    this.addEventListener('reset', this.options?.reset);
    const $content = document.querySelector('#content');
    if (shortcode) {
      this.addEventListener('decrypted', () => {
        this.initShortcodes($content);
      });
      this.addEventListener('partial-decrypted', ($parent) => {
        this.initShortcodes($parent);
      });
    }
    if (all) {
      this.initPage();
    } else if (shortcode) {
      this.initShortcodes($content);
    }
  };

  /**
   * initialize FixIt decryptor for the encrypted pages
   */
  _proto.initPage = () => {
    this.validateCache();
    const $encryptor = document.querySelector('article > fixit-encryptor');
    const $content = document.querySelector('#content');

    const decryptorHandler = () => {
      _validatePassword($encryptor, ($cipherText, passwordHash, salt) => {
        // cache decryption statistics
        window.localStorage?.setItem(
          `fixit-decryptor/#${location.pathname}`,
          JSON.stringify({
            expiration: Math.ceil(Date.now() / 1000) + this.options.duration,
            password: passwordHash,
            salt,
          })
        );
        _decryptContent($cipherText, $content, salt);
      });
    };

    // bind decryptor input enter keydown event
    $encryptor.querySelector('.fixit-decryptor-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        decryptorHandler();
      }
    });
    
    // bind decryptor button click event
    $encryptor.querySelector('.fixit-decryptor-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      decryptorHandler();
    });

    // bind encryptor button click event
    $encryptor.querySelector('.fixit-encryptor-btn')?.addEventListener('click',  (e) => {
      e.preventDefault();
      $encryptor.classList.remove('decrypted');
      $content.innerHTML = '';
      window.localStorage?.removeItem(`fixit-decryptor/#${location.pathname}`);
      // reset hook
      for (const event of this.resetEventSet) {
        event();
      }
    });

    $encryptor.classList.add('initialized');
  };

  /**
   * initialize FixIt decryptor for fixit-encryptor shortcodes
   * @param {Element} $parent parent element
   */
  _proto.initShortcodes = ($parent) => {
    const $shortcodes = $parent.querySelectorAll('fixit-encryptor:not(.initialized)');

    $shortcodes.forEach($shortcode => {
      const decryptorHandler = () => {
        const $content = $shortcode.querySelector('.decryptor-content');
        _validatePassword($shortcode, ($cipherText, passwordHash, salt) => {
          _decryptContent($cipherText, $content, salt);
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

      $shortcode.classList.add('initialized');
    });
  };

  /**
   * validate the cached decryption statistics in localStorage
   * @returns {FixItDecryptor}
   */
  _proto.validateCache = () => {
    const $content = document.querySelector('#content');
    const $encryptor = document.querySelector('article > fixit-encryptor');
    const $cipherText = $encryptor.querySelector('cipher-text');
    const password = $cipherText.dataset.password;
    const cachedStat = JSON.parse(window.localStorage?.getItem(`fixit-decryptor/#${location.pathname}`));

    if (!cachedStat || cachedStat?.password !== password || Number(cachedStat?.expiration) < Math.ceil(Date.now() / 1000)) {
      if (cachedStat) {
        window.localStorage?.removeItem(`fixit-decryptor/#${location.pathname}`);
        console.warn('The password has expired, please re-enter!');
      }
      return this;
    }
    _decryptContent($cipherText, $content, cachedStat.salt);
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
