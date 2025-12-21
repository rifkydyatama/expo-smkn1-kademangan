import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getAdminSessionCookieName, verifySessionToken } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = await cookies();
    const token = store.get(getAdminSessionCookieName())?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json(
      { authenticated: true, username: payload.username },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
