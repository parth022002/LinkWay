import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { generateQrSvg, generateQrPngDataUrl } from "@/lib/qr";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "svg";

    const link = await prisma.link.findFirst({
      where: { id, workspaceId: session.workspaceId },
      select: { id: true, code: true, title: true },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found." }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const canonicalShortUrl = `${appUrl}/r/${link.code}`;

    if (format === "png") {
      const dataUrl = await generateQrPngDataUrl(canonicalShortUrl, { width: 512, margin: 2 });
      return NextResponse.json({
        dataUrl,
        canonicalUrl: canonicalShortUrl,
        filename: `qr-${link.code}.png`,
      });
    }

    const svg = await generateQrSvg(canonicalShortUrl, { width: 320, margin: 2 });
    return NextResponse.json({
      svg,
      canonicalUrl: canonicalShortUrl,
      filename: `qr-${link.code}.svg`,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("QR generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
