import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySessionToken } from "@/lib/session";
import { isValidRepositoryUrl, normalizeRepositoryUrl } from "@/lib/validation";

async function getSession(request: NextRequest) {
  return verifySessionToken(request.cookies.get(sessionCookieName())?.value);
}

export async function GET(request: NextRequest) {
  const session = await getSession(request);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [submission, user] = await Promise.all([
    prisma.submission.findUnique({ where: { rollNo: session.rollNo } }),
    prisma.user.findUnique({ where: { rollNo: session.rollNo } }),
  ]);

  return NextResponse.json({ submission, user });
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { repositoryLink?: string } | null;
  const repositoryLink = normalizeRepositoryUrl(body?.repositoryLink ?? "");

  if (!repositoryLink || !isValidRepositoryUrl(repositoryLink)) {
    return NextResponse.json({ message: "Enter a valid repository URL." }, { status: 400 });
  }

  const existing = await prisma.submission.findUnique({ where: { rollNo: session.rollNo } });

  if (!existing) {
    return NextResponse.json({ message: "Submission record not found." }, { status: 404 });
  }

  if (existing.repositoryLink && existing.repositoryLink !== repositoryLink) {
    return NextResponse.json({ message: "Repository link can only be submitted once." }, { status: 409 });
  }

  const submission = await prisma.submission.update({
    where: { rollNo: session.rollNo },
    data: { repositoryLink },
  });

  return NextResponse.json({ submission });
}