import { NextResponse } from "next/server";

import { getAdminSessionCookieName } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.cookies.set({
    name: getAdminSessionCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
