import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { getUser } from "@/lib/auth/get-user";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) {
    const locale = await getLocale();
    redirect({ href: "/login", locale });
  }

  // After `redirect()` execution halts, but TS doesn't know that.
  if (!user) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome, {user.email}.</p>
    </main>
  );
}
