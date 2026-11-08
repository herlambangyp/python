let kamus = {
    'tambah': 'kedepan',
    'kurang': 'sebelumnya'
}

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