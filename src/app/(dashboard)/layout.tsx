import { getDemoOrRealUser } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getDemoOrRealUser();

  const userName = user.nome;
  const userAvatar = undefined;

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar userName={userName} userAvatar={userAvatar} />
      <div className="lg:pl-64">
        <Header userName={userName} userAvatar={userAvatar} />
        <main className="animate-fade-in p-4 pb-24 lg:p-8 lg:pb-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
