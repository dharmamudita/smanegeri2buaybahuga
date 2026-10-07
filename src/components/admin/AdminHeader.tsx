"use client";

import { usePathname } from "next/navigation";
import { ShieldCheck, UserCheck, Bell, Menu } from "lucide-react";

const TITLE_MAP: Record<string, { title: string; subtitle: string }> = {
  "/admin/dashboard": {
    title: "Ringkasan Dasbor",
    subtitle: "Pusat kendali dan status penerimaan peserta didik baru",
  },
  "/admin/ppdb": {
    title: "Data Pendaftar PPDB",
    subtitle: "Verifikasi berkas persyaratan dan validasi seleksi siswa",
  },
  "/admin/periode": {
    title: "Gelombang & Saklar PPDB",
    subtitle: "Pengaturan masa pendaftaran dan kontrol buka/tutup formulir",
  },
  "/admin/guru": {
    title: "Manajemen Dewan Guru & Staf",
    subtitle: "Pengelolaan direktori tenaga pendidik dan kependidikan",
  },
};

export default function AdminHeader() {
  const pathname = usePathname();
  const current = TITLE_MAP[pathname] || {
    title: "Portal Administrator",
    subtitle: "Sistem Informasi SMAN 2 Buay Bahuga",
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 sm:px-10 py-4.5 sticky top-0 z-20 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {current.title}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {current.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Operational Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sistem Operasional Aktif</span>
          </div>

          {/* User Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
              OP
            </div>
            <span className="truncate max-w-[140px]">Operator Sekolah</span>
          </div>
        </div>
      </div>
    </header>
  );
}
