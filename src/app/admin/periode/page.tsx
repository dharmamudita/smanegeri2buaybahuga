"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Radio, 
  Plus, 
  Power, 
  Users, 
  Loader2, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Trash2
} from "lucide-react";
import { togglePeriodActive } from "@/app/actions/admin";
import { formatDate } from "@/lib/utils";
import { PPDBPeriod } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

export default function AdminPeriodePage() {
  const [periods, setPeriods] = useState<PPDBPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // New Period Form State
  const [newPeriod, setNewPeriod] = useState({
    title: "",
    academic_year: "2027/2028",
    quota: 180,
    start_date: "",
    end_date: "",
    description: "",
  });

  const fetchPeriods = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("ppdb_periods")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setPeriods(data as PPDBPeriod[]);
      }
    } catch (err) {
      console.error("Error fetching periods:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  // Toggle active/inactive
  const handleToggle = async (periodId: string, currentStatus: boolean) => {
    setTogglingId(periodId);
    try {
      const res = await togglePeriodActive(periodId, currentStatus);
      if (res.success) {
        setPeriods((prev) =>
          prev.map((p) => ({
            ...p,
            is_active: p.id === periodId ? res.newStatus! : (res.newStatus ? false : p.is_active),
          }))
        );
      } else {
        alert("Gagal mengubah status: " + res.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    } finally {
      setTogglingId(null);
    }
  };

  // Create new period
  const handleCreatePeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!newPeriod.title.trim() || !newPeriod.start_date || !newPeriod.end_date) {
      setErrorMsg("Nama gelombang, tanggal mulai, dan tanggal berakhir wajib diisi.");
      return;
    }

    setCreating(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("ppdb_periods")
        .insert({
          title: newPeriod.title.trim(),
          academic_year: newPeriod.academic_year,
          quota: newPeriod.quota,
          start_date: newPeriod.start_date,
          end_date: newPeriod.end_date,
          description: newPeriod.description.trim() || null,
          is_active: false,
        })
        .select()
        .single();

      if (error) {
        setErrorMsg("Gagal membuat gelombang: " + error.message);
      } else if (data) {
        setPeriods((prev) => [data as PPDBPeriod, ...prev]);
        setShowCreateForm(false);
        setNewPeriod({
          title: "",
          academic_year: "2027/2028",
          quota: 180,
          start_date: "",
          end_date: "",
          description: "",
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Kesalahan server.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Manajemen Gelombang PPDB
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Buat periode pendaftaran baru dan kendalikan saklar buka/tutup formulir publik.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchPeriods}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-md shadow-sky-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Gelombang Baru</span>
          </button>
        </div>
      </div>

      {/* Create New Period Form (Collapsible) */}
      {showCreateForm && (
        <form
          onSubmit={handleCreatePeriod}
          className="rounded-3xl bg-slate-800/60 border border-slate-700 p-6 sm:p-8 space-y-4"
        >
          <h3 className="text-base font-extrabold text-white">Formulir Pembuatan Gelombang Baru</h3>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Nama Gelombang *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: PPDB 2027/2028 - Gelombang 2"
                value={newPeriod.title}
                onChange={(e) => setNewPeriod({ ...newPeriod, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Tahun Ajaran *
              </label>
              <input
                type="text"
                required
                placeholder="2027/2028"
                value={newPeriod.academic_year}
                onChange={(e) => setNewPeriod({ ...newPeriod, academic_year: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Kuota Penerimaan *
              </label>
              <input
                type="number"
                min={1}
                required
                value={newPeriod.quota}
                onChange={(e) => setNewPeriod({ ...newPeriod, quota: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Tanggal Pembukaan *
              </label>
              <input
                type="date"
                required
                value={newPeriod.start_date}
                onChange={(e) => setNewPeriod({ ...newPeriod, start_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Tanggal Penutupan *
              </label>
              <input
                type="date"
                required
                value={newPeriod.end_date}
                onChange={(e) => setNewPeriod({ ...newPeriod, end_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Deskripsi / Keterangan (Opsional)
              </label>
              <textarea
                rows={2}
                placeholder="Keterangan tambahan untuk gelombang ini..."
                value={newPeriod.description}
                onChange={(e) => setNewPeriod({ ...newPeriod, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-md shadow-sky-600/20 disabled:opacity-50"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Gelombang Baru</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Periods List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-400" />
            <span className="text-sm">Memuat data gelombang...</span>
          </div>
        ) : periods.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="text-sm font-semibold">Belum ada gelombang PPDB yang dibuat.</p>
            <p className="text-xs mt-1">Klik tombol &quot;Buat Gelombang Baru&quot; untuk memulai.</p>
          </div>
        ) : (
          periods.map((period) => (
            <div
              key={period.id}
              className={`rounded-3xl border p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                period.is_active
                  ? "bg-emerald-950/30 border-emerald-800/60 shadow-lg shadow-emerald-500/5"
                  : "bg-slate-800/40 border-slate-800"
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <Radio
                    className={`w-4 h-4 ${
                      period.is_active ? "text-emerald-400 animate-pulse" : "text-slate-500"
                    }`}
                  />
                  <h3 className="text-lg font-extrabold text-white">{period.title}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      period.is_active
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-700"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {period.is_active ? "AKTIF / TERBUKA" : "NONAKTIF / TERTUTUP"}
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-0.5">
                  <div>
                    Tahun Ajaran: <span className="font-semibold text-slate-200">{period.academic_year}</span> •
                    Kuota: <span className="font-semibold text-slate-200">{period.quota} Siswa</span>
                  </div>
                  <div>
                    Periode: <span className="text-slate-300">{formatDate(period.start_date)}</span> s/d{" "}
                    <span className="text-slate-300">{formatDate(period.end_date)}</span>
                  </div>
                  {period.description && (
                    <div className="text-slate-500 italic mt-1">{period.description}</div>
                  )}
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={() => handleToggle(period.id, period.is_active)}
                  disabled={togglingId === period.id}
                  className={`relative inline-flex items-center h-8 w-16 rounded-full border transition-all duration-300 ${
                    period.is_active
                      ? "bg-emerald-600 border-emerald-500"
                      : "bg-slate-700 border-slate-600"
                  } ${togglingId === period.id ? "opacity-60" : "cursor-pointer hover:shadow-lg"}`}
                >
                  <span
                    className={`inline-block h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                      period.is_active ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-slate-400 min-w-[60px]">
                  {togglingId === period.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                  ) : period.is_active ? (
                    "Buka"
                  ) : (
                    "Tutup"
                  )}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
