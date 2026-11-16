# Mini server untuk pengembangan front-end

aku buat script ini untuk membuat server lokal berbasis Python dengan arstitektur sangat spesifik meniru **GitHub Pages**.

Tersedia 2 aplikasi atau script:
- Mentahan skrip Python `main.py` (jika ingin tahu apa saja yang dilakukan aplikasi)
- Aplikasi jadi `HYP_miniServer.exe` (bisa dijalankan langsung di komputer Windows)

## Fitur

- **Hapus Cache Otomatis:** saat halaman di-*refresh*, seluruh cache html, js, css akan dihapus dan dimuat ulang dari 0
- **Browser CORS Friendly:** Browser tidak akan menolak request fetch js atau node yang diminta server
- **Preview di Perangkat lain di jaringan LAN/Wi-Fi yg sama** Izinkan firewall agar bisa diakses perangkat lain

## Penggunaan (Aplikasi jadi)
Jalankan `HYP_miniServer.exe` di lokasi dimana index.html berada, atau di direktori manapun server ingin dibuat.
Tidak harus ada index.html, aplikasi akan secara otomatis menyediakan "file explorer" simpel untuk navigasi

## Note:

**SERVER INI DIBUAT SANGAT SPESIFIK UNTUK ENVIRONMENT FRONT END**

- **Tidak Mendukung:** 
Eksekusi *server-side* seperti *PHP*, *Node.js backend* (Express, SSR), maupun koneksi langsung ke *database*. Bukan pengganti `npm run dev` ataupun `npm run Preview`

- **Mendukung:** HTML, CSS, Vanilla JavaScript, aset media (gambar, font, JSON), hasil *build* (*static bundle*) framework seperti React (Vite), Vue, atau Svelte

* **JANGAN DIGUNAKAN SEBAGAI GERBANG *PORT FORWARDING* SERVER KE JARINGAN PUBLIK**. Di aplikasi ini, Browser *litteraly* diminta untuk *chill* atau izinkan CORS antar web/jaringan. Jika diekspos ke publik, maka komputer server (komputer yg menjalankan aplikasi server ini) bisa menerima ribuan request berat dari internet (jika penyerang tau link yang di forward). Untuk kasus sesama wifi, masih aman karena kita bisa tahu siapa saja pengguna wifi, dan siapa yang meminta request. Kalo ada yang request gede, tinggal gebukin ae di dunia nyata


## Terkait mentahan python
- **(Optional)** Untuk panduan general python dan menghindari eror code melalui CLI, sebaiknya cek halaman utama (README.md):
https://github.com/herlambangyp/python
- Sebaiknya tidak langsung menjalanakan `main.py`. Aku menyarankan untuk build dengan pyinstaller dulu, lalu jalankan sesuai tata cara penggunaan diatas