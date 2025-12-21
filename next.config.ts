import type { NextConfig } from "next";

function getHostname(rawUrl: string | undefined): string | null {
  if (!rawUrl) return null;
  try {
    return new URL(rawUrl).hostname;
  } catch {
    return null;
  }
}

const supabaseHostname = getHostname(process.env.NEXT_PUBLIC_SUPABASE_URL);

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      // Supabase storage/public URLs (derived from env to avoid hardcoding)
      ...(supabaseHostname ? [{ protocol: "https" as const, hostname: supabaseHostname }] : []),
      // Fallback for the current project domain (kept for backwards compatibility)
      { protocol: "https", hostname: "mlywpfcalretnnklvhlb.supabase.co" },
      // Common placeholders used in admin
      { protocol: "https", hostname: "via.placeholder.com" },
      // YouTube thumbnails
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
