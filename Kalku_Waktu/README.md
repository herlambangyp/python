# Time Calculator

Kalkulator waktu berbasis Python untuk menghitung beberapa waktu kedepan atau kebelakang.

Misalnya, menghitung 473 jam dari sekarang akan menghasilkan tanggal dan waktu yang sesuai. Begitu pula dengan perhitungan 77 hari sebelumnya atau beberapa satuan waktu lainnya.

Proyek ini menyediakan dua antarmuka penggunaan:
- **CLI (Command Line Interface):** dijalankan melalui terminal menggunakan Python.
- **Web Interface:** dijalankan melalui browser menggunakan Pyodide, yang memungkinkan Python berjalan di lingkungan WebAssembly.

**Note:** Untuk panduan umum Python dan dokumentasi proyek lainnya, silakan kunjungi README utama:
https://github.com/herlambangyp/python

## Requirements

### CLI
- Python 3.10 atau lebih baru.
- Library Python yang tercantum dalam `requirements.txt`.

### Web Interface
- Node.js dan NPM.
- Koneksi internet untuk memuat Pyodide dan menginstal package yang diperlukan.

## Penggunaan melalui CLI

Jalankan program melalui terminal:

```bash
py main.py
```

Ikuti instruksi yang ditampilkan pada terminal.

## Penggunaan melalui Web

Masuk ke direktori proyek, kemudian instal dependencies:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Buka alamat lokal yang ditampilkan oleh Vite pada browser.

Untuk membuat versi production:

```bash
npm run build
```

Hasil build akan tersedia di direktori `dist`.

## Catatan

- Perhitungan menggunakan waktu lokal perangkat yang menjalankan program.
- Input saat ini hanya mendukung bilangan bulat.
- Nama hari dan bulan diterjemahkan hanya di bahasa Indonesia
- Web Interface menggunakan Pyodide untuk menjalankan Python melalui WebAssembly di browser.