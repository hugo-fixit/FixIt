/**
 * Iterate over an array-like collection.
 * If any handler call returns a Promise, all Promises are collected and returned.
 * @param elements - The collection to iterate over.
 * @param handler - Callback invoked for each element.
 * @returns A promise that resolves when all handler promises complete.
 */
export function forEach<T extends Element = Element>(elements: ArrayLike<T> | T[], handler: (el: T, i: number) => void | Promise<any>): Promise<any[]> {
  elements = elements || []
  const promises: Promise<any>[] = []
  for (let i = 0; i < elements.length; i++) {
    const result = handler(elements[i], i)
    if (result instanceof Promise) {
      promises.push(result)
    }
  }
  return Promise.all(promises)
}
