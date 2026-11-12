export type LanguageCode =
  | "en"
  | "zh"
  | "ar"
  | "pt"
  | "es"
  | "fr"
  | "de"
  | "ru"
  | "ja"
  | "ko";

export type AppType =
  | "website"
  | "html_frontend"
  | "nodejs"
  | "php"
  | "python"
  | "go"
  | "wordpress"
  | "media_gallery"
  | "multi_web";

export type BrowserEngine = "webview" | "geckoview";

export interface WebAppConfig {
  id: string;
  name: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  icon: string;
  appType: AppType;
  targetUrl?: string;
  localCode?: string;
  port?: number;
  browserEngine: BrowserEngine;
  
  // Hardening & Anti-Censorship
  enableDoH: boolean;
  dohProvider: string;
  tlsFingerprint: "chrome" | "firefox" | "safari" | "custom";
  enableEch: boolean;
  enableCorsBypass: boolean;
  proxyType: "none" | "static" | "pac" | "socks5";
  proxyAddress?: string;

  // Security & Hardening
  encryptResources: boolean;
  antiDebug: boolean;
  deviceDisguise: boolean;
  permissionsPruned: string[];

  // Extensions
  enabledModules: string[]; // module ids
  enabledExtensions: string[]; // chrome extension ids

  // Custom code
  customCss?: string;
  customJs?: string;

  createdAt: string;
  lastBuiltAt?: string;
  status: "idle" | "running" | "building" | "stopped";
}

export interface ModuleItem {
  id: string;
  folder: string;
  name: string;
  version: string;
  category: string;
  description: string;
  author: string;
  contributors: string[];
  rating: number;
  downloads: number;
  code: string;
  isInstalled?: boolean;
}

export interface ChromeExtensionItem {
  id: string;
  name: string;
  version: string;
  description: string;
  rating: number;
  users: string;
  icon: string;
  crxUrl: string;
  isInstalled?: boolean;
}

export interface PortProcess {
  port: number;
  runtime: "Node.js 18.20" | "PHP 8.4" | "Python 3.14" | "Go 1.26" | "WordPress SQLite";
  appName: string;
  status: "active" | "idle" | "error";
  cpuUsage: string;
  ramUsage: string;
  uptime: string;
}

export interface BuildLogEntry {
  timestamp: string;
  message: string;
  type: "info" | "success" | "warn" | "error";
}
