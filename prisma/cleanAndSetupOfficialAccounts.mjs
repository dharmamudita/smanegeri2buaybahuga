import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Menyelaraskan akun resmi SMAN 2 Buay Bahuga di Supabase...");

  // 1. Hapus akun demo
  await prisma.user.deleteMany({
    where: {
      role: "SISWA",
    },
  });
  console.log("Seluruh akun siswa demo berhasil dibersihkan dari Supabase.");

  // 2. Akun Admin Resmi
  const admin = await prisma.user.upsert({
    where: { username: "SMAN2BUBA" },
    update: {
      name: "Abu Yasid (Operator & Administrator SMAN 2 Buay Bahuga)",
      email: "sman2buaybahuga@gmail.com",
      role: "ADMIN",
      password: "SMANegeri2buba",
      phone: "0852-6337-6378",
      isActive: true,
    },
    create: {
      username: "SMAN2BUBA",
      password: "SMANegeri2buba",
      name: "Abu Yasid (Operator & Administrator SMAN 2 Buay Bahuga)",
      email: "sman2buaybahuga@gmail.com",
      role: "ADMIN",
      phone: "0852-6337-6378",
      isActive: true,
    },
  });
  console.log("Akun Admin Resmi Aktif:", admin.username);

  // 3. Dewan Guru Resmi (Hapus guru lama agar tidak bentrok email/NUPTK, lalu masukkan data resmi)
  await prisma.user.deleteMany({
    where: {
      role: "GURU",
    },
  });

  const dewanGuru = [
    {
      username: "197204052005012005",
      nuptk: "197204052005012005",
      name: "Apriyani, S.Si., M.M.Pd.",
      email: "apriyani@sman2buaybahuga.sch.id",
      role: "GURU",
      password: "password123",
      phone: "0852-6337-6378",
    },
    {
      username: "197805122005011003",
      nuptk: "197805122005011003",
      name: "Tumijo, S.Pd.",
      email: "tumijo@sman2buaybahuga.sch.id",
      role: "GURU",
      password: "password123",
      phone: "0812-7890-1234",
    },
    {
      username: "198203152008011012",
      nuptk: "198203152008011012",
      name: "Marsono, S.Pd.",
      email: "marsono@sman2buaybahuga.sch.id",
      role: "GURU",
      password: "password123",
      phone: "0813-4567-8901",
    },
    {
      username: "198904182014022004",
      nuptk: "198904182014022004",
      name: "Wida Awanda, S.Pd.Si.",
      email: "wida.awanda@sman2buaybahuga.sch.id",
      role: "GURU",
      password: "password123",
      phone: "0813-2233-4455",
    },
    {
      username: "198807272011012005",
      nuptk: "198807272011012005",
      name: "Eva Dwi Kurniawati, S.Pd.",
      email: "eva.kurniawati@sman2buaybahuga.sch.id",
      role: "GURU",
      password: "password123",
      phone: "0812-9988-7766",
    },
    {
      username: "198506142010011015",
      nuptk: "198506142010011015",
      name: "Mamad Fhadoli, S.Pd.I.",
      email: "mamad.fhadoli@sman2buaybahuga.sch.id",
      role: "GURU",
      password: "password123",
      phone: "0813-7766-5544",
    },
    {
      username: "199109252019032018",
      nuptk: "199109252019032018",
      name: "Marlita Illiansyah, S.Pd.",
      email: "marlita.illiansyah@sman2buaybahuga.sch.id",
      role: "GURU",
      password: "password123",
      phone: "0821-4455-6677",
    },
    {
      username: "199305102022212025",
      nuptk: "199305102022212025",
      name: "Meiliana, S.Pd.",
      email: "meiliana@sman2buaybahuga.sch.id",
      role: "GURU",
      password: "password123",
      phone: "0822-3344-5566",
    },
  ];

  for (const g of dewanGuru) {
    await prisma.user.create({
      data: g,
    });
  }
  console.log(`Sukses memasukkan ${dewanGuru.length} Dewan Guru resmi.`);

  // 4. Tampilkan daftar final
  const allUsers = await prisma.user.findMany({
    select: {
      username: true,
      name: true,
      role: true,
      email: true,
    },
    orderBy: { role: "asc" },
  });
  console.log("\nDaftar Final Pengguna Resmi di Database Supabase:");
  console.table(allUsers);
}

main()
  .catch((e) => {
    console.error("Gagal setup:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
