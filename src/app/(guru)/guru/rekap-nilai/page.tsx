"use client";

import { useState, useMemo } from "react";
import {
  Award,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Edit3,
  X,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
  ChevronDown,
  BookOpen,
  Users,
} from "lucide-react";
import {
  useLMSStore,
  SiswaGradeRecord,
  INITIAL_GRADE_MATRIX,
} from "@/lib/lmsStore";

export default function GuruRekapNilaiPage() {
  const { classes, gradeMatrix, updateStudentGrade } = useLMSStore();

  // Kelas yang sedang aktif dipilih
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes[0]?.id || "mapel-1"
  );

  const activeClass = useMemo(() => {
    return classes.find((c) => c.id === selectedClassId) || classes[0];
  }, [classes, selectedClassId]);

  // Data nilai siswa untuk kelas yang dipilih
  const classGrades: SiswaGradeRecord[] = useMemo(() => {
    if (!activeClass) return [];
    if (gradeMatrix[activeClass.id]) {
      return gradeMatrix[activeClass.id];
    }
    return INITIAL_GRADE_MATRIX["mapel-1"] || [];
  }, [activeClass, gradeMatrix]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | "TUNTAS" | "REMIDIAL">("ALL");

  // State Sinkronisasi Supabase
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState("Hari Ini, 09:15 WIB");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State Modal Edit Nilai
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState<SiswaGradeRecord | null>(null);
  const [editMeetingKey, setEditMeetingKey] = useState<string>("1");
  const [editScore, setEditScore] = useState<number>(85);

  // Perhitungan Nilai Rata-rata & Predikat per Siswa
  const studentEvaluations = useMemo(() => {
    if (!activeClass) return [];
    const meetings = activeClass.pertemuanList;

    return classGrades.map((rec) => {
      const scores = meetings.map((m) => rec.nilaiPerPertemuan[String(m.nomor)] ?? 85);
      const totalScore = scores.reduce((acc, curr) => acc + curr, 0);
      const finalScore = Math.round(totalScore / Math.max(1, scores.length));

      let predikat = "D";
      if (finalScore >= 90) predikat = "A";
      else if (finalScore >= 80) predikat = "B";
      else if (finalScore >= 75) predikat = "C";

      const statusKetuntasan: "TUNTAS" | "REMIDIAL" =
        finalScore >= 75 ? "TUNTAS" : "REMIDIAL";

      return {
        ...rec,
        scores,
        finalScore,
        predikat,
        statusKetuntasan,
      };
    });
  }, [activeClass, classGrades]);

  // Filter Siswa berdasarkan Search & Status
  const filteredStudents = useMemo(() => {
    return studentEvaluations.filter((s) => {
      const matchSearch =
        s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nisn.includes(searchQuery);

      const matchStatus =
        selectedStatus === "ALL" || s.statusKetuntasan === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [studentEvaluations, searchQuery, selectedStatus]);

  // Statistik Ringkasan Kelas Aktif
  const classStats = useMemo(() => {
    if (studentEvaluations.length === 0) {
      return { avg: 0, highest: 0, lowest: 0, tuntasCount: 0, tuntasPct: 0 };
    }
    const finals = studentEvaluations.map((s) => s.finalScore);
    const avg = Math.round(finals.reduce((a, b) => a + b, 0) / finals.length);
    const highest = Math.max(...finals);
    const lowest = Math.min(...finals);
    const tuntasCount = studentEvaluations.filter((s) => s.statusKetuntasan === "TUNTAS").length;
    const tuntasPct = Math.round((tuntasCount / studentEvaluations.length) * 100);

    return { avg, highest, lowest, tuntasCount, tuntasPct };
  }, [studentEvaluations]);

  // Sinkronisasi dengan Supabase API
  const handleSyncSupabase = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/guru/sync");
      if (res.ok) {
        const json = await res.json();
        setLastSynced(json.syncedAt || "Baru saja");
        setToastMessage("Data nilai per pertemuan berhasil disinkronkan dengan basis data Supabase.");
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (err) {
      console.warn("Gagal sinkronisasi nilai:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Buka Modal Edit Nilai
  const openEditModal = (siswa: SiswaGradeRecord, meetingNomor: number) => {
    setSelectedSiswa(siswa);
    setEditMeetingKey(String(meetingNomor));
    setEditScore(siswa.nilaiPerPertemuan[String(meetingNomor)] ?? 85);
    setEditModalOpen(true);
  };

  // Simpan Edit Nilai
  const handleSaveEditNilai = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClass || !selectedSiswa) return;

    updateStudentGrade(activeClass.id, selectedSiswa.siswaId, editMeetingKey, editScore);

    // Kirim sinkronisasi ke Supabase
    try {
      await fetch("/api/guru/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_NILAI",
          payload: {
            classId: activeClass.id,
            siswaId: selectedSiswa.siswaId,
            pertemuanNomor: editMeetingKey,
            nilai: editScore,
          },
        }),
      });
    } catch (err) {
      console.warn("Gagal sync ke Supabase:", err);
    }

    setEditModalOpen(false);
    setToastMessage(
      `Nilai Pertemuan ${editMeetingKey} untuk ${selectedSiswa.nama} berhasil diperbarui menjadi ${editScore}!`
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Ekspor Data Nilai ke CSV
  const handleExportCSV = () => {
    if (!activeClass) return;
    const meetings = activeClass.pertemuanList;
    const headers = [
      "NISN",
      "Nama Siswa",
      "Kelas",
      "Mata Pelajaran",
      ...meetings.map((m) => `P-${m.nomor}`),
      "Nilai Akhir",
      "Predikat",
      "Status Ketuntasan",
    ];

    const rows = studentEvaluations.map((r) => [
      r.nisn,
      `"${r.nama}"`,
      r.kelas,
      `"${activeClass.nama}"`,
      ...r.scores,
      r.finalScore,
      r.predikat,
      r.statusKetuntasan,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Rekap_Nilai_${activeClass.kode}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Rekapitulasi nilai ${activeClass.nama} berhasil diekspor ke CSV.`);
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
            <GraduationCap className="w-3.5 h-3.5 text-[#2A2C5E]" />
            <span>Buku Penilaian Resmi SMAN 2 Buay Bahuga</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Rekapitulasi Nilai Siswa
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Matriks capaian penilaian formatif, sumatif, UTS, dan UAS per pertemuan per mata pelajaran binaan.
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
            <label htmlFor="pilih-kelas" className="text-xs font-bold text-gray-900">
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
              id="pilih-kelas"
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

      {/* 4 Kartu Metrik Ringkasan Nilai */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Rata-Rata Nilai
            </span>
            <span className="p-1.5 bg-blue-50 text-[#2A2C5E] rounded-lg">
              <Award className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-gray-900">
            {classStats.avg}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Skala 0 - 100 Rombel</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Nilai Tertinggi
            </span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">
            {classStats.highest}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Capaian Formatif Terbaik</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Nilai Terendah
            </span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-600">
            {classStats.lowest}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Standar KKM 75</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Tingkat Ketuntasan
            </span>
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#2A2C5E]">
            {classStats.tuntasPct}%
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            {classStats.tuntasCount} dari {studentEvaluations.length} Siswa Tuntas
          </p>
        </div>
      </div>

      {/* Filter & Pencarian Siswa */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
            >
              <option value="ALL">Semua Ketuntasan</option>
              <option value="TUNTAS">Tuntas (≥ 75)</option>
              <option value="REMIDIAL">Perlu Remidial (&lt; 75)</option>
            </select>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
          <span className="font-semibold text-gray-700">Petunjuk Interaktif:</span>
          Klik angka nilai pada tabel untuk langsung mengubah nilai pertemuan siswa bersangkutan.
        </p>
      </div>

      {/* Matriks Tabel Nilai per Pertemuan (Buku Nilai Guru) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              Matriks Penilaian Formatif & Sumatif: {activeClass?.nama}
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
                <th className="py-3 px-4 min-w-[140px]">NISN & Nama Siswa</th>
                <th className="py-3 px-3 min-w-[90px]">Rombel</th>
                {activeClass?.pertemuanList.map((m) => (
                  <th
                    key={m.id}
                    className="py-3 px-2 text-center min-w-[62px]"
                    title={m.judul}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-gray-900">
                        {m.tipe === "UTS" ? "UTS" : m.tipe === "UAS" ? "UAS" : `P-${m.nomor}`}
                      </span>
                      <span className="text-[9px] text-gray-400 font-normal">
                        {m.tipe === "UTS" || m.tipe === "UAS" ? "Sumatif" : "Formatif"}
                      </span>
                    </div>
                  </th>
                ))}
                <th className="py-3 px-3 text-center min-w-[70px] bg-blue-50/40 text-[#2A2C5E]">
                  Nilai Akhir
                </th>
                <th className="py-3 px-2 text-center min-w-[50px] bg-blue-50/40 text-[#2A2C5E]">
                  Predikat
                </th>
                <th className="py-3 px-3 text-center min-w-[80px]">Ketuntasan</th>
                <th className="py-3 px-3 text-center min-w-[60px]">Aksi</th>
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
                    const score = s.nilaiPerPertemuan[String(m.nomor)] ?? 85;
                    const isBelowKKM = score < 75;
                    return (
                      <td key={m.id} className="py-3 px-1 text-center">
                        <button
                          type="button"
                          onClick={() => openEditModal(s, m.nomor)}
                          title={`Klik untuk ubah nilai ${s.nama} pada ${m.judul}`}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                            isBelowKKM
                              ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                              : score >= 90
                              ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                              : "bg-blue-50 text-[#2A2C5E] hover:bg-blue-100 border border-blue-200"
                          }`}
                        >
                          {score}
                        </button>
                      </td>
                    );
                  })}
                  <td className="py-3 px-3 text-center font-extrabold text-sm bg-blue-50/40 text-[#2A2C5E]">
                    {s.finalScore}
                  </td>
                  <td className="py-3 px-2 text-center font-bold bg-blue-50/40 text-[#2A2C5E]">
                    {s.predikat}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.statusKetuntasan === "TUNTAS"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {s.statusKetuntasan}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => openEditModal(s, 1)}
                      className="p-1.5 text-gray-500 hover:text-[#2A2C5E] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Nilai Siswa"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Nilai Siswa */}
      {editModalOpen && selectedSiswa && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4 border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 text-[#2A2C5E] rounded-lg">
                  <Edit3 className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-gray-900">
                  Perbarui Nilai Pertemuan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-gray-900">{selectedSiswa.nama}</div>
              <div className="text-gray-500 text-[11px]">
                NISN: {selectedSiswa.nisn} • Rombel: {selectedSiswa.kelas}
              </div>
            </div>

            <form onSubmit={handleSaveEditNilai} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Pilih Pertemuan:
                </label>
                <select
                  value={editMeetingKey}
                  onChange={(e) => {
                    const key = e.target.value;
                    setEditMeetingKey(key);
                    setEditScore(selectedSiswa.nilaiPerPertemuan[key] ?? 85);
                  }}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                >
                  {activeClass?.pertemuanList.map((m) => (
                    <option key={m.id} value={String(m.nomor)}>
                      Pertemuan {m.nomor} ({m.tipe === "UTS" ? "UTS" : m.tipe === "UAS" ? "UAS" : "Formatif"}) - {m.judul}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-gray-700 font-semibold">
                    Nilai Capaian (0 - 100):
                  </label>
                  <span className="text-xs font-bold text-[#2A2C5E]">{editScore}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editScore}
                  onChange={(e) => setEditScore(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editScore}
                  onChange={(e) => setEditScore(Number(e.target.value))}
                  className="w-full mt-2 accent-[#2A2C5E] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2A2C5E] hover:bg-[#1F2147] text-white text-xs font-bold rounded-lg cursor-pointer shadow-2xs"
                >
                  Simpan &amp; Sinkronkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
