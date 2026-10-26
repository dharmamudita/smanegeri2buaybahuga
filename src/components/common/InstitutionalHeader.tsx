"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  GraduationCap,
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
          {/* Logo & Nama Sekolah */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white text-[#2A2C5E] flex items-center justify-center shadow-xs group-hover:bg-blue-50 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-none whitespace-nowrap">
                SMAN 2 BUAY BAHUGA
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-blue-200/90 tracking-wide mt-1 leading-none whitespace-nowrap">
                Terakreditasi A
              </span>
            </div>
          </Link>

          {/* Navigasi Kapsul Floating Di Tengah (Warna Biru Khas Web #2A2C5E, Transisi Halus & Responsif) */}
          <nav className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
            <div
              className="flex items-center gap-1.5 bg-[#121428]/95 backdrop-blur-md border border-white/15 p-1.5 sm:p-2 rounded-full shadow-2xl ring-1 ring-black/30 min-w-max flex-nowrap"
              style={{ whiteSpace: "nowrap" }}
            >
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap shrink-0 flex-nowrap select-none transition-all duration-200 ease-out ${
                      isActive
                        ? "bg-[#2A2C5E] text-white shadow-[0_2px_12px_rgba(42,44,94,0.7)] border border-white/30 ring-1 ring-white/15 scale-100"
                        : "text-gray-200/90 border border-transparent hover:bg-[#2A2C5E]/70 hover:text-white hover:border-white/20 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                    }`}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
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
                    ? "bg-[#2A2C5E] text-white shadow-md border border-white/30"
                    : "text-gray-200 hover:bg-[#2A2C5E]/70 hover:text-white"
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
