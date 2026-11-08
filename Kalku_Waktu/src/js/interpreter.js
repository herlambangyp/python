let pyodide

async function initPython() {
    pyodide = await loadPyodide()

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