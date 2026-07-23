import type { CoreService, PWAService } from '../core/tokens'
import { eventBus } from '../core/event-bus'

/**
 * PWA module — service worker registration and update notification.
 *
 * Responsibilities:
 * - Register service worker with update detection.
 * - Periodically check for service worker updates.
 * - Show update notification toast and handle refresh.
 */
export class PWAModule implements PWAService {
  #core: CoreService

  constructor(core: CoreService) {
    this.#core = core
  }

  /** Register the service worker with update detection and notification binding. */
  async setup() {
    const pwa = this.#core.config.PWA
    if (!pwa?.enable || !('serviceWorker' in navigator))
      return

    const registration = await navigator.serviceWorker
      .register(pwa.serviceWorkerURL)
      .catch((error: unknown) => {
        console.error('Service Worker registration failed:', error)
        return null
      })

    if (!registration)
      return

    // Check for updates periodically (every hour)
    setInterval(() => registration.update(), 3600000)

    // Listen for new service worker installing
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (!newWorker)
        return

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          eventBus.emit('fixit:sw-update')
        }
      })
    })

    // Reload when a new service worker takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload()
    })

    this.#bindUpdateNotification(registration)
  }

  /**
   * Bind the template-rendered update notification toast.
   * Shows the toast on `fixit:sw-update` and wires the refresh button to skip waiting.
   */
  #bindUpdateNotification(registration: ServiceWorkerRegistration) {
    const toast = document.querySelector<HTMLElement>('.sw-update-notification')
    if (!toast)
      return

    eventBus.on('fixit:sw-update', () => {
      toast.querySelector('.sw-update-btn')!.addEventListener('click', () => {
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' })
        toast.classList.remove('visible')
      }, { once: true })
      requestAnimationFrame(() => toast.classList.add('visible'))
    })
  }
}
