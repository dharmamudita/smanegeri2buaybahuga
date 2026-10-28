import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { PrismaClient } from "@prisma/client";
import {
  INITIAL_BERANDA_CMS,
  INITIAL_PROFIL_CMS,
  INITIAL_AKADEMIK_CMS,
  INITIAL_KESISWAAN_CMS,
} from "../src/lib/cmsData";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CMS sections into Supabase PostgreSQL...");

  const sections = [
    { id: "beranda", data: INITIAL_BERANDA_CMS },
    { id: "profil", data: INITIAL_PROFIL_CMS },
    { id: "akademik", data: INITIAL_AKADEMIK_CMS },
    { id: "kesiswaan", data: INITIAL_KESISWAAN_CMS },
  ];

  for (const s of sections) {
    await prisma.cmsSection.upsert({
      where: { id: s.id },
      update: { data: s.data },
      create: {
        id: s.id,
        data: s.data,
        updatedBy: "SMAN2BUBA",
      },
    });
    console.log(`- Upserted section: ${s.id}`);
  }

  console.log("CMS sections seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
  })
  .finally(() => prisma.$disconnect());
