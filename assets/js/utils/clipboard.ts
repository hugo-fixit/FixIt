/**
 * Create a text-copy helper with clipboard API fallback.
 * @returns A function that copies text to the clipboard.
 */
export function createCopyText(): (text: string) => Promise<void> {
  if (navigator.clipboard) {
    return (text: string) => navigator.clipboard.writeText(text)
  }
  return (text: string) => new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.value = text
    document.body.appendChild(input)
    input.select()
    if (document.execCommand('copy')) {
      document.body.removeChild(input)
      resolve()
    }
    else {
      reject(new Error('Copy failed'))
    }
  })
}
