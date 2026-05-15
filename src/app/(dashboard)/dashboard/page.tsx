import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/get-user";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome, {user.email}.</p>
    </main>
  );
}
