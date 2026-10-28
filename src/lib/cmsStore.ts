import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  INITIAL_BERANDA_CMS,
  INITIAL_PROFIL_CMS,
  INITIAL_AKADEMIK_CMS,
  INITIAL_KESISWAAN_CMS,
} from "./cmsData";

export interface CMSState {
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
  resetAllToDefault: () => void;
}

export const useCMSStore = create<CMSState>()(
  persist(
    (set) => ({
      beranda: INITIAL_BERANDA_CMS,
      profil: INITIAL_PROFIL_CMS,
      akademik: INITIAL_AKADEMIK_CMS,
      kesiswaan: INITIAL_KESISWAAN_CMS,

      // --- 1. Beranda Actions ---
      updateBerandaInfo: (data) =>
        set((state) => ({
          beranda: { ...state.beranda, ...data },
        })),

      updateKepsek: (data) =>
        set((state) => ({
          beranda: {
            ...state.beranda,
            kepsek: { ...state.beranda.kepsek, ...data },
          },
        })),

      updateStatistik: (data) =>
        set((state) => ({
          beranda: {
            ...state.beranda,
            statistik: { ...state.beranda.statistik, ...data },
          },
        })),

      addVideoPanduan: (video) =>
        set((state) => ({
          beranda: {
            ...state.beranda,
            videoPanduan: [video, ...state.beranda.videoPanduan],
          },
        })),

      updateVideoPanduan: (id, video) =>
        set((state) => ({
          beranda: {
            ...state.beranda,
            videoPanduan: state.beranda.videoPanduan.map((v) =>
              v.id === id ? { ...v, ...video } : v
            ),
          },
        })),

      deleteVideoPanduan: (id) =>
        set((state) => ({
          beranda: {
            ...state.beranda,
            videoPanduan: state.beranda.videoPanduan.filter((v) => v.id !== id),
          },
        })),

      // --- 2. Profil Actions ---
      updateProfilVisiMisi: (visi, misi) =>
        set((state) => ({
          profil: { ...state.profil, visi, misi },
        })),

      addStrukturOrganisasi: (item) =>
        set((state) => ({
          profil: {
            ...state.profil,
            strukturOrganisasi: [...state.profil.strukturOrganisasi, item],
          },
        })),

      updateStrukturOrganisasi: (id, item) =>
        set((state) => ({
          profil: {
            ...state.profil,
            strukturOrganisasi: state.profil.strukturOrganisasi.map((s) =>
              s.id === id ? { ...s, ...item } : s
            ),
          },
        })),

      deleteStrukturOrganisasi: (id) =>
        set((state) => ({
          profil: {
            ...state.profil,
            strukturOrganisasi: state.profil.strukturOrganisasi.filter((s) => s.id !== id),
          },
        })),

      addGuruStaff: (guru) =>
        set((state) => ({
          profil: {
            ...state.profil,
            guruStaff: [guru, ...state.profil.guruStaff],
          },
        })),

      updateGuruStaff: (id, guru) =>
        set((state) => ({
          profil: {
            ...state.profil,
            guruStaff: state.profil.guruStaff.map((g) =>
              g.id === id ? { ...g, ...guru } : g
            ),
          },
        })),

      deleteGuruStaff: (id) =>
        set((state) => ({
          profil: {
            ...state.profil,
            guruStaff: state.profil.guruStaff.filter((g) => g.id !== id),
          },
        })),

      // --- 3. Akademik Actions ---
      addAgendaKalender: (agenda) =>
        set((state) => ({
          akademik: {
            ...state.akademik,
            agendaList: [agenda, ...state.akademik.agendaList],
          },
        })),

      updateAgendaKalender: (id, agenda) =>
        set((state) => ({
          akademik: {
            ...state.akademik,
            agendaList: state.akademik.agendaList.map((a) =>
              a.id === id ? { ...a, ...agenda } : a
            ),
          },
        })),

      deleteAgendaKalender: (id) =>
        set((state) => ({
          akademik: {
            ...state.akademik,
            agendaList: state.akademik.agendaList.filter((a) => a.id !== id),
          },
        })),

      addJadwalUjian: (ujian) =>
        set((state) => ({
          akademik: {
            ...state.akademik,
            jadwalUjianList: [...state.akademik.jadwalUjianList, ujian],
          },
        })),

      updateJadwalUjian: (id, ujian) =>
        set((state) => ({
          akademik: {
            ...state.akademik,
            jadwalUjianList: state.akademik.jadwalUjianList.map((u) =>
              u.id === id ? { ...u, ...ujian } : u
            ),
          },
        })),

      deleteJadwalUjian: (id) =>
        set((state) => ({
          akademik: {
            ...state.akademik,
            jadwalUjianList: state.akademik.jadwalUjianList.filter((u) => u.id !== id),
          },
        })),

      // --- 4. Kesiswaan Actions ---
      addPrestasi: (prestasi) =>
        set((state) => ({
          kesiswaan: {
            ...state.kesiswaan,
            prestasiList: [prestasi, ...state.kesiswaan.prestasiList],
          },
        })),

      updatePrestasi: (id, prestasi) =>
        set((state) => ({
          kesiswaan: {
            ...state.kesiswaan,
            prestasiList: state.kesiswaan.prestasiList.map((p) =>
              p.id === id ? { ...p, ...prestasi } : p
            ),
          },
        })),

      deletePrestasi: (id) =>
        set((state) => ({
          kesiswaan: {
            ...state.kesiswaan,
            prestasiList: state.kesiswaan.prestasiList.filter((p) => p.id !== id),
          },
        })),

      updateOsis: (data) =>
        set((state) => ({
          kesiswaan: {
            ...state.kesiswaan,
            osis: { ...state.kesiswaan.osis, ...data },
          },
        })),

      addEkskul: (ekskul) =>
        set((state) => ({
          kesiswaan: {
            ...state.kesiswaan,
            ekskulList: [...state.kesiswaan.ekskulList, ekskul],
          },
        })),

      updateEkskul: (id, ekskul) =>
        set((state) => ({
          kesiswaan: {
            ...state.kesiswaan,
            ekskulList: state.kesiswaan.ekskulList.map((e) =>
              e.id === id ? { ...e, ...ekskul } : e
            ),
          },
        })),

      deleteEkskul: (id) =>
        set((state) => ({
          kesiswaan: {
            ...state.kesiswaan,
            ekskulList: state.kesiswaan.ekskulList.filter((e) => e.id !== id),
          },
        })),

      // Reset
      resetAllToDefault: () =>
        set({
          beranda: INITIAL_BERANDA_CMS,
          profil: INITIAL_PROFIL_CMS,
          akademik: INITIAL_AKADEMIK_CMS,
          kesiswaan: INITIAL_KESISWAAN_CMS,
        }),
    }),
    {
      name: "sman2buba_cms_store_v1",
    }
  )
);

