"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Building2,
  Lock,
} from "lucide-react";
import { SCHOOL_INFO } from "@/lib/constants";
import { useBeritaStore } from "@/lib/store";

const HERO_SLIDES = [
  {
    id: "slide-1",
    alt: "Lingkungan & Gedung SMA Negeri 2 Buay Bahuga",
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=80",
  },
  {
    id: "slide-2",
    alt: "Kegiatan Pembelajaran & Dewan Guru SMAN 2 Buay Bahuga",
    imageUrl:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&auto=format&fit=crop&q=80",
  },
  {
    id: "slide-3",
    alt: "Kebersamaan & Prestasi Peserta Didik SMAN 2 Buay Bahuga",
    imageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80",
  },
  {
    id: "slide-4",
    alt: "Fasilitas Laboratorium & Sarana Belajar SMAN 2 Buay Bahuga",
    imageUrl:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&auto=format&fit=crop&q=80",
  },
];

export default function HomePage() {
  const beritaList = useBeritaStore((state) => state.beritaList);
  const beritaTerbaru = beritaList.slice(0, 6);
  const [activeBannerIdx, setActiveBannerIdx] = useState<number>(0);

  // Otomatis bergeser setiap 4 detik ketika dibiarkan
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeBannerIdx]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* 0. Banner Foto Utama 12:5 (1920x800 px / 1200x500 px) di Paling Atas Beranda (Tanpa Teks, Geser Manual & Otomatis) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7">
        <div className="relative w-full aspect-[12/5] rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
          {/* Track Slide Horizontal */}
          <div
            className="flex w-full h-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeBannerIdx * 100}%)` }}
          >
            {HERO_SLIDES.map((slide) => (
              <div key={slide.id} className="w-full h-full shrink-0 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.imageUrl}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Tombol Geser Kiri Modern Glassmorphism */}
          <button
            type="button"
            onClick={() =>
              setActiveBannerIdx(
                (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
              )
            }
            className="group/btn absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-black/35 hover:bg-[#2A2C5E] backdrop-blur-md border border-white/25 hover:border-white/50 text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Foto Sebelumnya"
          >
            <ArrowLeft
              strokeWidth={2.25}
              className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover/btn:-translate-x-0.5"
            />
          </button>

          {/* Tombol Geser Kanan Modern Glassmorphism */}
          <button
            type="button"
            onClick={() =>
              setActiveBannerIdx((prev) => (prev + 1) % HERO_SLIDES.length)
            }
            className="group/btn absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-black/35 hover:bg-[#2A2C5E] backdrop-blur-md border border-white/25 hover:border-white/50 text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Foto Berikutnya"
          >
            <ArrowRight
              strokeWidth={2.25}
              className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover/btn:translate-x-0.5"
            />
          </button>

          {/* Indikator Titik Slide di Bawah Tengah */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-full shadow-md">
            {HERO_SLIDES.map((s, idx) => {
              const isCurrent = idx === activeBannerIdx;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveBannerIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? "w-7 bg-white shadow-xs"
                      : "w-2 bg-white/50 hover:bg-white/85"
                  }`}
                  aria-label={`Pilih Foto ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>
      </section>
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
                        Lokasi Sekolah
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
                    Penyelenggaraan pendidikan bagi 983 peserta didik (29 rombel) serta 53 pendidik dan tenaga kependidikan.
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
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">983</div>
            <div className="text-xs font-semibold text-gray-600">
              Peserta Didik Aktif (29 Rombel)
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs text-center space-y-1">
            <div className="w-10 h-10 mx-auto rounded-lg bg-blue-50 text-[#2A2C5E] flex items-center justify-center mb-3">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">53</div>
            <div className="text-xs font-semibold text-gray-600">
              Pendidik & Tenaga Kependidikan
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs text-center space-y-1">
            <div className="w-10 h-10 mx-auto rounded-lg bg-blue-50 text-[#2A2C5E] flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">25+</div>
            <div className="text-xs font-semibold text-gray-600">
              Prestasi OSN, O2SN & FLS2N
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs text-center space-y-1">
            <div className="w-10 h-10 mx-auto rounded-lg bg-blue-50 text-[#2A2C5E] flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">28</div>
            <div className="text-xs font-semibold text-gray-600">
              Ruang Kelas & 9 Laboratorium
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
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
                  alt="Apriyani, S.Si., M.M.Pd. - Kepala SMAN 2 Buay Bahuga"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {SCHOOL_INFO.kepalaSekolah}
                </h3>
                <p className="text-xs text-[#2A2C5E] font-medium">
                  Kepala SMA Negeri 2 Buay Bahuga
                </p>
                <p className="text-[11px] text-gray-400">
                  NIP. {SCHOOL_INFO.nipKepalaSekolah} ({SCHOOL_INFO.pangkatKepalaSekolah})
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sambutan Kepala Sekolah</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Mewujudkan Insan Beriman, Berakhlak Mulia, Unggul dalam Prestasi, dan Berdaya Saing Global
              </h2>
              <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
                <p>
                  Assalamu’alaikum Warahmatullahi Wabarakatuh, Salam Sejahtera bagi
                  kita semua, Tabik Pun.
                </p>
                <p>
                  Puji syukur kehadirat Tuhan Yang Maha Esa atas hadirnya portal
                  informasi resmi dan sistem pembelajaran terpadu SMA Negeri 2 Buay
                  Bahuga (Smandabuba), Kampung Suka Agung, Kecamatan Buay Bahuga,
                  Kabupaten Way Kanan. Sejak berdiri pada 22 Februari 2008, sekolah
                  kami terus berkomitmen menghadirkan layanan pendidikan yang
                  transparan, akuntabel, dan bermutu tinggi.
                </p>
                <p>
                  Melalui implementasi Kurikulum Merdeka, pembinaan prestasi akademik
                  maupun non-akademik, serta penguatan Gerakan Sekolah ASRI (Aman,
                  Sehat, Resik, dan Indah), kami bertekad mendampingi setiap peserta
                  didik agar tumbuh menjadi generasi berkarakter luhur yang siap
                  melanjutkan pendidikan ke perguruan tinggi terbaik dan berkontribusi
                  bagi masyarakat.
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
            <div className="text-xs font-bold text-[#2A2C5E]">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {beritaTerbaru.map((berita, idx) => (
            <article
              key={berita.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between h-full"
            >
              <div className="flex flex-col">
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={berita.thumbnailUrl}
                    alt={berita.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-[#2A2C5E] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded shadow-xs capitalize">
                      {berita.kategori.toLowerCase()}
                    </span>
                    {idx === 0 && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                        Terbaru
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5 flex flex-col">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 h-5">
                    <Calendar className="w-3 h-3" />
                    <span>{berita.tanggal}</span>
                  </div>
                  <div className="mt-2 h-11 flex items-start">
                    <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">
                      {berita.judul}
                    </h3>
                  </div>
                  <div className="mt-2 h-[3.75rem] flex items-start">
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {berita.ringkasan}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-gray-100">
                <Link
                  href="/informasi"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#2A2C5E] hover:underline"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
