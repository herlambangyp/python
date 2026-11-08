let pyodide

async function initPython() {
    btnMulaiHitung.disabled = true
    try {
        pyodide = await loadPyodide()
    }
    catch (e) {
        console.error('Terjadi Error : \n', e)
        btnMulaiHitung.textContent = e

    }
    btnMulaiHitung.disabled = false
    btnMulaiHitung.textContent = "Hitung"

    const response = await fetch('./main.py')
    const kodePython = await response.text()

    pyodide.FS.writeFile('/home/pyodide/main.py', kodePython)

    pyodide.runPython(`
        import main
    `)

    console.log(
        pyodide.runPython('main.halo()')
    )
}

initPython()