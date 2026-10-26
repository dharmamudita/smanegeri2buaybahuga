"use client";

import { useState } from "react";
import {
  BookOpen,
  FileText,
  Video,
  Download,
  Calendar,
  User,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { MOCK_MAPEL, MOCK_MATERI } from "@/lib/mockData";

export default function SiswaMapelPage() {
  const [selectedMapelId, setSelectedMapelId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredMateri = MOCK_MATERI.filter((materi) => {
    if (selectedMapelId !== "ALL" && materi.mapelId !== selectedMapelId) {
      return false;
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        materi.judul.toLowerCase().includes(q) ||
        materi.deskripsi.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>E-Learning & Modul Pembelajaran</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Ruang Materi Pelajaran Terdaftar
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Akses modul ajar digital, video interaktif, dan panduan belajar dari dewan guru.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Mapel Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-700">Mata Pelajaran:</span>
          <select
            value={selectedMapelId}
            onChange={(e) => setSelectedMapelId(e.target.value)}
            className="text-xs font-semibold bg-white border border-gray-300 rounded-md py-1.5 px-3 text-[#2A2C5E]"
          >
            <option value="ALL">Semua Mata Pelajaran</option>
            {MOCK_MAPEL.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nama} ({m.tingkat} {m.jurusan})
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul modul..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
          />
        </div>
      </div>

      {/* List Materi Pelajaran */}
      <div className="space-y-4">
        {filteredMateri.map((materi) => {
          const mapel = MOCK_MAPEL.find((m) => m.id === materi.mapelId);
          return (
            <div
              key={materi.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs hover:border-[#2A2C5E] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    materi.tipe === "VIDEO"
                      ? "bg-purple-50 text-purple-600"
                      : "bg-blue-50 text-[#2A2C5E]"
                  }`}
                >
                  {materi.tipe === "VIDEO" ? (
                    <Video className="w-6 h-6" />
                  ) : (
                    <FileText className="w-6 h-6" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {materi.tipe}
                    </span>
                    <span className="text-xs font-semibold text-[#2A2C5E]">
                      {mapel?.nama}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 leading-snug">
                    {materi.judul}
                  </h3>

                  <p className="text-xs text-gray-600 max-w-2xl leading-relaxed">
                    {materi.deskripsi}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Diunggah: {materi.tanggalUnggah}
                    </span>
                    {materi.ukuranFile && (
                      <>
                        <span>&bull;</span>
                        <span>Ukuran: {materi.ukuranFile}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() =>
                    alert(`Mengunduh materi resmi: ${materi.judul}`)
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-md shadow-2xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Modul</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
