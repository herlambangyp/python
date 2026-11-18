# Mini server untuk pengembangan front-end

aku buat script ini untuk membuat server lokal berbasis Python dengan arstitektur sangat spesifik meniru **GitHub Pages**.

Tersedia 2 aplikasi atau script:
- Mentahan skrip Python `main.py` (jika ingin tahu apa saja yang dilakukan aplikasi)
- Aplikasi jadi `HYP_miniServer.exe` (bisa dijalankan langsung di komputer Windows)

## Fitur

- **Letakkan dimana saja, dan jadi server.** Letakkan `HYP_miniServer.exe` dimanapun. Maka saat di run, direktori itu akan dijadikan "hosting server"
- **Hapus Cache Otomatis.** Saat halaman di-*refresh*, seluruh cache html, js, css akan dihapus dan dimuat ulang dari 0
- **Browser CORS Friendly.** Browser jadi "percata" dan tidak akan menolak request fetch js atau node yang diminta dari server
- **Preview di Perangkat lain di jaringan LAN/Wi-Fi yg sama.** Izinkan firewall agar bisa diakses perangkat lain

## Penggunaan (`main.py`)
Build dulu dengan perintah ini
```bash
py -m PyInstaller --onefile --console --icon="assets/icon/lg.png" --add-data "assets/html;assets/html" --add-data "assets/icon;assets/icon" --copy-metadata questionary --copy-metadata prompt_toolkit --name "HYP_miniServer" main.py
```
Lalu ikuti cara penggunaan aplikasi jadi

## Penggunaan (Aplikasi jadi)
Jalankan `HYP_miniServer.exe` di lokasi dimana index.html berada, atau di direktori/folder manapun server ingin dibuat.
Tidak harus ada index.html, aplikasi akan secara otomatis menyediakan "file explorer" simpel untuk navigasi

## Note:

**SERVER INI DIBUAT SANGAT SPESIFIK UNTUK ENVIRONMENT FRONT END LOKAL**

- **Tidak Mendukung:** 
Eksekusi *server-side* seperti *PHP*, *Node.js backend* (Express, SSR), maupun koneksi langsung ke *database*. Bukan pengganti `npm run dev` ataupun `npm run Preview`

- **Mendukung:** HTML, CSS, Vanilla JavaScript, aset media (gambar, font, JSON), hasil *build* (*static bundle*) framework seperti React (Vite), Vue, atau Svelte

* **JANGAN DIGUNAKAN SEBAGAI GERBANG *PORT FORWARDING* (HOSTING SERVER) KE JARINGAN PUBLIK**. Di aplikasi ini, Browser *litteraly* diminta untuk *chill* atau izinkan CORS antar web/jaringan. Jika dieskpos atau hosting ke publik, maka komputer server (komputer yg menjalankan mini server ini) bisa menerima ribuan request berat dari internet. Untuk kasus sesama wifi, masih aman karena kita bisa tahu siapa saja pengguna wifi, dan siapa yang meminta request. Kalo ada yang request gede, tinggal gebukin ae di dunia nyata


## Terkait mentahan python
- **(Optional)** Untuk panduan general python dan menghindari eror code melalui CLI, sebaiknya cek halaman utama (README.md):
https://github.com/herlambangyp/python
- Sebaiknya tidak langsung menjalanakan `main.py`. Aku menyarankan untuk build dengan pyinstaller dulu, lalu jalankan sesuai tata cara penggunaan diatas