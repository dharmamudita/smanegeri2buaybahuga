"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Search,
  School,
  Users,
  Building2,
  FileText,
  BookOpen,
  Trophy,
  Compass,
  Phone,
  CalendarDays,
  Target,
} from "lucide-react";

/* ─────────────────────── navigation structure ─────────────────────── */

interface NavChild {
  href: string;
  label: string;
  icon: React.ElementType;
  desc?: string;
}

interface NavItem {
  label: string;
  href?: string;            // direct link (no dropdown)
  children?: NavChild[];    // dropdown items
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Beranda",
    href: "/",
  },
  {
    label: "Profil",
    children: [
      { href: "/tentang", label: "Tentang Sekolah", icon: School, desc: "Sejarah dan profil institusi" },
      { href: "/tentang#visi-misi", label: "Visi & Misi", icon: Target, desc: "Arah dan tujuan pendidikan" },
      { href: "/guru", label: "Guru & Tenaga Pendidik", icon: Users, desc: "Dewan guru dan staf pengajar" },
      { href: "/fasilitas", label: "Fasilitas & Sarana", icon: Building2, desc: "Ruang kelas, lab, dan sarana" },
    ],
  },
  {
    label: "Akademik",
    children: [
      { href: "/tentang#kurikulum", label: "Kurikulum Merdeka", icon: BookOpen, desc: "Program pembelajaran aktif" },
      { href: "/fasilitas#ekstrakurikuler", label: "Ekstrakurikuler", icon: Compass, desc: "Pengembangan minat & bakat" },
      { href: "/pengumuman", label: "Prestasi & Agenda", icon: Trophy, desc: "Pencapaian siswa dan agenda" },
    ],
  },
  {
    label: "Informasi",
    children: [
      { href: "/pengumuman", label: "Pengumuman & Berita", icon: FileText, desc: "Warta dan publikasi resmi" },
      { href: "/#kontak", label: "Kontak & Lokasi", icon: Phone, desc: "Alamat dan kontak helpdesk" },
    ],
  },
  {
    label: "Pendaftaran",
    children: [
      { href: "/ppdb", label: "Formulir PPDB Online", icon: Sparkles, desc: "Pendaftaran calon siswa baru" },
      { href: "/ppdb/cek-status", label: "Cek Status Berkas", icon: Search, desc: "Pantau verifikasi pendaftaran" },
      { href: "/ppdb#syarat", label: "Syarat & Dokumen", icon: FileText, desc: "Persyaratan berkas PPDB" },
      { href: "/ppdb#jadwal", label: "Jadwal Gelombang", icon: CalendarDays, desc: "Waktu dan kuota seleksi" },
    ],
  },
];

/* ──────────────────── Desktop Dropdown component ──────────────────── */

function DesktopDropdown({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 180);
  };

  // does any child match the current path?
  const isChildActive = item.children?.some(
    (c) => pathname === c.href || (c.href !== "/" && pathname.startsWith(c.href.split("#")[0]))
  );

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* trigger */}
      <button
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
          isChildActive
            ? "text-sky-600 bg-sky-50"
            : "text-slate-700 hover:text-sky-600 hover:bg-slate-50"
        }`}
        aria-expanded={open}
      >
        <span>{item.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            open ? "rotate-180 text-sky-600" : "text-slate-400"
          }`}
        />
      </button>

      {/* dropdown panel */}
      {open && (
        <div className="absolute left-0 top-full pt-2 z-50 min-w-[260px] animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/60 overflow-hidden p-1.5 ring-1 ring-black/5">
            {item.children!.map((child) => {
              const Icon = child.icon;
              const isActive =
                pathname === child.href ||
                (child.href !== "/" && pathname.startsWith(child.href.split("#")[0]));

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                    isActive
                      ? "text-sky-600 bg-sky-50/80 font-bold"
                      : "text-slate-700 hover:bg-sky-50/60 hover:text-sky-700"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isActive ? "bg-sky-100 text-sky-600" : "bg-slate-100 text-slate-500"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 leading-tight">{child.label}</span>
                    {child.desc && (
                      <span className="text-[11px] text-slate-500 font-normal mt-0.5">{child.desc}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────── main Navbar ────────────────────────── */

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState<string | null>("Pendaftaran");
  const pathname = usePathname();

  // hide public navbar on admin pages
  if (pathname.startsWith("/admin")) return null;

  const toggleMobileGroup = (label: string) => {
    setExpandedMobileGroup((prev) => (prev === label ? null : label));
  };

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* ─── Logo & School Identity ─── */}
          <Link href="/" className="flex items-center gap-3.5 group shrink-0">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo_smanda.png"
                alt="Logo SMAN 2 Buay Bahuga"
                width={48}
                height={48}
                className="object-contain w-full h-full drop-shadow-sm"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="font-black text-slate-900 tracking-tight text-base sm:text-lg leading-tight group-hover:text-sky-600 transition-colors">
                SMAN 2 BUAY BAHUGA
              </div>
              <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 leading-tight mt-0.5">
                <span>Kab. Way Kanan</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-sky-600 font-bold">Akreditasi A</span>
              </div>
            </div>
          </Link>

          {/* ─── Desktop Navigation ─── */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <DesktopDropdown
                  key={item.label}
                  item={item}
                  pathname={pathname}
                />
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    pathname === item.href
                      ? "text-sky-600 bg-sky-50"
                      : "text-slate-700 hover:text-sky-600 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* ─── Desktop Action CTAs ─── */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href="/ppdb/cek-status"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50/50 shadow-xs transition-all"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Cek Status</span>
            </Link>

            <Link
              href="/ppdb"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 bg-[length:200%_auto] hover:bg-right shadow-md shadow-sky-500/25 hover:shadow-sky-500/35 active:scale-95 transition-all duration-300 group"
            >
              <Sparkles className="w-4 h-4 text-sky-200 animate-pulse" />
              <span>Pendaftaran PPDB</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* ─── Mobile buttons ─── */}
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
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile Menu ─── */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-1 animate-in slide-in-from-top duration-200 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            // direct link
            if (!item.children) {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "text-sky-600 bg-sky-50"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <School
                    className={`w-5 h-5 ${
                      isActive ? "text-sky-600" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            }

            // collapsible group
            const isExpanded = expandedMobileGroup === item.label;
            return (
              <div key={item.label} className="rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleMobileGroup(item.label)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="ml-4 mt-0.5 mb-1 space-y-0.5 border-l-2 border-sky-100 pl-3">
                    {item.children.map((child) => {
                      const Icon = child.icon;
                      const isActive =
                        pathname === child.href ||
                        (child.href !== "/" && pathname.startsWith(child.href.split("#")[0]));

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                            isActive
                              ? "text-sky-600 font-bold bg-sky-50/70"
                              : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 ${
                              isActive ? "text-sky-600" : "text-slate-400"
                            }`}
                          />
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* mobile CTA buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/ppdb/cek-status"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Cek Status Pendaftaran</span>
            </Link>
            <Link
              href="/ppdb"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white bg-sky-600 shadow-md shadow-sky-600/20 active:scale-[0.98] transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Daftar PPDB Siswa Baru</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
