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
import { useCMSStore } from "@/lib/cmsStore";
import PaginationBar from "@/components/common/PaginationBar";

const FASILITAS_PER_PAGE = 6;

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

  const [fasilitasPage, setFasilitasPage] = useState<number>(1);
  const { profil, beranda } = useCMSStore();
  const guruList = profil.guruStaff && profil.guruStaff.length > 0
    ? profil.guruStaff
    : MOCK_USERS.filter((u) => u.role === "GURU");
  const strukturPimpinan = profil.strukturOrganisasi && profil.strukturOrganisasi.length > 0
    ? profil.strukturOrganisasi
    : [];

  const fasilitasData = [
    {
      nama: "28 Ruang Kelas Belajar Representatif",
      deskripsi:
        "Ruang belajar untuk 29 rombongan belajar (983 siswa) yang nyaman, berventilasi sehat, dan mendukung proses KBM Kurikulum Merdeka.",
      icon: Building2,
      kapasitas: "28 Ruang Kelas",
    },
    {
      nama: "9 Unit Laboratorium Sains & Komputer CBT",
      deskripsi:
        "Mencakup Laboratorium Komputer Multimedia untuk Asesmen Nasional (ANBK), serta Laboratorium Biologi, Fisika, Kimia, dan Bahasa.",
      icon: FlaskConical,
      kapasitas: "9 Unit Lab",
    },
    {
      nama: "Perpustakaan Sekolah SMAN 2 Buay Bahuga",
      deskripsi:
        "Pusat literasi yang menyediakan ribuan koleksi buku teks utama Kurikulum Merdeka, referensi pengayaan PTN, dan ruang baca siswa.",
      icon: BookMarked,
      kapasitas: "1 Gedung Utama",
    },
    {
      nama: "Lapangan Olahraga & Lahan Sekolah 20.000 m²",
      deskripsi:
        "Lingkungan sekolah seluas 2 hektar dengan fasilitas lapangan upacara, futsal, bola voli, karate, pencak silat, dan taman sekolah ASRI.",
      icon: Trophy,
      kapasitas: "Lahan 20.000 m²",
    },
    {
      nama: "Ruang Unit Kesehatan Sekolah (UKS)",
      deskripsi:
        "Pelayanan kesehatan dasar siswa, fasilitas pertolongan pertama (PMR), serta koordinasi kesehatan berkala bersama Puskesmas Buay Bahuga.",
      icon: Heart,
      kapasitas: "Layanan Medis",
    },
    {
      nama: "Mushola Al-Hikmah & Sarana Bina Imtaq",
      deskripsi:
        "Pusat kegiatan keagamaan, ibadah sholat berjamaah, kajian Rohis, dan pembinaan akhlak mulia warga SMA Negeri 2 Buay Bahuga.",
      icon: Compass,
      kapasitas: "Seluruh Warga Sekolah",
    },
    {
      nama: "Laboratorium Komputer & Jaringan Terpadu",
      deskripsi:
        "Dilengkapi perangkat komputer terkoneksi jaringan lokal berkecepatan tinggi untuk praktikum Informatika dan ujian berbasis komputer.",
      icon: Monitor,
      kapasitas: "3 Ruang Lab CBT",
    },
    {
      nama: "Ruang Bimbingan & Konseling (BK) Siswa",
      deskripsi:
        "Ruang layanan konsultasi akademik, pendampingan pemilihan program studi SNBP/SNBT, serta pembinaan karakter pribadi siswa.",
      icon: Users,
      kapasitas: "Layanan Konseling",
    },
    {
      nama: "Sekretariat OSIS, MPK & Sanggar Pramuka",
      deskripsi:
        "Ruang kerja organisasi kesiswaan, penyimpanan atribut Paskibra & Pramuka, serta pusat koordinasi kegiatan ekstrakurikuler.",
      icon: Layers,
      kapasitas: "Pusat Kesiswaan",
    },
    {
      nama: "Sanggar Seni Kriya & Budaya Lampung",
      deskripsi:
        "Ruang kreasi pembuatan karya seni kriya Nusantara, latihan tari tradisional Lampung, dan pembinaan kontingen FLS2N.",
      icon: Award,
      kapasitas: "Sanggar Kesenian",
    },
    {
      nama: "Ruang Dewan Guru & Tata Usaha Terpadu",
      deskripsi:
        "Pusat layanan administrasi kesiswaan, pengelolaan Dapodik, ruang kerja 48 pendidik, serta ruang rapat koordinasi akademik.",
      icon: ShieldCheck,
      kapasitas: "53 PTK & Staf",
    },
    {
      nama: "Taman Hijau & Area Kantin Sehat ASRI",
      deskripsi:
        "Area terbuka hijau yang rindang dengan fasilitas sanitasi bersih dan kantin sehat pendukung program Sekolah ASRI.",
      icon: CheckCircle2,
      kapasitas: "Lingkungan ASRI",
    },
  ];

  const totalFasilitasPages = Math.max(1, Math.ceil(fasilitasData.length / FASILITAS_PER_PAGE));
  const paginatedFasilitas = fasilitasData.slice(
    (fasilitasPage - 1) * FASILITAS_PER_PAGE,
    fasilitasPage * FASILITAS_PER_PAGE
  );

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

        {/* Sub-Navigation Tabs: Rapi dan pas penuh di dalam kotak baik di Mobile maupun Desktop */}
        <div className="pt-1.5">
          <div className="flex flex-wrap sm:inline-flex items-center gap-1.5 sm:gap-2 p-1.5 bg-white rounded-xl border border-gray-200 shadow-2xs w-full sm:w-auto">
            {tabs.map((tab) => {
              const isSelected = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 sm:flex-initial text-center justify-center px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
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
              <h2 className="text-xl font-bold text-gray-900">Visi, Misi & Sejarah Singkat SMAN 2 Buay Bahuga</h2>
              <p className="text-xs text-gray-500">Landasan filosofis dan arah strategis pembinaan mutu pendidikan di Kabupaten Way Kanan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visi & Sejarah */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-2xs space-y-4">
              <span className="text-xs font-semibold text-[#2A2C5E] bg-blue-50 px-3 py-1 rounded">
                Visi Sekolah
              </span>
              <h3 className="text-xl font-bold text-gray-900 leading-snug">
                &ldquo;Terwujudnya Insan yang Beriman, Berakhlak Mulia, Unggul dalam Prestasi, Berwawasan Lingkungan, dan Berdaya Saing Global.&rdquo;
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                SMA Negeri 2 Buay Bahuga resmi berdiri berdasarkan SK Pendirian Nomor 03 Tahun 2008 tanggal 22 Februari 2008 di Jl. Ryacudu No. 04, Kampung Suka Agung, Kecamatan Buay Bahuga, Kabupaten Way Kanan. Di bawah kepemimpinan Kepala Sekolah Ibu Apriyani, S.Si., M.M.Pd., sekolah berkomitmen mencetak lulusan berprestasi akademik maupun non-akademik yang berpegang teguh pada nilai-nilai luhur Pancasila.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-2xs space-y-4">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded">
                Misi Strategis
              </span>
              <ul className="space-y-3 text-xs text-gray-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Menumbuhkembangkan penghayatan dan pengamalan nilai keimanan, ketakwaan, serta budi pekerti luhur dalam kehidupan sehari-hari.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Melaksanakan pembelajaran dan bimbingan secara efektif, adaptif, kreatif, dan inovatif melalui implementasi Kurikulum Merdeka.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Mendorong penguasaan ilmu pengetahuan, sains, dan literasi teknologi informasi agar siswa siap melanjutkan ke Perguruan Tinggi Negeri maupun dunia kerja.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Membina potensi minat dan bakat siswa secara terprogram pada bidang olimpiade sains (OSN), olahraga (O2SN), dan seni budaya (FLS2N).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Mewujudkan lingkungan sekolah melalui Gerakan ASRI (Aman, Sehat, Resik, dan Indah) dengan menjunjung kearifan lokal Lampung.</span>
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
              <h2 className="text-xl font-bold text-gray-900">Bagan Struktur Organisasi Sekolah</h2>
              <p className="text-xs text-gray-500">Hierarki kepemimpinan dan garis koordinasi manajemen SMAN 2 Buay Bahuga</p>
            </div>
          </div>

          {/* Container Bagan Hierarki dengan Foto Pimpinan & Garis Penghubung Terstruktur */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-4 sm:p-8 lg:p-10">
            <div className="max-w-5xl mx-auto flex flex-col items-center">
              
              {/* LEVEL 1: PUNCAK PIMPINAN - KEPALA SEKOLAH */}
              <div className="flex flex-col items-center z-10 w-full">
                <div className="w-full max-w-md bg-[#2A2C5E] text-white rounded-2xl p-5 sm:p-6 text-center shadow-md border-2 border-[#2A2C5E] space-y-2.5">
                  {/* Foto Kepala Sekolah di Atas Kartu */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto bg-gray-100 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={strukturPimpinan[0].fotoUrl}
                      alt={strukturPimpinan[0].nama}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-white/15 text-blue-100 px-3 py-0.5 rounded-full mb-1">
                      {strukturPimpinan[0].jabatan}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                      {strukturPimpinan[0].nama}
                    </h3>
                    <p className="text-[11px] font-mono text-blue-200 mt-0.5">
                      NIP. {strukturPimpinan[0].nip}
                    </p>
                  </div>
                </div>
              </div>

              {/* GARIS VERTIKAL DARI KEPALA SEKOLAH KE TATA USAHA */}
              <div className="w-0.5 h-7 sm:h-8 bg-[#2A2C5E]/40 relative flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2A2C5E] ring-4 ring-blue-50" />
              </div>

              {/* LEVEL 1.5: UNSUR PELAKSANA ADMINISTRASI & TATA USAHA */}
              <div className="flex flex-col items-center z-10 w-full">
                <div className="w-full max-w-sm bg-blue-50/70 border-2 border-blue-200 rounded-2xl p-4 sm:p-5 text-center shadow-2xs space-y-2">
                  {/* Foto Kepala Tata Usaha di Atas Kartu */}
                  <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-[#2A2C5E] shadow-sm mx-auto bg-gray-100 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={strukturPimpinan[1].fotoUrl}
                      alt={strukturPimpinan[1].nama}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#2A2C5E] bg-blue-100/80 px-2.5 py-0.5 rounded mb-1">
                      {strukturPimpinan[1].jabatan}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-gray-900">
                      {strukturPimpinan[1].nama}
                    </h4>
                    <p className="text-[11px] font-mono text-gray-500 mt-0.5">
                      {strukturPimpinan[1].nip}
                    </p>
                  </div>
                </div>
              </div>

              {/* GARIS VERTIKAL DARI TATA USAHA MENUJU 4 WAKIL KEPALA SEKOLAH */}
              <div className="w-0.5 h-7 sm:h-9 bg-[#2A2C5E]/40 relative flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2A2C5E] ring-4 ring-blue-50" />
              </div>

              {/* GARIS CABANG HORIZONTAL UNTUK 4 WAKIL KEPALA SEKOLAH (Desktop) */}
              <div className="hidden lg:block w-[78%] h-0.5 bg-[#2A2C5E]/40 relative">
                <div className="absolute left-0 top-0 w-0.5 h-5 bg-[#2A2C5E]/40" />
                <div className="absolute left-[33.3%] top-0 w-0.5 h-5 bg-[#2A2C5E]/40" />
                <div className="absolute left-[66.6%] top-0 w-0.5 h-5 bg-[#2A2C5E]/40" />
                <div className="absolute right-0 top-0 w-0.5 h-5 bg-[#2A2C5E]/40" />
              </div>

              {/* LEVEL 2: 4 WAKIL KEPALA SEKOLAH (DENGAN FOTO MASING-MASING DI ATAS KARTU) */}
              <div className="w-full relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:pt-5">
                {/* Garis Vertikal Penghubung Antar-Kartu di Mobile */}
                <div className="sm:hidden absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-[#2A2C5E]/35 z-0" />
                {strukturPimpinan.slice(2, 6).map((waka) => (
                  <div
                    key={waka.jabatan}
                    className="relative z-10 bg-white rounded-2xl border-2 border-[#2A2C5E]/20 hover:border-[#2A2C5E] p-4 text-center shadow-2xs hover:shadow-md transition-all flex flex-col items-center justify-center space-y-2"
                  >
                    {/* Foto Wakil Kepala Sekolah di Atas Kartu */}
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#2A2C5E] shadow-sm mx-auto bg-gray-100 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={waka.fotoUrl}
                        alt={waka.nama}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <span className="inline-block text-[10px] font-bold text-[#2A2C5E] bg-blue-50 px-2.5 py-0.5 rounded">
                        {waka.jabatan}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 mt-1">{waka.nama}</h4>
                      <p className="text-[11px] font-mono text-gray-500 mt-0.5">NIP. {waka.nip}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* GARIS PENGHUBUNG DARI WAKA KE KOORDINATOR & DEWAN GURU */}
              <div className="hidden lg:block w-[78%] h-5 relative">
                <div className="absolute left-0 top-0 w-0.5 h-5 bg-[#2A2C5E]/30" />
                <div className="absolute left-[33.3%] top-0 w-0.5 h-5 bg-[#2A2C5E]/30" />
                <div className="absolute left-[66.6%] top-0 w-0.5 h-5 bg-[#2A2C5E]/30" />
                <div className="absolute right-0 top-0 w-0.5 h-5 bg-[#2A2C5E]/30" />
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[#2A2C5E]/30" />
              </div>

              <div className="w-0.5 h-7 sm:h-8 bg-[#2A2C5E]/40 relative flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2A2C5E] ring-4 ring-blue-50" />
              </div>

              {/* GARIS CABANG HORIZONTAL UNTUK 3 UNIT PELAKSANA AKADEMIK (Desktop) */}
              <div className="hidden md:block w-[68%] h-0.5 bg-[#2A2C5E]/35 relative">
                <div className="absolute left-0 top-0 w-0.5 h-4 bg-[#2A2C5E]/35" />
                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-4 bg-[#2A2C5E]/35" />
                <div className="absolute right-0 top-0 w-0.5 h-4 bg-[#2A2C5E]/35" />
              </div>

              {/* LEVEL 3: KOORDINATOR LAB, DEWAN GURU & WALI KELAS, GURU BK & PEMBINA EKSKUL */}
              <div className="w-full relative grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:pt-4">
                {/* Garis Vertikal Penghubung Antar-Kartu di Mobile */}
                <div className="md:hidden absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-[#2A2C5E]/35 z-0" />
                <div className="relative z-10 bg-gray-50 rounded-xl border border-gray-200 p-3.5 sm:p-4 text-center space-y-1.5">
                  <span className="inline-block text-[10px] font-bold text-[#2A2C5E] bg-white border border-gray-200 px-2.5 py-0.5 rounded">
                    Unit Penunjang Akademik
                  </span>
                  <h4 className="text-sm font-bold text-gray-900">
                    Kepala Laboratorium & Perpustakaan
                  </h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Pengelola 9 Unit Laboratorium (IPA, Fisika, Kimia, Biologi, Komputer, Bahasa) & 1 Perpustakaan Induk
                  </p>
                </div>

                <div className="relative z-10 bg-blue-50 border-2 border-[#2A2C5E]/30 rounded-xl p-3.5 sm:p-4 text-center space-y-1.5 shadow-2xs">
                  <span className="inline-block text-[10px] font-bold text-white bg-[#2A2C5E] px-2.5 py-0.5 rounded">
                    Unsur Pelaksana Pendidik
                  </span>
                  <h4 className="text-sm font-bold text-gray-900">
                    Dewan Guru Mata Pelajaran & Wali Kelas
                  </h4>
                  <p className="text-[11px] text-gray-700 leading-relaxed">
                    48 Guru Mata Pelajaran Bersertifikasi &bull; Wali Kelas X, XI, dan XII (29 Rombongan Belajar)
                  </p>
                </div>

                <div className="relative z-10 bg-gray-50 rounded-xl border border-gray-200 p-3.5 sm:p-4 text-center space-y-1.5">
                  <span className="inline-block text-[10px] font-bold text-[#2A2C5E] bg-white border border-gray-200 px-2.5 py-0.5 rounded">
                    Unit Pembinaan Karakter
                  </span>
                  <h4 className="text-sm font-bold text-gray-900">
                    Bimbingan Konseling (BK) & Pembina Ekskul
                  </h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Pendampingan Minat Bakat, Seleksi SNBP/SNBT PTN, Pengurus OSIS/MPK, & Ekstrakurikuler
                  </p>
                </div>
              </div>

              {/* GARIS VERTIKAL MENUJU PESERTA DIDIK */}
              <div className="w-0.5 h-7 sm:h-8 bg-[#2A2C5E]/40 relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#2A2C5E]" />
              </div>

              {/* LEVEL 4: PESERTA DIDIK */}
              <div className="w-full max-w-xl bg-emerald-50/80 border-2 border-emerald-600/30 rounded-xl p-4 text-center space-y-1">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
                  Subjek Pendidikan
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-gray-900">
                  Peserta Didik SMA Negeri 2 Buay Bahuga
                </h4>
                <p className="text-xs text-emerald-900 font-medium">
                  983 Siswa Aktif (468 Siswa Laki-laki &bull; 515 Siswi Perempuan &bull; 29 Rombongan Belajar)
                </p>
              </div>

            </div>
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
                    src={(guru as any).fotoUrl || (guru as any).avatarUrl || "/logosmanda.png"}
                    alt={(guru as any).nama || (guru as any).name || "Guru"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {(guru as any).nama || (guru as any).name}
                  </h4>
                  <p className="text-xs text-[#2A2C5E] font-medium mt-0.5">
                    {(guru as any).mapel || (guru as any).mataPelajaran}
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
              <p className="text-xs text-gray-500">Data Pokok Pendidikan (Dapodik) resmi terdaftar pada Kemendikdasmen RI</p>
            </div>
          </div>

          {/* Card Lambang Resmi SMAN 2 Buay Bahuga */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-2 border border-gray-200 shadow-xs flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logosmanda.png"
                alt="Lambang Resmi SMAN 2 Buay Bahuga"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#2A2C5E] bg-blue-50 px-2.5 py-0.5 rounded">
                Lambang Resmi Lembaga
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {SCHOOL_INFO.nama}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xl">
                Lambang resmi satuan pendidikan SMA Negeri 2 Buay Bahuga melambangkan integritas moral, keunggulan sains & teknologi, semangat kebersamaan, serta komitmen pengabdian pendidikan di Kabupaten Way Kanan.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 text-xs">
              <div className="p-4 sm:p-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4 py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Nama Sekolah</span>
                  <span className="font-bold text-gray-900 sm:text-right">{SCHOOL_INFO.nama}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4 py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">NPSN / NSS</span>
                  <span className="font-bold text-[#2A2C5E] font-mono sm:text-right">
                    {SCHOOL_INFO.npsn} / {SCHOOL_INFO.nss}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Peringkat Akreditasi</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded self-start sm:self-auto">
                    Terakreditasi {SCHOOL_INFO.akreditasi} (Unggul)
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4 py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Kepala Sekolah</span>
                  <span className="font-bold text-gray-900 sm:text-right">{SCHOOL_INFO.kepalaSekolah}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4 py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">SK Pendirian Sekolah</span>
                  <span className="font-medium text-gray-900 sm:text-right">{SCHOOL_INFO.skPendirian}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4 py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">SK Izin Operasional</span>
                  <span className="font-medium text-gray-900 sm:text-right">{SCHOOL_INFO.skOperasional}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4 py-1.5">
                  <span className="text-gray-500">Operator Sekolah / Dapodik</span>
                  <span className="font-medium text-gray-900 sm:text-right">{SCHOOL_INFO.operatorSekolah}</span>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-0.5 sm:gap-4 py-1.5 border-b border-gray-100">
                  <span className="text-gray-500 shrink-0">Alamat Sekolah</span>
                  <span className="font-medium text-gray-900 sm:text-right sm:max-w-xs">{SCHOOL_INFO.alamat}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4 py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Kecamatan / Kabupaten</span>
                  <span className="font-medium text-gray-900 sm:text-right">{SCHOOL_INFO.kecamatan}, {SCHOOL_INFO.kabupaten}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4 py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Provinsi / Kode Pos</span>
                  <span className="font-medium text-gray-900 sm:text-right">{SCHOOL_INFO.provinsi} - {SCHOOL_INFO.kodePos}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4 py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Telepon / Email Resmi</span>
                  <span className="font-medium text-gray-900 sm:text-right break-all sm:break-normal">
                    {SCHOOL_INFO.telepon} &bull; {SCHOOL_INFO.email}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4 py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Luas Tanah Sekolah</span>
                  <span className="font-medium text-gray-900 sm:text-right">{SCHOOL_INFO.luasTanah}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4 py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Titik Koordinat Geografis</span>
                  <span className="font-mono text-gray-900 sm:text-right">
                    Lat {SCHOOL_INFO.koordinat.latitude}, Lng {SCHOOL_INFO.koordinat.longitude}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4 py-1.5">
                  <span className="text-gray-500">Kurikulum & Waktu KBM</span>
                  <span className="font-bold text-[#2A2C5E] sm:text-right">Kurikulum Merdeka / Pagi</span>
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
              <h2 className="text-xl font-bold text-gray-900">Fasilitas & Sarana Sekolah</h2>
              <p className="text-xs text-gray-500">Infrastruktur pendukung kenyamanan belajar dan eksplorasi teknologi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {paginatedFasilitas.map((fas) => {
              const Icon = fas.icon;
              return (
                <div
                  key={fas.nama}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs flex flex-col justify-between h-full hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between h-10">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2A2C5E] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#2A2C5E] bg-blue-50/80 border border-blue-100 px-2.5 py-1 rounded-md">
                        {fas.kapasitas}
                      </span>
                    </div>
                    <div className="min-h-[2.75rem] flex items-start pt-1">
                      <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">
                        {fas.nama}
                      </h3>
                    </div>
                    <div className="min-h-[3.75rem] flex items-start">
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                        {fas.deskripsi}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <PaginationBar
            currentPage={fasilitasPage}
            totalPages={totalFasilitasPages}
            totalItems={fasilitasData.length}
            itemsPerPage={FASILITAS_PER_PAGE}
            onPageChange={setFasilitasPage}
            itemLabel="fasilitas sarana"
          />
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
