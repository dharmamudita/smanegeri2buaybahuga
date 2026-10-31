"use client";

import { useState, useRef, useMemo, Suspense } from "react";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  MapPin,
  UploadCloud,
  FileText,
  X,
  Paperclip,
  ShieldCheck,
  AlertTriangle,
  Search,
  BookOpen,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { SCHOOL_INFO } from "@/lib/constants";
import { useAuthStore, usePresensiStore } from "@/lib/store";
import { useLMSStore } from "@/lib/lmsStore";

// Rumus Haversine untuk kalkulasi jarak geografis (meter)
function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function SiswaPresensiContent() {
  const { currentUser } = useAuthStore();
  const { classes, enrolledMapelIds, submitPresensiPertemuan } = useLMSStore();
  const { records, addRecord } = usePresensiStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeStudent = currentUser || {
    name: "Dharma Mudita Pratama",
    kelas: "XII MIPA 1",
    nisn: "0078129341",
  };

  // Seluruh kelas mata pelajaran yang diikuti siswa hari ini
  const enrolledClasses = useMemo(() => {
    return classes.filter((c) => enrolledMapelIds.includes(c.id));
  }, [classes, enrolledMapelIds]);

  // Tanggal hari ini
  const todayDateStr = useMemo(() => {
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  // Cek apakah presensi harian hari ini sudah terisi
  const existingTodayRecord = useMemo(() => {
    return records.find(
      (r) =>
        r.siswaNama === activeStudent.name &&
        (r.tanggal === todayDateStr || r.tanggal.includes("2026"))
    );
  }, [records, activeStudent.name, todayDateStr]);

  // State Form Presensi Harian
  const [selectedStatus, setSelectedStatus] = useState<"HADIR" | "IZIN" | "SAKIT">("HADIR");
  const [keteranganText, setKeteranganText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    previewUrl?: string;
  } | null>(null);

  // Status Lokasi Lingkungan Sekolah (Default: Berada di Sekolah)
  const [isInSchoolArea, setIsInSchoolArea] = useState<boolean>(true);
  const [distanceMeters, setDistanceMeters] = useState<number>(18);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Deteksi GPS Asli dari Browser
  const handleDetectLiveGps = () => {
    setIsDetectingGps(true);
    if (!navigator.geolocation) {
      setIsInSchoolArea(true);
      setDistanceMeters(18);
      setIsDetectingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const dist = calculateDistanceMeters(
          pos.coords.latitude,
          pos.coords.longitude,
          SCHOOL_INFO.koordinat.latitude,
          SCHOOL_INFO.koordinat.longitude
        );
        setDistanceMeters(dist);
        setIsInSchoolArea(dist <= 150);
        setIsDetectingGps(false);
      },
      () => {
        // Fallback jika izin lokasi tidak aktif
        setIsDetectingGps(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  // Upload Surat Keterangan Sakit / Izin (Opsional)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeKb = Math.round(file.size / 1024);
      const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
      const isImg = file.type.startsWith("image/");
      setUploadedFile({
        name: file.name,
        size: sizeStr,
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
      });
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handler Kirim Presensi Harian Sekolah
  const handleSubmitPresensi = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi Kehadiran Fisik: Jika HADIR, wajib berada di area sekolah!
    if (selectedStatus === "HADIR" && !isInSchoolArea) {
      return;
    }

    const timeStr = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";

    // 1. Simpan ke Riwayat Presensi Terpusat
    const fileNote = uploadedFile ? ` [Lampiran: ${uploadedFile.name}]` : "";
    const newRecord = {
      id: `pres-${Date.now()}`,
      siswaId: currentUser?.id || "siswa-1",
      siswaNama: activeStudent.name,
      nisn: activeStudent.nisn || "0078129341",
      kelas: activeStudent.kelas || "XII MIPA 1",
      tanggal: todayDateStr,
      waktu: timeStr,
      status: selectedStatus,
      jarakMeter: isInSchoolArea ? distanceMeters : 420,
      latitude: -4.3239,
      longitude: 104.5609,
      keterangan:
        selectedStatus === "HADIR"
          ? "Hadir Fisik di Lingkungan Sekolah (Otomatis Hadir Seluruh Sesi Pembelajaran Hari Ini)"
          : `${selectedStatus}: ${keteranganText || "Surat keterangan izin/sakit terlampir"}${fileNote}`,
    };

    addRecord(newRecord);

    // 2. Alur Terhubung: Jika HADIR, otomatis seluruh mata pelajaran hari itu tercatat hadir!
    enrolledClasses.forEach((cls) => {
      const firstMeeting = cls.pertemuanList[0];
      if (firstMeeting) {
        submitPresensiPertemuan(cls.id, firstMeeting.id);
      }
    });

    setToastMessage(
      `Presensi harian berhasil dicatat sebagai ${selectedStatus}! Seluruh ${enrolledClasses.length} mata pelajaran hari ini otomatis terhubung.`
    );
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  // Apakah tombol submit harus dikunci
  const isSubmitDisabled = selectedStatus === "HADIR" && !isInSchoolArea;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Notifikasi Berhasil */}
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

      {/* Header Halaman Institusional */}
      <div className="border-b border-gray-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold mb-2">
          <Clock className="w-3.5 h-3.5 text-[#2A2C5E]" />
          <span>Sistem Presensi Harian Terpusat SMAN 2 Buay Bahuga</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Presensi Harian Siswa
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Pengisian presensi harian sekolah berlaku otomatis untuk seluruh mata pelajaran yang terjadwal pada hari ini.
        </p>
      </div>

      {/* 4 Kartu Ringkasan Kehadiran (2 Kolom di Mobile, 4 di Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Hari & Tanggal
          </span>
          <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
            {todayDateStr.split(",")[0]}
          </p>
          <p className="text-[10px] text-gray-500 truncate">
            {todayDateStr.split(",")[1]?.trim()}
          </p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Status Hari Ini
          </span>
          <p
            className={`text-xs sm:text-sm font-bold truncate ${
              existingTodayRecord
                ? existingTodayRecord.status === "HADIR"
                  ? "text-emerald-700"
                  : existingTodayRecord.status === "IZIN"
                  ? "text-amber-700"
                  : "text-rose-700"
                : "text-gray-500"
            }`}
          >
            {existingTodayRecord ? `Terdata: ${existingTodayRecord.status}` : "Belum Absensi"}
          </p>
          <p className="text-[10px] text-gray-500 truncate">
            {existingTodayRecord ? existingTodayRecord.waktu : "Batas Presensi: 07:30 WIB"}
          </p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Mapel Terhubung
          </span>
          <p className="text-xs sm:text-sm font-bold text-[#2A2C5E] truncate">
            {enrolledClasses.length} Mata Pelajaran
          </p>
          <p className="text-[10px] text-gray-500 truncate">
            Sinkronisasi Otomatis 1 Hari
          </p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Lokasi Pengguna
          </span>
          <p
            className={`text-xs sm:text-sm font-bold truncate ${
              isInSchoolArea ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {isInSchoolArea ? "Di Lingkungan Sekolah" : "Di Luar Sekolah"}
          </p>
          <p className="text-[10px] text-gray-500 truncate">
            SMAN 2 Buay Bahuga
          </p>
        </div>
      </div>

      {/* KARTU FORM UTAMA PRESENSI HARIAN */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7 space-y-6">
        {/* Header Form & Pengatur Lokasi */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Formulir Kehadiran Siswa Hari Ini
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Peserta Didik: <strong className="text-gray-900">{activeStudent.name}</strong> &bull; NISN: {activeStudent.nisn} &bull; Kelas: {activeStudent.kelas}
            </p>
          </div>

          {/* Penguji & Indikator Lokasi Sekolah */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 font-medium hidden sm:inline">Uji Lokasi:</span>
            <div className="inline-flex p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setIsInSchoolArea(true);
                  setDistanceMeters(18);
                }}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                  isInSchoolArea
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Di Sekolah
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsInSchoolArea(false);
                  setDistanceMeters(420);
                }}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                  !isInSchoolArea
                    ? "bg-rose-600 text-white shadow-2xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Di Luar Sekolah
              </button>
            </div>
            <button
              type="button"
              onClick={handleDetectLiveGps}
              disabled={isDetectingGps}
              className="px-2.5 py-1 text-[11px] font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {isDetectingGps ? "Membaca..." : "Cek GPS"}
            </button>
          </div>
        </div>

        {/* Jika Sudah Mengisi Presensi Hari Ini */}
        {existingTodayRecord ? (
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-base font-bold text-emerald-950">
                    Presensi Hari Ini Telah Selesai Dicatat
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white self-start sm:self-auto">
                    Status: {existingTodayRecord.status}
                  </span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Anda telah tercatat hadir pada <strong>{existingTodayRecord.tanggal}</strong> pukul <strong>{existingTodayRecord.waktu}</strong>. Seluruh <strong>{enrolledClasses.length} mata pelajaran</strong> yang terjadwal hari ini otomatis terverifikasi hadir.
                </p>
                <div className="text-[11px] text-emerald-800 pt-1 border-t border-emerald-200/60 flex flex-wrap items-center gap-3">
                  <span>Keterangan: {existingTodayRecord.keterangan}</span>
                  <span>&bull;</span>
                  <span>Lokasi: Terverifikasi di Lingkungan SMAN 2 Buay Bahuga</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitPresensi} className="space-y-5">
            {/* 1. Pemilihan Status: Hadir, Izin, Sakit */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                1. Pilih Status Kehadiran Hari Ini:
              </label>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                {/* Opsi Hadir */}
                <button
                  type="button"
                  onClick={() => setSelectedStatus("HADIR")}
                  className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedStatus === "HADIR"
                      ? "border-[#2A2C5E] bg-[#2A2C5E]/5 ring-2 ring-[#2A2C5E]"
                      : "border-gray-200 bg-gray-50/70 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-gray-900">Hadir</span>
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        selectedStatus === "HADIR" ? "text-[#2A2C5E]" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-gray-500 mt-1">
                    Fisik di Sekolah
                  </span>
                </button>

                {/* Opsi Izin */}
                <button
                  type="button"
                  onClick={() => setSelectedStatus("IZIN")}
                  className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedStatus === "IZIN"
                      ? "border-amber-600 bg-amber-50/70 ring-2 ring-amber-600"
                      : "border-gray-200 bg-gray-50/70 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-gray-900">Izin</span>
                    <Clock
                      className={`w-4 h-4 ${
                        selectedStatus === "IZIN" ? "text-amber-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-gray-500 mt-1">
                    Ada Keperluan
                  </span>
                </button>

                {/* Opsi Sakit */}
                <button
                  type="button"
                  onClick={() => setSelectedStatus("SAKIT")}
                  className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedStatus === "SAKIT"
                      ? "border-rose-600 bg-rose-50/70 ring-2 ring-rose-600"
                      : "border-gray-200 bg-gray-50/70 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-gray-900">Sakit</span>
                    <AlertCircle
                      className={`w-4 h-4 ${
                        selectedStatus === "SAKIT" ? "text-rose-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-gray-500 mt-1">
                    Kondisi Sakit
                  </span>
                </button>
              </div>
            </div>

            {/* 2. Peringatan Lokasi Sekolah (Jika Hadir Namun Sedang di Luar Sekolah) */}
            {selectedStatus === "HADIR" && (
              <div>
                {isInSchoolArea ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Lokasi Anda Terverifikasi:</strong> Anda berada di dalam lingkungan SMAN 2 Buay Bahuga. Presensi kehadiran fisik siap dikonfirmasi.
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2.5 text-xs animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Di Luar Area Sekolah:</strong> Anda saat ini tidak terdeteksi berada di lingkungan sekolah SMAN 2 Buay Bahuga, sehingga status <strong>Hadir Fisik</strong> tidak dapat dikirim. Apabila Anda berhalangan hadir ke sekolah, silakan pilih opsi <strong>Izin</strong> atau <strong>Sakit</strong>.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. Input Alasan / Keterangan (Jika Izin atau Sakit) */}
            {selectedStatus !== "HADIR" && (
              <div className="space-y-1.5 animate-in fade-in">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  2. Keterangan Alasan ({selectedStatus === "IZIN" ? "Izin" : "Sakit"}):
                </label>
                <textarea
                  value={keteranganText}
                  onChange={(e) => setKeteranganText(e.target.value)}
                  placeholder={
                    selectedStatus === "IZIN"
                      ? "Tuliskan alasan izin (contoh: mengikuti lomba kedinasan, urusan keluarga mendesak)..."
                      : "Tuliskan keterangan sakit atau gejala yang dialami (contoh: demam, flu, beristirahat sesuai anjuran dokter)..."
                  }
                  rows={2}
                  className="w-full p-3 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                  required
                />
              </div>
            )}

            {/* 4. Upload Surat Sakit / Surat Izin (Opsional: Foto / PDF) */}
            {selectedStatus !== "HADIR" && (
              <div className="space-y-2 animate-in fade-in">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                  <span>
                    3. Lampiran Surat {selectedStatus === "SAKIT" ? "Keterangan Dokter / Sakit" : "Izin"} (Opsional):
                  </span>
                  <span className="text-[11px] text-gray-400 font-normal">
                    Format: JPG, PNG, atau PDF (Maks. 5MB)
                  </span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                />

                {uploadedFile ? (
                  <div className="p-3 bg-gray-50 border border-gray-300 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-blue-50 text-[#2A2C5E] rounded-lg">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 truncate max-w-xs sm:max-w-md">
                          {uploadedFile.name}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          Ukuran File: {uploadedFile.size} &bull; Surat Terlampir
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-gray-400 hover:text-rose-600 cursor-pointer p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-4 border-2 border-dashed border-gray-200 hover:border-[#2A2C5E] rounded-xl flex flex-col items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-[#2A2C5E] transition-colors bg-gray-50/50 cursor-pointer"
                  >
                    <UploadCloud className="w-6 h-6 text-gray-400" />
                    <span className="font-semibold">
                      Klik untuk Upload Surat {selectedStatus === "SAKIT" ? "Sakit Dokter" : "Izin Orang Tua"}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Opsional &bull; Anda tetap dapat mengirim presensi tanpa melampirkan berkas
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Tombol Aksi Submit */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2A2C5E]" />
                <span>
                  Presensi ini berlaku otomatis ke seluruh jadwal pelajaran hari ini.
                </span>
              </p>

              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#2A2C5E] hover:bg-[#1F2147] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isSubmitDisabled
                    ? "Tidak Dapat Absen Hadir (Di Luar Sekolah)"
                    : selectedStatus === "HADIR"
                    ? "Kirim Presensi Kehadiran Hari Ini"
                    : `Kirim Keterangan ${selectedStatus}`}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* JADWAL MATA PELAJARAN HARI INI (OTOMATIS TERHUBUNG) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Jadwal Mata Pelajaran Hari Ini ({enrolledClasses.length} Kelas Terhubung)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Jika presensi harian terisi Hadir, seluruh mata pelajaran di bawah ini otomatis tercatat Hadir secara serentak.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
          {enrolledClasses.map((cls) => {
            const isAttended = Boolean(existingTodayRecord);
            return (
              <div
                key={cls.id}
                className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3.5 sm:p-5 shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-2 sm:space-y-2.5">
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

                  <p className="text-[10px] sm:text-xs text-gray-600 flex items-center gap-1 truncate">
                    <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{cls.guruNama}</span>
                  </p>
                </div>

                <div className="pt-2.5 mt-2.5 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5">
                  <span className="text-[9px] sm:text-[11px] text-gray-500 font-medium truncate">
                    {cls.jadwal}
                  </span>
                  {isAttended ? (
                    <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{existingTodayRecord?.status}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Menunggu Absen</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIWAYAT LOG PRESENSI HARIAN SISWA */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 space-y-4">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Riwayat Presensi Harian Siswa
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Rekam jejak kehadiran harian terverifikasi SMAN 2 Buay Bahuga.
            </p>
          </div>
          <span className="text-xs text-gray-500 font-semibold hidden sm:inline">
            Total {records.length} Catatan
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {records.slice(0, 5).map((rec) => {
            const isHadir = rec.status === "HADIR";
            const isIzin = rec.status === "IZIN";
            return (
              <div
                key={rec.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isHadir
                        ? "bg-emerald-50 text-emerald-600"
                        : isIzin
                        ? "bg-amber-50 text-amber-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {isHadir ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-gray-900">
                        {rec.tanggal}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isHadir
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : isIzin
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {rec.keterangan}
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-gray-400 font-mono shrink-0">
                  {rec.waktu}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SiswaPresensiPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-gray-500">
          Memuat presensi siswa...
        </div>
      }
    >
      <SiswaPresensiContent />
    </Suspense>
  );
}
