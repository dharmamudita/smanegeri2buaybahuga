"use client";

import { useState, useMemo, Suspense } from "react";
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
  PlusCircle,
  Save,
  Trash2,
  Video,
  X,
  FileQuestion,
  GraduationCap,
  Sparkles,
  ChevronRight,
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

  // Nomor pertemuan otomatis berikutnya
  const defaultMeetingNumber = useMemo(() => {
    return (activeClass?.pertemuanList.length || 0) + 1;
  }, [activeClass]);

  // Form State: 1. Informasi Pertemuan
  const [nomorPertemuan, setNomorPertemuan] = useState<number>(defaultMeetingNumber);
  const [judulPertemuan, setJudulPertemuan] = useState<string>("");
  const [tipePertemuan, setTipePertemuan] = useState<"REGULER" | "UTS" | "UAS">("REGULER");
  const [tanggalPertemuan, setTanggalPertemuan] = useState<string>("Senin, 08 Desember 2026");
  const [jamPelaksanaan, setJamPelaksanaan] = useState<string>("07:30 - 09:30 WIB");
  const [durasiMenit, setDurasiMenit] = useState<number>(60);
  const [petunjukUjian, setPetunjukUjian] = useState<string>(
    "Pelajari materi yang disajikan dengan seksama, kemudian kerjakan soal evaluasi pemahaman mandiri."
  );

  // Form State: 2. Modul Bahan Ajar (Materi Siswa)
  const [materiTipe, setMateriTipe] = useState<"DOKUMEN" | "VIDEO" | "RINGKASAN">("DOKUMEN");
  const [materiJudul, setMateriJudul] = useState<string>("");
  const [materiRingkasan, setMateriRingkasan] = useState<string>("");
  const [materiKontenLengkap, setMateriKontenLengkap] = useState<string>("");
  const [materiFileUrl, setMateriFileUrl] = useState<string>("");

  // Form State: 3. Evaluasi & Soal CBT (Opsional dengan Sakelar Ramah)
  const [sertakanSoal, setSertakanSoal] = useState<boolean>(true);
  const [tugasTipe, setTugasTipe] = useState<"PILIHAN_GANDA" | "ESSAY" | "UJIAN_UTS" | "UJIAN_UAS">(
    "PILIHAN_GANDA"
  );
  const [tugasJudul, setTugasJudul] = useState<string>("");
  const [tugasDeskripsi, setTugasDeskripsi] = useState<string>("");
  const [pertanyaanEssay, setPertanyaanEssay] = useState<string>("");

  // Daftar Butir Soal Pilihan Ganda
  const [soalPilganList, setSoalPilganList] = useState<SoalPilgan[]>([
    {
      id: 1,
      pertanyaan: "Berdasarkan materi yang dipelajari pada sesi ini, konsep utama yang menjadi fokus adalah...",
      pilihan: [
        "Pemahaman dasar teori dan implementasi praktis",
        "Pengamatan tanpa analisis data ilmiah",
        "Pencatatan data tanpa kesimpulan",
        "Metode coba-coba tanpa kajian pustaka",
      ],
      kunci: 0,
    },
    {
      id: 2,
      pertanyaan: "Faktor terpenting dalam memastikan keberhasilan penerapan materi pembelajaran ini adalah...",
      pilihan: [
        "Integritas ilmiah, penalaran kritis, dan ketelitian kerja",
        "Kecepatan menyelesaikan tanpa verifikasi",
        "Menghafal rumus tanpa memahami konsep",
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
        pertanyaan: `Pertanyaan nomor ${nextId}: Tuliskan butir soal Anda di sini...`,
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

    const newMeeting: PertemuanItem = {
      id: meetingId,
      nomor: Number(nomorPertemuan),
      judul: finalJudul,
      tipe: tipePertemuan,
      tanggal: `${tanggalPertemuan}, ${jamPelaksanaan}`,
      durasiMenit: tipePertemuan === "REGULER" ? undefined : durasiMenit,
      petunjukUjian: petunjukUjian,
      materi: {
        judul:
          materiJudul.trim() ||
          `Bahan Ajar Pertemuan ${nomorPertemuan}: ${finalJudul}`,
        tipe: materiTipe,
        ringkasan:
          materiRingkasan.trim() ||
          "Ringkasan bahan ajar dan capaian pembelajaran kurikulum merdeka.",
        kontenLengkap:
          materiKontenLengkap.trim() ||
          materiRingkasan.trim() ||
          "Materi modul ajar resmi SMAN 2 Buay Bahuga untuk dipelajari peserta didik.",
        fileUrl: materiFileUrl.trim() || undefined,
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
              "Jawablah seluruh butir soal asesmen evaluasi berikut dengan cermat dan teliti.",
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
      {/* Tombol Kembali & Breadcrumb yang Rapi */}
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
            <span>Ruang Kelas: {activeClass?.nama} ({activeClass?.kode})</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Tambah Pertemuan Pembelajaran Baru
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Rancang jadwal sesi, materi pembelajaran siswa, dan latihan soal secara mudah dan terstruktur.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600">
          <Clock className="w-4 h-4 text-[#2A2C5E]" />
          <span>Jadwal Reguler: <strong>{activeClass?.jadwal}</strong></span>
        </div>
      </div>

      {/* Formulir Ramah Guru */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================================================================= */}
        {/* KARTU 1: IDENTITAS & WAKTU PERTEMUAN */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#2A2C5E] font-bold text-xs flex items-center justify-center">
                1
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900">
                  Informasi Sesi Pertemuan
                </h2>
                <p className="text-[11px] text-gray-500">
                  Tentukan nomor pertemuan, topik pembahasan, dan tanggal pelaksanaan sesi.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#2A2C5E] bg-blue-50 px-2 py-0.5 rounded">
              Pertemuan ke-{nomorPertemuan}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
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
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                required
              />
            </div>

            {/* Kategori Sesi Pembelajaran */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">
                Kategori Pertemuan:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTipePertemuan("REGULER");
                    setTugasTipe("PILIHAN_GANDA");
                    setDurasiMenit(60);
                  }}
                  className={`py-2 px-2.5 rounded-xl font-bold text-xs text-center border transition-all cursor-pointer ${
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
                  className={`py-2 px-2.5 rounded-xl font-bold text-xs text-center border transition-all cursor-pointer ${
                    tipePertemuan === "UTS"
                      ? "bg-[#2A2C5E] text-white border-[#2A2C5E] shadow-2xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  Ujian Tengah Semester (UTS)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTipePertemuan("UAS");
                    setTugasTipe("UJIAN_UAS");
                    setDurasiMenit(90);
                    setSertakanSoal(true);
                  }}
                  className={`py-2 px-2.5 rounded-xl font-bold text-xs text-center border transition-all cursor-pointer ${
                    tipePertemuan === "UAS"
                      ? "bg-[#2A2C5E] text-white border-[#2A2C5E] shadow-2xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  Ujian Akhir Semester (UAS)
                </button>
              </div>
            </div>
          </div>

          {/* Judul Pertemuan */}
          <div className="text-xs space-y-1">
            <label className="block font-semibold text-gray-700">
              Judul / Topik Pertemuan:
            </label>
            <input
              type="text"
              value={judulPertemuan}
              onChange={(e) => setJudulPertemuan(e.target.value)}
              placeholder="Contoh: Pertemuan 9: Struktur Membran Plasma dan Transpor Zat"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
              required
            />
          </div>

          {/* Tanggal & Waktu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Hari &amp; Tanggal Sesi:
              </label>
              <input
                type="text"
                value={tanggalPertemuan}
                onChange={(e) => setTanggalPertemuan(e.target.value)}
                placeholder="Senin, 08 Desember 2026"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Waktu Pembelajaran:
              </label>
              <input
                type="text"
                value={jamPelaksanaan}
                onChange={(e) => setJamPelaksanaan(e.target.value)}
                placeholder="07:30 - 09:30 WIB"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
              />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* KARTU 2: MODUL BAHAN AJAR (MATERI SISWA) */}
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
                  Materi yang akan dibaca atau dipelajari siswa di ruang kelas digital mereka.
                </p>
              </div>
            </div>
          </div>

          {/* Pilihan Format Materi */}
          <div className="space-y-1.5 text-xs">
            <label className="block font-semibold text-gray-700">
              Format Bahan Ajar:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMateriTipe("DOKUMEN")}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  materiTipe === "DOKUMEN"
                    ? "bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dokumen / Modul PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setMateriTipe("VIDEO")}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  materiTipe === "VIDEO"
                    ? "bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <Video className="w-3.5 h-3.5 text-emerald-600" />
                <span>Video Pembelajaran</span>
              </button>
              <button
                type="button"
                onClick={() => setMateriTipe("RINGKASAN")}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  materiTipe === "RINGKASAN"
                    ? "bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ringkasan Bacaan Teks</span>
              </button>
            </div>
          </div>

          {/* Judul Bahan Ajar */}
          <div className="text-xs space-y-1">
            <label className="block font-semibold text-gray-700">
              Judul Modul Bahan Ajar:
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

          {/* Ringkasan Singkat */}
          <div className="text-xs space-y-1">
            <label className="block font-semibold text-gray-700">
              Ringkasan Singkat Capaian Pembelajaran:
            </label>
            <input
              type="text"
              value={materiRingkasan}
              onChange={(e) => setMateriRingkasan(e.target.value)}
              placeholder="Contoh: Memahami fungsi membran sel, difusi terfasilitasi, dan transpor aktif."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
            />
          </div>

          {/* Uraian Konten Lengkap */}
          <div className="text-xs space-y-1">
            <label className="block font-semibold text-gray-700">
              Isi Penjelasan Lengkap Materi:
            </label>
            <textarea
              rows={4}
              value={materiKontenLengkap}
              onChange={(e) => setMateriKontenLengkap(e.target.value)}
              placeholder="Tuliskan uraian materi secara lengkap agar siswa dapat membaca dan belajar mandiri..."
              className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
            />
          </div>

          {/* Link Referensi Opsional */}
          <div className="text-xs space-y-1">
            <label className="block font-semibold text-gray-700">
              Tautan Dokumen / File Pendukung (Opsional):
            </label>
            <input
              type="text"
              value={materiFileUrl}
              onChange={(e) => setMateriFileUrl(e.target.value)}
              placeholder="https://drive.google.com/... (tautan materi pendukung jika ada)"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 font-mono text-[11px]"
            />
          </div>
        </div>

        {/* ================================================================= */}
        {/* KARTU 3: EVALUASI & SOAL CBT (DENGAN SAKELAR RAMAH GURU) */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900">
                  Latihan Soal &amp; Asesmen CBT Siswa (Opsional)
                </h2>
                <p className="text-[11px] text-gray-500">
                  Tambahkan lembar kuis atau evaluasi mandiri jika pertemuan ini memerlukan penilaian.
                </p>
              </div>
            </div>

            {/* Sakelar / Toggle Ramah Guru */}
            <label className="inline-flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={sertakanSoal}
                onChange={(e) => setSertakanSoal(e.target.checked)}
                className="w-4 h-4 accent-[#2A2C5E] rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-gray-800">
                {sertakanSoal ? "Aktif (Sertakan Soal)" : "Non-Aktif (Hanya Materi)"}
              </span>
            </label>
          </div>

          {sertakanSoal ? (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Format Soal */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Format Lembar Soal:
                  </label>
                  <select
                    value={tugasTipe}
                    onChange={(e) => setTugasTipe(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                  >
                    <option value="PILIHAN_GANDA">Pilihan Ganda (Auto-Scoring CBT)</option>
                    <option value="ESSAY">Soal Essay Uraian</option>
                    {tipePertemuan === "UTS" && (
                      <option value="UJIAN_UTS">Asesmen Sumatif UTS</option>
                    )}
                    {tipePertemuan === "UAS" && (
                      <option value="UJIAN_UAS">Asesmen Sumatif UAS</option>
                    )}
                  </select>
                </div>

                {/* Judul Lembar Soal */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">
                    Judul Lembar Soal:
                  </label>
                  <input
                    type="text"
                    value={tugasJudul}
                    onChange={(e) => setTugasJudul(e.target.value)}
                    placeholder="Contoh: Kuis Pemahaman Formatif Pertemuan 9"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                  />
                </div>
              </div>

              {/* Pembuat Soal Pilihan Ganda */}
              {(tugasTipe === "PILIHAN_GANDA" || tugasTipe === "UJIAN_UTS" || tugasTipe === "UJIAN_UAS") && (
                <div className="space-y-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                        Daftar Butir Soal Pilihan Ganda ({soalPilganList.length} Soal)
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Klik tombol radio lingkaran untuk menentukan kunci jawaban yang benar.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSoalPilgan}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2A2C5E] hover:bg-[#1F2147] text-white text-xs font-bold rounded-lg shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Butir Soal</span>
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
                            Nomor {sIdx + 1}
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
                            Pertanyaan:
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
                        <div className="space-y-2">
                          <label className="block text-[11px] font-semibold text-gray-700">
                            Opsi Pilihan Jawaban (Pilih Kunci yang Benar):
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
                                      ? "bg-emerald-50 border-emerald-400 text-emerald-900 shadow-2xs"
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
                                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md shrink-0">
                                      Kunci Benar
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
                      Pertanyaan Uraian / Studi Kasus:
                    </label>
                    <textarea
                      rows={4}
                      value={pertanyaanEssay}
                      onChange={(e) => setPertanyaanEssay(e.target.value)}
                      placeholder="Tuliskan butir soal essay yang harus diuraikan oleh siswa..."
                      className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-xl text-center text-xs text-gray-500">
              Sesi pertemuan ini hanya berisi modul bahan ajar tanpa lembar kuis evaluasi.
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* TOMBOL AKSI SIMPAN & TERBITKAN */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Pertemuan akan langsung diterbitkan ke akun siswa dan buku nilai guru kelas ini.
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
