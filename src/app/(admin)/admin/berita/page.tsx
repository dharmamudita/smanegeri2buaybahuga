"use client";

import { useState } from "react";
import {
  FileText,
  PlusCircle,
  Calendar,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import DataTable, { Column, DataTableFilter } from "@/components/common/DataTable";
import { MOCK_BERITA } from "@/lib/mockData";
import { BeritaItem } from "@/lib/types";

export default function AdminBeritaPage() {
  const [beritaList, setBeritaList] = useState<BeritaItem[]>(MOCK_BERITA);
  const [showModal, setShowModal] = useState(false);
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState<"PENGUMUMAN" | "AKADEMIK" | "KESISWAAN" | "PRESTASI">("PENGUMUMAN");
  const [ringkasan, setRingkasan] = useState("");
  const [konten, setKonten] = useState("");

  const handleAddBerita = (e: React.FormEvent) => {
    e.preventDefault();
    const item: BeritaItem = {
      id: `berita-${Date.now()}`,
      slug: judul.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      judul,
      ringkasan,
      konten,
      kategori,
      penulis: "Administrator SMAN 2 Buay Bahuga",
      tanggal: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      bacaMenit: 3,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80",
    };
    setBeritaList([item, ...beritaList]);
    setShowModal(false);
    setJudul("");
    setRingkasan("");
    setKonten("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus artikel pengumuman ini?")) {
      setBeritaList(beritaList.filter((b) => b.id !== id));
    }
  };

  const filters: DataTableFilter[] = [
    {
      key: "kategori",
      label: "Kategori Warta",
      options: [
        { label: "Pengumuman", value: "PENGUMUMAN" },
        { label: "Akademik", value: "AKADEMIK" },
        { label: "Kesiswaan", value: "KESISWAAN" },
        { label: "Prestasi", value: "PRESTASI" },
      ],
    },
  ];

  const columns: Column<BeritaItem>[] = [
    {
      header: "Judul Informasi & Tanggal",
      cell: (row) => (
        <div>
          <div className="font-semibold text-gray-900 leading-snug">
            {row.judul}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {row.tanggal} &bull; Oleh {row.penulis}
          </div>
        </div>
      ),
    },
    {
      header: "Kategori",
      cell: (row) => (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#2E4BA3] border border-blue-100">
          {row.kategori}
        </span>
      ),
    },
    {
      header: "Ringkasan Singkat",
      cell: (row) => (
        <span className="text-xs text-gray-500 line-clamp-2 max-w-sm">
          {row.ringkasan}
        </span>
      ),
    },
    {
      header: "Status Publikasi",
      cell: () => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Terbit
        </span>
      ),
    },
    {
      header: "Aksi",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-red-200"
            title="Hapus Artikel"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2E4BA3] text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Content Management System (CMS)</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Manajemen Warta Berita & Pengumuman
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Publikasikan rilis pengumuman resmi dan artikel sekolah ke portal publik SMAN 2 Buay Bahuga.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#2E4BA3] hover:bg-[#233b82] rounded-md shadow-2xs self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tulis Pengumuman Baru</span>
        </button>
      </div>

      {/* Data Table */}
      <div className="space-y-4">
        <DataTable
          title="Daftar Artikel & Pengumuman Resmi"
          subtitle="Tabel artikel dengan pencarian judul, filter kategori, dan pagination"
          data={beritaList}
          columns={columns}
          filters={filters}
          pageSize={10}
        />
      </div>

      {/* Modal Tulis Berita */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-gray-200">
            <div className="border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                Tulis Berita / Pengumuman Baru
              </h3>
              <p className="text-xs text-gray-500">
                Artikel akan langsung muncul di halaman beranda dan portal informasi publik.
              </p>
            </div>

            <form onSubmit={handleAddBerita} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Judul Pengumuman *</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Jadwal Pelaksanaan Ujian Penilaian Akhir Semester"
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Kategori Artikel *</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md font-semibold text-[#2E4BA3]"
                >
                  <option value="PENGUMUMAN">PENGUMUMAN</option>
                  <option value="AKADEMIK">AKADEMIK</option>
                  <option value="KESISWAAN">KESISWAAN</option>
                  <option value="PRESTASI">PRESTASI</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Ringkasan Singkat (Lead) *</label>
                <textarea
                  rows={2}
                  required
                  value={ringkasan}
                  onChange={(e) => setRingkasan(e.target.value)}
                  placeholder="1-2 kalimat pengantar yang akan tampil pada kartu beranda"
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Isi Berita / Dokumen Lengkap *</label>
                <textarea
                  rows={4}
                  required
                  value={konten}
                  onChange={(e) => setKonten(e.target.value)}
                  placeholder="Tuliskan isi pengumuman atau instruksi lengkap untuk pembaca..."
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2E4BA3] hover:bg-[#233b82] rounded-md shadow-xs"
                >
                  Terbitkan Pengumuman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
