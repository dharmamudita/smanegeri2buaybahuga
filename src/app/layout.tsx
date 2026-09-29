import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "SMA Negeri 2 Buay Bahuga | Portal Resmi & PPDB Online",
    template: "%s | SMAN 2 Buay Bahuga",
  },
  description:
    "Portal Resmi dan Sistem Penerimaan Peserta Didik Baru (PPDB) Online SMA Negeri 2 Buay Bahuga, Kabupaten Way Kanan, Provinsi Lampung. Mewujudkan generasi unggul, berakhlak mulia, dan berdaya saing global.",
  keywords: [
    "SMA Negeri 2 Buay Bahuga",
    "SMAN 2 Buay Bahuga",
    "PPDB Buay Bahuga",
    "SMA Way Kanan",
    "PPDB Online Lampung",
    "Sekolah Menengah Atas Buay Bahuga",
  ],
  authors: [{ name: "SMA Negeri 2 Buay Bahuga" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo_smanda.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo_smanda.png",
  },
  openGraph: {
    title: "SMA Negeri 2 Buay Bahuga | Portal Resmi & PPDB Online",
    description:
      "Penerimaan Peserta Didik Baru (PPDB) Online dan Informasi Akademik SMA Negeri 2 Buay Bahuga, Way Kanan, Lampung.",
    type: "website",
    locale: "id_ID",
    siteName: "SMA Negeri 2 Buay Bahuga",
    images: [
      {
        url: "/logo_smanda.png",
        width: 500,
        height: 500,
        alt: "Logo SMA Negeri 2 Buay Bahuga",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable}`}>
      <body className="min-h-screen flex flex-col antialiased bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
