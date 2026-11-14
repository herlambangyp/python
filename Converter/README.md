# PDF to WebP Converter

Script Python sederhana untuk mengonversi file PDF

Proyek ini menyediakan dua antarmuka penggunaan:
- **CLI (Command Line Interface):** dijalankan melalui terminal menggunakan Python.
- **Web Interface:** dijalankan melalui browser menggunakan Pyodide, yang memungkinkan Python berjalan di lingkungan WebAssembly.

## Requirements

### CLI
- Python 3.10 atau lebih baru.
- Koneksi internet untuk menginstal Library Python yang tercantum dalam `requirements.txt`.

### Web Interface
- Node.js dan NPM.
- Koneksi internet untuk menginstal node module.

## Penggunaan melalui Web
### Melalui online

Akses Link Ini : https://herlambangyp.github.io/convert/

### Melalui lokal
Download dan masuk folder Converter/, kemudian instal dependencies:

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

## Penggunaan CLI
Masuk ke direktori utama repo ini, yaitu di `Converter/`.

**(Optional)** Kamu bisa download yang diperlukan saja:
```text
─ public/python/converter.py
─ input (atau bisa buat sendiri folder input)
─ main.py
─ requirements.txt
```
Masukkan file PDF atau folder berisi file pdf, ke dalam folder `input`.
Struktur folder `input` bisa berisi seperti ini:

```text
Converter/
│
└── input/
        ├── document.pdf
        │
        ├── Folder A/
        │   ├── document-1.pdf
        │   └── document-2.pdf
        │
        └── Folder B/
            └── document-3.pdf

```

### Menjalankan Script

**(Optional)** Untuk panduan general python dan menghindari eror code melalui CLI, sebaiknya cek halaman utama (README.md):
https://github.com/herlambangyp/python

Jalankan program melalui terminal:

```bash
py main.py
```

Ikuti instruksi yang ditampilkan pada terminal. Hasil konversi akan disimpan di dalam folder `output`.

### Contoh Hasil Konversi

#### PDF dengan satu halaman

File input:

```text
Invoice.pdf
```

Hasil:

```text
Invoice.webp
```

#### PDF dengan beberapa halaman

File input:

```text
Document(halaman Banyak).pdf
```

Hasil:

```text
outpot/
└── Document/
    ├── Document(halaman Banyak)-HALAMAN_1.webp
    ├── Document(halaman Banyak)-HALAMAN_2.webp
    └── Document(halaman Banyak)-HALAMAN_3.webp
```

#### PDF di dalam subfolder

File input:

```text
input/
└── Folder A/
    └── Document.pdf
```

Hasil:

```text
output/
└── Folder A/
    └── Document.webp
```

Struktur subfolder sumber akan dipertahankan pada direktori output.