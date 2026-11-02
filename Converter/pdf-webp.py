import pymupdf # Doc: https://pymupdf.readthedocs.io/en/latest/installation.html
from PIL import Image # Doc: https://pillow.readthedocs.io/en/stable/installation.html
from pathlib import Path

print("---- Menginisialisasi script converter pdf ke webp ---- \n")
BASE_DIR = Path(__file__).resolve().parent
input_folder = BASE_DIR / "Input pdf"
output_folder = BASE_DIR / "Output webp"

output_folder.mkdir(exist_ok=True)

for pdf_file in input_folder.rglob("*.pdf"):
    relative_folder = pdf_file.parent.relative_to(input_folder)
    target_folder = output_folder / relative_folder
    target_folder.mkdir(parents=True, exist_ok=True)
    document = pymupdf.open(pdf_file)

    try:
        for index, page in enumerate(document):
            pix = page.get_pixmap(
                dpi=144, 
                alpha=False,
                )

            image = Image.frombytes(
                "RGB",
                (pix.width, pix.height),
                pix.samples
            )

            if len(document) > 1:
                filename = f"{pdf_file.stem}-HALAMAN_{index + 1}.webp"
            else:
                filename = f"{pdf_file.stem}.webp"

            output_file = target_folder / filename

            image.save(
                output_file,
                "WEBP",
                quality=90,
                method=6
            )

            print(f"Sedang Convert: {output_file} \n")
            pass

    except Exception as e:
        print(f"Ada Error saat convert {pdf_file} \n Error: {e}")        

    finally:
        document.close()

print("---- Convert Selesai ----")