import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Lock,
  ExternalLink,
  Heart
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src="/logo_smanda.png"
                  alt="Logo SMAN 2 Buay Bahuga"
                  width={40}
                  height={40}
                  className="object-contain w-full h-full drop-shadow-sm"
                />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                SMAN 2 BUAY BAHUGA
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Mewujudkan generasi beriman, berakhlak mulia, unggul dalam prestasi, berwawasan lingkungan, dan berdaya saing global di Kabupaten Way Kanan.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>NPSN: 69947098 • Akreditasi A Unggul</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-sky-500 pl-2.5">
              Navigasi Cepat
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-sky-400 transition-colors">
                  Beranda Utama
                </Link>
              </li>
              <li>
                <Link href="/profil/tentang" className="hover:text-sky-400 transition-colors">
                  Profil & Visi Misi
                </Link>
              </li>
              <li>
                <Link href="/profil/struktur" className="hover:text-sky-400 transition-colors">
                  Struktur Organisasi
                </Link>
              </li>
              <li>
                <Link href="/profil/guru" className="hover:text-sky-400 transition-colors">
                  Direktori Guru & Staf
                </Link>
              </li>
              <li>
                <Link href="/profil/fasilitas" className="hover:text-sky-400 transition-colors">
                  Fasilitas & Sarana
                </Link>
              </li>
              <li>
                <Link href="/informasi/pengumuman" className="hover:text-sky-400 transition-colors">
                  Pengumuman & Agenda
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: PPDB Quick Access */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-sky-500 pl-2.5">
              Layanan PPDB Online
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/ppdb" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span>Pendaftaran Siswa Baru</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/ppdb/cek-status" className="hover:text-sky-400 transition-colors">
                  Cek Status Verifikasi Berkas
                </Link>
              </li>
              <li>
                <Link href="/ppdb/jadwal" className="hover:text-sky-400 transition-colors">
                  Jadwal & Kuota Gelombang
                </Link>
              </li>
              <li>
                <Link href="/ppdb/syarat" className="hover:text-sky-400 transition-colors">
                  Syarat Dokumen Pendaftaran
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-sky-500 pl-2.5">
              Hubungi Kami
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <span>Kecamatan Buay Bahuga, Kabupaten Way Kanan, Provinsi Lampung 34764</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Helpdesk PPDB: 0821-7890-1234</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>info@sman2buaybahuga.sch.id</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Senin - Jumat: 07.30 - 15.30 WIB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} SMA Negeri 2 Buay Bahuga. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-sky-400 transition-colors py-1 px-2 rounded-md hover:bg-slate-800/80"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Portal Admin / Panitia</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
