import { Metadata } from "next";
import Link from "next/link";
import { 
  School, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  FileText,
  Calendar,
  Building,
  MapPin
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Sekolah | Profil SMA Negeri 2 Buay Bahuga",
  description:
    "Sejarah pendirian, kilas balik, dan legalitas operasional SMA Negeri 2 Buay Bahuga, Kabupaten Way Kanan.",
};

export default function ProfilTentangPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/profil" className="hover:text-sky-600 transition">Profil</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-bold">Tentang Sekolah</span>
        </nav>

        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <School className="w-3.5 h-3.5 text-sky-600" />
            <span>Kilas Balik & Profil Lembaga</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Tentang SMA Negeri 2 Buay Bahuga
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Menegakkan komitmen pemerintah dan masyarakat dalam menghadirkan layanan pendidikan bermutu tinggi, inklusif, dan berwawasan kebangsaan di Kabupaten Way Kanan.
          </p>
        </div>

        {/* Main Sejarah Card */}
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs p-8 sm:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-md">
              Sejarah Singkat Pendirian
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Tumbuh dan Berkembang Bersama Masyarakat
            </h2>
          </div>

          <div className="space-y-5 text-slate-600 text-base leading-relaxed font-normal">
            <p>
              SMA Negeri 2 Buay Bahuga didirikan atas inisiatif dan kolaborasi antara Pemerintah Daerah Kabupaten Way Kanan, Dinas Pendidikan Provinsi Lampung, serta para tokoh masyarakat Kecamatan Buay Bahuga. Pendirian sekolah ini bertujuan memperluas akses pendidikan tingkat menengah atas yang berkualitas dan terjangkau bagi generasi muda di wilayah Buay Bahuga dan sekitarnya.
            </p>
            <p>
              Sejak resmi beroperasi, sekolah terus berbenah secara berkelanjutan. Dimulai dari pemenuhan ruang kelas belajar berstandar nasional, pembangunan laboratorium komputer untuk penyelenggaraan ujian digital mandiri, laboratorium praktikum sains, perpustakaan representatif, hingga penataan lingkungan sekolah yang asri dan berwawasan adiwiyata.
            </p>
            <p>
              Kini, SMA Negeri 2 Buay Bahuga telah meraih predikat <strong>Akreditasi A (Unggul)</strong> dari Badan Akreditasi Nasional Sekolah/Madrasah (BAN-S/M). Predikat ini menjadi bukti nyata dedikasi tenaga pendidik dan tenaga kependidikan dalam menghantarkan peserta didik meraih prestasi akademik maupun non-akademik di tingkat kabupaten, provinsi, hingga nasional.
            </p>
          </div>
        </div>

        {/* Data Legalitas & Identitas Resmi */}
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs p-8 sm:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-extrabold text-slate-900">Data Statis & Legalitas Sekolah</h3>
            <p className="text-xs sm:text-sm text-slate-500">Rujukan identitas kelembagaan berdasarkan data pokok pendidikan resmi (Dapodik).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Nama Resmi Lembaga</span>
              <div className="text-base font-bold text-slate-900">SMA Negeri 2 Buay Bahuga</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Nomor Pokok Sekolah Nasional (NPSN)</span>
              <div className="text-base font-bold text-sky-600 font-mono">69947098</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Status Sekolah</span>
              <div className="text-base font-bold text-emerald-600">Negeri (Pemerintah Provinsi)</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Peringkat Akreditasi</span>
              <div className="text-base font-bold text-slate-900">A (Unggul) - BAN-S/M</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Kurikulum Operasional</span>
              <div className="text-base font-bold text-slate-900">Kurikulum Merdeka</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Wilayah Penyelenggaraan</span>
              <div className="text-base font-bold text-slate-900">Kec. Buay Bahuga, Way Kanan</div>
            </div>
          </div>
        </div>

        {/* Quick Nav to Visi Misi */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Ingin Mengetahui Panduan Nilai Sekolah?</h3>
            <p className="text-sm text-slate-400 mt-1">Pelajari rumusan Visi, Misi, dan Tujuan Pendidikan SMA Negeri 2 Buay Bahuga.</p>
          </div>
          <Link
            href="/profil/visi-misi"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shrink-0 transition"
          >
            <span>Buka Halaman Visi & Misi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
