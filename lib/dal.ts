import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { API_URL } from "@/lib/api";
import { readToken } from "@/lib/session";

export type CurrentUser = {
  id: number;
  email: string;
  role: string;
  studentId: number | null;
};

// The real check: the API verifies the signature and looks in the database.
export const verifySession = cache(async (): Promise<CurrentUser> => {
  const token = await readToken();
  if (!token) redirect("/login");

  const res = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 401) redirect("/login");
  // any other error is a failure, not "not logged in": let it propagate
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
});
