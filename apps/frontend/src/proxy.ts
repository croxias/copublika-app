import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { updateSession } from "@/lib/supabase/middleware";

/** Pages only signed-in members may open. Each page still verifies the session itself. */
const MEMBER_ONLY = ["/research-project/"];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (MEMBER_ONLY.some((p) => pathname.startsWith(p)) && !getSessionCookie(request)) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname + search);
    login.searchParams.set("reason", "research");
    return NextResponse.redirect(login);
  }
  // Admin dashboard still runs on Supabase sessions.
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
