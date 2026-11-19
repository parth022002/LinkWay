import { Dna, Sliders, Link, QrCode, History, BarChart3 } from "lucide-react";

const STEPS = [
  {
    icon: Dna,
    title: "1. Campaign DNA",
    description: "Define structured conventions: source, medium, channel, and lifecycle parameters.",
    accent: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Sliders,
    title: "2. UTM Builder",
    description: "Safe encoding and query parameter preservation without mangling URL fragments.",
    accent: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: Link,
    title: "3. Short Link",
    description: "Collision-resistant high-entropy codes or validated custom brand aliases.",
    accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: QrCode,
    title: "4. QR Identity",
    description: "Dynamic vector SVG and high-res PNG derived from canonical short URLs.",
    accent: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: History,
    title: "5. Version History",
    description: "Immutable destination snapshots with actor attribution and 1-click rollback.",
    accent: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  },
  {
    icon: BarChart3,
    title: "6. Recorded Analytics",
    description: "Honest redirect counts, time-series, referrers, and coarse devices without raw IPs.",
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
];

export default function WorkflowVisualizer() {
  return (
    <section id="workflow" className="py-24 bg-[#0B1430] text-white border-t border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            The Integrated Core Journey
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            One Connected Link Workflow
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Unlike fragmented utilities that force you to jump between different tools, LinkWay unifies the entire link lifecycle from campaign conception to engagement metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative rounded-2xl bg-[#101B3B] border border-slate-800 p-6 lw-card-hover group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl border ${step.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    PHASE 0{idx + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-4 rounded-xl bg-[#101B3B]/60 border border-slate-800 flex items-center justify-center gap-3 text-xs text-slate-400 text-center flex-wrap">
          <span className="text-cyan-400 font-semibold">Continuous Trust Layer:</span>
          <span>Workspace Tenancy Isolation</span>
          <span>•</span>
          <span>Deterministic Policy Gate</span>
          <span>•</span>
          <span>Anti-Open-Redirect Shield</span>
          <span>•</span>
          <span>Zero Raw IP Tracking</span>
        </div>
      </div>
    </section>
  );
}
