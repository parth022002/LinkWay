import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AcceptableUsePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FC]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-2xl border border-[#E2E8F2] p-8 sm:p-12 shadow-sm space-y-6 text-[#111D3B]">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
            Platform Safety Policy
          </span>
          <h1 className="text-3xl font-extrabold">Acceptable Use Policy</h1>
          <p className="text-xs text-[#71809B]">Last revised: November 2026</p>

          <div className="space-y-4 text-sm text-[#55627C] leading-relaxed">
            <p>
              LinkWay maintains a zero-tolerance policy against malicious, deceptive, or harmful link redirection.
            </p>

            <h2 className="text-lg font-bold text-[#111D3B] pt-4">Strictly Prohibited Activities:</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Phishing & Credential Theft:</strong> Shortening links to pages designed to impersonate banks, email providers, or login portals.</li>
              <li><strong>Malware & Exploit Kits:</strong> Distributing trojans, spyware, ransomware, or drive-by downloads.</li>
              <li><strong>Scams & Deceptive Marketing:</strong> Forwarding to deceptive investment schemes, technical support scams, or misleading claims.</li>
              <li><strong>Spam & Evading Filters:</strong> Obfuscating URLs to bypass email spam filters or social platform anti-abuse controls.</li>
              <li><strong>Internal Network Probing (SSRF):</strong> Submitting private IPv4 ranges (10.x, 192.168.x, 127.x) or cloud instance metadata addresses (169.254.169.254).</li>
            </ul>

            <h2 className="text-lg font-bold text-[#111D3B] pt-4">Reporting Violations</h2>
            <p>
              To report any link suspected of violating this policy, submit a report via our{" "}
              <Link href="/abuse" className="text-rose-600 font-semibold underline">
                Public Abuse Report Form
              </Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
