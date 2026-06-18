"use client";

import { useMemo, useState, useTransition } from "react";

type Submission = {
  repositoryLink: string | null;
  week1Verified: boolean;
  week2Verified: boolean;
  week3Verified: boolean;
  week4Verified: boolean;
  finalVerified: boolean;
} | null;

type Props = {
  initialSubmission: Submission;
  user: {
    name: string;
    rollNo: string;
    isVerified: boolean;
  };
};

const weekLabels = [1, 2, 3, 4] as const;

export default function SubmissionForm({ initialSubmission, user }: Props) {
  const [repositoryLink, setRepositoryLink] = useState(initialSubmission?.repositoryLink ?? "");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const progress = useMemo(
    () => weekLabels.map((week) => Boolean(initialSubmission?.[`week${week}Verified` as const])),
    [initialSubmission],
  );

  const locked = Boolean(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    startTransition(async () => {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repositoryLink }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message ?? "Unable to save submission.");
        return;
      }

      setMessage("Repository link saved successfully.");
      window.location.reload();
    });
  }

  return (
    <section className="space-y-6 rounded-4xl border border-[#e2d3b4] bg-[#fbf6ea] p-8 shadow-[0_20px_80px_rgba(115,88,46,0.12)]">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9a7b4f]">Submission</p>
        <h1 className="text-3xl font-semibold">Submit your project repository</h1>
        <p className="text-sm text-[#75644f]">{user.name} · {user.rollNo}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-medium">GitHub repository link</span>
          <input
            value={repositoryLink}
            onChange={(event) => setRepositoryLink(event.target.value)}
            type="url"
            placeholder="https://github.com/your-team/project"
            className="w-full rounded-2xl border border-[#d7c3a0] bg-white px-4 py-3 outline-none ring-0 focus:border-[#b99b6a]"
            required
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending || locked}
            className="rounded-full bg-[#3d3427] px-5 py-3 text-sm font-semibold text-[#f7f0e1] disabled:opacity-50"
          >
            {initialSubmission?.repositoryLink ? "Update link" : "Submit link"}
          </button>
          <p className="text-sm text-[#75644f]">
            {initialSubmission?.repositoryLink ? "The current link is stored for the full 4-week cycle." : "Updated"}
          </p>
        </div>
      </form>

      {message ? <p className="rounded-2xl bg-white px-4 py-3 text-sm text-[#5d4f3d]">{message}</p> : null}

      <div className="grid gap-3 md:grid-cols-5">
        {progress.map((done, index) => (
          <div key={weekLabels[index]} className="rounded-2xl bg-white p-4">
            <p className="text-sm text-[#75644f]">Week {weekLabels[index]}</p>
            <p className="mt-1 font-semibold">{done ? "Verified" : "Waiting"}</p>
          </div>
        ))}
        <div className="rounded-2xl bg-white p-4">
          <p className="text-sm text-[#75644f]">Final</p>
          <p className="mt-1 font-semibold">{initialSubmission?.finalVerified ? "Approved" : "Pending"}</p>
        </div>
      </div>
    </section>
  );
}