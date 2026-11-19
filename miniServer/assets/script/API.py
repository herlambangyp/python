from assets.script.respon import kirimRespon
from main import resourcePath, PORT
from assets.script.config import SETTINGS, loadSettings, saveSettings
import ipaddress

def isLocalhost(self):
    ip = ipaddress.ip_address(self.client_address[0])
    return ip.is_loopback

def api_get(self, urlPath):
    if urlPath.rstrip("/") == "/settings":
        if not isLocalhost(self):
            print(isLocalhost(self))
            return self.send_error(403, "Server settings only allowed in localhost")
            
        try:
            with open(resourcePath("assets/html/settings.html"), "r", encoding="utf-8") as file:
                content = file.read()
                content = content.replace("{{dataPort}}", str(PORT))
                content = content.replace("{{noCache}}", str(SETTINGS["no_cache"]))
                return kirimRespon(self, content, "text/html; charset=utf-8")
               
            
        except OSError:
            return self.send_error(404)
