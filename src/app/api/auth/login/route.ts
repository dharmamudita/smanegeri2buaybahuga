import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MOCK_USERS } from "@/lib/mockData";

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

    const cleanUsername = String(username).trim();
    const cleanPassword = String(password).trim();

    // 1. Cari pengguna di database Supabase PostgreSQL (dengan timeout 2.5s agar tidak freeze jika koneksi lambat)
    let user = null;
    try {
      const dbPromise = prisma.user.findFirst({
        where: {
          username: { equals: cleanUsername, mode: "insensitive" },
          role: role,
          isActive: true,
        },
      });

      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Supabase connection timeout")), 2500)
      );

      user = await Promise.race([dbPromise, timeoutPromise]);
    } catch (dbErr) {
      console.warn("Koneksi langsung database mengalami kendala, menggunakan validasi kredensial resmi:", dbErr);
    }

    // Jika pengguna ditemukan di database Supabase
    if (user) {
      if (user.password !== cleanPassword) {
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

    // 2. Validasi kredensial resmi sekolah (Fallback & Demo Resmi)
    // Administrator
    if (
      role === "ADMIN" &&
      cleanUsername.toUpperCase() === "SMAN2BUBA" &&
      cleanPassword === "SMANegeri2buba"
    ) {
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

    // Dewan Guru & Siswa
    const foundFallback = MOCK_USERS.find(
      (u) =>
        u.role === role &&
        (u.username.toLowerCase() === cleanUsername.toLowerCase() ||
          u.nuptk === cleanUsername ||
          u.nisn === cleanUsername)
    );

    if (foundFallback) {
      // Default kata sandi resmi untuk akun demo/guru/siswa
      if (cleanPassword === "password123") {
        return NextResponse.json({
          success: true,
          user: foundFallback,
        });
      } else {
        return NextResponse.json(
          { success: false, message: "Kata sandi yang Anda masukkan salah." },
          { status: 401 }
        );
      }
    }

    // Tambahan akun Guru resmi jika menggunakan NUPTK Dapodik
    const DAPODIK_GURU_LIST = [
      { nuptk: "197204052005012005", name: "Apriyani, S.Si., M.M.Pd.", email: "apriyani@sman2buaybahuga.sch.id", mapel: "Kepala Sekolah & Pembina" },
      { nuptk: "197805122005011003", name: "Tumijo, S.Pd.", email: "tumijo@sman2buaybahuga.sch.id", mapel: "Biologi & Praktikum IPA" },
      { nuptk: "198203152008011012", name: "Marsono, S.Pd.", email: "marsono@sman2buaybahuga.sch.id", mapel: "Matematika Tingkat Lanjut" },
      { nuptk: "198904182014022004", name: "Wida Awanda, S.Pd.Si.", email: "wida.awanda@sman2buaybahuga.sch.id", mapel: "Fisika & Sains Terapan" },
      { nuptk: "198807272011012005", name: "Eva Dwi Kurniawati, S.Pd.", email: "eva.kurniawati@sman2buaybahuga.sch.id", mapel: "Geografi & Kebumian" },
      { nuptk: "198506142010011015", name: "Mamad Fhadoli, S.Pd.I.", email: "mamad.fhadoli@sman2buaybahuga.sch.id", mapel: "Pendidikan Agama Islam" },
      { nuptk: "198611102012011009", name: "Mamad Fhadoli, S.Pd.I.", email: "mamad.fhadoli@sman2buaybahuga.sch.id", mapel: "Pendidikan Agama Islam" },
      { nuptk: "199109252019032018", name: "Marlita Illiansyah, S.Pd.", email: "marlita.illiansyah@sman2buaybahuga.sch.id", mapel: "Bahasa dan Sastra Indonesia" },
      { nuptk: "199008122015032007", name: "Marlita Illiansyah, S.Pd.", email: "marlita.illiansyah@sman2buaybahuga.sch.id", mapel: "Bahasa dan Sastra Indonesia" },
      { nuptk: "199305102022212025", name: "Meiliana, S.Pd.", email: "meiliana@sman2buaybahuga.sch.id", mapel: "Ekonomi & Kewirausahaan" },
      { nuptk: "199105202019022008", name: "Meiliana, S.Pd.", email: "meiliana@sman2buaybahuga.sch.id", mapel: "Ekonomi & Kewirausahaan" },
    ];

    if (role === "GURU") {
      const guruMatch = DAPODIK_GURU_LIST.find((g) => g.nuptk === cleanUsername);
      if (guruMatch && cleanPassword === "password123") {
        return NextResponse.json({
          success: true,
          user: {
            id: `guru-${guruMatch.nuptk}`,
            username: guruMatch.nuptk,
            nuptk: guruMatch.nuptk,
            name: guruMatch.name,
            role: "GURU",
            email: guruMatch.email,
            mataPelajaran: guruMatch.mapel,
          },
        });
      }
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


