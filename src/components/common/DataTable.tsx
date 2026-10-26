"use client";

import { useState, useMemo, ReactNode } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => ReactNode;
  className?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface DataTableFilter {
  key: string;
  label: string;
  options: FilterOption[];
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFilterFn?: (item: T, query: string) => boolean;
  filters?: DataTableFilter[];
  activeFilterValues?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  pageSize?: number;
  title?: string;
  subtitle?: string;
  actionButton?: ReactNode;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Cari data berdasarkan nama, NISN, atau NUPTK...",
  searchFilterFn,
  filters,
  activeFilterValues,
  onFilterChange,
  pageSize = 10,
  title,
  subtitle,
  actionButton,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [localFilters, setLocalFilters] = useState<Record<string, string>>({});

  // Filter values priority: external props or local state
  const currentFilters = activeFilterValues || localFilters;

  const handleFilterUpdate = (key: string, val: string) => {
    setCurrentPage(1);
    if (onFilterChange) {
      onFilterChange(key, val);
    } else {
      setLocalFilters((prev) => ({ ...prev, [key]: val }));
    }
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search matching
      if (searchQuery.trim() !== "") {
        if (searchFilterFn) {
          if (!searchFilterFn(item, searchQuery.toLowerCase())) return false;
        } else {
          // Default string match across all string values
          const matched = Object.values(item).some((val) =>
            String(val).toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (!matched) return false;
        }
      }

      // Dropdown filters matching
      for (const [key, filterVal] of Object.entries(currentFilters)) {
        if (filterVal && filterVal !== "ALL") {
          if (String(item[key]) !== String(filterVal)) {
            return false;
          }
        }
      }

      return true;
    });
  }, [data, searchQuery, searchFilterFn, currentFilters]);

  // Pagination calculation
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-2xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            {title && (
              <h3 className="text-base font-bold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {actionButton && <div>{actionButton}</div>}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E] transition-all"
            />
          </div>

          {/* Filter Dropdowns */}
          {filters && filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mr-1">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <span>Filter:</span>
              </div>
              {filters.map((flt) => (
                <select
                  key={flt.key}
                  value={currentFilters[flt.key] || "ALL"}
                  onChange={(e) => handleFilterUpdate(flt.key, e.target.value)}
                  className="text-xs font-medium bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A2C5E]/20 focus:border-[#2A2C5E]"
                >
                  <option value="ALL">{flt.label} (Semua)</option>
                  {flt.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-gray-600">
          <thead className="bg-[#2A2C5E] text-white text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-4 py-3.5 w-12 text-center">
                No
              </th>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`px-4 py-3.5 ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="hover:bg-blue-50/40 transition-colors"
                >
                  <td className="px-4 py-3 text-center text-xs text-gray-500 font-medium">
                    {startIndex + rIdx + 1}
                  </td>
                  {columns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      className={`px-4 py-3 ${col.className || ""}`}
                    >
                      {col.cell
                        ? col.cell(row)
                        : col.accessorKey
                        ? String(row[col.accessorKey] ?? "-")
                        : "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-12 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center">
                    <Inbox className="w-10 h-10 text-gray-300 stroke-[1.5] mb-2" />
                    <p className="text-sm font-medium text-gray-600">
                      Tidak ada data yang cocok
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Silakan sesuaikan kata kunci pencarian atau filter Anda.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <div>
          Menampilkan{" "}
          <span className="font-semibold text-gray-900">
            {totalItems > 0 ? startIndex + 1 : 0}
          </span>{" "}
          hingga{" "}
          <span className="font-semibold text-gray-900">
            {Math.min(startIndex + pageSize, totalItems)}
          </span>{" "}
          dari{" "}
          <span className="font-semibold text-gray-900">{totalItems}</span> total
          data
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Sebelumnya</span>
          </button>

          <span className="px-3 py-1.5 font-medium text-gray-700">
            Halaman {currentPage} dari {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Berikutnya</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
