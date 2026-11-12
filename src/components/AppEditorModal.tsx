import React, { useState } from "react";
import {
  X,
  Save,
  Settings,
  ShieldCheck,
  Smartphone,
  Globe,
  Lock,
  Terminal,
  Code2,
  FileCode2,
  Check
} from "lucide-react";
import { WebAppConfig, LanguageCode, AppType, BrowserEngine } from "../types";
import { translations } from "../i18n/translations";

interface AppEditorModalProps {
  app: WebAppConfig;
  currentLang: LanguageCode;
  onClose: () => void;
  onSave: (updatedApp: WebAppConfig) => void;
}

export const AppEditorModal: React.FC<AppEditorModalProps> = ({
  app,
  currentLang,
  onClose,
  onSave,
}) => {
  const t = translations[currentLang];
  const [formData, setFormData] = useState<WebAppConfig>({ ...app });
  const [activeTab, setActiveTab] = useState<"general" | "network" | "security" | "custom_code">("general");

  const availablePermissions = [
    "CAMERA",
    "RECORD_AUDIO",
    "ACCESS_FINE_LOCATION",
    "READ_CONTACTS",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE"
  ];

  const handleTogglePermission = (perm: string) => {
    const pruned = formData.permissionsPruned || [];
    if (pruned.includes(perm)) {
      setFormData({
        ...formData,
        permissionsPruned: pruned.filter((p) => p !== perm)
      });
    } else {
      setFormData({
        ...formData,
        permissionsPruned: [...pruned, perm]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg font-mono">
                {t.editConfig}: {app.name}
              </h3>
              <p className="text-xs text-slate-400">{formData.packageName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950">
          {[
            { id: "general", label: "General & Runtime", icon: Smartphone },
            { id: "network", label: "Network & Anti-Censorship", icon: ShieldCheck },
            { id: "security", label: "Hardening & Crypto", icon: Lock },
            { id: "custom_code", label: "Injected JS/CSS", icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-3 px-4 text-xs font-mono border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-cyan-400 text-cyan-400 font-bold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* GENERAL TAB */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-mono">App Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-mono">Android Package Name</label>
                  <input
                    type="text"
                    value={formData.packageName}
                    onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-mono">App Target Type</label>
                  <select
                    value={formData.appType}
                    onChange={(e) => setFormData({ ...formData, appType: e.target.value as AppType })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="website">URL WebWrapper</option>
                    <option value="html_frontend">Local HTML/SPA Frontend</option>
                    <option value="nodejs">On-Device Node.js 18.20 Server</option>
                    <option value="php">On-Device PHP 8.4 Server</option>
                    <option value="python">On-Device Python 3.14 Server</option>
                    <option value="go">On-Device Go 1.26 Binary</option>
                    <option value="wordpress">On-Device WordPress over SQLite</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-mono">Browser Engine</label>
                  <select
                    value={formData.browserEngine}
                    onChange={(e) => setFormData({ ...formData, browserEngine: e.target.value as BrowserEngine })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="webview">System WebView (Default)</option>
                    <option value="geckoview">GeckoView Firefox Engine (ECH / SNI Encrypted)</option>
                  </select>
                </div>
              </div>

              {formData.appType === "website" && (
                <div className="space-y-1">
                  <label className="text-slate-400 font-mono">Target Website URL</label>
                  <input
                    type="url"
                    value={formData.targetUrl || ""}
                    onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Target SDK Banner */}
              <div className="bg-cyan-950/40 border border-cyan-500/30 p-4 rounded-xl text-cyan-300 font-mono text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Target SDK Pinning: 28 (On-Device Fork+Exec)
                </div>
                <p className="text-slate-300">
                  {t.targetSdkInfo}
                </p>
              </div>

              {/* Permissions Pruning */}
              <div className="space-y-2">
                <label className="text-slate-300 font-mono font-bold block">
                  Permissions Pruning (Remove Unneeded Permissions from AndroidManifest):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availablePermissions.map((perm) => {
                    const isPruned = formData.permissionsPruned?.includes(perm);
                    return (
                      <button
                        type="button"
                        key={perm}
                        onClick={() => handleTogglePermission(perm)}
                        className={`p-2.5 rounded-xl border font-mono text-[11px] text-left transition-colors flex items-center justify-between ${
                          isPruned
                            ? "bg-red-500/10 text-red-400 border-red-500/40"
                            : "bg-slate-950 text-slate-300 border-slate-800"
                        }`}
                      >
                        <span>{perm}</span>
                        <span className="text-[10px] font-bold">{isPruned ? "PRUNED" : "KEEP"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* NETWORK TAB */}
          {activeTab === "network" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <h4 className="font-bold text-slate-200 font-mono">DNS-over-HTTPS (DoH)</h4>
                  <p className="text-slate-400">Encrypt DNS queries against ISP hijacking</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.enableDoH}
                  onChange={(e) => setFormData({ ...formData, enableDoH: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 cursor-pointer"
                />
              </div>

              {formData.enableDoH && (
                <div className="space-y-1">
                  <label className="text-slate-400 font-mono">DoH Resolver Provider</label>
                  <select
                    value={formData.dohProvider}
                    onChange={(e) => setFormData({ ...formData, dohProvider: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Cloudflare (1.1.1.1)">Cloudflare DoH (1.1.1.1)</option>
                    <option value="Google DoH (8.8.8.8)">Google DoH (8.8.8.8)</option>
                    <option value="AdGuard Anti-Ad (94.140.14.14)">AdGuard Anti-Ad DoH</option>
                    <option value="Quad9 Secure (9.9.9.9)">Quad9 Secure DoH</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <h4 className="font-bold text-slate-200 font-mono">Encrypted Client Hello (ECH)</h4>
                  <p className="text-slate-400">Encrypts Server Name Indication (SNI) via GeckoView</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.enableEch}
                  onChange={(e) => setFormData({ ...formData, enableEch: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <h4 className="font-bold text-slate-200 font-mono">CORS Header Bypass Relay</h4>
                  <p className="text-slate-400">Allows cross-origin requests for single-page apps</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.enableCorsBypass}
                  onChange={(e) => setFormData({ ...formData, enableCorsBypass: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono">TLS Fingerprint Template (JA3 Spoofing)</label>
                <select
                  value={formData.tlsFingerprint}
                  onChange={(e) => setFormData({ ...formData, tlsFingerprint: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                >
                  <option value="chrome">Chrome 120+ (Default Desktop JA3)</option>
                  <option value="firefox">Firefox 122+ JA3 Profile</option>
                  <option value="safari">Safari 17+ iOS Fingerprint</option>
                </select>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <h4 className="font-bold text-slate-200 font-mono">AES-256-GCM Resource Encryption</h4>
                  <p className="text-slate-400">Encrypts static web bundles and assets in APK storage</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.encryptResources}
                  onChange={(e) => setFormData({ ...formData, encryptResources: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <h4 className="font-bold text-slate-200 font-mono">Anti-Debug & Frida Protection</h4>
                  <p className="text-slate-400">Detects ptrace attachment & memory tampering</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.antiDebug}
                  onChange={(e) => setFormData({ ...formData, antiDebug: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <h4 className="font-bold text-slate-200 font-mono">50+ Vector Browser Fingerprint Disguise</h4>
                  <p className="text-slate-400">Spoofs user-agent, WebGL renderer, battery state & model</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.deviceDisguise}
                  onChange={(e) => setFormData({ ...formData, deviceDisguise: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* CUSTOM CODE TAB */}
          {activeTab === "custom_code" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono">Injected CSS Styles:</label>
                <textarea
                  value={formData.customCss || ""}
                  onChange={(e) => setFormData({ ...formData, customCss: e.target.value })}
                  rows={4}
                  placeholder="/* CSS code injected into WebView on page load */"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono">Injected JavaScript Script:</label>
                <textarea
                  value={formData.customJs || ""}
                  onChange={(e) => setFormData({ ...formData, customJs: e.target.value })}
                  rows={4}
                  placeholder="// JS script executed on DOMContentLoaded"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Save Action */}
          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-mono"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-mono font-bold flex items-center space-x-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>{t.save}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
