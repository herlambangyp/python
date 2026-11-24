import socket
import questionary

def cekIp(port=8000):
    try:
        mainSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        mainSocket.connect(("8.8.8.8", 80))
        ip = mainSocket.getsockname()[0]
        mainSocket.close()
        return questionary.print(f"http://{ip}:{port}", style="fg:ansigreen bold underline", end="")
    
    except Exception:
        return questionary.print("ERROR: Gagal ekspose ke jaringan lokal. Apakah jaringan lokal mati?", style="fg:ansired bold")


def pesanCLI(dir='', port=8000, link="url"):
    questionary.print("> ",end="")
    questionary.print("By Herlambang YP", style="bold fg:ansicyan")
    questionary.print("Source-code: ",end="")
    questionary.print("https://github.com/herlambangyp/python/tree/main/miniServer", style="underline")
    questionary.print(f"(Ctrl + Klik Link)", style="bold")

    questionary.print(f"\n> Membuat Server Mini di:")
    questionary.print(f"  {dir}", style="bold")

    questionary.print("\n> Server lokal aktif di:")
    questionary.print("  ",end="")                
    questionary.print(f"{link}", style="fg:ansigreen bold underline", end="")
    questionary.print(f" (Ctrl + Klik Link)", style="bold")

    questionary.print("\n> Akses di perangkat lain (di jaringan yg sama):")
    questionary.print("  ",end="")        
    cekIp(port)                
    questionary.print(" (Ctrl + Klik Link)", style="bold")
    questionary.print("  *Izinkan firewall agar bisa diakses perangkat lain" )
    questionary.print("  *Jika tetap tidak tampil di perangkat lain:" )
    questionary.print("    - Lakukan ping ke perangkat yg dituju melalui CMD" )
    questionary.print("    - Misalnya: ", end="" )
    questionary.print("ping ", style="fg:ansiyellow", end="")
    questionary.print("192.168.11.134 ", style="bold", end="")
    questionary.print("(ip perangkat lain yg dituju)")
    questionary.print("    - Jika ping berhasil, buka lagi website di perangkat yg dituju." )
    questionary.print("    - Tidak perlu melakukanya untuk semua perangkat" )
    questionary.print("    - 1 Perangkat terhubung, seharusnya bisa memicu pembaruan seluruh koneksi" )

    questionary.print("\n> ",end="")
    questionary.print("Info:", style="fg:ansicyan")
    questionary.print("  Tekan ",end="")
    questionary.print("Ctrl + C atau tutup terminal ini", style="bold fg:ansired", end="")
    questionary.print(" untuk mematikan server.")

    questionary.print("\n  Pengaturan Server:")
    questionary.print("  ",end="")                
    questionary.print(f"{link}/settings", style="fg:ansiyellow bold underline", end="")
    questionary.print(f" (Ctrl + Klik Link)", style="bold")

    questionary.print("\n  SERVER INI DIBUAT SANGAT SPESIFIK UNTUK ENVIRONMENT FRONT END LOKAL", style="bold")
    questionary.print("  Tanpa koneksi database, tanpa PHP, tanpa NodeJS (server-side).")
    questionary.print("  Arsitektur dibuat sangat spesifik meniru Github-Pages")
    questionary.print("  TIDAK untuk port forwarding (hosting server) ke publik! Baca source-code terkait hal ini", style="bold")

    questionary.print("\n> ",end="")
    questionary.print("Lalu lintas server:", style="fg:ansiyellow")
    questionary.print('\nIP yang request - - [Waktu request] "method dan yang di request" kode respon server\n')
        

