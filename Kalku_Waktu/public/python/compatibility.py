from PIL import features

def cekWebp():
    return f"Pillow WebP: {features.check("webp")}"