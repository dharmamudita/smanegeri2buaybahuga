import { Metadata } from "next";
import Link from "next/link";
import { FileText, Calendar, Tag, ChevronRight, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Announcement } from "@/types/database";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pengumuman & Agenda Sekolah",
  description:
    "Warta terkini, jadwal kegiatan akademik, dan pengumuman resmi dari SMA Negeri 2 Buay Bahuga, Kabupaten Way Kanan.",
};

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    title: "Jadwal dan Prosedur Pelaksanaan PPDB Gelombang 1 Tahun Pelajaran 2027/2028",
    slug: "jadwal-ppdb-2027-gelombang-1",
    content:
      "Diberitahukan kepada seluruh calon peserta didik baru dan orang tua/wali bahwa pendaftaran daring resmi dibuka mulai tanggal 1 hingga 30 bulan berjalan. Verifikasi fisik berkas dilaksanakan di Sekretariat PPDB sekolah setiap hari kerja.",
    category: "pengumuman",
    thumbnail_url: null,
    is_published: true,
    published_at: new Date().toISOString(),
  },
  {
    id: "a2",
    title: "Sosialisasi Masa Pengenalan Lingkungan Sekolah (MPLS) Ramah Anak",
    slug: "sosialisasi-mpls-ramah-anak",
    content:
      "Kegiatan MPLS dirancang untuk membantu peserta didik baru beradaptasi dengan lingkungan sekolah secara edukatif, menyenangkan, tanpa perpeloncoan, dan sarat dengan nilai karakter.",
    category: "berita",
    thumbnail_url: null,
    is_published: true,
    published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a3",
    title: "Raihan Medali Perunggu Olimpiade Sains Nasional (OSN) Tingkat Provinsi",
    slug: "prestasi-osn-provinsi",
    content:
      "Selamat kepada siswa kami atas dedikasi dan prestasinya membawa pulang medali pada cabang Matematika dan Fisika dalam ajang OSN tingkat Provinsi Lampung.",
    category: "prestasi",
    thumbnail_url: null,
    is_published: true,
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default async function PengumumanPage() {
  let announcements: Announcement[] = DEFAULT_ANNOUNCEMENTS;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (data && data.length > 0) {
      announcements = data as Announcement[];
    }
  } catch (err) {
    console.error("Error fetching announcements:", err);
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5 text-sky-600" />
            <span>Pusat Informasi Terkini</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Pengumuman & Agenda
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Ikuti informasi penting seputar jadwal akademik, pengumuman seleksi PPDB, dan kabar prestasi sekolah.
          </p>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map((item) => (
            <article
              key={item.id}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-100">
                  {item.category}
                </span>
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(item.published_at)}</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 hover:text-sky-600 transition-colors">
                {item.title}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {item.content}
              </p>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
