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
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-[#1F2937] text-blue-400 border border-gray-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                Terakreditasi {SCHOOL_INFO.akreditasi}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-[#1F2937] text-gray-300 border border-gray-700">
                NPSN: {SCHOOL_INFO.npsn}
              </span>
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
