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
  Calendar,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

type KesiswaanTab = "TATA_TERTIB" | "PRESTASI" | "OSIS" | "EKSTRAKURIKULER";

function EkskulLogo({ id, size = "md" }: { id: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass =
    size === "lg" ? "w-16 h-16" : size === "sm" ? "w-10 h-10" : "w-14 h-14";

  switch (id) {
    case "pramuka":
      return (
        <div
          className={`${sizeClass} rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center p-1.5 shrink-0 shadow-2xs`}
          title="Logo Gerakan Pramuka"
        >
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            {/* Segilima Khas Pramuka */}
            <path
              d="M32 4L58 22L48 56H16L6 22L32 4Z"
              fill="#6B3E1B"
              stroke="#D97706"
              strokeWidth="3"
            />
            <path
              d="M32 9L53 23.5L45 51H19L11 23.5L32 9Z"
              fill="#FEF3C7"
            />
            {/* Bintang Ketuhanan */}
            <polygon
              points="32,12 33.6,15.5 37.5,16 34.6,18.7 35.4,22.5 32,20.5 28.6,22.5 29.4,18.7 26.5,16 30.4,15.5"
              fill="#D97706"
            />
            {/* Siluet Tunas Kelapa */}
            <path
              d="M32 23C27 27 25 32 28 37C25 35 22 36 21 39C25 39 28 40 30 43H34C36 40 39 39 43 39C42 36 39 35 36 37C39 32 37 27 32 23Z"
              fill="#6B3E1B"
            />
            <ellipse cx="32" cy="44.5" rx="6.5" ry="3.5" fill="#6B3E1B" />
            <path d="M27 48.5H37" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    case "paskibra":
      return (
        <div
          className={`${sizeClass} rounded-xl bg-red-50 border border-red-200 flex items-center justify-center p-1.5 shrink-0 shadow-2xs`}
          title="Logo Paskibra"
        >
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            {/* Perisai Paskibra */}
            <path
              d="M10 10H54V32C54 46 32 58 32 58C32 58 10 46 10 32V10Z"
              fill="#991B1B"
              stroke="#F59E0B"
              strokeWidth="3"
            />
            {/* Bendera Merah Putih */}
            <path d="M16 16H48V26H16V16Z" fill="#EF4444" />
            <path d="M16 26H48V36H16V26Z" fill="#FFFFFF" />
            {/* Kelopak Teratai Paskibra Emas */}
            <circle cx="32" cy="26" r="7" fill="#F59E0B" stroke="#991B1B" strokeWidth="1.5" />
            <polygon
              points="32,20.5 33.5,24 37.2,24.4 34.4,26.8 35.2,30.5 32,28.5 28.8,30.5 29.6,26.8 26.8,24.4 30.5,24"
              fill="#FFFBEB"
            />
            <path
              d="M22 43C25 46 39 46 42 43"
              stroke="#FCD34D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );

    case "fls2n":
      return (
        <div
          className={`${sizeClass} rounded-xl bg-amber-50/90 border border-amber-300 flex items-center justify-center p-1.5 shrink-0 shadow-2xs`}
          title="Logo Sanggar Seni & Budaya Lampung (FLS2N)"
        >
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <circle cx="32" cy="32" r="27" fill="#7C2D12" stroke="#F59E0B" strokeWidth="3" />
            <circle cx="32" cy="32" r="22" fill="#FFFBEB" />
            {/* Mahkota Siger Lampung 9 Lekuk Emas */}
            <path
              d="M14 38L17 28L21 33L24 23L28 30L32 18L36 30L40 23L43 33L47 28L50 38H14Z"
              fill="#D97706"
              stroke="#7C2D12"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M15 41H49" stroke="#B91C1C" strokeWidth="3" strokeLinecap="round" />
            <path d="M20 46H44" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    case "osn":
      return (
        <div
          className={`${sizeClass} rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center p-1.5 shrink-0 shadow-2xs`}
          title="Logo Klub Olimpiade Sains Nasional (OSN & KIR)"
        >
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <circle cx="32" cy="32" r="27" fill="#1E293B" stroke="#38BDF8" strokeWidth="2.5" />
            {/* Orbit Atom Sains */}
            <ellipse
              cx="32"
              cy="32"
              rx="20"
              ry="8"
              transform="rotate(30 32 32)"
              stroke="#38BDF8"
              strokeWidth="2"
            />
            <ellipse
              cx="32"
              cy="32"
              rx="20"
              ry="8"
              transform="rotate(-30 32 32)"
              stroke="#60A5FA"
              strokeWidth="2"
            />
            <ellipse cx="32" cy="32" rx="8" ry="20" stroke="#93C5FD" strokeWidth="2" />
            {/* Inti Atom Emas */}
            <circle cx="32" cy="32" r="5" fill="#FBBF24" />
          </svg>
        </div>
      );

    case "rohis":
      return (
        <div
          className={`${sizeClass} rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center p-1.5 shrink-0 shadow-2xs`}
          title="Logo Rohani Islam (Rohis)"
        >
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            {/* Bintang Segi Delapan (Rub el Hizb) */}
            <rect
              x="13"
              y="13"
              width="38"
              height="38"
              rx="3"
              fill="#065F46"
              stroke="#F59E0B"
              strokeWidth="2.5"
            />
            <rect
              x="13"
              y="13"
              width="38"
              height="38"
              rx="3"
              transform="rotate(45 32 32)"
              fill="#047857"
              stroke="#F59E0B"
              strokeWidth="2.5"
            />
            {/* Kubah & Bulan Sabit */}
            <path
              d="M22 40V33C22 27 26.5 23 32 20C37.5 23 42 27 42 33V40H22Z"
              fill="#ECFDF5"
            />
            <circle cx="32" cy="16" r="2" fill="#FCD34D" />
            {/* Mushaf Terbuka */}
            <path
              d="M20 43L32 46L44 43V39L32 42L20 39V43Z"
              fill="#FCD34D"
            />
          </svg>
        </div>
      );

    default:
      return (
        <div
          className={`${sizeClass} rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center p-1.5 shrink-0 shadow-2xs`}
          title="Logo Klub Olahraga Prestasi (O2SN)"
        >
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            {/* Perisai Olahraga O2SN */}
            <path
              d="M12 10H52L48 38C46 48 32 56 32 56C32 56 18 48 16 38L12 10Z"
              fill="#2A2C5E"
              stroke="#F59E0B"
              strokeWidth="3"
            />
            {/* Cincin & Obor Juara */}
            <circle cx="25" cy="24" r="5" stroke="#38BDF8" strokeWidth="2.2" />
            <circle cx="32" cy="24" r="5" stroke="#FBBF24" strokeWidth="2.2" />
            <circle cx="39" cy="24" r="5" stroke="#EF4444" strokeWidth="2.2" />
            {/* Piala / Obor Prestasi */}
            <path d="M27 34H37L34 45H30L27 34Z" fill="#F59E0B" />
            <path d="M24 47H40" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );
  }
}

function KesiswaanContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab")?.toUpperCase() as KesiswaanTab) || "TATA_TERTIB";
  const [activeTab, setActiveTab] = useState<KesiswaanTab>(
    ["TATA_TERTIB", "PRESTASI", "OSIS", "EKSTRAKURIKULER"].includes(initialTab)
      ? initialTab
      : "TATA_TERTIB"
  );

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

  const ekskulList = [
    {
      id: "pramuka",
      nama: "Gerakan Pramuka Gudep SMAN 2 Buay Bahuga",
      namaSingkat: "Pramuka",
      kategori: "Kepanduan & Karakter Mandiri",
      icon: Compass,
      pembina: "Tumijo, S.Pd.",
      jabatanPembina: "Pembina Gugus Depan & Waka Kesiswaan",
      jadwal: "Kamis, 15:30 - 17:15 WIB",
      lokasi: "Lapangan Utama & Sanggar Pramuka Sekolah",
      prestasi: "Gudep Teraktif Kwarran Buay Bahuga - Kwarcab Way Kanan",
      struktur: {
        pelindungJabatan: "Kamabigus / Pelindung",
        ketuaJabatan: "Pradana Putra (Ketua)",
        ketuaNama: "Aji Winata Prayoga",
        ketuaKelas: "Kelas XI IPS 2",
        ketuaTugas: "Koordinator Utama Dewan Ambalan & Latihan Rutin Penegak",
        wakilJabatan: "Pradana Putri (Wakil)",
        wakilNama: "Safety Octa Sushadi",
        wakilKelas: "Kelas XII MIPA 2",
        wakilTugas: "Koordinasi Sangga Putri & Pembinaan Kedisiplinan Anggota",
        sekretarisJabatan: "Kerani (Sekretaris Ambalan)",
        sekretarisNama: "Evista Silvy Laudrya",
        sekretarisKelas: "Kelas XI MIPA 1",
        sekretarisTugas: "Administrasi Buku Induk Gudep, Surat-Menyurat, & Pencatatan SKU",
        bendaharaJabatan: "Juru Uang (Bendahara Ambalan)",
        bendaharaNama: "Frita Amelia",
        bendaharaKelas: "Kelas XI IPS 1",
        bendaharaTugas: "Pengelolaan Kas Ambalan & Logistik Peralatan Perkemahan",
        divisi: [
          {
            bidang: "Bidang I • Teknik Kepramukaan (Tekpram)",
            koordinator: "Rizky Pratama (Kelas XI MIPA 1)",
            program: "Pelatihan Pionering, Tali-Temali, Semaphore, Sandi, & Navigasi Darat",
          },
          {
            bidang: "Bidang II • Kegiatan & Perkemahan",
            koordinator: "Bagas Adi Saputra (Kelas XI IPS 1)",
            program: "Kemah Penerimaan Tamu Ambalan (PTA), Pelantikan Bantara, & Lomba Pramuka",
          },
          {
            bidang: "Bidang III • Pengabdian Masyarakat & Evaluasi",
            koordinator: "Putri Maharani (Kelas XI MIPA 2)",
            program: "Bakti Sosial Lingkungan, Pengujian SKU/SKK Penegak, & Kedisiplinan Atribut",
          },
        ],
        anggotaLabel: "Seluruh Anggota Pramuka Penegak (Bantara & Laksana)",
        anggotaJumlah: "85 Siswa Aktif Terdaftar (Sangga Perintis, Penegas, & Pelaksana)",
      },
    },
    {
      id: "paskibra",
      nama: "Pasukan Pengibar Bendera (Paskibra)",
      namaSingkat: "Paskibra",
      kategori: "Kedisiplinan & Patriotisme",
      icon: ShieldCheck,
      pembina: "Marsono, S.Pd.",
      jabatanPembina: "Pembina Paskibra & Pelatih Ketangkasan Baris-Berbaris",
      jadwal: "Selasa & Jumat, 15:30 - 17:15 WIB",
      lokasi: "Lapangan Upacara SMAN 2 Buay Bahuga",
      prestasi: "Pasukan Pengibar Bendera Utama HUT RI Kec. Buay Bahuga",
      struktur: {
        pelindungJabatan: "Pelindung Utama",
        ketuaJabatan: "Komandan Satuan (Dansat)",
        ketuaNama: "M. Ziddane Alfaridz",
        ketuaKelas: "Kelas XI IPS 1",
        ketuaTugas: "Pemimpin Komando Pasukan & Kesiapan Petugas Upacara Bendera",
        wakilJabatan: "Wakil Komandan Satuan",
        wakilNama: "Rizky Pratama",
        wakilKelas: "Kelas XI MIPA 1",
        wakilTugas: "Pengawasan Disiplin Pasukan, Fisik Terukur, & Tata Upacara Sekolah",
        sekretarisJabatan: "Sekretaris Satuan",
        sekretarisNama: "Nabila Dijayanti",
        sekretarisKelas: "Kelas XII MIPA 1",
        sekretarisTugas: "Jadwal Petugas Upacara Senin, Presensi Latihan, & Administrasi Lomba",
        bendaharaJabatan: "Bendahara & Inventaris Atribut",
        bendaharaNama: "Citra Ayu Lestari",
        bendaharaKelas: "Kelas XI MIPA 1",
        bendaharaTugas: "Pengelolaan Kas Satuan & Pemeliharaan Seragam PDU / Bendera",
        divisi: [
          {
            bidang: "Divisi I • Peraturan Baris-Berbaris (PBB)",
            koordinator: "Dimas Arya Wijaya (Kelas X Merdeka 1)",
            program: "Pelatihan PBB Dasar, Variasi Formasi Pasukan, & Seleksi Paskibraka",
          },
          {
            bidang: "Divisi II • Tata Upacara Bendera (TUB)",
            koordinator: "Aji Winata Prayoga (Kelas XI IPS 2)",
            program: "Pembinaan Pengibar Bendera, Pembaca UUD 1945, & Protokoler Upacara",
          },
          {
            bidang: "Divisi III • Pembinaan Fisik & Karakter",
            koordinator: "Bagas Adi Saputra (Kelas XI IPS 1)",
            program: "Ketahanan Fisik Terukur, Jiwa Korsa, & Latihan Gabungan Antar-SMA",
          },
        ],
        anggotaLabel: "Seluruh Anggota Pasukan Pengibar Bendera (Paskibra)",
        anggotaJumlah: "54 Anggota Aktif (Pasukan 17, Pasukan 8, & Pasukan 45)",
      },
    },
    {
      id: "fls2n",
      nama: "Sanggar Seni Kriya & Budaya Lampung (FLS2N)",
      namaSingkat: "Seni & Budaya (FLS2N)",
      kategori: "Seni Rupa, Kriya & Tari Tradisional",
      icon: Sparkles,
      pembina: "Marlita Illiansyah, S.Pd.",
      jabatanPembina: "Pembina Ekstrakurikuler Kesenian & FLS2N",
      jadwal: "Rabu, 15:30 - 17:00 WIB",
      lokasi: "Ruang Sanggar Seni & Aula SMAN 2 Buay Bahuga",
      prestasi: "Juara Umum FLS2N (Medali Emas & Perak Cabang Kriya)",
      struktur: {
        pelindungJabatan: "Pelindung Utama",
        ketuaJabatan: "Ketua Sanggar Seni",
        ketuaNama: "Safety Octa Sushadi",
        ketuaKelas: "Kelas XII MIPA 2",
        ketuaTugas: "Koordinator Utama Latihan Karya Kriya, Tari, & Persiapan FLS2N",
        wakilJabatan: "Wakil Ketua Sanggar",
        wakilNama: "Aji Winata Prayoga",
        wakilKelas: "Kelas XI IPS 2",
        wakilTugas: "Pendampingan Praktik Desain Kriya & Pameran Karya Siswa",
        sekretarisJabatan: "Sekretaris Sanggar",
        sekretarisNama: "Citra Ayu Lestari",
        sekretarisKelas: "Kelas XI MIPA 1",
        sekretarisTugas: "Katalogisasi Karya Seni Siswa, Dokumentasi, & Jadwal Pentas",
        bendaharaJabatan: "Bendahara & Logistik Bahan",
        bendaharaNama: "Putri Maharani",
        bendaharaKelas: "Kelas XI MIPA 2",
        bendaharaTugas: "Pengadaan Bahan Baku Kriya, Kostum Tari, & Kas Sanggar",
        divisi: [
          {
            bidang: "Divisi I • Desain & Seni Kriya Nusantara",
            koordinator: "Aji Winata Prayoga (Kelas XI IPS 2)",
            program: "Kriya Anyam, Ukiran Ornamen Lampung, & Kerajinan Berbasis Kearifan Lokal",
          },
          {
            bidang: "Divisi II • Seni Tari & Musik Tradisional",
            koordinator: "Frita Amelia (Kelas XI IPS 1)",
            program: "Tari Sigeh Penguten, Tari Kreasi Lampung, & Penyambutan Tamu Kehormatan",
          },
          {
            bidang: "Divisi III • Vokal Solo, Sastra & Desain Poster",
            koordinator: "Evista Silvy Laudrya (Kelas XI MIPA 1)",
            program: "Pembinaan Baca Puisi, Vokal Solo Pelajar, & Desain Grafis Digital",
          },
        ],
        anggotaLabel: "Seluruh Anggota Sanggar Seni & Budaya SMAN 2 Buay Bahuga",
        anggotaJumlah: "46 Siswa Aktif (Divisi Kriya, Tari Tradisional, & Vokal)",
      },
    },
    {
      id: "osn",
      nama: "Klub Olimpiade Sains Nasional (OSN & KIR)",
      namaSingkat: "Klub OSN & KIR",
      kategori: "Pembinaan Sains & Riset Ilmiah",
      icon: Activity,
      pembina: "Wida Awanda, S.Pd.Si. & Eva Dwi Kurniawati, S.Pd.",
      jabatanPembina: "Tim Pembina Olimpiade Sains & Karya Ilmiah Remaja",
      jadwal: "Sabtu, 09:00 - 11:30 WIB",
      lokasi: "Laboratorium IPA Terpadu & Lab Komputer",
      prestasi: "Peraih Medali Perak OSN Tingkat Kabupaten Way Kanan",
      struktur: {
        pelindungJabatan: "Pelindung Akademik",
        ketuaJabatan: "Ketua Klub Sains & KIR",
        ketuaNama: "Evista Silvy Laudrya",
        ketuaKelas: "Kelas XI MIPA 1",
        ketuaTugas: "Koordinator Kelompok Studi OSN & Riset Laboratorium Siswa",
        wakilJabatan: "Wakil Ketua Klub Sains",
        wakilNama: "Nabila Dijayanti",
        wakilKelas: "Kelas XII MIPA 1",
        wakilTugas: "Pendampingan Tutor Sebaya & Bedah Soal Seleksi Olimpiade",
        sekretarisJabatan: "Sekretaris & Dokumentasi Riset",
        sekretarisNama: "Putri Maharani",
        sekretarisKelas: "Kelas XI MIPA 2",
        sekretarisTugas: "Penyusunan Modul Latihan OSN, Jurnal KIR, & Pendaftaran Puspresnas",
        bendaharaJabatan: "Bendahara Klub Sains",
        bendaharaNama: "Citra Ayu Lestari",
        bendaharaKelas: "Kelas XI MIPA 1",
        bendaharaTugas: "Pengelolaan Kebutuhan Bahan Praktikum & Referensi Buku Olimpiade",
        divisi: [
          {
            bidang: "Rumpun I • Matematika, Fisika & Informatika",
            koordinator: "Rizky Pratama (Kelas XI MIPA 1)",
            program: "Pemecahan Masalah Analitis, Eksperimen Fisika Terapan, & Algoritma",
          },
          {
            bidang: "Rumpun II • Biologi, Kimia & Kebumian",
            koordinator: "Nabila Dijayanti (Kelas XII MIPA 1)",
            program: "Praktikum Bioteknologi, Analisis Kimia, & Geosains Kebumian",
          },
          {
            bidang: "Rumpun III • Ekonomi, Geografi & Karya Ilmiah",
            koordinator: "Evista Silvy Laudrya (Kelas XI MIPA 1)",
            program: "Olimpiade Geografi-Ekonomi & Penulisan Karya Tulis Ilmiah Remaja (KIR)",
          },
        ],
        anggotaLabel: "Seluruh Anggota Klub Olimpiade Sains (OSN) & KIR",
        anggotaJumlah: "42 Siswa Binaan Olimpiade (9 Bidang Sains Puspresnas)",
      },
    },
    {
      id: "rohis",
      nama: "Rohani Islam (Rohis) & Bina Imtaq",
      namaSingkat: "Rohis & Imtaq",
      kategori: "Keagamaan & Akhlak Mulia",
      icon: Flame,
      pembina: "Mamad Fhadoli, S.Pd.I.",
      jabatanPembina: "Pembina Kerohanian & Pendidikan Agama Islam",
      jadwal: "Jumat, 11:30 - 13:15 WIB",
      lokasi: "Mushola Al-Hikmah SMAN 2 Buay Bahuga",
      prestasi: "Penyelenggara Gebyar PHBI & Pesantren Kilat Sekolah",
      struktur: {
        pelindungJabatan: "Pelindung Utama",
        ketuaJabatan: "Ketua Umum Rohis",
        ketuaNama: "Aji Winata Prayoga",
        ketuaKelas: "Kelas XI IPS 2",
        ketuaTugas: "Koordinator Kegiatan Dakwah Sekolah, Kultum Jumat, & PHBI",
        wakilJabatan: "Wakil Ketua Rohis",
        wakilNama: "Dimas Arya Wijaya",
        wakilKelas: "Kelas X Merdeka 1",
        wakilTugas: "Koordinasi Kemakmuran Mushola & Jadwal Muazin / Imam Siswa",
        sekretarisJabatan: "Sekretaris Rohis",
        sekretarisNama: "Nabila Dijayanti",
        sekretarisKelas: "Kelas XII MIPA 1",
        sekretarisTugas: "Agenda Kajian Mingguan, Buletin Dakwah, & Kepanitiaan Hari Besar",
        bendaharaJabatan: "Bendahara & Infaq Sosial",
        bendaharaNama: "Frita Amelia",
        bendaharaKelas: "Kelas XI IPS 1",
        bendaharaTugas: "Pengelolaan Kotak Infaq Jumat & Santunan Sosial Warga Sekolah",
        divisi: [
          {
            bidang: "Bidang I • Dakwah, Kajian & Tahsin Al-Qur'an",
            koordinator: "Rizky Pratama (Kelas XI MIPA 1)",
            program: "Kajian Rutin Jumat, Bimbingan Baca Tulis Al-Qur'an, & Kultum Siswa",
          },
          {
            bidang: "Bidang II • Kemakmuran Mushola & Ibadah",
            koordinator: "Bagas Adi Saputra (Kelas XI IPS 1)",
            program: "Gerakan Sholat Dhuha & Dzuhur Berjamaah serta Kebersihan Mushola",
          },
          {
            bidang: "Bidang III • Seni Islam (Hadroh/MTQ) & Sosial",
            koordinator: "Putri Maharani (Kelas XI MIPA 2)",
            program: "Pembinaan Tilawah MTQ Pelajar, Grup Hadroh, & Bakti Sosial Ramadhan",
          },
        ],
        anggotaLabel: "Seluruh Anggota Aktif Rohani Islam (Rohis) SMAN 2 Buay Bahuga",
        anggotaJumlah: "64 Siswa Aktif Penggerak Dakwah & Bina Imtaq Sekolah",
      },
    },
    {
      id: "o2sn",
      nama: "Klub Olahraga Prestasi & Bela Diri (O2SN)",
      namaSingkat: "Olahraga & Bela Diri (O2SN)",
      kategori: "Karate, Pencak Silat, Futsal & Voli",
      icon: Trophy,
      pembina: "Meiliana, S.Pd.",
      jabatanPembina: "Pembina Ekstrakurikuler Olahraga Prestasi & O2SN",
      jadwal: "Senin & Rabu, 16:00 - 17:30 WIB",
      lokasi: "Gelanggang Olahraga & Lapangan Terpadu Sekolah",
      prestasi: "Juara 2 Karate & Juara 3 Pencak Silat O2SN Way Kanan",
      struktur: {
        pelindungJabatan: "Pelindung Utama",
        ketuaJabatan: "Ketua Klub Olahraga (Kapten)",
        ketuaNama: "M. Ziddane Alfaridz",
        ketuaKelas: "Kelas XI IPS 1",
        ketuaTugas: "Koordinator Latihan Cabang Bela Diri & Persiapan Kontingen O2SN",
        wakilJabatan: "Wakil Ketua Klub Olahraga",
        wakilNama: "Frita Amelia",
        wakilKelas: "Kelas XI IPS 1",
        wakilTugas: "Koordinasi Cabang Pencak Silat, Atletik, & Kebugaran Atlet Siswa",
        sekretarisJabatan: "Sekretaris Klub Olahraga",
        sekretarisNama: "Evista Silvy Laudrya",
        sekretarisKelas: "Kelas XI MIPA 1",
        sekretarisTugas: "Pendataan Atlet Sekolah, Jadwal Sparring, & Pendaftaran Turnamen",
        bendaharaJabatan: "Bendahara & Logistik Alat",
        bendaharaNama: "Bagas Adi Saputra",
        bendaharaKelas: "Kelas XI IPS 1",
        bendaharaTugas: "Pemeliharaan Matras, Bola, Jaring, & Perlengkapan Tanding",
        divisi: [
          {
            bidang: "Cabang I • Bela Diri Karate & Pencak Silat",
            koordinator: "M. Ziddane Alfaridz & Frita Amelia (XI IPS 1)",
            program: "Latihan Intensif Kumite/Kata Karate & Seni/Tanding Pencak Silat O2SN",
          },
          {
            bidang: "Cabang II • Bola Voli & Futsal Putra/Putri",
            koordinator: "Bagas Adi Saputra (Kelas XI IPS 1)",
            program: "Teknik Permainan Beregu, Turnamen Antar-SMA, & Classmeeting",
          },
          {
            bidang: "Cabang III • Atletik & Bulu Tangkis",
            koordinator: "Dimas Arya Wijaya (Kelas X Merdeka 1)",
            program: "Pembinaan Lari, Lompat Jauh, & Cabang Bulu Tangkis Tunggal/Ganda",
          },
        ],
        anggotaLabel: "Seluruh Atlet & Anggota Klub Olahraga SMAN 2 Buay Bahuga",
        anggotaJumlah: "72 Siswa Aktif (Cabang Karate, Pencak Silat, Voli, & Futsal)",
      },
    },
  ];

  const [selectedEkskulId, setSelectedEkskulId] = useState<string | null>(null);
  const selectedEkskul = ekskulList.find((e) => e.id === selectedEkskulId) || null;

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
                  onClick={() => {
                    setActiveTab(tab.key);
                    if (tab.key === "EKSTRAKURIKULER") {
                      setSelectedEkskulId(null);
                    }
                  }}
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

          {/* Grid Kartu Prestasi Berfoto */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prestasiList.map((pres) => (
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

                  {/* Judul & Jenis Lomba (Tinggi Terkunci Sejajar Antar-Kartu) */}
                  <div className="p-5 pb-4 space-y-1.5">
                    <div className="min-h-[2.75rem] flex items-start">
                      <h3 className="text-sm sm:text-base font-extrabold text-gray-900 leading-snug line-clamp-2">
                        {pres.kegiatan}
                      </h3>
                    </div>
                    <div className="min-h-[2.25rem] flex items-start">
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {pres.jenisLomba}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detail Terstruktur: Nama Siswa, Guru Pembimbing, & Tingkat */}
                <div className="px-5 pb-5 pt-3 border-t border-gray-100 bg-gray-50/50 space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5 min-h-[2.5rem]">
                    <GraduationCap className="w-4 h-4 text-[#2A2C5E] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block leading-none mb-0.5">
                        Nama Siswa Peraih
                      </span>
                      <span className="font-bold text-gray-900 block leading-snug line-clamp-2">
                        {pres.peraih}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 min-h-[2.6rem]">
                    <UserCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block leading-none mb-0.5">
                        Guru Pembimbing
                      </span>
                      <span className="font-semibold text-gray-800 block leading-snug line-clamp-2">
                        {pres.pembimbing}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-2.5 border-t border-gray-200/70 min-h-[2.5rem]">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block leading-none mb-0.5">
                        Tingkat Kejuaraan
                      </span>
                      <span className="font-bold text-[#2A2C5E] block leading-snug">
                        {pres.tingkat}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedEkskul
                    ? `Struktur Organisasi ${selectedEkskul.namaSingkat}`
                    : "Cabang Kegiatan Ekstrakurikuler"}
                </h2>
                <p className="text-xs text-gray-500">
                  {selectedEkskul
                    ? `Susunan kepengurusan resmi ${selectedEkskul.nama} periode 2026/2027`
                    : "Klik pada kartu ekstrakurikuler untuk melihat bagan struktur kepengurusannya"}
                </p>
              </div>
            </div>

            {selectedEkskul && (
              <button
                type="button"
                onClick={() => setSelectedEkskulId(null)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#2A2C5E] text-white text-xs font-semibold hover:bg-[#1f2147] transition-colors cursor-pointer self-start sm:self-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Daftar Ekskul</span>
              </button>
            )}
          </div>

          {/* DAFTAR KARTU EKSTRAKURIKULER (TAMPIL SAAT BELUM ADA YANG DIKLIK) */}
          {!selectedEkskul && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {ekskulList.map((ekskul) => {
                return (
                  <button
                    key={ekskul.id}
                    type="button"
                    onClick={() => setSelectedEkskulId(ekskul.id)}
                    className="group text-left bg-white p-6 rounded-xl border border-gray-200 hover:border-[#2A2C5E] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between h-full cursor-pointer"
                  >
                    <div className="w-full flex flex-col">
                      {/* Baris 1: Logo & Badge Kategori (Tinggi Terkunci) */}
                      <div className="flex items-start justify-between gap-3 h-14">
                        <EkskulLogo id={ekskul.id} size="md" />
                        <span className="text-[11px] font-semibold text-[#2A2C5E] bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-100 text-right leading-tight">
                          {ekskul.kategori}
                        </span>
                      </div>

                      {/* Baris 2: Nama Ekskul (Tinggi 2 Baris Terkunci Agar Garis Bawah Sejajar Lurus) */}
                      <div className="mt-4 min-h-[2.75rem] flex items-start">
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-[#2A2C5E] transition-colors leading-snug line-clamp-2">
                          {ekskul.nama}
                        </h3>
                      </div>

                      {/* Baris 3-5: Pembina, Jam Latihan, & Capaian (Tinggi Tiap Baris Terkunci Sejajar) */}
                      <div className="mt-3 pt-3.5 border-t border-gray-100 text-xs flex flex-col gap-3">
                        <div className="flex items-start gap-2.5 min-h-[2.6rem]">
                          <UserCheck className="w-4 h-4 text-[#2A2C5E] shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 leading-none">
                              Guru Pembina Ekskul
                            </p>
                            <p className="font-bold text-gray-800 leading-snug line-clamp-2">
                              {ekskul.pembina}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 min-h-[2.25rem]">
                          <Clock className="w-4 h-4 text-[#2A2C5E] shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 leading-none">
                              Jadwal & Jam Latihan
                            </p>
                            <p className="font-semibold text-gray-800 leading-snug">
                              {ekskul.jadwal}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 min-h-[3.1rem]">
                          <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 leading-none">
                              Capaian Unggulan
                            </p>
                            <p className="font-medium text-emerald-700 leading-snug line-clamp-2">
                              {ekskul.prestasi}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Baris 6: Footer Action */}
                    <div className="w-full mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#2A2C5E]">
                      <span>Lihat Struktur Ekstrakurikuler</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* TAMPILAN BAGAN STRUKTUR ORGANISASI EKSKUL SAAT DIKLIK (TANPA FILTER EKSTRAKURIKULER LAIN) */}
          {selectedEkskul && (
            <div className="space-y-5">
              {/* Kartu Ringkasan Info Ekskul (Logo, Nama, Pembina, Jam, Lokasi) */}
              <div className="bg-[#2A2C5E] text-white rounded-xl p-5 sm:p-6 shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                  <div className="sm:col-span-2 flex items-center gap-4">
                    <EkskulLogo id={selectedEkskul.id} size="lg" />
                    <div className="space-y-1">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-white/15 text-blue-100 px-2.5 py-0.5 rounded">
                        {selectedEkskul.kategori}
                      </span>
                      <h3 className="text-base sm:text-xl font-extrabold tracking-tight leading-snug">
                        {selectedEkskul.nama}
                      </h3>
                      <p className="text-xs text-blue-100/90 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>Lokasi: {selectedEkskul.lokasi}</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3.5 border border-white/15 space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-blue-200 font-semibold">
                      Guru Pembina Ekskul
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      {selectedEkskul.pembina}
                    </p>
                    <p className="text-[11px] text-blue-100/80">{selectedEkskul.jabatanPembina}</p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3.5 border border-white/15 space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-blue-200 font-semibold">
                      Jadwal & Jam Latihan
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      {selectedEkskul.jadwal}
                    </p>
                    <p className="text-[11px] text-emerald-300 font-medium">
                      Aktif • TP 2026/2027
                    </p>
                  </div>
                </div>
              </div>

              {/* BAGAN HIERARKI STRUKTUR ORGANISASI EKSTRAKURIKULER */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-2xs p-4 sm:p-8">
                <div className="flex flex-col items-center">
                  {/* LEVEL 1: PELINDUNG (KEPALA SEKOLAH), WAKA KESISWAAN, & PEMBINA EKSKUL */}
                  <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                    {/* Kiri Desktop: Koordinator Kesiswaan */}
                    <div className="hidden lg:flex items-center justify-end">
                      <div className="w-full max-w-xs bg-blue-50/50 border border-blue-200 rounded-xl p-4 text-center space-y-1">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#2A2C5E] bg-blue-100/80 px-2.5 py-0.5 rounded">
                          Koordinator Kesiswaan
                        </span>
                        <h4 className="text-sm font-bold text-gray-900">Tumijo, S.Pd.</h4>
                        <p className="text-[11px] text-gray-500">NIP. 19780512 200501 1 003</p>
                        <p className="text-[11px] text-gray-600 font-medium">
                          Waka Bidang Kesiswaan
                        </p>
                      </div>
                      <div className="w-8 border-t-2 border-dashed border-[#2A2C5E]/40" />
                    </div>

                    {/* Tengah: Pelindung / Kamabigus (Kepala Sekolah) */}
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-sm bg-[#2A2C5E] text-white rounded-xl p-4 sm:p-5 text-center shadow-sm border-2 border-[#2A2C5E] space-y-1">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-white/15 text-blue-100 px-3 py-0.5 rounded-full">
                          {selectedEkskul.struktur.pelindungJabatan}
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold tracking-tight pt-0.5">
                          Apriyani, S.Si., M.M.Pd.
                        </h3>
                        <p className="text-[11px] text-blue-100 font-medium">
                          NIP. 19720405 200501 2 005
                        </p>
                        <p className="text-[11px] text-blue-200/90 pt-1 border-t border-white/15">
                          Kepala SMA Negeri 2 Buay Bahuga
                        </p>
                      </div>
                    </div>

                    {/* Kanan Desktop: Pembina Ekstrakurikuler */}
                    <div className="hidden lg:flex items-center justify-start">
                      <div className="w-8 border-t-2 border-[#2A2C5E]/40" />
                      <div className="w-full max-w-xs bg-blue-50/70 border-2 border-[#2A2C5E]/30 rounded-xl p-4 text-center space-y-1">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-white bg-[#2A2C5E] px-2.5 py-0.5 rounded">
                          Pembina {selectedEkskul.namaSingkat}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900">
                          {selectedEkskul.pembina}
                        </h4>
                        <p className="text-[11px] text-[#2A2C5E] font-semibold">
                          {selectedEkskul.jabatanPembina}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* KHUSUS MOBILE & TABLET (< lg): CABANG WAKA KESISWAAN & PEMBINA EKSKUL */}
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
                            Waka Kesiswaan
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                            Tumijo, S.Pd.
                          </h4>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-gray-600 leading-snug pt-1 border-t border-blue-100">
                          Koordinator Ekskul
                        </p>
                      </div>
                      <div className="bg-blue-50/70 border border-[#2A2C5E]/30 rounded-xl p-3 text-center space-y-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-white bg-[#2A2C5E] px-2 py-0.5 rounded">
                            Pembina Ekskul
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                            {selectedEkskul.pembina}
                          </h4>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-[#2A2C5E] font-medium leading-snug pt-1 border-t border-blue-100">
                          {selectedEkskul.namaSingkat}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* GARIS VERTIKAL MENUJU KETUA & WAKIL KETUA EKSKUL */}
                  <div className="w-0.5 h-7 sm:h-9 bg-[#2A2C5E]/40 relative flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2A2C5E] ring-4 ring-blue-50" />
                  </div>

                  {/* LEVEL 2: KETUA / PRADANA / KOMANDAN & WAKIL */}
                  <div className="w-full max-w-2xl relative grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                    <div className="sm:hidden absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-[#2A2C5E]/35 z-0" />
                    <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#2A2C5E]/35 z-0" />

                    <div className="relative z-10 bg-white rounded-xl border-2 border-[#2A2C5E] p-4 text-center shadow-xs space-y-1.5">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-white bg-[#2A2C5E] px-3 py-0.5 rounded-full">
                        {selectedEkskul.struktur.ketuaJabatan}
                      </span>
                      <h4 className="text-sm sm:text-base font-extrabold text-gray-900">
                        {selectedEkskul.struktur.ketuaNama}
                      </h4>
                      <p className="text-xs font-semibold text-[#2A2C5E]">
                        {selectedEkskul.struktur.ketuaKelas}
                      </p>
                      <p className="text-[11px] text-gray-600 pt-1.5 border-t border-gray-100">
                        {selectedEkskul.struktur.ketuaTugas}
                      </p>
                    </div>

                    <div className="relative z-10 bg-white rounded-xl border-2 border-[#2A2C5E]/40 p-4 text-center shadow-xs space-y-1.5">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#2A2C5E] bg-blue-50 px-3 py-0.5 rounded-full">
                        {selectedEkskul.struktur.wakilJabatan}
                      </span>
                      <h4 className="text-sm sm:text-base font-extrabold text-gray-900">
                        {selectedEkskul.struktur.wakilNama}
                      </h4>
                      <p className="text-xs font-semibold text-[#2A2C5E]">
                        {selectedEkskul.struktur.wakilKelas}
                      </p>
                      <p className="text-[11px] text-gray-600 pt-1.5 border-t border-gray-100">
                        {selectedEkskul.struktur.wakilTugas}
                      </p>
                    </div>
                  </div>

                  {/* GARIS VERTIKAL MENUJU SEKRETARIS & BENDAHARA EKSKUL */}
                  <div className="w-0.5 h-7 sm:h-8 bg-[#2A2C5E]/40 relative flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2A2C5E] ring-4 ring-blue-50" />
                  </div>

                  <div className="hidden sm:block w-1/2 max-w-md h-0.5 bg-[#2A2C5E]/40 relative">
                    <div className="absolute left-0 top-0 w-0.5 h-4 bg-[#2A2C5E]/40" />
                    <div className="absolute right-0 top-0 w-0.5 h-4 bg-[#2A2C5E]/40" />
                  </div>

                  {/* LEVEL 3: SEKRETARIS & BENDAHARA EKSKUL */}
                  <div className="w-full max-w-2xl relative grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 sm:pt-4">
                    <div className="sm:hidden absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-[#2A2C5E]/35 z-0" />

                    <div className="relative z-10 bg-gray-50 rounded-xl border border-gray-200 p-4 text-center space-y-1">
                      <span className="inline-block text-[10px] font-bold text-[#2A2C5E] bg-white border border-gray-200 px-2.5 py-0.5 rounded">
                        {selectedEkskul.struktur.sekretarisJabatan}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900">
                        {selectedEkskul.struktur.sekretarisNama}
                      </h4>
                      <p className="text-[11px] font-medium text-[#2A2C5E]">
                        {selectedEkskul.struktur.sekretarisKelas}
                      </p>
                      <p className="text-[11px] text-gray-600 pt-1 border-t border-gray-200/70">
                        {selectedEkskul.struktur.sekretarisTugas}
                      </p>
                    </div>

                    <div className="relative z-10 bg-gray-50 rounded-xl border border-gray-200 p-4 text-center space-y-1">
                      <span className="inline-block text-[10px] font-bold text-[#2A2C5E] bg-white border border-gray-200 px-2.5 py-0.5 rounded">
                        {selectedEkskul.struktur.bendaharaJabatan}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900">
                        {selectedEkskul.struktur.bendaharaNama}
                      </h4>
                      <p className="text-[11px] font-medium text-[#2A2C5E]">
                        {selectedEkskul.struktur.bendaharaKelas}
                      </p>
                      <p className="text-[11px] text-gray-600 pt-1 border-t border-gray-200/70">
                        {selectedEkskul.struktur.bendaharaTugas}
                      </p>
                    </div>
                  </div>

                  {/* GARIS VERTIKAL MENUJU 3 DIVISI / BIDANG TEKNIS EKSKUL */}
                  <div className="w-0.5 h-7 sm:h-9 bg-[#2A2C5E]/40 relative flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2A2C5E] ring-4 ring-blue-50" />
                  </div>

                  {/* GARIS CABANG HORIZONTAL UNTUK 3 DIVISI (Desktop) */}
                  <div className="hidden lg:block w-[68%] h-0.5 bg-[#2A2C5E]/40 relative">
                    <div className="absolute left-0 top-0 w-0.5 h-5 bg-[#2A2C5E]/40" />
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-5 bg-[#2A2C5E]/40" />
                    <div className="absolute right-0 top-0 w-0.5 h-5 bg-[#2A2C5E]/40" />
                  </div>

                  {/* LEVEL 4: 3 DIVISI / BIDANG KEGIATAN EKSKUL */}
                  <div className="w-full relative grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:pt-5">
                    <div className="lg:hidden absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-[#2A2C5E]/35 z-0" />

                    {selectedEkskul.struktur.divisi.map((div) => (
                      <div
                        key={div.bidang}
                        className="relative z-10 bg-white rounded-xl border border-gray-200 hover:border-[#2A2C5E] p-4 text-center shadow-2xs transition-all space-y-1.5 flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <span className="inline-block text-[10px] font-bold text-[#2A2C5E] bg-blue-50 px-2.5 py-0.5 rounded">
                            {div.bidang}
                          </span>
                          <p className="text-xs font-bold text-gray-900 pt-0.5">
                            Koordinator: {div.koordinator}
                          </p>
                        </div>
                        <p className="text-[11px] text-gray-600 pt-2 border-t border-gray-100 leading-relaxed">
                          {div.program}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* GARIS VERTIKAL MENUJU SELURUH ANGGOTA EKSTRAKURIKULER */}
                  <div className="w-0.5 h-7 sm:h-8 bg-[#2A2C5E]/40 relative flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#2A2C5E]" />
                  </div>

                  {/* LEVEL 5: SELURUH ANGGOTA EKSTRAKURIKULER */}
                  <div className="w-full max-w-xl bg-emerald-50/80 border-2 border-emerald-600/30 rounded-xl p-4 text-center space-y-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
                      Anggota Aktif Ekstrakurikuler
                    </span>
                    <h4 className="text-sm sm:text-base font-extrabold text-gray-900">
                      {selectedEkskul.struktur.anggotaLabel}
                    </h4>
                    <p className="text-xs text-emerald-900 font-medium">
                      {selectedEkskul.struktur.anggotaJumlah}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
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
