import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const linkId = searchParams.get("linkId") || undefined;

    const whereLink: Prisma.LinkWhereInput = { workspaceId: session.workspaceId };
    if (linkId) whereLink.id = linkId;

    const links = await prisma.link.findMany({
      where: whereLink,
      select: { id: true, code: true, title: true, destinationUrl: true },
    });

    const linkMap = new Map(links.map((l) => [l.id, l]));
    const linkIds = Array.from(linkMap.keys());

    const events = await prisma.redirectEvent.findMany({
      where: { linkId: { in: linkIds } },
      orderBy: { occurredAt: "desc" },
      take: 5000, // Capped to avoid memory exhaustion
    });

    // Generate CSV
    const rows = [
      ["Event ID", "Occurred At", "Short Code", "Link Title", "Referrer Host", "Device Class", "Browser", "Country Code"],
    ];

    for (const ev of events) {
      const parentLink = linkMap.get(ev.linkId);
      rows.push([
        ev.id,
        ev.occurredAt.toISOString(),
        parentLink?.code || "",
        (parentLink?.title || "Untitled").replace(/"/g, '""'),
        ev.referrerHost || "Direct / None",
        ev.deviceClass || "Desktop",
        ev.browserFamily || "Other",
        ev.countryCode || "Unknown",
      ]);
    }

    const csvContent = rows
      .map((r) => r.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="linkway-analytics-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Export error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
