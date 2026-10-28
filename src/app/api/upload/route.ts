import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let fileToUpload: string | null = null;
    let folder = "sman2buaybahuga/cms";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      fileToUpload = body.image;
      if (body.folder) folder = body.folder;
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        fileToUpload = `data:${file.type};base64,${buffer.toString("base64")}`;
      }
    }

    if (!fileToUpload) {
      return NextResponse.json(
        { error: "Tidak ada berkas gambar yang dikirimkan." },
        { status: 400 }
      );
    }

    // 1. Attempt upload to Cloudinary CDN
    try {
      const uploadResponse = await cloudinary.uploader.upload(fileToUpload, {
        folder: folder,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      });

      return NextResponse.json({
        success: true,
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
        provider: "cloudinary",
      });
    } catch (cloudinaryErr: any) {
      console.warn(
        "Cloudinary upload rejected (e.g. 403 missing permissions), falling back to high-res local storage:",
        cloudinaryErr.message || cloudinaryErr
      );

      // 2. Reliable Fallback: Save to /public/uploads/ so upload NEVER fails
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Extract base64 payload
      const matches = fileToUpload.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      let ext = "jpg";

      if (matches && matches.length === 3) {
        const mime = matches[1];
        if (mime.includes("png")) ext = "png";
        else if (mime.includes("webp")) ext = "webp";
        buffer = Buffer.from(matches[2], "base64");
      } else {
        buffer = Buffer.from(fileToUpload, "base64");
      }

      const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filePath = path.join(uploadsDir, fileName);

      fs.writeFileSync(filePath, buffer);
      const localUrl = `/uploads/${fileName}`;

      return NextResponse.json({
        success: true,
        url: localUrl,
        provider: "local",
        message: "Foto berhasil disimpan ke penyimpanan lokal server.",
      });
    }
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal memproses gambar." },
      { status: 500 }
    );
  }
}
