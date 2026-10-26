"use client";

import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  ClipboardList,
  Clock,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { MOCK_MAPEL, MOCK_TUGAS } from "@/lib/mockData";

export default function SiswaDashboardPage() {
  const { currentUser } = useAuthStore();
  const activeStudent = currentUser || {
    name: "Dharma Mudita Pratama",
    kelas: "XII MIPA 1",
    nisn: "0078129341",
  };

  return (
    <div className="space-y-8">
      {/* 1. Welcome Banner */}
      <div className="bg-[#2A2C5E] text-white rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-xs">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>LMS & Ruang Pembelajaran Siswa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {activeStudent.name}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Kelas: {activeStudent.kelas || "XII MIPA 1"} | NISN: {activeStudent.nisn || "0078129341"} | SMAN 2 Buay Bahuga
          </p>
        </div>
      </div>

      {/* 2. Status Widget Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Presensi Geofencing Status */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Status Presensi Hari Ini
            </span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            Hadir Tepat Waktu
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-600" />
            07:08 WIB &bull; Radius 24 Meter
          </p>
          <div className="pt-2">
            <Link
              href="/siswa/presensi"
              className="text-xs font-semibold text-[#2A2C5E] hover:underline flex items-center gap-1"
            >
              <span>Buka Menu Presensi GPS</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Tugas & Ujian Aktif */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Ujian Berlangsung
            </span>
            <span className="p-2 bg-red-50 text-red-600 rounded-lg">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="text-lg font-bold text-red-600">
            1 Ujian Terproteksi
          </div>
          <p className="text-xs text-gray-500">
            Genetika Populasi (Tenggat Hari Ini)
          </p>
          <div className="pt-2">
            <Link
              href="/siswa/tugas"
              className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
            >
              <span>Masuk Ruang Ujian</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Kelas Terdaftar */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Mata Pelajaran
            </span>
            <span className="p-2 bg-blue-50 text-[#2A2C5E] rounded-lg">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            5 Kelas Aktif
          </div>
          <p className="text-xs text-gray-500">
            Kurikulum Merdeka Semester Ganjil
          </p>
          <div className="pt-2">
            <Link
              href="/siswa/mapel"
              className="text-xs font-semibold text-[#2A2C5E] hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua Materi</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Kelas & Mata Pelajaran Terdaftar (SPADA / Classroom Style) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Kelas Mata Pelajaran Saya
          </h2>
          <Link
            href="/siswa/mapel"
            className="text-xs font-semibold text-[#2A2C5E] hover:underline"
          >
            Lihat Modul & Materi Lengkap &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_MAPEL.map((mapel) => (
            <div
              key={mapel.id}
              className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-[#2A2C5E] transition-colors"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#2A2C5E] border border-blue-100">
                    {mapel.kode}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {mapel.ruang}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {mapel.nama}
                </h3>

                <p className="text-xs text-gray-600">
                  <strong className="text-gray-800">Guru:</strong> {mapel.guruNama}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                    {mapel.totalMateri} Materi
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <ClipboardList className="w-3.5 h-3.5 text-gray-400" />
                    {mapel.totalTugas} Tugas
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">{mapel.jadwal}</span>
                <Link
                  href="/siswa/mapel"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-md transition-all"
                >
                  Masuk Kelas
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Daftar Tugas & Ujian Terkini */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">
          Tugas & Ujian Terjadwal
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs divide-y divide-gray-100">
          {MOCK_TUGAS.map((tugas) => (
            <div
              key={tugas.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      tugas.tipe.startsWith("UJIAN")
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-blue-50 text-[#2A2C5E] border border-blue-200"
                    }`}
                  >
                    {tugas.tipe}
                  </span>
                  <span className="text-xs text-gray-500">{tugas.mapelNama}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900">
                  {tugas.judul}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  Tenggat: {tugas.tenggatWaktu}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {tugas.statusSiswa === "SELESAI" ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Nilai: {tugas.nilaiSiswa} / 100
                  </span>
                ) : (
                  <Link
                    href="/siswa/tugas"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-md shadow-2xs"
                  >
                    <span>Kerjakan Sekarang</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
