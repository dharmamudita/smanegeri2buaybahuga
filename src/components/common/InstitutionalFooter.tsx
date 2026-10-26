import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  Clock,
  User,
  Users,
  Shield,
  ArrowRight,
  Lock,
} from "lucide-react";
import { SCHOOL_INFO } from "@/lib/constants";

export default function InstitutionalFooter() {
  return (
    <footer className="bg-[#111827] text-gray-300 border-t-4 border-[#2E4BA3] mt-auto">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Kolom 1: Profil & Identitas Institusi */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2E4BA3] flex items-center justify-center text-white">
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

          {/* Kolom 2: Portal Masuk & Login Pengguna (Admin, Guru, Siswa) */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 border-l-2 border-[#2E4BA3] pl-2.5">
              Portal Masuk Pengguna
            </h4>
            <div className="space-y-2.5 text-xs">
              {/* Tombol Login Siswa */}
              <Link
                href="/login?role=SISWA"
                className="group flex items-center justify-between p-3 rounded-lg bg-[#1F2937] hover:bg-[#253248] border border-gray-700 hover:border-blue-500 transition-all shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-blue-900/60 text-blue-300 flex items-center justify-center group-hover:bg-[#2E4BA3] group-hover:text-white transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-blue-300 transition-colors">
                      Login Siswa (NISN)
                    </div>
                    <div className="text-[11px] text-gray-400">
                      LMS & Presensi Geofencing
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
              </Link>

              {/* Tombol Login Guru */}
              <Link
                href="/login?role=GURU"
                className="group flex items-center justify-between p-3 rounded-lg bg-[#1F2937] hover:bg-[#253248] border border-gray-700 hover:border-amber-500 transition-all shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-amber-900/40 text-amber-300 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-amber-300 transition-colors">
                      Login Dewan Guru (NUPTK)
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Materi, Ujian & Rekap Nilai
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 transition-colors" />
              </Link>

              {/* Tombol Login Admin */}
              <Link
                href="/login?role=ADMIN"
                className="group flex items-center justify-between p-3 rounded-lg bg-[#1F2937] hover:bg-[#253248] border border-gray-700 hover:border-red-500 transition-all shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-red-900/40 text-red-300 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-red-300 transition-colors">
                      Login Administrator
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Master Data & PPDB Seleksi
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Kolom 3: Tautan Layanan (Dipindahkan dari posisi lama, menggantikan Portal Kedinasan) */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 border-l-2 border-[#2E4BA3] pl-2.5">
              Tautan Layanan
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/ppdb"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                  Penerimaan Peserta Didik Baru (PPDB)
                </Link>
              </li>
              <li>
                <Link
                  href="/akademik"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                  Kurikulum & Kalender Akademik
                </Link>
              </li>
              <li>
                <Link
                  href="/kesiswaan"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                  Organisasi Kesiswaan & Ekstrakurikuler
                </Link>
              </li>
              <li>
                <Link
                  href="/informasi"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                  Warta Berita & Pengumuman Sekolah
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Kontak & Lokasi Sekretariat */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 border-l-2 border-[#2E4BA3] pl-2.5">
              Sekretariat & Lokasi
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{SCHOOL_INFO.alamat}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{SCHOOL_INFO.telepon}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{SCHOOL_INFO.email}</span>
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
