import { Metadata } from "next";
import Link from "next/link";
import { 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  AlertCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "Syarat & Dokumen Pendaftaran | PPDB SMAN 2 Buay Bahuga",
  description:
    "Persyaratan administrasi dan dokumen berkas pendaftaran calon peserta didik baru SMA Negeri 2 Buay Bahuga.",
};

const TRACK_REQUIREMENTS = [
  {
    title: "Jalur Zonasi (Min. 50%)",
    desc: "Diperuntukkan bagi calon peserta didik yang berdomisili di dalam wilayah zonasi yang telah ditetapkan oleh Pemerintah Daerah.",
    docs: [
      "Kartu Keluarga (KK) yang diterbitkan paling singkat 1 tahun sebelum tanggal pendaftaran.",
      "Surat Keterangan Lulus (SKL) atau Surat Keterangan Nilai Rapor SMP/MTs.",
      "Akta Kelahiran atau Surat Keterangan Lahir resmi.",
      "Pas foto formal terbaru ukuran 3x4 berwarna (latar belakang merah/biru).",
    ],
  },
  {
    title: "Jalur Afirmasi (Min. 15%)",
    desc: "Diperuntukkan bagi calon peserta didik yang berasal dari keluarga ekonomi tidak mampu dan penyandang disabilitas.",
    docs: [
      "Kartu bukti keikutsertaan program penanganan keluarga tidak mampu (KIP, PKH, KKS, atau sejenisnya).",
      "Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) orang tua/wali bermaterai.",
      "Kartu Keluarga (KK) dan Akta Kelahiran.",
      "Surat Keterangan Lulus (SKL) dari sekolah asal.",
    ],
  },
  {
    title: "Jalur Prestasi (Maks. 30%)",
    desc: "Diperuntukkan bagi calon peserta didik yang memiliki prestasi akademik nilai rapor atau prestasi non-akademik kejuaraan.",
    docs: [
      "Buku rapor SMP/MTs semester 1 sampai dengan semester 5 yang dilegalisir.",
      "Sertifikat/Piagam Kejuaraan asli (OSN, O2SN, FLS2N, MTQ, atau kejuaraan kedinasan minimal tingkat kabupaten).",
      "Kartu Keluarga (KK) dan Akta Kelahiran.",
      "Pas foto 3x4 formal berwarna.",
    ],
  },
  {
    title: "Jalur Perpindahan Tugas Orang Tua (Maks. 5%)",
    desc: "Diperuntukkan bagi calon peserta didik yang orang tua/walinya dipindahtugaskan dinas kerja ke wilayah Way Kanan.",
    docs: [
      "Surat penugasan resmi dari instansi, lembaga, kantor, atau perusahaan yang mempekerjakan.",
      "Surat keterangan domisili baru dari kelurahan/desa setempat.",
      "Kartu Keluarga (KK) dan Surat Keterangan Lulus (SKL).",
    ],
  },
];

export default function PPDBSyaratPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/ppdb" className="hover:text-sky-600 transition">PPDB</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-bold">Syarat & Dokumen</span>
        </nav>

        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span>Ketentuan Berkas Pendaftaran</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Syarat & Ketentuan Dokumen PPDB
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Pastikan seluruh berkas persyaratan telah disiapkan dalam format digital (JPG/PNG/PDF maksimal 2MB per berkas) sebelum mengisi formulir online.
          </p>
        </div>

        {/* General Alert */}
        <div className="rounded-3xl bg-amber-50 border border-amber-200/80 p-6 sm:p-8 flex items-start gap-4 text-amber-900">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <div className="font-bold text-base text-amber-950">Ketentuan Penting Pengunggahan Berkas:</div>
            <p className="text-amber-800 leading-relaxed">
              Seluruh dokumen yang diunggah harus dapat terbaca dengan jelas (tidak buram/terpotong). Berkas yang tidak valid atau terindikasi rekayasa dapat menggugurkan proses verifikasi calon peserta didik baru.
            </p>
          </div>
        </div>

        {/* Track Requirements Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TRACK_REQUIREMENTS.map((track, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-lg transition space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-md">
                  Jalur Seleksi 0{idx + 1}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
                  {track.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {track.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Dokumen Prasyarat Wajib:
                </div>
                {track.docs.map((doc, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA to Registration */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold">Berkas Sudah Lengkap?</h3>
            <p className="text-sm text-slate-400">Lanjutkan ke pengisian formulir biodata pendaftaran siswa baru secara online.</p>
          </div>
          <Link
            href="/ppdb"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm shrink-0 transition"
          >
            <span>Buka Formulir PPDB</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
