import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Admin | SMAN 2 Buay Bahuga",
  description: "Sistem Manajemen PPDB & Informasi SMAN 2 Buay Bahuga",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
