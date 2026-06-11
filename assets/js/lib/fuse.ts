/**
 * Fuse.js integration for FixIt.
 *
 * Responsibilities:
 * - Import ESM fuse.mjs and expose window.Fuse for search module.
 */
import Fuse from '../../lib/fuse/fuse.mjs'

window.Fuse = Fuse
