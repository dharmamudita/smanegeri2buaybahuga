import Link from "next/link";
import { 
  Users, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  Calendar, 
  ArrowUpRight, 
  Radio, 
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatDateTime, getStatusBadge } from "@/lib/utils";
import { PPDBPeriod, Registration } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let activePeriod: PPDBPeriod | null = null;
  let totalRegistrations = 0;
  let pendingCount = 0;
  let verifiedCount = 0;
  let acceptedCount = 0;
  let recentRegistrations: Registration[] = [];

  try {
    const supabase = await createClient();

    // 1. Get active period
    const { data: period } = await supabase
      .from("ppdb_periods")
      .select("*")
      .eq("is_active", true)
      .maybeSingle();

    activePeriod = period as PPDBPeriod;

    // 2. Registrations metrics
    const { count: total } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true });
    totalRegistrations = total || 0;

    const { count: pending } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");
    pendingCount = pending || 0;

    const { count: verified } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("status", "verified");
    verifiedCount = verified || 0;

    const { count: accepted } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("status", "accepted");
    acceptedCount = accepted || 0;

    // 3. Recent 5 registrations
    const { data: recents } = await supabase
      .from("registrations")
      .select("id, reg_number, full_name, nisn, registration_track, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    if (recents) {
      recentRegistrations = recents as any;
    }
  } catch (err) {
    console.error("Dashboard data fetch error:", err);
  }

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      
      {/* Wave Quick Control Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${activePeriod?.is_active ? "text-emerald-600 animate-pulse" : "text-slate-400"}`} />
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
              Status Pendaftaran PPDB Publik
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {activePeriod ? activePeriod.title : "Tidak Ada Gelombang Aktif"}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                activePeriod?.is_active
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {activePeriod?.is_active ? "Form Terbuka Untuk Umum" : "Form Tertutup"}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            {activePeriod
              ? `Tahun Ajaran ${activePeriod.academic_year} • Kuota: ${activePeriod.quota} Siswa • Batas Pendaftaran: ${formatDate(activePeriod.end_date)}`
              : "Formulir pendaftaran di website publik sedang ditutup sementara oleh panitia."}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/periode"
            className="px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition"
          >
            Atur Gelombang & Saklar
          </Link>
          <Link
            href="/admin/ppdb"
            className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition shadow-sm shadow-blue-700/20"
          >
            Buka Data Siswa
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Masuk */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Berkas</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{totalRegistrations}</div>
          <div className="text-[11px] text-slate-500">Seluruh calon siswa terdaftar</div>
        </div>

        {/* Menunggu Verifikasi */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Perlu Ditinjau</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
          <div className="text-[11px] text-slate-500">Menunggu validasi dokumen</div>
        </div>

        {/* Terverifikasi */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Terverifikasi</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-sky-700">{verifiedCount}</div>
          <div className="text-[11px] text-slate-500">Berkas lengkap & memenuhi syarat</div>
        </div>

        {/* Lulus Seleksi */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Diterima / Lulus</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">{acceptedCount}</div>
          <div className="text-[11px] text-slate-500">Dinyatakan diterima resmi</div>
        </div>

      </div>

      {/* Recent Registrations Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Pendaftar Terbaru</h3>
            <p className="text-xs text-slate-500">5 pendaftar terakhir yang mengirimkan formulir online.</p>
          </div>
          <Link
            href="/admin/ppdb"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 transition"
          >
            <span>Buka Semua Pendaftar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-6">No. Registrasi</th>
                <th className="py-3.5 px-6">Nama Lengkap</th>
                <th className="py-3.5 px-6">NISN</th>
                <th className="py-3.5 px-6">Jalur</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Waktu Masuk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    Belum ada data pendaftar baru yang masuk.
                  </td>
                </tr>
              ) : (
                recentRegistrations.map((item) => {
                  const badge = getStatusBadge(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-6 font-mono font-bold text-blue-700">
                        {item.reg_number}
                      </td>
                      <td className="py-3.5 px-6 font-bold text-slate-900">{item.full_name}</td>
                      <td className="py-3.5 px-6 font-mono text-slate-600">{item.nisn}</td>
                      <td className="py-3.5 px-6 uppercase font-semibold text-slate-700">{item.registration_track}</td>
                      <td className="py-3.5 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-500">
                        {formatDateTime(item.created_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
