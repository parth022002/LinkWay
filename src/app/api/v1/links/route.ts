import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { createLinkSchema } from "@/lib/validation";
import { generateShortCode } from "@/lib/short-code";
import { recordAuditLog } from "@/lib/audit";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const campaignId = searchParams.get("campaignId") || undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.LinkWhereInput = {
      workspaceId: session.workspaceId,
    };

    if (status && status !== "ALL") {
      where.status = status;
    } else {
      where.status = { not: "DELETED" }; // Exclude deleted by default
    }

    if (campaignId) {
      where.campaignId = campaignId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { code: { contains: search } },
        { destinationUrl: { contains: search } },
      ];
    }

    const [links, total] = await Promise.all([
      prisma.link.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          campaign: {
            select: { id: true, name: true },
          },
          _count: {
            select: { events: true },
          },
        },
      }),
      prisma.link.count({ where }),
    ]);

    const formattedLinks = links.map((l) => ({
      id: l.id,
      code: l.code,
      title: l.title || "Untitled Link",
      destinationUrl: l.destinationUrl,
      status: l.status,
      redirectCode: l.redirectCode,
      campaign: l.campaign,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
      expiresAt: l.expiresAt?.toISOString() || null,
      recordedEvents: l._count.events,
    }));

    return NextResponse.json({
      links: formattedLinks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("List links error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const data = createLinkSchema.parse(body);

    // Collision check / code determination
    let finalCode = data.customCode?.trim();
    if (finalCode) {
      const existing = await prisma.link.findUnique({
        where: { code: finalCode },
      });
      if (existing) {
        return NextResponse.json(
          { error: `The custom code '${finalCode}' is already taken. Please choose another.` },
          { status: 409 }
        );
      }
    } else {
      // Retry loop for collision resistance
      let attempts = 0;
      let generated = "";
      while (attempts < 5) {
        generated = generateShortCode();
        const existing = await prisma.link.findUnique({
          where: { code: generated },
        });
        if (!existing) {
          finalCode = generated;
          break;
        }
        attempts++;
      }
      if (!finalCode) {
        return NextResponse.json(
          { error: "Could not generate a unique short code. Please try again." },
          { status: 500 }
        );
      }
    }

    // Create Link + Version 1 in transaction
    const link = await prisma.link.create({
      data: {
        workspaceId: session.workspaceId,
        code: finalCode,
        title: data.title || null,
        destinationUrl: data.destinationUrl,
        campaignId: data.campaignId || null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        status: "ACTIVE",
        versions: {
          create: {
            versionNumber: 1,
            destinationUrl: data.destinationUrl,
            title: data.title || null,
            changeReason: "Initial link creation",
            actorUserId: session.userId,
          },
        },
        qrAssets: {
          create: {
            styleJson: JSON.stringify({ colorDark: "#0B1430" }),
          },
        },
      },
      include: {
        campaign: { select: { id: true, name: true } },
      },
    });

    await recordAuditLog({
      workspaceId: session.workspaceId,
      actorUserId: session.userId,
      action: "LINK_CREATED",
      targetType: "Link",
      targetId: link.id,
      metadata: { code: link.code, destinationUrl: link.destinationUrl },
    });

    return NextResponse.json(
      {
        id: link.id,
        code: link.code,
        title: link.title || "Untitled Link",
        destinationUrl: link.destinationUrl,
        status: link.status,
        campaign: link.campaign,
        createdAt: link.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create link error:", error);
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
