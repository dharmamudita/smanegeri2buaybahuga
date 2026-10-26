"use client";

import { useState } from "react";
import {
  FileCheck,
  UploadCloud,
  CheckCircle2,
  Printer,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { SCHOOL_INFO } from "@/lib/constants";

export default function PPDBPage() {
  const [submitted, setSubmitted] = useState(false);
  const [regNumber, setRegNumber] = useState("");
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nisn: "",
    asalSekolah: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "L",
    agama: "Islam",
    alamat: "",
    namaOrangTua: "",
    noHpOrangTua: "",
    pilihanJurusan: "MIPA",
    berkasIjazah: null as File | null,
    berkasKK: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generated = `PPDB-2026-${Math.floor(100 + Math.random() * 900)}`;
    setRegNumber(generated);
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2A2C5E] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Penerimaan Peserta Didik Baru (PPDB) 2026/2027</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Pendaftaran Online Calon Siswa Baru
        </h1>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Silakan lengkapi formulir pendaftaran di bawah ini secara cermat sesuai
          dokumen kependudukan dan rapor SMP/MTs sederajat.
        </p>
      </div>

      {submitted ? (
        /* Success Registration Receipt */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-2 pb-6 border-b border-gray-200">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Pendaftaran Berhasil Disimpan
            </h2>
            <p className="text-xs text-gray-600">
              Dokumen dan formulir Anda telah masuk dalam antrean verifikasi panitia PPDB {SCHOOL_INFO.nama}.
            </p>
          </div>

          <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2">
              <span className="text-gray-500 font-medium">Nomor Pendaftaran</span>
              <span className="font-mono text-base font-bold text-[#2A2C5E]">
                {regNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Nama Calon Siswa</span>
              <span className="font-semibold text-gray-900">
                {formData.namaLengkap}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">NISN</span>
              <span className="font-semibold text-gray-900">{formData.nisn}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Asal Sekolah</span>
              <span className="font-semibold text-gray-900">
                {formData.asalSekolah}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Pilihan Program</span>
              <span className="font-semibold text-[#2A2C5E]">
                Peminatan {formData.pilihanJurusan}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-blue-100">
              <span className="text-gray-500 font-medium">Status Verifikasi</span>
              <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <Clock className="w-3 h-3" />
                MENUNGGU VERIFIKASI BERKAS
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>Catatan Penting:</strong> Simpan atau cetak nomor pendaftaran di atas. Pengumuman hasil verifikasi berkas dan jadwal seleksi tahap berikutnya dapat dipantau secara berkala melalui menu Informasi atau kontak sekretariat sekolah.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Bukti Pendaftaran</span>
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-md shadow-2xs"
            >
              <span>Daftarkan Siswa Baru Lain</span>
            </button>
          </div>
        </div>
      ) : (
        /* Form Registration */
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-10 space-y-8"
        >
          {/* Bagian 1: Data Diri Calon Siswa */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-l-4 border-[#2A2C5E] pl-3">
              1. Identitas Calon Siswa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-gray-700">
                  Nama Lengkap Sesuai Akta Kelahiran *
                </label>
                <input
                  type="text"
                  required
                  value={formData.namaLengkap}
                  onChange={(e) =>
                    setFormData({ ...formData, namaLengkap: e.target.value })
                  }
                  placeholder="Contoh: Muhammad Aditya Pratama"
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">
                  Nomor Induk Siswa Nasional (NISN) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={formData.nisn}
                  onChange={(e) =>
                    setFormData({ ...formData, nisn: e.target.value })
                  }
                  placeholder="10 Digit Angka NISN"
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">
                  Asal Sekolah (SMP / MTs) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.asalSekolah}
                  onChange={(e) =>
                    setFormData({ ...formData, asalSekolah: e.target.value })
                  }
                  placeholder="Contoh: SMP Negeri 1 Buay Bahuga"
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Tempat Lahir *</label>
                <input
                  type="text"
                  required
                  value={formData.tempatLahir}
                  onChange={(e) =>
                    setFormData({ ...formData, tempatLahir: e.target.value })
                  }
                  placeholder="Contoh: Way Kanan"
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Tanggal Lahir *</label>
                <input
                  type="date"
                  required
                  value={formData.tanggalLahir}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggalLahir: e.target.value })
                  }
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Jenis Kelamin *</label>
                <select
                  value={formData.jenisKelamin}
                  onChange={(e) =>
                    setFormData({ ...formData, jenisKelamin: e.target.value })
                  }
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Pilihan Jurusan Peminatan *</label>
                <select
                  value={formData.pilihanJurusan}
                  onChange={(e) =>
                    setFormData({ ...formData, pilihanJurusan: e.target.value })
                  }
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md font-semibold text-[#2A2C5E]"
                >
                  <option value="MIPA">MIPA (Matematika & Ilmu Pengetahuan Alam)</option>
                  <option value="IPS">IPS (Ilmu Pengetahuan Sosial)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bagian 2: Data Orang Tua / Wali */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-base font-bold text-gray-900 border-l-4 border-[#2A2C5E] pl-3">
              2. Data Orang Tua / Wali & Alamat
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">
                  Nama Orang Tua / Wali *
                </label>
                <input
                  type="text"
                  required
                  value={formData.namaOrangTua}
                  onChange={(e) =>
                    setFormData({ ...formData, namaOrangTua: e.target.value })
                  }
                  placeholder="Nama Ayah/Ibu/Wali"
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">
                  Nomor Telepon / WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.noHpOrangTua}
                  onChange={(e) =>
                    setFormData({ ...formData, noHpOrangTua: e.target.value })
                  }
                  placeholder="Contoh: 081234567890"
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-gray-700">
                  Alamat Lengkap Domisili *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.alamat}
                  onChange={(e) =>
                    setFormData({ ...formData, alamat: e.target.value })
                  }
                  placeholder="Nama Jalan, Dusun, RT/RW, Desa/Kelurahan, Kecamatan"
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Bagian 3: Unggah Berkas Persyaratan */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-base font-bold text-gray-900 border-l-4 border-[#2A2C5E] pl-3">
              3. Berkas Persyaratan (Simulasi Cloudinary Storage)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center space-y-2 hover:border-[#2A2C5E] transition-colors">
                <UploadCloud className="w-8 h-8 text-gray-400 mx-auto" />
                <div className="font-semibold text-gray-700">
                  Scan Kartu Keluarga (KK)
                </div>
                <p className="text-[11px] text-gray-400">PDF atau JPG maks 2MB</p>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-[#2A2C5E]"
                />
              </div>

              <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center space-y-2 hover:border-[#2A2C5E] transition-colors">
                <UploadCloud className="w-8 h-8 text-gray-400 mx-auto" />
                <div className="font-semibold text-gray-700">
                  Scan Ijazah / Surat Keterangan Lulus
                </div>
                <p className="text-[11px] text-gray-400">PDF atau JPG maks 2MB</p>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-[#2A2C5E]"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              Dengan mengklik tombol kirim, data pendaftaran akan diverifikasi oleh panitia PPDB.
            </p>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#2A2C5E] hover:bg-[#1F2147] text-white text-xs font-bold rounded-md shadow-xs transition-all active:scale-98"
            >
              <span>Kirim Formulir Pendaftaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
