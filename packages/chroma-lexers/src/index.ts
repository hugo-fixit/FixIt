import { fetchLexers } from './fetch-lexers'
import { generateScss } from './generate-scss'

export default async function main() {
  const lexers = await fetchLexers()
  generateScss(lexers)
}

main()
