import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  Network, 
  ChevronRight, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Briefcase, 
  BookOpen, 
  Building2, 
  PhoneCall, 
  Compass, 
  Laptop, 
  CheckCircle2, 
  Layers, 
  ArrowRight 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Struktur Organisasi Sekolah | SMAN 2 Buay Bahuga",
  description:
    "Bagan susunan kepemimpinan, jajaran wakil kepala sekolah, kepala tata usaha, dan unit penunjang SMA Negeri 2 Buay Bahuga, Kabupaten Way Kanan.",
};

function getInitials(name: string): string {
  const clean = name.replace(/^(drs\.|dra\.|dr\.|h\.|hj\.)\s*/i, "");
  const parts = clean
    .split(/[ ,.]+/)
    .filter((p) => p.length > 1 && !/^(s\.pd|m\.pd|s\.si|m\.mpd|s\.e|s\.sos|s\.kom|a\.md|kons|sh)$/i.test(p));
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return "GR";
}

const LEADERSHIP_TEAM = [
  {
    role: "Kepala Sekolah",
    name: "Apriyani, S.Si., M.M.Pd.",
    nip: "19780512 200501 2 008",
    photo: null,
    level: "Pimpinan Utama",
    desc: "Penanggung jawab umum seluruh kebijakan, tata kelola manajerial, mutu akademik, dan akuntabilitas kelembagaan sekolah.",
    badge: "Pimpinan Sekolah",
    color: "from-sky-600 to-sky-800",
  },
  {
    role: "Komite Sekolah",
    name: "H. Sudirman, S.H.",
    nip: "Tokoh Masyarakat",
    photo: null,
    level: "Badan Pertimbangan & Mitra",
    desc: "Lembaga mandiri yang memberikan pertimbangan, pengawasan transparansi, dan dukungan peran serta masyarakat dalam pemajuan sekolah.",
    badge: "Mitra Independen",
    color: "from-slate-700 to-slate-900",
  },
  {
    role: "Kepala Tata Usaha (KTU)",
    name: "Wahyudi, S.E.",
    nip: "19850612 201001 1 015",
    photo: null,
    level: "Unsur Tata Usaha",
    desc: "Memimpin pengelolaan ketatausahaan, administrasi kepegawaian, surat-menyurat, pengelolaan anggaran rutin, dan sarana umum.",
    badge: "Administrasi",
    color: "from-teal-600 to-teal-800",
  },
];

const WAKA_TEAM = [
  {
    title: "Waka Bidang Kurikulum",
    name: "Bambang Irawan, S.Pd., M.Pd.",
    nip: "19820315 200801 1 012",
    photo: null,
    icon: BookOpen,
    desc: "Mengkoordinasikan implementasi Kurikulum Merdeka, pembagian jam mengajar, kalender akademik, ANBK/asesmen, dan evaluasi belajar peserta didik.",
    tupoksi: [
      "Penyusunan Kurikulum Operasional Satuan Pendidikan (KOSP)",
      "Penyusunan jadwal KBM dan asesmen semester/ujian akhir",
      "Peningkatan kompetensi pedagogik guru dan bimbingan belajar",
    ],
  },
  {
    title: "Waka Bidang Kesiswaan",
    name: "Siti Rahmawati, S.Pd.",
    nip: "19840722 200902 2 005",
    photo: null,
    icon: Users,
    desc: "Membina kedisiplinan siswa, memfasilitasi program OSIS/MPK, mengelola seleksi lomba kesiswaan, dan pembinaan karakter.",
    tupoksi: [
      "Pelaksanaan Masa Pengenalan Lingkungan Sekolah (MPLS)",
      "Pembinaan organisasi siswa (OSIS & MPK) serta 12+ ekstrakurikuler",
      "Pendampingan kejuaraan OSN, O2SN, dan FLS2N pelajar",
    ],
  },
  {
    title: "Waka Bidang Sarana & Prasarana",
    name: "Ahmad Fauzi, S.Pd.",
    nip: "19801105 200604 1 009",
    photo: null,
    icon: Building2,
    desc: "Mengelola pemeliharaan aset fisik sekolah, laboratorium komputer CBT, laboratorium sains IPA, dan keamanan lingkungan kampus.",
    tupoksi: [
      "Inventarisasi dan pemeliharaan gedung serta fasilitas belajar",
      "Pengembangan ruang multimedia dan perangkat teknologi informasi",
      "Penerapan standar kebersihan, keindahan, dan keamanan sekolah",
    ],
  },
  {
    title: "Waka Bidang Hubungan Masyarakat (Humas)",
    name: "Nurul Hidayah, S.Sos.",
    nip: "19860918 201101 2 014",
    photo: null,
    icon: PhoneCall,
    desc: "Membangun kemitraan eksternal dengan perguruan tinggi negeri, instansi kedinasan, dunia usaha, media publikasi, dan orang tua siswa.",
    tupoksi: [
      "Pengelolaan informasi publik dan media komunikasi resmi sekolah",
      "Kemitraan bimbingan karir perguruan tinggi dan studi lanjut",
      "Penyelenggaraan forum silaturahmi komite dan wali murid",
    ],
  },
];

const UNIT_COORDINATORS = [
  {
    title: "Kepala Laboratorium Komputer & CBT",
    name: "Hendra Wijaya, S.Kom.",
    nip: "19931105 201903 1 011",
    desc: "Pemeliharaan workstation ujian CBT, jaringan internet, dan server sistem sekolah.",
  },
  {
    title: "Kepala Perpustakaan Digital",
    name: "Tri Wahyuni, S.Pd.",
    nip: "19850619 200902 2 004",
    desc: "Pengelolaan katalog buku, pojok baca digital, dan gerakan literasi sekolah.",
  },
  {
    title: "Koordinator Bimbingan Konseling (BK)",
    name: "Rina Kusuma, S.Sos.",
    nip: "19940722 202012 2 015",
    desc: "Konseling karir perguruan tinggi, pendampingan psikologis, dan penelusuran bakat siswa.",
  },
  {
    title: "Operator Dapodik & Kesiswaan",
    name: "Sri Mulyani, A.Md.",
    nip: "19900815 201602 2 011",
    desc: "Sinkronisasi data pokok pendidikan nasional (Dapodikdasmen) dan administrasi NISN.",
  },
];

export default function ProfilStrukturPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/profil" className="hover:text-sky-600 transition">Profil</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-bold">Struktur Organisasi</span>
        </nav>

        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Network className="w-3.5 h-3.5 text-sky-600" />
            <span>Tata Kelola Kelembagaan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Struktur Organisasi Sekolah
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Susunan pimpinan, jajaran wakil kepala sekolah, kepala tata usaha, serta unit penunjang teknis yang menggerakkan roda manajemen mutu di SMA Negeri 2 Buay Bahuga.
          </p>
        </div>

        {/* ─── BAGAN VISUAL HIERARKI KEPEMIMPINAN ─── */}
        <div className="space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Bagan Pimpinan Struktural
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">Hierarki Manajemen Sekolah</h2>
          </div>

          {/* Level 1: Kepala Sekolah & Komite */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Kepala Sekolah */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-sky-600 via-sky-700 to-sky-900 text-white shadow-xl space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-sky-100 text-xs font-bold uppercase tracking-wider">
                    Pimpinan Utama
                  </span>
                  <div className="relative w-14 h-14 rounded-full ring-2 ring-white/60 overflow-hidden shadow-md shrink-0 flex items-center justify-center bg-white/20">
                    {LEADERSHIP_TEAM[0].photo ? (
                      <Image
                        src={LEADERSHIP_TEAM[0].photo}
                        alt="Apriyani, S.Si., M.M.Pd."
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-black text-base tracking-wider">
                        {getInitials(LEADERSHIP_TEAM[0].name)}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-sky-200 font-semibold uppercase tracking-wider">Kepala Sekolah</div>
                  <h3 className="text-2xl font-black mt-1">Apriyani, S.Si., M.M.Pd.</h3>
                  <div className="text-xs font-mono text-sky-200 mt-0.5">NIP. 19780512 200501 2 008</div>
                </div>

                <p className="text-xs sm:text-sm text-sky-100 leading-relaxed pt-2 border-t border-white/10">
                  Penanggung jawab umum pengelolaan pendidikan, tata kelola anggaran, kepemimpinan pembelajaran, dan kemitraan kelembagaan.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-2 text-xs text-sky-200">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Pembina Tk. I / IV b</span>
              </div>
            </div>

            {/* Komite Sekolah */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                    Mitra Independen
                  </span>
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Ketua Komite Sekolah</div>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">H. Sudirman, S.H.</h3>
                  <div className="text-xs text-slate-400 mt-0.5">Representasi Tokoh Masyarakat & Wali Murid</div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                  Memberikan pertimbangan dalam penentuan kebijakan sekolah, RKAS, serta memfasilitasi aspirasi masyarakat demi kemajuan pendidikan.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span>Garis Koordinasi & Pertimbangan</span>
              </div>
            </div>
          </div>

          {/* Level 2: Kepala Tata Usaha (KTU) */}
          <div className="max-w-md mx-auto">
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Unsur Administrasi & Ketatausahaan</span>
              </div>
              
              <div className="relative w-16 h-16 mx-auto rounded-full ring-2 ring-teal-200 overflow-hidden shadow-xs flex items-center justify-center bg-teal-50">
                {LEADERSHIP_TEAM[2].photo ? (
                  <Image
                    src={LEADERSHIP_TEAM[2].photo}
                    alt="Wahyudi, S.E."
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-teal-800 font-black text-lg tracking-wider">
                    {getInitials(LEADERSHIP_TEAM[2].name)}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Wahyudi, S.E.</h3>
                <div className="text-xs text-teal-800 font-semibold">Kepala Tata Usaha (KTU)</div>
                <div className="text-[11px] font-mono text-slate-400">NIP. 19850612 201001 1 015</div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                Membawahi layanan administrasi kepegawaian, operator Dapodik, aset, dan kearsipan persuratan dinas.
              </p>
            </div>
          </div>

          {/* Divider with Connector */}
          <div className="flex items-center justify-center gap-3 max-w-xl mx-auto py-2">
            <div className="h-px bg-slate-300 flex-1" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-white rounded-full border border-slate-200">
              Unsur Pembantu Pimpinan (Wakil Kepala Sekolah)
            </span>
            <div className="h-px bg-slate-300 flex-1" />
          </div>

          {/* Level 3: 4 Wakil Kepala Sekolah */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WAKA_TEAM.map((waka, idx) => {
              const Icon = waka.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-lg transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="relative w-12 h-12 rounded-full ring-2 ring-sky-200 overflow-hidden shadow-xs flex items-center justify-center bg-sky-50">
                        {waka.photo ? (
                          <Image
                            src={waka.photo}
                            alt={waka.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sky-800 font-extrabold text-xs tracking-wider">
                            {getInitials(waka.name)}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                        WAKA 0{idx + 1}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                        {waka.title}
                      </h4>
                      <div className="text-sm font-bold text-sky-700 mt-1">
                        {waka.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        NIP. {waka.nip}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                      {waka.desc}
                    </p>
                  </div>

                  {/* Tupoksi List */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Fokus Tupoksi:
                    </div>
                    {waka.tupoksi.map((tp, tpIdx) => (
                      <div key={tpIdx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                        <CheckCircle2 className="w-3 h-3 text-sky-500 shrink-0 mt-0.5" />
                        <span>{tp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Level 4: Unit Penunjang Teknis */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-extrabold text-slate-900">
                Unit Pelaksana Teknis & Koordinator Layanan
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Penunjang operasional pembelajaran, bimbingan karir, serta pusat sumber belajar sekolah.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {UNIT_COORDINATORS.map((unit, uIdx) => (
                <div key={uIdx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                    {unit.title}
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">{unit.name}</div>
                  <div className="text-[11px] font-mono text-slate-400">NIP. {unit.nip}</div>
                  <p className="text-xs text-slate-600 pt-1 leading-relaxed">{unit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prinsip Tata Kelola Sekolah */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-xl space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">
              Standar Tata Kelola (Good Governance)
            </span>
            <h3 className="text-2xl font-extrabold text-white">Prinsip Kepemimpinan & Pengelolaan</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Manajemen SMA Negeri 2 Buay Bahuga dijalankan dengan berpegang teguh pada prinsip-prinsip keterbukaan, profesionalitas pendidik, dan efisiensi anggaran.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {[
              { label: "Transparansi", desc: "Keterbukaan informasi program kerja dan anggaran sekolah." },
              { label: "Akuntabilitas", desc: "Pertanggungjawaban terukur atas seluruh kegiatan dan capaian mutu." },
              { label: "Partisipatif", desc: "Melibatkan komite, dewan guru, dan orang tua dalam pengambilan keputusan." },
              { label: "Integritas", desc: "Pelayanan pendidikan yang bersih, objektif, dan bebas pungutan liar." },
            ].map((p, pIdx) => (
              <div key={pIdx} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-sm font-bold text-sky-300">{p.label}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Link to Guru Directory */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-extrabold text-slate-900">Ingin Mengenal Seluruh Tenaga Pendidik?</h3>
            <p className="text-sm text-slate-500">Lihat direktori lengkap seluruh dewan guru mata pelajaran dan staf tata usaha.</p>
          </div>
          <Link
            href="/profil/guru"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shrink-0 transition"
          >
            <span>Buka Direktori Guru & Staf</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
