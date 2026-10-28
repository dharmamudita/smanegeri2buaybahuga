"use client";

import { useState } from "react";
import {
  Info,
  Calendar,
  User,
  Clock,
  Search,
  ArrowRight,
  X,
  Share2,
  Check,
  MapPin,
  ShieldCheck,
  Camera,
} from "lucide-react";
import { MOCK_BERITA } from "@/lib/mockData";
import { BeritaItem } from "@/lib/types";

export default function InformasiPage() {
  const [selectedKategori, setSelectedKategori] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalBerita, setActiveModalBerita] = useState<BeritaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const kategoriList = [
    { key: "ALL", label: "Semua Kategori" },
    { key: "PENGUMUMAN", label: "Pengumuman" },
    { key: "AKADEMIK", label: "Akademik" },
    { key: "KESISWAAN", label: "Kesiswaan" },
    { key: "PRESTASI", label: "Prestasi" },
  ];

  const filteredBerita = MOCK_BERITA.filter((item) => {
    if (selectedKategori !== "ALL" && item.kategori !== selectedKategori) {
      return false;
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        item.judul.toLowerCase().includes(q) ||
        item.ringkasan.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopyShare = (id: string, judul: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `${judul} - SMAN 2 Buay Bahuga (https://smandabuba.com/informasi)`
      );
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold">
          <Info className="w-3.5 h-3.5" />
          <span>Warta Informasi & Pengumuman</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Pusat Informasi & Kabar Sekolah
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
          Temukan rilis pengumuman akademik resmi, jadwal kegiatan sekolah, dan
          liputan prestasi siswa-siswi SMA Negeri 2 Buay Bahuga.
        </p>

        {/* Tab Kategori & Search Bar: Rapi dan pas penuh di dalam kotak baik di Mobile maupun Desktop */}
        <div className="pt-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap sm:inline-flex items-center gap-1.5 sm:gap-2 p-1.5 bg-white rounded-xl border border-gray-200 shadow-2xs w-full sm:w-auto">
            {kategoriList.map((kat) => (
              <button
                key={kat.key}
                onClick={() => setSelectedKategori(kat.key)}
                className={`flex-1 sm:flex-initial text-center justify-center px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedKategori === kat.key
                    ? "bg-[#2A2C5E] text-white shadow-xs"
                    : "bg-gray-100/90 text-gray-700 hover:bg-gray-200/80 hover:text-gray-900"
                }`}
              >
                {kat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari warta berita..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E] shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Grid Berita (Tetap 3 Kolom Seperti Semula & Sejajar Rapi) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filteredBerita.map((berita) => (
          <article
            key={berita.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between h-full"
          >
            <div>
              <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={berita.thumbnailUrl}
                  alt={berita.judul}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#2A2C5E] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded capitalize">
                  {berita.kategori.toLowerCase()}
                </span>
              </div>

              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {berita.tanggal}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {berita.bacaMenit} Menit Baca
                  </span>
                </div>

                <div className="min-h-[2.75rem] flex items-start">
                  <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">
                    {berita.judul}
                  </h3>
                </div>

                <div className="min-h-[3.6rem] flex items-start">
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {berita.ringkasan}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => setActiveModalBerita(berita)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-[#2A2C5E] bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
              >
                <span>Baca Pengumuman Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Detail Article Modal (Tampilan Berita Profesional Ketika Diklik + Medsos di Bawah Pojok Kiri/Kanan) */}
      {activeModalBerita && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs"
          onClick={() => setActiveModalBerita(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Top Bar Redaksi */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-xs border-b border-gray-200 px-5 sm:px-7 py-3.5 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-[#2A2C5E] px-2.5 py-1 rounded">
                  {activeModalBerita.kategori}
                </span>
                <span className="text-xs font-semibold text-gray-500 hidden sm:inline">
                  &bull; Portal Warta Resmi SMAN 2 Buay Bahuga
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleCopyShare(activeModalBerita.id, activeModalBerita.judul)
                  }
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-[#2A2C5E] text-xs font-semibold text-gray-700 hover:text-[#2A2C5E] transition-colors cursor-pointer"
                  title="Salin Tautan Berita"
                >
                  {copiedId === activeModalBerita.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Bagikan</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalBerita(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Konten Utama Artikel Berita */}
            <div className="p-5 sm:p-8 space-y-6">
              {/* Judul & Info Redaksi */}
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug tracking-tight">
                  {activeModalBerita.judul}
                </h2>

                {/* Baris Penulis, Tanggal, Lokasi, & Waktu Baca */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#2A2C5E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 leading-tight">
                        {activeModalBerita.penulis}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Redaksi Humas & Publikasi Sekolah
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#2A2C5E]" />
                      {activeModalBerita.tanggal}
                    </span>
                    <span>&bull;</span>
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#2A2C5E]" />
                      {activeModalBerita.bacaMenit} Menit Baca
                    </span>
                    <span>&bull;</span>
                    <span className="inline-flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#2A2C5E]" />
                      Buay Bahuga, Way Kanan
                    </span>
                  </div>
                </div>
              </div>

              {/* Foto Liputan Utama + Caption Jurnalistik */}
              <figure className="space-y-2">
                <div className="relative h-60 sm:h-80 w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeModalBerita.thumbnailUrl}
                    alt={activeModalBerita.judul}
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="flex items-center gap-1.5 text-[11px] text-gray-500 italic px-1">
                  <Camera className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>
                    Dokumentasi Humas SMAN 2 Buay Bahuga — {activeModalBerita.judul}.
                  </span>
                </figcaption>
              </figure>

              {/* Ringkasan Sorotan (Lead Paragraph) */}
              <div className="p-4 rounded-xl bg-blue-50/60 border-l-4 border-[#2A2C5E] text-xs sm:text-sm font-medium text-gray-800 leading-relaxed">
                {activeModalBerita.ringkasan}
              </div>

              {/* Batang Tubuh Berita */}
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed space-y-3">
                <span className="font-extrabold text-[#2A2C5E]">
                  BUAY BAHUGA, SMANDABUBA —{" "}
                </span>
                {activeModalBerita.konten}
              </div>

              {/* Kotak Verifikasi Informasi Resmi */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3 text-xs text-gray-600">
                <ShieldCheck className="w-5 h-5 text-[#2A2C5E] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-gray-900">
                    Informasi Resmi Terverifikasi — SMA Negeri 2 Buay Bahuga (NPSN: 10810192)
                  </p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Diterbitkan melalui Pusat Informasi & Kehumasan SMAN 2 Buay Bahuga di bawah koordinasi Kepala Sekolah, Ibu Apriyani, S.Si., M.M.Pd.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Artikel Berita: Medsos Resmi di Pojok Kiri Bawah & Tombol Aksi di Pojok Kanan Bawah */}
            <div className="bg-gray-50 border-t border-gray-200 px-5 sm:px-7 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Pojok Kiri Bawah: Kanal Media Sosial Resmi Sekolah */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Ikuti Media Sosial Resmi SMAN 2 Buay Bahuga
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-pink-500 text-[11px] font-semibold text-gray-700 hover:text-pink-600 transition-colors shadow-2xs"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 text-pink-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    <span>@sman2buaybahuga</span>
                  </a>

                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-red-500 text-[11px] font-semibold text-gray-700 hover:text-red-600 transition-colors shadow-2xs"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                    </svg>
                    <span>SMAN 2 Buay Bahuga TV</span>
                  </a>

                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-[#2A2C5E] text-[11px] font-semibold text-gray-700 hover:text-[#2A2C5E] transition-colors shadow-2xs"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 text-[#2A2C5E]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                    <span>SMAN 2 Buay Bahuga</span>
                  </a>
                </div>
              </div>

              {/* Pojok Kanan Bawah: Tombol Tutup Berita */}
              <div className="flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveModalBerita(null)}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1f2147] rounded-lg transition-colors cursor-pointer"
                >
                  Tutup Berita
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
