"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  GraduationCap, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { logoutAdmin } from "@/app/actions/admin";

const ADMIN_LINKS = [
  { href: "/admin/dashboard", label: "Ringkasan Dasbor", icon: LayoutDashboard },
  { href: "/admin/ppdb", label: "Data Pendaftar PPDB", icon: Users },
  { href: "/admin/periode", label: "Gelombang & Saklar", icon: Calendar },
  { href: "/admin/guru", label: "Manajemen Guru & Staf", icon: GraduationCap },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white text-slate-700 min-h-screen flex flex-col justify-between border-r border-slate-200 shadow-xs shrink-0 z-30">
      <div className="p-6 space-y-7">
        
        {/* School Admin Identity */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <div className="relative w-11 h-11 shrink-0 p-1 bg-slate-50 rounded-xl border border-slate-200/80">
            <Image
              src="/logo_smanda.png"
              alt="Logo SMAN 2 Buay Bahuga"
              width={40}
              height={40}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-slate-900 text-sm tracking-tight leading-snug truncate">
              SMAN 2 BUAY BAHUGA
            </div>
            <div className="text-[11px] text-blue-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Panel Panitia PPDB</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3 mb-2">
            Menu Utama
          </div>
          {ADMIN_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-600" />}
              </Link>
            );
          })}
        </nav>

      </div>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-slate-100 space-y-3 bg-slate-50/50">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200 transition shadow-2xs"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Lihat Website Publik</span>
          </span>
        </Link>

        <form action={logoutAdmin}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun Admin</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
