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
  HelpCircle,
  Plus,
  Save,
  Trash2,
  Video,
  Upload,
  Link2,
  FileCheck,
  Check,
  Sparkles,
  Layers,
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

  // Nomor pertemuan otomatis berikutnya (selalu dihitung dari alur kelas saat ini)
  const [nomorPertemuan, setNomorPertemuan] = useState<number>(1);

  useEffect(() => {
    if (activeClass?.pertemuanList) {
      setNomorPertemuan(activeClass.pertemuanList.length + 1);
    }
  }, [activeClass]);

  // Form State: 1. Informasi Pertemuan (Otomatis Jadwal Rombel)
  const [judulPertemuan, setJudulPertemuan] = useState<string>("");
  const [tipePertemuan, setTipePertemuan] = useState<"REGULER" | "UTS" | "UAS">("REGULER");

  // Form State: 2. Modul Bahan Ajar (Materi Siswa)
  const [materiTipe, setMateriTipe] = useState<"DOKUMEN" | "VIDEO" | "RINGKASAN">("DOKUMEN");
  const [materiJudul, setMateriJudul] = useState<string>("");
  const [materiRingkasan, setMateriRingkasan] = useState<string>("");
  const [materiKontenLengkap, setMateriKontenLengkap] = useState<string>("");
  const [materiFileUrl, setMateriFileUrl] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("Modul_Ajar_SMAN2_BahanAjar.pdf");

  // Form State: 3. Latihan Soal & Asesmen Siswa (Tugas)
  const [sertakanSoal, setSertakanSoal] = useState<boolean>(true);
  const [tugasTipe, setTugasTipe] = useState<"PILIHAN_GANDA" | "ESSAY" | "UJIAN_UTS" | "UJIAN_UAS">(
    "PILIHAN_GANDA"
  );
  const [tugasJudul, setTugasJudul] = useState<string>("");
  const [tugasDeskripsi, setTugasDeskripsi] = useState<string>("");
  const [deadlineTugas, setDeadlineTugas] = useState<string>("Senin, 15 Desember 2026, 23:59 WIB");
  const [durasiMenit, setDurasiMenit] = useState<number>(60);
  const [pertanyaanEssay, setPertanyaanEssay] = useState<string>("");

  // Daftar Butir Soal Pilihan Ganda
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

  // Tambah Butir Soal Baru
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

  // Preset Cepat Tenggat Waktu (Deadline)
  const setQuickDeadline = (days: number) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];
    const formatted = `${dayNames[targetDate.getDay()]}, ${targetDate.getDate()} ${
      monthNames[targetDate.getMonth()]
    } ${targetDate.getFullYear()}, 23:59 WIB`;
    setDeadlineTugas(formatted);
  };

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClass) return;

    setIsSubmitting(true);

    const meetingId = `${activeClass.id}-p${Date.now().toString().slice(-4)}`;
    const finalJudul =
      judulPertemuan.trim() ||
      `Pertemuan ${nomorPertemuan}: ${
        tipePertemuan === "UTS"
          ? "Penilaian Tengah Semester (UTS)"
          : tipePertemuan === "UAS"
          ? "Penilaian Akhir Semester (UAS)"
          : "Pendalaman Materi dan Penugasan"
      }`;

    // Otomatisasi Jadwal Pelaksanaan dari Rombel
    const automatedSchedule = activeClass.jadwal || "Senin, 07:30 - 09:30 WIB";

    const newMeeting: PertemuanItem = {
      id: meetingId,
      nomor: Number(nomorPertemuan),
      judul: finalJudul,
      tipe: tipePertemuan,
      tanggal: automatedSchedule,
      durasiMenit: tipePertemuan === "REGULER" ? undefined : durasiMenit,
      materi: {
        judul:
          materiJudul.trim() ||
          `Bahan Ajar Pertemuan ${nomorPertemuan}: ${finalJudul}`,
        tipe: materiTipe,
        ringkasan:
          materiRingkasan.trim() ||
          (materiTipe === "DOKUMEN"
            ? `Berkas modul pembelajaran: ${uploadedFileName}`
            : materiTipe === "VIDEO"
            ? "Simak video materi pembelajaran berikut dengan teliti."
            : "Rangkuman materi konsep kurikulum merdeka."),
        kontenLengkap:
          materiKontenLengkap.trim() ||
          materiRingkasan.trim() ||
          "Materi bahan ajar resmi SMAN 2 Buay Bahuga untuk dipelajari mandiri oleh peserta didik.",
        fileUrl:
          materiTipe === "VIDEO"
            ? materiFileUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            : materiTipe === "DOKUMEN"
            ? uploadedFileName
            : undefined,
        sudahDibaca: false,
      },
      tugas: sertakanSoal
        ? {
            id: `tugas-${meetingId}`,
            judul:
              tugasJudul.trim() ||
              `Lembar Evaluasi Pertemuan ${nomorPertemuan}: ${finalJudul}`,
            tipe: tugasTipe,
            deskripsi:
              tugasDeskripsi.trim() ||
              "Jawablah seluruh butir pertanyaan evaluasi berikut secara mandiri dan jujur.",
            deadline: deadlineTugas,
            soalPilgan:
              tugasTipe === "PILIHAN_GANDA" || tugasTipe === "UJIAN_UTS" || tugasTipe === "UJIAN_UAS"
                ? soalPilganList
                : undefined,
            pertanyaanEssay:
              tugasTipe === "ESSAY"
                ? pertanyaanEssay.trim() ||
                  "Jelaskan kesimpulan dan analisis kritis Anda terhadap materi yang telah dipelajari pada pertemuan ini."
                : undefined,
            sudahDikerjakan: false,
          }
        : undefined,
      presensi: {
        hadir: false,
      },
    };

    // Tambah pertemuan ke store (otomatis menginisialisasi kolom nilai & absensi)
    addPertemuan(activeClass.id, newMeeting);

    // Kirim sinkronisasi ke Supabase
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

    // Redirect kembali ke halaman kelas
    router.push(`/guru/mapel?id=${activeClass.id}&toast=added`);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-16">
      {/* Navigasi Breadcrumb Kembali */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-4">
        <Link
          href={`/guru/mapel?id=${activeClass?.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2A2C5E] hover:text-[#1F2147] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Ruang Kelas {activeClass?.nama}</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-semibold text-gray-700">{activeClass?.ruang}</span>
          <span>&bull;</span>
          <span>Kelas {activeClass?.tingkat} ({activeClass?.jurusan})</span>
        </div>
      </div>

      {/* Header Halaman yang Ramah & Bersih */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-[#2A2C5E]" />
            <span>Mata Pelajaran: {activeClass?.nama} ({activeClass?.kode})</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Tambah Pertemuan Pembelajaran Baru
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Rancang bahan ajar dan instrumen asesmen siswa secara mudah, fleksibel, dan langsung terhubung ke buku nilai.
          </p>
        </div>

        {/* Informasi Jadwal Otomatis */}
        <div className="shrink-0 flex items-center gap-2.5 px-4 py-2.5 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-[#2A2C5E]">
          <Clock className="w-4 h-4 text-[#2A2C5E]" />
          <div>
            <span className="block text-[10px] text-gray-500 font-medium">Jadwal Sesi Pembelajaran:</span>
            <span className="font-bold text-gray-900">{activeClass?.jadwal || "Sesuai Jadwal Rombel"}</span>
          </div>
        </div>
      </div>

      {/* Formulir Ramah Guru */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================================================================= */}
        {/* KARTU 1: IDENTITAS PERTEMUAN (JADWAL OTOMATIS) */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#2A2C5E] font-bold text-xs flex items-center justify-center">
                1
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900">
                  Identitas Sesi Pertemuan
                </h2>
                <p className="text-[11px] text-gray-500">
                  Nomor sesi dan topik pembahasan pembelajaran.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#2A2C5E] bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
              Pertemuan ke-{nomorPertemuan}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            {/* Nomor Pertemuan */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Nomor Pertemuan:
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={nomorPertemuan}
                onChange={(e) => setNomorPertemuan(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                required
              />
            </div>

            {/* Kategori Sesi */}
            <div className="sm:col-span-3">
              <label className="block font-semibold text-gray-700 mb-1">
                Kategori Sesi Pembelajaran:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTipePertemuan("REGULER");
                    setTugasTipe("PILIHAN_GANDA");
                    setDurasiMenit(60);
                  }}
                  className={`py-2 px-3 rounded-xl font-bold text-xs text-center border transition-all cursor-pointer ${
                    tipePertemuan === "REGULER"
                      ? "bg-[#2A2C5E] text-white border-[#2A2C5E] shadow-2xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  Sesi Reguler / Formatif
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTipePertemuan("UTS");
                    setTugasTipe("UJIAN_UTS");
                    setDurasiMenit(90);
                    setSertakanSoal(true);
                  }}
                  className={`py-2 px-3 rounded-xl font-bold text-xs text-center border transition-all cursor-pointer ${
                    tipePertemuan === "UTS"
                      ? "bg-[#2A2C5E] text-white border-[#2A2C5E] shadow-2xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  Penilaian Tengah Semester (UTS)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTipePertemuan("UAS");
                    setTugasTipe("UJIAN_UAS");
                    setDurasiMenit(90);
                    setSertakanSoal(true);
                  }}
                  className={`py-2 px-3 rounded-xl font-bold text-xs text-center border transition-all cursor-pointer ${
                    tipePertemuan === "UAS"
                      ? "bg-[#2A2C5E] text-white border-[#2A2C5E] shadow-2xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  Penilaian Akhir Semester (UAS)
                </button>
              </div>
            </div>
          </div>

          {/* Judul Topik Pertemuan */}
          <div className="text-xs space-y-1">
            <label className="block font-semibold text-gray-700">
              Judul / Topik Pembahasan:
            </label>
            <input
              type="text"
              value={judulPertemuan}
              onChange={(e) => setJudulPertemuan(e.target.value)}
              placeholder="Contoh: Pertemuan 9: Struktur Membran Plasma dan Mekanisme Transpor Zat"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
              required
            />
          </div>
        </div>

        {/* ================================================================= */}
        {/* KARTU 2: BAHAN AJAR & MODUL PEMBELAJARAN (TANPA DEADLINE) */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900">
                  Bahan Ajar &amp; Modul Pembelajaran Siswa
                </h2>
                <p className="text-[11px] text-gray-500">
                  Materi dapat diakses siswa kapan saja tanpa batas tenggat waktu.
                </p>
              </div>
            </div>
          </div>

          {/* 3 Pilihan Format Bahan Ajar Interaktif */}
          <div className="space-y-1.5 text-xs">
            <label className="block font-semibold text-gray-700">
              Pilih Format Bahan Ajar:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMateriTipe("DOKUMEN")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  materiTipe === "DOKUMEN"
                    ? "bg-emerald-50/70 border-emerald-400 text-emerald-950 shadow-2xs ring-1 ring-emerald-400"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${materiTipe === "DOKUMEN" ? "bg-emerald-600 text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs">Dokumen / Modul PDF</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Bahan bacaan digital atau modul cetak sekolah.</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMateriTipe("VIDEO")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  materiTipe === "VIDEO"
                    ? "bg-emerald-50/70 border-emerald-400 text-emerald-950 shadow-2xs ring-1 ring-emerald-400"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${materiTipe === "VIDEO" ? "bg-emerald-600 text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs">Video Pembelajaran</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Tautan video penjelasan YouTube atau rekaman.</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMateriTipe("RINGKASAN")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  materiTipe === "RINGKASAN"
                    ? "bg-emerald-50/70 border-emerald-400 text-emerald-950 shadow-2xs ring-1 ring-emerald-400"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${materiTipe === "RINGKASAN" ? "bg-emerald-600 text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs">Ringkasan Teks Digital</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Catatan rangkuman konsep langsung di halaman.</div>
                </div>
              </button>
            </div>
          </div>

          {/* Judul Bahan Ajar */}
          <div className="text-xs space-y-1">
            <label className="block font-semibold text-gray-700">
              Judul Bahan Ajar:
            </label>
            <input
              type="text"
              value={materiJudul}
              onChange={(e) => setMateriJudul(e.target.value)}
              placeholder="Contoh: Modul Ajar Bab 9: Struktur Sel & Membran Ganda"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
              required
            />
          </div>

          {/* Form Dinamis: Menyesuaikan Format yang Dipilih */}
          {materiTipe === "DOKUMEN" && (
            <div className="space-y-3 pt-2 border-t border-gray-100 text-xs">
              <label className="block font-semibold text-gray-700">
                Pilih Berkas Dokumen Modul (PDF / DOCX):
              </label>
              <div className="p-4 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 text-center space-y-2">
                <Upload className="w-7 h-7 text-emerald-600 mx-auto" />
                <div className="text-xs font-bold text-emerald-900">
                  {uploadedFileName}
                </div>
                <p className="text-[11px] text-gray-500">
                  Berkas bahan ajar siap diunduh dan dipelajari peserta didik secara mandiri.
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const names = [
                        "Modul_Ajar_SMAN2_Bab9_Lengkap.pdf",
                        "Bahan_Ajar_Sains_Kurikulum_Merdeka.pdf",
                        "Lembar_Kerja_Peserta_Didik_Bab9.pdf",
                      ];
                      const next = names[(names.indexOf(uploadedFileName) + 1) % names.length];
                      setUploadedFileName(next);
                    }}
                    className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 text-[11px] font-bold rounded-lg shadow-2xs hover:bg-emerald-50 cursor-pointer"
                  >
                    Ganti Berkas Contoh
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Deskripsi Singkat / Petunjuk Membaca Modul:
                </label>
                <input
                  type="text"
                  value={materiRingkasan}
                  onChange={(e) => setMateriRingkasan(e.target.value)}
                  placeholder="Contoh: Bacalah modul bab 9 halaman 12-25 sebelum melanjutkan ke sesi diskusi."
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                />
              </div>
            </div>
          )}

          {materiTipe === "VIDEO" && (
            <div className="space-y-3 pt-2 border-t border-gray-100 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Tautan Video Pembelajaran (YouTube / Video Edukatif):
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={materiFileUrl}
                    onChange={(e) => setMateriFileUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                <Video className="w-8 h-8 text-rose-600 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-gray-900">Pemutar Video Terintegrasi</div>
                  <div className="text-[11px] text-gray-500">
                    Siswa dapat memutar video langsung di portal tanpa harus membuka aplikasi lain.
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Catatan Poin Kunci Video:
                </label>
                <textarea
                  rows={3}
                  value={materiKontenLengkap}
                  onChange={(e) => setMateriKontenLengkap(e.target.value)}
                  placeholder="Tuliskan poin penting atau rangkuman yang harus dicermati siswa dari video..."
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                />
              </div>
            </div>
          )}

          {materiTipe === "RINGKASAN" && (
            <div className="space-y-3 pt-2 border-t border-gray-100 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Uraian Catatan / Rangkuman Pelajaran Lengkap:
                </label>
                <textarea
                  rows={5}
                  value={materiKontenLengkap}
                  onChange={(e) => setMateriKontenLengkap(e.target.value)}
                  placeholder="Ketikkan teks materi penjelasan lengkap di sini. Teks ini akan langsung tampil di layar siswa dengan tipografi yang nyaman dibaca..."
                  className="w-full p-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* KARTU 3: LATIHAN SOAL & ASESMEN CBT (DENGAN DEADLINE TUGAS) */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900">
                  Latihan Soal &amp; Asesmen Siswa (Tugas / CBT)
                </h2>
                <p className="text-[11px] text-gray-500">
                  Dilengkapi batas waktu pengumpulan (deadline tugas) dan penilaian otomatis.
                </p>
              </div>
            </div>

            {/* Toggle Ramah: Sertakan Soal atau Hanya Materi */}
            <label className="inline-flex items-center gap-2.5 cursor-pointer bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={sertakanSoal}
                onChange={(e) => setSertakanSoal(e.target.checked)}
                className="w-4 h-4 accent-[#2A2C5E] rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-gray-900">
                {sertakanSoal ? "Aktif: Sertakan Soal Tugas" : "Non-Aktif (Hanya Materi Saja)"}
              </span>
            </label>
          </div>

          {sertakanSoal ? (
            <div className="space-y-5 pt-1">
              {/* Batas Waktu Pengumpulan (Deadline Tugas) */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-gray-900">
                      Batas Waktu Pengumpulan (Deadline Tugas):
                    </span>
                  </div>
                  {/* Tombol Cepat Deadline */}
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-gray-500 text-[10px]">Pilihan Cepat:</span>
                    <button
                      type="button"
                      onClick={() => setQuickDeadline(3)}
                      className="px-2 py-0.5 bg-white border border-amber-300 hover:bg-amber-100 rounded-md font-semibold text-amber-900 cursor-pointer"
                    >
                      +3 Hari
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDeadline(7)}
                      className="px-2 py-0.5 bg-white border border-amber-300 hover:bg-amber-100 rounded-md font-semibold text-amber-900 cursor-pointer"
                    >
                      +1 Minggu
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDeadline(14)}
                      className="px-2 py-0.5 bg-white border border-amber-300 hover:bg-amber-100 rounded-md font-semibold text-amber-900 cursor-pointer"
                    >
                      +2 Minggu
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <input
                      type="text"
                      value={deadlineTugas}
                      onChange={(e) => setDeadlineTugas(e.target.value)}
                      placeholder="Senin, 15 Desember 2026, 23:59 WIB"
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-600 bg-white/70 px-3 py-1.5 rounded-xl border border-amber-200/60">
                    <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Siswa tidak dapat mengirimkan jawaban setelah melewati batas waktu ini.</span>
                  </div>
                </div>
              </div>

              {/* Pilihan Format Lembar Soal */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Jenis Evaluasi:
                  </label>
                  <select
                    value={tugasTipe}
                    onChange={(e) => setTugasTipe(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                  >
                    <option value="PILIHAN_GANDA">Pilihan Ganda (Auto-Scoring CBT)</option>
                    <option value="ESSAY">Tugas Essay / Uraian Mandiri</option>
                    {tipePertemuan === "UTS" && (
                      <option value="UJIAN_UTS">Ujian Tengah Semester (UTS)</option>
                    )}
                    {tipePertemuan === "UAS" && (
                      <option value="UJIAN_UAS">Ujian Akhir Semester (UAS)</option>
                    )}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">
                    Judul Lembar Soal / Asesmen:
                  </label>
                  <input
                    type="text"
                    value={tugasJudul}
                    onChange={(e) => setTugasJudul(e.target.value)}
                    placeholder="Contoh: Latihan Formatif Bab 9: Struktur Membran Sel"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                  />
                </div>
              </div>

              {/* Pembuat Soal Pilihan Ganda Interaktif */}
              {(tugasTipe === "PILIHAN_GANDA" || tugasTipe === "UJIAN_UTS" || tugasTipe === "UJIAN_UAS") && (
                <div className="space-y-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                        Butir Soal Pilihan Ganda ({soalPilganList.length} Butir &bull; Bobot:{" "}
                        <span className="text-[#2A2C5E]">
                          {Math.round(100 / Math.max(1, soalPilganList.length))} poin/soal
                        </span>
                        )
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Tentukan teks pertanyaan dan klik tombol radio pada opsi yang menjadi kunci jawaban benar.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSoalPilgan}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2A2C5E] hover:bg-[#1F2147] text-white text-xs font-bold rounded-lg shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Soal Baru</span>
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {soalPilganList.map((soal, sIdx) => (
                      <div
                        key={soal.id}
                        className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-3"
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

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Teks Pertanyaan:
                          </label>
                          <textarea
                            rows={2}
                            value={soal.pertanyaan}
                            onChange={(e) => handleUpdatePertanyaan(sIdx, e.target.value)}
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                            required
                          />
                        </div>

                        {/* Opsi Pilihan A, B, C, D */}
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-semibold text-gray-700">
                            Pilihan Jawaban (Tandai Kunci Jawaban Benar):
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {soal.pilihan.map((opsi, oIdx) => {
                              const isKey = soal.kunci === oIdx;
                              const abcd = ["A", "B", "C", "D"][oIdx];
                              return (
                                <div
                                  key={oIdx}
                                  className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                                    isKey
                                      ? "bg-emerald-50 border-emerald-400 text-emerald-950 shadow-2xs ring-1 ring-emerald-300"
                                      : "bg-white border-gray-200 text-gray-700"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`kunci-soal-${sIdx}`}
                                    checked={isKey}
                                    onChange={() => handleUpdateKunci(sIdx, oIdx)}
                                    className="accent-emerald-600 cursor-pointer w-4 h-4 shrink-0"
                                    title="Tandai sebagai kunci jawaban benar"
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
                                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/90 px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
                                      <Check className="w-3 h-3" />
                                      <span>Kunci Benar</span>
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pembuat Soal Essay */}
              {tugasTipe === "ESSAY" && (
                <div className="space-y-3 pt-3 border-t border-gray-100 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Pertanyaan Tugas Uraian / Studi Kasus:
                    </label>
                    <textarea
                      rows={4}
                      value={pertanyaanEssay}
                      onChange={(e) => setPertanyaanEssay(e.target.value)}
                      placeholder="Tuliskan butir soal essay atau studi kasus yang harus dikerjakan siswa..."
                      className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2A2C5E] shrink-0" />
                    <span>Siswa dapat mengetikkan jawaban secara langsung di portal atau mengunggah lembar kerja tugas sebelum batas tenggat waktu.</span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-center text-xs text-emerald-900 space-y-1">
              <div className="font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pertemuan Bebas Tugas (Hanya Materi Pembelajaran)</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Sesi ini difokuskan untuk membaca modul atau menyimak video pembelajaran tanpa kewajiban mengerjakan lembar kuis evaluasi.
              </p>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* TOMBOL AKSI SIMPAN */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Sesi akan langsung muncul di alur belajar siswa dan kolom nilai kelas.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href={`/guru/mapel?id=${activeClass?.id}`}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 text-center cursor-pointer"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2A2C5E] hover:bg-[#1F2147] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? "Menerbitkan Pertemuan..."
                  : "Simpan & Terbitkan Pertemuan"}
              </span>
            </button>
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
