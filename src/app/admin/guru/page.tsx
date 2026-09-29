"use client";

import { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  RefreshCw, 
  Save, 
  X, 
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Teacher } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

export default function AdminGuruPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    full_name: "",
    nip: "",
    role_title: "Guru Mata Pelajaran",
    subject: "",
    photo_url: "",
    order_index: 0,
    is_active: true,
  });

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("teachers")
        .select("*")
        .order("order_index", { ascending: true });

      if (data) {
        setTeachers(data as Teacher[]);
      }
    } catch (err) {
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const resetForm = () => {
    setFormData({
      full_name: "",
      nip: "",
      role_title: "Guru Mata Pelajaran",
      subject: "",
      photo_url: "",
      order_index: teachers.length + 1,
      is_active: true,
    });
    setEditingTeacher(null);
    setErrorMsg("");
  };

  const openEditForm = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      full_name: teacher.full_name,
      nip: teacher.nip || "",
      role_title: teacher.role_title,
      subject: teacher.subject || "",
      photo_url: teacher.photo_url || "",
      order_index: teacher.order_index,
      is_active: teacher.is_active,
    });
    setShowForm(true);
    setErrorMsg("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.full_name.trim() || !formData.role_title.trim()) {
      setErrorMsg("Nama lengkap dan jabatan wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();

      const record = {
        full_name: formData.full_name.trim(),
        nip: formData.nip.trim() || null,
        role_title: formData.role_title.trim(),
        subject: formData.subject.trim() || null,
        photo_url: formData.photo_url.trim() || null,
        order_index: formData.order_index,
        is_active: formData.is_active,
      };

      if (editingTeacher) {
        // UPDATE
        const { error } = await supabase
          .from("teachers")
          .update(record)
          .eq("id", editingTeacher.id);

        if (error) {
          setErrorMsg("Gagal memperbarui data: " + error.message);
          return;
        }

        setTeachers((prev) =>
          prev.map((t) => (t.id === editingTeacher.id ? { ...t, ...record } : t))
        );
        setSuccessMsg(`Data ${record.full_name} berhasil diperbarui.`);
      } else {
        // INSERT
        const { data, error } = await supabase
          .from("teachers")
          .insert(record)
          .select()
          .single();

        if (error) {
          setErrorMsg("Gagal menambahkan guru: " + error.message);
          return;
        }

        if (data) {
          setTeachers((prev) => [...prev, data as Teacher]);
          setSuccessMsg(`${record.full_name} berhasil ditambahkan ke direktori.`);
        }
      }

      setShowForm(false);
      resetForm();
    } catch (err: any) {
      setErrorMsg(err.message || "Kesalahan server.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (teacher: Teacher) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data ${teacher.full_name} dari direktori?`)) {
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("teachers")
        .delete()
        .eq("id", teacher.id);

      if (error) {
        alert("Gagal menghapus: " + error.message);
        return;
      }

      setTeachers((prev) => prev.filter((t) => t.id !== teacher.id));
      setSuccessMsg(`${teacher.full_name} telah dihapus dari direktori.`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleActive = async (teacher: Teacher) => {
    try {
      const supabase = createClient();
      const newStatus = !teacher.is_active;

      const { error } = await supabase
        .from("teachers")
        .update({ is_active: newStatus })
        .eq("id", teacher.id);

      if (!error) {
        setTeachers((prev) =>
          prev.map((t) => (t.id === teacher.id ? { ...t, is_active: newStatus } : t))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Manajemen Dewan Guru & Staf
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Tambah, perbarui, atau nonaktifkan data pendidik dan tenaga kependidikan.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchTeachers}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-md shadow-sky-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Guru / Staf</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-400 hover:text-emerald-200">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Create/Edit Form (Modal-like) */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="rounded-3xl bg-slate-800/60 border border-slate-700 p-6 sm:p-8 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">
              {editingTeacher ? `Edit: ${editingTeacher.full_name}` : "Tambah Data Guru / Staf Baru"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Nama Lengkap Guru / Staf *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Dewi Lestari, S.Pd."
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                NIP (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: 19860410 201001 2 018"
                value={formData.nip}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Jabatan / Posisi *
              </label>
              <select
                value={formData.role_title}
                onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Kepala Sekolah">Kepala Sekolah</option>
                <option value="Wakil Kepala Sekolah Bid. Kurikulum">Waka Kurikulum</option>
                <option value="Wakil Kepala Sekolah Bid. Kesiswaan">Waka Kesiswaan</option>
                <option value="Wakil Kepala Sekolah Bid. Sarpras">Waka Sarana Prasarana</option>
                <option value="Wakil Kepala Sekolah Bid. Humas">Waka Hubungan Masyarakat</option>
                <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
                <option value="Guru Bimbingan Konseling (BK)">Guru Bimbingan Konseling</option>
                <option value="Kepala Tata Usaha (KTU)">Kepala Tata Usaha</option>
                <option value="Staf Tata Usaha">Staf Tata Usaha</option>
                <option value="Pustakawan">Pustakawan</option>
                <option value="Penjaga Sekolah">Penjaga Sekolah</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Mata Pelajaran / Bidang (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Bahasa Indonesia"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Urutan Tampil di Portal
              </label>
              <input
                type="number"
                min={0}
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-md shadow-sky-600/20 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{editingTeacher ? "Perbarui Data" : "Simpan Guru Baru"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Teachers Table */}
      <div className="rounded-3xl bg-slate-800/40 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-700 text-slate-400 uppercase tracking-wider font-semibold bg-slate-800/60">
              <tr>
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Nama Lengkap</th>
                <th className="py-3.5 px-4">NIP</th>
                <th className="py-3.5 px-4">Jabatan</th>
                <th className="py-3.5 px-4">Mata Pelajaran</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-400" />
                    <span>Memuat data guru...</span>
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Belum ada data guru atau staf. Silakan tambahkan.
                  </td>
                </tr>
              ) : (
                teachers.map((teacher, idx) => (
                  <tr key={teacher.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{teacher.full_name}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {teacher.nip || "-"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-700 text-slate-200 font-semibold text-[10px]">
                        {teacher.role_title}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {teacher.subject || "-"}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(teacher)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                          teacher.is_active
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900"
                            : "bg-slate-800 text-slate-500 border border-slate-700 hover:bg-slate-700"
                        }`}
                      >
                        {teacher.is_active ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditForm(teacher)}
                          className="p-1.5 rounded-lg bg-sky-600/20 text-sky-400 hover:bg-sky-600/30 transition"
                          title="Edit Data"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher)}
                          className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 transition"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
