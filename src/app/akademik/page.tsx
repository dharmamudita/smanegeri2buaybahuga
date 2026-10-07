import { Metadata } from "next";
import Link from "next/link";
import { 
  BookOpen, 
  Compass, 
  Trophy, 
  ArrowRight, 
  Sparkles,
  Layers,
  GraduationCap
} from "lucide-react";

export const metadata: Metadata = {
  title: "Akademik & Kesiswaan | SMA Negeri 2 Buay Bahuga",
  description:
    "Informasi kurikulum merdeka, program ekstrakurikuler, dan rekam jejak prestasi siswa SMA Negeri 2 Buay Bahuga, Way Kanan.",
};

const AKADEMIK_SECTIONS = [
  {
    title: "Kurikulum Merdeka",
    desc: "Struktur pembelajaran intrakurikuler dan kokurikuler, fase E (Kelas X) & fase F (Kelas XI - XII), serta Projek Profil Pelajar Pancasila (P5).",
    href: "/akademik/kurikulum",
    icon: BookOpen,
    badge: "Sistem Pembelajaran",
  },
  {
    title: "Ekstrakurikuler & Organisasi",
    desc: "Wadah pengembangan bakat, kepemimpinan, dan minat siswa: OSIS, MPK, Pramuka, Paskibra, PMR, Rohis, seni tari daerah, dan cabang olahraga.",
    href: "/akademik/ekstrakurikuler",
    icon: Compass,
    badge: "Pengembangan Diri",
  },
  {
    title: "Prestasi Siswa",
    desc: "Dokumentasi kejuaraan, olimpiade sains (OSN), festival seni (FLS2N), dan kompetisi olahraga (O2SN) yang diraih oleh siswa.",
    href: "/akademik/prestasi",
    icon: Trophy,
    badge: "Rekam Jejak Juara",
  },
];

export default function AkademikHubPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            <span>Pendidikan & Kesiswaan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Akademik & Pembinaan Karakter
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Membangun keseimbangan antara kecerdasan intelektual, kemandirian berpikir, dan keterampilan sosial melalui pembelajaran yang bermakna.
          </p>
        </div>

        {/* Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {AKADEMIK_SECTIONS.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <Link
                key={idx}
                href={sec.href}
                className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 group-hover:bg-sky-100 text-slate-600 group-hover:text-sky-800 text-xs font-bold transition">
                      {sec.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {sec.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {sec.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-sm font-bold text-sky-600 group-hover:text-sky-700">
                  <span>Lihat Selengkapnya</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
