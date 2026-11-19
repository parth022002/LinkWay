import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#0B1430] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="relative h-10 w-40">
              <Image
                src="/brand/logo-dark.png"
                alt="LinkWay Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every Link. One Smarter Way. An intelligent link management platform engineered for growth, transparency, and safety.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Policy-Gated Edge Fabric Active
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#workflow" className="hover:text-white transition-colors">
                  Integrated Workflow
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-white transition-colors">
                  Campaign DNA & UTMs
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-white transition-colors">
                  Dynamic QR Identity
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-white transition-colors">
                  Version History Ledger
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-white transition-colors">
                  Honest Event Analytics
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Safety Column */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Trust & Safety</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#trust" className="hover:text-white transition-colors">
                  Privacy Truth Model
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-white transition-colors">
                  Zero Raw IP Persistence
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-white transition-colors">
                  Anti-Open-Redirect Policy
                </a>
              </li>
              <li>
                <Link href="/abuse" className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Public Abuse Report
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal & Compliance</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Notice
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/acceptable-use" className="hover:text-white transition-colors">
                  Acceptable Use Policy
                </Link>
              </li>
              <li>
                <span className="text-slate-500">
                  Target WCAG 2.2 AA Compliance
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LinkWay Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for marketing & growth professionals.
          </p>
        </div>
      </div>
    </footer>
  );
}
