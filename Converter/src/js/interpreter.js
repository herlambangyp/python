
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

        status('Memuat engine PDF...')
        const wheelUrl = new URL(
            './pymupdf-1.27.2.3.whl',
            document.baseURI
        ).href

        await pyodide.loadPackage(wheelUrl)

        const versi = pyodide.runPython(`
import pymupdf
pymupdf.VersionBind
        `)

        const versiPython = pyodide.runPython(`
import sys
f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
        `)

        console.log('PyMuPDF:', versi)
        console.log('Pyodide:', pyodide.version)

        status(`Python ${versiPython} berhasil dimuat di browser!`, 'success')

        return pyodide

    } catch (error) {
        console.error('Gagal memuat Python:', error)
        status(error.message, 'error')
        throw error
    }
}


// Memuat converter.py dan mendaftarkan event konversi
export async function registerConversionHandler(pyodide) {

    // Ambil kode Python dari folder proyek
    const converterUrl = new URL('../../converter.py', import.meta.url)
    const response = await fetch(converterUrl)

    if (!response.ok) {
        throw new Error('Gagal memuat converter.py')
    }

    const pythonCode = await response.text()

    // Masukkan converter.py ke filesystem Pyodide
    pyodide.FS.writeFile(
        '/converter.py',
        pythonCode,
        { encoding: 'utf8' }
    )

    // Impor modul Python
    pyodide.runPython(`
import sys
import importlib

if '/' not in sys.path:
    sys.path.insert(0, '/')

importlib.invalidate_caches()
import converter
    `)

    console.log('Modul converter.py berhasil dimuat')

    // Dengarkan permintaan konversi dari main.js
    window.addEventListener('pdf-convert', async event => {

        const { files, options } = event.detail
        const results = []

        try {
            window.dispatchEvent(
                new Event('pdf-conversion-start')
            )

            pyodide.FS.mkdirTree('/input')
            pyodide.FS.mkdirTree('/output')

            // Proses setiap PDF yang dipilih
            for (const [index, file] of files.entries()) {

                const safeName = file.name.replace(
                    /[^a-zA-Z0-9._-]/g,
                    '_'
                )

                const inputPath = `/input/${index}-${safeName}`
                const outputDir = `/output/file-${index}`

                // Baca PDF dari browser
                const bytes = new Uint8Array(
                    await file.arrayBuffer()
                )

                // Kirim PDF ke filesystem Python
                pyodide.FS.writeFile(inputPath, bytes)

                // Callback untuk menerima progress dari Python
                const progressCallback = (current, total, label) => {
                    window.dispatchEvent(
                        new CustomEvent('pdf-conversion-progress', {
                            detail: {
                                current,
                                total,
                                label: `${file.name} — ${label}`
                            }
                        })
                    )
                }

                let pythonResult

                try {
                    // Kirim parameter ke Python
                    pyodide.globals.set('pdf_input_path', inputPath)
                    pyodide.globals.set('pdf_output_dir', outputDir)
                    pyodide.globals.set('dpi_value', options.dpi)
                    pyodide.globals.set('quality_value', options.quality)
                    pyodide.globals.set('progress_callback', progressCallback)

                    // Jalankan fungsi Python
                    pythonResult = await pyodide.runPythonAsync(`
await converter.convert_pdf(
    pdf_input_path,
    pdf_output_dir,
    dpi_value,
    quality_value,
    progress_callback
)
                    `)

                    // Ambil daftar lokasi hasil dari Python
                    const outputPaths = pythonResult?.toJs
                        ? pythonResult.toJs()
                        : pythonResult

                    // Baca setiap hasil WebP dari filesystem Python
                    for (const outputPath of outputPaths) {

                        const imageBytes = pyodide.FS.readFile(outputPath)

                        const blob = new Blob([imageBytes], {
                            type: 'image/webp'
                        })

                        results.push({
                            name: outputPath.split('/').pop(),
                            size: blob.size,
                            url: URL.createObjectURL(blob)
                        })
                    }

                } finally {
                    // Bebaskan proxy hasil Python
                    pythonResult?.destroy?.()

                    // Hapus PDF sementara
                    try {
                        pyodide.FS.unlink(inputPath)
                    } catch {}

                    // Hapus folder hasil sementara di Python
                    pyodide.globals.set('cleanup_dir', outputDir)

                    pyodide.runPython(`
import shutil
shutil.rmtree(cleanup_dir, ignore_errors=True)
                    `)
                }
            }

            // Kirim seluruh hasil ke GUI
            window.dispatchEvent(
                new CustomEvent('pdf-conversion-complete', {
                    detail: { results }
                })
            )

        } catch (error) {
            console.error('Konversi gagal:', error)

            // Bersihkan Blob URL jika proses gagal
            results.forEach(result => {
                URL.revokeObjectURL(result.url)
            })

            window.dispatchEvent(
                new CustomEvent('pdf-conversion-error', {
                    detail: {
                        message: error.message
                    }
                })
            )
        }
    })
}
