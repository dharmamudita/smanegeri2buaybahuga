import {
  Users,
  Award,
  ShieldCheck,
  Trophy,
  Flame,
  Activity,
  HeartHandshake,
  Compass,
} from "lucide-react";

export default function KesiswaanPage() {
  const ekskulList = [
    {
      nama: "Pasukan Pengibar Bendera (Paskibra)",
      kategori: "Kedisiplinan & Nasionalisme",
      icon: ShieldCheck,
      pembina: "Drs. Joko Prasetyo",
      jadwal: "Selasa & Jumat, 15:30 WIB",
      prestasi: "Juara 1 Lomba Baris-Berbaris Tingkat Kabupaten Way Kanan",
    },
    {
      nama: "Gerakan Pramuka Gudep Buay Bahuga",
      kategori: "Kepanduan & Karakter",
      icon: Compass,
      pembina: "Budi Santoso, S.Pd., M.Si.",
      jadwal: "Kamis, 15:30 WIB",
      prestasi: "Juara Umum Raimuna Cabang Way Kanan 2025",
    },
    {
      nama: "Palang Merah Remaja (PMR Wira)",
      kategori: "Kemanusiaan & Kesehatan",
      icon: HeartHandshake,
      pembina: "Siti Rahmawati, S.Pd.",
      jadwal: "Rabu, 15:30 WIB",
      prestasi: "Pelayanan Pertolongan Pertama Terbaik Tingkat SMA",
    },
    {
      nama: "Karya Ilmiah Remaja & Robotika (KIR)",
      kategori: "Sains & Teknologi",
      icon: Activity,
      pembina: "Ahmad Fauzi, S.Kom.",
      jadwal: "Sabtu, 09:00 WIB",
      prestasi: "Finalis Lomba Inovasi Teknologi Tepat Guna Lampung 2026",
    },
    {
      nama: "Rohis & Bina Mental Spiritual",
      kategori: "Keagamaan & Moral",
      icon: Flame,
      pembina: "Nurul Hidayati, M.Pd.",
      jadwal: "Jumat, 11:30 WIB",
      prestasi: "Penyelenggara Pesantren Kilat Ramadhan Teraktif",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold mb-2">
          <Users className="w-3.5 h-3.5" />
          <span>Pengembangan Karakter Siswa</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Kesiswaan & Ekstrakurikuler
        </h1>
        <p className="text-sm text-gray-600 mt-2 max-w-3xl leading-relaxed">
          Mengembangkan bakat kepemimpinan, sportivitas, kepekaan sosial, dan
          daya cipta inovasi peserta didik melalui organisasi OSIS/MPK dan 12 cabang
          ekstrakurikuler pilihan.
        </p>
      </div>

      {/* Profil Organisasi Siswa */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Organisasi Siswa Intra Sekolah (OSIS) & MPK
            </h2>
            <p className="text-xs text-gray-500">Masa Bakti 2026/2027</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs space-y-1">
            <span className="font-semibold text-[#2A2C5E]">Ketua Umum OSIS</span>
            <h4 className="font-bold text-gray-900 text-sm">
              Dharma Mudita Pratama
            </h4>
            <p className="text-gray-500">Kelas XII MIPA 1 (NISN: 0078129341)</p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs space-y-1">
            <span className="font-semibold text-[#2A2C5E]">Wakil Ketua OSIS</span>
            <h4 className="font-bold text-gray-900 text-sm">
              Anisa Putri Lestari
            </h4>
            <p className="text-gray-500">Kelas XII MIPA 1 (NISN: 0078129342)</p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs space-y-1">
            <span className="font-semibold text-[#2A2C5E]">Ketua MPK</span>
            <h4 className="font-bold text-gray-900 text-sm">Rizky Ramadhani</h4>
            <p className="text-gray-500">Kelas XI IPS 2 (NISN: 0081234567)</p>
          </div>
        </div>
      </div>

      {/* Daftar Ekstrakurikuler */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">
          Cabang Ekstrakurikuler Unggulan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ekskulList.map((ekskul, idx) => {
            const Icon = ekskul.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2A2C5E] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A2C5E] bg-blue-50 px-2 py-0.5 rounded">
                    {ekskul.kategori}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900">{ekskul.nama}</h3>
                <div className="text-xs text-gray-600 space-y-1 pt-1 border-t border-gray-100">
                  <p>
                    <strong className="text-gray-700">Pembina:</strong>{" "}
                    {ekskul.pembina}
                  </p>
                  <p>
                    <strong className="text-gray-700">Jadwal Latihan:</strong>{" "}
                    {ekskul.jadwal}
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded p-2 text-[11px] text-emerald-800 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span className="truncate">{ekskul.prestasi}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
