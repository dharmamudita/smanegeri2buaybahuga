"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  RefreshCw, 
  Loader2, 
  Download,
  Phone,
  FileText
} from "lucide-react";
import { updateRegistrationStatus, forceSyncToGoogleSheets } from "@/app/actions/admin";
import { formatDate, formatDateTime, getStatusBadge, getTrackLabel } from "@/lib/utils";
import { PPDBStatus, Registration } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

export default function AdminPPDBPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTrack, setSelectedTrack] = useState<string>("all");

  // Document & Verification Modal
  const [activeModalReg, setActiveModalReg] = useState<Registration | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Fetch registrations
  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from("registrations")
        .select(`
          *,
          period:ppdb_periods(title, academic_year)
        `)
        .order("created_at", { ascending: false });

      const { data, error } = await query;
      if (data) {
        setRegistrations(data as any);
      }
    } catch (err) {
      console.error("Error fetching registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Filtered List
  const filteredList = registrations.filter((reg) => {
    const matchesSearch =
      reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.nisn.includes(searchQuery) ||
      reg.reg_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.school_origin.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || reg.status === selectedStatus;

    const matchesTrack =
      selectedTrack === "all" || reg.registration_track === selectedTrack;

    return matchesSearch && matchesStatus && matchesTrack;
  });

  // Handle Status Update
  const handleStatusChange = async (newStatus: PPDBStatus) => {
    if (!activeModalReg) return;
    setUpdating(true);

    try {
      const res = await updateRegistrationStatus(activeModalReg.id, newStatus, adminNotes);
      if (res.success) {
        setRegistrations((prev) =>
          prev.map((r) =>
            r.id === activeModalReg.id
              ? { ...r, status: newStatus, admin_notes: adminNotes }
              : r
          )
        );
        setActiveModalReg(null);
      } else {
        alert("Gagal memperbarui status: " + res.message);
      }
    } catch (err: any) {
      alert("Terjadi kesalahan.");
    } finally {
      setUpdating(false);
    }
  };

  // Handle Manual Google Sheets Sync
  const handleManualSync = async (regId: string) => {
    setSyncingId(regId);
    try {
      const res = await forceSyncToGoogleSheets(regId);
      if (res.success) {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === regId ? { ...r, synced_to_sheets: true } : r))
        );
        alert(res.message);
      } else {
        alert(res.message || "Gagal menyinkronkan.");
      }
    } catch (err) {
      alert("Kesalahan koneksi saat sinkronisasi.");
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Manajemen Pendaftar PPDB
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Verifikasi berkas, validasi status kelulusan, dan kontrol sinkronisasi spreadsheet.
          </p>
        </div>

        <button
          onClick={fetchRegistrations}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition border border-slate-700 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Muat Ulang Data</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari nama siswa, NISN, atau no. registrasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">Semua Status Verifikasi</option>
            <option value="pending">Menunggu Verifikasi</option>
            <option value="verified">Berkas Terverifikasi</option>
            <option value="revision_needed">Perlu Perbaikan Berkas</option>
            <option value="accepted">Lulus Seleksi</option>
            <option value="rejected">Tidak Lulus</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">Semua Jalur</option>
            <option value="zonasi">Zonasi</option>
            <option value="afirmasi">Afirmasi</option>
            <option value="prestasi">Prestasi</option>
            <option value="mutasi">Mutasi</option>
            <option value="reguler">Reguler</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-3xl bg-slate-800/40 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-700 text-slate-400 uppercase tracking-wider font-semibold bg-slate-800/60">
              <tr>
                <th className="py-3.5 px-4">No. Registrasi</th>
                <th className="py-3.5 px-4">Nama Siswa</th>
                <th className="py-3.5 px-4">NISN / Asal Sekolah</th>
                <th className="py-3.5 px-4">Jalur</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Sync Sheets</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-400" />
                    <span>Memuat data pendaftar...</span>
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Tidak ada data pendaftar yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const badge = getStatusBadge(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                        {item.reg_number}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{item.full_name}</div>
                        <div className="text-[11px] text-slate-400">
                          {item.gender} • {item.phone_number}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-slate-300">{item.nisn}</div>
                        <div className="text-[11px] text-slate-400">{item.school_origin}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-700 text-slate-300 font-semibold text-[10px] uppercase">
                          {item.registration_track}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {item.synced_to_sheets ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Tersinkron</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleManualSync(item.id)}
                            disabled={syncingId === item.id}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${syncingId === item.id ? "animate-spin" : ""}`} />
                            <span>Sync Ulang</span>
                          </button>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            setActiveModalReg(item);
                            setAdminNotes(item.admin_notes || "");
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Tinjau</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL & VERIFICATION MODAL */}
      {activeModalReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-sky-400">
                  Verifikasi Berkas Siswa
                </span>
                <h3 className="text-xl font-bold text-white">{activeModalReg.full_name}</h3>
              </div>
              <button
                onClick={() => setActiveModalReg(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/60 p-4 rounded-2xl">
              <div>
                <span className="text-slate-400">No. Registrasi:</span>
                <div className="font-mono font-bold text-sky-400">{activeModalReg.reg_number}</div>
              </div>
              <div>
                <span className="text-slate-400">Jalur Pendaftaran:</span>
                <div className="font-bold text-white">{getTrackLabel(activeModalReg.registration_track)}</div>
              </div>
              <div>
                <span className="text-slate-400">NISN / NIK:</span>
                <div className="font-mono text-slate-200">{activeModalReg.nisn} / {activeModalReg.nik}</div>
              </div>
              <div>
                <span className="text-slate-400">Kontak WhatsApp:</span>
                <div className="text-slate-200">{activeModalReg.phone_number} (Ortu: {activeModalReg.parent_phone})</div>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Alamat Lengkap:</span>
                <div className="text-slate-200">{activeModalReg.address}</div>
              </div>
            </div>

            {/* Uploaded Documents Check */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pindaian Dokumen Prasyarat
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Pas Foto 3x4", url: activeModalReg.document_urls?.photo },
                  { label: "Kartu Keluarga", url: activeModalReg.document_urls?.kk },
                  { label: "SKL / Ijazah", url: activeModalReg.document_urls?.skl },
                ].map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center space-y-2">
                    <span className="text-[11px] font-semibold text-slate-300 block">{doc.label}</span>
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-400 hover:text-sky-300"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Buka Berkas</span>
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-500">Belum Ada</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Notes Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Catatan Verifikator (Dapat Dilihat Calon Siswa)
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Foto Kartu Keluarga terpotong, mohon unggah ulang lembar lengkap..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Action Decision Buttons */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ubah Keputusan Status:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusChange("verified")}
                  className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition text-center shadow-xs"
                >
                  Verifikasi Berkas
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusChange("accepted")}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition text-center shadow-xs"
                >
                  Luluskan Siswa
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusChange("revision_needed")}
                  className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition text-center shadow-xs"
                >
                  Minta Revisi
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusChange("rejected")}
                  className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition text-center shadow-xs"
                >
                  Tolak Berkas
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
