"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Calendar,
  User,
  BookOpen,
  ChevronRight,
  Search,
  Filter,
  X,
  FileText,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { useAuthStore, usePresensiStore } from "@/lib/store";
import { useLMSStore, MapelLMS, PertemuanItem } from "@/lib/lmsStore";
import PaginationBar from "@/components/common/PaginationBar";

function SiswaPresensiContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const { classes, enrolledMapelIds, submitPresensiPertemuan } = useLMSStore();
  const { records, addRecord } = usePresensiStore();

  const activeStudent = currentUser || {
    name: "Dharma Mudita Pratama",
    kelas: "XII MIPA 1",
    nisn: "0078129341",
  };

  // Kelas yang sedang diikuti siswa
  const enrolledClasses = useMemo(() => {
    return classes.filter((c) => enrolledMapelIds.includes(c.id));
  }, [classes, enrolledMapelIds]);

  // Sinkronisasi kelas yang dipilih dari URL search params
  const urlClassId = searchParams.get("id");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(urlClassId);

  useEffect(() => {
    setSelectedClassId(urlClassId);
  }, [urlClassId]);

  const activeClass = useMemo(() => {
    if (!selectedClassId) return null;
    return enrolledClasses.find((c) => c.id === selectedClassId) || null;
  }, [enrolledClasses, selectedClassId]);

  // State untuk Tampilan 1 (Daftar Kotak Kelas Presensi)
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"SEMUA" | "HADIR" | "BELUM">("SEMUA");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // State untuk form presensi hari ini di dalam kelas
  const [selectedStatusType, setSelectedStatusType] = useState<"HADIR" | "IZIN" | "SAKIT">("HADIR");
  const [keteranganText, setKeteranganText] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Periksa apakah suatu kelas sudah terisi presensi sesi aktifnya (pertemuan 1 sebagai sesi acuan hari ini)
  const isClassAttendedToday = (cls: MapelLMS) => {
    const todaySession = cls.pertemuanList[0];
    return Boolean(todaySession?.presensi?.hadir);
  };

  // Filter daftar kelas presensi
  const filteredClasses = useMemo(() => {
    return enrolledClasses.filter((cls) => {
      const matchSearch =
        !searchQuery.trim() ||
        cls.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.guruNama.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      const isAttended = isClassAttendedToday(cls);
      if (statusFilter === "HADIR") return isAttended;
      if (statusFilter === "BELUM") return !isAttended;
      return true;
    });
  }, [enrolledClasses, searchQuery, statusFilter]);

  const totalItems = filteredClasses.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Statistik Presensi
  const totalAttendedToday = enrolledClasses.filter((c) => isClassAttendedToday(c)).length;
  const totalNotAttendedToday = enrolledClasses.length - totalAttendedToday;
  const overallRate = enrolledClasses.length > 0
    ? Math.round((totalAttendedToday / enrolledClasses.length) * 100)
    : 100;

  // Handler Masuk ke Presensi Kelas
  const handleOpenClass = (id: string) => {
    setSelectedClassId(id);
    router.push(`/siswa/presensi?id=${id}`);
  };

  // Handler Kembali ke Daftar Seluruh Kelas
  const handleBackToList = () => {
    setSelectedClassId(null);
    router.push("/siswa/presensi");
  };

  // Handler Kirim Presensi Hari Ini
  const handleConfirmAttendance = (cls: MapelLMS, targetMeeting: PertemuanItem) => {
    const timeNow = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";

    // 1. Perbarui state pertemuan di LMS Store
    submitPresensiPertemuan(cls.id, targetMeeting.id);

    // 2. Tambahkan catatan ke riwayat presensi umum
    addRecord({
      id: `pres-${Date.now()}`,
      siswaId: currentUser?.id || "siswa-1",
      siswaNama: activeStudent.name,
      nisn: activeStudent.nisn || "0078129341",
      kelas: activeStudent.kelas || "XII MIPA 1",
      tanggal: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      waktu: timeNow,
      status: selectedStatusType,
      jarakMeter: 12,
      latitude: -4.3239,
      longitude: 104.5609,
      keterangan: selectedStatusType === "HADIR"
        ? `Presensi Terverifikasi di Lingkungan Sekolah (${cls.nama})`
        : `Keterangan ${selectedStatusType}: ${keteranganText || "Surat izin/keterangan terlampir"} (${cls.nama})`,
    });

    setToastMessage(`Presensi hari ini untuk kelas ${cls.nama} berhasil dicatat sebagai ${selectedStatusType}!`);
    setKeteranganText("");
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // --------------------------------------------------------------------------
  // TAMPILAN 1: DAFTAR KOTAK KELAS MATA PELAJARAN (SAMA KAYA KELAS & MATERI)
  // --------------------------------------------------------------------------
  if (!activeClass) {
    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Header Halaman */}
        <div className="border-b border-gray-200 pb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5 text-[#2A2C5E]" />
            <span>Sistem Presensi Siswa Digital SMAN 2 Buay Bahuga</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Presensi Harian Mata Pelajaran
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Pilih kotak kelas mata pelajaran di bawah ini untuk melihat jadwal kehadiran dan mengisi absensi hari ini.
          </p>
        </div>

        {/* 4 Kartu Status Presensi (2 Kolom di Mobile, 4 Kolom di Desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Total Kelas Terdaftar
            </span>
            <p className="text-xs sm:text-base font-bold text-gray-900 truncate">
              {enrolledClasses.length} Mata Pelajaran
            </p>
            <p className="text-[10px] text-gray-500 truncate">
              Fase F &bull; Kelas {activeStudent.kelas}
            </p>
          </div>

          <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Presensi Hari Ini
            </span>
            <p className="text-xs sm:text-base font-bold text-[#2A2C5E] truncate">
              {totalAttendedToday} Hadir &bull; {totalNotAttendedToday} Belum
            </p>
            <p className="text-[10px] text-gray-500 truncate">
              Status Sesi Pembelajaran Aktif
            </p>
          </div>

          <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Tingkat Kehadiran
            </span>
            <p className="text-xs sm:text-base font-bold text-emerald-700 truncate">
              {overallRate}% Sangat Baik
            </p>
            <p className="text-[10px] text-gray-500 truncate">
              Rekapitulasi Kehadiran Siswa
            </p>
          </div>

          <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Tahun Ajaran Aktif
            </span>
            <p className="text-xs sm:text-base font-bold text-gray-900 truncate">
              2026/2027
            </p>
            <p className="text-[10px] text-gray-500 truncate">
              Semester Ganjil SMAN 2 Buay Bahuga
            </p>
          </div>
        </div>

        {/* Bar Pencarian & Filter Tab Kategori */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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
              placeholder="Cari kelas mata pelajaran atau nama guru pengampu..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
            />
          </div>

          {/* Filter Status Presensi */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => {
                setStatusFilter("SEMUA");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === "SEMUA"
                  ? "bg-[#2A2C5E] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Semua Kelas ({enrolledClasses.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("HADIR");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === "HADIR"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              Sudah Absen ({totalAttendedToday})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("BELUM");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === "BELUM"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
              }`}
            >
              Belum Absen ({totalNotAttendedToday})
            </button>
          </div>
        </div>

        {/* Grid Kotak-Kotak Kelas Presensi (2 Kolom di Mobile, Maksimal 6 per Halaman) */}
        {filteredClasses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-[#2A2C5E] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#2A2C5E]" />
            </div>
            <h3 className="text-sm font-bold text-gray-800">
              Tidak Ada Kelas yang Sesuai
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Tidak ditemukan data kelas mata pelajaran dengan kriteria pencarian atau filter yang dipilih.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
              {paginatedClasses.map((cls) => {
                const attended = isClassAttendedToday(cls);
                const totalMeetings = cls.pertemuanList.length;
                const completedCount = cls.pertemuanList.filter((p) => p.presensi.hadir).length;
                const percent = Math.round((completedCount / totalMeetings) * 100);

                return (
                  <div
                    key={cls.id}
                    className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-5 shadow-2xs hover:shadow-md hover:border-[#2A2C5E] transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded bg-blue-50 text-[#2A2C5E] border border-blue-100 shrink-0">
                          {cls.kode}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">
                          {cls.ruang}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-xs sm:text-base font-bold text-gray-900 leading-snug line-clamp-2 min-h-[2rem] sm:min-h-0">
                          {cls.nama}
                        </h2>
                        <p className="text-[10px] sm:text-xs text-gray-600 mt-1 flex items-center gap-1 truncate">
                          <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{cls.guruNama}</span>
                        </p>
                      </div>

                      {/* Status Presensi Hari Ini */}
                      <div className="pt-2 border-t border-gray-100">
                        {attended ? (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] sm:text-xs font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>Hadir Hari Ini</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] sm:text-xs font-bold">
                            <Clock className="w-3 h-3 text-rose-600 shrink-0" />
                            <span>Belum Absen Hari Ini</span>
                          </div>
                        )}
                      </div>

                      {/* Ringkasan Kehadiran Seluruh Pertemuan */}
                      <div className="text-[9px] sm:text-[11px] text-gray-500 flex items-center justify-between">
                        <span>Kehadiran: {completedCount}/{totalMeetings} Sesi</span>
                        <span className="font-bold text-[#2A2C5E]">{percent}%</span>
                      </div>
                    </div>

                    {/* Footer Tombol Masuk */}
                    <div className="pt-3 mt-3 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                      <span className="text-[9px] sm:text-[11px] text-gray-500 font-medium truncate">
                        {cls.jadwal}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenClass(cls.id)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs transition-all cursor-pointer shrink-0"
                      >
                        <span className="sm:hidden">Buka Presensi</span>
                        <span className="hidden sm:inline">Buka Presensi Kelas</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigasi Paginasi (Maksimal 6 Tampilan per Halaman) */}
            {totalPages > 1 && (
              <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                onPageChange={(p) => setCurrentPage(p)}
                itemLabel="kelas mata pelajaran"
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // TAMPILAN 2: DETAIL PRESENSI KELAS (KETIKA DIKLIK: ISINYA ABSENSI HARI INI)
  // --------------------------------------------------------------------------
  // Sesi pertemuan aktif hari ini (pertemuan 1 atau pertemuan pertama yang belum absen)
  const todayMeeting = activeClass.pertemuanList.find((p) => !p.presensi.hadir) || activeClass.pertemuanList[0];
  const isAlreadyAttended = Boolean(todayMeeting.presensi.hadir);
  const totalMeetings = activeClass.pertemuanList.length;
  const completedCount = activeClass.pertemuanList.filter((p) => p.presensi.hadir).length;
  const attendancePercent = Math.round((completedCount / totalMeetings) * 100);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Notifikasi Berhasil */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigasi Breadcrumb & Tombol Kembali */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBackToList}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2A2C5E] hover:text-[#1F2147] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Seluruh Kelas Presensi</span>
        </button>
        <span className="text-xs text-gray-400">
          Tahun Ajaran 2026/2027 &bull; SMAN 2 Buay Bahuga
        </span>
      </div>

      {/* Header Banner Kelas Aktif */}
      <div className="bg-[#2A2C5E] text-white rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white/15 text-blue-100 text-[11px] font-bold">
            <span>{activeClass.kode}</span>
            <span>&bull;</span>
            <span>{activeClass.ruang}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {activeClass.nama}
          </h1>
          <p className="text-xs sm:text-sm text-blue-200">
            Guru Pengampu: <strong className="text-white">{activeClass.guruNama}</strong> &bull; Jadwal: {activeClass.jadwal}
          </p>
        </div>

        {/* Ringkasan Kehadiran Siswa */}
        <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/15 min-w-[200px] shrink-0 space-y-2">
          <div className="flex items-center justify-between text-xs text-blue-100 font-semibold">
            <span>Rekap Kehadiran</span>
            <span className="font-bold text-white">{attendancePercent}%</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${attendancePercent}%` }}
            />
          </div>
          <div className="text-[11px] text-blue-200">
            {completedCount} dari {totalMeetings} Sesi Terdata Hadir
          </div>
        </div>
      </div>

      {/* KARTU UTAMA: PRESENSI SESI HARI INI */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 text-[#2A2C5E] text-[11px] font-bold mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Sesi Pertemuan Hari Ini: {todayMeeting.tanggal}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {todayMeeting.judul}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Jadwal Kelas: {activeClass.jadwal} &bull; Lokasi Pembelajaran: {activeClass.ruang}
            </p>
          </div>

          <div className="shrink-0">
            {isAlreadyAttended ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Terverifikasi Hadir</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Sesi Presensi Terbuka</span>
              </span>
            )}
          </div>
        </div>

        {/* Konten Status: Jika Sudah Hadir vs Belum Hadir */}
        {isAlreadyAttended ? (
          <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-emerald-900">
                  Presensi Hari Ini Telah Berhasil Terverifikasi
                </h3>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Kehadiran Anda atas nama <strong className="text-emerald-950">{activeStudent.name}</strong> ({activeStudent.nisn}) telah tercatat secara sah di sistem presensi digital SMAN 2 Buay Bahuga.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-700 pt-1 font-medium">
                  <span>Waktu Hadir: <strong>{todayMeeting.presensi.waktuHadir || "07:15 WIB"}</strong></span>
                  <span>&bull;</span>
                  <span>Status: <strong>Tepat Waktu</strong></span>
                  <span>&bull;</span>
                  <span>Lokasi: <strong>Lingkungan SMAN 2 Buay Bahuga</strong></span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Pilih Status Kehadiran Hari Ini:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedStatusType("HADIR")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedStatusType === "HADIR"
                      ? "border-[#2A2C5E] bg-[#2A2C5E]/5 ring-1 ring-[#2A2C5E]"
                      : "border-gray-200 bg-gray-50/60 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">Hadir</span>
                    <CheckCircle2 className={`w-4 h-4 ${selectedStatusType === "HADIR" ? "text-[#2A2C5E]" : "text-gray-400"}`} />
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">Mengikuti di Kelas</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStatusType("IZIN")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedStatusType === "IZIN"
                      ? "border-amber-600 bg-amber-50/60 ring-1 ring-amber-600"
                      : "border-gray-200 bg-gray-50/60 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">Izin</span>
                    <Clock className={`w-4 h-4 ${selectedStatusType === "IZIN" ? "text-amber-600" : "text-gray-400"}`} />
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">Surat / Keperluan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStatusType("SAKIT")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedStatusType === "SAKIT"
                      ? "border-rose-600 bg-rose-50/60 ring-1 ring-rose-600"
                      : "border-gray-200 bg-gray-50/60 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">Sakit</span>
                    <AlertCircle className={`w-4 h-4 ${selectedStatusType === "SAKIT" ? "text-rose-600" : "text-gray-400"}`} />
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">Keterangan Sakit</span>
                </button>
              </div>
            </div>

            {/* Catatan Alasan (Jika Izin atau Sakit) */}
            {selectedStatusType !== "HADIR" && (
              <div className="space-y-1.5 animate-in fade-in">
                <label className="block text-xs font-semibold text-gray-700">
                  Keterangan Alasan ({selectedStatusType}):
                </label>
                <textarea
                  value={keteranganText}
                  onChange={(e) => setKeteranganText(e.target.value)}
                  placeholder={`Tuliskan alasan ${selectedStatusType.toLowerCase()} atau lampirkan keterangan resmi dari orang tua/wali...`}
                  rows={2}
                  className="w-full p-3 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                />
              </div>
            )}

            {/* Tombol Konfirmasi Presensi Hari Ini */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2A2C5E]" />
                <span>Validasi kehadiran fisik otomatis di lingkungan SMAN 2 Buay Bahuga.</span>
              </p>
              <button
                type="button"
                onClick={() => handleConfirmAttendance(activeClass, todayMeeting)}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#2A2C5E] hover:bg-[#1F2147] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {selectedStatusType === "HADIR"
                    ? "Konfirmasi Hadir Hari Ini"
                    : `Kirim Keterangan ${selectedStatusType}`}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* REKAPITULASI KEHADIRAN SELURUH PERTEMUAN KELAS INI */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7 space-y-4">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Rekapitulasi Kehadiran Sesi Pembelajaran ({totalMeetings} Pertemuan)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Alur rekam jejak presensi Anda untuk seluruh modul dan pertemuan tatap muka semester ini.
            </p>
          </div>
        </div>

        {/* Daftar Kartu Pertemuan (2 Kolom di Mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {activeClass.pertemuanList.map((pt) => {
            const isAttended = Boolean(pt.presensi.hadir);
            return (
              <div
                key={pt.id}
                className={`p-3 sm:p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isAttended
                    ? "bg-emerald-50/40 border-emerald-200"
                    : "bg-gray-50/70 border-gray-200"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-[#2A2C5E]">
                      {pt.tipe === "UTS" ? "UTS" : pt.tipe === "UAS" ? "UAS" : `P-0${pt.nomor}`}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {pt.tanggal.split(",")[0]}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                    {pt.judul}
                  </h4>
                </div>

                <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between">
                  {isAttended ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Hadir</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleConfirmAttendance(activeClass, pt)}
                      className="px-2 py-0.5 text-[10px] font-bold text-[#2A2C5E] bg-blue-50 hover:bg-[#2A2C5E] hover:text-white rounded transition-colors cursor-pointer"
                    >
                      Isi Hadir
                    </button>
                  )}
                  <span className="text-[10px] text-gray-400 font-mono">
                    {pt.presensi.waktuHadir || "Terjadwal"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SiswaPresensiPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-gray-500">
          Memuat presensi siswa...
        </div>
      }
    >
      <SiswaPresensiContent />
    </Suspense>
  );
}
