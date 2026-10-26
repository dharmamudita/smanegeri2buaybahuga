"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  FileText,
  Clock,
  ArrowRight,
  Server,
  Database,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { SCHOOL_INFO } from "@/lib/constants";
import { useAuthStore } from "@/lib/store";

export default function AdminDashboardPage() {
  const { currentUser } = useAuthStore();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#2E4BA3] text-white rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pusat Kendali Sistem & Data Pokok Sekolah</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Administrator Sistem
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Sistem Informasi Smart School & LMS &bull; SMA Negeri 2 Buay Bahuga, Way Kanan
          </p>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-1">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2E4BA3] flex items-center justify-center mb-2">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-gray-900">450</div>
          <p className="text-xs text-gray-500">Siswa Terdaftar (Dapodik)</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-1">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2E4BA3] flex items-center justify-center mb-2">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-gray-900">32</div>
          <p className="text-xs text-gray-500">Pendidik & Tenaga Kependidikan</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-1">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <FileCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">128</div>
          <p className="text-xs text-gray-500">Berkas Pendaftar PPDB Online</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-1">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2E4BA3] flex items-center justify-center mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-gray-900">94.8%</div>
          <p className="text-xs text-gray-500">Presensi Hadir Tepat Waktu</p>
        </div>
      </div>

      {/* Quick Links to Management Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2E4BA3] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            Manajemen Akun Pengguna
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Generator akun massal bagi siswa (NISN) dan guru (NUPTK), serta reset kata sandi default.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E4BA3] hover:underline"
            >
              <span>Kelola Akun Siswa & Guru</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            Verifikasi Seleksi PPDB
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Pemeriksaan keabsahan dokumen akta, kartu keluarga, dan rapor calon peserta didik baru 2026/2027.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/ppdb"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline"
            >
              <span>Buka Modul PPDB</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            CMS Warta & Pengumuman
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Penerbitan artikel warta resmi, edaran kalender akademik, dan prestasi sekolah ke portal publik.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/berita"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:underline"
            >
              <span>Kelola Artikel CMS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* System Infrastructure & Geofencing Monitor */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-[#2E4BA3]" />
            <span>Konektivitas Infrastruktur & Layanan Eksternal</span>
          </h3>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Semua Sistem Operasional
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Supabase PostgreSQL</span>
              <span className="text-emerald-600 font-bold">Terhubung</span>
            </div>
            <p className="text-gray-500 text-[11px]">
              Skema Prisma v6 Client Sinkron (9 Model Relasional)
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Pusat GPS Geofencing</span>
              <span className="text-[#2E4BA3] font-bold">Aktif (100m)</span>
            </div>
            <p className="text-gray-500 text-[11px]">
              Titik Gerbang: Lat {SCHOOL_INFO.koordinat.latitude}, Lng {SCHOOL_INFO.koordinat.longitude}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Media CDN Storage</span>
              <span className="text-emerald-600 font-bold">Cloudinary Ready</span>
            </div>
            <p className="text-gray-500 text-[11px]">
              Penyimpanan berkas PPDB, modul materi PDF, dan aset portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
