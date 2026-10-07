import { Metadata } from "next";
import Link from "next/link";
import { 
  Compass, 
  ChevronRight, 
  ShieldCheck, 
  HeartHandshake, 
  Trophy, 
  Music, 
  CircleDot,
  Users,
  Award,
  Sparkles
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ekstrakurikuler & Organisasi | SMA Negeri 2 Buay Bahuga",
  description:
    "Ragam program ekstrakurikuler kepemimpinan, olahraga, seni budaya, dan keagamaan di SMA Negeri 2 Buay Bahuga, Kabupaten Way Kanan.",
};

const EKSKUL_LIST = [
  {
    category: "Kepemimpinan & Karakter",
    items: [
      {
        name: "Pramuka Gugus Depan SMAN 2 Buay Bahuga",
        desc: "Pendidikan kepanduan wajib bagi Fase E guna melatih kemandirian, kedisiplinan, keterampilan tali-temali, pertolongan darurat, dan kegiatan perkemahan alam.",
        badge: "Wajib Fase E",
      },
      {
        name: "Paskibraka Sekolah",
        desc: "Pelatihan baris-berbaris intensif, pembentukan postur tegap, kedisiplinan mental, dan seleksi pengibar bendera pusaka tingkat kabupaten.",
        badge: "Unggulan",
      },
      {
        name: "Palang Merah Remaja (PMR)",
        desc: "Pembinaan pertolongan pertama pada kecelakaan (PPPK), donor darah sekolah, aksi bakti sosial kemanusiaan, dan kesiapsiagaan bencana.",
        badge: "Kemanusiaan",
      },
    ],
  },
  {
    category: "Olahraga & Seni Budaya",
    items: [
      {
        name: "Klub Bola Voli & Futsal",
        desc: "Pembinaan teknik dasar dan strategi pertandingan untuk kejuaraan Olimpiade Olahraga Siswa Nasional (O2SN) dan turnamen antar-pelajar se-Lampung.",
        badge: "Prestasi Olahraga",
      },
      {
        name: "Sanggar Seni & Tari Tradisional Lampung",
        desc: "Melestarikan tari Sigeh Penguten, musik instrumen cetik Lampung, serta kreasi teater modern untuk Festival dan Lomba Seni Siswa Nasional (FLS2N).",
        badge: "Kearifan Lokal",
      },
      {
        name: "Rohani Islam (Rohis) & Hadroh",
        desc: "Kajian keislaman rutin, pembinaan tilawah Al-Qur'an, seni hadroh kontemporer, dan kepanitiaan peringatan hari-hari besar Islam.",
        badge: "Kerohanian",
      },
    ],
  },
];

export default function AkademikEkstrakurikulerPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/akademik" className="hover:text-sky-600 transition">Akademik</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-bold">Ekstrakurikuler</span>
        </nav>

        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span>Pengembangan Potensi Non-Akademik</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Ekstrakurikuler & Organisasi Siswa
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Menyediakan wadah positif untuk menyalurkan minat, mengasah bakat kepemimpinan, dan membangun jejaring pertemanan yang sehat.
          </p>
        </div>

        {/* Ekskul Sections */}
        {EKSKUL_LIST.map((group, gIdx) => (
          <div key={gIdx} className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-slate-900">{group.category}</h2>
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                Pilihan Minat
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {group.items.map((item, iIdx) => (
                <div
                  key={iIdx}
                  className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-lg transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                      {item.name}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Organisasi OSIS/MPK */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-12 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-extrabold text-slate-900">Organisasi Kesiswaan Resmi (OSIS & MPK)</h3>
            <p className="text-xs sm:text-sm text-slate-500">Lembaga perwakilan dan eksekutif siswa tingkat sekolah.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-base">OSIS (Organisasi Siswa Intra Sekolah)</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Wadah aspirasi siswa dalam merancang program kerja kesiswaan, peringatan hari besar nasional, bakti lingkungan, serta kejuaraan antarkelas (Class Meeting).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-base">MPK (Majelis Perwakilan Kelas)</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Badan perwakilan dari masing-masing perwakilan kelas untuk mengawasi dan mengevaluasi kinerja pengurus OSIS secara demokratis dan objektif.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
