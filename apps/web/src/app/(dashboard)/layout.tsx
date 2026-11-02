import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#0A2540] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-[#F8FAFC]">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">{children}</main>
      </div>
    </div>
  );
}
