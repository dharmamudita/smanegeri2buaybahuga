import { Metadata } from "next";
import Link from "next/link";
import { 
  School, 
  Target, 
  Users, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Award,
  Sparkles
} from "lucide-react";

export const metadata: Metadata = {
  title: "Profil Sekolah | SMA Negeri 2 Buay Bahuga",
  description:
    "Profil lengkap, visi misi, jajaran dewan guru, serta sarana dan prasarana SMA Negeri 2 Buay Bahuga, Way Kanan, Lampung.",
};

const PROFIL_SECTIONS = [
  {
    title: "Tentang Sekolah",
    desc: "Kilas balik sejarah berdirinya sekolah, identitas institusi, dan komitmen pelayanan pendidikan menengah unggul di Buay Bahuga.",
    href: "/profil/tentang",
    icon: School,
    badge: "Sejarah & Lembaga",
  },
  {
    title: "Visi & Misi",
    desc: "Arah filosofis, cita-cita luhur, dan 5 misi strategis dalam melahirkan lulusan berkarakter mulia dan berdaya saing global.",
    href: "/profil/visi-misi",
    icon: Target,
    badge: "Landasan Nilai",
  },
  {
    title: "Guru & Tenaga Pendidik",
    desc: "Direktori lengkap dewan guru bersertifikasi pendidik, pimpinan sekolah, dan tenaga kependidikan profesional.",
    href: "/profil/guru",
    icon: Users,
    badge: "SDM Pendidik",
  },
  {
    title: "Fasilitas & Sarana",
    desc: "Infrastruktur ruang belajar modern, laboratorium komputer CBT, laboratorium IPA terpadu, dan sarana olahraga representatif.",
    href: "/profil/fasilitas",
    icon: Building2,
    badge: "Sarana Prasarana",
  },
];

export default function ProfilHubPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <School className="w-3.5 h-3.5 text-sky-600" />
            <span>Profil Institusi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Profil SMA Negeri 2 Buay Bahuga
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Menegakkan dedikasi dalam membina generasi muda bangsa menjadi insan beriman, berilmu pengetahuan tinggi, dan berkarakter Pancasila.
          </p>
        </div>

        {/* Identity Overview Box */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white p-8 sm:p-12 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">Identitas Sekolah</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">SMA NEGERI 2 BUAY BAHUGA</h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Kabupaten Way Kanan, Provinsi Lampung • Terakreditasi A (Unggul) BAN-S/M
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center">
                <div className="text-xs text-sky-300 font-medium">NPSN</div>
                <div className="text-base font-extrabold text-white font-mono">69947098</div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-center">
                <div className="text-xs text-emerald-300 font-medium">Status</div>
                <div className="text-base font-extrabold text-emerald-200">Negeri Aktif</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-center sm:text-left">
            <div>
              <div className="text-xs text-slate-400">Bentuk Pendidikan</div>
              <div className="text-sm sm:text-base font-bold text-white">Sekolah Menengah Atas (SMA)</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Kurikulum</div>
              <div className="text-sm sm:text-base font-bold text-white">Kurikulum Merdeka</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Penyelenggaraan</div>
              <div className="text-sm sm:text-base font-bold text-white">Sehari Penuh (5 Hari)</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Kementerian Pembina</div>
              <div className="text-sm sm:text-base font-bold text-white">Kemendikdasmen RI</div>
            </div>
          </div>
        </div>

        {/* Navigation Grid per Halaman Profil */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-extrabold text-slate-900">Jelajahi Rubrik Profil</h2>
            <p className="text-sm text-slate-500">Pilih halaman informasi profil sekolah di bawah ini:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROFIL_SECTIONS.map((sec, idx) => {
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
                    <span>Buka Halaman Lengkap</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
