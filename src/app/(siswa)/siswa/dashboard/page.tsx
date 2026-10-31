"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Search,
  PlusCircle,
  X,
  User,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useLMSStore } from "@/lib/lmsStore";
import PaginationBar from "@/components/common/PaginationBar";

export default function SiswaDashboardPage() {
  const { currentUser } = useAuthStore();
  const { classes, enrolledMapelIds, joinClassByCode, enrollClass, selectClass } = useLMSStore();

  const activeStudent = currentUser || {
    name: "Dharma Mudita Pratama",
    kelas: "XII MIPA 1",
    nisn: "0078129341",
  };

  // 1. Kelas yang sedang diikuti siswa (tampil di kanan sambutan)
  const enrolledClasses = classes.filter((c) => enrolledMapelIds.includes(c.id));

  // 2. Kelas yang belum diikuti siswa (tampil di bawah fitur cari kelas)
  const unenrolledClasses = classes.filter((c) => !enrolledMapelIds.includes(c.id));

  // Search & Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [modalJoinOpen, setModalJoinOpen] = useState(false);
  const [inputClassCode, setInputClassCode] = useState("");
  const [joinResult, setJoinResult] = useState<{ success: boolean; message: string } | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const displayedAvailableClasses = unenrolledClasses.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.nama.toLowerCase().includes(q) ||
      c.kode.toLowerCase().includes(q) ||
      c.guruNama.toLowerCase().includes(q)
    );
  });

  const totalItems = displayedAvailableClasses.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedAvailableClasses = displayedAvailableClasses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

  const handleQuickEnroll = (clsId: string, clsName: string) => {
    enrollClass(clsId);
    setSuccessToast(`Berhasil bergabung ke kelas ${clsName}! Kelas telah ditambahkan ke daftar kelas Anda.`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notifikasi Berhasil Gabung */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header: Sambutan Siswa Menyambung Penuh (Full-Width Banner Biru) */}
      <div className="bg-[#2A2C5E] text-white rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2.5 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-xs">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Portal Siswa & Smart LMS SMAN 2 Buay Bahuga</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {activeStudent.name}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Kelas: <strong className="text-white">{activeStudent.kelas || "XII MIPA 1"}</strong> &bull; NISN: <strong className="text-white">{activeStudent.nisn || "0078129341"}</strong> &bull; Tahun Ajaran 2026/2027
          </p>
        </div>

        {/* Akses Cepat ke Ruang Kelas & Materi */}
        <div className="relative z-10 shrink-0">
          <Link
            href="/siswa/mapel"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all backdrop-blur-xs shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-blue-200" />
            <span>Buka Ruang Kelas & Materi ({enrolledClasses.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari kelas yang ingin diikuti (contoh: Fisika, Kimia, Sosiologi, Informatika)..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
          />
        </div>

        {/* Tombol Gabung Kelas Baru dengan Kode */}
        <button
          type="button"
          onClick={() => setModalJoinOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#2A2C5E] hover:bg-[#1F2147] text-white text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Gabung dengan Kode Kelas</span>
        </button>
      </div>

      {/* 3. Daftar Kelas yang Tersedia untuk Diikuti (Belum Diikuti Siswa) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Daftar Kelas Tersedia yang Belum Diikuti ({displayedAvailableClasses.length})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Pilih kelas mata pelajaran di bawah ini untuk bergabung dan memulai pembelajaran.
            </p>
          </div>
        </div>

        {displayedAvailableClasses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-[#2A2C5E] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-800">
              {searchQuery.trim()
                ? "Kelas Tidak Ditemukan"
                : "Seluruh Kelas Telah Anda Ikuti"}
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              {searchQuery.trim()
                ? `Tidak ditemukan kelas dengan kata kunci "${searchQuery}". Silakan coba kata kunci lain.`
                : "Semua kelas mata pelajaran aktif telah terdaftar pada akun Anda. Masuk ke menu Kelas & Materi untuk mempelajari modul."}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
              {paginatedAvailableClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-[#2A2C5E] transition-all"
                >
                  <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded bg-blue-50 text-[#2A2C5E] border border-blue-100 shrink-0">
                        {cls.kode}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">
                        {cls.ruang}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-base font-bold text-gray-900 leading-snug line-clamp-2 min-h-[2rem] sm:min-h-0">
                      {cls.nama}
                    </h3>

                    <p className="text-[10px] sm:text-xs text-gray-600 flex items-center gap-1 truncate">
                      <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">
                        <strong className="text-gray-800">Guru:</strong> {cls.guruNama}
                      </span>
                    </p>

                    <div className="text-[9px] sm:text-[11px] text-gray-500 pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                      <span className="truncate">Kelas {cls.tingkat} ({cls.jurusan})</span>
                      <span className="shrink-0">{cls.pertemuanList.length} Pertemuan</span>
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 sm:gap-2">
                    <span className="text-[9px] sm:text-[11px] text-gray-500 truncate">{cls.jadwal}</span>
                    <button
                      type="button"
                      onClick={() => handleQuickEnroll(cls.id, cls.nama)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-md transition-all shadow-2xs cursor-pointer shrink-0"
                    >
                      <PlusCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                      <span>Gabung Kelas</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigasi Paginasi (Maksimal 6 Tampilan per Halaman) */}
            {totalPages > 1 && (
              <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
                itemLabel="kelas tersedia"
              />
            )}
          </div>
        )}
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
