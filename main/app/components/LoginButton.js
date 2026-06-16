"use client";

const NEXT_PUBLIC_PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;

export default function LoginButton() {
  const handleLogin = () => {
    window.location.href = `https://sso.tech-iitb.org/project/7eb1de06-b2db-4a1f-8dce-6f6ea1b608ad/ssocall/`;
  };

  return (
    <button
      onClick={handleLogin}
      className="rounded-full bg-[#3d3427] px-6 py-3 font-semibold text-[#f7f0e1] transition-colors hover:bg-[#554530]"
    >
      Login with SSO
    </button>
  );
}