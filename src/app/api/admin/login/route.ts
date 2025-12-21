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
  } catch (err) {
    console.error("/api/admin/login error:", err);

    const message = err instanceof Error ? err.message : "Server error";
    const safeMessage = (() => {
      // In dev: return the real message to speed up debugging.
      if (process.env.NODE_ENV !== "production") return message;

      // In prod: keep generic, but allow a few safe configuration hints.
      if (message.startsWith("Missing ")) return message;
      if (/(SUPABASE|service role|service_role|Invalid API key|JWT|unauthorized)/i.test(message)) {
        return "Konfigurasi server/Supabase belum benar.";
      }
      return "Server error";
    })();

    return NextResponse.json({ error: safeMessage }, { status: 500 });
  }
}
