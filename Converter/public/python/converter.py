
import asyncio
from pathlib import Path

import pymupdf
from PIL import Image


async def convert_pdf(pdf_path, output_dir, dpi=150, quality=85, progress_callback=None):
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

            # Tentukan nama file
            if total > 1:
                filename = (
                    f"{pdf_path.stem}-HALAMAN_{index + 1}.webp"
                )
            else:
                filename = f"{pdf_path.stem}.webp"

            output_file = target_folder / filename

            # Simpan sebagai WebP
            image.save(
                output_file,
                "WEBP",
                quality=int(quality),
                method=6
            )

            image.close()

            results.append(str(output_file))

            # Kirim informasi progress ke JavaScript
            if progress_callback is not None:
                progress_callback(
                    index + 1,
                    total,
                    f"Halaman {index + 1} dari {total}"
                )

            # Beri kesempatan browser memperbarui UI
            await asyncio.sleep(0)

        return results

    finally:
        document.close()
