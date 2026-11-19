import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { createCampaignSchema } from "@/lib/validation";
import { recordAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    const session = await requireAuth();

    const campaigns = await prisma.campaign.findMany({
      where: { workspaceId: session.workspaceId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { links: true },
        },
      },
    });

    return NextResponse.json({
      campaigns: campaigns.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        channel: c.channel,
        utmSource: c.utmSource,
        utmMedium: c.utmMedium,
        createdAt: c.createdAt.toISOString(),
        linkCount: c._count.links,
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("List campaigns error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const data = createCampaignSchema.parse(body);

    const campaign = await prisma.campaign.create({
      data: {
        workspaceId: session.workspaceId,
        name: data.name,
        description: data.description || null,
        channel: data.channel || null,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
      },
    });

    await recordAuditLog({
      workspaceId: session.workspaceId,
      actorUserId: session.userId,
      action: "CAMPAIGN_CREATED",
      targetType: "Campaign",
      targetId: campaign.id,
      metadata: { name: campaign.name, channel: campaign.channel },
    });

    return NextResponse.json(
      {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        channel: campaign.channel,
        utmSource: campaign.utmSource,
        utmMedium: campaign.utmMedium,
        createdAt: campaign.createdAt.toISOString(),
        linkCount: 0,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create campaign error:", error);
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
