from assets.script.textCLI import pesanCLI
from assets.script.respon import kirimRespon
from assets.script.exploreFormater import fileFormatter
from urllib.parse import urlsplit
import http.server
import socketserver
import webbrowser
import os
import sys
import socket
import questionary
import html
import time
import json

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

def resourcePath(relativePath):
    if getattr(sys, 'frozen', False):
        basePath = sys._MEIPASS
    else:
        basePath = os.path.dirname(os.path.abspath(__file__))

    return os.path.join(basePath, relativePath)

def ambilJSON(self):
    length = int(self.headers.get("Content-Length", 0))
    body = self.rfile.read(length).decode("utf-8")
    return json.loads(body)

class DevHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def send_error(self, code, message=None, explain=None):
        if code in (400, 403, 404, 500):
            try:
                with open(resourcePath("assets/html/error.html"), "r", encoding="utf-8") as file:
                    content = file.read()

                content = content.replace("{{errorCode}}", str(code))
                content = content.replace("{{errorMessage}}", html.escape(message))
                content = content.replace("{{dateNowPy}}", str(time.time()))
                kirimRespon(self,content, "text/html; charset=utf-8")

            except OSError:
                super().send_error(code, message, explain)

        else:
            super().send_error(code, message, explain)

    def list_directory(self, path):
        try:
            entries = os.listdir(path)
        except OSError:
            self.send_error(404, "Directory not accessible")
            return None

        # Folder ditampilkan dulu
        entries.sort(key=lambda name: (
            not os.path.isdir(os.path.join(path, name)),
            name.lower()
        ))

        currentPath, items, fileCount, folderCount = fileFormatter(self, entries, path)        
        try:
            with open(resourcePath("assets/html/fileExplorer.html"), "r", encoding="utf-8") as file:
                content = file.read()

        except OSError:
            return super().list_directory(path)

        content = content.replace("{{directoryPath}}",html.escape(currentPath))
        content = content.replace("{{directoryContent}}", items)
        content = content.replace("{{itemCount}}", str(folderCount + fileCount))
        kirimRespon(self,content, "text/html; charset=utf-8")

        return None

    def translate_path(self, path):
        urlPath = urlsplit(path).path

        # Sediakan icon
        if urlPath == "/__mini_server__/favicon.png":
            return resourcePath("assets/icon/lg.png")

        return super().translate_path(path)
    
    def do_GET(self):
        urlPath = urlsplit(self.path).path

        if urlPath.rstrip("/") == "/settings":
            try:
                with open(resourcePath("assets/html/settings.html"), "r", encoding="utf-8") as file:
                    content = file.read()
                    content = content.replace("{{dataPort}}", str(PORT))
                    kirimRespon(self,content, "text/html; charset=utf-8")
                    return

            except OSError:
                self.send_error(404)
                return

        super().do_GET()

    def do_POST(self):
        if self.path == "/api/test":
            kirimRespon(self,'{"message": "Halo dari Python!"}')

        else:
            self.send_error(404)

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