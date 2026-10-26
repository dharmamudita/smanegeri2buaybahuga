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
      {/* Main Navbar */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo & Nama Sekolah */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-lg bg-white text-[#2A2C5E] flex items-center justify-center shadow-xs group-hover:bg-blue-50 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-none">
              SMAN 2 BUAY BAHUGA
            </span>
          </Link>

          {/* Navigasi Di Tengah (Centered Navigation Links) */}
          <nav className="hidden lg:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                    isActive
                      ? "bg-white text-[#2A2C5E] shadow-xs"
                      : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#2A2C5E]" : "text-blue-200"
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1F2147] bg-[#1F2147] px-4 pt-3 pb-6 space-y-1.5 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-white text-[#2A2C5E] shadow-xs"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-[#2A2C5E]" : "text-blue-200"
                  }`}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
