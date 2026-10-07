import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "teachers";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Tidak ada berkas yang diunggah." },
        { status: 400 }
      );
    }

    // Validasi tipe berkas gambar
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Format berkas tidak didukung. Harap unggah foto berekstensi JPG, PNG, atau WebP.",
        },
        { status: 400 }
      );
    }

    // Batasan ukuran maksimum 5MB
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { success: false, message: "Ukuran berkas terlalu besar. Maksimum 5MB." },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const timestamp = Date.now();
    const cleanFileName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const finalFileName = `${timestamp}_${cleanFileName}.${ext}`;

    // -----------------------------------------------------------------
    // 1. COBA UNGGAH KE SUPABASE STORAGE (BUCKET: photos)
    // -----------------------------------------------------------------
    try {
      const supabase = await createClient();
      const storagePath = `${folder}/${finalFileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("photos")
        .upload(storagePath, fileBuffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from("photos")
          .getPublicUrl(storagePath);

        if (publicUrlData?.publicUrl) {
          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            provider: "supabase_storage",
            message: "Foto berhasil disimpan ke Supabase Cloud Storage.",
          });
        }
      }
    } catch (storageErr) {
      // Lanjutkan ke fallback Cloudinary / Local
      console.warn("Supabase Storage upload fallback:", storageErr);
    }

    // -----------------------------------------------------------------
    // 2. COBA UNGGAH KE CLOUDINARY (JIKA TERSEDIA DENGAN TIMEOUT 4s)
    // -----------------------------------------------------------------
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const cloudinaryTimestamp = Math.round(timestamp / 1000);
        const cloudinaryFolder = `smanda/${folder}`;
        const strToSign = `folder=${cloudinaryFolder}&timestamp=${cloudinaryTimestamp}${apiSecret}`;
        const signature = crypto.createHash("sha1").update(strToSign).digest("hex");

        const cldFormData = new FormData();
        const blob = new Blob([fileBuffer], { type: file.type });
        cldFormData.append("file", blob, finalFileName);
        cldFormData.append("api_key", apiKey);
        cldFormData.append("timestamp", cloudinaryTimestamp.toString());
        cldFormData.append("folder", cloudinaryFolder);
        cldFormData.append("signature", signature);

        const cldRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: cldFormData,
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);

        if (cldRes.ok) {
          const cldData = await cldRes.json();
          if (cldData.secure_url) {
            return NextResponse.json({
              success: true,
              url: cldData.secure_url,
              provider: "cloudinary",
              message: "Foto berhasil diunggah ke Cloudinary Cloud Storage.",
            });
          }
        }
      } catch (cldErr) {
        console.warn("Cloudinary fallback to local upload:", cldErr);
      }
    }

    // -----------------------------------------------------------------
    // 3. FALLBACK AMAN: SIMPAN KE PUBLIC UPLOADS SERVER
    // -----------------------------------------------------------------
    const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
    await fs.mkdir(uploadsDir, { recursive: true });

    const localFilePath = path.join(uploadsDir, finalFileName);
    await fs.writeFile(localFilePath, fileBuffer);

    const publicUrl = `/uploads/${folder}/${finalFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      provider: "server_storage",
      message: "Foto berhasil disimpan ke Server Storage.",
    });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Terjadi kesalahan saat memproses unggahan foto.",
      },
      { status: 500 }
    );
  }
}
