"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  Calendar, 
  Trophy, 
  FileText, 
  Bell, 
  Tag, 
  Clock, 
  Sparkles,
  ArrowRight,
  X,
  Share2
} from "lucide-react";
import { Announcement } from "@/types/database";
import { formatDate } from "@/lib/utils";

interface AnnouncementExplorerProps {
  initialAnnouncements: Announcement[];
}

const CATEGORIES = [
  { key: "all", label: "Semua Warta", icon: Sparkles },
  { key: "pengumuman", label: "Pengumuman", icon: Bell },
  { key: "prestasi", label: "Prestasi Siswa", icon: Trophy },
  { key: "agenda", label: "Agenda Kegiatan", icon: Calendar },
  { key: "berita", label: "Berita Sekolah", icon: FileText },
];

export default function AnnouncementExplorer({
  initialAnnouncements,
}: AnnouncementExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItem, setActiveItem] = useState<Announcement | null>(null);

  const filteredItems = useMemo(() => {
    return initialAnnouncements.filter((item) => {
      const matchCategory =
        selectedCategory === "all" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [initialAnnouncements, selectedCategory, searchQuery]);

  const getCategoryBadgeStyle = (category: string) => {
    switch (category.toLowerCase()) {
      case "prestasi":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "agenda":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "pengumuman":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pengumuman, agenda, atau prestasi siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
                  isActive
                    ? "bg-sky-600 text-white shadow-sm shadow-sky-600/25"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Quick Notice */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-2">
        <span>Menampilkan <strong>{filteredItems.length}</strong> publikasi informasi</span>
        {selectedCategory !== "all" && (
          <button
            onClick={() => setSelectedCategory("all")}
            className="text-sky-600 hover:underline font-semibold"
          >
            Reset filter
          </button>
        )}
      </div>

      {/* Announcements Grid */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center space-y-3">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Tidak ada informasi yang sesuai</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba gunakan kata kunci pencarian lain atau pilih kategori Semua Warta.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${getCategoryBadgeStyle(item.category)}`}>
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(item.published_at)}</span>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {item.content}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:text-sky-700">
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Reading Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getCategoryBadgeStyle(activeItem.category)}`}>
                  {activeItem.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {activeItem.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Diterbitkan: {formatDate(activeItem.published_at)}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveItem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 space-y-4 border-t border-slate-100 pt-4">
              {activeItem.content.split("\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveItem(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
