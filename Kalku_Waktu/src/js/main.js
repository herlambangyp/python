let kamus = {
    'tambah': 'kedepan',
    'kurang': 'sebelumnya'
},
sekarang = new Date(),
tahun = sekarang.getFullYear(),
indexHari = sekarang.getDay(),
namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][indexHari],
indexBulan = sekarang.getMonth(),
namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][indexBulan]

tanggalSekarang.textContent = `${namaHari}, ${sekarang.getDate()} ${namaBulan} ${sekarang.getFullYear()}`
jamSekarang.textContent = sekarang.toLocaleTimeString('id-ID', {hour: '2-digit',minute: '2-digit',hour12: false})

function pesanDitombol() {
    if (inputJumlahWaktu.value.length > 0) {
        btnMulaiHitung.textContent = `Hitung ${inputJumlahWaktu.value} ${pilihanSatuanWaktu.value} ${kamus[pilihanMode.value]}`
    }
    else {
        btnMulaiHitung.textContent = 'Hitung'
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

function kirimHitung(){

    if (pilihanMode.value === "Pilih Mode Kalkulator" || pilihanSatuanWaktu.value === 'Pilih Jenis' || inputJumlahWaktu.value.length < 1){
        return
    }
    // variabel pyodide diambil oleh interpreter.js
    hasilHitung.innerHTML = pyodide.runPython(`main.hitung(variabelAngka='${inputJumlahWaktu.value}', operasi='${pilihanMode.value}', satuan='${pilihanSatuanWaktu.value}')`)
    
}