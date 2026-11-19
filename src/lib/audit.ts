import { prisma } from "@/lib/db";

export async function recordAuditLog({
  workspaceId,
  actorUserId,
  action,
  targetType,
  targetId,
  metadata,
}: {
  workspaceId: string;
  actorUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        workspaceId,
        actorUserId,
        action,
        targetType,
        targetId,
        metadataJson: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
