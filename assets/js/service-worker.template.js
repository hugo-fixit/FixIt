/* eslint-disable no-restricted-globals -- `self` is the standard Service Worker global */

/**
 * Service Worker
 * @description Three-strategy caching with the native Cache API:
 * - Static assets (fingerprinted CSS/JS): cache-first, immutable
 * - Images: stale-while-revalidate
 * - HTML pages: network-first, fallback to cache when offline
 * Asset URLs are injected at build time via Hugo's ExecuteAsTemplate,
 * ensuring they match fingerprinted paths when fingerprint is enabled.
 * @see https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook
 */

/* ========== Constants ========== */

const CACHE_NAME = 'fixit-{{ .version }}'

/** URLs to pre-cache during the install event (injected by Hugo). */
const PRECACHE_URLS = [
  '{{ .mainCSSURL }}',
  '{{ .mainJSURL }}',
  '{{ .relURL }}site.webmanifest',
  '{{ .offlineURL }}',
  '{{ .relURL }}404.html',
]

const OFFLINE_PAGE = '{{ .offlineURL }}'
const NOT_FOUND_PAGE = '{{ .relURL }}404.html'

/** Maximum number of HTML pages to keep in cache (LRU eviction). */
const MAX_HTML_CACHE_ENTRIES = 100

/** Static asset extensions — these are fingerprinted by Hugo and safe to cache forever. */
const STATIC_EXTENSIONS = ['css', 'js', 'woff2', 'woff', 'ttf', 'eot', 'svg']

/** Image extensions — use stale-while-revalidate strategy. */
const IMAGE_EXTENSIONS = ['webp', 'avif', 'png', 'jpg', 'jpeg', 'gif', 'ico']

/* ========== Helpers ========== */

/** Cached cache instance — avoids repeated caches.open() calls. */
const cachePromise = caches.open(CACHE_NAME)

/**
 * Check if a URL is a same-origin static asset (fingerprinted by Hugo).
 * Returns false for HTML pages and extensionless paths.
 */
function isStaticAsset(url) {
  if (!url.startsWith(self.location.origin))
    return false
  const pathname = new URL(url).pathname
  const dotIndex = pathname.lastIndexOf('.')
  if (dotIndex === -1)
    return false
  const ext = pathname.slice(dotIndex + 1).toLowerCase()
  return STATIC_EXTENSIONS.includes(ext)
}

/**
 * Check if a URL is a same-origin image asset.
 */
function isImageAsset(url) {
  if (!url.startsWith(self.location.origin))
    return false
  const pathname = new URL(url).pathname
  const dotIndex = pathname.lastIndexOf('.')
  if (dotIndex === -1)
    return false
  const ext = pathname.slice(dotIndex + 1).toLowerCase()
  return IMAGE_EXTENSIONS.includes(ext)
}

/**
 * Evict oldest HTML cache entries when the limit is exceeded.
 * Operates on cache insertion order (Cache API preserves insertion order for keys()).
 * Skips pre-cached URLs (offline/404 pages) to ensure they are never evicted.
 */
async function evictOldEntries() {
  const cache = await cachePromise
  const keys = await cache.keys()
  // PRECACHE_URLS contains relative paths from Hugo; resolve them to absolute URLs for comparison.
  const precacheSet = new Set(PRECACHE_URLS.map(url => new URL(url, self.location.origin).href))
  const htmlKeys = keys.filter(req => !isStaticAsset(req.url) && !isImageAsset(req.url) && !precacheSet.has(req.url))
  const excess = htmlKeys.length - MAX_HTML_CACHE_ENTRIES
  if (excess > 0) {
    await Promise.all(htmlKeys.slice(0, excess).map(req => cache.delete(req)))
  }
}

/* ========== Lifecycle ========== */

/** Pre-cache core assets on install (individual calls for resilience). */
self.addEventListener('install', (event) => {
  event.waitUntil(
    cachePromise
      .then(cache => Promise.allSettled(
        PRECACHE_URLS.filter(Boolean).map(url => cache.add(url)),
      ))
      .then(() => self.skipWaiting()),
  )
})

/** Clean up old caches, evict stale HTML entries, enable navigation preload, and take control. */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys()
        .then(keys => Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)),
        )),
      // Enable navigation preload for faster page loads
      self.registration.navigationPreload?.enable(),
    ])
      .then(() => evictOldEntries())
      .then(() => self.clients.claim()),
  )
})

/** Allow clients to trigger immediate activation of a waiting service worker. */
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

/* ========== Fetch Strategies ========== */

/** Route same-origin GET requests to the appropriate caching strategy. */
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Cache API only supports GET
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin))
    return

  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request))
  }
  else if (isImageAsset(request.url)) {
    event.respondWith(staleWhileRevalidate(request))
  }
  else {
    event.respondWith(networkFirst(request, event))
  }
})

/**
 * Cache-first strategy for fingerprinted static assets.
 * These are immutable — a content change produces a new URL,
 * so cached responses are always valid.
 */
async function cacheFirst(request) {
  const cache = await cachePromise
  const cached = await cache.match(request)
  if (cached)
    return cached

  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  }
  catch {
    return new Response('Offline', { status: 503 })
  }
}

/**
 * Stale-while-revalidate strategy for images.
 * Returns cached version immediately while fetching an update in the background.
 */
async function staleWhileRevalidate(request) {
  const cache = await cachePromise
  const cached = await cache.match(request)

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => cached)

  return cached || fetchPromise
}

/**
 * Network-first strategy for HTML pages.
 * Uses navigation preload when available, falls back to network fetch.
 * Always tries the network for fresh content, falls back to cache on failure.
 */
async function networkFirst(request, event) {
  try {
    // Use preloaded response if available (enabled in activate handler)
    const preloadResponse = await event?.preloadResponse
    const response = preloadResponse || await fetch(request)
    if (response.ok) {
      const cache = await cachePromise
      cache.put(request, response.clone())
      // Evict oldest HTML entries to keep cache bounded
      evictOldEntries()
    }
    // Server error (4xx/5xx) — try 404 page from cache
    if (response.status >= 400) {
      return (await caches.match(NOT_FOUND_PAGE)) || response
    }
    return response
  }
  catch {
    // Network failure — try cached page, then offline fallback
    try {
      return (await caches.match(request)) || (await caches.match(OFFLINE_PAGE)) || new Response('Offline', { status: 503 })
    }
    catch {
      return new Response('Offline', { status: 503 })
    }
  }
}
