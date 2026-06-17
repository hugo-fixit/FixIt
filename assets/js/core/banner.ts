/**
 * Console banner — prints a styled FixIt version message in the browser console.
 */
export function printBanner(version: string) {
  const color = '#FF735A'
  // eslint-disable-next-line no-console
  console.log(
    `%c FixIt ${version} %c https://github.com/hugo-fixit %c`,
    `background: ${color}; border: 1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
    `border: 1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
    'background: transparent;',
  )
}
