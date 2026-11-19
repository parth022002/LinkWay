import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseClientContext } from "@/lib/analytics";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const cleanCode = (code || "").trim();

  if (!cleanCode || cleanCode.length > 64) {
    return new NextResponse("Invalid short link", { status: 400 });
  }

  try {
    const link = await prisma.link.findUnique({
      where: { code: cleanCode },
    });

    // 1. Not Found or Deleted
    if (!link || link.status === "DELETED") {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>Link Not Found — LinkWay</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0B1430; color: #FFFFFF; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; text-align: center; }
              .card { background: #101B3B; border: 1px solid #1E293B; border-radius: 16px; padding: 48px 32px; max-width: 480px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
              .badge { display: inline-block; padding: 6px 12px; background: rgba(239, 68, 68, 0.2); color: #FCA5A5; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
              h1 { font-size: 28px; margin: 0 0 12px 0; font-weight: 700; }
              p { color: #94A3B8; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0; }
              a { display: inline-block; background: linear-gradient(112deg, #9636F5 0%, #2458F5 52%, #08C8E8 100%); color: #FFF; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="card">
              <span class="badge">404 Not Found</span>
              <h1>Link Does Not Exist</h1>
              <p>The short link <strong>/r/${cleanCode}</strong> could not be found or has been permanently removed by its creator.</p>
              <a href="/">Go to LinkWay Home</a>
            </div>
          </body>
        </html>`,
        { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    // 2. Paused Link
    if (link.status === "PAUSED") {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>Link Temporarily Inactive — LinkWay</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0B1430; color: #FFFFFF; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; text-align: center; }
              .card { background: #101B3B; border: 1px solid #1E293B; border-radius: 16px; padding: 48px 32px; max-width: 480px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
              .badge { display: inline-block; padding: 6px 12px; background: rgba(245, 158, 11, 0.2); color: #FCD34D; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
              h1 { font-size: 28px; margin: 0 0 12px 0; font-weight: 700; }
              p { color: #94A3B8; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0; }
              a { display: inline-block; background: #1E293B; color: #E2E8F0; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="card">
              <span class="badge">Link Paused</span>
              <h1>Temporarily Inactive</h1>
              <p>The creator of this link has temporarily paused incoming redirects. Please check back later or contact the link owner.</p>
              <a href="/">Learn About LinkWay</a>
            </div>
          </body>
        </html>`,
        { status: 410, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    // 3. Expired Link
    if (link.expiresAt && new Date() > link.expiresAt) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>Link Expired — LinkWay</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0B1430; color: #FFFFFF; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; text-align: center; }
              .card { background: #101B3B; border: 1px solid #1E293B; border-radius: 16px; padding: 48px 32px; max-width: 480px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
              .badge { display: inline-block; padding: 6px 12px; background: rgba(148, 163, 184, 0.2); color: #CBD5E1; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
              h1 { font-size: 28px; margin: 0 0 12px 0; font-weight: 700; }
              p { color: #94A3B8; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0; }
              a { display: inline-block; background: #1E293B; color: #E2E8F0; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="card">
              <span class="badge">Expired</span>
              <h1>This Link Has Expired</h1>
              <p>The campaign or time limit for this short link has ended. No further redirects will be processed.</p>
              <a href="/">Go to LinkWay</a>
            </div>
          </body>
        </html>`,
        { status: 410, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    // 4. Asynchronous Non-Blocking Redirect Event Logging
    const userAgent = req.headers.get("user-agent");
    const referer = req.headers.get("referer");
    const country =
      req.headers.get("cf-ipcountry") || req.headers.get("x-vercel-ip-country");

    const clientContext = parseClientContext(userAgent, referer, country);

    // Detached background persistence
    prisma.redirectEvent
      .create({
        data: {
          linkId: link.id,
          referrerHost: clientContext.referrerHost,
          deviceClass: clientContext.deviceClass,
          browserFamily: clientContext.browserFamily,
          osFamily: clientContext.osFamily,
          countryCode: clientContext.countryCode,
        },
      })
      .catch((err) => {
        console.error("Non-blocking analytics event capture error:", err);
      });

    // 5. Execute Redirect directly to canonical destination stored in DB
    const redirectStatus = link.redirectCode === 301 ? 301 : 302;

    const response = NextResponse.redirect(link.destinationUrl, {
      status: redirectStatus,
    });

    // Apply strict security headers
    response.headers.set("Cache-Control", "private, no-store, no-cache, max-age=0");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
  } catch (error) {
    console.error("Redirect resolver error:", error);
    return new NextResponse("Service temporarily unavailable", { status: 503 });
  }
}
