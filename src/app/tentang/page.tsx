import { Metadata } from "next";
import Link from "next/link";
import { 
  School, 
  Target, 
  Compass, 
  HeartHandshake, 
  Award, 
  CheckCircle, 
  ShieldCheck, 
  GraduationCap, 
  Sparkles,
  ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Sekolah | Visi, Misi & Sejarah",
  description:
    "Profil lengkap, sejarah pendirian, visi dan misi SMA Negeri 2 Buay Bahuga, Kabupaten Way Kanan, Provinsi Lampung.",
};

export default function TentangPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <School className="w-3.5 h-3.5 text-sky-600" />
            <span>Profil Lembaga Pendidikan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Tentang SMA Negeri 2 Buay Bahuga
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Menegakkan dedikasi dalam membimbing putra-putri bangsa menjadi insan berkarakter mulia, cerdas, dan siap bersaing di kancah nasional.
          </p>
        </div>

        {/* Sejarah & Latar Belakang */}
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-sm p-8 sm:p-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider">
            <span>Sejarah & Kilas Balik</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
            Tumbuh Bersama Masyarakat Buay Bahuga
          </h2>
          <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            <p>
              SMA Negeri 2 Buay Bahuga didirikan atas komitmen pemerintah daerah bersama tokoh masyarakat Kecamatan Buay Bahuga, Kabupaten Way Kanan, untuk menghadirkan layanan pendidikan tingkat menengah atas yang bermutu tinggi dan terjangkau bagi masyarakat sekitar.
            </p>
            <p>
              Seiring berjalannya waktu, sekolah ini terus mengalami transformasi sarana dan prasarana: mulai dari penambahan ruang kelas ber-AC, laboratorium komputer terstandarisasi Asesmen Nasional Berbasis Komputer (ANBK), perpustakaan digital, serta lapangan olahraga yang representatif.
            </p>
            <p>
              Dengan predikat <strong>Akreditasi A (Unggul)</strong> dari Badan Akreditasi Nasional Sekolah/Madrasah (BAN-S/M), SMA Negeri 2 Buay Bahuga kini menjadi salah satu rujukan utama siswa lulusan SMP/MTs di Kabupaten Way Kanan untuk melanjutkan pendidikan menuju perguruan tinggi impian.
            </p>
          </div>
        </div>

        {/* Visi & Misi Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Visi */}
          <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-sky-600 to-sky-800 text-white p-8 sm:p-10 shadow-lg space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-sky-200">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase tracking-widest font-extrabold text-sky-300">
                Visi Sekolah
              </span>
              <h3 className="text-2xl sm:text-3xl font-black leading-snug">
                &ldquo;Terwujudnya insan yang beriman, berakhlak mulia, unggul dalam prestasi, berwawasan lingkungan, dan berdaya saing global.&rdquo;
              </h3>
            </div>

            <div className="pt-6 border-t border-white/20 text-xs text-sky-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-300" />
              <span>Pedoman Pengembangan Kurikulum Operasional Sekolah</span>
            </div>
          </div>

          {/* Misi */}
          <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Misi Sekolah</h3>
            </div>

            <ul className="space-y-4 text-sm text-slate-700">
              {[
                "Meningkatkan keimanan dan ketakwaan terhadap Tuhan Yang Maha Esa melalui pembiasaan ibadah dan pendidikan karakter keagamaan.",
                "Melaksanakan proses pembelajaran aktif, inovatif, berbasis teknologi informasi, dan berorientasi pada pengembangan nalar kritis siswa.",
                "Mengembangkan potensi akademik dan non-akademik siswa secara optimal melalui bimbingan olimpiade, seni, dan keolahragaan.",
                "Mewujudkan budaya sekolah yang sehat, asri, bersih, serta menanamkan kepedulian terhadap kelestarian lingkungan hidup.",
                "Menjalin kemitraan sinergis yang harmonis dengan orang tua, komite sekolah, dunia industri, dan institusi perguruan tinggi.",
              ].map((misi, idx) => (
                <li key={idx} className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="leading-relaxed">{misi}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Nilai Karakter Budaya Sekolah */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Profil Pelajar Pancasila & Nilai Inti
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Fondasi pembentukan karakter peserta didik di lingkungan belajar SMAN 2 Buay Bahuga.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: "Beriman & Bertakwa", desc: "Taat beribadah dan toleran" },
              { title: "Berkebinekaan", desc: "Menghargai keragaman budaya" },
              { title: "Gotong Royong", desc: "Kolaborasi dan saling peduli" },
              { title: "Mandiri", desc: "Bertanggung jawab atas belajar" },
              { title: "Bernalar Kritis", desc: "Analitis dan objektif" },
              { title: "Kreatif", desc: "Inovatif melahirkan gagasan" },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200/80 text-center space-y-1 hover:border-sky-300 transition">
                <div className="text-sky-600 font-black text-lg">0{idx + 1}</div>
                <div className="font-bold text-sm text-slate-900">{item.title}</div>
                <div className="text-[11px] text-slate-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to PPDB */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 text-center space-y-4">
          <h3 className="text-2xl font-extrabold">Mari Bertumbuh dan Berprestasi Bersama Kami</h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Segera daftarkan diri Anda pada gelombang PPDB online yang sedang dibuka.
          </p>
          <div className="pt-2">
            <Link
              href="/ppdb"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm transition"
            >
              <span>Daftar PPDB Online Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
