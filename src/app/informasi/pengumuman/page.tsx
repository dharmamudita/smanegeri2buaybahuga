import { Metadata } from "next";
import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Announcement } from "@/types/database";
import AnnouncementExplorer from "@/components/pengumuman/AnnouncementExplorer";

export const metadata: Metadata = {
  title: "Pengumuman & Warta Resmi | SMA Negeri 2 Buay Bahuga",
  description:
    "Portal berita, agenda kegiatan, pengumuman kelulusan, dan publikasi resmi SMA Negeri 2 Buay Bahuga, Kabupaten Way Kanan.",
};

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    title: "Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2027/2028 Resmi Dibuka",
    slug: "ppdb-2027-2028-resmi-dibuka",
    content:
      "SMA Negeri 2 Buay Bahuga secara resmi membuka pendaftaran peserta didik baru melalui 4 jalur: Zonasi, Afirmasi, Prestasi, dan Perpindahan Tugas Orang Tua. Pendaftaran dilakukan secara daring (online) tanpa dipungut biaya apapun.",
    category: "pengumuman",
    thumbnail_url: null,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "a2",
    title: "Jadwal Pelaksanaan Penilaian Akhir Semester (PAS) Genap",
    slug: "jadwal-penilaian-akhir-semester-genap",
    content:
      "Diberitahukan kepada seluruh siswa Fase E dan Fase F bahwa Penilaian Akhir Semester akan dilaksanakan berbasis CBT di Laboratorium Komputer. Siswa diwajibkan menyelesaikan seluruh administrasi kehadiran dan tugas projek P5.",
    category: "berita",
    thumbnail_url: null,
    is_published: true,
    published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "a3",
    title: "Prestasi Membanggakan: Juara 1 OSN Informatika Tingkat Kabupaten",
    slug: "prestasi-juara-1-osn-informatika",
    content:
      "Selamat dan sukses kepada perwakilan SMAN 2 Buay Bahuga yang berhasil meraih Medali Emas dalam ajang Olimpiade Sains Nasional (OSN) Bidang Informatika Tingkat Kabupaten Way Kanan dan berhak melaju ke tingkat provinsi.",
    category: "prestasi",
    thumbnail_url: null,
    is_published: true,
    published_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "a4",
    title: "Undangan Rapat Pleno Komite Sekolah & Sosialisasi Program P5",
    slug: "undangan-rapat-komite-program-p5",
    content:
      "Mengharap kehadiran Bapak/Ibu Orang Tua/Wali Murid dalam rapat pleno komite sekolah guna membahas rencana kerja sekolah serta pemaparan gelar karya projek penguatan profil pelajar pancasila.",
    category: "agenda",
    thumbnail_url: null,
    is_published: true,
    published_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

export default async function InformasiPengumumanPage() {
  let announcements: Announcement[] = DEFAULT_ANNOUNCEMENTS;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      announcements = data as Announcement[];
    }
  } catch (err) {
    console.error("Error fetching announcements:", err);
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/informasi" className="hover:text-sky-600 transition">Informasi</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-bold">Pengumuman & Berita</span>
        </nav>

        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span>Pusat Warta & Pengumuman Resmi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Warta & Pengumuman Sekolah
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Informasi terkini mengenai agenda akademik, surat edaran resmi dinas, capaian prestasi siswa, dan tahapan PPDB online.
          </p>
        </div>

        {/* Interactive Announcement Explorer */}
        <AnnouncementExplorer initialAnnouncements={announcements} />

      </div>
    </div>
  );
}
