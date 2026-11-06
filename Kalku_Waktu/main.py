import questionary # Doc: https://questionary.readthedocs.io/en/stable/index.html
from datetime import datetime, timedelta

sekarang = datetime.now()
# Dictionary untuk mapping
satuan = {
    'Hari': 'days',
    'Jam': 'hours',
    'Menit': 'minutes',
}
hari = {
    "Monday": "Senin",
    "Tuesday": "Selasa",
    "Wednesday": "Rabu",
    "Thursday": "Kamis",
    "Friday": "Jumat",
    "Saturday": "Sabtu",
    "Sunday": "Minggu"
}
bulan = {
    1: "Januari",
    2: "Februari",
    3: "Maret",
    4: "April",
    5: "Mei",
    6: "Juni",
    7: "Juli",
    8: "Agustus",
    9: "September",
    10: "Oktober",
    11: "November",
    12: "Desember"
}
questionary.print(f"\n---- Waktu Sekarang: {sekarang.strftime('%H:%M')}, {hari[sekarang.strftime('%A')]}, {sekarang.strftime('%d')} {bulan[int(sekarang.strftime('%m'))]} {sekarang.strftime('%Y')}\n", style="bold")



def tanyaUtama():
    global operasi, tipe, konfirmasi, waktuInput, dataWaktu
    operasi = questionary.select(
        "Pilih operasi waktu:",
        choices=["tambah waktu", "kurangi waktu"],
        default="tambah waktu",).ask()

    tipe = questionary.select(
        "Pilih satuan waktu:",
        choices=["Hari", "Jam", "Menit"],
        default="Jam",).ask()

    konfirmasi = questionary.confirm(f"Akan menghitung {operasi} beberapa {tipe} dari sekarang, benar?").ask()
    if not konfirmasi:
        tindakan = questionary.select(
        "Apa yg ingin dilakukan?",
        choices=["Ulangi input data", "Keluar dari script"],
        default="Ulangi input data",).ask()
        if tindakan == "Keluar dari script":
            questionary.print("Keluar dari script...", style="bold fg:ansired")
            exit()
        else:
            return tanyaUtama()
tanyaUtama()

waktuInput = questionary.text(f"Ingin di {operasi} berapa {tipe} dari sekarang?",validate=lambda value: value.isdigit() or "Hanya menghitung bilangan bulat untuk saat ini").ask()
dataWaktu = int(waktuInput)

if operasi == "tambah waktu":
    hasil = sekarang + timedelta(**{satuan[tipe]: dataWaktu})
else:
    hasil = sekarang - timedelta(**{satuan[tipe]: dataWaktu})

if tipe == "Hari":
    questionary.print(f"\nHasil {operasi} {dataWaktu} {tipe} dari sekarang: \n{hari[hasil.strftime('%A')]}, {hasil.strftime('%d')} {bulan[int(hasil.strftime('%m'))]} {hasil.strftime('%Y')}", style="fg:ansigreen")
else:
    questionary.print(f"\nHasil {operasi} {dataWaktu} {tipe} dari sekarang: \n{hasil.strftime('%H:%M')} {hari[hasil.strftime('%A')]}, {hasil.strftime('%d')} {bulan[int(hasil.strftime('%m'))]} {hasil.strftime('%Y')}", style="fg:ansigreen")