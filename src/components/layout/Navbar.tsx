"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  GraduationCap, 
  Menu, 
  X, 
  Search, 
  Sparkles, 
  ChevronRight,
  School,
  Users,
  Building2,
  FileText
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Beranda", icon: School },
  { href: "/tentang", label: "Tentang Sekolah", icon: School },
  { href: "/guru", label: "Dewan Guru", icon: Users },
  { href: "/fasilitas", label: "Fasilitas", icon: Building2 },
  { href: "/pengumuman", label: "Pengumuman", icon: FileText },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide public navbar on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & School Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg leading-tight group-hover:text-sky-600 transition-colors">
                SMAN 2 BUAY BAHUGA
              </div>
              <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <span>Kab. Way Kanan</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-sky-600 font-semibold">Akreditasi A</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-sky-600 bg-sky-50"
                      : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/ppdb/cek-status"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50/50 shadow-xs transition-all"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-sky-500" />
              <span>Cek Status</span>
            </Link>

            <Link
              href="/ppdb"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 bg-size-200 hover:bg-right shadow-md shadow-sky-500/25 hover:shadow-sky-500/35 active:scale-95 transition-all duration-300 group"
            >
              <Sparkles className="w-4 h-4 text-sky-200 animate-pulse" />
              <span>PPDB 2027/2028</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/ppdb"
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-sky-600 shadow-sm"
            >
              PPDB
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {NAV_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "text-sky-600 bg-sky-50 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-sky-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/ppdb/cek-status"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Cek Status Pendaftaran Siswa</span>
            </Link>
            <Link
              href="/ppdb"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white bg-sky-600 shadow-md shadow-sky-600/20 active:scale-98 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Daftar PPDB Baru Online</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
