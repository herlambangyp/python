from assets.script.textCLI import pesanCLI
from urllib.parse import quote, urlsplit
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
        if code in (400, 403, 404, 500):
            try:
                with open(resourcePath("assets/html/error.html"), "r", encoding="utf-8") as file:
                    content = file.read()

                content = content.replace("{{errorCode}}", str(code))
                content = content.replace("{{errorMessage}}", html.escape(message))
                content = content.encode("utf-8")

                self.send_response(code)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()

                if self.command != "HEAD":
                    self.wfile.write(content)

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

        items = ""
        folderCount = 0
        fileCount = 0

        for name in entries:
            fullname = os.path.join(path, name)
            isFolder = os.path.isdir(fullname)

            # URL item
            href = quote(name, safe="")
            displayName = name

            if isFolder:
                href += "/"
                displayName += "/"
                folderCount += 1

                itemClass = "file-item is-folder"
                icon = "icon-folder"
                itemType = "Directory"

            else:
                fileCount += 1
                extension = os.path.splitext(name)[1].lower()

                # cek jenis file
                if name.startswith(".") or extension in (".cfg", ".ini", ".conf"):
                    icon = "icon-config"
                    itemType = "Config"

                elif extension in (".html", ".php"):
                    icon = "icon-doc"
                    itemType = "WEB DOCUMENT"

                elif extension in (".js", ".ts" ):
                    icon = "icon-config"
                    itemType = "WEB SCRIPT"

                elif extension in (".css", ".scss" ):
                    icon = "icon-style"
                    itemType = "WEB STYLE"

                elif extension:
                    icon = "icon-file"
                    itemType = extension[1:].upper() + " File"

                else:
                    icon = "icon-file"
                    itemType = "File"

                itemClass = "file-item"

            items += f"""
            <li>
                <a class="{itemClass}" href="{href}">
                    <span class="item-name">
                        <svg class="icon">
                            <use href="#{icon}"></use>
                        </svg>
                        {html.escape(displayName)}
                    </span>
                    <span class="item-type">{html.escape(itemType)}</span>
                </a>
            </li>
            """
        currentPath = urlsplit(self.path).path

        if currentPath != "/":
            items = """
            <li>
                <a class="file-item" href="../">
                    <span class="item-name">
                        <svg class="icon">
                            <use href="#icon-up"></use>
                        </svg>
                        ../
                    </span>
                    <span class="item-type">Parent Dir</span>
                </a>
            </li>
            """ + items

        # Baca template
        try:
            with open(resourcePath("assets/html/fileExplorer.html"), "r", encoding="utf-8") as file:
                content = file.read()

        except OSError:
            return super().list_directory(path)

        # Ganti placeholder
        content = content.replace("{{directoryPath}}",html.escape(currentPath))
        content = content.replace("{{directoryContent}}", items)
        content = content.replace("{{itemCount}}", str(folderCount + fileCount))
        content = content.replace("{{folderCount}}", str(folderCount))
        content = content.replace("{{fileCount}}", str(fileCount))

        content = content.encode("utf-8")

        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()

        if self.command != "HEAD":
            self.wfile.write(content)

        return None

    def translate_path(self, path):
        urlPath = urlsplit(path).path

        # Sediakan icon
        if urlPath == "/__mini_server__/favicon.png":
            return resourcePath("assets/icon/lg.png")

        return super().translate_path(path)

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
        webbrowser.open(url)
        
        try:
            httpd.serve_forever()

        except KeyboardInterrupt:
            questionary.print("\n> Mematikan Server...", style="bold fg:ansired")
            httpd.server_close()