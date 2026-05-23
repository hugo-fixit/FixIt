/** Typed event bus — wraps DOM CustomEvents with type-safe emit/on/off. */

/** Event map: every FixIt event and its payload shape. */
export interface FixItEventMap {
  'fixit:switch-theme': { isDark: boolean, isChanged: boolean }
  'fixit:scroll': void
  'fixit:resize': void
  'fixit:decrypted': void
  'fixit:partial-decrypted': { target: Element }
  'fixit:reset': void
  'fixit:before-print': void
  'fixit:after-print': void
  'fixit:code-tab-sync': { lang: string, source: HTMLElement }
  'fixit:mermaid-rendered': void
}

type Handler<T> = T extends void
  ? (() => void) | ((event: CustomEvent<void>) => void)
  : (event: CustomEvent<T>) => void

export class TypedEventBus {
  private target = document

  on<K extends keyof FixItEventMap>(event: K, handler: Handler<FixItEventMap[K]>): void {
    this.target.addEventListener(event as string, handler as EventListener)
  }

  off<K extends keyof FixItEventMap>(event: K, handler: Handler<FixItEventMap[K]>): void {
    this.target.removeEventListener(event as string, handler as EventListener)
  }

  emit<K extends keyof FixItEventMap>(
    event: K,
    ...args: FixItEventMap[K] extends void ? [] : [FixItEventMap[K]]
  ): void {
    const detail = args[0]
    this.target.dispatchEvent(
      detail !== undefined
        ? new CustomEvent(event as string, { detail })
        : new CustomEvent(event as string),
    )
  }
}
