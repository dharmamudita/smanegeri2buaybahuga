import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  Clock,
  Globe,
} from "lucide-react";
import { SCHOOL_INFO } from "@/lib/constants";

export default function InstitutionalFooter() {
  return (
    <footer className="bg-[#111827] text-gray-300 border-t-4 border-[#2A2C5E] mt-auto">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Kolom 1: Profil & Identitas Institusi */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2A2C5E] flex items-center justify-center text-white shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight">
                  {SCHOOL_INFO.nama}
                </h3>
                <p className="text-xs text-gray-400">Kabupaten Way Kanan</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Mewujudkan generasi unggul, berkarakter luhur, berwawasan global,
              dan menguasai teknologi berbasis integritas moral di Provinsi
              Lampung.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-[#1F2937] text-blue-400 border border-gray-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                Terakreditasi {SCHOOL_INFO.akreditasi}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-[#1F2937] text-gray-300 border border-gray-700">
                NPSN: {SCHOOL_INFO.npsn}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-[#1F2937] text-gray-400 border border-gray-700">
                NSS: {SCHOOL_INFO.nss}
              </span>
            </div>

            {/* Media Sosial Resmi Sekolah */}
            <div className="pt-2 space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Media Sosial Resmi
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#1F2937] border border-gray-700 hover:border-pink-500 hover:bg-pink-950/40 text-gray-400 hover:text-pink-400 flex items-center justify-center transition-all duration-200"
                  aria-label="Instagram SMAN 2 Buay Bahuga"
                  title="Instagram @sman2buaybahuga"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#1F2937] border border-gray-700 hover:border-red-500 hover:bg-red-950/40 text-gray-400 hover:text-red-400 flex items-center justify-center transition-all duration-200"
                  aria-label="YouTube SMAN 2 Buay Bahuga"
                  title="YouTube SMAN 2 Buay Bahuga"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#1F2937] border border-gray-700 hover:border-blue-500 hover:bg-blue-950/40 text-gray-400 hover:text-blue-400 flex items-center justify-center transition-all duration-200"
                  aria-label="Facebook SMAN 2 Buay Bahuga"
                  title="Facebook SMAN 2 Buay Bahuga"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="currentColor"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Kolom 2: Portal Masuk Pengguna (Animasi Meluncur ke Kanan Saat Kursor Diarahkan) */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 border-l-2 border-[#2A2C5E] pl-2.5">
              Portal Masuk Pengguna
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/login?role=SISWA"
                  className="group flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-all duration-200 ease-out group-hover:translate-x-1.5 shrink-0" />
                  <span className="transition-transform duration-200 ease-out group-hover:translate-x-1 font-medium">
                    Login Siswa (NISN)
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login?role=GURU"
                  className="group flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-all duration-200 ease-out group-hover:translate-x-1.5 shrink-0" />
                  <span className="transition-transform duration-200 ease-out group-hover:translate-x-1 font-medium">
                    Login Dewan Guru (NUPTK)
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login?role=ADMIN"
                  className="group flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-all duration-200 ease-out group-hover:translate-x-1.5 shrink-0" />
                  <span className="transition-transform duration-200 ease-out group-hover:translate-x-1 font-medium">
                    Login Administrator Sistem
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Tautan Layanan (Animasi Meluncur ke Kanan Saat Kursor Diarahkan) */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 border-l-2 border-[#2A2C5E] pl-2.5">
              Tautan Layanan
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/profil"
                  className="group flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-all duration-200 ease-out group-hover:translate-x-1.5 shrink-0" />
                  <span className="transition-transform duration-200 ease-out group-hover:translate-x-1 font-medium">
                    Profil & Fasilitas Sekolah
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/ppdb"
                  className="group flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-all duration-200 ease-out group-hover:translate-x-1.5 shrink-0" />
                  <span className="transition-transform duration-200 ease-out group-hover:translate-x-1 font-medium">
                    Penerimaan Peserta Didik Baru (PPDB)
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/akademik"
                  className="group flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-all duration-200 ease-out group-hover:translate-x-1.5 shrink-0" />
                  <span className="transition-transform duration-200 ease-out group-hover:translate-x-1 font-medium">
                    Kurikulum & Kalender Akademik
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/kesiswaan"
                  className="group flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-all duration-200 ease-out group-hover:translate-x-1.5 shrink-0" />
                  <span className="transition-transform duration-200 ease-out group-hover:translate-x-1 font-medium">
                    Organisasi Kesiswaan & Ekstrakurikuler
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/informasi"
                  className="group flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-all duration-200 ease-out group-hover:translate-x-1.5 shrink-0" />
                  <span className="transition-transform duration-200 ease-out group-hover:translate-x-1 font-medium">
                    Warta Berita & Pengumuman Sekolah
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Kontak & Lokasi Sekretariat */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 border-l-2 border-[#2A2C5E] pl-2.5">
              Sekretariat & Lokasi
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{SCHOOL_INFO.alamat}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={`tel:${SCHOOL_INFO.telepon}`}
                  className="hover:text-white transition-colors"
                >
                  {SCHOOL_INFO.telepon}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={`mailto:${SCHOOL_INFO.email}`}
                  className="hover:text-white transition-colors"
                >
                  {SCHOOL_INFO.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={`https://${SCHOOL_INFO.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {SCHOOL_INFO.website}
                </a>
              </li>
              <li className="flex items-center gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Pelayanan: Senin - Jumat (07.00 - 15.30 WIB)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer / Copyright */}
      <div className="border-t border-gray-800 bg-[#0B0F19] py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <div>
            &copy; 2026 {SCHOOL_INFO.nama}. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span>Sistem Informasi Smart School v1.0</span>
            <span>&bull;</span>
            <span>Next.js 16 & TypeScript 7</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
