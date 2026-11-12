import { WebAppConfig } from "../types";

export const defaultApps: WebAppConfig[] = [
  {
    id: "app-node-1",
    name: "Pocket Node.js API & Admin",
    packageName: "com.shiaho.pocketnode",
    versionName: "1.0.0",
    versionCode: 1,
    icon: "Server",
    appType: "nodejs",
    port: 3000,
    browserEngine: "webview",
    enableDoH: true,
    dohProvider: "Cloudflare (1.1.1.1)",
    tlsFingerprint: "chrome",
    enableEch: false,
    enableCorsBypass: true,
    proxyType: "none",
    encryptResources: true,
    antiDebug: true,
    deviceDisguise: false,
    permissionsPruned: ["CAMERA", "RECORD_AUDIO"],
    enabledModules: ["adblock-ultra", "vconsole-inspector"],
    enabledExtensions: ["fmkadmapgofadopljbjfkapdkoienihi"],
    createdAt: "2026-07-28",
    lastBuiltAt: "2026-07-31",
    status: "running",
    localCode: `const express = require('express');
const app = express();
const PORT = 3000;

app.get('/api/status', (req, res) => {
  res.json({
    app: 'Pocket Node.js Server',
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  });
});

app.listen(PORT, () => console.log('Node.js server listening on port ' + PORT));`
  },
  {
    id: "app-wp-1",
    name: "WordPress SQLite Mobile Studio",
    packageName: "org.wordpress.ondevice",
    versionName: "7.1.0",
    versionCode: 71,
    icon: "Globe",
    appType: "wordpress",
    port: 8080,
    browserEngine: "geckoview",
    enableDoH: true,
    dohProvider: "Google DoH (8.8.8.8)",
    tlsFingerprint: "firefox",
    enableEch: true,
    enableCorsBypass: true,
    proxyType: "none",
    encryptResources: false,
    antiDebug: false,
    deviceDisguise: true,
    permissionsPruned: ["ACCESS_FINE_LOCATION"],
    enabledModules: ["dark-mode-oled"],
    enabledExtensions: ["cjpalhdlnbpafiamejdnhcphjbkeiagm"],
    createdAt: "2026-07-29",
    status: "idle"
  },
  {
    id: "app-python-1",
    name: "Python 3.14 Data Analyzer",
    packageName: "net.shiaho.pythontool",
    versionName: "3.14.0",
    versionCode: 314,
    icon: "Cpu",
    appType: "python",
    port: 8000,
    browserEngine: "webview",
    enableDoH: false,
    dohProvider: "Quad9 (9.9.9.9)",
    tlsFingerprint: "chrome",
    enableEch: false,
    enableCorsBypass: false,
    proxyType: "none",
    encryptResources: true,
    antiDebug: true,
    deviceDisguise: false,
    permissionsPruned: [],
    enabledModules: ["vconsole-inspector"],
    enabledExtensions: [],
    createdAt: "2026-07-30",
    status: "idle",
    localCode: `from http.server import HTTPServer, BaseHTTPRequestHandler
import json, sys

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        data = {'status': 'Python 3.14 server active', 'sys': sys.version}
        self.wfile.write(json.dumps(data).encode())

print("Starting Python server on port 8000...")
HTTPServer(('0.0.0.0', 8000), SimpleHandler).serve_forever()`
  },
  {
    id: "app-spa-1",
    name: "Cyber Retro Arcade (SPA)",
    packageName: "com.arcade.retro",
    versionName: "2.1.0",
    versionCode: 21,
    icon: "Gamepad2",
    appType: "html_frontend",
    browserEngine: "webview",
    enableDoH: false,
    dohProvider: "Cloudflare (1.1.1.1)",
    tlsFingerprint: "chrome",
    enableEch: false,
    enableCorsBypass: true,
    proxyType: "none",
    encryptResources: true,
    antiDebug: true,
    deviceDisguise: false,
    permissionsPruned: ["READ_CONTACTS"],
    enabledModules: ["gesture-navigation"],
    enabledExtensions: [],
    createdAt: "2026-07-31",
    status: "running"
  },
  {
    id: "app-web-1",
    name: "Hacker News Unblocked PWA",
    packageName: "io.news.hackernews",
    versionName: "1.0.4",
    versionCode: 104,
    icon: "Zap",
    appType: "website",
    targetUrl: "https://news.ycombinator.com",
    browserEngine: "geckoview",
    enableDoH: true,
    dohProvider: "Cloudflare (1.1.1.1)",
    tlsFingerprint: "safari",
    enableEch: true,
    enableCorsBypass: true,
    proxyType: "none",
    encryptResources: false,
    antiDebug: false,
    deviceDisguise: true,
    permissionsPruned: [],
    enabledModules: ["adblock-ultra", "dark-mode-oled"],
    enabledExtensions: ["pkehgkgalbdipidgpgakapanfkbdipag"],
    createdAt: "2026-08-01",
    status: "running"
  }
];
