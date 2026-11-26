import { NextResponse, type NextRequest } from "next/server";

// An optimistic check: we only look at whether the cookie exists. The authenticity
// of the token will be checked by the API when the page calls verifySession().
export function proxy(request: NextRequest) {
  if (!request.cookies.has("session")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/account/:path*"] };
