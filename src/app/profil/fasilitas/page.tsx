import { Metadata } from "next";
import Link from "next/link";
import { 
  Building2, 
  Laptop, 
  FlaskConical, 
  BookOpen, 
  CircleDot, 
  Compass, 
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export const metadata: Metadata = {
  title: "Fasilitas & Sarana Prasarana | SMA Negeri 2 Buay Bahuga",
  description:
    "Sarana dan prasarana modern penunjang kegiatan belajar mengajar di SMA Negeri 2 Buay Bahuga, Kabupaten Way Kanan.",
};

const FACILITIES = [
  {
    title: "Laboratorium Komputer & CBT",
    desc: "Ruang berpendingin udara (AC) dengan 40+ unit PC modern, UPS cadangan, dan jaringan internet fiber optik untuk pelaksanaan ANBK dan ujian digital.",
    icon: Laptop,
    specs: ["40 Unit PC Modern", "Jaringan Fiber Optik", "Sistem UPS Terpusat"],
  },
  {
    title: "Laboratorium IPA Terpadu",
    desc: "Dilengkapi mikroskop digital, alat peraga fisika, zat kimia standar praktikum kurikulum, dan perlengkapan observasi biologi.",
    icon: FlaskConical,
    specs: ["Alat Praktikum Standar SNI", "Ruang Persiapan Khusus", "Wastafel & Safety Shower"],
  },
  {
    title: "Perpustakaan & Pojok Literasi Digital",
    desc: "Ruang baca yang tenang dan nyaman dengan koleksi ribuan judul buku cetak, ensiklopedia, jurnal ilmiah, serta akses e-book digital.",
    icon: BookOpen,
    specs: ["Ribuan Judul Buku", "Area Baca Lesehan & Meja", "Katalog Digital"],
  },
  {
    title: "Ruang Kelas Multimedia Ber-AC",
    desc: "Seluruh ruang kelas dilengkapi pencahayaan memadai, ventilasi silang yang sejuk, proyektor LCD interaktif, dan papan tulis ganda.",
    icon: Building2,
    specs: ["Proyektor LCD Terpasang", "Tata Ruang Ergonomis", "Koneksi Wi-Fi Edukasi"],
  },
  {
    title: "Lapangan Olahraga Multifungsi",
    desc: "Area lapangan terpadu untuk upacara bendera mingguan, pertandingan futsal, bola voli, bola basket, dan senam kesegaran jasmani.",
    icon: CircleDot,
    specs: ["Standar Lapangan Futsal/Voli", "Pencahayaan Lapangan", "Tribun Siswa"],
  },
  {
    title: "Musholla Baitul Ilmi",
    desc: "Sarana ibadah yang bersih dan representatif untuk pelaksanaan sholat berjamaah, kegiatan Rohani Islam (Rohis), dan pembinaan karakter religius.",
    icon: Compass,
    specs: ["Tempat Wudhu Luas", "Karpet Ibadah Nyaman", "Sound System Jernih"],
  },
];

export default function ProfilFasilitasPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/profil" className="hover:text-sky-600 transition">Profil</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-bold">Fasilitas & Sarana</span>
        </nav>

        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Infrastruktur & Sarana Belajar</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Fasilitas & Sarana Prasarana
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Menyediakan ekosistem fisik dan teknologi yang lengkap guna mendukung kenyamanan, keamanan, dan efektivitas proses belajar mengajar.
          </p>
        </div>

        {/* Standards Card */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Standar Sarana Prasarana</span>
            <h3 className="text-xl font-extrabold text-slate-900">Sesuai Permendikbudristek Standar Nasional Pendidikan</h3>
            <p className="text-xs sm:text-sm text-slate-600">Seluruh sarana fisik dirawat secara berkala demi menjamin kenyamanan belajar peserta didik.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold shrink-0 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Terstandarisasi BAN-S/M</span>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACILITIES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-lg transition space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Specs List */}
                <div className="pt-4 border-t border-slate-100 space-y-1.5">
                  {item.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
