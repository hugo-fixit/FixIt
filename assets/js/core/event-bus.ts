/** Event map: every FixIt event and its payload shape. */
export interface FixItEventMap {
  'fixit:switch-theme': { isDark: boolean, mode: string, isChanged: boolean }
  'fixit:scroll': void
  'fixit:resize': void
  'fixit:content-decrypted': { target: HTMLElement, isPage: boolean }
  'fixit:toc-decrypted': { html: string }
  'fixit:re-encrypt': void
  'fixit:code-tab-sync': { lang: string, source: HTMLElement }
  'fixit:sw-update': void
}

/** Document event map augmented with FixIt custom events. */
export type FixItDocumentEventMap = {
  [K in keyof FixItEventMap]: CustomEvent<FixItEventMap[K]>
}

/** Event handler type — infers the correct signature from the event payload. */
export type Handler<T> = T extends void
  ? (() => void) | ((event: CustomEvent<void>) => void)
  : (event: CustomEvent<T>) => void

/** Typed event bus — wraps DOM CustomEvents with type-safe emit/on/off. */
export class TypedEventBus {
  #target = document

  on<K extends keyof FixItEventMap>(event: K, handler: Handler<FixItEventMap[K]>): void {
    this.#target.addEventListener(event as string, handler as EventListener)
  }

  off<K extends keyof FixItEventMap>(event: K, handler: Handler<FixItEventMap[K]>): void {
    this.#target.removeEventListener(event as string, handler as EventListener)
  }

  emit<K extends keyof FixItEventMap>(
    event: K,
    ...args: FixItEventMap[K] extends void ? [] : [FixItEventMap[K]]
  ): void {
    const detail = args[0]
    this.#target.dispatchEvent(
      detail !== undefined
        ? new CustomEvent(event as string, { detail })
        : new CustomEvent(event as string),
    )
  }
}

/** Shared event bus singleton for all modules and libs. */
export const eventBus = new TypedEventBus()
