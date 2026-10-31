"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  Plus,
  Trash2,
  Upload,
  Check,
} from "lucide-react";
import { useLMSStore, PertemuanItem, SoalPilgan } from "@/lib/lmsStore";

function TambahPertemuanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classIdParam = searchParams.get("classId");

  const { classes, addPertemuan } = useLMSStore();

  // Kelas aktif
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classIdParam || classes[0]?.id || "mapel-1"
  );

  const activeClass = useMemo(() => {
    return classes.find((c) => c.id === selectedClassId) || classes[0];
  }, [classes, selectedClassId]);

  // Nomor pertemuan otomatis
  const [nomorPertemuan, setNomorPertemuan] = useState<number>(1);
  const [judulPertemuan, setJudulPertemuan] = useState<string>("");

  useEffect(() => {
    if (activeClass?.pertemuanList) {
      const nextNum = activeClass.pertemuanList.length + 1;
      setNomorPertemuan(nextNum);
      if (!judulPertemuan) {
        setJudulPertemuan(`Pertemuan ${nextNum}: Pendalaman Materi dan Evaluasi`);
      }
    }
  }, [activeClass]);

  // Dropdown States
  const [openDropdown, setOpenDropdown] = useState<
    "KATEGORI" | "FORMAT_MATERI" | "JENIS_TUGAS" | null
  >(null);

  // Kategori Sesi
  const [kategoriSesi, setKategoriSesi] = useState<"REGULER" | "HARIAN" | "UTS" | "UAS">("REGULER");

  // Format Bahan Ajar
  const [formatMateri, setFormatMateri] = useState<"DOKUMEN" | "VIDEO" | "RINGKASAN" | "NONE">("DOKUMEN");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("Modul_Ajar_SMAN2_BahanAjar.pdf");
  const [materiFileUrl, setMateriFileUrl] = useState<string>("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [materiRingkasan, setMateriRingkasan] = useState<string>(
    "Pelajari materi ini dengan cermat sebelum mengerjakan evaluasi."
  );
  const [materiKontenLengkap, setMateriKontenLengkap] = useState<string>("");

  // Jenis Asesmen / Tugas
  const [jenisAsesmen, setJenisAsesmen] = useState<"PILIHAN_GANDA" | "ESSAY" | "NONE">("PILIHAN_GANDA");
  const [durasiMenit, setDurasiMenit] = useState<number>(60);
  const [pertanyaanEssay, setPertanyaanEssay] = useState<string>(
    "Jelaskan kesimpulan dan analisis kritis Anda terhadap materi yang telah dipelajari pada pertemuan ini."
  );

  // Tenggat Pengumpulan (Deadline)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  // Soal Pilihan Ganda (CBT)
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
        pertanyaan: "",
        pilihan: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
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
      alert("Harus ada minimal 1 butir soal.");
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

    const storeTipe: "REGULER" | "UTS" | "UAS" =
      kategoriSesi === "UTS" ? "UTS" : kategoriSesi === "UAS" ? "UAS" : "REGULER";

    const materiData =
      formatMateri !== "NONE"
        ? {
            judul: `Bahan Ajar Pertemuan ${nomorPertemuan}: ${finalJudul}`,
            tipe: formatMateri as "DOKUMEN" | "VIDEO" | "RINGKASAN",
            ringkasan: materiRingkasan.trim(),
            kontenLengkap:
              materiKontenLengkap.trim() ||
              materiRingkasan.trim() ||
              "Materi resmi pembelajaran Kurikulum Merdeka SMAN 2 Buay Bahuga.",
            fileUrl:
              formatMateri === "VIDEO"
                ? materiFileUrl
                : formatMateri === "DOKUMEN"
                ? uploadedFileName
                : undefined,
            sudahDibaca: false,
          }
        : undefined;

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
            deskripsi: "Jawablah butir evaluasi berikut secara mandiri dan teliti.",
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

    addPertemuan(activeClass.id, newMeeting);

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

  const kategoriLabelMap = {
    REGULER: "Sesi Reguler / Formatif",
    HARIAN: "Penilaian Harian (Kuis)",
    UTS: "Ujian Tengah Semester (UTS)",
    UAS: "Ujian Akhir Semester (UAS)",
  };

  const formatMateriLabelMap = {
    DOKUMEN: "Modul PDF",
    VIDEO: "Video Pembelajaran",
    RINGKASAN: "Catatan Teks",
    NONE: "Tanpa Bahan Ajar",
  };

  const jenisAsesmenLabelMap = {
    PILIHAN_GANDA: "Pilihan Ganda (CBT)",
    ESSAY: "Tugas Essay",
    NONE: "Tanpa Tugas",
  };

  return (
    <div className="w-full space-y-4 pb-16">
      {/* Backdrop penutup dropdown */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setOpenDropdown(null)}
        />
      )}

      {/* Navigasi Kembali */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <Link
          href={`/guru/mapel?id=${activeClass?.id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-[#2A2C5E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500" />
          <span>Kembali ke Kelas {activeClass?.nama}</span>
        </Link>
        <span className="text-xs text-gray-500 font-medium">
          {activeClass?.kode} &bull; Kelas {activeClass?.tingkat} ({activeClass?.jurusan})
        </span>
      </div>

      {/* FORMULIR UTAMA: RINGKAS, MINIMALIS, DAN BERSIH */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs divide-y divide-gray-100 overflow-visible">
          {/* =============================================================== */}
          {/* BAGIAN 1: IDENTITAS PERTEMUAN */}
          {/* =============================================================== */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-[#2A2C5E] text-white text-xs font-bold">
                Pertemuan ke-{nomorPertemuan}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Judul Sesi Pembelajaran:
              </label>
              <input
                type="text"
                value={judulPertemuan}
                onChange={(e) => setJudulPertemuan(e.target.value)}
                placeholder={`Pertemuan ${nomorPertemuan}: Pendalaman Materi dan Evaluasi`}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#2A2C5E]"
                required
              />
            </div>

            {/* Kategori Sesi Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <span className="text-xs font-semibold text-gray-700">
                Kategori Sesi:
              </span>

              <div className="relative z-30">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "KATEGORI" ? null : "KATEGORI")}
                  className="inline-flex items-center justify-between gap-3 px-3 py-1.5 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer min-w-[200px]"
                >
                  <span className="text-[#2A2C5E]">{kategoriLabelMap[kategoriSesi]}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                      openDropdown === "KATEGORI" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openDropdown === "KATEGORI" && (
                  <div className="absolute right-0 top-full mt-1 w-60 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-40">
                    <button
                      type="button"
                      onClick={() => {
                        setKategoriSesi("REGULER");
                        setJenisAsesmen("PILIHAN_GANDA");
                        setDurasiMenit(60);
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between cursor-pointer ${
                        kategoriSesi === "REGULER" ? "bg-gray-50 text-[#2A2C5E] font-bold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>Sesi Reguler / Formatif</span>
                      {kategoriSesi === "REGULER" && <Check className="w-3.5 h-3.5 text-[#2A2C5E]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setKategoriSesi("HARIAN");
                        setJenisAsesmen("PILIHAN_GANDA");
                        setDurasiMenit(45);
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between cursor-pointer ${
                        kategoriSesi === "HARIAN" ? "bg-gray-50 text-[#2A2C5E] font-bold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>Penilaian Harian (Kuis)</span>
                      {kategoriSesi === "HARIAN" && <Check className="w-3.5 h-3.5 text-[#2A2C5E]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setKategoriSesi("UTS");
                        setJenisAsesmen("PILIHAN_GANDA");
                        setDurasiMenit(90);
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between cursor-pointer ${
                        kategoriSesi === "UTS" ? "bg-gray-50 text-[#2A2C5E] font-bold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>Ujian Tengah Semester (UTS)</span>
                      {kategoriSesi === "UTS" && <Check className="w-3.5 h-3.5 text-[#2A2C5E]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setKategoriSesi("UAS");
                        setJenisAsesmen("PILIHAN_GANDA");
                        setDurasiMenit(90);
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between cursor-pointer ${
                        kategoriSesi === "UAS" ? "bg-gray-50 text-[#2A2C5E] font-bold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>Ujian Akhir Semester (UAS)</span>
                      {kategoriSesi === "UAS" && <Check className="w-3.5 h-3.5 text-[#2A2C5E]" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* BAGIAN 2: BAHAN AJAR (UPLOAD PDF + PETUNJUK DI BAWAHNYA) */}
          {/* =============================================================== */}
          <div className="p-5 sm:p-6 space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-900">
                Bahan Ajar Pembelajaran
              </h2>

              <div className="relative z-25">
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(openDropdown === "FORMAT_MATERI" ? null : "FORMAT_MATERI")
                  }
                  className="inline-flex items-center justify-between gap-2 px-3 py-1.5 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 rounded-lg text-xs font-medium shadow-2xs transition-all cursor-pointer min-w-[170px]"
                >
                  <span>Format: <strong>{formatMateriLabelMap[formatMateri]}</strong></span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                      openDropdown === "FORMAT_MATERI" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openDropdown === "FORMAT_MATERI" && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-40">
                    <button
                      type="button"
                      onClick={() => {
                        setFormatMateri("DOKUMEN");
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between cursor-pointer ${
                        formatMateri === "DOKUMEN" ? "bg-gray-50 text-[#2A2C5E] font-bold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>Modul PDF</span>
                      {formatMateri === "DOKUMEN" && <Check className="w-3.5 h-3.5 text-[#2A2C5E]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormatMateri("VIDEO");
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between cursor-pointer ${
                        formatMateri === "VIDEO" ? "bg-gray-50 text-[#2A2C5E] font-bold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>Video Pembelajaran</span>
                      {formatMateri === "VIDEO" && <Check className="w-3.5 h-3.5 text-[#2A2C5E]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormatMateri("RINGKASAN");
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between cursor-pointer ${
                        formatMateri === "RINGKASAN" ? "bg-gray-50 text-[#2A2C5E] font-bold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>Catatan Teks</span>
                      {formatMateri === "RINGKASAN" && <Check className="w-3.5 h-3.5 text-[#2A2C5E]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormatMateri("NONE");
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between cursor-pointer ${
                        formatMateri === "NONE" ? "bg-gray-50 text-[#2A2C5E] font-bold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>Tanpa Bahan Ajar</span>
                      {formatMateri === "NONE" && <Check className="w-3.5 h-3.5 text-gray-600" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* FORMAT: DOKUMEN PDF (UPLOAD BERKAS + PETUNJUK DI BAWAHNYA) */}
            {formatMateri === "DOKUMEN" && (
              <div className="space-y-3 pt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />

                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-gray-900 truncate">
                      {uploadedFileName}
                    </div>
                    <div className="text-[11px] text-gray-500">Berkas modul digital siswa</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded-md text-xs font-medium text-gray-700 shadow-2xs cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-gray-500" />
                    <span>Pilih Berkas PDF</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Petunjuk / Perintah Siswa:
                  </label>
                  <input
                    type="text"
                    value={materiRingkasan}
                    onChange={(e) => setMateriRingkasan(e.target.value)}
                    placeholder="Contoh: Bacalah modul bab ini sebelum mengerjakan soal evaluasi."
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#2A2C5E]"
                  />
                </div>
              </div>
            )}

            {/* FORMAT: VIDEO (LINK YOUTUBE + PETUNJUK DI BAWAHNYA) */}
            {formatMateri === "VIDEO" && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tautan Video Pembelajaran (YouTube):
                  </label>
                  <input
                    type="text"
                    value={materiFileUrl}
                    onChange={(e) => setMateriFileUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-mono text-gray-900 focus:outline-none focus:border-[#2A2C5E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Petunjuk / Perintah Siswa:
                  </label>
                  <input
                    type="text"
                    value={materiRingkasan}
                    onChange={(e) => setMateriRingkasan(e.target.value)}
                    placeholder="Contoh: Simak video sampai selesai dan catat poin-poin penjelasan penting."
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#2A2C5E]"
                  />
                </div>
              </div>
            )}

            {/* FORMAT: RINGKASAN TEKS (CATATAN + PETUNJUK DI BAWAHNYA) */}
            {formatMateri === "RINGKASAN" && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Catatan Materi Pembelajaran:
                  </label>
                  <textarea
                    rows={4}
                    value={materiKontenLengkap}
                    onChange={(e) => setMateriKontenLengkap(e.target.value)}
                    placeholder="Tuliskan materi penjelasan konsep di sini..."
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#2A2C5E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Petunjuk / Perintah Siswa:
                  </label>
                  <input
                    type="text"
                    value={materiRingkasan}
                    onChange={(e) => setMateriRingkasan(e.target.value)}
                    placeholder="Contoh: Catat rangkuman ini di buku catatan masing-masing."
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#2A2C5E]"
                  />
                </div>
              </div>
            )}

            {formatMateri === "NONE" && (
              <p className="text-xs text-gray-500 pt-1">
                Tidak ada materi bacaan pada sesi ini.
              </p>
            )}
          </div>

          {/* =============================================================== */}
          {/* BAGIAN 3: ASESMEN & TUGAS (DI BAWAH BAHAN AJAR, DEADLINE KALENDER) */}
          {/* =============================================================== */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-900">
                Asesmen &amp; Tugas Siswa
              </h2>

              <div className="relative z-20">
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(openDropdown === "JENIS_TUGAS" ? null : "JENIS_TUGAS")
                  }
                  className="inline-flex items-center justify-between gap-2 px-3 py-1.5 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 rounded-lg text-xs font-medium shadow-2xs transition-all cursor-pointer min-w-[170px]"
                >
                  <span>Jenis: <strong>{jenisAsesmenLabelMap[jenisAsesmen]}</strong></span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                      openDropdown === "JENIS_TUGAS" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openDropdown === "JENIS_TUGAS" && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-40">
                    <button
                      type="button"
                      onClick={() => {
                        setJenisAsesmen("PILIHAN_GANDA");
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between cursor-pointer ${
                        jenisAsesmen === "PILIHAN_GANDA" ? "bg-gray-50 text-[#2A2C5E] font-bold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>Pilihan Ganda (CBT)</span>
                      {jenisAsesmen === "PILIHAN_GANDA" && <Check className="w-3.5 h-3.5 text-[#2A2C5E]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setJenisAsesmen("ESSAY");
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between cursor-pointer ${
                        jenisAsesmen === "ESSAY" ? "bg-gray-50 text-[#2A2C5E] font-bold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>Tugas Essay</span>
                      {jenisAsesmen === "ESSAY" && <Check className="w-3.5 h-3.5 text-[#2A2C5E]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setJenisAsesmen("NONE");
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between cursor-pointer ${
                        jenisAsesmen === "NONE" ? "bg-gray-50 text-[#2A2C5E] font-bold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>Tanpa Tugas</span>
                      {jenisAsesmen === "NONE" && <Check className="w-3.5 h-3.5 text-gray-600" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* FORM ASESMEN (JIKA BUKAN NONE) */}
            {jenisAsesmen !== "NONE" ? (
              <div className="space-y-4 pt-1">
                {/* TENGGAT WAKTU (PEMILIH TANGGAL & JAM + PRESET CEPAT) */}
                <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-lg space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-gray-800">
                      Batas Waktu Pengumpulan:
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setDeadlineDate(getFutureDateISO(3));
                          setPresetActive("3_HARI");
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
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
                        className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
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
                        className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                          presetActive === "14_HARI"
                            ? "bg-[#2A2C5E] text-white border-[#2A2C5E]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        +14 Hari
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <input
                      type="date"
                      value={deadlineDate}
                      onChange={(e) => {
                        setDeadlineDate(e.target.value);
                        setPresetActive("CUSTOM");
                      }}
                      className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-800 focus:outline-none focus:border-[#2A2C5E]"
                    />

                    <input
                      type="time"
                      value={deadlineTime}
                      onChange={(e) => setDeadlineTime(e.target.value)}
                      className="px-2 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-800 focus:outline-none focus:border-[#2A2C5E]"
                    />
                    <span className="text-xs text-gray-500 font-medium">WIB</span>

                    <span className="text-xs text-gray-500 ml-1">
                      ({formattedIndonesianDeadline})
                    </span>
                  </div>
                </div>

                {/* Durasi Pengerjaan */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-700">
                    Durasi Pengerjaan:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDurasiMenit(45)}
                      className={`px-3 py-1 text-xs font-medium rounded border transition-colors cursor-pointer ${
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
                      className={`px-3 py-1 text-xs font-medium rounded border transition-colors cursor-pointer ${
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
                      className={`px-3 py-1 text-xs font-medium rounded border transition-colors cursor-pointer ${
                        durasiMenit === 90
                          ? "bg-[#2A2C5E] text-white border-[#2A2C5E]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      90 Menit
                    </button>
                  </div>
                </div>

                {/* BUILDER SOAL PILIHAN GANDA (CBT) */}
                {jenisAsesmen === "PILIHAN_GANDA" && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800">
                        Butir Soal ({soalPilganList.length} Soal &bull; {Math.round(100 / Math.max(1, soalPilganList.length))} poin/soal)
                      </span>
                      <button
                        type="button"
                        onClick={handleAddSoalPilgan}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#2A2C5E] text-white text-xs font-medium rounded-md hover:bg-[#1F2147] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Soal</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {soalPilganList.map((soal, sIdx) => (
                        <div
                          key={soal.id}
                          className="p-3 bg-gray-50/60 border border-gray-200 rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-700">
                              Nomor {sIdx + 1}
                            </span>
                            {soalPilganList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteSoal(sIdx)}
                                className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer font-medium"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Hapus</span>
                              </button>
                            )}
                          </div>

                          <input
                            type="text"
                            value={soal.pertanyaan}
                            onChange={(e) => handleUpdatePertanyaan(sIdx, e.target.value)}
                            placeholder={`Ketik teks pertanyaan nomor ${sIdx + 1}...`}
                            className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs text-gray-900 focus:outline-none focus:border-[#2A2C5E]"
                            required
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {soal.pilihan.map((opsi, oIdx) => {
                              const isKey = soal.kunci === oIdx;
                              const abcd = ["A", "B", "C", "D"][oIdx];
                              return (
                                <div
                                  key={oIdx}
                                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-xs transition-colors ${
                                    isKey
                                      ? "bg-white border-[#2A2C5E] text-gray-900 ring-1 ring-[#2A2C5E]/20"
                                      : "bg-white border-gray-200 text-gray-700"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`kunci-soal-${sIdx}`}
                                    checked={isKey}
                                    onChange={() => handleUpdateKunci(sIdx, oIdx)}
                                    className="accent-[#2A2C5E] cursor-pointer"
                                    title="Kunci Jawaban Benar"
                                  />
                                  <span className="font-bold text-gray-500 w-3">{abcd}.</span>
                                  <input
                                    type="text"
                                    value={opsi}
                                    onChange={(e) => handleUpdatePilihan(sIdx, oIdx, e.target.value)}
                                    className="w-full bg-transparent border-0 focus:outline-none text-xs text-gray-900"
                                    placeholder={`Pilihan ${abcd}`}
                                    required
                                  />
                                  {isKey && (
                                    <span className="text-[10px] font-bold text-[#2A2C5E] bg-blue-50 px-1.5 py-0.2 rounded shrink-0">
                                      Kunci
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

                {/* BUILDER SOAL ESSAY */}
                {jenisAsesmen === "ESSAY" && (
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Pertanyaan Tugas Essay:
                    </label>
                    <textarea
                      rows={3}
                      value={pertanyaanEssay}
                      onChange={(e) => setPertanyaanEssay(e.target.value)}
                      placeholder="Tuliskan pertanyaan uraian siswa..."
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#2A2C5E]"
                      required
                    />
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-500 pt-1">
                Tidak ada tugas evaluasi pada sesi ini.
              </p>
            )}
          </div>

          {/* =============================================================== */}
          {/* FOOTER AKSI */}
          {/* =============================================================== */}
          <div className="p-4 sm:p-5 bg-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Pertemuan {nomorPertemuan} &bull; {kategoriLabelMap[kategoriSesi]}
            </span>

            <div className="flex items-center gap-2">
              <Link
                href={`/guru/mapel?id=${activeClass?.id}`}
                className="px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-[#2A2C5E] hover:bg-[#1F2147] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Menerbitkan..." : "Simpan Pertemuan"}
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
          Memuat formulir...
        </div>
      }
    >
      <TambahPertemuanContent />
    </Suspense>
  );
}
