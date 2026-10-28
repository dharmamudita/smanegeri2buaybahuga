import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, role } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username/ID Akses dan Kata Sandi wajib diisi." },
        { status: 400 }
      );
    }

    // Cari pengguna di database Supabase PostgreSQL
    let user = null;
    try {
      user = await prisma.user.findFirst({
        where: {
          username: { equals: username, mode: "insensitive" },
          role: role,
          isActive: true,
        },
      });
    } catch (dbErr) {
      console.warn("Koneksi langsung database mengalami kendala, menggunakan validasi fallback:", dbErr);
    }

    // Jika pengguna ditemukan di database Supabase
    if (user) {
      if (user.password !== password) {
        return NextResponse.json(
          { success: false, message: "Kredensial atau kata sandi tidak valid." },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          email: user.email,
          nuptk: user.nuptk,
          nisn: user.nisn,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
        },
      });
    }

    // Validasi kredensial fallback jika database belum terhubung di environment lokal
    if (role === "ADMIN" && username === "SMAN2BUBA" && password === "SMANegeri2buba") {
      return NextResponse.json({
        success: true,
        user: {
          id: "admin-1",
          username: "SMAN2BUBA",
          name: "Abu Yasid (Operator & Administrator SMAN 2 Buay Bahuga)",
          role: "ADMIN",
          email: "sman2buaybahuga@gmail.com",
          phone: "0852-6337-6378",
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          role === "GURU"
            ? "NUPTK atau kata sandi dewan guru tidak cocok."
            : role === "ADMIN"
            ? "ID Akses atau kata sandi administrator salah."
            : "NISN atau kata sandi siswa tidak cocok.",
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login Server Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server autentikasi." },
      { status: 500 }
    );
  }
}

