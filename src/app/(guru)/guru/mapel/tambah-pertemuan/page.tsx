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
  GraduationCap,
  HelpCircle,
  Plus,
  PlusCircle,
  Save,
  Trash2,
  Video,
  X,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useLMSStore, PertemuanItem, SoalPilgan } from "@/lib/lmsStore";

function TambahPertemuanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classIdParam = searchParams.get("classId");

  const { classes, addPertemuan } = useLMSStore();

  // Kelas yang dipilih
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classIdParam || classes[0]?.id || "mapel-1"
  );

  const activeClass = useMemo(() => {
    return classes.find((c) => c.id === selectedClassId) || classes[0];
  }, [classes, selectedClassId]);

  // Nomor pertemuan default (auto-increment)
  const defaultMeetingNumber = useMemo(() => {
    return (activeClass?.pertemuanList.length || 0) + 1;
  }, [activeClass]);

  // Form State: Informasi Pertemuan
  const [nomorPertemuan, setNomorPertemuan] = useState<number>(defaultMeetingNumber);
  const [judulPertemuan, setJudulPertemuan] = useState<string>("");
  const [tipePertemuan, setTipePertemuan] = useState<"REGULER" | "UTS" | "UAS">("REGULER");
  const [tanggalPertemuan, setTanggalPertemuan] = useState<string>("Senin, 08 Desember 2026");
  const [jamPelaksanaan, setJamPelaksanaan] = useState<string>("07:30 - 09:30 WIB");
  const [durasiMenit, setDurasiMenit] = useState<number>(60);
  const [petunjukUjian, setPetunjukUjian] = useState<string>(
    "Kerjakan secara mandiri dengan teliti. Nilai evaluasi akan langsung tercatat di buku nilai digital guru."
  );

  // Form State: Modul Bahan Ajar (Materi)
  const [materiTipe, setMateriTipe] = useState<"DOKUMEN" | "VIDEO" | "RINGKASAN">("DOKUMEN");
  const [materiJudul, setMateriJudul] = useState<string>("");
  const [materiRingkasan, setMateriRingkasan] = useState<string>("");
  const [materiKontenLengkap, setMateriKontenLengkap] = useState<string>("");
  const [materiFileUrl, setMateriFileUrl] = useState<string>("");

  // Form State: Evaluasi & Soal CBT
  const [tugasTipe, setTugasTipe] = useState<"PILIHAN_GANDA" | "ESSAY" | "UJIAN_UTS" | "UJIAN_UAS">(
    "PILIHAN_GANDA"
  );
  const [tugasJudul, setTugasJudul] = useState<string>("");
  const [tugasDeskripsi, setTugasDeskripsi] = useState<string>("");
  const [pertanyaanEssay, setPertanyaanEssay] = useState<string>("");

  // Builder Butir Soal Pilihan Ganda
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

  // Tambah Butir Soal Pilihan Ganda Baru
  const handleAddSoalPilgan = () => {
    const nextId = soalPilganList.length + 1;
    setSoalPilganList([
      ...soalPilganList,
      {
        id: nextId,
        pertanyaan: `Tuliskan butir soal pertanyaan nomor ${nextId} di sini...`,
        pilihan: ["Pilihan Jawaban A", "Pilihan Jawaban B", "Pilihan Jawaban C", "Pilihan Jawaban D"],
        kunci: 0,
      },
    ]);
  };

  // Update Teks Pertanyaan
  const handleUpdatePertanyaan = (index: number, text: string) => {
    const updated = [...soalPilganList];
    updated[index].pertanyaan = text;
    setSoalPilganList(updated);
  };

  // Update Opsi Pilihan
  const handleUpdatePilihan = (soalIndex: number, opsiIndex: number, text: string) => {
    const updated = [...soalPilganList];
    updated[soalIndex].pilihan[opsiIndex] = text;
    setSoalPilganList(updated);
  };

  // Update Kunci Jawaban
  const handleUpdateKunci = (soalIndex: number, kunciIndex: number) => {
    const updated = [...soalPilganList];
    updated[soalIndex].kunci = kunciIndex;
    setSoalPilganList(updated);
  };

  // Hapus Butir Soal
  const handleDeleteSoal = (index: number) => {
    if (soalPilganList.length <= 1) {
      alert("Pertemuan harus memiliki minimal 1 butir soal evaluasi.");
      return;
    }
    setSoalPilganList(soalPilganList.filter((_, i) => i !== index));
  };

  // Form Submission
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
      tugas: {
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
      },
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
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-12">
      {/* Navigasi Breadcrumb Kembali */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <Link
          href={`/guru/mapel?id=${activeClass?.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2A2C5E] hover:text-[#1F2147] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Ruang Kelas {activeClass?.nama}</span>
        </Link>

        <span className="text-[11px] font-semibold text-gray-400">
          Kurikulum Merdeka &bull; SMAN 2 Buay Bahuga
        </span>
      </div>

      {/* Header Halaman Resmi */}
      <div className="bg-[#2A2C5E] text-white rounded-2xl p-6 sm:p-7 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/15 text-blue-100 text-xs font-bold">
          <GraduationCap className="w-4 h-4 text-blue-200" />
          <span>Formulir Penerbitan Sesi Pertemuan Pembelajaran</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          Tambah Pertemuan Baru: {activeClass?.nama}
        </h1>
        <p className="text-xs sm:text-sm text-blue-200">
          Lengkapi data sesi tatap muka, modul materi ajar siswa, serta instrumen soal ujian/kuis CBT secara lengkap dan terstruktur.
        </p>
      </div>

      {/* Formulir Lengkap Tambah Pertemuan */}
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* ================================================================= */}
        {/* BAGIAN 1: INFORMASI IDENTITAS PERTEMUAN */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 text-[#2A2C5E] rounded-lg">
                <Calendar className="w-4 h-4" />
              </span>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                1. Informasi Dasar Pertemuan
              </h2>
            </div>
            <span className="text-xs text-gray-500">Wajib Diisi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Pemilih Kelas */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Ruang Kelas Dituju:
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.nama} ({cls.kode})
                  </option>
                ))}
              </select>
            </div>

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
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                required
              />
            </div>

            {/* Kategori Pertemuan */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Kategori Sesi:
              </label>
              <select
                value={tipePertemuan}
                onChange={(e) => {
                  const val = e.target.value as "REGULER" | "UTS" | "UAS";
                  setTipePertemuan(val);
                  if (val === "UTS") {
                    setTugasTipe("UJIAN_UTS");
                    setDurasiMenit(90);
                  } else if (val === "UAS") {
                    setTugasTipe("UJIAN_UAS");
                    setDurasiMenit(90);
                  } else {
                    setTugasTipe("PILIHAN_GANDA");
                    setDurasiMenit(60);
                  }
                }}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
              >
                <option value="REGULER">Sesi Reguler / Formatif</option>
                <option value="UTS">Penilaian Tengah Semester (UTS)</option>
                <option value="UAS">Penilaian Akhir Semester (UAS)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Judul Pertemuan */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Judul Sesi Pertemuan:
              </label>
              <input
                type="text"
                value={judulPertemuan}
                onChange={(e) => setJudulPertemuan(e.target.value)}
                placeholder="Contoh: Pertemuan 9: Variasi Genetik dan Hukum Hardy-Weinberg"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                required
              />
            </div>

            {/* Tanggal & Waktu Pelaksanaan */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Jadwal &amp; Jam Pelaksanaan:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={tanggalPertemuan}
                  onChange={(e) => setTanggalPertemuan(e.target.value)}
                  placeholder="Senin, 08 Desember 2026"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                />
                <input
                  type="text"
                  value={jamPelaksanaan}
                  onChange={(e) => setJamPelaksanaan(e.target.value)}
                  placeholder="07:30 - 09:30 WIB"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                />
              </div>
            </div>
          </div>

          {/* Durasi & Petunjuk */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Durasi Pengerjaan Asesmen (Menit):
              </label>
              <input
                type="number"
                min="15"
                max="180"
                value={durasiMenit}
                onChange={(e) => setDurasiMenit(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">
                Petunjuk Pelaksanaan Pembelajaran:
              </label>
              <input
                type="text"
                value={petunjukUjian}
                onChange={(e) => setPetunjukUjian(e.target.value)}
                placeholder="Petunjuk pengerjaan dan kedisiplinan..."
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
              />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* BAGIAN 2: MODUL MATERI PEMBELAJARAN (BAHAN AJAR SISWA) */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 text-[#2A2C5E] rounded-lg">
                <BookOpen className="w-4 h-4" />
              </span>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                2. Modul Bahan Ajar (Materi Pembelajaran)
              </h2>
            </div>
            <span className="text-xs text-gray-500">Materi yang dibaca siswa</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Format Bahan Ajar:
              </label>
              <select
                value={materiTipe}
                onChange={(e) => setMateriTipe(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
              >
                <option value="DOKUMEN">Dokumen / Modul PDF Digital</option>
                <option value="VIDEO">Video Pembelajaran Interaktif</option>
                <option value="RINGKASAN">Ringkasan Konsep Materi</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">
                Judul Modul Bahan Ajar:
              </label>
              <input
                type="text"
                value={materiJudul}
                onChange={(e) => setMateriJudul(e.target.value)}
                placeholder="Contoh: Modul Ajar Bab 9: Teori Evolusi Sintesis Modern"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                required
              />
            </div>
          </div>

          <div className="text-xs space-y-1">
            <label className="block font-semibold text-gray-700">
              Ringkasan Capaian Pembelajaran:
            </label>
            <input
              type="text"
              value={materiRingkasan}
              onChange={(e) => setMateriRingkasan(e.target.value)}
              placeholder="Ringkasan poin utama yang akan dipahami oleh siswa..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
            />
          </div>

          <div className="text-xs space-y-1">
            <label className="block font-semibold text-gray-700">
              Konten / Penjelasan Lengkap Bahan Ajar:
            </label>
            <textarea
              rows={4}
              value={materiKontenLengkap}
              onChange={(e) => setMateriKontenLengkap(e.target.value)}
              placeholder="Tuliskan uraian materi modul secara mendalam di sini agar siswa dapat membaca dan belajar secara mandiri..."
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
            />
          </div>

          <div className="text-xs space-y-1">
            <label className="block font-semibold text-gray-700">
              Tautan Lampiran Referensi / Sumber Bacaan (Opsional):
            </label>
            <input
              type="text"
              value={materiFileUrl}
              onChange={(e) => setMateriFileUrl(e.target.value)}
              placeholder="https://drive.google.com/... atau URL modul referensi"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 font-mono text-[11px]"
            />
          </div>
        </div>

        {/* ================================================================= */}
        {/* BAGIAN 3: INSTRUMEN EVALUASI & SOAL CBT SISWA */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
                <HelpCircle className="w-4 h-4" />
              </span>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                3. Instrumen Evaluasi &amp; Lembar Soal CBT
              </h2>
            </div>
            <span className="text-xs text-gray-500">Soal yang dikerjakan siswa</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Format Lembar Evaluasi:
              </label>
              <select
                value={tugasTipe}
                onChange={(e) => setTugasTipe(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
              >
                <option value="PILIHAN_GANDA">Kuis CBT Pilihan Ganda (Auto-Scoring)</option>
                <option value="ESSAY">Soal Essay Uraian / Studi Kasus</option>
                <option value="UJIAN_UTS">Asesmen Sumatif Tengah Semester (UTS)</option>
                <option value="UJIAN_UAS">Asesmen Sumatif Akhir Semester (UAS)</option>
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
                placeholder="Contoh: Evaluasi Formatif CBT Pertemuan 9"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                required
              />
            </div>
          </div>

          <div className="text-xs space-y-1">
            <label className="block font-semibold text-gray-700">
              Instruksi &amp; Petunjuk Pengerjaan Soal:
            </label>
            <input
              type="text"
              value={tugasDeskripsi}
              onChange={(e) => setTugasDeskripsi(e.target.value)}
              placeholder="Contoh: Pilihlah salah satu opsi jawaban yang paling tepat. Waktu pengerjaan 60 menit."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
            />
          </div>

          {/* Builder Soal Pilihan Ganda */}
          {(tugasTipe === "PILIHAN_GANDA" || tugasTipe === "UJIAN_UTS" || tugasTipe === "UJIAN_UAS") && (
            <div className="space-y-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                    Daftar Butir Soal Pilihan Ganda ({soalPilganList.length} Soal)
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Tentukan teks pertanyaan, opsi jawaban A, B, C, D, serta tandai radio button kunci jawaban yang benar.
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

              <div className="space-y-4">
                {soalPilganList.map((soal, sIdx) => (
                  <div
                    key={soal.id}
                    className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#2A2C5E] px-2 py-0.5 rounded bg-blue-50 border border-blue-100">
                        Soal Nomor {sIdx + 1}
                      </span>
                      {soalPilganList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSoal(sIdx)}
                          className="text-rose-600 hover:text-rose-800 p-1 text-xs flex items-center gap-1 cursor-pointer"
                          title="Hapus soal ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
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
                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-gray-700">
                        Pilihan Jawaban &amp; Kunci:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {soal.pilihan.map((opsi, oIdx) => {
                          const isKey = soal.kunci === oIdx;
                          const abcd = ["A", "B", "C", "D"][oIdx];
                          return (
                            <div
                              key={oIdx}
                              className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                                isKey
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                                  : "bg-white border-gray-200 text-gray-700"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`kunci-soal-${sIdx}`}
                                checked={isKey}
                                onChange={() => handleUpdateKunci(sIdx, oIdx)}
                                className="accent-emerald-600 cursor-pointer w-4 h-4"
                                title="Klik untuk jadikan kunci jawaban"
                              />
                              <span className="font-bold text-xs shrink-0 w-4">
                                {abcd}.
                              </span>
                              <input
                                type="text"
                                value={opsi}
                                onChange={(e) => handleUpdatePilihan(sIdx, oIdx, e.target.value)}
                                className="w-full bg-transparent border-0 focus:outline-none text-xs"
                                placeholder={`Opsi ${abcd}`}
                                required
                              />
                              {isKey && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                                  Kunci
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

          {/* Builder Soal Essay */}
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
                  placeholder="Tuliskan butir pertanyaan essay atau studi kasus yang harus diuraikan oleh siswa..."
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20"
                  required
                />
              </div>
              <p className="text-[11px] text-gray-500">
                💡 Jawaban essay siswa akan masuk ke antrean periksa guru dan dinilai secara subjektif dengan skala 0 - 100.
              </p>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* BAGIAN 4: PENGATURAN PRESENSI SESI PERTEMUAN */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-[#2A2C5E] rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              4. Integrasi Matriks Absensi &amp; Rekap Nilai
            </h2>
          </div>
          <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-[#2A2C5E] space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Otomatisasi Matriks Buku Guru Aktif</span>
            </div>
            <p className="text-gray-600 text-[11px]">
              Saat pertemuan ini diterbitkan, kolom baru (<strong>P-{nomorPertemuan}</strong>) akan otomatis ditambahkan ke dalam <strong>Matriks Rekap Nilai Siswa</strong> dan <strong>Matriks Rekapitulasi Absensi Siswa</strong> untuk seluruh siswa yang terdaftar di kelas {activeClass?.nama}.
            </p>
          </div>
        </div>

        {/* Tombol Aksi Simpan */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <Link
            href={`/guru/mapel?id=${activeClass?.id}`}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 text-center"
          >
            Batal &amp; Kembali
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2A2C5E] hover:bg-[#1F2147] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>
              {isSubmitting
                ? "Menerbitkan Pertemuan..."
                : "Simpan & Publikasikan Pertemuan Baru"}
            </span>
          </button>
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

