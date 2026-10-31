"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  Save,
  Trash2,
  Video,
  Upload,
  Link2,
  Check,
  Award,
  Layers,
  ChevronDown,
  Filter,
} from "lucide-react";
import { useLMSStore, PertemuanItem, SoalPilgan } from "@/lib/lmsStore";

function TambahPertemuanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classIdParam = searchParams.get("classId");

  const { classes, addPertemuan } = useLMSStore();

  // Kelas yang aktif
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classIdParam || classes[0]?.id || "mapel-1"
  );

  const activeClass = useMemo(() => {
    return classes.find((c) => c.id === selectedClassId) || classes[0];
  }, [classes, selectedClassId]);

  // Nomor pertemuan otomatis berikutnya (selalu melanjutkan nomor sesi terakhir)
  const [nomorPertemuan, setNomorPertemuan] = useState<number>(1);
  const [judulPertemuan, setJudulPertemuan] = useState<string>("");

  useEffect(() => {
    if (activeClass?.pertemuanList) {
      const nextNum = activeClass.pertemuanList.length + 1;
      setNomorPertemuan(nextNum);
      if (!judulPertemuan) {
        setJudulPertemuan(`Pertemuan ${nextNum}: Pendalaman Materi dan Evaluasi Pemahaman`);
      }
    }
  }, [activeClass]);

  // Dropdown States (Hanya terbuka ketika tombol filter diklik)
  const [openDropdown, setOpenDropdown] = useState<
    "KATEGORI" | "FORMAT_MATERI" | "JENIS_TUGAS" | null
  >(null);

  // Kategori Sesi Pembelajaran (Pilihan Dropdown)
  const [kategoriSesi, setKategoriSesi] = useState<"REGULER" | "HARIAN" | "UTS" | "UAS">("REGULER");

  // Format Bahan Ajar (Pilihan Dropdown)
  const [formatMateri, setFormatMateri] = useState<"DOKUMEN" | "VIDEO" | "RINGKASAN" | "NONE">("DOKUMEN");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("Modul_Ajar_SMAN2_BahanAjar.pdf");
  const [materiFileUrl, setMateriFileUrl] = useState<string>("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [materiRingkasan, setMateriRingkasan] = useState<string>(
    "Pelajari materi ini dengan cermat sebelum melanjutkan ke sesi evaluasi."
  );
  const [materiKontenLengkap, setMateriKontenLengkap] = useState<string>("");

  // Jenis Asesmen / Tugas (Pilihan Dropdown - Tanpa input judul lembar terpisah)
  const [jenisAsesmen, setJenisAsesmen] = useState<"PILIHAN_GANDA" | "ESSAY" | "NONE">("PILIHAN_GANDA");
  const [durasiMenit, setDurasiMenit] = useState<number>(60);
  const [pertanyaanEssay, setPertanyaanEssay] = useState<string>(
    "Jelaskan kesimpulan dan analisis kritis Anda terhadap materi yang telah dipelajari pada pertemuan ini."
  );

  // Tenggat Pengumpulan (Deadline) Profesional: Pemilih Tanggal & Waktu (Tanpa Mengetik Teks Manual)
  const getFutureDateISO = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const [deadlineDate, setDeadlineDate] = useState<string>(getFutureDateISO(7));
  const [deadlineTime, setDeadlineTime] = useState<string>("23:59");
  const [presetActive, setPresetActive] = useState<"3_HARI" | "7_HARI" | "14_HARI" | "CUSTOM">("7_HARI");

  // Helper konversi tanggal & waktu ISO ke format resmi Indonesia
  const formattedIndonesianDeadline = useMemo(() => {
    if (!deadlineDate) return "Sesuai Jadwal";
    try {
      const [year, month, day] = deadlineDate.split("-").map(Number);
      const d = new Date(year, month - 1, day);
      const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember",
      ];
      const dayName = dayNames[d.getDay()] || "Senin";
      const monthName = monthNames[d.getMonth()] || "Januari";
      return `${dayName}, ${day} ${monthName} ${year}, ${deadlineTime || "23:59"} WIB`;
    } catch {
      return `${deadlineDate}, ${deadlineTime} WIB`;
    }
  }, [deadlineDate, deadlineTime]);

  // Handler Pilih Berkas PDF Riil
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  // Daftar Butir Soal Pilihan Ganda (CBT)
  const [soalPilganList, setSoalPilganList] = useState<SoalPilgan[]>([
    {
      id: 1,
      pertanyaan: "Berdasarkan materi yang dipelajari pada sesi ini, konsep utama yang menjadi fokus pembahasan adalah...",
      pilihan: [
        "Pemahaman dasar teori dan implementasi praktis",
        "Pengamatan tanpa analisis data ilmiah",
        "Pencatatan data tanpa penarikan kesimpulan",
        "Metode coba-coba tanpa kajian pustaka",
      ],
      kunci: 0,
    },
    {
      id: 2,
      pertanyaan: "Faktor terpenting dalam memastikan keberhasilan penerapan materi pembelajaran ini adalah...",
      pilihan: [
        "Integritas ilmiah, penalaran kritis, dan ketelitian kerja",
        "Kecepatan menyelesaikan tanpa proses verifikasi",
        "Menghafal rumus tanpa memahami konsep dasar",
        "Mengabaikan prosedur keselamatan kerja laboratorium",
      ],
      kunci: 0,
    },
  ]);

  const handleAddSoalPilgan = () => {
    const nextId = soalPilganList.length + 1;
    setSoalPilganList([
      ...soalPilganList,
      {
        id: nextId,
        pertanyaan: `Tuliskan butir pertanyaan nomor ${nextId} di sini...`,
        pilihan: ["Pilihan Jawaban A", "Pilihan Jawaban B", "Pilihan Jawaban C", "Pilihan Jawaban D"],
        kunci: 0,
      },
    ]);
  };

  const handleUpdatePertanyaan = (index: number, text: string) => {
    const updated = [...soalPilganList];
    updated[index].pertanyaan = text;
    setSoalPilganList(updated);
  };

  const handleUpdatePilihan = (soalIndex: number, opsiIndex: number, text: string) => {
    const updated = [...soalPilganList];
    updated[soalIndex].pilihan[opsiIndex] = text;
    setSoalPilganList(updated);
  };

  const handleUpdateKunci = (soalIndex: number, kunciIndex: number) => {
    const updated = [...soalPilganList];
    updated[soalIndex].kunci = kunciIndex;
    setSoalPilganList(updated);
  };

  const handleDeleteSoal = (index: number) => {
    if (soalPilganList.length <= 1) {
      alert("Harus ada minimal 1 butir soal pilihan ganda.");
      return;
    }
    setSoalPilganList(soalPilganList.filter((_, i) => i !== index));
  };

  // Submit Handler
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClass) return;

    setIsSubmitting(true);

    const meetingId = `${activeClass.id}-p${Date.now().toString().slice(-4)}`;
    const finalJudul = judulPertemuan.trim() || `Pertemuan ${nomorPertemuan}: Pendalaman Materi`;
    const automatedSchedule = activeClass.jadwal || "Senin, 07:30 - 09:30 WIB";

    // Konversi kategori ke tipe pertemuan store
    const storeTipe: "REGULER" | "UTS" | "UAS" =
      kategoriSesi === "UTS" ? "UTS" : kategoriSesi === "UAS" ? "UAS" : "REGULER";

    // Modul Materi
    const materiData =
      formatMateri !== "NONE"
        ? {
            judul: `Bahan Ajar Pertemuan ${nomorPertemuan}: ${finalJudul}`,
            tipe: formatMateri as "DOKUMEN" | "VIDEO" | "RINGKASAN",
            ringkasan:
              materiRingkasan.trim() ||
              (formatMateri === "DOKUMEN"
                ? `Berkas modul: ${uploadedFileName}`
                : formatMateri === "VIDEO"
                ? "Simak video penjelasan materi."
                : "Rangkuman materi kurikulum merdeka."),
            kontenLengkap:
              materiKontenLengkap.trim() ||
              materiRingkasan.trim() ||
              "Materi bahan ajar resmi Kurikulum Merdeka SMAN 2 Buay Bahuga.",
            fileUrl:
              formatMateri === "VIDEO"
                ? materiFileUrl
                : formatMateri === "DOKUMEN"
                ? uploadedFileName
                : undefined,
            sudahDibaca: false,
          }
        : undefined;

    // Asesmen / Tugas (Judul otomatis mengikuti judul pertemuan)
    let finalTugasTipe: "PILIHAN_GANDA" | "ESSAY" | "UJIAN_UTS" | "UJIAN_UAS" = "PILIHAN_GANDA";
    if (kategoriSesi === "UTS") {
      finalTugasTipe = "UJIAN_UTS";
    } else if (kategoriSesi === "UAS") {
      finalTugasTipe = "UJIAN_UAS";
    } else if (jenisAsesmen === "ESSAY") {
      finalTugasTipe = "ESSAY";
    }

    const tugasData =
      jenisAsesmen !== "NONE"
        ? {
            id: `tugas-${meetingId}`,
            judul: `Evaluasi ${finalJudul}`,
            tipe: finalTugasTipe,
            deskripsi: "Jawablah butir pertanyaan evaluasi berikut secara mandiri dan teliti.",
            deadline: formattedIndonesianDeadline,
            soalPilgan:
              finalTugasTipe === "PILIHAN_GANDA" || finalTugasTipe === "UJIAN_UTS" || finalTugasTipe === "UJIAN_UAS"
                ? soalPilganList
                : undefined,
            pertanyaanEssay:
              finalTugasTipe === "ESSAY"
                ? pertanyaanEssay.trim() ||
                  "Jelaskan kesimpulan dan analisis kritis Anda terhadap materi yang telah dipelajari pada pertemuan ini."
                : undefined,
            sudahDikerjakan: false,
          }
        : undefined;

    const newMeeting: PertemuanItem = {
      id: meetingId,
      nomor: Number(nomorPertemuan),
      judul: finalJudul,
      tipe: storeTipe,
      tanggal: automatedSchedule,
      durasiMenit: jenisAsesmen !== "NONE" ? durasiMenit : undefined,
      materi: materiData,
      tugas: tugasData,
      presensi: {
        hadir: false,
      },
    };

    // Tambah ke store
    addPertemuan(activeClass.id, newMeeting);

    // Sinkronisasi Supabase
    try {
      await fetch("/api/guru/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_MATERI",
          payload: {
            classId: activeClass.id,
            pertemuan: newMeeting,
          },
        }),
      });
    } catch (err) {
      console.warn("Gagal kirim sync ke Supabase:", err);
    }

    setIsSubmitting(false);
    router.push(`/guru/mapel?id=${activeClass.id}&toast=added`);
  };

  // Label Map untuk Tampilan Pilihan Aktif
  const kategoriLabelMap = {
    REGULER: "Sesi Reguler / Formatif",
    HARIAN: "Penilaian Harian (Kuis)",
    UTS: "Ujian Tengah Semester (UTS)",
    UAS: "Ujian Akhir Semester (UAS)",
  };

  const formatMateriLabelMap = {
    DOKUMEN: "Modul PDF Digital",
    VIDEO: "Video Pembelajaran",
    RINGKASAN: "Catatan Rangkuman Teks",
    NONE: "Tanpa Bahan Ajar",
  };

  const jenisAsesmenLabelMap = {
    PILIHAN_GANDA: "Pilihan Ganda (CBT)",
    ESSAY: "Tugas Essay / Uraian",
    NONE: "Tanpa Tugas Evaluasi",
  };

  return (
    <div className="w-full space-y-4 pb-16">
      {/* Backdrop transparan untuk menutup dropdown saat klik di luar */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setOpenDropdown(null)}
        />
      )}

      {/* Navigasi Breadcrumb Kembali */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
        <Link
          href={`/guru/mapel?id=${activeClass?.id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-[#2A2C5E] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500" />
          <span>Kembali ke Ruang Kelas {activeClass?.nama}</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-semibold text-gray-800">{activeClass?.kode}</span>
          <span>&bull;</span>
          <span>{activeClass?.ruang}</span>
          <span>&bull;</span>
          <span>Kelas {activeClass?.tingkat} ({activeClass?.jurusan})</span>
        </div>
      </div>

      {/* FORMULIR UTAMA TERPADU: 1 CONTAINER INSTITUSIONAL BERSIH */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs divide-y divide-gray-100 overflow-visible">
          {/* =============================================================== */}
          {/* BAGIAN 1: HEADER & IDENTITAS OTOMATIS */}
          {/* =============================================================== */}
          <div className="p-5 sm:p-6 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-[#2A2C5E] text-white text-xs font-bold tracking-wide">
                  Pertemuan ke-{nomorPertemuan}
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-xs text-gray-700 font-medium flex items-center gap-1.5 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span>Jadwal Resmi: {activeClass?.jadwal || "Senin, 07:30 - 09:30 WIB"}</span>
                </span>
              </div>
              <div className="pt-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Judul Sesi Pembelajaran:
                </label>
                <input
                  type="text"
                  value={judulPertemuan}
                  onChange={(e) => setJudulPertemuan(e.target.value)}
                  placeholder={`Contoh: Pertemuan ${nomorPertemuan}: Pendalaman Materi dan Evaluasi`}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#2A2C5E] focus:ring-1 focus:ring-[#2A2C5E]"
                  required
                />
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* BAGIAN 2: KATEGORI SESI (FILTER DROPDOWN PROFESIONAL) */}
          {/* =============================================================== */}
          <div className="p-4 sm:p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-900">
                Kategori Sesi Pertemuan
              </label>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Tentukan format agenda sesi pembelajaran rombel.
              </p>
            </div>

            {/* Filter Dropdown Button */}
            <div className="relative z-30">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "KATEGORI" ? null : "KATEGORI")}
                className="inline-flex items-center gap-2.5 px-3.5 py-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-[#2A2C5E]" />
                <span className="font-bold text-[#2A2C5E]">{kategoriLabelMap[kategoriSesi]}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-500 transition-transform ${
                    openDropdown === "KATEGORI" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Menu Pilihan Dropdown Kategori */}
              {openDropdown === "KATEGORI" && (
                <div className="absolute right-0 sm:right-0 left-0 sm:left-auto top-full mt-1.5 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-40 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                    Pilih Kategori Sesi
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setKategoriSesi("REGULER");
                      setJenisAsesmen("PILIHAN_GANDA");
                      setDurasiMenit(60);
                      setOpenDropdown(null);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      kategoriSesi === "REGULER"
                        ? "bg-gray-100 text-[#2A2C5E] font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <div>Sesi Reguler / Formatif</div>
                      <div className="text-[10px] text-gray-500 font-normal">Materi tatap muka &amp; latihan soal</div>
                    </div>
                    {kategoriSesi === "REGULER" && <Check className="w-4 h-4 text-[#2A2C5E]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setKategoriSesi("HARIAN");
                      setJenisAsesmen("PILIHAN_GANDA");
                      setDurasiMenit(45);
                      setOpenDropdown(null);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      kategoriSesi === "HARIAN"
                        ? "bg-gray-100 text-[#2A2C5E] font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <div>Penilaian Harian (Kuis)</div>
                      <div className="text-[10px] text-gray-500 font-normal">Kuis evaluasi pencapaian materi</div>
                    </div>
                    {kategoriSesi === "HARIAN" && <Check className="w-4 h-4 text-[#2A2C5E]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setKategoriSesi("UTS");
                      setJenisAsesmen("PILIHAN_GANDA");
                      setDurasiMenit(90);
                      setOpenDropdown(null);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      kategoriSesi === "UTS"
                        ? "bg-gray-100 text-[#2A2C5E] font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <div>Ujian Tengah Semester (UTS)</div>
                      <div className="text-[10px] text-gray-500 font-normal">Evaluasi terstruktur tengah semester</div>
                    </div>
                    {kategoriSesi === "UTS" && <Check className="w-4 h-4 text-[#2A2C5E]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setKategoriSesi("UAS");
                      setJenisAsesmen("PILIHAN_GANDA");
                      setDurasiMenit(90);
                      setOpenDropdown(null);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      kategoriSesi === "UAS"
                        ? "bg-gray-100 text-[#2A2C5E] font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <div>Ujian Akhir Semester (UAS)</div>
                      <div className="text-[10px] text-gray-500 font-normal">Evaluasi terstruktur akhir semester</div>
                    </div>
                    {kategoriSesi === "UAS" && <Check className="w-4 h-4 text-[#2A2C5E]" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* =============================================================== */}
          {/* BAGIAN 3: BAHAN AJAR SISWA (UPLOAD & INSTRUKSI LANGSUNG) */}
          {/* =============================================================== */}
          <div className="p-5 sm:p-6 bg-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-gray-100 text-gray-700">
                  <BookOpen className="w-4 h-4 text-[#2A2C5E]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Bahan Ajar Pembelajaran
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Unggah modul atau bagikan materi pembelajaran untuk dipelajari siswa.
                  </p>
                </div>
              </div>

              {/* Filter Dropdown Format Materi */}
              <div className="relative z-25">
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(openDropdown === "FORMAT_MATERI" ? null : "FORMAT_MATERI")
                  }
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-gray-600" />
                  <span>Format: <strong className="text-gray-900">{formatMateriLabelMap[formatMateri]}</strong></span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform ${
                      openDropdown === "FORMAT_MATERI" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openDropdown === "FORMAT_MATERI" && (
                  <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-40 animate-in fade-in slide-in-from-top-1">
                    <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                      Pilih Format Bahan Ajar
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFormatMateri("DOKUMEN");
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        formatMateri === "DOKUMEN"
                          ? "bg-gray-100 text-[#2A2C5E] font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span>Modul PDF Digital</span>
                      </div>
                      {formatMateri === "DOKUMEN" && <Check className="w-4 h-4 text-[#2A2C5E]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormatMateri("VIDEO");
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        formatMateri === "VIDEO"
                          ? "bg-gray-100 text-[#2A2C5E] font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-gray-600" />
                        <span>Video Pembelajaran</span>
                      </div>
                      {formatMateri === "VIDEO" && <Check className="w-4 h-4 text-[#2A2C5E]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormatMateri("RINGKASAN");
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        formatMateri === "RINGKASAN"
                          ? "bg-gray-100 text-[#2A2C5E] font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-600" />
                        <span>Catatan Rangkuman Teks</span>
                      </div>
                      {formatMateri === "RINGKASAN" && <Check className="w-4 h-4 text-[#2A2C5E]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormatMateri("NONE");
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        formatMateri === "NONE"
                          ? "bg-gray-100 text-[#2A2C5E] font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-gray-400" />
                        <span>Tanpa Bahan Ajar</span>
                      </div>
                      {formatMateri === "NONE" && <Check className="w-4 h-4 text-[#2A2C5E]" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* FORM FORMAT: DOKUMEN PDF (UPLOAD BERKAS + PERINTAH INSTRUKSI DI BAWAHNYA) */}
            {formatMateri === "DOKUMEN" && (
              <div className="space-y-3 pt-1 text-xs animate-in fade-in">
                {/* Input Berkas Tersembunyi */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />

                <div className="p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-white border border-gray-200 text-[#2A2C5E] shadow-2xs">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-900 flex items-center gap-2">
                        <span>{uploadedFileName}</span>
                        <span className="text-[10px] text-gray-500 font-normal">(Dokumen PDF)</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Berkas modul bacaan digital yang akan otomatis terdistribusi ke akun belajar siswa.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 rounded-lg text-xs font-semibold shadow-2xs cursor-pointer shrink-0 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-gray-600" />
                    <span>Unggah / Ganti Berkas PDF</span>
                  </button>
                </div>

                {/* Perintah / Instruksi Belajar di Bawahnya */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Perintah / Petunjuk Membaca Modul:
                  </label>
                  <input
                    type="text"
                    value={materiRingkasan}
                    onChange={(e) => setMateriRingkasan(e.target.value)}
                    placeholder="Contoh: Bacalah modul bab ini sebelum mengerjakan lembar evaluasi pemahaman."
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-[#2A2C5E]"
                  />
                </div>
              </div>
            )}

            {/* FORM FORMAT: VIDEO (LINK YOUTUBE + PERINTAH INSTRUKSI DI BAWAHNYA) */}
            {formatMateri === "VIDEO" && (
              <div className="space-y-3 pt-1 text-xs animate-in fade-in">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Tautan Video Pembelajaran (YouTube / Video Edukasi):
                  </label>
                  <div className="relative">
                    <Link2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={materiFileUrl}
                      onChange={(e) => setMateriFileUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full pl-9 pr-3.5 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 font-mono text-xs focus:outline-none focus:border-[#2A2C5E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Perintah / Petunjuk Menyimak Video:
                  </label>
                  <input
                    type="text"
                    value={materiRingkasan}
                    onChange={(e) => setMateriRingkasan(e.target.value)}
                    placeholder="Contoh: Simak video sampai selesai dan catat poin-poin penjelasan penting."
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-[#2A2C5E]"
                  />
                </div>
              </div>
            )}

            {/* FORM FORMAT: RINGKASAN TEKS (CATATAN MATERI + PERINTAH DI BAWAHNYA) */}
            {formatMateri === "RINGKASAN" && (
              <div className="space-y-3 pt-1 text-xs animate-in fade-in">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Catatan Materi Pembelajaran (Teks Ringkasan):
                  </label>
                  <textarea
                    rows={4}
                    value={materiKontenLengkap}
                    onChange={(e) => setMateriKontenLengkap(e.target.value)}
                    placeholder="Tuliskan materi penjelasan konsep di sini. Teks ini akan langsung tampil di alur belajar siswa..."
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-[#2A2C5E] leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Perintah / Petunjuk Siswa:
                  </label>
                  <input
                    type="text"
                    value={materiRingkasan}
                    onChange={(e) => setMateriRingkasan(e.target.value)}
                    placeholder="Contoh: Pahami konsep dasar ini dan buat catatan ringkas di buku tulis."
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-[#2A2C5E]"
                  />
                </div>
              </div>
            )}

            {formatMateri === "NONE" && (
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-center text-xs text-gray-600 animate-in fade-in">
                <div className="font-semibold text-gray-800">Sesi Belajar Tanpa Bahan Ajar</div>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Sesi ini dikhususkan untuk latihan evaluasi atau ujian mandiri tanpa modul bacaan.
                </p>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* BAGIAN 4: ASESMEN & TUGAS SISWA (LANGSUNG PILIH JENIS & DEADLINE RESMI) */}
          {/* =============================================================== */}
          <div className="p-5 sm:p-6 bg-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-gray-100 text-gray-700">
                  <Award className="w-4 h-4 text-[#2A2C5E]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Asesmen &amp; Tugas Siswa
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Langsung pilih format evaluasi dan tentukan batas waktu pengumpulan.
                  </p>
                </div>
              </div>

              {/* Filter Dropdown Jenis Tugas */}
              <div className="relative z-20">
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(openDropdown === "JENIS_TUGAS" ? null : "JENIS_TUGAS")
                  }
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5 text-gray-600" />
                  <span>Jenis Evaluasi: <strong className="text-gray-900">{jenisAsesmenLabelMap[jenisAsesmen]}</strong></span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform ${
                      openDropdown === "JENIS_TUGAS" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openDropdown === "JENIS_TUGAS" && (
                  <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-40 animate-in fade-in slide-in-from-top-1">
                    <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                      Pilih Jenis Evaluasi
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setJenisAsesmen("PILIHAN_GANDA");
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        jenisAsesmen === "PILIHAN_GANDA"
                          ? "bg-gray-100 text-[#2A2C5E] font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gray-600" />
                        <span>Pilihan Ganda (CBT)</span>
                      </div>
                      {jenisAsesmen === "PILIHAN_GANDA" && (
                        <Check className="w-4 h-4 text-[#2A2C5E]" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setJenisAsesmen("ESSAY");
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        jenisAsesmen === "ESSAY"
                          ? "bg-gray-100 text-[#2A2C5E] font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span>Tugas Essay / Uraian</span>
                      </div>
                      {jenisAsesmen === "ESSAY" && <Check className="w-4 h-4 text-[#2A2C5E]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setJenisAsesmen("NONE");
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        jenisAsesmen === "NONE"
                          ? "bg-gray-100 text-[#2A2C5E] font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-gray-400" />
                        <span>Tanpa Tugas Evaluasi</span>
                      </div>
                      {jenisAsesmen === "NONE" && <Check className="w-4 h-4 text-[#2A2C5E]" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Form Asesmen & Tenggat Waktu (Hanya muncul bila bukan TANPA TUGAS) */}
            {jenisAsesmen !== "NONE" ? (
              <div className="space-y-4 pt-1 text-xs animate-in fade-in">
                {/* TENGGAT WAKTU PROFESIONAL (PEMILIH TANGGAL & JAM RESMI, TANPA MENGETIK TEKS) */}
                <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/80 pb-2.5">
                    <span className="text-xs font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#2A2C5E]" />
                      <span>Batas Waktu Pengumpulan (Deadline Tugas):</span>
                    </span>

                    {/* Tombol Preset Cepat */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-gray-500">Pilihan Cepat:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setDeadlineDate(getFutureDateISO(3));
                          setPresetActive("3_HARI");
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
                          presetActive === "3_HARI"
                            ? "bg-[#2A2C5E] text-white border-[#2A2C5E]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        +3 Hari
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeadlineDate(getFutureDateISO(7));
                          setPresetActive("7_HARI");
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
                          presetActive === "7_HARI"
                            ? "bg-[#2A2C5E] text-white border-[#2A2C5E]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        +7 Hari
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeadlineDate(getFutureDateISO(14));
                          setPresetActive("14_HARI");
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
                          presetActive === "14_HARI"
                            ? "bg-[#2A2C5E] text-white border-[#2A2C5E]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        +14 Hari
                      </button>
                    </div>
                  </div>

                  {/* Kalender & Jam Picker Profesional (Native Date & Time Inputs) */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2 shadow-2xs">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <input
                        type="date"
                        value={deadlineDate}
                        onChange={(e) => {
                          setDeadlineDate(e.target.value);
                          setPresetActive("CUSTOM");
                        }}
                        className="text-xs font-semibold text-gray-900 bg-transparent focus:outline-none cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2 shadow-2xs">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <input
                        type="time"
                        value={deadlineTime}
                        onChange={(e) => setDeadlineTime(e.target.value)}
                        className="text-xs font-semibold text-gray-900 bg-transparent focus:outline-none cursor-pointer"
                      />
                      <span className="text-[10px] font-bold text-gray-500">WIB</span>
                    </div>

                    <div className="text-xs text-gray-600 bg-white border border-gray-200 px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs">
                      <span className="text-gray-400">Tenggat Resmi:</span>
                      <strong className="text-gray-900">{formattedIndonesianDeadline}</strong>
                    </div>
                  </div>
                </div>

                {/* Durasi Pengerjaan Ujian / Kuis */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-200">
                  <div>
                    <label className="block text-xs font-semibold text-gray-800">
                      Durasi Pengerjaan Asesmen Siswa:
                    </label>
                    <p className="text-[11px] text-gray-500">
                      Waktu pengerjaan saat siswa memulai ujian/kuis digital.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setDurasiMenit(45)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                        durasiMenit === 45
                          ? "bg-[#2A2C5E] text-white border-[#2A2C5E]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      45 Menit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDurasiMenit(60)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                        durasiMenit === 60
                          ? "bg-[#2A2C5E] text-white border-[#2A2C5E]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      60 Menit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDurasiMenit(90)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                        durasiMenit === 90
                          ? "bg-[#2A2C5E] text-white border-[#2A2C5E]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      90 Menit
                    </button>
                  </div>
                </div>

                {/* Form Builder Pilihan Ganda (CBT) */}
                {jenisAsesmen === "PILIHAN_GANDA" && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-gray-900">
                        Butir Soal ({soalPilganList.length} Soal &bull; Bobot:{" "}
                        <span className="text-[#2A2C5E]">
                          {Math.round(100 / Math.max(1, soalPilganList.length))} poin/soal
                        </span>
                        )
                      </div>
                      <button
                        type="button"
                        onClick={handleAddSoalPilgan}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2A2C5E] hover:bg-[#1F2147] text-white text-xs font-semibold rounded-lg shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Butir Soal</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {soalPilganList.map((soal, sIdx) => (
                        <div
                          key={soal.id}
                          className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-2.5 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-gray-800 px-2 py-0.5 rounded bg-gray-100 border border-gray-200">
                              Soal Nomor {sIdx + 1}
                            </span>
                            {soalPilganList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteSoal(sIdx)}
                                className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1 cursor-pointer font-medium"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus Soal</span>
                              </button>
                            )}
                          </div>

                          <textarea
                            rows={2}
                            value={soal.pertanyaan}
                            onChange={(e) => handleUpdatePertanyaan(sIdx, e.target.value)}
                            placeholder={`Ketik pertanyaan nomor ${sIdx + 1}...`}
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#2A2C5E]"
                            required
                          />

                          {/* Opsi Jawaban A, B, C, D */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {soal.pilihan.map((opsi, oIdx) => {
                              const isKey = soal.kunci === oIdx;
                              const abcd = ["A", "B", "C", "D"][oIdx];
                              return (
                                <div
                                  key={oIdx}
                                  className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                                    isKey
                                      ? "bg-[#2A2C5E]/5 border-[#2A2C5E] text-gray-900 ring-1 ring-[#2A2C5E]/20"
                                      : "bg-white border-gray-200 text-gray-700"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`kunci-soal-${sIdx}`}
                                    checked={isKey}
                                    onChange={() => handleUpdateKunci(sIdx, oIdx)}
                                    className="accent-[#2A2C5E] cursor-pointer w-4 h-4 shrink-0"
                                    title="Kunci Jawaban Benar"
                                  />
                                  <span className="font-bold text-xs shrink-0 w-4 text-center text-gray-700">
                                    {abcd}.
                                  </span>
                                  <input
                                    type="text"
                                    value={opsi}
                                    onChange={(e) => handleUpdatePilihan(sIdx, oIdx, e.target.value)}
                                    className="w-full bg-transparent border-0 focus:outline-none text-xs text-gray-900"
                                    placeholder={`Pilihan ${abcd}`}
                                    required
                                  />
                                  {isKey && (
                                    <span className="text-[10px] font-bold text-white bg-[#2A2C5E] px-1.5 py-0.5 rounded shrink-0">
                                      Kunci Benar
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form Builder Soal Essay */}
                {jenisAsesmen === "ESSAY" && (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <label className="block text-[11px] font-semibold text-gray-700">
                      Pertanyaan Tugas Essay / Studi Kasus:
                    </label>
                    <textarea
                      rows={4}
                      value={pertanyaanEssay}
                      onChange={(e) => setPertanyaanEssay(e.target.value)}
                      placeholder="Tuliskan pertanyaan uraian atau studi kasus siswa..."
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-xs focus:outline-none focus:border-[#2A2C5E]"
                      required
                    />
                    <p className="text-[11px] text-gray-500">
                      Siswa dapat mengetikkan lembar analisis secara mandiri sebelum batas tenggat waktu.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-center text-xs text-gray-600 animate-in fade-in">
                <div className="font-semibold text-gray-800">Sesi Belajar Tanpa Tugas Evaluasi</div>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Peserta didik hanya menyimak bahan ajar tanpa kewajiban mengerjakan evaluasi kuis.
                </p>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* BAGIAN 5: FOOTER AKSI DALAM BORDER YANG SAMA */}
          {/* =============================================================== */}
          <div className="p-4 sm:p-5 bg-gray-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-gray-600 flex flex-wrap items-center gap-2">
              <span className="font-bold text-gray-800">Ringkasan:</span>
              <span className="px-2.5 py-1 rounded bg-white border border-gray-200 text-[11px] font-medium text-gray-700">
                Pertemuan ke-{nomorPertemuan}
              </span>
              <span className="px-2.5 py-1 rounded bg-white border border-gray-200 text-[11px] font-medium text-gray-700">
                {kategoriLabelMap[kategoriSesi]}
              </span>
              <span className="px-2.5 py-1 rounded bg-white border border-gray-200 text-[11px] font-medium text-gray-700">
                {formatMateriLabelMap[formatMateri]}
              </span>
              <span className="px-2.5 py-1 rounded bg-white border border-gray-200 text-[11px] font-medium text-gray-700">
                {jenisAsesmen === "PILIHAN_GANDA" ? `CBT (${soalPilganList.length} Soal)` : jenisAsesmen === "ESSAY" ? "Essay" : "Tanpa Tugas"}
              </span>
              {jenisAsesmen !== "NONE" && (
                <span className="px-2.5 py-1 rounded bg-white border border-gray-200 text-[11px] font-semibold text-gray-800">
                  Batas: {formattedIndonesianDeadline}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Link
                href={`/guru/mapel?id=${activeClass?.id}`}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 text-center cursor-pointer transition-colors"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#2A2C5E] hover:bg-[#1F2147] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>
                  {isSubmitting ? "Menerbitkan..." : "Simpan & Terbitkan Pertemuan"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function TambahPertemuanPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-gray-500">
          Memuat formulir penerbitan pertemuan...
        </div>
      }
    >
      <TambahPertemuanContent />
    </Suspense>
  );
}
