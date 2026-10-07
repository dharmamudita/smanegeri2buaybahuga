"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Calendar, 
  User, 
  School, 
  Printer, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  XCircle,
  FileText,
  GraduationCap,
  Loader2,
  Phone
} from "lucide-react";
import { checkRegistrationStatus } from "@/app/actions/ppdb";
import { formatDate, formatDateTime, getStatusBadge, getTrackLabel } from "@/lib/utils";
import { Registration } from "@/types/database";

function CekStatusContent() {
  const searchParams = useSearchParams();
  const initialReg = searchParams.get("reg") || "";

  const [identifier, setIdentifier] = useState(initialReg);
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<Registration | null>(null);

  // Auto-search if query param exists
  useEffect(() => {
    if (initialReg) {
      setIdentifier(initialReg);
    }
  }, [initialReg]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setResult(null);

    if (!identifier.trim()) {
      setErrorMessage("Harap masukkan Nomor Registrasi atau NISN.");
      return;
    }

    if (!birthDate) {
      setErrorMessage("Harap pilih tanggal lahir siswa untuk verifikasi data.");
      return;
    }

    setLoading(true);

    try {
      const response = await checkRegistrationStatus(identifier, birthDate);
      if (response.success && response.registration) {
        setResult(response.registration as Registration);
      } else {
        setErrorMessage(
          response.message || "Data tidak ditemukan. Silakan periksa kembali nomor registrasi dan tanggal lahir."
        );
      }
    } catch (err) {
      setErrorMessage("Terjadi kesalahan saat memeriksa data. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = result ? getStatusBadge(result.status) : null;

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3 no-print">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-sky-600" />
            <span>Pemeriksaan Berkas PPDB</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Cek Status Pendaftaran Siswa
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
            Masukkan Nomor Registrasi (atau NISN 10 digit) beserta Tanggal Lahir untuk memantau status verifikasi berkas.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 no-print">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nomor Registrasi atau NISN *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PPDB-2027-1234 atau 0071234567"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tanggal Lahir Siswa *
                </label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memeriksa Database...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Periksa Status Sekarang</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Search Result & Official Registration Card */}
        {result && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Print action buttons */}
            <div className="flex items-center justify-between no-print">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Kartu Tanda Bukti Registrasi
              </span>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>

            {/* Registration Card Layout (Print-Optimized) */}
            <div className="rounded-3xl bg-white border-2 border-slate-300 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8">
              
              {/* Card Official School Header */}
              <div className="border-b-2 border-slate-900 pb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 shrink-0">
                    <Image
                      src="/logo_smanda.png"
                      alt="Logo SMAN 2 Buay Bahuga"
                      width={56}
                      height={56}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      SMA NEGERI 2 BUAY BAHUGA
                    </h2>
                    <p className="text-xs text-slate-600">
                      Jl. Ryacudu No. 04, Suka Agung, Buay Bahuga, Way Kanan, Lampung • NPSN: 10810192
                    </p>
                    <p className="text-xs font-bold text-sky-700">
                      TANDA BUKTI PENERIMAAN PESERTA DIDIK BARU (PPDB) ONLINE
                    </p>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Kode Dokumen</div>
                  <div className="text-xs font-mono font-bold text-slate-700">{result.reg_number}</div>
                </div>
              </div>

              {/* Status Banner */}
              {statusBadge && (
                <div className={`p-4 rounded-2xl border ${statusBadge.bg} ${statusBadge.border} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-current animate-pulse" />
                    <div>
                      <div className="text-xs font-semibold text-slate-500">Status Kelulusan / Berkas:</div>
                      <div className={`text-base sm:text-lg font-black ${statusBadge.text}`}>
                        {statusBadge.label}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Tgl Submit: {formatDate(result.created_at)}
                  </span>
                </div>
              )}

              {/* Admin Note if revision needed */}
              {result.admin_notes && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm">
                  <strong>Catatan Panitia PPDB:</strong> {result.admin_notes}
                </div>
              )}

              {/* Student Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm border-b border-slate-100 pb-8">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Nomor Registrasi:</span>
                  <div className="font-mono font-extrabold text-slate-900 text-base">{result.reg_number}</div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-medium">Jalur Pendaftaran:</span>
                  <div className="font-bold text-sky-700">{getTrackLabel(result.registration_track)}</div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-medium">Nama Lengkap Siswa:</span>
                  <div className="font-extrabold text-slate-900">{result.full_name}</div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-medium">NISN / NIK:</span>
                  <div className="font-mono text-slate-800">{result.nisn} / {result.nik}</div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-medium">Tempat, Tanggal Lahir:</span>
                  <div className="text-slate-800">{result.birth_place}, {formatDate(result.birth_date)}</div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-medium">Jenis Kelamin / Agama:</span>
                  <div className="text-slate-800">{result.gender} / {result.religion}</div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-medium">Asal Sekolah (SMP):</span>
                  <div className="font-semibold text-slate-900">{result.school_origin}</div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-medium">No. WhatsApp Siswa:</span>
                  <div className="text-slate-800 font-mono">{result.phone_number}</div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-medium">Nama Orang Tua / Wali:</span>
                  <div className="text-slate-800">{result.parent_name}</div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-medium">Alamat Tempat Tinggal:</span>
                  <div className="text-slate-800 leading-snug">{result.address}</div>
                </div>
              </div>

              {/* Instructions Box for Student */}
              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl">
                <div className="font-bold text-slate-800">Catatan & Petunjuk Lapor Diri:</div>
                <ol className="list-decimal list-inside space-y-1 leading-relaxed">
                  <li>Cetak tanda bukti ini sebanyak 1 (satu) lembar untuk dibawa saat verifikasi fisik ke sekolah.</li>
                  <li>Bawa dokumen asli: Ijazah/SKL SMP, Kartu Keluarga, Akta Kelahiran, dan Pas Foto 3x4 (2 lembar).</li>
                  <li>Jika terdapat kekeliruan data atau kendala verifikasi, silakan hubungi Panitia PPDB di sekolah.</li>
                </ol>
              </div>

              {/* Signatures Footer */}
              <div className="pt-6 flex justify-between items-end text-xs text-slate-700">
                <div>
                  <div>Mengetahui,</div>
                  <div className="font-bold text-slate-900 mt-12">Orang Tua / Wali Siswa</div>
                  <div className="text-[11px] text-slate-500">Tanda Tangan & Nama Terang</div>
                </div>

                <div className="text-right">
                  <div>Buay Bahuga, {formatDate(new Date())}</div>
                  <div>Panitia PPDB SMAN 2 Buay Bahuga</div>
                  <div className="font-bold text-slate-900 mt-12">( Panitia PPDB Sekolah )</div>
                  <div className="text-[11px] text-slate-500">Cap / Tanda Tangan Resmi</div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function CekStatusPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Memuat Formulir Cek Status...</div>}>
      <CekStatusContent />
    </Suspense>
  );
}
