window.FixItAPlayer = {
  init: () => {
    Array.from(document.getElementsByClassName("aplayer-shortcode")).forEach((aplayer) => {
      if (aplayer.dataset.processed) return
      const audio = JSON.parse(aplayer.dataset.audio)
      const options = JSON.parse(aplayer.dataset.options)
      options.audio = audio
      options.container = aplayer
      new APlayer(options)
      aplayer.dataset.processed = true
    })
  },
}

if (document.readyState !== 'loading') {
  window.FixItAPlayer.init()
} else {
  document.addEventListener('DOMContentLoaded', window.FixItAPlayer.init, false)
}
