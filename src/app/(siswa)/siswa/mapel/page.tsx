"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BookOpen,
  FileText,
  Calendar,
  CheckCircle2,
  CircleAlert,
  ArrowLeft,
  Clock,
  Send,
  AlertCircle,
  X,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  User,
} from "lucide-react";
import { useLMSStore, MapelLMS, PertemuanItem, SoalPilgan } from "@/lib/lmsStore";

function SiswaMapelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    classes,
    enrolledMapelIds,
    selectedClassId,
    selectClass,
    markMateriSelesai,
    submitTugasPilgan,
    submitTugasEssay,
    submitPresensiPertemuan,
    submitUjianCBT,
  } = useLMSStore();

  const urlClassId = searchParams.get("id");

  // Sinkronisasi kelas aktif dari URL atau state
  useEffect(() => {
    if (urlClassId) {
      selectClass(urlClassId);
    }
  }, [urlClassId, selectClass]);

  const activeClass = useMemo(() => {
    const targetId = urlClassId || selectedClassId;
    return classes.find((c) => c.id === targetId) || null;
  }, [classes, urlClassId, selectedClassId]);

  const enrolledClasses = classes.filter((c) => enrolledMapelIds.includes(c.id));

  // State untuk modal interaktif
  const [modalMateri, setModalMateri] = useState<{
    open: boolean;
    pertemuan: PertemuanItem | null;
  }>({ open: false, pertemuan: null });

  const [modalLatihan, setModalLatihan] = useState<{
    open: boolean;
    pertemuan: PertemuanItem | null;
    selectedOptions: Record<number, number>;
  }>({ open: false, pertemuan: null, selectedOptions: {} });

  const [modalEssay, setModalEssay] = useState<{
    open: boolean;
    pertemuan: PertemuanItem | null;
    jawabanText: string;
  }>({ open: false, pertemuan: null, jawabanText: "" });

  const [modalPresensi, setModalPresensi] = useState<{
    open: boolean;
    pertemuan: PertemuanItem | null;
  }>({ open: false, pertemuan: null });

  const [modalUjian, setModalUjian] = useState<{
    open: boolean;
    pertemuan: PertemuanItem | null;
    isStarted: boolean;
    secondsLeft: number;
    selectedOptions: Record<number, number>;
  }>({ open: false, pertemuan: null, isStarted: false, secondsLeft: 3600, selectedOptions: {} });

  // Countdown timer untuk modal Ujian CBT
  useEffect(() => {
    let timer: any = null;
    if (modalUjian.open && modalUjian.isStarted && modalUjian.secondsLeft > 0) {
      timer = setInterval(() => {
        setModalUjian((prev) => {
          if (prev.secondsLeft <= 1) {
            clearInterval(timer);
            return { ...prev, secondsLeft: 0 };
          }
          return { ...prev, secondsLeft: prev.secondsLeft - 1 };
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [modalUjian.open, modalUjian.isStarted, modalUjian.secondsLeft]);

  // Format countdown mm:ss
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Handler kembali ke daftar kelas
  const handleBackToList = () => {
    selectClass(null);
    router.push("/siswa/mapel");
  };

  // -------------------------------------------------------------
  // TAMPILAN 1: GRID KOTAK-KOTAK KELAS YANG DIIKUTI
  // -------------------------------------------------------------
  if (!activeClass) {
    return (
      <div className="space-y-8">
        {/* Header Halaman */}
        <div className="border-b border-gray-200 pb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ruang Belajar Digital SMAN 2 Buay Bahuga</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Kelas & Materi Pembelajaran Saya
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Pilih kotak mata pelajaran di bawah ini untuk masuk ke ruang kelas dan melihat alur modul per pertemuan.
          </p>
        </div>

        {/* Grid Kotak Kelas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledClasses.map((cls) => {
            const total = cls.pertemuanList.length;
            const completed = cls.pertemuanList.filter(
              (p) => (p.materi?.sudahDibaca || p.tugas?.sudahDikerjakan) && p.presensi.hadir
            ).length;
            const percent = Math.round((completed / total) * 100);

            return (
              <div
                key={cls.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs hover:shadow-md hover:border-[#2A2C5E] transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-50 text-[#2A2C5E] border border-blue-100">
                      {cls.kode}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {cls.ruang}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-gray-900 leading-snug">
                      {cls.nama}
                    </h2>
                    <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span>{cls.guruNama}</span>
                    </p>
                  </div>

                  {/* Status Baris Progres */}
                  <div className="space-y-1.5 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Progres Capaian</span>
                      <span className="font-bold text-[#2A2C5E]">{percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2A2C5E] rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>{completed} Selesai</span>
                      <span>Total {total} Pertemuan</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-medium">
                    {cls.jadwal}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      selectClass(cls.id);
                      router.push(`/siswa/mapel?id=${cls.id}`);
                    }}
                    className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs transition-all cursor-pointer"
                  >
                    <span>Buka Ruang Belajar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // TAMPILAN 2: DETAIL RUANG KELAS & ALUR PERTEMUAN (LEARNING PATH)
  // -------------------------------------------------------------
  const totalMeetings = activeClass.pertemuanList.length;
  const completedMeetings = activeClass.pertemuanList.filter(
    (p) => (p.materi?.sudahDibaca || p.tugas?.sudahDikerjakan) && p.presensi.hadir
  ).length;
  const progressPercent = Math.round((completedMeetings / totalMeetings) * 100);

  return (
    <div className="space-y-8">
      {/* Tombol Kembali & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBackToList}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#2A2C5E] hover:text-[#1F2147] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Seluruh Kelas</span>
        </button>
        <div className="text-xs text-gray-400">
          Kurikulum Merdeka &bull; SMAN 2 Buay Bahuga
        </div>
      </div>

      {/* Header Banner Kelas Aktif */}
      <div className="bg-[#2A2C5E] text-white rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white/15 text-blue-100 text-[11px] font-bold">
            <span>{activeClass.kode}</span>
            <span>&bull;</span>
            <span>{activeClass.ruang}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {activeClass.nama}
          </h1>
          <p className="text-xs sm:text-sm text-blue-200">
            Guru Pengampu: <strong className="text-white">{activeClass.guruNama}</strong> (NUPTK: {activeClass.guruNuptk}) &bull; Jadwal: {activeClass.jadwal}
          </p>
        </div>

        {/* Kotak Capaian Progres Belajar */}
        <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/15 min-w-[200px] shrink-0 space-y-2">
          <div className="flex items-center justify-between text-xs text-blue-100 font-semibold">
            <span>Progres Belajar</span>
            <span className="font-bold text-white">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-blue-200">
            {completedMeetings} dari {totalMeetings} Pertemuan Tuntas
          </div>
        </div>
      </div>

      {/* Petunjuk Indikator Simbol */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-gray-700">Keterangan Status Simbol:</span>
        <div className="flex items-center gap-4 text-[11px] text-gray-600">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Simbol Hijau: Tuntas / Hadir / Telah Dinilai</span>
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-rose-700">
            <CircleAlert className="w-4 h-4 text-rose-600" />
            <span>Simbol Merah: Belum Selesai / Belum Absen</span>
          </span>
        </div>
      </div>

      {/* Daftar Pertemuan Bertahap (Pertemuan 1, 2, ..., 6 UTS, ..., 8 UAS) */}
      <div className="space-y-5">
        {activeClass.pertemuanList.map((pt) => {
          const isUts = pt.tipe === "UTS";
          const isUas = pt.tipe === "UAS";
          const isSpecialExam = isUts || isUas;

          return (
            <div
              key={pt.id}
              className={`bg-white rounded-2xl border transition-all shadow-2xs overflow-hidden ${
                isSpecialExam
                  ? "border-[#2A2C5E] ring-1 ring-[#2A2C5E]/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Header Bar Pertemuan */}
              <div
                className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${
                  isSpecialExam
                    ? "bg-[#2A2C5E]/5 border-[#2A2C5E]/20"
                    : "bg-gray-50/80 border-gray-100"
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
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">
                    {pt.judul}
                  </h3>
                </div>

                <div className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{pt.tanggal}</span>
                </div>
              </div>

              {/* Isi Konten Pertemuan: Materi + Soal/Essay + Absensi */}
              <div className="p-4 sm:p-6 space-y-4">
                {/* 1. Materi Pembelajaran (Jika Ada) */}
                {pt.materi && (
                  <div className="p-4 rounded-xl border border-gray-200 hover:border-[#2A2C5E]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {pt.materi.sudahDibaca ? (
                        <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </span>
                      ) : (
                        <span className="p-2 rounded-lg bg-rose-50 text-rose-600 shrink-0">
                          <CircleAlert className="w-5 h-5" />
                        </span>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            Modul Materi
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                              pt.materi.sudahDibaca
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {pt.materi.sudahDibaca ? "Telah Dibaca" : "Belum Dibaca"}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mt-0.5">
                          {pt.materi.judul}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                          {pt.materi.ringkasan}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setModalMateri({ open: true, pertemuan: pt })}
                      className="px-3.5 py-1.5 text-xs font-semibold text-[#2A2C5E] bg-blue-50 hover:bg-[#2A2C5E] hover:text-white rounded-lg transition-colors shrink-0 cursor-pointer"
                    >
                      Buka Materi
                    </button>
                  </div>
                )}

                {/* 2. Latihan Soal / Essay / Ujian CBT */}
                {pt.tugas && (
                  <div
                    className={`p-4 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSpecialExam ? "bg-amber-50/40 border-amber-200" : "border-gray-200 hover:border-[#2A2C5E]/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {pt.tugas.sudahDikerjakan ? (
                        <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </span>
                      ) : (
                        <span className="p-2 rounded-lg bg-rose-50 text-rose-600 shrink-0">
                          <CircleAlert className="w-5 h-5" />
                        </span>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            {isSpecialExam ? "Asesmen Sumatif CBT" : pt.tugas.tipe === "ESSAY" ? "Tugas Essay" : "Latihan Pilihan Ganda"}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                              pt.tugas.sudahDikerjakan
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {pt.tugas.sudahDikerjakan
                              ? `Tuntas (Nilai: ${pt.tugas.nilai ?? 100})`
                              : "Belum Dikerjakan"}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mt-0.5">
                          {pt.tugas.judul}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                          {pt.tugas.deskripsi}
                        </p>
                      </div>
                    </div>

                    {isSpecialExam ? (
                      <button
                        type="button"
                        onClick={() =>
                          setModalUjian({
                            open: true,
                            pertemuan: pt,
                            isStarted: false,
                            secondsLeft: (pt.durasiMenit || 60) * 60,
                            selectedOptions: {},
                          })
                        }
                        className={`px-4 py-2 text-xs font-bold rounded-lg shadow-2xs transition-all shrink-0 cursor-pointer ${
                          pt.tugas.sudahDikerjakan
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-[#2A2C5E] text-white hover:bg-[#1F2147]"
                        }`}
                      >
                        {pt.tugas.sudahDikerjakan ? "Lihat Hasil Ujian" : "Mulai Kerjakan Ujian"}
                      </button>
                    ) : pt.tugas.tipe === "PILIHAN_GANDA" ? (
                      <button
                        type="button"
                        onClick={() =>
                          setModalLatihan({
                            open: true,
                            pertemuan: pt,
                            selectedOptions: {},
                          })
                        }
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 cursor-pointer ${
                          pt.tugas.sudahDikerjakan
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-blue-50 text-[#2A2C5E] hover:bg-[#2A2C5E] hover:text-white"
                        }`}
                      >
                        {pt.tugas.sudahDikerjakan ? "Tinjau Soal" : "Kerjakan Soal"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setModalEssay({
                            open: true,
                            pertemuan: pt,
                            jawabanText: pt.tugas?.jawabanSiswa || "",
                          })
                        }
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 cursor-pointer ${
                          pt.tugas.sudahDikerjakan
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-blue-50 text-[#2A2C5E] hover:bg-[#2A2C5E] hover:text-white"
                        }`}
                      >
                        {pt.tugas.sudahDikerjakan ? "Lihat Respon Essay" : "Tulis Essay"}
                      </button>
                    )}
                  </div>
                )}

                {/* 3. Absensi Sesi Pertemuan */}
                <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {pt.presensi.hadir ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <CircleAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <div>
                      <span className="text-xs font-bold text-gray-800">
                        Presensi Sesi Pertemuan:
                      </span>{" "}
                      <span
                        className={`text-xs font-semibold ${
                          pt.presensi.hadir ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {pt.presensi.hadir
                          ? `Hadir (${pt.presensi.waktuHadir || "Tepat Waktu"})`
                          : "Belum Melakukan Absensi Pertemuan Ini"}
                      </span>
                    </div>
                  </div>

                  {!pt.presensi.hadir && (
                    <button
                      type="button"
                      onClick={() => setModalPresensi({ open: true, pertemuan: pt })}
                      className="px-3 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors cursor-pointer shrink-0 shadow-2xs"
                    >
                      Konfirmasi Hadir
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: PEMBACA MATERI PEMBELAJARAN */}
      {/* ========================================================= */}
      {modalMateri.open && modalMateri.pertemuan && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 border border-gray-200 max-h-[85vh] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-blue-50 text-[#2A2C5E] rounded-lg">
                    <FileText className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {modalMateri.pertemuan.judul}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 leading-tight">
                      {modalMateri.pertemuan.materi?.judul}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalMateri({ open: false, pertemuan: null })}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-4 text-xs text-gray-700 leading-relaxed overflow-y-auto max-h-[50vh] pr-2">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-blue-900 font-medium">
                  <strong>Ringkasan Modul:</strong> {modalMateri.pertemuan.materi?.ringkasan}
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 whitespace-pre-line text-gray-800 text-justify font-sans">
                  {modalMateri.pertemuan.materi?.kontenLengkap}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Status:{" "}
                <strong
                  className={
                    modalMateri.pertemuan.materi?.sudahDibaca
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }
                >
                  {modalMateri.pertemuan.materi?.sudahDibaca ? "Telah Selesai Dibaca" : "Belum Selesai"}
                </strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalMateri({ open: false, pertemuan: null })}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (activeClass && modalMateri.pertemuan) {
                      markMateriSelesai(activeClass.id, modalMateri.pertemuan.id);
                      setModalMateri({ open: false, pertemuan: null });
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tandai Telah Membaca</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: LATIHAN SOAL PILIHAN GANDA */}
      {/* ========================================================= */}
      {modalLatihan.open && modalLatihan.pertemuan && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 border border-gray-200 max-h-[85vh] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {modalLatihan.pertemuan.judul}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    {modalLatihan.pertemuan.tugas?.judul}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalLatihan({ open: false, pertemuan: null, selectedOptions: {} })}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-5 overflow-y-auto max-h-[52vh] pr-2 text-xs">
                {modalLatihan.pertemuan.tugas?.soalPilgan?.map((s, idx) => (
                  <div key={s.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5">
                    <p className="font-bold text-gray-900">
                      {idx + 1}. {s.pertanyaan}
                    </p>
                    <div className="space-y-1.5">
                      {s.pilihan.map((opt, oIdx) => {
                        const isSelected = modalLatihan.selectedOptions[s.id] === oIdx;
                        return (
                          <label
                            key={oIdx}
                            onClick={() =>
                              setModalLatihan((prev) => ({
                                ...prev,
                                selectedOptions: { ...prev.selectedOptions, [s.id]: oIdx },
                              }))
                            }
                            className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? "bg-blue-50 border-[#2A2C5E] text-[#2A2C5E] font-semibold"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                                isSelected ? "border-[#2A2C5E] bg-[#2A2C5E] text-white" : "border-gray-300"
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Terjawab: {Object.keys(modalLatihan.selectedOptions).length} dari{" "}
                {modalLatihan.pertemuan.tugas?.soalPilgan?.length || 0} Soal
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalLatihan({ open: false, pertemuan: null, selectedOptions: {} })}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (activeClass && modalLatihan.pertemuan && modalLatihan.pertemuan.tugas?.soalPilgan) {
                      const questions = modalLatihan.pertemuan.tugas.soalPilgan;
                      let correct = 0;
                      questions.forEach((q) => {
                        if (modalLatihan.selectedOptions[q.id] === q.kunci) {
                          correct++;
                        }
                      });
                      const score = Math.round((correct / questions.length) * 100);
                      submitTugasPilgan(activeClass.id, modalLatihan.pertemuan.id, score);
                      setModalLatihan({ open: false, pertemuan: null, selectedOptions: {} });
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Jawaban Latihan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: TUGAS ESSAY */}
      {/* ========================================================= */}
      {modalEssay.open && modalEssay.pertemuan && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-4 border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  {modalEssay.pertemuan.judul}
                </span>
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  {modalEssay.pertemuan.tugas?.judul}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalEssay({ open: false, pertemuan: null, jawabanText: "" })}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 text-blue-950">
                <span className="font-bold block mb-1">Pertanyaan Tugas Essay:</span>
                <p>{modalEssay.pertemuan.tugas?.pertanyaanEssay}</p>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Ketik Lembar Jawaban Analisis Anda:
                </label>
                <textarea
                  rows={5}
                  value={modalEssay.jawabanText}
                  onChange={(e) =>
                    setModalEssay((prev) => ({ ...prev, jawabanText: e.target.value }))
                  }
                  placeholder="Tuliskan jawaban essay Anda secara terperinci di sini..."
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalEssay({ open: false, pertemuan: null, jawabanText: "" })}
                className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activeClass && modalEssay.pertemuan && modalEssay.jawabanText.trim()) {
                    submitTugasEssay(
                      activeClass.id,
                      modalEssay.pertemuan.id,
                      modalEssay.jawabanText.trim()
                    );
                    setModalEssay({ open: false, pertemuan: null, jawabanText: "" });
                  }
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Jawaban Essay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: KONFIRMASI ABSENSI SESI PERTEMUAN */}
      {/* ========================================================= */}
      {modalPresensi.open && modalPresensi.pertemuan && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                  <Clock className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-gray-900">
                  Presensi Kehadiran Pertemuan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalPresensi({ open: false, pertemuan: null })}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <p>
                Konfirmasikan bahwa Anda hadir mengikuti sesi pembelajaran:
              </p>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <div className="font-bold text-gray-900">
                  {modalPresensi.pertemuan.judul}
                </div>
                <div className="text-[11px] text-gray-500">
                  Mata Pelajaran: {activeClass.nama} &bull; {activeClass.jadwal}
                </div>
              </div>
              <p className="text-[11px] text-gray-400">
                Waktu presensi akan dicatat secara otomatis ke dalam rekapitulasi kehadiran dewan guru.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalPresensi({ open: false, pertemuan: null })}
                className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activeClass && modalPresensi.pertemuan) {
                    submitPresensiPertemuan(activeClass.id, modalPresensi.pertemuan.id);
                    setModalPresensi({ open: false, pertemuan: null });
                  }
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Saya Hadir pada Sesi Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: UJIAN SUMATIF BERKALA (UTS & UAS) DENGAN COUNTDOWN TIMER */}
      {/* ========================================================= */}
      {modalUjian.open && modalUjian.pertemuan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 border border-gray-200 max-h-[90vh] flex flex-col justify-between">
            {/* Header Ujian CBT */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
                  <Award className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                    Ruang Computer Based Test (CBT)
                  </span>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    {modalUjian.pertemuan.tugas?.judul}
                  </h3>
                </div>
              </div>

              {/* Countdown Timer */}
              {modalUjian.isStarted && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 rounded-lg text-red-700 font-bold text-xs">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>Sisa Waktu: {formatTimer(modalUjian.secondsLeft)}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  setModalUjian({
                    open: false,
                    pertemuan: null,
                    isStarted: false,
                    secondsLeft: 3600,
                    selectedOptions: {},
                  })
                }
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Konten Ujian: Layar Pengantar ATAU Lembar Soal Aktif */}
            {!modalUjian.isStarted ? (
              <div className="space-y-4 text-xs text-gray-700 py-4">
                <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                  <h4 className="font-bold text-amber-900 text-sm">
                    Tata Tertib & Petunjuk Pengerjaan Asesmen
                  </h4>
                  <p className="text-amber-800 leading-relaxed">
                    {modalUjian.pertemuan.petunjukUjian}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-gray-400 block">Alokasi Waktu</span>
                    <strong className="text-gray-900">{modalUjian.pertemuan.durasiMenit || 60} Menit</strong>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-gray-400 block">Jumlah Butir Soal</span>
                    <strong className="text-gray-900">{modalUjian.pertemuan.tugas?.soalPilgan?.length || 5} Soal Pilihan Ganda</strong>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-gray-400 block">Status Integritas</span>
                    <strong className="text-emerald-700">Terverifikasi Mandiri</strong>
                  </div>
                </div>

                {modalUjian.pertemuan.tugas?.sudahDikerjakan && (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-center justify-between">
                    <div>
                      <div className="font-bold">Ujian Ini Telah Selesai Dikerjakan</div>
                      <div className="text-[11px] text-emerald-700">
                        Diserahkan pada {modalUjian.pertemuan.tugas.tanggalSubmit}
                      </div>
                    </div>
                    <div className="text-xl font-extrabold text-emerald-800">
                      Nilai: {modalUjian.pertemuan.tugas.nilai} / 100
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5 overflow-y-auto max-h-[55vh] pr-2 text-xs">
                {modalUjian.pertemuan.tugas?.soalPilgan?.map((s, idx) => (
                  <div key={s.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5">
                    <p className="font-bold text-gray-900">
                      Butir Soal {idx + 1}. {s.pertanyaan}
                    </p>
                    <div className="space-y-1.5">
                      {s.pilihan.map((opt, oIdx) => {
                        const isSelected = modalUjian.selectedOptions[s.id] === oIdx;
                        return (
                          <label
                            key={oIdx}
                            onClick={() =>
                              setModalUjian((prev) => ({
                                ...prev,
                                selectedOptions: { ...prev.selectedOptions, [s.id]: oIdx },
                              }))
                            }
                            className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? "bg-blue-50 border-[#2A2C5E] text-[#2A2C5E] font-semibold"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                                isSelected ? "border-[#2A2C5E] bg-[#2A2C5E] text-white" : "border-gray-300"
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer Aksi Modal Ujian */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                {modalUjian.isStarted && (
                  <span className="text-xs text-gray-500">
                    Dijawab: {Object.keys(modalUjian.selectedOptions).length} dari{" "}
                    {modalUjian.pertemuan.tugas?.soalPilgan?.length || 0} Soal
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setModalUjian({
                      open: false,
                      pertemuan: null,
                      isStarted: false,
                      secondsLeft: 3600,
                      selectedOptions: {},
                    })
                  }
                  className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Tutup
                </button>

                {!modalUjian.isStarted ? (
                  <button
                    type="button"
                    onClick={() =>
                      setModalUjian((prev) => ({
                        ...prev,
                        isStarted: true,
                        secondsLeft: (modalUjian.pertemuan?.durasiMenit || 60) * 60,
                      }))
                    }
                    className="px-4 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Mulai Kerjakan Ujian Sekarang</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeClass && modalUjian.pertemuan && modalUjian.pertemuan.tugas?.soalPilgan) {
                        const questions = modalUjian.pertemuan.tugas.soalPilgan;
                        let correct = 0;
                        questions.forEach((q) => {
                          if (modalUjian.selectedOptions[q.id] === q.kunci) {
                            correct++;
                          }
                        });
                        const score = Math.round((correct / questions.length) * 100);
                        submitUjianCBT(activeClass.id, modalUjian.pertemuan.id, score);
                        setModalUjian({
                          open: false,
                          pertemuan: null,
                          isStarted: false,
                          secondsLeft: 3600,
                          selectedOptions: {},
                        });
                      }
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Lembar Jawaban Ujian</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SiswaMapelPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-gray-500 font-medium">
          Memuat Ruang Kelas & Materi Pembelajaran...
        </div>
      }
    >
      <SiswaMapelContent />
    </Suspense>
  );
}
