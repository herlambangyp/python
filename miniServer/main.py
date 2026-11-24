from assets.script.textCLI import pesanCLI
from assets.script.API import api_get, api_post
from assets.script.respon import kirimRespon
from assets.script.errorMassage import msgError
from assets.script.exploreFormater import fileFormatter
from assets.script.config import loadSettings, saveSettings
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

SETTINGS = loadSettings()
PORT = cariPortKosong(SETTINGS["port"])

def resourcePath(relativePath):
    if getattr(sys, 'frozen', False):
        basePath = sys._MEIPASS
    else:
        basePath = os.path.dirname(os.path.abspath(__file__))

    return os.path.join(basePath, relativePath)


class DevHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def send_error(self, code, message=None, explain=None):
            if code == 404:
                message = msgError["404"][SETTINGS["lang"]]
            try:
                with open(resourcePath("assets/html/error.html"), "r", encoding="utf-8") as file:
                    content = file.read()

                content = content.replace("{{lang}}",str(SETTINGS["lang"]))
                content = content.replace("{{errorCode}}", str(code))
                content = content.replace("{{errorMessage}}", html.escape(message))
                content = content.replace("{{dateNowPy}}", str(time.time()))
                kirimRespon(self,content, "text/html; charset=utf-8",code)

            except OSError:
                super().send_error(code, message, explain)

    def list_directory(self, path):
        if not SETTINGS["dir_listing"]:
            self.send_error(403, msgError["errorListing"][SETTINGS["lang"]])
            return None
        
        try:
            entries = os.listdir(path)
        except OSError:
            self.send_error(404)
            return None

        entries.sort(key=lambda name: (not os.path.isdir(os.path.join(path, name)),name.lower()))

        currentPath, items, fileCount, folderCount = fileFormatter(self, entries, path)    

        try:
            with open(resourcePath("assets/html/fileExplorer.html"), "r", encoding="utf-8") as file:
                content = file.read()

        except OSError:
            return super().list_directory(path)
        
        content = content.replace("{{lang}}",str(SETTINGS["lang"]))
        content = content.replace("{{directoryPath}}",html.escape(currentPath))
        content = content.replace("{{directoryContent}}", items)
        content = content.replace("{{itemCount}}", str(folderCount + fileCount))
        kirimRespon(self,content, "text/html; charset=utf-8")

        return None

    def translate_path(self, path):
        urlPath = urlsplit(path).path

        # url asset statis
        if urlPath == "/miniServer/icon/favicon.png":
            return resourcePath("assets/icon/lg.png")
        
        if urlPath == "/miniServer/template/Error.html":
            return resourcePath("assets/html/error.html")

        if urlPath == "/miniServer/template/responseModal.html":
            return resourcePath("assets/html/responseModal.html")

        return super().translate_path(path)
    
    def do_GET(self):
        urlPath = urlsplit(self.path).path
        if api_get(self, urlPath, resourcePath, PORT):
            return
        super().do_GET()

    def do_POST(self):
        urlPath = urlsplit(self.path).path
        if api_post(self, urlPath):
            return
        
        self.send_error(404)

    def end_headers(self):
        if SETTINGS["no_cache"]:
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        self.send_header("Access-Control-Allow-Origin", SETTINGS["CORS"])
        super().end_headers()

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == "__main__":
    url = f"http://localhost:{PORT}"
    
    with ReusableTCPServer(("0.0.0.0", PORT), DevHTTPRequestHandler) as httpd:
        pesanCLI(DIRECTORY, PORT, url)
        webbrowser.open(url)
        
        try:
            httpd.serve_forever()

        except KeyboardInterrupt:
            questionary.print("\n> Mematikan Server...", style="bold fg:ansired")
            httpd.server_close()