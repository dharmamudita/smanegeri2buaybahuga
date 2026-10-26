"use client";

import { useState } from "react";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Download,
  AlertCircle,
  FileText,
} from "lucide-react";
import DataTable, { Column, DataTableFilter } from "@/components/common/DataTable";
import { MOCK_PPDB } from "@/lib/mockData";
import { PPDBRecord } from "@/lib/types";

export default function AdminPPDBPage() {
  const [ppdbList, setPpdbList] = useState<PPDBRecord[]>(MOCK_PPDB);

  const handleUpdateStatus = (
    id: string,
    newStatus: "DIVERIFIKASI" | "DITERIMA" | "DITOLAK"
  ) => {
    setPpdbList(
      ppdbList.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const filters: DataTableFilter[] = [
    {
      key: "status",
      label: "Status Seleksi",
      options: [
        { label: "Menunggu Verifikasi", value: "MENUNGGU_VERIFIKASI" },
        { label: "Diverifikasi", value: "DIVERIFIKASI" },
        { label: "Diterima", value: "DITERIMA" },
        { label: "Ditolak", value: "DITOLAK" },
      ],
    },
    {
      key: "pilihanJurusan",
      label: "Pilihan Jurusan",
      options: [
        { label: "Peminatan MIPA", value: "MIPA" },
        { label: "Peminatan IPS", value: "IPS" },
      ],
    },
  ];

  const columns: Column<PPDBRecord>[] = [
    {
      header: "No. Pendaftaran & Nama",
      cell: (row) => (
        <div>
          <div className="font-mono font-bold text-[#2A2C5E] text-xs">
            {row.nomorPendaftaran}
          </div>
          <div className="font-semibold text-gray-900 mt-0.5">
            {row.namaLengkap}
          </div>
          <div className="text-[11px] text-gray-400">
            NISN: {row.nisn} &bull; Asal: {row.asalSekolah}
          </div>
        </div>
      ),
    },
    {
      header: "Pilihan Jurusan",
      cell: (row) => (
        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
            row.pilihanJurusan === "MIPA"
              ? "bg-blue-50 text-[#2A2C5E] border-blue-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {row.pilihanJurusan}
        </span>
      ),
    },
    {
      header: "Berkas Lampiran",
      cell: (row) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-gray-600">
            <FileText className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-mono text-[11px]">
              {row.berkasIjazah || "ijazah_scan.pdf"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <FileText className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-mono text-[11px]">
              {row.berkasKK || "kk_scan.pdf"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Status Verifikasi",
      cell: (row) => {
        if (row.status === "DITERIMA") {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Diterima
            </span>
          );
        }
        if (row.status === "DIVERIFIKASI") {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-[#2A2C5E] border border-blue-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Berkas Sah
            </span>
          );
        }
        if (row.status === "DITOLAK") {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
              <XCircle className="w-3.5 h-3.5" />
              Ditolak
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Menunggu
          </span>
        );
      },
    },
    {
      header: "Tindakan Panitia",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status !== "DITERIMA" && (
            <button
              onClick={() => handleUpdateStatus(row.id, "DITERIMA")}
              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
            >
              Terima
            </button>
          )}
          {row.status !== "DITOLAK" && (
            <button
              onClick={() => handleUpdateStatus(row.id, "DITOLAK")}
              className="px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors"
            >
              Tolak
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold mb-2">
          <FileCheck className="w-3.5 h-3.5" />
          <span>Panitia Seleksi PPDB Online</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Verifikasi Berkas Calon Siswa Baru (PPDB 2026/2027)
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Validasi berkas pendaftaran, asal sekolah, dan persetujuan penerimaan siswa baru SMAN 2 Buay Bahuga.
        </p>
      </div>

      {/* Data Table */}
      <div className="space-y-4">
        <DataTable
          title="Daftar Berkas Calon Siswa Baru"
          subtitle="Tabel pendaftaran dengan pencarian nama/NISN/Nomor registrasi, filter status, dan pagination"
          data={ppdbList}
          columns={columns}
          filters={filters}
          pageSize={10}
        />
      </div>
    </div>
  );
}
