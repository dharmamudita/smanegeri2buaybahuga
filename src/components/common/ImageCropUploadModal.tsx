"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  UploadCloud,
  X,
  ZoomIn,
  ZoomOut,
  Crop,
  Check,
  RefreshCw,
  Move,
  Image as ImageIcon,
} from "lucide-react";

interface ImageCropUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (url: string) => void;
  defaultAspectRatio?: "1:1" | "4:3" | "16:9" | "free";
  title?: string;
  folder?: string;
}

export default function ImageCropUploadModal({
  isOpen,
  onClose,
  onSuccess,
  defaultAspectRatio = "1:1",
  title = "Potong & Sesuaikan Foto",
  folder = "sman2buaybahuga/cms",
}: ImageCropUploadModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "4:3" | "16:9" | "free">(defaultAspectRatio);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset state when opened or closed
  useEffect(() => {
    if (isOpen) {
      setAspectRatio(defaultAspectRatio);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setErrorMsg(null);
    } else {
      setImageSrc(null);
    }
  }, [isOpen, defaultAspectRatio]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Harap pilih berkas foto yang valid (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Ukuran berkas maksimal adalah 10 MB.");
      return;
    }

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Aspect ratio dimensions for preview frame
  const getFrameDimensions = () => {
    const baseW = 320;
    if (aspectRatio === "1:1") return { width: baseW, height: baseW };
    if (aspectRatio === "4:3") return { width: baseW, height: Math.round((baseW * 3) / 4) };
    if (aspectRatio === "16:9") return { width: baseW, height: Math.round((baseW * 9) / 16) };
    return { width: baseW, height: 240 };
  };

  const frameDim = getFrameDimensions();

  // Crop to Canvas and Upload to Cloudinary
  const handleCropAndUpload = async () => {
    if (!imageSrc || !imgRef.current) return;

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const img = imgRef.current;
      const canvas = document.createElement("canvas");

      // Set target output resolution
      let outW = 800;
      let outH = 800;
      if (aspectRatio === "1:1") {
        outW = 800;
        outH = 800;
      } else if (aspectRatio === "4:3") {
        outW = 960;
        outH = 720;
      } else if (aspectRatio === "16:9") {
        outW = 1280;
        outH = 720;
      } else {
        outW = 800;
        outH = 600;
      }

      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Gagal menginisialisasi canvas rendering.");
      }

      // Fill background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, outW, outH);

      // Calculate mapping from preview frame to canvas
      const scaleToCanvas = outW / frameDim.width;
      const effectiveZoom = zoom * scaleToCanvas;

      // Center of canvas
      const centerX = outW / 2;
      const centerY = outH / 2;

      // Draw transformed image
      ctx.save();
      ctx.translate(centerX + pan.x * scaleToCanvas, centerY + pan.y * scaleToCanvas);
      ctx.scale(effectiveZoom, effectiveZoom);

      // Determine natural image draw size in preview coordinates
      const previewImgW = 320;
      const previewImgH = (320 * img.naturalHeight) / img.naturalWidth;

      ctx.drawImage(
        img,
        -previewImgW / 2,
        -previewImgH / 2,
        previewImgW,
        previewImgH
      );
      ctx.restore();

      // Convert to Base64 JPEG
      const base64Data = canvas.toDataURL("image/jpeg", 0.9);

      // Send to Cloudinary backend API
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Data, folder }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengunggah foto ke Cloudinary.");
      }

      onSuccess(data.url);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Terjadi kesalahan saat memproses gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2A2C5E] flex items-center justify-center">
              <Crop className="w-4 h-4 text-[#2A2C5E]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{title}</h3>
              <p className="text-[11px] text-gray-500">
                Pilih foto dari perangkat, sesuaikan bingkai, lalu simpan ke Cloudinary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {errorMsg}
            </div>
          )}

          {!imageSrc ? (
            /* Dropzone / Upload Trigger */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-[#2A2C5E] bg-gray-50/50 hover:bg-blue-50/30 rounded-xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2A2C5E] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">
                Pilih Foto dari Perangkat
              </h4>
              <p className="text-[11px] text-gray-500 max-w-xs mb-3">
                Mendukung format JPG, PNG, WEBP (maksimal 10 MB). Tersimpan otomatis di CDN Cloudinary SMAN 2 Buay Bahuga.
              </p>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2A2C5E] text-white text-xs font-semibold shadow-xs">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Jelajahi File Komputer</span>
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            /* Interactive Cropping Viewport */
            <div className="space-y-4">
              {/* Aspect Ratio Selector */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-600 flex items-center gap-1">
                  <Crop className="w-3.5 h-3.5 text-[#2A2C5E]" />
                  <span>Rasio Potongan:</span>
                </span>
                <div className="inline-flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                  {(["1:1", "4:3", "16:9"] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                        aspectRatio === ratio
                          ? "bg-[#2A2C5E] text-white shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {ratio === "1:1" ? "1:1 Persegi" : ratio === "4:3" ? "4:3 Rapor" : "16:9 Banner"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Viewport Box */}
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="relative mx-auto bg-gray-900 rounded-xl overflow-hidden cursor-move flex items-center justify-center select-none shadow-inner"
                style={{ width: `${frameDim.width}px`, height: `${frameDim.height}px` }}
              >
                {/* Frame Guide Border */}
                <div className="absolute inset-0 border-2 border-white/60 pointer-events-none z-10 rounded-xl">
                  {/* Rule of thirds grid lines */}
                  <div className="absolute left-1/3 top-0 bottom-0 w-px border-r border-dashed border-white/25" />
                  <div className="absolute right-1/3 top-0 bottom-0 w-px border-r border-dashed border-white/25" />
                  <div className="absolute top-1/3 left-0 right-0 h-px border-b border-dashed border-white/25" />
                  <div className="absolute bottom-1/3 left-0 right-0 h-px border-b border-dashed border-white/25" />
                </div>

                {/* Hint overlay */}
                <div className="absolute bottom-2 left-2 z-20 pointer-events-none bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                  <Move className="w-2.5 h-2.5" />
                  <span>Geser untuk memposisikan foto</span>
                </div>

                {/* The Image */}
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop preview"
                  draggable={false}
                  className="pointer-events-none max-w-none transition-transform duration-75"
                  style={{
                    width: "320px",
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  }}
                />
              </div>

              {/* Zoom Slider Control */}
              <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <ZoomOut className="w-4 h-4 text-gray-500 shrink-0" />
                <input
                  type="range"
                  min="0.8"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-[#2A2C5E] cursor-pointer"
                />
                <ZoomIn className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="text-[11px] font-bold text-gray-700 w-10 text-right">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }}
                  className="p-1 hover:bg-gray-200 rounded text-gray-500"
                  title="Reset Zoom & Posisi"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Replace Image Button */}
              <div className="flex justify-between items-center text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setImageSrc(null);
                    fileInputRef.current?.click();
                  }}
                  className="text-gray-600 hover:text-[#2A2C5E] font-semibold underline underline-offset-2 flex items-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Ganti File Lain</span>
                </button>
                <span className="text-[10px] text-gray-400">
                  Cloud CDN: da14re4p
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            Batal
          </button>
          {imageSrc && (
            <button
              type="button"
              onClick={handleCropAndUpload}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2A2C5E] text-white font-bold text-xs hover:bg-[#1F2147] transition-all shadow-xs disabled:opacity-60 cursor-pointer"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengunggah ke Cloudinary...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Potong & Simpan ke Cloudinary</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
