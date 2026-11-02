# PDF to WebP Converter

Script Python sederhana untuk mengonversi file PDF menjadi gambar WebP

## Fitur

- Mengonversi file PDF menjadi gambar WebP.
- Mendukung PDF dengan satu maupun banyak halaman.
- Mencari file PDF secara otomatis, termasuk di dalam subfolder.
- Mempertahankan struktur subfolder dari direktori input.
- Mengatur resolusi hasil konversi pada 144 DPI.
- Menggunakan WebP quality 90 dan method 6.
- Memberikan penamaan file otomatis berdasarkan jumlah halaman PDF.

## Persyaratan

- Python 3.10 atau lebih baru.
- Git (jika ingin melakukan clone repository).
- Koneksi internet untuk menginstal dependency pertama kali.

## Membuat Virtual Environment (opsional)

Buat virtual environment khusus untuk project ini:

```bash
py -m venv .venv
```

Aktifkan virtual environment:

**PowerShell:**

```powershell
.venv\Scripts\Activate.ps1
```

**CMD (Command Prompt):**

```cmd
.venv\Scripts\activate.bat
```

Atau sesuaikan dengan CLI yang digunakan

## Instal Dependency

```bash
python -m pip install -r requirements.txt
```

Dependency yang digunakan:

| Package | Fungsi |
|---|---|
| PyMuPDF | Membaca dan merender halaman PDF |
| Pillow | Memproses dan menyimpan gambar WebP |

## Input File PDF

**!!! Jangan menghapus folder input saat konversi berjalan !!!**
Masukkan file PDF atau folder berisi file pdf, ke dalam folder `Input pdf`.

Struktur folder berisi file pdf dapat dibuat seperti berikut:

```text
REPOSITORY/
│
├── Input pdf/
│   ├── document.pdf
│   │
│   ├── Folder A/
│   │   ├── document-1.pdf
│   │   └── document-2.pdf
│   │
│   └── Folder B/
│       └── document-3.pdf
│
├── pdf-webp.py
├── requirements.txt
└── README.md
```

## Menjalankan Script

```bash
python pdf-webp.py
```

Hasil konversi akan disimpan di dalam folder `Output webp`.

## Contoh Hasil Konversi

### PDF dengan satu halaman

File input:

```text
Invoice.pdf
```

Hasil:

```text
Invoice.webp
```

### PDF dengan beberapa halaman

File input:

```text
Document.pdf
```

Hasil:

```text
Document-HALAMAN_1.webp
Document-HALAMAN_2.webp
Document-HALAMAN_3.webp
```

### PDF di dalam subfolder

File input:

```text
Input pdf/
└── Folder A/
    └── Document.pdf
```

Hasil:

```text
Output webp/
└── Folder A/
    └── Document.webp
```

Struktur subfolder sumber akan dipertahankan pada direktori output.

## Pengaturan Konversi

Pengaturan konversi dapat diubah langsung melalui script Python.

| Parameter | Nilai | Keterangan |
|---|---|---|
| `dpi` | 144 | Resolusi rendering PDF |
| `alpha` | False | Tidak menggunakan transparansi |
| `quality` | 90 | Kualitas kompresi WebP |
| `method` | 6 | Tingkat optimasi encoding WebP |


## Catatan

- File `requirements.txt` digunakan untuk menginstal dependency yang dibutuhkan.
- Folder `Input pdf` merupakan lokasi file PDF yang akan diproses.

## Dokumentasi Dependency

- [PyMuPDF Documentation](https://pymupdf.readthedocs.io/en/latest/)
- [Pillow Documentation](https://pillow.readthedocs.io/en/stable/)