import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, sessionCookieName } from "@/lib/session";
import { fetchSsoUser } from "@/lib/sso";
console.log("CALLBACK URL:", request.url);
export async function GET(request: NextRequest) {
  const accessId = request.nextUrl.searchParams.get("accessid");

  if (!accessId) {
    return NextResponse.redirect(new URL("/login?error=missing_accessid", request.url));
  }

  try {
    const userData = await fetchSsoUser(accessId);
    const branch = userData.department || "Unknown";

    const user = await prisma.user.upsert({
      where: { rollNo: userData.roll },
      update: {
        name: userData.name,
        branch,
      },
      create: {
        name: userData.name,
        rollNo: userData.roll,
        branch,
      },
    });

    await prisma.submission.upsert({
      where: { rollNo: user.rollNo },
      update: { name: user.name },
      create: {
        rollNo: user.rollNo,
        name: user.name,
      },
    });

    const sessionToken = await createSessionToken({
      rollNo: user.rollNo,
      name: user.name,
      branch: user.branch,
      isVerified: user.isVerified,
    });

    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set(sessionCookieName(), sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL("/login?error=sso_failed", request.url));
  }
}