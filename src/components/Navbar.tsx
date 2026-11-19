"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((res) => {
        if (res.ok) setIsLoggedIn(true);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F2] bg-[#0B1430]/95 backdrop-blur-md text-white transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-44">
            <Image
              src="/brand/logo-dark.png"
              alt="LinkWay Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#workflow" className="hover:text-white transition-colors">
            Workflow
          </a>
          <a href="#capabilities" className="hover:text-white transition-colors">
            Capabilities
          </a>
          <a href="#trust" className="hover:text-white transition-colors">
            Trust & Safety
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
          <Link href="/abuse" className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5" />
            Report Abuse
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-lg bg-lw-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95 transition-all"
            >
              Open Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-lw-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95 transition-all"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1E293B] bg-[#101B3B] px-4 py-6 space-y-4">
          <a
            href="#workflow"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white text-base py-1"
          >
            Workflow
          </a>
          <a
            href="#capabilities"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white text-base py-1"
          >
            Capabilities
          </a>
          <a
            href="#trust"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white text-base py-1"
          >
            Trust & Safety
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white text-base py-1"
          >
            FAQ
          </a>
          <Link
            href="/abuse"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-rose-400 text-sm py-1"
          >
            Report Abuse
          </Link>
          <div className="pt-4 border-t border-[#1E293B] flex flex-col gap-3">
            {isLoggedIn ? (
              <Link
                href="/app"
                className="text-center rounded-lg bg-lw-gradient px-4 py-2.5 text-sm font-semibold text-white"
              >
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-center rounded-lg bg-lw-gradient px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
