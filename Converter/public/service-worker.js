const CACHE_NAME = 'converter-assets-v1'

self.addEventListener('fetch', event => {
    const request = event.request,
          url = new URL(request.url)

    if (request.method !== 'GET' || url.origin !== self.location.origin) return
    if (!url.pathname.includes('/pyodide/') && !url.pathname.includes('/python/')) return

    event.respondWith(
        caches.open(CACHE_NAME).then(async cache => {
            const cached = await cache.match(request)
            if (cached) return cached

            const response = await fetch(request)
            if (response.ok) {
                await cache.put(request, response.clone())
            }
            return response
        })
    )
})

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            )
        }).then(() => self.clients.claim())
    )
})