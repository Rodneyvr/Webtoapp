import React, { useState, useEffect } from "react";
import {
  Layers,
  Search,
  Download,
  Check,
  Star,
  Users,
  Code2,
  ShieldCheck,
  Globe,
  Chrome,
  ExternalLink,
  Award
} from "lucide-react";
import { ModuleItem, ChromeExtensionItem, LanguageCode } from "../types";
import { translations } from "../i18n/translations";

interface ModuleMarketProps {
  currentLang: LanguageCode;
  installedModuleIds: string[];
  installedExtensionIds: string[];
  onToggleInstallModule: (moduleId: string) => void;
  onToggleInstallExtension: (extId: string) => void;
}

export const ModuleMarket: React.FC<ModuleMarketProps> = ({
  currentLang,
  installedModuleIds = [],
  installedExtensionIds = [],
  onToggleInstallModule,
  onToggleInstallExtension,
}) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<"modules" | "chrome_store">("modules");
  
  // Community Modules State
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [searchModulesQuery, setSearchModulesQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Chrome Store State
  const [chromeExtensions, setChromeExtensions] = useState<ChromeExtensionItem[]>([]);
  const [searchChromeQuery, setSearchChromeQuery] = useState("");
  const [searchingChrome, setSearchingChrome] = useState(false);

  useEffect(() => {
    // Fetch community modules
    fetch("/api/modules")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.catalog)) setModules(data.catalog);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Search Chrome Web Store
    setSearchingChrome(true);
    fetch(`/api/chrome-store/search?q=${encodeURIComponent(searchChromeQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.results)) setChromeExtensions(data.results);
      })
      .catch(console.error)
      .finally(() => setSearchingChrome(false));
  }, [searchChromeQuery]);

  const filteredModules = (modules || []).filter((mod) => {
    if (!mod) return false;
    const nameStr = mod.name || "";
    const descStr = mod.description || "";
    const catStr = mod.category || "";
    const q = (searchModulesQuery || "").toLowerCase();

    const matchesSearch =
      nameStr.toLowerCase().includes(q) ||
      descStr.toLowerCase().includes(q) ||
      catStr.toLowerCase().includes(q);

    if (selectedCategory === "all") return matchesSearch;
    return matchesSearch && catStr.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Sub-Navigation Tabs */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            WebToApp Extension & Storefront Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            GitHub-backed JS/CSS community catalog & Live Chrome Web Store (MV3) installer
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab("modules")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 ${
              activeTab === "modules"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Community JS/CSS Modules</span>
          </button>

          <button
            onClick={() => setActiveTab("chrome_store")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 ${
              activeTab === "chrome_store"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Chrome className="w-4 h-4" />
            <span>Chrome MV3 Web Store</span>
          </button>
        </div>
      </div>

      {/* COMMUNITY MODULES TAB */}
      {activeTab === "modules" && (
        <div className="space-y-6">
          
          {/* Top Contributor Leaderboard Bar */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <h4 className="font-bold text-slate-200 text-xs font-mono">{t.contributorsLeaderboard}</h4>
                <p className="text-[11px] text-slate-400">PR Submissions & Contributor Stack</p>
              </div>
            </div>

            <div className="flex items-center -space-x-2">
              {["shiaho", "cyber_pixel", "net_master", "touch_wizard", "sec_guru"].map((name, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-900 shadow-md"
                  title={name}
                >
                  {name.slice(0, 2).toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          {/* Search & Categories */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchModulesQuery}
                onChange={(e) => setSearchModulesQuery(e.target.value)}
                placeholder={t.searchModules}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {["all", "Anti-Ads", "UI Themes", "CORS Bypass", "Developer Tools", "App Experience"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-slate-800 text-indigo-400 border border-indigo-500/40 font-semibold"
                      : "text-slate-400 hover:text-slate-200 bg-slate-950/50"
                  }`}
                >
                  {cat === "all" ? "All Categories" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredModules.map((mod) => {
              const isInstalled = (installedModuleIds || []).includes(mod.id);

              return (
                <div
                  key={mod.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30">
                        {mod.category}
                      </span>
                      <h4 className="font-bold text-slate-100 text-sm font-mono mt-1">{mod.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{mod.description}</p>
                    </div>

                    <button
                      onClick={() => onToggleInstallModule(mod.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                        isInstalled
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
                      }`}
                    >
                      {isInstalled ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{t.installed}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Install</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Metadata & Code Preview */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" /> {mod.rating}
                      </span>
                      <span>{mod.downloads.toLocaleString()} DLs</span>
                      <span>By @{mod.author}</span>
                    </div>
                    <span className="text-slate-500">v{mod.version}</span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* CHROME STORE TAB */}
      {activeTab === "chrome_store" && (
        <div className="space-y-6">
          
          {/* Live Search Input */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-xs font-mono font-semibold text-slate-300">
              Live Chrome Web Store Search (MV3 Extension Pipeline):
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchChromeQuery}
                onChange={(e) => setSearchChromeQuery(e.target.value)}
                placeholder={t.searchExtensions}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono transition-colors"
              />
            </div>
          </div>

          {/* Chrome Extensions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(chromeExtensions || []).map((ext) => {
              if (!ext) return null;
              const isInstalled = (installedExtensionIds || []).includes(ext.id);

              return (
                <div
                  key={ext.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                        <Chrome className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100 text-sm font-mono">{ext.name}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">v{ext.version} • Manifest V3</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleInstallExtension(ext.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                        isInstalled
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-blue-600 hover:bg-blue-500 text-white shadow-md"
                      }`}
                    >
                      {isInstalled ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Installed</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Install CRX</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{ext.description}</p>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" /> {ext.rating}
                    </span>
                    <span>{ext.users} Users</span>
                    <span className="text-cyan-400">Verified CRX3</span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
