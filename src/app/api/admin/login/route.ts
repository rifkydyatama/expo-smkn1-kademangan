import { NextResponse, type NextRequest } from "next/server";

import {
  createSessionToken,
  getAdminSessionCookieName,
  getAdminUsername,
  verifyAdminPassword,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as unknown;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { username, password } = body as { username?: unknown; password?: unknown };
    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Username/password required" }, { status: 400 });
    }

    const expectedUser = getAdminUsername();
    if (username !== expectedUser) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
    }

    const ok = await verifyAdminPassword(password);
    if (!ok) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
    }

    const token = createSessionToken(username);
    const res = NextResponse.json({ ok: true, username }, { status: 200 });

    res.cookies.set({
      name: getAdminSessionCookieName(),
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
