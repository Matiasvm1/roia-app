import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { requireAuth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <div className="min-h-screen">
      <Sidebar userRole={user.role} />
      <div className="md:pl-64">
        <Header userName={user.fullName} userRole={user.role} />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
