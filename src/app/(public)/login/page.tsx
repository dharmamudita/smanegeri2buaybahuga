"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Shield,
  User,
  Users,
  Lock,
  ArrowRight,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { Role } from "@/lib/types";

const ROLE_CONFIG: Record<
  Role,
  {
    title: string;
    subtitle: string;
    badge: string;
    badgeClass: string;
    icon: any;
    accentColor: string;
    buttonClass: string;
    idLabel: string;
    idPlaceholder: string;
    btnLabel: string;
  }
> = {
  SISWA: {
    title: "Portal Masuk Siswa",
    subtitle:
      "Akses Layanan Pembelajaran Digital & Presensi Siswa SMAN 2 Buay Bahuga",
    badge: "Ruang Peserta Didik",
    badgeClass: "bg-blue-50 text-[#2A2C5E] border-blue-200",
    icon: GraduationCap,
    accentColor: "#2A2C5E",
    buttonClass: "bg-[#2A2C5E] hover:bg-[#1F2147]",
    idLabel: "Nomor Induk Siswa Nasional (NISN)",
    idPlaceholder: "10 Digit Angka NISN Siswa",
    btnLabel: "Masuk ke Ruang Siswa",
  },
  GURU: {
    title: "Portal Masuk Dewan Guru",
    subtitle:
      "Sistem Manajemen Pembelajaran, Bank Soal & Nilai SMAN 2 Buay Bahuga",
    badge: "Ruang Tenaga Pendidik",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    icon: Users,
    accentColor: "#D97706",
    buttonClass: "bg-[#2A2C5E] hover:bg-[#1F2147]",
    idLabel: "Nomor Unik Pendidik dan Tenaga Kependidikan (NUPTK)",
    idPlaceholder: "16 Digit NUPTK Guru",
    btnLabel: "Masuk ke Portal Dewan Guru",
  },
  ADMIN: {
    title: "Portal Masuk Administrator",
    subtitle:
      "Pusat Kendali Data Pokok, Pengguna & Seleksi PPDB SMAN 2 Buay Bahuga",
    badge: "Panel Administrator Sistem",
    badgeClass: "bg-red-50 text-red-800 border-red-200",
    icon: Shield,
    accentColor: "#DC2626",
    buttonClass: "bg-[#2A2C5E] hover:bg-[#1F2147]",
    idLabel: "ID Akses Administrator",
    idPlaceholder: "ID Administrator Resmi",
    btnLabel: "Masuk ke Panel Administrator",
  },
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();

  // Tentukan peran aktif murni dari query param ?role=
  const roleQuery = searchParams.get("role");
  const currentRole: Role =
    roleQuery === "ADMIN"
      ? "ADMIN"
      : roleQuery === "GURU"
      ? "GURU"
      : "SISWA";

  const config = ROLE_CONFIG[currentRole];
  const Icon = config.icon;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Bersihkan isian saat query param berganti
  useEffect(() => {
    setUsername("");
    setPassword("");
    setErrorMsg("");
  }, [currentRole]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          role: currentRole,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        setUser(data.user);
        if (data.user.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (data.user.role === "GURU") {
          router.push("/guru/dashboard");
        } else {
          router.push("/siswa/dashboard");
        }
      } else {
        setErrorMsg(data.message || "Kredensial atau kata sandi tidak valid.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setErrorMsg("Gagal menghubungi server autentikasi. Pastikan koneksi internet aktif.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6">
      {/* Header Portal Mandiri (Tanpa Tab Bercampur) */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-white p-2 border border-gray-200 shadow-xs flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logosmanda.png"
            alt="Logo SMAN 2 Buay Bahuga"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold border border-gray-200 bg-white text-gray-700 shadow-2xs">
          <span>{config.badge}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {config.title}
        </h1>
        <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
          {config.subtitle}
        </p>
      </div>

      {/* Kotak Formulir Khusus Role Ini Saja */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Error Banner */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Login Mandiri */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">
              {config.idLabel}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={config.idPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E] font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">
                Kata Sandi
              </label>
              <span className="text-[11px] text-gray-400">
                Default dari Admin
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-white text-xs font-bold rounded-md shadow-xs transition-all active:scale-98 disabled:opacity-50 ${config.buttonClass}`}
          >
            {loading ? (
              <span>Memverifikasi Hak Akses...</span>
            ) : (
              <>
                <span>{config.btnLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Navigasi Berpindah ke Portal Lain jika Salah Akses */}
      <div className="text-center text-xs text-gray-500 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1 hover:text-[#2A2C5E] transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda Utama</span>
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50/60">
      <Suspense fallback={<div className="text-xs text-gray-500">Memuat gerbang login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
