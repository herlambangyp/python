import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.29.4/full/pyodide.mjs'
// Selector Global:
// Type Input
const inputJumlahWaktu = document.getElementById('inputJumlahWaktu'),
    // Type BTN
    btnMulaiHitung = document.getElementById('btnMulaiHitung'),
    // Type Select
    pilihanMode = document.getElementById('pilihanMode'),
    pilihanSatuanWaktu = document.getElementById('pilihanSatuanWaktu'),
    // Type Element
    loadingPython = document.getElementById('loadingPython'),
    pesanLoading = document.getElementById('pesanLoading'),
    hasilHitung = document.getElementById('hasilHitung'),
    contHasil = document.getElementById('contHasil')

let pyodide, pesanLoad, timerLoading, timerLoading2

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
        }, 4000)
        timerLoading = setTimeout(() => {
            pesanTambahan.classList.remove('hidden')
        }, 10000)
        timerLoading2 = setTimeout(() => {
            pesanTambahan.textContent = `Ini bukan stuck loading, mohon tunggu sedikit lagi...`
        }, 20000)

        pyodide = await loadPyodide()

        let response = await fetch('./python/hitung.py')
        kodePython = await response.text()
        pyodide.FS.writeFile('/home/pyodide/hitung.py', kodePython)
        pyodide.runPython(`import hitung`)
        let pesanPython = pyodide.runPython('hitung.loaded()')

        await pyodide.loadPackage("pillow")

        response = await fetch('./python/compatibility.py')
        kodePython = await response.text()
        pyodide.FS.writeFile('/home/pyodide/compatibility.py', kodePython)
        pyodide.runPython(`import compatibility`)
        let cekwebp = pyodide.runPython('compatibility.cekWebp()')

        // const wheelUrl = new URL('./pymupdf-1.27.2.3.whl',document.baseURI).href
        // await pyodide.loadPackage(wheelUrl)
        // console.log('PyMuPDF berhasil dimuat')
        console.log(cekwebp)
        console.log(pyodide.version)
        console.log(pyodide.runPython("import sys; sys.version"))

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
        clearTimeout(timerLoading)
        clearTimeout(timerLoading2)
        pesanTambahan.classList.add('hidden')
        btnMulaiHitung.disabled = false
        setTimeout(() => {
            loadingPython.classList.add('hidden')
            pesanLoading.textContent = "Hitung"
        }, 3000)
    }
}
export function kirimHitung() {

    if (pilihanMode.value === "Pilih Mode Kalkulator" || pilihanSatuanWaktu.value === 'Pilih Jenis' || inputJumlahWaktu.value.length < 1) {
        return
    }

    contHasil.classList.remove('hidden')
    hasilHitung.innerHTML = pyodide.runPython(`hitung.hitung(variabelAngka='${inputJumlahWaktu.value}', operasi='${pilihanMode.value}', satuan='${pilihanSatuanWaktu.value}')`)

}