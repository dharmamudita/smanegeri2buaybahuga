import {
  BookOpen,
  Calendar,
  Award,
  GraduationCap,
  CheckCircle2,
  Users,
} from "lucide-react";
import { MOCK_USERS } from "@/lib/mockData";

export default function AkademikPage() {
  const guruList = MOCK_USERS.filter((u) => u.role === "GURU");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2E4BA3] text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Layanan Pendidikan</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Struktur Akademik & Kurikulum Merdeka
        </h1>
        <p className="text-sm text-gray-600 mt-2 max-w-3xl leading-relaxed">
          SMAN 2 Buay Bahuga menerapkan Kurikulum Merdeka secara komprehensif,
          memberikan fleksibilitas bagi peserta didik dalam memilih mata pelajaran
          peminatan sesuai minat dan bakat karier masa depan.
        </p>
      </div>

      {/* Program Jurusan / Konsentrasi */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">
          Konsentrasi Program Peminatan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E4BA3] bg-blue-50 px-2.5 py-1 rounded">
                Program Sains
              </span>
              <span className="text-xs text-gray-500">Tingkat X, XI, XII</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Matematika dan Ilmu Pengetahuan Alam (MIPA)
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Fokus pada penalaran kuantitatif, eksperimen laboratorium, dan
              metodologi ilmiah untuk mempersiapkan siswa menuju perguruan tinggi
              bidang Kedokteran, Teknik, Farmasi, dan Sains Terapan.
            </p>
            <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Biologi Terapan & Genetika Molekuler</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Fisika Mekanika & Elektromagnetika</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kimia Analitik & Reaksi Organik</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Matematika Peminatan Lanjutan</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded">
                Program Sosial & Humaniora
              </span>
              <span className="text-xs text-gray-500">Tingkat X, XI, XII</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Ilmu Pengetahuan Sosial (IPS)
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Membangun kepekaan sosial, analisis dinamika ekonomi regional, dan
              kebijakan publik guna mencetak calon profesional di bidang Hukum,
              Ekonomi Bisnis, Ilmu Komunikasi, dan Hubungan Internasional.
            </p>
            <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Sosiologi dan Perubahan Dinamika Masyarakat</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ekonomi Makro & Akuntansi Lembaga</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Geografi Lingkungan & Sistem Informasi Geografis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Sejarah Indonesia & Diplomasi Global</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kalender Akademik */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2E4BA3] text-white flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Agenda Kalender Pendidikan Semester Ganjil 2026/2027
            </h2>
            <p className="text-xs text-gray-500">
              Pedoman Pelaksanaan Kegiatan Pembelajaran SMAN 2 Buay Bahuga
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-1.5">
            <span className="font-semibold text-[#2E4BA3]">
              15 - 19 Juli 2026
            </span>
            <h4 className="font-bold text-gray-900">
              Masa Pengenalan Lingkungan Sekolah (MPLS)
            </h4>
            <p className="text-gray-600">
              Orientasi siswa baru tingkat X dan penandatanganan pakta integritas.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-1.5">
            <span className="font-semibold text-[#2E4BA3]">
              21 - 26 September 2026
            </span>
            <h4 className="font-bold text-gray-900">
              Penilaian Tengah Semester (PTS) Berbasis LMS
            </h4>
            <p className="text-gray-600">
              Evaluasi formatif tengah semester melalui modul Ujian Anti-Cheat.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-1.5">
            <span className="font-semibold text-[#2E4BA3]">
              1 - 10 Desember 2026
            </span>
            <h4 className="font-bold text-gray-900">
              Penilaian Akhir Semester (PAS) & Pembagian Rapor
            </h4>
            <p className="text-gray-600">
              Ujian komprehensif semester ganjil dan pengumuman capaian hasil belajar.
            </p>
          </div>
        </div>
      </div>

      {/* Profil Dewan Guru */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">
          Dewan Guru & Tenaga Pendidik
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {guruList.map((guru) => (
            <div
              key={guru.id}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-[#2E4BA3] font-bold text-lg overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={guru.avatarUrl}
                  alt={guru.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate">
                  {guru.name}
                </h4>
                <p className="text-xs text-[#2E4BA3] font-medium mt-0.5">
                  {guru.mataPelajaran}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  NUPTK: {guru.nuptk}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
