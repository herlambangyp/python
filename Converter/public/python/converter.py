
import asyncio
from pathlib import Path

import pymupdf
from PIL import Image

def loaded():
    return "Converter Siap Digunakan"

async def convert_pdf(pdf_path, output_dir, dpi=150, quality=85, progress_callback=None, format_output='webp'):
    pdf_path = Path(pdf_path)
    output_dir = Path(output_dir)

    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF tidak ditemukan: {pdf_path}")

    output_dir.mkdir(parents=True, exist_ok=True)

    document = pymupdf.open(str(pdf_path))
    results = []

    try:
        total = len(document)

        if total == 0:
            raise ValueError("PDF tidak memiliki halaman.")

        # PDF multi-halaman mendapatkan folder tersendiri
        if total > 1:
            target_folder = output_dir / pdf_path.stem.strip()
            target_folder.mkdir(parents=True, exist_ok=True)
        else:
            target_folder = output_dir

        for index, page in enumerate(document):
            # Render halaman PDF
            pix = page.get_pixmap(
                dpi=int(dpi),
                alpha=False
            )

            # Ubah hasil render menjadi gambar Pillow
            image = Image.frombytes(
                "RGB",
                (pix.width, pix.height),
                pix.samples
            )

            format_output = format_output.lower()

            pillow_formats = {
                'webp': 'webp',
                'png': 'png',
                'jpg': 'jpeg', 
                'jpeg': 'jpeg'
            }

            if format_output not in pillow_formats:
                raise ValueError(f"Format tidak didukung: {format_output}")
            

            if total > 1:
                filename = f"{pdf_path.stem}-HALAMAN_{index + 1}.{format_output}"
            else:
                filename = f"{pdf_path.stem}.{format_output}"

            output_file = target_folder / filename

            save_options = {
                'webp': {'quality': int(quality),'method': 6},
                'jpeg': {'quality': int(quality),'optimize': True},
                'jpg': {'quality': int(quality),'optimize': True},
                'png': {'optimize': True},

            }

            image.save(
                output_file,
                pillow_formats[format_output],
                **save_options[format_output]
            )

            image.close()

            results.append(str(output_file))

            # informasi progress yang diterima js
            if progress_callback is not None:
                progress_callback(
                    index + 1,
                    total,
                    f"Halaman {index + 1} dari {total}"
                )

            # jeda Ui
            await asyncio.sleep(0)

        return results

    finally:
        document.close()
