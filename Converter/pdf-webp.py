import pymupdf # Doc: https://pymupdf.readthedocs.io/en/latest/installation.html
from PIL import Image # Doc: https://pillow.readthedocs.io/en/stable/installation.html
import questionary # Doc: https://questionary.readthedocs.io/en/stable/index.html
from pathlib import Path

questionary.print("\n---- Menginisialisasi script converter pdf ke webp ---- \n", style="bold fg:ansigreen")

BASE_DIR = Path(__file__).resolve().parent
input_folder = BASE_DIR / "Input pdf"
output_folder = BASE_DIR / "Output webp"

def tanyakan_dulu():
    global output_format, dpi, kualitas

    output_format = questionary.select(
        "Pilih format output:", 
        choices=["WebP","JPEG","PNG"], 
        default="WebP", 
        instruction="(Gunakan tombol panah untuk memilih, Enter untuk konfirmasi)"
        ).ask()
    
    dpi = questionary.text(
        "Masukkan DPI: ",
        default="144",
        validate=lambda value: value.isdigit() and 72 <= int(value) or "DPI harus berupa angka dan harus lebih dari 72"
        ).ask()
    
    dpi = int(dpi)

    kualitas = questionary.text(
        "Kualitas Gambar (1-100): ",
        instruction="(Semakin besar kualitas, semakin besar ukuran file)",
        default="90",
        validate=lambda value: value.isdigit() and 1 <= int(value) <= 100 or "Kualitas harus direntang 1 sampai 100",
    ).ask()

    questionary.print(f"\nFormat yang dipilih: {output_format}", style="fg:ansigreen")
    questionary.print(f"DPI: {dpi}", style="fg:ansigreen")
    questionary.print(f"Kualitas Gambar: {kualitas}\n", style="fg:ansigreen")

    semuaBenar = questionary.confirm( 
        "Apakah semua sudah benar?", 
        default=True,
        ).ask()
    
    if not semuaBenar:
        lalu = questionary.select("Ada yang salah? Lalu?", choices=["Ulangi input data", "Keluar dari script"]).ask()

        if lalu == "Keluar dari script":
            questionary.print("Keluar dari script...", style="bold fg:ansired")
            exit()

        questionary.print("\nMengulang Script...\n", style="bold fg:ansiyellow")
        return tanyakan_dulu()
    
    else:
        questionary.print("\nMenjalankan Script Converter...\n", style="bold fg:ansigreen")

tanyakan_dulu()

output_folder.mkdir(exist_ok=True)

for pdf_file in input_folder.rglob("*.pdf"):
    relative_folder = pdf_file.parent.relative_to(input_folder)
    target_folder = output_folder / relative_folder
    target_folder.mkdir(parents=True, exist_ok=True)
    document = pymupdf.open(pdf_file)

    try:
        for index, page in enumerate(document):
            pix = page.get_pixmap(
                dpi=dpi, 
                alpha=False,
                )

            image = Image.frombytes(
                "RGB",
                (pix.width, pix.height),
                pix.samples
            )

            if len(document) > 1:
                filename = f"{pdf_file.stem}-HALAMAN_{index + 1}.{output_format.lower()}"
            else:
                filename = f"{pdf_file.stem}.{output_format.lower()}"

            output_file = target_folder / filename

            image.save(
                output_file,
                output_format.upper(),
                quality=kualitas,
                method=6
            )

            questionary.print(f"\nSedang Convert: {output_file} \n", style="fg:ansiblue")
            pass

    except Exception as e:
        questionary.print(f"Ada Error saat convert {pdf_file} \n Error: {e}", style="bold fg:ansired")

    finally:
        document.close()

questionary.print("---- Convert Selesai ----", style="bold fg:ansigreen")