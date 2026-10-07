"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { appendRegistrationToSheet } from "@/lib/google-sheets";
import { PPDBStatus, Registration, Teacher } from "@/types/database";

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Email dan kata sandi wajib diisi." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: "Email atau kata sandi salah: " + error.message };
  }

  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function togglePeriodActive(periodId: string, currentStatus: boolean) {
  try {
    const supabase = await createClient();

    // If activating this period, deactivate all others first to ensure single active wave
    if (!currentStatus) {
      await supabase
        .from("ppdb_periods")
        .update({ is_active: false })
        .neq("id", periodId);
    }

    const { error } = await supabase
      .from("ppdb_periods")
      .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
      .eq("id", periodId);

    if (error) {
      return { success: false, message: "Gagal mengubah status gelombang: " + error.message };
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/periode");
    revalidatePath("/ppdb");
    return { success: true, newStatus: !currentStatus };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function updateRegistrationStatus(
  registrationId: string,
  newStatus: PPDBStatus,
  adminNotes?: string
) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("registrations")
      .update({
        status: newStatus,
        admin_notes: adminNotes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", registrationId);

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath("/admin/ppdb");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function forceSyncToGoogleSheets(registrationId: string) {
  try {
    const supabase = await createClient();

    const { data: reg, error } = await supabase
      .from("registrations")
      .select(`
        *,
        period:ppdb_periods(title)
      `)
      .eq("id", registrationId)
      .single();

    if (error || !reg) {
      return { success: false, message: "Pendaftar tidak ditemukan." };
    }

    const periodTitle = reg.period?.title || "PPDB 2027";
    const syncSuccess = await appendRegistrationToSheet(reg as Registration, periodTitle);

    if (syncSuccess) {
      await supabase
        .from("registrations")
        .update({ synced_to_sheets: true })
        .eq("id", registrationId);

      revalidatePath("/admin/ppdb");
      return { success: true, message: "Berhasil disinkronkan ke Google Sheets!" };
    } else {
      return {
        success: false,
        message: "Gagal menyambung ke Google Sheets. Periksa konfigurasi Google Service Account.",
      };
    }
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// -------------------------------------------------------------
// TEACHER MANAGEMENT SERVER ACTIONS (CRUD)
// -------------------------------------------------------------

export async function saveTeacherAction(data: {
  id?: string;
  full_name: string;
  nip?: string | null;
  role_title: string;
  subject?: string | null;
  photo_url?: string | null;
  order_index: number;
  is_active: boolean;
}) {
  try {
    const supabase = await createClient();

    const record = {
      full_name: data.full_name.trim(),
      nip: data.nip?.trim() || null,
      role_title: data.role_title.trim(),
      subject: data.subject?.trim() || null,
      photo_url: data.photo_url?.trim() || null,
      order_index: data.order_index,
      is_active: data.is_active,
    };

    if (data.id) {
      // UPDATE
      const { error } = await supabase
        .from("teachers")
        .update(record)
        .eq("id", data.id);

      if (error) {
        return { success: false, message: "Gagal memperbarui data: " + error.message };
      }
    } else {
      // INSERT
      const { error } = await supabase
        .from("teachers")
        .insert(record);

      if (error) {
        return { success: false, message: "Gagal menambahkan data guru: " + error.message };
      }
    }

    revalidatePath("/admin/guru");
    revalidatePath("/profil/guru");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message || "Kesalahan server." };
  }
}

export async function deleteTeacherAction(teacherId: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("teachers")
      .delete()
      .eq("id", teacherId);

    if (error) {
      return { success: false, message: "Gagal menghapus: " + error.message };
    }

    revalidatePath("/admin/guru");
    revalidatePath("/profil/guru");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message || "Kesalahan server." };
  }
}

export async function toggleTeacherActiveAction(teacherId: string, newStatus: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("teachers")
      .update({ is_active: newStatus })
      .eq("id", teacherId);

    if (error) {
      return { success: false, message: "Gagal mengubah status: " + error.message };
    }

    revalidatePath("/admin/guru");
    revalidatePath("/profil/guru");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message || "Kesalahan server." };
  }
}

export async function seedTeachersToSupabaseAction() {
  try {
    const supabase = await createClient();

    const officialTeachers = [
      {
        full_name: "Apriyani, S.Si., M.M.Pd.",
        nip: "19780512 200501 2 008",
        role_title: "Kepala Sekolah",
        subject: "Pimpinan Satuan Pendidikan",
        photo_url: "/guru/kepala_sekolah.jpg",
        order_index: 1,
        is_active: true,
      },
      {
        full_name: "Bambang Irawan, S.Pd., M.Pd.",
        nip: "19820315 200801 1 012",
        role_title: "Wakil Kepala Sekolah Bid. Kurikulum",
        subject: "Matematika Peminatan",
        photo_url: "/guru/bambang_irawan.jpg",
        order_index: 2,
        is_active: true,
      },
      {
        full_name: "Siti Rahmawati, S.Pd.",
        nip: "19840722 200902 2 005",
        role_title: "Wakil Kepala Sekolah Bid. Kesiswaan",
        subject: "Bahasa Indonesia",
        photo_url: "/guru/siti_rahmawati.jpg",
        order_index: 3,
        is_active: true,
      },
      {
        full_name: "Ahmad Fauzi, S.Pd.",
        nip: "19801105 200604 1 009",
        role_title: "Wakil Kepala Sekolah Bid. Sarpras",
        subject: "Fisika & Teknologi Informasi",
        photo_url: "/guru/ahmad_fauzi.jpg",
        order_index: 4,
        is_active: true,
      },
      {
        full_name: "Nurul Hidayah, S.Sos.",
        nip: "19860918 201101 2 014",
        role_title: "Wakil Kepala Sekolah Bid. Humas",
        subject: "Sosiologi",
        photo_url: "/guru/guru_wanita.jpg",
        order_index: 5,
        is_active: true,
      },
      {
        full_name: "Dedi Setiawan, S.Pd., Kons.",
        nip: "19881203 201402 1 003",
        role_title: "Guru Bimbingan Konseling (BK)",
        subject: "Layanan Konseling Siswa",
        photo_url: "/guru/guru_pria.jpg",
        order_index: 6,
        is_active: true,
      },
      {
        full_name: "Dra. Endang Sulastri",
        nip: "19750410 200003 2 004",
        role_title: "Guru Mata Pelajaran",
        subject: "Biologi",
        photo_url: "/guru/guru_wanita.jpg",
        order_index: 7,
        is_active: true,
      },
      {
        full_name: "Hendri Saputra, S.Pd.",
        nip: "19890214 201503 1 002",
        role_title: "Guru Mata Pelajaran",
        subject: "Kimia",
        photo_url: "/guru/guru_pria.jpg",
        order_index: 8,
        is_active: true,
      },
      {
        full_name: "Rina Kusuma Dewi, S.Pd.",
        nip: "19910520 201902 2 008",
        role_title: "Guru Mata Pelajaran",
        subject: "Bahasa Inggris",
        photo_url: "/guru/guru_wanita.jpg",
        order_index: 9,
        is_active: true,
      },
      {
        full_name: "Agus Pratama, S.Pd.",
        nip: "19870830 201101 1 007",
        role_title: "Guru Mata Pelajaran",
        subject: "Pendidikan Jasmani & Kesehatan (PJOK)",
        photo_url: "/guru/guru_pria.jpg",
        order_index: 10,
        is_active: true,
      },
      {
        full_name: "Wahyudi, S.E.",
        nip: "19850612 201001 1 015",
        role_title: "Kepala Tata Usaha (KTU)",
        subject: "Administrasi & Kepegawaian",
        photo_url: "/guru/guru_pria.jpg",
        order_index: 11,
        is_active: true,
      },
      {
        full_name: "Sri Mulyani, A.Md.",
        nip: "19900815 201602 2 011",
        role_title: "Staf Tata Usaha",
        subject: "Operator Dapodik & Kesiswaan",
        photo_url: "/guru/guru_wanita.jpg",
        order_index: 12,
        is_active: true,
      },
    ];

    // Bersihkan dulu jika ada data parsial untuk mencegah duplikasi
    await supabase.from("teachers").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const { error } = await supabase.from("teachers").insert(officialTeachers);
    if (error) {
      return { success: false, message: "Gagal memasukkan data guru: " + error.message };
    }

    revalidatePath("/admin/guru");
    revalidatePath("/profil/guru");
    return { success: true, count: officialTeachers.length };
  } catch (err: any) {
    return { success: false, message: err?.message || "Kesalahan server." };
  }
}

