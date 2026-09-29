import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Dashboard Admin | SMAN 2 Buay Bahuga",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row antialiased">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-slate-900 text-slate-100 min-h-screen">
        {children}
      </main>
    </div>
  );
}
