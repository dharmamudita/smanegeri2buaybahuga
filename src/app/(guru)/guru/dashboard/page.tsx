"use client";

import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  ClipboardList,
  Users,
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  FileSpreadsheet,
  AlertTriangle,
  Clock,
  Eye,
} from "lucide-react";
import { useAuthStore, useExamStore } from "@/lib/store";
import { MOCK_TUGAS } from "@/lib/mockData";

export default function GuruDashboardPage() {
  const { currentUser } = useAuthStore();
  const { violationLogs } = useExamStore();

  const activeTeacher = currentUser || {
    name: "Budi Santoso, S.Pd., M.Si.",
    nuptk: "197805122005011003",
    mataPelajaran: "Biologi Umum & IPA Terapan",
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#2E4BA3] text-white rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-xs">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Portal Manajemen Pembelajaran Dewan Guru</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {activeTeacher.name}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            NUPTK: {activeTeacher.nuptk || "197805122005011003"} | Pengampu: {activeTeacher.mataPelajaran || "Biologi"} | SMAN 2 Buay Bahuga
          </p>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-1">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2E4BA3] flex items-center justify-center mb-2">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-gray-900">2 Mapel</div>
          <p className="text-xs text-gray-500">Mata Pelajaran Diampu</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-1">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2E4BA3] flex items-center justify-center mb-2">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-gray-900">72 Siswa</div>
          <p className="text-xs text-gray-500">Total Binaan Kelas XII MIPA</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-1">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2E4BA3] flex items-center justify-center mb-2">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-gray-900">3 Tugas/Ujian</div>
          <p className="text-xs text-gray-500">Sedang Aktif Berjalan</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-1">
          <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-2">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-red-600">
            {violationLogs.length} Kasus
          </div>
          <p className="text-xs text-gray-500">Pelanggaran Tab Ujian</p>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/guru/mapel"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#2E4BA3] hover:bg-[#233b82] rounded-md shadow-2xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Unggah Materi Baru</span>
        </Link>

        <Link
          href="/guru/tugas"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md shadow-2xs"
        >
          <ClipboardList className="w-4 h-4 text-[#2E4BA3]" />
          <span>Buat Soal Ujian Anti-Cheat</span>
        </Link>

        <Link
          href="/guru/rekap-nilai"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md shadow-2xs"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Rekapitulasi Nilai & Ekspor</span>
        </Link>
      </div>

      {/* Real-time Anti-Cheat Exam Audit Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Monitoring Integritas Ujian Real-Time</span>
            </h2>
            <p className="text-xs text-gray-500">
              Audit trail otomatis jika siswa berpindah tab browser, membuka aplikasi lain, atau menyalin teks soal.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Server Listener Aktif
          </span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs divide-y divide-gray-100 overflow-hidden">
          {violationLogs.length > 0 ? (
            violationLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-red-50/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">
                        {log.siswaNama}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        NISN: {log.nisn}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                        {log.eventType}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{log.metadata}</p>
                    <p className="text-[11px] text-gray-400">Ujian: {log.tugasJudul}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {log.timestamp}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs">
              Belum ada log pelanggaran yang tercatat. Seluruh siswa mengerjakan dengan integritas penuh.
            </div>
          )}
        </div>
      </div>

      {/* Daftar Tugas Yang Diampu */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-gray-900">
          Status Tugas & Ujian Terbitan Anda
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs divide-y divide-gray-100">
          {MOCK_TUGAS.map((t) => (
            <div
              key={t.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#2E4BA3] border border-blue-100">
                  {t.tipe}
                </span>
                <h4 className="text-sm font-bold text-gray-900">{t.judul}</h4>
                <p className="text-xs text-gray-500">
                  Tenggat Pengumpulan: {t.tenggatWaktu}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/guru/rekap-nilai"
                  className="px-3 py-1.5 text-xs font-semibold text-[#2E4BA3] bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                >
                  Lihat Rekap Hasil
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
