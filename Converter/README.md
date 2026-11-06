# PDF to WebP Converter

Script Python sederhana untuk mengonversi file PDF menjadi gambar WebP

## Requirements

- Python 3.10 atau lebih baru.
- Koneksi internet untuk menginstal library dan package pertama kali.

## Penggunaan

**PENTING! Jangan menghapus folder `input` saat script berjalan**

Masukkan file PDF atau folder berisi file pdf, ke dalam folder `input`.
Struktur folder berisi file pdf dapat dibuat seperti berikut:

```text
REPOSITORY/
│
├── input/
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

### Menjalankan Script

```bash
py pdf-webp.py
```

Hasil konversi akan disimpan di dalam folder `output`.

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