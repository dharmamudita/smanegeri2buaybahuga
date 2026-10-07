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
  FileText,
  X
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
      const query = supabase
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

  // Handle CSV Export
  const handleExportCSV = () => {
    if (filteredList.length === 0) {
      alert("Tidak ada data calon siswa untuk diekspor.");
      return;
    }

    const headers = [
      "No. Registrasi",
      "Jalur Pendaftaran",
      "Nama Lengkap Siswa",
      "NISN",
      "NIK",
      "Jenis Kelamin",
      "Tempat Lahir",
      "Tanggal Lahir",
      "Agama",
      "Asal Sekolah",
      "No. WhatsApp Siswa",
      "Nama Orang Tua/Wali",
      "No. WhatsApp Orang Tua",
      "Alamat Lengkap",
      "Status Verifikasi",
      "URL Pas Foto",
      "URL Kartu Keluarga",
      "URL SKL Ijazah",
      "Waktu Mendaftar",
    ];

    const rows = filteredList.map((r) => [
      `"${r.reg_number}"`,
      `"${getTrackLabel(r.registration_track)}"`,
      `"${r.full_name.replace(/"/g, '""')}"`,
      `'${r.nisn}`,
      `'${r.nik}`,
      `"${r.gender}"`,
      `"${r.birth_place || ""}"`,
      `"${r.birth_date || ""}"`,
      `"${r.religion || ""}"`,
      `"${(r.school_origin || "").replace(/"/g, '""')}"`,
      `'${r.phone_number || ""}`,
      `"${(r.parent_name || "").replace(/"/g, '""')}"`,
      `'${r.parent_phone || ""}`,
      `"${(r.address || "").replace(/"/g, '""')}"`,
      `"${getStatusBadge(r.status).label}"`,
      `"${r.document_urls?.photo || ""}"`,
      `"${r.document_urls?.kk || ""}"`,
      `"${r.document_urls?.skl || ""}"`,
      `"${formatDateTime(r.created_at)}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Rekap_PPDB_SMAN2_BuayBahuga_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Data Calon Peserta Didik Baru
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Total {registrations.length} data calon siswa terdaftar di pangkalan data sekolah.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchRegistrations}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition border border-slate-200 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600" : "text-slate-500"}`} />
            <span>Muat Ulang</span>
          </button>
          
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor ke Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari nama siswa, NISN, atau no. registrasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 shadow-2xs"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 shadow-2xs"
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
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 shadow-2xs"
          >
            <option value="all">Semua Jalur Pendaftaran</option>
            <option value="zonasi">Zonasi</option>
            <option value="afirmasi">Afirmasi</option>
            <option value="prestasi">Prestasi</option>
            <option value="mutasi">Mutasi</option>
            <option value="reguler">Reguler</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-5">No. Registrasi</th>
                <th className="py-3.5 px-5">Nama Siswa</th>
                <th className="py-3.5 px-5">NISN / Asal Sekolah</th>
                <th className="py-3.5 px-5">Jalur</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Sync Sheets</th>
                <th className="py-3.5 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    <span className="font-medium text-xs">Memuat data pendaftar...</span>
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    Tidak ada data pendaftar yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const badge = getStatusBadge(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-5 font-mono font-bold text-blue-700">
                        {item.reg_number}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900 text-sm">{item.full_name}</div>
                        <div className="text-[11px] text-slate-500">
                          {item.gender} • {item.phone_number}
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-mono text-slate-700">{item.nisn}</div>
                        <div className="text-[11px] text-slate-500">{item.school_origin}</div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px] uppercase border border-slate-200">
                          {item.registration_track}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        {item.synced_to_sheets ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Tersinkron</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleManualSync(item.id)}
                            disabled={syncingId === item.id}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700 transition"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${syncingId === item.id ? "animate-spin" : ""}`} />
                            <span>Sync Ulang</span>
                          </button>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <button
                          onClick={() => {
                            setActiveModalReg(item);
                            setAdminNotes(item.admin_notes || "");
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="rounded-3xl bg-white border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-blue-700">
                  Verifikasi Berkas Calon Siswa
                </span>
                <h3 className="text-xl font-black text-slate-900">{activeModalReg.full_name}</h3>
              </div>
              <button
                onClick={() => setActiveModalReg(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
              <div>
                <span className="text-slate-400 font-medium">No. Registrasi:</span>
                <div className="font-mono font-bold text-blue-700 mt-0.5">{activeModalReg.reg_number}</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Jalur Pendaftaran:</span>
                <div className="font-bold text-slate-800 mt-0.5">{getTrackLabel(activeModalReg.registration_track)}</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">NISN / NIK:</span>
                <div className="font-mono text-slate-700 mt-0.5">{activeModalReg.nisn} / {activeModalReg.nik}</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Kontak WhatsApp:</span>
                <div className="text-slate-700 mt-0.5">{activeModalReg.phone_number} (Ortu: {activeModalReg.parent_phone})</div>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 font-medium">Alamat Lengkap:</span>
                <div className="text-slate-700 mt-0.5">{activeModalReg.address}</div>
              </div>
            </div>

            {/* Uploaded Documents Check */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pindaian Dokumen Prasyarat
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Pas Foto 3x4", url: activeModalReg.document_urls?.photo },
                  { label: "Kartu Keluarga", url: activeModalReg.document_urls?.kk },
                  { label: "SKL / Ijazah", url: activeModalReg.document_urls?.skl },
                ].map((doc, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-700 block">{doc.label}</span>
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 hover:text-blue-800 transition px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Buka Berkas</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Belum Diunggah</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Notes Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Catatan Verifikator (Dapat Dilihat Calon Siswa di Cek Status)
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Foto Kartu Keluarga kurang jelas, mohon perbaiki berkas saat verifikasi fisik..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition"
              />
            </div>

            {/* Action Decision Buttons */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ubah Keputusan Status Siswa:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusChange("verified")}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition text-center shadow-2xs disabled:opacity-50"
                >
                  Verifikasi Berkas
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusChange("accepted")}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition text-center shadow-2xs disabled:opacity-50"
                >
                  Luluskan Siswa
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusChange("revision_needed")}
                  className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition text-center shadow-2xs disabled:opacity-50"
                >
                  Minta Revisi
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusChange("rejected")}
                  className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition text-center shadow-2xs disabled:opacity-50"
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
