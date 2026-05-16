import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Accessibility,
  GitBranch,
  Globe,
  Rocket,
  Shield,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

// TODO: set REPO_URL to the real GitHub repo URL once published.
const REPO_URL = "https://github.com";

type FeatureKey = "auth" | "aiNative" | "performance" | "i18n" | "a11y" | "qaLoop";

type StackItem = { name: string; version: string };

const FEATURES: ReadonlyArray<{
  key: FeatureKey;
  Icon: typeof Shield;
}> = [
  { key: "auth", Icon: Shield },
  { key: "aiNative", Icon: Sparkles },
  { key: "performance", Icon: Zap },
  { key: "i18n", Icon: Globe },
  { key: "a11y", Icon: Accessibility },
  { key: "qaLoop", Icon: ShieldCheck },
];

const STACK: ReadonlyArray<StackItem> = [
  { name: "Next.js", version: "16.2.6" },
  { name: "React", version: "19.2.6" },
  { name: "TypeScript", version: "5.6+" },
  { name: "Tailwind", version: "v4" },
  { name: "shadcn/ui", version: "radix-nova" },
  { name: "@supabase/ssr", version: "0.10" },
  { name: "Zod", version: "4" },
  { name: "PostHog", version: "client+server" },
  { name: "Resend", version: "6" },
  { name: "next-intl", version: "v4" },
  { name: "Vitest", version: "4" },
  { name: "Playwright", version: "1" },
];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tFeatures = await getTranslations("features");
  const tStack = await getTranslations("stack");

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        {/* Gradient backdrop via design tokens — no inline hex. */}
        <div
          aria-hidden="true"
          className="from-primary/10 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b via-transparent to-transparent"
        />
        <div
          aria-hidden="true"
          className="bg-accent/20 pointer-events-none absolute top-0 left-1/2 -z-10 h-[32rem] w-[64rem] -translate-x-1/2 rounded-full blur-3xl"
        />

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-32 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {t("eyebrow")}
            </Badge>

            <h1 className="text-foreground text-4xl leading-tight font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
              {t("title")}
            </h1>

            <p className="text-muted-foreground mt-6 max-w-2xl text-lg text-balance md:text-xl">
              {t("subtitle")}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  <Rocket className="mr-2 h-4 w-4" aria-hidden="true" />
                  {t("cta_primary")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={REPO_URL} target="_blank" rel="noreferrer noopener">
                  <GitBranch className="mr-2 h-4 w-4" aria-hidden="true" />
                  {t("cta_secondary")}
                </a>
              </Button>
            </div>

            {/* Quick-start terminal snippet */}
            <div className="mt-12 w-full max-w-xl">
              <p className="text-muted-foreground mb-2 text-left text-xs font-medium tracking-wider uppercase">
                {t("quickStart_label")}
              </p>
              <div className="border-border bg-muted text-foreground flex items-center gap-3 rounded-lg border p-3 font-mono text-sm">
                <span className="text-primary select-none" aria-hidden="true">
                  $
                </span>
                <code className="text-foreground/90">npm install &amp;&amp; npm run dev</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-border border-t py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
              {tFeatures("sectionTitle")}
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">{tFeatures("sectionSubtitle")}</p>
          </div>

          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ key, Icon }) => (
              <li
                key={key}
                className="border-border hover:border-foreground/20 group rounded-xl border p-6 transition-colors"
              >
                <div className="bg-primary/10 text-primary mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-foreground text-lg font-semibold">
                  {tFeatures(`${key}.title`)}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {tFeatures(`${key}.description`)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* STACK */}
      <section className="bg-muted/30 border-border border-t py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
              {tStack("sectionTitle")}
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">{tStack("sectionSubtitle")}</p>
          </div>

          <ul className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {STACK.map((item) => (
              <li key={item.name}>
                <Badge
                  variant="outline"
                  className="bg-background h-auto w-full justify-center gap-1 px-3 py-2 text-xs"
                >
                  <span className="text-foreground font-medium">{item.name}</span>
                  <span className="text-muted-foreground">{item.version}</span>
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
