/**
 * Early-loaded head scripts — runs synchronously before body rendering.
 *
 * Aggregates all head scripts into a single entry point.
 */
import { initColorScheme } from './color-scheme'
import { initPlatform } from './platform'

initColorScheme()
initPlatform()
