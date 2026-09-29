# 🏫 Portal Informasi & Sistem PPDB SMA Negeri 2 Buay Bahuga

Platform web resmi SMA Negeri 2 Buay Bahuga yang menggabungkan portal informasi publik (profil sekolah, visi-misi, direktori dewan guru, fasilitas) serta sistem digitalisasi Penerimaan Peserta Didik Baru (PPDB) yang terintegrasi secara otomatis dengan Supabase dan Google Sheets panitia.

## 🚀 Fitur Utama

- **Portal Informasi Publik**:
  - Hero Section interaktif dengan video profil sekolah via Cloudinary
  - Sambutan Kepala Sekolah & Visi Misi
  - Direktori Dewan Guru & Staf Tata Usaha
  - Galeri Fasilitas & Ekstrakurikuler
  - Desain modern bernuansa *Ice Blue*, mobile-friendly, dan cepat diakses

- **Modul PPDB Siswa Baru**:
  - Pendaftaran satu arah (*No login required*) dengan validasi dokumen ketat
  - Penomoran registrasi otomatis berformat unik
  - Fitur Cek Status Pendaftaran siswa berbasis NISN & Tanggal Lahir
  - Cetak Bukti Pendaftaran / Kartu Registrasi PDF

- **Integrasi Otomatis Google Sheets**:
  - Sinkronisasi data pendaftar baru secara langsung ke spreadsheet panitia
  - Pemisahan tab lembar kerja otomatis berdasarkan gelombang pendaftaran aktif
  - Mekanisme sinkronisasi ulang (*retry*) jika ada kendala koneksi

- **Dasbor Admin & Panitia PPDB**:
  - Autentikasi aman berbasis Supabase Auth
  - Manajemen Gelombang PPDB & saklar buka/tutup pendaftaran real-time
  - Verifikasi berkas pendaftar dan pemberian catatan validasi
  - Content Management System (CMS) data guru dan profil sekolah

## 🛠️ Tumpukan Teknologi

- **Framework**: Next.js 15+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security)
- **Media Management**: Cloudinary & Supabase Storage
- **External API**: Google Sheets API v4

## 📦 Memulai Pengembangan Lokal

1. Salin repositori ini:
   ```bash
   git clone https://github.com/dharmamudita/smanegeri2buaybahuga.git
   cd smanegeri2buaybahuga
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Konfigurasi Environment Variables (`.env.local`):
   Lihat panduan di `.env.example`

4. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.
