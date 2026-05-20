/** APlayer integration — initializes APlayer instances from shortcode markup. */
function initAPlayer() {
  Array.from(document.getElementsByClassName('aplayer-shortcode')).forEach((aplayer) => {
    const el = aplayer as HTMLElement
    if (el.dataset.processed)
      return
    const audio = JSON.parse(el.dataset.audio!)
    const options = JSON.parse(el.dataset.options!)
    options.audio = audio
    options.container = el
    void new window.APlayer!(options)
    el.dataset.processed = 'true'
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initAPlayer()
  document.addEventListener('fixit:decrypted', initAPlayer, false)
  document.addEventListener('fixit:partial-decrypted', initAPlayer, false)
}, false)
