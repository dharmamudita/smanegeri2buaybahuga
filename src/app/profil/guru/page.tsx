import { Metadata } from "next";
import Link from "next/link";
import { Users, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Teacher } from "@/types/database";
import TeacherDirectory from "@/components/guru/TeacherDirectory";

export const metadata: Metadata = {
  title: "Direktori Dewan Guru & Staf | SMA Negeri 2 Buay Bahuga",
  description:
    "Mengenal jajaran dewan guru dan tenaga kependidikan profesional di SMA Negeri 2 Buay Bahuga, Kabupaten Way Kanan.",
};

export const dynamic = "force-dynamic";

const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: "t1",
    full_name: "Apriyani, S.Si., M.M.Pd.",
    nip: "19780512 200501 2 008",
    role_title: "Kepala Sekolah",
    subject: "Pimpinan Satuan Pendidikan",
    photo_url: null,
    order_index: 1,
    is_active: true,
  },
  {
    id: "t2",
    full_name: "Bambang Irawan, S.Pd., M.Pd.",
    nip: "19820315 200801 1 012",
    role_title: "Wakil Kepala Sekolah Bid. Kurikulum",
    subject: "Matematika Peminatan",
    photo_url: null,
    order_index: 2,
    is_active: true,
  },
  {
    id: "t3",
    full_name: "Siti Rahmawati, S.Pd.",
    nip: "19840722 200902 2 005",
    role_title: "Wakil Kepala Sekolah Bid. Kesiswaan",
    subject: "Bahasa Indonesia",
    photo_url: null,
    order_index: 3,
    is_active: true,
  },
  {
    id: "t4",
    full_name: "Ahmad Fauzi, S.Pd.",
    nip: "19801105 200604 1 009",
    role_title: "Wakil Kepala Sekolah Bid. Sarpras",
    subject: "Fisika & Teknologi Informasi",
    photo_url: null,
    order_index: 4,
    is_active: true,
  },
  {
    id: "t5",
    full_name: "Nurul Hidayah, S.Sos.",
    nip: "19860918 201101 2 014",
    role_title: "Wakil Kepala Sekolah Bid. Humas",
    subject: "Sosiologi",
    photo_url: null,
    order_index: 5,
    is_active: true,
  },
  {
    id: "t6",
    full_name: "Dedi Setiawan, S.Pd., Kons.",
    nip: "19881203 201402 1 003",
    role_title: "Guru Bimbingan Konseling (BK)",
    subject: "Layanan Konseling Siswa",
    photo_url: null,
    order_index: 6,
    is_active: true,
  },
  {
    id: "t7",
    full_name: "Dra. Endang Sulastri",
    nip: "19750410 200003 2 004",
    role_title: "Guru Mata Pelajaran",
    subject: "Biologi",
    photo_url: null,
    order_index: 7,
    is_active: true,
  },
  {
    id: "t8",
    full_name: "Hendri Saputra, S.Pd.",
    nip: "19890214 201503 1 002",
    role_title: "Guru Mata Pelajaran",
    subject: "Kimia",
    photo_url: null,
    order_index: 8,
    is_active: true,
  },
  {
    id: "t9",
    full_name: "Rina Kusuma Dewi, S.Pd.",
    nip: "19910520 201902 2 008",
    role_title: "Guru Mata Pelajaran",
    subject: "Bahasa Inggris",
    photo_url: null,
    order_index: 9,
    is_active: true,
  },
  {
    id: "t10",
    full_name: "Agus Pratama, S.Pd.",
    nip: "19870830 201101 1 007",
    role_title: "Guru Mata Pelajaran",
    subject: "Pendidikan Jasmani & Kesehatan (PJOK)",
    photo_url: null,
    order_index: 10,
    is_active: true,
  },
  {
    id: "t11",
    full_name: "Wahyudi, S.E.",
    nip: "19850612 201001 1 015",
    role_title: "Kepala Tata Usaha (KTU)",
    subject: "Administrasi & Kepegawaian",
    photo_url: null,
    order_index: 11,
    is_active: true,
  },
  {
    id: "t12",
    full_name: "Sri Mulyani, A.Md.",
    nip: "19900815 201602 2 011",
    role_title: "Staf Tata Usaha",
    subject: "Operator Dapodik & Kesiswaan",
    photo_url: null,
    order_index: 12,
    is_active: true,
  },
];

export default async function ProfilGuruPage() {
  let teachers: Teacher[] = DEFAULT_TEACHERS;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("teachers")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (data && data.length > 0) {
      teachers = data as Teacher[];
    }
  } catch (err) {
    console.error("Error fetching teachers:", err);
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/profil" className="hover:text-sky-600 transition">Profil</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-bold">Dewan Guru & Staf</span>
        </nav>

        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-sky-600" />
            <span>Pendidik & Tenaga Kependidikan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Direktori Dewan Guru & Staf
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Tenaga pengajar berdedikasi tinggi, bersertifikasi pendidik, dan berkomitmen melahirkan lulusan berprestasi unggul di Kabupaten Way Kanan.
          </p>
        </div>

        {/* Teachers Directory Explorer */}
        <TeacherDirectory initialTeachers={teachers} />

      </div>
    </div>
  );
}
