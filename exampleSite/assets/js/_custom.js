/**
 * @author @Lruihao https://lruihao.cn
 * @description Custom javascript for the hugo theme FixIt.
 */
const CustomJS = new (function () {
  /**
   * Rest in Peace. R.I.P 🕯️
   * @2022-3-28 [3.21-mu5735] 沉痛哀悼 132 名遇难同胞：东航航班失事，遇难者含旅客 123 人，机组 9 人
   * @returns {CustomJS}
   */
  this.RIP = () => {
    if (new Date() < new Date('2022-03-31')) {
      document.querySelector('html').style.filter = 'grayscale(100%)';
    }
    return this;
  };
  /**
   * Initialize.
   * @returns {CustomJS}
   */
  this.init = () => {
    this.RIP();
    return this;
  };
})();

/**
 * Immediate.
 */
(() => {
  // CustomJS.init();
  // It will be executed when the DOM tree is built.
  document.addEventListener('DOMContentLoaded', () => {
    // console.log('DOM content loaded!')
  });
})();
