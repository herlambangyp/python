// Selector Global:
// Type Input
const inputJumlahWaktu = document.getElementById('inputJumlahWaktu'),
    // Type BTN
    btnMulaiHitung = document.getElementById('btnMulaiHitung'),
    // Type Select
    pilihanMode = document.getElementById('pilihanMode'),
    pilihanSatuanWaktu = document.getElementById('pilihanSatuanWaktu'),
    // Type Element
    inputAngka = document.getElementById('inputAngka'),
    inputJenis = document.getElementById('inputJenis'),
    loadingPython = document.getElementById('loadingPython'),
    pesanLoading = document.getElementById('pesanLoading'),
    hasilHitung = document.getElementById('hasilHitung'),
    contHasil = document.getElementById('contHasil')

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
export async function initPython() {
    let kodePython
    btnMulaiHitung.disabled = true

    try {
        pesanLoad = setInterval(() => {
            pesanLoading.textContent = textRandom()
        }, 2500)

        pyodide = await loadPyodide()
        const response = await fetch('./main.py')
        kodePython = await response.text()

        pyodide.FS.writeFile('/home/pyodide/main.py', kodePython)
        pyodide.runPython(`import main`)
        let pesanPython = pyodide.runPython('main.loaded()')

        loadingPython.classList.remove('loading', 'loading-spinner', 'loading-xs')
        loadingPython.innerHTML = `
      <div class="text-success w-fit h-fit">
        <svg class="w-6 rounded-[50%] stroke-3 stroke-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark__circle" cx="26" cy="26" r="23" fill="none" />
          <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>
    `
    pesanLoading.textContent = pesanPython
    } catch (e) {
        console.error('Terjadi Error : \n', e)
        pesanLoading.textContent = e
    } finally {
        clearInterval(pesanLoad)
        btnMulaiHitung.disabled = false
        setTimeout(() => {
            loadingPython.classList.add('hidden')
            pesanLoading.textContent = "Hitung"
        }, 3000)
        return true
    }
}
export function kirimHitung() {

    if (pilihanMode.value === "Pilih Mode Kalkulator" || pilihanSatuanWaktu.value === 'Pilih Jenis' || inputJumlahWaktu.value.length < 1) {
        return
    }
    // variabel pyodide diambil oleh interpreter.js
    contHasil.classList.remove('hidden')
    hasilHitung.innerHTML = pyodide.runPython(`main.hitung(variabelAngka='${inputJumlahWaktu.value}', operasi='${pilihanMode.value}', satuan='${pilihanSatuanWaktu.value}')`)

}