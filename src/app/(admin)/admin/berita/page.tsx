"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminBeritaRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/cms");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <p className="text-xs font-semibold text-gray-500 animate-pulse">
        Memuat Pusat Konten & CMS SMAN 2 Buay Bahuga...
      </p>
    </div>
  );
}
