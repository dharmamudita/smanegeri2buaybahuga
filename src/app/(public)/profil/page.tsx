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
      nama: "Lapangan Olahraga & Lahan Kampus 20.000 m²",
      deskripsi:
        "Lingkungan kampus seluas 2 hektar dengan fasilitas lapangan upacara, futsal, bola voli, karate, pencak silat, dan taman sekolah ASRI.",
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
      nama: "Sarana Ibadah & Pembinaan Karakter",
      deskripsi:
        "Pusat kegiatan keagamaan, ibadah sholat berjamaah, kajian Rohis, dan pembinaan akhlak mulia warga SMA Negeri 2 Buay Bahuga.",
      icon: Compass,
      kapasitas: "Seluruh Warga Sekolah",
    },
  ];

  const strukturPimpinan = [
    {
      jabatan: "Kepala Sekolah",
      nama: "Apriyani, S.Si., M.M.Pd.",
      nip: "19720405 200501 2 005",
      keterangan: "Pembina Tk. I / IV.b — Penanggung Jawab Kebijakan & Manajemen Mutu Satuan Pendidikan",
    },
    {
      jabatan: "Wakil Kepala Sekolah Bidang Kurikulum",
      nama: "Marsono, S.Pd.",
      nip: "19820315 200801 1 012",
      keterangan: "Koordinator Implementasi Kurikulum Merdeka, Jadwal KBM 29 Rombel, & Evaluasi Akademik",
    },
    {
      jabatan: "Wakil Kepala Sekolah Bidang Kesiswaan",
      nama: "Tumijo, S.Pd.",
      nip: "19780512 200501 1 003",
      keterangan: "Pembinaan Disiplin Siswa, Organisasi OSIS/MPK, serta Pendampingan Prestasi OSN, O2SN, & FLS2N",
    },
    {
      jabatan: "Wakil Kepala Sekolah Bidang Sarana & Prasarana",
      nama: "Wida Awanda, S.Pd.Si.",
      nip: "19890418 201402 2 004",
      keterangan: "Pengelolaan 28 Ruang Kelas, 9 Unit Laboratorium, Perpustakaan, & Lingkungan Sekolah ASRI",
    },
    {
      jabatan: "Wakil Kepala Sekolah Bidang Hubungan Masyarakat",
      nama: "Eva Dwi Kurniawati, S.Pd.",
      nip: "19880727 201101 2 005",
      keterangan: "Kemitraan Komite Sekolah, Orang Tua/Wali Murid, Perguruan Tinggi Negeri, & Publikasi",
    },
    {
      jabatan: "Tata Usaha & Operator Pokok Pendidikan (Dapodik)",
      nama: "Abu Yasid",
      nip: "Operator Resmi Dapodik (NPSN: 10810192)",
      keterangan: "Manajemen Data Pokok Pendidikan Kemendikdasmen, Administrasi Kesiswaan, & Kepegawaian",
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
                <div className="text-xs font-semibold text-[#2A2C5E] bg-blue-50 px-2.5 py-1 rounded inline-block">
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
              <p className="text-xs text-gray-500">Data Pokok Pendidikan (Dapodik) resmi terdaftar pada Kemendikdasmen RI</p>
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
                  <span className="text-gray-500">NPSN / NSS</span>
                  <span className="font-bold text-[#2A2C5E] font-mono">
                    {SCHOOL_INFO.npsn} / {SCHOOL_INFO.nss}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Peringkat Akreditasi</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Terakreditasi {SCHOOL_INFO.akreditasi} (Unggul)
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Kepala Sekolah</span>
                  <span className="font-bold text-gray-900">{SCHOOL_INFO.kepalaSekolah}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">SK Pendirian Sekolah</span>
                  <span className="font-medium text-gray-900">{SCHOOL_INFO.skPendirian}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">SK Izin Operasional</span>
                  <span className="font-medium text-gray-900">{SCHOOL_INFO.skOperasional}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-500">Operator Sekolah / Dapodik</span>
                  <span className="font-medium text-gray-900">{SCHOOL_INFO.operatorSekolah}</span>
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
                  <span className="text-gray-500">Telepon / Email Resmi</span>
                  <span className="font-medium text-gray-900 text-right">
                    {SCHOOL_INFO.telepon} &bull; {SCHOOL_INFO.email}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Luas Tanah Kampus</span>
                  <span className="font-medium text-gray-900">{SCHOOL_INFO.luasTanah}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Titik Koordinat Geografis</span>
                  <span className="font-mono text-gray-900 text-right">
                    Lat {SCHOOL_INFO.koordinat.latitude}, Lng {SCHOOL_INFO.koordinat.longitude}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-500">Kurikulum & Waktu KBM</span>
                  <span className="font-bold text-[#2A2C5E]">Kurikulum Merdeka / Pagi</span>
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
