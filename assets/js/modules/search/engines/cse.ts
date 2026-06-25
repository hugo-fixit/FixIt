import type { CSEConfig, SearchEngine, SearchResult } from '../types'

/**
 * Create a Custom Search Engine adapter (Google or Bing).
 *
 * Returns a single result that links to the CSE results page.
 * @param cseConfig - The CSE configuration, or `undefined` if not configured.
 * @returns A SearchEngine instance for the configured CSE provider.
 */
export function createCSEEngine(cseConfig: CSEConfig | undefined): SearchEngine {
  return {
    async search(query: string): Promise<SearchResult[]> {
      if (cseConfig?.engine === 'google' && cseConfig.cx) {
        return [{
          uri: `${cseConfig.resultsPage}#gsc.tab=0&gsc.q=${encodeURIComponent(query)}`,
          title: cseConfig.searchIn || '',
          date: '',
          context: cseConfig.gotoResultsPage || '',
          icon: '<i class="fa-brands fa-google" aria-hidden="true"></i>',
        }]
      }
      if (cseConfig?.engine === 'bing' && cseConfig.cx) {
        return [{
          uri: `${cseConfig.resultsPage}?q=${encodeURIComponent(query)}`,
          title: cseConfig.searchIn || '',
          date: '',
          context: cseConfig.gotoResultsPage || '',
          icon: '<i class="fa-brands fa-microsoft" aria-hidden="true"></i>',
        }]
      }
      console.warn('CSE is not properly configured. Please set cse.engine and provide a cx value in your site config.')
      return [{
        uri: '',
        title: 'CSE is not configured',
        date: '',
        context: 'Please set <code>cse.engine</code> and the corresponding <code>cx</code> value in your site config.',
      }]
    },
  }
}
