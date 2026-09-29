export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page renders without the AdminSidebar - just full screen
  return <>{children}</>;
}
