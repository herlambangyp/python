
import os
import json

# Lokasi penyimpanan konfigurasi
APP_DATA = os.getenv("APPDATA")

CONFIG_DIR = os.path.join(APP_DATA, "HYP_miniServer")
CONFIG_FILE = os.path.join(CONFIG_DIR, "settings.json")

# Konfigurasi default
DEFAULT_SETTINGS = {
    "lang" : "en",
    "port": 8000,
    "dir_listing": True,
    "serverAkses": False,
    "no_cache": True,
    "CORS": "*"
}

# Konfigurasi yang sedang digunakan
SETTINGS = {}


def loadSettings():
    """Membaca konfigurasi dari settings.json."""

    os.makedirs(CONFIG_DIR, exist_ok=True)

    if not os.path.exists(CONFIG_FILE):
        saveSettings(DEFAULT_SETTINGS)

    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)

        # Gabungkan dengan default agar konfigurasi lama
        # tetap kompatibel jika nanti ada pengaturan baru.
        SETTINGS.clear()
        SETTINGS.update(DEFAULT_SETTINGS)
        SETTINGS.update(data)

    except (json.JSONDecodeError, OSError):
        SETTINGS.clear()
        SETTINGS.update(DEFAULT_SETTINGS)

        saveSettings(SETTINGS)

    return SETTINGS


def saveSettings(data):
    """Menyimpan dan memperbarui konfigurasi."""

    SETTINGS.update(data)

    os.makedirs(CONFIG_DIR, exist_ok=True)

    with open(CONFIG_FILE, "w", encoding="utf-8") as file:
        json.dump(SETTINGS, file, indent=4)

def resetSettings():
    """Mengembalikan konfigurasi ke nilai default."""

    SETTINGS.clear()
    SETTINGS.update(DEFAULT_SETTINGS)

    saveSettings(SETTINGS)

    return SETTINGS
