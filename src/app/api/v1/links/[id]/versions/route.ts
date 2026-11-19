import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const link = await prisma.link.findFirst({
      where: { id, workspaceId: session.workspaceId },
      select: { id: true, code: true },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found." }, { status: 404 });
    }

    const versions = await prisma.linkVersion.findMany({
      where: { linkId: link.id },
      orderBy: { versionNumber: "desc" },
    });

    return NextResponse.json({
      linkId: link.id,
      code: link.code,
      versions: versions.map((v) => ({
        id: v.id,
        versionNumber: v.versionNumber,
        destinationUrl: v.destinationUrl,
        title: v.title,
        changeReason: v.changeReason,
        actorUserId: v.actorUserId,
        createdAt: v.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("List versions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Rollback to a specific historical version
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await req.json();
    const targetVersionNumber = parseInt(body.versionNumber, 10);

    if (isNaN(targetVersionNumber) || targetVersionNumber < 1) {
      return NextResponse.json({ error: "Invalid version number." }, { status: 400 });
    }

    const link = await prisma.link.findFirst({
      where: { id, workspaceId: session.workspaceId },
      include: {
        versions: {
          orderBy: { versionNumber: "desc" },
        },
      },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found." }, { status: 404 });
    }

    const targetVersion = link.versions.find((v) => v.versionNumber === targetVersionNumber);
    if (!targetVersion) {
      return NextResponse.json(
        { error: `Version ${targetVersionNumber} does not exist.` },
        { status: 404 }
      );
    }

    const maxVersion = link.versions[0]?.versionNumber || 1;
    const nextVersionNumber = maxVersion + 1;

    // Execute rollback transaction
    const updatedLink = await prisma.$transaction(async (tx) => {
      // 1. Create new immutable version record
      await tx.linkVersion.create({
        data: {
          linkId: link.id,
          versionNumber: nextVersionNumber,
          destinationUrl: targetVersion.destinationUrl,
          title: targetVersion.title ?? link.title,
          changeReason: `Rollback to Version ${targetVersionNumber}`,
          actorUserId: session.userId,
        },
      });

      // 2. Update canonical link destination
      return tx.link.update({
        where: { id: link.id },
        data: {
          destinationUrl: targetVersion.destinationUrl,
          title: targetVersion.title ?? link.title,
        },
      });
    });

    await recordAuditLog({
      workspaceId: session.workspaceId,
      actorUserId: session.userId,
      action: "LINK_ROLLBACK",
      targetType: "Link",
      targetId: link.id,
      metadata: {
        code: link.code,
        targetVersionNumber,
        newVersionNumber: nextVersionNumber,
        restoredDestination: targetVersion.destinationUrl,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully rolled back to version ${targetVersionNumber}. New version ${nextVersionNumber} created.`,
      link: {
        id: updatedLink.id,
        code: updatedLink.code,
        destinationUrl: updatedLink.destinationUrl,
        version: nextVersionNumber,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Rollback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
