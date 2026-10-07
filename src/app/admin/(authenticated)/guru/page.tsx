"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
  CheckCircle,
  Sparkles,
  Database,
  Copy,
  ExternalLink,
  Camera,
  Radio,
  BookOpen,
  Upload,
  CloudUpload
} from "lucide-react";
import { Teacher } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { 
  saveTeacherAction, 
  deleteTeacherAction, 
  toggleTeacherActiveAction, 
  seedTeachersToSupabaseAction 
} from "@/app/actions/admin";

const PHOTO_PRESETS = [
  {
    label: "Ibu Kepala Sekolah",
    url: "/guru/kepala_sekolah.jpg",
    subtext: "Ibu Apriyani",
  },
  {
    label: "Waka Kurikulum",
    url: "/guru/bambang_irawan.jpg",
    subtext: "Pak Bambang Irawan",
  },
  {
    label: "Waka Kesiswaan",
    url: "/guru/siti_rahmawati.jpg",
    subtext: "Bu Siti Rahmawati",
  },
  {
    label: "Waka Sarpras",
    url: "/guru/ahmad_fauzi.jpg",
    subtext: "Pak Ahmad Fauzi",
  },
  {
    label: "Dewan Guru Wanita",
    url: "/guru/guru_wanita.jpg",
    subtext: "Potret Resmi Wanita",
  },
  {
    label: "Dewan Guru Pria",
    url: "/guru/guru_pria.jpg",
    subtext: "Potret Resmi Pria",
  },
];

const SQL_MIGRATION_SNIPPET = `-- Salin dan jalankan di Supabase Dashboard -> SQL Editor:
ALTER PUBLICATION supabase_realtime ADD TABLE teachers;
ALTER PUBLICATION supabase_realtime ADD TABLE ppdb_periods;
ALTER PUBLICATION supabase_realtime ADD TABLE registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;

DROP POLICY IF EXISTS "Public read active teachers" ON teachers;
DROP POLICY IF EXISTS "Admin full access teachers" ON teachers;
DROP POLICY IF EXISTS "Allow public read teachers" ON teachers;
DROP POLICY IF EXISTS "Allow admin crud teachers" ON teachers;

CREATE POLICY "Allow public read teachers" ON teachers FOR SELECT USING (true);
CREATE POLICY "Allow admin crud teachers" ON teachers FOR ALL USING (true) WITH CHECK (true);

-- BUCKET CLOUD STORAGE SUPABASE UNTUK FOTO GURU
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true) ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "Public can view photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload photos" ON storage.objects;
CREATE POLICY "Public can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
CREATE POLICY "Public can upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos');

DELETE FROM teachers;
INSERT INTO teachers (full_name, nip, role_title, subject, photo_url, order_index, is_active) VALUES
('Apriyani, S.Si., M.M.Pd.', '19780512 200501 2 008', 'Kepala Sekolah', 'Pimpinan Satuan Pendidikan', '/guru/kepala_sekolah.jpg', 1, true),
('Bambang Irawan, S.Pd., M.Pd.', '19820315 200801 1 012', 'Wakil Kepala Sekolah Bid. Kurikulum', 'Matematika Peminatan', '/guru/bambang_irawan.jpg', 2, true),
('Siti Rahmawati, S.Pd.', '19840722 200902 2 005', 'Wakil Kepala Sekolah Bid. Kesiswaan', 'Bahasa Indonesia', '/guru/siti_rahmawati.jpg', 3, true),
('Ahmad Fauzi, S.Pd.', '19801105 200604 1 009', 'Wakil Kepala Sekolah Bid. Sarpras', 'Fisika & Teknologi Informasi', '/guru/ahmad_fauzi.jpg', 4, true),
('Nurul Hidayah, S.Sos.', '19860918 201101 2 014', 'Wakil Kepala Sekolah Bid. Humas', 'Sosiologi', '/guru/guru_wanita.jpg', 5, true),
('Dedi Setiawan, S.Pd., Kons.', '19881203 201402 1 003', 'Guru Bimbingan Konseling (BK)', 'Layanan Konseling Siswa', '/guru/guru_pria.jpg', 6, true),
('Dra. Endang Sulastri', '19750410 200003 2 004', 'Guru Mata Pelajaran', 'Biologi', '/guru/guru_wanita.jpg', 7, true),
('Hendri Saputra, S.Pd.', '19890214 201503 1 002', 'Guru Mata Pelajaran', 'Kimia', '/guru/guru_pria.jpg', 8, true),
('Rina Kusuma Dewi, S.Pd.', '19910520 201902 2 008', 'Guru Mata Pelajaran', 'Bahasa Inggris', '/guru/guru_wanita.jpg', 9, true),
('Agus Pratama, S.Pd.', '19870830 201101 1 007', 'Guru Mata Pelajaran', 'Pendidikan Jasmani & Kesehatan (PJOK)', '/guru/guru_pria.jpg', 10, true),
('Wahyudi, S.E.', '19850612 201001 1 015', 'Kepala Tata Usaha (KTU)', 'Administrasi & Kepegawaian', '/guru/guru_pria.jpg', 11, true),
('Sri Mulyani, A.Md.', '19900815 201602 2 011', 'Staf Tata Usaha', 'Operator Dapodik & Kesiswaan', '/guru/guru_wanita.jpg', 12, true);

-- AKUN ADMIN SUPABASE AUTH
CREATE EXTENSION IF NOT EXISTS pgcrypto;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@sman2buaybahuga.sch.id') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'admin@sman2buaybahuga.sch.id', crypt('AdminSmanda2027!', gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', '{"full_name":"Administrator SMAN 2 Buay Bahuga"}',
      now(), now()
    );
  ELSE
    UPDATE auth.users 
    SET encrypted_password = crypt('AdminSmanda2027!', gen_salt('bf')), email_confirmed_at = now()
    WHERE email = 'admin@sman2buaybahuga.sch.id';
  END IF;
END $$;`;

export default function AdminGuruPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadSuccessNote, setUploadSuccessNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    full_name: "",
    nip: "",
    role_title: "Guru Mata Pelajaran",
    subject: "",
    photo_url: "/guru/guru_pria.jpg",
    order_index: 1,
    is_active: true,
  });

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
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

    // Supabase Realtime Subscription for instant live sync
    const supabase = createClient();
    const channel = supabase
      .channel("admin-realtime-teachers")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teachers",
        },
        () => {
          fetchTeachers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const resetForm = () => {
    setFormData({
      full_name: "",
      nip: "",
      role_title: "Guru Mata Pelajaran",
      subject: "",
      photo_url: "/guru/guru_pria.jpg",
      order_index: teachers.length + 1,
      is_active: true,
    });
    setEditingTeacher(null);
    setErrorMsg("");
    setUploadSuccessNote("");
  };

  const openEditForm = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      full_name: teacher.full_name,
      nip: teacher.nip || "",
      role_title: teacher.role_title,
      subject: teacher.subject || "",
      photo_url: teacher.photo_url || "/guru/guru_pria.jpg",
      order_index: teacher.order_index,
      is_active: teacher.is_active,
    });
    setShowForm(true);
    setErrorMsg("");
    setUploadSuccessNote("");
  };

  // Upload handler dari perangkat ke Cloud Storage
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran berkas melebihi batas maksimum 5MB. Silakan pilih foto lain.");
      return;
    }

    // Buat pratinjau lokal instan
    const localPreview = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, photo_url: localPreview }));
    setUploadingPhoto(true);
    setUploadSuccessNote("");

    try {
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("folder", "guru");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, photo_url: data.url }));
        const providerText =
          data.provider === "supabase_storage"
            ? "✓ Foto berhasil diunggah ke Supabase Cloud Storage"
            : data.provider === "cloudinary"
            ? "✓ Foto berhasil diunggah ke Cloudinary Cloud"
            : "✓ Foto berhasil disimpan ke Server Storage";
        setUploadSuccessNote(providerText);
        setTimeout(() => setUploadSuccessNote(""), 6000);
      } else {
        alert("Gagal mengunggah foto: " + (data.message || "Kesalahan server."));
      }
    } catch (err: any) {
      alert("Gagal mengunggah foto: " + err.message);
    } finally {
      setUploadingPhoto(false);
    }
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
      const payload = {
        id: editingTeacher ? editingTeacher.id : undefined,
        full_name: formData.full_name.trim(),
        nip: formData.nip.trim() || null,
        role_title: formData.role_title.trim(),
        subject: formData.subject.trim() || null,
        photo_url: formData.photo_url.trim() || null,
        order_index: Number(formData.order_index) || 1,
        is_active: formData.is_active,
      };

      const res = await saveTeacherAction(payload);

      if (!res.success) {
        if (res.message?.includes("policy") || res.message?.includes("42501")) {
          setErrorMsg(res.message + " — Silakan aktifkan izin RLS melalui menu SQL.");
          setShowSqlModal(true);
        } else {
          setErrorMsg(res.message || "Gagal menyimpan data guru.");
        }
        return;
      }

      setSuccessMsg(
        editingTeacher
          ? `Data ${formData.full_name} berhasil diperbarui.`
          : `${formData.full_name} berhasil ditambahkan ke direktori guru.`
      );
      setShowForm(false);
      resetForm();
      fetchTeachers();
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kendala pada server.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (teacher: Teacher) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${teacher.full_name}" dari direktori guru?`)) {
      return;
    }

    try {
      const res = await deleteTeacherAction(teacher.id);
      if (!res.success) {
        alert("Gagal menghapus: " + res.message);
        return;
      }

      setTeachers((prev) => prev.filter((t) => t.id !== teacher.id));
      setSuccessMsg(`"${teacher.full_name}" telah dihapus.`);
    } catch (err: any) {
      alert(err.message || "Gagal menghapus data.");
    }
  };

  const handleToggleActive = async (teacher: Teacher) => {
    try {
      const newStatus = !teacher.is_active;
      const res = await toggleTeacherActiveAction(teacher.id, newStatus);
      if (res.success) {
        setTeachers((prev) =>
          prev.map((t) => (t.id === teacher.id ? { ...t, is_active: newStatus } : t))
        );
      } else {
        alert("Gagal mengubah status: " + res.message);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSeedTeachers = async () => {
    setSeeding(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await seedTeachersToSupabaseAction();
      if (res.success) {
        setSuccessMsg(`Berhasil memasukkan ${res.count} data dewan guru ke Supabase!`);
        fetchTeachers();
      } else {
        setErrorMsg(res.message || "Gagal sinkronisasi data.");
        if (res.message?.includes("policy") || res.message?.includes("42501")) {
          setShowSqlModal(true);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal sinkronisasi.");
    } finally {
      setSeeding(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_MIGRATION_SNIPPET);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-6xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              Realtime Supabase Aktif
            </span>
            <span className="text-xs text-slate-400 font-medium">• Total: {teachers.length} Guru</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Direktori Dewan Guru & Staf
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Kelola data profil, jabatan, dan pas foto resmi seluruh dewan guru & tenaga kependidikan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowSqlModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition shadow-2xs"
            title="Bantuan SQL Supabase"
          >
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Panduan SQL</span>
          </button>
          
          <button
            onClick={fetchTeachers}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition shadow-2xs"
            title="Muat ulang data live"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>
          
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Guru Baru</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-3 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-600 hover:text-emerald-800 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg("")} className="text-rose-600 hover:text-rose-800 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Empty State Banner with 1-Click Sync */}
      {!loading && teachers.length === 0 && (
        <div className="rounded-3xl bg-blue-50/70 border border-blue-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 mb-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              Sinkronisasi Instan
            </div>
            <h3 className="text-base font-extrabold text-blue-950">
              Database Guru di Supabase Masih Kosong
            </h3>
            <p className="text-xs text-blue-800/80 max-w-xl">
              Tersedia 12 profil dewan guru resmi SMA Negeri 2 Buay Bahuga lengkap dengan pas foto resmi resolusi tinggi siap dimasukkan ke database Supabase Anda.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleSeedTeachers}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition shadow-sm shadow-blue-700/20 disabled:opacity-50"
            >
              {seeding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memasukkan ke Supabase...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Masukkan 12 Guru Resmi ke Supabase</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowSqlModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 transition"
            >
              Jalankan via SQL Editor
            </button>
          </div>
        </div>
      )}

      {/* CRUD Form (Add / Edit Modal-style Card) */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">Formulir Data</span>
              <h3 className="text-lg font-black text-slate-900">
                {editingTeacher ? `Perbarui Data: ${editingTeacher.full_name}` : "Tambah Guru / Staf Baru"}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Photo Preview, Upload dari Perangkat & Presets */}
            <div className="md:col-span-1 space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Pas Foto Guru *
              </label>

              {/* Photo Preview Avatar */}
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <div className="relative w-28 h-28 rounded-full ring-4 ring-white shadow-md overflow-hidden bg-slate-200 group">
                  {formData.photo_url ? (
                    <Image
                      src={formData.photo_url}
                      alt="Preview Foto"
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <GraduationCap className="w-10 h-10" />
                    </div>
                  )}
                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-2xs flex flex-col items-center justify-center text-white">
                      <Loader2 className="w-6 h-6 animate-spin mb-1" />
                      <span className="text-[10px] font-bold">Mengunggah...</span>
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-2">
                  Pratinjau Foto Profil
                </span>
              </div>

              {/* UPLOAD LANGSUNG DARI PERANGKAT (KOMPUTER / HP) */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                  Unggah dari Perangkat (Cloud):
                </span>
                <label
                  className={`w-full p-3.5 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition ${
                    uploadingPhoto
                      ? "bg-blue-50/70 border-blue-400"
                      : "bg-white border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 shadow-2xs"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="hidden"
                    disabled={uploadingPhoto}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                  {uploadingPhoto ? (
                    <div className="flex items-center gap-2 text-blue-700 py-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs font-bold">Menyimpan ke Cloud Storage...</span>
                    </div>
                  ) : (
                    <>
                      <div className="p-2 rounded-xl bg-blue-50 text-blue-700 mb-1">
                        <CloudUpload className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        Pilih Berkas Foto
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        JPG, PNG, atau WebP (Maks. 5MB)
                      </span>
                    </>
                  )}
                </label>

                {uploadSuccessNote && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{uploadSuccessNote}</span>
                  </div>
                )}
              </div>

              {/* Preset Buttons */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Atau Gunakan Foto Preset Resmi:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {PHOTO_PRESETS.map((preset) => {
                    const isSelected = formData.photo_url === preset.url;
                    return (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, photo_url: preset.url });
                          setUploadSuccessNote("");
                        }}
                        className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition ${
                          isSelected
                            ? "bg-blue-50 border-blue-600 ring-2 ring-blue-100"
                            : "bg-white border-slate-200 hover:bg-slate-100/70"
                        }`}
                      >
                        <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-slate-200">
                          <Image
                            src={preset.url}
                            alt={preset.label}
                            width={28}
                            height={28}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold text-slate-800 truncate">
                            {preset.label}
                          </div>
                          <div className="text-[9px] text-slate-400 truncate">
                            {preset.subtext}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Photo URL Input */}
              <div className="space-y-1 pt-2 border-t border-slate-200/60">
                <label className="block text-[10px] font-bold text-slate-600">
                  URL Tautan Foto (Supabase/Cloudinary/Web):
                </label>
                <input
                  type="text"
                  placeholder="https://... atau /guru/..."
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Right Column: Teacher Details Form */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Apriyani, S.Si., M.M.Pd."
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    NIP (Nomor Induk Pegawai)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 19780512 200501 2 008"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Jabatan Struktural *
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
                    <option value="Guru Bimbingan Konseling (BK)">Guru Bimbingan Konseling (BK)</option>
                    <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
                    <option value="Kepala Tata Usaha (KTU)">Kepala Tata Usaha (KTU)</option>
                    <option value="Staf Tata Usaha">Staf Tata Usaha</option>
                    <option value="Operator Dapodik & Kesiswaan">Operator Dapodik & Kesiswaan</option>
                    <option value="Pustakawan">Pustakawan</option>
                    <option value="Laboran">Laboran</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mata Pelajaran / Bidang Tugas
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Matematika Peminatan"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nomor Urut Tampil
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center gap-3 pt-2">
                <label className="text-xs font-bold text-slate-700">Status Aktif di Portal:</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                    formData.is_active
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${formData.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                  {formData.is_active ? "Aktif (Tampil Publik)" : "Nonaktif (Disembunyikan)"}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
                  disabled={saving || uploadingPhoto}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan ke Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingTeacher ? "Perbarui Data Guru" : "Simpan Guru ke Database"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Teachers Directory Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Daftar Dewan Guru Terdaftar di Supabase
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Diperbarui secara realtime • Klik edit untuk mengganti foto atau identitas guru
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4 text-center w-12">#</th>
                <th className="py-3.5 px-4 w-16 text-center">Foto</th>
                <th className="py-3.5 px-5">Nama Lengkap & NIP</th>
                <th className="py-3.5 px-5">Jabatan</th>
                <th className="py-3.5 px-5">Mata Pelajaran</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    <span className="font-medium">Menghubungkan ke Supabase & memuat direktori guru...</span>
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">Belum ada data guru di database Supabase</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Klik tombol &ldquo;Masukkan 12 Guru Resmi ke Supabase&rdquo; di atas untuk mengisi data otomatis.
                    </p>
                  </td>
                </tr>
              ) : (
                teachers.map((teacher, idx) => {
                  const isLeader =
                    teacher.role_title.toLowerCase().includes("kepala") ||
                    teacher.role_title.toLowerCase().includes("wakil");

                  return (
                    <tr key={teacher.id} className="hover:bg-slate-50/70 transition">
                      
                      {/* Urutan */}
                      <td className="py-3.5 px-4 font-mono text-center text-slate-400">
                        {teacher.order_index || idx + 1}
                      </td>

                      {/* Foto Avatar */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="relative w-10 h-10 mx-auto rounded-full ring-2 ring-slate-200 overflow-hidden bg-slate-100 shadow-2xs">
                          {teacher.photo_url ? (
                            <Image
                              src={teacher.photo_url}
                              alt={teacher.full_name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <GraduationCap className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Nama & NIP */}
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{teacher.full_name}</span>
                          {isLeader && (
                            <span className="p-0.5 rounded bg-amber-100 text-amber-800 text-[10px]" title="Pimpinan">
                              <Sparkles className="w-3 h-3 inline" />
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-slate-400 text-[11px] mt-0.5">
                          {teacher.nip ? `NIP. ${teacher.nip}` : "NIP: -"}
                        </div>
                      </td>

                      {/* Jabatan */}
                      <td className="py-3.5 px-5">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                            isLeader
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          {teacher.role_title}
                        </span>
                      </td>

                      {/* Mapel */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{teacher.subject || "-"}</span>
                        </div>
                      </td>

                      {/* Status Aktif */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(teacher)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold transition cursor-pointer border ${
                            teacher.is_active
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                          }`}
                          title="Klik untuk mengubah status aktif/nonaktif"
                        >
                          {teacher.is_active ? "Aktif" : "Nonaktif"}
                        </button>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditForm(teacher)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                            title="Edit Data Guru & Ganti Foto"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(teacher)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
                            title="Hapus Guru"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SQL Migration & Supabase Help Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Panduan Memasukkan 12 Guru ke Supabase
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bila tombol sinkronisasi terhambat oleh izin RLS Supabase, jalankan query ini sekali di SQL Editor.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                Langkah-langkah cepat di Dashboard Supabase:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 font-medium">
                <li>Buka dashboard Supabase project Anda (<span className="font-mono text-blue-600">dggoldhvnvmwamjxnxrb</span>).</li>
                <li>Pilih menu <strong>SQL Editor</strong> di bilah navigasi kiri.</li>
                <li>Klik tombol <strong>&ldquo;New query&rdquo;</strong>, lalu salin dan tempel query SQL di bawah ini.</li>
                <li>Klik tombol hijau <strong>&ldquo;Run&rdquo;</strong> (atau tekan Ctrl+Enter).</li>
                <li>Selesai! Seluruh 12 data guru beserta pas fotonya langsung terisi & realtime aktif.</li>
              </ol>
            </div>

            {/* SQL Code Block */}
            <div className="relative rounded-2xl bg-slate-900 text-slate-200 p-4 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-60 border border-slate-800">
              <pre>{SQL_MIGRATION_SNIPPET}</pre>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                File juga tersimpan di <span className="font-mono text-slate-600">supabase/migrations/02_teachers_and_realtime.sql</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition shadow-xs"
                >
                  {copiedSql ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Query SQL</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSqlModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
