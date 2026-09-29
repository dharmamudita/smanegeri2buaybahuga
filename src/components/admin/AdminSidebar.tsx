"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  GraduationCap, 
  LogOut, 
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { logoutAdmin } from "@/app/actions/admin";

const ADMIN_LINKS = [
  { href: "/admin/dashboard", label: "Ringkasan Dasbor", icon: LayoutDashboard },
  { href: "/admin/ppdb", label: "Data Pendaftar PPDB", icon: Users },
  { href: "/admin/periode", label: "Gelombang & Saklar", icon: Calendar },
  { href: "/admin/guru", label: "Manajemen Guru", icon: GraduationCap },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between border-r border-slate-800 shrink-0">
      <div className="p-6 space-y-8">
        
        {/* School Admin Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="font-extrabold text-white text-sm tracking-tight leading-tight">
              PANITIA PPDB
            </div>
            <div className="text-[11px] text-sky-400 font-semibold">
              SMAN 2 Buay Bahuga
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 mb-2">
            Menu Utama
          </div>
          {ADMIN_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

      </div>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-slate-800 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <span>Lihat Website Publik</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
        </Link>

        <form action={logoutAdmin}>
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/30 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun Admin</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
