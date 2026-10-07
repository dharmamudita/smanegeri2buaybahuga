import { Metadata } from "next";
import Link from "next/link";
import { 
  Trophy, 
  ChevronRight, 
  Award, 
  Medal, 
  Star, 
  Calendar,
  Sparkles,
  ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "Prestasi Siswa | SMA Negeri 2 Buay Bahuga",
  description:
    "Rekam jejak prestasi membanggakan siswa-siswi SMA Negeri 2 Buay Bahuga di bidang sains, olahraga, seni budaya, dan keagamaan.",
};

const ACHIEVEMENTS = [
  {
    year: "2026",
    category: "Sains & Teknologi",
    title: "Juara 1 Olimpiade Sains Nasional (OSN) Tingkat Kabupaten - Bidang Informatika",
    recipient: "Dimas Aditya Pratama (Kelas XI)",
    level: "Kabupaten Way Kanan",
    badge: "Emas",
  },
  {
    year: "2026",
    category: "Sains & Teknologi",
    title: "Juara 2 OSN Tingkat Kabupaten - Bidang Matematika",
    recipient: "Aulia Nurul Fikri (Kelas X)",
    level: "Kabupaten Way Kanan",
    badge: "Perak",
  },
  {
    year: "2025",
    category: "Seni & Bahasa",
    title: "Juara 1 Festival Lomba Seni Siswa Nasional (FLS2N) - Tari Kreasi Tradisional Lampung",
    recipient: "Tim Sanggar Tari SMAN 2 Buay Bahuga",
    level: "Provinsi Lampung",
    badge: "Emas",
  },
  {
    year: "2025",
    category: "Olahraga",
    title: "Juara 1 O2SN Cabang Bola Voli Putra Antar-SMA",
    recipient: "Tim Voli Putra SMAN 2 Buay Bahuga",
    level: "Kabupaten Way Kanan",
    badge: "Emas",
  },
  {
    year: "2025",
    category: "Kerohanian & Bahasa",
    title: "Juara 2 Musabaqah Tilawatil Qur'an (MTQ) Pelajar Cabang Tartil",
    recipient: "Muhammad Rizky (Kelas XII)",
    level: "Kabupaten Way Kanan",
    badge: "Perak",
  },
  {
    year: "2024",
    category: "Kepemimpinan",
    title: "Paskibraka Kabupaten Way Kanan",
    recipient: "Bagus Setiawan & Nadia Safitri",
    level: "Pemerintah Kabupaten Way Kanan",
    badge: "Penghargaan",
  },
];

export default function AkademikPrestasiPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/akademik" className="hover:text-sky-600 transition">Akademik</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-bold">Prestasi Siswa</span>
        </nav>

        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-sky-600" />
            <span>Rekam Jejak Keberhasilan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Prestasi Siswa & Penghargaan
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Apresiasi atas kerja keras, dedikasi, dan bimbingan guru yang membuahkan torehan prestasi gemilang di berbagai ajang kompetisi.
          </p>
        </div>

        {/* Summary Counter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center space-y-1">
            <div className="text-3xl font-black text-amber-500">15+</div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">Medali Emas</div>
            <div className="text-[11px] text-slate-400">Tingkat Kab & Prov</div>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center space-y-1">
            <div className="text-3xl font-black text-slate-500">22+</div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">Medali Perak & Perunggu</div>
            <div className="text-[11px] text-slate-400">Ajang OSN & FLS2N</div>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center space-y-1">
            <div className="text-3xl font-black text-sky-600">100%</div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">Lulusan Kompeten</div>
            <div className="text-[11px] text-slate-400">Tersertifikasi Kelulusan</div>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center space-y-1">
            <div className="text-3xl font-black text-emerald-600">30+</div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">Lolos SNBP & SNBT</div>
            <div className="text-[11px] text-slate-400">Perguruan Tinggi Negeri</div>
          </div>
        </div>

        {/* Achievements List */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl font-extrabold text-slate-900">Daftar Kejuaraan Terbaru</h2>
            <p className="text-xs sm:text-sm text-slate-500">Catatan torehan medali dan penghargaan peserta didik.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ACHIEVEMENTS.map((ach, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                      {ach.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">{ach.year}</span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                    {ach.title}
                  </h3>

                  <div className="text-sm font-medium text-slate-600">
                    Peraih: <span className="font-bold text-slate-800">{ach.recipient}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Tingkat: <strong className="text-slate-700">{ach.level}</strong></span>
                  <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    {ach.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
