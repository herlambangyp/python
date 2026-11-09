import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.29.4/full/pyodide.mjs'

let pyodide
async function innitPython() {

    try {
        pyodide = await loadPyodide()

        await pyodide.loadPackage("pillow")
        
        const wheelUrl = new URL('./pymupdf-1.27.2.3.whl', document.baseURI).href
        await pyodide.loadPackage(wheelUrl)
        console.log('PyMuPDF berhasil dimuat')

        console.log(pyodide.version)
        console.log(pyodide.runPython("import sys; sys.version"))
    }
    catch (e) {
        console.error(e)
    }
}
innitPython()
