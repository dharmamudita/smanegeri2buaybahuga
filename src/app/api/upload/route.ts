import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "da14re4p",
  api_key: process.env.CLOUDINARY_API_KEY || "457114721252693",
  api_secret: process.env.CLOUDINARY_API_SECRET || "tR-MG-e7KUHyvFvJgw6IkN_XKaA",
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

    const uploadResponse = await cloudinary.uploader.upload(fileToUpload, {
      folder: folder,
      resource_type: "image",
      transformation: [
        { quality: "auto", fetch_format: "auto" }
      ],
    });

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      width: uploadResponse.width,
      height: uploadResponse.height,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengunggah foto ke Cloudinary." },
      { status: 500 }
    );
  }
}

