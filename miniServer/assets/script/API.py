
from assets.script.respon import kirimRespon
from assets.script.config import SETTINGS
import ipaddress


def isLocalhost(self):
    ip = ipaddress.ip_address(self.client_address[0])
    return ip.is_loopback


def api_get(self, urlPath, resourcePath, port):

    if urlPath.rstrip("/") == "/settings":

        if not isLocalhost(self):
            self.send_error(
                403,
                "Server settings only allowed in localhost"
            )
            return True

        try:
            with open(
                resourcePath("assets/html/settings.html"),
                "r",
                encoding="utf-8"
            ) as file:
                content = file.read()

            content = content.replace("{{dataPort}}", str(port))
            content = content.replace(
                "{{noCache}}",
                str(SETTINGS["no_cache"])
            )

            kirimRespon(
                self,
                content,
                "text/html; charset=utf-8"
            )

        except OSError:
            self.send_error(404)

        return True

    return False
