import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

import {
  getAdminSessionCookieName,
  getOrInitAdminPasswordHash,
  setAdminPasswordHash,
  verifySessionToken,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const store = await cookies();
    const token = store.get(getAdminSessionCookieName())?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifySessionToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as unknown;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { currentPassword, newPassword } = body as {
      currentPassword?: unknown;
      newPassword?: unknown;
    };

    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    }

    const existingHash = await getOrInitAdminPasswordHash();
    const ok = await bcrypt.compare(currentPassword, existingHash);
    if (!ok) {
      return NextResponse.json({ error: "Password lama salah" }, { status: 400 });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await setAdminPasswordHash(newHash);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
