import { Metadata } from "next";
import { Users, GraduationCap, Award, BookOpen, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Teacher } from "@/types/database";

export const metadata: Metadata = {
  title: "Direktori Dewan Guru & Staf",
  description:
    "Mengenal jajaran dewan guru dan tenaga kependidikan profesional di SMA Negeri 2 Buay Bahuga, Kabupaten Way Kanan.",
};

const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: "t1",
    full_name: "Drs. H. Mulyadi, M.Pd.",
    nip: "19680512 199303 1 005",
    role_title: "Kepala Sekolah",
    subject: "Manajemen Pendidikan",
    photo_url: null,
    order_index: 1,
    is_active: true,
  },
  {
    id: "t2",
    full_name: "Siti Rahmawati, S.Pd., M.Si.",
    nip: "19750821 200212 2 003",
    role_title: "Wakil Kepala Sekolah Bid. Kurikulum",
    subject: "Matematika Peminatan",
    photo_url: null,
    order_index: 2,
    is_active: true,
  },
  {
    id: "t3",
    full_name: "Ahmad Fauzi, S.Pd.",
    nip: "19820315 200801 1 012",
    role_title: "Wakil Kepala Sekolah Bid. Kesiswaan",
    subject: "Pendidikan Jasmani & Kesehatan",
    photo_url: null,
    order_index: 3,
    is_active: true,
  },
  {
    id: "t4",
    full_name: "Dewi Lestari, S.Pd.",
    nip: "19860410 201001 2 018",
    role_title: "Guru Mata Pelajaran",
    subject: "Bahasa Indonesia",
    photo_url: null,
    order_index: 4,
    is_active: true,
  },
  {
    id: "t5",
    full_name: "Budi Santoso, S.Si.",
    nip: "19890912 201502 1 007",
    role_title: "Guru Mata Pelajaran",
    subject: "Fisika & Laboran IPA",
    photo_url: null,
    order_index: 5,
    is_active: true,
  },
  {
    id: "t6",
    full_name: "Nurul Hidayah, S.Pd.",
    nip: "19910214 201701 2 009",
    role_title: "Guru Mata Pelajaran",
    subject: "Bahasa Inggris",
    photo_url: null,
    order_index: 6,
    is_active: true,
  },
  {
    id: "t7",
    full_name: "Hendra Wijaya, S.Kom.",
    nip: "19931105 201903 1 011",
    role_title: "Guru Informatika & TIK",
    subject: "Informatika & Kepala Lab CBT",
    photo_url: null,
    order_index: 7,
    is_active: true,
  },
  {
    id: "t8",
    full_name: "Tri Wahyuni, S.Pd.",
    nip: "19850619 200902 2 004",
    role_title: "Guru Mata Pelajaran",
    subject: "Biologi",
    photo_url: null,
    order_index: 8,
    is_active: true,
  },
  {
    id: "t9",
    full_name: "I Made Sukarta, S.Ag.",
    nip: "19780104 200501 1 008",
    role_title: "Guru Mata Pelajaran",
    subject: "Pendidikan Agama & Budi Pekerti",
    photo_url: null,
    order_index: 9,
    is_active: true,
  },
  {
    id: "t10",
    full_name: "Rina Kusuma, S.Sos.",
    nip: "19940722 202012 2 015",
    role_title: "Guru Bimbingan Konseling (BK)",
    subject: "Bimbingan & Konseling Karir",
    photo_url: null,
    order_index: 10,
    is_active: true,
  },
  {
    id: "t11",
    full_name: "Eko Prasetyo, S.AP.",
    nip: "19870311 201101 1 009",
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

export default async function GuruPage() {
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
            Tenaga pengajar berdedikasi tinggi, bersertifikasi pendidik, dan berkomitmen melahirkan lulusan berprestasi unggul.
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-sky-300 transition-all duration-300 overflow-hidden group flex flex-col justify-between"
            >
              <div className="p-6 space-y-4 text-center">
                {/* Avatar Placeholder / Photo */}
                <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-sky-600 via-sky-500 to-sky-400 p-1 shadow-md group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                    <GraduationCap className="w-10 h-10 text-sky-600" />
                  </div>
                </div>

                {/* Name & Title */}
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-sky-600 transition-colors">
                    {teacher.full_name}
                  </h3>
                  <div className="text-xs font-semibold text-sky-700">
                    {teacher.role_title}
                  </div>
                  {teacher.nip && (
                    <div className="text-[11px] text-slate-400 font-mono">
                      NIP. {teacher.nip}
                    </div>
                  )}
                </div>
              </div>

              {/* Subject Tag Footer */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center">
                <span className="text-xs text-slate-600 font-medium">
                  {teacher.subject || "Tenaga Kependidikan"}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
