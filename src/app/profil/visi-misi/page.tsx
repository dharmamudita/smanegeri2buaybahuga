import { Metadata } from "next";
import Link from "next/link";
import { 
  Target, 
  Compass, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  HeartHandshake,
  Lightbulb,
  Award
} from "lucide-react";

export const metadata: Metadata = {
  title: "Visi & Misi | Profil SMA Negeri 2 Buay Bahuga",
  description:
    "Visi, misi, dan tujuan pendidikan SMA Negeri 2 Buay Bahuga dalam membentuk generasi unggul, berakhlak mulia, dan berwawasan lingkungan.",
};

const MISI_ITEMS = [
  {
    number: "01",
    title: "Ketakwaan dan Pembinaan Karakter",
    desc: "Menumbuhkembangkan penghayatan dan pengamalan nilai-nilai keimanan, ketakwaan, serta budi pekerti luhur dalam kehidupan sehari-hari.",
  },
  {
    number: "02",
    title: "Pembelajaran Bermutu dan Aktif",
    desc: "Melaksanakan proses pembelajaran dan bimbingan secara efektif, adaptif, kreatif, dan menyenangkan melalui implementasi Kurikulum Merdeka.",
  },
  {
    number: "03",
    title: "Penguasaan Ilmu Pengetahuan dan Teknologi",
    desc: "Mendorong penguasaan sains, teknologi informasi, dan keterampilan literasi digital agar peserta didik siap menghadapi tantangan era globalisasi.",
  },
  {
    number: "04",
    title: "Pengembangan Potensi Minat dan Bakat",
    desc: "Menyediakan wadah pembinaan minat, bakat, kepemimpinan, dan olahraga secara terprogram guna mencetak prestasi di kancah regional maupun nasional.",
  },
  {
    number: "05",
    title: "Wawasan Lingkungan dan Kearifan Lokal",
    desc: "Mewujudkan lingkungan sekolah yang bersih, sehat, asri, dan berbudaya lingkungan dengan menjunjung tinggi kearifan lokal masyarakat Lampung.",
  },
];

const TUJUAN_SEKOLAH = [
  "Tercapainya persentase kelulusan 100% dengan nilai rata-rata akademik yang terus meningkat setiap tahun ajaran.",
  "Meningkatnya jumlah lulusan yang diterima di Perguruan Tinggi Negeri (PTN) terkemuka dan institusi kedinasan.",
  "Terbentuknya budaya sekolah yang religius, disiplin, toleran, dan menjunjung tinggi norma kesopanan.",
  "Terpenuhinya sarana penunjang pembelajaran digital dan konektivitas teknologi informasi di seluruh lingkungan kampus.",
];

export default function ProfilVisiMisiPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/profil" className="hover:text-sky-600 transition">Profil</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-bold">Visi & Misi</span>
        </nav>

        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-sky-600" />
            <span>Landasan Filosofis & Arah Sasaran</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Visi, Misi & Sasaran Mutu
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Pedoman dasar pelaksanaan tata kelola pembelajaran dan pembinaan kesiswaan di SMA Negeri 2 Buay Bahuga.
          </p>
        </div>

        {/* Visi Card */}
        <div className="rounded-3xl bg-gradient-to-br from-sky-600 via-sky-700 to-sky-900 text-white p-8 sm:p-14 shadow-xl space-y-6">
          <div className="space-y-4 max-w-4xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-sky-200">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase tracking-widest font-extrabold text-sky-300">
              Rumusan Visi Sekolah
            </span>
            <blockquote className="text-2xl sm:text-4xl font-black leading-snug tracking-tight">
              &ldquo;Terwujudnya insan yang beriman, berakhlak mulia, unggul dalam prestasi, berwawasan lingkungan, dan berdaya saing global.&rdquo;
            </blockquote>
          </div>

          <div className="pt-6 border-t border-white/20 text-xs text-sky-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-300" />
            <span>Ditetapkan dalam Rencana Strategis (Renstra) Pendidikan SMA Negeri 2 Buay Bahuga</span>
          </div>
        </div>

        {/* Misi Section */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Misi Sekolah</h2>
              <p className="text-xs sm:text-sm text-slate-500">Langkah operasional dalam merealisasikan visi institusi.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-100">
              5 Pilar Pelaksanaan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MISI_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-sky-600 font-mono">
                    {item.number}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Compass className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tujuan Pendidikan Sekolah */}
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs p-8 sm:p-12 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Tujuan Mutu Pendidikan</h3>
              <p className="text-xs sm:text-sm text-slate-500">Target jangka menengah pencapaian luaran peserta didik.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {TUJUAN_SEKOLAH.map((tujuan, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 leading-relaxed">{tujuan}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
