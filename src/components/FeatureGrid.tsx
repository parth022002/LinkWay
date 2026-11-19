import {
  Link2,
  ShieldAlert,
  History,
  QrCode,
  Sliders,
  BarChart2,
  Globe2,
  Users2,
  Lock,
} from "lucide-react";

const FEATURES = [
  {
    icon: Link2,
    title: "Collision-Resistant Short Links",
    description: "Generate cryptographically secure 7-character Base58 codes or customize with memorable brand slugs. Reserved system paths are automatically screened.",
  },
  {
    icon: Sliders,
    title: "Campaign DNA & UTM Governance",
    description: "Build clean, standardized campaign tracking parameters. Duplicate parameter keys are detected and handled without mangling hash fragments.",
  },
  {
    icon: QrCode,
    title: "Dynamic QR Identity",
    description: "Generate matching vector SVG and high-resolution raster PNG QR codes bound strictly to your short link identity. Perfect for packaging, print, and physical campaigns.",
  },
  {
    icon: History,
    title: "Immutable Version Ledgers",
    description: "Never lose track of where a link pointed. Every destination update creates a permanent version snapshot with actor attribution, change reason, and instant rollback.",
  },
  {
    icon: BarChart2,
    title: "Honest Event Analytics",
    description: "Clear and transparent metrics reporting. We track recorded redirect events, referrers, and coarse devices without exaggerating bot clicks as unique human visitors.",
  },
  {
    icon: ShieldAlert,
    title: "Policy-Gated Redirect Security",
    description: "Strict anti-open-redirect architecture. Redirects resolve exclusively to stored destinations in the database, ignoring arbitrary query parameter overrides.",
  },
  {
    icon: Users2,
    title: "Workspace Tenancy & RBAC",
    description: "Isolated workspaces for solo creators, teams, and agency operators. Granular roles: Owner, Admin, Editor, and Viewer enforced server-side.",
  },
  {
    icon: Globe2,
    title: "Custom Domain Architecture",
    description: "Future-ready architecture for branded vanity domains with automated DNS verification challenges and TLS certificate readiness tracking.",
  },
  {
    icon: Lock,
    title: "Privacy-Preserving Defaults",
    description: "We do not persist raw visitor IP addresses. Data minimization is engineered into the redirect pipeline, aligning with global privacy standards.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="capabilities" className="py-24 bg-[#F6F8FC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2458F5]">
            Signature Platform Capabilities
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-[#111D3B] tracking-tight">
            Engineered for Modern Marketing Teams
          </h2>
          <p className="mt-4 text-base text-[#55627C]">
            Every feature in LinkWay is crafted to ensure link longevity, data integrity, and complete operational confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl bg-white border border-[#E2E8F2] p-8 lw-card-hover lw-card-glow"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500/10 to-violet-500/10 border border-blue-500/20 flex items-center justify-center text-[#2458F5] mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#111D3B] mb-2.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#55627C] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
