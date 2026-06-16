import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySessionToken } from "@/lib/session";

async function getVerifiedSession(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get(sessionCookieName())?.value);
  if (!session || !session.isVerified) {
    return null;
  }
  return session;
}

export async function GET(request: NextRequest) {
  const session = await getVerifiedSession(request);
  if (!session) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const submissions = await prisma.submission.findMany({
    orderBy: [{ name: "asc" }, { rollNo: "asc" }],
  });

  return NextResponse.json({ submissions });
}

export async function POST(request: NextRequest) {
  const session = await getVerifiedSession(request);
  if (!session) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as {
    rollNo?: string;
    week?: 1 | 2 | 3 | 4;
    verified?: boolean;
    finalVerified?: boolean;
  } | null;

  if (!body?.rollNo || !body.week || typeof body.verified !== "boolean") {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }

  const weekField = `week${body.week}Verified` as const;
  const current = await prisma.submission.findUnique({ where: { rollNo: body.rollNo } });

  if (!current) {
    return NextResponse.json({ message: "Submission not found." }, { status: 404 });
  }

  const weekValues = {
    week1Verified: body.week === 1 ? body.verified : current.week1Verified,
    week2Verified: body.week === 2 ? body.verified : current.week2Verified,
    week3Verified: body.week === 3 ? body.verified : current.week3Verified,
    week4Verified: body.week === 4 ? body.verified : current.week4Verified,
  };

  const finalVerified = Object.values(weekValues).every(Boolean);
  const updated = await prisma.submission.update({
    where: { rollNo: body.rollNo },
    data: {
      [weekField]: body.verified,
      finalVerified,
    },
  });

  return NextResponse.json({ submission: updated });
}