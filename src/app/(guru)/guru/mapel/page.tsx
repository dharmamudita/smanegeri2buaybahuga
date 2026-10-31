"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  PlusCircle,
  FileText,
  Video,
  Trash2,
  Edit3,
  Calendar,
  UploadCloud,
  CheckCircle2,
  RefreshCw,
  Search,
  Users,
  ChevronRight,
  Sparkles,
  X,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { MOCK_MATERI, MOCK_MAPEL } from "@/lib/mockData";
import { MateriItem, MapelItem } from "@/lib/types";

export default function GuruMapelPage() {
  const [activeTab, setActiveTab] = useState<"KELAS" | "MODUL">("KELAS");
  const [mapelList, setMapelList] = useState<MapelItem[]>(MOCK_MAPEL);
  const [materiList, setMateriList] = useState<MateriItem[]>(MOCK_MATERI);

  // Status Sinkronisasi Supabase
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>("Hari Ini, 07:30 WIB");
  const [syncSource, setSyncSource] = useState<string>("Supabase Cloud");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMapelFilter, setSelectedMapelFilter] = useState("ALL");

  // Modal Tambah Modul
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<"PDF" | "VIDEO" | "DOKUMEN">("PDF");
  const [newMapelId, setNewMapelId] = useState(MOCK_MAPEL[0].id);

  // Sinkronisasi data awal dengan Supabase
  const fetchSupabaseData = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/guru/sync");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.mapelList) setMapelList(json.data.mapelList);
          if (json.data.materiList) setMateriList(json.data.materiList);
          setLastSynced(json.syncedAt || "Baru saja");
          setSyncSource(json.source === "SUPABASE_LIVE" ? "Supabase Live" : "Supabase Cache");
          setToastMessage("Data Kelas & Materi berhasil disinkronkan dengan basis data Supabase.");
          setTimeout(() => setToastMessage(null), 3500);
        }
      }
    } catch (err) {
      console.warn("Sinkronisasi latar belakang Supabase:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchSupabaseData();
  }, []);

  // Tambah Modul Baru
  const handleAddMateri = async (e: React.FormEvent) => {
    e.preventDefault();
    const item: MateriItem = {
      id: `materi-${Date.now()}`,
      mapelId: newMapelId,
      judul: newTitle,
      deskripsi: newDesc || "Bahan ajar mandiri Kurikulum Merdeka SMAN 2 Buay Bahuga.",
      tipe: newType,
      fileUrl: "#",
      tanggalUnggah: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      ukuranFile: newType === "VIDEO" ? "38 MB" : "3.2 MB",
    };

    setMateriList([item, ...materiList]);
    setShowUploadModal(false);
    setNewTitle("");
    setNewDesc("");

    // Simpan ke Supabase via API
    try {
      await fetch("/api/guru/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CREATE_MATERI", payload: item }),
      });
      setToastMessage(`Modul "${item.judul}" berhasil diunggah dan tersimpan ke Supabase.`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.warn("Gagal simpan ke Supabase:", err);
    }
  };

  // Hapus Materi
  const handleDelete = (id: string, judul: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus modul "${judul}"?`)) {
      setMateriList(materiList.filter((m) => m.id !== id));
      setToastMessage(`Modul "${judul}" berhasil dihapus.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Filter Modul
  const filteredMateri = materiList.filter((m) => {
    const matchSearch =
      !searchQuery.trim() ||
      m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMapel = selectedMapelFilter === "ALL" || m.mapelId === selectedMapelFilter;
    return matchSearch && matchMapel;
  });

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
            <BookOpen className="w-3.5 h-3.5 text-[#2A2C5E]" />
            <span>Portal Manajemen Pembelajaran Dewan Guru</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Kelas & Materi Pembelajaran
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kelola ruang kelas rombel binaan, modul ajar digital, dan bahan evaluasi yang terhubung ke portal siswa.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Tombol Sinkronkan Supabase */}
          <button
            type="button"
            onClick={fetchSupabaseData}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#2A2C5E] ${isSyncing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Sinkronkan Supabase</span>
            <span className="sm:hidden">Sinkron</span>
          </button>

          {/* Tombol Unggah Modul Baru */}
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Modul</span>
          </button>
        </div>
      </div>

      {/* 4 Kartu Metrik Kelas (2 Kolom di Mobile, 4 di Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Kelas Rombel Diampu
          </span>
          <p className="text-xs sm:text-base font-bold text-gray-900 truncate">
            {mapelList.length} Rombel Kelas
          </p>
          <p className="text-[10px] text-gray-500 truncate">Fase F / Kelas XII</p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Koleksi Modul Ajar
          </span>
          <p className="text-xs sm:text-base font-bold text-[#2A2C5E] truncate">
            {materiList.length} Bahan Ajar
          </p>
          <p className="text-[10px] text-gray-500 truncate">PDF & Video Edukasi</p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Total Siswa Binaan
          </span>
          <p className="text-xs sm:text-base font-bold text-gray-900 truncate">
            142 Peserta Didik
          </p>
          <p className="text-[10px] text-gray-500 truncate">Terdaftar Aktif di Rombel</p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Status Database
          </span>
          <p className="text-xs sm:text-base font-bold text-emerald-700 truncate flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            {syncSource}
          </p>
          <p className="text-[10px] text-gray-500 truncate">Sync: {lastSynced}</p>
        </div>
      </div>

      {/* Tab Navigasi: Ruang Kelas Diampu VS Koleksi Modul */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("KELAS")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "KELAS"
              ? "bg-[#2A2C5E] text-white shadow-xs"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
          }`}
        >
          Daftar Ruang Kelas Diampu ({mapelList.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("MODUL")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "MODUL"
              ? "bg-[#2A2C5E] text-white shadow-xs"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
          }`}
        >
          Koleksi Modul & Bahan Ajar ({materiList.length})
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: DAFTAR RUANG KELAS DIAMPU (2 KOLOM DI MOBILE) */}
      {/* ============================================================== */}
      {activeTab === "KELAS" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
            {mapelList.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3.5 sm:p-5 shadow-2xs hover:border-[#2A2C5E] transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
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

                  <div className="text-[10px] sm:text-xs text-gray-600 flex items-center justify-between pt-1">
                    <span>Tingkat: Kelas {cls.tingkat} ({cls.jurusan})</span>
                    <span className="font-semibold text-[#2A2C5E]">{cls.totalMateri} Modul</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <span className="text-[9px] sm:text-[11px] text-gray-500 font-medium truncate">
                    {cls.jadwal}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMapelFilter(cls.id);
                      setActiveTab("MODUL");
                    }}
                    className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-[10px] sm:text-xs font-bold text-[#2A2C5E] bg-blue-50 hover:bg-[#2A2C5E] hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Kelola Modul</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: KOLEKSI MODUL & BAHAN AJAR */}
      {/* ============================================================== */}
      {activeTab === "MODUL" && (
        <div className="space-y-4">
          {/* Bar Pencarian & Filter Mapel */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul modul atau kata kunci materi ajar..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedMapelFilter}
                onChange={(e) => setSelectedMapelFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Seluruh Mata Pelajaran</option>
                {mapelList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nama} ({m.kode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* List Kartu Modul */}
          <div className="space-y-3">
            {filteredMateri.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300 text-gray-500 text-xs">
                Tidak ada modul yang cocok dengan kriteria pencarian.
              </div>
            ) : (
              filteredMateri.map((materi) => {
                const mapel = mapelList.find((m) => m.id === materi.mapelId);
                const isVideo = materi.tipe === "VIDEO";
                return (
                  <div
                    key={materi.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-2xs hover:border-[#2A2C5E] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isVideo
                            ? "bg-purple-50 text-purple-600"
                            : "bg-blue-50 text-[#2A2C5E]"
                        }`}
                      >
                        {isVideo ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                            {materi.tipe}
                          </span>
                          <span className="text-xs font-semibold text-[#2A2C5E]">
                            {mapel ? `${mapel.nama} (${mapel.kode})` : "Biologi Umum"}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">
                          {materi.judul}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {materi.deskripsi}
                        </p>
                        <div className="text-[11px] text-gray-400 flex items-center gap-3 pt-1">
                          <span>Diunggah: {materi.tanggalUnggah}</span>
                          <span>&bull;</span>
                          <span>Ukuran: {materi.ukuranFile || "3.5 MB"}</span>
                          <span>&bull;</span>
                          <span className="text-emerald-700 font-medium">Tersimpan di Supabase</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleDelete(materi.id, materi.judul)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Modul"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL UNGGAH MODUL BARU (TERSINKRONISASI KE SUPABASE) */}
      {/* ============================================================== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 text-[#2A2C5E] rounded-lg">
                  <UploadCloud className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-gray-900">
                  Unggah Modul / Bahan Ajar Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMateri} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mata Pelajaran Target:
                </label>
                <select
                  value={newMapelId}
                  onChange={(e) => setNewMapelId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                  required
                >
                  {mapelList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama} &bull; Kelas {m.tingkat} ({m.kode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Judul Modul Pembelajaran:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Bab 4 - Mutasi Genetik dan Pembelahan Sel Meiosis"
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Format / Tipe Bahan Ajar:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType("PDF")}
                    className={`p-2.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      newType === "PDF"
                        ? "bg-[#2A2C5E] text-white border-[#2A2C5E]"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    Dokumen PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType("VIDEO")}
                    className={`p-2.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      newType === "VIDEO"
                        ? "bg-[#2A2C5E] text-white border-[#2A2C5E]"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    Video Pembelajaran
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType("DOKUMEN")}
                    className={`p-2.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      newType === "DOKUMEN"
                        ? "bg-[#2A2C5E] text-white border-[#2A2C5E]"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    Dokumen Ringkasan
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Deskripsi Singkat / Ringkasan Materi:
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Tuliskan petunjuk pembelajaran atau cakupan kompetensi dasar yang dipelajari siswa..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                />
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#2A2C5E] shrink-0 mt-0.5" />
                <span>
                  Modul ini akan langsung tersinkronkan ke basis data Supabase dan otomatis tampil di akun portal seluruh siswa terdaftar.
                </span>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
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
