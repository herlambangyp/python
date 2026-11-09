from datetime import timedelta, datetime

kamus = {
    'minggu':'weeks',
    'hari': 'days',
    'jam': 'hours',
    'menit': 'minutes',
    'detik': 'seconds',
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

def loaded():
    return "Berhasil Load Python"

def hitung(anchorWaktu=sekarang, variabelAngka=0, operasi='tambah', satuan='days'):
    variabelAngka = int(variabelAngka)

    if operasi=='tambah':
        hasil = anchorWaktu + timedelta(**{kamus[satuan]:variabelAngka})
        return f"{hari[hasil.strftime('%A')]}, {hasil.strftime('%d')} {bulan[int(hasil.strftime('%m'))]} {hasil.strftime('%Y')} Jam {hasil.strftime('%H:%M')}"
    
    if operasi == 'kurang':
        hasil = anchorWaktu - timedelta(**{kamus[satuan]:variabelAngka})
        return f"{hari[hasil.strftime('%A')]}, {hasil.strftime('%d')} {bulan[int(hasil.strftime('%m'))]} {hasil.strftime('%Y')} Jam {hasil.strftime('%H:%M')}"
