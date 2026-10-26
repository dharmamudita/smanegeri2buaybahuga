"use client";

import { useState } from "react";
import {
  ClipboardList,
  PlusCircle,
  Clock,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { MOCK_TUGAS, MOCK_MAPEL } from "@/lib/mockData";
import { TugasItem } from "@/lib/types";

export default function GuruTugasPage() {
  const [tugasList, setTugasList] = useState<TugasItem[]>(MOCK_TUGAS);
  const [showModal, setShowModal] = useState(false);
  const [judul, setJudul] = useState("");
  const [tipe, setTipe] = useState<"TUGAS" | "KUIS" | "UJIAN_HARIAN">("UJIAN_HARIAN");
  const [durasi, setDurasi] = useState(30);
  const [tenggat, setTenggat] = useState("30 Oktober 2026, 23:59 WIB");
  const [mapelId, setMapelId] = useState(MOCK_MAPEL[0].id);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const mapel = MOCK_MAPEL.find((m) => m.id === mapelId);
    const item: TugasItem = {
      id: `tugas-${Date.now()}`,
      mapelId,
      mapelNama: mapel?.nama || "Biologi",
      judul,
      deskripsi: "Soal ujian terproteksi anti-kecurangan SMAN 2 Buay Bahuga.",
      tipe,
      durasiMenit: durasi,
      tenggatWaktu: tenggat,
      totalPoin: 100,
      statusSiswa: "BELUM_MENGERJAKAN",
    };
    setTugasList([item, ...tugasList]);
    setShowModal(false);
    setJudul("");
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2E4BA3] text-xs font-semibold mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Bank Soal & Penilaian</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Pembuatan Tugas & Ujian Terproteksi
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Konfigurasi soal pilihan ganda dengan fitur watermark identitas dan deteksi alih tab browser.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#2E4BA3] hover:bg-[#233b82] rounded-md shadow-2xs self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Ujian / Tugas Baru</span>
        </button>
      </div>

      {/* List Tugas & Ujian */}
      <div className="space-y-4">
        {tugasList.map((tugas) => (
          <div
            key={tugas.id}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#2E4BA3] transition-colors"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    tugas.tipe.startsWith("UJIAN")
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-blue-50 text-[#2E4BA3] border border-blue-200"
                  }`}
                >
                  {tugas.tipe}
                </span>
                <span className="text-xs font-semibold text-[#2E4BA3]">
                  {tugas.mapelNama}
                </span>
              </div>

              <h3 className="text-sm font-bold text-gray-900 leading-snug">
                {tugas.judul}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                {tugas.durasiMenit && (
                  <span className="flex items-center gap-1 text-[#2E4BA3] font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    Durasi: {tugas.durasiMenit} Menit
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Tenggat: {tugas.tenggatWaktu}
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Total Poin: {tugas.totalPoin}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() =>
                  setTugasList(tugasList.filter((t) => t.id !== tugas.id))
                }
                className="p-2 text-red-600 hover:bg-red-50 rounded-md border border-red-200"
                title="Hapus Tugas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Buat Tugas / Ujian Baru */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-gray-200">
            <div className="border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                Buat Tugas / Ujian Anti-Cheat Baru
              </h3>
              <p className="text-xs text-gray-500">
                Lengkapi pengaturan batas waktu dan perlindungan integritas.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Mata Pelajaran *</label>
                <select
                  value={mapelId}
                  onChange={(e) => setMapelId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                >
                  {MOCK_MAPEL.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Judul Ujian / Tugas *</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Penilaian Harian: Struktur Sel dan Metabolisme"
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Tipe Evaluasi</label>
                  <select
                    value={tipe}
                    onChange={(e) => setTipe(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                  >
                    <option value="UJIAN_HARIAN">Ujian Harian (Anti-Cheat)</option>
                    <option value="KUIS">Kuis Cepat</option>
                    <option value="TUGAS">Tugas Mandiri</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Durasi Pengerjaan</label>
                  <input
                    type="number"
                    value={durasi}
                    onChange={(e) => setDurasi(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                    placeholder="Menit"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Tenggat Waktu</label>
                <input
                  type="text"
                  value={tenggat}
                  onChange={(e) => setTenggat(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Layar ujian akan otomatis dilengkapi Watermark Opacity 3% dan Injeksi Prompt AI OCR rahasia.
                </span>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
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
                  Publikasikan Ujian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
