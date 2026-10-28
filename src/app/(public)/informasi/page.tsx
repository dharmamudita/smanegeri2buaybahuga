"use client";

import { useState, useEffect } from "react";
import {
  Info,
  Calendar,
  User,
  Clock,
  Search,
  ArrowLeft,
  ArrowRight,
  X,
  Share2,
  Check,
  MapPin,
} from "lucide-react";
import { useBeritaStore } from "@/lib/store";
import { BeritaItem } from "@/lib/types";
import PaginationBar from "@/components/common/PaginationBar";

const ITEMS_PER_PAGE = 6;

function getBeritaGaleri(berita: BeritaItem): string[] {
  if (berita.galeriUrls && berita.galeriUrls.length >= 3) {
    return berita.galeriUrls;
  }

  const fallbackByKategori: Record<string, [string, string]> = {
    PENGUMUMAN: [
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
    ],
    PRESTASI: [
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80",
    ],
    AKADEMIK: [
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80",
    ],
    KESISWAAN: [
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80",
    ],
  };

  const extra = fallbackByKategori[berita.kategori] || fallbackByKategori.PENGUMUMAN;
  return [berita.thumbnailUrl, extra[0], extra[1]];
}

export default function InformasiPage() {
  const beritaList = useBeritaStore((state) => state.beritaList);
  const [selectedKategori, setSelectedKategori] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeModalBerita, setActiveModalBerita] = useState<BeritaItem | null>(null);
  const [slideTrackIdx, setSlideTrackIdx] = useState<number>(1);
  const [isSlideTransitioning, setIsSlideTransitioning] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const modalPhotos = activeModalBerita ? getBeritaGaleri(activeModalBerita) : [];
  const extendedModalPhotos =
    modalPhotos.length > 0
      ? [
          modalPhotos[modalPhotos.length - 1],
          ...modalPhotos,
          modalPhotos[0],
        ]
      : [];
  const realSlideIndex =
    modalPhotos.length > 0
      ? (slideTrackIdx - 1 + modalPhotos.length) % modalPhotos.length
      : 0;

  // Jalankan auto-slide maju setiap 3.5 detik tanpa pernah mundur ke belakang (Seamless Infinite Loop)
  useEffect(() => {
    if (!activeModalBerita || modalPhotos.length <= 1) return;

    const timer = setInterval(() => {
      setIsSlideTransitioning(true);
      setSlideTrackIdx((prev) =>
        prev >= modalPhotos.length + 1 ? prev : prev + 1
      );
    }, 3500);

    return () => clearInterval(timer);
  }, [activeModalBerita, modalPhotos.length, slideTrackIdx]);

  // Reset posisi secara tak terlihat saat mencapai slide bayangan di ujung kanan/kiri
  useEffect(() => {
    if (modalPhotos.length <= 1) return;
    if (slideTrackIdx === modalPhotos.length + 1) {
      const snapTimer = setTimeout(() => {
        setIsSlideTransitioning(false);
        setSlideTrackIdx(1);
      }, 500);
      return () => clearTimeout(snapTimer);
    }
    if (slideTrackIdx === 0) {
      const snapTimer = setTimeout(() => {
        setIsSlideTransitioning(false);
        setSlideTrackIdx(modalPhotos.length);
      }, 500);
      return () => clearTimeout(snapTimer);
    }
  }, [slideTrackIdx, modalPhotos.length]);

  useEffect(() => {
    if (!isSlideTransitioning) {
      const enableTimer = setTimeout(() => {
        setIsSlideTransitioning(true);
      }, 50);
      return () => clearTimeout(enableTimer);
    }
  }, [isSlideTransitioning]);

  const kategoriList = [
    { key: "ALL", label: "Semua Kategori" },
    { key: "PENGUMUMAN", label: "Pengumuman" },
    { key: "AKADEMIK", label: "Akademik" },
    { key: "KESISWAAN", label: "Kesiswaan" },
    { key: "PRESTASI", label: "Prestasi" },
  ];

  const filteredBerita = beritaList.filter((item) => {
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

  const totalPages = Math.max(1, Math.ceil(filteredBerita.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedBerita = filteredBerita.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

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

        {/* Tab Kategori & Search Bar: Sejajar Presisi di Mobile maupun Desktop */}
        <div className="pt-1.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap sm:inline-flex items-center gap-1.5 sm:gap-2 p-1.5 bg-white rounded-xl border border-gray-200 shadow-2xs w-full sm:w-auto">
            {kategoriList.map((kat) => (
              <button
                key={kat.key}
                onClick={() => {
                  setSelectedKategori(kat.key);
                  setCurrentPage(1);
                }}
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

          {/* Search Box Presisi */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari warta berita..."
              className="w-full h-[46px] pl-9 pr-3.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E] shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Grid Berita (Maksimal 6 Kartu Per Halaman & Sejajar Lurus Antar-Kartu) */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {paginatedBerita.map((berita, idx) => (
            <article
              key={berita.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between h-full"
            >
              <div className="flex flex-col">
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={berita.thumbnailUrl}
                    alt={berita.judul}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-[#2A2C5E] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded capitalize">
                      {berita.kategori.toLowerCase()}
                    </span>
                    {safePage === 1 && idx === 0 && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        Terbaru
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex flex-col">
                  {/* Baris 1: Tanggal & Waktu Baca (Tinggi Terkunci) */}
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 h-5">
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

                  {/* Baris 2: Judul Berita (Tinggi 2 Baris Terkunci Sejajar) */}
                  <div className="mt-2.5 h-11 flex items-start">
                    <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">
                      {berita.judul}
                    </h3>
                  </div>

                  {/* Baris 3: Ringkasan Berita (Tinggi 3 Baris Terkunci Sejajar) */}
                  <div className="mt-2 h-[3.75rem] flex items-start">
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {berita.ringkasan}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    setIsSlideTransitioning(false);
                    setSlideTrackIdx(1);
                    setActiveModalBerita(berita);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#2A2C5E] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Baca Pengumuman Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Navigasi Halaman (Pagination) di Bawah 6 Kartu Berita */}
        <PaginationBar
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={filteredBerita.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          itemLabel="informasi"
        />
      </div>

      {/* Detail Article Modal (Tampilan Berita Rapi & Presisi Ketika Diklik) */}
      {activeModalBerita && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs"
          onClick={() => setActiveModalBerita(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Bar Berita */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-20">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-[#2A2C5E] px-3 py-1 rounded-md">
                {activeModalBerita.kategori}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleCopyShare(activeModalBerita.id, activeModalBerita.judul)
                  }
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-gray-200 hover:border-[#2A2C5E] text-xs font-semibold text-gray-700 hover:text-[#2A2C5E] transition-colors cursor-pointer"
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
                  className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Konten Utama Artikel Berita */}
            <div className="p-6 sm:p-8 space-y-5">
              {/* Judul Berita */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug tracking-tight">
                {activeModalBerita.judul}
              </h2>

              {/* Baris Informasi Penulis, Tanggal, Waktu Baca, & Lokasi */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 border-b border-gray-100 pb-4">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#2A2C5E]">
                  <User className="w-3.5 h-3.5" />
                  {activeModalBerita.penulis}
                </span>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {activeModalBerita.tanggal}
                </span>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {activeModalBerita.bacaMenit} Menit Baca
                </span>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  SMAN 2 Buay Bahuga
                </span>
              </div>

              {/* Slider 3 Foto Berita (Seamless Infinite Loop Tiap 3.5 Detik) */}
              <div className="relative h-60 sm:h-80 w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                <div
                  className={`flex w-full h-full ${
                    isSlideTransitioning
                      ? "transition-transform duration-500 ease-out"
                      : "transition-none"
                  }`}
                  style={{ transform: `translateX(-${slideTrackIdx * 100}%)` }}
                >
                  {extendedModalPhotos.map((photoUrl, idx) => (
                    <div key={idx} className="w-full h-full shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoUrl}
                        alt={`${activeModalBerita.judul} - Foto ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Indikator Nomor Foto (Pojok Kanan Atas) */}
                <span className="absolute top-3 right-3 bg-black/45 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                  {realSlideIndex + 1} / {modalPhotos.length}
                </span>

                {/* Tombol Geser Kiri Modern Glassmorphism */}
                <button
                  type="button"
                  onClick={() => {
                    if (slideTrackIdx <= 0) return;
                    setIsSlideTransitioning(true);
                    setSlideTrackIdx((prev) => prev - 1);
                  }}
                  className="group/btn absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/35 hover:bg-[#2A2C5E] backdrop-blur-md border border-white/25 hover:border-white/50 text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Foto Sebelumnya"
                >
                  <ArrowLeft
                    strokeWidth={2.25}
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 group-hover/btn:-translate-x-0.5"
                  />
                </button>

                {/* Tombol Geser Kanan Modern Glassmorphism */}
                <button
                  type="button"
                  onClick={() => {
                    if (slideTrackIdx >= modalPhotos.length + 1) return;
                    setIsSlideTransitioning(true);
                    setSlideTrackIdx((prev) => prev + 1);
                  }}
                  className="group/btn absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/35 hover:bg-[#2A2C5E] backdrop-blur-md border border-white/25 hover:border-white/50 text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Foto Berikutnya"
                >
                  <ArrowRight
                    strokeWidth={2.25}
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 group-hover/btn:translate-x-0.5"
                  />
                </button>

                {/* Indikator Titik Slide di Bawah Tengah */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full shadow-md">
                  {modalPhotos.map((_, idx) => {
                    const isCurrent = idx === realSlideIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setIsSlideTransitioning(true);
                          setSlideTrackIdx(idx + 1);
                        }}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          isCurrent ? "w-6 bg-white shadow-xs" : "w-2 bg-white/50 hover:bg-white/85"
                        }`}
                        aria-label={`Pilih Foto ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Isi Berita Lengkap */}
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed pt-1">
                {activeModalBerita.konten}
              </div>
            </div>

            {/* Footer Berita: Media Sosial Resmi di Pojok Kiri & Tombol Tutup di Pojok Kanan */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Pojok Kiri Bawah: Media Sosial Resmi */}
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-white border border-gray-200 hover:border-pink-500 text-xs font-semibold text-gray-700 hover:text-pink-600 transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 text-pink-600 shrink-0"
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
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-white border border-gray-200 hover:border-red-500 text-xs font-semibold text-gray-700 hover:text-red-600 transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 text-red-600 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                  <span>SMAN 2 Buay Bahuga</span>
                </a>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-white border border-gray-200 hover:border-[#2A2C5E] text-xs font-semibold text-gray-700 hover:text-[#2A2C5E] transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 text-[#2A2C5E] shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <span>SMAN 2 Buay Bahuga</span>
                </a>
              </div>

              {/* Pojok Kanan Bawah: Tombol Tutup */}
              <button
                type="button"
                onClick={() => setActiveModalBerita(null)}
                className="h-9 px-5 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1f2147] rounded-lg transition-colors cursor-pointer self-end sm:self-auto"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
