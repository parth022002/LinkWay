"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldAlert, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export default function AbuseReportPage() {
  const [shortCode, setShortCode] = useState("");
  const [category, setCategory] = useState("Phishing");
  const [description, setDescription] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cleanSlug = shortCode.replace(/^https?:\/\/[^\/]+\/r\//, "").replace(/^https?:\/\/[^\/]+\//, "");

      const res = await fetch("/api/v1/abuse-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shortCode: cleanSlug,
          category,
          description,
          reporterEmail: reporterEmail || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit abuse report.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setLoading(false);
    } catch {
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1430] text-white">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Homepage
        </Link>

        <div className="rounded-2xl bg-[#101B3B] border border-slate-800 p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Report Malicious or Abusive Link</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                LinkWay enforces a zero-tolerance policy against phishing, malware, scams, and deceptive content.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="my-8 p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h2 className="text-lg font-bold text-emerald-300">Report Successfully Submitted</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you for helping keep the web safe. Our trust & safety systems have flagged this short code for review and immediate quarantine if policy violations are detected.
              </p>
              <div className="pt-4">
                <Link
                  href="/"
                  className="inline-block rounded-lg bg-[#0B1430] border border-slate-700 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Reported Short Link or Slug *
                </label>
                <input
                  type="text"
                  required
                  value={shortCode}
                  onChange={(e) => setShortCode(e.target.value)}
                  placeholder="e.g. launch26 or https://linkway.io/r/xyz123"
                  className="w-full px-4 py-2.5 bg-[#0B1430] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Category of Abuse *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0B1430] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
                >
                  <option value="Phishing">Phishing & Credential Theft</option>
                  <option value="Malware">Malware / Trojan Distribution</option>
                  <option value="Scam">Scam / Financial Fraud</option>
                  <option value="Spam">Unsolicited Bulk Spam</option>
                  <option value="Illegal Content">Illegal / Prohibited Content</option>
                  <option value="Other">Other Policy Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Detailed Explanation * (min. 10 characters)
                </label>
                <textarea
                  required
                  minLength={10}
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the deceptive activity or threat encountered..."
                  className="w-full px-4 py-2.5 bg-[#0B1430] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Your Email (Optional, for investigation updates)
                </label>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="reporter@example.com"
                  className="w-full px-4 py-2.5 bg-[#0B1430] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? "Submitting Report..." : "Submit Abuse Report"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
