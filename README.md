# HYP Python SRC
Repo ini digunakan untuk menyimpan sorce code python yang aku buat. Aku tulis beberapa panduan python umum, untuk membantu menggunakan source code pythonku 

## Membuat Virtual Environment (opsional)

Buat virtual environment khusus untuk tiap project, agar tidak bentrok dengan dependensi global python. Jalankan perintah ini:

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

Atau sesuaikan dengan CLI yang digunakan. Cek di direktori `.venv/Scripts/` cari file activate yang sesuai

## Instal Package Project
Source code ku kebanyakan memakai library dan package.
Jadi jalankan ini sebelum menggunakan, agar tidak terjadi reference error

Jalankan:
```bash
py -m pip install -r requirements.txt
```
Beberapa package mungkin akan memerlukan update

## Tindakan akhir
1. (opsional) Jalankan ini saat selsesai menulis code. Perintah ini untuk mendokumentasikan package python
```bash
 py -m pip freeze > requirements.txt
```
