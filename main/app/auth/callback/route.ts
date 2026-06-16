import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, sessionCookieName } from "@/lib/session";
import { fetchSsoUser } from "@/lib/sso";

export async function GET(request: NextRequest) {
  console.log({
    url: request.url,
    host: request.headers.get("host"),
    forwardedHost: request.headers.get("x-forwarded-host"),
    forwardedProto: request.headers.get("x-forwarded-proto"),
  });

  const baseUrl =
    process.env.APP_URL ??
    `https://${request.headers.get("x-forwarded-host") ?? request.headers.get("host")}`;

  const accessId = request.nextUrl.searchParams.get("accessid");

  if (!accessId) {
    return NextResponse.redirect(
      new URL("/login?error=missing_accessid", baseUrl)
    );
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
    console.log(
  "Redirecting to:",
  new URL("/dashboard", baseUrl).toString()
)
    const response = NextResponse.redirect(
      new URL("/dashboard", baseUrl)
    );

    response.cookies.set(sessionCookieName(), sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.redirect(
      new URL("/login?error=sso_failed", baseUrl)
    );
  }
}