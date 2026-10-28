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
} from "lucide-react";

type KesiswaanTab = "TATA_TERTIB" | "PRESTASI" | "EKSTRAKURIKULER";

function KesiswaanContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab")?.toUpperCase() as KesiswaanTab) || "TATA_TERTIB";
  const [activeTab, setActiveTab] = useState<KesiswaanTab>(
    ["TATA_TERTIB", "PRESTASI", "EKSTRAKURIKULER"].includes(initialTab)
      ? initialTab
      : "TATA_TERTIB"
  );

  const tabs: { key: KesiswaanTab; label: string }[] = [
    { key: "TATA_TERTIB", label: "Tata Tertib" },
    { key: "PRESTASI", label: "Prestasi" },
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
      tingkat: "Tingkat Nasional (Universitas Negeri Jakarta - UNJ)",
      peraih: "Nabila Dijayanti (Program Studi Biologi UNJ)",
      predikat: "Lolos Jalur Prestasi SNBP",
      kategori: "Akademik",
    },
    {
      kegiatan: "Festival & Lomba Seni Siswa Nasional (FLS2N) Cabang Kriya",
      tingkat: "Tingkat Kabupaten Way Kanan",
      peraih: "Safety Octa Sushadi & Aji Winata Prayoga",
      predikat: "Juara Umum (Medali Emas & Perak)",
      kategori: "Seni Budaya",
    },
    {
      kegiatan: "Olimpiade Sains Nasional (OSN) Tingkat SMA",
      tingkat: "Tingkat Kabupaten Way Kanan",
      peraih: "Evista Silvy Laudrya",
      predikat: "Medali Perak (Juara 2)",
      kategori: "Sains & Akademik",
    },
    {
      kegiatan: "Olimpiade Olahraga Siswa Nasional (O2SN) Cabang Karate",
      tingkat: "Tingkat Kabupaten Way Kanan",
      peraih: "M. Ziddane Alfaridz",
      predikat: "Medali Perak (Juara 2)",
      kategori: "Olahraga Bela Diri",
    },
    {
      kegiatan: "Olimpiade Olahraga Siswa Nasional (O2SN) Cabang Pencak Silat",
      tingkat: "Tingkat Kabupaten Way Kanan",
      peraih: "Frita Amelia",
      predikat: "Medali Perunggu (Juara 3)",
      kategori: "Olahraga Bela Diri",
    },
    {
      kegiatan: "Lomba Baris-Berbaris (LBB) & Paskibraka Kecamatan Buay Bahuga",
      tingkat: "Tingkat Kecamatan & Kabupaten Way Kanan",
      peraih: "Pasukan Pengibar Bendera SMAN 2 Buay Bahuga",
      predikat: "Pasukan Kehormatan HUT RI",
      kategori: "Kedisiplinan",
    },
  ];

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

      {/* TAB 2: PRESTASI */}
      {activeTab === "PRESTASI" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Rekam Jejak Prestasi Siswa</h2>
              <p className="text-xs text-gray-500">Capaian membanggakan peserta didik SMAN 2 Buay Bahuga di bidang akademik, olahraga, dan seni</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prestasiList.map((pres) => (
              <div
                key={pres.kegiatan}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {pres.predikat}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">{pres.kategori}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 leading-snug">{pres.kegiatan}</h3>
                  <p className="text-xs font-semibold text-[#2A2C5E]">{pres.peraih}</p>
                </div>
                <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500 font-medium">
                  {pres.tingkat}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: EKSTRAKURIKULER */}
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

      {/* Profil Organisasi Siswa OSIS & MPK */}
      {activeTab === "TATA_TERTIB" && (
        <section className="space-y-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Organisasi Siswa Intra Sekolah (OSIS) & MPK</h2>
              <p className="text-xs text-gray-500">Masa Bakti 2026/2027</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs text-xs space-y-1.5">
              <span className="font-semibold text-[#2A2C5E] bg-blue-50 px-2 py-0.5 rounded inline-block">
                Ketua Umum OSIS
              </span>
              <h4 className="font-bold text-gray-900 text-sm">M. Ziddane Alfaridz</h4>
              <p className="text-gray-500">Kelas XI IPS 1 (NISN: 0081234567)</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs text-xs space-y-1.5">
              <span className="font-semibold text-[#2A2C5E] bg-blue-50 px-2 py-0.5 rounded inline-block">
                Wakil Ketua OSIS
              </span>
              <h4 className="font-bold text-gray-900 text-sm">Safety Octa Sushadi</h4>
              <p className="text-gray-500">Kelas XII MIPA 2 (NISN: 0078129342)</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs text-xs space-y-1.5">
              <span className="font-semibold text-[#2A2C5E] bg-blue-50 px-2 py-0.5 rounded inline-block">
                Ketua MPK
              </span>
              <h4 className="font-bold text-gray-900 text-sm">Nabila Dijayanti</h4>
              <p className="text-gray-500">Kelas XII MIPA 1 (NISN: 0078129341)</p>
            </div>
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
