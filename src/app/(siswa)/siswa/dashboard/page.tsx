"use client";

import { useState } from "react";
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
  Search,
  PlusCircle,
  X,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useLMSStore } from "@/lib/lmsStore";
import { MOCK_TUGAS } from "@/lib/mockData";

export default function SiswaDashboardPage() {
  const { currentUser } = useAuthStore();
  const { classes, enrolledMapelIds, joinClassByCode, selectClass } = useLMSStore();

  const activeStudent = currentUser || {
    name: "Dharma Mudita Pratama",
    kelas: "XII MIPA 1",
    nisn: "0078129341",
  };

  // Filter kelas yang diikuti
  const enrolledClasses = classes.filter((c) => enrolledMapelIds.includes(c.id));

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [modalJoinOpen, setModalJoinOpen] = useState(false);
  const [inputClassCode, setInputClassCode] = useState("");
  const [joinResult, setJoinResult] = useState<{ success: boolean; message: string } | null>(null);

  const displayedClasses = enrolledClasses.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.nama.toLowerCase().includes(q) ||
      c.kode.toLowerCase().includes(q) ||
      c.guruNama.toLowerCase().includes(q)
    );
  });

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    const res = joinClassByCode(inputClassCode);
    setJoinResult(res);
    if (res.success) {
      setTimeout(() => {
        setModalJoinOpen(false);
        setInputClassCode("");
        setJoinResult(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header: Sambutan Siswa (Kiri) & Daftar Kelas yang Diikuti (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Kolom Kiri: Sambutan Siswa */}
        <div className="lg:col-span-7 bg-[#2A2C5E] text-white rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-xs">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Portal Siswa & Smart LMS SMAN 2 Buay Bahuga</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {activeStudent.name}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-xl">
              Kelas: <strong className="text-white">{activeStudent.kelas || "XII MIPA 1"}</strong> &bull; NISN: <strong className="text-white">{activeStudent.nisn || "0078129341"}</strong> &bull; Tahun Ajaran 2026/2027
            </p>
          </div>

          <div className="pt-6 relative z-10 border-t border-white/10 mt-6 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] text-blue-200">Total Kelas Diikuti</div>
              <div className="text-xl font-bold text-white mt-0.5">
                {enrolledClasses.length} Mata Pelajaran
              </div>
            </div>
            <div>
              <div className="text-[11px] text-blue-200">Kurikulum Aktif</div>
              <div className="text-xl font-bold text-white mt-0.5">
                Kurikulum Merdeka
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Daftar Kelas yang Diikuti Siswa */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 text-[#2A2C5E]">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-gray-900 leading-tight">
                    Kelas yang Sedang Diikuti
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    {enrolledClasses.length} Kelas Terdaftar Aktif
                  </p>
                </div>
              </div>
              <Link
                href="/siswa/mapel"
                className="text-xs font-semibold text-[#2A2C5E] hover:underline"
              >
                Lihat Semua &rarr;
              </Link>
            </div>

            {/* List Mini Kelas */}
            <div className="mt-3 divide-y divide-gray-100 max-h-[190px] overflow-y-auto pr-1">
              {enrolledClasses.slice(0, 4).map((cls) => {
                const totalMeetings = cls.pertemuanList.length;
                const completed = cls.pertemuanList.filter(
                  (p) => (p.materi?.sudahDibaca || p.tugas?.sudahDikerjakan) && p.presensi.hadir
                ).length;

                return (
                  <div
                    key={cls.id}
                    className="py-2.5 flex items-center justify-between gap-3 hover:bg-gray-50/80 px-2 rounded-lg transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-[#2A2C5E] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                          {cls.kode.split("-")[0]}
                        </span>
                        <h3 className="text-xs font-bold text-gray-900 truncate">
                          {cls.nama}
                        </h3>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {cls.guruNama} &bull; {cls.ruang}
                      </p>
                    </div>

                    <Link
                      href={`/siswa/mapel?id=${cls.id}`}
                      onClick={() => selectClass(cls.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-[#2A2C5E] bg-gray-100 hover:bg-[#2A2C5E] hover:text-white rounded transition-colors shrink-0"
                    >
                      Buka
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 mt-2 flex items-center justify-between text-[11px] text-gray-500">
            <span>Sinkronisasi Otomatis Dapodik</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Aktif
            </span>
          </div>
        </div>
      </div>

      {/* 2. Fitur Pencarian Kelas & Tombol Masuk/Gabung Kelas */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Input Cari Kelas */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kelas yang diikuti (contoh: Biologi, Matematika, Tumijo, S.Pd.)..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
          />
        </div>

        {/* Tombol Gabung Kelas Baru */}
        <button
          type="button"
          onClick={() => setModalJoinOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#2A2C5E] hover:bg-[#1F2147] text-white text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Gabung / Masuk Kelas Baru</span>
        </button>
      </div>

      {/* 3. Status Widget Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Presensi Geofencing Status */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Status Presensi Harian
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
            07:08 WIB &bull; Radius 24 Meter Lingkungan Sekolah
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
              Asesmen Berlangsung
            </span>
            <span className="p-2 bg-red-50 text-red-600 rounded-lg">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="text-lg font-bold text-red-600">
            Pertemuan 6 (UTS Terjadwal)
          </div>
          <p className="text-xs text-gray-500">
            Biologi & Matematika Tingkat Lanjut
          </p>
          <div className="pt-2">
            <Link
              href="/siswa/mapel?id=mapel-1"
              onClick={() => selectClass("mapel-1")}
              className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
            >
              <span>Buka Jadwal UTS & Materi</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Kelas Terdaftar */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Ruang Belajar Saya
            </span>
            <span className="p-2 bg-blue-50 text-[#2A2C5E] rounded-lg">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {enrolledClasses.length} Kelas Aktif
          </div>
          <p className="text-xs text-gray-500">
            Fase F / Kelas XII Semester Ganjil
          </p>
          <div className="pt-2">
            <Link
              href="/siswa/mapel"
              className="text-xs font-semibold text-[#2A2C5E] hover:underline flex items-center gap-1"
            >
              <span>Buka Seluruh Pertemuan</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Grid Kelas Mata Pelajaran yang Diikuti */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Ruang Kelas Pembelajaran ({displayedClasses.length})
          </h2>
          <Link
            href="/siswa/mapel"
            className="text-xs font-semibold text-[#2A2C5E] hover:underline"
          >
            Lihat Alur Pertemuan Lengkap &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedClasses.map((cls) => {
            const total = cls.pertemuanList.length;
            const completed = cls.pertemuanList.filter(
              (p) => (p.materi?.sudahDibaca || p.tugas?.sudahDikerjakan) && p.presensi.hadir
            ).length;
            const percent = Math.round((completed / total) * 100);

            return (
              <div
                key={cls.id}
                className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-[#2A2C5E] transition-all"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#2A2C5E] border border-blue-100">
                      {cls.kode}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {cls.ruang}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 leading-snug">
                    {cls.nama}
                  </h3>

                  <p className="text-xs text-gray-600">
                    <strong className="text-gray-800">Guru:</strong> {cls.guruNama}
                  </p>

                  {/* Progress Bar Pertemuan */}
                  <div className="space-y-1.5 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span>Progres Belajar</span>
                      <span className="font-bold text-[#2A2C5E]">{percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2A2C5E] rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {completed} dari {total} Pertemuan Tuntas
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">{cls.jadwal}</span>
                  <Link
                    href={`/siswa/mapel?id=${cls.id}`}
                    onClick={() => selectClass(cls.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-md transition-all shadow-2xs"
                  >
                    Buka Kelas
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Masuk / Gabung Kelas dengan Kode */}
      {modalJoinOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 text-[#2A2C5E] rounded-lg">
                  <BookOpen className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-gray-900">
                  Gabung ke Kelas Mata Pelajaran
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setModalJoinOpen(false);
                  setJoinResult(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Mintalah kode undangan kelas dari bapak/ibu guru pengampu mata pelajaran untuk masuk ke ruang kelas digital.
            </p>

            <form onSubmit={handleJoinClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Kode Kelas Resmi
                </label>
                <input
                  type="text"
                  value={inputClassCode}
                  onChange={(e) => setInputClassCode(e.target.value)}
                  placeholder="Contoh: BIO-XII atau FIS-XII"
                  className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E] uppercase font-bold text-[#2A2C5E]"
                  required
                />
              </div>

              {joinResult && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    joinResult.success
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {joinResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{joinResult.message}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setModalJoinOpen(false);
                    setJoinResult(null);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  Gabung Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
