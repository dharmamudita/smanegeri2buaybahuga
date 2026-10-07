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
    <div className="p-6 sm:p-10 space-y-6 max-w-6xl mx-auto">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Direktori Dewan Guru & Staf
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Kelola data dewan guru dan tenaga kependidikan yang tampil pada halaman profil publik.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchTeachers}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition shadow-2xs"
            title="Muat ulang data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Guru / Staf</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-600 hover:text-emerald-800 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Create/Edit Form (Modal-like) */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900">
              {editingTeacher ? `Perbarui Data: ${editingTeacher.full_name}` : "Tambah Data Guru / Staf Baru"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Lengkap Guru / Staf *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Dewi Lestari, S.Pd."
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                NIP (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: 19860410 201001 2 018"
                value={formData.nip}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Jabatan / Posisi *
              </label>
              <select
                value={formData.role_title}
                onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition"
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
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mata Pelajaran / Bidang (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Bahasa Indonesia"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Urutan Tampil di Portal
              </label>
              <input
                type="number"
                min={0}
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
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
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-5">#</th>
                <th className="py-3.5 px-5">Nama Lengkap</th>
                <th className="py-3.5 px-5">NIP</th>
                <th className="py-3.5 px-5">Jabatan</th>
                <th className="py-3.5 px-5">Mata Pelajaran</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    <span className="font-medium">Memuat data guru...</span>
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    Belum ada data guru atau staf. Silakan tambahkan melalui tombol di atas.
                  </td>
                </tr>
              ) : (
                teachers.map((teacher, idx) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-5 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900 text-sm">{teacher.full_name}</div>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-600">
                      {teacher.nip || "-"}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 font-semibold text-[10px] border border-blue-200/60">
                        {teacher.role_title}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 font-medium">
                      {teacher.subject || "-"}
                    </td>
                    <td className="py-3.5 px-5">
                      <button
                        onClick={() => handleToggleActive(teacher)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition cursor-pointer border ${
                          teacher.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {teacher.is_active ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditForm(teacher)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                          title="Edit Data"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
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
