import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- BAGIAN PENTING: JUDUL & LOGO DI TAB BROWSER ---
export const metadata: Metadata = {
  title: "EXPO SMKN 1 Kademangan 2025",
  description: "Official Event & Ticketing System SMKN 1 Kademangan. Pameran Inovasi, Job Fair, dan Talkshow Edukasi.",
  icons: {
    // Pastikan kamu punya file gambar bernama 'logo.png' di dalam folder 'public'
    icon: "/logo.png", 
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}