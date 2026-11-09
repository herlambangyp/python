import { kirimHitung, initPython } from "./interpreter"

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
    contHasil = document.getElementById('contHasil')


// Variabel Global
let kamus = {
    'tambah': 'kedepan',
    'kurang': 'sebelumnya'
},
    sekarang = new Date(),
    indexHari = sekarang.getDay(),
    namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][indexHari],
    indexBulan = sekarang.getMonth(),
    namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][indexBulan],
    dimuat = false
tanggalSekarang.textContent = `${namaHari}, ${sekarang.getDate()} ${namaBulan} ${sekarang.getFullYear()}`
jamSekarang.textContent = sekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })

// event Listener
inputJumlahWaktu.oninput = o => {
    pesanDitombol()
    contHasil.classList.add('hidden')
    
}
btnMulaiHitung.onclick = o => {
    kirimHitung()
}
function pesanDitombol() {
    if (pilihanMode.value === "Pilih Mode Kalkulator" || pilihanSatuanWaktu.value === 'Pilih Jenis' || inputJumlahWaktu.value.length < 1) {
        return
    }
    if(dimuat == false){
        return
    }
    loadingPython.classList.add('hidden')
    if (inputJumlahWaktu.value.length > 0) {
        pesanLoading.textContent = `Hitung ${inputJumlahWaktu.value} ${pilihanSatuanWaktu.value} ${kamus[pilihanMode.value]}`
    }
    else {
        pesanLoading.textContent = 'Hitung'
    }
}

pilihanMode.onchange = o => {
    pesanDitombol()
    inputAngka.classList.add('hidden')
    inputJenis.classList.add('hidden')
    pilihanSatuanWaktu.classList.add('hidden')

    switch (pilihanMode.value) {
        case 'kurang':
        case "tambah":
            inputJenis.classList.remove("hidden")
            pilihanSatuanWaktu.classList.remove('hidden')
            if (jenisDiText.textContent !== '') inputAngka.classList.remove("hidden")
            pilihanSatuanWaktu.onchange = o => {
                pesanDitombol()
                inputAngka.classList.remove("hidden")
                jenisDiText.textContent = `Berapa ${pilihanSatuanWaktu.value}?`
            }
            break;
    }
}
async function cekPython(){
await initPython()
dimuat = true
}
cekPython()
