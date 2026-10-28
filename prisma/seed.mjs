import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Menyiapkan data awal SMAN 2 Buay Bahuga...");

  // 1. Admin Akun Default
  const admin = await prisma.user.upsert({
    where: { username: "SMAN2BUBA" },
    update: {},
    create: {
      username: "SMAN2BUBA",
      password: "SMANegeri2buba",
      name: "Administrator SMAN 2 Buay Bahuga",
      email: "sman2buaybahuga@gmail.com",
      role: "ADMIN",
      phone: "0852-6337-6378",
      isActive: true,
    },
  });
  console.log("Akun Admin terverifikasi:", admin.username);

  // 2. Akun Dewan Guru
  const guruKepsek = await prisma.user.upsert({
    where: { username: "197204052005012005" },
    update: {},
    create: {
      username: "197204052005012005",
      password: "password123",
      nuptk: "197204052005012005",
      name: "Apriyani, S.Si., M.M.Pd.",
      email: "apriyani@sman2buaybahuga.sch.id",
      role: "GURU",
      phone: "0852-6337-6378",
      isActive: true,
    },
  });

  const guruBiologi = await prisma.user.upsert({
    where: { username: "198103122008011005" },
    update: {},
    create: {
      username: "198103122008011005",
      password: "password123",
      nuptk: "198103122008011005",
      name: "Tumijo, S.Pd.",
      email: "tumijo@sman2buaybahuga.sch.id",
      role: "GURU",
      phone: "0812-7890-1234",
      isActive: true,
    },
  });

  const guruMatematika = await prisma.user.upsert({
    where: { username: "197905152006041010" },
    update: {},
    create: {
      username: "197905152006041010",
      password: "password123",
      nuptk: "197905152006041010",
      name: "Marsono, S.Pd.",
      email: "marsono@sman2buaybahuga.sch.id",
      role: "GURU",
      phone: "0813-4567-8901",
      isActive: true,
    },
  });
  console.log("Dewan Guru terdaftar:", [guruKepsek.name, guruBiologi.name, guruMatematika.name]);

  // 3. Akun Siswa Teladan
  const siswa1 = await prisma.user.upsert({
    where: { username: "0081234567" },
    update: {},
    create: {
      username: "0081234567",
      password: "password123",
      nisn: "0081234567",
      name: "Dharma Pratama",
      email: "dharma.pratama@siswa.sman2buaybahuga.sch.id",
      role: "SISWA",
      phone: "0821-1122-3344",
      isActive: true,
    },
  });
  console.log("Akun Siswa terdaftar:", siswa1.name);

  // 4. Berita Resmi Perdana
  const berita1 = await prisma.berita.upsert({
    where: { slug: "peluncuran-smart-school-dan-lms-sman-2-buay-bahuga" },
    update: {},
    create: {
      judul: "Peluncuran Sistem Digital Smart School SMAN 2 Buay Bahuga",
      slug: "peluncuran-smart-school-dan-lms-sman-2-buay-bahuga",
      kategori: "PENGUMUMAN",
      ringkasan: "Implementasi sistem manajemen pembelajaran modern dan absensi digital untuk seluruh warga sekolah SMAN 2 Buay Bahuga.",
      konten: "Dalam rangka meningkatkan mutu layanan pendidikan terpadu, SMA Negeri 2 Buay Bahuga secara resmi meluncurkan portal digital terintegrasi...",
      thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80",
      penulisId: admin.id,
      isPublished: true,
    },
  });
  console.log("Berita resmi terbit:", berita1.judul);

  console.log("Inisialisasi database Supabase selesai dengan sukses!");
}

main()
  .catch((e) => {
    console.error("Gagal melakukan seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
