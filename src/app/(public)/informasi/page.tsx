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
  Newspaper,
  Bell,
  ExternalLink,
  Check,
  MapPin,
  Mail,
  Phone,
  FileText,
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
        item.ringkasan.toLowerCase().includes(q) ||
        item.penulis.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const headlineBerita = filteredBerita.length > 0 ? filteredBerita[0] : null;
  const regularBerita =
    filteredBerita.length > 1 ? filteredBerita.slice(1) : filteredBerita;

  const handleCopyShare = (id: string, judul: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${judul} - SMAN 2 Buay Bahuga (https://smandabuba.com/informasi)`);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getKategoriBadgeStyle = (kategori: string) => {
    switch (kategori) {
      case "PRESTASI":
        return "bg-emerald-700 text-white";
      case "PENGUMUMAN":
        return "bg-amber-600 text-white";
      case "AKADEMIK":
        return "bg-[#2A2C5E] text-white";
      case "KESISWAAN":
        return "bg-indigo-700 text-white";
      default:
        return "bg-[#2A2C5E] text-white";
    }
  };

  const edaranResmiList = [
    {
      nomor: "No. 421.3/114/SMAN2-BB/X/2026",
      judul: "Edaran Pelaksanaan Penilaian Akhir Semester (PAS) Ganjil TP 2026/2027",
      tanggal: "24 Okt 2026",
      beritaId: "berita-6",
    },
    {
      nomor: "No. 421.3/109/SMAN2-BB/X/2026",
      judul: "Sosialisasi Jalur PPDB & Pemantapan Sarana Laboratorium Sekolah",
      tanggal: "20 Okt 2026",
      beritaId: "berita-1",
    },
    {
      nomor: "No. 421.3/098/SMAN2-BB/X/2026",
      judul: "Surat Keputusan Pelantikan Pengurus OSIS & MPK Masa Bakti 2026/2027",
      tanggal: "05 Okt 2026",
      beritaId: "berita-5",
    },
  ];

  const socialChannels = [
    {
      nama: "Instagram Resmi",
      handle: "@sman2buaybahuga",
      deskripsi: "Galeri dokumentasi kegiatan harian, ekskul, & prestasi siswa",
      url: "https://instagram.com",
      warnaBg: "bg-pink-50 border-pink-200 text-pink-700",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      nama: "YouTube Channel",
      handle: "SMAN 2 Buay Bahuga Official",
      deskripsi: "Video profil sekolah, karya seni FLS2N, & siaran acara",
      url: "https://youtube.com",
      warnaBg: "bg-red-50 border-red-200 text-red-700",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      ),
    },
    {
      nama: "Facebook Halaman Resmi",
      handle: "SMA Negeri 2 Buay Bahuga",
      deskripsi: "Informasi pengumuman warga sekolah, komite, & ikatan alumni",
      url: "https://facebook.com",
      warnaBg: "bg-blue-50 border-blue-200 text-[#2A2C5E]",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      nama: "Layanan Informasi Humas",
      handle: "0852-6337-6378 (WhatsApp)",
      deskripsi: "Pelayanan konfirmasi surat edaran, akademik, & PPDB",
      url: "https://wa.me/6285263376378",
      warnaBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header Halaman */}
      <div className="space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold">
          <Newspaper className="w-3.5 h-3.5" />
          <span>Portal Warta & Humas Sekolah</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Pusat Informasi, Berita & Pengumuman Resmi
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
          Rilis berita terkini kegiatan sekolah, edaran akademik resmi, agenda kesiswaan, serta liputan prestasi peserta didik SMA Negeri 2 Buay Bahuga.
        </p>

        {/* Tab Kategori & Pencarian Berita */}
        <div className="pt-1.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
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
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul berita atau topik..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E] shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* SOROTAN BERITA UTAMA (HEADLINE EDITORIAL) */}
      {headlineBerita && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden hover:shadow-md transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Gambar Headline */}
            <div className="lg:col-span-7 relative min-h-[240px] sm:min-h-[320px] bg-gray-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={headlineBerita.thumbnailUrl}
                alt={headlineBerita.judul}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="bg-[#2A2C5E] text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-md shadow-xs">
                  Sorotan Utama
                </span>
                <span
                  className={`${getKategoriBadgeStyle(
                    headlineBerita.kategori
                  )} text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs`}
                >
                  {headlineBerita.kategori}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-3 text-xs text-white/90">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  {headlineBerita.tanggal}
                </span>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-blue-200" />
                  {headlineBerita.penulis}
                </span>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-300" />
                  {headlineBerita.bacaMenit} Menit Baca
                </span>
              </div>
            </div>

            {/* Konten Headline */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2A2C5E]">
                  <Info className="w-3.5 h-3.5" />
                  <span>Warta Redaksi SMAN 2 Buay Bahuga</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 leading-snug">
                  {headlineBerita.judul}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {headlineBerita.ringkasan}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModalBerita(headlineBerita)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2A2C5E] hover:bg-[#1f2147] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>Baca Berita Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyShare(headlineBerita.id, headlineBerita.judul)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
                  title="Salin Tautan Berita"
                >
                  {copiedId === headlineBerita.id ? (
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAYOUT 2 KOLOM: DAFTAR BERITA (KIRI) & PANEL PENGUMUMAN + MEDSOS RESMI (KANAN) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* KOLOM KIRI (8 KOLOM): INDEKS BERITA & WARTA TERKINI */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center">
                <Newspaper className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Indeks Berita & Liputan Kegiatan
              </h2>
            </div>
            <span className="text-xs font-semibold text-gray-500">
              Menampilkan {filteredBerita.length} Warta
            </span>
          </div>

          {filteredBerita.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center space-y-2">
              <p className="text-sm font-bold text-gray-800">
                Tidak ada berita yang ditemukan
              </p>
              <p className="text-xs text-gray-500">
                Silakan ubah kata kunci pencarian atau pilih kategori informasi lainnya.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              {(filteredBerita.length > 2 ? regularBerita : filteredBerita).map((berita) => (
                <article
                  key={berita.id}
                  className="group bg-white rounded-xl border border-gray-200 hover:border-[#2A2C5E] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between h-full"
                >
                  <div className="flex flex-col">
                    {/* Foto Thumbnail Berita */}
                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={berita.thumbnailUrl}
                        alt={berita.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <span
                        className={`absolute top-3 left-3 ${getKategoriBadgeStyle(
                          berita.kategori
                        )} text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-2xs`}
                      >
                        {berita.kategori}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyShare(berita.id, berita.judul)}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                        title="Bagikan Berita"
                      >
                        {copiedId === berita.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Isi Kartu Berita (Tinggi Terkunci Agar Sebaris Lurus Antar-Kolom) */}
                    <div className="p-5 flex flex-col">
                      {/* Baris 1: Tanggal & Waktu Baca */}
                      <div className="flex items-center gap-2.5 text-[11px] text-gray-500 h-5">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3 text-[#2A2C5E]" />
                          {berita.tanggal}
                        </span>
                        <span>&bull;</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {berita.bacaMenit} Menit Baca
                        </span>
                      </div>

                      {/* Baris 2: Judul Berita (Tinggi 2 Baris Terkunci) */}
                      <div className="mt-2 min-h-[2.75rem] flex items-start">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#2A2C5E] transition-colors leading-snug line-clamp-2">
                          {berita.judul}
                        </h3>
                      </div>

                      {/* Baris 3: Ringkasan Berita (Tinggi 3 Baris Terkunci) */}
                      <div className="mt-2 min-h-[3.6rem] flex items-start">
                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                          {berita.ringkasan}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Baris 4: Footer Penulis & Tombol Baca */}
                  <div className="px-5 py-3.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-600 truncate">
                      <User className="w-3.5 h-3.5 text-[#2A2C5E] shrink-0" />
                      <span className="truncate">{berita.penulis}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setActiveModalBerita(berita)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#2A2C5E] hover:underline shrink-0 cursor-pointer"
                    >
                      <span>Baca</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* KOLOM KANAN (4 KOLOM): EDARAN RESMI & MEDIA SOSIAL RESMI SEKOLAH */}
        <aside className="lg:col-span-4 space-y-6">
          {/* WIDGET 1: PAPAN EDARAN & PENGUMUMAN RESMI */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="bg-[#2A2C5E] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-300" />
                <h3 className="text-xs sm:text-sm font-bold tracking-wide">
                  Papan Surat Edaran Resmi
                </h3>
              </div>
              <span className="text-[10px] font-semibold bg-white/15 px-2 py-0.5 rounded">
                Terbaru
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {edaranResmiList.map((edaran) => {
                const targetBerita = MOCK_BERITA.find((b) => b.id === edaran.beritaId);
                return (
                  <button
                    key={edaran.nomor}
                    type="button"
                    onClick={() => targetBerita && setActiveModalBerita(targetBerita)}
                    className="w-full text-left p-4 hover:bg-blue-50/40 transition-colors space-y-1.5 cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px] font-semibold text-gray-400">
                      <span className="inline-flex items-center gap-1 text-[#2A2C5E] bg-blue-50 px-2 py-0.5 rounded">
                        <FileText className="w-3 h-3" />
                        {edaran.nomor}
                      </span>
                      <span>{edaran.tanggal}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-800 hover:text-[#2A2C5E] leading-snug">
                      {edaran.judul}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* WIDGET 2: KANAL MEDIA SOSIAL RESMI SEKOLAH (POJOK KANAN) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs p-5 space-y-4">
            <div className="space-y-1 border-b border-gray-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A2C5E]">
                Jejaring Digital Resmi
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-gray-900">
                Media Sosial SMAN 2 Buay Bahuga
              </h3>
              <p className="text-[11px] text-gray-500">
                Ikuti kanal resmi sekolah untuk pembaruan dokumentasi dan pengumuman harian
              </p>
            </div>

            <div className="space-y-2.5">
              {socialChannels.map((medsos) => (
                <a
                  key={medsos.nama}
                  href={medsos.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 p-3 rounded-xl border border-gray-150 hover:border-[#2A2C5E] hover:bg-gray-50/80 transition-all"
                >
                  <div
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${medsos.warnaBg}`}
                  >
                    {medsos.icon}
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#2A2C5E]">
                        {medsos.nama}
                      </p>
                      <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-[#2A2C5E] shrink-0" />
                    </div>
                    <p className="text-[11px] font-semibold text-[#2A2C5E] truncate">
                      {medsos.handle}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-snug">
                      {medsos.deskripsi}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* WIDGET 3: KONTAK REDAKSI HUMAS SEKOLAH */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-3 text-xs">
            <h4 className="font-bold text-gray-900 text-sm">
              Sekretariat Humas & Informasi
            </h4>
            <div className="space-y-2 text-gray-600">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#2A2C5E] shrink-0 mt-0.5" />
                <span>
                  Jl. Ryacudu No. 04, Kampung Suka Agung, Kec. Buay Bahuga, Kab. Way Kanan, Lampung 34767
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#2A2C5E] shrink-0" />
                <span>0852-6337-6378 (Jam Kerja 07:30 - 15:30 WIB)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#2A2C5E] shrink-0" />
                <span>sman2buaybahuga@gmail.com</span>
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL BACA ARTIKEL BERITA LENGKAP */}
      {activeModalBerita && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            {/* Header Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span
                  className={`${getKategoriBadgeStyle(
                    activeModalBerita.kategori
                  )} text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded`}
                >
                  {activeModalBerita.kategori}
                </span>
                <span className="text-xs text-gray-500 hidden sm:inline">
                  &bull; Warta Resmi SMAN 2 Buay Bahuga
                </span>
              </div>
              <button
                onClick={() => setActiveModalBerita(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Isi Artikel */}
            <div className="p-6 sm:p-8 space-y-5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                {activeModalBerita.judul}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 border-b border-gray-100 pb-4">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#2A2C5E]">
                  <User className="w-3.5 h-3.5" />
                  {activeModalBerita.penulis}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {activeModalBerita.tanggal}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {activeModalBerita.bacaMenit} Menit Baca
                </span>
              </div>

              <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeModalBerita.thumbnailUrl}
                  alt={activeModalBerita.judul}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed pt-1">
                {activeModalBerita.konten}
              </div>
            </div>

            {/* Footer Modal dengan Bagikan Medsos di Pojok Kiri & Tombol Tutup di Kanan */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">Bagikan Warta:</span>
                <button
                  type="button"
                  onClick={() => handleCopyShare(activeModalBerita.id, activeModalBerita.judul)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-[#2A2C5E] text-xs font-semibold text-gray-700 cursor-pointer"
                >
                  {copiedId === activeModalBerita.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tautan Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-[#2A2C5E]" />
                      <span>Salin Tautan</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => setActiveModalBerita(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2A2C5E] hover:bg-[#1f2147] rounded-lg cursor-pointer"
              >
                Tutup Artikel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
