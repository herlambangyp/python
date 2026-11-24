
from assets.script.respon import kirimRespon
from assets.script.config import saveSettings, loadSettings
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
        if not isLocalhost(self):
            self.send_error(403,"Server settings only allowed in localhost")
            return True

        try:
            with open(resourcePath("assets/html/settings.html"),"r",encoding="utf-8") as file:
                content = file.read()

            content = content.replace("{{dataPort}}", str(port))
            content = content.replace("{{lang}}",str(SETTINGS["lang"]))
            content = content.replace("{{noCache}}",str(SETTINGS["no_cache"]))
            content = content.replace("{{ceklistNoCache}}", "checked" if SETTINGS["no_cache"] else "")
            kirimRespon(self,content,"text/html; charset=utf-8")

        except OSError:
            self.send_error(404, msgError["404"][SETTINGS["lang"]])
        return True

    return False


def api_post(self, urlPath):

    if urlPath == "/api/settings":
        if not isLocalhost(self):
            self.send_error(403,"Server settings only allowed in localhost")
            return True

        try:
            data = ambilJSON(self) # data diambil dari json yang dikirim javascript

            if not isinstance(data, dict):
                raise ValueError("Data harus berupa JSON object")

            if "no_cache" not in data or not isinstance(data["no_cache"], bool):
                raise ValueError("Pengaturan no_cache tidak valid")

            saveSettings({
                "no_cache": data["no_cache"],
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

    elif urlPath == "/api/test":
        kirimRespon(self, '{"message": "Halo dari Python!"}')
        return True

    return False


