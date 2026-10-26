import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Clock,
} from "lucide-react";
import { SCHOOL_INFO } from "@/lib/constants";

export default function InstitutionalFooter() {
  return (
    <footer className="bg-[#111827] text-gray-300 border-t-4 border-[#2E4BA3] mt-auto">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Identity & Legal Info */}
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

          {/* Quick Links */}
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
              <li>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                  Gerbang Masuk LMS & Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Official External Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 border-l-2 border-[#2E4BA3] pl-2.5">
              Portal Kedinasan
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="https://kemdikbud.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between hover:text-white transition-colors"
                >
                  <span>Kementerian Pendidikan & Kebudayaan</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://disdikbud.lampungprov.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between hover:text-white transition-colors"
                >
                  <span>Dinas Pendidikan Provinsi Lampung</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://dapo.kemdikbud.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between hover:text-white transition-colors"
                >
                  <span>Dapodik Kemdikbudristek</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://snpmb.bppp.kemdikbud.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between hover:text-white transition-colors"
                >
                  <span>Portal SNPMB Masuk PTN</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Kontak & Jam Operasional */}
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
