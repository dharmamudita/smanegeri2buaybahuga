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

export const metadata: Metadata = {
  metadataBase: new URL("https://smandabuba.com"),
  title: "SMAN 2 Buay Bahuga | Smart School & Portal Pembelajaran Terpadu",
  description:
    "Portal Resmi dan Sistem Pembelajaran Digital Terpadu SMA Negeri 2 Buay Bahuga, Kabupaten Way Kanan, Provinsi Lampung. Mendukung Kurikulum Merdeka, Presensi Harian, dan Evaluasi Akademik Terstruktur.",
  keywords: [
    "SMAN 2 Buay Bahuga",
    "Smart School",
    "Kurikulum Merdeka",
    "Way Kanan",
    "Lampung",
    "PPDB SMAN 2 Buay Bahuga",
  ],
  icons: {
    icon: [
      { url: "/logosmanda.png", type: "image/png" },
    ],
    shortcut: "/logosmanda.png",
    apple: "/logosmanda.png",
  },
  openGraph: {
    title: "SMAN 2 Buay Bahuga | Smart School & Portal Pembelajaran Terpadu",
    description:
      "Portal Resmi dan Sistem Pembelajaran Digital Terpadu SMA Negeri 2 Buay Bahuga, Kabupaten Way Kanan, Provinsi Lampung.",
    url: "https://smandabuba.com",
    siteName: "SMAN 2 Buay Bahuga",
    images: [
      {
        url: "/logosmanda.png",
        width: 512,
        height: 512,
        alt: "Logo SMA Negeri 2 Buay Bahuga",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F9FAFB] text-[#111827]">
        {children}
      </body>
    </html>
  );
}
