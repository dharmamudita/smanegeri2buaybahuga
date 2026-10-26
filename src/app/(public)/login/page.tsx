"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Shield,
  User,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { MOCK_USERS } from "@/lib/mockData";
import { Role } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<Role>("SISWA");
  const [username, setUsername] = useState("0078129341");
  const [password, setPassword] = useState("password123");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleTabChange = (role: Role) => {
    setSelectedRole(role);
    setErrorMsg("");
    if (role === "ADMIN") {
      setUsername("SMAN2BUBA");
      setPassword("SMANegeri2buba");
    } else if (role === "GURU") {
      setUsername("197805122005011003"); // NUPTK Pak Budi Santoso
      setPassword("guru12345");
    } else {
      setUsername("0078129341"); // NISN Dharma Mudita
      setPassword("siswa12345");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      // Find matching mock user
      let matched = MOCK_USERS.find(
        (u) =>
          u.role === selectedRole &&
          (u.username.toLowerCase() === username.toLowerCase() ||
            u.nisn === username ||
            u.nuptk === username)
      );

      // Admin hardcoded check
      if (selectedRole === "ADMIN") {
        if (username === "SMAN2BUBA" && password === "SMANegeri2buba") {
          matched = MOCK_USERS[0];
        } else {
          setErrorMsg("ID Akses atau Password Administrator tidak valid.");
          setLoading(false);
          return;
        }
      }

      if (matched) {
        setUser(matched);
        if (matched.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (matched.role === "GURU") {
          router.push("/guru/dashboard");
        } else {
          router.push("/siswa/dashboard");
        }
      } else {
        setErrorMsg(
          selectedRole === "GURU"
            ? "NUPTK tidak ditemukan atau belum didaftarkan oleh Admin."
            : "NISN tidak ditemukan. Pastikan Anda telah terdaftar aktif di Dapodik."
        );
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50/60">
      <div className="max-w-md w-full space-y-6">
        {/* Institutional Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-xl bg-[#2E4BA3] text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Gerbang Masuk Terpadu
          </h1>
          <p className="text-xs text-gray-500">
            Smart School & Learning Management System SMAN 2 Buay Bahuga
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => handleRoleTabChange("SISWA")}
              className={`py-2 text-xs font-semibold rounded-md transition-all ${
                selectedRole === "SISWA"
                  ? "bg-white text-[#2E4BA3] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Siswa (NISN)
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange("GURU")}
              className={`py-2 text-xs font-semibold rounded-md transition-all ${
                selectedRole === "GURU"
                  ? "bg-white text-[#2E4BA3] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Guru (NUPTK)
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange("ADMIN")}
              className={`py-2 text-xs font-semibold rounded-md transition-all ${
                selectedRole === "ADMIN"
                  ? "bg-white text-[#2E4BA3] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Admin ID
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                {selectedRole === "ADMIN"
                  ? "ID Akses Administrator"
                  : selectedRole === "GURU"
                  ? "Nomor Unik Pendidik (NUPTK)"
                  : "Nomor Induk Siswa Nasional (NISN)"}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E4BA3]/20 focus:border-[#2E4BA3]"
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
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E4BA3]/20 focus:border-[#2E4BA3]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#2E4BA3] hover:bg-[#233b82] text-white text-xs font-bold rounded-md shadow-xs transition-all active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <span>Memverifikasi Hak Akses...</span>
              ) : (
                <>
                  <span>Masuk ke {selectedRole === "ADMIN" ? "Panel Admin" : selectedRole === "GURU" ? "Portal Guru" : "Ruang Siswa"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-[11px] text-gray-600 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#2E4BA3]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Info Akses Demo Cepat (PRD):</span>
            </div>
            {selectedRole === "ADMIN" && (
              <p>ID: <code className="font-bold text-gray-800">SMAN2BUBA</code> | Password: <code className="font-bold text-gray-800">SMANegeri2buba</code></p>
            )}
            {selectedRole === "GURU" && (
              <p>NUPTK: <code className="font-bold text-gray-800">197805122005011003</code> (Budi Santoso, S.Pd.)</p>
            )}
            {selectedRole === "SISWA" && (
              <p>NISN: <code className="font-bold text-gray-800">0078129341</code> (Dharma Mudita Pratama - XII MIPA 1)</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
