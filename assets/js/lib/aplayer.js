const aplayerInstances = []

Array.from(document.getElementsByClassName("aplayer-shortcode")).forEach((aplayer) => {
  const audio = JSON.parse(aplayer.dataset.audio)
  const options = JSON.parse(aplayer.dataset.options)
  options.audio = audio
  options.container = aplayer
  const ap = new APlayer(options)
  aplayerInstances.push(ap)
})
