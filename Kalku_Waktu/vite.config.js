
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineConfig({
    plugins: [
        tailwindcss(),

        {
            name: 'remove-python-cache',

            closeBundle() {
                const cacheDir = resolve('dist/python/__pycache__')

                if (existsSync(cacheDir)) {
                    rmSync(cacheDir, {
                        recursive: true,
                        force: true
                    })
                }
            }
        }
    ]
})
