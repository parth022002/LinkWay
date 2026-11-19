import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { signupSchema } from "@/lib/validation";
import { WORKSPACE_ROLES } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(data.password);

    // Create user and default workspace in a transaction
    const slugBase = data.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const uniqueSlug = `${slugBase || "workspace"}-${Math.random().toString(36).substring(2, 6)}`;

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        name: data.name,
        memberships: {
          create: {
            role: WORKSPACE_ROLES.OWNER,
            workspace: {
              create: {
                name: `${data.name}'s Workspace`,
                slug: uniqueSlug,
              },
            },
          },
        },
      },
      include: {
        memberships: {
          include: {
            workspace: true,
          },
        },
      },
    });

    const activeWorkspace = user.memberships[0].workspace;

    // Issue session token
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      workspaceId: activeWorkspace.id,
      role: WORKSPACE_ROLES.OWNER,
    });

    await setSessionCookie(token);

    return NextResponse.json(
      {
        user: { id: user.id, email: user.email, name: user.name },
        workspace: { id: activeWorkspace.id, name: activeWorkspace.name, slug: activeWorkspace.slug },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Signup error:", error);
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
