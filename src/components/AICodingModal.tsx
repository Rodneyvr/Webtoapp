import React, { useState } from "react";
import { Sparkles, Code2, Terminal, Play, Plus, Check, RefreshCw, X, FileCode2 } from "lucide-react";
import { WebAppConfig, LanguageCode } from "../types";
import { translations } from "../i18n/translations";

interface AICodingModalProps {
  currentLang: LanguageCode;
  onClose: () => void;
  onAppCreated: (newApp: WebAppConfig) => void;
}

export const AICodingModal: React.FC<AICodingModalProps> = ({
  currentLang,
  onClose,
  onAppCreated,
}) => {
  const t = translations[currentLang];
  const [prompt, setPrompt] = useState("");
  const [targetType, setTargetType] = useState<"webapp" | "userscript" | "server">("webapp");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ appName: string; description: string; code: string; icon?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [saved, setSaved] = useState(false);

  const samplePrompts = [
    "A sleek personal expense & budget tracker with dark mode and chart summaries",
    "Retro 80s arcade Pong game with touch controls",
    "On-device Node.js REST API with memory stats and JSON status endpoints",
    "Tampermonkey userscript for auto dark theme on web pages"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    setSaved(false);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, targetType }),
      });

      const data = await response.json();
      if (data.success && data.result) {
        setResult(data.result);
        setActiveTab("preview");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    if (!result) return;

    const newApp: WebAppConfig = {
      id: `ai-app-${Date.now()}`,
      name: result.appName || "AI Generated App",
      packageName: `com.shiaho.ai.${(result.appName || "app").toLowerCase().replace(/[^a-z0-9]/g, "")}`,
      versionName: "1.0.0",
      versionCode: 1,
      icon: result.icon || "Zap",
      appType: targetType === "server" ? "nodejs" : "html_frontend",
      port: targetType === "server" ? 8080 : undefined,
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
      permissionsPruned: [],
      enabledModules: ["vconsole-inspector"],
      enabledExtensions: [],
      localCode: result.code,
      createdAt: new Date().toISOString().split("T")[0],
      status: "running"
    };

    onAppCreated(newApp);
    setSaved(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg font-mono flex items-center gap-2">
                {t.aiCoding} Workshop
                <span className="text-xs bg-purple-500/20 text-purple-300 font-sans px-2 py-0.5 rounded-full border border-purple-500/30">
                  Gemini AI
                </span>
              </h3>
              <p className="text-xs text-slate-400">Prompt-driven creation of web apps, server runtimes, & userscripts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Output Mode Switcher */}
          <div className="flex items-center space-x-3">
            {[
              { id: "webapp", label: "Web Application (HTML/JS/CSS)", icon: Code2 },
              { id: "server", label: "Local Node.js/Python Server", icon: Terminal },
              { id: "userscript", label: "Browser Userscript (GM_*)", icon: FileCode2 },
            ].map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setTargetType(type.id as any)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                    targetType === type.id
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/50"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold text-slate-300">
              Describe your desired app or runtime logic:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.aiPromptPlaceholder}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono transition-colors"
            />
          </div>

          {/* Prompt Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-slate-400">Quick Prompts:</span>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(p)}
                  className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800 transition-colors text-left"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs font-mono rounded-2xl flex items-center justify-center space-x-2 shadow-lg transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t.generating}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.generateAppBtn}</span>
              </>
            )}
          </button>

          {/* Result Output Preview */}
          {result && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden space-y-3">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200 text-sm font-mono">{result.appName}</h4>
                  <p className="text-xs text-slate-400">{result.description}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab("code")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                      activeTab === "code" ? "bg-purple-500/20 text-purple-300 font-bold" : "text-slate-400"
                    }`}
                  >
                    Source Code
                  </button>
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                      activeTab === "preview" ? "bg-purple-500/20 text-purple-300 font-bold" : "text-slate-400"
                    }`}
                  >
                    Interactive Preview
                  </button>
                </div>
              </div>

              {activeTab === "code" ? (
                <div className="p-4 max-h-64 overflow-y-auto font-mono text-xs text-emerald-400 bg-slate-950/90 whitespace-pre-wrap">
                  {result.code}
                </div>
              ) : (
                <div className="p-4 bg-slate-950">
                  {targetType === "webapp" ? (
                    <iframe
                      srcDoc={result.code}
                      className="w-full h-64 bg-slate-900 rounded-xl border border-slate-800"
                      title="AI Preview"
                    />
                  ) : (
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-amber-300">
                      [On-Device Runtime Handler Ready]
                      <br />
                      Executable code will be run on port 8080 when installed to WebToApp project workshop.
                    </div>
                  )}
                </div>
              )}

              {/* Install Action */}
              <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  Ready to add to your WebToApp project workspace
                </span>
                <button
                  onClick={handleCreateProject}
                  disabled={saved}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center space-x-2 transition-all ${
                    saved
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-md"
                  }`}
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to My Apps</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create WebToApp Project</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
