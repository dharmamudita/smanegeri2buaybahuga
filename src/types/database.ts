export type PPDBStatus = 'pending' | 'verified' | 'revision_needed' | 'accepted' | 'rejected';
export type PPDBTrack = 'zonasi' | 'afirmasi' | 'prestasi' | 'mutasi' | 'reguler';

export interface PPDBPeriod {
  id: string;
  title: string;
  academic_year: string;
  quota: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  announcement_date?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentUrls {
  photo?: string;
  kk?: string;
  skl?: string;
  birth_cert?: string;
  achievement?: string;
}

export interface Registration {
  id: string;
  period_id: string;
  reg_number: string;
  full_name: string;
  nisn: string;
  nik: string;
  gender: 'Laki-laki' | 'Perempuan';
  birth_place: string;
  birth_date: string;
  religion: string;
  school_origin: string;
  phone_number: string;
  parent_name: string;
  parent_phone: string;
  address: string;
  registration_track: PPDBTrack;
  document_urls: DocumentUrls;
  status: PPDBStatus;
  admin_notes?: string | null;
  synced_to_sheets: boolean;
  created_at: string;
  updated_at: string;
  period?: PPDBPeriod;
}

export interface Teacher {
  id: string;
  full_name: string;
  nip?: string | null;
  role_title: string;
  subject?: string | null;
  photo_url?: string | null;
  order_index: number;
  is_active: boolean;
  created_at?: string;
}

export interface SchoolProfile {
  id: string;
  section_key: string;
  title?: string | null;
  content: string;
  metadata?: Record<string, any>;
  updated_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: 'pengumuman' | 'berita' | 'prestasi';
  thumbnail_url?: string | null;
  is_published: boolean;
  published_at: string;
  created_at?: string;
}
