import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PPDBStatus, PPDBTrack } from "@/types/database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date | undefined | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(dateString: string | Date | undefined | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function generateRegNumber(academicYear: string = "2027/2028"): string {
  const yearCode = academicYear.split("/")[0] || new Date().getFullYear().toString();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `PPDB-${yearCode}-${randomSuffix}`;
}

export function getStatusBadge(status: PPDBStatus): {
  label: string;
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case "pending":
      return {
        label: "Menunggu Verifikasi",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
      };
    case "verified":
      return {
        label: "Berkas Terverifikasi",
        bg: "bg-blue-50",
        text: "text-sky-700",
        border: "border-sky-200",
      };
    case "revision_needed":
      return {
        label: "Perlu Perbaikan",
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
      };
    case "accepted":
      return {
        label: "Lulus Seleksi",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
      };
    case "rejected":
      return {
        label: "Tidak Lulus",
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
      };
    default:
      return {
        label: "Tidak Diketahui",
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
      };
  }
}

export function getTrackLabel(track: PPDBTrack): string {
  switch (track) {
    case "zonasi":
      return "Zonasi Wilayah";
    case "afirmasi":
      return "Afirmasi (Keluarga Ekonomi Rendah)";
    case "prestasi":
      return "Prestasi (Akademik / Non-Akademik)";
    case "mutasi":
      return "Perpindahan Tugas Orang Tua / Wali";
    case "reguler":
      return "Jalur Reguler / Umum";
    default:
      return track;
  }
}
