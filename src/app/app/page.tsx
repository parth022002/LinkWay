"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Link2,
  Plus,
  QrCode,
  History,
  BarChart3,
  Dna,
  Shield,
  Search,
  ExternalLink,
  Copy,
  Check,
  Pause,
  Play,
  Trash2,
  Download,
  LogOut,
  SlidersHorizontal,
  Filter,
  FileSpreadsheet,
  Globe2,
  AlertCircle,
  RefreshCw,
  X,
  Layers,
} from "lucide-react";
import { buildUtmUrl } from "@/lib/utm";

interface UserProfile {
  id: string;
  email: string;
  name: string;
}

interface WorkspaceInfo {
  id: string;
  name: string;
  slug: string;
  role: string;
}

interface LinkItem {
  id: string;
  code: string;
  title: string;
  destinationUrl: string;
  status: string;
  redirectCode: number;
  campaign?: { id: string; name: string } | null;
  createdAt: string;
  expiresAt?: string | null;
  recordedEvents: number;
}

interface CampaignItem {
  id: string;
  name: string;
  description?: string;
  channel?: string;
  utmSource?: string;
  utmMedium?: string;
  createdAt: string;
  linkCount: number;
}

interface VersionItem {
  id: string;
  versionNumber: number;
  destinationUrl: string;
  title?: string;
  changeReason?: string;
  actorUserId?: string;
  createdAt: string;
}

interface AnalyticsSummary {
  totalRecordedEvents: number;
  range: string;
  timeseries: Array<{ date: string; count: number }>;
  referrers: Array<{ name: string; count: number }>;
  devices: Array<{ name: string; count: number }>;
  browsers: Array<{ name: string; count: number }>;
  countries: Array<{ code: string; count: number }>;
  statement: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [activeTab, setActiveTab] = useState<"links" | "campaigns" | "qr" | "analytics" | "domains">("links");

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [qrModalItem, setQrModalItem] = useState<LinkItem | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [historyModalItem, setHistoryModalItem] = useState<LinkItem | null>(null);
  const [historyVersions, setHistoryVersions] = useState<VersionItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Create Link Form State
  const [formDestination, setFormDestination] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formCustomCode, setFormCustomCode] = useState("");
  const [formCampaignId, setFormCampaignId] = useState("");
  const [formShowUtm, setFormShowUtm] = useState(false);
  const [formUtmSource, setFormUtmSource] = useState("");
  const [formUtmMedium, setFormUtmMedium] = useState("");
  const [formUtmCampaign, setFormUtmCampaign] = useState("");
  const [formUtmTerm, setFormUtmTerm] = useState("");
  const [formUtmContent, setFormUtmContent] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Create Campaign Form State
  const [campName, setCampName] = useState("");
  const [campDesc, setCampDesc] = useState("");
  const [campChannel, setCampChannel] = useState("Social");
  const [campSource, setCampSource] = useState("");
  const [campMedium, setCampMedium] = useState("");
  const [campSubmitting, setCampSubmitting] = useState(false);

  // Analytics State
  const [analyticsRange, setAnalyticsRange] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Computed preview for Create Link Form
  const previewFinalUrl = formShowUtm
    ? buildUtmUrl(formDestination, {
        source: formUtmSource,
        medium: formUtmMedium,
        campaign: formUtmCampaign,
        term: formUtmTerm,
        content: formUtmContent,
      })
    : formDestination;

  // Initial Load: Check Auth & fetch links + campaigns
  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated) {
          setUser(data.user);
          setWorkspace(data.activeWorkspace);
          loadDashboardData();
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [linksRes, campaignsRes] = await Promise.all([
        fetch("/api/v1/links?limit=50"),
        fetch("/api/v1/campaigns"),
      ]);

      if (linksRes.ok) {
        const linksData = await linksRes.json();
        setLinks(linksData.links || []);
      }
      if (campaignsRes.ok) {
        const campData = await campaignsRes.json();
        setCampaigns(campData.campaigns || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async (range: string) => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/v1/analytics/summary?range=${range}`);
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "analytics") {
      loadAnalytics(analyticsRange);
    }
  }, [activeTab, analyticsRange]);

  const handleCopy = (code: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://linkway.io";
    const fullUrl = `${origin}/r/${code}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = async (link: LinkItem) => {
    const newStatus = link.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    try {
      const res = await fetch(`/api/v1/links/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLinks((prev) =>
          prev.map((l) => (l.id === link.id ? { ...l, status: newStatus } : l))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link? It will no longer resolve.")) return;
    try {
      const res = await fetch(`/api/v1/links/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLinks((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenQrModal = async (link: LinkItem) => {
    setQrModalItem(link);
    setQrDataUrl(null);
    try {
      const res = await fetch(`/api/v1/links/${link.id}/qr?format=png`);
      if (res.ok) {
        const data = await res.json();
        setQrDataUrl(data.dataUrl);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenHistoryModal = async (link: LinkItem) => {
    setHistoryModalItem(link);
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/v1/links/${link.id}/versions`);
      if (res.ok) {
        const data = await res.json();
        setHistoryVersions(data.versions || []);
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleRollback = async (versionNumber: number) => {
    if (!historyModalItem) return;
    if (!confirm(`Rollback destination to Version ${versionNumber}?`)) return;

    try {
      const res = await fetch(`/api/v1/links/${historyModalItem.id}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionNumber }),
      });

      if (res.ok) {
        alert("Rollback successful! New version snapshot created.");
        handleOpenHistoryModal(historyModalItem);
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        destinationUrl: previewFinalUrl,
        title: formTitle || undefined,
        customCode: formCustomCode || undefined,
        campaignId: formCampaignId || undefined,
      };

      const res = await fetch("/api/v1/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to create short link.");
        setFormSubmitting(false);
        return;
      }

      setCreateModalOpen(false);
      // Reset form
      setFormDestination("");
      setFormTitle("");
      setFormCustomCode("");
      setFormCampaignId("");
      setFormShowUtm(false);
      setFormSubmitting(false);
      loadDashboardData();
    } catch {
      setFormError("Network error occurred.");
      setFormSubmitting(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setCampSubmitting(true);
    try {
      const res = await fetch("/api/v1/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: campName,
          description: campDesc,
          channel: campChannel,
          utmSource: campSource,
          utmMedium: campMedium,
        }),
      });

      if (res.ok) {
        setCampaignModalOpen(false);
        setCampName("");
        setCampDesc("");
        setCampSource("");
        setCampMedium("");
        loadDashboardData();
      }
    } finally {
      setCampSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  // Filter links
  const filteredLinks = links.filter((l) => {
    if (statusFilter !== "ALL" && l.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      l.title.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q) ||
      l.destinationUrl.toLowerCase().includes(q)
    );
  });

  const totalRecordedEvents = links.reduce((acc, l) => acc + (l.recordedEvents || 0), 0);
  const activeLinksCount = links.filter((l) => l.status === "ACTIVE").length;

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-[#0B1430] border-b border-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="relative h-9 w-36">
              <Image
                src="/brand/logo-dark.png"
                alt="LinkWay Logo"
                fill
                className="object-contain"
                priority
              />
            </Link>

            <div className="hidden sm:flex items-center gap-2 pl-6 border-l border-slate-800">
              <div className="p-1 rounded bg-[#101B3B] border border-slate-700">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <span className="text-xs font-semibold text-slate-200">
                {workspace?.name || "Workspace"}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono font-medium">
                {workspace?.role || "OWNER"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-white">{user?.name}</div>
              <div className="text-[11px] text-slate-400 font-mono">{user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-[#E2E8F2] p-5 lw-card-glow">
            <div className="flex items-center justify-between text-xs text-[#55627C] font-semibold mb-2">
              <span>TOTAL SHORT LINKS</span>
              <Link2 className="w-4 h-4 text-[#2458F5]" />
            </div>
            <div className="text-3xl font-extrabold text-[#111D3B]">{links.length}</div>
            <div className="text-[11px] text-[#71809B] mt-1">Unique short codes managed</div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F2] p-5 lw-card-glow">
            <div className="flex items-center justify-between text-xs text-[#55627C] font-semibold mb-2">
              <span>ACTIVE LINKS</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-3xl font-extrabold text-emerald-600">{activeLinksCount}</div>
            <div className="text-[11px] text-[#71809B] mt-1">Routing traffic with 302/307</div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F2] p-5 lw-card-glow">
            <div className="flex items-center justify-between text-xs text-[#55627C] font-semibold mb-2">
              <span>RECORDED EVENTS</span>
              <BarChart3 className="w-4 h-4 text-[#9636F5]" />
            </div>
            <div className="text-3xl font-extrabold text-[#111D3B]">{totalRecordedEvents}</div>
            <div className="text-[11px] text-[#71809B] mt-1">Accepted redirect requests</div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F2] p-5 lw-card-glow">
            <div className="flex items-center justify-between text-xs text-[#55627C] font-semibold mb-2">
              <span>CAMPAIGN DNA</span>
              <Dna className="w-4 h-4 text-[#08C8E8]" />
            </div>
            <div className="text-3xl font-extrabold text-[#111D3B]">{campaigns.length}</div>
            <div className="text-[11px] text-[#71809B] mt-1">Standardized UTM campaigns</div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#E2E8F2] mb-6 overflow-x-auto pb-1 gap-2">
          <nav className="flex space-x-1 sm:space-x-4">
            <button
              onClick={() => setActiveTab("links")}
              className={`px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "links"
                  ? "bg-[#111D3B] text-white shadow-sm"
                  : "text-[#55627C] hover:text-[#111D3B] hover:bg-slate-100"
              }`}
            >
              <Link2 className="w-4 h-4" />
              Links ({links.length})
            </button>

            <button
              onClick={() => setActiveTab("campaigns")}
              className={`px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "campaigns"
                  ? "bg-[#111D3B] text-white shadow-sm"
                  : "text-[#55627C] hover:text-[#111D3B] hover:bg-slate-100"
              }`}
            >
              <Dna className="w-4 h-4" />
              Campaign DNA ({campaigns.length})
            </button>

            <button
              onClick={() => setActiveTab("qr")}
              className={`px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "qr"
                  ? "bg-[#111D3B] text-white shadow-sm"
                  : "text-[#55627C] hover:text-[#111D3B] hover:bg-slate-100"
              }`}
            >
              <QrCode className="w-4 h-4" />
              QR Identity
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-[#111D3B] text-white shadow-sm"
                  : "text-[#55627C] hover:text-[#111D3B] hover:bg-slate-100"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>

            <button
              onClick={() => setActiveTab("domains")}
              className={`px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "domains"
                  ? "bg-[#111D3B] text-white shadow-sm"
                  : "text-[#55627C] hover:text-[#111D3B] hover:bg-slate-100"
              }`}
            >
              <Globe2 className="w-4 h-4" />
              Custom Domains
            </button>
          </nav>

          {/* Quick Create Buttons */}
          <div className="flex items-center gap-2">
            {activeTab === "campaigns" ? (
              <button
                onClick={() => setCampaignModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-lw-gradient px-4 py-2 text-xs sm:text-sm font-bold text-white shadow hover:opacity-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Campaign
              </button>
            ) : (
              <button
                onClick={() => setCreateModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-lw-gradient px-4 py-2 text-xs sm:text-sm font-bold text-white shadow hover:opacity-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create Short Link
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: LINKS MANAGEMENT */}
        {activeTab === "links" && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-xl border border-[#E2E8F2]">
              <div className="relative w-full sm:w-96">
                <Search className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by title, short code, or URL..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F6F8FC] border border-[#E2E8F2] rounded-lg focus:outline-none focus:border-[#2458F5]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs bg-[#F6F8FC] border border-[#E2E8F2] rounded-lg px-2.5 py-1.5 text-[#55627C] focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="PAUSED">Paused Only</option>
                  <option value="ARCHIVED">Archived Only</option>
                </select>
              </div>
            </div>

            {/* Links Table */}
            <div className="bg-white rounded-xl border border-[#E2E8F2] shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-500" />
                  Loading workspace links...
                </div>
              ) : filteredLinks.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Link2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-[#111D3B]">No Short Links Found</h3>
                  <p className="text-xs text-[#55627C] max-w-sm mx-auto">
                    {search || statusFilter !== "ALL"
                      ? "No links match your current filter parameters."
                      : "Create your first short link with custom aliases, UTM parameters, and dynamic QR identities."}
                  </p>
                  <button
                    onClick={() => setCreateModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-lw-gradient px-4 py-2 text-xs font-bold text-white shadow mt-2 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Your First Link
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F6F8FC] border-b border-[#E2E8F2] text-[#55627C] font-semibold">
                      <tr>
                        <th className="py-3 px-4">Link Details & Destination</th>
                        <th className="py-3 px-4">Short URL</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Recorded Events</th>
                        <th className="py-3 px-4">Created</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F2]">
                      {filteredLinks.map((link) => {
                        const origin = typeof window !== "undefined" ? window.location.origin : "https://linkway.io";
                        const shortUrl = `${origin}/r/${link.code}`;
                        return (
                          <tr key={link.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 max-w-xs">
                              <div className="font-bold text-[#111D3B] truncate mb-0.5">
                                {link.title}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate font-mono">
                                {link.destinationUrl}
                              </div>
                              {link.campaign && (
                                <span className="inline-block mt-1 text-[10px] bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded border border-purple-200">
                                  DNA: {link.campaign.name}
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 font-mono font-medium">
                              <div className="flex items-center gap-1.5 text-cyan-600">
                                <a
                                  href={shortUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="hover:underline flex items-center gap-1"
                                >
                                  /r/{link.code}
                                  <ExternalLink className="w-3 h-3 text-slate-400" />
                                </a>
                                <button
                                  onClick={() => handleCopy(link.code)}
                                  className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                                  title="Copy URL"
                                >
                                  {copiedCode === link.code ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  link.status === "ACTIVE"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : link.status === "PAUSED"
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : "bg-slate-100 text-slate-600 border border-slate-200"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    link.status === "ACTIVE"
                                      ? "bg-emerald-500"
                                      : link.status === "PAUSED"
                                      ? "bg-amber-500"
                                      : "bg-slate-400"
                                  }`}
                                />
                                {link.status}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 font-mono font-bold text-[#111D3B]">
                              {link.recordedEvents}
                            </td>

                            <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                              {new Date(link.createdAt).toLocaleDateString()}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleOpenQrModal(link)}
                                  className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
                                  title="QR Code Identity"
                                >
                                  <QrCode className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleOpenHistoryModal(link)}
                                  className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
                                  title="Version History Ledger"
                                >
                                  <History className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleToggleStatus(link)}
                                  className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
                                  title={link.status === "ACTIVE" ? "Pause Redirects" : "Activate Redirects"}
                                >
                                  {link.status === "ACTIVE" ? (
                                    <Pause className="w-4 h-4 text-amber-600" />
                                  ) : (
                                    <Play className="w-4 h-4 text-emerald-600" />
                                  )}
                                </button>

                                <button
                                  onClick={() => handleDeleteLink(link.id)}
                                  className="p-1.5 rounded hover:bg-slate-100 text-rose-500"
                                  title="Delete Link"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CAMPAIGN DNA */}
        {activeTab === "campaigns" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {campaigns.length === 0 ? (
                <div className="col-span-3 bg-white p-12 text-center rounded-xl border border-[#E2E8F2] space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                    <Dna className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-[#111D3B]">No Campaigns Defined</h3>
                  <p className="text-xs text-[#55627C] max-w-sm mx-auto">
                    Campaign DNA provides standard templates for UTM parameters so your growth team always tags links consistently.
                  </p>
                  <button
                    onClick={() => setCampaignModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-lw-gradient px-4 py-2 text-xs font-bold text-white shadow mt-2 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create First Campaign DNA
                  </button>
                </div>
              ) : (
                campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="bg-white rounded-xl border border-[#E2E8F2] p-5 lw-card-hover lw-card-glow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {camp.channel || "General"}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {camp.linkCount} Links Attached
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#111D3B] mb-1">{camp.name}</h3>
                      <p className="text-xs text-[#55627C] leading-relaxed mb-4">
                        {camp.description || "No description provided."}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] font-mono text-slate-500">
                      <div>
                        utm_source: <span className="text-cyan-600 font-semibold">{camp.utmSource || "—"}</span>
                      </div>
                      <div>
                        utm_medium: <span className="text-cyan-600 font-semibold">{camp.utmMedium || "—"}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: QR IDENTITY */}
        {activeTab === "qr" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F2]">
              <h2 className="text-base font-bold text-[#111D3B] mb-1">Dynamic QR Identity Gallery</h2>
              <p className="text-xs text-[#55627C] mb-6">
                Every short link created automatically generates a paired high-resolution vector (SVG) and raster (PNG) QR code referencing the canonical short URL.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {links.map((link) => (
                    <div
                      key={link.id}
                      className="border border-[#E2E8F2] rounded-xl p-4 bg-[#F6F8FC] flex flex-col items-center text-center lw-card-hover"
                    >
                      <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm mb-3">
                        <QrCode className="w-24 h-24 text-[#0B1430]" />
                      </div>
                      <div className="font-bold text-xs text-[#111D3B] truncate w-full mb-0.5">
                        {link.title}
                      </div>
                      <div className="text-[11px] font-mono text-cyan-600 truncate w-full mb-3">
                        /r/{link.code}
                      </div>
                      <button
                        onClick={() => handleOpenQrModal(link)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#111D3B] text-white py-1.5 text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Export QR Assets
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS & REPORTING */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Range Selector & CSV Export */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E2E8F2]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#55627C]">Time Horizon:</span>
                {["24h", "7d", "30d", "90d"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setAnalyticsRange(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      analyticsRange === r
                        ? "bg-[#2458F5] text-white"
                        : "bg-[#F6F8FC] text-[#55627C] hover:bg-slate-200"
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>

              <a
                href="/api/v1/analytics/export"
                download
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-4 py-2 text-xs font-bold shadow hover:bg-emerald-500 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export CSV Report
              </a>
            </div>

            {/* Metrics Breakdown Grid */}
            {analyticsLoading ? (
              <div className="bg-white p-12 text-center text-xs text-slate-400 rounded-xl border border-[#E2E8F2] flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-500" />
                Calculating recorded redirect metrics...
              </div>
            ) : analyticsData ? (
              <div className="space-y-6">
                {/* Notice Badge */}
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 shrink-0 text-blue-600" />
                  <span>
                    <strong>Truth in Measurement:</strong> {analyticsData.statement} Raw visitor IP addresses are never persisted.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Top Referrers */}
                  <div className="bg-white p-6 rounded-xl border border-[#E2E8F2] shadow-sm">
                    <h3 className="text-sm font-bold text-[#111D3B] mb-4">
                      Top Inbound Referrer Hosts
                    </h3>
                    {analyticsData.referrers.length === 0 ? (
                      <p className="text-xs text-slate-400">No referrer data recorded yet.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {analyticsData.referrers.map((ref: { name: string; count: number }) => (
                          <div key={ref.name} className="flex items-center justify-between text-xs">
                            <span className="font-mono text-[#55627C]">{ref.name}</span>
                            <span className="font-bold text-[#111D3B]">{ref.count} events</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Device Classification */}
                  <div className="bg-white p-6 rounded-xl border border-[#E2E8F2] shadow-sm">
                    <h3 className="text-sm font-bold text-[#111D3B] mb-4">
                      Device Class Distribution
                    </h3>
                    {analyticsData.devices.length === 0 ? (
                      <p className="text-xs text-slate-400">No device data recorded yet.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {analyticsData.devices.map((dev: { name: string; count: number }) => (
                          <div key={dev.name} className="flex items-center justify-between text-xs">
                            <span className="font-medium text-[#55627C]">{dev.name}</span>
                            <span className="font-bold text-[#111D3B]">{dev.count} events</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* TAB 5: CUSTOM DOMAINS */}
        {activeTab === "domains" && (
          <div className="bg-white rounded-xl border border-[#E2E8F2] p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-50 text-[#2458F5]">
                <Globe2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#111D3B]">Custom Branded Short Domains</h2>
                <p className="text-xs text-[#55627C]">
                  Map your company&apos;s domain (e.g., <code>go.yourbrand.com</code>) to LinkWay for white-label link distribution.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                DNS & TLS Production Safeguard
              </div>
              <p className="leading-relaxed">
                Custom domains require automated DNS CNAME validation pointing to <code>cname.linkway.io</code>. To prevent traffic drops or security misrouting, vanity domains remain in Preview until automated TLS certificate provisioning is verified.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-[#F6F8FC] space-y-4">
              <h3 className="text-xs font-bold text-[#111D3B] uppercase tracking-wider">
                DNS Configuration Directives
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-white p-3 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400">TYPE</div>
                  <div className="font-bold text-slate-800">CNAME</div>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400">NAME / HOST</div>
                  <div className="font-bold text-slate-800">go (or link)</div>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400">TARGET VALUE</div>
                  <div className="font-bold text-slate-800">cname.linkway.io</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE LINK MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-lw-gradient text-white">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#111D3B]">Create Short Link</h3>
                  <p className="text-xs text-[#55627C]">Generate a collision-resistant short link with UTM parameters.</p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateLink} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111D3B] mb-1">
                  Destination URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/long-page-path"
                  value={formDestination}
                  onChange={(e) => setFormDestination(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F6F8FC] border border-[#E2E8F2] rounded-xl focus:outline-none focus:border-[#2458F5] font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111D3B] mb-1">
                    Link Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Promo Page"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#F6F8FC] border border-[#E2E8F2] rounded-xl focus:outline-none focus:border-[#2458F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111D3B] mb-1">
                    Custom Code / Alias (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. summer26"
                    value={formCustomCode}
                    onChange={(e) => setFormCustomCode(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#F6F8FC] border border-[#E2E8F2] rounded-xl focus:outline-none focus:border-[#2458F5] font-mono"
                  />
                </div>
              </div>

              {campaigns.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-[#111D3B] mb-1">
                    Associate with Campaign DNA
                  </label>
                  <select
                    value={formCampaignId}
                    onChange={(e) => setFormCampaignId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#F6F8FC] border border-[#E2E8F2] rounded-xl focus:outline-none"
                  >
                    <option value="">No Campaign</option>
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.channel || "General"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* UTM Builder Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setFormShowUtm(!formShowUtm)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#2458F5] hover:underline"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {formShowUtm ? "Hide Advanced UTM Builder" : "+ Attach Custom UTM Parameters"}
                </button>
              </div>

              {formShowUtm && (
                <div className="p-4 rounded-xl bg-[#F6F8FC] border border-[#E2E8F2] space-y-3 text-xs animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#55627C] block mb-1">utm_source</label>
                      <input
                        type="text"
                        placeholder="twitter, newsletter"
                        value={formUtmSource}
                        onChange={(e) => setFormUtmSource(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#55627C] block mb-1">utm_medium</label>
                      <input
                        type="text"
                        placeholder="social, email"
                        value={formUtmMedium}
                        onChange={(e) => setFormUtmMedium(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#55627C] block mb-1">utm_campaign</label>
                      <input
                        type="text"
                        placeholder="winter_sale"
                        value={formUtmCampaign}
                        onChange={(e) => setFormUtmCampaign(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#55627C] block mb-1">utm_term (optional)</label>
                      <input
                        type="text"
                        placeholder="keyword"
                        value={formUtmTerm}
                        onChange={(e) => setFormUtmTerm(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded font-mono text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-[#55627C] block mb-1">utm_content (optional)</label>
                      <input
                        type="text"
                        placeholder="hero_cta, banner_variant_b"
                        value={formUtmContent}
                        onChange={(e) => setFormUtmContent(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    <span className="font-semibold text-[#111D3B]">Preview Computed Target: </span>
                    <span className="font-mono text-cyan-700 break-all">{previewFinalUrl || "—"}</span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="rounded-lg bg-lw-gradient px-5 py-2.5 text-xs font-bold text-white shadow hover:opacity-95 disabled:opacity-50 cursor-pointer"
                >
                  {formSubmitting ? "Generating..." : "Save Short Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CAMPAIGN MODAL */}
      {campaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-600 text-white">
                  <Dna className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#111D3B]">New Campaign DNA</h3>
                  <p className="text-xs text-[#55627C]">Set up repeatable UTM parameters for your team.</p>
                </div>
              </div>
              <button
                onClick={() => setCampaignModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111D3B] mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Black Friday Promo"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F6F8FC] border border-[#E2E8F2] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111D3B] mb-1">Marketing Channel</label>
                <input
                  type="text"
                  placeholder="e.g. Paid Social, Influencer, Newsletter"
                  value={campChannel}
                  onChange={(e) => setCampChannel(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F6F8FC] border border-[#E2E8F2] rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#111D3B] mb-1">Default utm_source</label>
                  <input
                    type="text"
                    placeholder="e.g. instagram"
                    value={campSource}
                    onChange={(e) => setCampSource(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#F6F8FC] border border-[#E2E8F2] rounded-xl focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111D3B] mb-1">Default utm_medium</label>
                  <input
                    type="text"
                    placeholder="e.g. bio_link"
                    value={campMedium}
                    onChange={(e) => setCampMedium(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#F6F8FC] border border-[#E2E8F2] rounded-xl focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111D3B] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief notes about target audience or deliverables..."
                  value={campDesc}
                  onChange={(e) => setCampDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F6F8FC] border border-[#E2E8F2] rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCampaignModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={campSubmitting}
                  className="rounded-lg bg-lw-gradient px-5 py-2.5 text-xs font-bold text-white shadow hover:opacity-95 disabled:opacity-50 cursor-pointer"
                >
                  {campSubmitting ? "Saving..." : "Save Campaign DNA"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {qrModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 text-center shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold text-[#111D3B] truncate">{qrModalItem.title}</span>
              <button
                onClick={() => setQrModalItem(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#F6F8FC] rounded-xl border border-slate-200 flex items-center justify-center my-4 min-h-[240px]">
              {qrDataUrl ? (
                <Image src={qrDataUrl} alt="QR Code" width={224} height={224} unoptimized className="w-56 h-56 object-contain rounded" />
              ) : (
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-500" />
                  Generating QR assets...
                </div>
              )}
            </div>

            <div className="text-xs font-mono text-cyan-700 bg-cyan-50 p-2 rounded border border-cyan-200 mb-4 truncate">
              /r/{qrModalItem.code}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={qrDataUrl || "#"}
                download={`qr-${qrModalItem.code}.png`}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#0B1430] text-white py-2 text-xs font-bold shadow hover:bg-slate-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download PNG
              </a>
              <button
                onClick={() => setQrModalItem(null)}
                className="w-full py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VERSION HISTORY MODAL */}
      {historyModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-600 text-white">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111D3B]">
                    Version Ledger — /r/{historyModalItem.code}
                  </h3>
                  <p className="text-xs text-[#55627C]">Immutable historical snapshots of destination changes.</p>
                </div>
              </div>
              <button
                onClick={() => setHistoryModalItem(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {historyLoading ? (
              <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-500" />
                Loading version ledger...
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {historyVersions.map((v, idx) => (
                  <div
                    key={v.id}
                    className="p-4 rounded-xl border border-slate-200 bg-[#F6F8FC] flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold font-mono bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                          v{v.versionNumber}
                        </span>
                        {idx === 0 && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                            CURRENT ACTIVE
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(v.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-[#111D3B] break-all mb-1 font-medium">
                        {v.destinationUrl}
                      </div>
                      <div className="text-[11px] text-slate-500 italic">
                        {v.changeReason || "Destination updated"}
                      </div>
                    </div>

                    {idx !== 0 && (
                      <button
                        onClick={() => handleRollback(v.versionNumber)}
                        className="shrink-0 text-xs font-bold text-teal-600 hover:text-teal-700 bg-white border border-teal-200 hover:border-teal-300 px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
                      >
                        Restore v{v.versionNumber}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
