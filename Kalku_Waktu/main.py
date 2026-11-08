from datetime import timedelta, datetime


kamus = {
    'minggu':'weeks',
    'hari': 'days',
    'jam': 'hours',
    'menit': 'minutes',
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

def halo():
    return "Python berhasil dipanggil!"

def hitung(sekarang=None, variabelAngka=0, operasi='tambah', satuan='days'):
    variabelAngka = int(variabelAngka)
    if sekarang is None:
        sekarang = datetime.now()

    if operasi=='tambah':
        hasil = sekarang + timedelta(**{kamus[satuan]:variabelAngka})
        return f"{hari[hasil.strftime('%A')]}, {hasil.strftime('%d')} {bulan[int(hasil.strftime('%m'))]} {hasil.strftime('%Y')} Jam {hasil.strftime('%H:%M')}"
    
    if operasi == 'kurang':
        hasil = sekarang - timedelta(**{kamus[satuan]:variabelAngka})
        return f"{hari[hasil.strftime('%A')]}, {hasil.strftime('%d')} {bulan[int(hasil.strftime('%m'))]} {hasil.strftime('%Y')} Jam {hasil.strftime('%H:%M')}"


