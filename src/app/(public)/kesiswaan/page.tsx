"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Award,
  ShieldCheck,
  Trophy,
  Flame,
  Activity,
  HeartHandshake,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
  GraduationCap,
  UserCheck,
  MapPin,
  Search,
  Calendar,
} from "lucide-react";

type KesiswaanTab = "TATA_TERTIB" | "PRESTASI" | "OSIS" | "EKSTRAKURIKULER";

function KesiswaanContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab")?.toUpperCase() as KesiswaanTab) || "TATA_TERTIB";
  const [activeTab, setActiveTab] = useState<KesiswaanTab>(
    ["TATA_TERTIB", "PRESTASI", "OSIS", "EKSTRAKURIKULER"].includes(initialTab)
      ? initialTab
      : "TATA_TERTIB"
  );

  // State Filter & Pencarian Prestasi
  const [filterKategoriPrestasi, setFilterKategoriPrestasi] = useState<string>("SEMUA");
  const [searchPrestasi, setSearchPrestasi] = useState<string>("");

  const tabs: { key: KesiswaanTab; label: string }[] = [
    { key: "TATA_TERTIB", label: "Tata Tertib" },
    { key: "PRESTASI", label: "Prestasi" },
    { key: "OSIS", label: "OSIS" },
    { key: "EKSTRAKURIKULER", label: "Ekstrakurikuler" },
  ];

  const tataTertibRules = [
    {
      kategori: "Presensi & Kehadiran",
      deskripsi:
        "Siswa wajib hadir di sekolah sebelum pukul 07:30 WIB serta melakukan pencatatan kehadiran secara tertib dan disiplin di lingkungan sekolah.",
      kewajiban: [
        "Pencatatan presensi dibuka pukul 06:00 - 07:30 WIB (tepat waktu).",
        "Keterlambatan di atas pukul 07:30 WIB tercatat dan siswa wajib melapor ke Guru Piket/BK.",
        "Ketidakhadiran karena sakit/izin wajib menyertakan surat keterangan resmi orang tua/dokter.",
      ],
    },
    {
      kategori: "Pakaian Seragam Sekolah",
      deskripsi:
        "Siswa wajib mengenakan seragam sekolah rapi, atribut lengkap (logo OSIS, badge nama, lokasi Lampung), dan bersepatu hitam polos.",
      kewajiban: [
        "Senin & Selasa: Seragam Putih Abu-Abu lengkap berdasi dan bertopi upacara.",
        "Rabu: Seragam Khas Yayasan / Batik Sekolah.",
        "Kamis: Seragam Pramuka Lengkap dengan kacu dan baret/tutup kepala.",
        "Jumat: Seragam Olahraga Sekolah saat senam dan baju muslim/rapi saat ibadah.",
      ],
    },
    {
      kategori: "Norma Kedisiplinan & Etika",
      deskripsi:
        "Menjunjung tinggi budi pekerti 5S (Senyum, Salam, Sapa, Sopan, Santun) serta menjaga nama baik kehormatan almamater SMAN 2 Buay Bahuga.",
      kewajiban: [
        "Dilarang keras melakukan perundungan (bullying) fisik, verbal, maupun siber.",
        "Dilarang membawa senjata tajam, rokok, miras, napza, dan konten asusila.",
        "Penggunaan ponsel hanya untuk keperluan KBM terarah atas izin guru mata pelajaran.",
      ],
    },
  ];

  const prestasiList = [
    {
      kegiatan: "Seleksi Nasional Berdasarkan Prestasi (SNBP) PTN Negeri",
      jenisLomba: "Seleksi Prestasi Akademik Nasional (Program Studi Biologi UNJ)",
      tingkat: "Tingkat Nasional",
      peraih: "Nabila Dijayanti (Kelas XII MIPA 1)",
      pembimbing: "Tumijo, S.Pd. & Apriyani, S.Si., M.M.Pd.",
      predikat: "Lolos Jalur Prestasi SNBP",
      kategori: "Akademik & Sains",
      tahun: "2026",
      fotoUrl:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80",
    },
    {
      kegiatan: "Festival & Lomba Seni Siswa Nasional (FLS2N) Cabang Kriya",
      jenisLomba: "Kompetisi Desain & Karya Seni Kriya Nusantara Tingkat SMA",
      tingkat: "Tingkat Kabupaten Way Kanan",
      peraih: "Safety Octa Sushadi & Aji Winata Prayoga",
      pembimbing: "Marlita Illiansyah, S.Pd.",
      predikat: "Juara Umum (Emas & Perak)",
      kategori: "Seni Budaya",
      tahun: "2026",
      fotoUrl:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80",
    },
    {
      kegiatan: "Olimpiade Sains Nasional (OSN) Jenjang SMA/MA",
      jenisLomba: "Kompetisi Sains & Olimpiade Akademik Puspresnas",
      tingkat: "Tingkat Kabupaten Way Kanan",
      peraih: "Evista Silvy Laudrya (Kelas XI MIPA 1)",
      pembimbing: "Wida Awanda, S.Pd.Si. & Eva Dwi Kurniawati, S.Pd.",
      predikat: "Medali Perak (Juara 2)",
      kategori: "Akademik & Sains",
      tahun: "2026",
      fotoUrl:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80",
    },
    {
      kegiatan: "Olimpiade Olahraga Siswa Nasional (O2SN) Cabang Karate",
      jenisLomba: "Kejuaraan Bela Diri Karate Kumite & Kata Pelajar SMA",
      tingkat: "Tingkat Kabupaten Way Kanan",
      peraih: "M. Ziddane Alfaridz (Kelas XI IPS 1)",
      pembimbing: "Meiliana, S.Pd.",
      predikat: "Medali Perak (Juara 2)",
      kategori: "Olahraga",
      tahun: "2026",
      fotoUrl:
        "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&auto=format&fit=crop&q=80",
    },
    {
      kegiatan: "Olimpiade Olahraga Siswa Nasional (O2SN) Cabang Pencak Silat",
      jenisLomba: "Kejuaraan Bela Diri Pencak Silat Seni & Tanding Pelajar",
      tingkat: "Tingkat Kabupaten Way Kanan",
      peraih: "Frita Amelia (Kelas XI IPS 1)",
      pembimbing: "Meiliana, S.Pd.",
      predikat: "Medali Perunggu (Juara 3)",
      kategori: "Olahraga",
      tahun: "2026",
      fotoUrl:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
    },
    {
      kegiatan: "Pasukan Pengibar Bendera (Paskibraka) & Lomba Baris-Berbaris",
      jenisLomba: "Seleksi Paskibraka HUT RI & Ketangkasan Baris-Berbaris",
      tingkat: "Tingkat Kecamatan & Kabupaten Way Kanan",
      peraih: "Peleton Paskibra SMAN 2 Buay Bahuga",
      pembimbing: "Marsono, S.Pd.",
      predikat: "Pasukan Kehormatan Utama",
      kategori: "Kedisiplinan",
      tahun: "2025/2026",
      fotoUrl:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80",
    },
  ];

  const filteredPrestasi = prestasiList.filter((item) => {
    if (filterKategoriPrestasi !== "SEMUA" && item.kategori !== filterKategoriPrestasi) {
      return false;
    }
    if (searchPrestasi.trim()) {
      const q = searchPrestasi.toLowerCase();
      return (
        item.kegiatan.toLowerCase().includes(q) ||
        item.jenisLomba.toLowerCase().includes(q) ||
        item.peraih.toLowerCase().includes(q) ||
        item.pembimbing.toLowerCase().includes(q) ||
        item.tingkat.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const ekskulList = [
    {
      nama: "Pasukan Pengibar Bendera (Paskibra)",
      kategori: "Kedisiplinan & Patriotisme",
      icon: ShieldCheck,
      pembina: "Marsono, S.Pd.",
      jadwal: "Selasa & Jumat, 15:30 WIB",
      prestasi: "Pasukan Pengibar Bendera Utama HUT RI Kec. Buay Bahuga",
    },
    {
      nama: "Gerakan Pramuka Gudep SMAN 2 Buay Bahuga",
      kategori: "Kepanduan & Karakter Mandiri",
      icon: Compass,
      pembina: "Tumijo, S.Pd.",
      jadwal: "Kamis, 15:30 WIB",
      prestasi: "Gudep Teraktif Kwarran Buay Bahuga - Kwarcab Way Kanan",
    },
    {
      nama: "Sanggar Seni Kriya & Budaya Lampung (FLS2N)",
      kategori: "Seni Rupa, Kriya & Tari Tradisional",
      icon: Sparkles,
      pembina: "Marlita Illiansyah, S.Pd.",
      jadwal: "Rabu, 15:30 WIB",
      prestasi: "Juara Umum FLS2N (Medali Emas & Perak Cabang Kriya)",
    },
    {
      nama: "Klub Olimpiade Sains Nasional (OSN & KIR)",
      kategori: "Pembinaan Sains & Riset Ilmiah",
      icon: Activity,
      pembina: "Wida Awanda, S.Pd.Si. & Eva Dwi Kurniawati, S.Pd.",
      jadwal: "Sabtu, 09:00 WIB",
      prestasi: "Peraih Medali Perak OSN Tingkat Kabupaten Way Kanan",
    },
    {
      nama: "Rohani Islam (Rohis) & Bina Imtaq",
      kategori: "Keagamaan & Akhlak Mulia",
      icon: Flame,
      pembina: "Mamad Fhadoli, S.Pd.I.",
      jadwal: "Jumat, 11:30 WIB",
      prestasi: "Penyelenggara Gebyar PHBI & Pesantren Kilat Sekolah",
    },
    {
      nama: "Klub Olahraga Prestasi & Bela Diri (O2SN)",
      kategori: "Karate, Pencak Silat, Futsal & Voli",
      icon: Trophy,
      pembina: "Meiliana, S.Pd.",
      jadwal: "Senin & Rabu, 16:00 WIB",
      prestasi: "Juara 2 Karate & Juara 3 Pencak Silat O2SN Way Kanan",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold">
          <Users className="w-3.5 h-3.5" />
          <span>Pengembangan Karakter Siswa</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Kesiswaan, Tata Tertib & Ekstrakurikuler
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
          Membina kepemimpinan organisasi, kedisiplinan beretika, torehan prestasi unggul di berbagai kancah, serta pengembangan minat bakat melalui 12 cabang ekstrakurikuler.
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

      {/* TAB 1: TATA TERTIB */}
      {activeTab === "TATA_TERTIB" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Tata Tertib & Norma Kedisiplinan Siswa</h2>
              <p className="text-xs text-gray-500">Pedoman pembiasaan positif dan pembinaan karakter di lingkungan sekolah</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tataTertibRules.map((rule) => (
              <div
                key={rule.kategori}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="text-xs font-bold text-[#2A2C5E] bg-blue-50 px-2.5 py-1 rounded inline-block">
                  {rule.kategori}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{rule.deskripsi}</p>
                <ul className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-700">
                  {rule.kewajiban.map((poin, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{poin}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Sanksi & Poin Pembinaan */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
              <AlertTriangle className="w-4 h-4" />
              <span>Sistem Poin Pembinaan Disiplin Siswa</span>
            </div>
            <p className="leading-relaxed">
              Setiap pelanggaran tata tertib memiliki bobot poin pembinaan. Akumulasi 30 poin akan mendapatkan surat peringatan I dan pendampingan Guru BK, 50 poin pemanggilan orang tua/wali murid, dan 100 poin pengembalian kepada orang tua murid setelah melalui sidang dewan guru.
            </p>
          </div>
        </section>
      )}

      {/* TAB 2: PRESTASI (GALERI KARTU PRESTASI BERFOTO + DETAIL LENGKAP) */}
      {activeTab === "PRESTASI" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Rekam Jejak Prestasi Siswa</h2>
              <p className="text-xs text-gray-500">
                Dokumentasi capaian membanggakan peserta didik SMAN 2 Buay Bahuga beserta guru pembimbing
              </p>
            </div>
          </div>

          {/* Filter Kategori & Pencarian Prestasi */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-wrap sm:inline-flex items-center gap-1.5 p-1.5 bg-white rounded-xl border border-gray-200 shadow-2xs w-full lg:w-auto">
              {[
                { key: "SEMUA", label: "Semua Bidang" },
                { key: "Akademik & Sains", label: "Akademik & Sains" },
                { key: "Seni Budaya", label: "Seni Budaya" },
                { key: "Olahraga", label: "Olahraga" },
                { key: "Kedisiplinan", label: "Kedisiplinan" },
              ].map((kat) => (
                <button
                  key={kat.key}
                  onClick={() => setFilterKategoriPrestasi(kat.key)}
                  className={`flex-1 sm:flex-initial text-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    filterKategoriPrestasi === kat.key
                      ? "bg-[#2A2C5E] text-white shadow-2xs"
                      : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/70"
                  }`}
                >
                  {kat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-72">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchPrestasi}
                onChange={(e) => setSearchPrestasi(e.target.value)}
                placeholder="Cari siswa, jenis lomba, atau pembimbing..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E] shadow-2xs"
              />
            </div>
          </div>

          {/* Grid Kartu Prestasi Berfoto */}
          {filteredPrestasi.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-xs text-gray-500">
              Tidak ditemukan data prestasi yang sesuai dengan filter atau pencarian Anda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrestasi.map((pres) => (
                <div
                  key={pres.kegiatan}
                  className="group bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div>
                    {/* Foto Dokumentasi Prestasi */}
                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pres.fotoUrl}
                        alt={pres.kegiatan}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                      {/* Badge Predikat Juara (Kiri Atas) */}
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-amber-400 text-gray-950 text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-xs">
                        <Trophy className="w-3 h-3" />
                        {pres.predikat}
                      </span>

                      {/* Badge Tahun (Kanan Atas) */}
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-[#2A2C5E]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        <Calendar className="w-3 h-3 text-blue-200" />
                        {pres.tahun}
                      </span>

                      {/* Label Kategori & Jenis Lomba di Bawah Foto */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#2A2C5E] px-2.5 py-0.5 rounded shadow-2xs">
                          {pres.kategori}
                        </span>
                      </div>
                    </div>

                    {/* Judul & Jenis Lomba */}
                    <div className="p-5 pb-4 space-y-1.5">
                      <h3 className="text-sm sm:text-base font-extrabold text-gray-900 leading-snug">
                        {pres.kegiatan}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {pres.jenisLomba}
                      </p>
                    </div>
                  </div>

                  {/* Detail Terstruktur: Nama Siswa, Guru Pembimbing, & Tingkat */}
                  <div className="px-5 pb-5 pt-3 border-t border-gray-100 bg-gray-50/50 space-y-2.5 text-xs">
                    <div className="flex items-start gap-2.5">
                      <GraduationCap className="w-4 h-4 text-[#2A2C5E] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">
                          Nama Siswa Peraih
                        </span>
                        <span className="font-bold text-gray-900 block">
                          {pres.peraih}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <UserCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">
                          Guru Pembimbing
                        </span>
                        <span className="font-semibold text-gray-800 block">
                          {pres.pembimbing}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 pt-2 border-t border-gray-200/70">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">
                          Tingkat Kejuaraan
                        </span>
                        <span className="font-bold text-[#2A2C5E] block">
                          {pres.tingkat}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 3: OSIS (BAGAN STRUKTUR ORGANISASI OSIS & MPK) */}
      {activeTab === "OSIS" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Bagan Struktur Organisasi Siswa Intra Sekolah (OSIS) & MPK
              </h2>
              <p className="text-xs text-gray-500">
                Hierarki kepengurusan OSIS, Majelis Perwakilan Kelas (MPK), dan Koordinator Seksi Bidang SMAN 2 Buay Bahuga
              </p>
            </div>
          </div>

          {/* Container Bagan Hierarki OSIS */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-4 sm:p-8 lg:p-10">
            <div className="max-w-5xl mx-auto flex flex-col items-center">

              {/* LEVEL 1 (DESKTOP): PEMBINA KESISWAAN - PELINDUNG (KEPSEK) - KETUA MPK */}
              <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-0 items-center relative">
                {/* Kiri Desktop: Pembina Utama OSIS / Waka Kesiswaan */}
                <div className="hidden lg:flex items-center justify-end">
                  <div className="w-full max-w-xs bg-blue-50/50 border border-blue-200 rounded-xl p-4 text-center space-y-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#2A2C5E] bg-blue-100/80 px-2.5 py-0.5 rounded">
                      Pembina Utama OSIS
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">Tumijo, S.Pd.</h4>
                    <p className="text-[11px] font-mono text-gray-500">
                      NIP. 19780512 200501 1 003
                    </p>
                    <p className="text-[11px] text-gray-600">
                      Wakil Kepala Sekolah Bidang Kesiswaan
                    </p>
                  </div>
                  <div className="w-8 h-0.5 bg-[#2A2C5E]/40" />
                </div>

                {/* Tengah Puncak: PELINDUNG / PENANGGUNG JAWAB (KEPALA SEKOLAH) */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-full max-w-sm bg-[#2A2C5E] text-white rounded-xl p-4 sm:p-5 text-center shadow-md border-2 border-[#2A2C5E] space-y-1.5">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-white/15 text-blue-100 px-3 py-0.5 rounded-full">
                      Pelindung & Penanggung Jawab
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                      Apriyani, S.Si., M.M.Pd.
                    </h3>
                    <p className="text-[11px] font-mono text-blue-200">
                      NIP. 19720405 200501 2 005
                    </p>
                    <p className="text-[11px] text-blue-100/90 pt-1.5 border-t border-white/15">
                      Kepala SMA Negeri 2 Buay Bahuga
                    </p>
                  </div>
                </div>

                {/* Kanan Desktop: Majelis Perwakilan Kelas (MPK) */}
                <div className="hidden lg:flex items-center justify-start">
                  <div className="w-8 border-t-2 border-dashed border-[#2A2C5E]/40" />
                  <div className="w-full max-w-xs bg-gray-50/90 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center space-y-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-gray-700 bg-gray-200/80 px-2.5 py-0.5 rounded">
                      Mitra Legislatif (MPK)
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">Nabila Dijayanti</h4>
                    <p className="text-[11px] text-[#2A2C5E] font-semibold">
                      Ketua Umum MPK (Kelas XII MIPA 1)
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Pengawas & Penampung Aspirasi 29 Rombel
                    </p>
                  </div>
                </div>
              </div>

              {/* KHUSUS MOBILE & TABLET (< lg): CABANG PEMBINA OSIS & KETUA MPK BERDAMPINGAN */}
              <div className="lg:hidden w-full flex flex-col items-center">
                <div className="w-0.5 h-5 bg-[#2A2C5E]/40" />
                <div className="w-1/2 h-0.5 bg-[#2A2C5E]/40 relative">
                  <div className="absolute left-0 top-0 w-0.5 h-3 bg-[#2A2C5E]/40" />
                  <div className="absolute right-0 top-0 w-0.5 h-3 bg-[#2A2C5E]/40" />
                </div>
                <div className="w-full grid grid-cols-2 gap-2.5 pt-3">
                  <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-3 text-center space-y-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#2A2C5E] bg-blue-100/80 px-2 py-0.5 rounded">
                        Pembina OSIS
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">Tumijo, S.Pd.</h4>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-gray-600 leading-snug pt-1 border-t border-blue-100">
                      Waka Bidang Kesiswaan
                    </p>
                  </div>
                  <div className="bg-gray-50/90 border-2 border-dashed border-gray-300 rounded-xl p-3 text-center space-y-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-gray-700 bg-gray-200/80 px-2 py-0.5 rounded">
                        Ketua MPK
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">Nabila Dijayanti</h4>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-gray-500 leading-snug pt-1 border-t border-gray-200/70">
                      Kelas XII MIPA 1
                    </p>
                  </div>
                </div>
              </div>

              {/* GARIS VERTIKAL MENUJU KETUA & WAKIL KETUA UMUM OSIS */}
              <div className="w-0.5 h-7 sm:h-9 bg-[#2A2C5E]/40 relative flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2A2C5E] ring-4 ring-blue-50" />
              </div>

              {/* LEVEL 2: KETUA UMUM & WAKIL KETUA OSIS */}
              <div className="w-full max-w-2xl relative grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <div className="sm:hidden absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-[#2A2C5E]/35 z-0" />
                <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#2A2C5E]/35 z-0" />

                <div className="relative z-10 bg-white rounded-xl border-2 border-[#2A2C5E] p-4 text-center shadow-xs space-y-1.5">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-white bg-[#2A2C5E] px-3 py-0.5 rounded-full">
                    Ketua Umum OSIS
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-gray-900">
                    M. Ziddane Alfaridz
                  </h4>
                  <p className="text-xs font-semibold text-[#2A2C5E]">
                    Kelas XI IPS 1 &bull; NISN. 0081234567
                  </p>
                  <p className="text-[11px] text-gray-600 pt-1.5 border-t border-gray-100">
                    Koordinator Utama Program Kerja Eksekutif Siswa
                  </p>
                </div>

                <div className="relative z-10 bg-white rounded-xl border-2 border-[#2A2C5E]/40 p-4 text-center shadow-xs space-y-1.5">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#2A2C5E] bg-blue-50 px-3 py-0.5 rounded-full">
                    Wakil Ketua OSIS
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-gray-900">
                    Safety Octa Sushadi
                  </h4>
                  <p className="text-xs font-semibold text-[#2A2C5E]">
                    Kelas XII MIPA 2 &bull; NISN. 0078129342
                  </p>
                  <p className="text-[11px] text-gray-600 pt-1.5 border-t border-gray-100">
                    Koordinasi Internal Seksi Bidang & Ekstrakurikuler
                  </p>
                </div>
              </div>

              {/* GARIS VERTIKAL MENUJU SEKRETARIS & BENDAHARA */}
              <div className="w-0.5 h-7 sm:h-8 bg-[#2A2C5E]/40 relative flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2A2C5E] ring-4 ring-blue-50" />
              </div>

              <div className="hidden sm:block w-1/2 max-w-md h-0.5 bg-[#2A2C5E]/40 relative">
                <div className="absolute left-0 top-0 w-0.5 h-4 bg-[#2A2C5E]/40" />
                <div className="absolute right-0 top-0 w-0.5 h-4 bg-[#2A2C5E]/40" />
              </div>

              {/* LEVEL 3: SEKRETARIS UMUM & BENDAHARA UMUM */}
              <div className="w-full max-w-2xl relative grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 sm:pt-4">
                <div className="sm:hidden absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-[#2A2C5E]/35 z-0" />

                <div className="relative z-10 bg-gray-50 rounded-xl border border-gray-200 p-4 text-center space-y-1">
                  <span className="inline-block text-[10px] font-bold text-[#2A2C5E] bg-white border border-gray-200 px-2.5 py-0.5 rounded">
                    Sekretaris Umum OSIS
                  </span>
                  <h4 className="text-sm font-bold text-gray-900">Evista Silvy Laudrya</h4>
                  <p className="text-[11px] font-medium text-[#2A2C5E]">Kelas XI MIPA 1</p>
                  <p className="text-[11px] text-gray-600 pt-1 border-t border-gray-200/70">
                    Administrasi Kesekretariatan, Proposal, & Dokumentasi Rapat
                  </p>
                </div>

                <div className="relative z-10 bg-gray-50 rounded-xl border border-gray-200 p-4 text-center space-y-1">
                  <span className="inline-block text-[10px] font-bold text-[#2A2C5E] bg-white border border-gray-200 px-2.5 py-0.5 rounded">
                    Bendahara Umum OSIS
                  </span>
                  <h4 className="text-sm font-bold text-gray-900">Frita Amelia</h4>
                  <p className="text-[11px] font-medium text-[#2A2C5E]">Kelas XI IPS 1</p>
                  <p className="text-[11px] text-gray-600 pt-1 border-t border-gray-200/70">
                    Pengelolaan Kas Organisasi & Pertanggungjawaban Anggaran
                  </p>
                </div>
              </div>

              {/* GARIS VERTIKAL MENUJU 6 SEKSI BIDANG (SEKBID) */}
              <div className="w-0.5 h-7 sm:h-9 bg-[#2A2C5E]/40 relative flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2A2C5E] ring-4 ring-blue-50" />
              </div>

              {/* GARIS CABANG HORIZONTAL UNTUK SEKSI BIDANG (Desktop) */}
              <div className="hidden lg:block w-[68%] h-0.5 bg-[#2A2C5E]/40 relative">
                <div className="absolute left-0 top-0 w-0.5 h-5 bg-[#2A2C5E]/40" />
                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-5 bg-[#2A2C5E]/40" />
                <div className="absolute right-0 top-0 w-0.5 h-5 bg-[#2A2C5E]/40" />
              </div>

              {/* LEVEL 4: 6 SEKSI BIDANG (SEKBID) OSIS */}
              <div className="w-full relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:pt-5">
                <div className="sm:hidden absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-[#2A2C5E]/35 z-0" />

                {[
                  {
                    sekbid: "Seksi Bidang I",
                    nama: "Keimanan & Ketakwaan Terhadap Tuhan YME",
                    koordinator: "Aji Winata Prayoga (XI IPS 2)",
                    program: "Rohis, Peringatan Hari Besar Keagamaan, & Pembiasaan Ibadah",
                  },
                  {
                    sekbid: "Seksi Bidang II",
                    nama: "Budi Pekerti Luhur & Bela Negara",
                    koordinator: "Rizky Pratama (XI MIPA 1)",
                    program: "Petugas Upacara Senin, Paskibra, Pramuka, & Ketertiban Siswa",
                  },
                  {
                    sekbid: "Seksi Bidang III",
                    nama: "Prestasi Akademik, Sains & Literasi",
                    koordinator: "Putri Maharani (XI MIPA 2)",
                    program: "Kelompok Studi OSN, Mading Sekolah, & Duta Literasi Perpustakaan",
                  },
                  {
                    sekbid: "Seksi Bidang IV",
                    nama: "Olahraga, Kesehatan & Lingkungan ASRI",
                    koordinator: "Bagas Adi Saputra (XI IPS 1)",
                    program: "Turnamen Classmeeting, O2SN, UKS/PMR, & Gerakan Sekolah ASRI",
                  },
                  {
                    sekbid: "Seksi Bidang V",
                    nama: "Apresiasi Seni & Budaya Daerah Lampung",
                    koordinator: "Citra Ayu Lestari (XI MIPA 1)",
                    program: "Sanggar Kriya & Tari FLS2N, Pentas Seni, & Publikasi Kreatif",
                  },
                  {
                    sekbid: "Seksi Bidang VI",
                    nama: "Kewirausahaan & Kepemimpinan Siswa",
                    koordinator: "Dimas Arya Wijaya (X Merdeka 1)",
                    program: "Latihan Dasar Kepemimpinan Siswa (LDKS) & Bazar Karya Siswa",
                  },
                ].map((sb) => (
                  <div
                    key={sb.sekbid}
                    className="relative z-10 bg-white rounded-xl border border-gray-200 hover:border-[#2A2C5E] p-4 text-center shadow-2xs transition-all space-y-1.5 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <span className="inline-block text-[10px] font-bold text-[#2A2C5E] bg-blue-50 px-2.5 py-0.5 rounded">
                        {sb.sekbid}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                        {sb.nama}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#2A2C5E]">
                        Koord: {sb.koordinator}
                      </p>
                    </div>
                    <p className="text-[11px] text-gray-600 pt-2 border-t border-gray-100 leading-relaxed">
                      {sb.program}
                    </p>
                  </div>
                ))}
              </div>

              {/* GARIS VERTIKAL MENUJU SELURUH ANGGOTA OSIS */}
              <div className="w-0.5 h-7 sm:h-8 bg-[#2A2C5E]/40 relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#2A2C5E]" />
              </div>

              {/* LEVEL 5: SELURUH ANGGOTA OSIS / PESERTA DIDIK */}
              <div className="w-full max-w-xl bg-emerald-50/80 border-2 border-emerald-600/30 rounded-xl p-4 text-center space-y-1">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
                  Anggota Organisasi
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-gray-900">
                  Seluruh Peserta Didik SMA Negeri 2 Buay Bahuga
                </h4>
                <p className="text-xs text-emerald-900 font-medium">
                  983 Siswa Aktif (Kelas X, XI, dan XII &bull; 29 Rombongan Belajar)
                </p>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* TAB 4: EKSTRAKURIKULER */}
      {activeTab === "EKSTRAKURIKULER" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Cabang Kegiatan Ekstrakurikuler</h2>
              <p className="text-xs text-gray-500">Wadah aktualisasi minat, bakat, kepemimpinan, dan kecakapan hidup</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ekskulList.map((ekskul) => {
              const Icon = ekskul.icon;
              return (
                <div
                  key={ekskul.nama}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2A2C5E] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded">
                      {ekskul.kategori}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900">{ekskul.nama}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Pembina: {ekskul.pembina}</p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{ekskul.jadwal}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 font-medium">
                      <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{ekskul.prestasi}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default function KesiswaanPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-xs text-gray-400">Memuat data kesiswaan...</div>}>
      <KesiswaanContent />
    </Suspense>
  );
}
