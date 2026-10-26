export type Role = "ADMIN" | "GURU" | "SISWA";

export interface UserSession {
  id: string;
  username: string; // SMAN2BUBA (Admin), NUPTK (Guru), NISN (Siswa)
  name: string;
  role: Role;
  email?: string;
  nisn?: string;
  nuptk?: string;
  avatarUrl?: string;
  kelas?: string;
  mataPelajaran?: string;
}

export interface MapelItem {
  id: string;
  kode: string;
  nama: string;
  tingkat: "X" | "XI" | "XII";
  jurusan: "MIPA" | "IPS" | "Umum";
  guruNama: string;
  guruNuptk: string;
  totalMateri: number;
  totalTugas: number;
  jadwal: string;
  ruang: string;
}

export interface MateriItem {
  id: string;
  mapelId: string;
  judul: string;
  deskripsi: string;
  tipe: "PDF" | "VIDEO" | "DOKUMEN" | "LINK";
  fileUrl: string;
  tanggalUnggah: string;
  ukuranFile?: string;
}

export interface SoalUjian {
  id: number;
  pertanyaan: string;
  pilihan: string[];
  kunciJawaban: number;
}

export interface TugasItem {
  id: string;
  mapelId: string;
  mapelNama: string;
  judul: string;
  deskripsi: string;
  tipe: "TUGAS" | "KUIS" | "UJIAN_HARIAN" | "UJIAN_SEMESTER";
  durasiMenit?: number;
  tenggatWaktu: string;
  totalPoin: number;
  statusSiswa?: "BELUM_MENGERJAKAN" | "SELESAI" | "TERLAMBAT";
  nilaiSiswa?: number;
  soal?: SoalUjian[];
}

export interface PresensiRecord {
  id: string;
  siswaId: string;
  siswaNama: string;
  nisn: string;
  kelas: string;
  tanggal: string;
  waktu: string;
  status: "HADIR" | "TERLAMBAT" | "IZIN" | "SAKIT" | "ALPA";
  jarakMeter: number;
  latitude: number;
  longitude: number;
  keterangan?: string;
}

export interface UjianLogRecord {
  id: string;
  siswaNama: string;
  nisn: string;
  tugasJudul: string;
  eventType: "SWITCH_TAB" | "COPY_TEXT" | "WINDOW_BLUR" | "DEVTOOLS_OPEN";
  metadata: string;
  timestamp: string;
}

export interface BeritaItem {
  id: string;
  slug: string;
  judul: string;
  ringkasan: string;
  konten: string;
  kategori: "PENGUMUMAN" | "AKADEMIK" | "KESISWAAN" | "PRESTASI";
  penulis: string;
  tanggal: string;
  bacaMenit: number;
  thumbnailUrl: string;
}

export interface PPDBRecord {
  id: string;
  nomorPendaftaran: string;
  namaLengkap: string;
  nisn: string;
  asalSekolah: string;
  jenisKelamin: "L" | "P";
  pilihanJurusan: "MIPA" | "IPS";
  noHp: string;
  tanggalDaftar: string;
  status: "MENUNGGU_VERIFIKASI" | "DIVERIFIKASI" | "DITERIMA" | "DITOLAK";
  berkasIjazah?: string;
  berkasKK?: string;
}
