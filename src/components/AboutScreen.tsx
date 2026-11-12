import React from "react";
import {
  Smartphone,
  Cpu,
  ShieldCheck,
  Hammer,
  Layers,
  Globe,
  Code2,
  ExternalLink,
  Github,
  CheckCircle2,
  Server
} from "lucide-react";
import { LanguageCode } from "../types";
import { translations } from "../i18n/translations";

interface AboutScreenProps {
  currentLang: LanguageCode;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-3xl p-8 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Smartphone className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
              WebToApp <span className="text-cyan-400">v3.2</span>
            </h1>
            <p className="text-sm text-cyan-300 font-mono mt-0.5">
              On-Device Mobile APK Workshop & Native Server Runtime Engine
            </p>
          </div>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
          Build Android APKs from web projects, directly on your phone. An on-device APK workshop that goes far beyond URL wrapping — it can fork and exec full server runtimes, ship a hardened anti-censorship network stack, sign bundles for Google Play, and run MV3 browser extensions, all without a PC or a remote build server.
        </p>

        <div className="flex flex-wrap gap-2 text-xs font-mono pt-2">
          <span className="bg-slate-950/80 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-xl">
            Target SDK 28 (Fork+Exec Native Runtimes)
          </span>
          <span className="bg-slate-950/80 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-xl">
            Google Play AAB Target SDK 34 Export
          </span>
          <span className="bg-slate-950/80 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-xl">
            GeckoView Dual Engine (ECH / SNI Encrypted)
          </span>
          <span className="bg-slate-950/80 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-xl">
            apksig V1/V2/V3 Signing
          </span>
        </div>
      </div>

      {/* What Makes WebToApp Different */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-mono text-slate-100 flex items-center gap-2">
          <SparkleIcon className="w-5 h-5 text-cyan-400" />
          What Makes WebToApp Different
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Server className="w-4 h-4" />
              <span>1. Native Server Runtimes On-Device</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Node.js 18.20, PHP 8.4 + Composer, Python 3.14, Go 1.26, and WordPress over SQLite are fork+exec'd as native binaries straight from app storage — like Termux, packaged into an installable APK.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>2. Hardened Anti-Censorship Stack</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              DNS-over-HTTPS (7 providers), TLS fingerprint spoofing (Chrome / Firefox / Safari JA3 templates) with local MITM bridge, Encrypted Client Hello (ECH) on GeckoView to encrypt SNI, proxies, and CORS bypass.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-purple-400 font-bold">
              <Hammer className="w-4 h-4" />
              <span>3. Self-Contained On-Device Build & Signing</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Binary AXML/ARSC patching, permission pruning, V1/V2/V3 apksig signing, and Google Play-ready AAB export all happen inside the app via apksig — no remote build queue, no PC required.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold">
              <Layers className="w-4 h-4" />
              <span>4. Extensible Post-Ship & 10 Languages</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Add JS/CSS modules, Tampermonkey userscripts, or MV3 Chrome extensions (live-searched from Chrome Web Store). UI speaks 10 languages out of the box (English, 中文, العربية RTL, Português, Español, Français, Deutsch, Русский, 日本語, 한국어).
            </p>
          </div>

        </div>
      </div>

      {/* Architecture & Gradle Modules */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-mono text-slate-100 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-400" />
          Architecture & Tech Stack
        </h2>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 font-mono text-xs">
          
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200">Gradle Architecture:</h4>
            <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
              <li><strong className="text-cyan-300">app</strong>: Full builder and workshop host UI.</li>
              <li><strong className="text-cyan-300">shell</strong>: Embedded runtime host compiled into generated APKs.</li>
              <li><strong className="text-cyan-300">clone-host</strong>: Host code for app cloning (compiled to classes.jar, converted to DEX via d8).</li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200">Tech Stack & Libraries:</h4>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Kotlin & Jetpack Compose</span>
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Room 2.7.2 + KSP</span>
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">OkHttp 4.12.0 + DoH</span>
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">apksig 8.3.0</span>
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">BouncyCastle 1.78.1</span>
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">GeckoView Engine</span>
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">JNI Native C++ Launcher</span>
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Gemini AI Engine</span>
            </div>
          </div>

        </div>
      </div>

      {/* Developer Links */}
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800 font-mono text-xs">
        <div>
          <span className="text-slate-400">Developed by <strong className="text-slate-200">shiaho</strong></span>
          <p className="text-slate-500 text-[11px] mt-0.5">Licensed under The Unlicense • Open Source APK Workshop</p>
        </div>

        <a
          href="https://github.com/shiaho777/web-to-app"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center space-x-2 transition-colors"
        >
          <Github className="w-4 h-4" />
          <span>shiaho777 / web-to-app</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>

    </div>
  );
};

function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l2.4 7.2L21.6 12l-7.2 2.4L12 21.6l-2.4-7.2L2.4 12l7.2-2.4z" />
    </svg>
  );
}
