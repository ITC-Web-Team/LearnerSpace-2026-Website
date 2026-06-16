export type SsoUser = {
  name: string;
  roll: string;
  department: string;
  degree: string;
  passing_year: number;
};

export async function fetchSsoUser(accessId: string) {
  const response = await fetch("https://sso.tech-iitb.org/project/getuserdata", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: accessId }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data from SSO");
  }

  return (await response.json()) as SsoUser;
}