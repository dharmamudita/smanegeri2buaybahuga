"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { generateRegNumber } from "@/lib/utils";
import { appendRegistrationToSheet } from "@/lib/google-sheets";
import { PPDBTrack, Registration } from "@/types/database";

export interface RegisterFormData {
  periodId: string;
  periodTitle: string;
  registrationTrack: PPDBTrack;
  fullName: string;
  nisn: string;
  nik: string;
  gender: "Laki-laki" | "Perempuan";
  birthPlace: string;
  birthDate: string;
  religion: string;
  schoolOrigin: string;
  phoneNumber: string;
  parentName: string;
  parentPhone: string;
  address: string;
  documentUrls: {
    photo?: string;
    kk?: string;
    skl?: string;
    birthCert?: string;
    achievement?: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  regNumber?: string;
  data?: any;
}

export async function submitRegistration(formData: RegisterFormData): Promise<RegisterResponse> {
  try {
    // 1. Basic validation
    if (!formData.fullName || !formData.nisn || !formData.nik || !formData.periodId) {
      return {
        success: false,
        message: "Harap lengkapi semua kolom wajib (Nama, NISN, NIK, dan Periode).",
      };
    }

    if (formData.nisn.length !== 10) {
      return {
        success: false,
        message: "Format NISN harus tepat 10 digit angka.",
      };
    }

    if (formData.nik.length !== 16) {
      return {
        success: false,
        message: "Format NIK harus tepat 16 digit angka.",
      };
    }

    const supabase = await createClient();

    // 2. Check for duplicate NISN in the same period
    const { data: existingStudent } = await supabase
      .from("registrations")
      .select("id, reg_number")
      .eq("period_id", formData.periodId)
      .eq("nisn", formData.nisn)
      .maybeSingle();

    if (existingStudent) {
      return {
        success: false,
        message: `NISN ${formData.nisn} sudah pernah didaftarkan pada gelombang ini dengan nomor registrasi ${existingStudent.reg_number}. Silakan gunakan menu Cek Status.`,
      };
    }

    // 3. Generate Unique Registration Number
    const regNumber = generateRegNumber("2027/2028");

    // 4. Insert into Supabase registrations table
    const newRecord = {
      period_id: formData.periodId,
      reg_number: regNumber,
      full_name: formData.fullName.trim(),
      nisn: formData.nisn.trim(),
      nik: formData.nik.trim(),
      gender: formData.gender,
      birth_place: formData.birthPlace.trim(),
      birth_date: formData.birthDate,
      religion: formData.religion,
      school_origin: formData.schoolOrigin.trim(),
      phone_number: formData.phoneNumber.trim(),
      parent_name: formData.parentName.trim(),
      parent_phone: formData.parentPhone.trim(),
      address: formData.address.trim(),
      registration_track: formData.registrationTrack,
      document_urls: formData.documentUrls,
      status: "pending" as const,
      synced_to_sheets: false,
    };

    const { data: inserted, error: insertError } = await supabase
      .from("registrations")
      .insert(newRecord)
      .select()
      .single();

    if (insertError) {
      console.error("[PPDB Action] Database insert error:", insertError);
      return {
        success: false,
        message: "Terjadi kendala saat menyimpan pendaftaran. Silakan coba beberapa saat lagi.",
      };
    }

    // 5. Asynchronous sync to Google Sheets (Fail-safe)
    try {
      const syncSuccess = await appendRegistrationToSheet(
        inserted as Registration,
        formData.periodTitle || "PPDB 2027"
      );

      if (syncSuccess) {
        await supabase
          .from("registrations")
          .update({ synced_to_sheets: true })
          .eq("id", inserted.id);
      }
    } catch (sheetErr) {
      console.error("[PPDB Action] Non-blocking sheet sync error:", sheetErr);
    }

    return {
      success: true,
      message: "Pendaftaran berhasil dikirim!",
      regNumber: regNumber,
      data: inserted,
    };
  } catch (err: any) {
    console.error("[PPDB Action] Server error:", err);
    return {
      success: false,
      message: "Terjadi kesalahan internal server: " + (err?.message || "Unknown error"),
    };
  }
}

export async function checkRegistrationStatus(identifier: string, birthDate: string) {
  try {
    const supabase = await createClient();

    // Query either by reg_number or nisn AND birth_date for privacy security
    const cleanId = identifier.trim();
    const { data, error } = await supabase
      .from("registrations")
      .select(`
        *,
        period:ppdb_periods(title, academic_year, announcement_date)
      `)
      .or(`reg_number.eq.${cleanId},nisn.eq.${cleanId}`)
      .eq("birth_date", birthDate)
      .maybeSingle();

    if (error) {
      console.error("[CheckStatus] Query error:", error);
      return { success: false, message: "Terjadi kendala saat mencari data pendaftar." };
    }

    if (!data) {
      return {
        success: false,
        message: "Data pendaftaran tidak ditemukan. Pastikan Nomor Pendaftaran/NISN dan Tanggal Lahir sesuai.",
      };
    }

    return { success: true, registration: data };
  } catch (err: any) {
    return { success: false, message: "Kesalahan server saat memeriksa status." };
  }
}
