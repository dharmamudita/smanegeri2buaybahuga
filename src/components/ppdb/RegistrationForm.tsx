"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  FileText, 
  AlertCircle, 
  Check, 
  Printer, 
  Search,
  User,
  Users,
  MapPin,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { PPDBPeriod, PPDBTrack } from "@/types/database";
import { submitRegistration, RegisterFormData } from "@/app/actions/ppdb";

interface RegistrationFormProps {
  activePeriod: PPDBPeriod | null;
}

export default function RegistrationForm({ activePeriod }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successResult, setSuccessResult] = useState<{
    regNumber: string;
    fullName: string;
    track: string;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState<RegisterFormData>({
    periodId: activePeriod?.id || "",
    periodTitle: activePeriod?.title || "PPDB 2027/2028",
    registrationTrack: "zonasi",
    fullName: "",
    nisn: "",
    nik: "",
    gender: "Laki-laki",
    birthPlace: "",
    birthDate: "",
    religion: "Islam",
    schoolOrigin: "",
    phoneNumber: "",
    parentName: "",
    parentPhone: "",
    address: "",
    documentUrls: {
      photo: "",
      kk: "",
      skl: "",
      birthCert: "",
      achievement: "",
    },
  });

  const [antiSpamAgreed, setAntiSpamAgreed] = useState(false);

  // If no active period
  if (!activePeriod || !activePeriod.is_active) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-amber-50/80 border border-amber-200 text-center max-w-2xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          Pendaftaran Siswa Baru Belum Dibuka
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Mohon maaf, saat ini periode Penerimaan Peserta Didik Baru (PPDB) SMA Negeri 2 Buay Bahuga sedang ditutup atau belum memasuki jadwal pendaftaran resmi.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/ppdb/cek-status"
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
          >
            Cek Status Pendaftaran Sebelumnya
          </Link>
          <Link
            href="/tentang"
            className="px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 transition"
          >
            Pelajari Profil Sekolah
          </Link>
        </div>
      </div>
    );
  }

  // Handle Step Navigation & Validations
  const handleNextStep = () => {
    setErrorMessage("");

    if (currentStep === 1) {
      if (!formData.registrationTrack) {
        setErrorMessage("Silakan pilih salah satu jalur pendaftaran.");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.fullName.trim()) {
        setErrorMessage("Nama lengkap wajib diisi sesuai ijazah SMP.");
        return;
      }
      if (formData.nisn.length !== 10) {
        setErrorMessage("Nomor Induk Siswa Nasional (NISN) harus 10 digit.");
        return;
      }
      if (formData.nik.length !== 16) {
        setErrorMessage("Nomor Induk Kependudukan (NIK) harus 16 digit.");
        return;
      }
      if (!formData.birthPlace.trim() || !formData.birthDate) {
        setErrorMessage("Tempat dan tanggal lahir wajib diisi.");
        return;
      }
      if (!formData.schoolOrigin.trim()) {
        setErrorMessage("Asal sekolah (SMP/MTs) wajib diisi.");
        return;
      }
      if (!formData.phoneNumber.trim()) {
        setErrorMessage("Nomor WhatsApp siswa wajib diisi untuk koordinasi.");
        return;
      }
      if (!formData.address.trim()) {
        setErrorMessage("Alamat tempat tinggal lengkap wajib diisi.");
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.parentName.trim() || !formData.parentPhone.trim()) {
        setErrorMessage("Nama dan kontak orang tua/wali wajib diisi.");
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setErrorMessage("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!antiSpamAgreed) {
      setErrorMessage("Harap centang pernyataan kebenaran data di bawah sebelum mengirim.");
      return;
    }

    setLoading(true);

    try {
      const response = await submitRegistration(formData);

      if (response.success && response.regNumber) {
        setSuccessResult({
          regNumber: response.regNumber,
          fullName: formData.fullName,
          track: formData.registrationTrack,
        });
      } else {
        setErrorMessage(response.message || "Gagal mengirim formulir pendaftaran.");
      }
    } catch (err: any) {
      setErrorMessage("Terjadi kesalahan jaringan atau server.");
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (successResult) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-sky-100 shadow-2xl text-center max-w-2xl mx-auto space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            Pendaftaran Berhasil Dikirim!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Selamat, Formulir Anda Telah Diterima
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Simpan Nomor Registrasi berikut dengan baik untuk keperluan pengecekan status dan lapor diri fisik di sekolah.
          </p>
        </div>

        {/* Highlighted Reg Number Box */}
        <div className="p-6 rounded-2xl bg-sky-50 border-2 border-dashed border-sky-300 text-center space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-sky-700">
            Nomor Registrasi Resmi
          </span>
          <div className="text-3xl sm:text-4xl font-black tracking-wider text-sky-900 font-mono">
            {successResult.regNumber}
          </div>
          <p className="text-xs text-slate-500">
            Atas Nama: <strong className="text-slate-800">{successResult.fullName}</strong>
          </p>
        </div>

        {/* Next Steps CTA */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/ppdb/cek-status?reg=${encodeURIComponent(successResult.regNumber)}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold shadow-md shadow-sky-600/25 transition"
          >
            <Search className="w-4 h-4" />
            <span>Lihat Halaman Bukti & Cek Status</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Tanda Terima Ini</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto rounded-3xl bg-white border border-slate-200/80 shadow-xl overflow-hidden">
      
      {/* Wizard Step Progress Bar */}
      <div className="bg-slate-900 px-6 py-4 text-white">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span>Langkah {currentStep} dari 4</span>
          <span className="text-sky-300 font-bold">
            {currentStep === 1 && "Pilih Jalur Pendaftaran"}
            {currentStep === 2 && "Data Pribadi Calon Siswa"}
            {currentStep === 3 && "Data Orang Tua / Wali"}
            {currentStep === 4 && "Unggah Dokumen Prasyarat"}
          </span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        
        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Mohon Periksa Kembali Isian Anda:</div>
              <div>{errorMessage}</div>
            </div>
          </div>
        )}

        {/* STEP 1: JALUR PENDAFTARAN */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                Pilih Jalur Pendaftaran PPDB
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Pilihlah jalur yang paling sesuai dengan kondisi dan kriteria Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  id: "zonasi",
                  title: "Jalur Zonasi Wilayah",
                  desc: "Diperuntukkan bagi calon peserta didik yang berdomisili di dalam wilayah zonasi SMAN 2 Buay Bahuga.",
                },
                {
                  id: "afirmasi",
                  title: "Jalur Afirmasi",
                  desc: "Diperuntukkan bagi siswa dari keluarga ekonomi kurang mampu (pemegang KIP, PKH, atau sejenisnya).",
                },
                {
                  id: "prestasi",
                  title: "Jalur Prestasi",
                  desc: "Berdasarkan nilai rapor rata-rata tinggi atau prestasi kejuaraan akademik & non-akademik.",
                },
                {
                  id: "reguler",
                  title: "Jalur Reguler / Umum",
                  desc: "Jalur seleksi penerimaan reguler berdasarkan kuota umum sekolah.",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setFormData({ ...formData, registrationTrack: item.id as PPDBTrack })}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.registrationTrack === item.id
                      ? "border-sky-500 bg-sky-50/70 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-slate-900">{item.title}</span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.registrationTrack === item.id
                          ? "border-sky-500 bg-sky-600 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {formData.registrationTrack === item.id && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: DATA PRIBADI SISWA */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                Data Diri Calon Peserta Didik
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Pastikan nama dan nomor identitas sesuai dengan Kartu Keluarga dan Ijazah SMP.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Rizky Pratama"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  NISN (10 Digit Angka) *
                </label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  placeholder="Contoh: 0071234567"
                  value={formData.nisn}
                  onChange={(e) => setFormData({ ...formData, nisn: e.target.value.replace(/\D/g, "") })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  NIK Siswa (16 Digit Sesuai KK) *
                </label>
                <input
                  type="text"
                  maxLength={16}
                  required
                  placeholder="Contoh: 1808012345670001"
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, "") })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Jenis Kelamin *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm bg-white"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Agama *
                </label>
                <select
                  value={formData.religion}
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm bg-white"
                >
                  <option value="Islam">Islam</option>
                  <option value="Kristen Protestan">Kristen Protestan</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tempat Lahir *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Buay Bahuga"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tanggal Lahir *
                </label>
                <input
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Asal Sekolah (SMP / MTs) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SMP Negeri 1 Buay Bahuga"
                  value={formData.schoolOrigin}
                  onChange={(e) => setFormData({ ...formData, schoolOrigin: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nomor WhatsApp Siswa *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 0821xxxxxxxx"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Alamat Tempat Tinggal Lengkap *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Kampung Sukabumi, RT 02 / RW 01, Kec. Buay Bahuga, Kab. Way Kanan"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DATA ORANG TUA / WALI */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                Data Orang Tua / Wali Siswa
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Informasi ini digunakan pihak sekolah untuk koordinasi administrasi dan pengumuman.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap Orang Tua / Wali *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bambang Sujarwo"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nomor WhatsApp Orang Tua / Wali *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 0812xxxxxxxx"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: DOKUMEN & KONFIRMASI */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                Unggah Dokumen Prasyarat
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Unggah foto atau scan dokumen dalam format PDF atau JPG/PNG (Maks. 2MB per berkas).
              </p>
            </div>

            {/* Document upload boxes */}
            <div className="space-y-3">
              {[
                { key: "photo", label: "Pas Foto 3x4 Latar Merah/Biru", note: "Format JPG/PNG" },
                { key: "kk", label: "Kartu Keluarga (KK)", note: "Format PDF atau Foto Jelas" },
                { key: "skl", label: "Surat Keterangan Lulus (SKL) / Ijazah SMP", note: "Format PDF atau Foto Jelas" },
              ].map((doc) => (
                <div key={doc.key} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-800">{doc.label}</div>
                    <div className="text-xs text-slate-500">{doc.note}</div>
                  </div>
                  <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-sky-400 text-xs font-semibold text-slate-700 shadow-xs transition">
                    <Upload className="w-3.5 h-3.5 text-sky-600" />
                    <span>Pilih Berkas</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({
                            ...formData,
                            documentUrls: {
                              ...formData.documentUrls,
                              [doc.key]: URL.createObjectURL(file),
                            },
                          });
                        }
                      }}
                    />
                  </label>
                </div>
              ))}
            </div>

            {/* Anti-Spam Checkbox */}
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 flex items-start gap-3">
              <input
                id="antiSpam"
                type="checkbox"
                checked={antiSpamAgreed}
                onChange={(e) => setAntiSpamAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 mt-0.5 cursor-pointer"
              />
              <label htmlFor="antiSpam" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
                Saya menyatakan dengan sebenarnya bahwa data yang saya masukkan adalah valid dan dokumen yang saya unggah adalah sah. Apabila di kemudian hari terbukti palsu, saya bersedia menerima sanksi pembatalan kelulusan seleksi PPDB.
              </label>
            </div>
          </div>
        )}

        {/* Wizard Bottom Navigation Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>
          ) : <div />}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold shadow-md shadow-sky-600/20 transition"
            >
              <span>Lanjutkan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white text-sm font-extrabold shadow-lg shadow-sky-600/25 disabled:opacity-50 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengirimkan Pendaftaran...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Kirim Formulir PPDB Sekarang</span>
                </>
              )}
            </button>
          )}
        </div>

      </form>
    </div>
  );
}
