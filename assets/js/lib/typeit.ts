/**
 * TypeIt integration for FixIt shortcode blocks.
 *
 * Responsibilities:
 * - Initialize TypeIt typewriter instances, grouped and chained by data attributes.
 * - Re-run initialization after decrypted content is revealed.
 */
import { eventBus } from '../core/event-bus'
import { getStagingDOM } from '../utils'

function initTypeit(target: Element | Document = document) {
  const TypeIt = window.TypeIt
  const config = window.config.typeit
  if (!TypeIt || !config)
    return
  const speed = config.speed || 100
  const cursorSpeed = config.cursorSpeed || 1000
  const cursorChar = config.cursorChar || '|'
  const loop = config.loop ?? false
  const typeitElements = target.querySelectorAll<HTMLElement>('.typeit')
  const groupMap = Array.from(typeitElements).reduce<Record<string, HTMLElement[]>>((acc, ele) => {
    const group = ele.dataset.group || ele.id || Math.random().toString(36).substring(2)
    acc[group] = acc[group] || []
    acc[group].push(ele)
    return acc
  }, {})
  const stagingDOM = getStagingDOM()

  Object.values(groupMap).forEach((group) => {
    const typeone = (i: number) => {
      const typeitElement = group[i]
      const singleData = typeitElement.dataset
      stagingDOM.stage((typeitElement.querySelector('template') as HTMLTemplateElement).content.cloneNode(true))
      let targetEle = typeitElement.firstElementChild as HTMLElement
      if (typeitElement.firstElementChild!.tagName === 'TEMPLATE') {
        typeitElement.innerHTML = ''
        targetEle = typeitElement
      }
      const instance = new TypeIt(targetEle, {
        strings: stagingDOM.$el.querySelector('pre')?.innerHTML || stagingDOM.contentAsHtml(),
        speed: Number(singleData.speed) >= 0 ? Number(singleData.speed) : speed,
        lifeLike: true,
        cursorSpeed: Number(singleData.cursorSpeed) >= 0 ? Number(singleData.cursorSpeed) : cursorSpeed,
        cursorChar: singleData.cursorChar || cursorChar,
        waitUntilVisible: true,
        loop: singleData.loop ? singleData.loop === 'true' : loop,
        afterComplete: () => {
          const duration = Number(singleData.duration ?? config.duration)
          if (i === group.length - 1) {
            if (duration >= 0) {
              window.setTimeout(() => {
                instance.destroy()
              }, duration)
            }
            return
          }
          instance.destroy()
          typeone(i + 1)
        },
      }).go()
    }
    typeone(0)
  })
  stagingDOM.destroy()
}

document.addEventListener('DOMContentLoaded', () => {
  initTypeit()
  eventBus.on('fixit:decrypted', () => initTypeit())
  eventBus.on('fixit:partial-decrypted', ({ detail }) => initTypeit(detail.target))
}, false)
