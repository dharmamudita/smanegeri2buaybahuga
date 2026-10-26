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
  title: "SMAN 2 Buay Bahuga | Smart School & LMS Terintegrasi",
  description:
    "Portal Resmi dan Learning Management System (LMS) SMA Negeri 2 Buay Bahuga, Kabupaten Way Kanan, Provinsi Lampung. Dilengkapi presensi geofencing dan ujian terproteksi.",
  keywords: [
    "SMAN 2 Buay Bahuga",
    "Smart School",
    "LMS Sekolah",
    "Way Kanan",
    "Lampung",
    "PPDB SMAN 2 Buay Bahuga",
  ],
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
