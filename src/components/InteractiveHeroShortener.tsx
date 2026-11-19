"use client";

import { useState } from "react";
import { Link2, QrCode, Copy, Check, Sparkles, SlidersHorizontal } from "lucide-react";
import { buildUtmUrl } from "@/lib/utm";

export default function InteractiveHeroShortener() {
  const [destination, setDestination] = useState("https://mybrand.com/new-product");
  const [showUtm, setShowUtm] = useState(false);
  const [utmSource, setUtmSource] = useState("newsletter");
  const [utmMedium, setUtmMedium] = useState("email");
  const [utmCampaign, setUtmCampaign] = useState("winter_launch");
  const [copied, setCopied] = useState(false);
  const previewSlug = "launch26";

  // Real-time computed final destination
  const finalDestination = showUtm
    ? buildUtmUrl(destination, {
        source: utmSource,
        medium: utmMedium,
        campaign: utmCampaign,
      })
    : destination;

  const demoShortUrl = `https://linkway.io/r/${previewSlug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(demoShortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl bg-[#101B3B]/90 border border-slate-700/60 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-lw-gradient text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
            Interactive Workflow Demonstration
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono">Live Link Engine</span>
      </div>

      <div className="space-y-5">
        {/* Step 1: Destination input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            1. Long Destination URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Link2 className="w-4 h-4" />
            </div>
            <input
              type="url"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="https://example.com/your-long-campaign-page"
              className="w-full pl-10 pr-4 py-3 bg-[#0B1430] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all"
            />
          </div>
        </div>

        {/* UTM toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowUtm(!showUtm)}
            className="flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {showUtm ? "Hide Campaign DNA & UTM Builder" : "+ Attach Campaign DNA & UTM Parameters"}
          </button>
        </div>

        {/* Step 2: UTM Drawer */}
        {showUtm && (
          <div className="p-4 rounded-xl bg-[#0B1430]/70 border border-slate-800 space-y-3 text-xs animate-in fade-in duration-200">
            <p className="font-semibold text-slate-300 mb-2">
              Campaign DNA Parameters (Governed Conventions)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">utm_source</label>
                <input
                  type="text"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  placeholder="e.g. newsletter"
                  className="w-full p-2 bg-[#101B3B] border border-slate-700 rounded text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">utm_medium</label>
                <input
                  type="text"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  placeholder="e.g. email"
                  className="w-full p-2 bg-[#101B3B] border border-slate-700 rounded text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">utm_campaign</label>
                <input
                  type="text"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  placeholder="e.g. winter_launch"
                  className="w-full p-2 bg-[#101B3B] border border-slate-700 rounded text-white font-mono"
                />
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="text-slate-500 font-medium">Computed Target: </span>
              <span className="font-mono text-cyan-300 break-all">{finalDestination}</span>
            </div>
          </div>
        )}

        {/* Step 3: Resulting Short Link & QR Identity */}
        <div className="pt-4 border-t border-slate-700/60 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <span className="text-xs text-slate-400 block mb-1 font-semibold">
              Canonical Short Link (Ready to Share)
            </span>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-[#0B1430] border border-cyan-500/30 rounded-xl text-cyan-300 text-sm font-mono flex items-center justify-between">
                <span>{demoShortUrl}</span>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  302 Found
                </span>
              </div>
              <button
                type="button"
                onClick={copyToClipboard}
                className="p-3 bg-lw-gradient text-white rounded-xl hover:opacity-90 transition-all shadow-md"
                title="Copy short link"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0B1430] p-3 rounded-xl border border-slate-800">
            <div className="p-2 rounded-lg bg-white">
              <QrCode className="w-8 h-8 text-[#0B1430]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">QR Identity</div>
              <div className="text-[10px] text-slate-400">Bound to /r/{previewSlug}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">SVG & PNG ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
