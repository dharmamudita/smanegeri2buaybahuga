import InstitutionalHeader from "@/components/common/InstitutionalHeader";
import InstitutionalFooter from "@/components/common/InstitutionalFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <InstitutionalHeader />
      <main className="flex-1">{children}</main>
      <InstitutionalFooter />
    </div>
  );
}
