import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySessionToken } from "@/lib/session";
import SubmissionForm from "@/app/components/SubmissionForm";

export default async function SubmissionPage() {
  const session = await verifySessionToken((await cookies()).get(sessionCookieName())?.value);

  if (!session) {
    redirect("/login");
  }

  const submission = await prisma.submission.findUnique({ where: { rollNo: session.rollNo } });

  return (
    <main className="min-h-screen bg-[#f4ecd8] text-[#3d3427]">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <SubmissionForm
          initialSubmission={submission}
          user={{ name: session.name, rollNo: session.rollNo, isVerified: session.isVerified }}
        />
      </div>
    </main>
  );
}