import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_COPUBLIKA_DEMO_MODE !== "true") {
    return NextResponse.json({ error: "Demo mode disabled" }, { status: 404 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("copublika-demo", "enabled", {
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/",
  });
  return response;
}