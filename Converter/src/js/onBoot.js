async function aktifkanServiceWorker() {
    if (!('serviceWorker' in navigator)) return

    try {
        await navigator.serviceWorker.register('./service-worker.js')

        await navigator.serviceWorker.ready

        if (!navigator.serviceWorker.controller) {
            await new Promise(resolve => {
                const selesai = () => resolve()

                navigator.serviceWorker.addEventListener(
                    'controllerchange',
                    selesai,
                    { once: true }
                )

                // Menghindari race condition
                if (navigator.serviceWorker.controller) {
                    resolve()
                }
            })
        }

        console.log('Service Worker siap.')

    } catch (error) {
        console.error('Service Worker gagal:', error)
    }
}

await aktifkanServiceWorker()
await import('./main.js')