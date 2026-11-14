
let pyodide

export async function initPython(onStatus = () => { }) {
    const status = (message, type = 'loading') => {
        onStatus({ message, type })
    }
    let kodePython

    try {
        let pyodidePath = `pyodide/`,
            wheelUrl

        const { loadPyodide } = await import(
            `pyodide/pyodide.mjs`
        )

        status('Membuat Sistem Virtual Python...')
        pyodide = await loadPyodide({indexURL: new URL(pyodidePath, document.baseURI).href})

        // Load Wheel Pillow
        status('Memuat package Pillow...')
        wheelUrl = new URL('./python/wheel/pillow-11.3.0.whl',document.baseURI).href
        await pyodide.loadPackage(wheelUrl)

        // Load Wheel Pymupdf        
        status('Memuat engine PDF...')
        wheelUrl = new URL('./python/wheel/pymupdf-1.27.2.3.whl',document.baseURI).href
        await pyodide.loadPackage(wheelUrl)

        // Semua module python wajib disimpan di penyimpanan virtual /home/pyodide/ <---disini
        // Load module converter.py
        status('Memuat Converter Python...')
        let response = await fetch('./python/converter.py')
        kodePython = await response.text()
        pyodide.FS.writeFile('/home/pyodide/converter.py', kodePython)
        pyodide.runPython(`import converter`)
        console.log(`Status Converter: `, pyodide.runPython(`converter.loaded()`))

        // Inisialisasi Python Selesai
        setTimeout(()=>{
            const versiPython = pyodide.runPython(`import sys; f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"`)
            status(`System Virtual Python ${versiPython} berhasil dibuat`, 'success')
        }, 1000)
        return pyodide

    } catch (error) {
        console.error('Gagal memuat Python:', error)
        status(error.message, 'error')
        throw error
    }
}

export async function mulaiConvert(pyodide) {

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

                const inputPath = `/input/${safeName}`
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
                    pyodide.globals.set('format_output', options.format)

                    // Jalankan fungsi Python
                    pythonResult = await pyodide.runPythonAsync(`
await converter.convert_pdf(
    pdf_input_path,
    pdf_output_dir,
    dpi_value,
    quality_value,
    progress_callback,
    format_output
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
                    } catch { }

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
