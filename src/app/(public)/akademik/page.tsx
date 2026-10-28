"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Calendar,
  Clock,
  FileCheck2,
  Laptop,
  GraduationCap,
  AlertCircle,
  Search,
  Filter,
  MapPin,
  UserCheck,
  CheckCircle2,
  Layers,
} from "lucide-react";

type AkademikTab = "KALENDER" | "JADWAL_PELAJARAN" | "JADWAL_UJIAN";

interface AgendaKalender {
  tanggal: string;
  bulanSingkat: string;
  kegiatan: string;
  kategori: "AKADEMIK" | "UJIAN" | "LIBUR" | "KESISWAAN";
  keterangan: string;
}

interface BulanKalender {
  bulan: string;
  semester: "GANJIL" | "GENAP";
  hariEfektif: number;
  agenda: AgendaKalender[];
}

interface SlotPelajaran {
  jamKe: string;
  waktu: string;
  mapel: string;
  guru: string;
  ruang: string;
  tipe?: "KBM" | "ISTIRAHAT" | "KHUSUS";
}

interface JadwalHariKelas {
  hari: string;
  totalJp: string;
  slots: SlotPelajaran[];
}

interface JadwalUjianRow {
  id: string;
  jenisUjian: "PAS_GANJIL" | "PTS_GANJIL" | "UJIAN_SEKOLAH";
  hariTanggal: string;
  sesi: string;
  waktu: string;
  mataPelajaran: string;
  tingkat: "SEMUA" | "XII_MIPA" | "XII_IPS" | "XI" | "X";
  tingkatLabel: string;
  ruangModa: string;
  koordinator: string;
}

const KALENDER_DATA: BulanKalender[] = [
  {
    bulan: "Juli 2026",
    semester: "GANJIL",
    hariEfektif: 18,
    agenda: [
      {
        tanggal: "13 - 15",
        bulanSingkat: "Jul",
        kegiatan: "Hari Pertama Masuk & Masa Pengenalan Lingkungan Sekolah (MPLS)",
        kategori: "KESISWAAN",
        keterangan: "Orientasi peserta didik baru Kelas X dan pembagian wali kelas 29 rombel.",
      },
      {
        tanggal: "16 - 18",
        bulanSingkat: "Jul",
        kegiatan: "Asesmen Diagnostik Awal & Pengenalan Kurikulum Merdeka",
        kategori: "AKADEMIK",
        keterangan: "Pemetaan kesiapan belajar siswa Kelas X, XI, dan XII.",
      },
      {
        tanggal: "20",
        bulanSingkat: "Jul",
        kegiatan: "Awal Efektif Kegiatan Belajar Mengajar (KBM) Reguler",
        kategori: "AKADEMIK",
        keterangan: "Pelaksanaan KBM tatap muka penuh sesuai jadwal pelajaran semester ganjil.",
      },
    ],
  },
  {
    bulan: "Agustus 2026",
    semester: "GANJIL",
    hariEfektif: 25,
    agenda: [
      {
        tanggal: "10 - 15",
        bulanSingkat: "Agu",
        kegiatan: "Pekan Gebyar Kemerdekaan & Lomba Antar-Rombel",
        kategori: "KESISWAAN",
        keterangan: "Lomba kebersihan kelas ASRI, baris-berbaris, dan olahraga antar-kelas.",
      },
      {
        tanggal: "17",
        bulanSingkat: "Agu",
        kegiatan: "Upacara Peringatan HUT ke-81 Kemerdekaan Republik Indonesia",
        kategori: "LIBUR",
        keterangan: "Penugasan Paskibra SMAN 2 Buay Bahuga di tingkat sekolah dan kecamatan.",
      },
      {
        tanggal: "24 - 27",
        bulanSingkat: "Agu",
        kegiatan: "Pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK) SMA",
        kategori: "UJIAN",
        keterangan: "Survei Karakter, Lingkungan Belajar, Literasi, dan Numerasi Kelas XI.",
      },
    ],
  },
  {
    bulan: "September 2026",
    semester: "GANJIL",
    hariEfektif: 24,
    agenda: [
      {
        tanggal: "07 - 12",
        bulanSingkat: "Sep",
        kegiatan: "Gelar Karya Projek Penguatan Profil Pelajar Pancasila (P5)",
        kategori: "AKADEMIK",
        keterangan: "Praktik kewirausahaan lokal, kriya seni budaya Lampung, dan penghijauan.",
      },
      {
        tanggal: "21 - 26",
        bulanSingkat: "Sep",
        kegiatan: "Penilaian Tengah Semester (PTS) Ganjil Terpadu",
        kategori: "UJIAN",
        keterangan: "Evaluasi capaian pembelajaran tengah semester bagi Kelas X, XI, dan XII.",
      },
    ],
  },
  {
    bulan: "Oktober 2026",
    semester: "GANJIL",
    hariEfektif: 26,
    agenda: [
      {
        tanggal: "05 - 07",
        bulanSingkat: "Okt",
        kegiatan: "In-House Training (IHT) Dewan Guru & Evaluasi Tengah Semester",
        kategori: "AKADEMIK",
        keterangan: "Penguatan pembelajaran digital dan penyusunan modul ajar.",
      },
      {
        tanggal: "28",
        bulanSingkat: "Okt",
        kegiatan: "Peringatan Hari Sumpah Pemuda & Pemilihan Pengurus OSIS/MPK",
        kategori: "KESISWAAN",
        keterangan: "Pesta demokrasi pemilihan Ketua & Wakil Ketua OSIS periode baru.",
      },
    ],
  },
  {
    bulan: "November 2026",
    semester: "GANJIL",
    hariEfektif: 25,
    agenda: [
      {
        tanggal: "10",
        bulanSingkat: "Nov",
        kegiatan: "Upacara Peringatan Hari Pahlawan Nasional",
        kategori: "KESISWAAN",
        keterangan: "Pembinaan karakter kepahlawanan dan wawasan kebangsaan.",
      },
      {
        tanggal: "16 - 21",
        bulanSingkat: "Nov",
        kegiatan: "Ujian Praktikum Laboratorium IPA, Komputer & Bahasa",
        kategori: "UJIAN",
        keterangan: "Pengambilan nilai praktikum Biologi, Fisika, Kimia, dan Informatika.",
      },
      {
        tanggal: "25",
        bulanSingkat: "Nov",
        kegiatan: "Peringatan Hari Guru Nasional (HGN)",
        kategori: "KESISWAAN",
        keterangan: "Apresiasi dedikasi 48 pendidik dan 5 tenaga kependidikan SMAN 2 Buay Bahuga.",
      },
    ],
  },
  {
    bulan: "Desember 2026",
    semester: "GANJIL",
    hariEfektif: 14,
    agenda: [
      {
        tanggal: "01 - 10",
        bulanSingkat: "Des",
        kegiatan: "Penilaian Akhir Semester (PAS) Ganjil Tahun Ajaran 2026/2027",
        kategori: "UJIAN",
        keterangan: "Ujian sumatif akhir semester ganjil seluruh tingkat kelas (983 siswa).",
      },
      {
        tanggal: "18",
        bulanSingkat: "Des",
        kegiatan: "Pembagian Buku Laporan Hasil Belajar (e-Rapor) Semester Ganjil",
        kategori: "AKADEMIK",
        keterangan: "Penyerahan rapor kepada orang tua/wali murid oleh masing-masing wali kelas.",
      },
      {
        tanggal: "21 - 31",
        bulanSingkat: "Des",
        kegiatan: "Libur Akhir Semester Ganjil & Cuti Bersama Akhir Tahun",
        kategori: "LIBUR",
        keterangan: "Masa libur akademik akhir semester ganjil 2026/2027.",
      },
    ],
  },
  {
    bulan: "Januari 2027",
    semester: "GENAP",
    hariEfektif: 24,
    agenda: [
      {
        tanggal: "04",
        bulanSingkat: "Jan",
        kegiatan: "Hari Pertama Masuk Sekolah Semester Genap 2026/2027",
        kategori: "AKADEMIK",
        keterangan: "Apel pagi pembukaan semester genap dan sosialisasi target akademik.",
      },
      {
        tanggal: "11 - 23",
        bulanSingkat: "Jan",
        kegiatan: "Pendampingan PDSS & Pendaftaran Seleksi Prestasi SNBP Kelas XII",
        kategori: "AKADEMIK",
        keterangan: "Verifikasi nilai rapor siswa eligible Kelas XII untuk masuk PTN Negeri.",
      },
    ],
  },
  {
    bulan: "Februari 2027",
    semester: "GENAP",
    hariEfektif: 23,
    agenda: [
      {
        tanggal: "08 - 13",
        bulanSingkat: "Feb",
        kegiatan: "Seleksi Tingkat Sekolah Olimpiade OSN, O2SN & FLS2N",
        kategori: "KESISWAAN",
        keterangan: "Penjaringan kontingen terbaik SMAN 2 Buay Bahuga menuju tingkat Kabupaten Way Kanan.",
      },
      {
        tanggal: "22",
        bulanSingkat: "Feb",
        kegiatan: "Tasyakuran Hari Jadi SMAN 2 Buay Bahuga (SK 22 Februari 2008)",
        kategori: "KESISWAAN",
        keterangan: "Refleksi perjalanan pengabdian pendidikan SMAN 2 Buay Bahuga.",
      },
    ],
  },
  {
    bulan: "Maret 2027",
    semester: "GENAP",
    hariEfektif: 20,
    agenda: [
      {
        tanggal: "01 - 06",
        bulanSingkat: "Mar",
        kegiatan: "Penilaian Tengah Semester (PTS) Genap Kelas X & XI",
        kategori: "UJIAN",
        keterangan: "Evaluasi formatif tengah semester genap.",
      },
      {
        tanggal: "15 - 23",
        bulanSingkat: "Mar",
        kegiatan: "Ujian Sekolah (US) Utama & Praktik Akhir Kelas XII",
        kategori: "UJIAN",
        keterangan: "Ujian kelulusan akhir satuan pendidikan bagi seluruh siswa Kelas XII.",
      },
    ],
  },
  {
    bulan: "April - Juni 2027",
    semester: "GENAP",
    hariEfektif: 52,
    agenda: [
      {
        tanggal: "Mei",
        bulanSingkat: "2027",
        kegiatan: "Pengumuman Kelulusan Kelas XII & Seleksi PPDB Siswa Baru",
        kategori: "AKADEMIK",
        keterangan: "Rapat pleno kelulusan Kelas XII serta pembukaan PPDB Tahun Ajaran baru.",
      },
      {
        tanggal: "01 - 10",
        bulanSingkat: "Jun",
        kegiatan: "Penilaian Akhir Tahun (PAT) / Kenaikan Kelas X & XI",
        kategori: "UJIAN",
        keterangan: "Asesmen sumatif kenaikan tingkat Kelas X ke XI dan Kelas XI ke XII.",
      },
      {
        tanggal: "18 - 30",
        bulanSingkat: "Jun",
        kegiatan: "Pembagian Rapor Kenaikan Kelas & Libur Akhir Tahun Pelajaran",
        kategori: "LIBUR",
        keterangan: "Penutupan tahun pelajaran 2026/2027 dan libur kenaikan kelas.",
      },
    ],
  },
];

const DAFTAR_KELAS_INFO: Record<
  string,
  {
    namaKelas: string;
    waliKelas: string;
    ruangHomebase: string;
    jumlahSiswa: number;
    peminatan: string;
    jadwal: JadwalHariKelas[];
  }
> = {
  "XII MIPA 1": {
    namaKelas: "Kelas XII MIPA 1",
    waliKelas: "Tumijo, S.Pd.",
    ruangHomebase: "Gedung A - Ruang R.12 MIPA 1",
    jumlahSiswa: 34,
    peminatan: "Matematika & Ilmu Pengetahuan Alam",
    jadwal: [
      {
        hari: "Senin",
        totalJp: "8 Jam Pelajaran",
        slots: [
          { jamKe: "0", waktu: "07:15 - 08:00", mapel: "Upacara Bendera & Pembinaan Karakter", guru: "Seluruh Dewan Guru", ruang: "Lapangan Utama", tipe: "KHUSUS" },
          { jamKe: "1 - 2", waktu: "08:00 - 09:30", mapel: "Biologi & Praktikum IPA", guru: "Tumijo, S.Pd.", ruang: "Lab Biologi / R.12 MIPA 1", tipe: "KBM" },
          { jamKe: "3 - 4", waktu: "09:30 - 11:00", mapel: "Matematika Tingkat Lanjut", guru: "Marsono, S.Pd.", ruang: "R.12 MIPA 1", tipe: "KBM" },
          { jamKe: "-", waktu: "11:00 - 11:30", mapel: "Istirahat & Sholat Dhuha / Literasi", guru: "-", ruang: "Area Sekolah", tipe: "ISTIRAHAT" },
          { jamKe: "5 - 6", waktu: "11:30 - 13:00", mapel: "Bahasa dan Sastra Indonesia", guru: "Marlita Illiansyah, S.Pd.", ruang: "R.12 MIPA 1", tipe: "KBM" },
          { jamKe: "7 - 8", waktu: "13:30 - 15:00", mapel: "Pendidikan Agama Islam & Budi Pekerti", guru: "Mamad Fhadoli, S.Pd.I.", ruang: "R.12 MIPA 1", tipe: "KBM" },
        ],
      },
      {
        hari: "Selasa",
        totalJp: "8 Jam Pelajaran",
        slots: [
          { jamKe: "1 - 2", waktu: "07:15 - 08:45", mapel: "Fisika & Sains Terapan", guru: "Wida Awanda, S.Pd.Si.", ruang: "Lab Fisika / R.12 MIPA 1", tipe: "KBM" },
          { jamKe: "3 - 4", waktu: "08:45 - 10:15", mapel: "Kimia Organik & Analitik", guru: "Apriyani, S.Si., M.M.Pd.", ruang: "Lab Kimia", tipe: "KBM" },
          { jamKe: "-", waktu: "10:15 - 10:45", mapel: "Istirahat Pagi", guru: "-", ruang: "Area Sekolah", tipe: "ISTIRAHAT" },
          { jamKe: "5 - 6", waktu: "10:45 - 12:15", mapel: "Matematika Umum (Wajib)", guru: "Marsono, S.Pd.", ruang: "R.12 MIPA 1", tipe: "KBM" },
          { jamKe: "7 - 8", waktu: "13:00 - 14:30", mapel: "Bahasa Inggris Akademik", guru: "Tim Rumpun Bahasa", ruang: "Lab Bahasa", tipe: "KBM" },
        ],
      },
      {
        hari: "Rabu",
        totalJp: "8 Jam Pelajaran",
        slots: [
          { jamKe: "1 - 2", waktu: "07:15 - 08:45", mapel: "Biologi Sel & Genetika Lanjut", guru: "Tumijo, S.Pd.", ruang: "Lab Biologi", tipe: "KBM" },
          { jamKe: "3 - 4", waktu: "08:45 - 10:15", mapel: "Pendidikan Pancasila & Kewarganegaraan", guru: "Tim Rumpun Sosial", ruang: "R.12 MIPA 1", tipe: "KBM" },
          { jamKe: "-", waktu: "10:15 - 10:45", mapel: "Istirahat Pagi", guru: "-", ruang: "Area Sekolah", tipe: "ISTIRAHAT" },
          { jamKe: "5 - 6", waktu: "10:45 - 12:15", mapel: "Informatika & Literasi Digital", guru: "Tim Lab Komputer", ruang: "Lab Komputer CBT 1", tipe: "KBM" },
          { jamKe: "7 - 8", waktu: "13:00 - 14:30", mapel: "Sejarah Indonesia", guru: "Tim Rumpun Sejarah", ruang: "R.12 MIPA 1", tipe: "KBM" },
        ],
      },
      {
        hari: "Kamis",
        totalJp: "8 Jam Pelajaran",
        slots: [
          { jamKe: "1 - 2", waktu: "07:15 - 08:45", mapel: "Fisika Elektromagnetik & Modern", guru: "Wida Awanda, S.Pd.Si.", ruang: "R.12 MIPA 1", tipe: "KBM" },
          { jamKe: "3 - 4", waktu: "08:45 - 10:15", mapel: "Prakarya & Kewirausahaan", guru: "Meiliana, S.Pd.", ruang: "R.12 MIPA 1", tipe: "KBM" },
          { jamKe: "-", waktu: "10:15 - 10:45", mapel: "Istirahat Pagi", guru: "-", ruang: "Area Sekolah", tipe: "ISTIRAHAT" },
          { jamKe: "5 - 6", waktu: "10:45 - 12:15", mapel: "Seni Budaya & Kriya Lampung", guru: "Marlita Illiansyah, S.Pd.", ruang: "Ruang Seni Kriya", tipe: "KBM" },
          { jamKe: "7 - 8", waktu: "13:00 - 14:30", mapel: "Projek Penguatan Profil Pelajar Pancasila (P5)", guru: "Tumijo, S.Pd.", ruang: "R.12 MIPA 1", tipe: "KBM" },
        ],
      },
      {
        hari: "Jumat",
        totalJp: "5 Jam Pelajaran",
        slots: [
          { jamKe: "0", waktu: "07:15 - 08:00", mapel: "Jumat Rohani / Senam Bersama & Gerakan ASRI", guru: "Mamad Fhadoli, S.Pd.I.", ruang: "Lapangan & Musholla", tipe: "KHUSUS" },
          { jamKe: "1 - 2", waktu: "08:00 - 09:30", mapel: "Pendidikan Jasmani, Olahraga & Kesehatan", guru: "Tim Olahraga Sekolah", ruang: "Lapangan Olahraga", tipe: "KBM" },
          { jamKe: "3 - 4", waktu: "09:45 - 11:15", mapel: "Bimbingan Konseling (BK) & Persiapan SNBP/SNBT", guru: "Koordinator BK & Wali Kelas", ruang: "R.12 MIPA 1", tipe: "KBM" },
        ],
      },
    ],
  },
  "XII MIPA 2": {
    namaKelas: "Kelas XII MIPA 2",
    waliKelas: "Wida Awanda, S.Pd.Si.",
    ruangHomebase: "Gedung A - Ruang R.12 MIPA 2",
    jumlahSiswa: 34,
    peminatan: "Matematika & Ilmu Pengetahuan Alam",
    jadwal: [
      {
        hari: "Senin",
        totalJp: "8 Jam Pelajaran",
        slots: [
          { jamKe: "0", waktu: "07:15 - 08:00", mapel: "Upacara Bendera & Pembinaan Karakter", guru: "Seluruh Dewan Guru", ruang: "Lapangan Utama", tipe: "KHUSUS" },
          { jamKe: "1 - 2", waktu: "08:00 - 09:30", mapel: "Fisika & Sains Terapan", guru: "Wida Awanda, S.Pd.Si.", ruang: "Lab Fisika", tipe: "KBM" },
          { jamKe: "3 - 4", waktu: "09:30 - 11:00", mapel: "Biologi & Praktikum IPA", guru: "Tumijo, S.Pd.", ruang: "Lab Biologi", tipe: "KBM" },
          { jamKe: "-", waktu: "11:00 - 11:30", mapel: "Istirahat Pagi", guru: "-", ruang: "Area Sekolah", tipe: "ISTIRAHAT" },
          { jamKe: "5 - 6", waktu: "11:30 - 13:00", mapel: "Matematika Tingkat Lanjut", guru: "Marsono, S.Pd.", ruang: "R.12 MIPA 2", tipe: "KBM" },
          { jamKe: "7 - 8", waktu: "13:30 - 15:00", mapel: "Bahasa dan Sastra Indonesia", guru: "Marlita Illiansyah, S.Pd.", ruang: "R.12 MIPA 2", tipe: "KBM" },
        ],
      },
      {
        hari: "Selasa",
        totalJp: "8 Jam Pelajaran",
        slots: [
          { jamKe: "1 - 2", waktu: "07:15 - 08:45", mapel: "Matematika Umum (Wajib)", guru: "Marsono, S.Pd.", ruang: "R.12 MIPA 2", tipe: "KBM" },
          { jamKe: "3 - 4", waktu: "08:45 - 10:15", mapel: "Pendidikan Agama Islam & Budi Pekerti", guru: "Mamad Fhadoli, S.Pd.I.", ruang: "R.12 MIPA 2", tipe: "KBM" },
          { jamKe: "-", waktu: "10:15 - 10:45", mapel: "Istirahat Pagi", guru: "-", ruang: "Area Sekolah", tipe: "ISTIRAHAT" },
          { jamKe: "5 - 6", waktu: "10:45 - 12:15", mapel: "Kimia Organik & Analitik", guru: "Apriyani, S.Si., M.M.Pd.", ruang: "Lab Kimia", tipe: "KBM" },
          { jamKe: "7 - 8", waktu: "13:00 - 14:30", mapel: "Prakarya & Kewirausahaan", guru: "Meiliana, S.Pd.", ruang: "R.12 MIPA 2", tipe: "KBM" },
        ],
      },
      {
        hari: "Rabu",
        totalJp: "8 Jam Pelajaran",
        slots: [
          { jamKe: "1 - 2", waktu: "07:15 - 08:45", mapel: "Bahasa Inggris Akademik", guru: "Tim Rumpun Bahasa", ruang: "Lab Bahasa", tipe: "KBM" },
          { jamKe: "3 - 4", waktu: "08:45 - 10:15", mapel: "Fisika Elektromagnetik", guru: "Wida Awanda, S.Pd.Si.", ruang: "R.12 MIPA 2", tipe: "KBM" },
          { jamKe: "-", waktu: "10:15 - 10:45", mapel: "Istirahat Pagi", guru: "-", ruang: "Area Sekolah", tipe: "ISTIRAHAT" },
          { jamKe: "5 - 6", waktu: "10:45 - 12:15", mapel: "Biologi Genetika", guru: "Tumijo, S.Pd.", ruang: "R.12 MIPA 2", tipe: "KBM" },
          { jamKe: "7 - 8", waktu: "13:00 - 14:30", mapel: "Informatika & Komputer", guru: "Tim Lab Komputer", ruang: "Lab Komputer CBT 2", tipe: "KBM" },
        ],
      },
      {
        hari: "Kamis",
        totalJp: "8 Jam Pelajaran",
        slots: [
          { jamKe: "1 - 2", waktu: "07:15 - 08:45", mapel: "Sejarah Indonesia", guru: "Tim Rumpun Sejarah", ruang: "R.12 MIPA 2", tipe: "KBM" },
          { jamKe: "3 - 4", waktu: "08:45 - 10:15", mapel: "Seni Budaya & Kriya Lampung", guru: "Marlita Illiansyah, S.Pd.", ruang: "Ruang Seni Kriya", tipe: "KBM" },
          { jamKe: "-", waktu: "10:15 - 10:45", mapel: "Istirahat Pagi", guru: "-", ruang: "Area Sekolah", tipe: "ISTIRAHAT" },
          { jamKe: "5 - 8", waktu: "10:45 - 14:30", mapel: "Projek Penguatan Profil Pelajar Pancasila (P5)", guru: "Wida Awanda, S.Pd.Si.", ruang: "R.12 MIPA 2", tipe: "KBM" },
        ],
      },
      {
        hari: "Jumat",
        totalJp: "5 Jam Pelajaran",
        slots: [
          { jamKe: "0", waktu: "07:15 - 08:00", mapel: "Jumat Rohani & Gerakan Sekolah ASRI", guru: "Mamad Fhadoli, S.Pd.I.", ruang: "Lapangan Utama", tipe: "KHUSUS" },
          { jamKe: "1 - 3", waktu: "08:00 - 10:15", mapel: "Pendidikan Jasmani, Olahraga & Kesehatan", guru: "Tim Olahraga Sekolah", ruang: "Lapangan Olahraga", tipe: "KBM" },
          { jamKe: "4 - 5", waktu: "10:15 - 11:30", mapel: "Bimbingan Konseling Karir PTN", guru: "Wida Awanda, S.Pd.Si.", ruang: "R.12 MIPA 2", tipe: "KBM" },
        ],
      },
    ],
  },
  "XII IPS 1": {
    namaKelas: "Kelas XII IPS 1",
    waliKelas: "Eva Dwi Kurniawati, S.Pd.",
    ruangHomebase: "Gedung B - Ruang R.12 IPS 1",
    jumlahSiswa: 35,
    peminatan: "Ilmu Pengetahuan Sosial & Ekonomi",
    jadwal: [
      {
        hari: "Senin",
        totalJp: "8 Jam Pelajaran",
        slots: [
          { jamKe: "0", waktu: "07:15 - 08:00", mapel: "Upacara Bendera & Pembinaan Karakter", guru: "Seluruh Dewan Guru", ruang: "Lapangan Utama", tipe: "KHUSUS" },
          { jamKe: "1 - 2", waktu: "08:00 - 09:30", mapel: "Geografi & Pemetaan Wilayah", guru: "Eva Dwi Kurniawati, S.Pd.", ruang: "R.12 IPS 1", tipe: "KBM" },
          { jamKe: "3 - 4", waktu: "09:30 - 11:00", mapel: "Ekonomi Makro & Akuntansi", guru: "Meiliana, S.Pd.", ruang: "R.12 IPS 1", tipe: "KBM" },
          { jamKe: "-", waktu: "11:00 - 11:30", mapel: "Istirahat Pagi", guru: "-", ruang: "Area Sekolah", tipe: "ISTIRAHAT" },
          { jamKe: "5 - 6", waktu: "11:30 - 13:00", mapel: "Bahasa dan Sastra Indonesia", guru: "Marlita Illiansyah, S.Pd.", ruang: "R.12 IPS 1", tipe: "KBM" },
          { jamKe: "7 - 8", waktu: "13:30 - 15:00", mapel: "Matematika Umum", guru: "Marsono, S.Pd.", ruang: "R.12 IPS 1", tipe: "KBM" },
        ],
      },
      {
        hari: "Selasa",
        totalJp: "8 Jam Pelajaran",
        slots: [
          { jamKe: "1 - 2", waktu: "07:15 - 08:45", mapel: "Sosiologi Masyarakat & Pembangunan", guru: "Tim Rumpun Sosial", ruang: "R.12 IPS 1", tipe: "KBM" },
          { jamKe: "3 - 4", waktu: "08:45 - 10:15", mapel: "Sejarah Peminatan & Dunia", guru: "Tim Rumpun Sejarah", ruang: "R.12 IPS 1", tipe: "KBM" },
          { jamKe: "-", waktu: "10:15 - 10:45", mapel: "Istirahat Pagi", guru: "-", ruang: "Area Sekolah", tipe: "ISTIRAHAT" },
          { jamKe: "5 - 6", waktu: "10:45 - 12:15", mapel: "Pendidikan Agama Islam & Budi Pekerti", guru: "Mamad Fhadoli, S.Pd.I.", ruang: "R.12 IPS 1", tipe: "KBM" },
          { jamKe: "7 - 8", waktu: "13:00 - 14:30", mapel: "Geografi Sistem Informasi Geografis (SIG)", guru: "Eva Dwi Kurniawati, S.Pd.", ruang: "Lab Multimedia", tipe: "KBM" },
        ],
      },
      {
        hari: "Rabu",
        totalJp: "8 Jam Pelajaran",
        slots: [
          { jamKe: "1 - 2", waktu: "07:15 - 08:45", mapel: "Ekonomi & Kewirausahaan Terapan", guru: "Meiliana, S.Pd.", ruang: "R.12 IPS 1", tipe: "KBM" },
          { jamKe: "3 - 4", waktu: "08:45 - 10:15", mapel: "Bahasa Inggris Komunikasi", guru: "Tim Rumpun Bahasa", ruang: "Lab Bahasa", tipe: "KBM" },
          { jamKe: "-", waktu: "10:15 - 10:45", mapel: "Istirahat Pagi", guru: "-", ruang: "Area Sekolah", tipe: "ISTIRAHAT" },
          { jamKe: "5 - 6", waktu: "10:45 - 12:15", mapel: "Pendidikan Pancasila & Kewarganegaraan", guru: "Tim Rumpun Sosial", ruang: "R.12 IPS 1", tipe: "KBM" },
          { jamKe: "7 - 8", waktu: "13:00 - 14:30", mapel: "Seni Budaya & Kriya Lampung", guru: "Marlita Illiansyah, S.Pd.", ruang: "Ruang Seni Kriya", tipe: "KBM" },
        ],
      },
      {
        hari: "Kamis",
        totalJp: "8 Jam Pelajaran",
        slots: [
          { jamKe: "1 - 2", waktu: "07:15 - 08:45", mapel: "Informatika & Pengolahan Data", guru: "Tim Lab Komputer", ruang: "Lab Komputer CBT 1", tipe: "KBM" },
          { jamKe: "3 - 4", waktu: "08:45 - 10:15", mapel: "Bahasa dan Sastra Indonesia", guru: "Marlita Illiansyah, S.Pd.", ruang: "R.12 IPS 1", tipe: "KBM" },
          { jamKe: "-", waktu: "10:15 - 10:45", mapel: "Istirahat Pagi", guru: "-", ruang: "Area Sekolah", tipe: "ISTIRAHAT" },
          { jamKe: "5 - 8", waktu: "10:45 - 14:30", mapel: "Projek Penguatan Profil Pelajar Pancasila (P5)", guru: "Eva Dwi Kurniawati, S.Pd.", ruang: "R.12 IPS 1", tipe: "KBM" },
        ],
      },
      {
        hari: "Jumat",
        totalJp: "5 Jam Pelajaran",
        slots: [
          { jamKe: "0", waktu: "07:15 - 08:00", mapel: "Jumat Rohani & Gerakan Sekolah ASRI", guru: "Mamad Fhadoli, S.Pd.I.", ruang: "Lapangan Utama", tipe: "KHUSUS" },
          { jamKe: "1 - 3", waktu: "08:00 - 10:15", mapel: "Pendidikan Jasmani, Olahraga & Kesehatan", guru: "Tim Olahraga Sekolah", ruang: "Lapangan Olahraga", tipe: "KBM" },
          { jamKe: "4 - 5", waktu: "10:15 - 11:30", mapel: "Bimbingan Konseling & Studi Lanjut", guru: "Eva Dwi Kurniawati, S.Pd.", ruang: "R.12 IPS 1", tipe: "KBM" },
        ],
      },
    ],
  },
  "XI MIPA 1": {
    namaKelas: "Kelas XI MIPA 1",
    waliKelas: "Marsono, S.Pd.",
    ruangHomebase: "Gedung A - Ruang R.11 MIPA 1",
    jumlahSiswa: 34,
    peminatan: "Fase F - Sains & Matematika",
    jadwal: [
      {
        hari: "Senin",
        totalJp: "8 Jam Pelajaran",
        slots: [
          { jamKe: "0", waktu: "07:15 - 08:00", mapel: "Upacara Bendera & Pembinaan Karakter", guru: "Seluruh Dewan Guru", ruang: "Lapangan Utama", tipe: "KHUSUS" },
          { jamKe: "1 - 2", waktu: "08:00 - 09:30", mapel: "Matematika Tingkat Lanjut", guru: "Marsono, S.Pd.", ruang: "R.11 MIPA 1", tipe: "KBM" },
          { jamKe: "3 - 4", waktu: "09:30 - 11:00", mapel: "Fisika Mekanika & Termodinamika", guru: "Wida Awanda, S.Pd.Si.", ruang: "Lab Fisika", tipe: "KBM" },
          { jamKe: "-", waktu: "11:00 - 11:30", mapel: "Istirahat Pagi", guru: "-", ruang: "Area Sekolah", tipe: "ISTIRAHAT" },
          { jamKe: "5 - 6", waktu: "11:30 - 13:00", mapel: "Biologi Struktur & Fungsi Jaringan", guru: "Tumijo, S.Pd.", ruang: "Lab Biologi", tipe: "KBM" },
          { jamKe: "7 - 8", waktu: "13:30 - 15:00", mapel: "Bahasa Indonesia", guru: "Marlita Illiansyah, S.Pd.", ruang: "R.11 MIPA 1", tipe: "KBM" },
        ],
      },
      {
        hari: "Selasa",
        totalJp: "8 Jam Pelajaran",
        slots: [
          { jamKe: "1 - 2", waktu: "07:15 - 08:45", mapel: "Pendidikan Agama Islam & Budi Pekerti", guru: "Mamad Fhadoli, S.Pd.I.", ruang: "R.11 MIPA 1", tipe: "KBM" },
          { jamKe: "3 - 4", waktu: "08:45 - 10:15", mapel: "Informatika & Persiapan ANBK", guru: "Tim Lab Komputer", ruang: "Lab Komputer CBT 1", tipe: "KBM" },
          { jamKe: "-", waktu: "10:15 - 10:45", mapel: "Istirahat Pagi", guru: "-", ruang: "Area Sekolah", tipe: "ISTIRAHAT" },
          { jamKe: "5 - 8", waktu: "10:45 - 14:30", mapel: "Kimia & Praktikum Laboratorium", guru: "Apriyani, S.Si., M.M.Pd.", ruang: "Lab Kimia", tipe: "KBM" },
        ],
      },
    ],
  },
  "X MERDEKA 1": {
    namaKelas: "Kelas X Merdeka 1",
    waliKelas: "Marlita Illiansyah, S.Pd.",
    ruangHomebase: "Gedung C - Ruang R.10 Merdeka 1",
    jumlahSiswa: 34,
    peminatan: "Fase E - Kurikulum Merdeka Umum",
    jadwal: [
      {
        hari: "Senin",
        totalJp: "8 Jam Pelajaran",
        slots: [
          { jamKe: "0", waktu: "07:15 - 08:00", mapel: "Upacara Bendera & Pembinaan Karakter", guru: "Seluruh Dewan Guru", ruang: "Lapangan Utama", tipe: "KHUSUS" },
          { jamKe: "1 - 2", waktu: "08:00 - 09:30", mapel: "Bahasa dan Sastra Indonesia", guru: "Marlita Illiansyah, S.Pd.", ruang: "R.10 Merdeka 1", tipe: "KBM" },
          { jamKe: "3 - 4", waktu: "09:30 - 11:00", mapel: "IPA Terpadu (Biologi, Fisika, Kimia)", guru: "Tumijo, S.Pd. & Wida Awanda, S.Pd.Si.", ruang: "Lab IPA", tipe: "KBM" },
          { jamKe: "-", waktu: "11:00 - 11:30", mapel: "Istirahat Pagi", guru: "-", ruang: "Area Sekolah", tipe: "ISTIRAHAT" },
          { jamKe: "5 - 6", waktu: "11:30 - 13:00", mapel: "IPS Terpadu (Geografi & Ekonomi)", guru: "Eva Dwi Kurniawati, S.Pd. & Meiliana, S.Pd.", ruang: "R.10 Merdeka 1", tipe: "KBM" },
          { jamKe: "7 - 8", waktu: "13:30 - 15:00", mapel: "Matematika Fase E", guru: "Marsono, S.Pd.", ruang: "R.10 Merdeka 1", tipe: "KBM" },
        ],
      },
    ],
  },
};

const JADWAL_UJIAN_DATA: JadwalUjianRow[] = [
  {
    id: "uj-1",
    jenisUjian: "PAS_GANJIL",
    hariTanggal: "Senin, 1 Desember 2026",
    sesi: "Sesi 1",
    waktu: "07:30 - 09:30 WIB",
    mataPelajaran: "Pendidikan Agama Islam & Budi Pekerti",
    tingkat: "SEMUA",
    tingkatLabel: "Kelas X, XI, XII (Semua Rombel)",
    ruangModa: "R. Ujian 01 - 28 / CBT Terpadu",
    koordinator: "Mamad Fhadoli, S.Pd.I.",
  },
  {
    id: "uj-2",
    jenisUjian: "PAS_GANJIL",
    hariTanggal: "Senin, 1 Desember 2026",
    sesi: "Sesi 2",
    waktu: "10:00 - 12:00 WIB",
    mataPelajaran: "Bahasa dan Sastra Indonesia",
    tingkat: "SEMUA",
    tingkatLabel: "Kelas X, XI, XII (Semua Rombel)",
    ruangModa: "R. Ujian 01 - 28 / CBT Terpadu",
    koordinator: "Marlita Illiansyah, S.Pd.",
  },
  {
    id: "uj-3",
    jenisUjian: "PAS_GANJIL",
    hariTanggal: "Selasa, 2 Desember 2026",
    sesi: "Sesi 1",
    waktu: "07:30 - 09:30 WIB",
    mataPelajaran: "Matematika (Umum & Tingkat Lanjut)",
    tingkat: "SEMUA",
    tingkatLabel: "Kelas X, XI, XII (Semua Rombel)",
    ruangModa: "Lab Komputer CBT & R. Ujian",
    koordinator: "Marsono, S.Pd.",
  },
  {
    id: "uj-4",
    jenisUjian: "PAS_GANJIL",
    hariTanggal: "Selasa, 2 Desember 2026",
    sesi: "Sesi 2",
    waktu: "10:00 - 11:30 WIB",
    mataPelajaran: "Pendidikan Pancasila & Kewarganegaraan",
    tingkat: "SEMUA",
    tingkatLabel: "Kelas X, XI, XII (Semua Rombel)",
    ruangModa: "R. Ujian 01 - 28",
    koordinator: "Tim Rumpun Sosial",
  },
  {
    id: "uj-5",
    jenisUjian: "PAS_GANJIL",
    hariTanggal: "Rabu, 3 Desember 2026",
    sesi: "Sesi 1",
    waktu: "07:30 - 09:30 WIB",
    mataPelajaran: "Biologi & Praktikum IPA (Peminatan MIPA)",
    tingkat: "XII_MIPA",
    tingkatLabel: "Kelas XI & XII MIPA",
    ruangModa: "Lab Komputer CBT 1 - 2",
    koordinator: "Tumijo, S.Pd.",
  },
  {
    id: "uj-6",
    jenisUjian: "PAS_GANJIL",
    hariTanggal: "Rabu, 3 Desember 2026",
    sesi: "Sesi 1",
    waktu: "07:30 - 09:30 WIB",
    mataPelajaran: "Geografi & Kebumian (Peminatan IPS)",
    tingkat: "XII_IPS",
    tingkatLabel: "Kelas XI & XII IPS",
    ruangModa: "Lab Komputer CBT 3",
    koordinator: "Eva Dwi Kurniawati, S.Pd.",
  },
  {
    id: "uj-7",
    jenisUjian: "PAS_GANJIL",
    hariTanggal: "Kamis, 4 Desember 2026",
    sesi: "Sesi 1",
    waktu: "07:30 - 09:30 WIB",
    mataPelajaran: "Fisika & Sains Terapan (Peminatan MIPA)",
    tingkat: "XII_MIPA",
    tingkatLabel: "Kelas XI & XII MIPA",
    ruangModa: "Lab Komputer CBT 1 - 2",
    koordinator: "Wida Awanda, S.Pd.Si.",
  },
  {
    id: "uj-8",
    jenisUjian: "PAS_GANJIL",
    hariTanggal: "Kamis, 4 Desember 2026",
    sesi: "Sesi 1",
    waktu: "07:30 - 09:30 WIB",
    mataPelajaran: "Ekonomi & Akuntansi (Peminatan IPS)",
    tingkat: "XII_IPS",
    tingkatLabel: "Kelas XI & XII IPS",
    ruangModa: "Lab Komputer CBT 3",
    koordinator: "Meiliana, S.Pd.",
  },
  {
    id: "uj-9",
    jenisUjian: "PTS_GANJIL",
    hariTanggal: "Senin, 21 September 2026",
    sesi: "Sesi 1 & 2",
    waktu: "07:30 - 11:30 WIB",
    mataPelajaran: "Bahasa Indonesia & Pendidikan Agama",
    tingkat: "SEMUA",
    tingkatLabel: "Seluruh Tingkat X, XI, XII",
    ruangModa: "Ruang Kelas Masing-masing / CBT",
    koordinator: "Marsono, S.Pd.",
  },
  {
    id: "uj-10",
    jenisUjian: "PTS_GANJIL",
    hariTanggal: "Selasa, 22 September 2026",
    sesi: "Sesi 1 & 2",
    waktu: "07:30 - 11:30 WIB",
    mataPelajaran: "Matematika & Biologi / Geografi",
    tingkat: "SEMUA",
    tingkatLabel: "Seluruh Tingkat X, XI, XII",
    ruangModa: "Ruang Kelas Masing-masing / CBT",
    koordinator: "Tumijo, S.Pd.",
  },
  {
    id: "uj-11",
    jenisUjian: "UJIAN_SEKOLAH",
    hariTanggal: "Senin, 15 Maret 2027",
    sesi: "Sesi Utama",
    waktu: "07:30 - 12:00 WIB",
    mataPelajaran: "Ujian Sekolah: Bahasa Indonesia & Matematika",
    tingkat: "XII_MIPA",
    tingkatLabel: "Khusus Kelas XII (Calon Alumni)",
    ruangModa: "Lab Komputer CBT 1 - 3",
    koordinator: "Marsono, S.Pd.",
  },
  {
    id: "uj-12",
    jenisUjian: "UJIAN_SEKOLAH",
    hariTanggal: "Selasa, 16 Maret 2027",
    sesi: "Sesi Utama",
    waktu: "07:30 - 12:00 WIB",
    mataPelajaran: "Ujian Sekolah: Mata Pelajaran Pilihan (MIPA / IPS)",
    tingkat: "XII_IPS",
    tingkatLabel: "Khusus Kelas XII (Calon Alumni)",
    ruangModa: "Lab Komputer CBT 1 - 3",
    koordinator: "Tumijo, S.Pd. & Eva Dwi Kurniawati, S.Pd.",
  },
];

function AkademikContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab")?.toUpperCase() as AkademikTab) || "KALENDER";
  const [activeTab, setActiveTab] = useState<AkademikTab>(
    ["KALENDER", "JADWAL_PELAJARAN", "JADWAL_UJIAN"].includes(initialTab)
      ? initialTab
      : "KALENDER"
  );

  // State Filter Kalender Akademik
  const [filterSemester, setFilterSemester] = useState<"SEMUA" | "GANJIL" | "GENAP">("SEMUA");

  // State Filter Jadwal Pelajaran
  const [selectedKelas, setSelectedKelas] = useState<string>("XII MIPA 1");
  const [selectedHari, setSelectedHari] = useState<string>("SEMUA");
  const [searchJadwal, setSearchJadwal] = useState<string>("");

  // State Filter Jadwal Ujian
  const [selectedJenisUjian, setSelectedJenisUjian] = useState<"PAS_GANJIL" | "PTS_GANJIL" | "UJIAN_SEKOLAH">("PAS_GANJIL");
  const [selectedTingkatUjian, setSelectedTingkatUjian] = useState<string>("SEMUA");
  const [searchUjian, setSearchUjian] = useState<string>("");

  const tabs: { key: AkademikTab; label: string }[] = [
    { key: "KALENDER", label: "Kalender Akademik" },
    { key: "JADWAL_PELAJARAN", label: "Jadwal Pelajaran" },
    { key: "JADWAL_UJIAN", label: "Jadwal Ujian" },
  ];

  // Filter Kalender
  const filteredKalender = KALENDER_DATA.filter((b) =>
    filterSemester === "SEMUA" ? true : b.semester === filterSemester
  );

  // Filter Jadwal Pelajaran
  const currentKelasData = DAFTAR_KELAS_INFO[selectedKelas] || DAFTAR_KELAS_INFO["XII MIPA 1"];
  const filteredHariJadwal = currentKelasData.jadwal
    .filter((h) => (selectedHari === "SEMUA" ? true : h.hari === selectedHari))
    .map((h) => ({
      ...h,
      slots: h.slots.filter((s) => {
        if (!searchJadwal.trim()) return true;
        const q = searchJadwal.toLowerCase();
        return (
          s.mapel.toLowerCase().includes(q) ||
          s.guru.toLowerCase().includes(q) ||
          s.ruang.toLowerCase().includes(q)
        );
      }),
    }))
    .filter((h) => h.slots.length > 0);

  // Filter Jadwal Ujian
  const filteredJadwalUjian = JADWAL_UJIAN_DATA.filter((u) => {
    if (u.jenisUjian !== selectedJenisUjian) return false;
    if (selectedTingkatUjian !== "SEMUA" && u.tingkat !== "SEMUA" && u.tingkat !== selectedTingkatUjian) {
      return false;
    }
    if (searchUjian.trim()) {
      const q = searchUjian.toLowerCase();
      return (
        u.mataPelajaran.toLowerCase().includes(q) ||
        u.hariTanggal.toLowerCase().includes(q) ||
        u.koordinator.toLowerCase().includes(q) ||
        u.ruangModa.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getKategoriBadgeStyle = (kat: AgendaKalender["kategori"]) => {
    switch (kat) {
      case "AKADEMIK":
        return {
          box: "bg-blue-50 border-blue-200 text-[#2A2C5E]",
          badge: "bg-blue-100 text-[#2A2C5E]",
          label: "Kegiatan Akademik",
        };
      case "UJIAN":
        return {
          box: "bg-amber-50 border-amber-200 text-amber-800",
          badge: "bg-amber-100 text-amber-800",
          label: "Asesmen & Ujian",
        };
      case "LIBUR":
        return {
          box: "bg-rose-50 border-rose-200 text-rose-700",
          badge: "bg-rose-100 text-rose-700",
          label: "Libur Resmi",
        };
      case "KESISWAAN":
        return {
          box: "bg-emerald-50 border-emerald-200 text-emerald-800",
          badge: "bg-emerald-100 text-emerald-800",
          label: "Kesiswaan & Nasional",
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2A2C5E] text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Layanan Pendidikan & Kurikulum</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Struktur Akademik & Kurikulum Merdeka
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
          SMAN 2 Buay Bahuga menyelenggarakan Kurikulum Merdeka berorientasi kemandirian sains, jadwal pelajaran terstruktur untuk 29 rombongan belajar, kalender pendidikan bulanan, dan evaluasi ujian terpadu.
        </p>

        {/* Sub-Navigation Tabs: Rapi dan pas penuh di dalam kotak baik di Mobile maupun Desktop */}
        <div className="pt-1.5">
          <div className="flex flex-wrap sm:inline-flex items-center gap-1.5 sm:gap-2 p-1.5 bg-white rounded-xl border border-gray-200 shadow-2xs w-full sm:w-auto">
            {tabs.map((tab) => {
              const isSelected = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 sm:flex-initial text-center justify-center px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#2A2C5E] text-white shadow-xs"
                      : "bg-gray-100/90 text-gray-700 hover:bg-gray-200/80 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: KALENDER AKADEMIK (TAMPILAN KALENDER BULANAN TERSTRUKTUR)
         ===================================================================== */}
      {activeTab === "KALENDER" && (
        <section className="space-y-6">
          {/* Header & Filter Semester */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Kalender Pendidikan Tahun Ajaran 2026/2027
                </h2>
                <p className="text-xs text-gray-500">
                  Rincian tanggal kegiatan belajar mengajar, pekan ujian, dan hari libur resmi per bulan
                </p>
              </div>
            </div>

            {/* Filter Semester */}
            <div className="flex flex-wrap sm:inline-flex items-center gap-1.5 p-1 bg-white rounded-xl border border-gray-200 shadow-2xs">
              {[
                { key: "SEMUA", label: "Semua Semester" },
                { key: "GANJIL", label: "Semester Ganjil" },
                { key: "GENAP", label: "Semester Genap" },
              ].map((sem) => (
                <button
                  key={sem.key}
                  onClick={() => setFilterSemester(sem.key as "SEMUA" | "GANJIL" | "GENAP")}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    filterSemester === sem.key
                      ? "bg-[#2A2C5E] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {sem.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ringkasan Hari Efektif & Legenda Kategori */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs flex-1">
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block text-[11px]">Semester Ganjil</span>
                <span className="font-extrabold text-sm text-[#2A2C5E]">132 Hari Efektif</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block text-[11px]">Semester Genap</span>
                <span className="font-extrabold text-sm text-[#2A2C5E]">119 Hari Efektif</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block text-[11px]">Pekan Evaluasi / Ujian</span>
                <span className="font-extrabold text-sm text-amber-700">6 Pekan Terjadwal</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block text-[11px]">Rombongan Belajar</span>
                <span className="font-extrabold text-sm text-emerald-700">29 Rombel Aktif</span>
              </div>
            </div>

            {/* Legenda Warna */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-gray-600 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2A2C5E]" />
                Akademik & KBM
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Asesmen & Ujian
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Kesiswaan & PHBN
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Libur Resmi
              </span>
            </div>
          </div>

          {/* Grid Kalender Bulanan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredKalender.map((item) => (
              <div
                key={item.bulan}
                className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Header Bulan Gaya Kalender */}
                  <div className="bg-[#2A2C5E] text-white px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-200" />
                      <h3 className="text-sm sm:text-base font-extrabold tracking-wide">
                        {item.bulan}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold bg-white/15 text-blue-100 px-2.5 py-0.5 rounded-full">
                        {item.hariEfektif} Hari Efektif
                      </span>
                    </div>
                  </div>

                  {/* Daftar Tanggal Agenda di Bulan Tersebut */}
                  <div className="p-4 sm:p-5 divide-y divide-gray-100">
                    {item.agenda.map((ag, idx) => {
                      const st = getKategoriBadgeStyle(ag.kategori);
                      return (
                        <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3.5">
                          {/* Kotak Tanggal ala Kalender Meja */}
                          <div
                            className={`w-14 sm:w-16 shrink-0 rounded-lg border p-1.5 text-center flex flex-col justify-center ${st.box}`}
                          >
                            <span className="text-xs sm:text-sm font-extrabold leading-tight">
                              {ag.tanggal}
                            </span>
                            <span className="text-[10px] font-bold uppercase opacity-80">
                              {ag.bulanSingkat}
                            </span>
                          </div>

                          {/* Detail Kegiatan */}
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${st.badge}`}>
                                {st.label}
                              </span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                              {ag.kegiatan}
                            </h4>
                            <p className="text-[11px] text-gray-600 leading-relaxed">
                              {ag.keterangan}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gray-50 px-5 py-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Semester {item.semester === "GANJIL" ? "Ganjil" : "Genap"}</span>
                  <span className="font-medium text-[#2A2C5E]">Tahun Pelajaran 2026/2027</span>
                </div>
              </div>
            ))}
          </div>

          {/* Program Jurusan / Konsentrasi Kurikulum Merdeka */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Konsentrasi Program Peminatan</h2>
                <p className="text-xs text-gray-500">Fase E (Kelas X) & Fase F (Kelas XI - XII) Kurikulum Merdeka</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-2xs space-y-2.5">
                <span className="text-xs font-semibold text-[#2A2C5E] bg-blue-50 px-2.5 py-1 rounded inline-block">
                  Program Sains (MIPA)
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  Matematika dan Ilmu Pengetahuan Alam
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Fokus penguatan Biologi, Fisika, Kimia, dan Matematika Tingkat Lanjut didukung praktikum di 9 unit laboratorium sekolah untuk persiapan seleksi masuk PTN (SNBP/SNBT).
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-2xs space-y-2.5">
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded inline-block">
                  Program Sosial & Humaniora (IPS)
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  Ilmu Pengetahuan Sosial & Ekonomi
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Membangun kompetensi Geografi, Ekonomi & Kewirausahaan, Sosiologi, serta Sejarah untuk menyiapkan lulusan yang kritis, analitis, dan siap bersaing di perguruan tinggi maupun dunia usaha.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          TAB 2: JADWAL PELAJARAN (FILTER KELAS, HARI, CARI & TABEL PER HARI)
         ===================================================================== */}
      {activeTab === "JADWAL_PELAJARAN" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Jadwal Pelajaran Reguler Per Rombongan Belajar
              </h2>
              <p className="text-xs text-gray-500">
                Pilih kelas, filter hari, atau cari mata pelajaran dan nama guru pengampu
              </p>
            </div>
          </div>

          {/* Panel Filter Kelas, Filter Hari, dan Pencarian */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Dropdown Pilih Kelas */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#2A2C5E]" />
                  <span>Pilih Rombongan Belajar / Kelas</span>
                </label>
                <select
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-[#2A2C5E] bg-blue-50/50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E] cursor-pointer"
                >
                  <option value="XII MIPA 1">Kelas XII MIPA 1 (Wali: Tumijo, S.Pd.)</option>
                  <option value="XII MIPA 2">Kelas XII MIPA 2 (Wali: Wida Awanda, S.Pd.Si.)</option>
                  <option value="XII IPS 1">Kelas XII IPS 1 (Wali: Eva Dwi Kurniawati, S.Pd.)</option>
                  <option value="XI MIPA 1">Kelas XI MIPA 1 (Wali: Marsono, S.Pd.)</option>
                  <option value="X MERDEKA 1">Kelas X Merdeka 1 (Wali: Marlita Illiansyah, S.Pd.)</option>
                </select>
              </div>

              {/* Dropdown / Pilihan Hari */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2A2C5E]" />
                  <span>Filter Hari KBM</span>
                </label>
                <select
                  value={selectedHari}
                  onChange={(e) => setSelectedHari(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E] cursor-pointer"
                >
                  <option value="SEMUA">Semua Hari (Senin - Jumat)</option>
                  <option value="Senin">Hari Senin</option>
                  <option value="Selasa">Hari Selasa</option>
                  <option value="Rabu">Hari Rabu</option>
                  <option value="Kamis">Hari Kamis</option>
                  <option value="Jumat">Hari Jumat</option>
                </select>
              </div>

              {/* Input Cari Mapel / Guru */}
              <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-[#2A2C5E]" />
                  <span>Cari Mata Pelajaran / Nama Guru</span>
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchJadwal}
                    onChange={(e) => setSearchJadwal(e.target.value)}
                    placeholder="Ketik mapel (mis. Biologi) atau nama guru..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                  />
                </div>
              </div>
            </div>

            {/* Banner Info Kelas yang Sedang Ditampilkan */}
            <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="inline-flex items-center gap-1.5 font-extrabold text-white bg-[#2A2C5E] px-3 py-1 rounded-md">
                  <Layers className="w-3.5 h-3.5" />
                  {currentKelasData.namaKelas}
                </span>
                <span className="text-gray-600 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#2A2C5E]" />
                  Wali Kelas: <strong className="text-gray-900">{currentKelasData.waliKelas}</strong>
                </span>
                <span className="text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#2A2C5E]" />
                  Ruang: <strong className="text-gray-900">{currentKelasData.ruangHomebase}</strong>
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                {currentKelasData.jumlahSiswa} Peserta Didik &bull; {currentKelasData.peminatan}
              </span>
            </div>
          </div>

          {/* Daftar Tabel Jadwal Per Hari */}
          {filteredHariJadwal.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-xs text-gray-500">
              Tidak ditemukan jadwal mata pelajaran atau guru yang sesuai dengan kata kunci pencarian.
            </div>
          ) : (
            <div className="space-y-6">
              {filteredHariJadwal.map((hariItem) => (
                <div
                  key={hariItem.hari}
                  className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden"
                >
                  {/* Header Hari */}
                  <div className="bg-[#2A2C5E] text-white px-4 sm:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-200" />
                      <h3 className="text-sm sm:text-base font-extrabold">
                        Hari {hariItem.hari}
                      </h3>
                      <span className="text-xs text-blue-200 hidden sm:inline">
                        &mdash; {currentKelasData.namaKelas}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold bg-white/15 text-blue-100 px-2.5 py-0.5 rounded-full">
                      {hariItem.totalJp}
                    </span>
                  </div>

                  {/* Tabel Jadwal Pelajaran Hari Ini */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                          <th className="py-2.5 px-4 w-24">Jam Ke</th>
                          <th className="py-2.5 px-4 w-36">Waktu (WIB)</th>
                          <th className="py-2.5 px-4">Mata Pelajaran / Kegiatan</th>
                          <th className="py-2.5 px-4">Guru Pengampu</th>
                          <th className="py-2.5 px-4 w-44">Ruang / Lokasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs">
                        {hariItem.slots.map((slot, idx) => {
                          const isIstirahat = slot.tipe === "ISTIRAHAT";
                          const isKhusus = slot.tipe === "KHUSUS";
                          return (
                            <tr
                              key={idx}
                              className={
                                isIstirahat
                                  ? "bg-amber-50/60 text-amber-900"
                                  : isKhusus
                                  ? "bg-blue-50/40"
                                  : "hover:bg-gray-50/80 transition-colors"
                              }
                            >
                              <td className="py-3 px-4 font-bold text-[#2A2C5E] whitespace-nowrap">
                                {isIstirahat ? (
                                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                                    Jeda
                                  </span>
                                ) : (
                                  <span>Jam {slot.jamKe}</span>
                                )}
                              </td>
                              <td className="py-3 px-4 font-mono text-gray-600 whitespace-nowrap">
                                {slot.waktu} WIB
                              </td>
                              <td className="py-3 px-4 font-bold text-gray-900">
                                {slot.mapel}
                              </td>
                              <td className="py-3 px-4 text-gray-700 font-medium">
                                {slot.guru}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded">
                                  {slot.ruang}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          TAB 3: JADWAL UJIAN (FILTER JENIS UJIAN, TINGKAT, CARI & TABEL UJIAN)
         ===================================================================== */}
      {activeTab === "JADWAL_UJIAN" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2C5E] text-white flex items-center justify-center shrink-0">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Jadwal Resmi Pelaksanaan Ujian & Asesmen Sekolah
              </h2>
              <p className="text-xs text-gray-500">
                Tabel jadwal mata pelajaran ujian, sesi waktu, pembagian ruangan, dan koordinator pengawas
              </p>
            </div>
          </div>

          {/* Filter Jenis Ujian, Filter Tingkat Kelas, & Pencarian */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Pilih Jenis Ujian */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#2A2C5E]" />
                  <span>Pilih Periode / Jenis Ujian</span>
                </label>
                <select
                  value={selectedJenisUjian}
                  onChange={(e) =>
                    setSelectedJenisUjian(
                      e.target.value as "PAS_GANJIL" | "PTS_GANJIL" | "UJIAN_SEKOLAH"
                    )
                  }
                  className="w-full px-3 py-2 text-xs font-bold text-[#2A2C5E] bg-blue-50/50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E] cursor-pointer"
                >
                  <option value="PAS_GANJIL">Penilaian Akhir Semester (PAS) Ganjil 2026</option>
                  <option value="PTS_GANJIL">Penilaian Tengah Semester (PTS) Ganjil 2026</option>
                  <option value="UJIAN_SEKOLAH">Ujian Sekolah (US) Kelas XII Tahun 2027</option>
                </select>
              </div>

              {/* Filter Tingkat / Program */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#2A2C5E]" />
                  <span>Filter Tingkat / Peminatan</span>
                </label>
                <select
                  value={selectedTingkatUjian}
                  onChange={(e) => setSelectedTingkatUjian(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E] cursor-pointer"
                >
                  <option value="SEMUA">Semua Tingkat & Peminatan (983 Siswa)</option>
                  <option value="XII_MIPA">Peminatan MIPA (Sains)</option>
                  <option value="XII_IPS">Peminatan IPS (Sosial)</option>
                </select>
              </div>

              {/* Cari Mata Ujian */}
              <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-[#2A2C5E]" />
                  <span>Cari Mata Pelajaran Ujian / Hari</span>
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchUjian}
                    onChange={(e) => setSearchUjian(e.target.value)}
                    placeholder="Ketik mata ujian atau hari..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                  />
                </div>
              </div>
            </div>

            {/* Info Ringkas Pelaksanaan Ujian */}
            <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <Laptop className="w-4 h-4 text-[#2A2C5E] shrink-0" />
                <div>
                  <span className="text-[11px] text-gray-500 block">Moda Pelaksanaan</span>
                  <span className="font-bold text-gray-900">Computer Based Test (CBT) Terpadu</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-gray-500 block">Peserta Terdaftar</span>
                  <span className="font-bold text-gray-900">983 Siswa (29 Rombongan Belajar)</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <UserCheck className="w-4 h-4 text-[#2A2C5E] shrink-0" />
                <div>
                  <span className="text-[11px] text-gray-500 block">Ketua Panitia Akademik</span>
                  <span className="font-bold text-gray-900">Marsono, S.Pd. (Waka Kurikulum)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Jadwal Ujian */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="bg-[#2A2C5E] text-white px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-200" />
                <h3 className="text-sm sm:text-base font-extrabold">
                  {selectedJenisUjian === "PAS_GANJIL"
                    ? "Tabel Jadwal Penilaian Akhir Semester (PAS) Ganjil 2026/2027"
                    : selectedJenisUjian === "PTS_GANJIL"
                    ? "Tabel Jadwal Penilaian Tengah Semester (PTS) Ganjil 2026/2027"
                    : "Tabel Jadwal Ujian Sekolah (US) Tingkat Akhir Kelas XII 2027"}
                </h3>
              </div>
              <span className="text-[11px] font-semibold bg-white/15 text-blue-100 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                Status: Terjadwal Resmi
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Hari & Tanggal</th>
                    <th className="py-3 px-4">Sesi & Waktu</th>
                    <th className="py-3 px-4">Mata Pelajaran Ujian</th>
                    <th className="py-3 px-4">Peserta / Peminatan</th>
                    <th className="py-3 px-4">Ruang & Moda</th>
                    <th className="py-3 px-4">Koordinator Soal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredJadwalUjian.map((uj) => (
                    <tr key={uj.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">
                        {uj.hariTanggal}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-[#2A2C5E] block">{uj.sesi}</span>
                        <span className="font-mono text-[11px] text-gray-500">{uj.waktu}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {uj.mataPelajaran}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block text-[11px] font-semibold text-[#2A2C5E] bg-blue-50 px-2.5 py-0.5 rounded">
                          {uj.tingkatLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 whitespace-nowrap">
                        {uj.ruangModa}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 font-medium whitespace-nowrap">
                        {uj.koordinator}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tata Tertib Pelaksanaan Ujian Siswa */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-5 text-xs text-gray-700 space-y-2">
            <div className="flex items-center gap-2 text-[#2A2C5E] font-bold text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Tata Tertib & Ketentuan Pelaksanaan Ujian Siswa</span>
            </div>
            <p className="leading-relaxed">
              Peserta didik wajib hadir di lingkungan sekolah 15 menit sebelum sesi ujian dimulai, mengenakan seragam sekolah lengkap sesuai hari pelaksanaan, membawa Kartu Tanda Peserta Ujian, serta menjaga ketertiban dan kejujuran akademik selama proses evaluasi berlangsung.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

export default function AkademikPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-xs text-gray-400">Memuat data akademik...</div>}>
      <AkademikContent />
    </Suspense>
  );
}
