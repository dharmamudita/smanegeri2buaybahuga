"use client";

import { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";

interface NilaiRow {
  id: string;
  nisn: string;
  nama: string;
  kelas: string;
  mapel: string;
  mapelKode: string;
  nilaiTugas: number;
  nilaiKuis: number;
  nilaiUts: number;
  nilaiUas: number;
  nilaiAkhir: number;
  predikat: string;
  statusKetuntasan: "TUNTAS" | "REMIDIAL";
  catatanGuru: string;
  terakhirDiperbarui?: string;
}

const INITIAL_NILAI: NilaiRow[] = [
  {
    id: "sub-1",
    nisn: "0078129341",
    nama: "Nabila Dijayanti",
    kelas: "XII MIPA 1",
    mapel: "Biologi Umum & Genetika",
    mapelKode: "BIO-XII-MIPA",
    nilaiTugas: 95,
    nilaiKuis: 92,
    nilaiUts: 90,
    nilaiUas: 94,
    nilaiAkhir: 93,
    predikat: "A (Amat Baik)",
    statusKetuntasan: "TUNTAS",
    catatanGuru: "Sangat aktif dalam diskusi hereditas dan praktikum laboratorium.",
    terakhirDiperbarui: "Hari Ini, 09:15 WIB",
  },
  {
    id: "sub-2",
    nisn: "0078129342",
    nama: "Safety Octa Sushadi",
    kelas: "XII MIPA 2",
    mapel: "Biologi Umum & Genetika",
    mapelKode: "BIO-XII-MIPA",
    nilaiTugas: 90,
    nilaiKuis: 88,
    nilaiUts: 92,
    nilaiUas: 90,
    nilaiAkhir: 90,
    predikat: "A (Amat Baik)",
    statusKetuntasan: "TUNTAS",
    catatanGuru: "Pemahaman materi genetika sangat baik.",
    terakhirDiperbarui: "Hari Ini, 08:30 WIB",
  },
  {
    id: "sub-3",
    nisn: "0081234567",
    nama: "M. Ziddane Alfaridz",
    kelas: "XI IPS 1",
    mapel: "Geografi & Lingkungan Hidup",
    mapelKode: "GEO-XII-IPS",
    nilaiTugas: 85,
    nilaiKuis: 82,
    nilaiUts: 86,
    nilaiUas: 84,
    nilaiAkhir: 84,
    predikat: "B (Baik)",
    statusKetuntasan: "TUNTAS",
    catatanGuru: "Perlu pendalaman analisis data SIG dan pemetaan.",
    terakhirDiperbarui: "Kemarin, 14:10 WIB",
  },
  {
    id: "sub-4",
    nisn: "0081234568",
    nama: "Aji Winata Prayoga",
    kelas: "XII MIPA 1",
    mapel: "Biologi Umum & Genetika",
    mapelKode: "BIO-XII-MIPA",
    nilaiTugas: 88,
    nilaiKuis: 85,
    nilaiUts: 88,
    nilaiUas: 87,
    nilaiAkhir: 87,
    predikat: "B (Baik)",
    statusKetuntasan: "TUNTAS",
    catatanGuru: "Tugas lembar kerja mandiri selesai tepat waktu.",
    terakhirDiperbarui: "28 Oktober 2026",
  },
  {
    id: "sub-5",
    nisn: "0081234569",
    nama: "Evista Silvy Laudrya",
    kelas: "XII MIPA 1",
    mapel: "Biologi Umum & Genetika",
    mapelKode: "BIO-XII-MIPA",
    nilaiTugas: 98,
    nilaiKuis: 95,
    nilaiUts: 96,
    nilaiUas: 98,
    nilaiAkhir: 97,
    predikat: "A (Amat Baik)",
    statusKetuntasan: "TUNTAS",
    catatanGuru: "Peraih Medali Perak Olimpiade Sains, penguasaan materi istimewa.",
    terakhirDiperbarui: "Hari Ini, 10:00 WIB",
  },
  {
    id: "sub-6",
    nisn: "0081234570",
    nama: "Bagas Saputra",
    kelas: "XII MIPA 1",
    mapel: "Biologi Umum & Genetika",
    mapelKode: "BIO-XII-MIPA",
    nilaiTugas: 74,
    nilaiKuis: 70,
    nilaiUts: 72,
    nilaiUas: 75,
    nilaiAkhir: 73,
    predikat: "C (Cukup)",
    statusKetuntasan: "REMIDIAL",
    catatanGuru: "Perlu remidial pada materi hukum Hardy-Weinberg.",
    terakhirDiperbarui: "27 Oktober 2026",
  },
];

export default function GuruRekapNilaiPage() {
  const [dataNilai, setDataNilai] = useState<NilaiRow[]>(INITIAL_NILAI);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // State Sinkronisasi Supabase
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState("Hari Ini, 09:15 WIB");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State Modal Edit Nilai
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<NilaiRow | null>(null);
  const [inputTugas, setInputTugas] = useState<number>(0);
  const [inputKuis, setInputKuis] = useState<number>(0);
  const [inputUts, setInputUts] = useState<number>(0);
  const [inputUas, setInputUas] = useState<number>(0);
  const [inputCatatan, setInputCatatan] = useState<string>("");

  // Sinkronisasi data nilai dari Supabase
  const handleSyncSupabase = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/guru/sync");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.nilaiList) {
          setDataNilai(json.data.nilaiList);
          setLastSynced(json.syncedAt || "Baru saja");
          setToastMessage("Data nilai siswa berhasil disinkronkan langsung dari basis data Supabase.");
          setTimeout(() => setToastMessage(null), 3500);
        }
      }
    } catch (err) {
      console.warn("Gagal sinkronisasi:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    handleSyncSupabase();
  }, []);

  // Buka Modal Edit
  const openEditModal = (row: NilaiRow) => {
    setSelectedRow(row);
    setInputTugas(row.nilaiTugas);
    setInputKuis(row.nilaiKuis);
    setInputUts(row.nilaiUts);
    setInputUas(row.nilaiUas);
    setInputCatatan(row.catatanGuru || "");
    setEditModalOpen(true);
  };

  // Simpan Perubahan Nilai (Otomatis Hitung Nilai Akhir & Sinkron ke Supabase)
  const handleSaveNilai = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRow) return;

    // Bobot Kurikulum Merdeka: Tugas 30%, Kuis 20%, UTS 25%, UAS 25%
    const calculatedFinal = Math.round(
      inputTugas * 0.3 + inputKuis * 0.2 + inputUts * 0.25 + inputUas * 0.25
    );

    const predikatStr =
      calculatedFinal >= 90
        ? "A (Amat Baik)"
        : calculatedFinal >= 80
        ? "B (Baik)"
        : calculatedFinal >= 75
        ? "C (Cukup)"
        : "D (Kurang)";

    const statusKetuntasan: "TUNTAS" | "REMIDIAL" =
      calculatedFinal >= 75 ? "TUNTAS" : "REMIDIAL";

    const updatedRow: NilaiRow = {
      ...selectedRow,
      nilaiTugas: inputTugas,
      nilaiKuis: inputKuis,
      nilaiUts: inputUts,
      nilaiUas: inputUas,
      nilaiAkhir: calculatedFinal,
      predikat: predikatStr,
      statusKetuntasan,
      catatanGuru: inputCatatan,
      terakhirDiperbarui: "Baru Saja (" + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB)",
    };

    // Update state lokal
    setDataNilai(dataNilai.map((r) => (r.id === selectedRow.id ? updatedRow : r)));
    setEditModalOpen(false);

    // Kirim perubahan ke API Supabase
    try {
      await fetch("/api/guru/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_NILAI", payload: updatedRow }),
      });
      setToastMessage(`Nilai untuk ${updatedRow.nama} berhasil diperbarui dan tersimpan di Supabase.`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.warn("Gagal update ke Supabase:", err);
    }
  };

  // Ekspor Data Nilai ke CSV
  const handleExportCSV = () => {
    const headers = [
      "NISN",
      "Nama Siswa",
      "Kelas",
      "Mata Pelajaran",
      "Tugas (30%)",
      "Kuis (20%)",
      "UTS (25%)",
      "UAS (25%)",
      "Nilai Akhir",
      "Predikat",
      "Status Ketuntasan",
    ];

    const rows = filteredData.map((r) => [
      r.nisn,
      `"${r.nama}"`,
      r.kelas,
      `"${r.mapel}"`,
      r.nilaiTugas,
      r.nilaiKuis,
      r.nilaiUts,
      r.nilaiUas,
      r.nilaiAkhir,
      `"${r.predikat}"`,
      r.statusKetuntasan,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Nilai_SMAN2_Buay_Bahuga_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage("Rekapitulasi nilai berhasil diekspor ke format CSV.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter Data
  const filteredData = useMemo(() => {
    return dataNilai.filter((item) => {
      const matchSearch =
        !searchQuery.trim() ||
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nisn.includes(searchQuery.trim());

      const matchKelas = selectedKelas === "ALL" || item.kelas === selectedKelas;
      const matchStatus = selectedStatus === "ALL" || item.statusKetuntasan === selectedStatus;

      return matchSearch && matchKelas && matchStatus;
    });
  }, [dataNilai, searchQuery, selectedKelas, selectedStatus]);

  // Statistik Akademik
  const totalSiswa = filteredData.length;
  const tuntasCount = filteredData.filter((r) => r.statusKetuntasan === "TUNTAS").length;
  const persentaseTuntas = totalSiswa > 0 ? Math.round((tuntasCount / totalSiswa) * 100) : 100;
  const rataRataNilai = totalSiswa > 0
    ? (filteredData.reduce((acc, r) => acc + r.nilaiAkhir, 0) / totalSiswa).toFixed(1)
    : "0";

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

      {/* Header Halaman & Aksi Sinkronisasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5 text-[#2A2C5E]" />
            <span>Standar Penilaian Kurikulum Merdeka SMAN 2 Buay Bahuga</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Rekapitulasi Nilai Akademik Siswa
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Audit dan pengelolaan nilai tugas mandiri, formatif, UTS, dan UAS siswa yang tersinkronkan dengan database Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Tombol Sinkronkan Supabase */}
          <button
            type="button"
            onClick={handleSyncSupabase}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#2A2C5E] ${isSyncing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Sinkronkan Supabase</span>
            <span className="sm:hidden">Sinkron</span>
          </button>

          {/* Tombol Ekspor CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Kartu Metrik Akademik (2 Kolom di Mobile, 4 di Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Rata-rata Nilai Kelas
          </span>
          <p className="text-xs sm:text-base font-bold text-gray-900 truncate">
            {rataRataNilai} (Predikat A-)
          </p>
          <p className="text-[10px] text-gray-500 truncate">Bobot Kumulatif Semester</p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Ketuntasan KKTP (&ge; 75)
          </span>
          <p className="text-xs sm:text-base font-bold text-emerald-700 truncate">
            {persentaseTuntas}% Tuntas
          </p>
          <p className="text-[10px] text-gray-500 truncate">{tuntasCount} dari {totalSiswa} Siswa</p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Total Siswa Terdata
          </span>
          <p className="text-xs sm:text-base font-bold text-[#2A2C5E] truncate">
            {totalSiswa} Siswa
          </p>
          <p className="text-[10px] text-gray-500 truncate">Rombel Binaan Aktif</p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Status Database
          </span>
          <p className="text-xs sm:text-base font-bold text-emerald-700 truncate flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            Supabase Sinkron
          </p>
          <p className="text-[10px] text-gray-500 truncate">{lastSynced}</p>
        </div>
      </div>

      {/* Bar Pencarian & Filter Kelas */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa atau NISN..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">Semua Kelas</option>
            <option value="XII MIPA 1">XII MIPA 1</option>
            <option value="XII MIPA 2">XII MIPA 2</option>
            <option value="XI IPS 1">XI IPS 1</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">Semua Ketuntasan</option>
            <option value="TUNTAS">Tuntas KKTP (&ge; 75)</option>
            <option value="REMIDIAL">Perlu Remidial (&lt; 75)</option>
          </select>
        </div>
      </div>

      {/* Tabel Rekapitulasi Nilai Profesional */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-4">Nama Siswa / NISN</th>
                <th className="py-3 px-3">Kelas</th>
                <th className="py-3 px-3 text-center">Tugas (30%)</th>
                <th className="py-3 px-3 text-center">Kuis (20%)</th>
                <th className="py-3 px-3 text-center">UTS (25%)</th>
                <th className="py-3 px-3 text-center">UAS (25%)</th>
                <th className="py-3 px-3 text-center">Nilai Akhir</th>
                <th className="py-3 px-3 text-center">Ketuntasan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400">
                    Tidak ada catatan nilai yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">{row.nama}</div>
                      <div className="text-[11px] text-gray-400">NISN: {row.nisn}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-gray-700">{row.kelas}</span>
                      <div className="text-[10px] text-gray-400 truncate max-w-[120px]">
                        {row.mapelKode}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-medium">
                      {row.nilaiTugas}
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-medium">
                      {row.nilaiKuis}
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-medium">
                      {row.nilaiUts}
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-medium">
                      {row.nilaiUas}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="text-sm font-bold text-[#2A2C5E] font-mono">
                        {row.nilaiAkhir}
                      </span>
                      <div className="text-[10px] text-gray-500 font-semibold">
                        {row.predikat.split(" ")[0]}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          row.statusKetuntasan === "TUNTAS"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {row.statusKetuntasan === "TUNTAS" ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                        )}
                        <span>{row.statusKetuntasan}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEditModal(row)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#2A2C5E] bg-blue-50 hover:bg-[#2A2C5E] hover:text-white rounded-md transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL EDIT NILAI SISWA (SINKRONISASI KE SUPABASE) */}
      {/* ============================================================== */}
      {editModalOpen && selectedRow && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 text-[#2A2C5E] rounded-lg">
                  <Award className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Input & Edit Nilai Siswa
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {selectedRow.nama} &bull; {selectedRow.kelas}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNilai} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Nilai Tugas Mandiri (30%):
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={inputTugas}
                    onChange={(e) => setInputTugas(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono font-bold text-[#2A2C5E] focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Nilai Kuis Formatif (20%):
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={inputKuis}
                    onChange={(e) => setInputKuis(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono font-bold text-[#2A2C5E] focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Nilai Asesmen UTS (25%):
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={inputUts}
                    onChange={(e) => setInputUts(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono font-bold text-[#2A2C5E] focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Nilai Asesmen UAS (25%):
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={inputUas}
                    onChange={(e) => setInputUas(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono font-bold text-[#2A2C5E] focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                    required
                  />
                </div>
              </div>

              {/* Pratinjau Nilai Akhir Otomatis */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                <span className="font-semibold text-gray-600">Simulasi Nilai Akhir:</span>
                <span className="text-base font-extrabold text-[#2A2C5E] font-mono">
                  {Math.round(inputTugas * 0.3 + inputKuis * 0.2 + inputUts * 0.25 + inputUas * 0.25)}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Catatan Evaluasi Guru:
                </label>
                <textarea
                  value={inputCatatan}
                  onChange={(e) => setInputCatatan(e.target.value)}
                  placeholder="Berikan catatan capaian kompetensi siswa untuk rapor..."
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                />
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan ke Supabase</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
