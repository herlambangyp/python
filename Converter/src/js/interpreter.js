
let pyodide

export async function initPython(onStatus =o=> { }) {
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