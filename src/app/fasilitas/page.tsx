import { Metadata } from "next";
import { 
  Building2, 
  Laptop, 
  FlaskConical, 
  BookOpen, 
  Trophy, 
  Music, 
  CircleDot, 
  ShieldCheck, 
  Compass, 
  Users, 
  Sparkles 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Fasilitas & Ekstrakurikuler",
  description:
    "Sarana dan prasarana modern serta program ekstrakurikuler unggulan di SMA Negeri 2 Buay Bahuga, Kabupaten Way Kanan.",
};

const FACILITIES = [
  {
    title: "Laboratorium Komputer & CBT",
    desc: "Ruang ber-AC dengan 40+ unit PC modern, UPS cadangan, dan jaringan internet fiber optik untuk pelaksanaan ANBK dan ujian digital.",
    icon: Laptop,
    category: "Akademik",
  },
  {
    title: "Laboratorium IPA Terpadu",
    desc: "Dilengkapi mikroskop digital, alat peraga fisika, zat kimia standar praktikum, dan perlengkapan bedah biologi.",
    icon: FlaskConical,
    category: "Akademik",
  },
  {
    title: "Perpustakaan & Pojok Literasi",
    desc: "Ruang baca yang tenang dengan koleksi ribuan judul buku cetak, ensiklopedia, jurnal ilmiah, dan akses e-book digital.",
    icon: BookOpen,
    category: "Literasi",
  },
  {
    title: "Ruang Kelas Nyaman & Multimedia",
    desc: "Seluruh ruang belajar dilengkapi proyektor LCD, ventilasi udara yang sejuk, papan tulis ganda, serta pencahayaan alami.",
    icon: Building2,
    category: "Pembelajaran",
  },
  {
    title: "Lapangan Olahraga Multifungsi",
    desc: "Area lapangan terpadu untuk kegiatan upacara bendera, pertandingan futsal, bola voli, basket, dan bulu tangkis.",
    icon: CircleDot,
    category: "Olahraga",
  },
  {
    title: "Musholla Baitul Ilmi",
    desc: "Sarana ibadah yang bersih dan nyaman untuk sholat berjamaah, kegiatan Rohis, dan pembinaan karakter religius siswa.",
    icon: Compass,
    category: "Ibadah",
  },
];

const EXTRACURRICULARS = [
  {
    title: "Pramuka (Gudep SMAN 2 Buay Bahuga)",
    desc: "Pendidikan kepanduan, kepemimpinan, kemandirian, dan kebersamaan di alam terbuka.",
    badge: "Wajib Fase E",
  },
  {
    title: "Paskibraka Sekolah",
    desc: "Pelatihan baris-berbaris, kedisiplinan mental, dan persiapan seleksi pengibar bendera kabupaten.",
    badge: "Unggulan",
  },
  {
    title: "Palang Merah Remaja (PMR)",
    desc: "Pembinaan pertolongan pertama, donor darah, aksi kesehatan sekolah, dan kesiapsiagaan bencana.",
    badge: "Kemanusiaan",
  },
  {
    title: "Rohani Islam (Rohis)",
    desc: "Kajian keagamaan rutin, seni hadroh, tahsin Al-Qur'an, dan peringatan hari besar Islam.",
    badge: "Religius",
  },
  {
    title: "Klub Olahraga (Futsal & Voli)",
    desc: "Latihan intensif fisik dan teknik kejuaraan antar sekolah (O2SN tingkat daerah).",
    badge: "Prestasi",
  },
  {
    title: "Sanggar Seni & Tari Tradisional Lampung",
    desc: "Melestarikan tari Sigeh Penguten, musik gamelan Lampung, dan teater modern.",
    badge: "Kearifan Lokal",
  },
];

export default function FasilitasPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Sarana & Pengembangan Potensi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Fasilitas & Ekstrakurikuler
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Menyediakan ekosistem belajar yang lengkap dan wadah positif untuk mengasah bakat, minat, dan kepemimpinan siswa.
          </p>
        </div>

        {/* Section 1: Fasilitas Sarana Prasarana */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Fasilitas Fisik & Ruang Belajar
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Infrastruktur modern yang menunjang aktivitas kurikuler siswa setiap hari.
              </p>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold">
              Standar Sarpras Nasional
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FACILITIES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition space-y-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                      {item.category}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base">{item.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Ekstrakurikuler */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Pilihan Ekstrakurikuler & Organisasi
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Wadah menyalurkan hobi, mengasah kepemimpinan, dan meraih prestasi non-akademik.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXTRACURRICULARS.map((ekskul, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-black text-sm">
                    0{idx + 1}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-100">
                    {ekskul.badge}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">{ekskul.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {ekskul.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
