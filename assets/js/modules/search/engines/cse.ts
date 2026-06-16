import type { CSEConfig } from '../../../types/config'
import type { SearchEngine, SearchResult } from '../types'

/**
 * Create a Google Custom Search Engine adapter.
 *
 * Returns a single result that links to the CSE results page.
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
      console.warn('CSE is not properly configured. Please set cse.engine to "google" and provide a cx value in your site config.')
      return [{
        uri: '',
        title: 'CSE is not configured',
        date: '',
        context: 'Please set <code>cse.engine</code> and <code>cse.google.cx</code> in your site config.',
      }]
    },
  }
}
