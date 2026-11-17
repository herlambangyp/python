from script.textCLI import pesanCLI
import http.server
import socketserver
import webbrowser
import os
import sys
import socket
import questionary
import html

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

class DevHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def send_error(self, code, message=None, explain=None):

        if code == 404:
            content = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>404 - Not Found</title>
            </head>
            <body>
                <h1>404 - Not Found</h1>
                <p>Halaman yang kamu cari tidak ditemukan.</p>
            </body>
            </html>
            """.encode("utf-8")

            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()

            if self.command != "HEAD":
                self.wfile.write(content)

        else:
            super().send_error(code, message, explain)

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
        pesanCLI(DIRECTORY, PORT, url)
        # webbrowser.open(url)
        
        try:
            httpd.serve_forever()
            
        except KeyboardInterrupt:
            questionary.print("\n> Mematikan Server...", style="bold fg:ansired")
            httpd.server_close()