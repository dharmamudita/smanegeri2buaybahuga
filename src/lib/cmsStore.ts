import { create } from "zustand";
import {
  INITIAL_BERANDA_CMS,
  INITIAL_PROFIL_CMS,
  INITIAL_AKADEMIK_CMS,
  INITIAL_KESISWAAN_CMS,
} from "./cmsData";

// Helper untuk mengirim perubahan langsung ke basis data Supabase PostgreSQL
async function syncToSupabase(section: "beranda" | "profil" | "akademik" | "kesiswaan", data: any) {
  try {
    const res = await fetch("/api/cms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, data }),
    });
    if (!res.ok) {
      console.warn(`Sinkronisasi Supabase (${section}) merespons status:`, res.status);
    }
  } catch (err) {
    console.error(`Gagal sinkronisasi ke Supabase untuk bagian ${section}:`, err);
  }
}

export interface CMSState {
  isLoading: boolean;
  isSaving: boolean;
  isLoaded: boolean;
  lastSavedAt: string | null;

  // 1. Beranda
  beranda: typeof INITIAL_BERANDA_CMS;
  updateBerandaInfo: (data: Partial<typeof INITIAL_BERANDA_CMS>) => void;
  updateKepsek: (data: Partial<typeof INITIAL_BERANDA_CMS.kepsek>) => void;
  updateStatistik: (data: Partial<typeof INITIAL_BERANDA_CMS.statistik>) => void;
  addVideoPanduan: (video: (typeof INITIAL_BERANDA_CMS.videoPanduan)[0]) => void;
  updateVideoPanduan: (id: string, video: Partial<(typeof INITIAL_BERANDA_CMS.videoPanduan)[0]>) => void;
  deleteVideoPanduan: (id: string) => void;

  // 2. Profil
  profil: typeof INITIAL_PROFIL_CMS;
  updateProfilVisiMisi: (visi: string, misi: string[]) => void;
  addStrukturOrganisasi: (item: (typeof INITIAL_PROFIL_CMS.strukturOrganisasi)[0]) => void;
  updateStrukturOrganisasi: (id: string, item: Partial<(typeof INITIAL_PROFIL_CMS.strukturOrganisasi)[0]>) => void;
  deleteStrukturOrganisasi: (id: string) => void;
  addGuruStaff: (guru: (typeof INITIAL_PROFIL_CMS.guruStaff)[0]) => void;
  updateGuruStaff: (id: string, guru: Partial<(typeof INITIAL_PROFIL_CMS.guruStaff)[0]>) => void;
  deleteGuruStaff: (id: string) => void;

  // 3. Akademik
  akademik: typeof INITIAL_AKADEMIK_CMS;
  addAgendaKalender: (agenda: (typeof INITIAL_AKADEMIK_CMS.agendaList)[0]) => void;
  updateAgendaKalender: (id: string, agenda: Partial<(typeof INITIAL_AKADEMIK_CMS.agendaList)[0]>) => void;
  deleteAgendaKalender: (id: string) => void;
  addJadwalUjian: (ujian: (typeof INITIAL_AKADEMIK_CMS.jadwalUjianList)[0]) => void;
  updateJadwalUjian: (id: string, ujian: Partial<(typeof INITIAL_AKADEMIK_CMS.jadwalUjianList)[0]>) => void;
  deleteJadwalUjian: (id: string) => void;
  addSlotPelajaran: (slot: (typeof INITIAL_AKADEMIK_CMS.jadwalPelajaranList)[0]) => void;
  updateSlotPelajaran: (id: string, slot: Partial<(typeof INITIAL_AKADEMIK_CMS.jadwalPelajaranList)[0]>) => void;
  deleteSlotPelajaran: (id: string) => void;

  // 4. Kesiswaan
  kesiswaan: typeof INITIAL_KESISWAAN_CMS;
  addPrestasi: (prestasi: (typeof INITIAL_KESISWAAN_CMS.prestasiList)[0]) => void;
  updatePrestasi: (id: string, prestasi: Partial<(typeof INITIAL_KESISWAAN_CMS.prestasiList)[0]>) => void;
  deletePrestasi: (id: string) => void;
  updateOsis: (data: Partial<typeof INITIAL_KESISWAAN_CMS.osis>) => void;
  addEkskul: (ekskul: (typeof INITIAL_KESISWAAN_CMS.ekskulList)[0]) => void;
  updateEkskul: (id: string, ekskul: Partial<(typeof INITIAL_KESISWAAN_CMS.ekskulList)[0]>) => void;
  deleteEkskul: (id: string) => void;

  // Utility
  fetchFromSupabase: () => Promise<void>;
  resetAllToDefault: () => void;
}

export const useCMSStore = create<CMSState>((set, get) => ({
  isLoading: false,
  isSaving: false,
  isLoaded: false,
  lastSavedAt: null,

  beranda: INITIAL_BERANDA_CMS,
  profil: INITIAL_PROFIL_CMS,
  akademik: INITIAL_AKADEMIK_CMS,
  kesiswaan: INITIAL_KESISWAAN_CMS,

  // Fetch dari Supabase PostgreSQL (Tanpa Local Storage)
  fetchFromSupabase: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/cms");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          set({
            beranda: json.data.beranda || INITIAL_BERANDA_CMS,
            profil: json.data.profil || INITIAL_PROFIL_CMS,
            akademik: json.data.akademik || INITIAL_AKADEMIK_CMS,
            kesiswaan: json.data.kesiswaan || INITIAL_KESISWAAN_CMS,
            isLoaded: true,
          });
        }
      }
    } catch (err) {
      console.warn("Gagal memuat data awal dari Supabase:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  // --- 1. Beranda Actions (Langsung Simpan ke Supabase) ---
  updateBerandaInfo: (data) => {
    const updated = { ...get().beranda, ...data };
    set({ beranda: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("beranda", updated);
  },

  updateKepsek: (data) => {
    const updated = {
      ...get().beranda,
      kepsek: { ...get().beranda.kepsek, ...data },
    };
    set({ beranda: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("beranda", updated);
  },

  updateStatistik: (data) => {
    const updated = {
      ...get().beranda,
      statistik: { ...get().beranda.statistik, ...data },
    };
    set({ beranda: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("beranda", updated);
  },

  addVideoPanduan: (video) => {
    const updated = {
      ...get().beranda,
      videoPanduan: [video, ...get().beranda.videoPanduan],
    };
    set({ beranda: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("beranda", updated);
  },

  updateVideoPanduan: (id, video) => {
    const updated = {
      ...get().beranda,
      videoPanduan: get().beranda.videoPanduan.map((v) =>
        v.id === id ? { ...v, ...video } : v
      ),
    };
    set({ beranda: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("beranda", updated);
  },

  deleteVideoPanduan: (id) => {
    const updated = {
      ...get().beranda,
      videoPanduan: get().beranda.videoPanduan.filter((v) => v.id !== id),
    };
    set({ beranda: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("beranda", updated);
  },

  // --- 2. Profil Actions (Langsung Simpan ke Supabase) ---
  updateProfilVisiMisi: (visi, misi) => {
    const updated = { ...get().profil, visi, misi };
    set({ profil: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("profil", updated);
  },

  addStrukturOrganisasi: (item) => {
    const updated = {
      ...get().profil,
      strukturOrganisasi: [...get().profil.strukturOrganisasi, item],
    };
    set({ profil: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("profil", updated);
  },

  updateStrukturOrganisasi: (id, item) => {
    const updated = {
      ...get().profil,
      strukturOrganisasi: get().profil.strukturOrganisasi.map((s) =>
        s.id === id ? { ...s, ...item } : s
      ),
    };
    set({ profil: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("profil", updated);
  },

  deleteStrukturOrganisasi: (id) => {
    const updated = {
      ...get().profil,
      strukturOrganisasi: get().profil.strukturOrganisasi.filter((s) => s.id !== id),
    };
    set({ profil: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("profil", updated);
  },

  addGuruStaff: (guru) => {
    const updated = {
      ...get().profil,
      guruStaff: [...get().profil.guruStaff, guru],
    };
    set({ profil: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("profil", updated);
  },

  updateGuruStaff: (id, guru) => {
    const updated = {
      ...get().profil,
      guruStaff: get().profil.guruStaff.map((g) =>
        g.id === id ? { ...g, ...guru } : g
      ),
    };
    set({ profil: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("profil", updated);
  },

  deleteGuruStaff: (id) => {
    const updated = {
      ...get().profil,
      guruStaff: get().profil.guruStaff.filter((g) => g.id !== id),
    };
    set({ profil: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("profil", updated);
  },

  // --- 3. Akademik Actions (Langsung Simpan ke Supabase) ---
  addAgendaKalender: (agenda) => {
    const updated = {
      ...get().akademik,
      agendaList: [agenda, ...get().akademik.agendaList],
    };
    set({ akademik: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("akademik", updated);
  },

  updateAgendaKalender: (id, agenda) => {
    const updated = {
      ...get().akademik,
      agendaList: get().akademik.agendaList.map((a) =>
        a.id === id ? { ...a, ...agenda } : a
      ),
    };
    set({ akademik: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("akademik", updated);
  },

  deleteAgendaKalender: (id) => {
    const updated = {
      ...get().akademik,
      agendaList: get().akademik.agendaList.filter((a) => a.id !== id),
    };
    set({ akademik: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("akademik", updated);
  },

  addJadwalUjian: (ujian) => {
    const updated = {
      ...get().akademik,
      jadwalUjianList: [ujian, ...get().akademik.jadwalUjianList],
    };
    set({ akademik: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("akademik", updated);
  },

  updateJadwalUjian: (id, ujian) => {
    const updated = {
      ...get().akademik,
      jadwalUjianList: get().akademik.jadwalUjianList.map((u) =>
        u.id === id ? { ...u, ...ujian } : u
      ),
    };
    set({ akademik: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("akademik", updated);
  },

  deleteJadwalUjian: (id) => {
    const updated = {
      ...get().akademik,
      jadwalUjianList: get().akademik.jadwalUjianList.filter((u) => u.id !== id),
    };
    set({ akademik: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("akademik", updated);
  },

  addSlotPelajaran: (slot) => {
    const updated = {
      ...get().akademik,
      jadwalPelajaranList: [...get().akademik.jadwalPelajaranList, slot],
    };
    set({ akademik: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("akademik", updated);
  },

  updateSlotPelajaran: (id, slot) => {
    const updated = {
      ...get().akademik,
      jadwalPelajaranList: get().akademik.jadwalPelajaranList.map((s) =>
        s.id === id ? { ...s, ...slot } : s
      ),
    };
    set({ akademik: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("akademik", updated);
  },

  deleteSlotPelajaran: (id) => {
    const updated = {
      ...get().akademik,
      jadwalPelajaranList: get().akademik.jadwalPelajaranList.filter((s) => s.id !== id),
    };
    set({ akademik: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("akademik", updated);
  },

  // --- 4. Kesiswaan Actions (Langsung Simpan ke Supabase) ---
  addPrestasi: (prestasi) => {
    const updated = {
      ...get().kesiswaan,
      prestasiList: [prestasi, ...get().kesiswaan.prestasiList],
    };
    set({ kesiswaan: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("kesiswaan", updated);
  },

  updatePrestasi: (id, prestasi) => {
    const updated = {
      ...get().kesiswaan,
      prestasiList: get().kesiswaan.prestasiList.map((p) =>
        p.id === id ? { ...p, ...prestasi } : p
      ),
    };
    set({ kesiswaan: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("kesiswaan", updated);
  },

  deletePrestasi: (id) => {
    const updated = {
      ...get().kesiswaan,
      prestasiList: get().kesiswaan.prestasiList.filter((p) => p.id !== id),
    };
    set({ kesiswaan: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("kesiswaan", updated);
  },

  updateOsis: (data) => {
    const updated = {
      ...get().kesiswaan,
      osis: { ...get().kesiswaan.osis, ...data },
    };
    set({ kesiswaan: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("kesiswaan", updated);
  },

  addEkskul: (ekskul) => {
    const updated = {
      ...get().kesiswaan,
      ekskulList: [...get().kesiswaan.ekskulList, ekskul],
    };
    set({ kesiswaan: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("kesiswaan", updated);
  },

  updateEkskul: (id, ekskul) => {
    const updated = {
      ...get().kesiswaan,
      ekskulList: get().kesiswaan.ekskulList.map((e) =>
        e.id === id ? { ...e, ...ekskul } : e
      ),
    };
    set({ kesiswaan: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("kesiswaan", updated);
  },

  deleteEkskul: (id) => {
    const updated = {
      ...get().kesiswaan,
      ekskulList: get().kesiswaan.ekskulList.filter((e) => e.id !== id),
    };
    set({ kesiswaan: updated, lastSavedAt: new Date().toLocaleTimeString("id-ID") });
    syncToSupabase("kesiswaan", updated);
  },

  // Reset semua kembali ke nilai bawaan dan sinkronkan ke Supabase
  resetAllToDefault: () => {
    set({
      beranda: INITIAL_BERANDA_CMS,
      profil: INITIAL_PROFIL_CMS,
      akademik: INITIAL_AKADEMIK_CMS,
      kesiswaan: INITIAL_KESISWAAN_CMS,
      lastSavedAt: new Date().toLocaleTimeString("id-ID"),
    });
    syncToSupabase("beranda", INITIAL_BERANDA_CMS);
    syncToSupabase("profil", INITIAL_PROFIL_CMS);
    syncToSupabase("akademik", INITIAL_AKADEMIK_CMS);
    syncToSupabase("kesiswaan", INITIAL_KESISWAAN_CMS);
  },
}));
