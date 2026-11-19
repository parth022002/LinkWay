import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);

    const range = searchParams.get("range") || "7d";
    const linkId = searchParams.get("linkId") || undefined;
    const campaignId = searchParams.get("campaignId") || undefined;

    // Calculate start date
    const now = new Date();
    let startDate = new Date();
    if (range === "24h") {
      startDate.setHours(now.getHours() - 24);
    } else if (range === "7d") {
      startDate.setDate(now.getDate() - 7);
    } else if (range === "30d") {
      startDate.setDate(now.getDate() - 30);
    } else if (range === "90d") {
      startDate.setDate(now.getDate() - 90);
    } else {
      startDate = new Date(0); // All time
    }

    // Build query conditions
    const linkFilter: Prisma.LinkWhereInput = {
      workspaceId: session.workspaceId,
    };
    if (linkId) linkFilter.id = linkId;
    if (campaignId) linkFilter.campaignId = campaignId;

    // Fetch matching links
    const matchingLinks = await prisma.link.findMany({
      where: linkFilter,
      select: { id: true },
    });

    const matchingLinkIds = matchingLinks.map((l) => l.id);

    if (matchingLinkIds.length === 0) {
      return NextResponse.json({
        totalRecordedEvents: 0,
        timeseries: [],
        referrers: [],
        devices: [],
        browsers: [],
        countries: [],
      });
    }

    const events = await prisma.redirectEvent.findMany({
      where: {
        linkId: { in: matchingLinkIds },
        occurredAt: { gte: startDate },
      },
      select: {
        occurredAt: true,
        referrerHost: true,
        deviceClass: true,
        browserFamily: true,
        countryCode: true,
      },
      orderBy: { occurredAt: "asc" },
    });

    const totalRecordedEvents = events.length;

    // 1. Group into timeseries buckets
    const timeseriesMap = new Map<string, number>();
    for (const ev of events) {
      const dateKey =
        range === "24h"
          ? ev.occurredAt.toISOString().slice(0, 13) + ":00" // Hourly bucket
          : ev.occurredAt.toISOString().slice(0, 10); // Daily bucket
      timeseriesMap.set(dateKey, (timeseriesMap.get(dateKey) || 0) + 1);
    }
    const timeseries = Array.from(timeseriesMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    // 2. Referrer breakdown
    const referrerMap = new Map<string, number>();
    for (const ev of events) {
      const host = ev.referrerHost || "Direct / None";
      referrerMap.set(host, (referrerMap.get(host) || 0) + 1);
    }
    const referrers = Array.from(referrerMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 3. Device breakdown
    const deviceMap = new Map<string, number>();
    for (const ev of events) {
      const dev = ev.deviceClass || "Desktop";
      deviceMap.set(dev, (deviceMap.get(dev) || 0) + 1);
    }
    const devices = Array.from(deviceMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // 4. Browser breakdown
    const browserMap = new Map<string, number>();
    for (const ev of events) {
      const b = ev.browserFamily || "Other";
      browserMap.set(b, (browserMap.get(b) || 0) + 1);
    }
    const browsers = Array.from(browserMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // 5. Country breakdown
    const countryMap = new Map<string, number>();
    for (const ev of events) {
      const c = ev.countryCode || "Unknown";
      countryMap.set(c, (countryMap.get(c) || 0) + 1);
    }
    const countries = Array.from(countryMap.entries())
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      totalRecordedEvents,
      range,
      timeseries,
      referrers,
      devices,
      browsers,
      countries,
      statement: "Metrics reflect recorded redirect requests. Bot traffic is classified and disclosed.",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Analytics summary error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
