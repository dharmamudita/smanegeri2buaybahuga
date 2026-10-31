"use client";

import { useState, useRef, useEffect, memo } from "react";
import { Play, Video, Clock, ExternalLink, Pause } from "lucide-react";
import { extractYouTubeId, getYouTubeThumbnailUrl, formatYouTubeWatchUrl } from "@/lib/youtube";
import { usePathname } from "next/navigation";

interface YouTubePlayerCardProps {
  id: string;
  youtubeUrl: string;
  judul: string;
  kategori: string;
  durasi: string;
  ringkasan: string;
  poinPanduan?: string[];
  thumbnailUrl?: string;
  highlight?: string;
}

function YouTubePlayerCardComponent({
  id,
  youtubeUrl,
  judul,
  kategori,
  durasi,
  ringkasan,
  poinPanduan,
  thumbnailUrl,
  highlight,
}: YouTubePlayerCardProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pathname = usePathname();

  const videoId = extractYouTubeId(youtubeUrl);
  const thumbnail = thumbnailUrl || getYouTubeThumbnailUrl(youtubeUrl);

  // Kirim perintah jeda (pause) via YouTube Iframe API tanpa mereset waktu video
  const pauseVideo = () => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
          "*"
        );
        setIsPaused(true);
      } catch (err) {
        console.warn("Gagal mengirim pause command ke iframe:", err);
      }
    }
  };

  // Lanjutkan video dari detik terakhir berhenti
  const resumeVideo = () => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "playVideo", args: "" }),
          "*"
        );
        setIsPaused(false);
      } catch (err) {
        console.warn("Gagal mengirim play command ke iframe:", err);
      }
    }
  };

  const handleStartPlay = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setIsPaused(false);
    } else {
      resumeVideo();
    }
  };

  // 1. Jeda otomatis saat berpindah halaman di dalam website
  useEffect(() => {
    if (hasStarted) {
      pauseVideo();
    }
  }, [pathname]);

  // 2. Jeda otomatis saat berpindah tab browser atau meminimalisir jendela (Page Visibility API)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasStarted) {
        pauseVideo();
      }
    };

    const handleWindowBlur = () => {
      if (hasStarted) {
        pauseVideo();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [hasStarted]);

  const embedSrc = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&autoplay=1`
    : "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?enablejsapi=1&rel=0&modestbranding=1";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between h-full">
      <div className="flex flex-col">
        {/* Layar Video 16:9 */}
        <div className="relative aspect-video w-full bg-gray-900 overflow-hidden shrink-0">
          {hasStarted ? (
            <div className="relative w-full h-full">
              <iframe
                ref={iframeRef}
                src={embedSrc}
                title={judul}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              {/* Tombol Jeda / Lanjutkan Cepat */}
              <button
                type="button"
                onClick={isPaused ? resumeVideo : pauseVideo}
                className="absolute top-2.5 right-2.5 z-20 px-2.5 py-1 bg-black/75 hover:bg-black text-white text-[10px] font-semibold rounded-lg backdrop-blur-xs flex items-center gap-1 transition-all cursor-pointer shadow-md"
                title={isPaused ? "Lanjutkan video" : "Jeda video (pause)"}
              >
                {isPaused ? (
                  <>
                    <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                    <span>Lanjut</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 text-amber-300" />
                    <span>Jeda</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div
              onClick={handleStartPlay}
              className="group relative w-full h-full cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnail}
                alt={judul}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/75 via-gray-900/20 to-transparent" />

              {/* Badge Kategori & Durasi */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 bg-[#2A2C5E] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded shadow-xs">
                  <Video className="w-3 h-3" />
                  <span>{kategori}</span>
                </span>
                <span className="inline-flex items-center gap-1 bg-black/65 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{durasi}</span>
                </span>
              </div>

              {/* Tombol Play di Tengah */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-[#2A2C5E]/90 group-hover:bg-[#2A2C5E] backdrop-blur-md border border-white/40 text-white shadow-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>

              {/* Keterangan di Bawah Layar */}
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white/90 text-[11px] font-medium">
                <span>Klik untuk memutar</span>
                <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded">
                  {highlight || "Panduan Resmi"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Info Konten Video */}
        <div className="p-5 space-y-3">
          <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">
            {judul}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
            {ringkasan}
          </p>

          {poinPanduan && poinPanduan.length > 0 && (
            <ul className="space-y-1.5 pt-1 border-t border-gray-100">
              {poinPanduan.map((poin, pIdx) => (
                <li key={pIdx} className="text-[11px] text-gray-500 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2A2C5E] mt-1.5 shrink-0" />
                  <span>{poin}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer Tautan */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] text-gray-500">
          Format: Video HD 1080p
        </span>
        <a
          href={formatYouTubeWatchUrl(youtubeUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-[#2A2C5E] hover:underline flex items-center gap-1"
        >
          <span>Buka di YouTube</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

export const YouTubePlayerCard = memo(YouTubePlayerCardComponent);
export default YouTubePlayerCard;

