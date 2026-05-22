/** Lightweight service container with Symbol-based tokens and lazy resolution. */

/** A typed service token that carries its service type via phantom properties. */
export interface ServiceToken<T> {
  readonly _type?: T
  readonly key: symbol
}

/** Create a typed service token. */
export function token<T>(description: string): ServiceToken<T> {
  return { key: Symbol(description) }
}

interface ServiceEntry {
  instance: unknown
  factory: (container: ServiceContainer) => unknown
  status: 'pending' | 'resolving' | 'resolved'
}

export class ServiceContainer {
  private services = new Map<symbol, ServiceEntry>()

  /** Register a service factory. */
  register<T>(serviceToken: ServiceToken<T>, factory: (container: ServiceContainer) => T): this {
    this.services.set(serviceToken.key, {
      instance: undefined,
      factory,
      status: 'pending',
    })
    return this
  }

  /** Resolve a service, creating it lazily. Throws on circular deps. */
  resolve<T>(serviceToken: ServiceToken<T>): T {
    const entry = this.services.get(serviceToken.key)
    if (!entry)
      throw new Error(`Service not registered: ${String(serviceToken.key)}`)
    if (entry.status === 'resolved')
      return entry.instance as T
    if (entry.status === 'resolving')
      throw new Error(`Circular dependency detected: ${String(serviceToken.key)}`)
    entry.status = 'resolving'
    entry.instance = entry.factory(this)
    entry.status = 'resolved'
    return entry.instance as T
  }
}
