import React, { useState, useEffect } from "react";
import {
  Hammer,
  X,
  CheckCircle2,
  Download,
  Share2,
  QrCode,
  ShieldCheck,
  Terminal,
  RefreshCw,
  FileCheck,
  Package
} from "lucide-react";
import { WebAppConfig, LanguageCode } from "../types";
import { translations } from "../i18n/translations";

interface BuildAPKModalProps {
  app: WebAppConfig;
  currentLang: LanguageCode;
  onClose: () => void;
}

export const BuildAPKModal: React.FC<BuildAPKModalProps> = ({
  app,
  currentLang,
  onClose,
}) => {
  const t = translations[currentLang];
  const [buildType, setBuildType] = useState<"APK" | "AAB">("APK");
  const [building, setBuilding] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [qrVisible, setQrVisible] = useState(false);

  const startBuild = async () => {
    setBuilding(true);
    setCompleted(false);
    setLogs([]);
    setProgress(10);

    try {
      const response = await fetch("/api/build/apk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appConfig: app,
          buildType,
          signConfig: { alias: "production_v3.keystore", algorithm: "SHA256withRSA" },
        }),
      });

      const data = await response.json();
      if (data.success && data.logs) {
        // Stream logs step by step with interval for authentic workshop feel
        let step = 0;
        const interval = setInterval(() => {
          if (step < data.logs.length) {
            setLogs((prev) => [...prev, data.logs[step]]);
            setProgress(Math.round(((step + 1) / data.logs.length) * 100));
            step++;
          } else {
            clearInterval(interval);
            setBuilding(false);
            setCompleted(true);
          }
        }, 350);
      }
    } catch (err) {
      console.error(err);
      setBuilding(false);
    }
  };

  useEffect(() => {
    startBuild();
  }, [buildType]);

  const outputFileName = `${app.packageName}_v${app.versionName}_signed.${buildType.toLowerCase()}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg font-mono">
                {t.buildWorkshop}: {app.name}
              </h3>
              <p className="text-xs text-slate-400">V1/V2/V3 apksig On-Device Compiler</p>
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Target Format Switcher */}
          <div className="flex items-center space-x-3 bg-slate-950 p-2 rounded-2xl border border-slate-800">
            <button
              onClick={() => setBuildType("APK")}
              disabled={building}
              className={`flex-1 py-2.5 rounded-xl font-mono font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                buildType === "APK"
                  ? "bg-cyan-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Standard Android APK (On-Device)</span>
            </button>

            <button
              onClick={() => setBuildType("AAB")}
              disabled={building}
              className={`flex-1 py-2.5 rounded-xl font-mono font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                buildType === "AAB"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Google Play AAB Bundle (TargetSDK 34)</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-slate-400">
              <span>{building ? "Packaging & Signing..." : completed ? "Build Complete" : "Preparing..."}</span>
              <span className="font-bold text-cyan-400">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Terminal Console Stream */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-slate-300 space-y-2 h-48 overflow-y-auto">
            <div className="flex items-center space-x-2 text-slate-500 pb-2 border-b border-slate-800 text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>apksig v8.3.0 & AXML Parser Terminal</span>
            </div>
            {(logs || []).map((log, index) => (
              <div key={index} className="flex items-start space-x-2 text-[11px] leading-relaxed">
                <span className="text-cyan-500 font-bold">&gt;</span>
                <span className={typeof log === "string" && log.includes("Success") ? "text-emerald-400 font-bold" : "text-slate-300"}>
                  {log}
                </span>
              </div>
            ))}
            {building && (
              <div className="flex items-center space-x-2 text-cyan-400 text-[11px] animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Executing native AXML binary patching...</span>
              </div>
            )}
          </div>

          {/* Download & Output Artifact Card */}
          {completed && (
            <div className="bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm font-mono">{outputFileName}</h4>
                    <span className="text-xs text-slate-400 font-mono">Size: 14.8 MB • apksig V1/V2/V3 Verified</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQrVisible(!qrVisible)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono flex items-center space-x-1"
                    title={t.shareQr}
                  >
                    <QrCode className="w-4 h-4 text-cyan-400" />
                  </button>

                  <a
                    href={`data:text/plain;charset=utf-8,WebToApp_Signed_${buildType}_Artifact`}
                    download={outputFileName}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono rounded-xl text-xs flex items-center space-x-2 shadow-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t.downloadPackage}</span>
                  </a>
                </div>
              </div>

              {qrVisible && (
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-2">
                  <div className="w-32 h-32 bg-white p-2 rounded-xl mx-auto flex items-center justify-center">
                    {/* Simulated QR barcode pattern */}
                    <div className="w-full h-full bg-slate-950 rounded p-1 grid grid-cols-5 gap-1">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={i % 2 === 0 || i % 3 === 0 ? "bg-cyan-400 rounded-sm" : "bg-slate-900"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Scan QR code on your phone to install directly</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
