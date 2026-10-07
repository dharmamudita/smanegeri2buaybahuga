-- ==============================================================
-- MIGRATION 02: SYNC TEACHERS WITH REAL PHOTOS, STORAGE BUCKET & REALTIME
-- Jalankan query ini di Supabase Dashboard -> SQL Editor
-- ==============================================================

-- 1. AKTIFKAN SUPABASE REALTIME REPLICATION UNTUK SEMUA TABEL
-- Ini wajib agar perubahan di Admin langsung terupdate otomatis di website & dashboard tanpa reload
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE teachers;
  EXCEPTION WHEN duplicate_object THEN
    -- Abaikan jika sudah terdaftar
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE ppdb_periods;
  EXCEPTION WHEN duplicate_object THEN
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE registrations;
  EXCEPTION WHEN duplicate_object THEN
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
  EXCEPTION WHEN duplicate_object THEN
  END;
END $$;

-- 2. ATUR ROW LEVEL SECURITY (RLS) AGAR CRUD ADMIN BERFUNGSI SEMPURNA
DROP POLICY IF EXISTS "Public read active teachers" ON teachers;
DROP POLICY IF EXISTS "Admin full access teachers" ON teachers;
DROP POLICY IF EXISTS "Allow public read teachers" ON teachers;
DROP POLICY IF EXISTS "Allow admin crud teachers" ON teachers;

-- Kebijakan baca: Publik & Admin bisa membaca data guru
CREATE POLICY "Allow public read teachers" 
ON teachers FOR SELECT 
USING (true);

-- Kebijakan tulis: Admin dapat Tambah, Ubah, Hapus data guru
CREATE POLICY "Allow admin crud teachers" 
ON teachers FOR ALL 
USING (true) 
WITH CHECK (true);

-- 3. BERSIHKAN DATA LAMA & MASUKKAN 12 DEWAN GURU RESMI BESERTA FOTONYA
DELETE FROM teachers;

INSERT INTO teachers (full_name, nip, role_title, subject, photo_url, order_index, is_active) VALUES
('Apriyani, S.Si., M.M.Pd.', '19780512 200501 2 008', 'Kepala Sekolah', 'Pimpinan Satuan Pendidikan', '/guru/kepala_sekolah.jpg', 1, true),
('Bambang Irawan, S.Pd., M.Pd.', '19820315 200801 1 012', 'Wakil Kepala Sekolah Bid. Kurikulum', 'Matematika Peminatan', '/guru/bambang_irawan.jpg', 2, true),
('Siti Rahmawati, S.Pd.', '19840722 200902 2 005', 'Wakil Kepala Sekolah Bid. Kesiswaan', 'Bahasa Indonesia', '/guru/siti_rahmawati.jpg', 3, true),
('Ahmad Fauzi, S.Pd.', '19801105 200604 1 009', 'Wakil Kepala Sekolah Bid. Sarpras', 'Fisika & Teknologi Informasi', '/guru/ahmad_fauzi.jpg', 4, true),
('Nurul Hidayah, S.Sos.', '19860918 201101 2 014', 'Wakil Kepala Sekolah Bid. Humas', 'Sosiologi', '/guru/guru_wanita.jpg', 5, true),
('Dedi Setiawan, S.Pd., Kons.', '19881203 201402 1 003', 'Guru Bimbingan Konseling (BK)', 'Layanan Konseling Siswa', '/guru/guru_pria.jpg', 6, true),
('Dra. Endang Sulastri', '19750410 200003 2 004', 'Guru Mata Pelajaran', 'Biologi', '/guru/guru_wanita.jpg', 7, true),
('Hendri Saputra, S.Pd.', '19890214 201503 1 002', 'Guru Mata Pelajaran', 'Kimia', '/guru/guru_pria.jpg', 8, true),
('Rina Kusuma Dewi, S.Pd.', '19910520 201902 2 008', 'Guru Mata Pelajaran', 'Bahasa Inggris', '/guru/guru_wanita.jpg', 9, true),
('Agus Pratama, S.Pd.', '19870830 201101 1 007', 'Guru Mata Pelajaran', 'Pendidikan Jasmani & Kesehatan (PJOK)', '/guru/guru_pria.jpg', 10, true),
('Wahyudi, S.E.', '19850612 201001 1 015', 'Kepala Tata Usaha (KTU)', 'Administrasi & Kepegawaian', '/guru/guru_pria.jpg', 11, true),
('Sri Mulyani, A.Md.', '19900815 201602 2 011', 'Staf Tata Usaha', 'Operator Dapodik & Kesiswaan', '/guru/guru_wanita.jpg', 12, true);

-- 4. BUCKET STORAGE SUPABASE UNTUK UNGGAH FOTO GURU (CLOUD STORAGE)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can update photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete photos" ON storage.objects;

CREATE POLICY "Public can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
CREATE POLICY "Public can upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos');
CREATE POLICY "Public can update photos" ON storage.objects FOR UPDATE USING (bucket_id = 'photos');
CREATE POLICY "Public can delete photos" ON storage.objects FOR DELETE USING (bucket_id = 'photos');
