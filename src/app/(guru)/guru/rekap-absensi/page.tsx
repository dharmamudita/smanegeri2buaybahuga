"use client";

import { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { MOCK_PRESENSI } from "@/lib/mockData";
import { PresensiRecord } from "@/lib/types";

// Tambahan record resmi demonstrasi agar lengkap Hadir, Terlambat, Izin, Sakit
const DEMO_PRESENSI_DATA: (PresensiRecord & { lampiranUrl?: string })[] = [
  ...MOCK_PRESENSI,
  {
    id: "pres-5",
    siswaId: "siswa-5",
    siswaNama: "Citra Dewi",
    nisn: "0081234571",
    kelas: "XII MIPA 1",
    tanggal: "27 Oktober 2026",
    waktu: "06:58:20 WIB",
    status: "HADIR",
    jarakMeter: 14,
    latitude: -4.323910,
    longitude: 104.560905,
    keterangan: "Tepat Waktu (Hadir Fisik di Lingkungan Sekolah)",
  },
  {
    id: "pres-6",
    siswaId: "siswa-6",
    siswaNama: "Bagas Saputra",
    nisn: "0081234570",
    kelas: "XII MIPA 1",
    tanggal: "27 Oktober 2026",
    waktu: "07:05:12 WIB",
    status: "SAKIT",
    jarakMeter: 0,
    latitude: 0,
    longitude: 0,
    keterangan: "Demam dan flu, istirahat dokter [Surat Keterangan Dokter Terlampir]",
    lampiranUrl: "Surat_Dokter_Bagas_Saputra_27Okt2026.pdf",
  },
];

export default function GuruRekapAbsensiPage() {
  const [dataPresensi, setDataPresensi] = useState<(PresensiRecord & { lampiranUrl?: string })[]>(
    DEMO_PRESENSI_DATA
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // State Sinkronisasi Supabase
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState("Hari Ini, 07:45 WIB");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State Modal Pratinjau Surat Izin/Sakit
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<(PresensiRecord & { lampiranUrl?: string }) | null>(null);

  // Sinkronisasi data presensi dari Supabase
  const handleSyncSupabase = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/guru/sync");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.presensiList) {
          setDataPresensi(json.data.presensiList);
          setLastSynced(json.syncedAt || "Baru saja");
          setToastMessage("Data absensi siswa berhasil disinkronkan langsung dari basis data Supabase.");
          setTimeout(() => setToastMessage(null), 3500);
        }
      }
    } catch (err) {
      console.warn("Gagal sinkronisasi presensi:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    handleSyncSupabase();
  }, []);

  // Ekspor Data Presensi ke CSV
  const handleExportCSV = () => {
    const headers = [
      "Tanggal",
      "Waktu",
      "Nama Siswa",
      "NISN",
      "Kelas",
      "Status",
      "Keterangan Validasi",
    ];

    const rows = filteredData.map((r) => [
      r.tanggal,
      r.waktu,
      `"${r.siswaNama}"`,
      r.nisn,
      r.kelas,
      r.status,
      `"${r.keterangan || "-"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Presensi_SMAN2_Buay_Bahuga_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage("Data rekapitulasi absensi berhasil diekspor ke file CSV.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Verifikasi Surat Izin / Sakit
  const handleVerifyLeave = async (rec: PresensiRecord & { lampiranUrl?: string }) => {
    try {
      await fetch("/api/guru/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "VERIFIKASI_PRESENSI", payload: rec }),
      });
      setToastMessage(`Surat keterangan untuk ${rec.siswaNama} telah diverifikasi dan disahkan.`);
      setPreviewModalOpen(false);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.warn("Gagal verifikasi ke Supabase:", err);
    }
  };

  // Filter Data
  const filteredData = useMemo(() => {
    return dataPresensi.filter((item) => {
      const matchSearch =
        !searchQuery.trim() ||
        item.siswaNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nisn.includes(searchQuery.trim());

      const matchKelas = selectedKelas === "ALL" || item.kelas === selectedKelas;
      const matchStatus = selectedStatus === "ALL" || item.status === selectedStatus;

      return matchSearch && matchKelas && matchStatus;
    });
  }, [dataPresensi, searchQuery, selectedKelas, selectedStatus]);

  // Statistik Presensi
  const totalCatatan = filteredData.length;
  const hadirCount = filteredData.filter((r) => r.status === "HADIR").length;
  const izinCount = filteredData.filter((r) => r.status === "IZIN").length;
  const sakitCount = filteredData.filter((r) => r.status === "SAKIT").length;
  const persentaseHadir = totalCatatan > 0 ? Math.round((hadirCount / totalCatatan) * 100) : 100;

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
            <Clock className="w-3.5 h-3.5 text-[#2A2C5E]" />
            <span>Audit & Pemantauan Kehadiran SMAN 2 Buay Bahuga</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Rekapitulasi Absensi Siswa
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Pantau kehadiran harian siswa, verifikasi surat izin atau sakit, dan pantau log kehadiran yang tersinkronkan dengan Supabase.
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

      {/* 4 Kartu Metrik Kehadiran (2 Kolom di Mobile, 4 di Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Tingkat Kehadiran
          </span>
          <p className="text-xs sm:text-base font-bold text-emerald-700 truncate">
            {persentaseHadir}% Sangat Baik
          </p>
          <p className="text-[10px] text-gray-500 truncate">{hadirCount} dari {totalCatatan} Siswa Terdata</p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Hadir Fisik di Sekolah
          </span>
          <p className="text-xs sm:text-base font-bold text-gray-900 truncate">
            {hadirCount} Peserta Didik
          </p>
          <p className="text-[10px] text-gray-500 truncate">Terverifikasi di Area Sekolah</p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Izin & Sakit Terlampir
          </span>
          <p className="text-xs sm:text-base font-bold text-amber-700 truncate">
            {izinCount} Izin &bull; {sakitCount} Sakit
          </p>
          <p className="text-[10px] text-gray-500 truncate">Dengan Surat Keterangan</p>
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
            <option value="XI IPS 2">XI IPS 2</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            <option value="HADIR">Hadir</option>
            <option value="TERLAMBAT">Terlambat</option>
            <option value="IZIN">Izin</option>
            <option value="SAKIT">Sakit</option>
          </select>
        </div>
      </div>

      {/* Tabel Audit Presensi Siswa */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-4">Tanggal & Waktu</th>
                <th className="py-3 px-4">Nama Siswa / NISN</th>
                <th className="py-3 px-3">Kelas</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4">Keterangan / Validasi</th>
                <th className="py-3 px-4 text-right">Lampiran & Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Tidak ada catatan presensi yang cocok dengan kriteria.
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => {
                  const isHadir = row.status === "HADIR";
                  const isTerlambat = row.status === "TERLAMBAT";
                  const isIzin = row.status === "IZIN";
                  const isSakit = row.status === "SAKIT";

                  return (
                    <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">{row.tanggal}</div>
                        <div className="text-[11px] text-gray-400 font-mono">{row.waktu}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">{row.siswaNama}</div>
                        <div className="text-[11px] text-gray-400">NISN: {row.nisn}</div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-gray-700">{row.kelas}</span>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isHadir
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : isTerlambat
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : isIzin
                              ? "bg-blue-50 text-[#2A2C5E] border border-blue-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {isHadir ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span>{row.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-xs text-gray-700 line-clamp-2">
                          {row.keterangan || "Presensi Terverifikasi"}
                        </p>
                        {row.jarakMeter && row.jarakMeter > 0 ? (
                          <span className="text-[10px] text-gray-400">
                            Validasi Area Sekolah SMAN 2 Buay Bahuga
                          </span>
                        ) : null}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isIzin || isSakit ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRecord(row);
                              setPreviewModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#2A2C5E] bg-blue-50 hover:bg-[#2A2C5E] hover:text-white rounded-md transition-colors cursor-pointer"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Lihat Surat</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Sah</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL PRATINJAU SURAT KETERANGAN IZIN / SAKIT */}
      {/* ============================================================== */}
      {previewModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 text-[#2A2C5E] rounded-lg">
                  <FileText className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Verifikasi Surat Keterangan {selectedRecord.status}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {selectedRecord.siswaNama} &bull; {selectedRecord.kelas} (NISN: {selectedRecord.nisn})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <div className="font-semibold text-gray-500">Tanggal Diajukan:</div>
                <div className="font-bold text-gray-900">{selectedRecord.tanggal} &bull; {selectedRecord.waktu}</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <div className="font-semibold text-gray-500">Alasan / Diagnosis:</div>
                <div className="text-gray-800 leading-relaxed font-medium">
                  {selectedRecord.keterangan}
                </div>
              </div>

              {/* Simulasi Pratinjau Dokumen Lampiran */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#2A2C5E]" />
                    <span className="font-bold text-[#2A2C5E]">
                      {selectedRecord.lampiranUrl || `Surat_Izin_${selectedRecord.siswaNama.replace(/\s+/g, "_")}.pdf`}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500">Dokumen Digital Terverifikasi</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Surat keterangan resmi dari orang tua / surat diagnosis dokter telah diunggah melalui formulir presensi siswa SMAN 2 Buay Bahuga.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => handleVerifyLeave(selectedRecord)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sahkan & Verifikasi ke Supabase</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
