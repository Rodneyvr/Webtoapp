/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { WebAppConfig, LanguageCode } from "./types";
import { defaultApps } from "./data/initialApps";
import { languages } from "./i18n/translations";
import { Navbar } from "./components/Navbar";
import { AppsHome } from "./components/AppsHome";
import { AICodingModal } from "./components/AICodingModal";
import { AppEditorModal } from "./components/AppEditorModal";
import { BuildAPKModal } from "./components/BuildAPKModal";
import { ModuleMarket } from "./components/ModuleMarket";
import { PortManager } from "./components/PortManager";
import { NetworkStack } from "./components/NetworkStack";
import { LivePreviewModal } from "./components/LivePreviewModal";
import { AboutScreen } from "./components/AboutScreen";
import { NewAppModal } from "./components/NewAppModal";

export default function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>("en");
  const [activeTab, setActiveTab] = useState<string>("apps");
  const [apps, setApps] = useState<WebAppConfig[]>(defaultApps);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);

  // Installed Modules & Chrome Extensions
  const [installedModuleIds, setInstalledModuleIds] = useState<string[]>([
    "adblock-ultra",
    "vconsole-inspector"
  ]);
  const [installedExtensionIds, setInstalledExtensionIds] = useState<string[]>([
    "cjpalhdlnbpafiamejdnhcphjbkeiagm"
  ]);

  // Modals
  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const [showAICodingModal, setShowAICodingModal] = useState(false);
  const [editingApp, setEditingApp] = useState<WebAppConfig | null>(null);
  const [buildingApp, setBuildingApp] = useState<WebAppConfig | null>(null);
  const [previewingApp, setPreviewingApp] = useState<WebAppConfig | null>(null);

  // Handle RTL direction when Arabic is selected
  useEffect(() => {
    const selected = languages.find((l) => l.code === currentLang);
    if (selected && selected.dir === "rtl") {
      document.documentElement.setAttribute("dir", "rtl");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
    }
  }, [currentLang]);

  // App Actions
  const handleCreateApp = (newApp: WebAppConfig) => {
    setApps([newApp, ...apps]);
    setShowNewAppModal(false);
  };

  const handleAICreatedApp = (newApp: WebAppConfig) => {
    setApps([newApp, ...apps]);
  };

  const handleSaveEditedApp = (updatedApp: WebAppConfig) => {
    setApps(apps.map((a) => (a.id === updatedApp.id ? updatedApp : a)));
    setEditingApp(null);
  };

  const handleDeleteApp = (appId: string) => {
    if (confirm("Are you sure you want to delete this WebToApp project?")) {
      setApps(apps.filter((a) => a.id !== appId));
    }
  };

  const handleBatchDeleteApps = (appIds: string[]) => {
    if (!appIds || appIds.length === 0) return;
    const confirmMsg =
      appIds.length === 1
        ? "Are you sure you want to delete this WebToApp project?"
        : `Are you sure you want to delete the ${appIds.length} selected projects?`;
    if (confirm(confirmMsg)) {
      setApps(apps.filter((a) => !appIds.includes(a.id)));
    }
  };

  const handleToggleRunApp = (appId: string) => {
    setApps(
      apps.map((a) => {
        if (a.id === appId) {
          const nextStatus = a.status === "running" ? "stopped" : "running";
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  const handleToggleInstallModule = (moduleId: string) => {
    const list = installedModuleIds || [];
    if (list.includes(moduleId)) {
      setInstalledModuleIds(list.filter((id) => id !== moduleId));
    } else {
      setInstalledModuleIds([...list, moduleId]);
    }
  };

  const handleToggleInstallExtension = (extId: string) => {
    const list = installedExtensionIds || [];
    if (list.includes(extId)) {
      setInstalledExtensionIds(list.filter((id) => id !== extId));
    } else {
      setInstalledExtensionIds([...list, extId]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      
      {/* Top Navbar */}
      <Navbar
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isPhoneFrame={isPhoneFrame}
        onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
      />

      {/* Main Body Container (Supports Phone Frame Container or Responsive Workbench) */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {isPhoneFrame ? (
          <div className="max-w-md mx-auto bg-slate-900 border-[8px] border-slate-800 rounded-[48px] p-4 shadow-2xl space-y-4">
            <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto border border-slate-800" />
            
            <div className="space-y-6">
              {activeTab === "apps" && (
                <AppsHome
                  apps={apps}
                  currentLang={currentLang}
                  onOpenNewAppModal={() => setShowNewAppModal(true)}
                  onOpenAICoding={() => setShowAICodingModal(true)}
                  onOpenModuleMarket={() => setActiveTab("modules")}
                  onOpenPortManager={() => setActiveTab("ports")}
                  onEditApp={(app) => setEditingApp(app)}
                  onBuildApp={(app) => setBuildingApp(app)}
                  onPreviewApp={(app) => setPreviewingApp(app)}
                  onDeleteApp={handleDeleteApp}
                  onDeleteApps={handleBatchDeleteApps}
                  onToggleRunApp={handleToggleRunApp}
                />
              )}

              {activeTab === "ai" && (
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-3">
                  <h3 className="font-bold text-slate-100">AI Coding Workshop</h3>
                  <button
                    onClick={() => setShowAICodingModal(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-mono font-bold"
                  >
                    Open Gemini Prompt Generator
                  </button>
                </div>
              )}

              {activeTab === "modules" && (
                <ModuleMarket
                  currentLang={currentLang}
                  installedModuleIds={installedModuleIds}
                  installedExtensionIds={installedExtensionIds}
                  onToggleInstallModule={handleToggleInstallModule}
                  onToggleInstallExtension={handleToggleInstallExtension}
                />
              )}

              {activeTab === "ports" && <PortManager currentLang={currentLang} />}
              {activeTab === "network" && <NetworkStack currentLang={currentLang} />}
              {activeTab === "about" && <AboutScreen currentLang={currentLang} />}
            </div>

            <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto" />
          </div>
        ) : (
          <>
            {activeTab === "apps" && (
              <AppsHome
                apps={apps}
                currentLang={currentLang}
                onOpenNewAppModal={() => setShowNewAppModal(true)}
                onOpenAICoding={() => setShowAICodingModal(true)}
                onOpenModuleMarket={() => setActiveTab("modules")}
                onOpenPortManager={() => setActiveTab("ports")}
                onEditApp={(app) => setEditingApp(app)}
                onBuildApp={(app) => setBuildingApp(app)}
                onPreviewApp={(app) => setPreviewingApp(app)}
                onDeleteApp={handleDeleteApp}
                onDeleteApps={handleBatchDeleteApps}
                onToggleRunApp={handleToggleRunApp}
              />
            )}

            {activeTab === "ai" && (
              <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <h2 className="text-xl font-bold font-mono text-purple-400">Gemini AI Prompt-Driven Generator</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Create single-page apps, userscripts, or Node.js / Python server scripts with AI code generation.
                </p>
                <button
                  onClick={() => setShowAICodingModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold font-mono text-xs rounded-2xl shadow-xl transition-all"
                >
                  Launch AI Generator
                </button>
              </div>
            )}

            {activeTab === "modules" && (
              <ModuleMarket
                currentLang={currentLang}
                installedModuleIds={installedModuleIds}
                installedExtensionIds={installedExtensionIds}
                onToggleInstallModule={handleToggleInstallModule}
                onToggleInstallExtension={handleToggleInstallExtension}
              />
            )}

            {activeTab === "ports" && <PortManager currentLang={currentLang} />}
            {activeTab === "network" && <NetworkStack currentLang={currentLang} />}
            {activeTab === "about" && <AboutScreen currentLang={currentLang} />}
          </>
        )}
      </main>

      {/* MODALS */}
      {showNewAppModal && (
        <NewAppModal
          currentLang={currentLang}
          onClose={() => setShowNewAppModal(false)}
          onCreate={handleCreateApp}
        />
      )}

      {showAICodingModal && (
        <AICodingModal
          currentLang={currentLang}
          onClose={() => setShowAICodingModal(false)}
          onAppCreated={handleAICreatedApp}
        />
      )}

      {editingApp && (
        <AppEditorModal
          app={editingApp}
          currentLang={currentLang}
          onClose={() => setEditingApp(null)}
          onSave={handleSaveEditedApp}
        />
      )}

      {buildingApp && (
        <BuildAPKModal
          app={buildingApp}
          currentLang={currentLang}
          onClose={() => setBuildingApp(null)}
        />
      )}

      {previewingApp && (
        <LivePreviewModal
          app={previewingApp}
          currentLang={currentLang}
          onClose={() => setPreviewingApp(null)}
        />
      )}

      {/* Telemetry Status Footer */}
      <footer className="bg-slate-900 px-6 py-3 border-t border-slate-800 flex flex-wrap justify-between items-center text-xs text-slate-400 font-mono gap-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-semibold">ON-DEVICE ENGINE:</span>
            <span className="text-emerald-400 font-bold">READY</span>
          </div>
          <span className="hidden sm:inline text-slate-700">|</span>
          <div className="hidden sm:flex items-center space-x-2 text-slate-400">
            <span>Target SDK: <span className="text-slate-200 font-semibold">28 (Android 9.0+)</span></span>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-[11px]">
          <div>
            Build Engine: <span className="bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700 font-bold">ON-DEVICE (APK/AAB)</span>
          </div>
          <div className="hidden md:block">
            Signer: <span className="text-slate-200">v1 / v2 / v3 Active</span>
          </div>
          <div className="hidden lg:flex items-center space-x-3 text-slate-500">
            <span>CPU: <span className="text-slate-300 font-bold">12%</span></span>
            <span>RAM: <span className="text-slate-300 font-bold">1.2GB / 8GB</span></span>
          </div>
        </div>
      </footer>

    </div>
  );
}
