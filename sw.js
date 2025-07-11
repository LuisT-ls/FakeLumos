const CACHE_NAME = 'fake-news-checker-v2'
const OFFLINE_URL = '/pages/offline.html'

const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  OFFLINE_URL
]

const SECONDARY_ASSETS = [
  '/js/app.js',
  '/js/modules/dom.js',
  '/js/modules/events.js',
  '/js/modules/ui.js',
  '/js/modules/history.js',
  '/js/modules/accessibility.js',
  '/js/modules/i18n.js',
  '/js/modules/rendering.js',
  '/js/modules/share.js',
  '/js/modules/storage.js',
  '/js/modules/utils.js'
]

self.addEventListener('install', event => {
  console.log('Service Worker instalando...')
  event.waitUntil(
    Promise.all([
      caches.open(`${CACHE_NAME}-critical`).then(cache => {
        console.log('Cacheando recursos críticos')
        return cache.addAll(CRITICAL_ASSETS).catch(error => {
          console.warn('Erro ao cachear recursos críticos:', error)
        })
      }),
      caches.open(`${CACHE_NAME}-secondary`).then(cache => {
        console.log('Cacheando recursos secundários')
        return cache.addAll(SECONDARY_ASSETS).catch(error => {
          console.warn('Erro ao cachear recursos secundários:', error)
        })
      })
    ]).catch(error => {
      console.error('Erro geral ao cachear assets:', error)
    })
  )
})

self.addEventListener('activate', event => {
  console.log('Service Worker ativando...')
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheName.startsWith(CACHE_NAME)) {
              console.log('Removendo cache antigo:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
      .catch(error => {
        console.error('Erro na ativação do Service Worker:', error)
      })
  )
})

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  // Ignorar solicitações de extensão do Chrome
  if (url.protocol === 'chrome-extension:') {
    return
  }

  // Ignorar solicitações para recursos externos (CDNs)
  if (url.hostname !== location.hostname) {
    return
  }

  // Tratamento especial para arquivos CSS
  if (url.href.endsWith('.css')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request)
      })
    )
    return
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL) || caches.match('/')
      })
    )
    return
  }

  // Critical assets strategy
  if (CRITICAL_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches
        .match(event.request, { cacheName: `${CACHE_NAME}-critical` })
        .then(
          response =>
            response || fetchAndCache(event.request, `${CACHE_NAME}-critical`)
        )
    )
    return
  }

  // Secondary assets strategy
  if (SECONDARY_ASSETS.some(asset => url.href.includes(asset))) {
    event.respondWith(
      caches
        .match(event.request)
        .then(
          response =>
            response || fetchAndCache(event.request, `${CACHE_NAME}-secondary`)
        )
    )
    return
  }

  // Default strategy - apenas para recursos locais
  if (url.hostname === location.hostname) {
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) return response

        return fetch(event.request)
          .then(response => {
            if (
              !response ||
              response.status !== 200 ||
              response.type !== 'basic'
            ) {
              return response
            }

            // Apenas armazenar em cache recursos válidos e seguros
            const url = new URL(response.url)
            if (url.protocol === 'http:' || url.protocol === 'https:') {
              const responseToCache = response.clone()
              caches
                .open(`${CACHE_NAME}-secondary`)
                .then(cache => cache.put(event.request, responseToCache))
                .catch(err => console.warn('Erro ao cachear:', err))
            }

            return response
          })
          .catch(() => {
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL)
            }
          })
      })
    )
  }
})

function fetchAndCache(request, cacheName) {
  return fetch(request).then(response => {
    if (!response || response.status !== 200) {
      return response
    }

    // Verificar se a URL é válida para cache
    const url = new URL(request.url)
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      const responseToCache = response.clone()
      caches
        .open(cacheName)
        .then(cache => cache.put(request, responseToCache))
        .catch(err => console.warn('Erro ao cachear:', err))
    }

    return response
  })
}

self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting()
  }
})
