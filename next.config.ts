import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      // Supabase storage/public URLs
      { protocol: "https", hostname: "mlywpfcalretnnklvhlb.supabase.co" },
      // Common placeholders used in admin
      { protocol: "https", hostname: "via.placeholder.com" },
      // YouTube thumbnails
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
