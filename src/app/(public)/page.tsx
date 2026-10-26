import Link from "next/link";
import {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  ChevronRight,
  MapPin,
  Building2,
  Lock,
} from "lucide-react";
import { SCHOOL_INFO } from "@/lib/constants";
import { MOCK_BERITA } from "@/lib/mockData";

export default function HomePage() {
  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50/70 via-white to-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-4 sm:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-[#2A2C5E] text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Portal Resmi Pendidikan Terakreditasi {SCHOOL_INFO.akreditasi}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                Pusat Keunggulan Akademik &{" "}
                <span className="text-[#2A2C5E]">Smart School Terintegrasi</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
                SMA Negeri 2 Buay Bahuga menyelenggarakan pendidikan berkualitas
                berlandaskan budi pekerti luhur, penguasaan sains teknologi, serta
                pembelajaran holistik yang membentuk lulusan unggul, berprestasi,
                dan berkarakter mulia.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/ppdb"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-sm transition-all active:scale-98"
                >
                  <span>Pendaftaran PPDB 2026/2027</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-2xs transition-all active:scale-98"
                >
                  <Lock className="w-4 h-4 text-[#2A2C5E]" />
                  <span>Akses LMS & Dashboard</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-3 sm:pt-4 border-t border-gray-200 grid grid-cols-3 gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kurikulum Merdeka</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Terakreditasi A</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tenaga Pendidik Berpengalaman</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Card Highlight */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-5 sm:p-6 space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-gray-900 leading-none">
                        SMAN 2 BUAY BAHUGA
                      </h2>
                      <span className="text-[11px] text-gray-500">
                        NPSN: {SCHOOL_INFO.npsn}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Aktif
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <Building2 className="w-4 h-4 text-[#2A2C5E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-gray-800">
                        Lokasi Kampus
                      </span>
                      <p className="text-gray-500 mt-0.5 leading-relaxed">
                        {SCHOOL_INFO.alamat}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-[#2A2C5E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-gray-800">
                        Status Akreditasi
                      </span>
                      <p className="text-gray-500 mt-0.5">
                        Terakreditasi A (Unggul) BAN-S/M
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#2A2C5E] rounded-xl p-4 text-white space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-blue-200">
                      Tahun Ajaran 2026/2027
                    </span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">
                      Semester Ganjil
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    Sistem pembelajaran terpusat untuk 450+ peserta didik dan 32 dewan guru.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statistik Institusional */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs text-center space-y-1">
            <div className="w-10 h-10 mx-auto rounded-lg bg-blue-50 text-[#2A2C5E] flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">450+</div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Peserta Didik Aktif
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs text-center space-y-1">
            <div className="w-10 h-10 mx-auto rounded-lg bg-blue-50 text-[#2A2C5E] flex items-center justify-center mb-3">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">32</div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pendidik & Tenaga Kependidikan
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs text-center space-y-1">
            <div className="w-10 h-10 mx-auto rounded-lg bg-blue-50 text-[#2A2C5E] flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">18+</div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prestasi OSN & O2SN
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs text-center space-y-1">
            <div className="w-10 h-10 mx-auto rounded-lg bg-blue-50 text-[#2A2C5E] flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">100%</div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Digitalisasi LMS & CBT
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sambutan Kepala Sekolah */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
              <div className="w-40 h-48 sm:w-48 sm:h-56 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80"
                  alt="Kepala Sekolah SMAN 2 Buay Bahuga"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Drs. Hendro Wibowo, M.Pd.
                </h3>
                <p className="text-xs text-[#2A2C5E] font-medium">
                  Kepala SMA Negeri 2 Buay Bahuga
                </p>
                <p className="text-[11px] text-gray-400">NIP. 197003181995121002</p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sambutan Pimpinan Sekolah</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Mempersiapkan Generasi Berbudi Pekerti Luhur dan Unggul di Era Digital
              </h2>
              <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
                <p>
                  Assalamu’alaikum Warahmatullahi Wabarakatuh, Salam Sejahtera bagi
                  kita semua.
                </p>
                <p>
                  Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas
                  terwujudnya portal resmi dan ekosistem Smart School SMA Negeri 2
                  Buay Bahuga. Melalui integrasi teknologi ini, kami berkomitmen
                  memberikan layanan pendidikan prima yang transparan, akuntabel,
                  dan modern bagi seluruh siswa, guru, serta masyarakat Kabupaten
                  Way Kanan.
                </p>
                <p>
                  Dengan penerapan Kurikulum Merdeka yang didukung fasilitas pembelajaran
                  digital modern, kami memastikan bahwa proses pembelajaran tidak hanya
                  mengejar penguasaan ilmu pengetahuan, tetapi juga menanamkan kedisiplinan
                  dan budi pekerti yang kokoh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Berita & Informasi Resmi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#2A2C5E]">
              Informasi Publik
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              Warta & Pengumuman Sekolah
            </h2>
          </div>
          <Link
            href="/informasi"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2A2C5E] hover:text-[#1F2147]"
          >
            <span>Lihat Semua Informasi</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_BERITA.map((berita) => (
            <article
              key={berita.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={berita.thumbnailUrl}
                  alt={berita.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-[#2A2C5E] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                  {berita.kategori}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{berita.tanggal}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                    {berita.judul}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {berita.ringkasan}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <Link
                    href="/informasi"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2A2C5E] hover:underline"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
