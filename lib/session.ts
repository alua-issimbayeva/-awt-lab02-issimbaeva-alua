import "server-only";
import { cookies } from "next/headers";

const COOKIE = "session";

// The token is stored in an httpOnly cookie: the page's JavaScript can't read it.
export async function saveToken(token: string, maxAgeSeconds: number) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, // document.cookie doesn't see it: XSS can't steal the token
    secure: true, // HTTPS only (browsers make an exception for localhost)
    sameSite: "lax", // not sent with requests started by another site (CSRF)
    path: "/",
    maxAge: maxAgeSeconds, // the cookie doesn't outlive the token
  });
}

export async function readToken() {
  return (await cookies()).get(COOKIE)?.value;
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE);
}
