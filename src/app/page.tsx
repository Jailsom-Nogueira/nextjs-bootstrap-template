import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-bold">Social Platform Template</h1>
      <p className="text-muted-foreground max-w-md text-center">
        Next.js 16 + Supabase + PostHog + Resend. Edit{" "}
        <code className="bg-muted rounded px-1.5 py-0.5 text-sm">src/app/page.tsx</code> to begin.
      </p>
      <div className="flex gap-3 text-sm">
        <a className="underline" href="/login">
          Login
        </a>
        <a className="underline" href="/dashboard">
          Dashboard
        </a>
        <a className="underline" href="/api/health">
          Health
        </a>
      </div>
    </main>
  );
}
