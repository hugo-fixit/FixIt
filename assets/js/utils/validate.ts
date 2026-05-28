/**
 * Validate whether a value is a valid Date instance.
 * @param date - The value to check.
 * @returns `true` if the value is a valid Date.
 */
export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !Number.isNaN(date.getTime())
}

/**
 * Check whether a string looks like a JavaScript object literal.
 * @param str - The value to check.
 * @returns `true` if the string resembles `{...}`.
 */
export function isObjectLiteral(str: unknown): str is string {
  if (typeof str !== 'string') {
    return false
  }
  const trimmed = str.replace(/\s+/g, ' ').trim().replace(/;$/, '')
  return trimmed.startsWith('{') && trimmed.endsWith('}')
}
