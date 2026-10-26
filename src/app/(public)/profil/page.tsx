"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  Users,
  MapPin,
  Award,
  Layers,
  GraduationCap,
  ShieldCheck,
  Compass,
  Monitor,
  FlaskConical,
  BookMarked,
  Trophy,
  Heart,
} from "lucide-react";
import { SCHOOL_INFO } from "@/lib/constants";
import { MOCK_USERS } from "@/lib/mockData";

type ProfilTab =
  | "VISI_MISI"
  | "STRUKTUR_ORGANISASI"
  | "GURU_STAFF"
  | "IDENTITAS_SEKOLAH"
  | "FASILITAS";

function ProfilContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab")?.toUpperCase() as ProfilTab) || "VISI_MISI";
  const [activeTab, setActiveTab] = useState<ProfilTab>(
    ["VISI_MISI", "STRUKTUR_ORGANISASI", "GURU_STAFF", "IDENTITAS_SEKOLAH", "FASILITAS"].includes(initialTab)
      ? initialTab
      : "VISI_MISI"
  );

  const tabs: { key: ProfilTab; label: string }[] = [
    { key: "VISI_MISI", label: "Visi Misi" },
    { key: "STRUKTUR_ORGANISASI", label: "Struktur Organisasi" },
    { key: "GURU_STAFF", label: "Guru & Staff" },
    { key: "IDENTITAS_SEKOLAH", label: "Identitas Sekolah" },
    { key: "FASILITAS", label: "Fasilitas" },
  ];

  const guruList = MOCK_USERS.filter((u) => u.role === "GURU");

  const fasilitasData = [
    {
      nama: "Laboratorium Komputer Multimedia & CBT",
      deskripsi:
        "Dilengkapi 40 unit PC workstation terkoneksi LAN gigabit untuk pelaksanaan Ujian Anti-Cheat, AKM, dan pembelajaran pemrograman.",
      icon: Monitor,
      kapasitas: "40 Siswa",
    },
    {
      nama: "Laboratorium Sains IPA Terpadu",
      deskripsi:
        "Fasilitas praktikum Fisika, Kimia, dan Biologi lengkap dengan mikroskop binokuler, alat destilasi, dan kit praktikum Kurikulum Merdeka.",
      icon: FlaskConical,
      kapasitas: "36 Siswa",
    },
    {
      nama: "Perpustakaan Digital Ki Hajar Dewantara",
      deskripsi:
        "Koleksi 5.000+ buku fisik dan akses e-book interaktif, ruang baca ber-AC, serta terminal pencarian katalog daring (OPAC).",
      icon: BookMarked,
      kapasitas: "60 Siswa",
    },
    {
      nama: "Lapangan Olahraga Multifungsi",
      deskripsi:
        "Area olahraga terbuka standar untuk basket, futsal, voli, bulutangkis, serta kegiatan upacara bendera mingguan.",
      icon: Trophy,
      kapasitas: "500+ Siswa",
    },
    {
      nama: "Ruang Unit Kesehatan Sekolah (UKS)",
      deskripsi:
        "Pelayanan pertolongan medis pertama, ranjang istirahat terpisah putra/putri, serta pendampingan rutin dari Puskesmas Buay Bahuga.",
      icon: Heart,
      kapasitas: "4 Ranjang Medis",
    },
    {
      nama: "Masjid Baitul 'Ilmi SMAN 2 Buay Bahuga",
      deskripsi:
        "Pusat pembinaan spiritual dan ibadah berjamaah, kegiatan keputrian, kajian Rohis, serta sholat dhuha dan dhuhur rutin siswa.",
      icon: Compass,
      kapasitas: "350 Jamaah",
    },
  ];

  const strukturPimpinan = [
    {
      jabatan: "Kepala Sekolah",
      nama: "Drs. H. Ahmad Dahlan, M.Pd.",
      nip: "19680512 199403 1 005",
      keterangan: "Penanggung Jawab Kebijakan Strategis Lembaga",
    },
    {
      jabatan: "Wakil Kepala Sekolah Bidang Kurikulum",
      nama: "Siti Rahmawati, S.Pd., M.Si.",
      nip: "19780415 200312 2 004",
      keterangan: "Pengembangan Kurikulum Merdeka & Supervisi Mutu KBM",
    },
    {
      jabatan: "Wakil Kepala Sekolah Bidang Kesiswaan",
      nama: "Budi Santoso, S.Pd.",
      nip: "19820921 200801 1 012",
      keterangan: "Pembinaan Disiplin, Karakter Siswa, & Ekstrakurikuler",
    },
    {
      jabatan: "Wakil Kepala Sekolah Bidang Sarana & Prasarana",
      nama: "Joko Supriyanto, S.T.",
      nip: "19800310 200604 1 008",
      keterangan: "Pemeliharaan Infrastruktur & Fasilitas Digital Kampus",
    },
    {
      jabatan: "Wakil Kepala Sekolah Bidang Hubungan Masyarakat",
      nama: "Nurul Hidayah, S.Sos.",
      nip: "19850118 201001 2 015",
      keterangan: "Kemitraan DUDI, Perguruan Tinggi, & Komunikasi Komite",
    },
    {
      jabatan: "Kepala Tata Usaha & Administrasi Kepegawaian",
      nama: "Haryono, S.A.P.",
      nip: "19750802 199803 1 003",
      keterangan: "Manajemen Dapodik, Surat Menyurat, & Keuangan Sekolah",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold">
          <Building2 className="w-3.5 h-3.5" />
          <span>Profil Lembaga Pendidikan</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Profil Resmi SMAN 2 Buay Bahuga
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
          Mengenal lebih dekat identitas institusi, arah visi misi keunggulan, jajaran dewan guru pendidik, struktur kepemimpinan, dan fasilitas sarana pembelajaran modern.
        </p>

        {/* Sub-Navigation Tabs: Ukuran pas, proporsional, dan seimbang */}
        <div className="pt-1.5">
          <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
            {tabs.map((tab) => {
              const isSelected = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#2A2C5E] text-white shadow-xs"
                      : "bg-gray-100/90 text-gray-700 hover:bg-gray-200/80 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB 1: VISI & MISI */}
      {activeTab === "VISI_MISI" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Visi, Misi & Tujuan Institusi</h2>
              <p className="text-xs text-gray-500">Arah strategis pembinaan karakter dan keunggulan akademik</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visi */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-2xs space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2A2C5E] bg-blue-50 px-3 py-1 rounded">
                Visi Sekolah
              </span>
              <h3 className="text-xl font-bold text-gray-900 leading-snug">
                &ldquo;Terwujudnya Generasi Cendekia yang Berakhlak Mulia, Unggul dalam Sains Teknologi, Berjiwa Wirausaha, dan Berwawasan Lingkungan Global.&rdquo;
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Visi ini menjadi landasan seluruh program strategis pembelajaran Kurikulum Merdeka di SMA Negeri 2 Buay Bahuga dalam mencetak profil Pelajar Pancasila yang tangguh menghadapi tantangan era digital.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-2xs space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded">
                Misi Strategis
              </span>
              <ul className="space-y-3 text-xs text-gray-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Menanamkan nilai-nilai keimanan, ketakwaan, dan budi pekerti luhur dalam keseharian madani.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Melaksanakan pembelajaran sains dan teknologi terintegrasi Smart School & LMS terproteksi anti-kecurangan.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Mengembangkan bakat minat siswa melalui 12 cabang ekstrakurikuler kepemimpinan dan keolahragaan.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Mewujudkan lingkungan sekolah yang asri, bersih, berbudaya mutu, dan ramah anak.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: STRUKTUR ORGANISASI */}
      {activeTab === "STRUKTUR_ORGANISASI" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Struktur Organisasi Kepemimpinan</h2>
              <p className="text-xs text-gray-500">Bagan kepengurusan dan pimpinan manajemen sekolah tahun ajaran 2026/2027</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {strukturPimpinan.map((pim) => (
              <div
                key={pim.jabatan}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-2.5 hover:shadow-md transition-shadow"
              >
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#2A2C5E] bg-blue-50 px-2.5 py-1 rounded inline-block">
                  {pim.jabatan}
                </div>
                <h4 className="text-base font-bold text-gray-900">{pim.nama}</h4>
                <p className="text-xs text-gray-500 font-mono">NIP: {pim.nip}</p>
                <p className="text-xs text-gray-600 pt-2 border-t border-gray-100 leading-relaxed">
                  {pim.keterangan}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: GURU & STAFF */}
      {activeTab === "GURU_STAFF" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Dewan Guru & Tenaga Kependidikan</h2>
              <p className="text-xs text-gray-500">Pendidik profesional bersertifikasi dalam mendampingi peserta didik</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {guruList.map((guru) => (
              <div
                key={guru.id}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-[#2A2C5E] font-bold text-lg overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={guru.avatarUrl}
                    alt={guru.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {guru.name}
                  </h4>
                  <p className="text-xs text-[#2A2C5E] font-medium mt-0.5">
                    {guru.mataPelajaran}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    NUPTK: {guru.nuptk}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: IDENTITAS SEKOLAH */}
      {activeTab === "IDENTITAS_SEKOLAH" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Identitas Resmi & Legalitas Sekolah</h2>
              <p className="text-xs text-gray-500">Data pokok pendidikan terdaftar resmi pada Kemendikbudristek RI</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 text-xs">
              <div className="p-6 space-y-3.5">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Nama Sekolah</span>
                  <span className="font-bold text-gray-900">{SCHOOL_INFO.nama}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Nomor Pokok Sekolah Nasional (NPSN)</span>
                  <span className="font-bold text-[#2A2C5E] font-mono">{SCHOOL_INFO.npsn}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Peringkat Akreditasi</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Terakreditasi {SCHOOL_INFO.akreditasi}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Bentuk Pendidikan</span>
                  <span className="font-medium text-gray-900">Sekolah Menengah Atas (SMA)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-500">Status Sekolah</span>
                  <span className="font-medium text-gray-900">Negeri</span>
                </div>
              </div>

              <div className="p-6 space-y-3.5">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Alamat Kampus</span>
                  <span className="font-medium text-gray-900 text-right max-w-xs">{SCHOOL_INFO.alamat}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Kecamatan / Kabupaten</span>
                  <span className="font-medium text-gray-900">{SCHOOL_INFO.kecamatan}, {SCHOOL_INFO.kabupaten}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Provinsi / Kode Pos</span>
                  <span className="font-medium text-gray-900">{SCHOOL_INFO.provinsi} - {SCHOOL_INFO.kodePos}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Koordinat Geofencing Presensi</span>
                  <span className="font-mono text-gray-900 text-right">
                    Lat {SCHOOL_INFO.koordinat.latitude}, Lng {SCHOOL_INFO.koordinat.longitude}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-500">Radius Toleransi Presensi</span>
                  <span className="font-bold text-[#2A2C5E]">{SCHOOL_INFO.koordinat.radiusMaksimalMeter} Meter</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 5: FASILITAS */}
      {activeTab === "FASILITAS" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Fasilitas & Sarana Kampus</h2>
              <p className="text-xs text-gray-500">Infrastruktur pendukung kenyamanan belajar dan eksplorasi teknologi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fasilitasData.map((fas) => {
              const Icon = fas.icon;
              return (
                <div
                  key={fas.nama}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2A2C5E] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded">
                      {fas.kapasitas}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 leading-snug">{fas.nama}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{fas.deskripsi}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default function ProfilPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-xs text-gray-400">Memuat profil...</div>}>
      <ProfilContent />
    </Suspense>
  );
}
