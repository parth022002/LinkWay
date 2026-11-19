import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InteractiveHeroShortener from "@/components/InteractiveHeroShortener";
import WorkflowVisualizer from "@/components/WorkflowVisualizer";
import FeatureGrid from "@/components/FeatureGrid";
import TrustSection from "@/components/TrustSection";
import { ArrowRight, Check } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#0B1430] py-20 lg:py-28 text-white">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#9636F5]/20 via-[#2458F5]/20 to-[#08C8E8]/20 blur-[120px] pointer-events-none rounded-full" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#101B3B]/80 px-4 py-1.5 text-xs font-semibold text-slate-300 shadow-sm backdrop-blur-sm mb-8">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400"></span>
              <span className="text-white">LinkWay 1.2</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-300">Intelligent Link Management Platform</span>
            </div>

            {/* Display Headline */}
            <h1 className="mx-auto max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Every Link. <br />
              <span className="text-lw-gradient">One Smarter Way.</span>
            </h1>

            {/* Subhead */}
            <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
              Create, shorten, track, protect, and optimize every campaign link from one unified workspace. Powered by deterministic policy-gated routing and honest analytics.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2.5 rounded-xl bg-lw-gradient px-8 py-4 text-base font-bold text-white shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#workflow"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#101B3B] px-7 py-4 text-base font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all"
              >
                Explore Workflow
              </a>
            </div>

            {/* Micro proof badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                Zero setup fee
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                Deterministic policy redirects
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                Privacy-first (No raw IP logging)
              </span>
            </div>

            {/* Interactive Hero Widget */}
            <div className="mt-16">
              <InteractiveHeroShortener />
            </div>
          </div>
        </section>

        {/* 6-Phase Integrated Workflow Section */}
        <WorkflowVisualizer />

        {/* Feature Grid Section */}
        <FeatureGrid />

        {/* Trust & Privacy Section */}
        <TrustSection />

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-white border-t border-[#E2E8F2]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2458F5]">
                Frequently Asked Questions
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-[#111D3B]">
                Clear Answers to Common Questions
              </h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-[#E2E8F2] p-6 bg-[#F6F8FC]">
                <h3 className="text-base font-bold text-[#111D3B] mb-2">
                  How does LinkWay prevent open redirect vulnerabilities?
                </h3>
                <p className="text-sm text-[#55627C] leading-relaxed">
                  Unlike vulnerable shorteners that allow query overrides like <code>?url=evil.com</code>, LinkWay resolves short links exclusively against verified destination URLs stored inside our database. User-supplied parameters can never override destination routing.
                </p>
              </div>

              <div className="rounded-xl border border-[#E2E8F2] p-6 bg-[#F6F8FC]">
                <h3 className="text-base font-bold text-[#111D3B] mb-2">
                  What makes your analytics &quot;honest&quot;?
                </h3>
                <p className="text-sm text-[#55627C] leading-relaxed">
                  We report &quot;Recorded Redirect Events&quot; rather than claiming impossible precision about &quot;Unique Human People&quot;. We classify search crawlers, bot scanners, and browser link previews, and we do not persist raw visitor IP addresses.
                </p>
              </div>

              <div className="rounded-xl border border-[#E2E8F2] p-6 bg-[#F6F8FC]">
                <h3 className="text-base font-bold text-[#111D3B] mb-2">
                  How does Version History work if I change my link destination?
                </h3>
                <p className="text-sm text-[#55627C] leading-relaxed">
                  Every time you update a destination URL, an immutable version snapshot is recorded with your actor ID, timestamp, and change reason. If a campaign page breaks or needs to be restored, you can roll back to any prior version with one click.
                </p>
              </div>

              <div className="rounded-xl border border-[#E2E8F2] p-6 bg-[#F6F8FC]">
                <h3 className="text-base font-bold text-[#111D3B] mb-2">
                  Are QR codes permanently linked to the short URL?
                </h3>
                <p className="text-sm text-[#55627C] leading-relaxed">
                  Yes. All QR codes point directly to your canonical LinkWay short URL, not the raw long destination. This means if you print a QR code on product packaging or business cards, you can change where it points at any time without reprinting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-lw-gradient py-16 text-white text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Upgrade Your Link Infrastructure?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/90 max-w-xl mx-auto">
              Start building cleaner campaigns, safer redirects, and trustworthy analytics today.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/signup"
                className="rounded-xl bg-[#0B1430] text-white px-8 py-3.5 text-sm font-bold shadow-xl hover:bg-[#101B3B] transition-all"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
