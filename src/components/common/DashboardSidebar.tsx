"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  FileText,
  FileCheck,
  BookOpen,
  ClipboardList,
  Award,
  Clock,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { Role } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
  icon: any;
}

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  ADMIN: [
    { href: "/admin/dashboard", label: "Ringkasan Statistik", icon: LayoutDashboard },
    { href: "/admin/cms", label: "CMS Konten Portal", icon: Sparkles },
    { href: "/admin/users", label: "Manajemen Akun", icon: Users },
    { href: "/admin/ppdb", label: "Verifikasi PPDB", icon: FileCheck },
  ],
  GURU: [
    { href: "/guru/dashboard", label: "Jadwal & Ringkasan", icon: LayoutDashboard },
    { href: "/guru/mapel", label: "Kelas & Materi", icon: BookOpen },
    { href: "/guru/rekap-nilai", label: "Rekapitulasi Nilai", icon: Award },
    { href: "/guru/rekap-absensi", label: "Rekapitulasi Absensi", icon: Clock },
    { href: "/guru/tugas", label: "Bank Tugas & Ujian", icon: ClipboardList },
  ],
  SISWA: [
    { href: "/siswa/dashboard", label: "Beranda Siswa", icon: LayoutDashboard },
    { href: "/siswa/mapel", label: "Kelas & Materi", icon: BookOpen },
    { href: "/siswa/presensi", label: "Presensi Harian", icon: Clock },
    { href: "/siswa/tugas", label: "Ujian Kelulusan Sekolah", icon: Award },
  ],
};

const ROLE_LABELS: Record<Role, { title: string; color: string; badge: string }> = {
  ADMIN: {
    title: "Panel Administrator",
    color: "bg-red-50 text-red-700 border-red-200",
    badge: "Super Admin",
  },
  GURU: {
    title: "Portal Dewan Guru",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    badge: "Tenaga Pendidik",
  },
  SISWA: {
    title: "Ruang Belajar Siswa",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    badge: "Peserta Didik",
  },
};

export default function DashboardSidebar({ currentRole }: { currentRole: Role }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = NAV_BY_ROLE[currentRole] || [];
  const roleMeta = ROLE_LABELS[currentRole];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-gray-200 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 border border-gray-200 flex items-center justify-center shadow-xs shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logosmanda.png"
              alt="Logo SMAN 2 Buay Bahuga"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 tracking-tight leading-none">
              SMAN 2 BUBA
            </h2>
            <p className="text-xs text-gray-500 mt-1">{roleMeta.title}</p>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-gray-500 hover:text-gray-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Session Profile Card */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2A2C5E]/10 border border-blue-200 flex items-center justify-center text-[#2A2C5E] font-semibold text-sm">
            {currentUser?.name?.slice(0, 2).toUpperCase() || "US"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">
              {currentUser?.name || "Pengguna Sistem"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-[10px] px-2 py-0.5 font-semibold rounded border ${roleMeta.color}`}
              >
                {roleMeta.badge}
              </span>
              <span className="text-[10px] text-gray-500 truncate">
                {currentUser?.nisn || currentUser?.nuptk || currentUser?.username}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Menu Navigasi
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#2A2C5E] text-white font-semibold shadow-xs"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-white" : "text-gray-500"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Tautan Eksternal
        </div>
        <Link
          href="/"
          className="flex items-center justify-between px-3.5 py-2 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <GraduationCap className="w-4 h-4 text-gray-400" />
            Portal Beranda Publik
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        </Link>
      </div>

      {/* Footer / Logout Button */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sticky Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-sm text-[#2A2C5E]">
            SMAN 2 BUAY BAHUGA
          </span>
        </div>
        <span
          className={`text-[10px] px-2 py-0.5 font-semibold rounded border ${roleMeta.color}`}
        >
          {roleMeta.badge}
        </span>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 min-h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] z-10">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
