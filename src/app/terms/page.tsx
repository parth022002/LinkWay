import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FC]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-2xl border border-[#E2E8F2] p-8 sm:p-12 shadow-sm space-y-6 text-[#111D3B]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2458F5]">
            Legal Agreement
          </span>
          <h1 className="text-3xl font-extrabold">Terms of Service</h1>
          <p className="text-xs text-[#71809B]">Last revised: November 2026</p>

          <div className="space-y-4 text-sm text-[#55627C] leading-relaxed">
            <h2 className="text-lg font-bold text-[#111D3B] pt-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using LinkWay, you agree to be bound by these Terms of Service. If you do not agree to all terms, do not create an account or use our short-link services.
            </p>

            <h2 className="text-lg font-bold text-[#111D3B] pt-4">2. Permitted Use</h2>
            <p>
              LinkWay provides URL redirection, campaign management, UTM construction, and dynamic QR identities for legitimate business, marketing, and editorial purposes. You are strictly responsible for all destination URLs and content linked through your account.
            </p>

            <h2 className="text-lg font-bold text-[#111D3B] pt-4">3. Prohibited Content</h2>
            <p>
              You must not use LinkWay to shorten, distribute, or facilitate links to phishing websites, malware, unlicensed gambling, fraudulent schemes, or content that violates applicable laws.
            </p>

            <h2 className="text-lg font-bold text-[#111D3B] pt-4">4. Termination & Takedown</h2>
            <p>
              LinkWay reserves the right to immediately pause, quarantine, or permanently delete any short link or terminate any workspace found in violation of our Acceptable Use Policy.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
