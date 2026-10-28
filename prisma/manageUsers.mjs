import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      email: true,
    },
  });
  console.log("Daftar Pengguna di Supabase saat ini:", users);
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
