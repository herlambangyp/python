from datetime import timedelta, datetime
from "public/python/hitung.py" import hitung

kamus = {
    'minggu':'weeks',
    'hari': 'days',
    'jam': 'hours',
    'menit': 'minutes',
    'Beberapa Waktu Kedepan' : 'tambah',
    'Beberapa Waktu Kebelakang' : 'kurang',
    'tambah': 'kedepan',
    'kurang': 'sebelumnya'
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
sekarang = datetime.now()

def tanyaUtama():
    import questionary
    
    questionary.print(f"\n---- Waktu Sekarang: {hari[sekarang.strftime('%A')]}, {sekarang.strftime('%d')} {bulan[int(sekarang.strftime('%m'))]} {sekarang.strftime('%Y')} Jam {sekarang.strftime('%H:%M')} ----\n", style="bold")

    global operasi, tipe, konfirmasi, waktuInput, dataWaktu
    operasi = questionary.select(
        "Pilih operasi hitung:",
        choices=["Beberapa Waktu Kedepan", "Beberapa Waktu Kebelakang"],
        default="Beberapa Waktu Kedepan",).ask()

    tipe = questionary.select(
        "Pilih satuan waktu:",
        choices=["Minggu", "Hari", "Jam", "Menit"],
        default="Hari",).ask()

    konfirmasi = questionary.confirm(f"Akan menghitung beberapa {tipe.lower()} {kamus[kamus[operasi]]}, benar?").ask()
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
    else:
        waktuInput = questionary.text(f"Ingin di hitung berapa {tipe.lower()} {kamus[kamus[operasi]]}?",validate=lambda value: value.isdigit() or "Hanya menghitung bilangan bulat untuk saat ini").ask()
        questionary.print(f"\nHasil hitungan {waktuInput} {tipe.lower()} {kamus[kamus[operasi]]}:\n{hitung(variabelAngka=waktuInput, operasi=kamus[operasi], satuan=tipe.lower())}", style="fg:ansigreen")
        questionary.print("\n---- Script Selesai ----", style="bold")
if __name__ == "__main__":
    tanyaUtama()
