"use client";

import { useState, useMemo } from "react";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Download,
  Filter,
  FileText,
  MapPin,
  Calendar,
  X,
  ExternalLink,
  ShieldCheck,
  Eye,
  Sparkles,
  BookOpen,
  ChevronDown,
  Users,
} from "lucide-react";
import {
  useLMSStore,
  SiswaAbsensiRecord,
  INITIAL_ABSENSI_MATRIX,
} from "@/lib/lmsStore";

export default function GuruRekapAbsensiPage() {
  const { classes, absensiMatrix, updateStudentAbsensi } = useLMSStore();

  // Kelas yang sedang dipilih
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes[0]?.id || "mapel-1"
  );

  const activeClass = useMemo(() => {
    return classes.find((c) => c.id === selectedClassId) || classes[0];
  }, [classes, selectedClassId]);

  // Data absensi siswa untuk kelas aktif
  const classAbsensi: SiswaAbsensiRecord[] = useMemo(() => {
    if (!activeClass) return [];
    if (absensiMatrix[activeClass.id]) {
      return absensiMatrix[activeClass.id];
    }
    return INITIAL_ABSENSI_MATRIX["mapel-1"] || [];
  }, [activeClass, absensiMatrix]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKeaktifan, setSelectedKeaktifan] = useState<"ALL" | "AKTIF" | "PEMBINAAN">("ALL");

  // State Sinkronisasi Supabase
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState("Hari Ini, 07:45 WIB");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State Modal Surat Sakit / Izin
  const [previewSuratModal, setPreviewSuratModal] = useState<{
    open: boolean;
    siswaNama: string;
    tipe: "SAKIT" | "IZIN";
    nomorPertemuan: string;
    keterangan: string;
    fileUrl: string;
  }>({
    open: false,
    siswaNama: "",
    tipe: "SAKIT",
    nomorPertemuan: "1",
    keterangan: "",
    fileUrl: "",
  });

  // Perhitungan Rekap Kehadiran per Siswa
  const studentEvaluations = useMemo(() => {
    if (!activeClass) return [];
    const meetings = activeClass.pertemuanList;

    return classAbsensi.map((rec) => {
      const records = meetings.map((m) => rec.absensiPerPertemuan[String(m.nomor)] ?? "H");
      const hadirCount = records.filter((st) => st === "H").length;
      const izinCount = records.filter((st) => st === "I").length;
      const sakitCount = records.filter((st) => st === "S").length;
      const alpaCount = records.filter((st) => st === "A").length;
      const percent = Math.round((hadirCount / Math.max(1, meetings.length)) * 100);

      const statusKeaktifan =
        percent >= 90
          ? "Sangat Aktif"
          : percent >= 75
          ? "Cukup Aktif"
          : "Perlu Pembinaan";

      return {
        ...rec,
        records,
        hadirCount,
        izinCount,
        sakitCount,
        alpaCount,
        percent,
        statusKeaktifan,
      };
    });
  }, [activeClass, classAbsensi]);

  // Filter Siswa berdasarkan Search & Keaktifan
  const filteredStudents = useMemo(() => {
    return studentEvaluations.filter((s) => {
      const matchSearch =
        s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nisn.includes(searchQuery);

      const matchFilter =
        selectedKeaktifan === "ALL" ||
        (selectedKeaktifan === "AKTIF" && s.percent >= 80) ||
        (selectedKeaktifan === "PEMBINAAN" && s.percent < 80);

      return matchSearch && matchFilter;
    });
  }, [studentEvaluations, searchQuery, selectedKeaktifan]);

  // Statistik Ringkasan Absensi Kelas
  const classStats = useMemo(() => {
    if (studentEvaluations.length === 0) {
      return { totalStudents: 0, avgPct: 0, totalHadir: 0, totalNonHadir: 0 };
    }
    const totalStudents = studentEvaluations.length;
    const avgPct = Math.round(
      studentEvaluations.reduce((a, b) => a + b.percent, 0) / totalStudents
    );
    const totalHadir = studentEvaluations.reduce((a, b) => a + b.hadirCount, 0);
    const totalNonHadir = studentEvaluations.reduce(
      (a, b) => a + b.izinCount + b.sakitCount + b.alpaCount,
      0
    );

    return { totalStudents, avgPct, totalHadir, totalNonHadir };
  }, [studentEvaluations]);

  // Sinkronisasi dengan Supabase
  const handleSyncSupabase = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/guru/sync");
      if (res.ok) {
        const json = await res.json();
        setLastSynced(json.syncedAt || "Baru saja");
        setToastMessage("Data rekap absensi per pertemuan berhasil disinkronkan dengan Supabase.");
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (err) {
      console.warn("Gagal sinkronisasi absensi:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Handler Klik Badge Status Presensi (Siklus: H -> I -> S -> A -> H)
  const handleCycleStatus = (siswaId: string, meetingKey: string, currentStatus: "H" | "I" | "S" | "A") => {
    if (!activeClass) return;
    const nextStatusMap: Record<"H" | "I" | "S" | "A", "H" | "I" | "S" | "A"> = {
      H: "I",
      I: "S",
      S: "A",
      A: "H",
    };
    const next = nextStatusMap[currentStatus];
    updateStudentAbsensi(activeClass.id, siswaId, meetingKey, next);

    // Kirim sinkronisasi ke Supabase
    fetch("/api/guru/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPDATE_ABSENSI",
        payload: {
          classId: activeClass.id,
          siswaId,
          pertemuanNomor: meetingKey,
          status: next,
        },
      }),
    }).catch((err) => console.warn("Gagal update absensi Supabase:", err));
  };

  // Ekspor Rekap Absensi ke CSV
  const handleExportCSV = () => {
    if (!activeClass) return;
    const meetings = activeClass.pertemuanList;
    const headers = [
      "NISN",
      "Nama Siswa",
      "Kelas",
      "Mata Pelajaran",
      ...meetings.map((m) => `P-${m.nomor}`),
      "Total Hadir",
      "% Kehadiran",
      "Status Keaktifan",
    ];

    const rows = studentEvaluations.map((r) => [
      r.nisn,
      `"${r.nama}"`,
      r.kelas,
      `"${activeClass.nama}"`,
      ...r.records,
      `${r.hadirCount}/${meetings.length}`,
      `${r.percent}%`,
      r.statusKeaktifan,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Rekap_Absensi_${activeClass.kode}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Rekapitulasi absensi ${activeClass.nama} berhasil diekspor ke CSV.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Notifikasi */}
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

      {/* Header Halaman & Aksi Cepat */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5 text-[#2A2C5E]" />
            <span>Buku Induk Presensi Siswa SMAN 2 Buay Bahuga</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Rekapitulasi Absensi Siswa
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Matriks absensi kehadiran peserta didik per pertemuan mata pelajaran (Hadir, Izin, Sakit, Alpa) terintegrasi Dapodik.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSyncSupabase}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Sinkronisasi..." : "Sinkron Supabase"}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Bar Pemilih Kelas / Mata Pelajaran */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#2A2C5E]" />
            <label htmlFor="pilih-kelas-absensi" className="text-xs font-bold text-gray-900">
              Pilih Ruang Kelas & Mata Pelajaran:
            </label>
          </div>
          <span className="text-[11px] text-gray-400">
            Terakhir disinkronkan: {lastSynced}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <select
              id="pilih-kelas-absensi"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E] cursor-pointer"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.nama} - Kelas {cls.tingkat} ({cls.jurusan}) [{cls.kode}]
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {activeClass && (
            <div className="flex items-center justify-between sm:justify-end gap-3 px-3 py-2 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-[#2A2C5E]">
              <span className="font-semibold">{activeClass.ruang}</span>
              <span>•</span>
              <span className="font-medium text-gray-600 truncate">{activeClass.jadwal}</span>
            </div>
          )}
        </div>
      </div>

      {/* 4 Kartu Metrik Ringkasan Absensi */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Total Siswa
            </span>
            <span className="p-1.5 bg-blue-50 text-[#2A2C5E] rounded-lg">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-gray-900">
            {classStats.totalStudents} Siswa
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Rombel Terdaftar</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Rata-Rata Kehadiran
            </span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">
            {classStats.avgPct}%
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Kedisiplinan Pertemuan</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Total Sesi Hadir
            </span>
            <span className="p-1.5 bg-blue-50 text-[#2A2C5E] rounded-lg">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#2A2C5E]">
            {classStats.totalHadir} Sesi
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Kehadiran Fisik &amp; CBT</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Izin / Sakit / Alpa
            </span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-600">
            {classStats.totalNonHadir} Sesi
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Dispensasi &amp; Sakit</p>
        </div>
      </div>

      {/* Legenda Status & Petunjuk Interaktif */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-900 mr-1">Legenda Status:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              H = Hadir
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              I = Izin
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-sky-600" />
              S = Sakit
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              A = Alpa
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={selectedKeaktifan}
              onChange={(e) => setSelectedKeaktifan(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
            >
              <option value="ALL">Semua Keaktifan</option>
              <option value="AKTIF">Sangat / Cukup Aktif (≥ 75%)</option>
              <option value="PEMBINAAN">Perlu Pembinaan (&lt; 75%)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari siswa berdasarkan nama atau NISN..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
            />
          </div>
          <p className="text-[11px] text-gray-500 font-medium">
            <span className="font-bold text-[#2A2C5E] uppercase tracking-wider">Petunjuk:</span> Klik tombol simbol (H/I/S/A) pada kolom pertemuan untuk mengubah status kehadiran siswa secara langsung.
          </p>
        </div>
      </div>

      {/* Matriks Tabel Absensi per Pertemuan (Buku Induk Presensi Guru) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              Matriks Presensi Kehadiran Siswa: {activeClass?.nama}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Rombel: Kelas {activeClass?.tingkat} ({activeClass?.jurusan}) • Total {activeClass?.pertemuanList.length} Pertemuan
            </p>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-[#2A2C5E] text-[11px] font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>{filteredStudents.length} Siswa Terdaftar</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50/80 text-gray-600 font-bold border-b border-gray-200">
              <tr>
                <th className="py-3 px-3.5 text-center w-10">No</th>
                <th className="py-3 px-4 min-w-[140px]">NISN &amp; Nama Siswa</th>
                <th className="py-3 px-3 min-w-[90px]">Rombel</th>
                {activeClass?.pertemuanList.map((m) => (
                  <th
                    key={m.id}
                    className="py-3 px-2 text-center min-w-[56px]"
                    title={m.judul}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-gray-900">
                        {m.tipe === "UTS" ? "UTS" : m.tipe === "UAS" ? "UAS" : `P-${m.nomor}`}
                      </span>
                      <span className="text-[9px] text-gray-400 font-normal">
                        {m.tipe === "UTS" || m.tipe === "UAS" ? "Ujian" : "Sesi"}
                      </span>
                    </div>
                  </th>
                ))}
                <th className="py-3 px-3 text-center min-w-[70px] bg-blue-50/40 text-[#2A2C5E]">
                  Hadir
                </th>
                <th className="py-3 px-3 text-center min-w-[70px] bg-blue-50/40 text-[#2A2C5E]">
                  % Hadir
                </th>
                <th className="py-3 px-3 text-center min-w-[100px]">Status Keaktifan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((s, idx) => (
                <tr key={s.siswaId} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3 px-3.5 text-center text-gray-400 font-medium">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-900">{s.nama}</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">{s.nisn}</div>
                  </td>
                  <td className="py-3 px-3 text-gray-600 font-medium">
                    {s.kelas}
                  </td>
                  {activeClass?.pertemuanList.map((m) => {
                    const st = s.absensiPerPertemuan[String(m.nomor)] ?? "H";
                    return (
                      <td key={m.id} className="py-3 px-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleCycleStatus(s.siswaId, String(m.nomor), st)}
                          title={`Status ${st}: Klik untuk alihkan status`}
                          className={`w-7 h-7 rounded-lg text-xs font-extrabold transition-all cursor-pointer shadow-2xs inline-flex items-center justify-center ${
                            st === "H"
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300"
                              : st === "I"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300"
                              : st === "S"
                              ? "bg-sky-100 text-sky-800 hover:bg-sky-200 border border-sky-300"
                              : "bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300"
                          }`}
                        >
                          {st}
                        </button>
                      </td>
                    );
                  })}
                  <td className="py-3 px-3 text-center font-bold text-gray-900 bg-blue-50/40">
                    {s.hadirCount}/{activeClass?.pertemuanList.length}
                  </td>
                  <td className="py-3 px-3 text-center font-extrabold text-sm bg-blue-50/40 text-[#2A2C5E]">
                    {s.percent}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.percent >= 90
                          ? "bg-emerald-100 text-emerald-800"
                          : s.percent >= 75
                          ? "bg-blue-100 text-[#2A2C5E]"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {s.statusKeaktifan}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Pratinjau Surat Izin/Sakit */}
      {previewSuratModal.open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 text-[#2A2C5E] rounded-lg">
                  <FileText className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-gray-900">
                  Pratinjau Dokumen Keterangan {previewSuratModal.tipe}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewSuratModal((prev) => ({ ...prev, open: false }))}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs">
              <div className="font-bold text-gray-900">{previewSuratModal.siswaNama}</div>
              <div className="text-gray-500">
                Pertemuan: {previewSuratModal.nomorPertemuan}
              </div>
              <div className="text-gray-700 font-medium">
                Keterangan: {previewSuratModal.keterangan}
              </div>
            </div>

            <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center space-y-2 bg-gray-50/50">
              <FileText className="w-8 h-8 text-gray-400 mx-auto" />
              <div className="text-xs font-semibold text-gray-700">
                {previewSuratModal.fileUrl}
              </div>
              <p className="text-[10px] text-gray-500">
                Dokumen telah diverifikasi secara digital oleh wali kelas &amp; tata usaha.
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setPreviewSuratModal((prev) => ({ ...prev, open: false }))}
                className="px-4 py-2 bg-[#2A2C5E] hover:bg-[#1F2147] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
