#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class CustomHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        print(f"Request path: {self.path}")
        
        # 处理路由
        routes = {
            '/': 'src/pages/market/index.html',
            '/market': 'src/pages/market/index.html',
            '/pivot': 'src/pages/pivot/index.html',
            '/leaders': 'src/pages/leaders/index.html',
            '/account': 'src/pages/account/index.html',
        }
        
        if self.path in routes:
            self.path = routes[self.path]
            print(f"Routed to: {self.path}")
        
        # 处理CSS/JS资源路径
        if self.path.startswith('/src/'):
            # 确保路径正确
            file_path = '.' + self.path
            if os.path.exists(file_path):
                self.path = file_path
                print(f"Serving file: {self.path}")
            else:
                print(f"File not found: {file_path}")
                self.send_error(404, "File not found")
                return
        elif self.path.startswith('src/'):
            # 直接处理src/开头的路径
            file_path = self.path
            if os.path.exists(file_path):
                print(f"Serving file: {file_path}")
            else:
                print(f"File not found: {file_path}")
                self.send_error(404, "File not found")
                return
        
        return super().do_GET()

if __name__ == '__main__':
    port = 8000
    server = HTTPServer(('localhost', port), CustomHandler)
    print(f'服务器启动在 http://localhost:{port}')
    print('可用路径:')
    print('  /        -> Market页面')
    print('  /market  -> Market页面')
    print('  /pivot   -> Pivot页面')
    print('  /leaders -> Leaders页面')
    print('  /account -> Account页面')
    server.serve_forever()