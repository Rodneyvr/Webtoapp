import React, { useState } from "react";
import {
  Smartphone,
  X,
  RotateCw,
  Lock,
  Globe,
  Terminal,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Battery,
  Layers,
  Code2
} from "lucide-react";
import { WebAppConfig, LanguageCode } from "../types";
import { translations } from "../i18n/translations";

interface LivePreviewModalProps {
  app: WebAppConfig;
  currentLang: LanguageCode;
  onClose: () => void;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({
  app,
  currentLang,
  onClose,
}) => {
  const t = translations[currentLang];
  const [showConsole, setShowConsole] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    `[WebToApp Shell] Mounting app: ${app.name} (${app.packageName})`,
    `[Engine] Initializing ${app.browserEngine === "geckoview" ? "GeckoView (Firefox ECH/SNI Encrypted)" : "System WebView"}`,
    app.enableDoH ? `[DoH Resolver] Connected to ${app.dohProvider}` : `[DNS] Standard System DNS`,
    app.port ? `[Server Runtime] Bounded local socket on http://localhost:${app.port}` : `[Web] Rendering web view bundle...`,
    `[CORS Relay] Header rewriting enabled`
  ]);

  const appUrl = app.targetUrl || (app.port ? `http://localhost:${app.port}` : "http://localhost:3000");

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-sm w-full bg-slate-950 rounded-[48px] p-4 border-[6px] border-slate-800 shadow-2xl space-y-3">
        
        {/* Phone Notch & Status Bar */}
        <div className="flex items-center justify-between px-6 pt-2 text-[10px] font-mono text-slate-400">
          <span>03:45</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto border border-slate-800" />
          <div className="flex items-center space-x-1.5">
            <Wifi className="w-3 h-3 text-cyan-400" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Browser Top Navigation Bar */}
        <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <button onClick={onClose} className="p-1 hover:text-white">
                <X className="w-4 h-4 text-red-400" />
              </button>
              <button className="p-1 hover:text-white">
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>

            <div className="flex items-center space-x-1 text-[10px] bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 text-slate-300">
              <Lock className="w-2.5 h-2.5 text-emerald-400" />
              <span className="truncate max-w-[120px] font-mono">{appUrl}</span>
            </div>

            <button
              onClick={() => setShowConsole(!showConsole)}
              className={`p-1 rounded font-mono text-[10px] ${showConsole ? "text-cyan-400 font-bold" : "text-slate-400"}`}
              title="Toggle DevTools Console"
            >
              <Terminal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Screen Content Viewport */}
        <div className="bg-slate-900 rounded-3xl h-[520px] overflow-hidden border border-slate-800 relative flex flex-col">
          
          {app.localCode ? (
            <iframe
              srcDoc={app.localCode}
              className="w-full h-full border-none bg-slate-950"
              title={app.name}
            />
          ) : app.targetUrl ? (
            <iframe
              src={app.targetUrl}
              className="w-full h-full border-none bg-slate-950"
              title={app.name}
            />
          ) : (
            <div className="p-6 bg-slate-950 h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Smartphone className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-100 font-mono text-sm">{app.name}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  On-Device Server Runtime bounded on port {app.port || 8080}
                </p>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400">
                HTTP/1.1 200 OK • Process Active
              </div>
            </div>
          )}

          {/* Collapsible On-Device DevTools Console Drawer */}
          {showConsole && (
            <div className="absolute bottom-0 inset-x-0 h-48 bg-slate-950/95 border-t border-slate-800 p-3 font-mono text-[10px] text-slate-300 space-y-1 overflow-y-auto">
              <div className="text-cyan-400 font-bold pb-1 border-b border-slate-800 flex justify-between">
                <span>WebToApp DevTools Console</span>
                <span className="text-slate-500">vConsole 3.15</span>
              </div>
              {consoleLogs.map((log, idx) => (
                <div key={idx} className="leading-tight">
                  <span className="text-slate-500">&gt;</span> {log}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Phone Home Pill Indicator */}
        <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto" />

      </div>
    </div>
  );
};
