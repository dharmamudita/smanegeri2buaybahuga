"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BookOpen,
  PlusCircle,
  FileText,
  Video,
  Trash2,
  Edit3,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Search,
  Users,
  ChevronRight,
  ArrowLeft,
  X,
  Award,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
  Play,
  FileSpreadsheet,
} from "lucide-react";
import {
  useLMSStore,
  MapelLMS,
  PertemuanItem,
  SEED_CLASS_STUDENTS,
  INITIAL_GRADE_MATRIX,
  INITIAL_ABSENSI_MATRIX,
  SiswaGradeRecord,
  SiswaAbsensiRecord,
} from "@/lib/lmsStore";

function GuruMapelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlClassId = searchParams.get("id");
  const urlToast = searchParams.get("toast");

  const {
    classes,
    selectedClassId,
    selectClass,
    addClass,
    addPertemuan,
    updatePertemuan,
    deletePertemuan,
    gradeMatrix,
    absensiMatrix,
    updateStudentGrade,
    updateStudentAbsensi,
  } = useLMSStore();

  const [activeClassId, setActiveClassId] = useState<string | null>(
    urlClassId || selectedClassId || null
  );

  const activeClass = useMemo(() => {
    if (!activeClassId) return null;
    return classes.find((c) => c.id === activeClassId) || null;
  }, [classes, activeClassId]);

  // Tab di dalam kelas: ALUR_PERTEMUAN | REKAP_NILAI | REKAP_ABSENSI
  const [classTab, setClassTab] = useState<"PERTEMUAN" | "NILAI" | "ABSENSI">("PERTEMUAN");

  // Filter & Search untuk daftar kelas
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (urlToast === "added") {
      setToastMessage("Pertemuan baru beserta modul materi dan lembar soal CBT berhasil diterbitkan!");
      setTimeout(() => setToastMessage(null), 4500);
    }
  }, [urlToast]);

  // Modal State: Tambah Kelas Baru
  const [modalTambahKelas, setModalTambahKelas] = useState(false);
  const [inputKodeKelas, setInputKodeKelas] = useState("");
  const [inputNamaKelas, setInputNamaKelas] = useState("");
  const [inputTingkatKelas, setInputTingkatKelas] = useState("XII");
  const [inputJurusanKelas, setInputJurusanKelas] = useState("MIPA 1");
  const [inputJadwalKelas, setInputJadwalKelas] = useState("Senin, 07:30 - 09:30 WIB");
  const [inputRuangKelas, setInputRuangKelas] = useState("Lab Biologi");

  // Modal State: Kelola / Tambah Materi pada Pertemuan
  const [modalMateri, setModalMateri] = useState<{
    open: boolean;
    pertemuanId: string | null;
    judul: string;
    tipe: "DOKUMEN" | "VIDEO" | "RINGKASAN";
    ringkasan: string;
    kontenLengkap: string;
  }>({
    open: false,
    pertemuanId: null,
    judul: "",
    tipe: "DOKUMEN",
    ringkasan: "",
    kontenLengkap: "",
  });

  // Modal State: Kelola / Tambah Soal pada Pertemuan
  const [modalSoal, setModalSoal] = useState<{
    open: boolean;
    pertemuanId: string | null;
    judul: string;
    tipe: "PILIHAN_GANDA" | "ESSAY" | "UJIAN_UTS" | "UJIAN_UAS";
    deskripsi: string;
  }>({
    open: false,
    pertemuanId: null,
    judul: "",
    tipe: "PILIHAN_GANDA",
    deskripsi: "",
  });

  // Modal State: Edit Nilai Siswa
  const [modalEditNilai, setModalEditNilai] = useState<{
    open: boolean;
    siswa: SiswaGradeRecord | null;
    pertemuanNomor: string;
    nilai: number;
  }>({
    open: false,
    siswa: null,
    pertemuanNomor: "1",
    nilai: 90,
  });

  // Sinkronisasi data kelas yang difilter
  const displayedClasses = useMemo(() => {
    if (!searchQuery.trim()) return classes;
    const q = searchQuery.toLowerCase();
    return classes.filter(
      (c) =>
        c.nama.toLowerCase().includes(q) ||
        c.kode.toLowerCase().includes(q) ||
        c.ruang.toLowerCase().includes(q)
    );
  }, [classes, searchQuery]);

  // Data Nilai Siswa untuk kelas aktif
  const currentClassGrades: SiswaGradeRecord[] = useMemo(() => {
    if (!activeClass) return [];
    if (gradeMatrix[activeClass.id]) {
      return gradeMatrix[activeClass.id];
    }
    // Fallback seed
    return INITIAL_GRADE_MATRIX["mapel-1"] || [];
  }, [activeClass, gradeMatrix]);

  // Data Absensi Siswa untuk kelas aktif
  const currentClassAbsensi: SiswaAbsensiRecord[] = useMemo(() => {
    if (!activeClass) return [];
    if (absensiMatrix[activeClass.id]) {
      return absensiMatrix[activeClass.id];
    }
    // Fallback seed
    return INITIAL_ABSENSI_MATRIX["mapel-1"] || [];
  }, [activeClass, absensiMatrix]);

  // Handler: Buat Kelas Baru
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `mapel-${Date.now()}`;
    const newClass: MapelLMS = {
      id: newId,
      kode: inputKodeKelas.toUpperCase().trim() || `MAPEL-${Date.now().toString().slice(-4)}`,
      nama: inputNamaKelas.trim() || "Mata Pelajaran Baru",
      tingkat: inputTingkatKelas,
      jurusan: inputJurusanKelas,
      guruNama: "Tumijo, S.Pd.",
      guruNuptk: "197805122005011003",
      jadwal: inputJadwalKelas,
      ruang: inputRuangKelas,
      pertemuanList: [
        {
          id: `${newId}-p1`,
          nomor: 1,
          judul: "Pertemuan 1: Pengenalan Silabus & Kontrak Belajar",
          tipe: "REGULER",
          tanggal: "Senin, 04 Agustus 2026",
          materi: {
            judul: "Modul Ajar Bab 1: Pengantar",
            tipe: "DOKUMEN",
            ringkasan: "Cakupan capaian pembelajaran dan kompetensi dasar semester ini.",
            kontenLengkap: "Selamat datang di ruang kelas digital SMAN 2 Buay Bahuga.",
            sudahDibaca: false,
          },
          tugas: {
            id: `${newId}-t1`,
            judul: "Latihan Awal Formatif",
            tipe: "PILIHAN_GANDA",
            deskripsi: "Evaluasi pengenalan materi dasar.",
            sudahDikerjakan: false,
          },
          presensi: { hadir: false },
        },
      ],
    };

    addClass(newClass);
    setModalTambahKelas(false);
    setInputKodeKelas("");
    setInputNamaKelas("");
    setToastMessage(`Kelas "${newClass.nama}" berhasil dibuat dan ditambahkan ke daftar kelas Anda!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handler: Simpan Materi
  const handleSaveMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClass || !modalMateri.pertemuanId) return;

    updatePertemuan(activeClass.id, modalMateri.pertemuanId, {
      materi: {
        judul: modalMateri.judul,
        tipe: modalMateri.tipe,
        ringkasan: modalMateri.ringkasan,
        kontenLengkap: modalMateri.kontenLengkap || modalMateri.ringkasan,
        sudahDibaca: false,
      },
    });

    setModalMateri({ open: false, pertemuanId: null, judul: "", tipe: "DOKUMEN", ringkasan: "", kontenLengkap: "" });
    setToastMessage("Modul materi berhasil diperbarui dan disinkronkan ke akun siswa!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handler: Simpan Soal / Tugas
  const handleSaveSoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClass || !modalSoal.pertemuanId) return;

    updatePertemuan(activeClass.id, modalSoal.pertemuanId, {
      tugas: {
        id: `tugas-${modalSoal.pertemuanId}`,
        judul: modalSoal.judul,
        tipe: modalSoal.tipe,
        deskripsi: modalSoal.deskripsi,
        sudahDikerjakan: false,
      },
    });

    setModalSoal({ open: false, pertemuanId: null, judul: "", tipe: "PILIHAN_GANDA", deskripsi: "" });
    setToastMessage("Lembar tugas / soal berhasil diperbarui!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handler: Hapus Pertemuan
  const handleDeletePertemuan = (pertemuanId: string, judul: string) => {
    if (!activeClass) return;
    if (confirm(`Apakah Anda yakin ingin menghapus "${judul}" dari alur kelas ini?`)) {
      deletePertemuan(activeClass.id, pertemuanId);
      setToastMessage(`"${judul}" berhasil dihapus.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Handler: Simpan Edit Nilai Siswa
  const handleSaveNilaiSiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClass || !modalEditNilai.siswa) return;

    updateStudentGrade(
      activeClass.id,
      modalEditNilai.siswa.siswaId,
      modalEditNilai.pertemuanNomor,
      modalEditNilai.nilai
    );

    setModalEditNilai({ open: false, siswa: null, pertemuanNomor: "1", nilai: 90 });
    setToastMessage(`Nilai pertemuan P-${modalEditNilai.pertemuanNomor} untuk ${modalEditNilai.siswa.nama} berhasil diperbarui!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handler: Toggle Absensi Siswa
  const handleToggleAbsensi = (siswaId: string, meetingKey: string, currentStatus: "H" | "I" | "S" | "A") => {
    if (!activeClass) return;
    const nextStatusMap: Record<"H" | "I" | "S" | "A", "H" | "I" | "S" | "A"> = {
      H: "I",
      I: "S",
      S: "A",
      A: "H",
    };
    const nextStatus = nextStatusMap[currentStatus];
    updateStudentAbsensi(activeClass.id, siswaId, meetingKey, nextStatus);
  };

  // Ekspor Rekap Nilai Kelas ke CSV
  const handleExportNilaiKelas = () => {
    if (!activeClass) return;
    const meetings = activeClass.pertemuanList;
    const headers = [
      "NISN",
      "Nama Siswa",
      "Kelas",
      ...meetings.map((m) => `P-${m.nomor}`),
      "Nilai Akhir",
      "Predikat",
    ];

    const rows = currentClassGrades.map((rec) => {
      const scores = meetings.map((m) => rec.nilaiPerPertemuan[String(m.nomor)] ?? 85);
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length));
      const pred = avg >= 90 ? "A" : avg >= 80 ? "B" : avg >= 75 ? "C" : "D";
      return [rec.nisn, `"${rec.nama}"`, rec.kelas, ...scores, avg, pred];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Nilai_${activeClass.kode}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage(`Rekap nilai ${activeClass.nama} berhasil diekspor ke format CSV!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Ekspor Rekap Absensi Kelas ke CSV
  const handleExportAbsensiKelas = () => {
    if (!activeClass) return;
    const meetings = activeClass.pertemuanList;
    const headers = [
      "NISN",
      "Nama Siswa",
      "Kelas",
      ...meetings.map((m) => `P-${m.nomor}`),
      "Total Hadir",
      "% Kehadiran",
    ];

    const rows = currentClassAbsensi.map((rec) => {
      const attendance = meetings.map((m) => rec.absensiPerPertemuan[String(m.nomor)] ?? "H");
      const hadirCount = attendance.filter((st) => st === "H").length;
      const pct = Math.round((hadirCount / Math.max(1, meetings.length)) * 100);
      return [rec.nisn, `"${rec.nama}"`, rec.kelas, ...attendance, `${hadirCount}/${meetings.length}`, `${pct}%`];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Absensi_${activeClass.kode}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage(`Rekap absensi ${activeClass.nama} berhasil diekspor ke format CSV!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // =========================================================================
  // TAMPILAN 1: DAFTAR KOTAK KELAS (SERUPA DENGAN SISWA + TOMBOL TAMBAH KELAS)
  // =========================================================================
  if (!activeClass) {
    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Toast Notifikasi */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Header Halaman & Tombol Tambah Kelas Baru di Bagian Atas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5 text-[#2A2C5E]" />
              <span>Portal Manajemen Pembelajaran Dewan Guru</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Kelas & Materi Pembelajaran
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Kelola ruang kelas rombel binaan, silabus pertemuan, modul ajar, dan lembar evaluasi siswa.
            </p>
          </div>

          {/* Tombol Utama: Tambah Kelas Baru di Atas */}
          <button
            type="button"
            onClick={() => setModalTambahKelas(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2A2C5E] hover:bg-[#1F2147] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Kelas Baru</span>
          </button>
        </div>

        {/* Input Cari Kelas */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kelas yang ingin dikelola (contoh: Biologi, Matematika, Fisika, XII MIPA)..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
            />
          </div>
        </div>

        {/* Grid Kotak-Kotak Kelas (Persis seperti tampilan Siswa, 2 Kolom di Mobile) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              Daftar Kotak Kelas Mata Pelajaran ({displayedClasses.length})
            </h2>
            <p className="text-xs text-gray-500 hidden sm:block">
              Klik salah satu kotak kelas untuk masuk ke ruang kelas, menambah materi, mengelola soal, dan melihat rekap.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
            {displayedClasses.map((cls) => {
              const totalMeetings = cls.pertemuanList.length;
              return (
                <div
                  key={cls.id}
                  className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3.5 sm:p-5 shadow-2xs hover:border-[#2A2C5E] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded bg-blue-50 text-[#2A2C5E] border border-blue-100 shrink-0">
                        {cls.kode}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">
                        {cls.ruang}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-base font-bold text-gray-900 leading-snug line-clamp-2 min-h-[2rem] sm:min-h-0">
                      {cls.nama}
                    </h3>

                    <div className="text-[10px] sm:text-xs text-gray-600 flex items-center justify-between pt-1">
                      <span>Tingkat: Kelas {cls.tingkat} ({cls.jurusan})</span>
                      <span className="font-semibold text-[#2A2C5E]">{totalMeetings} Pertemuan</span>
                    </div>

                    <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-100 flex items-center justify-between">
                      <span>Guru: {cls.guruNama}</span>
                      <span className="text-emerald-700 font-medium">8 Siswa</span>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                    <span className="text-[9px] sm:text-[11px] text-gray-500 font-medium truncate">
                      {cls.jadwal}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveClassId(cls.id);
                        selectClass(cls.id);
                        router.push(`/guru/mapel?id=${cls.id}`);
                      }}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-[10px] sm:text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs transition-all cursor-pointer shrink-0"
                    >
                      <span>Buka Ruang Kelas</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal: Tambah Kelas Baru */}
        {modalTambahKelas && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-gray-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-blue-50 text-[#2A2C5E] rounded-lg">
                    <PlusCircle className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-bold text-gray-900">
                    Tambah Ruang Kelas Mata Pelajaran
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalTambahKelas(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateClass} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Nama Mata Pelajaran:
                  </label>
                  <input
                    type="text"
                    value={inputNamaKelas}
                    onChange={(e) => setInputNamaKelas(e.target.value)}
                    placeholder="Contoh: Kimia Terapan & Reaksi Organik"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Kode Kelas (Singkat):
                    </label>
                    <input
                      type="text"
                      value={inputKodeKelas}
                      onChange={(e) => setInputKodeKelas(e.target.value)}
                      placeholder="KIM-XII-MIPA"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Tingkat & Rombel:
                    </label>
                    <input
                      type="text"
                      value={inputJurusanKelas}
                      onChange={(e) => setInputJurusanKelas(e.target.value)}
                      placeholder="XII MIPA 1"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Ruang Belajar:
                    </label>
                    <input
                      type="text"
                      value={inputRuangKelas}
                      onChange={(e) => setInputRuangKelas(e.target.value)}
                      placeholder="Lab Kimia"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Jadwal Pembelajaran:
                    </label>
                    <input
                      type="text"
                      value={inputJadwalKelas}
                      onChange={(e) => setInputJadwalKelas(e.target.value)}
                      placeholder="Kamis, 10:00 - 12:00 WIB"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalTambahKelas(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan & Buka Kelas</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // TAMPILAN 2: DI DALAM KELAS YANG DIKLIK (WORKSPACE KELAS GURU)
  // =========================================================================
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Notifikasi */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigasi Kembali ke Daftar Seluruh Kelas */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setActiveClassId(null);
            selectClass(null);
            router.push("/guru/mapel");
          }}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2A2C5E] hover:text-[#1F2147] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Seluruh Kelas</span>
        </button>

        <span className="text-xs text-gray-400">
          Kurikulum Merdeka &bull; SMAN 2 Buay Bahuga
        </span>
      </div>

      {/* Institutional Banner Kelas Aktif */}
      <div className="bg-[#2A2C5E] text-white rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white/15 text-blue-100 text-[11px] font-bold">
            <span>{activeClass.kode}</span>
            <span>&bull;</span>
            <span>{activeClass.ruang}</span>
            <span>&bull;</span>
            <span>Kelas {activeClass.tingkat} ({activeClass.jurusan})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {activeClass.nama}
          </h1>
        </div>

        {/* Tombol Tambah Pertemuan Baru pada Banner */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push(`/guru/mapel/tambah-pertemuan?classId=${activeClass.id}`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#2A2C5E] hover:bg-gray-100 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Pertemuan Baru</span>
          </button>
        </div>
      </div>

      {/* 3 Tab Navigasi di Dalam Kelas: ALUR PERTEMUAN | REKAP NILAI | REKAP ABSENSI */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setClassTab("PERTEMUAN")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            classTab === "PERTEMUAN"
              ? "bg-[#2A2C5E] text-white shadow-xs"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Alur Pertemuan & Materi/Soal ({activeClass.pertemuanList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setClassTab("NILAI")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            classTab === "NILAI"
              ? "bg-[#2A2C5E] text-white shadow-xs"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Rekap Nilai Siswa (Matriks Nilai)</span>
        </button>

        <button
          type="button"
          onClick={() => setClassTab("ABSENSI")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            classTab === "ABSENSI"
              ? "bg-[#2A2C5E] text-white shadow-xs"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Rekap Absensi Siswa (Matriks Absensi)</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: ALUR PERTEMUAN SISWA (MATERI & SOAL EVALUASI) */}
      {/* ===================================================================== */}
      {classTab === "PERTEMUAN" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Alur Silabus Pertemuan Siswa ({activeClass.pertemuanList.length} Sesi Terjadwal)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Seluruh materi dan lembar soal di bawah ini otomatis tampil dan dikerjakan siswa di kelas ini.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/guru/mapel/tambah-pertemuan?classId=${activeClass.id}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah Pertemuan Baru</span>
            </button>
          </div>

          <div className="space-y-4">
            {activeClass.pertemuanList.map((pt) => {
              const isUts = pt.tipe === "UTS";
              const isUas = pt.tipe === "UAS";
              const isSpecial = isUts || isUas;

              return (
                <div
                  key={pt.id}
                  className={`bg-white rounded-2xl border transition-all shadow-2xs overflow-hidden ${
                    isSpecial
                      ? "border-[#2A2C5E] ring-1 ring-[#2A2C5E]/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Header Bar Pertemuan */}
                  <div
                    className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${
                      isSpecial ? "bg-[#2A2C5E]/5 border-[#2A2C5E]/20" : "bg-gray-50/80 border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                          isUts
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : isUas
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-blue-100 text-[#2A2C5E] border border-blue-200"
                        }`}
                      >
                        {isUts ? "UJIAN TENGAH SEMESTER (UTS)" : isUas ? "UJIAN AKHIR SEMESTER (UAS)" : `Pertemuan 0${pt.nomor}`}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-gray-900">
                        {pt.judul}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{pt.tanggal}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeletePertemuan(pt.id, pt.judul)}
                        className="text-gray-400 hover:text-rose-600 cursor-pointer p-1"
                        title="Hapus Pertemuan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Isi Konten Pertemuan: Modul Materi + Lembar Tugas / Soal */}
                  <div className="p-4 sm:p-6 space-y-4">
                    {/* 1. Modul Materi Pembelajaran */}
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 text-[#2A2C5E] shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              Modul Materi Ajar ({pt.materi?.tipe || "DOKUMEN"})
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                              Tersedia untuk Siswa
                            </span>
                          </div>
                          <h5 className="text-sm font-bold text-gray-900 mt-0.5">
                            {pt.materi?.judul || "Belum ada judul materi"}
                          </h5>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                            {pt.materi?.ringkasan || "Klik tombol kelola materi untuk menambahkan isi rangkuman pembelajaran."}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setModalMateri({
                            open: true,
                            pertemuanId: pt.id,
                            judul: pt.materi?.judul || `Materi Pertemuan ${pt.nomor}`,
                            tipe: pt.materi?.tipe || "DOKUMEN",
                            ringkasan: pt.materi?.ringkasan || "",
                            kontenLengkap: pt.materi?.kontenLengkap || "",
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2A2C5E] bg-white border border-[#2A2C5E]/30 hover:bg-[#2A2C5E] hover:text-white rounded-lg transition-colors shrink-0 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Kelola Materi</span>
                      </button>
                    </div>

                    {/* 2. Lembar Tugas / Soal Ujian CBT */}
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              {isSpecial ? "Asesmen Sumatif CBT" : pt.tugas?.tipe === "ESSAY" ? "Tugas Essay" : "Latihan Soal Pilihan Ganda"}
                            </span>
                            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.2 rounded border border-blue-200">
                              {pt.tugas?.soalPilgan ? `${pt.tugas.soalPilgan.length} Butir Soal` : "3 Butir Evaluasi"}
                            </span>
                          </div>
                          <h5 className="text-sm font-bold text-gray-900 mt-0.5">
                            {pt.tugas?.judul || "Belum ada tugas"}
                          </h5>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                            {pt.tugas?.deskripsi || "Klik tombol kelola soal untuk menambah pertanyaan atau petunjuk ujian."}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setModalSoal({
                            open: true,
                            pertemuanId: pt.id,
                            judul: pt.tugas?.judul || `Latihan Evaluasi Pertemuan ${pt.nomor}`,
                            tipe: pt.tugas?.tipe || (isSpecial ? "UJIAN_UTS" : "PILIHAN_GANDA"),
                            deskripsi: pt.tugas?.deskripsi || "",
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-white border border-amber-300 hover:bg-amber-600 hover:text-white rounded-lg transition-colors shrink-0 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Kelola Lembar Soal</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: REKAPITULASI NILAI SISWA KELAS INI (MATRIKS PER PERTEMUAN) */}
      {/* ===================================================================== */}
      {classTab === "NILAI" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Matriks Rekapitulasi Nilai Siswa &bull; {activeClass.nama}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Nilai per pertemuan siswa (P-1 s/d UTS dan UAS). Klik angka nilai untuk mengedit secara langsung.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportNilaiKelas}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Rekap Nilai (CSV)</span>
            </button>
          </div>

          {/* Tabel Matriks Nilai Per Pertemuan */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    <th className="py-3 px-4 min-w-[160px]">Nama Siswa</th>
                    <th className="py-3 px-3">NISN</th>
                    {activeClass.pertemuanList.map((m) => (
                      <th key={m.id} className="py-3 px-2 text-center min-w-[50px]">
                        {m.tipe === "UTS" ? "UTS" : m.tipe === "UAS" ? "UAS" : `P-${m.nomor}`}
                      </th>
                    ))}
                    <th className="py-3 px-3 text-center min-w-[70px]">Rata-rata</th>
                    <th className="py-3 px-3 text-center min-w-[70px]">Predikat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {currentClassGrades.map((rec) => {
                    const scores = activeClass.pertemuanList.map(
                      (m) => rec.nilaiPerPertemuan[String(m.nomor)] ?? 85
                    );
                    const avg = Math.round(
                      scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length)
                    );
                    const pred = avg >= 90 ? "A" : avg >= 80 ? "B" : avg >= 75 ? "C" : "D";

                    return (
                      <tr key={rec.siswaId} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-900">
                          {rec.nama}
                        </td>
                        <td className="py-3 px-3 text-gray-400 font-mono text-[11px]">
                          {rec.nisn}
                        </td>

                        {activeClass.pertemuanList.map((m) => {
                          const val = rec.nilaiPerPertemuan[String(m.nomor)] ?? 85;
                          return (
                            <td key={m.id} className="py-3 px-2 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  setModalEditNilai({
                                    open: true,
                                    siswa: rec,
                                    pertemuanNomor: String(m.nomor),
                                    nilai: val,
                                  })
                                }
                                className="w-9 h-7 rounded font-mono font-bold text-xs bg-gray-50 hover:bg-blue-50 hover:text-[#2A2C5E] hover:border hover:border-[#2A2C5E] transition-all cursor-pointer"
                                title={`Edit nilai ${rec.nama} pada pertemuan ${m.nomor}`}
                              >
                                {val}
                              </button>
                            </td>
                          );
                        })}

                        <td className="py-3 px-3 text-center font-mono font-bold text-[#2A2C5E]">
                          {avg}
                        </td>

                        <td className="py-3 px-3 text-center font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              pred === "A"
                                ? "bg-emerald-50 text-emerald-700"
                                : pred === "B"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {pred}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: REKAPITULASI ABSENSI SISWA KELAS INI (MATRIKS PER PERTEMUAN) */}
      {/* ===================================================================== */}
      {classTab === "ABSENSI" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Matriks Rekapitulasi Absensi Siswa &bull; {activeClass.nama}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Daftar kehadiran per pertemuan siswa (H: Hadir, I: Izin, S: Sakit, A: Alpa). Klik status untuk mengubah.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportAbsensiKelas}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Rekap Absensi (CSV)</span>
            </button>
          </div>

          {/* Tabel Matriks Absensi Per Pertemuan */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    <th className="py-3 px-4 min-w-[160px]">Nama Siswa</th>
                    <th className="py-3 px-3">NISN</th>
                    {activeClass.pertemuanList.map((m) => (
                      <th key={m.id} className="py-3 px-2 text-center min-w-[45px]">
                        {m.tipe === "UTS" ? "UTS" : m.tipe === "UAS" ? "UAS" : `P-${m.nomor}`}
                      </th>
                    ))}
                    <th className="py-3 px-3 text-center min-w-[70px]">Total Hadir</th>
                    <th className="py-3 px-3 text-center min-w-[70px]">% Hadir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {currentClassAbsensi.map((rec) => {
                    const attendance = activeClass.pertemuanList.map(
                      (m) => rec.absensiPerPertemuan[String(m.nomor)] ?? "H"
                    );
                    const totalHadir = attendance.filter((st) => st === "H").length;
                    const pct = Math.round(
                      (totalHadir / Math.max(1, activeClass.pertemuanList.length)) * 100
                    );

                    return (
                      <tr key={rec.siswaId} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-900">
                          {rec.nama}
                        </td>
                        <td className="py-3 px-3 text-gray-400 font-mono text-[11px]">
                          {rec.nisn}
                        </td>

                        {activeClass.pertemuanList.map((m) => {
                          const status = rec.absensiPerPertemuan[String(m.nomor)] ?? "H";
                          return (
                            <td key={m.id} className="py-3 px-2 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleAbsensi(rec.siswaId, String(m.nomor), status)
                                }
                                className={`w-7 h-7 rounded text-[11px] font-bold transition-all cursor-pointer ${
                                  status === "H"
                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                    : status === "I"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                    : status === "S"
                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                    : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                                }`}
                                title={`Klik untuk ganti status kehadiran ${rec.nama} pada pertemuan ${m.nomor}`}
                              >
                                {status}
                              </button>
                            </td>
                          );
                        })}

                        <td className="py-3 px-3 text-center font-mono font-bold text-gray-800">
                          {totalHadir}/{activeClass.pertemuanList.length}
                        </td>

                        <td className="py-3 px-3 text-center font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              pct >= 85
                                ? "bg-emerald-50 text-emerald-700"
                                : pct >= 75
                                ? "bg-blue-50 text-blue-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: KELOLA / TAMBAH MATERI PEMBELAJARAN PADA PERTEMUAN */}
      {/* ===================================================================== */}
      {modalMateri.open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 text-[#2A2C5E] rounded-lg">
                  <FileText className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-gray-900">
                  Kelola Modul Materi Pembelajaran
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalMateri({ ...modalMateri, open: false })}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMateri} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Judul Modul Materi:
                </label>
                <input
                  type="text"
                  value={modalMateri.judul}
                  onChange={(e) => setModalMateri({ ...modalMateri, judul: e.target.value })}
                  placeholder="Contoh: Modul Ajar Bab 2: Replikasi DNA"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Tipe Format Bahan Ajar:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["DOKUMEN", "VIDEO", "RINGKASAN"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setModalMateri({ ...modalMateri, tipe: t })}
                      className={`p-2 rounded-lg border font-semibold text-center transition-all cursor-pointer ${
                        modalMateri.tipe === t
                          ? "bg-[#2A2C5E] text-white border-[#2A2C5E]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {t === "DOKUMEN" ? "PDF / Dokumen" : t === "VIDEO" ? "Video Ajar" : "Rangkuman Teks"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Ringkasan Materi (Ditampilkan kepada Siswa):
                </label>
                <textarea
                  value={modalMateri.ringkasan}
                  onChange={(e) => setModalMateri({ ...modalMateri, ringkasan: e.target.value })}
                  placeholder="Tuliskan poin-poin esensial dari modul pembelajaran ini..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                  required
                />
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalMateri({ ...modalMateri, open: false })}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Materi ke Kelas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: KELOLA / TAMBAH SOAL TUGAS PADA PERTEMUAN */}
      {/* ===================================================================== */}
      {modalSoal.open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-50 text-amber-800 rounded-lg">
                  <Award className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-gray-900">
                  Kelola Lembar Soal & Evaluasi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalSoal({ ...modalSoal, open: false })}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSoal} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Judul Asesmen / Tugas:
                </label>
                <input
                  type="text"
                  value={modalSoal.judul}
                  onChange={(e) => setModalSoal({ ...modalSoal, judul: e.target.value })}
                  placeholder="Contoh: Latihan Formatif Pilihan Ganda"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Format Soal:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["PILIHAN_GANDA", "ESSAY", "UJIAN_UTS"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setModalSoal({ ...modalSoal, tipe: t })}
                      className={`p-2 rounded-lg border font-semibold text-center transition-all cursor-pointer ${
                        modalSoal.tipe === t
                          ? "bg-[#2A2C5E] text-white border-[#2A2C5E]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {t === "PILIHAN_GANDA" ? "Pilihan Ganda" : t === "ESSAY" ? "Uraian / Essay" : "Ujian CBT"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Petunjuk Pengerjaan & Deskripsi Soal:
                </label>
                <textarea
                  value={modalSoal.deskripsi}
                  onChange={(e) => setModalSoal({ ...modalSoal, deskripsi: e.target.value })}
                  placeholder="Jelaskan petunjuk pengerjaan bagi siswa..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                  required
                />
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalSoal({ ...modalSoal, open: false })}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Lembar Soal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: EDIT NILAI SISWA PER PERTEMUAN */}
      {/* ===================================================================== */}
      {modalEditNilai.open && modalEditNilai.siswa && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4 border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 text-[#2A2C5E] rounded-lg">
                  <Award className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Input Nilai Siswa
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {modalEditNilai.siswa.nama} &bull; P-{modalEditNilai.pertemuanNomor}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalEditNilai({ ...modalEditNilai, open: false })}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNilaiSiswa} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Nilai Pertemuan {modalEditNilai.pertemuanNomor} (0 - 100):
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={modalEditNilai.nilai}
                  onChange={(e) =>
                    setModalEditNilai({ ...modalEditNilai, nilai: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono font-bold text-base text-[#2A2C5E] focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                  required
                />
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalEditNilai({ ...modalEditNilai, open: false })}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Nilai</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GuruMapelPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-gray-500 font-medium">
          Memuat Ruang Kelas & Materi Pembelajaran Guru...
        </div>
      }
    >
      <GuruMapelContent />
    </Suspense>
  );
}
