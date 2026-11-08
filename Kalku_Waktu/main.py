from datetime import timedelta, datetime


kamus = {
    'minggu':'weeks',
    'hari': 'days',
    'jam': 'hours',
    'menit': 'minutes',
}

def halo():
    return "Python berhasil dipanggil!"

def hitung(sekarang=None, variabelAngka=0, operasi='tambah', satuan='days'):
    variabelAngka = int(variabelAngka)
    if sekarang is None:
        sekarang = datetime.now()

    if operasi=='tambah':
        return sekarang + timedelta(**{kamus[satuan]:variabelAngka})
    
    if operasi == 'kurang':
        return sekarang - timedelta(**{kamus[satuan]:variabelAngka})


