import React, { useState, useEffect } from "react";
import {
  Cpu,
  Play,
  Square,
  RefreshCw,
  Terminal,
  Activity,
  HardDrive,
  ExternalLink,
  CheckCircle2,
  Server
} from "lucide-react";
import { PortProcess, LanguageCode } from "../types";
import { translations } from "../i18n/translations";

interface PortManagerProps {
  currentLang: LanguageCode;
}

export const PortManager: React.FC<PortManagerProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [processes, setProcesses] = useState<PortProcess[]>([
    {
      port: 3000,
      runtime: "Node.js 18.20",
      appName: "Pocket Node.js API & Admin",
      status: "active",
      cpuUsage: "1.4%",
      ramUsage: "42.8 MB",
      uptime: "02h 45m"
    },
    {
      port: 8080,
      runtime: "WordPress SQLite",
      appName: "WordPress Mobile Studio",
      status: "active",
      cpuUsage: "0.8%",
      ramUsage: "68.2 MB",
      uptime: "01h 12m"
    },
    {
      port: 8000,
      runtime: "Python 3.14",
      appName: "Python 3.14 Data Analyzer",
      status: "idle",
      cpuUsage: "0.0%",
      ramUsage: "18.5 MB",
      uptime: "00h 00m"
    },
    {
      port: 9000,
      runtime: "Go 1.26",
      appName: "Go High-Performance Microservice",
      status: "active",
      cpuUsage: "0.2%",
      ramUsage: "8.1 MB",
      uptime: "05h 10m"
    }
  ]);

  const [systemHealth, setSystemHealth] = useState<any>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setSystemHealth(data))
      .catch(console.error);
  }, []);

  const handleToggleProcess = (port: number) => {
    setProcesses((prev) =>
      prev.map((proc) => {
        if (proc.port === port) {
          const newStatus = proc.status === "active" ? "idle" : "active";
          return {
            ...proc,
            status: newStatus,
            cpuUsage: newStatus === "active" ? "1.2%" : "0.0%",
            uptime: newStatus === "active" ? "00h 01m" : "00h 00m"
          };
        }
        return proc;
      })
    );
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title & Stats Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-emerald-400" />
            {t.portManager} & Binary Process Executor
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fork+exec native binaries (Node.js, PHP, Python, Go, WordPress) straight from app storage
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-slate-300">
            <span className="text-slate-500 block text-[10px]">ACTIVE PORTS</span>
            <span className="font-bold text-emerald-400">{processes.filter(p => p.status === 'active').length} Listening</span>
          </div>

          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-slate-300">
            <span className="text-slate-500 block text-[10px]">TOTAL RAM</span>
            <span className="font-bold text-cyan-400">137.6 MB</span>
          </div>
        </div>
      </div>

      {/* Installed Native Binaries Status */}
      {systemHealth && systemHealth.runtimes && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h4 className="font-bold text-slate-200 text-xs font-mono flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            On-Device Native Binaries (Termux-style app storage fork+exec)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-[11px]">
            {Object.entries(systemHealth.runtimes).map(([name, info]: [string, any]) => (
              <div key={name} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase text-slate-200">{name}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-slate-400">v{info.version}</div>
                <div className="text-[10px] text-slate-500 truncate">{info.path}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Processes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {processes.map((proc) => {
          const isActive = proc.status === "active";

          return (
            <div
              key={proc.port}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-amber-400 font-mono text-sm">
                      Port :{proc.port}
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                      {proc.runtime}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm font-mono mt-1">{proc.appName}</h4>
                </div>

                <button
                  onClick={() => handleToggleProcess(proc.port)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                    isActive
                      ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
                  }`}
                >
                  {isActive ? (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      <span>Stop Process</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Launch Process</span>
                    </>
                  )}
                </button>
              </div>

              {/* Resource Usage & Uptime */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-center">
                <div>
                  <span className="text-slate-500 block text-[10px]">CPU</span>
                  <span className="font-bold text-emerald-400">{proc.cpuUsage}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">MEMORY</span>
                  <span className="font-bold text-cyan-400">{proc.ramUsage}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">UPTIME</span>
                  <span className="font-bold text-amber-400">{proc.uptime}</span>
                </div>
              </div>

              {/* Terminal Socket Log */}
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                <span className="truncate">
                  [Socket Bounded] http://127.0.0.1:{proc.port}
                </span>
                <a
                  href={`http://localhost:${proc.port}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
