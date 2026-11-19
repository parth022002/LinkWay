import Link from "next/link";
import { ShieldCheck, EyeOff, CheckCircle2 } from "lucide-react";

export default function TrustSection() {
  return (
    <section id="trust" className="py-24 bg-[#0B1430] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#08C8E8]">
            Trust, Privacy & Governance
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Safety and Privacy Engineered In, Not Bolted On
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Link management services route critical traffic. We hold ourselves to uncompromising standards of transparency, data minimization, and abuse prevention.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: What We Do */}
          <div className="rounded-2xl bg-[#101B3B] border border-emerald-500/30 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Architectural Guarantees
                </h3>
              </div>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Anti-Open-Redirect:</strong> Targets resolve strictly from the internal database. Client URL parameters can never override destination routing.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>SSRF & Scheme Protection:</strong> Internal IP addresses (127.0.0.1, 10.x, 169.254.169.254) and non-web schemes (javascript:, data:) are immediately rejected.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Immutable Audit Trail:</strong> Every change to a destination creates a permanent historical snapshot with actor timestamps.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Emergency Kill Switch:</strong> Compromised or abusive links can be paused or quarantined instantly across edge resolvers.
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400">
              Verified by automated integration test suites and strict database constraints.
            </div>
          </div>

          {/* Card 2: What We Don't Do */}
          <div className="rounded-2xl bg-[#101B3B] border border-blue-500/30 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <EyeOff className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Privacy & Truth Model
                </h3>
              </div>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>No Raw IP Persistence:</strong> We do not log or persist raw visitor IP addresses in redirect events by default.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>No Vanity Click Inflation:</strong> We clearly distinguish recorded redirect events from estimated unique visits, and classify web crawlers.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>No Third-Party Ad Trackers:</strong> Redirects execute with zero external tracking pixels, cross-site trackers, or third-party data broker beacons.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Open Public Abuse Reporting:</strong> Anyone can report deceptive, spam, or phishing URLs through our dedicated public abuse endpoint.
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Need to report a deceptive link?</span>
              <Link href="/abuse" className="text-rose-400 hover:text-rose-300 font-semibold underline">
                Submit an Abuse Report →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
