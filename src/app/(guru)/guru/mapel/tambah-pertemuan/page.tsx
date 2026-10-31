"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
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
  Sparkles,
  Award,
  Layers,
  HelpCircle,
  FileCheck,
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

  // Kategori Sesi Pembelajaran (Filter Tabs: Reguler / Penilaian Harian / UTS / UAS)
  const [kategoriSesi, setKategoriSesi] = useState<"REGULER" | "HARIAN" | "UTS" | "UAS">("REGULER");

  // Format Bahan Ajar (Filter Tabs: DOKUMEN | VIDEO | RINGKASAN | NONE)
  const [formatMateri, setFormatMateri] = useState<"DOKUMEN" | "VIDEO" | "RINGKASAN" | "NONE">("DOKUMEN");
  const [materiJudul, setMateriJudul] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("Modul_Ajar_SMAN2_BahanAjar.pdf");
  const [materiFileUrl, setMateriFileUrl] = useState<string>("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [materiRingkasan, setMateriRingkasan] = useState<string>("");
  const [materiKontenLengkap, setMateriKontenLengkap] = useState<string>("");

  // Jenis Asesmen / Tugas (Filter Tabs: PILIHAN_GANDA | ESSAY | NONE)
  const [jenisAsesmen, setJenisAsesmen] = useState<"PILIHAN_GANDA" | "ESSAY" | "NONE">("PILIHAN_GANDA");
  const [tugasJudul, setTugasJudul] = useState<string>("");
  const [durasiMenit, setDurasiMenit] = useState<number>(60);
  const [pertanyaanEssay, setPertanyaanEssay] = useState<string>(
    "Jelaskan kesimpulan dan analisis kritis Anda terhadap materi yang telah dipelajari pada pertemuan ini."
  );

  // Tenggat Pengumpulan (Deadline) berbasis Filter Klik
  const [presetDeadline, setPresetDeadline] = useState<"3_HARI" | "7_HARI" | "14_HARI" | "CUSTOM">("7_HARI");
  const [deadlineTugas, setDeadlineTugas] = useState<string>("");

  // Helper untuk hitung teks tanggal deadline otomatis
  const calculateDeadlineString = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];
    return `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}, 23:59 WIB`;
  };

  useEffect(() => {
    if (presetDeadline === "3_HARI") {
      setDeadlineTugas(calculateDeadlineString(3));
    } else if (presetDeadline === "7_HARI") {
      setDeadlineTugas(calculateDeadlineString(7));
    } else if (presetDeadline === "14_HARI") {
      setDeadlineTugas(calculateDeadlineString(14));
    }
  }, [presetDeadline]);

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

    // Modul Materi (jika bukan NONE)
    const materiData =
      formatMateri !== "NONE"
        ? {
            judul:
              materiJudul.trim() ||
              `Bahan Ajar Pertemuan ${nomorPertemuan}: ${finalJudul}`,
            tipe: formatMateri as "DOKUMEN" | "VIDEO" | "RINGKASAN",
            ringkasan:
              materiRingkasan.trim() ||
              (formatMateri === "DOKUMEN"
                ? `Berkas modul bacaan digital: ${uploadedFileName}`
                : formatMateri === "VIDEO"
                ? "Simak tayangan video pembelajaran ini dengan cermat."
                : "Rangkuman materi kurikulum merdeka."),
            kontenLengkap:
              materiKontenLengkap.trim() ||
              materiRingkasan.trim() ||
              "Materi bahan ajar resmi Kurikulum Merdeka SMAN 2 Buay Bahuga untuk dipelajari mandiri.",
            fileUrl:
              formatMateri === "VIDEO"
                ? materiFileUrl
                : formatMateri === "DOKUMEN"
                ? uploadedFileName
                : undefined,
            sudahDibaca: false,
          }
        : undefined;

    // Asesmen / Tugas (jika bukan NONE)
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
            judul:
              tugasJudul.trim() ||
              `Lembar Evaluasi Pertemuan ${nomorPertemuan}: ${finalJudul}`,
            tipe: finalTugasTipe,
            deskripsi: "Jawablah butir pertanyaan evaluasi berikut secara mandiri dan teliti.",
            deadline: deadlineTugas,
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

    // Tambah ke store (otomatis update matriks nilai dan absensi kelas)
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

  return (
    <div className="w-full space-y-5 pb-16">
      {/* Navigasi Breadcrumb Kembali */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3.5">
        <Link
          href={`/guru/mapel?id=${activeClass?.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2A2C5E] hover:text-[#1F2147] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Ruang Kelas {activeClass?.nama}</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-semibold text-gray-700">{activeClass?.kode}</span>
          <span>&bull;</span>
          <span>{activeClass?.ruang}</span>
          <span>&bull;</span>
          <span>Kelas {activeClass?.tingkat} ({activeClass?.jurusan})</span>
        </div>
      </div>

      {/* FORMULIR UTAMA TERPADU: 1 CONTAINER / 1 BORDER COMPACT */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs divide-y divide-gray-100 overflow-hidden">
          {/* =============================================================== */}
          {/* BAGIAN 1: HEADER & IDENTITAS OTOMATIS */}
          {/* =============================================================== */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-gray-50/70 to-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-[#2A2C5E] text-white text-xs font-bold tracking-wide">
                  Pertemuan ke-{nomorPertemuan}
                </span>
                <span className="px-3 py-1 rounded-lg bg-blue-50 text-[#2A2C5E] border border-blue-100 text-xs font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Jadwal Otomatis: {activeClass?.jadwal || "Senin, 07:30 - 09:30 WIB"}</span>
                </span>
              </div>
              <div className="pt-1.5">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Judul Sesi Pertemuan:
                </label>
                <input
                  type="text"
                  value={judulPertemuan}
                  onChange={(e) => setJudulPertemuan(e.target.value)}
                  placeholder={`Contoh: Pertemuan ${nomorPertemuan}: Pendalaman Materi dan Evaluasi`}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                  required
                />
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* BAGIAN 2: KATEGORI SESI (BERGAYA FILTER TABS HORIZONTAL) */}
          {/* =============================================================== */}
          <div className="p-4 sm:p-5 bg-white space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
              <Filter className="w-3.5 h-3.5 text-[#2A2C5E]" />
              <span>Kategori Sesi Pertemuan:</span>
            </div>
            {/* Filter Tab Kapsul Horizontal */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => {
                  setKategoriSesi("REGULER");
                  setJenisAsesmen("PILIHAN_GANDA");
                  setDurasiMenit(60);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border ${
                  kategoriSesi === "REGULER"
                    ? "bg-[#2A2C5E] text-white border-[#2A2C5E] shadow-xs"
                    : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                }`}
              >
                Sesi Reguler / Formatif
              </button>

              <button
                type="button"
                onClick={() => {
                  setKategoriSesi("HARIAN");
                  setJenisAsesmen("PILIHAN_GANDA");
                  setDurasiMenit(45);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border ${
                  kategoriSesi === "HARIAN"
                    ? "bg-[#2A2C5E] text-white border-[#2A2C5E] shadow-xs"
                    : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                }`}
              >
                Penilaian Harian (Kuis)
              </button>

              <button
                type="button"
                onClick={() => {
                  setKategoriSesi("UTS");
                  setJenisAsesmen("PILIHAN_GANDA");
                  setDurasiMenit(90);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border ${
                  kategoriSesi === "UTS"
                    ? "bg-[#2A2C5E] text-white border-[#2A2C5E] shadow-xs"
                    : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                }`}
              >
                Ujian Tengah Semester (UTS)
              </button>

              <button
                type="button"
                onClick={() => {
                  setKategoriSesi("UAS");
                  setJenisAsesmen("PILIHAN_GANDA");
                  setDurasiMenit(90);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border ${
                  kategoriSesi === "UAS"
                    ? "bg-[#2A2C5E] text-white border-[#2A2C5E] shadow-xs"
                    : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                }`}
              >
                Ujian Akhir Semester (UAS)
              </button>
            </div>
          </div>

          {/* =============================================================== */}
          {/* BAGIAN 3: BAHAN AJAR SISWA (FILTER FORMAT DULU -> FORM MUNCUL) */}
          {/* =============================================================== */}
          <div className="p-5 sm:p-6 bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Bahan Ajar Pembelajaran
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Pilih format bahan ajar lewat filter, lalu lengkapi materi pembelajaran.
                  </p>
                </div>
              </div>
            </div>

            {/* Filter Format Bahan Ajar */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Pilih Format Materi:
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setFormatMateri("DOKUMEN")}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border flex items-center gap-2 ${
                    formatMateri === "DOKUMEN"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Modul PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormatMateri("VIDEO")}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border flex items-center gap-2 ${
                    formatMateri === "VIDEO"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video Belajar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormatMateri("RINGKASAN")}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border flex items-center gap-2 ${
                    formatMateri === "RINGKASAN"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Catatan Teks</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormatMateri("NONE")}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border flex items-center gap-2 ${
                    formatMateri === "NONE"
                      ? "bg-gray-800 text-white border-gray-800 shadow-xs"
                      : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Tanpa Materi</span>
                </button>
              </div>
            </div>

            {/* Form Dinamis: Muncul Sesuai Format yang Dipilih */}
            {formatMateri === "DOKUMEN" && (
              <div className="space-y-3 pt-2 text-xs animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Judul Modul PDF:
                    </label>
                    <input
                      type="text"
                      value={materiJudul}
                      onChange={(e) => setMateriJudul(e.target.value)}
                      placeholder={`Contoh: Modul Ajar Bab ${nomorPertemuan}: Materi Inti`}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Petunjuk / Catatan Membaca:
                    </label>
                    <input
                      type="text"
                      value={materiRingkasan}
                      onChange={(e) => setMateriRingkasan(e.target.value)}
                      placeholder="Contoh: Pelajari modul bab ini sebelum mengerjakan soal latihan."
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <Upload className="w-7 h-7 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-emerald-950">
                        {uploadedFileName}
                      </div>
                      <p className="text-[10px] text-gray-500">
                        Berkas modul bacaan digital yang akan diakses oleh peserta didik.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const sampleFiles = [
                        "Modul_Ajar_SMAN2_BabLengkap.pdf",
                        "Bahan_Ajar_Sains_Kurikulum_Merdeka.pdf",
                        "Lembar_Bacaan_Konseptual.pdf",
                      ];
                      const nextIndex = (sampleFiles.indexOf(uploadedFileName) + 1) % sampleFiles.length;
                      setUploadedFileName(sampleFiles[nextIndex]);
                    }}
                    className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 text-[11px] font-bold rounded-lg shadow-2xs hover:bg-emerald-50 cursor-pointer shrink-0"
                  >
                    Ganti Contoh Berkas PDF
                  </button>
                </div>
              </div>
            )}

            {formatMateri === "VIDEO" && (
              <div className="space-y-3 pt-2 text-xs animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Judul Video Pembelajaran:
                    </label>
                    <input
                      type="text"
                      value={materiJudul}
                      onChange={(e) => setMateriJudul(e.target.value)}
                      placeholder={`Contoh: Video Penjelasan Konsep Pertemuan ${nomorPertemuan}`}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Tautan Video (YouTube / Link Video):
                    </label>
                    <div className="relative">
                      <Link2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={materiFileUrl}
                        onChange={(e) => setMateriFileUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Rangkuman Poin Kunci Video:
                  </label>
                  <textarea
                    rows={3}
                    value={materiKontenLengkap}
                    onChange={(e) => setMateriKontenLengkap(e.target.value)}
                    placeholder="Tuliskan poin penting yang harus dicermati siswa dari tayangan video..."
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                  />
                </div>
              </div>
            )}

            {formatMateri === "RINGKASAN" && (
              <div className="space-y-3 pt-2 text-xs animate-in fade-in">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Judul Catatan Rangkuman:
                  </label>
                  <input
                    type="text"
                    value={materiJudul}
                    onChange={(e) => setMateriJudul(e.target.value)}
                    placeholder={`Contoh: Ringkasan Materi Pertemuan ${nomorPertemuan}`}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Uraian Rangkuman Teks Lengkap:
                  </label>
                  <textarea
                    rows={4}
                    value={materiKontenLengkap}
                    onChange={(e) => setMateriKontenLengkap(e.target.value)}
                    placeholder="Ketikkan teks materi penjelasan di sini. Teks ini akan langsung tampil di alur belajar siswa..."
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {formatMateri === "NONE" && (
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-center text-xs text-gray-600 animate-in fade-in">
                <div className="font-semibold text-gray-800">Sesi Tanpa Bahan Ajar</div>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Sesi ini difokuskan untuk asesmen atau kuis evaluasi mandiri tanpa modul bacaan.
                </p>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* BAGIAN 4: ASESMEN & TUGAS SISWA (DI BAWAH BAHAN AJAR) */}
          {/* =============================================================== */}
          <div className="p-5 sm:p-6 bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Asesmen &amp; Tugas Siswa
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Pilih jenis tugas lewat filter dan tentukan batas waktu pengumpulan.
                  </p>
                </div>
              </div>
            </div>

            {/* Filter Jenis Asesmen / Tugas */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Pilih Jenis Tugas:
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setJenisAsesmen("PILIHAN_GANDA")}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border flex items-center gap-2 ${
                    jenisAsesmen === "PILIHAN_GANDA"
                      ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                      : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pilihan Ganda (CBT)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setJenisAsesmen("ESSAY")}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border flex items-center gap-2 ${
                    jenisAsesmen === "ESSAY"
                      ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                      : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Tugas Essay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setJenisAsesmen("NONE")}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border flex items-center gap-2 ${
                    jenisAsesmen === "NONE"
                      ? "bg-gray-800 text-white border-gray-800 shadow-xs"
                      : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tanpa Tugas</span>
                </button>
              </div>
            </div>

            {/* Form Asesmen & Tenggat Waktu (Hanya muncul bila bukan TANPA TUGAS) */}
            {jenisAsesmen !== "NONE" ? (
              <div className="space-y-4 pt-1 text-xs animate-in fade-in">
                {/* Baris Filter Tenggat Waktu (Deadline) */}
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      <span>Tenggat Waktu Pengumpulan (Deadline):</span>
                    </span>

                    {/* Filter Tombol Klik Tenggat */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                      <button
                        type="button"
                        onClick={() => setPresetDeadline("3_HARI")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                          presetDeadline === "3_HARI"
                            ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                            : "bg-white text-gray-700 border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        +3 Hari
                      </button>

                      <button
                        type="button"
                        onClick={() => setPresetDeadline("7_HARI")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                          presetDeadline === "7_HARI"
                            ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                            : "bg-white text-gray-700 border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        +7 Hari (1 Minggu)
                      </button>

                      <button
                        type="button"
                        onClick={() => setPresetDeadline("14_HARI")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                          presetDeadline === "14_HARI"
                            ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                            : "bg-white text-gray-700 border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        +14 Hari (2 Minggu)
                      </button>

                      <button
                        type="button"
                        onClick={() => setPresetDeadline("CUSTOM")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                          presetDeadline === "CUSTOM"
                            ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                            : "bg-white text-gray-700 border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        Kustom
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={deadlineTugas}
                    onChange={(e) => setDeadlineTugas(e.target.value)}
                    placeholder="Senin, 15 Desember 2026, 23:59 WIB"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-bold text-gray-900 focus:outline-none"
                  />
                </div>

                {/* Judul & Durasi Asesmen */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Judul Lembar Soal / Evaluasi:
                    </label>
                    <input
                      type="text"
                      value={tugasJudul}
                      onChange={(e) => setTugasJudul(e.target.value)}
                      placeholder={`Contoh: Evaluasi Formatif Pertemuan ${nomorPertemuan}`}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Durasi Pengerjaan:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setDurasiMenit(45)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                          durasiMenit === 45
                            ? "bg-[#2A2C5E] text-white border-[#2A2C5E]"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        45 Mnt
                      </button>
                      <button
                        type="button"
                        onClick={() => setDurasiMenit(60)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                          durasiMenit === 60
                            ? "bg-[#2A2C5E] text-white border-[#2A2C5E]"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        60 Mnt
                      </button>
                      <button
                        type="button"
                        onClick={() => setDurasiMenit(90)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                          durasiMenit === 90
                            ? "bg-[#2A2C5E] text-white border-[#2A2C5E]"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        90 Mnt
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Builder Pilihan Ganda (CBT) */}
                {jenisAsesmen === "PILIHAN_GANDA" && (
                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-gray-900">
                        Butir Soal ({soalPilganList.length} Butir Soal &bull; Bobot:{" "}
                        <span className="text-[#2A2C5E]">
                          {Math.round(100 / Math.max(1, soalPilganList.length))} poin/soal
                        </span>
                        )
                      </div>
                      <button
                        type="button"
                        onClick={handleAddSoalPilgan}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#2A2C5E] hover:bg-[#1F2147] text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Butir Soal</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {soalPilganList.map((soal, sIdx) => (
                        <div
                          key={soal.id}
                          className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#2A2C5E] px-2.5 py-0.5 rounded bg-blue-50 border border-blue-100">
                              Soal Nomor {sIdx + 1}
                            </span>
                            {soalPilganList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteSoal(sIdx)}
                                className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1 cursor-pointer font-semibold"
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
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none"
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
                                      ? "bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-300"
                                      : "bg-white border-gray-200 text-gray-700"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`kunci-soal-${sIdx}`}
                                    checked={isKey}
                                    onChange={() => handleUpdateKunci(sIdx, oIdx)}
                                    className="accent-emerald-600 cursor-pointer w-4 h-4 shrink-0"
                                    title="Kunci Jawaban Benar"
                                  />
                                  <span className="font-bold text-xs shrink-0 w-4 text-center">
                                    {abcd}.
                                  </span>
                                  <input
                                    type="text"
                                    value={opsi}
                                    onChange={(e) => handleUpdatePilihan(sIdx, oIdx, e.target.value)}
                                    className="w-full bg-transparent border-0 focus:outline-none text-xs"
                                    placeholder={`Pilihan ${abcd}`}
                                    required
                                  />
                                  {isKey && (
                                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/90 px-1.5 py-0.5 rounded shrink-0">
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
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                      required
                    />
                    <p className="text-[11px] text-gray-500">
                      Siswa dapat mengetikkan lembar analisis secara mandiri sebelum batas tenggat waktu.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 text-center text-xs text-emerald-900 animate-in fade-in">
                <div className="font-semibold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sesi Belajar Bebas Tugas</span>
                </div>
                <p className="text-[10px] text-emerald-700 mt-0.5">
                  Peserta didik hanya menyimak bahan ajar tanpa kewajiban mengerjakan evaluasi kuis.
                </p>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* BAGIAN 5: FOOTER AKSI DALAM BORDER YANG SAMA */}
          {/* =============================================================== */}
          <div className="p-4 sm:p-5 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-gray-600 flex flex-wrap items-center gap-2">
              <span className="font-bold text-gray-900">Ringkasan:</span>
              <span className="px-2.5 py-1 rounded bg-white border border-gray-200 text-[11px] font-semibold">
                Pertemuan ke-{nomorPertemuan}
              </span>
              <span className="px-2.5 py-1 rounded bg-white border border-gray-200 text-[11px] font-semibold">
                {kategoriSesi === "UTS" ? "UTS" : kategoriSesi === "UAS" ? "UAS" : kategoriSesi === "HARIAN" ? "Penilaian Harian" : "Sesi Reguler"}
              </span>
              <span className="px-2.5 py-1 rounded bg-white border border-gray-200 text-[11px] font-semibold">
                {formatMateri === "DOKUMEN" ? "Modul PDF" : formatMateri === "VIDEO" ? "Video Belajar" : formatMateri === "RINGKASAN" ? "Catatan Teks" : "Tanpa Materi"}
              </span>
              <span className="px-2.5 py-1 rounded bg-white border border-gray-200 text-[11px] font-semibold">
                {jenisAsesmen === "PILIHAN_GANDA" ? `CBT (${soalPilganList.length} Soal)` : jenisAsesmen === "ESSAY" ? "Essay" : "Tanpa Tugas"}
              </span>
              {jenisAsesmen !== "NONE" && (
                <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 text-[11px] font-semibold">
                  Deadline: {presetDeadline === "3_HARI" ? "+3 Hari" : presetDeadline === "7_HARI" ? "+7 Hari" : presetDeadline === "14_HARI" ? "+14 Hari" : "Kustom"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Link
                href={`/guru/mapel?id=${activeClass?.id}`}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 text-center cursor-pointer"
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
