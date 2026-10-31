"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export default function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = "data",
}: PaginationBarProps) {
  if (totalItems === 0) return null;

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);
  const pages = Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 sm:px-5 py-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs text-gray-500 font-medium text-center sm:text-left">
        Menampilkan{" "}
        <span className="font-bold text-gray-900">
          {startIdx}&ndash;{endIdx}
        </span>{" "}
        dari <span className="font-bold text-gray-900">{totalItems}</span> {itemLabel} &bull; Halaman{" "}
        <span className="font-bold text-[#2A2C5E]">{currentPage}</span> dari{" "}
        <span className="font-bold text-gray-900">{Math.max(1, totalPages)}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1 h-8 px-2 sm:px-2.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-[#2A2C5E] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          aria-label="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-[10px] sm:text-xs">Kembali</span>
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page) => {
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#2A2C5E] text-white shadow-xs"
                    : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80 hover:text-gray-900"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1 h-8 px-2 sm:px-2.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-[#2A2C5E] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          aria-label="Halaman Berikutnya"
        >
          <span className="text-[10px] sm:text-xs">Selanjutnya</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

