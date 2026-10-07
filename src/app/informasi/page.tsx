import { Metadata } from "next";
import Link from "next/link";
import { 
  FileText, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Calendar, 
  Sparkles,
  Mail,
  Clock
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pusat Informasi & Layanan | SMA Negeri 2 Buay Bahuga",
  description:
    "Pusat warta pengumuman resmi sekolah, agenda kegiatan, serta informasi kontak dan helpdesk SMA Negeri 2 Buay Bahuga.",
};

const INFORMASI_SECTIONS = [
  {
    title: "Pengumuman & Berita",
    desc: "Publikasi warta resmi sekolah, agenda kegiatan akademik, pengumuman kelulusan, surat edaran dinas, dan info PPDB terkini.",
    href: "/informasi/pengumuman",
    icon: FileText,
    badge: "Warta Resmi",
  },
  {
    title: "Kontak & Lokasi Kampus",
    desc: "Alamat lengkap kampus sekolah, nomor telepon helpdesk, WhatsApp panitia PPDB, surel dinas, peta navigasi GPS, dan jam operasional.",
    href: "/informasi/kontak",
    icon: Phone,
    badge: "Layanan Komunikasi",
  },
];

export default function InformasiHubPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span>Pusat Publikasi & Komunikasi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Pusat Informasi & Layanan
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Menyajikan keterbukaan informasi publik dan saluran komunikasi resmi yang cepat, akurat, dan terpercaya bagi masyarakat.
          </p>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INFORMASI_SECTIONS.map((sec, idx) => {
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
                  <span>Akses Halaman</span>
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
