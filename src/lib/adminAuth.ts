import "server-only";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const COOKIE_NAME = "admin_session";

type SessionPayload = {
  sub: "admin";
  username: string;
  iat: number;
  exp: number;
};

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET.");
  }
  return secret;
}

export function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME?.trim() || "admin";
}

function getInitialAdminPassword(): string {
  return process.env.ADMIN_INITIAL_PASSWORD || "admin123";
}

function base64UrlEncode(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecodeToString(input: string): string {
  const pad = input.length % 4;
  const padded = input + (pad ? "=".repeat(4 - pad) : "");
  return Buffer.from(padded.replaceAll("-", "+").replaceAll("_", "/"), "base64").toString(
    "utf8",
  );
}

function sign(data: string): string {
  const secret = getSessionSecret();
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

export function getAdminSessionCookieName(): string {
  return COOKIE_NAME;
}

export function createSessionToken(username: string, ttlSeconds = 60 * 60 * 24 * 7): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: "admin",
    username,
    iat: now,
    exp: now + ttlSeconds,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const sig = sign(encodedPayload);
  return `${encodedPayload}.${sig}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [encodedPayload, sig] = token.split(".");
  if (!encodedPayload || !sig) return null;

  const expected = sign(encodedPayload);
  try {
    // constant-time compare
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }

  try {
    const json = base64UrlDecodeToString(encodedPayload);
    const parsed = JSON.parse(json) as SessionPayload;
    if (!parsed || parsed.sub !== "admin") return null;
    if (typeof parsed.exp !== "number" || parsed.exp < Math.floor(Date.now() / 1000)) return null;
    if (typeof parsed.username !== "string" || !parsed.username) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function getSettingValue(key: string): Promise<string | null> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("event_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) throw error;
  return data?.value ?? null;
}

async function upsertSettingValue(key: string, value: string): Promise<void> {
  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin
    .from("event_settings")
    .upsert({ key, value }, { onConflict: "key" });
  if (error) throw error;
}

export async function getOrInitAdminPasswordHash(): Promise<string> {
  const existing = await getSettingValue("admin_password_hash");
  if (existing) return existing;

  const initialPassword = getInitialAdminPassword();
  const hash = await bcrypt.hash(initialPassword, 10);
  await upsertSettingValue("admin_password_hash", hash);
  return hash;
}

export async function setAdminPasswordHash(hash: string): Promise<void> {
  await upsertSettingValue("admin_password_hash", hash);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = await getOrInitAdminPasswordHash();
  return bcrypt.compare(password, hash);
}
