/**
 * Custom javascript for FixIt site.
 * @author @Lruihao https://lruihao.cn
 */
const FixItCustom = new (function () {
  /**
   * Hello World
   * You can define your own functions below.
   * @returns {FixItCustom}
   */
  this.hello = () => {
    console.log('FixItCustom echo: Hello FixIt!');
    return this;
  };
  /**
   * Initialize.
   * @returns {FixItCustom}
   */
  this.init = () => {
    // Custom infos.
    this.hello();
    return this;
  };
})();

/**
 * Immediate.
 */
(() => {
  FixItCustom.init();
  // It will be executed when the DOM tree is built.
  document.addEventListener('DOMContentLoaded', () => {
    // FixItCustom.init();
  });
})();
