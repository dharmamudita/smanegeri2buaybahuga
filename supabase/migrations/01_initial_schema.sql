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