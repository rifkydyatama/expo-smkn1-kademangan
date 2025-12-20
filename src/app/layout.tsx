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

// --- BAGIAN INI YANG MENGATUR JUDUL TAB & LOGO KECIL DI BROWSER ---
export const metadata: Metadata = {
  title: "Official Event SMKN 1 Kademangan",
  description: "Expo Pendidikan Vokasi Terbesar Tahun Ini",
  icons: {
    // Ganti 'logo.png' dengan nama file logomu nanti di folder public
    icon: "/logo.png", 
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};
// -------------------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}