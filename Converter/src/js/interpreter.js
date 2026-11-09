
import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.29.4/full/pyodide.mjs'

let pyodide

export async function initPython(onStatus = () => {}) {
    const status = (message, type = 'loading') => {
        onStatus({ message, type })
    }

    try {
        status('Menginisialisasi runtime Python...')
        pyodide = await loadPyodide()

        status('Memuat package Pillow...')
        await pyodide.loadPackage('pillow')

        status('Memuat engine PyMuPDF...')
        const wheelUrl = new URL(
            './pymupdf-1.27.2.3.whl',
            document.baseURI
        ).href

        await pyodide.loadPackage(wheelUrl)

        status('Memeriksa engine PDF...')
        const versi = pyodide.runPython(`
import pymupdf
pymupdf.VersionBind
        `)

        console.log('PyMuPDF:', versi)
        console.log('Pyodide:', pyodide.version)
        console.log(pyodide.runPython('import sys; sys.version'))

        status(`Python ${pyodide.runPython('sys.version')} berhasil dimuat di browser!`, 'success')

        return pyodide

    } catch (error) {
        console.error('Gagal memuat Python:', error)

        status(error.message, 'error')

        throw error
    }
}
