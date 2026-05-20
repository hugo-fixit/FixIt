/**
 * Escape a string for safe HTML text output.
 * @param str - The string to escape.
 * @returns The escaped string.
 */
export function HTMLEscape(str: string): string {
  return str.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
  }[char]!))
}

/**
 * Apply highlight tags to text at the given character index ranges.
 * @param text - The source text to highlight.
 * @param indices - Array of `[start, end]` character index pairs.
 * @param highlightTag - The HTML tag name to wrap highlights with.
 * @returns The text with highlight tags inserted.
 */
export function applyHighlightToText(text: string, indices: number[][], highlightTag: string): string {
  let offset = 0
  for (let i = 0; i < indices.length; i++) {
    const substr = text.substring(indices[i][0] + offset, indices[i][1] + 1 + offset)
    const tag = `<${highlightTag}>${substr}</${highlightTag}>`
    text = text.substring(0, indices[i][0] + offset) + tag + text.substring(indices[i][1] + 1 + offset, text.length)
    offset += highlightTag.length * 2 + 5
  }
  return text
}
