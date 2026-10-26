"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Navigation,
  Compass,
} from "lucide-react";
import { SCHOOL_INFO } from "@/lib/constants";
import { useAuthStore, usePresensiStore } from "@/lib/store";
import DataTable, { Column } from "@/components/common/DataTable";
import { PresensiRecord } from "@/lib/types";

// Rumus Haversine untuk menghitung jarak akurat (dalam meter) antara dua titik koordinat
function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Radius bumi dalam meter
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default function SiswaPresensiPage() {
  const { currentUser } = useAuthStore();
  const { records, addRecord } = usePresensiStore();

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<
    "IDLE" | "SUCCESS" | "ERROR"
  >("IDLE");
  const [errorMessage, setErrorMessage] = useState("");
  const [successCheckedIn, setSuccessCheckedIn] = useState(false);

  const maxRadius = SCHOOL_INFO.koordinat.radiusMaksimalMeter;
  const schoolLat = SCHOOL_INFO.koordinat.latitude;
  const schoolLng = SCHOOL_INFO.koordinat.longitude;

  // Deteksi lokasi asli perangkat
  const detectLiveLocation = () => {
    setLoadingLocation(true);
    setErrorMessage("");
    if (!navigator.geolocation) {
      setErrorMessage(
        "Perangkat Anda tidak mendukung sensor geolokasi GPS."
      );
      setLocationStatus("ERROR");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setLatitude(userLat);
        setLongitude(userLng);

        const dist = calculateDistanceMeters(
          userLat,
          userLng,
          schoolLat,
          schoolLng
        );
        setDistance(dist);
        setLocationStatus("SUCCESS");
        setLoadingLocation(false);
      },
      (err) => {
        setErrorMessage(
          "Izin akses lokasi ditolak oleh browser. Silakan aktifkan izin lokasi atau gunakan tombol simulasi lokasi untuk uji coba."
        );
        setLocationStatus("ERROR");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Simulasi lokasi untuk demonstrasi
  const setSimulationLocation = (type: "INSIDE" | "OUTSIDE") => {
    if (type === "INSIDE") {
      // Koordinat di gerbang sekolah (jarak ~28 meter)
      const simLat = -4.478215;
      const simLng = 104.542812;
      setLatitude(simLat);
      setLongitude(simLng);
      const dist = calculateDistanceMeters(
        simLat,
        simLng,
        schoolLat,
        schoolLng
      );
      setDistance(dist);
      setLocationStatus("SUCCESS");
      setErrorMessage("");
    } else {
      // Koordinat di luar area sekolah (~380 meter)
      const simLat = -4.4815;
      const simLng = 104.5452;
      setLatitude(simLat);
      setLongitude(simLng);
      const dist = calculateDistanceMeters(
        simLat,
        simLng,
        schoolLat,
        schoolLng
      );
      setDistance(dist);
      setLocationStatus("SUCCESS");
      setErrorMessage("");
    }
  };

  const handleCheckIn = () => {
    if (distance === null || distance > maxRadius) return;

    const newRecord: PresensiRecord = {
      id: `pres-${Date.now()}`,
      siswaId: currentUser?.id || "siswa-1",
      siswaNama: currentUser?.name || "Dharma Mudita Pratama",
      nisn: currentUser?.nisn || "0078129341",
      kelas: currentUser?.kelas || "XII MIPA 1",
      tanggal: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      waktu: new Date().toLocaleTimeString("id-ID") + " WIB",
      status: "HADIR",
      jarakMeter: distance,
      latitude: latitude || 0,
      longitude: longitude || 0,
      keterangan: `Presensi Terverifikasi Geofencing (${distance}m dari Titik Sekolah)`,
    };

    addRecord(newRecord);
    setSuccessCheckedIn(true);
  };

  const isWithinGeofence = distance !== null && distance <= maxRadius;

  const columns: Column<PresensiRecord>[] = [
    {
      header: "Tanggal & Waktu",
      cell: (row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.tanggal}</div>
          <div className="text-[11px] text-gray-400">{row.waktu}</div>
        </div>
      ),
    },
    {
      header: "Nama Siswa / NISN",
      cell: (row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.siswaNama}</div>
          <div className="text-[11px] text-gray-500">NISN: {row.nisn} ({row.kelas})</div>
        </div>
      ),
    },
    {
      header: "Status Kehadiran",
      cell: (row) => {
        const isHadir = row.status === "HADIR";
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold border ${
              isHadir
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : row.status === "TERLAMBAT"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-blue-50 text-[#2E4BA3] border-blue-200"
            }`}
          >
            {isHadir ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
            {row.status}
          </span>
        );
      },
    },
    {
      header: "Jarak Radius",
      cell: (row) => (
        <span className="font-mono font-medium text-gray-800">
          {row.jarakMeter} Meter
        </span>
      ),
    },
    {
      header: "Keterangan Validasi",
      accessorKey: "keterangan",
      className: "text-gray-500 text-xs",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-[#2E4BA3] text-xs font-semibold mb-2">
          <Navigation className="w-3.5 h-3.5" />
          <span>Sistem Validasi Kehadiran Digital</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Presensi Siswa Berbasis Geofencing GPS
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Validasi kehadiran fisik otomatis menggunakan formula Haversine dengan toleransi jarak maksimal {maxRadius} meter dari koordinat SMAN 2 Buay Bahuga.
        </p>
      </div>

      {/* Geofence Detection Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Pusat Verifikasi Koordinat
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Titik Sekolah: Lat {schoolLat}, Lng {schoolLng} | Radius Aman: &le; {maxRadius}m
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={detectLiveLocation}
              disabled={loadingLocation}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#2E4BA3] ${
                  loadingLocation ? "animate-spin" : ""
                }`}
              />
              <span>Cek GPS Asli</span>
            </button>
          </div>
        </div>

        {/* Demo Simulator Buttons */}
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
          <div className="text-[11px] font-bold text-gray-600 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#2E4BA3]" />
            <span>Simulasi Uji Coba Cepat (Testing Preset):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSimulationLocation("INSIDE")}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
            >
              Simulasi Berada di Sekolah (Jarak: ~28m)
            </button>
            <button
              onClick={() => setSimulationLocation("OUTSIDE")}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 transition-colors"
            >
              Simulasi Di Luar Sekolah (Jarak: ~380m)
            </button>
          </div>
        </div>

        {/* Distance Indicator Box */}
        {distance !== null ? (
          <div
            className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isWithinGeofence
                ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                : "bg-red-50/60 border-red-200 text-red-900"
            }`}
          >
            <div className="flex items-start gap-3">
              {isWithinGeofence ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold text-sm">
                  {isWithinGeofence
                    ? "Lokasi Anda Terverifikasi Di Dalam Area Sekolah"
                    : "Anda Berada di Luar Jangkauan Sekolah"}
                </div>
                <div className="text-xs mt-1 space-y-0.5 opacity-90">
                  <p>
                    Jarak Terhitung:{" "}
                    <strong className="text-sm font-mono">{distance} Meter</strong>{" "}
                    (Batas Maksimal: {maxRadius} Meter)
                  </p>
                  <p className="text-[11px]">
                    Koordinat Pengguna: Lat {latitude?.toFixed(6)}, Lng{" "}
                    {longitude?.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              {successCheckedIn ? (
                <span className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-md shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  Presensi Berhasil Tercatat
                </span>
              ) : (
                <button
                  onClick={handleCheckIn}
                  disabled={!isWithinGeofence}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#2E4BA3] hover:bg-[#233b82] text-white font-bold text-xs rounded-md shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Kirim Absensi Kehadiran
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 space-y-2">
            <MapPin className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-xs font-semibold text-gray-700">
              Belum ada data geolokasi yang terdeteksi
            </p>
            <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
              Klik &quot;Cek GPS Asli&quot; untuk mengizinkan browser membaca lokasi, atau pilih salah satu tombol &quot;Simulasi Uji Coba Cepat&quot; di atas.
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="space-y-4">
        <DataTable
          title="Riwayat Presensi Siswa Terverifikasi"
          subtitle="Audit log kehadiran dengan koordinat GPS dan meter radius"
          data={records}
          columns={columns}
          searchPlaceholder="Cari berdasarkan nama atau NISN siswa..."
          pageSize={10}
        />
      </div>
    </div>
  );
}
