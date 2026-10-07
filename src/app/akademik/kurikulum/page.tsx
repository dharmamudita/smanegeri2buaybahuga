import { Metadata } from "next";
import Link from "next/link";
import { 
  BookOpen, 
  Layers, 
  Lightbulb, 
  CheckCircle2, 
  ChevronRight,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Target
} from "lucide-react";

export const metadata: Metadata = {
  title: "Kurikulum Merdeka & P5 | SMA Negeri 2 Buay Bahuga",
  description:
    "Implementasi Kurikulum Merdeka Belajar, pengelompokan Fase E & Fase F, serta Projek Penguatan Profil Pelajar Pancasila di SMAN 2 Buay Bahuga.",
};

const KURIKULUM_PILLARS = [
  {
    title: "Fase E (Kelas X) - Pondasi Eksplorasi",
    desc: "Siswa mendalami mata pelajaran umum untuk memetakan bakat, minat, dan potensi akademik sebelum menentukan mata pelajaran pilihan pada fase lanjutan.",
    points: ["Mata pelajaran dasar terpadu", "Asesmen diagnostik minat dan bakat", "Pengenalan karir dan studi lanjut"],
  },
  {
    title: "Fase F (Kelas XI & XII) - Pendalaman Peminatan",
    desc: "Siswa memilih kombinasi mata pelajaran pilihan sesuai minat karir dan rencana program studi di perguruan tinggi (rumpun MIPA, IPS, dan Bahasa).",
    points: ["Fleksibilitas pemilihan mapel pilihan", "Bimbingan intensif persiapan SNBP & SNBT", "Penguatan riset ilmiah sederhana"],
  },
  {
    title: "Kokurikuler: P5 (Profil Pelajar Pancasila)",
    desc: "Pembelajaran berbasis projek lintas disiplin ilmu untuk menumbuhkan karakter beriman, berkebhinekaan global, gotong royong, mandiri, bernalar kritis, dan kreatif.",
    points: ["Tema Kearifan Lokal Buay Bahuga", "Kewirausahaan dan Gaya Hidup Berkelanjutan", "Gelar Karya & Pameran Inovasi Siswa"],
  },
];

export default function AkademikKurikulumPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/akademik" className="hover:text-sky-600 transition">Akademik</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-bold">Kurikulum Merdeka</span>
        </nav>

        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            <span>Sistem & Standar Pembelajaran</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Implementasi Kurikulum Merdeka
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Mewujudkan pembelajaran berdiferensiasi yang menempatkan peserta didik sebagai pusat proses pembelajaran (student-centered learning).
          </p>
        </div>

        {/* Intro Card */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-12 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider">
            <span>Kebijakan Akademik</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Fokus Pada Materi Esensial & Pengembangan Karakter
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            SMA Negeri 2 Buay Bahuga mengadopsi Kurikulum Merdeka secara penuh. Pendekatan ini memberikan ruang yang lebih luas bagi guru untuk menyusun materi pembelajaran yang kontekstual, mendalam, dan relevan dengan tantangan abad ke-21 tanpa terbebani target silabus yang kaku.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {KURIKULUM_PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-lg transition space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black text-xl">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                {pillar.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* P5 Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 text-white p-8 sm:p-12 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Dimensi Profil Pelajar Pancasila</span>
          </div>
          <h3 className="text-2xl font-black text-white">6 Karakter Utama Lulusan</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {[
              "Beriman & Bertakwa",
              "Berkebhinekaan Global",
              "Bergotong Royong",
              "Mandiri",
              "Bernalar Kritis",
              "Kreatif",
            ].map((char, cIdx) => (
              <div key={cIdx} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-xs font-bold text-sky-200">
                {char}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
