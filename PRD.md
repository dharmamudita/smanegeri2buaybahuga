# Product Requirements Document (PRD) v2.0
## Portal Informasi & Sistem PPDB Terintegrasi — SMA Negeri 2 Buay Bahuga

---

### 1. Ringkasan Eksekutif & Latar Belakang (Executive Summary)
* **Nama Produk**: Portal Informasi Publik & Sistem PPDB Terintegrasi SMA Negeri 2 Buay Bahuga
* **Klasifikasi**: Web Application (Portal Informasi Publik & Sistem Manajemen Penerimaan Peserta Didik Baru)
* **Sasaran Pengguna**: Calon Peserta Didik Baru, Orang Tua/Wali Siswa, Masyarakat Umum, dan Administrator/Panitia PPDB Sekolah.
* **Latar Belakang & Urgensi**:
  1. SMA Negeri 2 Buay Bahuga memerlukan platform representatif berbasis web untuk menyajikan profil sekolah, prestasi, fasilitas, dan direktori dewan guru secara transparan dan profesional.
  2. Proses penerimaan siswa baru konvensional menghadapi kendala jarak geografis pendaftar, risiko penumpukan berkas fisik, dan keharusan panitia mengetik ulang ratusan berkas pendaftar ke spreadsheet secara manual.
  3. Kebutuhan arsitektur pendaftaran yang inklusif: Calon siswa dapat mendaftar tanpa registrasi akun, namun tetap terverifikasi dengan nomor unik pendaftaran serta tersinkronisasi otomatis secara *real-time* ke Google Sheets panitia.

---

### 2. Tumpukan Teknologi (Tech Stack)

| Layer | Komponen Teknologi | Justifikasi Teknis |
| :--- | :--- | :--- |
| **Framework** | Next.js 15+ (App Router, React 19) | Server Components untuk kecepatan FCP & SEO maksimal, Server Actions untuk mutasi data aman, native API routes. |
| **Language** | TypeScript | Keamanan tipe (*type safety*), autocompletion, dan kemudahan pemeliharaan kode jangka panjang. |
| **Styling** | Tailwind CSS + Lucide Icons + Framer Motion | Desain kustom responsif (*mobile-first*), palet Ice Blue akademis, dan mikro-animasi elegan. |
| **Database & Auth** | Supabase (PostgreSQL + Supabase Auth) | Single Source of Truth, relasi database tangguh, Row Level Security (RLS), dan sesi aman admin. |
| **Media Hosting** | Cloudinary | CDN media teroptimasi untuk video profil sekolah serta foto guru/fasilitas. |
| **Document Storage** | Supabase Storage (Private Bucket) | Penyimpanan dokumen sensitif calon siswa (KK, Akta, SKL) dengan akses terbatas admin. |
| **External Integration** | Google Sheets API v4 (Service Account) | Otomatisasi duplikasi data pendaftar ke spreadsheet panitia per tab gelombang secara real-time. |
| **Bot Protection** | Cloudflare Turnstile | Proteksi anti-spam pada formulir pendaftaran publik tanpa friction tebak gambar. |
| **Version Control & CI/CD** | GitHub + Vercel Deployment | Tracking commit bertahap, automated build, dan hosting serverless dengan latensi rendah. |

---

### 3. Aktor & Hak Akses Pengguna

#### A. Pengguna Publik (Calon Siswa, Orang Tua, Masyarakat) — *Tanpa Login*
1. **Beranda (Home)**:
   - Hero section interaktif dengan video profil sekolah via Cloudinary & call-to-action (CTA) pendaftaran.
   - Sambutan Kepala Sekolah, ringkasan keunggulan, statistik sekolah, dan pengumuman terbaru.
2. **Tentang Sekolah**:
   - Sejarah berdirinya SMA Negeri 2 Buay Bahuga, visi, misi, dan struktur organisasi.
   - Galeri fasilitas akademik & ekstrakurikuler.
3. **Direktori Guru & Tenaga Kependidikan**:
   - Daftar foto, nama, NIP, serta mata pelajaran yang diampu.
4. **Formulir Pendaftaran PPDB**:
   - Terbuka otomatis hanya jika periode PPDB diaktifkan oleh admin.
   - Isian identitas diri, data orang tua/wali, pemilihan jalur pendaftaran, dan unggah berkas pindaian.
   - Validasi berkas maksimal 2MB (format JPG/PNG/PDF).
5. **Cek Status Pendaftaran**:
   - Calon siswa dapat mengecek progres verifikasi berkas dengan menginput **Nomor Pendaftaran** atau **NISN** dan **Tanggal Lahir**.
6. **Unduh / Cetak Bukti Pendaftaran**:
   - Menghasilkan bukti pendaftaran resmi ber-QR Code untuk keperluan lapor diri fisik di sekolah.

#### B. Administrator (Panitia PPDB & Pengelola Portal) — *Login Wajib*
1. **Autentikasi Terproteksi**: Login melalui rute privat `/admin/login` dengan enkripsi sesi Supabase Auth.
2. **Manajemen Gelombang PPDB**:
   - Toggle saklar buka/tutup pendaftaran publik secara instan.
   - Konfigurasi gelombang baru (Nama gelombang, tahun ajaran, kuota, tanggal pembukaan dan penutupan).
3. **Verifikasi Data Pendaftar**:
   - Tabel pendaftar dengan fitur pencarian instan (nama/NISN), filter status (`Pending`, `Terverifikasi`, `Perlu Revisi`, `Diterima`, `Ditolak`).
   - Modal tinjau berkas (preview pas foto, KK, SKL, akta) langsung di browser.
   - Form catatan verifikator untuk memberikan umpan balik perbaikan berkas.
4. **Sinkronisasi & Export**:
   - Pemantauan status sinkronisasi ke Google Sheets per baris siswa.
   - Tombol manual "Sync ke Google Sheets" untuk data yang tertunda karena kendala jaringan.
   - Export seluruh data ke format Excel (`.xlsx`) atau `.csv`.
5. **Content Management (CMS Profil & Guru)**:
   - Manajemen data guru dan staf tata usaha (tambah, perbarui foto/jabatan, nonaktifkan).
   - Pengaturan informasi sambutan, visi-misi, dan pengumuman sekolah.

---

### 4. Skema Basis Data (Database Schema)

```sql
-- 1. Tabel Periode PPDB
CREATE TABLE ppdb_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    quota INT DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel Pendaftar Siswa Baru
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id UUID REFERENCES ppdb_periods(id) ON DELETE RESTRICT,
    reg_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    nisn VARCHAR(10) NOT NULL,
    nik VARCHAR(16) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    birth_place VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    religion VARCHAR(50) NOT NULL,
    school_origin VARCHAR(255) NOT NULL,
    phone_number VARCHAR(25) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(25) NOT NULL,
    address TEXT NOT NULL,
    registration_track VARCHAR(50) NOT NULL, -- Zonasi, Afirmasi, Prestasi, Mutasi, Reguler
    document_urls JSONB DEFAULT '{}'::jsonb, -- photo, kk, skl, birth_cert, achievement
    status VARCHAR(30) DEFAULT 'pending', -- pending, verified, revision_needed, accepted, rejected
    admin_notes TEXT,
    synced_to_sheets BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel Direktori Guru & Tenaga Kependidikan
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    nip VARCHAR(30),
    role_title VARCHAR(100) NOT NULL, -- Kepala Sekolah, Guru Mata Pelajaran, Staf TU
    subject VARCHAR(100),
    photo_url TEXT,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabel Pengumuman & Berita Sekolah
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'pengumuman',
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT now()
);
```

---

### 5. Alur Integrasi Google Sheets (Otomatisasi Spreadsheet)

1. **Trigger**: Saat calon siswa menekan tombol "Kirim Pendaftaran" dan record berhasil disimpan ke tabel `registrations` di Supabase.
2. **Tab Routing**: Sistem Server Action Next.js membaca nama periode pendaftaran aktif (misal: "PPDB 2027-Gelombang 1").
   - Jika tab lembar kerja dengan nama tersebut belum ada, Google Sheets API otomatis membuat tab baru dan menulis *header* kolom.
3. **Data Ingestion**: Baris baru ditambahkan (*append row*) berisi:
   - Timestamp Pendaftaran, No. Registrasi, Jalur, Nama Lengkap, NISN, NIK, Jenis Kelamin, Asal Sekolah, No. WhatsApp, Nama Orang Tua, Kontak Orang Tua, dan Tautan Berkas.
4. **Flagging**: Kolom `synced_to_sheets` pada Supabase diubah menjadi `true`. Jika gagal (misal rate limit), flag bernilai `false` dan muncul peringatan di dashboard admin untuk sinkronisasi manual.

---

### 6. Desain Visual & UI/UX (Ice Blue Aesthetic)

* **Palet Warna**:
  - `Ice Blue Main`: `#0284C7` (Sky-600) & `#38BDF8` (Sky-400)
  - `Ice Glow Soft`: `#E0F2FE` (Sky-100) & `#F0F9FF` (Sky-50)
  - `Deep Navy Accent`: `#0F172A` (Slate-900) & `#1E293B` (Slate-800)
  - `Card Background`: White `#FFFFFF` dengan bayangan halus (*subtle elevation*) & border ice blue lembut.
* **Tipografi**:
  - Headings & Body: **Plus Jakarta Sans** (Google Fonts).
* **Interaktivitas**:
  - *Smooth transitions* saat navigasi antar section.
  - Kartu pendaftaran responsif dan ramah pengisian via layar ponsel (*mobile-first*).

---

### 7. Pengujian & Validasi Tugas Akhir

1. **Pengujian Black-Box**:
   - Pengujian validasi form pendaftaran (format NISN 10 digit, NIK 16 digit, ukuran berkas maksimal 2MB).
   - Pengujian proteksi halaman admin terhadap akses tanpa login.
   - Pengujian kondisi buka/tutup form pendaftaran sesuai toggle periode admin.
2. **Pengujian Integrasi**:
   - Uji sinkronisasi baris data ke Google Sheets API v4 saat multi-submission.
   - Uji cetak bukti pendaftaran PDF dan pemindaian QR Code.
3. **Evaluasi Kegunaan (Usability Testing)**:
   - Kuesioner *System Usability Scale* (SUS) kepada panitia PPDB dan perwakilan siswa.
