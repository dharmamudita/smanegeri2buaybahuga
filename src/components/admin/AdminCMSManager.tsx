"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  Building2,
  BookOpen,
  Trophy,
  FileText,
  Save,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Video,
  Users,
  Calendar,
  Layers,
  GraduationCap,
  Sparkles,
  RotateCcw,
  Clock,
  MapPin,
  X,
  Search,
  UploadCloud,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { useCMSStore } from "@/lib/cmsStore";
import { useBeritaStore } from "@/lib/store";
import PaginationBar from "@/components/common/PaginationBar";
import ImageCropUploadModal from "@/components/common/ImageCropUploadModal";

type CMSTab = "BERANDA" | "PROFIL" | "AKADEMIK" | "KESISWAAN" | "INFORMASI";

export default function AdminCMSManager() {
  const [activeTab, setActiveTab] = useState<CMSTab>("BERANDA");
  const [notification, setNotification] = useState<string | null>(null);

  const {
    beranda,
    profil,
    akademik,
    kesiswaan,
    updateBerandaInfo,
    updateKepsek,
    updateStatistik,
    addVideoPanduan,
    updateVideoPanduan,
    deleteVideoPanduan,
    updateProfilVisiMisi,
    addStrukturOrganisasi,
    updateStrukturOrganisasi,
    deleteStrukturOrganisasi,
    addGuruStaff,
    updateGuruStaff,
    deleteGuruStaff,
    addAgendaKalender,
    updateAgendaKalender,
    deleteAgendaKalender,
    addJadwalUjian,
    updateJadwalUjian,
    deleteJadwalUjian,
    addSlotPelajaran,
    updateSlotPelajaran,
    deleteSlotPelajaran,
    addPrestasi,
    updatePrestasi,
    deletePrestasi,
    updateOsis,
    addEkskul,
    updateEkskul,
    deleteEkskul,
    resetAllToDefault,
    fetchFromSupabase,
    isLoading: isCMSLoading,
    lastSavedAt,
  } = useCMSStore();

  const { beritaList, addBerita, updateBerita, deleteBerita, fetchBerita } = useBeritaStore();

  useEffect(() => {
    fetchFromSupabase();
    fetchBerita();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Image Cropper Modal State
  const [cropModalConfig, setCropModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    aspectRatio: "1:1" | "4:3" | "16:9" | "free";
    onSuccess: (url: string) => void;
  }>({
    isOpen: false,
    title: "",
    aspectRatio: "1:1",
    onSuccess: () => {},
  });

  const openCropper = (
    title: string,
    aspectRatio: "1:1" | "4:3" | "16:9" | "free",
    callback: (url: string) => void
  ) => {
    setCropModalConfig({
      isOpen: true,
      title,
      aspectRatio,
      onSuccess: (url) => {
        callback(url);
        showToast("Foto berhasil dipotong dan tersimpan di Cloudinary!");
      },
    });
  };

  // Pagination States (3 kotak per halaman untuk video/org/ekskul/prestasi, 6 untuk agenda/guru, 10 untuk berita)
  const [pageVideo, setPageVideo] = useState(1);
  const [pageOrg, setPageOrg] = useState(1);
  const [pageGuru, setPageGuru] = useState(1);
  const [pageAgenda, setPageAgenda] = useState(1);
  const [pageKbm, setPageKbm] = useState(1);
  const [pageUjian, setPageUjian] = useState(1);
  const [pagePrestasi, setPagePrestasi] = useState(1);
  const [pageEkskul, setPageEkskul] = useState(1);
  const [pageBerita, setPageBerita] = useState(1);

  // Jadwal Pelajaran (KBM) State
  const [selectedKbmKelas, setSelectedKbmKelas] = useState("XII MIPA 1");
  const [selectedKbmHari, setSelectedKbmHari] = useState("SEMUA");
  const [showAddKbm, setShowAddKbm] = useState(false);
  const [kbmForm, setKbmForm] = useState({
    kelas: "XII MIPA 1",
    hari: "Senin" as const,
    jamKe: "1 - 2",
    waktu: "07:15 - 08:45",
    mapel: "",
    guru: "",
    ruang: "R.12 MIPA 1",
    tipe: "KBM" as const,
  });

  const [editingItem, setEditingItem] = useState<{
    type: "VIDEO" | "ORG" | "GURU" | "AGENDA" | "UJIAN" | "PRESTASI" | "EKSKUL" | "KBM" | "BERITA";
    id: string;
    data: any;
  } | null>(null);

  const handleSaveEdit = () => {
    if (!editingItem) return;
    const { type, id, data } = editingItem;
    if (type === "VIDEO") updateVideoPanduan(id, data);
    else if (type === "ORG") updateStrukturOrganisasi(id, data);
    else if (type === "GURU") updateGuruStaff(id, data);
    else if (type === "AGENDA") updateAgendaKalender(id, data);
    else if (type === "UJIAN") updateJadwalUjian(id, data);
    else if (type === "PRESTASI") updatePrestasi(id, data);
    else if (type === "EKSKUL") updateEkskul(id, data);
    else if (type === "KBM") updateSlotPelajaran(id, data);
    else if (type === "BERITA") updateBerita(id, data);

    setEditingItem(null);
    showToast("Perubahan data berhasil disimpan dan langsung tayang!");
  };

  // --- Form States for Quick Adds ---
  // Video Beranda
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [videoForm, setVideoForm] = useState({
    judul: "",
    kategori: "Panduan Sekolah",
    durasi: "4 Menit",
    ringkasan: "",
    youtubeUrl: "https://www.youtube.com",
    highlight: "Video Panduan",
  });

  // Guru / Staf
  const [showAddGuru, setShowAddGuru] = useState(false);
  const [guruForm, setGuruForm] = useState({
    nama: "",
    nuptk: "",
    mapel: "",
    email: "",
    pendidikan: "S1 Pendidikan",
    fotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    role: "GURU" as const,
  });

  // Struktur Organisasi
  const [showAddOrg, setShowAddOrg] = useState(false);
  const [orgForm, setOrgForm] = useState({
    jabatan: "",
    nama: "",
    nip: "",
    pangkat: "Guru Ahli Muda",
    keterangan: "",
    fotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
  });

  // Agenda Kalender
  const [showAddAgenda, setShowAddAgenda] = useState(false);
  const [agendaForm, setAgendaForm] = useState({
    tanggal: "",
    bulanSingkat: "Jan",
    kegiatan: "",
    kategori: "AKADEMIK" as const,
    keterangan: "",
    semester: "GANJIL" as const,
  });

  // Jadwal Ujian
  const [showAddUjian, setShowAddUjian] = useState(false);
  const [ujianForm, setUjianForm] = useState({
    hariTanggal: "",
    sesi: "Sesi 1 (07.30 - 09.30)",
    waktu: "07.30 - 09.30 WIB",
    mataPelajaran: "",
    tingkatLabel: "Kelas X, XI, XII",
    ruangModa: "28 Ruang Kelas & CBT Lab",
    koordinator: "",
  });

  // Prestasi Siswa
  const [showAddPrestasi, setShowAddPrestasi] = useState(false);
  const [prestasiForm, setPrestasiForm] = useState({
    judul: "",
    juara: "Juara 1",
    tingkat: "Tingkat Kabupaten Way Kanan",
    bidang: "Akademik & Sains",
    tahun: "2026",
    penyelenggara: "Dinas Pendidikan",
    peraih: "",
    deskripsi: "",
    fotoUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80",
  });

  // Ekskul
  const [showAddEkskul, setShowAddEkskul] = useState(false);
  const [ekskulForm, setEkskulForm] = useState({
    nama: "",
    kategori: "Pengembangan Bakat",
    pembina: "",
    jadwal: "Sabtu, 15.30 - 17.00 WIB",
    lokasi: "Lingkungan SMAN 2 Buay Bahuga",
    deskripsi: "",
    prestasiUnggulan: "",
  });

  // Quick Berita
  const [beritaForm, setBeritaForm] = useState({
    judul: "",
    kategori: "PENGUMUMAN" as const,
    ringkasan: "",
    konten: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80",
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#2A2C5E] text-white rounded-xl shadow-xl border border-blue-400/40 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* CMS Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#2A2C5E] to-[#1F2147] text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1F2147]">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/15 text-blue-100 text-[11px] font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Pusat Pengelolaan Konten Website (CMS Portal Sekolah)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 text-[11px] font-medium border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Basis Data Supabase Aktif</span>
            </div>
            {lastSavedAt && (
              <span className="text-[11px] text-blue-200/80">
                Tersimpan: {lastSavedAt}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Kelola Halaman Publik SMAN 2 Buay Bahuga
          </h2>
          <p className="text-xs text-blue-100/90 leading-relaxed">
            Perbarui data beranda, struktur profil kepsek/guru, jadwal kalender akademik, prestasi kesiswaan, dan ekskul. Semua perubahan otomatis tersimpan dan langsung tayang di portal publik.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              if (confirm("Kembalikan seluruh konten ke data standar resmi Dapodik?")) {
                resetAllToDefault();
                showToast("Data konten berhasil di-reset ke standar resmi Dapodik!");
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-blue-100 text-xs font-medium transition-all"
            title="Reset ke bawaan awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bawaan</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-[#2A2C5E] hover:bg-blue-50 text-xs font-bold shadow-xs transition-all"
          >
            <span>Lihat Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter Navigation Tabs */}
      <div className="bg-gray-50/80 px-4 sm:px-6 pt-3 border-b border-gray-200 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max pb-3">
          {[
            { key: "BERANDA" as CMSTab, label: "Edit Beranda", icon: Home },
            { key: "PROFIL" as CMSTab, label: "Halaman Profil", icon: Building2 },
            { key: "AKADEMIK" as CMSTab, label: "Akademik & Jadwal", icon: BookOpen },
            { key: "KESISWAAN" as CMSTab, label: "Kesiswaan & Ekskul", icon: Trophy },
            { key: "INFORMASI" as CMSTab, label: "Warta & Informasi", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#2A2C5E] text-white shadow-xs"
                    : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-200" : "text-gray-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 sm:p-8 space-y-8 bg-white">
        {/* ========================================================================= */}
        {/* TAB 1: EDIT BERANDA */}
        {/* ========================================================================= */}
        {activeTab === "BERANDA" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 1.1 Banner Tahun Ajaran & Semester (Sesuai Permintaan Spesifik) */}
            <div className="p-5 sm:p-6 rounded-xl border border-blue-200 bg-blue-50/40 space-y-4">
              <div className="flex items-center justify-between border-b border-blue-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Pengaturan Kartu Tahun Ajaran & Semester Aktif
                    </h3>
                    <p className="text-[11px] text-gray-600">
                      Teks yang tampil pada kartu biru kanan di sebelah hero section beranda
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => showToast("Perubahan Tahun Ajaran & Semester berhasil disimpan!")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A2C5E] text-white text-xs font-semibold hover:bg-[#1F2147] transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Label Tahun Ajaran
                  </label>
                  <input
                    type="text"
                    value={beranda.tahunAjaran}
                    onChange={(e) => updateBerandaInfo({ tahunAjaran: e.target.value })}
                    placeholder="Contoh: Tahun Ajaran 2026/2027"
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Label Semester
                  </label>
                  <input
                    type="text"
                    value={beranda.semester}
                    onChange={(e) => updateBerandaInfo({ semester: e.target.value })}
                    placeholder="Contoh: Semester Ganjil"
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Deskripsi Penyelenggaraan Pendidikan
                  </label>
                  <textarea
                    rows={2}
                    value={beranda.deskripsiSemester}
                    onChange={(e) => updateBerandaInfo({ deskripsiSemester: e.target.value })}
                    placeholder="Penyelenggaraan pendidikan bagi 983 peserta didik..."
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]"
                  />
                </div>
              </div>
            </div>

            {/* 1.2 Hero Headline & Subheadline */}
            <div className="p-5 sm:p-6 rounded-xl border border-gray-200 bg-gray-50/50 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Teks Headline Halaman Depan (Hero Section)
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Kalimat utama yang menyambut pengunjung saat membuka web pertama kali
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => showToast("Headline halaman depan berhasil diperbarui!")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A2C5E] text-white text-xs font-semibold hover:bg-[#1F2147] transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Badge Label Atas
                  </label>
                  <input
                    type="text"
                    value={beranda.heroBadge}
                    onChange={(e) => updateBerandaInfo({ heroBadge: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Judul Headline Utama
                  </label>
                  <input
                    type="text"
                    value={beranda.heroHeadline}
                    onChange={(e) => updateBerandaInfo({ heroHeadline: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Paragraf Deskripsi Singkat
                  </label>
                  <textarea
                    rows={3}
                    value={beranda.heroSubheadline}
                    onChange={(e) => updateBerandaInfo({ heroSubheadline: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]"
                  />
                </div>
              </div>
            </div>

            {/* 1.3 Statistik Peserta Didik Aktif & Dapodik */}
            <div className="p-5 sm:p-6 rounded-xl border border-gray-200 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Data Statistik Pokok Dapodik (4 Kartu Beranda)
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Ubah angka Peserta Didik Aktif, Rombel, Tenaga Pendidik, Ruang Kelas & Laboratorium
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => showToast("Angka statistik Dapodik berhasil disimpan!")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A2C5E] text-white text-xs font-semibold hover:bg-[#1F2147] transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Peserta Didik Aktif
                  </label>
                  <input
                    type="number"
                    value={beranda.statistik.totalSiswa}
                    onChange={(e) => updateStatistik({ totalSiswa: parseInt(e.target.value) || 0 })}
                    className="w-full text-base font-bold px-2.5 py-1.5 border border-gray-300 rounded-md bg-white"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Rombongan Belajar
                  </label>
                  <input
                    type="number"
                    value={beranda.statistik.totalRombel}
                    onChange={(e) => updateStatistik({ totalRombel: parseInt(e.target.value) || 0 })}
                    className="w-full text-base font-bold px-2.5 py-1.5 border border-gray-300 rounded-md bg-white"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Pendidik & Tendik
                  </label>
                  <input
                    type="number"
                    value={beranda.statistik.totalGuruTendik}
                    onChange={(e) => updateStatistik({ totalGuruTendik: parseInt(e.target.value) || 0 })}
                    className="w-full text-base font-bold px-2.5 py-1.5 border border-gray-300 rounded-md bg-white"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Ruang Kelas
                  </label>
                  <input
                    type="number"
                    value={beranda.statistik.ruangKelas}
                    onChange={(e) => updateStatistik({ ruangKelas: parseInt(e.target.value) || 0 })}
                    className="w-full text-base font-bold px-2.5 py-1.5 border border-gray-300 rounded-md bg-white"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Laboratorium
                  </label>
                  <input
                    type="number"
                    value={beranda.statistik.laboratorium}
                    onChange={(e) => updateStatistik({ laboratorium: parseInt(e.target.value) || 0 })}
                    className="w-full text-base font-bold px-2.5 py-1.5 border border-gray-300 rounded-md bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 1.4 Profil & Sambutan Kepala Sekolah */}
            <div className="p-5 sm:p-6 rounded-xl border border-gray-200 bg-gray-50/50 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Profil & Sambutan Resmi Kepala Sekolah
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Ubah foto profil (PP), nama, NIP, pangkat, dan isi sambutan Kepala Sekolah
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => showToast("Profil dan sambutan Kepala Sekolah berhasil disimpan!")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A2C5E] text-white text-xs font-semibold hover:bg-[#1F2147] transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 space-y-3">
                  <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 text-center">
                    <img
                      src={beranda.kepsek.fotoUrl}
                      alt={beranda.kepsek.nama}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border-2 border-[#2A2C5E] mb-3 shadow-xs"
                    />
                    <h4 className="text-xs font-bold text-gray-900">{beranda.kepsek.nama}</h4>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">{beranda.kepsek.nip}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Foto Profil Kepala Sekolah
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={beranda.kepsek.fotoUrl}
                        onChange={(e) => updateKepsek({ fotoUrl: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]"
                      />
                      <button
                        type="button"
                        onClick={() => openCropper("Foto Kepala Sekolah", "1:1", (url) => updateKepsek({ fotoUrl: url }))}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#2A2C5E] text-white text-xs font-semibold rounded-lg hover:bg-[#1F2147] transition-all shrink-0 cursor-pointer shadow-xs"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Unggah & Pas-kan</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Nama Lengkap Beserta Gelar
                      </label>
                      <input
                        type="text"
                        value={beranda.kepsek.nama}
                        onChange={(e) => updateKepsek({ nama: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Nomor Induk Pegawai (NIP)
                      </label>
                      <input
                        type="text"
                        value={beranda.kepsek.nip}
                        onChange={(e) => updateKepsek({ nip: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Pangkat & Golongan
                    </label>
                    <input
                      type="text"
                      value={beranda.kepsek.pangkat}
                      onChange={(e) => updateKepsek({ pangkat: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Teks Sambutan Kepala Sekolah
                    </label>
                    <textarea
                      rows={5}
                      value={beranda.kepsek.sambutan}
                      onChange={(e) => updateKepsek({ sambutan: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E] leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 1.5 Video Panduan YouTube */}
            <div className="p-5 sm:p-6 rounded-xl border border-gray-200 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center font-bold text-xs">
                    5
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Daftar Video Panduan YouTube di Beranda
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Kelola 3 kartu video tutorial resmi yang tampil di halaman depan
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddVideo(!showAddVideo)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Video</span>
                </button>
              </div>

              {/* Form Tambah Video */}
              {showAddVideo && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-emerald-900">
                    Form Tambah Video Panduan Baru
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Judul Video
                      </label>
                      <input
                        type="text"
                        value={videoForm.judul}
                        onChange={(e) => setVideoForm({ ...videoForm, judul: e.target.value })}
                        placeholder="Contoh: Tata Cara Pendaftaran PPDB"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Kategori / Label
                      </label>
                      <input
                        type="text"
                        value={videoForm.kategori}
                        onChange={(e) => setVideoForm({ ...videoForm, kategori: e.target.value })}
                        placeholder="Contoh: Panduan PPDB"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        URL YouTube
                      </label>
                      <input
                        type="text"
                        value={videoForm.youtubeUrl}
                        onChange={(e) => setVideoForm({ ...videoForm, youtubeUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Estimasi Durasi
                      </label>
                      <input
                        type="text"
                        value={videoForm.durasi}
                        onChange={(e) => setVideoForm({ ...videoForm, durasi: e.target.value })}
                        placeholder="Contoh: 4 Menit"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Ringkasan Video
                      </label>
                      <input
                        type="text"
                        value={videoForm.ringkasan}
                        onChange={(e) => setVideoForm({ ...videoForm, ringkasan: e.target.value })}
                        placeholder="Deskripsi singkat isi materi video..."
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAddVideo(false)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-600 bg-white"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        if (!videoForm.judul) {
                          alert("Judul video wajib diisi!");
                          return;
                        }
                        addVideoPanduan({
                          id: `vid-${Date.now()}`,
                          ...videoForm,
                        });
                        setShowAddVideo(false);
                        setVideoForm({
                          judul: "",
                          kategori: "Panduan Sekolah",
                          durasi: "4 Menit",
                          ringkasan: "",
                          youtubeUrl: "https://www.youtube.com",
                          highlight: "Video Panduan",
                        });
                        showToast("Video panduan baru berhasil ditambahkan!");
                      }}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                    >
                      Simpan Video
                    </button>
                  </div>
                </div>
              )}

              {/* Daftar Video Saat Ini (3 Kotak per Halaman) */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {beranda.videoPanduan
                    .slice((pageVideo - 1) * 3, pageVideo * 3)
                    .map((v) => (
                      <div
                        key={v.id}
                        className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex flex-col justify-between space-y-2 shadow-2xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#2A2C5E] bg-blue-100 px-2 py-0.5 rounded">
                              {v.kategori}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingItem({ type: "VIDEO", id: v.id, data: { ...v } })}
                                className="text-[#2A2C5E] hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                title="Edit Video"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus video "${v.judul}"?`)) {
                                    deleteVideoPanduan(v.id);
                                    showToast("Video berhasil dihapus.");
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                title="Hapus Video"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-2">{v.judul}</h4>
                          <p className="text-[11px] text-gray-500 line-clamp-2">{v.ringkasan}</p>
                        </div>

                        <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-500" />
                            {v.durasi}
                          </span>
                          <a
                            href={v.youtubeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#2A2C5E] hover:underline font-semibold flex items-center gap-1"
                          >
                            Buka YT
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                </div>

                {beranda.videoPanduan.length > 3 && (
                  <PaginationBar
                    currentPage={pageVideo}
                    totalPages={Math.max(1, Math.ceil(beranda.videoPanduan.length / 3))}
                    totalItems={beranda.videoPanduan.length}
                    itemsPerPage={3}
                    onPageChange={setPageVideo}
                    itemLabel="video panduan"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: HALAMAN PROFIL */}
        {/* ========================================================================= */}
        {activeTab === "PROFIL" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 2.1 Struktur Organisasi Pimpinan */}
            <div className="p-5 sm:p-6 rounded-xl border border-gray-200 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#2A2C5E]" />
                    <span>Bagan Struktur Organisasi & Pimpinan Sekolah</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Kelola foto, nama, NIP, pangkat, dan jabatan yang tampil pada bagan hierarki profil
                  </p>
                </div>
                <button
                  onClick={() => setShowAddOrg(!showAddOrg)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A2C5E] text-white text-xs font-semibold hover:bg-[#1F2147] transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Posisi</span>
                </button>
              </div>

              {/* Form Tambah Struktur Organisasi */}
              {showAddOrg && (
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-[#2A2C5E]">Tambah Jabatan Pimpinan Baru</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Nama Jabatan
                      </label>
                      <input
                        type="text"
                        value={orgForm.jabatan}
                        onChange={(e) => setOrgForm({ ...orgForm, jabatan: e.target.value })}
                        placeholder="Contoh: Waka Bidang Hubungan Industri"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Nama Lengkap Beserta Gelar
                      </label>
                      <input
                        type="text"
                        value={orgForm.nama}
                        onChange={(e) => setOrgForm({ ...orgForm, nama: e.target.value })}
                        placeholder="Contoh: Ahmad Subagja, S.Pd."
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        NIP / NUPTK
                      </label>
                      <input
                        type="text"
                        value={orgForm.nip}
                        onChange={(e) => setOrgForm({ ...orgForm, nip: e.target.value })}
                        placeholder="Contoh: 19850101 201001 1 002"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Foto Formal Pejabat
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={orgForm.fotoUrl}
                          onChange={(e) => setOrgForm({ ...orgForm, fotoUrl: e.target.value })}
                          placeholder="https://..."
                          className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => openCropper("Foto Posisi Struktur", "1:1", (url) => setOrgForm({ ...orgForm, fotoUrl: url }))}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#2A2C5E] text-white text-[11px] font-semibold rounded-lg hover:bg-[#1F2147] shrink-0 shadow-xs cursor-pointer"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Unggah</span>
                        </button>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Tugas Pokok Singkat
                      </label>
                      <input
                        type="text"
                        value={orgForm.keterangan}
                        onChange={(e) => setOrgForm({ ...orgForm, keterangan: e.target.value })}
                        placeholder="Keterangan bidang pembinaan..."
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAddOrg(false)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-600 bg-white"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        if (!orgForm.jabatan || !orgForm.nama) {
                          alert("Nama jabatan dan nama pejabat wajib diisi!");
                          return;
                        }
                        addStrukturOrganisasi({
                          id: `org-${Date.now()}`,
                          ...orgForm,
                        });
                        setShowAddOrg(false);
                        setOrgForm({
                          jabatan: "",
                          nama: "",
                          nip: "",
                          pangkat: "Guru Ahli Muda",
                          keterangan: "",
                          fotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
                        });
                        showToast("Posisi pimpinan berhasil ditambahkan ke profil!");
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#2A2C5E] text-white text-xs font-semibold"
                    >
                      Simpan Posisi
                    </button>
                  </div>
                </div>
              )}

              {/* Grid Posisi Organisasi (3 Kotak per Halaman) */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {profil.strukturOrganisasi
                    .slice((pageOrg - 1) * 3, pageOrg * 3)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-start gap-3 relative group shadow-2xs"
                      >
                        <img
                          src={item.fotoUrl}
                          alt={item.nama}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-300 shrink-0"
                        />
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <span className="inline-block text-[10px] font-bold text-[#2A2C5E] bg-blue-100 px-2 py-0.5 rounded truncate max-w-full">
                            {item.jabatan}
                          </span>
                          <h4 className="text-xs font-bold text-gray-900 truncate">{item.nama}</h4>
                          <p className="text-[10px] font-mono text-gray-500 truncate">{item.nip}</p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setEditingItem({ type: "ORG", id: item.id, data: { ...item } })}
                            className="text-[#2A2C5E] hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Edit Posisi"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus jabatan "${item.jabatan}"?`)) {
                                deleteStrukturOrganisasi(item.id);
                                showToast("Posisi berhasil dihapus.");
                              }
                            }}
                            className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Hapus Posisi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {profil.strukturOrganisasi.length > 3 && (
                  <PaginationBar
                    currentPage={pageOrg}
                    totalPages={Math.max(1, Math.ceil(profil.strukturOrganisasi.length / 3))}
                    totalItems={profil.strukturOrganisasi.length}
                    itemsPerPage={3}
                    onPageChange={setPageOrg}
                    itemLabel="posisi organisasi"
                  />
                )}
              </div>
            </div>

            {/* 2.2 Direktori Dewan Guru & Staf */}
            <div className="p-5 sm:p-6 rounded-xl border border-gray-200 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#2A2C5E]" />
                    <span>Direktori Dewan Guru & Tenaga Kependidikan</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Kelola foto profil guru, nama lengkap, NUPTK, bidang mata pelajaran yang diampu
                  </p>
                </div>
                <button
                  onClick={() => setShowAddGuru(!showAddGuru)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Guru/Staf</span>
                </button>
              </div>

              {/* Form Tambah Guru */}
              {showAddGuru && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-emerald-900">Form Data Pendidik Baru</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Nama Lengkap & Gelar
                      </label>
                      <input
                        type="text"
                        value={guruForm.nama}
                        onChange={(e) => setGuruForm({ ...guruForm, nama: e.target.value })}
                        placeholder="Contoh: Rina Wahyuni, S.Pd."
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        NUPTK / NIP
                      </label>
                      <input
                        type="text"
                        value={guruForm.nuptk}
                        onChange={(e) => setGuruForm({ ...guruForm, nuptk: e.target.value })}
                        placeholder="Contoh: 19900101 201501 2 003"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Mata Pelajaran / Bidang
                      </label>
                      <input
                        type="text"
                        value={guruForm.mapel}
                        onChange={(e) => setGuruForm({ ...guruForm, mapel: e.target.value })}
                        placeholder="Contoh: Kimia & Praktikum IPA"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Alamat Email
                      </label>
                      <input
                        type="email"
                        value={guruForm.email}
                        onChange={(e) => setGuruForm({ ...guruForm, email: e.target.value })}
                        placeholder="guru@smandabuba.com"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Pendidikan Terakhir
                      </label>
                      <input
                        type="text"
                        value={guruForm.pendidikan}
                        onChange={(e) => setGuruForm({ ...guruForm, pendidikan: e.target.value })}
                        placeholder="Contoh: S1 Pendidikan Kimia"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Foto Profil Guru (PP)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={guruForm.fotoUrl}
                          onChange={(e) => setGuruForm({ ...guruForm, fotoUrl: e.target.value })}
                          placeholder="https://..."
                          className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => openCropper("Foto Profil Guru", "1:1", (url) => setGuruForm({ ...guruForm, fotoUrl: url }))}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#2A2C5E] text-white text-[11px] font-semibold rounded-lg hover:bg-[#1F2147] shrink-0 shadow-xs cursor-pointer"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Unggah</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAddGuru(false)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-600 bg-white"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        if (!guruForm.nama || !guruForm.nuptk) {
                          alert("Nama dan NUPTK guru wajib diisi!");
                          return;
                        }
                        addGuruStaff({
                          id: `guru-${Date.now()}`,
                          ...guruForm,
                        });
                        setShowAddGuru(false);
                        setGuruForm({
                          nama: "",
                          nuptk: "",
                          mapel: "",
                          email: "",
                          pendidikan: "S1 Pendidikan",
                          fotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
                          role: "GURU",
                        });
                        showToast("Guru/Staf baru berhasil didaftarkan ke direktori!");
                      }}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                    >
                      Simpan Guru
                    </button>
                  </div>
                </div>
              )}

              {/* Grid Daftar Guru (6 per Halaman) */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {profil.guruStaff
                    .slice((pageGuru - 1) * 6, pageGuru * 6)
                    .map((g) => (
                      <div
                        key={g.id}
                        className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col justify-between space-y-2 relative shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={g.fotoUrl}
                            alt={g.nama}
                            className="w-11 h-11 rounded-lg object-cover border border-gray-300 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-gray-900 truncate">{g.nama}</h4>
                            <p className="text-[10px] text-gray-500 font-mono truncate">NUPTK: {g.nuptk}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[10px]">
                          <span className="text-[#2A2C5E] font-semibold truncate max-w-[150px]">
                            {g.mapel}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingItem({ type: "GURU", id: g.id, data: { ...g } })}
                              className="text-[#2A2C5E] hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                              title="Edit Guru"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus guru "${g.nama}"?`)) {
                                  deleteGuruStaff(g.id);
                                  showToast("Guru berhasil dihapus.");
                                }
                              }}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Hapus Guru"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {profil.guruStaff.length > 6 && (
                  <PaginationBar
                    currentPage={pageGuru}
                    totalPages={Math.max(1, Math.ceil(profil.guruStaff.length / 6))}
                    totalItems={profil.guruStaff.length}
                    itemsPerPage={6}
                    onPageChange={setPageGuru}
                    itemLabel="pendidik & staf"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AKADEMIK & JADWAL */}
        {/* ========================================================================= */}
        {activeTab === "AKADEMIK" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 3.1 Agenda Kalender Akademik */}
            <div className="p-5 sm:p-6 rounded-xl border border-gray-200 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#2A2C5E]" />
                    <span>Agenda Kalender Akademik Resmi</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Tambah, edit, atau hapus kegiatan kalender akademik tahun berjalan
                  </p>
                </div>
                <button
                  onClick={() => setShowAddAgenda(!showAddAgenda)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A2C5E] text-white text-xs font-semibold hover:bg-[#1F2147] transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Agenda</span>
                </button>
              </div>

              {/* Form Tambah Agenda */}
              {showAddAgenda && (
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-[#2A2C5E]">Tambah Agenda Kalender Baru</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Nama Kegiatan
                      </label>
                      <input
                        type="text"
                        value={agendaForm.kegiatan}
                        onChange={(e) => setAgendaForm({ ...agendaForm, kegiatan: e.target.value })}
                        placeholder="Contoh: Sumatif Akhir Semester (SAS)"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Rentang Tanggal
                      </label>
                      <input
                        type="text"
                        value={agendaForm.tanggal}
                        onChange={(e) => setAgendaForm({ ...agendaForm, tanggal: e.target.value })}
                        placeholder="Contoh: 15 - 20 Desember 2026"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Kategori
                      </label>
                      <select
                        value={agendaForm.kategori}
                        onChange={(e) => setAgendaForm({ ...agendaForm, kategori: e.target.value as any })}
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      >
                        <option value="AKADEMIK">Akademik</option>
                        <option value="UJIAN">Ujian & Evaluasi</option>
                        <option value="LIBUR">Hari Libur</option>
                        <option value="KESISWAAN">Kesiswaan</option>
                      </select>
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Keterangan Rinci
                      </label>
                      <input
                        type="text"
                        value={agendaForm.keterangan}
                        onChange={(e) => setAgendaForm({ ...agendaForm, keterangan: e.target.value })}
                        placeholder="Penjelasan sasaran peserta atau tata laksana kegiatan..."
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAddAgenda(false)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-600 bg-white"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        if (!agendaForm.kegiatan || !agendaForm.tanggal) {
                          alert("Nama kegiatan dan tanggal wajib diisi!");
                          return;
                        }
                        addAgendaKalender({
                          ...agendaForm,
                          id: `agenda-${Date.now()}`,
                          bulanSingkat: agendaForm.tanggal.slice(0, 3),
                        });
                        setShowAddAgenda(false);
                        setAgendaForm({
                          tanggal: "",
                          bulanSingkat: "Jan",
                          kegiatan: "",
                          kategori: "AKADEMIK",
                          keterangan: "",
                          semester: "GANJIL",
                        });
                        showToast("Agenda kalender berhasil ditambahkan!");
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#2A2C5E] text-white text-xs font-semibold"
                    >
                      Simpan Agenda
                    </button>
                  </div>
                </div>
              )}

              {/* Tabel Daftar Agenda */}
              {/* Tabel Daftar Agenda (6 per Halaman) */}
              <div className="space-y-3">
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                  {akademik.agendaList
                    .slice((pageAgenda - 1) * 6, pageAgenda * 6)
                    .map((ag) => (
                      <div key={ag.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-16 px-2 py-1 text-center text-[10px] font-bold text-[#2A2C5E] bg-blue-50 border border-blue-200 rounded shrink-0">
                            {ag.tanggal}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 truncate">{ag.kegiatan}</h4>
                            <p className="text-[11px] text-gray-500 truncate">{ag.keterangan}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                            {ag.kategori}
                          </span>
                          <button
                            onClick={() => setEditingItem({ type: "AGENDA", id: ag.id, data: { ...ag } })}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit Agenda"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus agenda "${ag.kegiatan}"?`)) {
                                deleteAgendaKalender(ag.id);
                                showToast("Agenda berhasil dihapus.");
                              }
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Hapus Agenda"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {akademik.agendaList.length > 6 && (
                  <PaginationBar
                    currentPage={pageAgenda}
                    totalPages={Math.max(1, Math.ceil(akademik.agendaList.length / 6))}
                    totalItems={akademik.agendaList.length}
                    itemsPerPage={6}
                    onPageChange={setPageAgenda}
                    itemLabel="agenda kalender"
                  />
                )}
              </div>
            </div>

            {/* 3.2 Jadwal Pelajaran Rutin (KBM Mingguan per Kelas) */}
            <div className="p-5 sm:p-6 rounded-xl border border-gray-200 bg-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#2A2C5E]" />
                    <span>Jadwal Pelajaran Rutin Mingguan (KBM)</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Atur roster jam pelajaran, mata pelajaran, guru pengampu, dan ruang kelas
                  </p>
                </div>
                <button
                  onClick={() => setShowAddKbm(!showAddKbm)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A2C5E] text-white text-xs font-semibold hover:bg-[#1F2147] transition-all shadow-xs cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Slot KBM</span>
                </button>
              </div>

              {/* Form Tambah Slot KBM */}
              {showAddKbm && (
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-[#2A2C5E]">Tambah Slot Jadwal Pelajaran Baru</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Pilih Rombel / Kelas
                      </label>
                      <select
                        value={kbmForm.kelas}
                        onChange={(e) => setKbmForm({ ...kbmForm, kelas: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      >
                        <option value="XII MIPA 1">Kelas XII MIPA 1</option>
                        <option value="XII MIPA 2">Kelas XII MIPA 2</option>
                        <option value="XII IPS 1">Kelas XII IPS 1</option>
                        <option value="XI MIPA 1">Kelas XI MIPA 1</option>
                        <option value="X MERDEKA 1">Kelas X Merdeka 1</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Hari Belajar
                      </label>
                      <select
                        value={kbmForm.hari}
                        onChange={(e) => setKbmForm({ ...kbmForm, hari: e.target.value as any })}
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      >
                        <option value="Senin">Senin</option>
                        <option value="Selasa">Selasa</option>
                        <option value="Rabu">Rabu</option>
                        <option value="Kamis">Kamis</option>
                        <option value="Jumat">Jumat</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Jam Pelajaran Ke-
                      </label>
                      <input
                        type="text"
                        value={kbmForm.jamKe}
                        onChange={(e) => setKbmForm({ ...kbmForm, jamKe: e.target.value })}
                        placeholder="Contoh: 1 - 2"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Rentang Waktu
                      </label>
                      <input
                        type="text"
                        value={kbmForm.waktu}
                        onChange={(e) => setKbmForm({ ...kbmForm, waktu: e.target.value })}
                        placeholder="Contoh: 07:15 - 08:45"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Mata Pelajaran
                      </label>
                      <input
                        type="text"
                        value={kbmForm.mapel}
                        onChange={(e) => setKbmForm({ ...kbmForm, mapel: e.target.value })}
                        placeholder="Contoh: Matematika Peminatan"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Guru Pengampu
                      </label>
                      <input
                        type="text"
                        value={kbmForm.guru}
                        onChange={(e) => setKbmForm({ ...kbmForm, guru: e.target.value })}
                        placeholder="Contoh: Marsono, S.Pd."
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Ruang Belajar / Lab
                      </label>
                      <input
                        type="text"
                        value={kbmForm.ruang}
                        onChange={(e) => setKbmForm({ ...kbmForm, ruang: e.target.value })}
                        placeholder="Contoh: R.12 MIPA 1 / Lab IPA"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAddKbm(false)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-600 bg-white"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        if (!kbmForm.mapel || !kbmForm.guru) {
                          alert("Mata pelajaran dan nama guru pengampu wajib diisi!");
                          return;
                        }
                        addSlotPelajaran({
                          id: `kbm-${Date.now()}`,
                          ...kbmForm,
                        });
                        setShowAddKbm(false);
                        setKbmForm({
                          kelas: selectedKbmKelas,
                          hari: "Senin",
                          jamKe: "1 - 2",
                          waktu: "07:15 - 08:45",
                          mapel: "",
                          guru: "",
                          ruang: "R.12 MIPA 1",
                          tipe: "KBM",
                        });
                        showToast("Slot mata pelajaran berhasil ditambahkan ke jadwal KBM!");
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#2A2C5E] text-white text-xs font-semibold"
                    >
                      Simpan Slot KBM
                    </button>
                  </div>
                </div>
              )}

              {/* Filter Kelas & Hari */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-700">Rombel:</span>
                  <select
                    value={selectedKbmKelas}
                    onChange={(e) => {
                      setSelectedKbmKelas(e.target.value);
                      setPageKbm(1);
                    }}
                    className="text-xs font-semibold text-[#2A2C5E] bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="XII MIPA 1">Kelas XII MIPA 1</option>
                    <option value="XII MIPA 2">Kelas XII MIPA 2</option>
                    <option value="XII IPS 1">Kelas XII IPS 1</option>
                    <option value="XI MIPA 1">Kelas XI MIPA 1</option>
                    <option value="X MERDEKA 1">Kelas X Merdeka 1</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                  {["SEMUA", "Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((hari) => (
                    <button
                      key={hari}
                      type="button"
                      onClick={() => {
                        setSelectedKbmHari(hari);
                        setPageKbm(1);
                      }}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                        selectedKbmHari === hari
                          ? "bg-[#2A2C5E] text-white shadow-2xs"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {hari}
                    </button>
                  ))}
                </div>
              </div>

              {/* Daftar Slot KBM Terjadwal */}
              {(() => {
                const kbmList = (akademik.jadwalPelajaranList || []).filter((s) => {
                  const matchKelas = s.kelas === selectedKbmKelas;
                  const matchHari = selectedKbmHari === "SEMUA" || s.hari === selectedKbmHari;
                  return matchKelas && matchHari;
                });

                if (kbmList.length === 0) {
                  return (
                    <div className="text-center py-6 text-xs text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      Belum ada slot pelajaran khusus untuk {selectedKbmKelas} ({selectedKbmHari}). Silakan klik "Tambah Slot KBM".
                    </div>
                  );
                }

                const totalKbmPages = Math.max(1, Math.ceil(kbmList.length / 6));
                const paginatedKbm = kbmList.slice((pageKbm - 1) * 6, pageKbm * 6);

                return (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {paginatedKbm.map((slot) => (
                        <div
                          key={slot.id}
                          className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2 relative shadow-2xs flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-[#2A2C5E] bg-blue-100 px-2 py-0.5 rounded">
                                {slot.hari} &bull; Jam {slot.jamKe}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setEditingItem({ type: "KBM", id: slot.id, data: { ...slot } })}
                                  className="text-blue-600 hover:text-blue-800 p-1"
                                  title="Edit Slot Pelajaran"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Hapus mata pelajaran "${slot.mapel}"?`)) {
                                      deleteSlotPelajaran(slot.id);
                                      showToast("Slot pelajaran berhasil dihapus.");
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1"
                                  title="Hapus Slot"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <h4 className="text-xs font-bold text-gray-900">{slot.mapel}</h4>
                            <p className="text-[11px] text-gray-600 mt-0.5">Guru: {slot.guru}</p>
                          </div>

                          <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500">
                            <span>{slot.waktu}</span>
                            <span className="font-medium text-gray-700">{slot.ruang}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {kbmList.length > 6 && (
                      <PaginationBar
                        currentPage={pageKbm}
                        totalPages={totalKbmPages}
                        totalItems={kbmList.length}
                        itemsPerPage={6}
                        onPageChange={setPageKbm}
                        itemLabel="slot mata pelajaran"
                      />
                    )}
                  </div>
                );
              })()}
            </div>

            {/* 3.3 Jadwal Ujian Sekolah (CBT) */}
            <div className="p-5 sm:p-6 rounded-xl border border-gray-200 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#2A2C5E]" />
                    <span>Jadwal Ujian Sekolah (Computer Based Test)</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Atur jadwal pelaksanaan ujian formatif / sumatif siswa
                  </p>
                </div>
                <button
                  onClick={() => setShowAddUjian(!showAddUjian)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Jadwal Ujian</span>
                </button>
              </div>

              {/* Form Tambah Jadwal Ujian */}
              {showAddUjian && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-emerald-900">Tambah Sesi Ujian Baru</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Mata Pelajaran
                      </label>
                      <input
                        type="text"
                        value={ujianForm.mataPelajaran}
                        onChange={(e) => setUjianForm({ ...ujianForm, mataPelajaran: e.target.value })}
                        placeholder="Contoh: Fisika / Ekonomi"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Hari & Tanggal
                      </label>
                      <input
                        type="text"
                        value={ujianForm.hariTanggal}
                        onChange={(e) => setUjianForm({ ...ujianForm, hariTanggal: e.target.value })}
                        placeholder="Contoh: Rabu, 2 Desember 2026"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Waktu & Sesi
                      </label>
                      <input
                        type="text"
                        value={ujianForm.waktu}
                        onChange={(e) => setUjianForm({ ...ujianForm, waktu: e.target.value })}
                        placeholder="Contoh: 07.30 - 09.30 WIB"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Tingkat Peserta
                      </label>
                      <input
                        type="text"
                        value={ujianForm.tingkatLabel}
                        onChange={(e) => setUjianForm({ ...ujianForm, tingkatLabel: e.target.value })}
                        placeholder="Contoh: Kelas X, XI, XII"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Ruang & Moda
                      </label>
                      <input
                        type="text"
                        value={ujianForm.ruangModa}
                        onChange={(e) => setUjianForm({ ...ujianForm, ruangModa: e.target.value })}
                        placeholder="Contoh: Ruang CBT & Kelas"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Guru Koordinator
                      </label>
                      <input
                        type="text"
                        value={ujianForm.koordinator}
                        onChange={(e) => setUjianForm({ ...ujianForm, koordinator: e.target.value })}
                        placeholder="Nama guru penanggung jawab..."
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAddUjian(false)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-600 bg-white"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        if (!ujianForm.mataPelajaran || !ujianForm.hariTanggal) {
                          alert("Mata pelajaran dan hari tanggal wajib diisi!");
                          return;
                        }
                        addJadwalUjian({
                          id: `uj-${Date.now()}`,
                          jenisUjian: "PAS_GANJIL",
                          tingkat: "SEMUA",
                          ...ujianForm,
                        });
                        setShowAddUjian(false);
                        setUjianForm({
                          hariTanggal: "",
                          sesi: "Sesi 1 (07.30 - 09.30)",
                          waktu: "07.30 - 09.30 WIB",
                          mataPelajaran: "",
                          tingkatLabel: "Kelas X, XI, XII",
                          ruangModa: "28 Ruang Kelas & CBT Lab",
                          koordinator: "",
                        });
                        showToast("Jadwal ujian berhasil ditambahkan!");
                      }}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                    >
                      Simpan Jadwal Ujian
                    </button>
                  </div>
                </div>
              )}

              {/* Grid Jadwal Ujian (3 Kotak per Halaman) */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {akademik.jadwalUjianList
                    .slice((pageUjian - 1) * 3, pageUjian * 3)
                    .map((uj) => (
                      <div key={uj.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 relative shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#2A2C5E] bg-blue-100 px-2 py-0.5 rounded">
                            {uj.mataPelajaran}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingItem({ type: "UJIAN", id: uj.id, data: { ...uj } })}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Edit Jadwal"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus jadwal "${uj.mataPelajaran}"?`)) {
                                  deleteJadwalUjian(uj.id);
                                  showToast("Jadwal ujian berhasil dihapus.");
                                }
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Hapus Jadwal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-gray-900">{uj.hariTanggal}</p>
                        <p className="text-[11px] text-gray-500">{uj.waktu} &bull; {uj.ruangModa}</p>
                        <p className="text-[10px] text-gray-400">Koordinator: {uj.koordinator || "-"}</p>
                      </div>
                    ))}
                </div>

                {akademik.jadwalUjianList.length > 3 && (
                  <PaginationBar
                    currentPage={pageUjian}
                    totalPages={Math.max(1, Math.ceil(akademik.jadwalUjianList.length / 3))}
                    totalItems={akademik.jadwalUjianList.length}
                    itemsPerPage={3}
                    onPageChange={setPageUjian}
                    itemLabel="jadwal ujian"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: KESISWAAN & EKSKUL */}
        {/* ========================================================================= */}
        {activeTab === "KESISWAAN" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 4.1 Manajemen Prestasi Siswa (Bisa Tambah Gambar & Prestasi Baru) */}
            <div className="p-5 sm:p-6 rounded-xl border border-gray-200 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#2A2C5E]" />
                    <span>Katalog Prestasi Siswa & Kejuaraan</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Tambah prestasi baru beserta foto sertifikat/trofi, predikat juara, dan data peraih
                  </p>
                </div>
                <button
                  onClick={() => setShowAddPrestasi(!showAddPrestasi)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Prestasi Baru</span>
                </button>
              </div>

              {/* Form Tambah Prestasi Baru */}
              {showAddPrestasi && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-emerald-900">Form Prestasi Siswa Baru</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Nama Kejuaraan / Kompetisi
                      </label>
                      <input
                        type="text"
                        value={prestasiForm.judul}
                        onChange={(e) => setPrestasiForm({ ...prestasiForm, judul: e.target.value })}
                        placeholder="Contoh: Olimpiade Sains Nasional (OSN) Bidang Biologi"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Predikat Juara
                      </label>
                      <input
                        type="text"
                        value={prestasiForm.juara}
                        onChange={(e) => setPrestasiForm({ ...prestasiForm, juara: e.target.value })}
                        placeholder="Contoh: Juara 1 (Medali Emas)"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Tingkat Kejuaraan
                      </label>
                      <input
                        type="text"
                        value={prestasiForm.tingkat}
                        onChange={(e) => setPrestasiForm({ ...prestasiForm, tingkat: e.target.value })}
                        placeholder="Contoh: Tingkat Kabupaten Way Kanan"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Nama Siswa Peraih
                      </label>
                      <input
                        type="text"
                        value={prestasiForm.peraih}
                        onChange={(e) => setPrestasiForm({ ...prestasiForm, peraih: e.target.value })}
                        placeholder="Contoh: Ahmad Dani (Kelas XII MIPA)"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Tahun & Bidang
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={prestasiForm.tahun}
                          onChange={(e) => setPrestasiForm({ ...prestasiForm, tahun: e.target.value })}
                          placeholder="2026"
                          className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          value={prestasiForm.bidang}
                          onChange={(e) => setPrestasiForm({ ...prestasiForm, bidang: e.target.value })}
                          placeholder="Sains"
                          className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Foto Piagam / Dokumentasi Prestasi
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={prestasiForm.fotoUrl}
                          onChange={(e) => setPrestasiForm({ ...prestasiForm, fotoUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => openCropper("Dokumentasi Prestasi", "4:3", (url) => setPrestasiForm({ ...prestasiForm, fotoUrl: url }))}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-[#2A2C5E] text-white text-xs font-semibold rounded-lg hover:bg-[#1F2147] shrink-0 shadow-xs cursor-pointer"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Unggah & Pas-kan</span>
                        </button>
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Deskripsi Capaian Prestasi
                      </label>
                      <textarea
                        rows={2}
                        value={prestasiForm.deskripsi}
                        onChange={(e) => setPrestasiForm({ ...prestasiForm, deskripsi: e.target.value })}
                        placeholder="Penjelasan prestasi dan perwakilan kompetisi..."
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAddPrestasi(false)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-600 bg-white"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        if (!prestasiForm.judul || !prestasiForm.peraih) {
                          alert("Nama kejuaraan dan peraih wajib diisi!");
                          return;
                        }
                        addPrestasi({
                          id: `prestasi-${Date.now()}`,
                          ...prestasiForm,
                        });
                        setShowAddPrestasi(false);
                        setPrestasiForm({
                          judul: "",
                          juara: "Juara 1",
                          tingkat: "Tingkat Kabupaten Way Kanan",
                          bidang: "Akademik & Sains",
                          tahun: "2026",
                          penyelenggara: "Dinas Pendidikan",
                          peraih: "",
                          deskripsi: "",
                          fotoUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80",
                        });
                        showToast("Prestasi siswa baru berhasil ditambahkan!");
                      }}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                    >
                      Simpan Prestasi
                    </button>
                  </div>
                </div>
              )}

              {/* Grid Prestasi (3 Kotak per Halaman) */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {kesiswaan.prestasiList
                    .slice((pagePrestasi - 1) * 3, pagePrestasi * 3)
                    .map((pres) => (
                      <div key={pres.id} className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex flex-col justify-between shadow-2xs">
                        <div>
                          <div className="h-36 overflow-hidden relative">
                            <img
                              src={pres.fotoUrl}
                              alt={pres.judul}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-[#2A2C5E] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                              {pres.juara}
                            </span>
                            <div className="absolute top-2 right-2 flex items-center gap-1">
                              <button
                                onClick={() => setEditingItem({ type: "PRESTASI", id: pres.id, data: { ...pres } })}
                                className="bg-white/90 text-blue-700 p-1 rounded-md shadow-xs hover:bg-white"
                                title="Edit Prestasi"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus prestasi "${pres.judul}"?`)) {
                                    deletePrestasi(pres.id);
                                    showToast("Prestasi berhasil dihapus.");
                                  }
                                }}
                                className="bg-red-600 text-white p-1 rounded-md shadow-xs hover:bg-red-700"
                                title="Hapus Prestasi"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="p-3.5 space-y-1">
                            <span className="text-[10px] text-gray-500 font-medium">
                              {pres.tingkat} &bull; {pres.tahun}
                            </span>
                            <h4 className="text-xs font-bold text-gray-900 line-clamp-2">{pres.judul}</h4>
                            <p className="text-[11px] font-semibold text-[#2A2C5E]">{pres.peraih}</p>
                            <p className="text-[10px] text-gray-500 line-clamp-2 mt-1">{pres.deskripsi}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {kesiswaan.prestasiList.length > 3 && (
                  <PaginationBar
                    currentPage={pagePrestasi}
                    totalPages={Math.max(1, Math.ceil(kesiswaan.prestasiList.length / 3))}
                    totalItems={kesiswaan.prestasiList.length}
                    itemsPerPage={3}
                    onPageChange={setPagePrestasi}
                    itemLabel="prestasi siswa"
                  />
                )}
              </div>
            </div>

            {/* 4.2 Struktur Kepengurusan OSIS */}
            <div className="p-5 sm:p-6 rounded-xl border border-gray-200 bg-gray-50/50 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#2A2C5E]" />
                    <span>Struktur Inti Organisasi Siswa Intra Sekolah (OSIS)</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Ubah data Pembina OSIS, Ketua, Wakil, Sekretaris, dan Bendahara
                  </p>
                </div>
                <button
                  onClick={() => showToast("Struktur kepengurusan OSIS berhasil disimpan!")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A2C5E] text-white text-xs font-semibold hover:bg-[#1F2147] transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Pembina Utama OSIS
                  </label>
                  <input
                    type="text"
                    value={kesiswaan.osis.pembina}
                    onChange={(e) => updateOsis({ pembina: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Ketua Umum OSIS
                  </label>
                  <input
                    type="text"
                    value={kesiswaan.osis.ketua}
                    onChange={(e) => updateOsis({ ketua: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Wakil Ketua OSIS
                  </label>
                  <input
                    type="text"
                    value={kesiswaan.osis.wakil}
                    onChange={(e) => updateOsis({ wakil: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Sekretaris Umum
                  </label>
                  <input
                    type="text"
                    value={kesiswaan.osis.sekretaris}
                    onChange={(e) => updateOsis({ sekretaris: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Bendahara Umum
                  </label>
                  <input
                    type="text"
                    value={kesiswaan.osis.bendahara}
                    onChange={(e) => updateOsis({ bendahara: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 4.3 Ekstrakurikuler (Eskul) */}
            <div className="p-5 sm:p-6 rounded-xl border border-gray-200 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#2A2C5E]" />
                    <span>Daftar Ekstrakurikuler (Eskul) & Pembina</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Kelola nama eskul, nama pembina, jadwal latihan, lokasi, dan prestasi unggulan
                  </p>
                </div>
                <button
                  onClick={() => setShowAddEkskul(!showAddEkskul)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Eskul</span>
                </button>
              </div>

              {/* Form Tambah Eskul */}
              {showAddEkskul && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-emerald-900">Tambah Kegiatan Eskul Baru</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Nama Ekstrakurikuler
                      </label>
                      <input
                        type="text"
                        value={ekskulForm.nama}
                        onChange={(e) => setEkskulForm({ ...ekskulForm, nama: e.target.value })}
                        placeholder="Contoh: English Debate Club"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Kategori
                      </label>
                      <input
                        type="text"
                        value={ekskulForm.kategori}
                        onChange={(e) => setEkskulForm({ ...ekskulForm, kategori: e.target.value })}
                        placeholder="Contoh: Bahasa & Komunikasi"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Guru Pembina
                      </label>
                      <input
                        type="text"
                        value={ekskulForm.pembina}
                        onChange={(e) => setEkskulForm({ ...ekskulForm, pembina: e.target.value })}
                        placeholder="Nama guru pembina..."
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Hari & Waktu Latihan
                      </label>
                      <input
                        type="text"
                        value={ekskulForm.jadwal}
                        onChange={(e) => setEkskulForm({ ...ekskulForm, jadwal: e.target.value })}
                        placeholder="Contoh: Rabu, 15.30 - 17.00 WIB"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Lokasi Latihan
                      </label>
                      <input
                        type="text"
                        value={ekskulForm.lokasi}
                        onChange={(e) => setEkskulForm({ ...ekskulForm, lokasi: e.target.value })}
                        placeholder="Contoh: Lab Bahasa & Aula"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Prestasi Unggulan
                      </label>
                      <input
                        type="text"
                        value={ekskulForm.prestasiUnggulan}
                        onChange={(e) => setEkskulForm({ ...ekskulForm, prestasiUnggulan: e.target.value })}
                        placeholder="Capaian terbaik eskul..."
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Deskripsi Kegiatan
                      </label>
                      <input
                        type="text"
                        value={ekskulForm.deskripsi}
                        onChange={(e) => setEkskulForm({ ...ekskulForm, deskripsi: e.target.value })}
                        placeholder="Ringkasan kegiatan eskul..."
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAddEkskul(false)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-600 bg-white"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        if (!ekskulForm.nama) {
                          alert("Nama eskul wajib diisi!");
                          return;
                        }
                        addEkskul({
                          id: `ekskul-${Date.now()}`,
                          logoId: "pramuka",
                          ...ekskulForm,
                        });
                        setShowAddEkskul(false);
                        setEkskulForm({
                          nama: "",
                          kategori: "Pengembangan Bakat",
                          pembina: "",
                          jadwal: "Sabtu, 15.30 - 17.00 WIB",
                          lokasi: "Lingkungan SMAN 2 Buay Bahuga",
                          deskripsi: "",
                          prestasiUnggulan: "",
                        });
                        showToast("Ekstrakurikuler baru berhasil ditambahkan!");
                      }}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                    >
                      Simpan Eskul
                    </button>
                  </div>
                </div>
              )}

              {/* Grid Daftar Eskul (3 Kotak per Halaman) */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {kesiswaan.ekskulList
                    .slice((pageEkskul - 1) * 3, pageEkskul * 3)
                    .map((ek) => (
                      <div key={ek.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 relative shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#2A2C5E] bg-blue-100 px-2 py-0.5 rounded">
                            {ek.kategori}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingItem({ type: "EKSKUL", id: ek.id, data: { ...ek } })}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Edit Eskul"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus ekstrakurikuler "${ek.nama}"?`)) {
                                  deleteEkskul(ek.id);
                                  showToast("Ekstrakurikuler berhasil dihapus.");
                                }
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Hapus Eskul"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <h4 className="text-xs font-bold text-gray-900">{ek.nama}</h4>
                        <p className="text-[11px] text-gray-600">Pembina: {ek.pembina || "-"}</p>
                        <p className="text-[10px] text-gray-500">{ek.jadwal} &bull; {ek.lokasi}</p>
                      </div>
                    ))}
                </div>

                {kesiswaan.ekskulList.length > 3 && (
                  <PaginationBar
                    currentPage={pageEkskul}
                    totalPages={Math.max(1, Math.ceil(kesiswaan.ekskulList.length / 3))}
                    totalItems={kesiswaan.ekskulList.length}
                    itemsPerPage={3}
                    onPageChange={setPageEkskul}
                    itemLabel="ekstrakurikuler"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: WARTA & INFORMASI */}
        {/* ========================================================================= */}
        {activeTab === "INFORMASI" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Form Publikasi Cepat */}
            <div className="p-5 sm:p-6 rounded-xl border border-gray-200 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#2A2C5E]" />
                    <span>Terbitkan Warta & Pengumuman Resmi Baru</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Artikel langsung terbit di halaman Beranda dan menu Informasi publik
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-[#2A2C5E] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  Modul Publikasi Resmi
                </span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Judul Warta / Pengumuman
                    </label>
                    <input
                      type="text"
                      value={beritaForm.judul}
                      onChange={(e) => setBeritaForm({ ...beritaForm, judul: e.target.value })}
                      placeholder="Contoh: Jadwal Pelaksanaan Ujian Sumatif Akhir Semester"
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Kategori Publikasi
                    </label>
                    <select
                      value={beritaForm.kategori}
                      onChange={(e) => setBeritaForm({ ...beritaForm, kategori: e.target.value as any })}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]"
                    >
                      <option value="PENGUMUMAN">Pengumuman Resmi</option>
                      <option value="AKADEMIK">Akademik & Kurikulum</option>
                      <option value="KESISWAAN">Kesiswaan & Ekskul</option>
                      <option value="PRESTASI">Prestasi Sekolah</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Foto Sampul (Thumbnail)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={beritaForm.thumbnailUrl}
                      onChange={(e) => setBeritaForm({ ...beritaForm, thumbnailUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]"
                    />
                    <button
                      type="button"
                      onClick={() => openCropper("Foto Sampul Berita", "16:9", (url) => setBeritaForm({ ...beritaForm, thumbnailUrl: url }))}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#2A2C5E] text-white text-xs font-semibold rounded-lg hover:bg-[#1F2147] shrink-0 shadow-xs cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Unggah & Pas-kan</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Ringkasan Singkat (Muncul di kartu warta)
                  </label>
                  <input
                    type="text"
                    value={beritaForm.ringkasan}
                    onChange={(e) => setBeritaForm({ ...beritaForm, ringkasan: e.target.value })}
                    placeholder="Deskripsi singkat maksimal 2 kalimat..."
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Isi Konten Lengkap
                  </label>
                  <textarea
                    rows={4}
                    value={beritaForm.konten}
                    onChange={(e) => setBeritaForm({ ...beritaForm, konten: e.target.value })}
                    placeholder="Tuliskan isi rincian surat edaran / pengumuman secara formal..."
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      if (!beritaForm.judul || !beritaForm.konten) {
                        alert("Judul dan isi konten artikel wajib diisi!");
                        return;
                      }
                      addBerita({
                        id: `berita-${Date.now()}`,
                        slug: beritaForm.judul.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        judul: beritaForm.judul,
                        ringkasan: beritaForm.ringkasan || beritaForm.judul,
                        konten: beritaForm.konten,
                        kategori: beritaForm.kategori,
                        penulis: "Administrator Sekolah",
                        tanggal: new Date().toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }),
                        bacaMenit: 3,
                        thumbnailUrl: beritaForm.thumbnailUrl,
                      });
                      setBeritaForm({
                        judul: "",
                        kategori: "PENGUMUMAN",
                        ringkasan: "",
                        konten: "",
                        thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80",
                      });
                      showToast("Artikel pengumuman resmi berhasil diterbitkan!");
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2A2C5E] text-white text-xs font-bold hover:bg-[#1F2147] transition-all shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Terbitkan Sekarang</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Daftar Artikel Terbit (10 per Halaman) */}
            <div className="p-5 sm:p-6 rounded-xl border border-gray-200 bg-white space-y-3">
              <h4 className="text-xs font-bold text-gray-900">Artikel & Pengumuman yang Sedang Tayang ({beritaList.length})</h4>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                {beritaList
                  .slice((pageBerita - 1) * 10, pageBerita * 10)
                  .map((b) => (
                    <div key={b.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-gray-50">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={b.thumbnailUrl} alt={b.judul} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-gray-200" />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-[#2A2C5E] bg-blue-100 px-2 py-0.5 rounded">
                            {b.kategori}
                          </span>
                          <h5 className="text-xs font-bold text-gray-900 truncate mt-0.5">{b.judul}</h5>
                          <p className="text-[10px] text-gray-500">{b.tanggal} &bull; Oleh: {b.penulis}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setEditingItem({ type: "BERITA", id: b.id, data: { ...b } })}
                          className="text-[#2A2C5E] hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Edit Artikel"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus artikel "${b.judul}"?`)) {
                              deleteBerita(b.id);
                              showToast("Artikel berhasil dihapus.");
                            }
                          }}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Hapus Artikel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {beritaList.length > 10 && (
                <PaginationBar
                  currentPage={pageBerita}
                  totalPages={Math.max(1, Math.ceil(beritaList.length / 10))}
                  totalItems={beritaList.length}
                  itemsPerPage={10}
                  onPageChange={setPageBerita}
                  itemLabel="artikel & pengumuman"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Universal Modal Edit Dialog */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2A2C5E] flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Edit {editingItem.type === "VIDEO" ? "Video Panduan Portal" :
                          editingItem.type === "ORG" ? "Struktur Organisasi" :
                          editingItem.type === "GURU" ? "Data Pendidik & Staf" :
                          editingItem.type === "AGENDA" ? "Agenda Kalender Pendidikan" :
                          editingItem.type === "UJIAN" ? "Jadwal Pelaksanaan Ujian" :
                          editingItem.type === "PRESTASI" ? "Prestasi Siswa" : "Ekstrakurikuler"}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    ID: {editingItem.id} &bull; SMAN 2 Buay Bahuga
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs">
              {/* Form VIDEO */}
              {editingItem.type === "VIDEO" && (
                <>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Judul Video</label>
                    <input
                      type="text"
                      value={editingItem.data.judul || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, judul: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Kategori</label>
                      <input
                        type="text"
                        value={editingItem.data.kategori || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, kategori: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Durasi</label>
                      <input
                        type="text"
                        value={editingItem.data.durasi || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, durasi: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Tautan YouTube</label>
                      <input
                        type="text"
                        value={editingItem.data.youtubeUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, youtubeUrl: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Label Sorotan (Highlight)</label>
                      <input
                        type="text"
                        value={editingItem.data.highlight || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, highlight: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Ringkasan</label>
                    <textarea
                      rows={2}
                      value={editingItem.data.ringkasan || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, ringkasan: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                    />
                  </div>
                </>
              )}

              {/* Form ORG */}
              {editingItem.type === "ORG" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        value={editingItem.data.nama || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, nama: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Jabatan Institusi</label>
                      <input
                        type="text"
                        value={editingItem.data.jabatan || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, jabatan: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">NIP / NUPTK</label>
                      <input
                        type="text"
                        value={editingItem.data.nip || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, nip: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Pangkat / Golongan</label>
                      <input
                        type="text"
                        value={editingItem.data.pangkat || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, pangkat: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Foto Profil Formal</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingItem.data.fotoUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, fotoUrl: e.target.value } })}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                      <button
                        type="button"
                        onClick={() => openCropper("Foto Posisi Struktur", "1:1", (url) => setEditingItem({ ...editingItem, data: { ...editingItem.data, fotoUrl: url } }))}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#2A2C5E] text-white text-[11px] font-semibold rounded-lg hover:bg-[#1F2147] shrink-0"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Unggah</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Keterangan Tambahan</label>
                    <textarea
                      rows={2}
                      value={editingItem.data.keterangan || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, keterangan: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                    />
                  </div>
                </>
              )}

              {/* Form GURU */}
              {editingItem.type === "GURU" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        value={editingItem.data.nama || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, nama: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">NUPTK / NIP</label>
                      <input
                        type="text"
                        value={editingItem.data.nuptk || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, nuptk: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Mata Pelajaran Diampu</label>
                      <input
                        type="text"
                        value={editingItem.data.mapel || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, mapel: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Pendidikan Terakhir</label>
                      <input
                        type="text"
                        value={editingItem.data.pendidikan || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, pendidikan: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Email Resmi</label>
                    <input
                      type="email"
                      value={editingItem.data.email || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, email: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Foto Profil Formal</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingItem.data.fotoUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, fotoUrl: e.target.value } })}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                      <button
                        type="button"
                        onClick={() => openCropper("Foto Posisi Struktur", "1:1", (url) => setEditingItem({ ...editingItem, data: { ...editingItem.data, fotoUrl: url } }))}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#2A2C5E] text-white text-[11px] font-semibold rounded-lg hover:bg-[#1F2147] shrink-0"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Unggah</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Form AGENDA */}
              {editingItem.type === "AGENDA" && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1">
                      <label className="font-semibold text-gray-700">Tanggal Pelaksanaan</label>
                      <input
                        type="text"
                        value={editingItem.data.tanggal || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, tanggal: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Bulan Singkat</label>
                      <input
                        type="text"
                        value={editingItem.data.bulanSingkat || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, bulanSingkat: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Nama Kegiatan</label>
                    <input
                      type="text"
                      value={editingItem.data.kegiatan || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, kegiatan: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Kategori</label>
                      <select
                        value={editingItem.data.kategori || "AKADEMIK"}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, kategori: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E] bg-white"
                      >
                        <option value="AKADEMIK">AKADEMIK</option>
                        <option value="LIBUR">LIBUR RESMI</option>
                        <option value="UJIAN">ASESMEN & UJIAN</option>
                        <option value="KEGIATAN">KEGIATAN SEKOLAH</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Semester</label>
                      <select
                        value={editingItem.data.semester || "GANJIL"}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, semester: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E] bg-white"
                      >
                        <option value="GANJIL">GANJIL</option>
                        <option value="GENAP">GENAP</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Keterangan</label>
                    <textarea
                      rows={2}
                      value={editingItem.data.keterangan || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, keterangan: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                    />
                  </div>
                </>
              )}

              {/* Form UJIAN */}
              {editingItem.type === "UJIAN" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Mata Pelajaran</label>
                      <input
                        type="text"
                        value={editingItem.data.mataPelajaran || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, mataPelajaran: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Hari & Tanggal</label>
                      <input
                        type="text"
                        value={editingItem.data.hariTanggal || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, hariTanggal: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Sesi Ujian</label>
                      <input
                        type="text"
                        value={editingItem.data.sesi || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, sesi: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Waktu Pelaksanaan</label>
                      <input
                        type="text"
                        value={editingItem.data.waktu || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, waktu: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Tingkat Sasaran</label>
                      <input
                        type="text"
                        value={editingItem.data.tingkatLabel || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, tingkatLabel: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Ruang & Moda</label>
                      <input
                        type="text"
                        value={editingItem.data.ruangModa || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, ruangModa: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Koordinator Pengawas</label>
                    <input
                      type="text"
                      value={editingItem.data.koordinator || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, koordinator: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                    />
                  </div>
                </>
              )}

              {/* Form PRESTASI */}
              {editingItem.type === "PRESTASI" && (
                <>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Judul Prestasi / Kejuaraan</label>
                    <input
                      type="text"
                      value={editingItem.data.judul || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, judul: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Peringkat / Juara</label>
                      <input
                        type="text"
                        value={editingItem.data.juara || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, juara: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Tingkat</label>
                      <input
                        type="text"
                        value={editingItem.data.tingkat || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, tingkat: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Tahun</label>
                      <input
                        type="text"
                        value={editingItem.data.tahun || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, tahun: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Kategori Bidang</label>
                      <input
                        type="text"
                        value={editingItem.data.kategori || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, kategori: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Siswa / Tim Peraih</label>
                      <input
                        type="text"
                        value={editingItem.data.peraih || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, peraih: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Foto Piagam / Dokumentasi</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingItem.data.fotoUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, fotoUrl: e.target.value } })}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                      <button
                        type="button"
                        onClick={() => openCropper("Foto Dokumentasi Prestasi", "4:3", (url) => setEditingItem({ ...editingItem, data: { ...editingItem.data, fotoUrl: url } }))}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#2A2C5E] text-white text-[11px] font-semibold rounded-lg hover:bg-[#1F2147] shrink-0"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Unggah</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Deskripsi Prestasi</label>
                    <textarea
                      rows={2}
                      value={editingItem.data.deskripsi || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, deskripsi: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                    />
                  </div>
                </>
              )}

              {/* Form EKSKUL */}
              {editingItem.type === "EKSKUL" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Nama Ekstrakurikuler</label>
                      <input
                        type="text"
                        value={editingItem.data.nama || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, nama: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Kategori</label>
                      <input
                        type="text"
                        value={editingItem.data.kategori || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, kategori: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Guru Pembina</label>
                      <input
                        type="text"
                        value={editingItem.data.pembina || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, pembina: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Jadwal Rutin</label>
                      <input
                        type="text"
                        value={editingItem.data.jadwal || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, jadwal: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Lokasi Latihan</label>
                      <input
                        type="text"
                        value={editingItem.data.lokasi || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, lokasi: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Prestasi Unggulan</label>
                      <input
                        type="text"
                        value={editingItem.data.prestasiUnggulan || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, prestasiUnggulan: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Deskripsi Singkat</label>
                    <textarea
                      rows={2}
                      value={editingItem.data.deskripsi || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, deskripsi: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                    />
                  </div>
                </>
              )}

              {/* Form KBM */}
              {editingItem.type === "KBM" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Rombel / Kelas</label>
                      <input
                        type="text"
                        value={editingItem.data.kelas || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, kelas: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Hari Belajar</label>
                      <select
                        value={editingItem.data.hari || "Senin"}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, hari: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E] bg-white"
                      >
                        <option value="Senin">Senin</option>
                        <option value="Selasa">Selasa</option>
                        <option value="Rabu">Rabu</option>
                        <option value="Kamis">Kamis</option>
                        <option value="Jumat">Jumat</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Jam Pelajaran Ke-</label>
                      <input
                        type="text"
                        value={editingItem.data.jamKe || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, jamKe: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Rentang Waktu</label>
                      <input
                        type="text"
                        value={editingItem.data.waktu || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, waktu: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Mata Pelajaran</label>
                    <input
                      type="text"
                      value={editingItem.data.mapel || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, mapel: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Guru Pengampu</label>
                      <input
                        type="text"
                        value={editingItem.data.guru || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, guru: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Ruang Belajar</label>
                      <input
                        type="text"
                        value={editingItem.data.ruang || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, ruang: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Form BERITA */}
              {editingItem.type === "BERITA" && (
                <>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Judul Warta / Pengumuman</label>
                    <input
                      type="text"
                      value={editingItem.data.judul || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, judul: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Kategori</label>
                      <select
                        value={editingItem.data.kategori || "PENGUMUMAN"}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, kategori: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E] bg-white"
                      >
                        <option value="PENGUMUMAN">Pengumuman Resmi</option>
                        <option value="AKADEMIK">Akademik & Kurikulum</option>
                        <option value="KESISWAAN">Kesiswaan & Ekskul</option>
                        <option value="PRESTASI">Prestasi Sekolah</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700">Nama Penulis</label>
                      <input
                        type="text"
                        value={editingItem.data.penulis || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, penulis: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Foto Sampul (Thumbnail)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingItem.data.thumbnailUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, thumbnailUrl: e.target.value } })}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                      />
                      <button
                        type="button"
                        onClick={() => openCropper("Foto Sampul Berita", "16:9", (url) => setEditingItem({ ...editingItem, data: { ...editingItem.data, thumbnailUrl: url } }))}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#2A2C5E] text-white text-[11px] font-semibold rounded-lg hover:bg-[#1F2147] shrink-0"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Unggah</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Ringkasan</label>
                    <input
                      type="text"
                      value={editingItem.data.ringkasan || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, ringkasan: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Isi Konten Lengkap</label>
                    <textarea
                      rows={5}
                      value={editingItem.data.konten || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, konten: e.target.value } })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2A2C5E]"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2 sticky bottom-0">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-100 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2A2C5E] text-white font-bold text-xs hover:bg-[#1F2147] transition-all shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Cloudinary Image Cropper & Framer Modal */}
      <ImageCropUploadModal
        isOpen={cropModalConfig.isOpen}
        title={cropModalConfig.title}
        defaultAspectRatio={cropModalConfig.aspectRatio}
        onClose={() => setCropModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={cropModalConfig.onSuccess}
      />
    </div>
  );
}
