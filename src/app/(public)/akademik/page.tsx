"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  FileCheck2,
  Laptop,
  GraduationCap,
  AlertCircle,
} from "lucide-react";

type AkademikTab = "KALENDER" | "JADWAL_PELAJARAN" | "JADWAL_UJIAN";

function AkademikContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab")?.toUpperCase() as AkademikTab) || "KALENDER";
  const [activeTab, setActiveTab] = useState<AkademikTab>(
    ["KALENDER", "JADWAL_PELAJARAN", "JADWAL_UJIAN"].includes(initialTab)
      ? initialTab
      : "KALENDER"
  );

  const tabs: { key: AkademikTab; label: string }[] = [
    { key: "KALENDER", label: "Kalender Akademik" },
    { key: "JADWAL_PELAJARAN", label: "Jadwal Pelajaran" },
    { key: "JADWAL_UJIAN", label: "Jadwal Ujian" },
  ];

  const jadwalHarian = [
    {
      hari: "Senin",
      jam: "07:15 - 15:30 WIB",
      kegiatan: "Upacara Bendera Mingguan, Bahasa Indonesia, Matematika Tingkat Lanjut, Pendidikan Agama & Budi Pekerti.",
      sesi: "8 Jam Pelajaran (JP)",
    },
    {
      hari: "Selasa",
      jam: "07:15 - 15:30 WIB",
      kegiatan: "Literasi Digital Pagi, Fisika / Sosiologi Terapan, Kimia / Ekonomi Makro, Bahasa Inggris Tingkat Lanjut.",
      sesi: "8 Jam Pelajaran (JP)",
    },
    {
      hari: "Rabu",
      jam: "07:15 - 15:30 WIB",
      kegiatan: "Senam & Pembinaan Karakter, Biologi / Geografi, Informatika Pemrograman & Algoritma, Sejarah Indonesia.",
      sesi: "8 Jam Pelajaran (JP)",
    },
    {
      hari: "Kamis",
      jam: "07:15 - 15:30 WIB",
      kegiatan: "Projek P5 (Penguatan Profil Pelajar Pancasila), Seni Budaya Lampung, Pendidikan Jasmani & Kesehatan.",
      sesi: "8 Jam Pelajaran (JP)",
    },
    {
      hari: "Jumat",
      jam: "07:15 - 11:30 WIB",
      kegiatan: "Jumat Rohani & Sholat Dhuha Berjamaah, Bimbingan Konseling (BK), Pengembangan Minat Bakat Organisasi.",
      sesi: "5 Jam Pelajaran (JP)",
    },
  ];

  const jadwalUjianList = [
    {
      jenis: "Penilaian Tengah Semester (PTS) Ganjil",
      tanggal: "21 - 26 September 2026",
      metode: "CBT Berbasis LMS Terproteksi Anti-Cheat",
      peserta: "Seluruh Tingkat X, XI, XII (450+ Siswa)",
      status: "Terjadwal",
    },
    {
      jenis: "Penilaian Akhir Semester (PAS) Ganjil",
      tanggal: "1 - 10 Desember 2026",
      metode: "CBT Berbasis LMS Lab Multimedia & Android Terkunci",
      peserta: "Seluruh Tingkat X, XI, XII",
      status: "Persiapan Soal",
    },
    {
      jenis: "Asesmen Bakat Minat & Ujian Sekolah Terpadu",
      tanggal: "15 - 20 Maret 2027",
      metode: "CBT Nasional & Portofolio Karya Ilmiah Siswa",
      peserta: "Khusus Kelas XII Calon Alumni",
      status: "Pendaftaran Verifikasi",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Layanan Pendidikan & Kurikulum</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Struktur Akademik & Kurikulum Merdeka
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
          SMAN 2 Buay Bahuga menyelenggarakan Kurikulum Merdeka berorientasi kemandirian sains, jadwal KBM terstruktur, kalender pendidikan terpadu, dan evaluasi berbasis sistem digital.
        </p>

        {/* Sub-Navigation Tabs: Ukuran lebih besar, jelas, dan proporsional */}
        <div className="pt-2">
          <div className="inline-flex flex-wrap items-center gap-2.5 p-2 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
            {tabs.map((tab) => {
              const isSelected = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#2A2C5E] text-white shadow-sm"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200/80 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB 1: KALENDER AKADEMIK */}
      {activeTab === "KALENDER" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Kalender Akademik 2026/2027</h2>
              <p className="text-xs text-gray-500">Agenda resmi kegiatan belajar mengajar semester ganjil & genap</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-2 hover:shadow-md transition-shadow">
              <span className="text-[11px] font-bold text-[#2A2C5E] bg-blue-50 px-2.5 py-1 rounded inline-block">
                15 - 19 Juli 2026
              </span>
              <h4 className="font-bold text-gray-900 text-sm">
                Masa Pengenalan Lingkungan Sekolah (MPLS)
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Orientasi siswa baru tingkat X, pengenalan dewan guru, fasilitas sekolah, dan penandatanganan pakta integritas anti-perundungan.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-2 hover:shadow-md transition-shadow">
              <span className="text-[11px] font-bold text-[#2A2C5E] bg-blue-50 px-2.5 py-1 rounded inline-block">
                21 - 26 September 2026
              </span>
              <h4 className="font-bold text-gray-900 text-sm">
                Penilaian Tengah Semester (PTS) Berbasis LMS
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Evaluasi formatif tengah semester terintegrasi ujian anti-cheat dengan proteksi pergantian tab dan dynamic watermark.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-2 hover:shadow-md transition-shadow">
              <span className="text-[11px] font-bold text-[#2A2C5E] bg-blue-50 px-2.5 py-1 rounded inline-block">
                1 - 10 Desember 2026
              </span>
              <h4 className="font-bold text-gray-900 text-sm">
                Penilaian Akhir Semester (PAS) & Pembagian Rapor
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ujian komprehensif semester ganjil, pengolahan nilai e-Rapor, serta penyerahan buku laporan hasil belajar kepada orang tua murid.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: JADWAL PELAJARAN */}
      {activeTab === "JADWAL_PELAJARAN" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Jadwal Pelajaran Reguler</h2>
              <p className="text-xs text-gray-500">Struktur alokasi jam tatap muka dan distribusi mata pelajaran mingguan</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="divide-y divide-gray-100">
              {jadwalHarian.map((j) => (
                <div key={j.hari} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-extrabold text-[#2A2C5E]">{j.hari}</span>
                      <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">{j.jam}</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{j.kegiatan}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#2A2C5E] bg-blue-50 px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
                    {j.sesi}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: JADWAL UJIAN */}
      {activeTab === "JADWAL_UJIAN" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Jadwal & Ketentuan Ujian Berbasis LMS</h2>
              <p className="text-xs text-gray-500">Sistem asesmen terproteksi anti-kecurangan untuk menjamin integritas nilai</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jadwalUjianList.map((uj) => (
              <div
                key={uj.jenis}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                      {uj.status}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{uj.tanggal}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 leading-snug">{uj.jenis}</h3>
                  <div className="flex items-start gap-2 text-xs text-gray-600 pt-1">
                    <Laptop className="w-4 h-4 text-[#2A2C5E] shrink-0 mt-0.5" />
                    <span>{uj.metode}</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 text-xs text-gray-500">
                  Target Peserta: {uj.peserta}
                </div>
              </div>
            ))}
          </div>

          {/* Protokol Ujian Anti-Cheat */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-5 text-xs text-gray-700 space-y-2">
            <div className="flex items-center gap-2 text-[#2A2C5E] font-bold text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Protokol Keamanan Ujian Daring SMAN 2 Buay Bahuga</span>
            </div>
            <p className="leading-relaxed">
              Selama ujian berlangsung, sistem LMS menerapkan penguncian tab browser otomatis, dynamic watermark 3% opasitas dengan identitas siswa, serta AI-disruptor prompt injection untuk mencegah penggunaan bot atau ChatGPT. Pelanggaran tercatat otomatis di server pengawas.
            </p>
          </div>
        </section>
      )}

      {/* Program Jurusan / Konsentrasi Kurikulum Merdeka */}
      {activeTab === "KALENDER" && (
        <section className="space-y-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Konsentrasi Program Peminatan</h2>
              <p className="text-xs text-gray-500">Fase E & Fase F Kurikulum Merdeka</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2A2C5E] bg-blue-50 px-2.5 py-1 rounded inline-block">
                Program Sains
              </span>
              <h3 className="text-base font-bold text-gray-900">Matematika dan Ilmu Pengetahuan Alam (MIPA)</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Fokus riset terapan, bioteknologi, fisika rekayasa, kimia analitik, dan matematika peminatan lanjutan menuju perguruan tinggi kedokteran & teknik.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded inline-block">
                Program Sosial & Humaniora
              </span>
              <h3 className="text-base font-bold text-gray-900">Ilmu Pengetahuan Sosial (IPS)</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Membangun daya analitis sosiologi, dinamika perekonomian global, akuntansi keuangan lembaga, geografi, dan hukum kebijakan publik.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function AkademikPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-xs text-gray-400">Memuat data akademik...</div>}>
      <AkademikContent />
    </Suspense>
  );
}
