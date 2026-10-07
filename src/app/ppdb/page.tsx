import { Metadata } from "next";
import Link from "next/link";
import { 
  Sparkles, 
  Calendar, 
  Users, 
  FileCheck2, 
  HelpCircle, 
  Phone, 
  Search,
  CheckCircle,
  FileText
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PPDBPeriod } from "@/types/database";
import RegistrationForm from "@/components/ppdb/RegistrationForm";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pendaftaran PPDB Online 2027/2028",
  description:
    "Formulir Pendaftaran Siswa Baru (PPDB) Online SMA Negeri 2 Buay Bahuga. Pendaftaran praktis, transparan, dan terintegrasi.",
};

export default async function PPDBPage() {
  let activePeriod: PPDBPeriod | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("ppdb_periods")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      activePeriod = data as PPDBPeriod;
    } else {
      // Default fallback mock if database not yet migrated
      activePeriod = {
        id: "mock-period-1",
        title: "PPDB 2027/2028 - Gelombang 1",
        academic_year: "2027/2028",
        quota: 180,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        description: "Pendaftaran Siswa Baru SMA Negeri 2 Buay Bahuga Jalur Zonasi, Afirmasi, Prestasi, dan Reguler.",
      };
    }
  } catch (err) {
    console.error("Error fetching active period:", err);
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Penerimaan Peserta Didik Baru (PPDB)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Portal Pendaftaran Siswa Baru
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Daftarkan diri Anda secara online untuk bergabung menjadi bagian dari civitas akademika SMA Negeri 2 Buay Bahuga.
          </p>

          <div className="pt-2 flex justify-center">
            <Link
              href="/ppdb/cek-status"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:text-sky-600 hover:border-sky-300 shadow-xs transition"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Sudah pernah mendaftar? Klik di sini untuk Cek Status</span>
            </Link>
          </div>
        </div>

        {/* Active Period Alert & Information Bar */}
        {activePeriod && activePeriod.is_active && (
          <div id="jadwal" className="rounded-3xl bg-gradient-to-r from-sky-600 to-sky-800 text-white p-6 sm:p-8 shadow-xl shadow-sky-600/15 scroll-mt-24">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-sky-400/20 text-sky-200 text-xs font-bold uppercase tracking-wider border border-sky-400/30">
                  Gelombang Aktif Sekarang
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold">{activePeriod.title}</h2>
                <p className="text-sm text-sky-100 max-w-2xl">{activePeriod.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <div className="space-y-1">
                  <div className="text-xs text-sky-200 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Daya Tampung</span>
                  </div>
                  <div className="text-lg font-black">{activePeriod.quota} Siswa</div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-sky-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Batas Akhir</span>
                  </div>
                  <div className="text-sm font-bold">{formatDate(activePeriod.end_date)}</div>
                </div>

                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <div className="text-xs text-sky-200 flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Biaya Pendaftaran</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-300">100% Gratis</div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Requirements & Checklist Grid */}
        <div id="syarat" className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-mt-24">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Syarat Dokumen Digital</h3>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Pas Foto 3x4 formal latar merah/biru</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Kartu Keluarga (KK) yang masih berlaku</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Surat Keterangan Lulus (SKL) / Ijazah SMP</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Ketentuan Usia & Sekolah</h3>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Telah lulus SMP / MTs atau sederajat</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Berusia maksimal 21 tahun pada 1 Juli</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Memiliki NISN 10 digit yang valid</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Bantuan Panitia PPDB</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jika mengalami kendala pengisian formulir atau pengunggahan dokumen, silakan hubungi kontak panitia sekolah.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs font-bold text-sky-600">
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp / Telp: 0852-6337-6378</span>
            </div>
          </div>
        </div>

        {/* Main Interactive Form Component */}
        <section id="form-daftar" className="pt-4">
          <RegistrationForm activePeriod={activePeriod} />
        </section>

      </div>
    </div>
  );
}
