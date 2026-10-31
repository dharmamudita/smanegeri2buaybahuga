"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLMSStore, PertemuanItem, riwayatKey, RiwayatPengerjaan } from "@/lib/lmsStore";

interface RosterSiswa {
  siswaId: string;
  nama: string;
  nisn: string;
  kelas: string;
}

interface Props {
  classId: string;
  pertemuan: PertemuanItem;
  roster: RosterSiswa[];
}

type FilterStatus = "SEMUA" | "SUDAH" | "BELUM";

export default function RiwayatPengerjaanPanel({ classId, pertemuan, roster }: Props) {
  const riwayatPengerjaan = useLMSStore((s) => s.riwayatPengerjaan);
  const nilaiRiwayat = useLMSStore((s) => s.nilaiRiwayat);

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>("SEMUA");
  const [jawabanTerbuka, setJawabanTerbuka] = useState<string | null>(null);
  const [inputNilai, setInputNilai] = useState<Record<string, string>>({});

  const isEssay = pertemuan.tugas?.tipe === "ESSAY";
  const records: RiwayatPengerjaan[] = useMemo(
    () => riwayatPengerjaan[riwayatKey(classId, pertemuan.id)] || [],
    [riwayatPengerjaan, classId, pertemuan.id]
  );

  // Gabungkan daftar siswa kelas dengan siswa yang sudah mengumpulkan
  const rows = useMemo(() => {
    const map = new Map<string, { siswa: RosterSiswa; record?: RiwayatPengerjaan }>();
    roster.forEach((s) => map.set(s.siswaId, { siswa: s }));
    records.forEach((r) => {
      const existing = map.get(r.siswaId);
      map.set(r.siswaId, {
        siswa: existing?.siswa || { siswaId: r.siswaId, nama: r.nama, nisn: r.nisn, kelas: r.kelas },
        record: r,
      });
    });
    return Array.from(map.values()).sort((a, b) => {
      if (!!a.record !== !!b.record) return a.record ? -1 : 1;
      return a.siswa.nama.localeCompare(b.siswa.nama);
    });
  }, [roster, records]);

  const totalSiswa = rows.length;
  const sudah = rows.filter((r) => r.record).length;
  const dinilai = records.filter((r) => r.nilai !== null);
  const rataRata = dinilai.length
    ? Math.round(dinilai.reduce((a, r) => a + (r.nilai || 0), 0) / dinilai.length)
    : null;
  const menungguNilai = records.filter((r) => r.nilai === null).length;

  const filteredRows = rows.filter((r) =>
    filter === "SEMUA" ? true : filter === "SUDAH" ? !!r.record : !r.record
  );

  const handleSimpanNilai = (siswaId: string) => {
    const val = Number(inputNilai[siswaId]);
    if (Number.isNaN(val) || val < 0 || val > 100) {
      alert("Nilai harus berada di antara 0 sampai 100.");
      return;
    }
    nilaiRiwayat(classId, pertemuan.id, siswaId, val);
    setInputNilai((prev) => {
      const next = { ...prev };
      delete next[siswaId];
      return next;
    });
  };

  return (
    <div className="border-t border-gray-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3 flex items-center justify-between gap-3 text-left hover:bg-gray-50/70 transition-colors cursor-pointer"
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="font-semibold text-gray-800">Riwayat Pengerjaan</span>
          <span className="text-gray-500">
            <strong className="text-gray-900">{sudah}</strong> dari {totalSiswa} siswa mengumpulkan
          </span>
          {rataRata !== null && (
            <span className="text-gray-500">
              Rata-rata <strong className="text-gray-900">{rataRata}</strong>
            </span>
          )}
          {menungguNilai > 0 && (
            <span className="text-gray-500">
              <strong className="text-gray-900">{menungguNilai}</strong> menunggu penilaian
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-[#2A2C5E] shrink-0">
          {open ? "Tutup" : "Lihat Riwayat"}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-3">
          {/* Progres pengumpulan */}
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2A2C5E] rounded-full"
              style={{ width: `${totalSiswa ? (sudah / totalSiswa) * 100 : 0}%` }}
            />
          </div>

          {/* Filter status */}
          <div className="flex items-center gap-1.5">
            {(
              [
                { key: "SEMUA", label: `Semua (${totalSiswa})` },
                { key: "SUDAH", label: `Sudah Mengumpulkan (${sudah})` },
                { key: "BELUM", label: `Belum Mengumpulkan (${totalSiswa - sudah})` },
              ] as { key: FilterStatus; label: string }[]
            ).map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                  filter === f.key
                    ? "bg-[#2A2C5E] text-white border-[#2A2C5E]"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Tabel riwayat */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-semibold text-gray-500">
                  <th className="py-2 px-3 w-10">No</th>
                  <th className="py-2 px-3">Nama Siswa</th>
                  <th className="py-2 px-3">NISN</th>
                  <th className="py-2 px-3">Waktu Pengumpulan</th>
                  <th className="py-2 px-3 text-center w-24">Nilai</th>
                  {isEssay && <th className="py-2 px-3 text-right w-28">Jawaban</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={isEssay ? 6 : 5} className="py-6 text-center text-gray-400">
                      Tidak ada data siswa pada filter ini.
                    </td>
                  </tr>
                )}

                {filteredRows.map(({ siswa, record }, idx) => {
                  const terbuka = jawabanTerbuka === siswa.siswaId;
                  return (
                    <FragmentRow key={siswa.siswaId}>
                      <tr className="hover:bg-gray-50/60">
                        <td className="py-2 px-3 text-gray-400">{idx + 1}</td>
                        <td className="py-2 px-3 font-medium text-gray-900">{siswa.nama}</td>
                        <td className="py-2 px-3 font-mono text-[11px] text-gray-500">{siswa.nisn}</td>
                        <td className="py-2 px-3 text-gray-600">
                          {record ? record.waktuSubmit : <span className="text-gray-400">Belum mengumpulkan</span>}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {!record ? (
                            <span className="text-gray-300">-</span>
                          ) : record.nilai === null ? (
                            <span className="text-[11px] text-gray-500">Belum dinilai</span>
                          ) : (
                            <span className="font-mono font-semibold text-gray-900">{record.nilai}</span>
                          )}
                        </td>
                        {isEssay && (
                          <td className="py-2 px-3 text-right">
                            {record ? (
                              <button
                                type="button"
                                onClick={() => setJawabanTerbuka(terbuka ? null : siswa.siswaId)}
                                className="text-[11px] font-medium text-[#2A2C5E] hover:underline cursor-pointer"
                              >
                                {terbuka ? "Tutup" : "Periksa"}
                              </button>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                        )}
                      </tr>

                      {isEssay && record && terbuka && (
                        <tr className="bg-gray-50/60">
                          <td colSpan={6} className="px-3 py-3">
                            <div className="space-y-2.5">
                              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line bg-white border border-gray-200 rounded-md p-3">
                                {record.jawabanEssay || "Jawaban tidak tersedia."}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-gray-600">Nilai (0 - 100):</span>
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={inputNilai[siswa.siswaId] ?? (record.nilai !== null ? String(record.nilai) : "")}
                                  onChange={(e) =>
                                    setInputNilai((prev) => ({ ...prev, [siswa.siswaId]: e.target.value }))
                                  }
                                  className="w-20 px-2 py-1 bg-white border border-gray-300 rounded-md text-xs font-mono focus:outline-none focus:border-[#2A2C5E]"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSimpanNilai(siswa.siswaId)}
                                  className="px-3 py-1 bg-[#2A2C5E] hover:bg-[#1F2147] text-white text-[11px] font-medium rounded-md cursor-pointer"
                                >
                                  Simpan Nilai
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </FragmentRow>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

