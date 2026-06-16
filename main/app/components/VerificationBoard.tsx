"use client";

import { useState, useTransition } from "react";

type Submission = {
  rollNo: string;
  name: string;
  repositoryLink: string | null;
  week1Verified: boolean;
  week2Verified: boolean;
  week3Verified: boolean;
  week4Verified: boolean;
  finalVerified: boolean;
};

type Props = {
  submissions: Submission[];
};

const weeks = [1, 2, 3, 4] as const;

export default function VerificationBoard({ submissions }: Props) {
  const [items, setItems] = useState(submissions);
  const [pending, startTransition] = useTransition();

  function updateWeek(rollNo: string, week: 1 | 2 | 3 | 4, verified: boolean) {
    startTransition(async () => {
      const response = await fetch("/api/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNo, week, verified }),
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as { submission: Submission };
      setItems((current) => current.map((item) => (item.rollNo === rollNo ? data.submission : item)));
    });
  }

  return (
    <section className="space-y-6 rounded-4xl border border-[#e2d3b4] bg-[#fbf6ea] p-8 shadow-[0_20px_80px_rgba(115,88,46,0.12)]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9a7b4f]">Verification</p>
        <h1 className="text-3xl font-semibold">Instructor verification dashboard</h1>
      </div>

      <div className="space-y-4">
        {items.map((submission) => (
          <article key={submission.rollNo} className="rounded-[1.75rem] border border-[#decaa6] bg-white p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">{submission.name}</h2>
                <p className="text-sm text-[#75644f]">Roll no. {submission.rollNo}</p>
              </div>
              <a href={submission.repositoryLink ?? "#"} className="break-all text-sm text-[#8a6740] underline decoration-[#c7b28b] underline-offset-4">
                {submission.repositoryLink ?? "No repository submitted"}
              </a>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-5">
              {weeks.map((week) => {
                const key = `week${week}Verified` as const;
                const verified = submission[key];
                return (
                  <div key={week} className="rounded-2xl bg-[#f9f4e8] p-4">
                    <p className="text-sm text-[#75644f]">Week {week}</p>
                    <p className="mt-1 font-semibold">{verified ? "Verified" : "Pending"}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateWeek(submission.rollNo, week, true)}
                        disabled={pending}
                        className="rounded-full bg-[#3d3427] px-3 py-2 text-xs font-semibold text-[#f7f0e1] disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => updateWeek(submission.rollNo, week, false)}
                        disabled={pending}
                        className="rounded-full border border-[#d7c3a0] px-3 py-2 text-xs font-semibold text-[#3d3427] disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="rounded-2xl bg-[#f9f4e8] p-4">
                <p className="text-sm text-[#75644f]">Final</p>
                <p className="mt-1 font-semibold">{submission.finalVerified ? "Approved" : "Pending"}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}