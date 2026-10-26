"use client";

import { useState } from "react";
import {
  Award,
  FileSpreadsheet,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import DataTable, { Column, DataTableFilter } from "@/components/common/DataTable";

interface NilaiRow {
  id: string;
  nisn: string;
  nama: string;
  kelas: string;
  mapel: string;
  nilaiTugas: number;
  nilaiKuis: number;
  nilaiUjian: number;
  nilaiAkhir: number;
  predikat: string;
}

const MOCK_NILAI: NilaiRow[] = [
  {
    id: "1",
    nisn: "0078129341",
    nama: "Dharma Mudita Pratama",
    kelas: "XII MIPA 1",
    mapel: "Biologi",
    nilaiTugas: 95,
    nilaiKuis: 90,
    nilaiUjian: 92,
    nilaiAkhir: 93,
    predikat: "A (Amat Baik)",
  },
  {
    id: "2",
    nisn: "0078129342",
    nama: "Anisa Putri Lestari",
    kelas: "XII MIPA 1",
    mapel: "Biologi",
    nilaiTugas: 92,
    nilaiKuis: 88,
    nilaiUjian: 90,
    nilaiAkhir: 90,
    predikat: "A (Amat Baik)",
  },
  {
    id: "3",
    nisn: "0081234567",
    nama: "Rizky Ramadhani",
    kelas: "XI IPS 2",
    mapel: "Sosiologi",
    nilaiTugas: 85,
    nilaiKuis: 80,
    nilaiUjian: 84,
    nilaiAkhir: 83,
    predikat: "B (Baik)",
  },
  {
    id: "4",
    nisn: "0081234568",
    nama: "Bagas Saputra",
    kelas: "XII MIPA 1",
    mapel: "Biologi",
    nilaiTugas: 88,
    nilaiKuis: 85,
    nilaiUjian: 86,
    nilaiAkhir: 86,
    predikat: "B (Baik)",
  },
  {
    id: "5",
    nisn: "0081234569",
    nama: "Citra Dewi",
    kelas: "XII MIPA 1",
    mapel: "Biologi",
    nilaiTugas: 90,
    nilaiKuis: 92,
    nilaiUjian: 94,
    nilaiAkhir: 93,
    predikat: "A (Amat Baik)",
  },
];

export default function GuruRekapNilaiPage() {
  const [dataNilai, setDataNilai] = useState<NilaiRow[]>(MOCK_NILAI);

  const filters: DataTableFilter[] = [
    {
      key: "kelas",
      label: "Kelas",
      options: [
        { label: "XII MIPA 1", value: "XII MIPA 1" },
        { label: "XI IPS 2", value: "XI IPS 2" },
      ],
    },
    {
      key: "mapel",
      label: "Mata Pelajaran",
      options: [
        { label: "Biologi", value: "Biologi" },
        { label: "Sosiologi", value: "Sosiologi" },
      ],
    },
  ];

  const columns: Column<NilaiRow>[] = [
    {
      header: "Nama Siswa / NISN",
      cell: (row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.nama}</div>
          <div className="text-[11px] text-gray-500 font-mono">
            NISN: {row.nisn} ({row.kelas})
          </div>
        </div>
      ),
    },
    {
      header: "Mata Pelajaran",
      accessorKey: "mapel",
    },
    {
      header: "Tugas",
      accessorKey: "nilaiTugas",
      className: "text-center font-mono font-medium",
    },
    {
      header: "Kuis",
      accessorKey: "nilaiKuis",
      className: "text-center font-mono font-medium",
    },
    {
      header: "Ujian",
      accessorKey: "nilaiUjian",
      className: "text-center font-mono font-medium",
    },
    {
      header: "Nilai Akhir",
      cell: (row) => (
        <span className="font-mono font-bold text-[#2E4BA3] text-sm">
          {row.nilaiAkhir}
        </span>
      ),
      className: "text-center",
    },
    {
      header: "Predikat Capaian",
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold ${
            row.predikat.startsWith("A")
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-blue-50 text-[#2E4BA3] border border-blue-200"
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          {row.predikat}
        </span>
      ),
    },
  ];

  const handleExportSpreadsheet = () => {
    alert(
      "Sinkronisasi Google Sheets API berhasil! File 'Rekap_Nilai_SMAN2_Buay_Bahuga.xlsx' telah siap diunduh."
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2E4BA3] text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Pengolahan & Pelaporan Nilai</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Rekapitulasi Capaian Belajar Siswa
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Data rekapitulasi nilai formatif, sumatif, dan ujian anti-cheat terintegrasi dengan Google Sheets API.
          </p>
        </div>

        <button
          onClick={handleExportSpreadsheet}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md shadow-2xs self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Ekspor Google Sheets / Excel</span>
        </button>
      </div>

      {/* Data Table */}
      <div className="space-y-4">
        <DataTable
          title="Daftar Nilai Siswa Binaan"
          subtitle="Tabel dengan pencarian nama/NISN, filter kelas & mapel, serta pagination"
          data={dataNilai}
          columns={columns}
          filters={filters}
          pageSize={10}
        />
      </div>
    </div>
  );
}
