import React, { useState } from "react";
import { X, Plus, Smartphone, Globe, Terminal, Code2 } from "lucide-react";
import { WebAppConfig, LanguageCode, AppType, BrowserEngine } from "../types";
import { translations } from "../i18n/translations";

interface NewAppModalProps {
  currentLang: LanguageCode;
  onClose: () => void;
  onCreate: (app: WebAppConfig) => void;
}

export const NewAppModal: React.FC<NewAppModalProps> = ({
  currentLang,
  onClose,
  onCreate,
}) => {
  const t = translations[currentLang];
  const [name, setName] = useState("");
  const [packageName, setPackageName] = useState("com.example.myapp");
  const [appType, setAppType] = useState<AppType>("website");
  const [targetUrl, setTargetUrl] = useState("https://");
  const [browserEngine, setBrowserEngine] = useState<BrowserEngine>("webview");
  const [port, setPort] = useState(8080);

  const handleNameChange = (val: string) => {
    setName(val);
    const slug = val.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (slug) {
      setPackageName(`com.shiaho.${slug}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newApp: WebAppConfig = {
      id: `app-${Date.now()}`,
      name,
      packageName,
      versionName: "1.0.0",
      versionCode: 1,
      icon: appType === "website" ? "Globe" : appType === "nodejs" ? "Server" : "Zap",
      appType,
      targetUrl: appType === "website" ? targetUrl : undefined,
      port: ["nodejs", "php", "python", "go", "wordpress"].includes(appType) ? port : undefined,
      browserEngine,
      enableDoH: true,
      dohProvider: "Cloudflare (1.1.1.1)",
      tlsFingerprint: "chrome",
      enableEch: false,
      enableCorsBypass: true,
      proxyType: "none",
      encryptResources: false,
      antiDebug: false,
      deviceDisguise: false,
      permissionsPruned: [],
      enabledModules: [],
      enabledExtensions: [],
      createdAt: new Date().toISOString().split("T")[0],
      status: "running"
    };

    onCreate(newApp);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg font-mono">{t.newApp}</h3>
              <p className="text-xs text-slate-400">Create URL Wrapper or Local Server Project</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-mono text-xs">
          <div className="space-y-1">
            <label className="text-slate-400">App Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. My Dashboard App"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Android Package Name</label>
            <input
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">App Type</label>
            <select
              value={appType}
              onChange={(e) => setAppType(e.target.value as AppType)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="website">Website URL Wrapper</option>
              <option value="html_frontend">Local HTML/SPA Frontend</option>
              <option value="nodejs">On-Device Node.js 18.20 Server</option>
              <option value="php">On-Device PHP 8.4 Server</option>
              <option value="python">On-Device Python 3.14 Server</option>
              <option value="go">On-Device Go 1.26 Binary</option>
              <option value="wordpress">On-Device WordPress over SQLite</option>
            </select>
          </div>

          {appType === "website" && (
            <div className="space-y-1">
              <label className="text-slate-400">Target Website URL</label>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://news.ycombinator.com"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          )}

          {["nodejs", "php", "python", "go", "wordpress"].includes(appType) && (
            <div className="space-y-1">
              <label className="text-slate-400">On-Device Port Mapping</label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-slate-400">Browser Engine</label>
            <select
              value={browserEngine}
              onChange={(e) => setBrowserEngine(e.target.value as BrowserEngine)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="webview">System WebView (Default)</option>
              <option value="geckoview">GeckoView Firefox Engine (ECH / SNI Encrypted)</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg"
            >
              Create Project
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
