import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySessionToken } from "@/lib/session";
import VerificationBoard from "@/app/components/VerificationBoard";

export default async function VerificationPage() {
  const session = await verifySessionToken((await cookies()).get(sessionCookieName())?.value);

  if (!session) {
    redirect("/login");
  }

  if (!session.isVerified) {
    redirect("/dashboard");
  }

  const submissions = await prisma.submission.findMany({ orderBy: [{ name: "asc" }, { rollNo: "asc" }] });

  return (
    <main className="min-h-screen bg-[#f4ecd8] text-[#3d3427]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <VerificationBoard submissions={submissions} />
      </div>
    </main>
  );
}