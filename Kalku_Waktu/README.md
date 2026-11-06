# Time Calculator CLI

Program kalkulator waktu sederhana berbasis Command Line Interface (CLI) yang dibuat menggunakan Python.
Program ini memungkinkan pengguna menghitung waktu di masa depan atau masa lalu berdasarkan waktu saat ini, dengan menambahkan atau mengurangi sejumlah hari, jam, maupun menit.

## Requirements

- Python 3.10 atau lebih baru.
- Koneksi internet untuk menginstal library dan package pertama kali.

## Penggunaan

Jalankan program menggunakan perintah:

```bash
python main.py
```

Ikuti instruksi yang ditampilkan pada terminal:

1. Pilih operasi penambahan atau pengurangan waktu.
2. Pilih satuan waktu yang ingin digunakan.
3. Masukkan jumlah waktu.
4. Program akan menampilkan hasil perhitungan berdasarkan waktu saat ini.

## Catatan

- Perhitungan menggunakan waktu lokal pada perangkat yang menjalankan program.
- Input saat ini hanya mendukung bilangan bulat.
- Nama hari dan bulan diterjemahkan menggunakan dictionary agar tetap menggunakan bahasa Indonesia tanpa bergantung pada pengaturan locale sistem.
