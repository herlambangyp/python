let pyodide, pesanLoad

function textRandom() {
    let kalimat = [
        'Memuat Interpreter Python...',
        'Load Pyodide...',
        'Menyiapkan Engine Python...',
        'Memuat Keseluruhan...',
        'Menyiapkan .venv',
        'Mencoba Koneksi js - py...'
    ]

    const indexAcak = Math.floor(Math.random() * kalimat.length)
    return kalimat[indexAcak]
}
async function initPython() {
    let kodePython
    btnMulaiHitung.disabled = true

    try {
        pesanLoad = setInterval(() => {
            loadingPython.textContent = textRandom()
        }, 2500)

        pyodide = await loadPyodide()
        const response = await fetch('./main.py')
        kodePython = await response.text()

        pyodide.FS.writeFile('/home/pyodide/main.py', kodePython)
        pyodide.runPython(`import main`)

        btnMulaiHitung.innerHTML = `
      <div class="text-success w-fit h-fit">
        <svg class="w-6 rounded-[50%] stroke-3 stroke-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark__circle" cx="26" cy="26" r="23" fill="none" />
          <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div> Berhasil Load Python
    `
    } catch (e) {
        console.error('Terjadi Error : \n', e)
        btnMulaiHitung.textContent = e
    } finally {
        clearInterval(pesanLoad)
        btnMulaiHitung.disabled = false
    }

    setTimeout(() => {
        btnMulaiHitung.innerHTML = "Hitung"
    }, 3000)
}
export function kirimHitung(){

    if (pilihanMode.value === "Pilih Mode Kalkulator" || pilihanSatuanWaktu.value === 'Pilih Jenis' || inputJumlahWaktu.value.length < 1){
        return
    }
    // variabel pyodide diambil oleh interpreter.js
    hasilHitung.innerHTML = pyodide.runPython(`main.hitung(variabelAngka='${inputJumlahWaktu.value}', operasi='${pilihanMode.value}', satuan='${pilihanSatuanWaktu.value}')`)
    
}
initPython()