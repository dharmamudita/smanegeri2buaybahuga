import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserSession, UjianLogRecord, PresensiRecord, BeritaItem } from "./types";
import { MOCK_USERS, MOCK_PRESENSI, MOCK_UJIAN_LOGS, MOCK_BERITA } from "./mockData";

interface AuthState {
  currentUser: UserSession | null;
  login: (username: string, role?: string) => boolean;
  logout: () => void;
  setUser: (user: UserSession | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: MOCK_USERS[0], // Default logged-in as Admin for showcase
      login: (username: string) => {
        const found = MOCK_USERS.find(
          (u) =>
            u.username.toLowerCase() === username.toLowerCase() ||
            u.nisn === username ||
            u.nuptk === username
        );
        if (found) {
          set({ currentUser: found });
          return true;
        }
        return false;
      },
      logout: () => set({ currentUser: null }),
      setUser: (user) => set({ currentUser: user }),
    }),
    {
      name: "sman2buba_auth",
    }
  )
);

interface ExamState {
  isExamActive: boolean;
  activeExamId: string | null;
  currentQuestionIndex: number;
  answers: Record<number, number>;
  violationsCount: number;
  violationLogs: UjianLogRecord[];
  startExam: (examId: string) => void;
  setAnswer: (questionId: number, answerIndex: number) => void;
  nextQuestion: (totalQuestions: number) => void;
  prevQuestion: () => void;
  recordViolation: (eventType: "SWITCH_TAB" | "COPY_TEXT" | "WINDOW_BLUR", metadata: string, studentName: string, nisn: string, examTitle: string) => void;
  finishExam: () => void;
}

export const useExamStore = create<ExamState>((set, get) => ({
  isExamActive: false,
  activeExamId: null,
  currentQuestionIndex: 0,
  answers: {},
  violationsCount: 0,
  violationLogs: MOCK_UJIAN_LOGS,
  startExam: (examId: string) =>
    set({
      isExamActive: true,
      activeExamId: examId,
      currentQuestionIndex: 0,
      answers: {},
      violationsCount: 0,
    }),
  setAnswer: (qId, aIdx) =>
    set((state) => ({ answers: { ...state.answers, [qId]: aIdx } })),
  nextQuestion: (total) =>
    set((state) => ({
      currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, total - 1),
    })),
  prevQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    })),
  recordViolation: (eventType, metadata, studentName, nisn, examTitle) => {
    const newLog: UjianLogRecord = {
      id: `viol-${Date.now()}`,
      siswaNama: studentName,
      nisn: nisn,
      tugasJudul: examTitle,
      eventType: eventType,
      metadata: metadata,
      timestamp: new Date().toLocaleTimeString("id-ID"),
    };
    set((state) => ({
      violationsCount: state.violationsCount + 1,
      violationLogs: [newLog, ...state.violationLogs],
    }));
  },
  finishExam: () =>
    set({
      isExamActive: false,
      activeExamId: null,
    }),
}));

interface PresensiState {
  records: PresensiRecord[];
  addRecord: (record: PresensiRecord) => void;
}

export const usePresensiStore = create<PresensiState>((set) => ({
  records: MOCK_PRESENSI,
  addRecord: (record) =>
    set((state) => ({ records: [record, ...state.records] })),
}));

interface BeritaState {
  beritaList: BeritaItem[];
  addBerita: (item: BeritaItem) => void;
  deleteBerita: (id: string) => void;
}

export const useBeritaStore = create<BeritaState>()(
  persist(
    (set) => ({
      beritaList: MOCK_BERITA,
      addBerita: (item) =>
        set((state) => ({
          // Pastikan berita terbaru selalu berada di posisi paling atas / paling depan (index 0)
          beritaList: [item, ...state.beritaList],
        })),
      deleteBerita: (id) =>
        set((state) => ({
          beritaList: state.beritaList.filter((b) => b.id !== id),
        })),
    }),
    {
      name: "sman2buba_berita_v2",
    }
  )
);
