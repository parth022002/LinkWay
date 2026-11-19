import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FC]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-2xl border border-[#E2E8F2] p-8 sm:p-12 shadow-sm space-y-6 text-[#111D3B]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2458F5]">
            Privacy & Data Governance
          </span>
          <h1 className="text-3xl font-extrabold">LinkWay Privacy Notice</h1>
          <p className="text-xs text-[#71809B]">Last revised: November 2026</p>

          <div className="space-y-4 text-sm text-[#55627C] leading-relaxed">
            <h2 className="text-lg font-bold text-[#111D3B] pt-4">1. Data Minimization by Design</h2>
            <p>
              LinkWay is engineered around the principle of data minimization. When a visitor requests a short link, we resolve the canonical destination and return an immediate HTTP 302/307 redirect. We do not persist raw visitor IP addresses in our redirect event logs by default.
            </p>

            <h2 className="text-lg font-bold text-[#111D3B] pt-4">2. Collected Event Data</h2>
            <p>
              To provide campaign operators with aggregate performance visibility, our redirect resolver captures coarse event metadata:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Timestamp of redirect event</li>
              <li>HTTP Referrer hostname (if provided by the visitor browser)</li>
              <li>Coarse device family (Desktop, Mobile, Tablet, Bot)</li>
              <li>Browser and operating system family</li>
              <li>Coarse country code (derived transiently from edge network headers)</li>
            </ul>

            <h2 className="text-lg font-bold text-[#111D3B] pt-4">3. What We Never Do</h2>
            <p>
              We do not sell user data, install third-party tracking pixels on redirect routes, or build invasive cross-site consumer profiles.
            </p>

            <h2 className="text-lg font-bold text-[#111D3B] pt-4">4. Abuse and Safety Retention</h2>
            <p>
              Where links are reported for suspected phishing, malware, or illicit conduct, relevant telemetry and destination snapshots are retained strictly for the duration of the investigation to protect the public from fraud.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
