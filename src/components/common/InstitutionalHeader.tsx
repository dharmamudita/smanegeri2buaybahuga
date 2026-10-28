"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  GraduationCap,
  Building2,
  BookOpen,
  Users,
  Info,
  FileCheck,
  Menu,
  X,
} from "lucide-react";

export default function InstitutionalHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Beranda", icon: GraduationCap },
    { href: "/profil", label: "Profil", icon: Building2 },
    { href: "/akademik", label: "Akademik", icon: BookOpen },
    { href: "/kesiswaan", label: "Kesiswaan", icon: Users },
    { href: "/informasi", label: "Informasi", icon: Info },
    { href: "/ppdb", label: "PPDB Online", icon: FileCheck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#2A2C5E] shadow-md border-b border-[#1F2147]">
      {/* Main Navbar: Memberikan ruang lapang vertikal agar kapsul berukuran pas dan tidak mepet */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between">
          {/* Logo & Nama Sekolah (Kiri) */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs group-hover:bg-blue-50 transition-all shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logosmanda.png"
                alt="Logo SMAN 2 Buay Bahuga"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-none whitespace-nowrap">
                SMAN 2 BUAY BAHUGA
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-blue-200/90 tracking-wide mt-1 leading-none whitespace-nowrap">
                Terakreditasi A
              </span>
            </div>
          </Link>

          {/* Navigasi Kapsul Di Tengah (Flex-Centered, Tidak Bertabrakan dengan Logo) */}
          <nav className="hidden lg:flex items-center justify-center flex-1 px-3 xl:px-6 min-w-0">
            <div
              className="flex items-center gap-1 bg-[#121428]/95 backdrop-blur-md border border-white/15 p-1 sm:p-1.5 rounded-full shadow-2xl ring-1 ring-black/30 flex-nowrap shrink-0"
              style={{ whiteSpace: "nowrap" }}
            >
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-[13px] font-semibold rounded-full whitespace-nowrap shrink-0 flex-nowrap select-none transition-all duration-200 ease-out ${
                      isActive
                        ? "bg-[#2A2C5E] text-white shadow-sm scale-100"
                        : "text-gray-200/90 hover:bg-[#2A2C5E]/80 hover:text-white hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                    }`}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-200 ${
                        isActive
                          ? "text-white"
                          : "text-blue-100 group-hover:scale-110 group-hover:text-white"
                      }`}
                    />
                    <span
                      className="whitespace-nowrap inline-block"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {link.label.replace(" ", "\u00A0")}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Balancer Kanan: Menyeimbangkan lebar logo kiri agar kapsul tetap tepat di tengah layar tanpa tabrakan */}
          <div className="hidden lg:block shrink-0 w-[200px] xl:w-[220px] pointer-events-none" aria-hidden="true" />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 active:scale-95 transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1F2147] bg-[#121428] px-4 pt-3.5 pb-6 space-y-1.5 shadow-2xl transition-all duration-300">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-[#2A2C5E] text-white shadow-sm"
                    : "text-gray-200 hover:bg-[#2A2C5E]/80 hover:text-white"
                }`}
                style={{ whiteSpace: "nowrap" }}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-white" : "text-blue-100"
                  }`}
                />
                <span
                  className="whitespace-nowrap inline-block"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {link.label.replace(" ", "\u00A0")}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
