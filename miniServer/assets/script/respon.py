def kirimRespon(self, response, contentType="application/json", status=200):
    response = response.encode("utf-8")

    self.send_response(status)
    self.send_header("Content-Type", contentType)
    self.send_header("Content-Length", str(len(response)))
    self.end_headers()
    
    if self.command != "HEAD":
        self.wfile.write(response)