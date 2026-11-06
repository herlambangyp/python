from datetime import datetime, timedelta
# from python.viaCLI import pakeCLI, tulisKeCLI
from python.dictionary import satuan, hari, bulan

# if 1==1:
#     operasi, tipe, waktuInput, sekarang = pakeCLI()

# dataWaktu = int(waktuInput)

# if operasi == "tambah waktu":
#     hasil = sekarang + timedelta(**{satuan[tipe]: dataWaktu})
# else:
#     hasil = sekarang - timedelta(**{satuan[tipe]: dataWaktu})
    
def hitung_waktu(operasi, tipe, jumlah):
    sekarang = datetime.now()

    if operasi == "tambah waktu":
        hasil = sekarang + timedelta(**{satuan[tipe]: jumlah})
    else:
        hasil = sekarang - timedelta(**{satuan[tipe]: jumlah})

    if tipe == "Hari":
        waktu = ""
    else:
        waktu = hasil.strftime("%H:%M") + " "

    return (
        f"{waktu}"
        f"{hari[hasil.strftime('%A')]}, "
        f"{hasil.strftime('%d')} "
        f"{bulan[hasil.month]} "
        f"{hasil.year}"
    )

# if 1==1:
#     tulisKeCLI(tipe, operasi, dataWaktu, hasil)
