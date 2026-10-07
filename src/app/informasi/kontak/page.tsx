import { Metadata } from "next";
import Link from "next/link";
import { 
  Phone, 
  MapPin, 
  Mail, 
  Clock, 
  ChevronRight, 
  Send,
  MessageSquare,
  Building,
  ShieldCheck
} from "lucide-react";

export const metadata: Metadata = {
  title: "Kontak & Lokasi | SMA Negeri 2 Buay Bahuga",
  description:
    "Alamat lengkap kampus, nomor telepon, WhatsApp panitia PPDB, email resmi, dan peta lokasi SMA Negeri 2 Buay Bahuga, Way Kanan.",
};

export default function InformasiKontakPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/informasi" className="hover:text-sky-600 transition">Informasi</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-bold">Kontak & Lokasi</span>
        </nav>

        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Phone className="w-3.5 h-3.5 text-sky-600" />
            <span>Saluran Komunikasi Resmi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Kontak & Lokasi Kampus
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Panitia sekolah dan pengelola layanan informasi siap melayani pertanyaan seputar PPDB, administrasi kesiswaan, dan tata kelola sekolah.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Campus Address Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 shrink-0 mt-0.5">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-base">Alamat Kampus Sekolah</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Jl. Ryacudu No. 04, Kampung Suka Agung, Kec. Buay Bahuga, Kab. Way Kanan, Lampung 34764
                </p>
                <div className="pt-1 text-[11px] font-mono text-slate-400">NPSN: 10810192 • NSS: 301120814020</div>
              </div>
            </div>

            {/* Phone & WhatsApp */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 shrink-0 mt-0.5">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="font-extrabold text-slate-900 text-base">Telepon & WhatsApp Layanan</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  0852-6337-6378 (Layanan Sekolah & Panitia PPDB)
                </p>
                <div>
                  <a
                    href="https://wa.me/6285263376378"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Hubungi via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 shrink-0 mt-0.5">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-base">Surat Elektronik Resmi</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  sman2buaybahuga@gmail.com
                </p>
                <span className="text-[11px] text-slate-400">Respon maksimal 1x24 jam hari kerja</span>
              </div>
            </div>

            {/* Working Hours */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 shrink-0 mt-0.5">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-base">Jam Operasional Layanan</h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Senin – Jumat: 07.30 – 15.30 WIB
                </p>
                <p className="text-[11px] text-slate-400">
                  Sabtu, Minggu, dan Hari Libur Nasional tutup
                </p>
              </div>
            </div>

          </div>

          {/* Map Column */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xs space-y-4 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Peta Lokasi GPS</h3>
                <p className="text-xs text-slate-500">Kecamatan Buay Bahuga, Kabupaten Way Kanan</p>
              </div>
              <a
                href="https://maps.google.com/?q=Buay+Bahuga+Way+Kanan"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold transition"
              >
                Buka di Google Maps
              </a>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 h-96 relative">
              <iframe
                title="Peta Lokasi SMAN 2 Buay Bahuga"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127170.83594042857!2d104.498877!3d-4.321855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3895e63836d557%3A0x6338b8163f920f26!2sBuay%20Bahuga%2C%20Way%20Kanan%20Regency%2C%20Lampung!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
