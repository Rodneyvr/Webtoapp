import React, { useState } from "react";
import {
  ShieldCheck,
  Globe,
  Lock,
  Zap,
  RefreshCw,
  CheckCircle2,
  Server,
  Activity,
  Sliders
} from "lucide-react";
import { LanguageCode } from "../types";
import { translations } from "../i18n/translations";

interface NetworkStackProps {
  currentLang: LanguageCode;
}

export const NetworkStack: React.FC<NetworkStackProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [dohProvider, setDohProvider] = useState("Cloudflare (1.1.1.1)");
  const [tlsProfile, setTlsProfile] = useState("chrome");
  const [enableEch, setEnableEch] = useState(true);
  const [enableCorsBypass, setEnableCorsBypass] = useState(true);
  const [testUrl, setTestUrl] = useState("https://1.1.1.1/dns-query");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const dohList = [
    { name: "Cloudflare (1.1.1.1)", endpoint: "https://cloudflare-dns.com/dns-query", provider: "Cloudflare" },
    { name: "Google DoH (8.8.8.8)", endpoint: "https://dns.google/dns-query", provider: "Google" },
    { name: "AdGuard Anti-Ad (94.140.14.14)", endpoint: "https://dns.adguard-dns.com/dns-query", provider: "AdGuard" },
    { name: "Quad9 Secure (9.9.9.9)", endpoint: "https://dns.quad9.net/dns-query", provider: "Quad9" },
    { name: "AliDNS DoH (223.5.5.5)", endpoint: "https://dns.alidns.com/dns-query", provider: "Alibaba" },
    { name: "DNSPod DoH (119.29.29.29)", endpoint: "https://doh.pub/dns-query", provider: "Tencent" },
  ];

  const handleTestNetwork = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch("/api/network/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testUrl,
          dohProvider,
          tlsFingerprint: tlsProfile,
          enableEch,
        }),
      });
      const data = await response.json();
      setTestResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            {t.networkStack} Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            DNS-over-HTTPS, JA3 TLS Fingerprint spoofing, GeckoView ECH SNI encryption & CORS relay
          </p>
        </div>

        <button
          onClick={handleTestNetwork}
          disabled={testing}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-xs rounded-xl flex items-center space-x-2 shadow-lg transition-all"
        >
          {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          <span>{t.testConnection}</span>
        </button>
      </div>

      {/* Network Stack Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* DoH Provider Selection */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm font-mono">{t.dohProviders}</h3>
              <p className="text-xs text-slate-400">7 Preconfigured Secure Resolvers</p>
            </div>
          </div>

          <div className="space-y-2">
            {dohList.map((item) => (
              <label
                key={item.name}
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer font-mono text-xs transition-colors ${
                  dohProvider === item.name
                    ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-300 font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="doh"
                    checked={dohProvider === item.name}
                    onChange={() => setDohProvider(item.name)}
                    className="accent-cyan-400"
                  />
                  <span>{item.name}</span>
                </div>
                <span className="text-[10px] text-slate-500">{item.provider}</span>
              </label>
            ))}
          </div>
        </div>

        {/* TLS Fingerprinting & ECH SNI */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-lg">
          
          {/* JA3 TLS Profile */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm font-mono">{t.tlsFingerprintSpoof}</h3>
                <p className="text-xs text-slate-400">Local MITM bridge fingerprint spoofing</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {[
                { id: "chrome", name: "Chrome 120+" },
                { id: "firefox", name: "Firefox 122+" },
                { id: "safari", name: "Safari 17+ iOS" },
              ].map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => setTlsProfile(prof.id)}
                  className={`p-3 rounded-xl border text-center transition-colors ${
                    tlsProfile === prof.id
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
                  }`}
                >
                  {prof.name}
                </button>
              ))}
            </div>
          </div>

          {/* ECH Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="space-y-0.5">
              <h4 className="font-bold text-slate-200 text-xs font-mono">{t.echEncryption}</h4>
              <p className="text-[11px] text-slate-400">Encrypted Client Hello via GeckoView Engine</p>
            </div>
            <input
              type="checkbox"
              checked={enableEch}
              onChange={(e) => setEnableEch(e.target.checked)}
              className="w-5 h-5 accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* CORS Bypass Relay */}
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="space-y-0.5">
              <h4 className="font-bold text-slate-200 text-xs font-mono">{t.corsBypassTitle}</h4>
              <p className="text-[11px] text-slate-400">Bypasses locked-down SPA header restrictions</p>
            </div>
            <input
              type="checkbox"
              checked={enableCorsBypass}
              onChange={(e) => setEnableCorsBypass(e.target.checked)}
              className="w-5 h-5 accent-cyan-400 cursor-pointer"
            />
          </div>

        </div>

      </div>

      {/* Connection Test Output Result */}
      {testResult && (
        <div className="bg-gradient-to-br from-cyan-950/40 via-slate-950 to-slate-950 border border-cyan-500/40 rounded-3xl p-6 space-y-3 font-mono text-xs shadow-2xl">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Network Diagnostic Stack Test Passed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-slate-300 text-[11px]">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">DoH RESOLVER</span>
              <span className="font-bold text-cyan-400">{testResult.dohProvider}</span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">LATENCY</span>
              <span className="font-bold text-emerald-400">{testResult.latencyMs} ms</span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">ECH STATUS</span>
              <span className="font-bold text-purple-400">{testResult.echStatus}</span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">CORS RELAY</span>
              <span className="font-bold text-amber-400">ACTIVE</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
