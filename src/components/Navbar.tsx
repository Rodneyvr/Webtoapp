import React from "react";
import {
  Smartphone,
  Globe,
  Cpu,
  HardDrive,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Layers,
  Info
} from "lucide-react";
import { LanguageCode } from "../types";
import { languages, translations } from "../i18n/translations";

interface NavbarProps {
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onSelectLang,
  activeTab,
  onSelectTab,
  isPhoneFrame,
  onTogglePhoneFrame,
}) => {
  const t = translations[currentLang];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab("apps")}>
            <div className="bg-emerald-500 w-9 h-9 rounded-xl flex items-center justify-center font-black text-slate-950 text-xs shadow-lg shadow-emerald-500/20 tracking-tighter">
              W2A
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white font-mono">
                  Web<span className="text-emerald-400">To</span>App
                </span>
                <span className="text-slate-500 font-normal text-xs italic hidden sm:inline">
                  v4.2.0-stable
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block truncate max-w-xs">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Quick Telemetry & Status Badges */}
          <div className="hidden lg:flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700 text-slate-300">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">Proxy: Active (DoH)</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>apksig V1/V2/V3</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.storageUsage}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Phone Frame View Toggle */}
            <button
              onClick={onTogglePhoneFrame}
              className={`p-2 rounded-xl text-xs font-medium border transition-all flex items-center space-x-1.5 ${
                isPhoneFrame
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
              title="Toggle Mobile Simulator Frame"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden md:inline">{isPhoneFrame ? "Mobile View" : "Desktop View"}</span>
            </button>

            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200 transition-colors">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>{languages.find((l) => l.code === currentLang)?.nativeName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 hidden group-hover:block z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  {t.languageSelect} (10 Languages)
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => onSelectLang(lang.code)}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      currentLang === lang.code ? "text-emerald-400 font-bold bg-emerald-500/10" : "text-slate-300"
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] text-slate-500">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Primary Module Navigation Tabs */}
      <div className="bg-slate-950/90 border-t border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-1.5 overflow-x-auto py-2.5 no-scrollbar">
          
          <button
            onClick={() => onSelectTab("apps")}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === "apps"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t.myApps}</span>
          </button>

          <button
            onClick={() => onSelectTab("ai")}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === "ai"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.aiCoding}</span>
          </button>

          <button
            onClick={() => onSelectTab("modules")}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === "modules"
                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.extensionModules}</span>
          </button>

          <button
            onClick={() => onSelectTab("ports")}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === "ports"
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{t.portManager}</span>
          </button>

          <button
            onClick={() => onSelectTab("network")}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === "network"
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.networkStack}</span>
          </button>

          <button
            onClick={() => onSelectTab("about")}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === "about"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>{t.about}</span>
          </button>

        </div>
      </div>
    </header>
  );
};
