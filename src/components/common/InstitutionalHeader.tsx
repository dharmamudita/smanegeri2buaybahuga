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
      {/* Main Navbar: Memberikan ruang lapang vertikal agar kapsul tidak mepet ke batas atas & bawah */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Nama Sekolah */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white text-[#2A2C5E] flex items-center justify-center shadow-xs group-hover:bg-blue-50 transition-colors">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-none whitespace-nowrap">
              SMAN 2 BUAY BAHUGA
            </span>
          </Link>

          {/* Navigasi Kapsul Floating Di Tengah (Tegas, Elegan, Berjarak Nyaman dari Tepi Atas & Bawah, 1 Baris Penuh) */}
          <nav className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
            <div
              className="flex items-center gap-1 bg-[#17193B]/95 backdrop-blur-md border border-white/20 p-1.5 rounded-full shadow-lg ring-1 ring-black/25 min-w-max flex-nowrap"
              style={{ whiteSpace: "nowrap" }}
            >
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap shrink-0 flex-nowrap select-none ${
                      isActive
                        ? "bg-[#434891] text-white shadow-sm border border-white/30"
                        : "text-blue-100 hover:text-white hover:bg-white/10"
                    }`}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? "text-white" : "text-blue-200"
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
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1F2147] bg-[#17193B] px-4 pt-3 pb-5 space-y-1 shadow-xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#434891] text-white shadow-xs border border-white/30"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
                style={{ whiteSpace: "nowrap" }}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? "text-white" : "text-blue-200"
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
