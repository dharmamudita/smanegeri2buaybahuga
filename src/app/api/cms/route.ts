import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  INITIAL_BERANDA_CMS,
  INITIAL_PROFIL_CMS,
  INITIAL_AKADEMIK_CMS,
  INITIAL_KESISWAAN_CMS,
} from "@/lib/cmsData";
import { MOCK_BERITA } from "@/lib/mockData";

// GET: Ambil seluruh data CMS dan Berita langsung dari basis data Supabase
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sectionParam = searchParams.get("section");

    // 1. Ambil seluruh CmsSection
    const sections = await prisma.cmsSection.findMany();
    const cmsMap: Record<string, any> = {
      beranda: INITIAL_BERANDA_CMS,
      profil: INITIAL_PROFIL_CMS,
      akademik: INITIAL_AKADEMIK_CMS,
      kesiswaan: INITIAL_KESISWAAN_CMS,
    };

    for (const s of sections) {
      if (s.id && s.data) {
        cmsMap[s.id] = s.data;
      }
    }

    // 2. Ambil Berita dari tabel Berita Supabase
    let beritaList = await prisma.berita.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Jika tabel berita masih kosong, inisialisasi dari MOCK_BERITA resmi
    if (beritaList.length === 0) {
      try {
        const adminUser = await prisma.user.findFirst({
          where: { role: "ADMIN" },
        });

        if (adminUser) {
          for (const b of MOCK_BERITA) {
            await prisma.berita.create({
              data: {
                id: b.id,
                slug: b.slug,
                judul: b.judul,
                ringkasan: b.ringkasan,
                konten: b.konten,
                kategori: b.kategori,
                thumbnailUrl: b.thumbnailUrl,
                isPublished: true,
                penulisId: adminUser.id,
              },
            });
          }
          beritaList = await prisma.berita.findMany({
            orderBy: { createdAt: "desc" },
          });
        }
      } catch (seedErr) {
        console.warn("Auto-seed berita error:", seedErr);
      }
    }

    // Format berita sesuai struktur frontend
    const formattedBerita = beritaList.map((b) => ({
      id: b.id,
      slug: b.slug,
      judul: b.judul,
      ringkasan: b.ringkasan,
      konten: b.konten,
      kategori: b.kategori,
      thumbnailUrl: b.thumbnailUrl,
      tanggal: new Date(b.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      penulis: "Humas & Kurikulum",
      bacaMenit: 3,
    }));

    if (sectionParam && cmsMap[sectionParam]) {
      return NextResponse.json({
        success: true,
        section: sectionParam,
        data: cmsMap[sectionParam],
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...cmsMap,
        beritaList: formattedBerita,
      },
    });
  } catch (error: any) {
    console.error("GET /api/cms Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memuat data CMS dari basis data Supabase." },
      { status: 500 }
    );
  }
}

// PUT: Perbarui bagian CMS (Beranda, Profil, Akademik, Kesiswaan) langsung di Supabase
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { section, data, updatedBy = "SMAN2BUBA" } = body;

    if (!section || !data) {
      return NextResponse.json(
        { success: false, error: "Bagian CMS (section) dan data wajib disertakan." },
        { status: 400 }
      );
    }

    if (!["beranda", "profil", "akademik", "kesiswaan"].includes(section)) {
      return NextResponse.json(
        { success: false, error: `Bagian "${section}" tidak valid.` },
        { status: 400 }
      );
    }

    // Upsert ke tabel CmsSection di Supabase PostgreSQL
    const updated = await prisma.cmsSection.upsert({
      where: { id: section },
      update: {
        data: data,
        updatedBy: updatedBy,
        updatedAt: new Date(),
      },
      create: {
        id: section,
        data: data,
        updatedBy: updatedBy,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Bagian "${section}" berhasil disimpan permanen ke Supabase.`,
      data: updated.data,
      updatedAt: updated.updatedAt,
    });
  } catch (error: any) {
    console.error("PUT /api/cms Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memperbarui data CMS di Supabase." },
      { status: 500 }
    );
  }
}

// POST: Tambah Berita Baru ke Supabase
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { judul, slug, ringkasan, konten, kategori, thumbnailUrl, penulisId } = body;

    if (!judul || !ringkasan) {
      return NextResponse.json(
        { success: false, error: "Judul dan ringkasan berita wajib diisi." },
        { status: 400 }
      );
    }

    const adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    const finalPenulisId = penulisId || adminUser?.id;
    if (!finalPenulisId) {
      return NextResponse.json(
        { success: false, error: "Penulis tidak ditemukan." },
        { status: 400 }
      );
    }

    const finalSlug =
      slug ||
      judul
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + `-${Date.now()}`;

    const newBerita = await prisma.berita.create({
      data: {
        judul,
        slug: finalSlug,
        ringkasan,
        konten: konten || ringkasan,
        kategori: kategori || "PENGUMUMAN",
        thumbnailUrl: thumbnailUrl || null,
        isPublished: true,
        penulisId: finalPenulisId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Berita berhasil diterbitkan ke Supabase.",
      data: newBerita,
    });
  } catch (error: any) {
    console.error("POST /api/cms (Berita) Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menambahkan berita ke Supabase." },
      { status: 500 }
    );
  }
}

// DELETE: Hapus Berita dari Supabase
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID berita wajib disertakan." },
        { status: 400 }
      );
    }

    await prisma.berita.delete({
      where: { id: id },
    });

    return NextResponse.json({
      success: true,
      message: "Berita berhasil dihapus dari Supabase.",
    });
  } catch (error: any) {
    console.error("DELETE /api/cms (Berita) Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menghapus berita dari Supabase." },
      { status: 500 }
    );
  }
}

