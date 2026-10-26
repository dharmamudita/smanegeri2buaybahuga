"use client";

import { useState } from "react";
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
} from "lucide-react";
import { MOCK_MATERI, MOCK_MAPEL } from "@/lib/mockData";
import { MateriItem } from "@/lib/types";

export default function GuruMapelPage() {
  const [materiList, setMateriList] = useState<MateriItem[]>(MOCK_MATERI);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<"PDF" | "VIDEO" | "DOKUMEN">("PDF");
  const [newMapelId, setNewMapelId] = useState(MOCK_MAPEL[0].id);

  const handleAddMateri = (e: React.FormEvent) => {
    e.preventDefault();
    const item: MateriItem = {
      id: `materi-${Date.now()}`,
      mapelId: newMapelId,
      judul: newTitle,
      deskripsi: newDesc,
      tipe: newType,
      fileUrl: "#",
      tanggalUnggah: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      ukuranFile: "3.5 MB",
    };
    setMateriList([item, ...materiList]);
    setShowUploadModal(false);
    setNewTitle("");
    setNewDesc("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus materi ajar ini?")) {
      setMateriList(materiList.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manajemen Materi Pembelajaran</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Pengelolaan Modul & Bahan Ajar Digital
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Unggah berkas modul (PDF/Video) yang dapat diunduh oleh siswa di kelas.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-md shadow-2xs self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Unggah Modul Baru</span>
        </button>
      </div>

      {/* List Materi */}
      <div className="space-y-4">
        {materiList.map((materi) => {
          const mapel = MOCK_MAPEL.find((m) => m.id === materi.mapelId);
          return (
            <div
              key={materi.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#2A2C5E] transition-colors"
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
                      {materi.tanggalUnggah}
                    </span>
                    {materi.ukuranFile && (
                      <>
                        <span>&bull;</span>
                        <span>{materi.ukuranFile}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => handleDelete(materi.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md border border-red-200"
                  title="Hapus Modul"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-gray-200">
            <div className="border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                Unggah Modul Pembelajaran Baru
              </h3>
              <p className="text-xs text-gray-500">
                Lengkapi formulir di bawah ini untuk menerbitkan materi bagi siswa.
              </p>
            </div>

            <form onSubmit={handleAddMateri} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Mata Pelajaran *</label>
                <select
                  value={newMapelId}
                  onChange={(e) => setNewMapelId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                >
                  {MOCK_MAPEL.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama} ({m.tingkat} {m.jurusan})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Judul Modul / Materi *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Bab 4: Sintesis Protein dan Kode Genetik"
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Deskripsi / Petunjuk Baca</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Ringkasan poin esensial materi untuk siswa"
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Format Materi</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                  >
                    <option value="PDF">Dokumen PDF</option>
                    <option value="VIDEO">Video Interaktif</option>
                    <option value="DOKUMEN">Modul DOCX / PPTX</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Pilih Berkas</label>
                  <input
                    type="file"
                    className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-[#2A2C5E]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-md shadow-xs"
                >
                  Terbitkan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
