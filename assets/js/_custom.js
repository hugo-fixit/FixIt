/**
 * @author @Lruihao https://lruihao.cn
 * @description Custom javascript for the hugo theme FixIt.
 */
const CustomJS = new (function () {
  /**
   * Hello World
   * You can define your own functions below.
   * @returns {CustomJS}
   */
  this.hello = () => {
    console.log('Hello CustomJS!');
    return this;
  }
  /**
   * Initialize.
   * @returns {CustomJS}
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
  CustomJS.init();
  // It will be executed when the DOM tree is built.
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded!')
  });
})();
