def kirimRespon(self, response, contentType="application/json"):
    response = response.encode("utf-8")

    self.send_response(200)
    self.send_header("Content-Type", contentType)
    self.send_header("Content-Length", str(len(response)))
    self.end_headers()
    
    if self.command != "HEAD":
        self.wfile.write(response)