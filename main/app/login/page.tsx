import LoginButton from "@/app/components/LoginButton";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f4ecd8] text-[#3d3427]">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-12">
        <section className="grid w-full gap-10 rounded-[2rem] border border-[#e2d3b4] bg-[#fbf6ea] p-8 shadow-[0_20px_80px_rgba(115,88,46,0.12)] md:grid-cols-[1.15fr_0.85fr] md:p-12">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#9a7b4f]">LearnerSpace 2026</p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight md:text-6xl">
              Weekly project submissions, organized with a calm and clear workflow.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#695943]">
              Sign in through IITB SSO to submit your project repository, track week-by-week verification,
              and review the weekly resources provided by instructors.
            </p>
          </div>
          <div className="flex items-center justify-center rounded-[1.75rem] border border-dashed border-[#d7c3a0] bg-[#fffdf8] p-8">
            <div className="max-w-sm space-y-4 text-center">
              <h2 className="text-2xl font-semibold text-[#3d3427]">Continue with SSO</h2>
              <p className="text-sm leading-6 text-[#7a6a54]">
                Use the project SSO portal to authenticate and unlock your dashboard.
              </p>
              <LoginButton />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}