"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { appendRegistrationToSheet } from "@/lib/google-sheets";
import { PPDBStatus, Registration } from "@/types/database";

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
