const APP_CACHE = 'converter-app-v1'
const PYTHON_CACHE = 'converter-python-v1'
const CACHE_PREFIX = 'converter-'

// Tentukan lokasi aplikasi berdasarkan scope SW
const scopeURL = new URL(self.registration.scope)

// Identifikasi resource berdasarkan path relatif aplikasi
function getCacheName(url) {
    const relativePath = url.pathname.slice(
        scopeURL.pathname.length
    )

    if (
        relativePath.startsWith('pyodide/') ||
        relativePath.startsWith('python/')
    ) {
        return PYTHON_CACHE
    }

    return APP_CACHE
}

// Instalasi: simpan index.html dan resource
// yang dirujuk langsung oleh HTML
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(APP_CACHE)

        const response = await fetch(scopeURL.href)

        if (!response.ok) {
            throw new Error('Gagal mengambil index.html')
        }

        const html = await response.clone().text()

        await cache.put(scopeURL.href, response)

        // Ambil URL dari atribut src dan href
        const paths = [
            ...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)
        ].map(match => match[1])

        await Promise.all(paths.map(async path => {
            const url = new URL(path, scopeURL)

            // Jangan cache resource dari luar aplikasi
            if (
                url.origin !== scopeURL.origin ||
                !url.pathname.startsWith(scopeURL.pathname)
            ) return

            try {
                const resource = await fetch(url)

                if (resource.ok) {
                    await cache.put(url.href, resource)
                }
            } catch (error) {
                console.warn('Gagal precache:', url.href, error)
            }
        }))

        await self.skipWaiting()
    })())
})

// Aktivasi: hapus cache versi lama milik aplikasi
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key =>
                        key.startsWith(CACHE_PREFIX) &&
                        ![APP_CACHE, PYTHON_CACHE].includes(key)
                    )
                    .map(key => caches.delete(key))
            )
        }).then(() => self.clients.claim())
    )
})

// Tangani seluruh GET dalam scope aplikasi
self.addEventListener('fetch', event => {
    const request = event.request
    const url = new URL(request.url)

    if (
        request.method !== 'GET' ||
        url.origin !== scopeURL.origin ||
        !url.pathname.startsWith(scopeURL.pathname)
    ) return

    // Navigasi halaman: Network First
    if (request.mode === 'navigate') {
        event.respondWith((async () => {
            const cache = await caches.open(APP_CACHE)

            try {
                const response = await fetch(request)

                if (response.ok) {
                    await cache.put(request, response.clone())
                }

                return response
            } catch (error) {
                return (
                    await cache.match(request) ||
                    await cache.match(scopeURL.href) ||
                    Response.error()
                )
            }
        })())

        return
    }

    // Resource lainnya: Cache First
    event.respondWith((async () => {
        const cache = await caches.open(getCacheName(url))

        const cached = await cache.match(request)

        if (cached) return cached

        const response = await fetch(request)

        if (response.ok) {
            await cache.put(request, response.clone())
        }

        return response
    })())
})
