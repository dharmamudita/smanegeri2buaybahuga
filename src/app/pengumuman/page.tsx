import { Metadata } from "next";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Announcement } from "@/types/database";
import AnnouncementExplorer from "@/components/pengumuman/AnnouncementExplorer";

export const metadata: Metadata = {
  title: "Pengumuman, Prestasi & Agenda Sekolah",
  description:
    "Warta terkini, jadwal kegiatan akademik, prestasi siswa, dan pengumuman resmi dari SMA Negeri 2 Buay Bahuga, Kabupaten Way Kanan.",
};

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    title: "Jadwal dan Prosedur Pelaksanaan PPDB Gelombang 1 Tahun Pelajaran 2027/2028",
    slug: "jadwal-ppdb-2027-gelombang-1",
    content:
      "Diberitahukan kepada seluruh calon peserta didik baru dan orang tua/wali bahwa pendaftaran daring resmi dibuka mulai tanggal 1 hingga 30 bulan berjalan. Verifikasi fisik berkas dilaksanakan di Sekretariat PPDB sekolah setiap hari kerja pukul 08.00 - 14.00 WIB.\n\nCalon siswa diharapkan melampirkan berkas pas foto, salinan Kartu Keluarga, dan SKL yang telah dilegalisasi oleh kepala sekolah asal.",
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
      "Kegiatan MPLS dirancang untuk membantu peserta didik baru beradaptasi dengan lingkungan sekolah secara edukatif, menyenangkan, tanpa perpeloncoan, dan sarat dengan nilai pembentukan karakter Profil Pelajar Pancasila.\n\nSeluruh siswa baru diharapkan hadir mengenakan seragam sekolah asal lengkap dengan atribut rapi.",
    category: "agenda",
    thumbnail_url: null,
    is_published: true,
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a3",
    title: "Raihan Medali Perunggu Olimpiade Sains Nasional (OSN) Bidang Matematika & Fisika Tingkat Provinsi",
    slug: "prestasi-osn-provinsi",
    content:
      "Civitas akademika SMA Negeri 2 Buay Bahuga dengan bangga mengucapkan selamat kepada ananda Rizky Pratama (Kelas XI MIPA 1) atas keberhasilannya meraih Medali Perunggu dalam ajang Olimpiade Sains Nasional (OSN) Tingkat Provinsi Lampung tahun 2026.\n\nSemoga capaian membanggakan ini terus menginspirasi seluruh siswa-siswi SMAN 2 Buay Bahuga untuk berani berprestasi di tingkat nasional.",
    category: "prestasi",
    thumbnail_url: null,
    is_published: true,
    published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a4",
    title: "Siswa SMAN 2 Buay Bahuga Terpilih Menjadi Pasukan Pengibar Bendera Pusaka (Paskibraka) Kabupaten Way Kanan",
    slug: "paskibraka-way-kanan",
    content:
      "Tiga orang siswa terbaik SMAN 2 Buay Bahuga berhasil lolos seleksi ketat fisik, wawasan kebangsaan, dan postur untuk bertugas sebagai Paskibraka Kabupaten Way Kanan pada Upacara Peringatan Hari Kemerdekaan Republik Indonesia.\n\nPrestasi ini membuktikan dedikasi tinggi ekstrakurikuler Paskibraka sekolah dalam menanamkan disiplin dan cinta tanah air.",
    category: "prestasi",
    thumbnail_url: null,
    is_published: true,
    published_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a5",
    title: "Kalender Akademik: Pelaksanaan Penilaian Sumatif Akhir Semester (PSAS) Berbasis Komputer",
    slug: "jadwal-psas-berbasis-komputer",
    content:
      "Pelaksanaan Penilaian Sumatif Akhir Semester (PSAS) berbasis digital akan diselenggarakan di Laboratorium CBT sekolah mulai tanggal 10 bulan depan. Siswa dihimbau untuk mempersiapkan akun portal dan menjaga kesehatan fisik.\n\nJadwal per mata pelajaran dan denah sesi tes telah ditempelkan di papan pengumuman sekolah.",
    category: "agenda",
    thumbnail_url: null,
    is_published: true,
    published_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a6",
    title: "Gelar Karya P5: Kolaborasi Pameran Kewirausahaan Mandiri dan Budaya Seni Lampung",
    slug: "gelar-karya-p5-seni-lampung",
    content:
      "Sebagai implementasi Kurikulum Merdeka, siswa kelas X dan XI menyelenggarakan pameran projek P5 dengan mengusung produk kerajinan tangan lokal, pengolahan makanan khas Way Kanan, serta persembahan tarian tradisional Lampung.\n\nAcara dihadiri oleh komite sekolah, dewan guru, dan perwakilan dinas pendidikan setempat.",
    category: "berita",
    thumbnail_url: null,
    is_published: true,
    published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5 text-sky-600" />
            <span>Pusat Informasi & Warta Resmi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Warta, Prestasi & Agenda
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Informasi terkini seputar pengumuman resmi sekolah, agenda kegiatan kurikuler, dan catatan prestasi siswa SMA Negeri 2 Buay Bahuga.
          </p>
        </div>

        {/* Interactive Explorer with Filters & Search */}
        <AnnouncementExplorer initialAnnouncements={announcements} />

      </div>
    </div>
  );
}
