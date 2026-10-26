"use client";

import { useState } from "react";
import {
  Info,
  Calendar,
  User,
  Clock,
  Search,
  Filter,
  ArrowRight,
  X,
  Share2,
} from "lucide-react";
import { MOCK_BERITA } from "@/lib/mockData";
import { BeritaItem } from "@/lib/types";

export default function InformasiPage() {
  const [selectedKategori, setSelectedKategori] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalBerita, setActiveModalBerita] = useState<BeritaItem | null>(null);

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
          liputan prestasi civitas akademika SMA Negeri 2 Buay Bahuga.
        </p>
        {/* Tab Kategori & Search Bar: Ukuran pas, proporsional, dan seimbang */}
        <div className="pt-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
            {kategoriList.map((kat) => (
              <button
                key={kat.key}
                onClick={() => setSelectedKategori(kat.key)}
                className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
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

      {/* Grid Berita */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBerita.map((berita) => (
          <article
            key={berita.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
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

                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {berita.judul}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {berita.ringkasan}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => setActiveModalBerita(berita)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-[#2A2C5E] bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
              >
                <span>Baca Pengumuman Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Detail Article Modal */}
      {activeModalBerita && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <span className="text-xs font-semibold text-[#2A2C5E] bg-blue-50 px-2.5 py-0.5 rounded capitalize">
                {activeModalBerita.kategori.toLowerCase()}
              </span>
              <button
                onClick={() => setActiveModalBerita(null)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {activeModalBerita.judul}
              </h2>

              <div className="flex items-center gap-4 text-xs text-gray-500 border-b border-gray-100 pb-3">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {activeModalBerita.penulis}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {activeModalBerita.tanggal}
                </span>
              </div>

              <div className="relative h-64 w-full rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeModalBerita.thumbnailUrl}
                  alt={activeModalBerita.judul}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed pt-2">
                {activeModalBerita.konten}
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex justify-end">
              <button
                onClick={() => setActiveModalBerita(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-md"
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
