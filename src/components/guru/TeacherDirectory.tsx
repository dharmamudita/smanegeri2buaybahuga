"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Search, GraduationCap, Users, ShieldCheck, BookOpen, X, Sparkles, Radio } from "lucide-react";
import { Teacher } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

interface TeacherDirectoryProps {
  initialTeachers: Teacher[];
}

type RoleFilter = "all" | "pimpinan" | "guru" | "staf";

export default function TeacherDirectory({ initialTeachers }: TeacherDirectoryProps) {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<RoleFilter>("all");

  useEffect(() => {
    setTeachers(initialTeachers);
  }, [initialTeachers]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("public-realtime-teachers")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teachers",
        },
        async () => {
          const { data } = await supabase
            .from("teachers")
            .select("*")
            .eq("is_active", true)
            .order("order_index", { ascending: true });
          if (data && data.length > 0) {
            setTeachers(data as Teacher[]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      // 1. Text Search Filter
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        teacher.full_name.toLowerCase().includes(q) ||
        (teacher.subject && teacher.subject.toLowerCase().includes(q)) ||
        (teacher.role_title && teacher.role_title.toLowerCase().includes(q)) ||
        (teacher.nip && teacher.nip.includes(q));

      if (!matchSearch) return false;

      // 2. Category Filter
      if (selectedFilter === "all") return true;

      const roleLower = teacher.role_title.toLowerCase();
      if (selectedFilter === "pimpinan") {
        return (
          roleLower.includes("kepala sekolah") ||
          roleLower.includes("wakil") ||
          roleLower.includes("pimpinan")
        );
      }
      if (selectedFilter === "guru") {
        return (
          roleLower.includes("guru") ||
          (teacher.subject && !roleLower.includes("tata usaha"))
        );
      }
      if (selectedFilter === "staf") {
        return (
          roleLower.includes("tata usaha") ||
          roleLower.includes("staf") ||
          roleLower.includes("operator") ||
          roleLower.includes("laboran")
        );
      }

      return true;
    });
  }, [teachers, searchQuery, selectedFilter]);

  const filterTabs = [
    { id: "all" as RoleFilter, label: "Semua", count: teachers.length },
    {
      id: "pimpinan" as RoleFilter,
      label: "Pimpinan",
      count: teachers.filter((t) =>
        t.role_title.toLowerCase().includes("kepala") || t.role_title.toLowerCase().includes("wakil")
      ).length,
    },
    {
      id: "guru" as RoleFilter,
      label: "Guru Pengajar",
      count: teachers.filter((t) =>
        t.role_title.toLowerCase().includes("guru")
      ).length,
    },
    {
      id: "staf" as RoleFilter,
      label: "Tata Usaha & Staf",
      count: teachers.filter(
        (t) =>
          t.role_title.toLowerCase().includes("tata usaha") ||
          t.role_title.toLowerCase().includes("staf")
      ).length,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Control Panel: Search & Filter Tabs */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-5">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama guru, NIP, atau mata pelajaran..."
              className="w-full pl-12 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                title="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Result Count Indicator */}
          <div className="text-xs font-semibold text-slate-500 shrink-0 self-center md:self-auto">
            Menampilkan <span className="font-bold text-sky-600">{filteredTeachers.length}</span> dari {initialTeachers.length} tenaga pendidik
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-sky-600 text-white shadow-sm shadow-sky-600/30"
                    : "bg-slate-100 hover:bg-slate-200/70 text-slate-600"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-white text-slate-600 shadow-2xs"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Teachers */}
      {filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTeachers.map((teacher) => {
            const isLeader =
              teacher.role_title.toLowerCase().includes("kepala") ||
              teacher.role_title.toLowerCase().includes("wakil");

            return (
              <div
                key={teacher.id}
                className={`rounded-3xl bg-white border transition-all duration-300 overflow-hidden group flex flex-col justify-between hover:shadow-xl hover:-translate-y-0.5 ${
                  isLeader
                    ? "border-sky-300/80 shadow-md shadow-sky-500/5 ring-1 ring-sky-100"
                    : "border-slate-200/80 shadow-xs hover:border-sky-300"
                }`}
              >
                <div className="p-6 space-y-4 text-center">
                  {/* Avatar Photo / Icon */}
                  <div className="relative w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-sky-600 via-sky-500 to-sky-400 p-1 shadow-md group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden relative">
                      {teacher.photo_url ? (
                        <Image
                          src={teacher.photo_url}
                          alt={teacher.full_name}
                          width={112}
                          height={112}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <GraduationCap className="w-10 h-10 text-sky-600" />
                      )}
                    </div>
                    {isLeader && (
                      <span className="absolute -top-1 -right-1 p-1 bg-amber-400 text-slate-950 rounded-full shadow-md z-10" title="Pimpinan Sekolah">
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Name & Title */}
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-sky-600 transition-colors">
                      {teacher.full_name}
                    </h3>
                    <div className="text-xs font-semibold text-sky-700">
                      {teacher.role_title}
                    </div>
                    {teacher.nip ? (
                      <div className="text-[11px] text-slate-400 font-mono">
                        NIP. {teacher.nip}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic">
                        Tenaga Pendidik
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject Tag Footer */}
                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 text-center flex items-center justify-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-600 font-medium truncate">
                    {teacher.subject || "Tenaga Kependidikan"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl bg-white border border-slate-200/80 p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Guru atau staf tidak ditemukan</h3>
          <p className="text-xs text-slate-500">
            Tidak ada data tenaga pendidik yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedFilter("all");
            }}
            className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 transition"
          >
            Reset Pencarian
          </button>
        </div>
      )}
    </div>
  );
}
