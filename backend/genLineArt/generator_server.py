from http.server import HTTPServer, BaseHTTPRequestHandler
from sys import argv
import json
from tokenize import Double 
from generate_art import *

BIND_HOST = 'localhost'
PORT = 8080

def produce_art(content):
    content = content.decode('utf-8')
    contentAsJson = json.loads(content)
    numberOfLines = int(contentAsJson["numberOfLines"])
    startColor = float(contentAsJson["startColor"])
    endColor = float(contentAsJson["endColor"])

    generate_art(numberOfLines, startColor, endColor)

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
    def do_POST(self):
        content_length = int(self.headers.get('content-length', 0))
        body = self.rfile.read(content_length)

        self.write_response(body)
        produce_art(body)

    def write_response(self, content):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(content)
        print(self.headers)

if len(argv) > 1:
    arg = argv[1].split(':')
    BIND_HOST = arg[0]
    PORT = int(arg[1])

print(f'Listening on http://{BIND_HOST}:{PORT}\n')

httpd = HTTPServer((BIND_HOST, PORT), SimpleHTTPRequestHandler)
httpd.serve_forever()