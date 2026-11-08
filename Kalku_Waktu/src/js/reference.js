// CUMA JS REFERENSI. TIDAK ADA LOGIKA YG DIEKSEKUSI DISiNI

const sekarang = new Date()

// Mengambil JAM saja (0 - 23)
const jam = sekarang.getHours()

// Mengambil MENIT saja (0 - 59)
const menit = sekarang.getMinutes()

// Mengambil DETIK saja (0 - 59)
const detik = sekarang.getSeconds()

// Mengambil HARI DENGAN ANGKA (1 - 31)
const tanggal = sekarang.getDate()

// Mengambil NAMA HARI (0 = Minggu, 1 = Senin, ..., 6 = Sabtu)
const indexHari = sekarang.getDay()
const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][indexHari]

// Mengambil BULAN (0 = Januari, 1 = Februari, ..., 11 = Desember)
// Bulan di JS dimulai dari angka 0!
const indexBulan = sekarang.getMonth() 
const bulanAngka = indexBulan + 1 // Ditambah 1 agar jadi 1 - 12
const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][indexBulan]

// Mengambil TAHUN (4 digit)
const tahun = sekarang.getFullYear()