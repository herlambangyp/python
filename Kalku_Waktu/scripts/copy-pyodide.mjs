import { cpSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const pyodideDir = dirname(
    fileURLToPath(import.meta.resolve('pyodide'))
)

const targetDir = join(process.cwd(), 'public', 'pyodide')

mkdirSync(targetDir, { recursive: true })

const exclude = [
    '.md',
    '.html',
    '.d.ts',
    '.whl',
    '.map'
]

for (const file of readdirSync(pyodideDir)) {
    if (exclude.some(ext => file.endsWith(ext))) continue
    if (file === 'node_modules') continue

    cpSync(
        join(pyodideDir, file),
        join(targetDir, file),
        { recursive: true }
    )
}

console.log('Pyodide berhasil disalin ke public/pyodide')