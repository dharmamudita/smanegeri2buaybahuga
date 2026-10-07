import { Metadata } from "next";
import Link from "next/link";
import { 
  CalendarDays, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight, 
  Clock, 
  Users, 
  ShieldCheck,
  AlertCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "Jadwal & Kuota Gelombang | PPDB SMAN 2 Buay Bahuga",
  description:
    "Linimasa pelaksanaan seleksi, jadwal gelombang pendaftaran, dan rincian kuota PPDB SMA Negeri 2 Buay Bahuga.",
};

const TIMELINE_STEPS = [
  {
    phase: "Tahap 1: Sosialisasi & Publikasi",
    date: "1 Mei – 20 Mei 2027",
    desc: "Penyebarluasan informasi petunjuk teknis, syarat berkas, dan pembukaan helpdesk konsultasi bagi calon peserta didik.",
    status: "Selesai",
  },
  {
    phase: "Tahap 2: Pendaftaran Daring (Online)",
    date: "25 Mei – 10 Juni 2027",
    desc: "Pengisian biodata online, penentuan jalur seleksi, dan pengunggahan berkas digital melalui portal web resmi sekolah.",
    status: "Sedang Berlangsung",
  },
  {
    phase: "Tahap 3: Verifikasi Faktual Dokumen",
    date: "11 Juni – 16 Juni 2027",
    desc: "Pemeriksaan dan validasi keabsahan dokumen oleh panitia PPDB sekolah bersama tim verifikator dinas pendidikan.",
    status: "Akan Datang",
  },
  {
    phase: "Tahap 4: Pengumuman Kelulusan Seleksi",
    date: "20 Juni 2027 (Pukul 10.00 WIB)",
    desc: "Publikasi hasil seleksi final melalui menu Cek Status di website dan papan pengumuman resmi sekolah.",
    status: "Akan Datang",
  },
  {
    phase: "Tahap 5: Daftar Ulang (Lapor Diri)",
    date: "22 Juni – 26 Juni 2027",
    desc: "Penyerahan berkas fisik asli, pengukuran seragam sekolah, dan pengesahan status peserta didik baru.",
    status: "Akan Datang",
  },
];

export default function PPDBJadwalPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/ppdb" className="hover:text-sky-600 transition">PPDB</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-bold">Jadwal & Kuota</span>
        </nav>

        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <CalendarDays className="w-3.5 h-3.5 text-sky-600" />
            <span>Linimasa & Alokasi Kuota</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Jadwal Gelombang & Kuota Seleksi
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Perhatikan batas waktu setiap tahapan agar tidak tertinggal proses verifikasi maupun daftar ulang peserta didik baru.
          </p>
        </div>

        {/* Kuota Card */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-12 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Alokasi Kuota Daya Tampung</h2>
              <p className="text-xs sm:text-sm text-slate-500">Tahun Ajaran 2027/2028 (Total: 5 Rombel / 180 Siswa)</p>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold w-fit">
              Daya Tampung Resmi
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-3xl font-black text-sky-600">90</div>
              <div className="text-xs font-bold text-slate-900">Jalur Zonasi (50%)</div>
              <div className="text-[11px] text-slate-400">Radius wilayah terdekat</div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-3xl font-black text-sky-600">27</div>
              <div className="text-xs font-bold text-slate-900">Jalur Afirmasi (15%)</div>
              <div className="text-[11px] text-slate-400">KIP / Keluarga prasejahtera</div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-3xl font-black text-sky-600">54</div>
              <div className="text-xs font-bold text-slate-900">Jalur Prestasi (30%)</div>
              <div className="text-[11px] text-slate-400">Rapor & piagam kejuaraan</div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-3xl font-black text-sky-600">9</div>
              <div className="text-xs font-bold text-slate-900">Jalur Mutasi (5%)</div>
              <div className="text-[11px] text-slate-400">Pindah tugas orang tua</div>
            </div>
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-12 shadow-xs space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-extrabold text-slate-900">Linimasa Pelaksanaan PPDB</h3>
            <p className="text-xs sm:text-sm text-slate-500">Urutan tahapan seleksi dari pendaftaran hingga lapor diri.</p>
          </div>

          <div className="space-y-6">
            {TIMELINE_STEPS.map((step, idx) => {
              const isOngoing = step.status === "Sedang Berlangsung";
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isOngoing
                      ? "bg-sky-50/70 border-sky-300 ring-1 ring-sky-200"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-sky-600">0{idx + 1}</span>
                      <h4 className="font-extrabold text-slate-900 text-base">{step.phase}</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">{step.desc}</p>
                  </div>

                  <div className="flex flex-col md:items-end gap-1.5 shrink-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-sky-600" />
                      <span>{step.date}</span>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full w-fit ${
                        isOngoing
                          ? "bg-sky-600 text-white animate-pulse"
                          : step.status === "Selesai"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
