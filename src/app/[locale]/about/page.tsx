import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import {
  Accessibility,
  ArrowLeft,
  BookOpen,
  Bot,
  ExternalLink,
  FileCode,
  FolderTree,
  GitBranch,
  Globe,
  ListChecks,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";

type SectionKey = "purpose" | "stack" | "conventions" | "agentSurface" | "qa" | "structure";

const SECTIONS: ReadonlyArray<{
  key: SectionKey;
  Icon: typeof Sparkles;
}> = [
  { key: "purpose", Icon: Rocket },
  { key: "stack", Icon: FileCode },
  { key: "conventions", Icon: ShieldCheck },
  { key: "agentSurface", Icon: Bot },
  { key: "qa", Icon: ListChecks },
  { key: "structure", Icon: FolderTree },
];

const HIGHLIGHTS = [
  { Icon: ShieldCheck, key: "auth" as const },
  { Icon: Sparkles, key: "aiNative" as const },
  { Icon: Zap, key: "performance" as const },
  { Icon: Globe, key: "i18n" as const },
  { Icon: Accessibility, key: "a11y" as const },
  { Icon: Terminal, key: "qaLoop" as const },
  { Icon: Palette, key: "theming" as const },
  { Icon: BookOpen, key: "docs" as const },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const tHighlights = await getTranslations("about.highlights");

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      {/* Back link */}
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring mb-8 inline-flex items-center gap-1.5 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("back")}
      </Link>

      {/* Header */}
      <header className="mb-12">
        <Badge variant="secondary" className="mb-4 gap-1.5">
          <BookOpen className="h-3 w-3" aria-hidden="true" />
          {t("eyebrow")}
        </Badge>
        <h1 className="text-foreground text-4xl font-bold tracking-tight text-balance md:text-5xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-3xl text-lg text-balance">{t("subtitle")}</p>
      </header>

      {/* Highlights grid — at-a-glance value props */}
      <section aria-labelledby="highlights-heading" className="mb-16">
        <h2 id="highlights-heading" className="sr-only">
          {t("highlightsHeading")}
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map(({ key, Icon }) => (
            <li
              key={key}
              className="border-border bg-card text-card-foreground rounded-lg border p-4"
            >
              <div className="bg-primary/10 text-primary mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <h3 className="text-foreground text-sm font-semibold">
                {tHighlights(`${key}.title`)}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {tHighlights(`${key}.description`)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Long-form sections */}
      <div className="space-y-12">
        {SECTIONS.map(({ key, Icon }) => (
          <section key={key} aria-labelledby={`section-${key}`}>
            <header className="mb-4 flex items-center gap-3">
              <div className="bg-primary/10 text-primary inline-flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2
                id={`section-${key}`}
                className="text-foreground text-2xl font-bold tracking-tight md:text-3xl"
              >
                {t(`sections.${key}.title`)}
              </h2>
            </header>
            <p className="text-muted-foreground max-w-3xl text-base leading-relaxed">
              {t(`sections.${key}.body`)}
            </p>
          </section>
        ))}
      </div>

      {/* CTAs */}
      <div className="border-border mt-16 flex flex-col gap-3 border-t pt-10 sm:flex-row">
        <Button asChild size="lg">
          <a href={siteConfig.repositoryUrl} target="_blank" rel="noreferrer noopener">
            <GitBranch className="mr-2 h-4 w-4" aria-hidden="true" />
            {t("ctaRepo")}
            <ExternalLink className="ml-2 h-3 w-3 opacity-70" aria-hidden="true" />
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            {t("ctaHome")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
