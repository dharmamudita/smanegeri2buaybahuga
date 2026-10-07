"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Lock, 
  Mail, 
  ArrowLeft, 
  AlertCircle, 
  Loader2, 
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";
import { loginAdmin } from "@/app/actions/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const res = await loginAdmin(formData);

      if (res.success) {
        router.push("/admin/dashboard");
      } else {
        setErrorMessage(res.message || "Gagal masuk. Periksa kembali email dan password.");
      }
    } catch (err: any) {
      setErrorMessage("Terjadi kendala saat autentikasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative selection:bg-blue-100 selection:text-blue-900">
      
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-blue-50/80 via-slate-50 to-slate-50 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-700 transition px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Website Sekolah</span>
          </Link>
          <span className="text-[11px] font-semibold text-slate-400">SMAN 2 Buay Bahuga</span>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/60 rounded-3xl p-8 sm:p-10 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="relative w-16 h-16 mx-auto p-2 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs">
              <Image
                src="/logo_smanda.png"
                alt="Logo SMAN 2 Buay Bahuga"
                width={64}
                height={64}
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Portal Administrator
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Sistem Manajemen Informasi & Panitia PPDB
              </p>
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alamat Email Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@sman2buaybahuga.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/60 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50/60 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-700/20 disabled:opacity-50 transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Sesi...</span>
                </>
              ) : (
                <span>Masuk ke Dasbor</span>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">Akses terenkripsi khusus operator dan panitia sekolah</span>
          </div>

        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 font-medium">
          © {new Date().getFullYear()} SMA Negeri 2 Buay Bahuga. All rights reserved.
        </p>

      </div>
    </div>
  );
}
