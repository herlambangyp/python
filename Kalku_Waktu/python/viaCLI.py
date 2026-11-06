import questionary # Doc: https://questionary.readthedocs.io/en/stable/index.html
from datetime import datetime, timedelta
from .dictionary import hari, bulan

def pakeCLI():
    sekarang = datetime.now()
    questionary.print(f"\n---- Waktu Sekarang: {sekarang.strftime('%H:%M')}, {hari[sekarang.strftime('%A')]}, {sekarang.strftime('%d')} {bulan[int(sekarang.strftime('%m'))]} {sekarang.strftime('%Y')}\n", style="bold")

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
            return pakeCLI()
        
    waktuInput = questionary.text(f"Ingin di {operasi} berapa {tipe} dari sekarang?",validate=lambda value: value.isdigit() or "Hanya menghitung bilangan bulat untuk saat ini").ask()

        
    return operasi, tipe, waktuInput, sekarang

def tulisKeCLI(ParamtTipe, ParamOperasi, ParamDataWaktu, hasil):
    if ParamtTipe == "Hari":
        questionary.print(f"\nHasil {ParamOperasi} {ParamDataWaktu} {ParamtTipe} dari sekarang: \n{hari[hasil.strftime('%A')]}, {hasil.strftime('%d')} {bulan[int(hasil.strftime('%m'))]} {hasil.strftime('%Y')}", style="fg:ansigreen")
    else:
        questionary.print(f"\nHasil {ParamOperasi} {ParamDataWaktu} {ParamtTipe} dari sekarang: \n{hasil.strftime('%H:%M')} {hari[hasil.strftime('%A')]}, {hasil.strftime('%d')} {bulan[int(hasil.strftime('%m'))]} {hasil.strftime('%Y')}", style="fg:ansigreen")
