import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LoginButton from "@/app/components/LoginButton";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySessionToken } from "@/lib/session";

const weekCards = [1, 2, 3, 4] as const;

function getWeekStatus(submission: Awaited<ReturnType<typeof prisma.submission.findUnique>>, week: 1 | 2 | 3 | 4) {
  if (!submission) {
    return false;
  }

  if (week === 1) return submission.week1Verified;
  if (week === 2) return submission.week2Verified;
  if (week === 3) return submission.week3Verified;
  return submission.week4Verified;
}

export default async function DashboardPage() {
  const session = await verifySessionToken((await cookies()).get(sessionCookieName())?.value);

  if (!session) {
    redirect("/login");
  }

  const [user, submission] = await Promise.all([
    prisma.user.findUnique({ where: { rollNo: session.rollNo } }),
    prisma.submission.findUnique({ where: { rollNo: session.rollNo } }),
  ]);

  return (
    <main className="min-h-screen bg-[#f4ecd8] text-[#3d3427]">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10">
        <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-[#e2d3b4] bg-[#fbf6ea] p-6 shadow-[0_16px_50px_rgba(115,88,46,0.08)] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#9a7b4f]">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Welcome, {user?.name ?? session.name}</h1>
            <p className="mt-1 text-sm text-[#75644f]">Roll no. {session.rollNo} · {session.branch}</p>
          </div>
          <div className="flex gap-3">
            <a className="rounded-full border border-[#d7c3a0] px-4 py-2 text-sm font-medium" href="/submission">Submission</a>
            {session.isVerified ? <a className="rounded-full border border-[#d7c3a0] px-4 py-2 text-sm font-medium" href="/verification">Verification</a> : null}
          </div>
        </header>

        <section className="mb-8 rounded-[2rem] border border-[#e2d3b4] bg-[#fffaf0] p-6 shadow-[0_16px_50px_rgba(115,88,46,0.06)]">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9a7b4f]">Submission overview</p>
              <h2 className="mt-1 text-2xl font-semibold">Single repository link</h2>
            </div>
            <p className="text-sm text-[#75644f]">The same repository is tracked across all four weeks.</p>
          </div>
          <div className="mt-4 rounded-[1.5rem] border border-dashed border-[#d8c7a5] bg-white px-5 py-4 text-sm text-[#6d5d47]">
            {submission?.repositoryLink ?? "No repository link submitted yet."}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {weekCards.map((week) => {
            const verified = getWeekStatus(submission, week);
            return (
              <article key={week} className="min-h-64 rounded-[1.75rem] border border-[#e2d3b4] bg-[#fffaf0] p-5 shadow-[0_16px_50px_rgba(115,88,46,0.05)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Week {week}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${verified ? "bg-[#d8e7c8] text-[#4e6433]" : "bg-[#f1e5c9] text-[#8d6f3c]"}`}>
                    {verified ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="mt-4 flex min-h-40 items-center justify-center rounded-[1.35rem] border border-dashed border-[#dac7a2] bg-white px-4 text-center text-sm leading-6 text-[#7d6d56]">
                  Instructor resources placeholder for Week {week}.
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-8 rounded-[2rem] border border-[#e2d3b4] bg-[#fbf6ea] p-6 shadow-[0_16px_50px_rgba(115,88,46,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9a7b4f]">Progress</p>
          <div className="mt-4 grid gap-4 md:grid-cols-5">
            {weekCards.map((week) => {
              const done = getWeekStatus(submission, week);
              return (
                <div key={week} className="rounded-2xl bg-white p-4">
                  <p className="text-sm text-[#75644f]">Week {week}</p>
                  <p className="mt-1 text-lg font-semibold">{done ? "Approved" : "In review"}</p>
                </div>
              );
            })}
            <div className="rounded-2xl bg-white p-4">
              <p className="text-sm text-[#75644f]">Final</p>
              <p className="mt-1 text-lg font-semibold">{submission?.finalVerified ? "Complete" : "Pending"}</p>
            </div>
          </div>
        </section>

        <div className="mt-6">
          <LoginButton />
        </div>
      </div>
    </main>
  );
}