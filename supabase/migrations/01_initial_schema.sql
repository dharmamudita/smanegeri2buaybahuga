-- ==============================================================
-- DATABASE SCHEMA: SMA NEGERI 2 BUAY BAHUGA PORTAL & PPDB
-- ==============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE ppdb_status AS ENUM ('pending', 'verified', 'revision_needed', 'accepted', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ppdb_track AS ENUM ('zonasi', 'afirmasi', 'prestasi', 'mutasi', 'reguler');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PPDB PERIODS TABLE
CREATE TABLE IF NOT EXISTS ppdb_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    quota INT DEFAULT 150,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    announcement_date DATE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    registration_track ppdb_track DEFAULT 'zonasi',
    document_urls JSONB DEFAULT '{}'::jsonb, -- { "photo": "...", "kk": "...", "skl": "...", "akta": "...", "achievement": "..." }
    status ppdb_status DEFAULT 'pending',
    admin_notes TEXT,
    synced_to_sheets BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TEACHERS & STAFF DIRECTORY
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    nip VARCHAR(30),
    role_title VARCHAR(100) NOT NULL,
    subject VARCHAR(100),
    photo_url TEXT,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. SCHOOL PROFILES & CMS
CREATE TABLE IF NOT EXISTS school_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. ANNOUNCEMENTS & NEWS
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'pengumuman',
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_registrations_period ON registrations(period_id);
CREATE INDEX IF NOT EXISTS idx_registrations_nisn ON registrations(nisn);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_reg_number ON registrations(reg_number);
CREATE INDEX IF NOT EXISTS idx_teachers_order ON teachers(order_index);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE ppdb_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Public can read active periods, teachers, profiles, published announcements
CREATE POLICY "Public read active periods" ON ppdb_periods FOR SELECT USING (true);
CREATE POLICY "Public read active teachers" ON teachers FOR SELECT USING (is_active = true);
CREATE POLICY "Public read school profiles" ON school_profiles FOR SELECT USING (true);
CREATE POLICY "Public read published announcements" ON announcements FOR SELECT USING (is_published = true);

-- Public can insert registrations
CREATE POLICY "Public can submit registration" ON registrations FOR INSERT WITH CHECK (true);

-- Public can check own registration with reg_number or nisn
CREATE POLICY "Public can check registration status" ON registrations FOR SELECT USING (true);

-- Authenticated admin full access policies
CREATE POLICY "Admin full access ppdb_periods" ON ppdb_periods FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access registrations" ON registrations FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access teachers" ON teachers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access school_profiles" ON school_profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access announcements" ON announcements FOR ALL TO authenticated USING (true);

-- 10. INITIAL SEED DATA
INSERT INTO ppdb_periods (title, academic_year, quota, start_date, end_date, is_active, announcement_date, description)
VALUES (
    'PPDB 2027/2028 - Gelombang 1',
    '2027/2028',
    180,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    true,
    CURRENT_DATE + INTERVAL '35 days',
    'Penerimaan Peserta Didik Baru SMA Negeri 2 Buay Bahuga Jalur Zonasi, Afirmasi, Prestasi, dan Reguler Tahun Ajaran 2027/2028.'
) ON CONFLICT DO NOTHING;

INSERT INTO school_profiles (section_key, title, content, metadata) VALUES
(
    'principal_greeting',
    'Sambutan Kepala Sekolah',
    'Selamat datang di website resmi SMA Negeri 2 Buay Bahuga. Platform ini kami dedikasikan sebagai jembatan informasi transparan dan akuntabel antara sekolah, orang tua, dan masyarakat luas.',
    '{"principal_name": "Apriyani, S.Si., M.M.Pd.", "role": "Kepala SMAN 2 Buay Bahuga"}'::jsonb
),
(
    'vision_mission',
    'Visi dan Misi Sekolah',
    'Visi: Terwujudnya insan yang beriman, berakhlak mulia, unggul dalam prestasi, berwawasan lingkungan, dan berdaya saing global.',
    '{"misi": ["Meningkatkan keimanan dan ketakwaan terhadap Tuhan Yang Maha Esa", "Melaksanakan proses pembelajaran aktif, inovatif, dan berpusat pada murid", "Mengembangkan potensi bakat dan minat akademik maupun non-akademik siswa", "Mewujudkan lingkungan sekolah yang asri, bersih, dan berwawasan pelestarian lingkungan"]}'::jsonb
) ON CONFLICT DO NOTHING;

-- Seed Teachers
INSERT INTO teachers (full_name, nip, role_title, subject, order_index, is_active) VALUES
('Apriyani, S.Si., M.M.Pd.', '19780512 200501 2 008', 'Kepala Sekolah', 'Pimpinan Satuan Pendidikan', 1, true),
('Bambang Irawan, S.Pd., M.Pd.', '19820315 200801 1 012', 'Wakil Kepala Sekolah Bid. Kurikulum', 'Matematika Peminatan', 2, true),
('Siti Rahmawati, S.Pd.', '19840722 200902 2 005', 'Wakil Kepala Sekolah Bid. Kesiswaan', 'Bahasa Indonesia', 3, true),
('Ahmad Fauzi, S.Pd.', '19801105 200604 1 009', 'Wakil Kepala Sekolah Bid. Sarpras', 'Fisika & Teknologi Informasi', 4, true),
('Nurul Hidayah, S.Sos.', '19860918 201101 2 014', 'Wakil Kepala Sekolah Bid. Humas', 'Sosiologi', 5, true),
('Dedi Setiawan, S.Pd., Kons.', '19881203 201402 1 003', 'Guru Bimbingan Konseling (BK)', 'Layanan Konseling Siswa', 6, true),
('Dra. Endang Sulastri', '19750410 200003 2 004', 'Guru Mata Pelajaran', 'Biologi', 7, true),
('Hendri Saputra, S.Pd.', '19890214 201503 1 002', 'Guru Mata Pelajaran', 'Kimia', 8, true),
('Rina Kusuma Dewi, S.Pd.', '19910520 201902 2 008', 'Guru Mata Pelajaran', 'Bahasa Inggris', 9, true),
('Agus Pratama, S.Pd.', '19870830 201101 1 007', 'Guru Mata Pelajaran', 'Pendidikan Jasmani & Kesehatan (PJOK)', 10, true),
('Wahyudi, S.E.', '19850612 201001 1 015', 'Kepala Tata Usaha (KTU)', 'Administrasi & Kepegawaian', 11, true),
('Sri Mulyani, A.Md.', '19900815 201602 2 011', 'Staf Tata Usaha', 'Operator Dapodik & Kesiswaan', 12, true)
ON CONFLICT DO NOTHING;

-- Seed Announcements
INSERT INTO announcements (title, slug, content, category, is_published, published_at) VALUES
('Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2027/2028 Dibuka', 'ppdb-2027-2028-dibuka', 'SMA Negeri 2 Buay Bahuga membuka pendaftaran peserta didik baru melalui jalur Zonasi, Afirmasi, Prestasi, dan Mutasi. Seluruh calon siswa diharapkan mempersiapkan berkas digital NISN, NIK, Kartu Keluarga, dan Pas Foto untuk pendaftaran online terpadu.', 'ppdb', true, now()),
('Jadwal Asesmen Sumatif Akhir Semester Genap dan Pengayaan Pembelajaran', 'jadwal-asesmen-sumatif-genap', 'Diberitahukan kepada seluruh siswa kelas X, XI, dan XII bahwa pelaksanaan Asesmen Sumatif Genap berbasis digital akan dimulai sesuai kalender pendidikan. Harap memastikan kehadiran dan kesiapan perangkat pendukung.', 'akademik', true, now() - INTERVAL '2 days'),
('Gelar Karya Projek Penguatan Profil Pelajar Pancasila (P5) Bertema Kearifan Lokal', 'gelar-karya-p5-kearifan-lokal', 'Apresiasi karya inovasi dan kreasi budaya siswa SMA Negeri 2 Buay Bahuga dalam implementasi Kurikulum Merdeka. Kegiatan akan diisi dengan pameran kewirausahaan, seni budaya daerah Lampung, dan pertunjukan kreativitas.', 'prestasi', true, now() - INTERVAL '5 days'),
('Undangan Rapat Pleno Komite Sekolah Bersama Orang Tua/Wali Murid', 'rapat-pleno-komite-sekolah', 'Mengharap kehadiran Bapak/Ibu Orang Tua/Wali Murid dalam rapat pleno komite sekolah guna membahas evaluasi mutu pembelajaran, program pengembangan sarana prasarana sekolah, serta kemitraan pendidikan.', 'agenda', true, now() - INTERVAL '8 days')
ON CONFLICT DO NOTHING;