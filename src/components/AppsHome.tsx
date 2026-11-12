import React, { useState } from "react";
import {
  Smartphone,
  Plus,
  Search,
  Settings,
  Hammer,
  Play,
  Square,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  Terminal,
  ExternalLink,
  Trash2,
  Globe,
  Server,
  Gamepad2,
  Zap,
  CheckCircle2,
  FileCode2,
  Share2,
  CheckSquare
} from "lucide-react";
import { WebAppConfig, LanguageCode, AppType } from "../types";
import { translations } from "../i18n/translations";

interface AppsHomeProps {
  apps: WebAppConfig[];
  currentLang: LanguageCode;
  onOpenNewAppModal: () => void;
  onOpenAICoding: () => void;
  onOpenModuleMarket: () => void;
  onOpenPortManager: () => void;
  onEditApp: (app: WebAppConfig) => void;
  onBuildApp: (app: WebAppConfig) => void;
  onPreviewApp: (app: WebAppConfig) => void;
  onDeleteApp: (appId: string) => void;
  onDeleteApps?: (appIds: string[]) => void;
  onToggleRunApp: (appId: string) => void;
}

export const AppsHome: React.FC<AppsHomeProps> = ({
  apps,
  currentLang,
  onOpenNewAppModal,
  onOpenAICoding,
  onOpenModuleMarket,
  onOpenPortManager,
  onEditApp,
  onBuildApp,
  onPreviewApp,
  onDeleteApp,
  onDeleteApps,
  onToggleRunApp,
}) => {
  const t = translations[currentLang];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);

  // Keep selected IDs filtered to valid apps currently in list
  const validSelectedAppIds = selectedAppIds.filter((id) =>
    (apps || []).some((a) => a.id === id)
  );

  const filteredApps = (apps || []).filter((app) => {
    if (!app) return false;
    const nameStr = app.name || "";
    const packageStr = app.packageName || "";
    const urlStr = app.targetUrl || "";
    const q = (searchQuery || "").toLowerCase();

    const matchesSearch =
      nameStr.toLowerCase().includes(q) ||
      packageStr.toLowerCase().includes(q) ||
      (typeof urlStr === "string" && urlStr.toLowerCase().includes(q));

    if (selectedCategory === "all") return matchesSearch;
    if (selectedCategory === "server") return matchesSearch && ["nodejs", "php", "python", "go", "wordpress"].includes(app.appType);
    if (selectedCategory === "frontend") return matchesSearch && ["html_frontend", "media_gallery", "multi_web"].includes(app.appType);
    if (selectedCategory === "website") return matchesSearch && app.appType === "website";
    return matchesSearch;
  });

  const toggleSelectApp = (id: string, e?: React.MouseEvent | React.ChangeEvent) => {
    if (e && "stopPropagation" in e) e.stopPropagation();
    setSelectedAppIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllVisibleSelected =
    filteredApps.length > 0 &&
    filteredApps.every((a) => validSelectedAppIds.includes(a.id));

  const handleToggleSelectAll = () => {
    if (isAllVisibleSelected) {
      const visibleIds = new Set(filteredApps.map((a) => a.id));
      setSelectedAppIds((prev) => prev.filter((id) => !visibleIds.has(id)));
    } else {
      const visibleIds = filteredApps.map((a) => a.id);
      setSelectedAppIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleDeleteSelected = () => {
    if (validSelectedAppIds.length === 0) return;
    const count = validSelectedAppIds.length;
    const confirmMessage =
      count === 1
        ? "Are you sure you want to delete the selected project?"
        : `Are you sure you want to delete the ${count} selected projects?`;

    if (window.confirm(confirmMessage)) {
      if (onDeleteApps) {
        onDeleteApps(validSelectedAppIds);
      } else {
        validSelectedAppIds.forEach((id) => onDeleteApp(id));
      }
      setSelectedAppIds([]);
    }
  };

  const handleDeselectAll = () => {
    setSelectedAppIds([]);
  };


  const getAppIcon = (iconName: string, type: AppType) => {
    switch (iconName) {
      case "Server":
        return <Server className="w-6 h-6 text-emerald-400" />;
      case "Globe":
        return <Globe className="w-6 h-6 text-blue-400" />;
      case "Cpu":
        return <Cpu className="w-6 h-6 text-amber-400" />;
      case "Gamepad2":
        return <Gamepad2 className="w-6 h-6 text-purple-400" />;
      case "Zap":
        return <Zap className="w-6 h-6 text-cyan-400" />;
      default:
        return <Smartphone className="w-6 h-6 text-cyan-400" />;
    }
  };

  const getAppTypeBadge = (type: AppType) => {
    switch (type) {
      case "nodejs":
        return { label: "Node.js 18.20", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
      case "php":
        return { label: "PHP 8.4", bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30" };
      case "python":
        return { label: "Python 3.14", bg: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
      case "go":
        return { label: "Go 1.26", bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" };
      case "wordpress":
        return { label: "WordPress SQLite", bg: "bg-blue-500/10 text-blue-400 border-blue-500/30" };
      case "html_frontend":
        return { label: "Local Frontend", bg: "bg-purple-500/10 text-purple-400 border-purple-500/30" };
      case "website":
        return { label: "URL WebView", bg: "bg-sky-500/10 text-sky-400 border-sky-500/30" };
      default:
        return { label: "Web App", bg: "bg-slate-500/10 text-slate-400 border-slate-500/30" };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Bar with Action Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Projects</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Manage, build and package on-device mobile applications</p>
        </div>
        <button
          onClick={onOpenNewAppModal}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 text-xs sm:text-sm transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Create New Project</span>
        </button>
      </div>

      {/* Main Toolbox Hero Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* AI Coding Workshop */}
        <div
          onClick={onOpenAICoding}
          className="group relative bg-blue-600/10 border border-blue-500/30 hover:border-blue-500/60 p-5 rounded-3xl cursor-pointer transition-all hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm font-mono flex items-center gap-1.5">
                {t.aiCoding}
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full">Gemini</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Prompt-driven app generator</p>
            </div>
          </div>
        </div>

        {/* Extension Modules Market */}
        <div
          onClick={onOpenModuleMarket}
          className="group relative bg-violet-600/10 border border-violet-500/30 hover:border-violet-500/60 p-5 rounded-3xl cursor-pointer transition-all hover:shadow-xl hover:shadow-violet-500/10 overflow-hidden"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm font-mono">{t.extensionModules}</h3>
              <p className="text-xs text-slate-400 mt-0.5">JS Modules & Chrome MV3 Store</p>
            </div>
          </div>
        </div>

        {/* Port Manager */}
        <div
          onClick={onOpenPortManager}
          className="group relative bg-emerald-600/10 border border-emerald-500/30 hover:border-emerald-500/60 p-5 rounded-3xl cursor-pointer transition-all hover:shadow-xl hover:shadow-emerald-500/10 overflow-hidden"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm font-mono">{t.portManager}</h3>
              <p className="text-xs text-slate-400 mt-0.5">On-device sockets & processes</p>
            </div>
          </div>
        </div>

      </div>

      {/* Filter, Search & Batch Management Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-slate-900 p-4 rounded-3xl border border-slate-800">
          
          {/* Search Input & Select All Toolbar Group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchApps}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
            </div>

            {/* Select All Checkbox in Toolbar */}
            <label
              className={`flex items-center space-x-2 px-3 py-2.5 rounded-2xl border text-xs font-mono select-none transition-colors cursor-pointer ${
                isAllVisibleSelected
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
              }`}
              title="Select or deselect all visible projects"
            >
              <input
                type="checkbox"
                checked={isAllVisibleSelected}
                disabled={filteredApps.length === 0}
                onChange={handleToggleSelectAll}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 accent-emerald-500 cursor-pointer disabled:cursor-not-allowed"
              />
              <span className="whitespace-nowrap font-medium">
                {isAllVisibleSelected ? "Deselect All" : "Select All"}
                {filteredApps.length > 0 && (
                  <span className="text-slate-500 ml-1">({filteredApps.length})</span>
                )}
              </span>
            </label>

            {/* Delete Selected Button in Toolbar */}
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={validSelectedAppIds.length === 0}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer ${
                validSelectedAppIds.length > 0
                  ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50 shadow-lg shadow-red-500/10 hover:border-red-400 active:scale-95"
                  : "bg-slate-950/60 text-slate-600 border border-slate-800/80 cursor-not-allowed opacity-60"
              }`}
              title={
                validSelectedAppIds.length > 0
                  ? `Delete ${validSelectedAppIds.length} selected project(s)`
                  : "Select projects using checkboxes to delete"
              }
            >
              <Trash2 className="w-4 h-4" />
              <span>
                Delete Selected
                {validSelectedAppIds.length > 0 ? ` (${validSelectedAppIds.length})` : ""}
              </span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-1 lg:pt-0">
            {[
              { id: "all", label: "All Projects" },
              { id: "server", label: "Local Runtimes" },
              { id: "frontend", label: "Frontends & SPAs" },
              { id: "website", label: "URL Wrappers" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold"
                    : "text-slate-400 hover:text-slate-200 bg-slate-950/50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Items Banner Alert if items are selected */}
        {validSelectedAppIds.length > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs font-mono text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong className="font-bold text-white">{validSelectedAppIds.length}</strong> project
                {validSelectedAppIds.length === 1 ? "" : "s"} selected for batch action
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeselectAll}
                className="text-slate-400 hover:text-white underline transition-colors cursor-pointer"
              >
                Clear Selection
              </button>
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 hover:border-red-400 text-red-300 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* App List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => {
          const typeBadge = getAppTypeBadge(app.appType);
          const isRunning = app.status === "running";
          const isSelected = validSelectedAppIds.includes(app.id);

          return (
            <div
              key={app.id}
              className={`rounded-3xl p-6 flex flex-col justify-between shadow-xl transition-all relative overflow-hidden group border ${
                isSelected
                  ? "bg-slate-900 border-emerald-500/60 ring-2 ring-emerald-500/30 shadow-emerald-500/5"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-4">
                {/* Header Info with Select Checkbox */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {/* App Selection Checkbox */}
                    <label
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded-lg hover:bg-slate-800/80 cursor-pointer transition-colors flex items-center justify-center shrink-0"
                      title={isSelected ? "Deselect project" : "Select project"}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => toggleSelectApp(app.id, e)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 accent-emerald-500 cursor-pointer transition-transform hover:scale-110 focus:ring-0 focus:outline-none"
                      />
                    </label>

                    <div className="w-13 h-13 rounded-2xl bg-slate-950 border border-slate-800 p-2.5 flex items-center justify-center shadow-inner shrink-0">
                      {getAppIcon(app.icon, app.appType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-100 text-base font-mono tracking-tight group-hover:text-emerald-400 transition-colors truncate">
                        {app.name}
                      </h4>
                      <span className="text-xs text-slate-500 font-mono block truncate">
                        {app.packageName}
                      </span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <button
                    onClick={() => onToggleRunApp(app.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border flex items-center space-x-1.5 transition-colors shrink-0 ${
                      isRunning
                        ? "bg-slate-800 text-emerald-400 border-slate-700"
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                    }`}
                    title="Toggle Server Runtime"
                  >
                    <span className={`w-2 h-2 rounded-full ${isRunning ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                    <span>{isRunning ? "READY" : "STOPPED"}</span>
                  </button>
                </div>

                {/* Tags & Feature Specs */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                  <span className={`px-2.5 py-1 rounded-md border ${typeBadge.bg}`}>
                    {typeBadge.label}
                  </span>

                  <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                    {app.browserEngine === "geckoview" ? "GeckoView (ECH)" : "WebView"}
                  </span>

                  {app.port && (
                    <span className="bg-slate-800 text-amber-400 px-2.5 py-1 rounded-md border border-slate-700">
                      Port:{app.port}
                    </span>
                  )}
                </div>

                {/* URL or Code snippet peek */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-400 truncate">
                  {app.targetUrl ? (
                    <span className="text-blue-400 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" /> {app.targetUrl}
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
                      Local binary bundle ready
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="pt-4 mt-4 border-t border-slate-800 grid grid-cols-4 gap-2">
                
                {/* Live Preview */}
                <button
                  onClick={() => onPreviewApp(app)}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-medium text-slate-200 transition-colors flex items-center justify-center"
                  title={t.livePreview}
                >
                  Preview
                </button>

                {/* Edit Config */}
                <button
                  onClick={() => onEditApp(app)}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-medium text-slate-200 transition-colors flex items-center justify-center"
                  title={t.editConfig}
                >
                  Edit
                </button>

                {/* Build APK / AAB */}
                <button
                  onClick={() => onBuildApp(app)}
                  className="py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center"
                  title={t.buildApk}
                >
                  Build APK
                </button>

                {/* Delete App */}
                <button
                  onClick={() => {
                    onDeleteApp(app.id);
                    setSelectedAppIds((prev) => prev.filter((id) => id !== app.id));
                  }}
                  className="py-2.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl text-xs font-medium transition-colors flex items-center justify-center cursor-pointer"
                  title={t.deleteApp}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>

            </div>
          );
        })}

        {/* GitHub Import Card Placeholder */}
        <div
          onClick={onOpenNewAppModal}
          className="border-2 border-dashed border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-500 gap-2 hover:border-slate-700 hover:text-slate-300 cursor-pointer transition-all min-h-[220px]"
        >
          <div className="text-4xl font-light text-emerald-400">+</div>
          <span className="font-medium text-xs font-mono">Create New Project or Import Repo</span>
        </div>
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800 space-y-3">
          <Smartphone className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm">No projects found matching your search query.</p>
          <button
            onClick={onOpenNewAppModal}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold font-mono transition-colors"
          >
            Create New Project
          </button>
        </div>
      )}

    </div>
  );
};
