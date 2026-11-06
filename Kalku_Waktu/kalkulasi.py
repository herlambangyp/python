from datetime import datetime, timedelta
from python.dictionary import satuan

def hitung_waktu(operasi, tipe, jumlah):
    sekarang = datetime.now()

    if operasi == "tambah waktu":
        hasil = sekarang + timedelta(**{satuan[tipe]: jumlah})
    else:
        hasil = sekarang - timedelta(**{satuan[tipe]: jumlah})

    return hasil

def format_waktu(hasil, tipe):
    from python.dictionary import hari, bulan

    waktu = ""

    if tipe != "Hari":
        waktu = hasil.strftime("%H:%M") + " "

    return (
        f"{waktu}"
        f"{hari[hasil.strftime('%A')]}, "
        f"{hasil.strftime('%d')} "
        f"{bulan[hasil.month]} "
        f"{hasil.year}"
    )