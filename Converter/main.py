import questionary # Doc: https://questionary.readthedocs.io/en/stable/index.html
from pathlib import Path
from datetime import datetime
import asyncio
from public.python.converter import convert_pdf


fileLog = Path('log.txt')
with fileLog.open('w', encoding='utf-8') as file:
    file.write(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] ---- Script dimulai ----\n")

questionary.print("\n---- Menginisialisasi script converter pdf ke webp ---- \n", style="bold fg:ansigreen")
input_folder = Path("input")
output_folder = Path("output")
jumlahPdf = len(list(input_folder.rglob('*.pdf')))

def tulisLog(message, tipe="info", heading="", tulisKeCLI=True):
    with fileLog.open("a", encoding="utf-8") as file:
        file.write(f"{heading}[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {message}\n")
    if tulisKeCLI:
        pesanCLI(message, tipe, heading)

def pesanCLI(message, tipe="info", heading=""):
    tipePesan = {
        "info": "fg:ansiblue",
        "error": "fg:ansired",
        "success": "fg:ansigreen"
    }
    questionary.print(f"{heading}{message}", style=tipePesan[tipe])

def tanyakan_dulu():
    global output_format, dpi, kualitas

    pilihan = {
        'Ya': True,
        'Tidak': False
    }
    output_format = questionary.select(
        "Pilih format output:", 
        choices=["WebP","JPEG","PNG"], 
        default="WebP", 
        instruction="(Gunakan tombol panah untuk memilih, Enter untuk konfirmasi)"
        ).ask()
    
    dpi = questionary.text(
        "Masukkan DPI: ",
        default="180",
        validate=lambda value: value.isdigit() and 72 <= int(value) or "DPI harus berupa angka dan harus lebih dari 72"
        ).ask()
    
    dpi = int(dpi)

    kualitas = questionary.text(
        "Kualitas (1-100): ",
        default="90",
        validate=lambda value: value.isdigit() and 1 <= int(value) <= 100 or "Kualitas harus direntang 1 sampai 100",
    ).ask()

    questionary.print(f"\nDitemukan: {jumlahPdf} file PDF", style="fg:ansigreen")
    questionary.print(f"Akan Diformat ke: {output_format}", style="fg:ansigreen")
    questionary.print(f"DPI: {dpi}px", style="fg:ansigreen")
    questionary.print(f"Kualitas: {kualitas}%\n", style="fg:ansigreen")

    konfirmasi = questionary.select( 
        "Apakah data diatas sudah benar?", 
        choices=["Ya", "Tidak"],
        default="Ya",
        instruction="(Gunakan tombol panah untuk memilih, Enter untuk konfirmasi)"
        ).ask()
    
    if not pilihan[konfirmasi]:
        lalu = questionary.select(
            "Ada yang salah? Lalu?", 
            choices=["Ulangi input data", "Keluar dari script"],
            instruction="(Gunakan tombol panah untuk memilih, Enter untuk konfirmasi)"
            ).ask()

        if lalu == "Keluar dari script":
            tulisLog("Script dihentikan oleh user", tipe="error")
            exit()

        questionary.print("\nMengulang Script...\n", style="bold fg:ansiyellow")
        return tanyakan_dulu()
    
    else:
        tulisLog(f"\n \nJumlah PDF: {jumlahPdf} \nFormat convert: .{output_format.lower()} \nDPI: {dpi}px \nKualitas: {kualitas}%",tulisKeCLI=False)
        tulisLog("Menjalankan Script Converter...", tipe="success", heading="\n")

tanyakan_dulu()
output_folder.mkdir(exist_ok=True)

for pdf_file in input_folder.rglob("*.pdf"):
    tulisLog(f"Sedang Convert: {pdf_file}", heading="--------- \n")

    relative_folder = pdf_file.parent.relative_to(input_folder)
    target_folder = output_folder / relative_folder

    try:
        hasil = asyncio.run(
            convert_pdf(
                pdf_path=pdf_file,
                output_dir=target_folder,
                dpi=dpi,
                quality=kualitas,
                format_output=output_format.lower()
            )
        )

        for output_file in hasil:
            tulisLog(
                f"Berhasil Convert: {output_file}",
                tipe="success"
            )

    except Exception as e:
        tulisLog(
            f"Ada Error saat convert {pdf_file} \n >>Error: {e}",
            tipe="error",
            heading="\n"
        )
        
tulisLog("---- Script Selesai ----", tipe="success", heading="\n")