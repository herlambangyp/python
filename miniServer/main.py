import http.server
import socketserver
import webbrowser
import os
import sys
import socket
import questionary

# YA YA YA, code garapi, ga kaya python. Bro aku kebiasa JS!

if getattr(sys, 'frozen', False):
    DIRECTORY = os.path.dirname(sys.executable)
else:
    DIRECTORY = os.path.dirname(os.path.abspath(__file__))
    
def cariPortKosong(defaultPort=8000):
    port = defaultPort
    while True:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(("127.0.0.1", port)) != 0:
                return port
            port += 1

PORT = cariPortKosong()


def cekIp():
    try:
        mainSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        mainSocket.connect(("8.8.8.8", 80))
        ip = mainSocket.getsockname()[0]
        mainSocket.close()
        return questionary.print(f"http://{ip}:{PORT}", style="fg:ansigreen bold underline", end="")
    
    except Exception:
        return questionary.print("ERROR: Gagal ekspose ke jaringan lokal. Apakah jaringan lokal mati?", style="fg:ansired bold")

class DevHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == "__main__":
    url = f"http://localhost:{PORT}"
    
    with ReusableTCPServer(("0.0.0.0", PORT), DevHTTPRequestHandler) as httpd:

        questionary.print("\n> ",end="")
        questionary.print("By Herlambang YP", style="bold fg:ansiyellow")
        questionary.print("Source-code: ",end="")
        questionary.print("https://github.com/herlambangyp/python/tree/main/miniServer", style="underline")
        questionary.print(f"(Ctrl + Klik Link)", style="bold", end="")
        questionary.print(f" untuk menuju link")

        questionary.print(f"\n> Membuat Server Mini di:")
        questionary.print(f"{DIRECTORY}", style="bold")
        questionary.print("\n> Server lokal aktif di:")
        questionary.print(f"{url}", style="fg:ansigreen bold underline", end="")
        questionary.print(f" (Ctrl + Klik Link)", style="bold", end="")
        questionary.print(f" untuk menuju link")

        questionary.print("\n> Akses di perangkat lain (di jaringan yg sama):")
        cekIp()                
        questionary.print(f" (Ctrl + Klik Link)", style="bold", end="")
        questionary.print(f" untuk menuju link")
        questionary.print(f"  *Izinkan firewall agar bisa diakses perangkat lain")

        questionary.print("\n> Info:")
        questionary.print("Tekan ",end="")
        questionary.print("Ctrl + C atau tutup terminal ini", style="bold underline fg:ansiyellow", end="")
        questionary.print(" untuk mematikan server.")

        questionary.print("\nSERVER INI DIBUAT SANGAT SPESIFIK UNTUK ENVIRONMENT FRONT END", style="bold")
        questionary.print("Tanpa koneksi database, tanpa PHP, tanpa NodeJS (server-side).")
        questionary.print("Arsitektur dibuat sangat spesifik meniru Github-Pages")
        questionary.print("TIDAK untuk port forwarding ke publik! Sebaiknya baca source-code terkait hal ini", style="bold")

        questionary.print("\n> ",end="")
        questionary.print("Lalu lintas server:", style="fg:ansiyellow")
        
        webbrowser.open(url)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            questionary.print("\n> Mematikan Server...", style="bold fg:ansired")