from datetime import timedelta, datetime


kamus = {
    'bulan':'months',
    'minggu':'weeks',
    'hari': 'days',
    'jam': 'hours',
    'menit': 'minutes',
}

def halo():
    return "Python berhasil dipanggil!"

def hitung(sekarang=datetime().now, variabelAngka=0, operasi='tambah', satuan='days'):

    if operasi=='tambah':
        return sekarang + timedelta(**{kamus[satuan]:variabelAngka})
    
    if operasi == 'kurang':
        return sekarang + timedelta(**{satuan:variabelAngka})


