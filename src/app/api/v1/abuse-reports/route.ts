import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { abuseReportSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = abuseReportSchema.parse(body);

    const link = await prisma.link.findUnique({
      where: { code: data.shortCode },
    });

    const report = await prisma.abuseReport.create({
      data: {
        shortCode: data.shortCode,
        linkId: link?.id || null,
        category: data.category,
        description: data.description,
        reporterEmail: data.reporterEmail || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        reportId: report.id,
        message: "Your report has been received and logged for immediate security review.",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Abuse report error:", error);
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
