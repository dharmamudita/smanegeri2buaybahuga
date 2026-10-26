"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Shield,
  Download,
} from "lucide-react";
import DataTable, { Column, DataTableFilter } from "@/components/common/DataTable";
import { MOCK_USERS } from "@/lib/mockData";
import { UserSession, Role } from "@/lib/types";

export default function AdminUsersPage() {
  const [userList, setUserList] = useState<UserSession[]>(MOCK_USERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<Role>("SISWA");
  const [newIdentifier, setNewIdentifier] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handleBulkGenerate = () => {
    alert(
      "Generator Akun Massal Berhasil!\n12 Akun Siswa Baru (berdasarkan NISN) dan 3 Akun Guru Baru (berdasarkan NUPTK) telah digenerate dengan kata sandi default."
    );
  };

  const handleResetPassword = (name: string, id: string) => {
    alert(`Kata sandi untuk akun '${name}' (${id}) telah direset ke kata sandi standar.`);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserSession = {
      id: `user-${Date.now()}`,
      username: newIdentifier,
      name: newName,
      role: newRole,
      email: newEmail,
      nisn: newRole === "SISWA" ? newIdentifier : undefined,
      nuptk: newRole === "GURU" ? newIdentifier : undefined,
      kelas: newRole === "SISWA" ? "X MIPA 1" : undefined,
    };
    setUserList([newUser, ...userList]);
    setShowAddModal(false);
    setNewName("");
    setNewIdentifier("");
    setNewEmail("");
  };

  const filters: DataTableFilter[] = [
    {
      key: "role",
      label: "Peran Akun",
      options: [
        { label: "Administrator", value: "ADMIN" },
        { label: "Dewan Guru", value: "GURU" },
        { label: "Siswa Terdaftar", value: "SISWA" },
      ],
    },
  ];

  const columns: Column<UserSession>[] = [
    {
      header: "Nama Pengguna",
      cell: (row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.name}</div>
          <div className="text-[11px] text-gray-500">{row.email || "-"}</div>
        </div>
      ),
    },
    {
      header: "Peran / Hak Akses",
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold ${
            row.role === "ADMIN"
              ? "bg-red-50 text-red-700 border border-red-200"
              : row.role === "GURU"
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-blue-50 text-[#2A2C5E] border border-blue-200"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      header: "Username / Identitas Kependidikan",
      cell: (row) => (
        <span className="font-mono text-xs font-semibold text-gray-800">
          {row.nisn
            ? `NISN: ${row.nisn}`
            : row.nuptk
            ? `NUPTK: ${row.nuptk}`
            : `ID: ${row.username}`}
        </span>
      ),
    },
    {
      header: "Status",
      cell: () => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Aktif
        </span>
      ),
    },
    {
      header: "Aksi Keamanan",
      cell: (row) => (
        <button
          onClick={() =>
            handleResetPassword(
              row.name,
              row.nisn || row.nuptk || row.username
            )
          }
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded transition-colors"
          title="Reset Password Default"
        >
          <RotateCcw className="w-3 h-3 text-[#2A2C5E]" />
          <span>Reset Sandi</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Manajemen Autentikasi & RBAC</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Pengelolaan Akun Siswa & Guru
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Pendaftaran terpusat menggunakan NISN (Siswa) dan NUPTK (Guru) dengan deteksi role otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleBulkGenerate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md shadow-2xs transition-colors"
          >
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <span>Generator Akun Massal</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-md shadow-2xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Akun Baru</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="space-y-4">
        <DataTable
          title="Daftar Pengguna Sistem Terdaftar"
          subtitle="Tabel data pengguna dengan kolom pencarian nama/NISN/NUPTK, filter peran, dan pagination"
          data={userList}
          columns={columns}
          filters={filters}
          pageSize={10}
        />
      </div>

      {/* Modal Tambah User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-gray-200">
            <div className="border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                Pendaftaran Akun Baru
              </h3>
              <p className="text-xs text-gray-500">
                Daftarkan akun dewan guru atau siswa ke dalam sistem.
              </p>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Peran Pengguna *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as Role)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                >
                  <option value="SISWA">Siswa (Login via NISN)</option>
                  <option value="GURU">Guru (Login via NUPTK)</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">
                  {newRole === "SISWA"
                    ? "Nomor Induk Siswa Nasional (NISN) *"
                    : newRole === "GURU"
                    ? "Nomor Unik Pendidik (NUPTK) *"
                    : "Username Admin *"}
                </label>
                <input
                  type="text"
                  required
                  value={newIdentifier}
                  onChange={(e) => setNewIdentifier(e.target.value)}
                  placeholder={newRole === "SISWA" ? "10 Digit NISN" : "16 Digit NUPTK"}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Muhammad Ihsan Pratama, S.Pd."
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Alamat Email Resmi</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="nama@sman2buaybahuga.sch.id"
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded text-gray-600 text-[11px]">
                Kata sandi awal akan disetel ke format default dan dapat diubah secara mandiri oleh pengguna setelah login pertama.
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2A2C5E] hover:bg-[#1F2147] rounded-md shadow-xs"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
