import Link from "next/link";
import { 
  Users, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  Calendar, 
  ArrowUpRight, 
  Radio, 
  FileSpreadsheet,
  AlertTriangle
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatDateTime, getStatusBadge } from "@/lib/utils";
import { PPDBPeriod, Registration } from "@/types/database";

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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Dasbor Utama Panitia PPDB
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Selamat datang, berikut ringkasan status pendaftaran dan kendali sistem PPDB.
          </p>
        </div>

        <Link
          href="/admin/ppdb"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-md shadow-sky-600/20 shrink-0 self-start sm:self-auto"
        >
          <span>Kelola Semua Pendaftar</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Wave Quick Control Card */}
      <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${activePeriod?.is_active ? "text-emerald-400 animate-pulse" : "text-slate-500"}`} />
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Status Pendaftaran Publik
            </span>
          </div>

          <div className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
            <span>{activePeriod ? activePeriod.title : "Tidak Ada Gelombang Aktif"}</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                activePeriod?.is_active
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                  : "bg-rose-950 text-rose-400 border border-rose-800"
              }`}
            >
              {activePeriod?.is_active ? "Form Terbuka Untuk Umum" : "Form Tertutup"}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            {activePeriod
              ? `Tahun Ajaran ${activePeriod.academic_year} • Kuota: ${activePeriod.quota} Siswa • Berakhir pada ${formatDate(activePeriod.end_date)}`
              : "Formulir di website publik saat ini tidak dapat menerima pendaftaran baru."}
          </p>
        </div>

        <Link
          href="/admin/periode"
          className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-sky-500 text-xs font-bold text-slate-200 transition shrink-0 text-center"
        >
          Atur Gelombang & Saklar PPDB
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Masuk</span>
            <Users className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalRegistrations}</div>
          <div className="text-[11px] text-slate-400">Seluruh berkas calon siswa</div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Menunggu Verifikasi</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{pendingCount}</div>
          <div className="text-[11px] text-slate-400">Perlu ditinjau kelengkapannya</div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Terverifikasi</span>
            <UserCheck className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-sky-400">{verifiedCount}</div>
          <div className="text-[11px] text-slate-400">Dokumen valid & sesuai</div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Lulus Seleksi</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{acceptedCount}</div>
          <div className="text-[11px] text-slate-400">Diterima resmi di SMAN 2</div>
        </div>
      </div>

      {/* Recent Registrations Table */}
      <div className="rounded-3xl bg-slate-800/40 border border-slate-800 overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white">Pendaftar Terbaru</h2>
            <p className="text-xs text-slate-400">5 pendaftar terakhir yang mengirimkan formulir online.</p>
          </div>
          <Link
            href="/admin/ppdb"
            className="text-xs font-bold text-sky-400 hover:text-sky-300"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-700 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">No. Registrasi</th>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">NISN</th>
                <th className="py-3 px-4">Jalur</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Waktu Daftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {recentRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500">
                    Belum ada data pendaftar baru yang masuk.
                  </td>
                </tr>
              ) : (
                recentRegistrations.map((item) => {
                  const badge = getStatusBadge(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-sky-400">
                        {item.reg_number}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">{item.full_name}</td>
                      <td className="py-3 px-4 font-mono">{item.nisn}</td>
                      <td className="py-3 px-4 uppercase">{item.registration_track}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
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
