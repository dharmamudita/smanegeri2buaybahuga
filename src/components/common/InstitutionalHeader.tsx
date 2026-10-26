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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-xs border-b border-gray-100">
      {/* Main Navbar */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Nama Sekolah */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-lg bg-[#2E4BA3] flex items-center justify-center text-white shadow-sm ring-2 ring-blue-100 group-hover:bg-[#233b82] transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-none group-hover:text-[#2E4BA3] transition-colors">
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
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-md transition-all ${
                    isActive
                      ? "text-[#2E4BA3] bg-blue-50 font-semibold border-b-2 border-[#2E4BA3]"
                      : "text-gray-700 hover:text-[#2E4BA3] hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium ${
                  isActive
                    ? "text-[#2E4BA3] bg-blue-50 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4 text-gray-500" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
