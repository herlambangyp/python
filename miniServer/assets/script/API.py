
from assets.script.respon import kirimRespon
from assets.script.config import saveSettings, loadSettings, CONFIG_FILE, resetSettings
from assets.script.errorMassage import msgError

import ipaddress
import json

SETTINGS = loadSettings()

def isLocalhost(self):
    ip = ipaddress.ip_address(self.client_address[0])
    return ip.is_loopback

def ambilJSON(self):
    length = int(self.headers.get("Content-Length", 0))
    body = self.rfile.read(length).decode("utf-8")
    return json.loads(body)

def api_get(self, urlPath, resourcePath, port):

    if urlPath.rstrip("/") == "/settings":
        if not isLocalhost(self) and not SETTINGS["serverAkses"]:
            self.send_error(403,msgError["settingAkses"][SETTINGS["lang"]])
            return True

        try:
            with open(resourcePath("assets/html/settings.html"),"r",encoding="utf-8") as file:
                content = file.read()

            content = content.replace("{{dataPort}}", str(port))
            content = content.replace("{{lang}}",str(SETTINGS["lang"]))
            content = content.replace("{{CORS}}",str(SETTINGS["CORS"]))
            content = content.replace("{{noCache}}",str(SETTINGS["no_cache"]))
            content = content.replace("{{directoryConfig}}",str(CONFIG_FILE))
            content = content.replace("{{ceklistNoCache}}", "checked" if SETTINGS["no_cache"] else "")
            content = content.replace("{{ceklistDirList}}", "checked" if SETTINGS["dir_listing"] else "")
            content = content.replace("{{ceklistAkses}}", "checked" if SETTINGS["serverAkses"] else "")
            kirimRespon(self,content,"text/html; charset=utf-8")

        except OSError:
            self.send_error(404, msgError["404"][SETTINGS["lang"]])
        return True

    return False


def api_post(self, urlPath):

    if urlPath == "/api/settings":
        if not isLocalhost(self) and not SETTINGS["serverAkses"]:
            self.send_error(403,msgError["settingAkses"][SETTINGS["lang"]])
            return True

        try:
            data = ambilJSON(self) # data diambil dari json yang dikirim javascript

            if not isinstance(data, dict):
                raise ValueError("Data harus berupa JSON object")

            if "no_cache" not in data or not isinstance(data["no_cache"], bool):
                raise ValueError("Pengaturan no_cache tidak valid")
            
            port = data.get("port")

            if isinstance(port, bool) or not isinstance(port, int) or not 1 <= port <= 65535:
                raise ValueError("Port tidak valid")
            
            saveSettings({
                "port": port,
                "no_cache": data["no_cache"],
                "dir_listing": data["dir_listing"],
                "CORS": data["CORS"],
                "serverAkses" : data["serverAkses"],
                "lang": data["lang"]
                })

            kirimRespon(self, json.dumps({
                "success": True,
                "message": "Pengaturan berhasil disimpan",
                "settings": SETTINGS
            }))

        except (ValueError, UnicodeDecodeError):
            kirimRespon(self, json.dumps({
                "success": False,
                "message": "Data pengaturan tidak valid"
            }))

        except OSError:
            kirimRespon(self, json.dumps({
                "success": False,
                "message": "Gagal menyimpan konfigurasi"
            }))

        return True
    elif urlPath == "/api/settings/reset":
        if not isLocalhost(self) and not SETTINGS["serverAkses"]:
            self.send_error(403, msgError["settingAkses"][SETTINGS["lang"]])
            return True

        try:    
            resetSettings()

            kirimRespon(self, json.dumps({
                "success": True,
                "restart": True,
                "port": SETTINGS["port"],
                "message": "Pengaturan berhasil dikembalikan ke default"
            }))

        except OSError:
            kirimRespon(self, json.dumps({
                "success": False,
                "message": "Gagal mereset konfigurasi"
            }))

        return True
    elif urlPath == "/api/test":
        kirimRespon(self, '{"message": "Halo dari Python!"}')
        return True

    return False


