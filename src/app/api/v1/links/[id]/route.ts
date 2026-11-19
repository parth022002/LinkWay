import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { updateLinkSchema } from "@/lib/validation";
import { recordAuditLog } from "@/lib/audit";
import { Prisma } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const link = await prisma.link.findFirst({
      where: {
        id,
        workspaceId: session.workspaceId,
      },
      include: {
        campaign: true,
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 10,
        },
        _count: {
          select: { events: true },
        },
      },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found." }, { status: 404 });
    }

    return NextResponse.json({
      link: {
        id: link.id,
        code: link.code,
        title: link.title || "Untitled Link",
        destinationUrl: link.destinationUrl,
        status: link.status,
        redirectCode: link.redirectCode,
        campaign: link.campaign,
        expiresAt: link.expiresAt?.toISOString() || null,
        createdAt: link.createdAt.toISOString(),
        updatedAt: link.updatedAt.toISOString(),
        recordedEvents: link._count.events,
        versions: link.versions.map((v) => ({
          id: v.id,
          versionNumber: v.versionNumber,
          destinationUrl: v.destinationUrl,
          title: v.title,
          changeReason: v.changeReason,
          actorUserId: v.actorUserId,
          createdAt: v.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get link details error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await req.json();
    const data = updateLinkSchema.parse(body);

    const existingLink = await prisma.link.findFirst({
      where: { id, workspaceId: session.workspaceId },
      include: {
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 1,
        },
      },
    });

    if (!existingLink) {
      return NextResponse.json({ error: "Link not found." }, { status: 404 });
    }

    const updates: Prisma.LinkUpdateInput = {};
    if (data.title !== undefined) updates.title = data.title;
    if (data.status !== undefined) updates.status = data.status;
    if (data.campaignId !== undefined) {
      updates.campaign = data.campaignId ? { connect: { id: data.campaignId } } : { disconnect: true };
    }

    const destinationChanged =
      data.destinationUrl && data.destinationUrl !== existingLink.destinationUrl;

    if (destinationChanged) {
      updates.destinationUrl = data.destinationUrl;
    }

    // Perform update in transaction to maintain version consistency
    const latestVersionNum = existingLink.versions[0]?.versionNumber || 1;

    const updated = await prisma.$transaction(async (tx) => {
      if (destinationChanged) {
        await tx.linkVersion.create({
          data: {
            linkId: existingLink.id,
            versionNumber: latestVersionNum + 1,
            destinationUrl: data.destinationUrl!,
            title: data.title ?? existingLink.title,
            changeReason: data.changeReason || "Destination updated",
            actorUserId: session.userId,
          },
        });
      }

      return tx.link.update({
        where: { id: existingLink.id },
        data: updates,
        include: {
          campaign: true,
          versions: {
            orderBy: { versionNumber: "desc" },
            take: 5,
          },
          _count: {
            select: { events: true },
          },
        },
      });
    });

    await recordAuditLog({
      workspaceId: session.workspaceId,
      actorUserId: session.userId,
      action: destinationChanged ? "LINK_DESTINATION_UPDATED" : "LINK_UPDATED",
      targetType: "Link",
      targetId: updated.id,
      metadata: {
        code: updated.code,
        destinationChanged,
        newStatus: updated.status,
      },
    });

    return NextResponse.json({
      link: {
        id: updated.id,
        code: updated.code,
        title: updated.title,
        destinationUrl: updated.destinationUrl,
        status: updated.status,
        campaign: updated.campaign,
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update link error:", error);
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const existingLink = await prisma.link.findFirst({
      where: { id, workspaceId: session.workspaceId },
    });

    if (!existingLink) {
      return NextResponse.json({ error: "Link not found." }, { status: 404 });
    }

    // Soft delete to preserve audit history and prevent redirect resolution
    await prisma.link.update({
      where: { id: existingLink.id },
      data: { status: "DELETED" },
    });

    await recordAuditLog({
      workspaceId: session.workspaceId,
      actorUserId: session.userId,
      action: "LINK_DELETED",
      targetType: "Link",
      targetId: existingLink.id,
      metadata: { code: existingLink.code },
    });

    return NextResponse.json({ success: true, message: "Link deleted successfully." });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete link error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
